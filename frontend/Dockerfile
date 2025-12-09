# Etapa de construcción
FROM node:20-alpine as build

WORKDIR /app

# Copiar los archivos de configuración
COPY package*.json ./
COPY tsconfig*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:1.26-alpine

# Copiar la configuración de nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos construidos desde la etapa de build
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]