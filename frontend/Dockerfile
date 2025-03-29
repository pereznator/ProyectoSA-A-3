# Etapa 1: Compilación de la app Angular
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build -- --configuration production

# Etapa 2: Imagen ligera con Nginx para servir el frontend
FROM nginx:alpine

# Eliminar configuración por defecto y usar nuestra propia
RUN rm -rf /usr/share/nginx/html/*

# Copiar los archivos compilados desde la etapa builder
COPY --from=builder /app/dist/* /usr/share/nginx/html

# Copiar configuración personalizada para Angular
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
