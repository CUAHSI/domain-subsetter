# in order to get the required .env, context must be app/
# docker build -f app/frontend/Dockerfile app/
FROM node:20.9.0 as build-stage
# WORKDIR /tmp
# COPY *env* ./
# RUN [ -f ".env" ] || cp env.template .env
# RUN grep '^VITE' .env > /.env

WORKDIR /app
COPY frontend/package.json ./
COPY frontend/package-lock.json ./
RUN npm install
ADD frontend .
RUN npm run build

# Production layer
FROM caddy:2.7.6-alpine as prod

# COPY --from=build-stage .env .env
# Install envsubst command for replacing __env files
# RUN set -x \
#   && apk add gettext libintl

COPY frontend/docker-entrypoint.sh /usr/local/bin/

# Copy config
COPY frontend/caddy.docker.json /etc/caddy/caddy.json

# Copy source dist
COPY --from=build-stage /app/dist /srv

EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["caddy", "run", "--config", "/etc/caddy/caddy.json"]