# ── Stage 1: Build frontend (Debian/glibc) ───────────────────────────────────
FROM node:20-bookworm-slim AS frontend-build
WORKDIR /app

# Copy ONLY package.json (ignore Windows package-lock)
COPY frontend/package.json ./

# Install deps (this generates correct Linux optional deps)
RUN npm install --no-audit --no-fund

# Copy app source
COPY frontend/ .

# Build
RUN npm run build


# ── Stage 2: Nginx ──────────────────────────────────────────────────────────
FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /app/dist /usr/share/nginx/html
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
