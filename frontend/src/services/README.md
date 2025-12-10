# 📡 API Client - Transkarte

Documentación de las llamadas API entre el frontend y backend usando **Axios**.

## 🏗️ Arquitectura

```
frontend/src/services/
├── apiClient.ts          # Cliente HTTP con Axios (configuración base)
├── translationService.ts # API de traducción
├── gameService.ts        # API de juegos
└── index.ts             # Exportaciones centralizadas
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env.local` basado en `.env.example`:

```bash
VITE_API_URL=http://localhost:5000
```

### Cliente Axios

El cliente está configurado en `apiClient.ts` con:

- **Base URL**: Tomada de `VITE_API_URL`
- **Timeout**: 15 segundos
- **Headers**: `Content-Type: application/json`
- **Interceptores**: Logging y manejo de errores automático

## 📋 Servicios Disponibles

### 🌍 Translation Service

#### `translateText(text: string, geo: GeoObject)`

Traduce texto al idioma del país seleccionado.

```typescript
import { translateText } from '@/services';

const result = await translateText('Hello', {
  id: 'ESP',
  properties: { name: 'Spain' }
});

console.log(result.translation); // 'Hola'
console.log(result.detectedLanguage); // 'en'
console.log(result.targetLanguage); // 'es'
```

**Endpoint**: `POST /api/translate`

**Response**:
```json
{
  "translation": "Hola",
  "detectedLanguage": "en",
  "targetLanguage": "es",
  "countryName": "Spain"
}
```

---

#### `getBlockedCountries(text: string)`

Obtiene países bloqueados según el idioma del texto.

```typescript
const { blockedCountries, sourceLang } = await getBlockedCountries('Hello');
// blockedCountries: ['USA', 'GBR', 'CAN', ...]
// sourceLang: 'en'
```

**Endpoint**: `POST /api/translate/blocked-countries`

---

### 🎮 Game Service

#### `generateRandomPhrase()`

Genera una frase aleatoria para el juego de adivinar idioma.

```typescript
import { generateRandomPhrase } from '@/services';

const phrase = await generateRandomPhrase();
console.log(phrase.text); // 'Bonjour'
console.log(phrase.languageCode); // 'fr'
console.log(phrase.languageName); // 'French'
```

**Endpoint**: `GET /api/game/phrase`

**Response**:
```json
{
  "text": "Bonjour",
  "languageCode": "fr",
  "languageName": "French",
  "validCountryCodes": ["FRA", "BEL", "CAN", ...]
}
```

---

#### `generateRandomFlag()`

Genera una bandera aleatoria para el juego de adivinar país.

```typescript
const flag = await generateRandomFlag();
console.log(flag.flagUrl); // 'https://flagcdn.com/w320/es.png'
console.log(flag.countryCode); // 'ESP'
```

**Endpoint**: `GET /api/game/flag`

---

#### `checkCountryGuess(languageCode, guessedCountryCode)`

Valida si el país adivinado es correcto para el idioma.

```typescript
const result = await checkCountryGuess('es', 'MEX');
console.log(result.isCorrect); // true
console.log(result.languageName); // 'Spanish'
```

**Endpoint**: `POST /api/game/validate`

---

#### `checkFlagGuess(targetCountryCode, guessedCountryCode)`

Valida si el país adivinado corresponde a la bandera.

```typescript
const result = await checkFlagGuess('ESP', 'FRA');
console.log(result.isCorrect); // false
console.log(result.correctCountryName); // 'Spain'
```

**Endpoint**: `POST /api/game/validate-flag`

---

#### Estadísticas

```typescript
// Guardar estadísticas
await saveGameStats('session_123', {
  attempts: 10,
  correct: 7,
  lives: 3
});

// Obtener estadísticas
const stats = await getGameStats('session_123');

// Obtener ranking
const top10 = await getLeaderboard(10);
```

## 🛡️ Manejo de Errores

El cliente Axios tiene interceptores que manejan errores automáticamente:

### Códigos de Estado

| Código | Mensaje |
|--------|---------|
| 400 | Solicitud incorrecta |
| 401 | No autorizado |
| 403 | Acceso prohibido |
| 404 | Recurso no encontrado |
| 429 | Demasiadas peticiones |
| 500 | Error del servidor |
| 503 | Servicio no disponible |

### Uso en Componentes

```typescript
try {
  const result = await translateText('Hello', geo);
  // Éxito
} catch (error) {
  // El error ya viene formateado por el interceptor
  console.error(error.message);
  // Mostrar al usuario
  alert(error.message);
}
```

## 🔄 Interceptores

### Request Interceptor

- Logging en desarrollo (`console.log`)
- Agregar headers de autenticación (si se necesita)
- Modificar configuración antes del envío

### Response Interceptor

- Logging de respuestas exitosas
- Transformación de errores HTTP
- Manejo centralizado de errores de red

## 📦 Importación

### Importación individual

```typescript
import { translateText, generateRandomPhrase } from '@/services';
```

### Importación del cliente

```typescript
import apiClient from '@/services/apiClient';

// Uso directo
const response = await apiClient.get('/api/custom-endpoint');
const data = await apiClient.post('/api/data', { payload });
```

## 🧪 Testing

Para probar las APIs en desarrollo:

```typescript
// En la consola del navegador
import { generateRandomPhrase } from './services';

generateRandomPhrase().then(console.log);
```

## 🚀 Producción

Asegúrate de configurar `VITE_API_URL` correctamente:

```bash
# .env.production
VITE_API_URL=https://tu-backend-produccion.com
```

## 📝 Notas

- Todos los métodos son **async** y retornan **Promises**
- Los errores se manejan automáticamente con mensajes legibles
- El timeout por defecto es de **15 segundos**
- Todos los endpoints están documentados con **JSDoc/TSDoc**
