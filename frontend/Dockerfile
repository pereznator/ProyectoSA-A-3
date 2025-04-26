# Usa una imagen ligera de nginx
FROM nginx:alpine

# Copia los archivos de producción al contenedor
COPY ./dist/frontend /usr/share/nginx/html

# Copia tu propio archivo de configuración de nginx (opcional)
# COPY nginx.conf /etc/nginx/nginx.conf

# Expone el puerto
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
