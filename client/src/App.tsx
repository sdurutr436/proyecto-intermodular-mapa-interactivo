// src/App.tsx

import React, { useState, useCallback, useEffect } from 'react';
import WorldMap from './components/WorldMap';
import SearchBar from './components/SearchBar';
import TranslationModal from './components/TranslationModal';
import { translateText, getBlockedCountries } from './services/translationService';
import { countryNameToCode } from './data/countryCodeMapping';   // Importación correcta aquí
import type { TranslationResult } from './types';
import './styles/App.css';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para países bloqueados (rallados)
  const [blockedCountries, setBlockedCountries] = useState<string[]>([]);

  // Consultar países bloqueados cada vez que cambia el texto
  useEffect(() => {
    if (!inputText.trim()) {
      setBlockedCountries([]);
      return;
    }
    getBlockedCountries(inputText)
      .then(({ blockedCountries }) => setBlockedCountries(blockedCountries))
      .catch(() => setBlockedCountries([]));
  }, [inputText]);

  // Callback para clic en país
  const handleCountryClick = useCallback(async (geo: any) => {
    if (!inputText.trim()) {
      alert("Por favor, escribe un texto para traducir.");
      return;
    }

    // Bloqueo visual: país rallado
    const code = countryNameToCode[geo.properties.name];
    if (blockedCountries.includes(code)) {
      alert("Este país está bloqueado porque su idioma coincide con el idioma del texto que escribiste. Por favor, elige otro país.");
      return;
    }

    setSelectedCountry(geo);
    setIsLoading(true);
    setError(null);
    setTranslationResult(null);

    try {
      const result = await translateText(inputText, geo);
      setTranslationResult(result);
    } catch (e: any) {
      let errorMessage = "Ocurrió un error inesperado.";
      if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === 'string') {
        errorMessage = e;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, blockedCountries]);

  const closeModal = () => {
    setSelectedCountry(null);
    setTranslationResult(null);
    setError(null);
  };

  return (
    <div className="app-container">
      {/* Header fijo con 3 columnas */}
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">Tradumap</h1>
        </div>
        
        <div className="header-center">
          <SearchBar
            value={inputText}
            onChange={(value) => setInputText(value)}
            placeholder="Escribe algo y luego haz clic en un país del mapa"
          />
        </div>
        
        <div className="header-right">
          <button className="hamburger-menu" aria-label="Menú">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <main className="app-main">
        {/* Pasamos los países bloqueados al mapa */}
        <div className="map-wrapper">
          <WorldMap onCountryClick={handleCountryClick} blockedCountries={blockedCountries} />
        </div>
      </main>

      <footer className="app-footer">
        <p className="footer-text">
          Desarrollado con MERN (MongoDB, Express, React, Node.js) y Docker.
        </p>
      </footer>

      {selectedCountry && (
        <TranslationModal
          countryName={selectedCountry.properties.name}
          originalText={inputText}
          result={translationResult}
          isLoading={isLoading}
          error={error}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default App;
