FROM node:20.7.0 as build-stage
WORKDIR /app
COPY package*.json ./
COPY ./frontend .
RUN npm update
RUN npm run build

FROM nginx:1.24.0 as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/nginx.conf /etc/nginx/nginx.conf
EXPOSE 5003