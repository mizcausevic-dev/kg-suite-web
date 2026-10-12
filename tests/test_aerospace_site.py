"""Source-level guards for the draft aerospace landing page."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit
import unittest


ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "verticals" / "aerospace" / "index.html"
INDEX = ROOT / "verticals" / "index.html"


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
        self.links = []
        self.meta = []
        self.ids = []
        self.scripts = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append(tag)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "a":
            self.links.append(attrs)
        if tag == "link":
            self.links.append(attrs)
        if tag == "meta":
            self.meta.append(attrs)
        if tag == "script":
            self.scripts.append(attrs)


def parse(path):
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser


class AerospaceSiteTests(unittest.TestCase):
    def test_draft_page_has_landmarks_and_noindex(self):
        page = parse(PAGE)
        self.assertEqual(1, page.tags.count("h1"))
        self.assertEqual(1, page.tags.count("main"))
        self.assertIn("main", page.ids)
        self.assertTrue(any(link.get("href") == "#main" for link in page.links))
        self.assertTrue(any(meta.get("name") == "robots" and meta.get("content") == "noindex,nofollow" for meta in page.meta))
        self.assertFalse(any(link.get("rel") == "canonical" for link in page.links))

    def test_local_assets_and_routes_exist(self):
        for path in (PAGE, INDEX):
            page = parse(path)
            for ref in page.links + page.scripts:
                target = ref.get("href") or ref.get("src")
                if not target or not target.startswith("/"):
                    continue
                relative = urlsplit(target).path.lstrip("/")
                destination = ROOT / relative
                if destination.is_dir():
                    destination /= "index.html"
                with self.subTest(path=path.name, target=target):
                    if target == "/certified/":
                        # This live route returned 200 on 2026-10-12 but is not in origin/main.
                        continue
                    self.assertTrue(destination.is_file(), f"Missing local target: {target}")

    def test_index_separates_existing_six_packs_from_aerospace(self):
        index = parse(INDEX)
        six_pack_links = [link for link in index.links if "vertical-card" in link.get("class", "").split()]
        self.assertEqual(11, len(six_pack_links))
        self.assertTrue(any(link.get("href") == "/verticals/aerospace/" for link in index.links))
        self.assertEqual(1, index.tags.count("main"))
        self.assertNotIn("All six verticals", INDEX.read_text(encoding="utf-8"))

    def test_draft_repos_linked_without_mcp_release_claim(self):
        content = PAGE.read_text(encoding="utf-8")
        self.assertNotIn("vertical 6-pack", content.lower())
        for published_draft in (
            "aviation-ml-assurance-card-spec",
            "mro-ai-signoff-card-spec",
            "aero-dataset-provenance-rs",
            "aero-assurance-crosswalk",
            "aviation-ml-card-fleet-summary-action",
        ):
            self.assertIn(f'href="https://github.com/mizcausevic-dev/{published_draft}"', content)
        self.assertIn("does not yet include them", content)

    def test_responsive_and_keyboard_styles_are_present(self):
        css = (ROOT / "verticals" / "aerospace" / "aerospace.css").read_text(encoding="utf-8")
        self.assertIn("@media (max-width: 760px)", css)
        self.assertIn("prefers-reduced-motion", css)
        self.assertIn(":focus-visible", css)


if __name__ == "__main__":
    unittest.main()
