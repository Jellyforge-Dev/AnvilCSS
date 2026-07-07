# syntax=docker/dockerfile:1
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# AnvilCSS builds to a single Tampermonkey/Violentmonkey userscript (dist/anvil-customizer.user.js).
# This container's only job is putting that file on the LAN: nginx serves dist/ as-is, so opening
# http://<nas-ip>:8283/anvil-customizer.user.js in a browser with Tampermonkey installed triggers
# its "install userscript" dialog directly — no backend, no build secrets, no runtime dependency.
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
