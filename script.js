const topbar = document.querySelector(".topbar");

const menuButton = document.getElementById("menuButton");
const menuSchliessenButton = document.getElementById("menuSchliessen");
const seitenmenue = document.getElementById("seitenmenue");
const menuOverlay = document.getElementById("menuOverlay");

const sucheButton = document.getElementById("sucheButton");
const suchePanel = document.getElementById("suchePanel");
const sucheInput = document.getElementById("sucheInput");
const sucheErgebnisse = document.getElementById("sucheErgebnisse");

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
];

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

const coverScroll = document.querySelector(".cover-scroll");
const coverTeller = document.querySelector(".cover-teller");
const coverText = document.querySelector(".cover-text");

function coverAnimation() {
    if (!coverScroll || !coverTeller || !coverText) return;

    const rect = coverScroll.getBoundingClientRect();
    const scrollBereich = coverScroll.offsetHeight - window.innerHeight;

    if (scrollBereich <= 0) return;

    let fortschritt = -rect.top / scrollBereich;
    fortschritt = Math.max(0, Math.min(1, fortschritt));

    const scale = 1 + fortschritt * 4.5;
    coverTeller.style.transform =
        `translate(-50%, -50%) scale(${scale})`;

    const textOpacity = Math.max(0, 1 - fortschritt * 2.2);
    const textY = fortschritt * 60;

    coverText.style.opacity = textOpacity;
    coverText.style.transform = `translateY(${textY}px)`;
}

window.addEventListener("scroll", coverAnimation, { passive: true });
coverAnimation();

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
