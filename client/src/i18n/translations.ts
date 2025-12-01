// src/i18n/translations.ts

export type Language = 'en' | 'es';

export interface Translations {
  // Header
  translation: string;
  guessLanguage: string;
  guessFlag: string;
  searchPlaceholder: string;
  headerTitleGuess: string;
  headerTitleFlag: string;
  darkMode: string;
  lightMode: string;
  backToHome: string;
  
  // Landing Page
  landingDescription: string;
  startButton: string;
  orChooseMode: string;
  translationDescription: string;
  guessLanguageDescription: string;
  guessFlagDescription: string;
  aboutUs: string;
  
  // Game
  attempts: string;
  correct: string;
  lives: string;
  hint: string;
  hintUsed: string;
  showHint: string;
  showHintContinent: string;
  nextWord: string;
  nextFlag: string;
  losesLife: string;
  restartGame: string;
  loading: string;
  loadError: string;
  
  // Feedback
  correctAnswer: string;
  incorrectAnswer: string;
  isTheFlagOf: string;
  isNotCorrect: string;
  speaks: string;
  doesNotSpeak: string;
  validationError: string;
  
  // Hints
  hintLabel: string;
  continentLabel: string;
  continent: string;
  flagToGuess: string;
  
  // Game Over
  gameOver: string;
  finalScore: string;
  playAgain: string;
  
  // Map
  zoom: string;
  zoomIn: string;
  zoomOut: string;
  resetView: string;
  country: string;
  hoverCountry: string;
  
  // Language selector
  language: string;
  
  // Translation Modal
  translatedTo: string;
  translationOf: string;
  close: string;
  
  // Alerts/Errors
  writeTextFirst: string;
  countryBlocked: string;
  unexpectedError: string;
  
  // About Modal
  aboutTitle: string;
  aboutIntro: string;
  gameModes: string;
  translationModeTitle: string;
  translationModeDesc: string;
  guessLanguageModeTitle: string;
  guessLanguageModeDesc: string;
  guessFlagModeTitle: string;
  guessFlagModeDesc: string;
  howItWorks: string;
  features: string;
  closeModal: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Header
    translation: 'Translation',
    guessLanguage: 'Guess the Language',
    guessFlag: 'Guess the Flag',
    searchPlaceholder: 'Type something and then click on a country on the map',
    headerTitleGuess: 'In which country is this language spoken?',
    headerTitleFlag: 'Which country does this flag belong to?',
    darkMode: 'Switch to dark mode',
    lightMode: 'Switch to light mode',
    backToHome: 'Back to home',
    
    // Landing Page
    landingDescription: 'Explore the world through languages. Translate, learn, and play.',
    startButton: 'Start',
    orChooseMode: 'Or choose a mode:',
    translationDescription: 'Translate words to different languages',
    guessLanguageDescription: 'Guess which language the phrase is from',
    guessFlagDescription: 'Guess which country the flag belongs to',
    aboutUs: 'About us',
    
    // Game
    attempts: 'Attempts',
    correct: 'Correct',
    lives: 'Lives',
    hint: 'Hint',
    hintUsed: 'Hint already used',
    showHint: 'Show hint',
    showHintContinent: 'Show hint (continent)',
    nextWord: 'Next word (loses 1 life)',
    nextFlag: 'Next flag (loses 1 life)',
    losesLife: 'loses 1 life',
    restartGame: 'Restart game',
    loading: 'Loading...',
    loadError: 'Error loading',
    
    // Feedback
    correctAnswer: 'Correct!',
    incorrectAnswer: 'Incorrect!',
    isTheFlagOf: 'It\'s the flag of',
    isNotCorrect: 'is not the correct country',
    speaks: 'speaks',
    doesNotSpeak: 'does not speak',
    validationError: 'Error validating answer',
    
    // Hints
    hintLabel: 'Hint:',
    continentLabel: 'Continent:',
    continent: 'Continent',
    flagToGuess: 'Flag to guess',
    
    // Game Over
    gameOver: 'Game Over',
    finalScore: 'Final Score',
    playAgain: 'Play Again',
    
    // Map
    zoom: 'Zoom',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    resetView: 'Reset View',
    country: 'Country',
    hoverCountry: 'Hover over a country',
    
    // Language selector
    language: 'Language',
    
    // Translation Modal
    translatedTo: 'Translated to',
    translationOf: 'Translation of',
    close: 'Close',
    
    // Alerts/Errors
    writeTextFirst: 'Please write some text to translate.',
    countryBlocked: 'This country is blocked because its language matches the language of the text you wrote. Please choose another country.',
    unexpectedError: 'An unexpected error occurred.',
    
    // About Modal
    aboutTitle: 'About Transkarte',
    aboutIntro: 'Transkarte is an interactive application that lets you explore the world through languages. It combines geography with language learning in a visual and fun way.',
    gameModes: 'Game Modes',
    translationModeTitle: 'Translation Mode',
    translationModeDesc: 'Write any word or phrase and click on any country on the world map. The app will translate your text to the official language of the selected country.',
    guessLanguageModeTitle: 'Guess the Language',
    guessLanguageModeDesc: 'Test your linguistic knowledge. You will be shown a phrase in an unknown language and you must identify which country speaks that language.',
    guessFlagModeTitle: 'Guess the Flag',
    guessFlagModeDesc: 'A flag will be shown and you must identify which country it belongs to by clicking on the map.',
    howItWorks: 'How it works',
    features: 'Features',
    closeModal: 'Close modal',
  },
  es: {
    // Header
    translation: 'Traducción',
    guessLanguage: 'Adivina el Idioma',
    guessFlag: 'Adivinar la Bandera',
    searchPlaceholder: 'Escribe algo y luego haz clic en un país del mapa',
    headerTitleGuess: '¿En qué país se habla este idioma?',
    headerTitleFlag: '¿A qué país corresponde esta bandera?',
    darkMode: 'Cambiar a modo oscuro',
    lightMode: 'Cambiar a modo claro',
    backToHome: 'Volver al inicio',
    
    // Landing Page
    landingDescription: 'Explora el mundo a través de los idiomas. Traduce, aprende y juega.',
    startButton: 'Empezar',
    orChooseMode: 'O elige un modo:',
    translationDescription: 'Traduce palabras a diferentes idiomas',
    guessLanguageDescription: 'Adivina de qué idioma es la frase',
    guessFlagDescription: 'Adivina a qué país corresponde la bandera',
    aboutUs: 'Sobre nosotros',
    
    // Game
    attempts: 'Intentos',
    correct: 'Aciertos',
    lives: 'Vidas',
    hint: 'Pista',
    hintUsed: 'Pista ya usada',
    showHint: 'Mostrar pista',
    showHintContinent: 'Mostrar pista (continente)',
    nextWord: 'Siguiente palabra (pierde 1 vida)',
    nextFlag: 'Siguiente bandera (pierde 1 vida)',
    losesLife: 'pierde 1 vida',
    restartGame: 'Reiniciar juego',
    loading: 'Cargando...',
    loadError: 'Error al cargar',
    
    // Feedback
    correctAnswer: '¡Correcto!',
    incorrectAnswer: '¡Incorrecto!',
    isTheFlagOf: 'Es la bandera de',
    isNotCorrect: 'no es el país correcto',
    speaks: 'habla',
    doesNotSpeak: 'no habla',
    validationError: 'Error al validar respuesta',
    
    // Hints
    hintLabel: 'Pista:',
    continentLabel: 'Continente:',
    continent: 'Continente',
    flagToGuess: 'Bandera a adivinar',
    
    // Game Over
    gameOver: 'Fin del Juego',
    finalScore: 'Puntuación Final',
    playAgain: 'Jugar de Nuevo',
    
    // Map
    zoom: 'Zoom',
    zoomIn: 'Acercar',
    zoomOut: 'Alejar',
    resetView: 'Restablecer Vista',
    country: 'País',
    hoverCountry: 'Pasa el cursor sobre un país',
    
    // Language selector
    language: 'Idioma',
    
    // Translation Modal
    translatedTo: 'Traducido a',
    translationOf: 'Traducción de',
    close: 'Cerrar',
    
    // Alerts/Errors
    writeTextFirst: 'Por favor, escribe un texto para traducir.',
    countryBlocked: 'Este país está bloqueado porque su idioma coincide con el idioma del texto que escribiste. Por favor, elige otro país.',
    unexpectedError: 'Ocurrió un error inesperado.',
    
    // About Modal
    aboutTitle: 'Sobre Transkarte',
    aboutIntro: 'Transkarte es una aplicación interactiva que te permite explorar el mundo a través de los idiomas. Combina la geografía con el aprendizaje lingüístico de una manera visual y divertida.',
    gameModes: 'Modos de juego',
    translationModeTitle: 'Modo Traducción',
    translationModeDesc: 'Escribe cualquier palabra o frase y haz clic en cualquier país del mapa mundial. La aplicación traducirá tu texto al idioma oficial del país seleccionado.',
    guessLanguageModeTitle: 'Adivina el Idioma',
    guessLanguageModeDesc: 'Pon a prueba tus conocimientos lingüísticos. Se te mostrará una frase en un idioma desconocido y deberás identificar en qué país se habla.',
    guessFlagModeTitle: 'Adivinar la Bandera',
    guessFlagModeDesc: 'Se mostrará una bandera y deberás identificar a qué país pertenece haciendo clic en el mapa.',
    howItWorks: 'Cómo funciona',
    features: 'Características',
    closeModal: 'Cerrar modal',
  },
};

export const getTranslation = (lang: Language): Translations => {
  return translations[lang];
};
