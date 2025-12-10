# Dependencias del Proyecto Transkarte

## Índice
1. [Frontend - Dependencias de Producción](#frontend---dependencias-de-producción)
2. [Frontend - Dependencias de Desarrollo](#frontend---dependencias-de-desarrollo)
3. [Backend - Dependencias de Producción](#backend---dependencias-de-producción)
4. [Backend - Dependencias de Desarrollo](#backend---dependencias-de-desarrollo)
5. [Justificación de la Integración](#justificación-de-la-integración)

---

## Frontend - Dependencias de Producción

### React 18.2.0
**Propósito:** Biblioteca principal para construir la interfaz de usuario con componentes reutilizables.

**Justificación:**
- Framework moderno con arquitectura basada en componentes
- Excelente rendimiento gracias al Virtual DOM
- Gran ecosistema y comunidad activa
- Hooks modernos para gestión de estado
- Compatible con TypeScript para mayor seguridad de tipos

**Integración:** Se utiliza como base de toda la aplicación frontend, desde `App.tsx` hasta componentes individuales como `WorldMap.tsx`, `SearchBar.tsx` y `TranslationModal.tsx`.

---

### React DOM 18.2.0
**Propósito:** Renderizado de componentes React en el navegador web.

**Justificación:**
- Librería oficial de React para manipulación del DOM
- Necesaria para renderizar la aplicación en navegadores
- Optimizada para React 18 con renderizado concurrente

**Integración:** Se usa en `index.tsx` para renderizar el componente raíz de la aplicación en el contenedor HTML.

---

### React Simple Maps 3.0.0
**Propósito:** Renderizado de mapas interactivos basados en SVG con datos GeoJSON.

**Justificación:**
- Especializada en visualización de mapas mundiales
- Uso de SVG para escalabilidad sin pérdida de calidad
- Rendimiento óptimo con proyecciones geográficas
- API simple y declarativa compatible con React
- Alternativa ligera vs Google Maps o Mapbox (sin necesidad de API keys)

**Integración:** En `WorldMap.tsx` se utiliza para:
- Renderizar la geografía mundial con `ComposableMap` y `Geographies`
- Manejar eventos de clic en países con `Geography`
- Aplicar estilos dinámicos según estado (hover, seleccionado, bloqueado)
- Proyección Mercator para visualización estándar

---

### Axios 1.6.2
**Propósito:** Cliente HTTP para realizar peticiones al backend.

**Justificación:**
- API más intuitiva que Fetch nativa
- Manejo automático de JSON
- Interceptores para gestión global de errores
- Cancelación de peticiones (útil para evitar race conditions)
- Compatibilidad con TypeScript

**Integración:** En `translationService.ts` para comunicación con el backend:
```typescript
- POST /api/translate - Traducción de texto
- POST /api/translate/blocked-countries - Obtener países bloqueados
- GET /api/game/* - Endpoints del modo de juego
```

---

### Zustand 4.4.7
**Propósito:** Gestión de estado global minimalista sin boilerplate.

**Justificación:**
- Alternativa ligera a Redux (solo 1KB)
- API simple basada en hooks
- Sin context providers anidados
- TypeScript-first con tipos inferidos automáticamente
- Devtools para debugging

**Integración:** Gestión de estado global en toda la aplicación:
- Idioma de interfaz (español/inglés)
- Modo oscuro/claro
- Estado de traducción actual
- Países bloqueados dinámicamente
- Persistencia en `localStorage`

---

## Frontend - Dependencias de Desarrollo

### TypeScript 4.9.3
**Propósito:** Superset de JavaScript con tipado estático.

**Justificación:**
- Detección de errores en tiempo de desarrollo
- Autocompletado inteligente en IDE
- Refactorización segura
- Documentación implícita con tipos
- Interfaces claras para componentes y props

**Integración:** Todos los archivos `.tsx` y `.ts` utilizan TypeScript. Configurado en `tsconfig.json` con modo estricto.

---

### Vite 4.1.0
**Propósito:** Build tool y servidor de desarrollo ultrarrápido.

**Justificación:**
- Hot Module Replacement (HMR) instantáneo
- Build de producción optimizado con Rollup
- Soporte nativo para TypeScript, JSX, CSS
- Sin configuración compleja (zero-config)
- Hasta 100x más rápido que Webpack en desarrollo

**Integración:** Configurado en `vite.config.ts` para:
- Servidor de desarrollo en puerto 3000
- Compilación de TypeScript y React
- Optimización de assets para producción
- Proxy de API hacia backend en desarrollo

---

### @vitejs/plugin-react 3.1.0
**Propósito:** Plugin oficial de Vite para soporte de React con Fast Refresh.

**Justificación:**
- Habilita Fast Refresh (recarga sin perder estado)
- Transformación automática de JSX
- Optimizado específicamente para React

**Integración:** Configurado en `vite.config.ts` como plugin principal para compilar React.

---

### @types/* (react, react-dom, react-simple-maps, geojson)
**Propósito:** Definiciones de tipos TypeScript para librerías JavaScript.

**Justificación:**
- Autocompletado y validación de tipos en IDE
- Detección de errores de uso de API
- Documentación inline de librerías externas

**Integración:** Instalados como devDependencies para soporte de TypeScript en tiempo de desarrollo.

---

## Backend - Dependencias de Producción

### Express 4.18.2
**Propósito:** Framework web minimalista para Node.js.

**Justificación:**
- Routing simple y declarativo
- Middleware para lógica transversal (CORS, JSON parsing)
- Amplia adopción en la industria
- Excelente rendimiento para APIs REST
- Ecosistema maduro con miles de middlewares

**Integración:** En `server.js` como servidor principal:
```javascript
- Rutas de API (/api/translate, /api/game)
- Middleware de CORS
- Parsing de JSON
- Manejo de errores global
```

---

### Mongoose 7.0.0
**Propósito:** ODM (Object-Document Mapper) para MongoDB.

**Justificación:**
- Modelado de datos con esquemas tipados
- Validación automática de datos
- Queries con sintaxis intuitiva
- Middleware para hooks (pre/post save)
- Conexión y pooling automático

**Integración:** 
- Modelo `Translation.js` para caché de traducciones
- Modelo `GameStats.js` para estadísticas de juego
- Conexión a MongoDB configurada en `config/db.js`
- Índices para optimización de consultas

---

### DeepL Node 1.11.0
**Propósito:** Cliente oficial de la API de DeepL Translator.

**Justificación:**
- Calidad de traducción superior a Google Translate
- API oficial con soporte garantizado
- Manejo automático de rate limiting
- Detección automática de idioma fuente
- Soporte para 31 idiomas con alta precisión

**Integración:** En `routes/api/translate.js`:
```javascript
- Traductor principal (mejor calidad)
- Fallback a Google Translate si falla
- Configurado con DEEPL_API_KEY desde .env
- Mapeo de códigos de idioma (ej: pt-BR, zh-CN)
```

---

### Node Fetch 2.6.9
**Propósito:** Implementación de Fetch API para Node.js.

**Justificación:**
- API estándar de navegadores disponible en Node.js
- Necesaria para llamadas a Google Translate (fallback gratuito)
- Alternativa ligera a Axios en backend
- Compatible con async/await

**Integración:** En `routes/api/translate.js` para:
```javascript
- Google Translate API como fallback gratuito
- Detección de idioma con Google
- No requiere API key (servicio público)
```

---

### CORS 2.8.5
**Propósito:** Middleware para habilitar Cross-Origin Resource Sharing.

**Justificación:**
- Permite peticiones desde frontend (localhost:3000) a backend (localhost:5000)
- Configuración flexible de orígenes permitidos
- Manejo de preflight requests (OPTIONS)
- Esencial para arquitectura separada frontend/backend

**Integración:** En `server.js` como middleware global:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
```

---

### Dotenv 16.0.3
**Propósito:** Carga de variables de entorno desde archivo `.env`.

**Justificación:**
- Separación de configuración del código fuente
- Seguridad (secrets no committed en Git)
- Configuración diferente por entorno (dev/prod)
- Estándar de facto en Node.js

**Integración:** Cargado en `server.js`:
```javascript
require('dotenv').config();
// Variables: MONGO_URI, DEEPL_API_KEY, PORT
```

---

### Franc-min 6.1.0
**Propósito:** Detección de idioma a partir de texto (versión ligera de Franc).

**Justificación:**
- Detección offline sin llamadas a API
- Soporte para 82+ idiomas
- Algoritmo basado en n-gramas (alta precisión)
- Versión "min" para reducir tamaño del bundle
- Backup si Google Translate falla

**Integración:** En `routes/api/translate.js` como sistema de detección secundario (actualmente Google Translate es primario por mayor precisión en textos cortos).

---

## Backend - Dependencias de Desarrollo

### Nodemon 2.0.20
**Propósito:** Recarga automática del servidor al detectar cambios en código.

**Justificación:**
- Mejora productividad en desarrollo
- Reinicio automático sin intervención manual
- Configurable para ignorar archivos específicos
- Estándar en desarrollo Node.js

**Integración:** Script `npm run dev` en `package.json`:
```bash
nodemon server.js
```

---

### JSDoc 4.0.2 + Docdash 2.0.2
**Propósito:** Generador de documentación automática a partir de comentarios en código.

**Justificación:**
- Documentación HTML navegable autogenerada
- Estándar de comentarios JavaScript
- Compatible con workflows de CI/CD
- Template Docdash para interfaz moderna

**Integración:** 
- Configurado en `jsdoc.json`
- Script `npm run docs` genera documentación
- Comentarios JSDoc en todos los endpoints (completados en esta sesión)

---

## Justificación de la Integración

### Arquitectura General
El proyecto sigue una arquitectura **MERN** (MongoDB, Express, React, Node.js) con TypeScript en frontend para mayor seguridad de tipos.

**Decisiones clave:**
1. **Separación frontend/backend:** Permite escalabilidad independiente y despliegue en diferentes servidores
2. **Docker Compose:** Orquestación de 3 servicios (frontend Nginx, backend Node, MongoDB)
3. **Sistema híbrido de traducción:** DeepL para calidad + Google Translate gratuito como fallback

### Integración de Librerías Externas

#### Frontend
- **React + TypeScript:** Base moderna para desarrollo con seguridad de tipos
- **Vite:** Build tool moderno que supera a Create React App en velocidad
- **Zustand:** Estado global sin complejidad de Redux
- **React Simple Maps:** Especializada en mapas vs alternativas pesadas (Leaflet, Google Maps)
- **Axios:** Cliente HTTP robusto con mejores features que Fetch nativo

#### Backend
- **Express:** Framework minimalista estándar de la industria
- **Mongoose:** ODM robusto para MongoDB con validación incorporada
- **DeepL Node:** Cliente oficial para traducción de alta calidad (31 idiomas)
- **Node Fetch:** Fetch API en Node.js para llamadas HTTP a Google Translate
- **Franc-min:** Detección de idioma offline como backup

### Alternativas Consideradas y Rechazadas

| Librería Actual | Alternativa Considerada | Razón del Rechazo |
|----------------|------------------------|-------------------|
| React Simple Maps | Leaflet / Mapbox | Requieren API keys, más pesadas, excesivas para el caso de uso |
| Zustand | Redux / Context API | Redux tiene demasiado boilerplate, Context tiene problemas de rendimiento |
| Vite | Webpack / Create React App | Vite es 10-100x más rápido en desarrollo |
| Mongoose | Prisma / TypeORM | Mongoose es estándar para MongoDB, mejor documentación |
| DeepL | Solo Google Translate | DeepL ofrece mejor calidad (evaluado en pruebas) |
| Axios | Fetch nativo | Axios tiene mejor API y manejo de errores |

### Integración con Docker

**Dockerfile Frontend:**
- Stage 1: Build con Node 20 Alpine (instala dependencias, compila TypeScript/Vite)
- Stage 2: Nginx Alpine (sirve estáticos optimizados)
- Variables dinámicas: `PORT`, `BACKEND_URL`

**Dockerfile Backend:**
- Node 20 Alpine base
- npm install de dependencias de producción
- Expone puerto 5000
- Variables de entorno desde Railway

### Gestión de Dependencias

**Versionado:**
- Versiones fijas en `package.json` (no `^` ni `~`) para reproducibilidad
- Lock files (`package-lock.json`) committed en Git
- Auditorías periódicas con `npm audit`

**Seguridad:**
- Dependencias actualizadas a últimas versiones estables
- Sin vulnerabilidades conocidas (verificado con `npm audit`)
- Variables sensibles en `.env` (no en código)

---

## Resumen de Totales

| Categoría | Cantidad | Tamaño Aproximado |
|-----------|----------|-------------------|
| Frontend - Producción | 5 | ~500 KB |
| Frontend - Desarrollo | 6 | ~50 MB (no se incluyen en build) |
| Backend - Producción | 7 | ~15 MB |
| Backend - Desarrollo | 3 | ~30 MB (no se incluyen en producción) |
| **Total Producción** | **12** | **~15.5 MB** |

**Nota:** El tamaño de producción es óptimo gracias a tree-shaking de Vite (frontend) y exclusión de devDependencies en Docker (backend).
