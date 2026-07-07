import type { WikiSection } from '../content';

export const WIKI_DE: WikiSection[] = [
  {
    id: 'getting-started',
    title: 'Erste Schritte',
    md: `# Erste Schritte

AnvilCSS baut ein komplettes **Custom-CSS-Theme für Jellyfin** — ganz ohne CSS-Kenntnisse.

## Der Ablauf

1. **Gestalten**: Theme über die Baukasten-Panels links zusammenstellen (Farben, Hintergrund, Logos, Komponenten).
2. **Beobachten**: Jede Änderung wirkt sofort auf deiner echten, laufenden Jellyfin-Seite — es gibt keine separate Vorschau zum Umschalten; die Seitenleiste schwebt direkt über der echten Oberfläche, die du gerade gestaltest.
3. **Verfeinern**: Der Code-Editor rechts zeigt das generierte CSS im Klartext — direkt editierbar.
4. **Exportieren**: Im Export-Panel CSS kopieren oder \`jellyfin-theme.css\` herunterladen.
5. In Jellyfin **Dashboard → Allgemein → Benutzerdefiniertes CSS** öffnen, einfügen, speichern. Fertig.

## Gut zu wissen

- **Rückgängig** (↶ in der Kopfleiste) macht jede Baukasten-Änderung, jeden Snippet-Import und jedes Preset rückgängig.
- **Reset** stellt Jellyfins Standard-Dunkelthema wieder her.
- Der **Theme-Pool** speichert beliebig viele Entwürfe im \`localStorage\` deines Browsers — sie überleben Neuladen (pro Browser/Profil, nicht geräteübergreifend synchronisiert).
- AnvilCSS läuft als kleines Userscript direkt in deinem echten Jellyfin-Tab — jeder Regler spricht Jellyfins tatsächliches DOM und dieselben Klassennamen an (\`.skinHeader\`, \`.cardBox\`, \`.button-submit\`, …), live. Es gibt keinen separaten Nachbau, der aus dem Takt geraten könnte.`
  },
  {
    id: 'colors',
    title: 'Farbpalette',
    md: `# Farbpalette

Jellyfin-Themes nutzen keine CSS-Variablen — jede Farbe wird direkt in Regeln geschrieben, die Jellyfins Skin-Klassen ansprechen. AnvilCSS verwaltet sechs Rollen:

| Rolle | Verwendet für | Jellyfin-Selektoren (Beispiele) |
|-------|---------------|--------------------------------|
| **Akzent** | Buttons, Links, Fortschritt, Auswahl | \`.button-submit\`, \`.navMenuOption-selected\`, \`.itemProgressBarForeground\` |
| **Hintergrund** | Seitenfläche | \`html\`, \`.backgroundContainer\` |
| **Oberfläche** | Header, Dialoge, Listen | \`.skinHeader-withBackground\`, \`.paperList\` |
| **Erhöht** | Buttons, Toasts | \`.raised\`, \`.fab\`, \`.toast\` |
| **Text primär** | Haupttext | \`html\`, \`.skinHeader\` |
| **Text sekundär** | Untertitel, Labels | \`.cardText-secondary\`, \`.inputLabel\` |

## Werkzeuge

- **Zufallstheme** würfelt eine harmonische Kombination: ein Basis-Farbton, eine Schema-Rotation (analog, komplementär oder triadisch) für den Akzent, dunkle Flächen aus demselben Farbton abgeleitet.
- **Palette aus Bild** extrahiert die dominanten Farben des aktuellen Hintergrundbilds per Median-Cut-Quantisierung, weist die dunkelsten Hintergrund/Oberfläche/Erhöht zu und die kräftigste dem Akzent — anschließend wird der Textkontrast automatisch korrigiert.
- **Kontrast korrigieren** passt beide Textfarben an, bis sie die **WCAG**-Verhältnisse gegen deinen Hintergrund erfüllen: 7:1 für Primärtext (AAA) und 4,5:1 für Sekundärtext (AA). Die Badges neben den Textfarben zeigen das aktuelle Verhältnis live.`
  },
  {
    id: 'background',
    title: 'Hintergrund',
    md: `# Hintergrund

Vier Hintergrund-Typen stehen zur Wahl:

- **Nur Farbe** — die flache Hintergrundfarbe aus der Palette.
- **Gradient** — zwei Farben und ein Winkel, angewendet auf \`html\` und \`.backgroundContainer\`.
- **Bild per URL** — jede erreichbare Bild-URL. Sie wird wörtlich ins CSS geschrieben und muss von jedem Gerät erreichbar bleiben, das das Theme nutzt.
- **Bild-Upload** — die Datei wird als Base64-Data-URI ins CSS eingebettet. Kein Hosting nötig, aber die CSS-Datei wächst um ca. 135 % der Bildgröße — Größenanzeige im Export-Panel beachten.

## Regler

- **Skalierung** — \`cover\` füllt den Bildschirm (schneidet ggf. zu), \`contain\` zeigt das ganze Bild (ggf. mit Rändern).
- **Position X/Y** — welcher Bildausschnitt beim Zuschneiden sichtbar bleibt (50/50 = zentriert).
- **Overlay** — eine getönte Ebene zwischen Bild und UI. Höhere Deckkraft hält Poster und Text auf unruhigen Wallpapern lesbar.
- **Blur** — weichzeichnen in px. Umgesetzt per \`filter: blur()\` auf \`.backgroundContainer\` mit leichtem Scale-up gegen unscharfe Ränder.

**Tipp:** Der Wallpaper-Tab im Katalog lädt die wöchentliche Wallhaven-Topliste — ein Klick setzt den Hintergrund, ein zweiter extrahiert die passende Palette.`
  },
  {
    id: 'logos',
    title: 'Logos & Branding',
    md: `# Logos & Branding

Jellyfin zeigt sein Branding an fünf Stellen. AnvilCSS ersetzt jede davon per CSS, soweit technisch möglich:

1. **Header-Logo** — das Banner oben links. Ersetzt per \`background-image\` auf \`.pageTitleWithLogo\` / \`.pageTitleWithDefaultLogo\` mit \`background-size: contain\`.
2. **Login-/Splash-Logo** — das Logo auf der Anmeldeseite und dem Lade-Splash. Ersetzt per \`content: url()\` auf \`.imgLogoIcon\` und \`background-image\` auf \`.splashLogo\`.
3. **Splashscreen-Hintergrund** — ein Vollbild hinter dem Lade-Splash (\`html.preload\` und Splash-Container).
4. **Favicon** — ⚠ **per CSS nicht änderbar.** Browser laden das Favicon vom Server, bevor irgendein Stylesheet greift. Der Slot zeigt trotzdem eine Vorschau; zum echten Tausch \`favicon.ico\` im \`jellyfin-web\`-Ordner auf dem Server ersetzen.
5. **Android-TV-Banner** — das Logo im TV-Layout, angesprochen über \`.layout-tv\`-Regeln. Hinweis: Das wirkt nur in web-basierten TV-Clients; die native Android-TV-App lädt kein Custom CSS.

Jeder Slot akzeptiert **URL oder Upload** (Uploads werden als Data-URI eingebettet) und zeigt bei gesetztem Bild immer eine **Mini-Vorschau**. SVGs aus der Logo-Suche des Katalogs funktionieren ebenfalls — vor dem Anwenden umfärbbar.`
  },
  {
    id: 'components',
    title: 'Komponenten',
    md: `# Komponenten

Feinsteuerung für Jellyfins UI-Bausteine:

## Typografie
- **Schriftart** — kuratierte Webfonts (per \`@import\` von Google Fonts) oder ein eigener \`font-family\`-String. Icon-Fonts sind explizit geschützt, Material Icons rendern weiter.
- **UI-Textgröße** — skaliert \`html { font-size }\` von 80 % bis 130 %. Jellyfin misst alles in em, daher skaliert die gesamte UI proportional.

## Buttons
- **Eckenradius** 0–28 px, **Füllstil** (gefüllt / Umriss / dezente Tönung) und **Hover-Effekt** (aufhellen, anheben, glühen, keiner).

## Karten
- **Eckenradius** für Poster und Thumbnails (\`.cardBox\`, \`.cardImageContainer\`, …).
- **Hover-Effekt** — anheben (Schweben + Schatten), glühen (Akzent-Halo), Zoom (Bildvergrößerung) oder keiner.

## Fortschrittsbalken
- **Stil**: flach, abgerundet, glühend oder gestreift; **Höhe** 2–16 px. Gilt für die Fortsetzen-Balken auf Karten (\`.itemProgressBar\`) — der Player-Slider folgt der Akzentfarbe.

## Rahmen-UI
- **Header**: solide, komplett transparent oder Milchglas-Blur (\`backdrop-filter\`).
- **Seitenmenü**: solide, schwebend (abgesetzt, abgerundet, Schatten) oder transluzent mit Blur.
- **Aktiver Tab**: Unterstreichung, Pille oder Block-Hervorhebung.
- **Animationsgeschwindigkeit**: aus / langsam / normal / schnell — skaliert alle Übergangszeiten, „aus" deaktiviert auch Jellyfins eigene Animationen.`
  },
  {
    id: 'editor',
    title: 'Code-Editor',
    md: `# Code-Editor

Das rechte Fenster zeigt das **komplette generierte CSS im Klartext** — mit Syntax-Highlighting, Zeilennummern, voll editierbar. Jeder Tastendruck fließt nach ~0,3 s in die Live-Vorschau zurück.

## Wie Edits und Baukasten koexistieren

Das Dokument hat zwei Bereiche, getrennt durch eine Marker-Kommentarzeile:

- **Über dem Marker** — der generierte Block. Du *kannst* ihn frei bearbeiten; deine Version gilt für Vorschau und Export. Der Editor zeigt dann einen **„editiert"**-Chip: Die manuelle Fassung bleibt aktiv, **bis du einen Baukasten-Regler änderst** — das regeneriert den Block. **Regenerieren** im Chip verwirft manuelle Edits gezielt.
- **Unter dem Marker** — dein Bereich. Alles hier **überlebt jede** Baukasten-Änderung. Importierte Community-Themes, Snippets und eigene Regeln landen hier.

## Tipps

- \`@import\`-Zeilen werden beim Export automatisch an den Dateianfang gehoben (CSS verlangt Imports vor allen anderen Regeln), egal wo du sie schreibst.
- Löschst du die Marker-Zeile, gilt das gesamte Dokument als manuelle Übersteuerung — der Baukasten schreibt nichts mehr um, bis du Regenerieren klickst.
- Nutze beim Editieren den Ansichts-Umschalter der Vorschau: Player-Selektoren (\`.videoOsdBottom\`, \`.mdl-slider-*\`) sind nur in der Player-Ansicht sichtbar.`
  },
  {
    id: 'catalog',
    title: 'Katalog',
    md: `# Katalog

Drei Quellen für fertiges Material:

## Presets
30 eingebaute AnvilCSS-Themes (Palette + Komponenten-Einstellungen). Ein Preset **ersetzt** den aktuellen Baukasten-Zustand — Rückgängig bringt dich zurück.

## Community-Themes
25 kuratierte Komplett-Themes aus der [awesome-jellyfin](https://github.com/awesome-jellyfin/awesome-jellyfin)-Liste (Scyfin, Catppuccin, JellySkin, Ultrachromic, ElegantFin, …). **Import** fügt eine \`@import url(…)\`-Zeile in deinen Custom-CSS-Bereich ein — das Theme lädt direkt vom CDN, live, in deinem echten Jellyfin-Tab. Deine Baukasten-Einstellungen bleiben obendrauf aktiv; so kombinierst du eine Community-Basis mit eigener Akzentfarbe. Credits und Repo-Links stehen auf jeder Karte.

## Snippets
27 kleine, in sich geschlossene CSS-Tweaks (Gesehen-Häkchen ausblenden, runde Darsteller-Porträts, schmale Scrollbalken, …). Landen als Klartext im Custom-Bereich, dort editierbar.`
  },
  {
    id: 'pool',
    title: 'Theme-Pool',
    md: `# Theme-Pool

Der Pool ist deine lokale Theme-Bibliothek.

- **Speichern** legt den kompletten aktuellen Zustand (alle Panels + Custom CSS) unter einem Namen ab.
- **Laden** wendet ein gespeichertes Theme auf den Baukasten an (aktuelle Arbeit wird ersetzt — Rückgängig funktioniert).
- **Überschreiben** aktualisiert ein gespeichertes Theme mit dem aktuellen Zustand.
- **Umbenennen** und **Löschen** verwalten die Liste.

## Wo liegt das?

Im \`localStorage\` deines Browsers, auf der Jellyfin-Domain, die du gerade gestaltest — nichts geht an einen Server. Es überlebt Neuladen und Neustarts, ist aber an dieses Browser-Profil gebunden: Auf einem anderen Gerät oder Browser taucht es nicht auf, ohne dass du das CSS von Hand exportierst und wieder importierst.

**Hinweis:** Gespeicherte Themes enthalten hochgeladene Bilder (als Data-URIs) — ein Pool mit vielen bildlastigen Themes kann groß werden. Kein Problem, aber beim Backup bedenken.`
  },
  {
    id: 'export',
    title: 'Export & Installation',
    md: `# Export & Installation

## Exportieren

- **CSS kopieren** legt das komplette Theme in die Zwischenablage.
- **Herunterladen** speichert \`jellyfin-theme.css\`.
- Die **Größenanzeige** aktualisiert live. Reine Farbthemes sind wenige KB; eingebettete Bilder (Uploads) dominieren die Größe. Ab **1 MB** erscheint eine Warnung — Jellyfin akzeptiert auch großes Custom CSS, aber jeder Client lädt es bei jedem Start, schlank ist besser.

## Serverweit installieren (alle Benutzer)

1. Jellyfin als Administrator öffnen.
2. **Dashboard → Allgemein**.
3. Zu **Benutzerdefiniertes CSS** scrollen, Theme einfügen.
4. **Speichern** — verbundene Clients übernehmen den Stil beim nächsten Neuladen.

## Pro Benutzer installieren

**Einstellungen → Anzeige → Benutzerdefiniertes CSS** gilt nur für ein Konto und kann das Server-Theme zusätzlich *übersteuern*, wenn „vom Server bereitgestelltes CSS deaktivieren" angehakt ist.

## Welche Clients sind betroffen?

Custom CSS wirkt in jedem Client, der jellyfin-web einbettet: Browser, die Desktop-App (Jellyfin Media Player) und WebView-basierte TV-Clients. Rein native Apps (native Screens der Mobil-Apps, natives Android TV) ignorieren es.`
  },
  {
    id: 'limitations',
    title: 'Grenzen & Ehrlichkeit',
    md: `# Grenzen & Ehrlichkeit

Dinge, die Custom CSS prinzipiell **nicht** kann — kein Tool kann das, auch dieses nicht:

- **Favicon** — wird vom Server ausgeliefert, bevor CSS lädt. Stattdessen \`favicon.ico\` im \`jellyfin-web\`-Ordner ersetzen (das Logos-Panel erklärt es an Ort und Stelle).
- **Der allererste Splash-Frame** — der Ladebildschirm erscheint einen Moment, bevor dein CSS geladen ist; der Standard-Hintergrund kann kurz aufblitzen.
- **Native Apps** — die native Android-TV-App und native Screens der Mobil-Apps rendern kein Web-CSS.
- **E-Mail-Vorlagen, Bild-Assets in Metadaten** — außerhalb des Web-UI-DOM.

Und eine ehrliche Anmerkung dazu, wie das Ganze technisch läuft:

- AnvilCSS ist ein Userscript (Tampermonkey/Violentmonkey) — eine dieser Erweiterungen muss installiert und das Script auf deiner Jellyfin-Domain aktiv sein. Es gibt keine Server-Komponente, die dein Theme von sich aus anwendet.
- Die Seitenleiste existiert nur in deinem eigenen Browser-Tab. Andere Nutzer desselben Jellyfin-Servers sehen sie und deine Entwürfe nicht — serverweit/geteilt ist nur das CSS, das du tatsächlich unter **Dashboard → Allgemein → Benutzerdefiniertes CSS** (oder im eigenen Benutzerdefinierten CSS eines Kontos) einfügst.`
  }
];
