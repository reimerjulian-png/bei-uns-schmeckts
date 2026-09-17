"""Erzeugt schlanke WebP-Dateien und stellt die Website auf diese um."""

from pathlib import Path
import re
from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent.parent
IMAGES = ROOT / "images"
SKIP = {"apple-touch-icon.png"}


def main() -> None:
    conversions: dict[str, str] = {}
    original_bytes = 0
    webp_bytes = 0

    for source in sorted(IMAGES.iterdir()):
        if not source.is_file() or source.name.lower() in SKIP or source.suffix.lower() not in {".png", ".jpg", ".jpeg"}:
            continue
        target = source.with_suffix(".webp")
        original_bytes += source.stat().st_size
        with Image.open(source) as opened:
            image = ImageOps.exif_transpose(opened)
            image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
            if image.mode not in {"RGB", "RGBA"}:
                image = image.convert("RGBA" if "transparency" in image.info else "RGB")
            image.save(target, "WEBP", quality=82, method=6)
        webp_bytes += target.stat().st_size
        conversions[source.name] = target.name

    for path in [*ROOT.glob("*.html"), ROOT / "style.css", ROOT / "script.js", ROOT / "recipes-data.js"]:
        text = path.read_text(encoding="utf-8")
        for old_name, new_name in conversions.items():
            text = re.sub(rf"(?i)(images/){re.escape(old_name)}", lambda match: match.group(1) + new_name, text)
        path.write_text(text, encoding="utf-8")

    saved = original_bytes - webp_bytes
    print(f"{len(conversions)} Bilder konvertiert")
    print(f"Ausgelieferte Bilddaten: {original_bytes / 1024 / 1024:.1f} MB -> {webp_bytes / 1024 / 1024:.1f} MB")
    print(f"Ersparnis: {saved / 1024 / 1024:.1f} MB ({saved / original_bytes * 100:.0f} %)")


if __name__ == "__main__":
    main()
