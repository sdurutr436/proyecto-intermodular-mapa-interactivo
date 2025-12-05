# Objetivos SMART - Transkarte

| **Objetivo** | **Descripción** |
|---------------|----------------|
| **S (Specific)** | Desarrollar una aplicación web interactiva que combine un mapa mundial con un sistema de traducción automática para mostrar una palabra o frase traducida en los idiomas oficiales de cada país. |
| **M (Measurable)** | Lograr que el usuario pueda introducir una palabra o frase y visualizar las traducciones de al menos **50 países** correctamente en el mapa. |
| **A (Achievable)** | Utilizar el stack MERN (MongoDB, Express, React, Node.js) junto con APIs de traducción existentes (como Google Translate o LibreTranslate) y librerías de visualización geográfica (Leaflet o D3.js). |
| **R (Relevant)** | Facilitar la comprensión intercultural y el aprendizaje lingüístico de forma visual, intuitiva y rápida, integrando mapa + traducción en una sola interfaz. |
| **T (Time-bound)** | Desarrollar el MVP funcional en un plazo máximo de **8 semanas**, incluyendo pruebas de rendimiento y despliegue inicial. |

---

# Definición del MVP (Producto Mínimo Viable)

El **MVP** incluirá las siguientes características básicas:

- ✅ Campo de búsqueda donde el usuario introduzca una palabra o frase.  
- ✅ Traducción automática a los idiomas oficiales de cada país.  
- ✅ Visualización de las traducciones al hacer clic sobre el **mapa mundial interactivo**.  
- ✅ Sistema de **caché de traducciones** para evitar llamadas repetidas a la API.  
- ✅ Diseño web responsivo y funcional en escritorio y dispositivos móviles.  
- ✅ API propia en Node.js que gestione peticiones y base de datos.

---

# Delimitación del alcance

### **Qué SÍ incluye el proyecto**
- Implementación de un mapa mundial interactivo (react-simple-maps).  
- Integración con una API de traducción externa.  
- Almacenamiento de búsquedas y traducciones en base de datos (MongoDB).  
- Sistema de caché para optimizar el rendimiento.  
- Interfaz de usuario sencilla e intuitiva.  
- Despliegue funcional en un servidor.

### **Qué NO incluye el proyecto**
- Registro y autenticación de usuarios.  
- Traducciones manuales o validadas por humanos.  
- Soporte para idiomas minoritarios no reconocidos por la API.  
- Funcionalidades sociales (comentarios, puntuaciones, etc.).  
- Optimización avanzada para dispositivos de baja gama.  
- Aplicación móvil nativa (solo versión web responsive).

---

# Criterios de éxito

| **Criterio** | **Indicador de cumplimiento** |
|--------------|-------------------------------|
| **Usabilidad** | Los usuarios pueden realizar una búsqueda y visualizar las traducciones sin necesidad de ayuda externa. |
| **Rendimiento** | El sistema responde con las traducciones en menos de **3 segundos** en promedio. |
| **Estabilidad** | La aplicación se mantiene operativa sin errores críticos durante sesiones prolongadas. |
| **Precisión** | Al menos el **90%** de las traducciones generadas son correctas o comprensibles según el idioma. |
| **Optimización de recursos** | El sistema reutiliza las traducciones almacenadas, reduciendo las peticiones a la API externa en al menos un **50%**. |
| **Despliegue funcional** | El MVP está disponible públicamente y accesible desde un navegador web. |
