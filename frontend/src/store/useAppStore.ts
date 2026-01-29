/**
 * @fileoverview Main Zustand store for global state management
 * @module store/useAppStore
 * @description Centralized store that handles all application state:
 * UI, game, translations, settings and user preferences.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TranslationResult, GamePhrase, FlagQuestion } from '../types';

/**
 * Available game mode type
 */
type GameMode = 'translation' | 'guess' | 'flag';

/**
 * Game statistics
 * @interface GameStats
 */
interface GameStats {
  /** Total number of attempts */
  attempts: number;
  /** Number of correct answers */
  correct: number;
  /** Remaining lives */
  lives: number;
}

/**
 * Application state
 * @interface AppState
 */
interface AppState {
  // ===== UI STATE =====
  /** Indicates whether to show the landing page */
  showLanding: boolean;
  /** Indicates whether dark mode is active */
  isDarkMode: boolean;
  /** Current game mode */
  gameMode: GameMode;
  
  // ===== TRANSLATION STATE =====
  /** Input text for translation */
  inputText: string;
  /** Selected country on the map */
  selectedCountry: any | null;
  /** Translation result */
  translationResult: TranslationResult | null;
  /** Indicates if translation is loading */
  isLoading: boolean;
  /** Translation error message */
  error: string | null;
  /** List of blocked (scratched) countries */
  blockedCountries: string[];
  
  // ===== GAME STATE =====
  /** Current phrase in guess language mode */
  currentPhrase: GamePhrase | null;
  /** Current flag in guess flag mode */
  currentFlag: FlagQuestion | null;
  /** Indicates if phrase is loading */
  isPhraseLoading: boolean;
  /** Indicates if flag is loading */
  isFlagLoading: boolean;
  /** Game statistics */
  gameStats: GameStats;
  /** Indicates if hint is being shown */
  showHint: boolean;
  /** Indicates if the game is over */
  gameOver: boolean;
  /** Indicates if hint has been used */
  hintUsed: boolean;
  
  // ===== ACTIONS =====
  // UI Actions
  /** Sets whether to show the landing page */
  setShowLanding: (show: boolean) => void;
  /** Toggles dark mode */
  toggleDarkMode: () => void;
  /** Sets the game mode */
  setGameMode: (mode: GameMode) => void;
  /** Starts the game from the landing page */
  startFromLanding: (mode: GameMode) => void;
  /** Returns to the landing page */
  backToLanding: () => void;
  
  // Translation Actions
  /** Sets the input text */
  setInputText: (text: string) => void;
  /** Sets the selected country */
  setSelectedCountry: (country: any | null) => void;
  /** Sets the translation result */
  setTranslationResult: (result: TranslationResult | null) => void;
  /** Sets the loading state */
  setIsLoading: (loading: boolean) => void;
  /** Sets the error message */
  setError: (error: string | null) => void;
  /** Sets the blocked countries */
  setBlockedCountries: (countries: string[]) => void;
  /** Closes the translation modal */
  closeTranslationModal: () => void;
  
  // Game Actions
  /** Sets the current phrase */
  setCurrentPhrase: (phrase: GamePhrase | null) => void;
  /** Sets the current flag */
  setCurrentFlag: (flag: FlagQuestion | null) => void;
  /** Sets the phrase loading state */
  setIsPhraseLoading: (loading: boolean) => void;
  /** Sets the flag loading state */
  setIsFlagLoading: (loading: boolean) => void;
  /** Handles the player's guess */
  handleGuess: (isCorrect: boolean) => void;
  /** Skips the current question */
  skipQuestion: () => void;
  /** Shows the hint */
  showHintAction: () => void;
  /** Hides the hint */
  hideHint: () => void;
  /** Resets the game */
  resetGame: () => void;
  /** Resets the stats when changing mode */
  resetGameStats: () => void;
}

/**
 * Detects the system's dark mode preference
 * @returns {boolean} true if the system prefers dark mode
 */
const getSystemDarkMode = (): boolean => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};

/**
 * Main application store using Zustand
 * 
 * @description Manages all global state of Transkarte including:
 * - UI state (landing page, dark mode, game mode)
 * - Translation state (input, selected country, result)
 * - Game state (phrases, flags, statistics, lives)
 * 
 * Uses persistence middleware to save preferences in localStorage:
 * - showLanding
 * - isDarkMode
 * - gameMode
 * 
 * @example
 * ```tsx
 * // En un componente
 * const { isDarkMode, toggleDarkMode } = useAppStore();
 * 
 * return (
 *   <button onClick={toggleDarkMode}>
 *     {isDarkMode ? '🌙' : '☀️'}
 *   </button>
 * );
 * ```
 */
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ===== INITIAL STATE =====
      // UI State
      showLanding: true,
      isDarkMode: getSystemDarkMode(),
      gameMode: 'translation',
      
      // Translation State
      inputText: '',
      selectedCountry: null,
      translationResult: null,
      isLoading: false,
      error: null,
      blockedCountries: [],
      
      // Game State
      currentPhrase: null,
      currentFlag: null,
      isPhraseLoading: false,
      isFlagLoading: false,
      gameStats: { attempts: 0, correct: 0, lives: 5 },
      showHint: false,
      gameOver: false,
      hintUsed: false,
      
      // ===== UI ACTIONS =====
      setShowLanding: (show) => set({ showLanding: show }),
      
      toggleDarkMode: () => {
        const newMode = !get().isDarkMode;
        set({ isDarkMode: newMode });
        
        // Apply change to DOM
        if (newMode) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
      },
      
      setGameMode: (mode) => {
        set({ gameMode: mode });
        // Reset stats when changing mode
        get().resetGameStats();
      },
      
      startFromLanding: (mode) => {
        set({ 
          gameMode: mode,
          showLanding: false
        });
      },
      
      backToLanding: () => {
        set({ showLanding: true });
      },
      
      // ===== TRANSLATION ACTIONS =====
      setInputText: (text) => set({ inputText: text }),
      
      setSelectedCountry: (country) => set({ selectedCountry: country }),
      
      setTranslationResult: (result) => set({ translationResult: result }),
      
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      setBlockedCountries: (countries) => set({ blockedCountries: countries }),
      
      closeTranslationModal: () => set({
        selectedCountry: null,
        translationResult: null,
        error: null
      }),
      
      // ===== GAME ACTIONS =====
      setCurrentPhrase: (phrase) => set({ currentPhrase: phrase }),
      
      setCurrentFlag: (flag) => set({ currentFlag: flag }),
      
      setIsPhraseLoading: (loading) => set({ isPhraseLoading: loading }),
      
      setIsFlagLoading: (loading) => set({ isFlagLoading: loading }),
      
      handleGuess: (isCorrect) => {
        const state = get();
        
        // Increment attempts
        set({
          gameStats: {
            ...state.gameStats,
            attempts: state.gameStats.attempts + 1,
            correct: isCorrect ? state.gameStats.correct + 1 : state.gameStats.correct
          }
        });
        
        // If incorrect, lose a life
        if (!isCorrect) {
          const newLives = state.gameStats.lives - 1;
          set({
            gameStats: {
              ...state.gameStats,
              lives: newLives
            },
            gameOver: newLives <= 0
          });
        }
      },
      
      skipQuestion: () => {
        const state = get();
        const newLives = state.gameStats.lives - 1;
        
        set({
          gameStats: {
            ...state.gameStats,
            lives: newLives,
            attempts: state.gameStats.attempts + 1
          },
          gameOver: newLives <= 0
        });
      },
      
      showHintAction: () => {
        const state = get();
        if (!state.hintUsed) {
          set({ showHint: true, hintUsed: true });
          
          // Hide hint after 5 seconds
          setTimeout(() => {
            set({ showHint: false });
          }, 5000);
        }
      },
      
      hideHint: () => set({ showHint: false }),
      
      resetGame: () => set({
        gameStats: { attempts: 0, correct: 0, lives: 5 },
        gameOver: false,
        showHint: false,
        hintUsed: false,
        currentPhrase: null,
        currentFlag: null
      }),
      
      resetGameStats: () => set({
        gameStats: { attempts: 0, correct: 0, lives: 5 },
        gameOver: false,
        showHint: false,
        hintUsed: false,
        currentPhrase: null,
        currentFlag: null
      })
    }),
    {
      name: 'transkarte-storage',
      partialize: (state) => ({
        // Only persist user preferences
        showLanding: state.showLanding,
        isDarkMode: state.isDarkMode,
        gameMode: state.gameMode
      })
    }
  )
);
