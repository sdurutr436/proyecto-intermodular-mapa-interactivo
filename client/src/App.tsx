// src/App.tsx

import React, { useState, useCallback, useEffect } from 'react';
import WorldMap from './components/WorldMap';
import SearchBar from './components/SearchBar';
import TranslationModal from './components/TranslationModal';
import GuessGameMode from './components/GuessGameMode';
import FlagGameMode from './components/FlagGameMode';
import GameOverModal from './components/GameOverModal';
import LandingPage from './components/LandingPage';
import AppLogo from './components/AppLogo';
import { translateText, getBlockedCountries } from './services/translationService';
import { generateRandomPhrase, generateRandomFlag } from './services/gameService';
import { countryNameToCode } from './data/countryCodeMapping';
import { useLanguage } from './contexts/LanguageContext';
import type { TranslationResult, GamePhrase, FlagQuestion } from './types';
import type { Language } from './i18n/translations';
import './styles/App.css';
import './styles/FlagGameMode.css';

// Clave para localStorage
const STORAGE_KEY_LANDING = 'tradumap_has_visited';
const STORAGE_KEY_LAST_MODE = 'tradumap_last_mode';
const STORAGE_KEY_DARK_MODE = 'tradumap_dark_mode';

const App: React.FC = () => {
  // Hook de idioma
  const { language, setLanguage, t } = useLanguage();
  
  // Estado para mostrar/ocultar la landing page
  const [showLanding, setShowLanding] = useState<boolean>(() => {
    // Verificar si el usuario ya ha visitado antes
    const hasVisited = localStorage.getItem(STORAGE_KEY_LANDING);
    return !hasVisited;
  });

  // Detectar preferencia de modo oscuro del sistema
  const getSystemDarkMode = (): boolean => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  };

  const [inputText, setInputText] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<any | null>(null);
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Inicializar modo oscuro basado en preferencia guardada o del sistema
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem(STORAGE_KEY_DARK_MODE);
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    return getSystemDarkMode();
  });
  
  // Inicializar modo de juego basado en el último usado
  const [gameMode, setGameMode] = useState<'translation' | 'guess' | 'flag'>(() => {
    const lastMode = localStorage.getItem(STORAGE_KEY_LAST_MODE);
    if (lastMode === 'guess' || lastMode === 'flag') return lastMode;
    return 'translation';
  });

  // Estados del modo de juego
  const [currentPhrase, setCurrentPhrase] = useState<GamePhrase | null>(null);
  const [currentFlag, setCurrentFlag] = useState<FlagQuestion | null>(null);
  const [isPhraseLoading, setIsPhraseLoading] = useState<boolean>(false);
  const [isFlagLoading, setIsFlagLoading] = useState<boolean>(false);
  const [gameStats, setGameStats] = useState({ attempts: 0, correct: 0, lives: 5 });
  const [showHint, setShowHint] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [hintUsed, setHintUsed] = useState<boolean>(false);

  // Estado para países bloqueados (rallados)
  const [blockedCountries, setBlockedCountries] = useState<string[]>([]);

  // Aplicar modo oscuro inicial al cargar
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  // Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        // Solo cambiar si el usuario no ha establecido una preferencia manual
        const savedMode = localStorage.getItem(STORAGE_KEY_DARK_MODE);
        if (savedMode === null) {
          setIsDarkMode(e.matches);
          if (e.matches) {
            document.body.classList.add('dark-mode');
          } else {
            document.body.classList.remove('dark-mode');
          }
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

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

  // Handler para iniciar desde la landing page
  const handleStartFromLanding = (mode: 'translation' | 'guess' | 'flag') => {
    setGameMode(mode);
    localStorage.setItem(STORAGE_KEY_LANDING, 'true');
    localStorage.setItem(STORAGE_KEY_LAST_MODE, mode);
    setShowLanding(false);
  };

  // Callback para clic en país
  const handleCountryClick = useCallback(async (geo: any) => {
    if (!inputText.trim()) {
      alert(t.writeTextFirst);
      return;
    }

    // Bloqueo visual: país rallado
    const code = countryNameToCode[geo.properties.name];
    if (blockedCountries.includes(code)) {
      alert(t.countryBlocked);
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
      let errorMessage = t.unexpectedError;
      if (e instanceof Error) {
        errorMessage = e.message;
      } else if (typeof e === 'string') {
        errorMessage = e;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, blockedCountries, t]);

  const closeModal = () => {
    setSelectedCountry(null);
    setTranslationResult(null);
    setError(null);
  };

  const handleDarkModeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem(STORAGE_KEY_DARK_MODE, String(newMode));
    if (newMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const handleBackToLanding = () => {
    localStorage.removeItem(STORAGE_KEY_LANDING);
    setShowLanding(true);
  };

  // Guardar el último modo cuando cambia y reiniciar estadísticas
  const handleGameModeChange = (newMode: 'translation' | 'guess' | 'flag') => {
    setGameMode(newMode);
    localStorage.setItem(STORAGE_KEY_LAST_MODE, newMode);
    // Reiniciar estadísticas y estado del juego al cambiar de modo
    setGameStats({ attempts: 0, correct: 0, lives: 5 });
    setGameOver(false);
    setShowHint(false);
    setHintUsed(false);
    setCurrentPhrase(null);
    setCurrentFlag(null);
  };

  // Cargar frase al entrar en modo juego de adivinar idioma
  useEffect(() => {
    if (gameMode === 'guess' && !currentPhrase && !gameOver) {
      loadNewPhrase();
    }
  }, [gameMode]);

  // Cargar bandera al entrar en modo juego de adivinar bandera
  useEffect(() => {
    if (gameMode === 'flag' && !currentFlag && !gameOver) {
      loadNewFlag();
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

  const loadNewFlag = async () => {
    setIsFlagLoading(true);
    setShowHint(false);
    try {
      const flag = await generateRandomFlag();
      setCurrentFlag(flag);
    } catch (error) {
      console.error('Error loading flag:', error);
    } finally {
      setIsFlagLoading(false);
    }
  };

  const handleCountryGuess = (isCorrect: boolean, countryName: string) => {
    setGameStats(prev => ({ ...prev, attempts: prev.attempts + 1 }));

    if (isCorrect) {
      setGameStats(prev => ({ ...prev, correct: prev.correct + 1 }));
      // Cargar nueva frase/bandera después de un breve delay
      setTimeout(() => {
        if (gameMode === 'guess') {
          loadNewPhrase();
        } else if (gameMode === 'flag') {
          loadNewFlag();
        }
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
      if (gameMode === 'guess') {
        loadNewPhrase();
      } else if (gameMode === 'flag') {
        loadNewFlag();
      }
    }
  };

  const handleResetGame = () => {
    setGameStats({ attempts: 0, correct: 0, lives: 5 });
    setGameOver(false);
    setShowHint(false);
    setHintUsed(false);
    if (gameMode === 'guess') {
      loadNewPhrase();
    } else if (gameMode === 'flag') {
      loadNewFlag();
    }
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

  // Mostrar landing page si es la primera visita
  if (showLanding) {
    return (
      <LandingPage 
        onStart={handleStartFromLanding}
        isDarkMode={isDarkMode}
      />
    );
  }

  return (
    <div className="app-container">
      {/* Header fijo con 3 columnas */}
      <header className="app-header">
        <div className="header-left">
          <AppLogo size="small" showTitle gradientId="header" />
          <button 
            className="home-button"
            aria-label={t.backToHome}
            onClick={handleBackToLanding}
            title={t.backToHome}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </button>
        </div>
        
        <div className="header-center">
          {gameMode === 'translation' ? (
            <SearchBar
              value={inputText}
              onChange={(value) => setInputText(value)}
              placeholder={t.searchPlaceholder}
            />
          ) : gameMode === 'guess' ? (
            <div className="game-mode-title">{t.headerTitleGuess}</div>
          ) : (
            <div className="game-mode-title">{t.headerTitleFlag}</div>
          )}
        </div>
        
        <div className="header-right">
          {/* Selector de modo de juego */}
          <div className="mode-selector">
            <button 
              className="mode-indicator" 
              onClick={() => {
                const modes: ('translation' | 'guess' | 'flag')[] = ['translation', 'guess', 'flag'];
                const currentIndex = modes.indexOf(gameMode);
                const nextMode = modes[(currentIndex + 1) % modes.length];
                handleGameModeChange(nextMode);
              }}
            >
              {gameMode === 'translation' ? t.translation : gameMode === 'guess' ? t.guessLanguage : t.guessFlag}
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
                onClick={() => handleGameModeChange('translation')}
              >
                {t.translation}
              </button>
              <button 
                className={`mode-option ${gameMode === 'guess' ? 'active' : ''}`}
                onClick={() => handleGameModeChange('guess')}
              >
                {t.guessLanguage}
              </button>
              <button 
                className={`mode-option ${gameMode === 'flag' ? 'active' : ''}`}
                onClick={() => handleGameModeChange('flag')}
              >
                {t.guessFlag}
              </button>
            </div>
          </div>

          {/* Selector de idioma */}
          <div className="language-selector">
            <button className="language-indicator">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span className="language-code">{language.toUpperCase()}</span>
              <svg className="dropdown-icon" width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 8L2 4h8L6 8z" />
              </svg>
            </button>
            <div className="language-dropdown">
              <button 
                className={`language-option ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
              >
                <span className="lang-flag">🇬🇧</span>
                <span>English</span>
              </button>
              <button 
                className={`language-option ${language === 'es' ? 'active' : ''}`}
                onClick={() => setLanguage('es')}
              >
                <span className="lang-flag">🇪🇸</span>
                <span>Español</span>
              </button>
            </div>
          </div>
          
          <button 
            className="dark-mode-toggle"
            aria-label={isDarkMode ? t.lightMode : t.darkMode}
            onClick={handleDarkModeToggle}
            title={isDarkMode ? t.lightMode : t.darkMode}
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
        ) : gameMode === 'guess' ? (
          <div className="game-map-wrapper">
            {/* Frase del juego flotante */}
            <div className="game-phrase-floating">
              {isPhraseLoading ? (
                <div className="phrase-loading-floating">
                  <div className="loading-spinner-small"></div>
                  <span>{t.loading}</span>
                </div>
              ) : currentPhrase ? (
                <div className="phrase-text-floating">{currentPhrase.text}</div>
              ) : (
                <div className="phrase-error-floating">{t.loadError}</div>
              )}
            </div>
            
            {/* Botones de acción flotantes */}
            <div className="game-controls-floating">
              <button 
                className="game-floating-button hint-button"
                onClick={handleShowHint}
                disabled={hintUsed}
                title={hintUsed ? t.hintUsed : t.showHint}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
                </svg>
              </button>
              <button 
                className="game-floating-button skip-button"
                onClick={handleSkipPhrase}
                disabled={isPhraseLoading || gameOver}
                title={t.nextWord}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4l12 8-12 8V4z"/>
                  <path d="M18 4h2v16h-2z"/>
                </svg>
              </button>
              <button 
                className="game-floating-button reset-button"
                onClick={handleResetGame}
                title={t.restartGame}
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
                  <span className="hint-toast-label">{t.hint}:</span>
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
        ) : (
          <div className="game-map-wrapper">
            {/* Bandera del juego flotante */}
            <div className="flag-display-floating">
              {isFlagLoading ? (
                <div className="flag-loading-floating">
                  <div className="loading-spinner-small"></div>
                  <span>{t.loading}</span>
                </div>
              ) : currentFlag ? (
                <div className="flag-image-container">
                  <img 
                    src={currentFlag.flagUrl} 
                    alt={t.flagToGuess}
                    className="flag-image"
                  />
                </div>
              ) : (
                <div className="flag-error-floating">{t.loadError}</div>
              )}
            </div>
            
            {/* Botones de acción flotantes */}
            <div className="game-controls-floating">
              <button 
                className="game-floating-button hint-button"
                onClick={handleShowHint}
                disabled={hintUsed}
                title={hintUsed ? t.hintUsed : t.showHintContinent}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
                </svg>
              </button>
              <button 
                className="game-floating-button skip-button"
                onClick={handleSkipPhrase}
                disabled={isFlagLoading || gameOver}
                title={t.nextFlag}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4l12 8-12 8V4z"/>
                  <path d="M18 4h2v16h-2z"/>
                </svg>
              </button>
              <button 
                className="game-floating-button reset-button"
                onClick={handleResetGame}
                title={t.restartGame}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
              </button>
            </div>
            
            {/* Modo Adivinar Bandera */}
            <FlagGameMode 
              currentFlag={currentFlag}
              isLoading={isFlagLoading}
              stats={gameStats}
              onCountryGuess={handleCountryGuess}
              showHint={showHint}
            />
            
            {/* Toast de pista - Continente */}
            {showHint && currentFlag && (
              <div className="hint-toast-flag">
                <div className="hint-toast-icon">🌍</div>
                <div className="hint-toast-content">
                  <span className="hint-toast-label">{t.continent}:</span>
                  <span className="hint-toast-continent">{currentFlag.continent}</span>
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
