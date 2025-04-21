# Stage 1: Build the Angular application
FROM node:latest AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build --prod

# Stage 2: Serve the Angular application with Nginx
FROM nginx:latest

COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

EXPOSE 4200

#construir imagen
# docker build -t frontend:latest .