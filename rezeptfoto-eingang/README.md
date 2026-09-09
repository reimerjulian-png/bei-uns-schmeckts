# Rezeptfoto-Eingang

Hier legst du neue, **unbearbeitete Originalfotos** ab. Danach schreibst du in
Codex:

> Bitte Rezeptfoto-Eingang verarbeiten.

## Dateinamen

Der Dateiname beginnt mit dem Namen der passenden Rezeptseite – ohne `.html` –
gefolgt von `__01`, `__02` usw.

Beispiele:

- `gyrossuppe__01.jpg` gehört zu `gyrossuppe.html`
- `gyrossuppe__02.jpg` ist ein weiteres Foto desselben Rezepts
- `apfel-im-schlafrock__01.heic` gehört zu `apfel-im-schlafrock.html`

Erlaubt sind `.jpg`, `.jpeg`, `.png`, `.heic` und `.webp`. Verwende nur
Kleinbuchstaben, Ziffern und Bindestriche im Rezeptnamen. Der Rezeptname muss
genau dem vorhandenen Namen der HTML-Datei entsprechen.

## Was bei der Verarbeitung passiert

1. Jedes Foto wird einzeln der passenden Rezeptseite zugeordnet.
2. Das Foto wird fotorealistisch und zurückhaltend im vorhandenen Bildstil
   optimiert. Das Essen, seine Zutaten und seine tatsächliche Anrichtung werden
   nicht künstlich verändert.
3. Die Rohdatei in diesem Ordner bleibt unverändert und wird weder überschrieben
   noch gelöscht.
4. Das fertige Bild wird weboptimiert im Ordner `images` gespeichert.
5. Die passende Rezeptseite und, falls nötig, die Bildzuordnung in `script.js`
   werden aktualisiert.
6. Die Seite wird lokal auf Darstellung, Zuschnitt, Ladegröße und korrekte
   Zuordnung geprüft.

**Wichtig:** Eine Veröffentlichung oder Bereitstellung erfolgt erst, wenn Julian
das lokal geprüfte Ergebnis ausdrücklich freigibt.

