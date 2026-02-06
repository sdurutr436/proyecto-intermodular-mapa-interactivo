#  Historial de Desarrollo - Transkarte

##  Desglose de Sprints

El proyecto fue desarrollado en 6 sprints utilizando metodología Scrum, con las siguientes características:

| Sprint | Período | Horas | Componentes Principales |
|--------|---------|-------|------------------------|
| **1** | 31 Oct - 6 Nov | 60.21 h | Configuración inicial, setup tecnológico, Docker |
| **2** | 7 Nov - 13 Nov | 71.02 h | Sistemas de traducción, APIs, componentes React |
| **3** | 14 Nov - 20 Nov | 56.03 h | Interfaz interactiva, mapa mundial, caché |
| **4** | 21 Nov - 27 Nov | 9.94 h | Modo oscuro, nuevos minijuegos |
| **5** | 28 Nov - 4 Dic | 17.90 h | Landing page, modo multi-idioma |
| **6** | 5 Dic - 11 Dic | 25.00 h | Testing, documentación, optimizaciones |
| **TOTAL** | | **244.35 h** | Producto MVP completo y funcional |

##  Servicios y Costes Operativos

### Infraestructura Recurrente

| Servicio | Proveedor | Coste Mensual | Propósito |
|----------|-----------|---------------|-----------|
|  Hosting | Railway | 5 €/mes | Backend + Frontend |
|  Base de datos | MongoDB Atlas | Gratis | Almacenamiento (Free Tier) |
|  Dominio | Namecheap | ~1 €/mes | dominio .com |
|  Traducción | DeepL API | 5 €/mes | Servicio de traducción |
|  Monitorización | Sentry | Gratis | Error tracking (Free Tier) |
| **TOTAL** | | **~11 €/mes** | **~132 €/año** |

### Escala de Costes por Usuarios

El modelo de costes está diseñado para escalar progresivamente según el número de usuarios activos:

- **0-1.000 usuarios**: ~10 €/mes
- **1.000-5.000 usuarios**: ~20 €/mes
- **5.000-10.000 usuarios**: ~54 €/mes
- **10.000-50.000 usuarios**: ~125 €/mes

##  Tecnologías Implementadas

El desarrollo ha utilizado exclusivamente tecnologías open-source y servicios económicos, minimizando los costes operativos:

- **Frontend**: React 18 + TypeScript + Vite (build eficiente)
- **Backend**: Node.js + Express (ligero y escalable)
- **Base de datos**: MongoDB (flexible y gratuita en fase inicial)
- **Traducción**: APIs externas (DeepL + Google Translate como fallback)
- **Hosting**: Railway (económico y simple)
- **Monitorización**: Sentry (detección de errores)
