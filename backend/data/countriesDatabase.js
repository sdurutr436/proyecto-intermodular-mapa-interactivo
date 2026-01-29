/**
 * @file countriesDatabase.js
 * @description Static database of world countries with ISO Alpha-3 codes,
 * localized names in Spanish and continents. Includes function to get flag URLs.
 * @module data/countriesDatabase
 */

/**
 * Database of countries organized by ISO Alpha-3 code.
 * Each entry contains the localized name and continent.
 * 
 * @constant {Object.<string, {name: string, continent: string}>}
 * @property {string} name - Country name in Spanish
 * @property {string} continent - Continent it belongs to
 * 
 * @example
 * countriesDatabase['ESP'] // { name: 'España', continent: 'Europa' } (Spanish display values)
 * countriesDatabase['USA'] // { name: 'Estados Unidos', continent: 'América del Norte' }
 */
const countriesDatabase = {
  // Europe
  'ESP': { name: 'España', continent: 'Europa' },
  'FRA': { name: 'Francia', continent: 'Europa' },
  'DEU': { name: 'Alemania', continent: 'Europa' },
  'ITA': { name: 'Italia', continent: 'Europa' },
  'GBR': { name: 'Reino Unido', continent: 'Europa' },
  'PRT': { name: 'Portugal', continent: 'Europa' },
  'NLD': { name: 'Países Bajos', continent: 'Europa' },
  'BEL': { name: 'Bélgica', continent: 'Europa' },
  'CHE': { name: 'Suiza', continent: 'Europa' },
  'AUT': { name: 'Austria', continent: 'Europa' },
  'GRC': { name: 'Grecia', continent: 'Europa' },
  'POL': { name: 'Polonia', continent: 'Europa' },
  'SWE': { name: 'Suecia', continent: 'Europa' },
  'NOR': { name: 'Noruega', continent: 'Europa' },
  'DNK': { name: 'Dinamarca', continent: 'Europa' },
  'FIN': { name: 'Finlandia', continent: 'Europa' },
  'IRL': { name: 'Irlanda', continent: 'Europa' },
  'CZE': { name: 'República Checa', continent: 'Europa' },
  'ROU': { name: 'Rumania', continent: 'Europa' },
  'HUN': { name: 'Hungría', continent: 'Europa' },
  'BGR': { name: 'Bulgaria', continent: 'Europa' },
  'HRV': { name: 'Croacia', continent: 'Europa' },
  'SVK': { name: 'Eslovaquia', continent: 'Europa' },
  'SVN': { name: 'Eslovenia', continent: 'Europa' },
  'SRB': { name: 'Serbia', continent: 'Europa' },
  'UKR': { name: 'Ucrania', continent: 'Europa' },
  'BLR': { name: 'Bielorrusia', continent: 'Europa' },
  'LTU': { name: 'Lituania', continent: 'Europa' },
  'LVA': { name: 'Letonia', continent: 'Europa' },
  'EST': { name: 'Estonia', continent: 'Europa' },
  'ISL': { name: 'Islandia', continent: 'Europa' },
  'ALB': { name: 'Albania', continent: 'Europa' },
  'MKD': { name: 'Macedonia del Norte', continent: 'Europa' },
  'MNE': { name: 'Montenegro', continent: 'Europa' },
  'BIH': { name: 'Bosnia y Herzegovina', continent: 'Europa' },
  'MDA': { name: 'Moldavia', continent: 'Europa' },
  'LUX': { name: 'Luxemburgo', continent: 'Europa' },
  'CYP': { name: 'Chipre', continent: 'Europa' },

  // North America
  'USA': { name: 'Estados Unidos', continent: 'América del Norte' },
  'CAN': { name: 'Canadá', continent: 'América del Norte' },
  'MEX': { name: 'México', continent: 'América del Norte' },

  // Central America and Caribbean
  'GTM': { name: 'Guatemala', continent: 'América Central' },
  'CUB': { name: 'Cuba', continent: 'América Central' },
  'DOM': { name: 'República Dominicana', continent: 'América Central' },
  'HND': { name: 'Honduras', continent: 'América Central' },
  'SLV': { name: 'El Salvador', continent: 'América Central' },
  'NIC': { name: 'Nicaragua', continent: 'América Central' },
  'CRI': { name: 'Costa Rica', continent: 'América Central' },
  'PAN': { name: 'Panamá', continent: 'América Central' },
  'JAM': { name: 'Jamaica', continent: 'América Central' },
  'HTI': { name: 'Haití', continent: 'América Central' },
  'BLZ': { name: 'Belice', continent: 'América Central' },

  // South America
  'ARG': { name: 'Argentina', continent: 'América del Sur' },
  'BRA': { name: 'Brasil', continent: 'América del Sur' },
  'COL': { name: 'Colombia', continent: 'América del Sur' },
  'CHL': { name: 'Chile', continent: 'América del Sur' },
  'PER': { name: 'Perú', continent: 'América del Sur' },
  'VEN': { name: 'Venezuela', continent: 'América del Sur' },
  'ECU': { name: 'Ecuador', continent: 'América del Sur' },
  'BOL': { name: 'Bolivia', continent: 'América del Sur' },
  'PRY': { name: 'Paraguay', continent: 'América del Sur' },
  'URY': { name: 'Uruguay', continent: 'América del Sur' },
  'GUY': { name: 'Guyana', continent: 'América del Sur' },
  'SUR': { name: 'Surinam', continent: 'América del Sur' },

  // Asia
  'CHN': { name: 'China', continent: 'Asia' },
  'JPN': { name: 'Japón', continent: 'Asia' },
  'KOR': { name: 'Corea del Sur', continent: 'Asia' },
  'PRK': { name: 'Corea del Norte', continent: 'Asia' },
  'IND': { name: 'India', continent: 'Asia' },
  'IDN': { name: 'Indonesia', continent: 'Asia' },
  'THA': { name: 'Tailandia', continent: 'Asia' },
  'VNM': { name: 'Vietnam', continent: 'Asia' },
  'MYS': { name: 'Malasia', continent: 'Asia' },
  'PHL': { name: 'Filipinas', continent: 'Asia' },
  'SGP': { name: 'Singapur', continent: 'Asia' },
  'PAK': { name: 'Pakistán', continent: 'Asia' },
  'BGD': { name: 'Bangladés', continent: 'Asia' },
  'NPL': { name: 'Nepal', continent: 'Asia' },
  'LKA': { name: 'Sri Lanka', continent: 'Asia' },
  'MMR': { name: 'Myanmar', continent: 'Asia' },
  'KHM': { name: 'Camboya', continent: 'Asia' },
  'LAO': { name: 'Laos', continent: 'Asia' },
  'MNG': { name: 'Mongolia', continent: 'Asia' },
  'TWN': { name: 'Taiwán', continent: 'Asia' },
  'KAZ': { name: 'Kazajistán', continent: 'Asia' },
  'UZB': { name: 'Uzbekistán', continent: 'Asia' },
  'TKM': { name: 'Turkmenistán', continent: 'Asia' },
  'KGZ': { name: 'Kirguistán', continent: 'Asia' },
  'TJK': { name: 'Tayikistán', continent: 'Asia' },
  'AFG': { name: 'Afganistán', continent: 'Asia' },

  // Middle East
  'TUR': { name: 'Turquía', continent: 'Oriente Medio' },
  'IRN': { name: 'Irán', continent: 'Oriente Medio' },
  'IRQ': { name: 'Irak', continent: 'Oriente Medio' },
  'SAU': { name: 'Arabia Saudita', continent: 'Oriente Medio' },
  'ARE': { name: 'Emiratos Árabes Unidos', continent: 'Oriente Medio' },
  'ISR': { name: 'Israel', continent: 'Oriente Medio' },
  'JOR': { name: 'Jordania', continent: 'Oriente Medio' },
  'LBN': { name: 'Líbano', continent: 'Oriente Medio' },
  'SYR': { name: 'Siria', continent: 'Oriente Medio' },
  'YEM': { name: 'Yemen', continent: 'Oriente Medio' },
  'OMN': { name: 'Omán', continent: 'Oriente Medio' },
  'KWT': { name: 'Kuwait', continent: 'Oriente Medio' },
  'QAT': { name: 'Catar', continent: 'Oriente Medio' },
  'GEO': { name: 'Georgia', continent: 'Oriente Medio' },
  'ARM': { name: 'Armenia', continent: 'Oriente Medio' },
  'AZE': { name: 'Azerbaiyán', continent: 'Oriente Medio' },

  // Africa
  'EGY': { name: 'Egipto', continent: 'África' },
  'ZAF': { name: 'Sudáfrica', continent: 'África' },
  'NGA': { name: 'Nigeria', continent: 'África' },
  'KEN': { name: 'Kenia', continent: 'África' },
  'ETH': { name: 'Etiopía', continent: 'África' },
  'GHA': { name: 'Ghana', continent: 'África' },
  'MAR': { name: 'Marruecos', continent: 'África' },
  'DZA': { name: 'Argelia', continent: 'África' },
  'TUN': { name: 'Túnez', continent: 'África' },
  'LBY': { name: 'Libia', continent: 'África' },
  'SDN': { name: 'Sudán', continent: 'África' },
  'AGO': { name: 'Angola', continent: 'África' },
  'MOZ': { name: 'Mozambique', continent: 'África' },
  'TZA': { name: 'Tanzania', continent: 'África' },
  'UGA': { name: 'Uganda', continent: 'África' },
  'ZMB': { name: 'Zambia', continent: 'África' },
  'ZWE': { name: 'Zimbabue', continent: 'África' },
  'BWA': { name: 'Botsuana', continent: 'África' },
  'NAM': { name: 'Namibia', continent: 'África' },
  'SEN': { name: 'Senegal', continent: 'África' },
  'CIV': { name: 'Costa de Marfil', continent: 'África' },
  'CMR': { name: 'Camerún', continent: 'África' },
  'COD': { name: 'Rep. Dem. del Congo', continent: 'África' },
  'COG': { name: 'Rep. del Congo', continent: 'África' },
  'MLI': { name: 'Mali', continent: 'África' },
  'NER': { name: 'Níger', continent: 'África' },
  'TCD': { name: 'Chad', continent: 'África' },
  'BFA': { name: 'Burkina Faso', continent: 'África' },
  'MDG': { name: 'Madagascar', continent: 'África' },
  'RWA': { name: 'Ruanda', continent: 'África' },
  'BDI': { name: 'Burundi', continent: 'África' },
  'SOM': { name: 'Somalia', continent: 'África' },
  'ERI': { name: 'Eritrea', continent: 'África' },
  'DJI': { name: 'Yibuti', continent: 'África' },
  'MRT': { name: 'Mauritania', continent: 'África' },
  'MWI': { name: 'Malaui', continent: 'África' },
  'LSO': { name: 'Lesoto', continent: 'África' },
  'SWZ': { name: 'Esuatini', continent: 'África' },
  'GIN': { name: 'Guinea', continent: 'África' },
  'LBR': { name: 'Liberia', continent: 'África' },
  'SLE': { name: 'Sierra Leona', continent: 'África' },
  'TGO': { name: 'Togo', continent: 'África' },
  'BEN': { name: 'Benín', continent: 'África' },
  'GAB': { name: 'Gabón', continent: 'África' },
  'GNQ': { name: 'Guinea Ecuatorial', continent: 'África' },
  'CAF': { name: 'Rep. Centroafricana', continent: 'África' },
  'SSD': { name: 'Sudán del Sur', continent: 'África' },

  // Oceania
  'AUS': { name: 'Australia', continent: 'Oceanía' },
  'NZL': { name: 'Nueva Zelanda', continent: 'Oceanía' },
  'PNG': { name: 'Papúa Nueva Guinea', continent: 'Oceanía' },
  'FJI': { name: 'Fiyi', continent: 'Oceanía' },

  // Russia (Transcontinental)
  'RUS': { name: 'Rusia', continent: 'Europa/Asia' },
};

/**
 * Function to get the flag URL of a country
 * Uses the flagcdn.com API
 * @param {string} countryCode - ISO Alpha-3 code of the country
 * @returns {string} Flag URL
 */
const getFlagUrl = (countryCode) => {
  // Mapping from ISO Alpha-3 to ISO Alpha-2 for the flag API
  const alpha3ToAlpha2 = {
    'AFG': 'af', 'ALB': 'al', 'DZA': 'dz', 'AGO': 'ao', 'ARG': 'ar',
    'ARM': 'am', 'AUS': 'au', 'AUT': 'at', 'AZE': 'az', 'BGD': 'bd',
    'BLR': 'by', 'BEL': 'be', 'BLZ': 'bz', 'BEN': 'bj', 'BOL': 'bo',
    'BIH': 'ba', 'BWA': 'bw', 'BRA': 'br', 'BGR': 'bg', 'BFA': 'bf',
    'BDI': 'bi', 'KHM': 'kh', 'CMR': 'cm', 'CAN': 'ca', 'CAF': 'cf',
    'TCD': 'td', 'CHL': 'cl', 'CHN': 'cn', 'COL': 'co', 'COG': 'cg',
    'COD': 'cd', 'CRI': 'cr', 'CIV': 'ci', 'HRV': 'hr', 'CUB': 'cu',
    'CYP': 'cy', 'CZE': 'cz', 'DNK': 'dk', 'DJI': 'dj', 'DOM': 'do',
    'ECU': 'ec', 'EGY': 'eg', 'SLV': 'sv', 'GNQ': 'gq', 'ERI': 'er',
    'EST': 'ee', 'SWZ': 'sz', 'ETH': 'et', 'FJI': 'fj', 'FIN': 'fi',
    'FRA': 'fr', 'GAB': 'ga', 'GEO': 'ge', 'DEU': 'de', 'GHA': 'gh',
    'GRC': 'gr', 'GTM': 'gt', 'GIN': 'gn', 'GUY': 'gy', 'HTI': 'ht',
    'HND': 'hn', 'HUN': 'hu', 'ISL': 'is', 'IND': 'in', 'IDN': 'id',
    'IRN': 'ir', 'IRQ': 'iq', 'IRL': 'ie', 'ISR': 'il', 'ITA': 'it',
    'JAM': 'jm', 'JPN': 'jp', 'JOR': 'jo', 'KAZ': 'kz', 'KEN': 'ke',
    'KWT': 'kw', 'KGZ': 'kg', 'LAO': 'la', 'LVA': 'lv', 'LBN': 'lb',
    'LSO': 'ls', 'LBR': 'lr', 'LBY': 'ly', 'LTU': 'lt', 'LUX': 'lu',
    'MDG': 'mg', 'MWI': 'mw', 'MYS': 'my', 'MLI': 'ml', 'MRT': 'mr',
    'MEX': 'mx', 'MDA': 'md', 'MNG': 'mn', 'MNE': 'me', 'MAR': 'ma',
    'MOZ': 'mz', 'MMR': 'mm', 'NAM': 'na', 'NPL': 'np', 'NLD': 'nl',
    'NZL': 'nz', 'NIC': 'ni', 'NER': 'ne', 'NGA': 'ng', 'PRK': 'kp',
    'MKD': 'mk', 'NOR': 'no', 'OMN': 'om', 'PAK': 'pk', 'PAN': 'pa',
    'PNG': 'pg', 'PRY': 'py', 'PER': 'pe', 'PHL': 'ph', 'POL': 'pl',
    'PRT': 'pt', 'QAT': 'qa', 'ROU': 'ro', 'RUS': 'ru', 'RWA': 'rw',
    'SAU': 'sa', 'SEN': 'sn', 'SRB': 'rs', 'SLE': 'sl', 'SGP': 'sg',
    'SVK': 'sk', 'SVN': 'si', 'SOM': 'so', 'ZAF': 'za', 'KOR': 'kr',
    'SSD': 'ss', 'ESP': 'es', 'LKA': 'lk', 'SDN': 'sd', 'SUR': 'sr',
    'SWE': 'se', 'CHE': 'ch', 'SYR': 'sy', 'TWN': 'tw', 'TJK': 'tj',
    'TZA': 'tz', 'THA': 'th', 'TGO': 'tg', 'TUN': 'tn', 'TUR': 'tr',
    'TKM': 'tm', 'UGA': 'ug', 'UKR': 'ua', 'ARE': 'ae', 'GBR': 'gb',
    'USA': 'us', 'URY': 'uy', 'UZB': 'uz', 'VEN': 've', 'VNM': 'vn',
    'YEM': 'ye', 'ZMB': 'zm', 'ZWE': 'zw',
  };

  const alpha2 = alpha3ToAlpha2[countryCode];
  if (!alpha2) {
    return null;
  }
  
  // Use flagcdn.com to get the flags
  return `https://flagcdn.com/w320/${alpha2}.png`;
};

/**
 * Exports the countries database and the function to get flag URLs
 * @exports countriesDatabase
 * @exports getFlagUrl
 */
module.exports = {
  countriesDatabase,
  getFlagUrl,
};
