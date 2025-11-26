import React, { memo, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import '../styles/WorldMap.css';
import { countryNameToCode } from '../data/countryCodeMapping'; // Mapeo nombre país → código ISO para rayado
import { countryColors } from '../data/countryColors'; // Colores únicos para cada país

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

import { Feature, GeometryObject } from 'geojson';

interface WorldMapProps {
  onCountryClick: (geo: Feature<GeometryObject>) => void;
  blockedCountries?: string[]; // Array de países bloqueados (códigos ISO)
  isGameMode?: boolean; // Indica si estamos en modo de juego
}

const WorldMap: React.FC<WorldMapProps> = ({ onCountryClick, blockedCountries = [], isGameMode = false }) => {
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  const handleMoveEnd = (position: any) => setPosition(position);
  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
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
        <button onClick={handleZoomIn} disabled={position.zoom >= 4} className="zoom-button" title="Acercar (Zoom In)">+</button>
        <button onClick={handleZoomOut} disabled={position.zoom <= 1} className="zoom-button" title="Alejar (Zoom Out)">−</button>
        <div className="zoom-separator"></div>
        <button onClick={handleResetZoom} className="zoom-button reset" title="Restablecer Vista">⌂</button>
      </div>

      {/* Indicador de Nivel de Zoom */}
      <div className="zoom-indicator">Zoom: {position.zoom.toFixed(1)}x</div>

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
          maxZoom={4}
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
                  
                  return (
                    <Geography
                      key={geo.properties?.name || Math.random()}
                      geography={geo}
                      onClick={() => onCountryClick(geo)}
                      className={isBlocked ? "country-blocked" : ""}
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
