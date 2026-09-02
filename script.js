const topbar = document.querySelector(".topbar");

const menuButton = document.getElementById("menuButton");
const menuSchliessenButton = document.getElementById("menuSchliessen");
const seitenmenue = document.getElementById("seitenmenue");
const menuOverlay = document.getElementById("menuOverlay");

const sucheButton = document.getElementById("sucheButton");
const suchePanel = document.getElementById("suchePanel");
const sucheInput = document.getElementById("sucheInput");
const sucheErgebnisse = document.getElementById("sucheErgebnisse");

/* „Unsere Woche“ in allen vorhandenen Hauptmenüs ergänzen */
const wochenplanVorhanden = document.querySelector('.menu-unsere-woche');
const wochenplanAnker = document.querySelector('.menu-bereichstitel-kuechenhelfer');

if (!wochenplanVorhanden && wochenplanAnker) {
    const bereich = document.createElement('div');
    bereich.className = 'menu-wochenplan-block';
    bereich.innerHTML = `
        <p class="menu-bereichstitel">Wochenplanung</p>
        <a href="unsere-woche.html" class="menu-unsere-woche">
            <span class="menu-unsere-woche-symbol" aria-hidden="true">7</span>
            <span><strong>Unsere Woche</strong><small>Ausgewogen &amp; passend zur Menge</small></span>
        </a>`;
    wochenplanAnker.before(bereich);
}

/* Der sichtbare Menübegriff soll direkt zur Rezeptsuche führen. */
document.querySelectorAll('.menu-kapitel').forEach((liste) => {
    const titel = liste.previousElementSibling;
    if (titel?.classList.contains('menu-bereichstitel')) {
        titel.textContent = 'Rezept-Kategorien';
    }
});

const rezepte = [
    { name: "Gyros Suppe", url: "gyrossuppe.html", kapitel: "Unsere Klassiker" },
    { name: "Rindergulasch", url: "rindergulasch.html", kapitel: "Unsere Klassiker" },
    { name: "Italienische Steakpfanne", url: "italienische-steakpfanne.html", kapitel: "Unsere Klassiker" },
    { name: "Tefteli", url: "tefteli.html", kapitel: "Unsere Klassiker" },
    { name: "Rinderrouladen", url: "rinderrouladen.html", kapitel: "Unsere Klassiker" },
    { name: "Dillgurken", url: "dillgurken.html", kapitel: "Was Kleines dazu" },
    { name: "Überbackene Brezeln", url: "ueberbackene-brezeln.html", kapitel: "Was Kleines dazu" },
    { name: "Kartoffelsalat", url: "kartoffelsalat.html", kapitel: "Was Kleines dazu" },
    { name: "Rahmsoße", url: "rahmsosse.html", kapitel: "Das macht den Unterschied" },
    { name: "Remoulade", url: "remoulade.html", kapitel: "Das macht den Unterschied" },
    { name: "Big Mac Sauce", url: "big-mac-sauce.html", kapitel: "Das macht den Unterschied" },
    { name: "Kräuterdressing", url: "kraeuterdressing.html", kapitel: "Das macht den Unterschied" },
    { name: "Pluschki", url: "pluschki.html", kapitel: "Was Süßes aus dem Ofen" },
    { name: "Donauwelle", url: "donauwelle.html", kapitel: "Was Süßes aus dem Ofen" },
    { name: "Schluchttorte", url: "schluchttorte.html", kapitel: "Was Süßes aus dem Ofen" },
    { name: "Tiramisu", url: "tiramisu.html", kapitel: "Ein bisschen Platz ist noch" },
    { name: "Lemon Curd Tiramisu", url: "lemon-curd-tiramisu.html", kapitel: "Ein bisschen Platz ist noch" },
    { name: "Pick Up Dessert", url: "pick-up-dessert.html", kapitel: "Ein bisschen Platz ist noch" },
    { name: "Trauben Mascarpone Becher", url: "trauben-mascarpone-becher.html", kapitel: "Ein bisschen Platz ist noch" },
    { name: "Crème brûlée", url: "creme-brulee.html", kapitel: "Ein bisschen Platz ist noch" },
    { name: "Orangencreme", url: "orangencreme.html", kapitel: "Ein bisschen Platz ist noch" },
    { name: "Lebkuchenwürfel", url: "lebkuchenwuerfel.html", kapitel: "Ein bisschen Platz ist noch" },
    { name: "Currywurst Sauce", url: "currywurst-sauce.html", kapitel: "Das macht den Unterschied" },
    { name: "Rustikaler Schichtsalat mit Speck", url: "rustikaler-schichtsalat-mit-speck.html", kapitel: "Was Kleines dazu" },
    { name: "Lasagne", url: "lasagne.html", kapitel: "Unsere Klassiker" },
    { name: "Mandelrollen", url: "mandelrollen.html", kapitel: "Was Süßes aus dem Ofen" },
    { name: "Porree-Torte mit Cabanossi", url: "porree-torte-mit-cabanossi.html", kapitel: "Unsere Klassiker" },
    { name: "Buttermilchkuchen", url: "buttermilchkuchen.html", kapitel: "Was Süßes aus dem Ofen" },
    { name: "Hähnchen auf chinesische Art", url: "haehnchen-auf-chinesische-art.html", kapitel: "Unsere Klassiker" },
    { name: "Linsensuppe mit Kassler", url: "linsensuppe-mit-kassler.html", kapitel: "Unsere Klassiker" },
    { name: "Eintopf", url: "eintopf.html", kapitel: "Unsere Klassiker" },
    { name: "Rindfleischsuppe mit Gurken", url: "rindfleischsuppe-mit-gurken.html", kapitel: "Unsere Klassiker" },
    { name: "Couscous-Hack-Pfanne", url: "couscous-hack-pfanne.html", kapitel: "Unsere Klassiker" },
    { name: "Bobat", url: "bobat.html", kapitel: "Was Kleines dazu" },
    { name: "Rollkuchen", url: "rollkuchen.html", kapitel: "Was Kleines dazu" },
];

const neueRezepte = [
    { name: "Apfel im Schlafrock", url: "apfel-im-schlafrock.html", kapitel: "Was Süßes aus dem Ofen" },
    { name: "Butterkuchen nach Thomas P. Mama", url: "butterkuchen-nach-thomas-p-mama.html", kapitel: "Was Süßes aus dem Ofen" },
    { name: "Coleslaw", url: "coleslaw.html", kapitel: "Was Kleines dazu" },
    { name: "Frikadellen", url: "frikadellen.html", kapitel: "Unsere Klassiker" },
    { name: "Gefüllte Zucchini", url: "gefuellte-zucchini.html", kapitel: "Unsere Klassiker" },
    { name: "Guiso", url: "guiso.html", kapitel: "Unsere Klassiker" },
    { name: "Gyrospizza vom Blech", url: "gyrospizza-vom-blech.html", kapitel: "Unsere Klassiker" },
    { name: "Hähnchen-Gemüse-Pfanne", url: "haehnchen-gemuese-pfanne.html", kapitel: "Unsere Klassiker" },
    { name: "Hot-Dog-Cake", url: "hot-dog-cake.html", kapitel: "Unsere Klassiker" },
    { name: "Lenas Lieblingsgemüse aus dem Ofen", url: "lenas-lieblingsgemuese-aus-dem-ofen.html", kapitel: "Was Kleines dazu" },
    { name: "Nudelsalat nach Melanie Pauls", url: "nudelsalat-nach-melanie-pauls.html", kapitel: "Was Kleines dazu" },
    { name: "Pikante Streusel-Tarte", url: "pikante-streusel-tarte.html", kapitel: "Was Kleines dazu" },
    { name: "Pilz-Curry mit Mandeln", url: "pilz-curry-mit-mandeln.html", kapitel: "Unsere Klassiker" },
    { name: "Röstiauflauf", url: "roestiauflauf.html", kapitel: "Unsere Klassiker" },
    { name: "Schaschlik-Gulasch", url: "schaschlik-gulasch.html", kapitel: "Unsere Klassiker" },
    { name: "Spätzle in Hackfleisch-Bratensoße", url: "spaetzle-in-hackbratensosse.html", kapitel: "Unsere Klassiker" },
    { name: "Spitzkohlsalat mit Pistazien", url: "spitzkohlsalat-mit-pistazien.html", kapitel: "Was Kleines dazu" },
    { name: "Twoiback nach Mama Reimer", url: "twoiback-nach-mama-reimer.html", kapitel: "Was Süßes aus dem Ofen" },
];

rezepte.push(...neueRezepte);

/* Neue Eingangsrezepte automatisch in Menü und Kategorieseiten einsortieren. */
document.querySelectorAll('.menu-rezepte').forEach((menu) => {
    neueRezepte.forEach((rezept) => {
        if (menu.querySelector(`a[href="${rezept.url}"]`)) return;
        const untertitel = [...menu.querySelectorAll('.menu-untertitel')]
            .find((element) => element.textContent.trim() === rezept.kapitel);
        if (!untertitel) return;
        let einfuegePunkt = untertitel.nextElementSibling;
        while (einfuegePunkt && !einfuegePunkt.classList.contains('menu-untertitel')) {
            einfuegePunkt = einfuegePunkt.nextElementSibling;
        }
        const link = document.createElement('a');
        link.href = rezept.url;
        link.className = 'menu-rezept-link';
        link.textContent = rezept.name;
        menu.insertBefore(link, einfuegePunkt);
    });
});

const kategorienSeiten = {
    'klassiker.html': 'Unsere Klassiker',
    'was-kleines-dazu.html': 'Was Kleines dazu',
    'was-suesses-aus-dem-ofen.html': 'Was Süßes aus dem Ofen'
};
const aktuelleKategorie = kategorienSeiten[window.location.pathname.split('/').pop()];
const kategorienListe = document.querySelector('main .rezeptliste');
if (aktuelleKategorie && kategorienListe) {
    neueRezepte.filter((rezept) => rezept.kapitel === aktuelleKategorie).forEach((rezept) => {
        if (kategorienListe.querySelector(`a[href="${rezept.url}"]`)) return;
        const nummer = String(kategorienListe.querySelectorAll('.rezept-eintrag').length + 1).padStart(2, '0');
        const link = document.createElement('a');
        link.className = 'rezept-eintrag';
        link.href = rezept.url;
        link.innerHTML = `<span class="rezept-nummer">${nummer}</span><span class="rezept-name"></span>`;
        link.querySelector('.rezept-name').textContent = rezept.name;
        kategorienListe.append(link);
    });

    const abweichendeBildnamen = {
        'kartoffelsalat.html': 'kartoffelsalat-mf.PNG',
        'porree-torte-mit-cabanossi.html': 'porree-torte.png',
        'haehnchen-auf-chinesische-art.html': 'hähnchen-chinaart.png',
        'linsensuppe-mit-kassler.html': 'linsensuppe.png',
        'rindfleischsuppe-mit-gurken.html': 'rindfleischsuppe.png',
        'rustikaler-schichtsalat-mit-speck.html': 'schichtsalat-gifhorn.png',
        'pfefferkuchenwuerfel-mit-nougat.html': 'pfefferkuchen.png'
    };

    Object.assign(abweichendeBildnamen, {
        'bobat.html': 'bobat.jpg',
        'couscous-hack-pfanne.html': 'couscous-hack-pfanne.jpg',
        'rollkuchen.html': 'rollkuchen.jpg'
    });

    kategorienListe.classList.add('rezeptkacheln');
    kategorienListe.querySelectorAll('a.rezept-eintrag[href]').forEach((link) => {
        const datei = link.getAttribute('href').split('/').pop();
        const istNeuesRezept = neueRezepte.some((rezept) => rezept.url === datei);
        const bildname = abweichendeBildnamen[datei] || datei.replace(/\.html$/, istNeuesRezept ? '.jpg' : '.png');
        const bild = document.createElement('img');
        bild.className = 'rezept-kachelbild';
        bild.src = `images/${bildname}`;
        bild.alt = '';
        bild.loading = 'lazy';
        bild.addEventListener('error', () => link.classList.add('rezeptkachel-ohne-bild'));
        link.prepend(bild);
    });
}

function menueOeffnen() {
    if (!seitenmenue || !menuOverlay) return;
    seitenmenue.classList.add("aktiv");
    menuOverlay.classList.add("aktiv");
    seitenmenue.setAttribute("aria-hidden", "false");
    menuButton?.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-offen");
    topbar?.classList.remove("versteckt");
}

function menueSchliessen() {
    if (!seitenmenue || !menuOverlay) return;
    seitenmenue.classList.remove("aktiv");
    menuOverlay.classList.remove("aktiv");
    seitenmenue.setAttribute("aria-hidden", "true");
    menuButton?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-offen");
}

menuButton?.addEventListener("click", menueOeffnen);
menuSchliessenButton?.addEventListener("click", menueSchliessen);
menuOverlay?.addEventListener("click", menueSchliessen);

sucheButton?.addEventListener("click", () => {
    if (!suchePanel) return;
    const wirdAktiv = !suchePanel.classList.contains("aktiv");
    suchePanel.classList.toggle("aktiv");
    sucheButton.setAttribute("aria-expanded", String(wirdAktiv));

    if (wirdAktiv) {
        menueSchliessen();
        topbar?.classList.remove("versteckt");
        setTimeout(() => sucheInput?.focus(), 50);
    }
});

function sucheAnzeigen(suchtext) {
    if (!sucheErgebnisse) return;

    const text = suchtext.trim().toLocaleLowerCase("de");

    if (text.length === 0) {
        sucheErgebnisse.innerHTML = "";
        return;
    }

    const treffer = rezepte.filter((rezept) =>
        rezept.name.toLocaleLowerCase("de").includes(text) ||
        rezept.kapitel.toLocaleLowerCase("de").includes(text)
    );

    if (treffer.length === 0) {
        sucheErgebnisse.innerHTML =
            '<p class="suche-kein-treffer">Kein Rezept gefunden.</p>';
        return;
    }

    sucheErgebnisse.innerHTML = treffer.map((rezept) => `
        <a class="suche-ergebnis" href="${rezept.url}">
            <span>${rezept.name}</span>
            <small>${rezept.kapitel}</small>
        </a>
    `).join("");
}

sucheInput?.addEventListener("input", (event) => {
    sucheAnzeigen(event.target.value);
});

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    menueSchliessen();
    suchePanel?.classList.remove("aktiv");
    sucheButton?.setAttribute("aria-expanded", "false");
});

if (topbar) {
    let letzteScrollPosition = window.scrollY;

    window.addEventListener("scroll", () => {
        const aktuelleScrollPosition = window.scrollY;
        const menueIstOffen = seitenmenue?.classList.contains("aktiv");
        const sucheIstOffen = suchePanel?.classList.contains("aktiv");

        if (menueIstOffen || sucheIstOffen) {
            topbar.classList.remove("versteckt");
            letzteScrollPosition = aktuelleScrollPosition;
            return;
        }

        if (
            aktuelleScrollPosition > letzteScrollPosition &&
            aktuelleScrollPosition > 80
        ) {
            topbar.classList.add("versteckt");
        } else if (aktuelleScrollPosition < letzteScrollPosition) {
            topbar.classList.remove("versteckt");
        }

        letzteScrollPosition = aktuelleScrollPosition;
    }, { passive: true });
}

/* =========================================================
   ZUFALLSGERICHT – AUTOMATISCH AUS „UNSERE KLASSIKER“
   ========================================================= */

const zufallButton = document.getElementById("zufallButton");
const zufallNochmal = document.getElementById("zufallNochmal");
const zufallErgebnis = document.getElementById("zufallErgebnis");
const zufallName = document.getElementById("zufallName");
const zufallLink = document.getElementById("zufallLink");

let hauptgerichte = [];
let letzterZufallsIndex = -1;


/* Rezepte automatisch aus klassiker.html laden */

async function hauptgerichteLaden() {

    try {

        const antwort = await fetch("klassiker.html");

        if (!antwort.ok) {
            throw new Error("klassiker.html konnte nicht geladen werden.");
        }

        const html = await antwort.text();

        const parser = new DOMParser();
        const dokument = parser.parseFromString(html, "text/html");

        const rezeptLinks = dokument.querySelectorAll(
            ".rezeptliste a.rezept-eintrag[href]"
        );

        hauptgerichte = Array.from(rezeptLinks).map((link) => {

            const nameElement = link.querySelector(".rezept-name");

            return {
                name: nameElement
                    ? nameElement.textContent.trim()
                    : link.textContent.trim(),

                url: link.getAttribute("href")
            };

        });

    } catch (fehler) {

        console.error(
            "Hauptgerichte konnten nicht geladen werden:",
            fehler
        );

    }

}


/* Zufälliges Gericht anzeigen */

async function zufallsgerichtAnzeigen() {

    if (
        !zufallButton ||
        !zufallErgebnis ||
        !zufallName ||
        !zufallLink
    ) {
        return;
    }


    /* Falls noch nicht geladen */

    if (hauptgerichte.length === 0) {
        await hauptgerichteLaden();
    }


    if (hauptgerichte.length === 0) {

        zufallName.textContent =
            "Noch kein Gericht verfügbar";

        zufallLink.removeAttribute("href");

        zufallErgebnis.classList.add("aktiv");

        return;
    }


    let index = 0;


    /* Nicht zweimal direkt dasselbe Gericht */

    if (hauptgerichte.length > 1) {

        do {

            index = Math.floor(
                Math.random() * hauptgerichte.length
            );

        } while (
            index === letzterZufallsIndex
        );

    }


    letzterZufallsIndex = index;

    const gericht = hauptgerichte[index];


    zufallName.textContent = gericht.name;

    zufallLink.href = gericht.url;

    zufallErgebnis.classList.add("aktiv");

}


/* Bereits beim Laden der Seite vorbereiten */

hauptgerichteLaden();


zufallButton?.addEventListener(
    "click",
    zufallsgerichtAnzeigen
);


zufallNochmal?.addEventListener(
    "click",
    zufallsgerichtAnzeigen
);

/* =========================================================
   HOCHZEITSMENÜ – KONTEXTBEZOGENE ZURÜCK-NAVIGATION
   ========================================================= */

/*
   Wenn ein Rezept über die Hochzeitsseite geöffnet wird,
   merkt sich die URL diesen Einstieg mit ?from=hochzeit.
   Auf der Rezeptseite führt "Zurück" dann wieder zum
   Hochzeitsmenü. In allen anderen Fällen bleibt die normale
   feste Hierarchie Rezept -> Kapitel -> Startseite erhalten.
*/

document.addEventListener("DOMContentLoaded", () => {

    /* Alle Rezeptlinks auf der Hochzeitsseite automatisch markieren */
    if (document.querySelector(".hochzeit-menue")) {

        const hochzeitRezeptLinks =
            document.querySelectorAll(
                '.hochzeit-menue a[href$=".html"]'
            );

        hochzeitRezeptLinks.forEach((link) => {

            const url = new URL(
                link.getAttribute("href"),
                window.location.href
            );

            url.searchParams.set(
                "from",
                "hochzeit"
            );

            link.href =
                url.pathname.split("/").pop() +
                url.search;
        });
    }


    /* Auf Rezeptseiten den Zurück-Link nur bei Hochzeits-Einstieg ändern */
    const parameter =
        new URLSearchParams(
            window.location.search
        );

    if (
        parameter.get("from") === "hochzeit"
    ) {

        const zurueckLink =
            document.querySelector(
                "a.zurueck"
            );

        if (zurueckLink) {

            zurueckLink.href =
                "hochzeitsmenue.html";

            zurueckLink.textContent =
                "← Unser Hochzeitsmenü";
        }
    }

});

/* =========================================================
   UNSERE WOCHE – AUSGEWOGENER WOCHENPLAN
   ========================================================= */

const wochenRezepte = [
    { name: 'Gyros Suppe', url: 'gyrossuppe.html', portionen: 6, gruppe: 'suppe', label: 'Suppe & Gemüse' },
    { name: 'Rindergulasch', url: 'rindergulasch.html', portionen: 6, gruppe: 'eintopf', label: 'Schmorgericht' },
    { name: 'Italienische Steakpfanne', url: 'italienische-steakpfanne.html', portionen: 2, gruppe: 'reis', label: 'Reis & Gemüse' },
    { name: 'Tefteli', url: 'tefteli.html', portionen: 6, gruppe: 'kartoffel', label: 'Kartoffeln & Fleisch' },
    { name: 'Rinderrouladen', url: 'rinderrouladen.html', portionen: 2, gruppe: 'kartoffel', label: 'Kartoffeln & Fleisch' },
    { name: 'Lasagne', url: 'lasagne.html', portionen: 6, gruppe: 'nudel', label: 'Nudeln & Gemüse' },
    { name: 'Hähnchen auf chinesische Art', url: 'haehnchen-auf-chinesische-art.html', portionen: 4, gruppe: 'reis', label: 'Reis & Gemüse' },
    { name: 'Rindfleischsuppe mit Gurken', url: 'rindfleischsuppe-mit-gurken.html', portionen: 8, gruppe: 'suppe', label: 'Suppe & Gemüse' },
    { name: 'Couscous-Hack-Pfanne', url: 'couscous-hack-pfanne.html', portionen: 4, gruppe: 'couscous', label: 'Couscous & Gemüse' },
    { name: 'Frikadellen', url: 'frikadellen.html', portionen: 10, gruppe: 'kartoffel', label: 'Fleischgericht' },
    { name: 'Gefüllte Zucchini', url: 'gefuellte-zucchini.html', portionen: 4, gruppe: 'gemuese', label: 'Gemüse & Fleisch' },
    { name: 'Guiso', url: 'guiso.html', portionen: 4, gruppe: 'nudel', label: 'Nudeln & Fleisch' },
    { name: 'Gyrospizza vom Blech', url: 'gyrospizza-vom-blech.html', portionen: 6, gruppe: 'teig', label: 'Ofengericht' },
    { name: 'Hähnchen-Gemüse-Pfanne', url: 'haehnchen-gemuese-pfanne.html', portionen: 4, gruppe: 'nudel', label: 'Gemüse & Spätzle' },
    { name: 'Pilz-Curry mit Mandeln', url: 'pilz-curry-mit-mandeln.html', portionen: 4, gruppe: 'reis', label: 'Pilze & Reis' },
    { name: 'Röstiauflauf', url: 'roestiauflauf.html', portionen: 4, gruppe: 'kartoffel', label: 'Kartoffelauflauf' },
    { name: 'Schaschlik-Gulasch', url: 'schaschlik-gulasch.html', portionen: 4, gruppe: 'reis', label: 'Fleisch & Gemüse' },
    { name: 'Spätzle in Hackfleisch-Bratensoße', url: 'spaetzle-in-hackbratensosse.html', portionen: 4, gruppe: 'nudel', label: 'Spätzle & Gemüse' },
];

const wochenTage = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
const wochenErwachsene = document.getElementById('wochenErwachsene');
const wochenKinder = document.getElementById('wochenKinder');
const wochenplanButton = document.getElementById('wochenplanErstellen');
const wochenplanListe = document.getElementById('wochenplanListe');
const wochenplanZusammenfassung = document.getElementById('wochenplanZusammenfassung');

function mischen(liste) {
    const kopie = [...liste];
    for (let i = kopie.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
    }
    return kopie;
}

function haushaltsPortionen() {
    const erwachsene = Math.max(0, Number.parseInt(wochenErwachsene?.value || '0', 10));
    const kinder = Math.max(0, Number.parseInt(wochenKinder?.value || '0', 10));
    return { erwachsene, kinder, proTag: Math.max(0.6, erwachsene + kinder * 0.6) };
}

function naechstesAusgewogenesRezept(verfuegbar, letzteGruppe) {
    const andereGruppe = verfuegbar.find((rezept) => rezept.gruppe !== letzteGruppe);
    return andereGruppe || verfuegbar[0];
}

function wochenplanAuslosen() {
    if (!wochenplanListe || !wochenplanZusammenfassung) return;

    const haushalt = haushaltsPortionen();
    const anzahlMenschen = haushalt.erwachsene + haushalt.kinder;

    if (anzahlMenschen < 1) {
        wochenplanListe.innerHTML = '<p class="wochenplan-fehler">Bitte mindestens eine erwachsene Person oder ein Kind eintragen.</p>';
        wochenplanZusammenfassung.textContent = '';
        return;
    }

    let verfuegbar = mischen(wochenRezepte);
    let tag = 0;
    let letzteGruppe = '';
    let neueGerichte = 0;
    const karten = [];

    while (tag < wochenTage.length) {
        if (verfuegbar.length === 0) verfuegbar = mischen(wochenRezepte);
        const rezept = naechstesAusgewogenesRezept(verfuegbar, letzteGruppe);
        verfuegbar = verfuegbar.filter((eintrag) => eintrag !== rezept);

        const moeglicheTage = Math.max(1, Math.floor(rezept.portionen / haushalt.proTag));
        const reichtTage = Math.min(moeglicheTage, wochenTage.length - tag);
        const ende = tag + reichtTage - 1;
        neueGerichte += 1;

        karten.push(`
            <article class="wochenplan-gericht">
                <div class="wochenplan-tag"><span>${String(tag + 1).padStart(2, '0')}</span><strong>${wochenTage[tag]}</strong></div>
                <div class="wochenplan-gericht-inhalt">
                    <p class="wochenplan-kategorie">${rezept.label}</p>
                    <h3>${rezept.name}</h3>
                    <p>${rezept.portionen} Rezeptportionen · reicht für ${reichtTage} ${reichtTage === 1 ? 'Tag' : 'Tage'}</p>
                    <a href="${rezept.url}">Rezept öffnen →</a>
                </div>
            </article>`);

        for (let restetag = tag + 1; restetag <= ende; restetag += 1) {
            karten.push(`
                <div class="wochenplan-restetag">
                    <div class="wochenplan-tag"><span>${String(restetag + 1).padStart(2, '0')}</span><strong>${wochenTage[restetag]}</strong></div>
                    <p><span>Kein neues Gericht</span>${rezept.name} reicht noch.</p>
                </div>`);
        }

        letzteGruppe = rezept.gruppe;
        tag += reichtTage;
    }

    wochenplanListe.innerHTML = karten.join('');
    const personenText = `${haushalt.erwachsene} ${haushalt.erwachsene === 1 ? 'Erwachsener' : 'Erwachsene'}${haushalt.kinder ? ` · ${haushalt.kinder} ${haushalt.kinder === 1 ? 'Kind' : 'Kinder'}` : ''}`;
    wochenplanZusammenfassung.textContent = `${personenText} · ${neueGerichte} neue ${neueGerichte === 1 ? 'Mahlzeit' : 'Mahlzeiten'}`;
    localStorage.setItem('beiUnsSchmecktsHaushalt', JSON.stringify({ erwachsene: haushalt.erwachsene, kinder: haushalt.kinder }));
}

if (wochenplanListe) {
    try {
        const gespeichert = JSON.parse(localStorage.getItem('beiUnsSchmecktsHaushalt') || 'null');
        if (gespeichert && wochenErwachsene && wochenKinder) {
            wochenErwachsene.value = String(gespeichert.erwachsene ?? 2);
            wochenKinder.value = String(gespeichert.kinder ?? 0);
        }
    } catch (_) {
        // Ungültige lokale Einstellung ignorieren.
    }
    wochenplanAuslosen();
}

wochenplanButton?.addEventListener('click', wochenplanAuslosen);


/* =========================================================
   REZEPT TEILEN
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const teilenButton = document.querySelector(".rezept-teilen");

    if (!teilenButton) {
        return;
    }

    const originalText = teilenButton.querySelector("span:last-child")?.textContent || "Rezept teilen";

    teilenButton.addEventListener("click", async () => {

        const rezeptName =
            document.querySelector(".rezept-kopf h1")?.textContent.trim()
            || document.title.replace(" – Bei uns schmeckt's", "");

        const shareData = {
            title: `${rezeptName} – Bei uns schmeckt's`,
            text: `${rezeptName} – Bei uns schmeckt's`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                return;
            }

            await navigator.clipboard.writeText(window.location.href);

            const textElement = teilenButton.querySelector("span:last-child");
            if (textElement) {
                textElement.textContent = "Link kopiert ✓";
                window.setTimeout(() => {
                    textElement.textContent = originalText;
                }, 1800);
            }
        } catch (error) {
            if (error?.name === "AbortError") {
                return;
            }

            const textElement = teilenButton.querySelector("span:last-child");

            try {
                const textarea = document.createElement("textarea");
                textarea.value = window.location.href;
                textarea.setAttribute("readonly", "");
                textarea.style.position = "fixed";
                textarea.style.opacity = "0";
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                textarea.remove();

                if (textElement) {
                    textElement.textContent = "Link kopiert ✓";
                    window.setTimeout(() => {
                        textElement.textContent = originalText;
                    }, 1800);
                }
            } catch (_) {
                if (textElement) {
                    textElement.textContent = "Link konnte nicht kopiert werden";
                    window.setTimeout(() => {
                        textElement.textContent = originalText;
                    }, 2200);
                }
            }
        }
    });
});

/* =========================================================
   EINKAUFSLISTE FÜR APPLE NOTIZEN
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    const rezeptKopf = document.querySelector('.rezept-kopf');
    const zutatenListe = document.querySelector('.zutaten');

    if (!rezeptKopf || !zutatenListe) return;

    const einkaufslisteButton = document.createElement('button');
    einkaufslisteButton.className = 'einkaufsliste-button';
    einkaufslisteButton.type = 'button';
    einkaufslisteButton.innerHTML = `
        <span class="einkaufsliste-symbol" aria-hidden="true">⧉</span>
        <span>Zutaten kopieren</span>`;

    const einkaufslisteHinweis = document.createElement('p');
    einkaufslisteHinweis.className = 'einkaufsliste-hinweis';
    einkaufslisteHinweis.textContent = 'Danach in Apple Notizen einfügen, die Zutaten markieren und das Checklisten-Symbol auswählen.';

    const teilenButton = rezeptKopf.querySelector('.rezept-teilen');
    if (teilenButton) {
        teilenButton.insertAdjacentElement('afterend', einkaufslisteButton);
    } else {
        rezeptKopf.append(einkaufslisteButton);
    }
    einkaufslisteButton.insertAdjacentElement('afterend', einkaufslisteHinweis);

    einkaufslisteButton.addEventListener('click', async () => {
        const rezeptName = rezeptKopf.querySelector('h1')?.textContent.trim() || 'Rezept';
        const titel = `Einkaufsliste – ${rezeptName}`;
        const zeilen = [];

        zutatenListe.querySelectorAll(':scope > div:not(.zutaten-gruppe)').forEach((zeile) => {
            const teile = [...zeile.querySelectorAll(':scope > span')]
                .map((teil) => teil.textContent.trim())
                .filter(Boolean);

            if (teile.length) zeilen.push(teile.join(' '));
        });

        if (!zeilen.length) return;

        const notizText = `${titel}\n\n${zeilen.join('\n')}`;
        const beschriftung = einkaufslisteButton.querySelector('span:last-child');

        try {
            await navigator.clipboard.writeText(notizText);
            if (beschriftung) beschriftung.textContent = 'Zutaten kopiert ✓';
            einkaufslisteHinweis.textContent = 'Kopiert! Jetzt in Apple Notizen einfügen, die Zutaten markieren und das Checklisten-Symbol auswählen.';
        } catch (_) {
            if (beschriftung) beschriftung.textContent = 'Kopieren nicht möglich';
        }

        window.setTimeout(() => {
            if (beschriftung) beschriftung.textContent = 'Zutaten kopieren';
            einkaufslisteHinweis.textContent = 'Danach in Apple Notizen einfügen, die Zutaten markieren und das Checklisten-Symbol auswählen.';
        }, 4000);
    });
});
