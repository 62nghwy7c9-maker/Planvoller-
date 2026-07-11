# Redesign-Briefing: planvoller.de

> **Zweck dieses Dokuments:** Vollständige Zusammenfassung der Website-Analyse und des Redesign-Brainstormings, damit eine neue Arbeits-Session ohne Kontextverlust ansetzen kann. Erstellt am 11.07.2026.

---

## Arbeitsstand / Status

- **Analysierte Website:** https://planvoller.de/ (WordPress, Custom-Theme „planvoller", Stand Juli 2026)
- **Analyse abgeschlossen:** Live-HTML aller Hauptseiten (Start, Planvoller/Über uns, Ablauf, Referenzen, Blog, Kontakt), Desktop- (1440 px) und Mobile-Renderings (390 px), CSS/JS-Payload-Audit, WCAG-Kontrastmessung, SEO-Basics
- **Nicht prüfbar (offen markiert):** reale Core Web Vitals/Felddaten, Formular-Zustellung, bestehende Rankings/Traffic (Search Console), Google-Business-Profile
- **Design/Umsetzung: NOCH NICHT FREIGEGEBEN.** Die Auftraggeberin wählt erst eine Design-Richtung (A/B/C, siehe unten). Empfehlung: **Richtung B** („Der Bauplan"), angereichert mit der Fotografie-Wertigkeit aus A
- **5 Rückfragen sind noch unbeantwortet** (siehe Aufgabe 2) — vor allem Frage 1 (echte Projektfotos?) und Frage 2 (Conversion-Ziel) entscheiden über die finale Richtung
- **Repo-Hinweis:** Das Repository enthält bereits einen alleinstehenden Vorher/Nachher-Bildvergleichs-Slider (`index.html`, ohne Abhängigkeiten) — wiederverwendbar als Baustein für Sanierungs-Referenzen

**Kernbefund in einem Satz:** Die Seite ist handwerklich sauber gebaut (Custom-Theme, kein Baukasten), aber eine digitale Visitenkarte ohne Verkaufsabsicht — kein einziger primärer CTA auf der Startseite, keine Leistungsseiten, tote Referenzkarten, toter Blog seit Januar 2023, und mehrere echte Content-Bugs.

---

# AUFGABE 1 – VOLLANALYSE

*Severity: 5 = geschäftsschädigend, 1 = kosmetisch. Innerhalb jeder Tabelle absteigend sortiert.*

## 1.1 Conversion (kritischster Bereich)

| Fund | Warum Problem | Sev | Fix |
|---|---|---|---|
| **Kein einziger primärer CTA auf der Startseite.** Alle 4 Buttons („Mehr über uns", „Alle Referenzen", „Mehr erfahren", „Alle Beiträge") sind Outline-Sekundär-Buttons, die tiefer navigieren – keiner führt zu Kontakt/Anfrage | Die Seite hat kein Conversion-Ziel. Ein Bauinteressent muss selbst auf die Idee kommen, „Kontakt" im Menü zu klicken | 5 | Primärer, gefüllter CTA („Kostenloses Erstgespräch") im Hero, nach Referenzen, nach Ablauf-Teaser und als finaler Block vor dem Footer |
| **Above the fold: nur Logo, Menü und eine Text-Headline.** Kein Bild, kein CTA, kein Trust-Signal im ersten Viewport (Desktop wie Mobile) | Die ersten 3 Sekunden entscheiden. Aktuell: weiße Fläche mit einem Firmen-Statement – null emotionale Wirkung, null Handlungsaufforderung | 5 | Hero mit echtem Projektfoto, Nutzenversprechen, CTA und Trust-Bar (z. B. „400+ Projekte · 3 Standorte") |
| **Null Social Proof auf der gesamten Website**: keine Kundenstimmen, keine Google-Bewertungen, keine Siegel, keine Partnerlogos. Die stärkste Zahl („über 400 abgewickelte Projekte") steht versteckt im Fließtext auf /planvoller/ | Bei einer 500.000-€-Entscheidung ist fehlender Beweis ein K.-o.-Kriterium. Der Wettbewerb (Fertighaus-Anbieter) fährt massiv Bewertungen | 5 | Testimonials + Google-Reviews-Einbindung; „400+ Projekte" prominent in den Hero |
| **Header ohne Kontakt-CTA und ohne Telefonnummer** – stattdessen ein Such-Icon | Bauherren rufen an. Die Nummer steht erst im Footer, ~4.000 px tiefer. Die Suche ist auf einer 9-Seiten-Website nutzlos | 4 | Suche raus, Telefonnummer + Button „Beratung anfragen" rein (sticky) |
| **Referenzkarten sind nicht klickbar** – weder auf der Startseite noch auf /referenzen/ existiert ein Link zu Projekt-Detailseiten (0 `<a>` in allen 6 Projekt-Cards) | Referenzen sind DAS Verkaufsargument eines Bauunternehmens – hier sind sie eine Sackgasse: Bild, Titel, Jahr, Ende | 4 | Projekt-Detailseiten mit Story (Aufgabe → Lösung → Ergebnis), Daten, Galerie, Kundenzitat, CTA |
| **/ablauf/ endet ohne CTA**: 15 Schritte über 10.700 px Seitenhöhe, danach kommt direkt der Footer | Wer alle 15 Schritte liest, ist ein heißer Lead – und wird mit nichts abgeholt | 4 | Nach Schritt 15: „Bereit für Schritt 1? → Erstgespräch vereinbaren" |
| **Blog-Teaser „Was gibt es Neues?" zeigt Beiträge vom Januar 2023** auf der Startseite (Stand Juli 2026) | Eine „Neuigkeiten"-Sektion mit 3,5 Jahre alten Posts signalisiert: kümmert sich nicht. Aktiver Vertrauens-Killer | 4 | Blog-Sektion von der Startseite nehmen, bis es einen Redaktionsplan gibt |
| **Kontaktformular: Pflicht-Dropdown „Ihr Anliegen" mit genau einer wählbaren Option** („Allgemeine Anfrage") | Ein Pflichtfeld ohne Auswahlmöglichkeit = pure Reibung ohne Informationsgewinn | 3 | Sinnvolle Optionen (Neubau, Sanierung, Grundstück, Sonstiges) oder Feld streichen |

## 1.2 Copy

| Fund | Warum Problem | Sev | Fix |
|---|---|---|---|
| **H1 der Startseite ist ein Firmen-Statement, kein Nutzenversprechen**: „Wir begleiten Sie mit dem Anspruch an solide Bauqualität, durchdachte Planungs- und Bauprozesse" | Sagt weder WAS ihr baut, noch WO, noch für WEN. „Anspruch an" verkauft die Absicht, nicht das Ergebnis | 5 | Z. B.: „Ihr massives Traumhaus im Rheinland – schlüsselfertig, termintreu, in 15 planvollen Schritten." |
| **Kein „Leistungsversprechen in Zahlen"**: Festpreis? Bauzeit? Gewährleistung? Energiestandard? Nirgends benannt | Die Kernfragen jedes Bauherren (Was kostet es? Wie lange? Wie sicher?) bleiben unbeantwortet | 4 | USP-Sektion mit konkreten Zusagen + FAQ |
| **Die H1 wird auf der Startseite fast wortgleich im Ablauf-Teaser recycelt** – dort mit Doppelfehler: „…damit Sie die die Planung, Umsetzung…" | Copy-Paste-Texte + stehengebliebener Tippfehler auf der wichtigsten Seite | 3 | Eigenständige Copy je Sektion; „die die" korrigieren |
| **Tippfehler im Button „AlLe Referenzen"** (Startseite, Referenzen-Sektion) | Ein Vertipper in einem 2-Wörter-Button, seit Jahren live – Detail-Qualität ist euer Verkaufsargument als Baufirma | 3 | „Alle Referenzen" |
| **„Stadtvilla Mörs" / Ort „Mörs"** – die Stadt schreibt sich Moers | Falsche Ortsnamen untergraben lokale Glaubwürdigkeit und Local SEO | 3 | Korrigieren; echte Projektnamen mit korrekten Orten |
| **Ton durchgängig „wir/uns"-zentriert** („Wir sind…", „Wir bauen…", „Der Name … steht für…") | Selbstbeschreibung statt Kundennutzen; typisch Broschüren-Website | 3 | Copy aus Kundenperspektive: Ängste (Kostenexplosion, Pfusch, Verzögerung) adressieren und entkräften |

## 1.3 Visuelles Design

| Fund | Warum Problem | Sev | Fix |
|---|---|---|---|
| **Referenz- und Blogbilder sind erkennbar generische 3D-Renderings/Stockfotos** (Dateinamen wie `planvoller-testbeitrag-2.jpg`; „Kubus Hallig" ist ein typisches Archviz-Rendering) | Ein Bauunternehmen ohne Fotos gebauter Häuser wirkt wie eines, das noch nichts gebaut hat. Fatal bei 400+ echten Projekten | 5 | Foto-Shooting von 5–8 realen Projekten (außen + innen), Baustellen- und Team-Fotografie |
| **Monotoner Sektions-Rhythmus**: Jede Sektion folgt exakt demselben Muster (Linien-Eyebrow → H2 → Inhalt → Outline-Button), 66/33-Spalten wiederholen sich identisch | Kein visueller Spannungsbogen; nach dem zweiten Scroll fühlt sich alles gleich an | 4 | Abwechselnde Layout-Muster: Vollbild-Bilder, asymmetrische Grids, Zahlen-Sektion, dunkle Kontrast-Sektion |
| **Extrem viel toter Weißraum**: z. B. auf /referenzen/ ~300 px Leerraum zwischen den ersten Projekten, auf /kontakt/ ~200 px zwischen H1 und Formular | Weißraum ohne Rhythmus wirkt nicht „premium", sondern unfertig | 3 | Konsistente Spacing-Skala (8-px-System), Sektionen verdichten |
| **Typografie ohne Kontrast**: Work Sans in einem einzigen (hellen) Schnitt für H1 bis Fließtext; die H1 wirkt in 42+ px Light dünn | Keine Hierarchie-Wirkung, kein Charakter; die Marke hat typografisch keine Stimme | 3 | Typo-Pairing mit echtem Gewichtskontrast (siehe Aufgabe 3) |
| **Logo/Wordmark wirkt 2010**: Kasten-Outline, Häkchen im „V", hochgestelltes „DE", bei Header-Größe unlesbare Mini-Tagline | Erster Markenkontakt kommuniziert „bieder", kollidiert mit modernem Redesign | 3 | Behutsamer Logo-Refresh (Entscheidung bei der Auftraggeberin) |
| **Buttons in 3 inkonsistenten Stilen**; der visuell stärkste Button der Website ist ausgerechnet der „Nach oben"-Button (gefüllt) | Kein Button-System, CTA-Wirkung verpufft | 3 | Button-System: 1 Primär (gefüllt), 1 Sekundär (Outline), 1 Tertiär (Text+Pfeil) |
| **Invertierte Hierarchie bei den Eyebrows**: kleine Vorzeilen („Referenzen", „Ablauf") sind als H3 über der H2 ausgezeichnet | Semantisch falsch herum, visuell verwaschen | 2 | Eyebrow als `<p>`/`<span>` mit Uppercase + Letterspacing |

## 1.4 UX / Struktur / Informationsarchitektur

| Fund | Warum Problem | Sev | Fix |
|---|---|---|---|
| **Es gibt keine Leistungsseiten.** IA: Planvoller (= Über uns), Ablauf, Referenzen, Blog, Kontakt. Das Angebot (Schlüsselfertigbau, Rohbau, Sanierung, Erschließung) steht nur versteckt im Über-uns-Text | Nutzer wie Google finden nirgends strukturiert, WAS verkauft wird. Größte strukturelle Lücke | 5 | Hauptnavigationspunkt „Leistungen" mit 3–4 Unterseiten |
| **/ablauf/ ist eine 10.700-px-Wand aus 15 identischen Zebra-Blöcken** ohne Übersicht, Sprungnavigation oder Fortschrittsanzeige | Der inhaltlich stärkste Content ist ergonomisch der schwächste: Schritt 15 sieht praktisch niemand | 4 | Kompakte interaktive Timeline mit Übersicht + expandierbaren Schritten |
| **Startseite beantwortet Grundfragen nicht**: Was? (fehlt) Wo? (erst Footer) Warum ihr? (fehlt) | Nutzer muss sich das Geschäftsmodell aus Teasern zusammenpuzzeln | 4 | Neue Section-Struktur (siehe Aufgabe 3) |
| **Mobile Hero = reine Textwand**: H1 über 6 Zeilen, Bild erst weiter unten | Mobil ist der Ersteindruck noch schwächer als am Desktop | 4 | Mobiler Hero mit Bild + kurzer Headline + CTA im ersten Viewport |
| **Menüpunkt „Planvoller" als Label für die Über-uns-Seite** | Firmenname als Nav-Label trägt null Information | 3 | „Über uns" / „Unternehmen" |
| **„Login"-Link zu /wp-login.php im öffentlichen Footer** jeder Seite | Kein Nutzerwert, unprofessionell, lädt Bots ein | 2 | Entfernen |
| **Footer-Standorte: 3× dieselbe E-Mail, unterschiedliche Telefon-Anzeige** (siehe Bugs unten) | Redundanz + Fehleranfälligkeit | 2 | Ein zentraler Kontaktblock + Karte |

## 1.5 Technik / Performance / Accessibility

| Fund | Warum Problem | Sev | Fix |
|---|---|---|---|
| **BUG: Falsch verlinkte Telefonnummern im Footer.** Kerpen zeigt „+49 2273 9918151" an, das `tel:`-Href wählt aber +49 2405 6079832 (Würselen). Bensberg zeigt „+49 1774210010", Href wählt ebenfalls die Würselener Nummer | Mobile Anrufer landen woanders als angezeigt – Funktionsfehler an der wichtigsten Conversion-Stelle | 5 | `tel:`-Attribute korrigieren |
| **BUG: Falsche PLZ auf /kontakt/**: Sidebar nennt „Ottostraße 4a, 52146 Kerpen" – 52146 ist Würselen; der Footer derselben Seite sagt korrekt 50170 | Widersprüchliche NAP-Daten auf einer Seite; schadet Local SEO (Google-Business-Abgleich) | 4 | PLZ korrigieren, NAP-Daten zentral pflegen |
| **Das LCP-Element (Hero-Bild) wird per JS lazy-geladen**: Base64-Platzhalter im `src`, echtes Bild erst via lazysizes; `fetchpriority="high"` sitzt auf dem Platzhalter | Klassischer Core-Web-Vitals-Killer: LCP wartet auf jQuery + Lazyload-Script | 4 | Hero-Bild nie lazy laden; natives `loading="lazy"` nur below-the-fold |
| **Render-blockierendes jQuery 3.5.1 im `<head>`** (88 KB) + Slick (52 KB) + Masonry + imagesloaded + Contact Form 7 auf jeder Seite (auch ohne Formular/Slider); ~40 KB inline WP-Block-CSS + riesiges Inline-WebP-Script (78 KB HTML gesamt) | ~150 KB+ JS für eine praktisch statische Seite | 3 | Redesign ohne jQuery, CSS-Scroll-Animationen, Assets nur wo gebraucht |
| **A11y: 8 von 14 Bildern auf der Startseite mit leerem `alt`** – darunter alle Referenz- und das Hero-Bild | Screenreader erfahren nichts über die Projekte; verschenktes Bilder-SEO | 3 | Beschreibende Alt-Texte („Neubau Stadtvilla in Moers, 2020") |
| **A11y: Hamburger-Menü und Such-Toggle sind `<div>`s ohne Button-Semantik/ARIA**; DOM beginnt mit versteckter Such-H5 vor der H1 | Tastatur-/Screenreader-Bedienung nicht gewährleistet | 3 | `<button aria-expanded>`, korrekte Landmark-Struktur |
| **Kontrast-Verstöße**: `--color-primary-light #ee8838` auf Weiß = 2,56:1, `--color-secondary #919587` = 3,06:1 (AA-Grenze Text: 4,5:1). Haupt-Orange #b65a00 besteht knapp mit 4,72:1 | Hover-States und Sekundärtexte unter der Lesbarkeitsgrenze | 3 | Palette mit AA-geprüften Abstufungen aufsetzen |
| **IE8-Conditional-Comment + Browser-Upgrade-Hinweis** (Tippfehler „Erlebniss") im Markup | Totes Gewicht | 1 | Entfernen |

## 1.6 SEO-Basics

| Fund | Warum Problem | Sev | Fix |
|---|---|---|---|
| **Keine Leistungs-/Standortseiten = keine rankbaren Inhalte** für kommerzielle Suchbegriffe | SEO-Sichtbarkeit strukturell gedeckelt, egal wie gut die Texte werden | 5 | Leistungsseiten + ggf. Standort-Landingpages |
| **Keine einzige Meta-Description auf der gesamten Website** (alle Seiten geprüft: 0 Treffer) | Google baut Snippets selbst; SERP-CTR verschenkt | 4 | Pro Seite individuelle Description mit Nutzenversprechen + Ort |
| **Startseiten-Title ist nur „Planvoller GmbH"** – kein Keyword, kein Ort | Rankt für nichts außer dem Firmennamen | 4 | „Schlüsselfertig bauen im Rheinland \| Planvoller GmbH" o. ä. |
| **Kein Schema.org-Markup** – bei 3 Standorten wäre `LocalBusiness`/`GeneralContractor` Pflicht | Verschenkte Rich-Results und Local-Pack-Signale | 3 | JSON-LD: Organization + 3× LocalBusiness + BreadcrumbList |
| **Keine Open-Graph-/Twitter-Tags** (0 `og:`-Tags) | Geteilte Links (v. a. WhatsApp) erscheinen ohne Bild/Beschreibung | 3 | OG-Tags mit Projektbild pro Seite |
| **Blog seit Jan 2023 tot**, enthält „Der Baublog startet" und Bilder namens `testbeitrag` | Freshness-Signal negativ; Testcontent indexiert | 3 | Blog mit Plan reaktivieren (Bautagebücher = Gold für SEO + Trust) oder sauber abbauen |
| **Positiv (beibehalten):** sauberes `lang="de"`, Skip-Link, genau eine H1 pro Seite, robots.txt + wp-sitemap.xml ok, WebP-Auslieferung, responsive srcsets | – | – | – |

---

# AUFGABE 2 – VIBE / BRAND-DECODING

**Was das Unternehmen macht:** Bauunternehmen im Rheinland (Würselen bei Aachen, Kerpen, Bensberg/Bergisch Gladbach) mit Fokus Wohn- und Einfamilienhausbau: Rohbau, Sanierung, Schlüsselfertigbau. Dazu – nur im Über-uns-Text erwähnt – Realisierung von Erschließungsgebieten als Partner von Städten und Gemeinden. Über 400 abgewickelte Projekte, sichtbares Team von 8 Personen inkl. zweier Geschäftsführer (Harald Vonhoegen, Henning Moewes). Kernversprechen laut Tagline: „Wir bauen mit Herz und Verstand" – der Firmenname selbst ist das Versprechen (planvoll = strukturiert, verlässlich).

**Aktueller Vibe:** solide, bieder, zurückhaltend, generisch – „seriöse Broschüre von 2021". Warmes Orange und viel Weiß erzeugen Sauberkeit, aber keine Persönlichkeit. Renderings statt echter Fotos geben der Marke etwas Katalogshaftes.

**Wahrscheinlich GEWOLLTER Vibe:** vertrauenswürdig, präzise, persönlich-regional, qualitätsbewusst – der verlässliche Partner für die größte Investition des Lebens. Die Assets dafür existieren (Name! 15-Schritte-Prozess! echtes Team! 400 Projekte!) – sie werden nur nicht inszeniert.

**Zielgruppe & Positionierung:** Primär private Bauherren 30–55 im Speckgürtel Aachen–Köln, Budget grob 400–800 k€, sicherheitsorientiert; Vergleichsrahmen: Fertighaus-Anbieter (Weber, Fingerhaus etc.) und lokale Bauträger. Sekundär: Kommunen/Erschließungsträger (B2G). Positionierungschance: **„Der planvolle Massivbauer aus der Region"** – gegen anonyme Kataloganbieter (persönlicher, massiv, lokal) und gegen Einzel-Bauunternehmer (prozesssicherer, größer, 3 Standorte).

**5 Adjektive für die neue Seite:** verlässlich · präzise · persönlich · regional verwurzelt · hochwertig.

## Offene Rückfragen (vor Design-Start beantworten!)

1. **Referenzbilder:** Die gezeigten Projekte wirken wie 3D-Renderings/Platzhalter. Gibt es echte Fotos gebauter Häuser (und Freigabe der Bauherren)? → Entscheidet über die Design-Richtung.
2. **Conversion-Ziel:** Wertvollster nächster Schritt eines Interessenten – Erstberatungstermin, Rückrufwunsch, Grundstücks-/Kataloganfrage? Wie kommen heute die meisten Leads rein?
3. **Zielgruppen-Gewichtung:** Wie wichtig ist das Kommunal-/Erschließungsgeschäft für die Website – eigener Bereich oder Nebensatz?
4. **System & Pflege:** Bleibt WordPress (wer pflegt Inhalte intern?), oder ist ein Neubau (statisch/Headless) eine Option?
5. **Markenspielraum:** Sind Logo und Orange gesetzt, oder ist ein Brand-Refresh Teil des Projekts?

---

# AUFGABE 3 – REDESIGN-KONZEPTE

## Richtung A – „Rheinisches Editorial" (Premium-Understatement)

- **Leitidee:** Die Website als Architektur-Magazin über die eigenen Projekte. Wertigkeit des Produkts spiegelt sich in ruhiger, großformatiger Gestaltung.
- **Moodboard:** Warmes Off-White/Greige, Charcoal statt Schwarz, Terracotta als weiterentwickeltes Marken-Orange; Vollbild-Projektfotografie mit natürlichem Licht; dünne Trennlinien, große Ziffern (Baujahr, Wohnfläche) als grafische Elemente.
- **Typo-Paarung:** Display-Serif mit Charakter (z. B. **Fraunces**, Freight Display) für Headlines + neutrale Grotesk (z. B. **Inter**, Söhne) für UI/Fließtext.
- **Farbpalette:** `#F7F4EF` (Warmweiß), `#26241F` (Charcoal), `#C4622D` (Terracotta, AA-geprüft abdunkelbar), `#8A8D7F` (Salbeigrau).
- **Layout-Prinzip:** Magazin-Grid mit wechselnden Bildformaten (Vollbild → 2-spaltig → Detail-Crop), vertikaler Rhythmus statt gleichförmiger Blöcke.
- **Motion:** Sanfte Scroll-Reveals (Fade + 24 px Translate, 400 ms, einmalig – Ruhe = Vertrauen); subtiler Parallax auf Hero-Fotografie; Zahlen-Counter („400+ Projekte") beim Einscrollen (inszeniert die aktuell unsichtbaren Beweise); Bild-Hover mit 1,03-Zoom + einfahrender Projektinfo (macht Referenzen als klickbar erkennbar → direkter Conversion-Fix).
- **Risiko:** Steht und fällt mit echter, guter Fotografie.

## Richtung B – „Der Bauplan" (Präzision als Markenerlebnis) ⭐ EMPFOHLEN

- **Leitidee:** Der Firmenname wird zum Designsystem. Alles erzählt „Plan": feine Rasterlinien, Maßketten, Nummerierungen, technische Labels. Kein Wettbewerber im Umfeld sieht so aus.
- **Moodboard:** Weiß mit hauchfeinem Blueprint-Raster, präzise Linienführung, nummerierte Sektionen (01–06), Architektur-Strichzeichnungen, die sich in echte Fotos auflösen (Plan → gebaute Realität = Kernstory der Firma).
- **Typo-Paarung:** Kräftige geometrische Grotesk (z. B. **Space Grotesk**, Archivo) für Headlines + Mono-Font (z. B. **IBM Plex Mono**) für Labels, Maße, Meta-Daten.
- **Farbpalette:** `#FFFFFF`/`#F5F3F0`, `#1A1C1E` (Tiefgrau), Marken-Orange `#B65A00` ausschließlich für CTAs und den „Fortschrittsstrich" (→ maximale CTA-Wirkung), `#2F4550` (Blaugrau als Plan-Referenz).
- **Layout-Prinzip:** Sichtbares 12er-Grid, Inhalte „vermaßt" (kleine Koordinaten-Labels), asymmetrische Layouts mit präzisen Ankerpunkten.
- **Motion (Herzstück):**
  - **Hero:** SVG-Hausumriss zeichnet sich in ~2 s selbst und blendet ins echte Projektfoto über („Vom Plan zum Haus") – erzählt das Geschäftsmodell in einer Animation.
  - **15-Schritte-Ablauf als Signature-Feature:** scroll-getriebene (scrubbed) Timeline – eine orange Linie „baut" sich beim Scrollen durch die Schritte, sticky Fortschrittsanzeige „Schritt 07/15". Verwandelt die 10.700-px-Textwand in das stärkste Conversion-Asset (Prozesssicherheit = adressiert die Kernangst der Bauherren).
  - **Vorher/Nachher-Slider** für Sanierungsprojekte (Prototyp liegt bereits im Repo: `index.html`).
  - **Micro-Interactions:** CTA-Hover mit „Vermessungs-Tick" (Linie zeichnet Unterkante); Formular als 3-Schritte-Stepper mit Fortschrittsbalken (gleiches Motiv wie Ablauf → konsistent, senkt Abbrüche).
- **Risiko:** Kann bei Übertreibung „kalt/technisch" wirken – braucht Team-Porträts und warme Fotografie als Gegengewicht.

## Richtung C – „Menschen & Handwerk" (warm, regional, nahbar)

- **Leitidee:** Nicht Häuser verkaufen, sondern die Menschen, die sie bauen. Die 8 vorhandenen Team-Porträts und Kundengeschichten tragen die Seite.
- **Moodboard:** Erdtöne (Sand, Terracotta, Tannengrün), Baustellen-Reportagefotografie (Hände, Material, Richtfest), großzügige Testimonial-Blöcke mit Porträts, Rheinland-Karte als grafisches Identitätselement.
- **Typo-Paarung:** Humanistische Sans (z. B. **General Sans**, Source Sans 3) + warme Serif für Zitate (z. B. **Lora** italic).
- **Farbpalette:** `#F5EFE6` (Sand), `#3E4A3D` (Tannengrün), `#D9764A` (warmes Terracotta), `#2B2B28` (Text).
- **Layout-Prinzip:** Story-getrieben: jede Sektion beantwortet eine Bauherren-Frage; Testimonials als roter Faden zwischen den Sektionen.
- **Motion:** Zurückhaltende Reveals; Testimonial-Slider mit Drag/Swipe; interaktive Standortkarte (Hover-Pins mit Ansprechpartner-Foto → Anruf-CTA); Formular-Micro-Feedback nach Absenden mit Foto des Ansprechpartners („Frau Drees meldet sich innerhalb von 24 h") – reduziert Anonymitäts-Angst im meist unterschätzten Conversion-Moment.
- **Risiko:** Am wenigsten differenziert – funktioniert nur mit richtig guter People-Fotografie.

## Empfohlene Section-Struktur der neuen Startseite (für alle Richtungen)

1. **Hero:** Nutzenversprechen + Subline (Region + Leistung) + primärer CTA „Kostenloses Erstgespräch" + sekundär „Projekte ansehen" + Trust-Bar (400+ Projekte · 3 Standorte · Gründungsjahr) — *In 3 Sekunden Was/Wo/Warum + Handlung*
2. **Leistungen** (3–4 Karten: Schlüsselfertig, Rohbau, Sanierung, Erschließung) — *das fehlende „Was" + SEO-Einstiege*
3. **Signature-Referenzen** (3 kuratierte echte Projekte, groß, klickbar) — *Beweis*
4. **Ablauf-Teaser:** interaktive Kurzfassung der 15 Schritte + CTA — *Differenzierung + Angstabbau*
5. **Warum Planvoller:** 3–4 harte USPs mit Zahlen — *Vergleichsargumente gegen Fertighaus-Anbieter*
6. **Team & Geschäftsführung:** echte Porträts + 1 Zitat — *Gesichter = Vertrauen*
7. **Kundenstimmen / Google-Bewertungen** — *Social Proof (aktuell 0 vorhanden)*
8. **Standorte** mit Karte + je Ansprechpartner — *Regional-USP + Local SEO*
9. **FAQ** (Kosten, Dauer, Grundstück, Festpreis) — *Einwandbehandlung + SEO-Longtail*
10. **Finaler CTA-Block:** Kurzformular (3 Felder) oder Terminbuchung + Telefon — *Conversion ohne Umweg*

Footer: Kontakt, Navigation, Legal — ohne WP-Login-Link.

## Empfehlung

**Richtung B („Der Bauplan"), angereichert mit der Fotografie-Wertigkeit aus A.** Begründung: (1) Der Markenname liefert die Design-Story frei Haus; (2) kein regionaler Wettbewerber besetzt „Präzision als Erlebnis"; (3) das stärkste vorhandene Asset – der 15-Schritte-Prozess – wird zum interaktiven Herzstück statt zur Textwand; (4) alle Motion-Konzepte zahlen auf das Kaufmotiv „Sicherheit/Kontrolle" ein, nicht auf Show. **Bedingung:** echte Projektfotos. Falls es die nicht gibt: stattdessen Richtung C (dann sind die Menschen das einzig echte Bildmaterial).

---

# Technische Fakten zum Ist-Zustand (fürs Redesign relevant)

- **Stack:** WordPress, Custom-Theme „planvoller" (made by braindinx), Gutenberg-Blöcke, jQuery 3.5.1, Slick-Slider, Masonry, Contact Form 7 (+ Honeypot), EWWW Image Optimizer (WebP + Lazyload), Usercentrics CMP (EU), Apache, HTTP/2
- **Ist-Farbvariablen:** `--color-primary: #b65a00` · `--color-primary-light: #ee8838` · `--color-primary-dark: #802e00` · `--color-secondary: #919587` · `--color-secondary-light: #c1c6b7` · `--color-secondary-dark: #63675a` · `--color-black: #333` · `--color-grey-dark: #757575` · `--color-grey: #d3d3d3` · `--color-grey-light: #f5f5f5`
- **Ist-Font:** Work Sans (einziger Webfont) + Font Awesome 5 (nur für 2 Icons geladen)
- **Seiten:** / · /planvoller/ · /ablauf/ · /referenzen/ · /blog/ · /kontakt/ · /impressum/ · /datenschutz/ (+ 5 Blogposts, letzter 23.01.2023)
- **Seitenhöhen (Desktop 1440 px):** Start 4.183 px · Über uns 4.823 px · Ablauf 10.712 px · Referenzen 2.597 px · Kontakt 1.752 px
- **Team (auf /planvoller/):** Harald Vonhoegen (GF, Gesellschafter & Rechnungswesen), Henning Moewes (Projektierung & Vertrieb, Gesellschafter), Dipl.-Ing. Corinna Heidemann M.Sc. (Bauleitung), Stephan Hummers + Ralf Puppe (Planung & Vertrieb), Anne Wiechert + Petra Drees + Doris Wolf (Technischer Innendienst)
- **Standorte:** Würselen (Morlaixplatz 15, 52146, +49 2405 6079832) · Kerpen (Ottostraße 4a, 50170, +49 2273 9918151) · Bensberg (Industrieweg 13, 51429 Bergisch Gladbach, +49 1774210010) · alle: info@planvoller.de
- **Dieses Repo enthält:** einen dependency-freien Vorher/Nachher-Bildvergleichs-Slider (`index.html` + `before.svg`/`after.svg` als Demos) – geplant als Baustein für Sanierungs-Referenzen in Richtung B

## Nächste Schritte

1. Die 5 Rückfragen (Aufgabe 2) beantworten – insbesondere Fotos & Conversion-Ziel
2. Design-Richtung wählen (A / B / C, Empfehlung: B)
3. Erst danach: Design-Konzept ausarbeiten und bauen
