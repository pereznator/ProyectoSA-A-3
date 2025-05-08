# Usa una imagen ligera de nginx
FROM nginx:alpine

# Copia los archivos de producción al contenedor
COPY ./dist/frontend/browser /usr/share/nginx/html

# Cambia la configuración para escuchar en 8080
RUN sed -i 's/listen\s\+80;/listen 8080;/' /etc/nginx/conf.d/default.conf

# Expone el puerto correcto para Cloud Run
EXPOSE 8080

# Arranca nginx
CMD ["nginx", "-g", "daemon off;"]
