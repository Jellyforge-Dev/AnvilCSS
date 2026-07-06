# AnvilCSS via Portainer Stack installieren

Repo ist noch **privat** (`https://github.com/Jellyforge-Dev/AnvilCSS`, Branch `dev`). Portainer braucht dafür entweder ein Deploy-Token/PAT oder du klonst manuell auf den Server und lässt Portainer nur bauen. Unten beide Wege.

## Weg A — Portainer klont direkt aus GitHub (Repository-Stack)

Voraussetzung: Repo ist privat → GitHub Personal Access Token (PAT) mit `repo`-Scope nötig.

1. Portainer → **Stacks → Add stack**
2. Name: `anvilcss`
3. Build method: **Repository**
4. Repository URL: `https://github.com/Jellyforge-Dev/AnvilCSS`
5. Repository reference: `refs/heads/dev`
6. Compose path: `docker-compose.yml`
7. Authentication: aktivieren, Username = GitHub-Username, Password = dein PAT (nicht das GitHub-Passwort — GitHub verlangt hier ein Personal Access Token)
8. **Deploy the stack**

Portainer klont das Repo bei jedem Deploy neu und baut das Image lokal auf dem Server via `Dockerfile` (dauert beim ersten Mal etwas, da auch `jellyfin/jellyfin:10.10.7` als Basis für den Web-Client gezogen wird).

## Weg B — Repo manuell auf den Server klonen, Portainer nur bauen lassen

Falls kein PAT hinterlegt werden soll:

```bash
# auf dem Portainer-Host, per SSH
git clone -b dev https://github.com/Jellyforge-Dev/AnvilCSS.git /opt/anvilcss
```

Dann in Portainer:

1. **Stacks → Add stack**
2. Build method: **Upload** oder **Web editor**, Inhalt siehe unten
3. Wichtig: `build: .` im Compose funktioniert nur, wenn Portainer im selben Verzeichnis wie der Code läuft — dafür in Portainer unter **Advanced** den Stack als **"Additional files"**-Modus mit Pfad `/opt/anvilcss` konfigurieren, oder den Stack direkt aus dem geklonten Ordner heraus deployen (`docker compose up -d` per SSH ist hier oft einfacher als der Portainer-Stack-Editor).

## docker-compose.yml Inhalt (für Web-Editor-Variante)

```yaml
services:
  anvilcss:
    build: https://github.com/Jellyforge-Dev/AnvilCSS.git#dev
    container_name: anvilcss
    ports:
      - "8283:8283"
    environment:
      - PORT=8283
    volumes:
      - ./data:/app/data
    restart: unless-stopped
```

`build:` mit Git-URL (`#dev` = Branch) lässt Docker selbst klonen und bauen — kein manuelles Klonen nötig, funktioniert auch bei privaten Repos, wenn der Docker-Daemon auf dem Server Zugriff hat (SSH-Key oder eingebettetes Token in der URL: `https://<TOKEN>@github.com/Jellyforge-Dev/AnvilCSS.git#dev`).

## Nach dem Deploy

- Aufrufen: `http://<server-ip>:8283`
- Login: **AnvilCSS** / **JellyfinTheme**
- Daten (Themes, aktuelles Live-Theme) liegen persistent im Volume `./data` (bzw. dem von dir gemappten Pfad)
- Baudauer erster Start: einige Minuten, da Dockerfile das jellyfin-web-Frontend aus dem offiziellen `jellyfin/jellyfin:10.10.7`-Image zieht

## Repo öffentlich machen (empfohlen, spart PAT-Verwaltung)

GitHub → Repo → **Settings → General → Danger Zone → Change visibility → Public**. Danach reicht die reine Repository-URL in Portainer ohne Zugangsdaten.
