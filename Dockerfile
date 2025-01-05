# Stage 1 : Construire l'application Angular
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2 : Servir l'application avec Nginx
FROM nginx:alpine
COPY --from=build-stage /app/dist/front-end /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]