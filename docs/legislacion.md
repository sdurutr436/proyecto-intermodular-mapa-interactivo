# ⚖️ Legislación y Cumplimiento Normativo - Transkarte

> **Documento de Supuestos Futuros**  
> **Versión:** 1.0  
> **Fecha:** Diciembre 2025

---

## 📋 Resumen Ejecutivo

Este documento identifica las normativas aplicables a **Transkarte** y establece supuestos de implementación futura. Actualmente, la aplicación **NO requiere registro** y **NO recopila datos personales**, lo que minimiza significativamente los requisitos legales.

---

## 🎯 Estado Actual del Proyecto

### Características técnicas:
- ✅ **Sin registro de usuarios** (uso completamente anónimo)
- ✅ **Sin recopilación de datos personales**
- ✅ Uso de `localStorage` para preferencias técnicas:
  - `transkarte_language` (idioma: es/en)
  - `transkarte_dark_mode` (modo oscuro)
  - `transkarte_last_mode` (última modalidad)
  - `transkarte_has_visited` (primera visita)
- ✅ Texto de traducción procesado anónimamente vía APIs
- ✅ Sin cookies de terceros, analytics ni publicidad
- ✅ Modelo gratuito

---

## 📜 Normativas Aplicables

### 1. 🇪🇺 RGPD (Reglamento General de Protección de Datos)

**Aplicabilidad actual:** 🟢 Mínima  
**Supuesto futuro:** 🔴 Alta (si se implementa registro)

**Estado actual:**
- Solo almacena preferencias técnicas en `localStorage`
- No hay datos personales identificables
- Texto traducido no se asocia a usuarios

**Supuesto de implementación futura:**
- **Si se añade registro:** Sistema completo de derechos ARCO, consentimientos explícitos, política de privacidad extendida
- **Estimación:** 3-4 semanas de desarrollo + 2.000-4.000€ en consultoría

---

### 2. 🍪 Directiva ePrivacy / LSSI-CE (Ley de Cookies)

**Aplicabilidad actual:** 🟡 Media  
**Supuesto futuro:** 🔴 Alta (si se añaden cookies de terceros)

**Estado actual:**
- Usa `localStorage` para preferencias (no cookies HTTP)
- Sin cookies de analytics (Google Analytics, etc.)
- Sin cookies de publicidad

**Supuesto de implementación futura:**
- **Banner informativo básico:** Informar sobre uso de `localStorage` (1-2 días)
- **Si se añade analytics/publicidad:** Banner complejo con gestión de consentimiento (2-3 semanas)

---

### 3. ♿ Accesibilidad Web (WCAG 2.1)

**Aplicabilidad actual:** 🟢 Recomendada  
**Supuesto futuro:** 🔴 Obligatoria (sector público/educativo)

**Estado actual:**
- Aplicación educativa sin obligación legal
- Accesibilidad básica implementada

**Supuesto de implementación futura:**
- **Auditoría WCAG 2.1 AA:** Contraste, navegación por teclado, alt text (3-4 días)
- **Certificación profesional:** 1.000-3.000€ (si se requiere)

---

### 4. 📚 Propiedad Intelectual

**Aplicabilidad actual:** 🟡 Media  
**Supuesto futuro:** 🟡 Media (mantenimiento)

**Recursos de terceros utilizados:**
- **Mapas:** `react-simple-maps` (MIT License) ✅
- **Datos geográficos:** Natural Earth Data (dominio público) ✅
- **APIs traducción:** MyMemory, Google Translate (uso permitido) ✅
- **Banderas SVG:** 🔴 **Pendiente verificar** origen y licencia

**Acción requerida:**
- Verificar licencias de banderas (2-3 horas)
- Crear archivo `ATTRIBUTIONS.md` con todas las licencias

---

### 5. 💼 E-Commerce (LSSI-CE)

**Aplicabilidad actual:** ⚪ No aplica  
**Supuesto futuro:** 🔴 Alta (si se monetiza)

**Supuesto de implementación futura (modelo Premium/pago):**
- Aviso legal completo con datos fiscales
- Condiciones de contratación
- Derecho de desistimiento (14 días)
- Integración de pasarelas de pago (PCI-DSS)
- **Estimación:** 2-3 semanas + 1.500-3.000€ consultoría

---

### 6. 👶 COPPA (Protección de Menores - EE.UU.)

**Aplicabilidad actual:** ⚪ No aplica  
**Supuesto futuro:** 🟡 Media (expansión a EE.UU.)

**Estado actual:**
- Contenido educativo apropiado para todas las edades
- Sin recopilación de datos personales

**Supuesto de implementación futura:**
- **Si se expande a EE.UU. con registro:** Age gate (verificación de edad), consentimiento parental
- Solo necesario si se recopilan datos de menores de 13 años

---

## 🔮 Supuestos de Implementación Futura

### Escenario A: Registro de Usuarios

**Trigger:** Guardar progreso de juegos, perfiles personalizados

**Impacto legal:**
- 🔴 RGPD completo (sistema ARCO)
- 🔴 Política de privacidad extendida
- 🔴 Consentimientos explícitos
- 🟡 Cifrado de contraseñas (bcrypt)
- 🟡 HTTPS obligatorio

**Estimación:** 4-6 semanas + 3.000-6.000€

---

### Escenario B: Monetización con Publicidad

**Trigger:** Modelo de ingresos con anuncios

**Impacto legal:**
- 🔴 Banner de cookies avanzado
- 🔴 TCF 2.0 (Consent Management Platform)
- 🔴 Política de cookies detallada
- 🔴 Restricciones publicidad para menores

**Estimación:** 3-4 semanas + 2.000-4.000€

---

### Escenario C: Modelo Premium

**Trigger:** Suscripción sin anuncios

**Impacto legal:**
- 🔴 LSSI-CE completa
- 🔴 Condiciones de contratación
- 🔴 Derecho de desistimiento
- 🔴 PSD2 (autenticación fuerte de pagos)

**Estimación:** 2-3 semanas + 2.000-4.000€

---

## 📅 Plan de Implementación por Fases

### Fase 0: MVP Actual (Q4 2025) ✅
- Sin requisitos legales complejos
- Solo verificación de licencias de recursos

### Fase 1: Preparación Básica (Q1 2026)
**Prioridad Media:**
- [ ] Verificar licencias de banderas SVG
- [ ] Crear archivo `ATTRIBUTIONS.md`
- [ ] Banner informativo simple sobre `localStorage`
- [ ] Política de privacidad básica (opcional)

**Tiempo estimado:** 2-3 días

### Fase 2: Auditoría Accesibilidad (Q2 2026)
**Prioridad Baja:**
- [ ] Auditoría WCAG 2.1 (WAVE, Lighthouse)
- [ ] Correcciones de contraste
- [ ] Testing navegación por teclado

**Tiempo estimado:** 3-4 días

### Fase 3: Según Escenario Elegido (2026+)
**Prioridad según decisión de negocio:**
- Implementar según escenario A, B, C o mantener modelo actual

---

## 📋 Checklist de Cumplimiento Legal

### Actual (MVP):
- [x] Sin recopilación de datos personales
- [x] Sin cookies de terceros
- [x] Comunicación anónima con APIs
- [ ] Verificar licencias de recursos (pendiente)

### Futuro (si se implementan cambios):
- [ ] Política de privacidad (`/legal/privacidad`)
- [ ] Aviso legal (`/legal/aviso-legal`)
- [ ] Términos de uso (`/legal/terminos`)
- [ ] Banner de cookies/localStorage
- [ ] Checkbox de consentimiento en registro
- [ ] Endpoints para derechos ARCO (acceso, rectificación, supresión)
- [ ] Cifrado HTTPS en producción
- [ ] Auditoría de seguridad

---

## 🎯 Matriz de Decisiones

| Criterio | Sin cambios | + Registro | + Publicidad | + Premium |
|----------|-------------|------------|--------------|-----------|
| **Complejidad legal** | 🟢 Muy baja | 🔴 Alta | 🔴 Alta | 🟡 Media |
| **Coste implementación** | 0€ | 3.000-6.000€ | 2.000-4.000€ | 2.000-4.000€ |
| **Tiempo desarrollo** | - | 4-6 semanas | 3-4 semanas | 2-3 semanas |
| **Riesgo legal** | 🟢 Muy bajo | 🟡 Medio | 🟡 Medio | 🟢 Bajo |

---

## 📚 Recursos y Referencias

### Documentación oficial:
- **RGPD:** https://eur-lex.europa.eu/eli/reg/2016/679/oj
- **AEPD (España):** https://www.aepd.es
- **WCAG 2.1:** https://www.w3.org/WAI/WCAG21/quickref/

### Herramientas útiles:
- **Generador de políticas:** https://www.privacypolicies.com/
- **Auditoría accesibilidad:** https://wave.webaim.org/
- **Verificador de licencias:** https://choosealicense.com/

---

## ✅ Conclusiones

### Situación actual:
**Transkarte tiene un perfil de riesgo legal MÍNIMO:**
- Sin registro ni datos personales
- Sin cookies de terceros
- Uso educativo y gratuito
- Contenido apropiado para todas las edades

### Recomendaciones:

**Corto plazo (MVP):**
- ✅ Verificar licencias de recursos de terceros (2-3 horas)
- ⚠️ No es urgente implementar políticas legales completas

**Medio plazo (6 meses):**
- 🟡 Banner informativo básico sobre `localStorage`
- 🟡 Auditoría de accesibilidad
- 🟡 Políticas legales básicas (si se escala)

**Largo plazo (1 año+):**
- ⚪ Consultar este documento antes de añadir registro, publicidad o pagos
- ⚪ Implementar según el escenario elegido
- ⚪ Consultoría legal profesional si se escala comercialmente

### Ventaja estratégica:
El diseño actual **sin registro** es una **fortaleza legal**:
- ✅ Menor complejidad normativa
- ✅ Menor coste de cumplimiento
- ✅ Mayor privacidad para usuarios
- ✅ Lanzamiento más rápido

---

## 📝 Próximos Pasos

1. **Completar verificación de licencias** (antes de lanzamiento)
2. **Decidir modelo de negocio futuro** (determina requisitos legales)
3. **Consultar este documento** antes de cambios significativos
4. **Revisar anualmente** las normativas aplicables

---

*Documento elaborado para el proyecto Transkarte - Supuestos y Planificación Legal Futura*  
*Este documento NO describe implementaciones actuales, sino planificación prospectiva*  
*Última actualización: Diciembre 2025*  
*Autores: Sergio Durán, Manolo Cárdeno, Francisco J. Redondo*
