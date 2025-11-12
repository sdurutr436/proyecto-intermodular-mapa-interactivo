/**
 * Issue 4.3 - Sprint 4
 * Definiciones de tipos TypeScript para el proyecto
 */

/**
 * Resultado de una traducción
 */
export interface TranslationResult {
  translation: string;
  language: string;
  fromCache: boolean;
  originalText?: string;
  alpha3Code?: string;
}

/**
 * Propiedades de un país en el GeoJSON
 */
export interface CountryProperties {
  name: string;
  [key: string]: any;
}

/**
 * Geometría de un país en el GeoJSON
 */
export interface CountryGeometry {
  type: string;
  coordinates: number[][][];
}

/**
 * Feature de un país en el GeoJSON
 */
export interface GeoFeature {
  type: 'Feature';
  properties: CountryProperties;
  geometry: CountryGeometry;
  id?: string;
}

/**
 * Props del componente WorldMap
 */
export interface WorldMapProps {
  onCountryClick: (countryName: string, countryCode: string) => void;
  inputText?: string;
}

/**
 * Props del componente SearchBar
 */
export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Props del componente TranslationModal
 */
export interface TranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  country: string;
  originalText: string;
  result: TranslationResult | null;
  isLoading: boolean;
  error: string | null;
}
