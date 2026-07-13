# Planvoller GmbH — Website

Unternehmenswebsite der Planvoller GmbH (Einfamilienhausbau · Würselen, Kerpen,
Bensberg). Statisch, ohne Build-Schritt, ohne externe Abhängigkeiten.

**Design (v3):** hell, klassisch, freundlich. Markenfarben aus dem Logo
(Terrakotta `#a84400`, Graugrün `#808374`), Schrift Work Sans (self-hosted).
Dezente Scroll-Reveals statt schwerer Animationen — kein GSAP, kein WebGL.

## Struktur

| Datei | Inhalt |
| --- | --- |
| `index.html` | Startseite: Hero mit Projektfoto, Warum-Karten, Referenz-Grid, „Der Weg" kompakt (4 Phasen), Vorher/Nachher-Regler, Standorte, CTA |
| `planvoller.html` | Über uns (Haltung, Werte) |
| `ablauf.html` | Alle 15 Schritte als Timeline (ohne Fotos) |
| `referenzen.html` + `referenz-*.html` | Referenz-Grid + 5 Detailseiten |
| `blog.html` | Blog-Übersicht (Beitragsseiten TODO) |
| `kontakt.html` | Bauanfrage-Formular + 3 Standortkarten (JSON-LD LocalBusiness) |
| `impressum.html` / `datenschutz.html` | Rechtliches (Platzhalter, TODO) |
| `assets/css/main.css` | Design-System (helle Farbwelt, Komponenten, Reveals) |
| `assets/js/main.js` | Vanilla-JS: Menü, Reveals, Zähler, Vorher/Nachher, Formular |

Die Seiten werden aus einem gemeinsamen Template generiert (Header/Footer
identisch auf allen Seiten); direktes Editieren der HTML-Dateien ist trotzdem
problemlos möglich.

## Lokal ansehen

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Degradierung / A11y

- `prefers-reduced-motion`: alle Übergänge deaktiviert, Inhalte sofort sichtbar.
- Ohne JS: kompletter Inhalt bleibt sichtbar (Reveals greifen nur mit `js`-Klasse).
- Tastatur vollständig bedienbar: Fokusringe, Landmarks, Skip-Link,
  Vorher/Nachher-Regler per Pfeiltasten.

## Bilder (Namenskonvention)

Alle Bilder liegen unter `assets/img/` — Austausch unter gleichem Dateinamen,
kein Markup-Edit nötig:

| Datei | Verwendung | Empfehlung |
| --- | --- | --- |
| `hero-home.jpg` | Hero der Startseite | quer 4:3–3:2, ≥1600 px |
| `og-image.jpg` | Social-Media-Vorschau | exakt 1200×630 |
| `ref-<slug>-cover.jpg` | Referenz-Grid + Detail-Hero | quer, ≥1600 px |

Slugs: `stadtvilla-moers`, `kubus-hallig`, `landhaus-steves`, `stadthaus-barth`,
`stadtvilla-reichert`. `before.jpg`/`after.jpg` (Repo-Root) speisen den
Vorher/Nachher-Regler — ideal: zwei Aufnahmen desselben Projekts aus gleicher
Perspektive.

## Offene TODOs (im Markup mit `TODO` markiert)

1. **Formular-Backend**: `data-endpoint="…"` am `<form>` in `kontakt.html` setzen
   (POST, FormData); ohne Endpoint öffnet sich als Fallback ein E-Mail-Entwurf.
2. **Impressum**: Registergericht + HRB-Nummer ergänzen; Rechtstexte prüfen lassen.
3. Blog-Beitragsseiten anlegen (Übersicht steht).
4. Optional: echte Fotos statt Renderings, sobald Projektfotografie vorliegt.
