# Vorher/Nachher Schieberegler

Der Bildvergleichs-Schieberegler wie auf housedesign.ai – eine einzige HTML-Datei, keine Abhängigkeiten. `index.html` im Browser öffnen, fertig. Ziehen mit Maus oder Finger.

Die Bilder liegen direkt daneben:

- `before.jpg` – das Vorher-Bild (Rohbau)
- `after.jpg` – das Nachher-Bild (fertiges Haus)

## Bilder austauschen

Einfach `before.jpg` bzw. `after.jpg` durch neue Dateien mit demselben Namen ersetzen – oder in der `index.html` die beiden `src`-Pfade anpassen (der Kommentar im Code zeigt die Stelle). Beide Bilder sollten das gleiche Seitenverhältnis haben.

Zum Einbauen in eine bestehende Seite: den `<style>`-Block, das `<div class="compare">…</div>` und den `<script>`-Block kopieren – mehrere Regler auf einer Seite funktionieren automatisch.

# Intro-Animation (`intro.html`)

`intro.html` ist eine eigenständige Scroll-Animation: ein modernes Haus wird beim Scrollen Stein für Stein aufgebaut, am Ende leuchten die Fenster warm. Alles ist in die eine Datei eingebettet (3D-Engine, Schrift, Grafik) – keine externen Abhängigkeiten, kein Internet nötig.

## Als Intro einbinden

**Variante A – eigene Seite / Landingpage:** `intro.html` direkt als Startseite verwenden oder verlinken. Die Animation reagiert auf das Scrollen der Seite (Seitenhöhe ist bewusst hoch, damit genug Scrollweg da ist).

**Variante B – als eingebettetes Intro per iframe:** die Datei in einem Abschnitt der bestehenden Website einbetten:

```html
<iframe src="intro.html" title="Planvoller Intro"
        style="width:100%;height:100vh;border:0;display:block"></iframe>
```

Der iframe bringt seinen eigenen Scrollbereich mit – die Animation läuft unabhängig vom Rest der Seite.

## Übergang zur Hauptseite

Wenn die Animation zu Ende gescrollt ist, blendet das Intro weich aus und geht auf die Hauptseite über:

- **Als eigene Seite:** es wird auf die Adresse in der Konstante `NEXT_URL` weitergeleitet. Diese steht ganz oben im letzten `<script>`-Block von `intro.html` (Standard: `index.html`) – dort einfach die Adresse deiner echten Startseite eintragen.
- **Im iframe:** statt weiterzuleiten schickt das Intro der Elternseite eine Nachricht. Darauf kann die Website reagieren (z. B. den iframe ausblenden und den Inhalt zeigen):

```html
<script>
  window.addEventListener("message", function (e) {
    if (e.data && e.data.planvollerIntro === "done") {
      // z. B. den Intro-iframe ausblenden und zur Seite übergehen
      document.querySelector("iframe[title='Planvoller Intro']").style.display = "none";
    }
  });
</script>
```

## Texte / Marke anpassen

Die eingeblendeten Texte („Stein auf Stein.", „Bauen mit Herz und Verstand", „Willkommen bei planvoller.") und das Logo oben links stehen als Klartext in der Datei und lassen sich per Suchen-und-Ersetzen ändern.
