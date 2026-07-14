# Offene & schwierige Punkte — Planvoller-Website

Stand: 13. Juli 2026 · Branch `claude/planvoller-award-site-h7bf45`
Die Website (v3, hell & klassisch) ist technisch fertig und geprüft. Diese Liste
sammelt alles, was **vor dem Livegang** geklärt werden muss oder eine
Entscheidung des Unternehmens braucht.

---

## 1. Kritisch vor Livegang (blockierend)

### 1.1 Formular-Backend fehlt
Das Bauanfrage-Formular hat noch keinen Versand-Endpoint. Aktuell öffnet der
Absenden-Button ersatzweise einen E-Mail-Entwurf an info@planvoller.de.
- **Nötig:** Formular-Endpoint des Hosters (oder Dienst wie Formspree o. ä.).
- **Einbau:** eine Zeile — `data-endpoint="…"` am `<form>` in `kontakt.html`.
- **Wer:** Hoster/IT liefert URL → Einbau dauert 2 Minuten.

### 1.2 Bildrechte der Renderings
Die fünf Hausrenderings (Hero, Referenzen) wurden hochgeladen — es muss
sichergestellt sein, dass **Nutzungsrechte für die Web-Veröffentlichung**
vorliegen (Quelle/Lizenz dokumentieren). Renderings aus Katalogen von
Haus-Anbietern dürfen ohne Lizenz nicht als eigene Referenzen gezeigt werden.
- **Risiko:** Abmahnung wegen Urheberrechtsverletzung.
- **Wer:** Geschäftsführung klärt Herkunft; im Zweifel durch eigene Fotos ersetzen.

### 1.3 Rechtstexte anwaltlich prüfen lassen
Impressum und Datenschutzerklärung sind sorgfältig erstellt (Registerdaten
Amtsgericht Aachen, HRB 21620 sind eingetragen; Datenschutz umfasst
Speicherdauer, Betroffenenrechte, LDI NRW, § 25 TDDDG, TLS) — sie ersetzen
aber **keine Rechtsberatung**.
- **Wer:** Anwalt/Datenschutzbeauftragter, einmalig vor Livegang.

### 1.4 § 34c GewO — Aufsichtsbehörde im Impressum?
Laut Handelsregister ist der Unternehmenszweck **Bauüberwachung,
Projektsteuerung und Koordination** (keine eigenen Bauhandwerksleistungen).
Wird eine erlaubnispflichtige Tätigkeit nach § 34c GewO ausgeübt
(Bauträger/Baubetreuung), **muss** die zuständige Aufsichtsbehörde ins
Impressum (i. d. R. StädteRegion Aachen). Platz dafür ist im Markup als
Kommentar vorbereitet.
- **Wer:** Geschäftsführung weiß, ob eine 34c-Erlaubnis besteht.

---

## 2. Inhaltlich zu verifizieren (braucht Wissen des Unternehmens)

### 2.1 Positionierung „Wir bauen …"
Die Website sagt durchgängig „Wir bauen mit Herz und Verstand", „massiv
gebaut". Der Registerzweck ist Bauüberwachung/Projektsteuerung. Marketingüblich
ist das vertretbar — es sollte aber bewusst entschieden werden, ob die
Formulierungen zur tatsächlichen Vertragsrolle passen (Werbeaussagen können
wettbewerbsrechtlich angreifbar sein, wenn sie in die Irre führen).

### 2.2 Referenzprojekte: Namen, Jahre, Fakten
Die fünf Referenzen (Stadtvilla Reichert 2017, Stadtvilla Mörs 2020, Landhaus
Steves 2018, Haus Barth 2018, Kubus Hallig 2020) samt Projektdaten stammen aus
früherem Material dieser Session. Bitte prüfen:
- Stimmen Namen und Fertigstellungsjahre?
- Dürfen die Kundennamen öffentlich genannt werden (Einwilligung)?
- Foto-Zuordnung bestätigen (meine Zuordnung war eine Annahme):
  1. rote/weiße Stadtvilla → Reichert (auch Startseiten-Hero)
  2. weiße Stadtvilla am Teich → Mörs
  3. rotes Satteldach → Steves
  4. Bungalow mit Pultdächern → Barth (Texte darauf angepasst; Dateiname
     `referenz-stadthaus-barth.html` bewusst beibehalten)
  5. weißer Kubus → Hallig

### 2.3 Standortdaten
Adressen und Telefonnummern (Würselen Morlaixplatz 15, Kerpen Ottostraße 4a,
Bensberg Industrieweg 13) bitte final bestätigen — sie stehen im Footer, auf
der Kontaktseite und in den JSON-LD-Strukturdaten.

### 2.4 Vorher/Nachher-Bilder
`before.jpg`/`after.jpg` speisen den Regler auf der Startseite. Ideal wären
zwei Aufnahmen **desselben Projekts** aus gleicher Perspektive — bitte prüfen,
ob die aktuellen Bilder das erfüllen.

---

## 3. Entscheidungen, die anstehen

### 3.1 Hosting & Livegang
- Wo wird gehostet (bestehender Hoster von planvoller.de?), wer spielt die
  Dateien ein? Die Site ist statisch — jeder Webspace genügt, kein Build nötig.
- Alternativ: GitHub Pages als kostenlose Vorschau/Hosting (Aktivierung
  braucht Admin-Rechte im Repo: Settings → Pages → Branch wählen).
- TLS/HTTPS muss aktiv sein (Datenschutzerklärung verweist darauf).

### 3.2 Branch-Strategie
Alle Arbeit liegt auf `claude/planvoller-award-site-h7bf45`. Offen: Merge in
den Hauptbranch / Pull Request gewünscht?

### 3.3 Blog
Die Übersicht zeigt 5 Beiträge „In Vorbereitung" — es existieren noch keine
Beitragsseiten. Entscheiden: Blog zum Start füllen, später nachliefern oder
den Menüpunkt vorerst ausblenden?

---

## 4. Empfohlen, nicht blockierend

| Punkt | Aufwand | Nutzen |
| --- | --- | --- |
| **Mehr Bilder je Referenz** (aktuell 1 Rendering pro Projekt; Galerien wurden entfernt) | Fotos liefern | Detailseiten wirken reicher |
| **404-Fehlerseite** (hosting-abhängig einzurichten) | klein | sauberere UX bei toten Links |
| **Google Search Console** einrichten, `sitemap.xml` einreichen | klein | schnellere Indexierung |
| **Echte Projektfotografie** statt Renderings | Fototermin | Glaubwürdigkeit („Gebaut. Bezogen. Bewohnt.") |
| **Datenschutz: Hosting-Anbieter namentlich nennen** sobald bekannt (inkl. AV-Vertrag) | 1 Satz | vollständige Transparenz nach Art. 13 DSGVO |
| **Barrierefreiheit (BFSG)**: Site ist bereits weitgehend barrierefrei (Tastatur, Kontraste, reduced motion). Als Kleinstunternehmen i. d. R. ausgenommen — bei Wachstum erneut prüfen | — | Rechtssicherheit |

---

## 5. Bereits erledigt (zur Einordnung)

- Komplett-Redesign v3: hell & klassisch, Markenfarben aus dem Logo,
  5 Renderings eingebaut, 15-Schritte-Sektion ohne Fotos (Phasen-Karten +
  Timeline), ~600 KB JavaScript-Ballast entfernt.
- Impressum: Registergericht Amtsgericht Aachen + HRB 21620 recherchiert und
  eingetragen; Geschäftsführer stimmt mit Register überein.
- Datenschutzerklärung vervollständigt (Stand Juli 2026); kein Verweis mehr
  nötig auf die 2025 eingestellte EU-ODR-Plattform.
- Technisches Audit: alle Links, Bilder, JSON-LD, Überschriften, CSS-Klassen
  geprüft; alle 13 Seiten im Browser getestet (Desktop + Mobil): 0 Fehler.
- `sitemap.xml` vollständig (13 Seiten), Share-Links URL-kodiert,
  `noscript`-Fallback im Formular.

---

## 6. Neu offen seit Conversion-Ausbau (Juli 2026)

| Punkt | Was gebraucht wird | Bis dahin |
| --- | --- | --- |
| **Kundenstimmen sind Platzhalter** (Startseite, Referenzen-Übersicht, Bauherren-Zitate auf den 5 Referenzseiten) | Echte, schriftlich freigegebene Zitate der Bauherren | Texte sind plausibel formuliert, aber im Quelltext als `PLATZHALTER` markiert — vor Livegang zwingend ersetzen oder entfernen |
| **Preisspannen bestätigen** (Blog „Was kostet ein Massivhaus?", FAQ, Ratgeber-PDF: 2.400–3.400 €/m², 15–20 % Nebenkosten) | Freigabe/Korrektur der Spannen durch Planvoller | Als „marktübliche Orientierung, kein Angebot" gekennzeichnet |
| **Ratgeber-PDF: Lead-Erfassung** | Newsletter-/Formulardienst (z. B. Brevo, Mailchimp), dann Download gegen E-Mail-Adresse | PDF ist frei herunterladbar (ohne Anmeldung) |
| **Google Business Profile** je Standort anlegen/pflegen und mit den neuen Standortseiten verlinken | Zugang zum Google-Konto | Standortseiten verlinken auf Google-Maps-Suche |
| **Formular-Endpoint** (unverändert offen) | Server-Endpoint oder Formulardienst; dann `data-endpoint` am Formular setzen | Absenden öffnet einen E-Mail-Entwurf |
