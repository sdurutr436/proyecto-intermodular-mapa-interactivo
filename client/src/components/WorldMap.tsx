import React, { memo, useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from 'react-simple-maps';
import '../styles/WorldMap.css';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

import { Feature, GeometryObject } from 'geojson';

interface WorldMapProps {
  onCountryClick: (geo: Feature<GeometryObject>) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ onCountryClick }) => {
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  const handleMoveEnd = (position: any) => {
    setPosition(position);
  };

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };

  const handleResetZoom = () => {
    setPosition({ coordinates: [0, 0], zoom: 1 });
  };

  return (
    <div className="world-map-container">
      {/* Controles de Zoom */}
      <div className="zoom-controls">
        {/* Botón Zoom In */}
        <button
          onClick={handleZoomIn}
          disabled={position.zoom >= 4}
          className="zoom-button"
          title="Acercar (Zoom In)"
        >
          +
        </button>

        {/* Botón Zoom Out */}
        <button
          onClick={handleZoomOut}
          disabled={position.zoom <= 1}
          className="zoom-button"
          title="Alejar (Zoom Out)"
        >
          −
        </button>

        {/* Separador */}
        <div className="zoom-separator"></div>

        {/* Botón Reset */}
        <button
          onClick={handleResetZoom}
          className="zoom-button reset"
          title="Restablecer Vista"
        >
          ⌂
        </button>
      </div>

      {/* Indicador de Nivel de Zoom */}
      <div className="zoom-indicator">
        Zoom: {position.zoom.toFixed(1)}x
      </div>

      {/* Mapa */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 140, center: [10, 45] }}
        className="world-map-svg"
      >
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
                .map((geo: Feature<GeometryObject>) => (
                <Geography
                  key={geo.properties?.name || Math.random()}
                  geography={geo}
                  onClick={() => onCountryClick(geo)}
                  style={{
                    default: {
                      fill: "#27374D",
                      stroke: "#4A5568",
                      strokeWidth: 0.75,
                      outline: "none",
                    },
                    hover: {
                      fill: "#0891B2",
                      stroke: "#164E63",
                      strokeWidth: 1,
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: "#0E7490",
                      stroke: "#164E63",
                      strokeWidth: 1,
                      outline: "none",
                    },
                  }}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default memo(WorldMap);

