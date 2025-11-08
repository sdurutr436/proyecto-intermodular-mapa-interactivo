# Dockerfile básico para desarrollo - Sprint 1
FROM node:20-alpine

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 5000

# Comando de desarrollo
CMD ["npm", "run", "dev"]
