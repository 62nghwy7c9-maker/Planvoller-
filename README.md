# Planvoller GmbH — Website

Award-orientierte Unternehmenswebsite für die Planvoller GmbH
(Einfamilienhausbau · Würselen, Kerpen, Bensberg). Statisch, ohne Build-Schritt.

**Konzept & Motion-Direktion:** siehe [`KONZEPT.md`](KONZEPT.md) —
Big Idea „Gefügt, nicht gebaut.", Motion-Leitmotiv „Das Fügen".

## Struktur

| Datei | Inhalt |
| --- | --- |
| `index.html` | Startseite: WebGL-Hero, Manifest, Referenz-Teaser, 15-Schritte-Scrollytelling, Standorte, CTA |
| `planvoller.html` | Über uns (Haltung, Werte) |
| `ablauf.html` | Alle 15 Schritte im Detail |
| `referenzen.html` + `referenz-*.html` | Case-Grid + Detailseiten (Stadtvilla Mörs, Kubus Hallig) |
| `blog.html` | Blog-Übersicht (Beitragsseiten TODO) |
| `kontakt.html` | Bauanfrage-Formular + 3 Standortkarten (JSON-LD LocalBusiness) |
| `impressum.html` / `datenschutz.html` | Rechtliches (Platzhalter, TODO) |
| `assets/css/main.css` | Design-System: Farb-, Typo-, Raum- und **Motion-Tokens** |
| `assets/js/main.js` | Motion-Engine: Lenis, GSAP/ScrollTrigger, Split-Text, Scrollytelling, Micro-Interactions |
| `assets/js/hero.js` | Three.js-Hero: Haus fügt sich beim Scrollen (nur Desktop + WebGL + Motion-Erlaubnis) |

## Lokal ansehen

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Degradierung / A11y

- `prefers-reduced-motion`: vollwertige ruhige Version (keine Pins, keine Reveals).
- Ohne JS oder blockierte CDNs: kompletter Inhalt bleibt sichtbar.
- Mobil: Hero als Standbild, 15 Schritte als Liste.
- Tastatur vollständig bedienbar, Fokusringe, Landmarks, Skip-Link.

## Bilder austauschen (Namenskonvention)

Alle Bild-Slots liegen unter `assets/img/` — **echte Fotos einfach unter demselben
Dateinamen ablegen, kein Markup-Edit nötig:**

| Datei | Verwendung | Empfehlung |
| --- | --- | --- |
| `hero-poster.jpg` | Hero-Standbild (mobil / Fallback) | quer, ≥1600 px |
| `og-image.jpg` | Social-Media-Vorschau | exakt 1200×630 |
| `ref-<slug>-cover.jpg` | Referenz-Grid, Teaser, Detail-Hero | 16:10, ≥1280 px |
| `ref-<slug>-01.jpg` … `-03.jpg` | Galerie der Detailseite | 4:3, ≥1200 px |
| `step-01.jpg` … `step-15.jpg` | 15-Schritte-Scrollytelling | 16:9, ≥960 px |

Slugs: `stadtvilla-moers`, `kubus-hallig`, `landhaus-steves`, `stadthaus-barth`,
`stadtvilla-reichert`. `before.jpg`/`after.jpg` (Repo-Root) speisen den
Vorher/Nachher-Regler — ideal: zwei Aufnahmen desselben Projekts aus gleicher Perspektive.

## Offene TODOs (im Markup mit `TODO` markiert)

1. **Projektfotografie** hochladen (siehe Namenskonvention oben) — aktuell Platzhalter.
2. **Formular-Backend**: `data-endpoint="…"` am `<form>` in `kontakt.html` setzen
   (POST, FormData); ohne Endpoint öffnet sich als Fallback das E-Mail-Programm.
3. **Impressum**: Registergericht + HRB-Nummer ergänzen; Rechtstexte prüfen lassen.
4. Blog-Beitragsseiten anlegen (Übersicht steht).
