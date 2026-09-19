"""Erzeugt den zentralen Rezeptkatalog für die statische Website.

Neue Rezepte werden aus den HTML-Dateien erkannt. Kapitel, Unterkategorie und
Wochenplan-Daten werden aus dem vorhandenen Katalog übernommen und können dort
gezielt ergänzt werden. Zutaten werden direkt aus den Rezeptseiten gelesen,
damit die Suche auch nach Lebensmitteln funktioniert.
"""

from __future__ import annotations

import html
import json
import re
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
SCRIPT = ROOT / "script.js"
OUTPUT = ROOT / "recipes-data.js"
EXCLUDED_PAGES = {"pfefferkuchenwuerfel-mit-nougat.html", "tifteli.html"}


CLASSIC_SECTIONS = {
    "Pasta": ["pasta-mit-rindfleisch-in-sahnesauce.html", "tagliatelle-mit-champignons.html", "meine-pasta.html", "spaghetti-bolognese.html", "rigatoni-al-pollo-funghi.html"],
    "Reisgerichte": ["plov-mit-putenoberkeule.html"],
    "Grill & BBQ": ["brisket-aus-dem-smoker.html", "bratwurst-selbst-gemacht.html", "pulled-pork-aus-dem-smoker.html", "pulled-kassler.html", "3-2-1-ribs.html", "julis-schaschlik-mit-mayo.html", "schaschlik-von-andre.html"],
    "Burger": ["guacamole-cheeseburger-mit-nachos.html", "pulled-pork-burger.html", "pulled-kassler-burger.html"],
    "Pizza": ["neapolitanischer-pizzateig.html", "frische-pizza-mit-haehnchen-und-salat.html", "gyrospizza-vom-blech.html"],
    "Pfannen- & Hackgerichte": ["italienische-steakpfanne.html", "haehnchen-auf-chinesische-art.html", "haehnchen-gemuese-pfanne.html", "couscous-hack-pfanne.html", "frikadellen.html", "tefteli.html", "spaetzle-in-hackbratensosse.html", "pilz-curry-mit-mandeln.html"],
    "Schmorgerichte": ["schaschlik-gulasch.html", "rindergulasch.html", "rinderrouladen.html"],
    "Ofengerichte": ["lauch-creme-kuchen.html", "haehnchenrouladen.html", "lasagne.html", "porree-torte-mit-cabanossi.html", "gefuellte-zucchini.html", "roestiauflauf.html", "hot-dog-cake.html"],
    "Suppen": ["deftige-gulaschsuppe.html", "gyrossuppe.html", "kartoffelsuppe.html", "huehnersuppe.html", "lagman.html", "guiso.html", "eintopf.html", "linsensuppe-mit-kassler.html", "rindfleischsuppe-mit-gurken.html"],
}

SWEET_SECTIONS = {
    "Frühstück & Müsli": ["gesundes-muesli-von-evelyn-w.html"],
    "Kuchen & Torten": ["fantakuchen-mit-pfirsich.html", "donauwelle.html", "schluchttorte.html", "butterkuchen-nach-thomas-p-mama.html", "buttermilchkuchen.html", "streuselkuchen-mit-kirschen.html", "russischer-zupfkuchen-mit-kirschen.html"],
    "Gebäck & süße Teilchen": ["macarons.html", "cookies.html", "pluschki.html", "mandelrollen.html", "zimtschnecken.html", "blaetterteig-kuechlein-mit-vanille-mascarpone-creme.html", "apfel-im-schlafrock.html", "twoiback-nach-mama-reimer.html", "oelbaellchen.html", "lebkuchenwuerfel.html"],
    "Desserts": ["tiramisu.html", "lemon-curd-tiramisu.html", "pick-up-dessert.html", "trauben-mascarpone-becher.html", "creme-brulee.html", "orangencreme.html"],
}

SIDE_SECTIONS = {
    "Salate": [
        "kartoffelsalat.html",
        "rustikaler-schichtsalat-mit-speck.html",
        "coleslaw.html",
        "nudelsalat-nach-melanie-pauls.html",
        "spitzkohlsalat-mit-pistazien.html",
        "tomatensalat-zum-plov.html",
        "brokkoli-salat.html",
        "rote-bete-salat.html",
    ],
    "Gemüse & Eingelegtes": [
        "dillgurken.html",
        "lenas-lieblingsgemuese-aus-dem-ofen.html",
    ],
    "Brot, Buns & Teiggebäck": [
        "kaesebroetchen.html",
        "ueberbackene-brezeln.html",
        "burger-buns.html",
        "rollkuchen.html",
        "walnussbrot.html",
    ],
    "Herzhafte Kleinigkeiten": [
        "bobat.html",
        "pikante-streusel-tarte.html",
    ],
}

EXTRA_SECTIONS = {
    "Saucen & Dips": [
        "rahmsosse.html",
        "remoulade.html",
        "big-mac-sauce.html",
        "currywurst-sauce.html",
        "julis-bbq-sauce.html",
    ],
    "Dressings": [
        "kraeuterdressing.html",
        "cremiges-balsamico-dressing.html",
    ],
    "Marinaden": [
        "julis-marinade-mit-mayo.html",
        "schaschlikmarinade.html",
    ],
    "Würzöle & Butter": [
        "knoblauchoel.html",
        "bruschetta-butter.html",
    ],
}

CHAPTER_SECTIONS = {
    "Unsere Klassiker": CLASSIC_SECTIONS,
    "Was Kleines dazu": SIDE_SECTIONS,
    "Das macht den Unterschied": EXTRA_SECTIONS,
    "Was Süßes geht immer": SWEET_SECTIONS,
}

THEMES = {
    "pizza": ["neapolitanischer-pizzateig.html", "frische-pizza-mit-haehnchen-und-salat.html", "gyrospizza-vom-blech.html"],
    "pasta": ["pasta-mit-rindfleisch-in-sahnesauce.html", "tagliatelle-mit-champignons.html", "meine-pasta.html", "spaghetti-bolognese.html", "rigatoni-al-pollo-funghi.html", "lasagne.html", "spaetzle-in-hackbratensosse.html"],
    "burger": ["guacamole-cheeseburger-mit-nachos.html", "pulled-pork-burger.html", "pulled-kassler-burger.html"],
    "grill": ["brisket-aus-dem-smoker.html", "bratwurst-selbst-gemacht.html", "pulled-pork-aus-dem-smoker.html", "pulled-kassler.html", "3-2-1-ribs.html", "julis-schaschlik-mit-mayo.html", "schaschlik-von-andre.html"],
    "schmor": ["schaschlik-gulasch.html", "rindergulasch.html", "rinderrouladen.html"],
    "suppen": ["deftige-gulaschsuppe.html", "gyrossuppe.html", "kartoffelsuppe.html", "huehnersuppe.html", "lagman.html", "guiso.html", "eintopf.html", "linsensuppe-mit-kassler.html", "rindfleischsuppe-mit-gurken.html"],
    "reisgerichte": ["plov-mit-putenoberkeule.html"],
}

CHAPTER_OVERRIDES = {
    "macarons.html": "Was Süßes geht immer",
    "cookies.html": "Was Süßes geht immer",
    "kaesebroetchen.html": "Was Kleines dazu",
    "brokkoli-salat.html": "Was Kleines dazu",
    "rote-bete-salat.html": "Was Kleines dazu",
    "gesundes-muesli-von-evelyn-w.html": "Was Süßes geht immer",
    "fantakuchen-mit-pfirsich.html": "Was Süßes geht immer",
    "tomatensalat-zum-plov.html": "Was Kleines dazu",
    "walnussbrot.html": "Was Kleines dazu",
}

NEW_RANK_OVERRIDES = {
    "lauch-creme-kuchen.html": -13,
    "macarons.html": -12,
    "cookies.html": -11,
    "kaesebroetchen.html": -10,
    "rote-bete-salat.html": -9,
    "brokkoli-salat.html": -8,
    "gesundes-muesli-von-evelyn-w.html": -7,
    "plov-mit-putenoberkeule.html": -1,
    "tomatensalat-zum-plov.html": -2,
    "walnussbrot.html": -3,
    "deftige-gulaschsuppe.html": -4,
    "fantakuchen-mit-pfirsich.html": -5,
    "haehnchenrouladen.html": -6,
}


class RecipeParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.stack: list[set[str]] = []
        self.in_h1 = False
        self.in_ingredients = 0
        self.title_parts: list[str] = []
        self.ingredient_parts: list[str] = []
        self.image = ""
        self.is_recipe = False

    def handle_starttag(self, tag: str, attrs_list: list[tuple[str, str | None]]) -> None:
        attrs = dict(attrs_list)
        classes = set((attrs.get("class") or "").split())
        self.stack.append(classes)
        if "rezept" in classes:
            self.is_recipe = True
        if tag == "h1":
            self.in_h1 = True
        if "zutaten" in classes or "zutaten-option" in classes:
            self.in_ingredients += 1
        if tag == "meta" and attrs.get("property") == "og:image":
            self.image = attrs.get("content") or self.image
        if tag == "img" and ("rezept-bild" in classes or "rezept-kachelbild" in classes) and not self.image:
            self.image = attrs.get("src") or ""

    def handle_endtag(self, tag: str) -> None:
        classes = self.stack.pop() if self.stack else set()
        if tag == "h1":
            self.in_h1 = False
        if "zutaten" in classes or "zutaten-option" in classes:
            self.in_ingredients = max(0, self.in_ingredients - 1)

    def handle_data(self, data: str) -> None:
        text = " ".join(data.split())
        if not text:
            return
        if self.in_h1:
            self.title_parts.append(text)
        if self.in_ingredients:
            self.ingredient_parts.append(text)


def previous_catalog() -> dict[str, dict]:
    if not OUTPUT.exists():
        return {}
    text = OUTPUT.read_text(encoding="utf-8")
    match = re.search(r"window\.RECIPE_CATALOG\s*=\s*(\[.*\]);", text, re.S)
    return {item["url"]: item for item in json.loads(match.group(1))} if match else {}


def original_entries() -> tuple[list[dict], dict[str, int]]:
    text = SCRIPT.read_text(encoding="utf-8")
    entries: list[dict] = []
    new_urls: dict[str, int] = {}
    for array_name in ("rezepte", "neueRezepte"):
        match = re.search(rf"const {array_name} = \[(.*?)\n\];", text, re.S)
        if not match:
            continue
        for obj in re.findall(r"\{([^{}]+)\}", match.group(1)):
            fields = dict(re.findall(r'(\w+):\s*["\']([^"\']*)["\']', obj))
            if {"name", "url", "kapitel"} <= fields.keys():
                entries.append(fields)
                if array_name == "neueRezepte":
                    new_urls[fields["url"]] = len(new_urls)
    return entries, new_urls


def weekly_details() -> dict[str, dict]:
    text = SCRIPT.read_text(encoding="utf-8")
    match = re.search(r"const wochenRezeptDetails = \{(.*?)\n\};", text, re.S)
    if not match:
        return {}
    result: dict[str, dict] = {}
    pattern = r"'([^']+)'\s*:\s*\{\s*portionen:\s*(\d+),\s*gruppe:\s*'([^']+)',\s*label:\s*'([^']+)'\s*\}"
    for url, portions, group, label in re.findall(pattern, match.group(1)):
        result[url] = {"portions": int(portions), "weekGroup": group, "weekLabel": label}
    return result


def lookup(mapping: dict[str, list[str]], url: str, fallback: str) -> str:
    return next((name for name, urls in mapping.items() if url in urls), fallback)


def ranking(mapping: dict[str, list[str]], url: str) -> tuple[int, int]:
    for section_index, urls in enumerate(mapping.values()):
        if url in urls:
            return section_index, urls.index(url)
    return len(mapping), 999


def main() -> None:
    previous = previous_catalog()
    original, new_urls = original_entries()
    weekly = weekly_details()
    meta = {item["url"]: item for item in original}
    if previous:
        meta.update(previous)

    parsed: dict[str, RecipeParser] = {}
    for path in sorted(ROOT.glob("*.html")):
        parser = RecipeParser()
        parser.feed(path.read_text(encoding="utf-8"))
        if parser.is_recipe:
            parsed[path.name] = parser

    urls = [url for url in dict.fromkeys([item["url"] for item in original] + list(previous) + sorted(parsed)) if url not in EXCLUDED_PAGES]
    catalog: list[dict] = []
    for index, url in enumerate(urls):
        parser = parsed.get(url)
        prior = meta.get(url, {})
        page_title = " ".join(parser.title_parts) if parser else ""
        name = page_title or prior.get("name") or Path(url).stem.replace("-", " ").title()
        chapter = CHAPTER_OVERRIDES.get(url) or prior.get("chapter") or prior.get("kapitel") or "Unsere Klassiker"
        image = prior.get("image") or (parser.image if parser else "")
        if image.startswith("http"):
            image = ""
        if image and not image.startswith("images/"):
            image = f"images/{Path(image).name}"
        section_map = CHAPTER_SECTIONS.get(chapter, {})
        fallback_sections = {
            "Unsere Klassiker": "Weitere Klassiker",
            "Was Kleines dazu": "Weitere Beilagen & Kleinigkeiten",
            "Das macht den Unterschied": "Weitere Extras",
            "Was Süßes geht immer": "Weitere süße Ideen",
        }
        default_section = fallback_sections.get(chapter, "")
        mapped_section = lookup(section_map, url, "")
        section = mapped_section or prior.get("section") or default_section
        section_rank, recipe_rank = ranking(section_map, url) if section_map else (0, index)
        if chapter == "Was Kleines dazu":
            theme = "beilagen"
        elif chapter == "Das macht den Unterschied":
            theme = "sossen"
        elif chapter == "Was Süßes geht immer":
            theme = "suesses"
        elif chapter == "Erfrischende Getränke":
            theme = "getraenke"
        else:
            theme = "klassiker"
        for theme_name, theme_urls in THEMES.items():
            if url in theme_urls:
                theme = theme_name
                break
        ingredients = " ".join(parser.ingredient_parts) if parser else prior.get("searchText", "")
        clean_search = html.unescape(re.sub(r"\s+", " ", ingredients)).strip()
        item = {
            "name": name,
            "url": url,
            "chapter": chapter,
            "section": section,
            "sectionRank": section_rank,
            "recipeRank": recipe_rank,
            "theme": theme,
            "image": image,
            "searchText": clean_search,
            "newRank": NEW_RANK_OVERRIDES.get(url, new_urls[url] if url in new_urls else prior.get("newRank", 1000 + index)),
        }
        for key in ("portions", "weekGroup", "weekLabel"):
            if key in prior:
                item[key] = prior[key]
        item.update(weekly.get(url, {}))
        catalog.append(item)

    OUTPUT.write_text(
        "/* Automatisch erzeugt mit tools/build_recipe_data.py */\n"
        "window.RECIPE_CATALOG = " + json.dumps(catalog, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(f"{len(catalog)} Rezepte in {OUTPUT.name} geschrieben")


if __name__ == "__main__":
    main()
