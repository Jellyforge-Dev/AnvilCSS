# syntax=docker/dockerfile:1
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Vendors the real jellyfin-web static client straight from the official Jellyfin image —
# COPY --from also accepts any image reference, not just an earlier build stage.
FROM jellyfin/jellyfin:10.10.7 AS jellyfin-web

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY server ./server
COPY Jellyforge_AnvilCSS_logo.png ./
COPY --from=build /app/dist ./dist
COPY --from=jellyfin-web /jellyfin/jellyfin-web ./server/jellyfin-web
EXPOSE 8283
VOLUME ["/app/data"]
CMD ["node", "server/index.js"]
