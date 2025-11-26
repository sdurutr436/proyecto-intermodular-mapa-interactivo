// src/App.tsx

import React, { useState, useCallback, useEffect } from 'react';
import WorldMap from './components/WorldMap';
import SearchBar from './components/SearchBar';
import TranslationModal from './components/TranslationModal';
import GuessGameMode from './components/GuessGameMode';
import GameOverModal from './components/GameOverModal';
import { translateText, getBlockedCountries } from './services/translationService';
import { generateRandomPhrase } from './services/gameService';
import { countryNameToCode } from './data/countryCodeMapping';
import type { TranslationResult, GamePhrase } from './types';
import './styles/App.css';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [gameMode, setGameMode] = useState<'translation' | 'guess'>('translation');

  // Estados del modo de juego
  const [currentPhrase, setCurrentPhrase] = useState<GamePhrase | null>(null);
  const [isPhraseLoading, setIsPhraseLoading] = useState<boolean>(false);
  const [gameStats, setGameStats] = useState({ attempts: 0, correct: 0, lives: 5 });
  const [showHint, setShowHint] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [hintUsed, setHintUsed] = useState<boolean>(false);

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

  const handleDarkModeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // Cargar frase al entrar en modo juego
  useEffect(() => {
    if (gameMode === 'guess' && !currentPhrase && !gameOver) {
      loadNewPhrase();
    }
  }, [gameMode]);

  const loadNewPhrase = async () => {
    setIsPhraseLoading(true);
    setShowHint(false);
    try {
      const phrase = await generateRandomPhrase();
      setCurrentPhrase(phrase);
    } catch (error) {
      console.error('Error loading phrase:', error);
    } finally {
      setIsPhraseLoading(false);
    }
  };

  const handleCountryGuess = (isCorrect: boolean, countryName: string) => {
    setGameStats(prev => ({ ...prev, attempts: prev.attempts + 1 }));

    if (isCorrect) {
      setGameStats(prev => ({ ...prev, correct: prev.correct + 1 }));
      // Cargar nueva frase después de un breve delay
      setTimeout(() => {
        loadNewPhrase();
      }, 2000);
    } else {
      // Perder una vida
      setGameStats(prev => {
        const newLives = prev.lives - 1;
        if (newLives <= 0) {
          setGameOver(true);
        }
        return { ...prev, lives: newLives };
      });
    }
  };

  const handleSkipPhrase = () => {
    setGameStats(prev => {
      const newLives = prev.lives - 1;
      if (newLives <= 0) {
        setGameOver(true);
      }
      return { ...prev, lives: newLives, attempts: prev.attempts + 1 };
    });
    if (gameStats.lives > 1) {
      loadNewPhrase();
    }
  };

  const handleResetGame = () => {
    setGameStats({ attempts: 0, correct: 0, lives: 5 });
    setGameOver(false);
    setShowHint(false);
    setHintUsed(false);
    loadNewPhrase();
  };

  const handleShowHint = () => {
    if (hintUsed) return;
    setShowHint(true);
    setHintUsed(true);
    // Ocultar pista después de 5 segundos
    setTimeout(() => {
      setShowHint(false);
    }, 5000);
  };

  return (
    <div className="app-container">
      {/* Header fijo con 3 columnas */}
      <header className="app-header">
        <div className="header-left">
          <div className="logo-container">
            <div className="logo-wrapper">
              <svg className="logo-globe" width="42" height="42" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="globeGradient" x1="30%" y1="20%" x2="70%" y2="80%">
                    <stop offset="0%" style={{ stopColor: '#5BA4E0', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#4A8FCC', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
                  </linearGradient>
                  <radialGradient id="globeShine" cx="35%" cy="35%">
                    <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.5 }} />
                    <stop offset="50%" style={{ stopColor: '#ffffff', stopOpacity: 0.2 }} />
                    <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
                  </radialGradient>
                </defs>
                {/* Sombra del globo */}
                <ellipse cx="50" cy="90" rx="38" ry="6" fill="#000000" opacity="0.15"/>
                {/* Círculo principal del globo */}
                <circle cx="50" cy="50" r="44" fill="url(#globeGradient)" stroke="#2c5aa0" strokeWidth="2.5"/>
                
                {/* Líneas de latitud con diferentes grosores */}
                <ellipse cx="50" cy="50" rx="44" ry="12" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.7"/>
                <ellipse cx="50" cy="50" rx="44" ry="26" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.5"/>
                <ellipse cx="50" cy="50" rx="44" ry="38" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.3"/>
                {/* Línea del ecuador - más prominente */}
                <line x1="6" y1="50" x2="94" y2="50" stroke="#ffffff" strokeWidth="2.2" opacity="0.85" strokeLinecap="round"/>
                
                {/* Líneas de longitud */}
                <ellipse cx="50" cy="50" rx="12" ry="44" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.7"/>
                <ellipse cx="50" cy="50" rx="26" ry="44" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.5"/>
                <ellipse cx="50" cy="50" rx="38" ry="44" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.3"/>
                {/* Meridiano principal */}
                <line x1="50" y1="6" x2="50" y2="94" stroke="#ffffff" strokeWidth="2.2" opacity="0.85" strokeLinecap="round"/>
                
                {/* Continentes más detallados */}
                {/* América */}
                <path d="M 28 30 Q 30 25, 32 28 L 34 26 Q 36 28, 35 32 L 37 35 Q 38 38, 36 40 L 35 45 Q 33 48, 31 50 L 29 55 Q 27 58, 25 55 L 24 50 Q 23 45, 25 42 L 26 38 Q 27 33, 28 30 Z" 
                      fill="#4CAF7E" opacity="0.85" stroke="#2d8659" strokeWidth="0.5"/>
                {/* Europa/África */}
                <path d="M 48 25 L 52 24 Q 55 25, 56 28 L 58 30 L 60 33 Q 61 36, 59 38 L 58 42 Q 56 45, 54 47 L 52 52 Q 51 56, 53 59 L 55 63 Q 56 67, 54 70 L 52 73 Q 50 75, 48 72 L 47 68 Q 46 64, 48 61 L 49 56 Q 50 52, 48 49 L 46 45 Q 45 41, 47 38 L 48 33 Q 49 28, 48 25 Z" 
                      fill="#E86B5C" opacity="0.85" stroke="#c14a3f" strokeWidth="0.5"/>
                {/* Asia */}
                <path d="M 65 28 L 68 27 Q 71 28, 72 31 L 74 35 Q 75 39, 73 42 L 70 46 Q 68 50, 65 48 L 62 45 Q 61 41, 63 38 L 64 33 Q 65 30, 65 28 Z" 
                      fill="#F2C957" opacity="0.85" stroke="#d4a83d" strokeWidth="0.5"/>
                {/* Oceanía */}
                <path d="M 70 58 L 72 57 Q 74 58, 73 60 L 72 62 Q 70 63, 69 61 L 70 58 Z" 
                      fill="#5983C9" opacity="0.85" stroke="#4267a3" strokeWidth="0.5"/>
                
                {/* Efecto de brillo/reflejo */}
                <circle cx="50" cy="50" r="44" fill="url(#globeShine)" pointerEvents="none"/>
                {/* Brillo superior */}
                <ellipse cx="38" cy="32" rx="12" ry="8" fill="#ffffff" opacity="0.4" transform="rotate(-25 38 32)"/>
              </svg>
              {/* Caracteres flotantes alrededor del globo */}
              <span className="kanji kanji-top">翻</span>
              <span className="kanji kanji-bottom">訳</span>
              <span className="lang-char lang-arabic">ت</span>
              <span className="lang-char lang-russian">П</span>
            </div>
            <h1 className="app-title">Transkarte</h1>
          </div>
        </div>
        
        <div className="header-center">
          {gameMode === 'translation' ? (
            <SearchBar
              value={inputText}
              onChange={(value) => setInputText(value)}
              placeholder="Escribe algo y luego haz clic en un país del mapa"
            />
          ) : (
            <div className="game-mode-title">¿En qué país se habla este idioma?</div>
          )}
        </div>
        
        <div className="header-right">
          {/* Selector de modo de juego */}
          <div className="mode-selector">
            <button 
              className="mode-indicator" 
              onClick={() => {
                const newMode = gameMode === 'translation' ? 'guess' : 'translation';
                setGameMode(newMode);
              }}
            >
              {gameMode === 'translation' ? 'Traducción' : 'Adivinar País'}
              <svg 
                className="dropdown-icon" 
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="currentColor"
              >
                <path d="M6 8L2 4h8L6 8z" />
              </svg>
            </button>
            <div className="mode-dropdown">
              <button 
                className={`mode-option ${gameMode === 'translation' ? 'active' : ''}`}
                onClick={() => setGameMode('translation')}
              >
                Traducción
              </button>
              <button 
                className={`mode-option ${gameMode === 'guess' ? 'active' : ''}`}
                onClick={() => setGameMode('guess')}
              >
                Adivinar País
              </button>
            </div>
          </div>
          
          <button 
            className="dark-mode-toggle"
            aria-label={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            onClick={handleDarkModeToggle}
            title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            <div className={`toggle-switch ${isDarkMode ? 'active' : ''}`}>
              <svg className="toggle-background-icon toggle-sun" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v6m0 10v6M4.22 4.22l4.24 4.24m7.08 7.08l4.24 4.24M1 12h6m10 0h6M4.22 19.78l4.24-4.24m7.08-7.08l4.24-4.24"/>
              </svg>
              <svg className="toggle-background-icon toggle-moon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
              <div className="toggle-circle"></div>
            </div>
          </button>
        </div>
      </header>

      <main className="app-main">
        {gameMode === 'translation' ? (
          <>
            {/* Modo Traducción */}
            <div className="map-wrapper">
              <WorldMap onCountryClick={handleCountryClick} blockedCountries={blockedCountries} />
            </div>
            
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
          </>
        ) : (
          <div className="game-map-wrapper">
            {/* Frase del juego flotante */}
            <div className="game-phrase-floating">
              {isPhraseLoading ? (
                <div className="phrase-loading-floating">
                  <div className="loading-spinner-small"></div>
                  <span>Cargando...</span>
                </div>
              ) : currentPhrase ? (
                <div className="phrase-text-floating">{currentPhrase.text}</div>
              ) : (
                <div className="phrase-error-floating">Error al cargar</div>
              )}
            </div>
            
            {/* Botones de acción flotantes */}
            <div className="game-controls-floating">
              <button 
                className="game-floating-button hint-button"
                onClick={handleShowHint}
                disabled={hintUsed}
                title={hintUsed ? "Pista ya usada" : "Mostrar pista"}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
                </svg>
              </button>
              <button 
                className="game-floating-button skip-button"
                onClick={handleSkipPhrase}
                disabled={isPhraseLoading || gameOver}
                title="Siguiente palabra (pierde 1 vida)"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4l12 8-12 8V4z"/>
                  <path d="M18 4h2v16h-2z"/>
                </svg>
              </button>
              <button 
                className="game-floating-button reset-button"
                onClick={handleResetGame}
                title="Reiniciar juego"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
              </button>
            </div>
            
            {/* Modo Adivinar País */}
            <GuessGameMode 
              currentPhrase={currentPhrase}
              isLoading={isPhraseLoading}
              stats={gameStats}
              onCountryGuess={handleCountryGuess}
              showHint={showHint}
            />
            
            {/* Toast de pista */}
            {showHint && currentPhrase && (
              <div className="hint-toast">
                <div className="hint-toast-icon">💡</div>
                <div className="hint-toast-content">
                  <span className="hint-toast-label">Pista:</span>
                  <span className="hint-toast-language">{currentPhrase.languageName}</span>
                </div>
              </div>
            )}
            
            {/* Modal de Game Over */}
            {gameOver && (
              <GameOverModal
                stats={gameStats}
                onRestart={handleResetGame}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
