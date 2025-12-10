/**
 * @fileoverview Store principal de Zustand para gestión de estado global
 * @module store/useAppStore
 * @description Store centralizado que maneja todo el estado de la aplicación:
 * UI, juego, traducciones, configuraciones y preferencias del usuario.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TranslationResult, GamePhrase, FlagQuestion } from '../types';

/**
 * Tipo de modo de juego disponible
 */
type GameMode = 'translation' | 'guess' | 'flag';

/**
 * Estadísticas del juego
 * @interface GameStats
 */
interface GameStats {
  /** Número total de intentos */
  attempts: number;
  /** Número de respuestas correctas */
  correct: number;
  /** Vidas restantes */
  lives: number;
}

/**
 * Estado de la aplicación
 * @interface AppState
 */
interface AppState {
  // ===== UI STATE =====
  /** Indica si se debe mostrar la landing page */
  showLanding: boolean;
  /** Indica si el modo oscuro está activo */
  isDarkMode: boolean;
  /** Modo de juego actual */
  gameMode: GameMode;
  
  // ===== TRANSLATION STATE =====
  /** Texto de entrada para traducción */
  inputText: string;
  /** País seleccionado en el mapa */
  selectedCountry: any | null;
  /** Resultado de la traducción */
  translationResult: TranslationResult | null;
  /** Indica si está cargando traducción */
  isLoading: boolean;
  /** Mensaje de error de traducción */
  error: string | null;
  /** Lista de países bloqueados (rallados) */
  blockedCountries: string[];
  
  // ===== GAME STATE =====
  /** Frase actual en modo adivinar idioma */
  currentPhrase: GamePhrase | null;
  /** Bandera actual en modo adivinar bandera */
  currentFlag: FlagQuestion | null;
  /** Indica si está cargando frase */
  isPhraseLoading: boolean;
  /** Indica si está cargando bandera */
  isFlagLoading: boolean;
  /** Estadísticas del juego */
  gameStats: GameStats;
  /** Indica si se está mostrando la pista */
  showHint: boolean;
  /** Indica si el juego ha terminado */
  gameOver: boolean;
  /** Indica si ya se usó la pista */
  hintUsed: boolean;
  
  // ===== ACTIONS =====
  // UI Actions
  /** Establece si mostrar la landing page */
  setShowLanding: (show: boolean) => void;
  /** Alterna el modo oscuro */
  toggleDarkMode: () => void;
  /** Establece el modo de juego */
  setGameMode: (mode: GameMode) => void;
  /** Inicia el juego desde la landing page */
  startFromLanding: (mode: GameMode) => void;
  /** Vuelve a la landing page */
  backToLanding: () => void;
  
  // Translation Actions
  /** Establece el texto de entrada */
  setInputText: (text: string) => void;
  /** Establece el país seleccionado */
  setSelectedCountry: (country: any | null) => void;
  /** Establece el resultado de traducción */
  setTranslationResult: (result: TranslationResult | null) => void;
  /** Establece el estado de carga */
  setIsLoading: (loading: boolean) => void;
  /** Establece el mensaje de error */
  setError: (error: string | null) => void;
  /** Establece los países bloqueados */
  setBlockedCountries: (countries: string[]) => void;
  /** Cierra el modal de traducción */
  closeTranslationModal: () => void;
  
  // Game Actions
  /** Establece la frase actual */
  setCurrentPhrase: (phrase: GamePhrase | null) => void;
  /** Establece la bandera actual */
  setCurrentFlag: (flag: FlagQuestion | null) => void;
  /** Establece el estado de carga de frase */
  setIsPhraseLoading: (loading: boolean) => void;
  /** Establece el estado de carga de bandera */
  setIsFlagLoading: (loading: boolean) => void;
  /** Maneja la respuesta del jugador */
  handleGuess: (isCorrect: boolean) => void;
  /** Salta la pregunta actual */
  skipQuestion: () => void;
  /** Muestra la pista */
  showHintAction: () => void;
  /** Oculta la pista */
  hideHint: () => void;
  /** Reinicia el juego */
  resetGame: () => void;
  /** Reinicia las estadísticas al cambiar de modo */
  resetGameStats: () => void;
}

/**
 * Detecta la preferencia de modo oscuro del sistema
 * @returns {boolean} true si el sistema prefiere modo oscuro
 */
const getSystemDarkMode = (): boolean => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
};

/**
 * Store principal de la aplicación usando Zustand
 * 
 * @description Gestiona todo el estado global de Transkarte incluyendo:
 * - Estado de UI (landing page, modo oscuro, modo de juego)
 * - Estado de traducción (input, país seleccionado, resultado)
 * - Estado de juego (frases, banderas, estadísticas, vidas)
 * 
 * Utiliza middleware de persistencia para guardar preferencias en localStorage:
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
        
        // Aplicar cambio al DOM
        if (newMode) {
          document.body.classList.add('dark-mode');
        } else {
          document.body.classList.remove('dark-mode');
        }
      },
      
      setGameMode: (mode) => {
        set({ gameMode: mode });
        // Reiniciar estadísticas al cambiar de modo
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
        
        // Incrementar intentos
        set({
          gameStats: {
            ...state.gameStats,
            attempts: state.gameStats.attempts + 1,
            correct: isCorrect ? state.gameStats.correct + 1 : state.gameStats.correct
          }
        });
        
        // Si es incorrecto, perder una vida
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
          
          // Ocultar pista después de 5 segundos
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
        // Solo persistir preferencias del usuario
        showLanding: state.showLanding,
        isDarkMode: state.isDarkMode,
        gameMode: state.gameMode
      })
    }
  )
);
