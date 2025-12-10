/**
 * @file WorldMap.tsx
 * @description Componente interactivo de mapa mundial con zoom, pan y selección de países.
 * Utiliza react-simple-maps para renderizar un mapa vectorial con soporte para países bloqueados.
 * @module components/WorldMap
 */

import React, { memo, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import '../styles/WorldMap.css';
import { countryNameToCode } from '../data/countryCodeMapping';
import { countryColors } from '../data/countryColors';
import { useLanguage } from '../contexts/LanguageContext';

/**
 * URL del atlas mundial en formato TopoJSON
 * @constant
 */
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

import { Feature, GeometryObject } from 'geojson';

/**
 * Props del componente WorldMap
 */
interface WorldMapProps {
  /** Callback ejecutado cuando se hace clic en un país */
  onCountryClick: (geo: Feature<GeometryObject>) => void;
  /** Array de códigos ISO Alpha-3 de países bloqueados (se muestran con patrón de rayas) */
  blockedCountries?: string[];
  /** Indica si el mapa está en modo de juego (afecta el estilo visual) */
  isGameMode?: boolean;
}

const WorldMap: React.FC<WorldMapProps> = ({ onCountryClick, blockedCountries = [], isGameMode = false }) => {
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleMoveEnd = (position: any) => setPosition(position);
  const handleZoomIn = () => {
    if (position.zoom >= 10) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };
  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };
  const handleResetZoom = () => setPosition({ coordinates: [0, 0], zoom: 1 });

  return (
    <div className="world-map-container">
      {/* Controles de Zoom */}
      <div className="zoom-controls">
        <button onClick={handleZoomIn} disabled={position.zoom >= 10} className="zoom-button" title={t.zoomIn}>+</button>
        <button onClick={handleZoomOut} disabled={position.zoom <= 1} className="zoom-button" title={t.zoomOut}>−</button>
        <div className="zoom-separator"></div>
        <button onClick={handleResetZoom} className="zoom-button reset" title={t.resetView}>⌂</button>
      </div>

      {/* Indicador de Zoom - esquina inferior derecha */}
      <div className="zoom-indicator">{t.zoom}: {position.zoom.toFixed(1)}x</div>
      
      {/* Indicador de País - a la izquierda del zoom */}
      <div className="country-indicator">
        <span className="country-indicator-label">{t.country}:</span>
        <span className="country-indicator-name">{hoveredCountry || ''}</span>
      </div>

      {/* Mapa */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 140, center: [10, 45] }}
        className="world-map-svg"
      >
        {/* Definición del patrón de rayas horizontales */}
        <defs>
          <pattern id="horizontal-stripe" width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill="#bdc3c7" />
            <line x1="0" y1="0" x2="8" y2="0" stroke="#e74c3c" strokeWidth="3" />
            <line x1="0" y1="4" x2="8" y2="4" stroke="#e74c3c" strokeWidth="3" />
            <line x1="0" y1="8" x2="8" y2="8" stroke="#e74c3c" strokeWidth="3" />
          </pattern>
        </defs>
        
        <ZoomableGroup
          center={position.coordinates as [number, number]}
          zoom={position.zoom}
          onMoveEnd={handleMoveEnd}
          minZoom={1}
          maxZoom={10}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies
                .filter((geo: Feature<GeometryObject>) => geo.properties?.name !== "Antarctica")
                .map((geo: Feature<GeometryObject>) => {
                  // Mapeamos el nombre del país (del geo) a su código ISO Alpha-3
                  const countryCode = countryNameToCode[geo.properties?.name];
                  // ¿Está bloqueado?
                  const isBlocked = blockedCountries.includes(countryCode);

                  const countryColor = countryColors[geo.properties?.name] || '#f8e292';
                  
                  // Generar un data-testid único para el país (convertir a kebab-case)
                  const countryTestId = geo.properties?.name 
                    ? `country-${geo.properties.name.toLowerCase().replace(/\s+/g, '-')}`
                    : undefined;
                  
                  return (
                    <Geography
                      key={geo.properties?.name || Math.random()}
                      geography={geo}
                      onClick={() => onCountryClick(geo)}
                      onMouseEnter={() => setHoveredCountry(geo.properties?.name || null)}
                      onMouseLeave={() => setHoveredCountry(null)}
                      className={isBlocked ? "country-blocked" : ""}
                      data-testid={countryTestId}
                      style={{
                        default: {
                          fill: isBlocked ? undefined : countryColor,
                          stroke: '#1F2937',
                          strokeWidth: 0.8
                        },
                        hover: isBlocked
                          ? { cursor: "not-allowed" }
                          : { 
                              cursor: "pointer",
                              fill: countryColor,
                              filter: 'brightness(1.15)',
                              stroke: '#111827',
                              strokeWidth: 1.5
                            },
                        pressed: {}
                      }}
                    />
                  );
                })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default memo(WorldMap);
