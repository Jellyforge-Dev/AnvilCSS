# syntax=docker/dockerfile:1
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# AnvilCSS is a fully static, client-side app — no Node/Express runtime, no backend, no tokens.
# The build stage's dist/ output is all nginx ever needs to serve.
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
