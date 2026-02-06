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

## 📜 Applicable Regulations

### 1. 🇪🇺 GDPR (General Data Protection Regulation)

**Current applicability:** 🟢 Minimal  
**Future assumption:** 🔴 High (if registration is implemented)

**Current status:**
- Only stores technical preferences in `localStorage`
- No identifiable personal data
- Translated text not associated with users

**Future implementation assumption:**
- **If registration is added:** Complete ARCO rights system, explicit consents, extended privacy policy
- **Estimation:** 3-4 weeks of development + €2,000-4,000 in consulting

---

### 2. 🍪 ePrivacy Directive / LSSI-CE (Cookie Law)

**Current applicability:** 🟡 Medium  
**Future assumption:** 🔴 High (if third-party cookies are added)

**Current status:**
- Uses `localStorage` for preferences (not HTTP cookies)
- No analytics cookies (Google Analytics, etc.)
- No advertising cookies

**Future implementation assumption:**
- **Basic informative banner:** Inform about `localStorage` use (1-2 days)
- **If analytics/advertising is added:** Complex banner with consent management (2-3 weeks)

---

### 3. ♿ Web Accessibility (WCAG 2.1)

**Current applicability:** 🟢 Recommended  
**Future assumption:** 🔴 Mandatory (public/educational sector)

**Current status:**
- Educational application without legal obligation
- Basic accessibility implemented

**Future implementation assumption:**
- **WCAG 2.1 AA Audit:** Contrast, keyboard navigation, alt text (3-4 days)
- **Professional certification:** €1,000-3,000 (if required)

---

### 4. 📚 Intellectual Property

**Current applicability:** 🟡 Medium  
**Future assumption:** 🟡 Medium (maintenance)

**Third-party resources used:**
- **Maps:** `react-simple-maps` (MIT License) ✅
- **Geographic data:** Natural Earth Data (public domain) ✅
- **Translation APIs:** MyMemory, Google Translate (permitted use) ✅
- **SVG Flags:** 🔴 **Pending verify** origin and license

**Required action:**
- Verify flag licenses (2-3 hours)
- Create `ATTRIBUTIONS.md` file with all licenses

---

### 5. 💼 E-Commerce (LSSI-CE)

**Current applicability:** ⚪ Does not apply  
**Future assumption:** 🔴 High (if monetized)

**Future implementation assumption (Premium/paid model):**
- Complete legal notice with tax data
- Contracting conditions
- Right of withdrawal (14 days)
- Payment gateway integration (PCI-DSS)
- **Estimation:** 2-3 weeks + €1,500-3,000 consulting

---

### 6. 👶 COPPA (Child Protection - USA)

**Current applicability:** ⚪ Does not apply  
**Future assumption:** 🟡 Medium (expansion to USA)

**Current status:**
- Educational content appropriate for all ages
- No personal data collection

**Future implementation assumption:**
- **If expanding to USA with registration:** Age gate (age verification), parental consent
- Only necessary if data is collected from minors under 13 years

---

## 🔮 Future Implementation Scenarios

### Scenario A: User Registration

**Trigger:** Save game progress, custom profiles

**Legal impact:**
- 🔴 Complete GDPR (ARCO system)
- 🔴 Extended privacy policy
- 🔴 Explicit consents
- 🟡 Password encryption (bcrypt)
- 🟡 Mandatory HTTPS

**Estimation:** 4-6 weeks + €3,000-6,000

---

### Scenario B: Monetization with Advertising

**Trigger:** Revenue model with ads

**Legal impact:**
- 🔴 Advanced cookie banner
- 🔴 TCF 2.0 (Consent Management Platform)
- 🔴 Detailed cookie policy
- 🔴 Advertising restrictions for minors

**Estimation:** 3-4 weeks + €2,000-4,000

---

### Scenario C: Premium Model

**Trigger:** Subscription without ads

**Legal impact:**
- 🔴 Complete LSSI-CE
- 🔴 Contracting conditions
- 🔴 Right of withdrawal
- 🔴 PSD2 (strong payment authentication)

**Estimation:** 2-3 weeks + €2,000-4,000

---

## 📅 Phase Implementation Plan

### Phase 0: Current MVP (Q4 2025) ✅
- No complex legal requirements
- Only resource license verification

### Phase 1: Basic Preparation (Q1 2026)
**Medium Priority:**
- [ ] Verify SVG flag licenses
- [ ] Create `ATTRIBUTIONS.md` file
- [ ] Simple informative banner about `localStorage`
- [ ] Basic privacy policy (optional)

**Estimated time:** 2-3 days

### Phase 2: Accessibility Audit (Q2 2026)
**Low Priority:**
- [ ] WCAG 2.1 audit (WAVE, Lighthouse)
- [ ] Contrast corrections
- [ ] Keyboard navigation testing

**Estimated time:** 3-4 days

### Phase 3: According to Chosen Scenario (2026+)
**Priority according to business decision:**
- Implement according to scenario A, B, C or maintain current model

---

## ✅ Legal Compliance Checklist

### Current (MVP):
- [x] No personal data collection
- [x] No third-party cookies
- [x] Anonymous communication with APIs
- [ ] Verify resource licenses (pending)

### Future (if changes are implemented):
- [ ] Privacy policy (`/legal/privacidad`)
- [ ] Legal notice (`/legal/aviso-legal`)
- [ ] Terms of use (`/legal/terminos`)
- [ ] Cookies/localStorage banner
- [ ] Consent checkbox on registration
- [ ] Endpoints for ARCO rights (access, rectification, deletion)
- [ ] HTTPS encryption in production
- [ ] Security audit

---

## 🎯 Decision Matrix

| Criteria | No changes | + Registration | + Advertising | + Premium |
|----------|------------|----------------|---------------|-----------||
| **Legal complexity** | 🟢 Very low | 🔴 High | 🔴 High | 🟡 Medium |
| **Implementation cost** | €0 | €3,000-6,000 | €2,000-4,000 | €2,000-4,000 |
| **Development time** | - | 4-6 weeks | 3-4 weeks | 2-3 weeks |
| **Legal risk** | 🟢 Very low | 🟡 Medium | 🟡 Medium | 🟢 Low |

---

## 📚 Resources and References

### Official documentation:
- **GDPR:** https://eur-lex.europa.eu/eli/reg/2016/679/oj
- **AEPD (Spain):** https://www.aepd.es
- **WCAG 2.1:** https://www.w3.org/WAI/WCAG21/quickref/

### Useful tools:
- **Policy generator:** https://www.privacypolicies.com/
- **Accessibility audit:** https://wave.webaim.org/
- **License checker:** https://choosealicense.com/

---

## ✅ Conclusions

### Current situation:
**Transkarte has a MINIMAL legal risk profile:**
- No registration or personal data
- No third-party cookies
- Educational and free use
- Content appropriate for all ages

### Recommendations:

**Short term (MVP):**
- ✅ Verify third-party resource licenses (2-3 hours)
- ⚠️ Not urgent to implement complete legal policies

**Medium term (6 months):**
- 🟡 Basic informative banner about `localStorage`
- 🟡 Accessibility audit
- 🟡 Basic legal policies (if scaling)

**Long term (1 year+):**
- ⚪ Consult this document before adding registration, advertising, or payments
- ⚪ Implement according to chosen scenario
- ⚪ Professional legal consultation if scaling commercially

### Strategic advantage:
The current **no-registration** design is a **legal strength**:
- ✅ Lower regulatory complexity
- ✅ Lower compliance cost
- ✅ Greater privacy for users
- ✅ Faster launch

---

## 📝 Next Steps

1. **Complete license verification** (before launch)
2. **Decide future business model** (determines legal requirements)
3. **Consult this document** before significant changes
4. **Review annually** applicable regulations

---

*Document prepared for the Transkarte project - Legal Assumptions and Future Planning*  
*This document does NOT describe current implementations, but prospective planning*  
*Last update: December 2025*  
*Authors: Sergio Durán, Manolo Cárdeno, Francisco J. Redondo*
