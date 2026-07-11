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

## Offene TODOs (im Markup mit `TODO` markiert)

1. **Echte Adressen + Telefonnummern** der drei Standorte (aktuell Platzhalter).
2. **Projektfotografie** ersetzen (`before.jpg`/`after.jpg` sind Platzhalter; ideal WebP/AVIF + `srcset`).
3. **Formular-Backend** anbinden (Versand an info@planvoller.de).
4. **Impressum/Datenschutz** rechtlich vervollständigen; ggf. Fonts/Libs self-hosten (DSGVO).
5. Blog-Beitragsseiten anlegen.
