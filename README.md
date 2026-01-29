<div align="center">

<a id="inicio"></a>
![Logo Transkarte](./docs/img/logo.png)

### *Explora el mundo aprendiendo idiomas*

**Aplicación web educativa que combina geografía y traducción interactiva**

<!-- BADGES DE ESTADO -->
![GitHub last commit](https://img.shields.io/github/last-commit/sdurutr436/ProyectoIntermodular-MapaInteractivo?style=flat-square&color=blueviolet)
![GitHub repo size](https://img.shields.io/github/repo-size/sdurutr436/ProyectoIntermodular-MapaInteractivo?style=flat-square)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/sdurutr436/ProyectoIntermodular-MapaInteractivo/jsdoc-generate.yml?style=flat-square&label=CI%20Build)
[![Documentación](https://img.shields.io/badge/docs-TypeDoc-blue?style=flat-square)](https://sdurutr436.github.io/ProyectoIntermodular-MapaInteractivo/)

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
- [x] Gestión de estado con Zustand (store centralizado con persistencia)
- [x] API HTTP con Axios (interceptores, manejo de errores, timeouts)

**Infraestructura:**
- [x] Dockerización completa (frontend + backend + MongoDB)
- [x] Variables de entorno configuradas
- [x] CORS y seguridad básica
- [x] Script de seeding para datos iniciales de traducciones

---

## 🛠️ Stack Tecnológico

<div align="center">

### Frontend
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-%2320232a.svg?style=for-the-badge)

### Backend & Database
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

### DevOps & Tools
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Sentry](https://img.shields.io/badge/Sentry-362D59?style=for-the-badge&logo=sentry&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-131415?style=for-the-badge&logo=railway&logoColor=white)

</div>

### Frontend Detalles
- **react-simple-maps** - Visualización de mapas SVG interactivos
- **Axios** - Cliente HTTP con interceptores y manejo centralizado de errores

### APIs Externas
- **🔷 DeepL API** - Traducción de alta calidad (principal)
- **🌐 Google Translate API** - Traducción gratuita (fallback)

---

## 🚀 Demo en Producción

**URL de producción:** [https://transkarte.up.railway.app/](https://transkarte.up.railway.app/)

---

## 📸 Capturas de Pantalla y Guía de Usuario

### 🏠 Página de Inicio (Landing Page)

<div align="center">
  <img src="./docs/img/landing-page.png" alt="Landing Page" width="700" />
</div>

**¿Qué puede hacer el usuario aquí?**

- 🌍 **Ver presentación animada** del proyecto con efectos visuales
- 🎯 **Elegir modo de uso**: Traducción o Juego (2 modos)
- 🌐 **Cambiar idioma de interfaz**: Español ↔️ Inglés (botón superior derecha)
- 📖 **Leer descripción** de cada modo antes de empezar e información sobre nosotros
- 🚀 **Comenzar experiencia** haciendo clic en cualquier tarjeta de modo

---

### 🗺️ Mapa Interactivo (Vista Principal)

<div align="center">
  <img src="./docs/img/mapa-interactivo.png" alt="Mapa interactivo" width="700" />
</div>

<div align="center">
  <img src="./docs/img/modo-traduccion.png" alt="Modo traducción" width="700" />
</div>

**¿Qué puede hacer el usuario aquí?**

- 🖱️ **Hacer hover sobre países**: Ver efecto de resaltado visual
- 🔍 **Usar barra de búsqueda**: Para saber como se dice una frase o palabra en un pais cuando el usuario lo clique
- ✍️ **Escribir texto**: Introducir palabra o frase (máximo 500 caracteres)
- 🚫 **Ver bloqueo automático**: Los países que hablan el idioma del texto aparecen en rojo
- 🌍 **Seleccionar país destino**: Clic en cualquier país del mapa
- 🎨 **Navegar el mapa**: Scroll para zoom, arrastrar para mover
- 🔄 **Ver traducción instantánea**: Resultado en modal con animación
- 💾 **Caché automático**: Traducciones repetidas son instantáneas (guardadas en BD)
- ❌ **Cerrar modal**: Hacer clic fuera del modal o botón de cerrar
- 🏠 **Volver a la landing page**: Botón "i" en esquina superior izquierda al lado del logo para volver a la página principal
- 🌐 **Cambiar idioma**: Selector ES/EN en barra superior
- 🌓 **Cambiar tema**: Icono de sol/luna en barra superior

**Ejemplo de uso:**
1. Escribe "Hello world" en el campo de texto
2. Los países anglófonos (USA, UK, Australia) se bloquean automáticamente en rojo
3. Haz clic en España → Aparece "Hola mundo"
4. Haz clic en Francia → Aparece "Bonjour le monde"

---

### 🎮 Modo Juego: Adivina el Idioma

<div align="center">
  <img src="./docs/img/modo-adivina-idioma.png" alt="Modo Adivina el idioma" width="700" />
</div>

**¿Qué puede hacer el usuario aquí?**

- 📖 **Leer frase en idioma desconocido**: Aparece en la parte superior
- 🤔 **Adivinar el país correcto**: Clic en el país que habla ese idioma
- ❤️ **Gestionar vidas**: Tienes 5 vidas (corazones), pierdes 1 por error
- 📊 **Ver estadísticas en tiempo real**: Aciertos, fallos y puntos.
- ✅ **Recibir feedback inmediato**: Animación verde si aciertas, roja si fallas
- 🔄 **Nueva pregunta automática**: Después de cada respuesta (correcta o incorrecta)
- 💀 **Game Over**: Al perder las 5 vidas, ver resumen de estadísticas
- ➡️ **Pasar intento**: Botón para pasar la frase a una nueva, a costa de un intento
- 🔁 **Reintentar**: Botón para comenzar nueva partida
- 🏠 **Volver al menú**: Abandonar partida en cualquier momento

**Mecánica del juego:**
- Cada respuesta correcta suma +1 punto
- Cada error resta 1 vida
- Frases aleatorias en 50+ idiomas diferentes
- Algunos idiomas tienen múltiples países válidos (ej: español → España, México, Argentina...)

---

### 🏴 Modo Juego: Adivina la Bandera

<div align="center">
  <img src="./docs/img/modo-adivina-bandera.png" alt="Modo Adivina la Bandera" width="700" />
</div>

**¿Qué puede hacer el usuario aquí?**

- 🏴 **Ver bandera aleatoria**: Aparece en grande en la parte superior
- 🗺️ **Adivinar el país**: Clic en el país correcto en el mapa
- ❤️ **Gestionar vidas**: Tienes 5 vidas, pierdes 1 por error
- 📊 **Ver estadísticas**: Aciertos, fallos, puntos, porcentaje de acierto al final de la partida
- ✅ **Feedback visual**: Animación verde/roja + nombre del país correcto
- 🌍 **Aprender geografía**: 195 banderas de países del mundo
- 🔄 **Nueva bandera automática**: Después de cada intento
- 💀 **Game Over**: Ver resumen completo al perder todas las vidas
- ➡️ **Pasar intento**: Botón para pasar una bandera nueva, a costa de un intento
- 🔁 **Jugar de nuevo**: Reiniciar partida con nuevas banderas aleatorias

**Mecánica del juego:**
- Cada acierto suma +1 punto
- Cada fallo resta 1 vida
- Banderas generadas aleatoriamente
- Incluye países de todos los continentes
- Dificultad variada: desde banderas icónicas hasta las más desafiantes

---

### 🎨 Características Comunes en Todas las Pantallas

**Controles Globales:**
- 🌐 **Selector de idioma** (ES/EN) - Esquina superior derecha
- 🌓 **Toggle tema oscuro/claro** - Icono de sol/luna
- 🏠 **Botón "i"** - Volver a la landing page

**Accesibilidad:**
- 🎨 Alto contraste en modo oscuro
- 📢 Textos legibles (tamaño mínimo 14px)
- 🖱️ Áreas de clic amplias (mínimo 44x44px)
- 🔊 Estados visuales claros (hover, focus, active)

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

### 📖 Documentación de la API

La documentación completa del código (Backend + Frontend) está disponible online en un solo lugar, generada automáticamente con TypeDoc:

- **🌐 Documentación Unificada**: [https://sdurutr436.github.io/ProyectoIntermodular-MapaInteractivo/](https://sdurutr436.github.io/ProyectoIntermodular-MapaInteractivo/)

La documentación incluye:
- ⚙️ **Backend**: API REST, modelos, servicios de traducción, rutas de juego
- 🎨 **Frontend**: Componentes React, servicios, contextos, tipos TypeScript

Todo integrado en una única interfaz con menú lateral para fácil navegación entre módulos.

La documentación se genera automáticamente en cada push a `main` usando GitHub Actions.

### 📂 Documentación del Proyecto

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
