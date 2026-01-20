FROM node:25-alpine

WORKDIR /app

# Copiar los archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]