# Etapa de construcción
FROM node:20-alpine AS build

WORKDIR /app

# Argumentos para variables de entorno
ARG VITE_API_URL
ARG VITE_SENTRY_DSN
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_SENTRY_DSN=$VITE_SENTRY_DSN

# Copiar los archivos de configuración
COPY package*.json ./
COPY tsconfig*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Construir la aplicación con la variable de entorno
RUN npm run build

# Etapa de producción
FROM nginx:1.29-alpine

# Copiar la configuración de nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos construidos desde la etapa de build
COPY --from=build /app/dist /usr/share/nginx/html

# Script para configurar el puerto y backend URL dinámicamente
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'PORT=${PORT:-80}' >> /docker-entrypoint.sh && \
    echo 'BACKEND_URL=${BACKEND_URL:-http://backend:5000}' >> /docker-entrypoint.sh && \
    echo 'sed -i "s/listen 80;/listen $PORT;/g" /etc/nginx/conf.d/default.conf' >> /docker-entrypoint.sh && \
    echo 'sed -i "s|BACKEND_URL_PLACEHOLDER|$BACKEND_URL|g" /etc/nginx/conf.d/default.conf' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

EXPOSE 80

CMD ["/docker-entrypoint.sh"]