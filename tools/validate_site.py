"""Kleine Konsistenzprüfung für die statische Website."""

from __future__ import annotations

import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote


ROOT = Path(__file__).resolve().parent.parent


class ReferenceParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.references: list[str] = []

    def handle_starttag(self, _tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for name, value in attrs:
            if name in {"href", "src"} and value:
                self.references.append(value)


def main() -> None:
    missing: list[tuple[str, str]] = []
    bad_script_order: list[str] = []
    all_text: list[str] = []
    html_files = list(ROOT.glob("*.html"))

    for path in html_files:
        text = path.read_text(encoding="utf-8")
        all_text.append(text)
        data_position = text.find("recipes-data.js")
        script_position = text.find("script.js")
        if script_position >= 0 and (data_position < 0 or data_position > script_position):
            bad_script_order.append(path.name)
        parser = ReferenceParser()
        parser.feed(text)
        for reference in parser.references:
            clean = unquote(reference.split("#", 1)[0].split("?", 1)[0])
            if not clean or clean.startswith(("http:", "https:", "mailto:", "tel:")):
                continue
            if not (ROOT / clean).exists():
                missing.append((path.name, reference))

    for path in (ROOT / "style.css", ROOT / "script.js", ROOT / "recipes-data.js"):
        all_text.append(path.read_text(encoding="utf-8"))
    joined = "\n".join(all_text)
    referenced = {Path(name).name.lower() for name in re.findall(r"images/([^\"')? >]+\.webp)", joined, re.I)}
    webp_files = {path.name.lower(): path for path in (ROOT / "images").glob("*.webp")}

    catalog_match = re.search(r"window\.RECIPE_CATALOG\s*=\s*(\[.*\]);", (ROOT / "recipes-data.js").read_text(encoding="utf-8"), re.S)
    catalog = json.loads(catalog_match.group(1)) if catalog_match else []

    print(f"HTML-Dateien: {len(html_files)}")
    print(f"Rezepte im Katalog: {len(catalog)}")
    print(f"Fehlende lokale Verweise: {missing}")
    print(f"Falsche Skriptreihenfolge: {bad_script_order}")
    print(f"WebP-Dateien: {len(webp_files)}, referenziert: {len(referenced)}")
    print("Nicht referenzierte WebP-Dateien: " + json.dumps(sorted(set(webp_files) - referenced), ensure_ascii=True))
    print(f"Referenzierte WebP-Größe: {sum(path.stat().st_size for name, path in webp_files.items() if name in referenced) / 1024 / 1024:.1f} MB")
    if missing or bad_script_order:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
