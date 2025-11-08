# Global Translator App - Sprint 1 🌍

**Estado**: Sprint 1 Completado ✅  
**Objetivo**: Fundamentos y Configuración del Entorno

## 🎯 Lo que se completó en Sprint 1

### Aprendizaje
- ✅ Fundamentos de React y TypeScript
- ✅ Fundamentos de Node.js y Express
- ✅ Fundamentos de MongoDB y Mongoose
- ✅ Fundamentos de Docker y Docker Compose

### Configuración
- ✅ Estructura del proyecto establecida
- ✅ Git inicializado con .gitignore
- ✅ Vite configurado con TypeScript
- ✅ Dockerfiles básicos creados
- ✅ Variables de entorno configuradas

## 📋 Requisitos

- Node.js 20+
- Docker y Docker Compose
- Git

## 🏗️ Estructura del Proyecto

```
MapaTraductorInteractivo_Sprint1/
├── client/              # Frontend React + TypeScript
│   ├── src/
│   │   └── App.tsx      # Componente principal básico
│   ├── Dockerfile       # Docker config básico
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/              # Backend Node.js + Express
│   ├── server.js        # Servidor básico
│   ├── Dockerfile       # Docker config básico
│   └── package.json
├── docker-compose.yml   # Orquestación básica
└── README.md
```

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd MapaTraductorInteractivo_Sprint1
```

### 2. Desarrollo Local

#### Frontend
```bash
cd client
npm install
npm run dev
```

El frontend estará disponible en: http://localhost:5173

#### Backend
```bash
cd server
npm install
npm run dev
```

El backend estará disponible en: http://localhost:5000

### 3. Con Docker (Básico)

```bash
docker-compose up --build
```

**Nota**: En Sprint 1, Docker está configurado básicamente. La integración completa se realizará en sprints posteriores.

## 📝 Comandos Útiles

### NPM
```bash
npm install           # Instalar dependencias
npm run dev          # Modo desarrollo
npm run build        # Construir para producción
```

### Docker
```bash
docker-compose up           # Iniciar servicios
docker-compose down         # Detener servicios
docker-compose logs -f      # Ver logs
docker ps                   # Ver contenedores corriendo
```

### Git
```bash
git status               # Ver estado
git add .               # Agregar cambios
git commit -m "mensaje" # Commit
git push                # Subir cambios
```

## 🎓 Recursos de Aprendizaje Utilizados

### React & TypeScript
- [React Official Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Node.js & Express
- [Node.js Docs](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

### Docker
- [Docker Get Started](https://docs.docker.com/get-started/)
- [Docker Compose Tutorial](https://docs.docker.com/compose/gettingstarted/)

## 📊 Próximos Pasos (Sprint 2)

- [ ] Configurar MongoDB
- [ ] Crear modelos de datos
- [ ] Implementar endpoints de API
- [ ] Sistema de caché

## 🤝 Equipo

Este es un proyecto educativo siguiendo metodología SCRUM.

---

**Sprint 1 Completado**: Fundamentos establecidos ✅  
**Próximo Sprint**: Backend Base y Base de Datos
