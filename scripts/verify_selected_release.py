"""Check exact live bytes for a selected Suite file release; never uploads files."""

import argparse
import hashlib
import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parent.parent
MAX_BYTES = 2_000_000
SHA256 = re.compile(r"^[0-9a-f]{64}$")


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, request, fp, code, msg, headers, newurl):
        return None


def verify_file(entry, phase, opener):
    if not isinstance(entry, dict):
        raise ValueError("each manifest file must be an object")
    source_name = entry.get("source")
    url = entry.get("url")
    before = entry.get("live_before_sha256")
    candidate = entry.get("candidate_sha256")
    if not isinstance(source_name, str) or not source_name:
        raise ValueError("missing source path")
    if not isinstance(url, str):
        raise ValueError("missing public URL")
    parts = urlsplit(url)
    if (
        parts.scheme != "https"
        or parts.netloc != "suite.kineticgain.com"
        or not parts.path.startswith("/")
        or parts.query
        or parts.fragment
    ):
        raise ValueError(f"unexpected Suite URL: {url}")
    if not isinstance(before, str) or not SHA256.fullmatch(before):
        raise ValueError("invalid live_before_sha256")
    if not isinstance(candidate, str) or not SHA256.fullmatch(candidate):
        raise ValueError("invalid candidate_sha256")

    source = (ROOT / source_name).resolve()
    if not source.is_relative_to(ROOT) or not source.is_file():
        raise ValueError(f"source is absent or outside this repo: {source_name}")
    local_bytes = source.read_bytes()
    if len(local_bytes) > MAX_BYTES:
        raise ValueError(f"source exceeds {MAX_BYTES} bytes: {source_name}")
    local_hash = hashlib.sha256(local_bytes).hexdigest()
    if local_hash != candidate:
        raise ValueError(f"candidate hash mismatch for {source_name}: {local_hash}")

    request = urllib.request.Request(
        url,
        headers={
            "Accept-Encoding": "identity",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "User-Agent": "kg-suite-selected-release-check/1.0",
        },
    )
    with opener.open(request, timeout=20) as response:
        if response.status != 200:
            raise ValueError(f"unexpected HTTP {response.status} for {url}")
        if response.headers.get("Content-Encoding", "identity") != "identity":
            raise ValueError(f"encoded response for {url}; cannot compare exact bytes")
        live_bytes = response.read(MAX_BYTES + 1)
    if len(live_bytes) > MAX_BYTES:
        raise ValueError(f"live response exceeds {MAX_BYTES} bytes: {url}")
    live_hash = hashlib.sha256(live_bytes).hexdigest()
    expected = before if phase == "preflight" else candidate
    if live_hash != expected:
        raise ValueError(
            f"{phase} live hash mismatch for {url}: got {live_hash}, expected {expected}"
        )
    print(f"PASS {phase} {url} live={live_hash} source={local_hash}")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest", type=Path)
    parser.add_argument("phase", choices=("preflight", "postflight"))
    args = parser.parse_args()
    try:
        manifest = json.loads(args.manifest.read_text(encoding="utf-8"))
        files = manifest.get("files") if isinstance(manifest, dict) else None
        if not isinstance(files, list) or not files:
            raise ValueError("manifest needs a nonempty files list")
        opener = urllib.request.build_opener(NoRedirect)
        for entry in files:
            verify_file(entry, args.phase, opener)
    except (OSError, ValueError, KeyError, json.JSONDecodeError, urllib.error.URLError) as exc:
        print(f"FAIL {args.phase}: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
