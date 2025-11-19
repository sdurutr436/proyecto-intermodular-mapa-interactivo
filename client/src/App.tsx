
import React, { useState, useCallback } from 'react';
import WorldMap from './components/WorldMap';
import SearchBar from './components/SearchBar';
import TranslationModal from './components/TranslationModal';
import { translateText } from './services/translationService';
import type { TranslationResult } from './types';
import './styles/App.css';

const App: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
    const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleCountryClick = useCallback(async (geo: any) => {
        if (!inputText.trim()) {
            alert("Por favor, escribe un texto para traducir.");
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
    }, [inputText]);

    const closeModal = () => {
        setSelectedCountry(null);
        setTranslationResult(null);
        setError(null);
    };

    return (
        <div className="app-container">
            <main className="app-main">
                <div className="search-container">
                    <SearchBar
                        value={inputText}
                        onChange={(value) => setInputText(value)}
                        placeholder="Escribe una palabra o frase..."
                    />
                     <p className="search-instruction">
                        Escribe algo y luego haz clic en un país del mapa.
                    </p>
                </div>
                
                <div className="map-wrapper">
                    <WorldMap onCountryClick={handleCountryClick} />
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