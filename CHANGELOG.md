# Changelog

Todas las modificaciones notables de este proyecto se documentarán en este archivo.

## [1.0.0] - 2026-01-29

### Añadido

#### Funcionalidades Core
- Mapa mundial interactivo SVG con navegación, zoom y selección de países.
- Sistema de traducción inteligente con DeepL API y fallback automático a Google Translate.
- Caché de traducciones en MongoDB para optimización de rendimiento y costes.
- Modo de juego "Adivina el Idioma" con lógica de vidas, puntuación y feedback visual.
- Modo de juego "Adivina la Bandera" integrado con el mapa interactivo.

#### Interfaz y Experiencia de Usuario
- Landing page con animaciones CSS y acceso directo a modos de juego.
- Soporte completo de internacionalización (i18n) para inglés y español.
- Tema oscuro y claro con persistencia de preferencias de usuario.
- Barra de búsqueda de países con funcionalidad de auto-zoom y centrado.
- Diseño responsive adaptado a móviles y escritorio.

#### Infraestructura y DevOps
- Entorno contenerizado completo con Docker y Docker Compose (Frontend, Backend, Mongo).
- Integración de Sentry para monitoreo de errores y performance en tiempo real.
- Pipeline de GitHub Actions para generación automática de documentación (TypeDoc).
- Configuración de despliegue para Railway con variables de entorno seguras.
- Scripts de seeding para inicialización automática de la base de datos.
