# 🌍 MAPA TRADUCTOR INTERACTIVO

> **Sprint 2 Completado** - Backend Base y Base de Datos

> 🐳 **IMPORTANTE**: Con Docker, **NO necesitas** ejecutar `npm install`. Las dependencias se instalan automáticamente dentro de los contenedores. Solo ejecuta: `docker-compose up -d --build`

Este proyecto consiste en un mapa interactivo del mundo, donde cada país se muestra con colores personalizados y efectos visuales al pasar el cursor. La funcionalidad principal permite al usuario escribir una palabra en un cuadro de texto y, al hacer clic en un país, esta palabra se traduce automáticamente al idioma oficial del país seleccionado.

Este proyecto combina interactividad, visualización geográfica y traducción automática, lo que lo hace útil para aplicaciones educativas, demostraciones lingüísticas o juegos didácticos de idiomas.

## 📋 TABLA DE CONTENIDOS

- [Información del Equipo](#información-del-equipo)
- [Estado del Proyecto](#estado-del-proyecto)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [API Backend](#api-backend)
- [Base de Datos](#base-de-datos)
- [Enlaces a Documentos](#enlaces-a-los-documentos-de-la-propuesta)
- [❓ FAQ - Preguntas Frecuentes](FAQ.md)

---

## 👥 INFORMACIÓN DEL EQUIPO

- **Sergio Durán Utrera**
- **Manolo Cárdeno Sánchez**
- **Francisco José Redondo González**

---

## 📊 ESTADO DEL PROYECTO

### ✅ Sprint 2 - Backend Base y Base de Datos (COMPLETADO)

- [x] Issue 2.1: MongoDB configurado en Docker
- [x] Issue 2.2: Módulo de conexión a base de datos
- [x] Issue 2.3 y 2.4: Modelo Translation con schema completo
- [x] Issue 2.5: Server.js con Express y middleware
- [x] Issue 2.6: Variables de entorno configuradas
- [x] Issue 2.7 y 2.8: Rutas API y endpoint de prueba
- [x] Issue 2.9: Mapeos de países e idiomas (150+ países)
- [x] Issue 2.12: Documentación de API

### 🚧 Próximos Sprints

- [ ] Sprint 3: Integración de APIs de Traducción
- [ ] Sprint 4: Frontend Base y Componentes UI
- [ ] Sprint 5: Mapa Interactivo y Conexión Frontend-Backend
- [ ] Sprint 6: Dockerización, Despliegue y Optimización

---

## 🛠️ STACK TECNOLÓGICO

### Backend
- **Node.js** 20
- **Express.js** - Framework web
- **MongoDB** 7.0 - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB

### Frontend (Próximos Sprints)
- **React** 18
- **TypeScript**
- **Vite** - Build tool
- **react-simple-maps** - Componente de mapa interactivo

### DevOps
- **Docker & Docker Compose**
- **dotenv** - Variables de entorno

---

## 📁 ESTRUCTURA DEL PROYECTO

```
MapaTraductorInteractivo_Sprints/
│
├── client/                    # Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   ├── styles/           # Archivos CSS
│   │   └── App.tsx           # Componente principal
│   ├── Dockerfile
│   └── package.json
│
├── server/                    # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js            # ✅ Configuración MongoDB
│   ├── models/
│   │   └── Translation.js   # ✅ Modelo de datos
│   ├── routes/
│   │   └── api/
│   │       └── translate.js # ✅ Rutas de traducción
│   ├── data/
│   │   ├── countryLanguageMap.js    # ✅ Mapeo país-idioma
│   │   └── countryCodeMapping.js    # ✅ Mapeo nombre-código
│   ├── .env                 # ✅ Variables de entorno
│   ├── .env.example         # ✅ Template de variables
│   ├── server.js            # ✅ Servidor Express
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml        # ✅ Orquestación de servicios
└── README.md                 # ✅ Este archivo

✅ = Completado en Sprint 2
```

---

## 🚀 INSTALACIÓN

### Requisitos Previos

#### Con Docker (Recomendado) ⭐
- ✅ **Docker Desktop** instalado y corriendo
- ✅ **Git**
- ❌ **NO necesitas** Node.js
- ❌ **NO necesitas** ejecutar `npm install`
- ❌ **NO necesitas** MongoDB instalado

#### Sin Docker
- ✅ **Node.js** 20+
- ✅ **MongoDB** Community Edition
- ✅ **Git**
- ⚠️ **Sí necesitas** ejecutar `npm install` manualmente

### Instalación con Docker (Recomendado) ⭐

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd MapaTraductorInteractivo_Sprints
   ```

2. **Iniciar servicios con Docker Compose**
   ```bash
   docker-compose up -d --build
   ```
   
   **¡Eso es todo!** 🎉 Las dependencias (`mongoose`, `react-simple-maps`, etc.) se instalan **automáticamente** dentro de los contenedores.

3. **Acceder a la aplicación**
   - **Frontend (Mapa Interactivo)**: http://localhost:5173
   - **Backend (API)**: http://localhost:5000
   - **Health Check**: http://localhost:5000/health
   - **MongoDB**: localhost:27017

> **Nota**: Con Docker **NO necesitas** ejecutar `npm install` manualmente. Los Dockerfiles ya lo hacen por ti.

### 🗺️ Visualizar el Mapa

Abre http://localhost:5173 en tu navegador y verás:
- ✅ Mapa mundial interactivo
- ✅ Países clickeables con efectos hover
- ✅ Navegación completa del mapa
- ⚠️ Funcionalidad de traducción pendiente (Sprint 3)

---

### Instalación Local (Sin Docker)

**Solo si NO usas Docker**, necesitas instalar dependencias manualmente:

1. **Instalar dependencias**
   ```bash
   # Backend
   cd server
   npm install
   
   # Frontend
   cd ../client
   npm install
   cd ..
   ```

2. **Configurar MongoDB local**
   - Instalar MongoDB Community Edition
   - Iniciar servicio: `mongod`
   - Actualizar `MONGO_URI` en `server/.env` a `mongodb://localhost:27017/translator_db`

3. **Iniciar servicios**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd client
   npm run dev
   ```

---

## 🔌 API BACKEND

### Base URL
```
http://localhost:5000
```

### Endpoints Disponibles (Sprint 2)

#### 1. Health Check
```http
GET /health
```

**Respuesta exitosa (200)**
```json
{
  "status": "OK",
  "timestamp": "2025-11-12T10:30:00.000Z",
  "database": "connected",
  "sprint": 2
}
```

---

#### 2. Información del API
```http
GET /
```

**Respuesta exitosa (200)**
```json
{
  "message": "🌍 Global Translator API - Sprint 2",
  "status": "Backend y Base de Datos conectados",
  "sprint": 2,
  "endpoints": {
    "health": "/health",
    "translateTest": "POST /api/translate/test",
    "translate": "POST /api/translate"
  },
  "database": "MongoDB",
  "version": "1.0.0"
}
```

---

#### 3. Endpoint de Prueba de Traducción
```http
POST /api/translate/test
Content-Type: application/json
```

**Body**
```json
{
  "text": "Hello world",
  "country": "Spain"
}
```

**Respuesta exitosa (200)**
```json
{
  "success": true,
  "data": {
    "originalText": "Hello world",
    "country": "Spain",
    "alpha3Code": "SPA",
    "language": "es",
    "translation": "[MOCK] Traducción de prueba para: \"Hello world\"",
    "fromCache": false
  },
  "message": "Endpoint de prueba funcionando correctamente (Sprint 2)",
  "timestamp": "2025-11-12T10:30:00.000Z"
}
```

**Errores posibles**
- `400` - Texto vacío o falta campo requerido
- `500` - Error interno del servidor

---

#### 4. Estadísticas del Caché
```http
GET /api/translate/cache
```

**Respuesta exitosa (200)**
```json
{
  "success": true,
  "cache": {
    "total": 42,
    "recent": [
      {
        "originalText": "Hello",
        "alpha3Code": "ESP",
        "language": "es",
        "createdAt": "2025-11-12T10:00:00.000Z"
      }
    ]
  },
  "timestamp": "2025-11-12T10:30:00.000Z"
}
```

---

#### 5. Traducción Completa (Próximo Sprint)
```http
POST /api/translate
```

**Estado actual**: 501 Not Implemented
- Se implementará en Sprint 3 con integración de DeepL API

---

### Ejemplos con cURL

**Health Check**
```bash
curl http://localhost:5000/health
```

**Test de Traducción**
```bash
curl -X POST http://localhost:5000/api/translate/test \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","country":"France"}'
```

**Estadísticas**
```bash
curl http://localhost:5000/api/translate/cache
```

---

## 🗄️ BASE DE DATOS

### Modelo de Datos: Translation

```javascript
{
  originalText: String,    // Texto original (max 5000 caracteres)
  alpha3Code: String,      // Código ISO del país (3 letras)
  language: String,        // Código ISO del idioma
  translation: String,     // Texto traducido
  createdAt: Date         // Timestamp automático
}
```

### Índices
- **Compuesto único**: `(originalText, alpha3Code)` - Evita duplicados y optimiza caché
- **Simple**: `language` - Para filtrar por idioma

### Estadísticas
- **150+ países mapeados** con sus idiomas oficiales
- **Caché automático** de traducciones
- **Búsqueda optimizada** con índices compuestos

---

## 📚 MAPEOS DE DATOS

### Países Soportados

El sistema incluye mapeos completos para:
- 🇪🇺 **Europa**: 35+ países
- 🌎 **Américas**: 25+ países
- 🌏 **Asia**: 35+ países
- 🌍 **África**: 30+ países
- 🌊 **Oceanía**: 5+ países
- 🇷🇺 **Ex-URSS**: 10+ países

**Total**: **150+ países con idiomas oficiales**

### Idiomas Soportados

Español, Inglés, Francés, Alemán, Italiano, Portugués, Ruso, Chino, Japonés, Coreano, Árabe, Hindi, y muchos más...

---

## 🔧 COMANDOS ÚTILES

### Docker

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver logs solo del servidor
docker-compose logs -f server

# Detener servicios
docker-compose down

# Reconstruir imágenes
docker-compose up -d --build

# Eliminar volúmenes (⚠️ borra datos de MongoDB)
docker-compose down -v
```

### NPM (Desarrollo Local)

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Iniciar servidor
npm start
```

---

## 📖 ENLACES A LOS DOCUMENTOS DE LA PROPUESTA

- [Problema y Justificación](./docs/problema.md)
- [Objetivos y Alcance](./docs/objetivos-alcance.md)
- [Viabilidad Técnica](./docs/viabilidad-tecnica.md)
- [Recursos Necesarios](./docs/recursos.md)

---

## 📝 NOTAS DE DESARROLLO

### Sprint 2 - Completado ✅

Este sprint estableció las bases del backend:
- Base de datos MongoDB funcionando en Docker
- Modelo de datos optimizado con índices
- Sistema de rutas modular
- Endpoint de prueba operativo
- Mapeos completos de 150+ países
- Logging básico implementado

### Próximos Pasos - Sprint 3

- Integración con DeepL API
- Detección automática de idioma (franc-min + keywords)
- Sistema de caché completo
- Fallback a Google Translate
- Endpoint `/api/translate` funcional

---

## 📄 LICENCIA

Este proyecto es parte de un trabajo académico para el curso de Desarrollo en Servidor.

---

**Última actualización**: Sprint 2 - Noviembre 2025
