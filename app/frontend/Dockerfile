# in order to get the required .env, context must be app/
# docker build -f app/frontend/Dockerfile app/
FROM node:20.9.0 as build-stage
WORKDIR /tmp
COPY *env* ./
RUN [ -f ".env" ] || cp env.template .env
RUN grep '^VITE' .env > /.env

WORKDIR /app
ADD frontend .
RUN npm update
RUN npm run build

FROM nginx:1.24.0 as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY --from=build-stage .env .env
COPY --from=build-stage /app/nginx.conf /etc/nginx/nginx.conf
EXPOSE 5003