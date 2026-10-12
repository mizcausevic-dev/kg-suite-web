# Suite security contact correction: selected-file release candidate

## Scope and observed baseline

This candidate changes only `/.well-known/security.txt` on
`https://suite.kineticgain.com`. The Suite repository is the source for this
host; `kinetic-gain-suite-landing` is retired. No site upload, signature, or
rollback has been performed for this candidate.

On 2026-10-12 UTC, an HTTP GET of the live Suite security file returned 200
and SHA-256 `ac73d9bd80032316431a49408f32f618a26431ab9f7eace02dbd7d7fca28f7ba`.
The live Suite `/.well-known/aeo.json` returned 404, while the apex
`https://kineticgain.com/.well-known/aeo.json` returned 200. The old Suite
security file pointed its `Encryption` field to an Ed25519 signing key,
although RFC 9116 defines that field for keys used to encrypt reports.

The candidate file SHA-256 and live baseline are pinned in
[`suite-security-scope-2026-10-12.json`](suite-security-scope-2026-10-12.json).
The checker reads the local candidate and the exact public URL; it rejects
redirects, missing files, unexpected hosts, non-200 responses, and hash drift.
Its `source` phase checks the candidate hash without network access in CI.
Its preflight and postflight phases do not upload or restore anything.

## Release and rollback gate

1. Record the reviewed Git commit and ensure the checkout is clean. Run
   `python scripts/verify_selected_release.py docs/releases/suite-security-scope-2026-10-12.json preflight`
   from the repository root. Abort on any failure.
2. Over the established authenticated SSH channel with its previously verified
   host key pinned, compare the remote file's
   SHA-256 with the manifest's `live_before_sha256`. Save its exact bytes in a
   restricted backup outside the served docroot, and read the backup back to
   confirm the same hash. The destination is
   `/home/u815783393/domains/kineticgain.com/public_html/suite/.well-known/security.txt`.
   Abort if the remote bytes differ from the manifest or the backup cannot be
   restored. Do not include any other files in this transfer.
3. Upload only `.well-known/security.txt` from the reviewed commit through the
   established SSH-key SFTP channel. Verify the remote file's SHA-256 equals
   `candidate_sha256` in the manifest.
4. Run
   `python scripts/verify_selected_release.py docs/releases/suite-security-scope-2026-10-12.json postflight`.
   Abort the release if it fails. Check the public file's Contact, Canonical,
   and apex document URL. Record the actual time, commit, remote/public hashes,
   backup location, and operator; do not backdate the event.
5. To prove rollback, restore the exact saved file to the same destination,
   verify its remote hash, and rerun the `preflight` checker. Record the
   restoration result. If the release must remain live, repeat steps 1-4 after
   the drill from the same reviewed commit. A failed restore blocks release.

This is a file-specific gate. It does not validate the rest of the Suite site,
the separately hosted MCP domain, or the apex signed declaration. The Suite
`/audit-stream/` route and some assets still differ from this repository's
`main`; do not upload the whole checkout or that route from source until its
live bytes are reconciled and reviewed.
