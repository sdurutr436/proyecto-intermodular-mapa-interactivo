/**
 * Issue 4.6 - Sprint 4
 * Componente WorldMap - Mapa interactivo con react-simple-maps
 * 
 * Este componente renderiza un mapa mundial interactivo donde los usuarios
 * pueden hacer clic en países para iniciar una traducción.
 * 
 * Características:
 * - Renderiza mapa con proyección geoMercator
 * - Países clickeables con efectos hover
 * - Estilos visuales diferenciados (default, hover, pressed)
 * - Integración con World Atlas para datos GeoJSON
 */

import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography
} from 'react-simple-maps';
import { WorldMapProps, GeoFeature } from '../types';
import '../styles/WorldMap.css';

// URL del GeoJSON de World Atlas (110m = resolución media, buen balance tamaño/detalle)
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

/**
 * Componente WorldMap
 * 
 * @param {WorldMapProps} props - Propiedades del componente
 * @param {function} props.onCountryClick - Callback cuando se hace clic en un país
 * @param {string} props.inputText - Texto a traducir (opcional, para validación)
 */
const WorldMap: React.FC<WorldMapProps> = ({ onCountryClick, inputText }) => {
  
  /**
   * Maneja el clic en un país
   * @param {GeoFeature} geo - Objeto GeoJSON del país
   */
  const handleCountryClick = (geo: GeoFeature) => {
    const countryName = geo.properties.name;
    
    // Validar que hay texto antes de permitir clic
    if (!inputText || inputText.trim().length === 0) {
      alert('⚠️ Por favor, escribe un texto antes de seleccionar un país');
      return;
    }
    
    // Llamar al callback del padre con nombre del país
    // El código ISO se obtendrá en el backend usando countryCodeMapping
    onCountryClick(countryName, countryName);
    
    console.log(`[WorldMap] País seleccionado: ${countryName}`);
  };

  return (
    <div className="world-map-container">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 140,
          center: [10, 45]
        }}
        className="world-map-svg"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies
              // Filtrar Antarctica (opcional, puede removerse si se desea incluir)
              .filter((geo: GeoFeature) => geo.properties.name !== 'Antarctica')
              .map((geo: GeoFeature) => (
                <Geography
                  key={geo.properties.name}
                  geography={geo}
                  onClick={() => handleCountryClick(geo)}
                  style={{
                    default: {
                      fill: '#2c3e50',
                      stroke: '#34495e',
                      strokeWidth: 0.5,
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    },
                    hover: {
                      fill: '#3498db',
                      stroke: '#2980b9',
                      strokeWidth: 1,
                      cursor: 'pointer',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    },
                    pressed: {
                      fill: '#1abc9c',
                      stroke: '#16a085',
                      strokeWidth: 1,
                      outline: 'none',
                      transition: 'all 0.1s ease'
                    }
                  }}
                />
              ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default WorldMap;
