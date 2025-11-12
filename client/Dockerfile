# Dockerfile para desarrollo - Sprint 4 Parcial (WorldMap)
FROM node:20-alpine

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
# Incluye: react, react-dom, react-simple-maps, typescript, vite
RUN npm install

# Copiar código fuente
COPY . .

# Exponer puerto de Vite
EXPOSE 5173

# Comando de desarrollo con host habilitado para Docker
CMD ["npm", "run", "dev", "--", "--host"]
