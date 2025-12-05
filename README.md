<div align="center">



<a id="inicio"></a>
![Logo Transkarte](./docs/img/logo.png)

### *Explora el mundo aprendiendo idiomas*

**Aplicación web educativa que combina geografía y traducción interactiva**

</div>

---

## 📖 Sobre el Proyecto

**Transkarte** es una aplicación web educativa que transforma el aprendizaje de idiomas en una experiencia interactiva y visual. A través de un mapa mundial interactivo, los usuarios pueden:

- 🗺️ **Explorar** países con visualización interactiva y efectos visuales
- 🔤 **Traducir** palabras y frases al idioma oficial de cada país
- 🎮 **Jugar** modos educativos para aprender geografía e idiomas
- 🌍 **Descubrir** más de 150 países y sus lenguas oficiales

La aplicación combina **React**, **TypeScript**, **Node.js** y **MongoDB** para ofrecer una experiencia fluida y educativa. Desarrollada con Docker para facilitar el despliegue y sin necesidad de registro de usuarios, Transkarte pone la privacidad y la simplicidad en primer lugar.

## 📋 Tabla de Contenidos

- [🛠️ Stack Tecnológico](#️-stack-tecnológico)
- [🚀 Demo en Producción](#-demo-en-producción)
- [📸 Capturas de Pantalla](#-capturas-de-pantalla)
- [💻 Instalación y Desarrollo Local](#-instalación-y-desarrollo-local)
- [👥 Equipo de Desarrollo](#-equipo-de-desarrollo)
- [📚 Documentación](#-documentación)
- [📊 Estado del Proyecto](#-estado-del-proyecto)
- [🔌 API Backend](#-api-backend)
- [📄 Licencia](#-licencia)

---

## 📊 Estado del Proyecto

### ✅ Proyecto Completado

**Backend:**
- [x] MongoDB configurado en Docker
- [x] Modelos de datos (Translation, GameStats)
- [x] Sistema de traducción con DeepL + Google Translate fallback
- [x] Detección automática de idioma
- [x] Sistema de caché de traducciones
- [x] API de juegos (frases y banderas)
- [x] Mapeos de 150+ países e idiomas

**Frontend:**
- [x] React 18 + TypeScript + Vite
- [x] Mapa interactivo mundial (react-simple-maps)
- [x] Modo Traducción: traduce al idioma del país clickeado
- [x] Modo Adivina el Idioma: reconoce frases en diferentes idiomas
- [x] Modo Adivina la Bandera: identifica países por su bandera
- [x] Sistema de vidas y estadísticas en tiempo real
- [x] Internacionalización (español/inglés)
- [x] Modo oscuro/claro
- [x] Landing page interactiva
- [x] Diseño responsive

**Infraestructura:**
- [x] Dockerización completa (frontend + backend + MongoDB)
- [x] Variables de entorno configuradas
- [x] CORS y seguridad básica

---

## 🛠️ Stack Tecnológico

### Frontend

- **⚛️ React 18** - Librería UI con hooks y context
- **📘 TypeScript** - Tipado estático para mayor robustez
- **⚡ Vite** - Build tool ultrarrápido
- **🗺️ react-simple-maps** - Visualización de mapas SVG interactivos
- **🎨 CSS3** - Estilos personalizados con animaciones

### Backend

- **🟢 Node.js 20** - Runtime JavaScript
- **🚂 Express.js** - Framework web minimalista
- **🍃 MongoDB 7.0** - Base de datos NoSQL
- **📦 Mongoose** - ODM para MongoDB con esquemas tipados

### APIs Externas

- **🔷 DeepL API** - Traducción de alta calidad (principal)
- **🌐 Google Translate API** - Traducción gratuita (fallback)

### DevOps e Infraestructura

- **🐳 Docker & Docker Compose** - Contenedorización
- **🔒 HTTPS** - Certificado SSL (Let's Encrypt en producción)
- **📝 dotenv** - Gestión de variables de entorno

---

## 🚀 Demo en Producción

<!-- TODO: Añadir enlace cuando la aplicación esté desplegada -->

> ⚠️ **Próximamente**: La aplicación estará disponible en producción una vez completado el Sprint 6 (Dockerización y Despliegue).

**URL de producción:** `TODO - Pendiente de despliegue`

---

## 📸 Capturas de Pantalla

<!-- TODO: Añadir capturas de pantalla de la aplicación -->

<div align="center">
  <b>Página de inicio (Landing Page)</b><br>
  <img src="./docs/img/landing-page.png" alt="Landing Page" width="600" />
  <br><br>
  <b>Mapa interactivo con países</b><br>
  <img src="./docs/img/mapa-interactivo.png" alt="Mapa interactivo" width="600" />
  <br><br>
  <b>Modo de traducción</b><br>
  <img src="./docs/img/modo-traduccion.png" alt="Modo traducción" width="600" />
  <br><br>
  <b>Modo de juego: Adivina el idioma</b><br>
  <img src="./docs/img/modo-adivina-idioma.png" alt="Modo Adivina el idioma" width="600" />
  <br><br>
  <b>Modo de juego: Adivina la Bandera</b><br>
  <img src="./docs/img/modo-adivina-bandera.png" alt="Modo Adivina la Bandera" width="600" />
</div>

---

## 💻 Instalación y Desarrollo Local

### Requisitos Previos

#### ⭐ Opción 1: Con Docker (Recomendado)

- ✅ **Docker Desktop** instalado y en ejecución
- ✅ **Git**
- ❌ **NO necesitas** Node.js instalado
- ❌ **NO necesitas** MongoDB instalado
- ❌ **NO necesitas** ejecutar `npm install` manualmente

#### 📦 Opción 2: Sin Docker (Manual)

- ✅ **Node.js** 20+
- ✅ **MongoDB** Community Edition
- ✅ **Git**

---

### 🐳 Instalación con Docker (Recomendado)

1️⃣ **Clonar el repositorio**

```bash
git clone https://github.com/sdurutr436/ProyectoIntermodular-MapaInteractivo.git
cd ProyectoIntermodular-MapaInteractivo
```

2️⃣ **Iniciar todos los servicios**

```bash
docker-compose up -d --build
```

> 🎉 **¡Listo!** Las dependencias se instalan automáticamente dentro de los contenedores.

3️⃣ **Acceder a la aplicación**

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/health](http://localhost:5000/health)
- **MongoDB**: `localhost:27017`

4️⃣ **Ver logs (opcional)**

```bash
# Logs de todos los servicios
docker-compose logs -f

# Logs solo del servidor
docker-compose logs -f server

# Logs solo del cliente
docker-compose logs -f client
```

5️⃣ **Detener los servicios**

```bash
docker-compose down
```

---

### 📦 Instalación Manual (Sin Docker)

<details>
<summary><b>Clic aquí para ver instrucciones sin Docker</b></summary>

1️⃣ **Clonar el repositorio**

```bash
git clone https://github.com/sdurutr436/ProyectoIntermodular-MapaInteractivo.git
cd ProyectoIntermodular-MapaInteractivo
```

2️⃣ **Instalar dependencias**

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
cd ..
```

3️⃣ **Configurar MongoDB**

- Instalar [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
- Iniciar el servicio: `mongod`
- Actualizar `MONGO_URI` en `server/.env`:
  ```
  MONGO_URI=mongodb://localhost:27017/translator_db
  ```

4️⃣ **Iniciar servicios**

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

5️⃣ **Acceder a la aplicación**

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend**: [http://localhost:5000](http://localhost:5000)

</details>

---

## 👥 Equipo de Desarrollo

<div align="center">

| Avatar | Nombre | Rol | GitHub |
|:------:|--------|-----|:------:|
| <img src="https://github.com/sdurutr436.png" width="80" style="border-radius:50%"/> | **Sergio Durán Utrera** | Full Stack Developer | [![GitHub](https://img.shields.io/badge/GitHub-sdurutr436-181717?style=flat&logo=github)](https://github.com/sdurutr436) |
| <img src="https://github.com/nolocardeno.png" width="80" style="border-radius:50%"/> | **Manolo Cárdeno Sánchez** | Full Stack Developer | [![GitHub](https://img.shields.io/badge/GitHub-nolocardeno-181717?style=flat&logo=github)](https://github.com/manolo-card) |
| <img src="https://github.com/Fjrg0309.png" width="80" style="border-radius:50%"/> | **Francisco J. Redondo González** | Full Stack Developer | [![GitHub](https://img.shields.io/badge/GitHub-Fjrg0309-181717?style=flat&logo=github)](https://github.com/FranRG96) |

</div>

> 💡 Este proyecto fue desarrollado como parte del **Proyecto Intermodular** del ciclo de **Desarrollo de Aplicaciones Web (DAW)**.

---

## 📚 Documentación

### 📂 Documentación del Proyecto

> 📝 **TODO**: Expandir documentación técnica con diagramas de arquitectura, flujos de usuario y guías de contribución.

Toda la documentación técnica y de planificación se encuentra en la carpeta [`/docs`](./docs):

- 📄 [**Problema y Justificación**](./docs/problema.md) - Contexto y necesidad del proyecto
- 🎯 [**Objetivos y Alcance**](./docs/objetivos-alcance.md) - Metas y límites del proyecto
- 🔧 [**Viabilidad Técnica**](./docs/viabilidad-tecnica.md) - Análisis técnico y factibilidad
- 💰 [**Recursos Necesarios**](./docs/recursos.md) - Recursos humanos y técnicos
- ⚖️ [**Legislación y Cumplimiento**](./docs/legislacion.md) - RGPD, accesibilidad y normativas

### 📖 Wiki del Proyecto

> 📚 **Wiki completa:** [https://github.com/sdurutr436/ProyectoIntermodular-MapaInteractivo/wiki](https://github.com/sdurutr436/ProyectoIntermodular-MapaInteractivo/wiki)

Páginas disponibles en la wiki:
- [Home](https://github.com/sdurutr436/ProyectoIntermodular-MapaInteractivo/wiki) — Portada y presentación general del proyecto
- [Actas de reuniones](https://github.com/sdurutr436/ProyectoIntermodular-MapaInteractivo/wiki/Actas-de-reuniones) — Resúmenes y acuerdos de las reuniones del equipo
- [Gestión de Recursos y Tiempos](https://github.com/sdurutr436/ProyectoIntermodular-MapaInteractivo/wiki/Gesti%C3%B3n-de-Recursos-y-Tiempos) — Planificación de recursos, cronograma y asignación de tareas
- [Metodología SCRUM](https://github.com/sdurutr436/ProyectoIntermodular-MapaInteractivo/wiki/Metodolog%C3%ADa-SCRUM) — Explicación del marco de trabajo ágil utilizado
- [Planificación de Sprints](https://github.com/sdurutr436/ProyectoIntermodular-MapaInteractivo/wiki/Planificaci%C3%B3n-de-Sprints) — Detalle de los sprints, objetivos y entregables
- [Roles de equipo](https://github.com/sdurutr436/ProyectoIntermodular-MapaInteractivo/wiki/Roles-de-equipo) — Descripción de los roles y responsabilidades de cada miembro

---

## 📄 Licencia

Este proyecto es parte de un **trabajo académico** desarrollado para el **Proyecto Intermodular** del ciclo de **Desarrollo de Aplicaciones Web (DAW)** en el **IES Rafael Alberti** (Cádiz, España).

### Uso Educativo

- ✅ **Permitido**: Uso con fines educativos y de aprendizaje
- ✅ **Permitido**: Clonación y modificación para proyectos académicos
- ⚠️ **Atribución requerida**: Si usas este código, menciona a los autores originales

### Autores

- Sergio Durán Utrera ([@sdurutr436](https://github.com/sdurutr436))
- Manolo Cárdeno Sánchez ([@manolo-card](https://github.com/nolocardeno))
- Francisco J. Redondo González ([@FranRG96](https://github.com/Fjrg0309))

---


<p align="center">
  <a href="#inicio">⬆️ Volver arriba</a>
</p>
