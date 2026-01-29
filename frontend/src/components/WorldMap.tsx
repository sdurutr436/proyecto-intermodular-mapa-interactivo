/**
 * @file WorldMap.tsx
 * @description Interactive world map component with zoom, pan and country selection.
 * Uses react-simple-maps to render a vector map with support for blocked countries.
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
 * World atlas URL in TopoJSON format
 * @constant
 */
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

import { Feature, GeometryObject } from 'geojson';

/**
 * WorldMap component props
 */
interface WorldMapProps {
  /** Callback executed when a country is clicked */
  onCountryClick: (geo: Feature<GeometryObject>) => void;
  /** Array of ISO Alpha-3 codes of blocked countries (displayed with stripe pattern) */
  blockedCountries?: string[];
  /** Indicates if the map is in game mode (affects visual style) */
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
    <section className="world-map-container" aria-label="Interactive World Map">
      {/* Controles de Zoom */}
      <nav className="zoom-controls" aria-label="Map zoom controls">
        <button onClick={handleZoomIn} disabled={position.zoom >= 10} className="zoom-button" title={t.zoomIn}>+</button>
        <button onClick={handleZoomOut} disabled={position.zoom <= 1} className="zoom-button" title={t.zoomOut}>−</button>
        <span className="zoom-separator" aria-hidden="true"></span>
        <button onClick={handleResetZoom} className="zoom-button reset" title={t.resetView}>⌂</button>
      </nav>

      {/* Zoom Indicator - bottom right corner */}
      <output className="zoom-indicator" aria-live="polite">{t.zoom}: {position.zoom.toFixed(1)}x</output>
      
      {/* Country Indicator - to the left of zoom */}
      <output className="country-indicator" aria-live="polite">
        <span className="country-indicator-label">{t.country}:</span>
        <span className="country-indicator-name">{hoveredCountry || ''}</span>
      </output>

      {/* Mapa */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 140, center: [10, 45] }}
        className="world-map-svg"
      >
        {/* Definition of horizontal stripe pattern */}
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
                  // Map the country name (from geo) to its ISO Alpha-3 code
                  const countryCode = countryNameToCode[geo.properties?.name];
                  // Is it blocked?
                  const isBlocked = blockedCountries.includes(countryCode);

                  const countryColor = countryColors[geo.properties?.name] || '#f8e292';
                  
                  // Generate a unique data-testid for the country (convert to kebab-case)
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
    </section>
  );
};

export default memo(WorldMap);
