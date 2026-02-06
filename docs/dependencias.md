# Transkarte Project Dependencies

## Index
1. [Frontend - Production Dependencies](#frontend---production-dependencies)
2. [Frontend - Development Dependencies](#frontend---development-dependencies)
3. [Backend - Production Dependencies](#backend---production-dependencies)
4. [Backend - Development Dependencies](#backend---development-dependencies)
5. [Integration Justification](#integration-justification)

---

## Frontend - Production Dependencies

### React 18.2.0
**Purpose:** Main library to build the user interface with reusable components.

**Justification:**
- Modern framework with component-based architecture
- Excellent performance thanks to Virtual DOM
- Large ecosystem and active community
- Modern Hooks for state management
- Compatible with TypeScript for greater type safety

**Integration:** Used as the base of the entire frontend application, from `App.tsx` to individual components like `WorldMap.tsx`, `SearchBar.tsx` and `TranslationModal.tsx`.

---

### React DOM 18.2.0
**Purpose:** Rendering of React components in the web browser.

**Justification:**
- Official React library for DOM manipulation
- Necessary to render the application in browsers
- Optimized for React 18 with concurrent rendering

**Integration:** Used in `index.tsx` to render the application's root component in the HTML container.

---

### React Simple Maps 3.0.0
**Purpose:** Rendering of interactive maps based on SVG with GeoJSON data.

**Justification:**
- Specialized in world map visualization
- Use of SVG for scalability without quality loss
- Optimal performance with geographical projections
- Simple and declarative API compatible with React
- Lightweight alternative vs Google Maps or Mapbox (no API keys needed)

**Integration:** In `WorldMap.tsx` it is used to:
- Render world geography with `ComposableMap` and `Geographies`
- Handle click events on countries with `Geography`
- Apply dynamic styles according to state (hover, selected, blocked)
- Mercator projection for standard visualization

---

### Axios 1.6.2
**Purpose:** HTTP client to make requests to the backend.

**Justification:**
- More intuitive API than native Fetch
- Automatic JSON handling
- Interceptors for global error management
- Request cancellation (useful to avoid race conditions)
- TypeScript compatibility

**Integration:** In `translationService.ts` for communication with the backend:
```typescript
- POST /api/translate - Text translation
- POST /api/translate/blocked-countries - Get blocked countries
- GET /api/game/* - Game mode endpoints
```

---

### Zustand 4.4.7
**Purpose:** Minimalist global state management without boilerplate.

**Justification:**
- Lightweight alternative to Redux (only 1KB)
- Simple API based on hooks
- No nested context providers
- TypeScript-first with automatically inferred types
- Devtools for debugging

**Integration:** Global state management throughout the application:
- Interface language (Spanish/English)
- Dark/light mode
- Current translation state
- Dynamically blocked countries
- Persistence in `localStorage`

---

## Frontend - Development Dependencies

### TypeScript 4.9.3
**Purpose:** JavaScript superset with static typing.

**Justification:**
- Error detection at development time
- Intelligent autocompletion in IDE
- Safe refactoring
- Implicit documentation with types
- Clear interfaces for components and props

**Integration:** All `.tsx` and `.ts` files use TypeScript. Configured in `tsconfig.json` with strict mode.

---

### Vite 4.1.0
**Purpose:** Ultra-fast build tool and development server.

**Justification:**
- Instant Hot Module Replacement (HMR)
- Production build optimized with Rollup
- Native support for TypeScript, JSX, CSS
- Zero-config
- Up to 100x faster than Webpack in development

**Integration:** Configured in `vite.config.ts` for:
- Development server on port 3000
- TypeScript and React compilation
- Asset optimization for production
- API proxy to backend in development

---

### @vitejs/plugin-react 3.1.0
**Purpose:** Official Vite plugin for React support with Fast Refresh.

**Justification:**
- Enables Fast Refresh (reload without losing state)
- Automatic JSX transformation
- Specifically optimized for React

**Integration:** Configured in `vite.config.ts` as the main plugin to compile React.

---

### @types/* (react, react-dom, react-simple-maps, geojson)
**Purpose:** TypeScript type definitions for JavaScript libraries.

**Justification:**
- Autocompletion and type validation in IDE
- API usage error detection
- Inline documentation of external libraries

**Integration:** Installed as devDependencies for TypeScript support at development time.

---

## Backend - Production Dependencies

### Express 4.18.2
**Purpose:** Minimalist web framework for Node.js.

**Justification:**
- Simple and declarative routing
- Middleware for transversal logic (CORS, JSON parsing)
- Wide industry adoption
- Excellent performance for REST APIs
- Mature ecosystem with thousands of middlewares

**Integration:** In `server.js` as main server:
```javascript
- API routes (/api/translate, /api/game)
- CORS middleware
- JSON parsing
- Global error handling
```

---

### Mongoose 7.0.0
**Purpose:** ODM (Object-Document Mapper) for MongoDB.

**Justification:**
- Data modeling with typed schemas
- Automatic data validation
- Queries with intuitive syntax
- Middleware for hooks (pre/post save)
- Automatic connection and pooling

**Integration:** 
- `Translation.js` model for translation cache
- `GameStats.js` model for game statistics
- MongoDB connection configured in `config/db.js`
- Indexes for query optimization

---

### DeepL Node 1.11.0
**Purpose:** Official DeepL Translator API client.

**Justification:**
- Translation quality superior to Google Translate
- Official API with guaranteed support
- Automatic rate limiting handling
- Automatic language detection
- Support for 31 languages with high accuracy

**Integration:** In `routes/api/translate.js`:
```javascript
- Main translator (best quality)
- Fallback to Google Translate if fails
- Configured with DEEPL_API_KEY from .env
- Language code mapping (e.g.: pt-BR, zh-CN)
```

---

### Node Fetch 2.6.9
**Purpose:** Implementation of Fetch API for Node.js.

**Justification:**
- Standard browser API available in Node.js
- Necessary for calls to Google Translate (free fallback)
- Lightweight alternative to Axios in backend
- Compatible with async/await

**Integration:** In `routes/api/translate.js` for:
```javascript
- Google Translate API as free fallback
- Language detection with Google
- No API key required (public service)
```

---

### CORS 2.8.5
**Purpose:** Middleware to enable Cross-Origin Resource Sharing.

**Justification:**
- Allows requests from frontend (localhost:3000) to backend (localhost:5000)
- Flexible configuration of allowed origins
- Preflight request handling (OPTIONS)
- Essential for separated frontend/backend architecture

**Integration:** In `server.js` as global middleware:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
```

---

### Dotenv 16.0.3
**Purpose:** Loading environment variables from `.env` file.

**Justification:**
- Separation of configuration from source code
- Security (secrets not committed in Git)
- Different configuration per environment (dev/prod)
- De facto standard in Node.js

**Integration:** Loaded in `server.js`:
```javascript
require('dotenv').config();
// Variables: MONGO_URI, DEEPL_API_KEY, PORT
```

---

### Franc-min 6.1.0
**Purpose:** Language detection from text (lightweight version of Franc).

**Justification:**
- Offline detection without API calls
- Support for 82+ languages
- Algorithm based on n-grams (high accuracy)
- "Min" version to reduce bundle size
- Backup if Google Translate fails

**Integration:** In `routes/api/translate.js` as secondary detection system (currently Google Translate is primary for greater accuracy in short texts).

---

## Backend - Development Dependencies

### Nodemon 2.0.20
**Purpose:** Automatic server reload when detecting code changes.

**Justification:**
- Improves development productivity
- Automatic restart without manual intervention
- Configurable to ignore specific files
- Standard in Node.js development

**Integration:** `npm run dev` script in `package.json`:
```bash
nodemon server.js
```

---

### JSDoc 4.0.2 + Docdash 2.0.2
**Purpose:** Automatic documentation generator from code comments.

**Justification:**
- Navigable HTML documentation autogenerated
- Standard for JavaScript comments
- Compatible with CI/CD workflows
- Docdash template for modern interface

**Integration:** 
- Configured in `jsdoc.json`
- `npm run docs` script generates documentation
- JSDoc comments in all endpoints (completed in this session)

---

## Integration Justification

### General Architecture
The project follows a **MERN** architecture (MongoDB, Express, React, Node.js) with TypeScript in the frontend for greater type safety.

**Key decisions:**
1. **Frontend/backend separation:** Allows independent scalability and deployment on different servers
2. **Docker Compose:** Orchestration of 3 services (Nginx frontend, Node backend, MongoDB)
3. **Hybrid translation system:** DeepL for quality + Google Translate free as fallback

### External Library Integration

#### Frontend
- **React + TypeScript:** Modern base for development with type safety
- **Vite:** Modern build tool that surpasses Create React App in speed
- **Zustand:** Global state without Redux complexity
- **React Simple Maps:** Specialized in maps vs heavy alternatives (Leaflet, Google Maps)
- **Axios:** Robust HTTP client with better features than native Fetch

#### Backend
- **Express:** Minimalist framework, industry standard
- **Mongoose:** Robust ODM for MongoDB with built-in validation
- **DeepL Node:** Official client for high-quality translation (31 languages)
- **Node Fetch:** Fetch API in Node.js for HTTP calls to Google Translate
- **Franc-min:** Offline language detection as backup

### Alternatives Considered and Rejected

| Current Library | Alternative Considered | Rejection Reason |
|----------------|------------------------|-------------------|
| React Simple Maps | Leaflet / Mapbox | Require API keys, heavier, excessive for the use case |
| Zustand | Redux / Context API | Redux has too much boilerplate, Context has performance issues |
| Vite | Webpack / Create React App | Vite is 10-100x faster in development |
| Mongoose | Prisma / TypeORM | Mongoose is standard for MongoDB, better documentation |
| DeepL | Google Translate only | DeepL offers better quality (evaluated in tests) |
| Axios | Native Fetch | Axios has better API and error handling |

### Docker Integration

**Frontend Dockerfile:**
- Stage 1: Build with Node 20 Alpine (installs dependencies, compiles TypeScript/Vite)
- Stage 2: Nginx Alpine (serves optimized statics)
- Dynamic variables: `PORT`, `BACKEND_URL`

**Backend Dockerfile:**
- Node 20 Alpine base
- npm install of production dependencies
- Exposes port 5000
- Environment variables from Railway

### Dependency Management

**Versioning:**
- Fixed versions in `package.json` (no `^` or `~`) for reproducibility
- Lock files (`package-lock.json`) committed in Git
- Periodic audits with `npm audit`

**Security:**
- Dependencies updated to latest stable versions
- No known vulnerabilities (verified with `npm audit`)
- Sensitive variables in `.env` (not in code)

---

## Summary of Totals

| Category | Quantity | Approximate Size |
|-----------|----------|-------------------|
| Frontend - Production | 5 | ~500 KB |
| Frontend - Development | 6 | ~50 MB (not included in build) |
| Backend - Production | 7 | ~15 MB |
| Backend - Development | 3 | ~30 MB (not included in production) |
| **Total Production** | **12** | **~15.5 MB** |

**Note:** Production size is optimal thanks to Vite tree-shaking (frontend) and devDependencies exclusion in Docker (backend).
