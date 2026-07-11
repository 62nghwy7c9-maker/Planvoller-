# Haus-Intro

Das Website-Intro, das in `../index.html` eingebaut ist: Ein Haus baut sich aus
Ziegeln auf, die Kamera fährt durch die Tür zum warmen Kamin, dann blendet das
Intro aus und gibt den Vorher/Nachher-Schieberegler frei. Three.js-Basis,
eigenständige Umsetzung im Geist von [igloo.inc](https://www.igloo.inc/).

## Wie es eingebaut ist

Das fertig gebaute Intro liegt als ein einziger, inline eingebetteter
`<style>`+`<script type="module">`-Block direkt in `../index.html` (vor
`</body>`). Es montiert sich beim Laden selbst als Vollbild-Overlay, läuft einmal
pro Sitzung (`sessionStorage`), blendet weich aus und entfernt sich dann — der
restliche Seitencode bleibt unangetastet. Kein Build, keine Abhängigkeiten zur
Laufzeit.

- **Erneut abspielen:** die Seite mit `?intro` in der URL aufrufen.
- **Reduzierte Bewegung:** bei `prefers-reduced-motion` wird das Intro sofort
  fertig gezeigt und übergeben.

## Quellen (zum Anpassen)

Der eingebettete Block ist ein Produktions-Build der Dateien in `source/`:

| Datei | Aufgabe |
| --- | --- |
| `source/houseStage.ts` | Die 3D-Szene (Haus, Kamera, Schnee) — hier Maße, Farben, Kamerafahrt anpassen |
| `source/intro/HouseIntro.tsx` | Intro-Komponente; Props: `onComplete`, `duration`, `brand`, `headline`, `skipLabel` |
| `source/intro/HouseIntro.css` | Styles (alle Klassen `intro-…`) |
| `source/embed-inline.tsx` | Selbst-Montage als Overlay (sessionStorage, `?intro`) |

### Neu bauen und wieder einbetten

In einem Vite+React-Projekt mit `three` als Abhängigkeit `embed-inline.tsx` als
Entry bauen (alle Assets inline), dann den erzeugten CSS- und JS-Inhalt als
`<style>…</style>` bzw. `<script type="module">…</script>` erneut vor `</body>`
in `../index.html` setzen. Wichtig: Beim Einfügen den JS-Inhalt nicht durch
`String.replace` mit String-Ersatz schleusen (`$`-Zeichen im Bundle) — literal
einsetzen.

Der vollständige, lauffähige Projektstand (Demo, Scroll-Variante, Build-Setup)
liegt im separaten Projekt `iglu-animation`.
