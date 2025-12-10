/**
 * @file phrasesDatabase.js
 * @description Base de datos de frases traducidas organizadas por idioma.
 * Cada idioma contiene frases de ejemplo y los países donde se habla oficialmente.
 * Usado para el modo de juego "Adivina el idioma".
 * @module data/phrasesDatabase
 */

/**
 * Base de datos de frases por código de idioma ISO 639-1.
 * 
 * @constant {Object.<string, {languageName: string, countryCodes: string[], phrases: string[]}>}
 * @property {string} languageName - Nombre completo del idioma
 * @property {string[]} countryCodes - Códigos ISO Alpha-3 de países donde se habla
 * @property {string[]} phrases - Frases de ejemplo en ese idioma
 * 
 * @example
 * phrasesDatabase['es']
 * // {
 * //   languageName: 'Español',
 * //   countryCodes: ['ESP', 'MEX', 'ARG', ...],
 * //   phrases: ['Hola, ¿cómo estás?', ...]
 * // }
 */
const phrasesDatabase = {
  'es': {
    languageName: 'Español',
    countryCodes: ['ESP', 'MEX', 'ARG', 'COL', 'CHL', 'PER', 'VEN', 'ECU', 'GTM', 'CUB', 'BOL', 'DOM', 'HND', 'PRY', 'SLV', 'NIC', 'CRI', 'PAN', 'URY', 'GNQ'],
    phrases: [
      'Hola, ¿cómo estás?',
      'Buenos días',
      'Hasta luego',
      'Gracias por todo',
      'El mundo es hermoso',
      'Me encanta viajar',
      'La vida es bella',
      '¿Dónde está la biblioteca?',
      'Quiero aprender idiomas',
      'El sol brilla hoy',
    ]
  },
  'en': {
    languageName: 'Inglés',
    countryCodes: ['USA', 'GBR', 'CAN', 'AUS', 'NZL', 'IRL', 'ZAF', 'IND', 'PAK', 'NGA', 'KEN', 'UGA', 'TZA', 'GHA', 'ZMB', 'ZWE', 'SGP', 'PHL', 'MLT', 'JAM'],
    phrases: [
      'Hello, how are you?',
      'Good morning',
      'See you later',
      'Thank you very much',
      'The world is beautiful',
      'I love traveling',
      'Life is wonderful',
      'Where is the library?',
      'I want to learn languages',
      'The sun is shining today',
    ]
  },
  'fr': {
    languageName: 'Francés',
    countryCodes: ['FRA', 'BEL', 'CHE', 'CAN', 'LUX', 'MCO', 'SEN', 'CIV', 'MLI', 'NER', 'TCD', 'BFA', 'GIN', 'BEN', 'TGO', 'BDI', 'RWA', 'COD', 'COG', 'GAB', 'CMR', 'DJI', 'COM', 'MDG', 'HTI'],
    phrases: [
      'Bonjour, comment allez-vous?',
      'Bonne journée',
      'À bientôt',
      'Merci beaucoup',
      'Le monde est magnifique',
      "J'adore voyager",
      'La vie est belle',
      'Où est la bibliothèque?',
      'Je veux apprendre des langues',
      "Le soleil brille aujourd'hui",
    ]
  },
  'de': {
    languageName: 'Alemán',
    countryCodes: ['DEU', 'AUT', 'CHE', 'LUX', 'LIE'],
    phrases: [
      'Hallo, wie geht es dir?',
      'Guten Morgen',
      'Bis später',
      'Vielen Dank',
      'Die Welt ist schön',
      'Ich liebe es zu reisen',
      'Das Leben ist wunderbar',
      'Wo ist die Bibliothek?',
      'Ich möchte Sprachen lernen',
      'Die Sonne scheint heute',
    ]
  },
  'it': {
    languageName: 'Italiano',
    countryCodes: ['ITA', 'CHE', 'SMR', 'VAT'],
    phrases: [
      'Ciao, come stai?',
      'Buongiorno',
      'A dopo',
      'Grazie mille',
      'Il mondo è bellissimo',
      'Amo viaggiare',
      'La vita è bella',
      'Dove è la biblioteca?',
      'Voglio imparare le lingue',
      'Il sole splende oggi',
    ]
  },
  'pt': {
    languageName: 'Portugués',
    countryCodes: ['BRA', 'PRT', 'AGO', 'MOZ', 'GNB', 'TLS', 'GNQ', 'CPV', 'STP'],
    phrases: [
      'Olá, como está?',
      'Bom dia',
      'Até logo',
      'Muito obrigado',
      'O mundo é lindo',
      'Eu amo viajar',
      'A vida é bela',
      'Onde fica a biblioteca?',
      'Quero aprender idiomas',
      'O sol está brilhando hoje',
    ]
  },
  'ru': {
    languageName: 'Ruso',
    countryCodes: ['RUS', 'BLR', 'KAZ', 'KGZ'],
    phrases: [
      'Привет, как дела?',
      'Доброе утро',
      'До скорого',
      'Большое спасибо',
      'Мир прекрасен',
      'Я люблю путешествовать',
      'Жизнь прекрасна',
      'Где библиотека?',
      'Я хочу учить языки',
      'Сегодня светит солнце',
    ]
  },
  'ar': {
    languageName: 'Árabe',
    countryCodes: ['SAU', 'EGY', 'DZA', 'MAR', 'IRQ', 'YEM', 'SYR', 'TUN', 'JOR', 'ARE', 'LBY', 'LBN', 'PSE', 'OMN', 'KWT', 'QAT', 'BHR', 'DJI', 'COM', 'MRT', 'SOM', 'SDN', 'TCD'],
    phrases: [
      'مرحبا، كيف حالك؟',
      'صباح الخير',
      'أراك لاحقاً',
      'شكراً جزيلاً',
      'العالم جميل',
      'أحب السفر',
      'الحياة جميلة',
      'أين المكتبة؟',
      'أريد تعلم اللغات',
      'الشمس مشرقة اليوم',
    ]
  },
  'zh': {
    languageName: 'Chino',
    countryCodes: ['CHN', 'TWN', 'SGP'],
    phrases: [
      '你好，你好吗？',
      '早上好',
      '再见',
      '非常感谢',
      '世界很美',
      '我喜欢旅行',
      '生活很美好',
      '图书馆在哪里？',
      '我想学习语言',
      '今天阳光明媚',
    ]
  },
  'ja': {
    languageName: 'Japonés',
    countryCodes: ['JPN'],
    phrases: [
      'こんにちは、元気ですか？',
      'おはようございます',
      'またね',
      'ありがとうございます',
      '世界は美しい',
      '旅行が大好きです',
      '人生は素晴らしい',
      '図書館はどこですか？',
      '言語を学びたいです',
      '今日は太陽が輝いています',
    ]
  },
  'ko': {
    languageName: 'Coreano',
    countryCodes: ['KOR', 'PRK'],
    phrases: [
      '안녕하세요, 어떻게 지내세요?',
      '좋은 아침',
      '나중에 봐요',
      '정말 감사합니다',
      '세계는 아름답습니다',
      '여행을 좋아합니다',
      '인생은 아름답습니다',
      '도서관은 어디에 있나요?',
      '언어를 배우고 싶어요',
      '오늘은 햇살이 빛나고 있어요',
    ]
  },
  'hi': {
    languageName: 'Hindi',
    countryCodes: ['IND'],
    phrases: [
      'नमस्ते, आप कैसे हैं?',
      'सुप्रभात',
      'फिर मिलेंगे',
      'बहुत धन्यवाद',
      'दुनिया सुंदर है',
      'मुझे यात्रा करना पसंद है',
      'जीवन सुंदर है',
      'पुस्तकालय कहाँ है?',
      'मैं भाषाएँ सीखना चाहता हूँ',
      'आज सूरज चमक रहा है',
    ]
  },
  'tr': {
    languageName: 'Turco',
    countryCodes: ['TUR', 'CYP'],
    phrases: [
      'Merhaba, nasılsın?',
      'Günaydın',
      'Sonra görüşürüz',
      'Çok teşekkür ederim',
      'Dünya güzel',
      'Seyahat etmeyi seviyorum',
      'Hayat güzel',
      'Kütüphane nerede?',
      'Dil öğrenmek istiyorum',
      'Bugün güneş parlıyor',
    ]
  },
  'nl': {
    languageName: 'Holandés',
    countryCodes: ['NLD', 'BEL', 'SUR'],
    phrases: [
      'Hallo, hoe gaat het?',
      'Goedemorgen',
      'Tot later',
      'Heel erg bedankt',
      'De wereld is mooi',
      'Ik hou van reizen',
      'Het leven is mooi',
      'Waar is de bibliotheek?',
      'Ik wil talen leren',
      'De zon schijnt vandaag',
    ]
  },
  'sv': {
    languageName: 'Sueco',
    countryCodes: ['SWE', 'FIN'],
    phrases: [
      'Hej, hur mår du?',
      'God morgon',
      'Vi ses senare',
      'Tack så mycket',
      'Världen är vacker',
      'Jag älskar att resa',
      'Livet är underbart',
      'Var är biblioteket?',
      'Jag vill lära mig språk',
      'Solen skiner idag',
    ]
  },
  'pl': {
    languageName: 'Polaco',
    countryCodes: ['POL'],
    phrases: [
      'Cześć, jak się masz?',
      'Dzień dobry',
      'Do zobaczenia',
      'Dziękuję bardzo',
      'Świat jest piękny',
      'Uwielbiam podróżować',
      'Życie jest piękne',
      'Gdzie jest biblioteka?',
      'Chcę uczyć się języków',
      'Słońce świeci dzisiaj',
    ]
  },
};

module.exports = phrasesDatabase;
