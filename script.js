const topbar = document.querySelector(".topbar");

const menuButton = document.getElementById("menuButton");
const menuSchliessenButton = document.getElementById("menuSchliessen");
const seitenmenue = document.getElementById("seitenmenue");
const menuOverlay = document.getElementById("menuOverlay");

const sucheButton = document.getElementById("sucheButton");
const suchePanel = document.getElementById("suchePanel");
const sucheInput = document.getElementById("sucheInput");
const sucheErgebnisse = document.getElementById("sucheErgebnisse");

const rezeptKatalog = Array.isArray(window.RECIPE_CATALOG) ? window.RECIPE_CATALOG : [];
const rezepte = rezeptKatalog.map((rezept) => ({ ...rezept, kapitel: rezept.chapter }));
const neueRezepte = [...rezepte]
    .filter((rezept) => rezept.newRank < 1000)
    .sort((a, b) => a.newRank - b.newRank);

/* Hauptmenü auf allen Seiten einheitlich, kompakt und aufgabenorientiert aufbauen. */
const menueInhalt = document.querySelector('.seitenmenue-inhalt');
if (menueInhalt) {
    menueInhalt.innerHTML = `
        <a href="index.html" class="menu-start-neu">
            <span class="menu-icon" aria-hidden="true">⌂</span>
            <span><strong>Startseite</strong><small>Zur Übersicht</small></span>
        </a>

        <button type="button" class="menu-suche-neu" id="menuSucheButton">
            <span class="menu-icon suchsymbol" aria-hidden="true"></span>
            <span><strong>Rezept suchen</strong><small>Schnell zum gewünschten Gericht</small></span>
        </button>

        <a href="alle-rezepte.html" class="menu-start-neu menu-alle-rezepte">
            <span class="menu-icon" aria-hidden="true">▦</span>
            <span><strong>Alle Rezepte</strong><small>Die ganze Sammlung auf einen Blick</small></span>
        </a>

        <section class="menu-gruppe" aria-labelledby="menuRezepteTitel">
            <p class="menu-bereichstitel" id="menuRezepteTitel">Rezepte entdecken</p>
            <div class="menu-kategorien-neu">
                <a href="klassiker.html"><span>01</span><strong>Unsere Klassiker</strong><small>Herzhaft &amp; bewährt</small></a>
                <a href="was-kleines-dazu.html"><span>02</span><strong>Was Kleines dazu</strong><small>Beilagen &amp; Salate</small></a>
                <a href="das-macht-den-unterschied.html"><span>03</span><strong>Das macht den Unterschied</strong><small>Soßen &amp; Extras</small></a>
                <a href="was-suesses-aus-dem-ofen.html"><span>04</span><strong>Was Süßes geht immer</strong><small>Kuchen, Gebäck &amp; Desserts</small></a>
                <a href="erfrischende-getraenke.html"><span>05</span><strong>Erfrischende Getränke</strong><small>Limonaden &amp; sommerliche Drinks</small></a>
            </div>
        </section>

        <section class="menu-gruppe" aria-labelledby="menuPlanenTitel">
            <p class="menu-bereichstitel" id="menuPlanenTitel">Planen &amp; inspirieren</p>
            <a href="unsere-woche.html" class="menu-funktionskarte menu-wochenkarte">
                <span class="menu-icon menu-kalender" aria-hidden="true">7</span>
                <span><strong>Unsere Woche</strong><small>Gerichte passend zu Personen &amp; Mengen planen</small></span>
                <span class="menu-pfeil" aria-hidden="true">→</span>
            </a>
            <div class="menu-zufall">
                <div class="menu-zufall-kopf">
                    <span class="menu-icon" aria-hidden="true">✦</span>
                    <span><strong>Was gibt’s heute?</strong><small>Ein Hauptgericht zufällig auswählen</small></span>
                </div>
                <button type="button" class="zufall-button" id="zufallButton">Gericht auswählen</button>
                <div class="zufall-ergebnis" id="zufallErgebnis" aria-live="polite">
                    <p class="zufall-label">Unser Vorschlag</p>
                    <h3 id="zufallName"></h3>
                    <div class="zufall-aktionen">
                        <a id="zufallLink" href="#">Rezept öffnen</a>
                        <button type="button" id="zufallNochmal">Neu wählen</button>
                    </div>
                </div>
            </div>
        </section>

        <section class="menu-gruppe menu-service" aria-labelledby="menuMehrTitel">
            <p class="menu-bereichstitel" id="menuMehrTitel">Mehr</p>
            <a href="spickzettel.html"><span aria-hidden="true">✎</span><span><strong>Spickzettel</strong><small>Mengen &amp; Abkürzungen</small></span></a>
            <a href="ueber-uns.html"><span aria-hidden="true">○</span><span><strong>Über uns</strong><small>Wer hinter dem Kochbuch steckt</small></span></a>
        </section>`;
}

document.getElementById('menuSucheButton')?.addEventListener('click', () => {
    menueSchliessen();
    window.setTimeout(() => sucheButton?.click(), 180);
});

const kategorienSeiten = {
    'klassiker.html': 'Unsere Klassiker',
    'was-kleines-dazu.html': 'Was Kleines dazu',
    'das-macht-den-unterschied.html': 'Das macht den Unterschied',
    'was-suesses-aus-dem-ofen.html': 'Was Süßes geht immer',
    'erfrischende-getraenke.html': 'Erfrischende Getränke'
};
const aktuelleKategorie = kategorienSeiten[window.location.pathname.split('/').pop()];
const kategorienListe = document.querySelector('main .rezeptliste');

function sprungmarke(text) {
    return text.toLocaleLowerCase('de').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

if (aktuelleKategorie && kategorienListe) {
    const kategorienRezepte = rezeptKatalog
        .filter((rezept) => rezept.chapter === aktuelleKategorie)
        .sort((a, b) => (a.sectionRank ?? 999) - (b.sectionRank ?? 999) || (a.recipeRank ?? 999) - (b.recipeRank ?? 999) || a.name.localeCompare(b.name, 'de'));
    const abschnitte = [];
    kategorienRezepte.forEach((rezept) => {
        const titel = rezept.section || '';
        let abschnitt = abschnitte.find((eintrag) => eintrag.titel === titel);
        if (!abschnitt) {
            abschnitt = { titel, rezepte: [] };
            abschnitte.push(abschnitt);
        }
        abschnitt.rezepte.push(rezept);
    });

    kategorienListe.innerHTML = '';
    kategorienListe.classList.add('rezeptkacheln');
    let nummer = 1;
    abschnitte.forEach((abschnitt) => {
        if (abschnitt.titel) {
            const ueberschrift = document.createElement('h2');
            ueberschrift.className = 'rezept-thema';
            ueberschrift.id = sprungmarke(abschnitt.titel);
            ueberschrift.textContent = abschnitt.titel;
            kategorienListe.append(ueberschrift);
        }
        abschnitt.rezepte.forEach((rezept) => {
            const link = document.createElement('a');
            link.className = 'rezept-eintrag';
            link.href = rezept.url;
            const bild = rezept.image ? `<img class="rezept-kachelbild" src="${rezept.image}" alt="" loading="lazy">` : '';
            link.innerHTML = `${bild}<span class="rezept-nummer">${String(nummer++).padStart(2, '0')}</span><span class="rezept-name"></span>`;
            link.querySelector('.rezept-name').textContent = rezept.name;
            link.querySelector('img')?.addEventListener('error', () => link.classList.add('rezeptkachel-ohne-bild'));
            if (!rezept.image) link.classList.add('rezeptkachel-ohne-bild');
            kategorienListe.append(link);
        });
    });

    const leerstand = document.querySelector('.kapitel-leerstand');
    if (leerstand) leerstand.hidden = kategorienRezepte.length > 0;

    const sichtbareAbschnitte = abschnitte.filter((abschnitt) => abschnitt.titel && abschnitt.rezepte.length);
    if (sichtbareAbschnitte.length > 1) {
        const navigation = document.createElement('nav');
        navigation.className = 'rezept-sprungnavigation';
        navigation.setAttribute('aria-label', 'Unterkategorien');
        navigation.innerHTML = sichtbareAbschnitte.map((abschnitt) => `<a href="#${sprungmarke(abschnitt.titel)}">${abschnitt.titel}</a>`).join('');
        kategorienListe.before(navigation);
    }
}

/* Alle Rezepte: automatisch aus dem zentralen Rezeptkatalog aufbauen. */
const alleRezepteGrid = document.getElementById('alleRezepteGrid');
if (alleRezepteGrid) {
    const rezeptDaten = rezeptKatalog.map((rezept, index) => ({ ...rezept, kapitel: rezept.chapter, thema: rezept.theme, bild: rezept.image, index, neuRang: rezept.newRank }));
    const filterNamen = {
        pizza: 'Pizza', pasta: 'Pasta', burger: 'Burger', grill: 'Grill & BBQ', schmor: 'Schmorgerichte',
        suppen: 'Suppen', klassiker: 'Klassiker', beilagen: 'Beilagen', sossen: 'Soßen & Extras',
        suesses: 'Süßes', getraenke: 'Getränke'
    };
    const filterReihenfolge = ['pasta', 'burger', 'pizza', 'grill', 'schmor', 'suppen', 'klassiker', 'beilagen', 'sossen', 'suesses', 'getraenke'];
    const suchfeld = document.getElementById('alleRezepteSuche');
    const sortierung = document.getElementById('alleRezepteSortierung');
    const zaehler = document.getElementById('alleRezepteZaehler');
    const leer = document.getElementById('alleRezepteLeer');
    const filterButtons = [...document.querySelectorAll('[data-rezept-filter]')];
    let aktiverFilter = 'alle';

    const normalisieren = (text) => text.toLocaleLowerCase('de').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    function alleRezepteAnzeigen() {
        const suche = normalisieren(suchfeld?.value.trim() || '');
        let auswahl = rezeptDaten.filter((rezept) => {
            const passtZumFilter = aktiverFilter === 'alle'
                || (aktiverFilter === 'klassiker' && rezept.chapter === 'Unsere Klassiker')
                || rezept.theme === aktiverFilter;
            const suchinhalt = `${rezept.name} ${rezept.chapter} ${rezept.section} ${filterNamen[rezept.theme] || ''} ${rezept.searchText || ''}`;
            return passtZumFilter && (!suche || normalisieren(suchinhalt).includes(suche));
        });

        if (sortierung?.value === 'az') auswahl.sort((a, b) => a.name.localeCompare(b.name, 'de'));
        else if (sortierung?.value === 'neu') auswahl.sort((a, b) => a.newRank - b.newRank);
        else auswahl.sort((a, b) => filterReihenfolge.indexOf(a.theme) - filterReihenfolge.indexOf(b.theme) || a.name.localeCompare(b.name, 'de'));

        alleRezepteGrid.innerHTML = '';
        auswahl.forEach((rezept) => {
            const karte = document.createElement('a');
            karte.className = 'alle-rezept-karte';
            karte.href = rezept.url;
            const bild = rezept.image ? `<img src="${rezept.image}" alt="" loading="lazy">` : '';
            karte.innerHTML = `${bild}<span class="alle-rezept-kategorie">${filterNamen[rezept.theme] || rezept.chapter}</span><strong></strong><span class="alle-rezept-pfeil" aria-hidden="true">→</span>`;
            karte.querySelector('strong').textContent = rezept.name;
            karte.querySelector('img')?.addEventListener('error', () => karte.classList.add('ohne-bild'));
            if (!rezept.image) karte.classList.add('ohne-bild');
            alleRezepteGrid.append(karte);
        });
        if (zaehler) zaehler.textContent = `${auswahl.length} ${auswahl.length === 1 ? 'Rezept' : 'Rezepte'}`;
        if (leer) leer.hidden = auswahl.length !== 0;
    }

    filterButtons.forEach((button) => button.addEventListener('click', () => {
        aktiverFilter = button.dataset.rezeptFilter;
        filterButtons.forEach((element) => element.classList.toggle('aktiv', element === button));
        alleRezepteAnzeigen();
    }));
    suchfeld?.addEventListener('input', alleRezepteAnzeigen);
    sortierung?.addEventListener('change', alleRezepteAnzeigen);
    document.getElementById('alleRezepteZufall')?.addEventListener('click', () => {
        const sichtbareLinks = [...alleRezepteGrid.querySelectorAll('.alle-rezept-karte')];
        if (sichtbareLinks.length) window.location.href = sichtbareLinks[Math.floor(Math.random() * sichtbareLinks.length)].href;
    });
    alleRezepteAnzeigen();
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
        `${rezept.name} ${rezept.kapitel} ${rezept.section || ''} ${rezept.searchText || ''}`.toLocaleLowerCase("de").includes(text)
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


/* Alle Rezepte der Kategorie „Unsere Klassiker“ übernehmen – einschließlich
   der später ergänzten Rezepte, die erst per JavaScript einsortiert werden. */
async function hauptgerichteLaden() {
    hauptgerichte = rezepte
        .filter((rezept) => rezept.kapitel === "Unsere Klassiker")
        .map(({ name, url }) => ({ name, url }));
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
   UNSERE WOCHE – AUSGEWOGENER WOCHENPLAN
   ========================================================= */

const wochenRezepte = rezeptKatalog
    .filter((rezept) => rezept.chapter === 'Unsere Klassiker')
    .map((rezept) => ({
        name: rezept.name,
        url: rezept.url,
        portionen: rezept.portions || 4,
        gruppe: rezept.weekGroup || rezept.theme || 'klassiker',
        label: rezept.weekLabel || rezept.section || 'Hauptgericht'
    }));

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
    localStorage.setItem('beiUnsSchmecktsWochenplan', JSON.stringify({
        html: wochenplanListe.innerHTML,
        zusammenfassung: wochenplanZusammenfassung.textContent,
        erwachsene: haushalt.erwachsene,
        kinder: haushalt.kinder
    }));
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
    try {
        const gespeicherterPlan = JSON.parse(localStorage.getItem('beiUnsSchmecktsWochenplan') || 'null');
        if (gespeicherterPlan?.html) {
            wochenplanListe.innerHTML = gespeicherterPlan.html;
            wochenplanZusammenfassung.textContent = gespeicherterPlan.zusammenfassung || '';
        } else {
            wochenplanAuslosen();
        }
    } catch (_) {
        wochenplanAuslosen();
    }
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
   ZUTATEN KOPIEREN
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
    einkaufslisteHinweis.textContent = 'Für deine Notizen oder Einkaufsliste kopieren.';

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
            einkaufslisteHinweis.textContent = 'Kopiert! Jetzt in deine Notizen oder Einkaufsliste einfügen.';
        } catch (_) {
            if (beschriftung) beschriftung.textContent = 'Kopieren nicht möglich';
        }

        window.setTimeout(() => {
            if (beschriftung) beschriftung.textContent = 'Zutaten kopieren';
            einkaufslisteHinweis.textContent = 'Für deine Notizen oder Einkaufsliste kopieren.';
        }, 4000);
    });
});


document.getElementById('startSucheButton')?.addEventListener('click', () => {
    sucheButton?.click();
    window.setTimeout(() => sucheInput?.focus(), 80);
});
