/**
 * @file App.tsx
 * @description Root component of the application refactored with Zustand.
 * Handles navigation between game modes using the centralized store.
 * @module components/App
 */

import React, { useCallback, useEffect } from 'react';
import WorldMap from './components/WorldMap';
import SearchBar from './components/SearchBar';
import TranslationModal from './components/TranslationModal';
import GuessGameMode from './components/GuessGameMode';
import FlagGameMode from './components/FlagGameMode';
import GameOverModal from './components/GameOverModal';
import LandingPage from './components/LandingPage';
import AppLogo from './components/AppLogo';
import ErrorBoundary from './components/ErrorBoundary';
import { translateText, getBlockedCountries } from './services/translationService';
import { generateRandomPhrase, generateRandomFlag } from './services/gameService';
import { countryNameToCode } from './data/countryCodeMapping';
import { useLanguage } from './contexts/LanguageContext';
import { useAppStore } from './store/useAppStore';
import './styles/App.css';
import './styles/FlagGameMode.css';

const App: React.FC = () => {
  // Language hook
  const { language, setLanguage, t } = useLanguage();
  
  // Zustand store
  const {
    // UI State
    showLanding,
    isDarkMode,
    gameMode,
    
    // Translation State
    inputText,
    selectedCountry,
    translationResult,
    isLoading,
    error,
    blockedCountries,
    
    // Game State
    currentPhrase,
    currentFlag,
    isPhraseLoading,
    isFlagLoading,
    gameStats,
    showHint,
    gameOver,
    hintUsed,
    
    // Actions
    setInputText,
    setSelectedCountry,
    setTranslationResult,
    setIsLoading,
    setError,
    setBlockedCountries,
    closeTranslationModal,
    toggleDarkMode,
    setGameMode,
    startFromLanding,
    backToLanding,
    setCurrentPhrase,
    setCurrentFlag,
    setIsPhraseLoading,
    setIsFlagLoading,
    handleGuess,
    skipQuestion,
    showHintAction,
    resetGame
  } = useAppStore();

  // Apply initial dark mode on load
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  // Query blocked countries each time the text changes
  useEffect(() => {
    if (!inputText.trim()) {
      setBlockedCountries([]);
      return;
    }
    getBlockedCountries(inputText)
      .then(({ blockedCountries }) => setBlockedCountries(blockedCountries))
      .catch(() => setBlockedCountries([]));
  }, [inputText, setBlockedCountries]);

  // Callback for country click
  const handleCountryClick = useCallback(async (geo: any) => {
    if (!inputText.trim()) {
      alert(t.writeTextFirst);
      return;
    }

    // Visual block: striped country
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
  }, [inputText, blockedCountries, t, setSelectedCountry, setIsLoading, setError, setTranslationResult]);

  // Generic function to load new content based on mode
  const loadNewContent = useCallback(async () => {
    if (gameMode === 'guess') {
      setIsPhraseLoading(true);
      try {
        const phrase = await generateRandomPhrase();
        setCurrentPhrase(phrase);
      } catch (error) {
        // Error handled silently
      } finally {
        setIsPhraseLoading(false);
      }
    } else if (gameMode === 'flag') {
      setIsFlagLoading(true);
      try {
        const flag = await generateRandomFlag();
        setCurrentFlag(flag);
      } catch (error) {
        // Error handled silently
      } finally {
        setIsFlagLoading(false);
      }
    }
  }, [gameMode, setIsPhraseLoading, setCurrentPhrase, setIsFlagLoading, setCurrentFlag]);

  // Load content when entering game mode
  useEffect(() => {
    const needsPhrase = gameMode === 'guess' && !currentPhrase && !gameOver;
    const needsFlag = gameMode === 'flag' && !currentFlag && !gameOver;
    
    if (needsPhrase || needsFlag) {
      loadNewContent();
    }
  }, [gameMode, currentPhrase, currentFlag, gameOver, loadNewContent]);

  const handleCountryGuess = (isCorrect: boolean, countryName: string) => {
    handleGuess(isCorrect);

    if (isCorrect) {
      setTimeout(loadNewContent, 2000);
    }
  };

  const handleSkipQuestion = () => {
    skipQuestion();
    if (gameStats.lives > 1) {
      loadNewContent();
    }
  };

  const handleResetGame = () => {
    resetGame();
    loadNewContent();
  };

  // Show landing page if it's the first visit
  if (showLanding) {
    return (
      <ErrorBoundary>
        <LandingPage 
          onStart={startFromLanding}
          isDarkMode={isDarkMode}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="app-container">
      {/* Fixed header with 3 columns */}
      <header className="app-header">
        <div className="header-left">
          <AppLogo size="small" showTitle gradientId="header" />
          <button 
            className="home-button"
            aria-label={t.backToHome}
            onClick={backToLanding}
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
          {/* Game mode selector */}
          <div className="mode-selector">
            <button 
              className="mode-indicator" 
              onClick={() => {
                const modes: ('translation' | 'guess' | 'flag')[] = ['translation', 'guess', 'flag'];
                const currentIndex = modes.indexOf(gameMode);
                const nextMode = modes[(currentIndex + 1) % modes.length];
                setGameMode(nextMode);
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
            <div className="mode-dropdown" role="menu">
              <button 
                className={`mode-option ${gameMode === 'translation' ? 'active' : ''}`}
                onClick={() => setGameMode('translation')}
                role="menuitem"
              >
                {t.translation}
              </button>
              <button 
                className={`mode-option ${gameMode === 'guess' ? 'active' : ''}`}
                onClick={() => setGameMode('guess')}
                role="menuitem"
              >
                {t.guessLanguage}
              </button>
              <button 
                className={`mode-option ${gameMode === 'flag' ? 'active' : ''}`}
                onClick={() => setGameMode('flag')}
                role="menuitem"
              >
                {t.guessFlag}
              </button>
            </div>
          </div>

          {/* Language selector */}
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
            <nav className="language-dropdown" role="menu" aria-label="Language selection">
              <button 
                className={`language-option ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
                role="menuitem"
              >
                <span className="lang-flag" aria-hidden="true">🇬🇧</span>
                <span>English</span>
              </button>
              <button 
                className={`language-option ${language === 'es' ? 'active' : ''}`}
                onClick={() => setLanguage('es')}
                role="menuitem"
              >
                <span className="lang-flag" aria-hidden="true">🇪🇸</span>
                <span>Español</span>
              </button>
            </nav>
          </div>
          
          <button 
            className="dark-mode-toggle"
            aria-label={isDarkMode ? t.lightMode : t.darkMode}
            onClick={toggleDarkMode}
            title={isDarkMode ? t.lightMode : t.darkMode}
          >
            <span className={`toggle-switch ${isDarkMode ? 'active' : ''}`} aria-hidden="true">
              <svg className="toggle-background-icon toggle-sun" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v6m0 10v6M4.22 4.22l4.24 4.24m7.08 7.08l4.24 4.24M1 12h6m10 0h6M4.22 19.78l4.24-4.24m7.08-7.08l4.24-4.24"/>
              </svg>
              <svg className="toggle-background-icon toggle-moon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
              <span className="toggle-circle"></span>
            </span>
          </button>
        </div>
      </header>

      <main className="app-main">
        {gameMode === 'translation' ? (
          <>
            {/* Translation Mode */}
            <section className="map-wrapper" aria-label="Translation mode">
              <WorldMap onCountryClick={handleCountryClick} blockedCountries={blockedCountries} />
            </section>
            
            {selectedCountry && (
              <TranslationModal
                countryName={selectedCountry.properties.name}
                originalText={inputText}
                result={translationResult}
                isLoading={isLoading}
                error={error}
                onClose={closeTranslationModal}
              />
            )}
          </>
        ) : gameMode === 'guess' ? (
          <section className="game-map-wrapper" aria-label="Guess language game">
            {/* Floating game phrase */}
            <article className="game-phrase-floating" aria-live="polite">
              {isPhraseLoading ? (
                <figure className="phrase-loading-floating">
                  <span className="loading-spinner-small" aria-hidden="true"></span>
                  <figcaption>{t.loading}</figcaption>
                </figure>
              ) : currentPhrase ? (
                <blockquote className="phrase-text-floating">{currentPhrase.text}</blockquote>
              ) : (
                <p className="phrase-error-floating" role="alert">{t.loadError}</p>
              )}
            </article>
            
            {/* Floating action buttons */}
            <nav className="game-controls-floating" aria-label="Game controls">
              <button 
                className="game-floating-button hint-button"
                onClick={showHintAction}
                disabled={hintUsed}
                title={hintUsed ? t.hintUsed : t.showHint}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
                </svg>
              </button>
              <button 
                className="game-floating-button skip-button"
                onClick={handleSkipQuestion}
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
            </nav>
            
            {/* Guess Country Mode */}
            <GuessGameMode 
              currentPhrase={currentPhrase}
              isLoading={isPhraseLoading}
              stats={gameStats}
              onCountryGuess={handleCountryGuess}
              showHint={showHint}
            />
            
            {/* Hint toast */}
            {showHint && currentPhrase && (
              <aside className="hint-toast" role="status" aria-live="polite">
                <span className="hint-toast-icon" aria-hidden="true">💡</span>
                <p className="hint-toast-content">
                  <strong className="hint-toast-label">{t.hint}:</strong>
                  <span className="hint-toast-language">{currentPhrase.languageName}</span>
                </p>
              </aside>
            )}
            
            {/* Modal de Game Over */}
            {gameOver && (
              <GameOverModal
                stats={gameStats}
                onRestart={handleResetGame}
              />
            )}
          </section>
        ) : (
          <section className="game-map-wrapper" aria-label="Guess flag game">
            {/* Floating game flag */}
            <figure className="flag-display-floating" aria-live="polite">
              {isFlagLoading ? (
                <figcaption className="flag-loading-floating">
                  <span className="loading-spinner-small" aria-hidden="true"></span>
                  <span>{t.loading}</span>
                </figcaption>
              ) : currentFlag ? (
                <picture className="flag-image-container">
                  <img 
                    src={currentFlag.flagUrl} 
                    alt={t.flagToGuess}
                    className="flag-image"
                  />
                </picture>
              ) : (
                <figcaption className="flag-error-floating" role="alert">{t.loadError}</figcaption>
              )}
            </figure>
            
            {/* Floating action buttons */}
            <nav className="game-controls-floating" aria-label="Game controls">
              <button 
                className="game-floating-button hint-button"
                onClick={showHintAction}
                disabled={hintUsed}
                title={hintUsed ? t.hintUsed : t.showHintContinent}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/>
                </svg>
              </button>
              <button 
                className="game-floating-button skip-button"
                onClick={handleSkipQuestion}
                disabled={isFlagLoading || gameOver}
                title={t.nextFlag}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M6 4l12 8-12 8V4z"/>
                  <path d="M18 4h2v16h-2z"/>
                </svg>
              </button>
              <button 
                className="game-floating-button reset-button"
                onClick={handleResetGame}
                title={t.restartGame}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                </svg>
              </button>
            </nav>
            
            {/* Guess Flag Mode */}
            <FlagGameMode 
              currentFlag={currentFlag}
              isLoading={isFlagLoading}
              stats={gameStats}
              onCountryGuess={handleCountryGuess}
              showHint={showHint}
            />
            
            {/* Hint toast - Continent */}
            {showHint && currentFlag && (
              <aside className="hint-toast-flag" role="status" aria-live="polite">
                <span className="hint-toast-icon" aria-hidden="true">🌍</span>
                <p className="hint-toast-content">
                  <strong className="hint-toast-label">{t.continent}:</strong>
                  <span className="hint-toast-continent">{currentFlag.continent}</span>
                </p>
              </aside>
            )}
            
            {/* Game Over modal */}
            {gameOver && (
              <GameOverModal
                stats={gameStats}
                onRestart={handleResetGame}
              />
            )}
          </section>
        )}
      </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;
