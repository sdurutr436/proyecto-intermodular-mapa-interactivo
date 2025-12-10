/**
 * @fileoverview Mapeo de colores para países del mapa interactivo
 * @module data/countryColors
 * @description Define colores hexadecimales únicos y vibrantes para cada país,
 * diseñados para ser visualmente diferenciables tanto entre sí como del fondo.
 * Los colores se utilizan para resaltar países en el mapa y en efectos de iluminación.
 */

// client/src/data/countryColors.ts

/**
 * Colores sólidos y vibrantes para cada país del mundo
 * 
 * @constant {Record<string, string>}
 * @description Objeto que mapea nombres de países (en inglés) a colores hexadecimales.
 * Los colores están organizados alfabéticamente y seleccionados para:
 * - Alta visibilidad sobre fondos claros y oscuros
 * - Diferenciación clara entre países vecinos
 * - Consistencia con identidades visuales nacionales cuando es posible
 * 
 * @example
 * ```ts
 * // Obtener el color de España
 * const spanishColor = countryColors['Spain']; // '#E63946'
 * 
 * // Usar en estilos dinámicos
 * style={{ fill: countryColors[countryName] }}
 * ```
 */
export const countryColors: Record<string, string> = {
  // A
  'Afghanistan': '#E63946',
  'Albania': '#9D4EDD',
  'Algeria': '#06A77D',
  'Angola': '#FF6B35',
  'Argentina': '#457B9D',
  'Armenia': '#D62828',
  'Australia': '#2A9D8F',
  'Austria': '#E85D75',
  'Azerbaijan': '#00B4D8',
  
  // B
  'Bahamas': '#0096C7',
  'Bangladesh': '#52B788',
  'Belarus': '#BC4B51',
  'Belgium': '#5A189A',
  'Belize': '#3A86FF',
  'Benin': '#FFB627',
  'Bhutan': '#FB8500',
  'Bolivia': '#C1121F',
  'Bosnia and Herzegovina': '#4361EE',
  'Botswana': '#48CAE4',
  'Brazil': '#38B000',
  'Brunei': '#F4A261',
  'Bulgaria': '#2D6A4F',
  'Burkina Faso': '#F72585',
  'Burundi': '#B5179E',
  
  // C
  'Cambodia': '#7209B7',
  'Cameroon': '#40916C',
  'Canada': '#D00000',
  'Central African Republic': '#1E3A8A',
  'Chad': '#3730A3',
  'Chile': '#1D4ED8',
  'China': '#DC2626',
  'Colombia': '#FBBF24',
  'Congo': '#16A34A',
  'Democratic Republic of the Congo': '#0891B2',
  'Costa Rica': '#3B82F6',
  'Croatia': '#EF4444',
  'Cuba': '#4338CA',
  'Cyprus': '#EA580C',
  'Czech Republic': '#2563EB',
  
  // D
  'Denmark': '#BE123C',
  'Djibouti': '#0EA5E9',
  'Dominican Republic': '#3730A3',
  
  // E
  'Ecuador': '#EAB308',
  'Egypt': '#CA8A04',
  'El Salvador': '#2563EB',
  'Equatorial Guinea': '#16A34A',
  'Eritrea': '#15803D',
  'Estonia': '#0284C7',
  'Eswatini': '#4F46E5',
  'Ethiopia': '#059669',
  
  // F
  'Falkland Islands': '#3B82F6',
  'Fiji': '#06B6D4',
  'Finland': '#1E40AF',
  'France': '#1D4ED8',
  'French Guiana': '#0891B2',
  
  // G
  'Gabon': '#10B981',
  'Gambia': '#BE123C',
  'Georgia': '#E11D48',
  'Germany': '#6366F1',
  'Ghana': '#047857',
  'Greece': '#0284C7',
  'Greenland': '#7DD3FC',
  'Guatemala': '#06B6D4',
  'Guinea': '#BE123C',
  'Guinea-Bissau': '#C2410C',
  'Guyana': '#10B981',
  
  // H
  'Haiti': '#3B82F6',
  'Honduras': '#0891B2',
  'Hungary': '#059669',
  
  // I
  'Iceland': '#2563EB',
  'India': '#F97316',
  'Indonesia': '#DC2626',
  'Iran': '#10B981',
  'Iraq': '#BE123C',
  'Ireland': '#16A34A',
  'Israel': '#1D4ED8',
  'Italy': '#22C55E',
  'Ivory Coast': '#F97316',
  
  // J
  'Jamaica': '#15803D',
  'Japan': '#B91C1C',
  'Jordan': '#6366F1',
  
  // K
  'Kazakhstan': '#06B6D4',
  'Kenya': '#991B1B',
  'Kosovo': '#3730A3',
  'Kuwait': '#047857',
  'Kyrgyzstan': '#E11D48',
  
  // L
  'Laos': '#BE123C',
  'Latvia': '#991B1B',
  'Lebanon': '#EF4444',
  'Lesotho': '#3B82F6',
  'Liberia': '#B91C1C',
  'Libya': '#16A34A',
  'Lithuania': '#FBBF24',
  'Luxembourg': '#0EA5E9',
  
  // M
  'Madagascar': '#DC2626',
  'Malawi': '#BE123C',
  'Malaysia': '#1E40AF',
  'Mali': '#15803D',
  'Mauritania': '#10B981',
  'Mexico': '#059669',
  'Moldova': '#2563EB',
  'Mongolia': '#B91C1C',
  'Montenegro': '#991B1B',
  'Morocco': '#BE123C',
  'Mozambique': '#EAB308',
  'Myanmar': '#F59E0B',
  
  // N
  'Namibia': '#1D4ED8',
  'Nepal': '#C2410C',
  'Netherlands': '#1E40AF',
  'New Caledonia': '#1D4ED8',
  'New Zealand': '#1E3A8A',
  'Nicaragua': '#0891B2',
  'Niger': '#EA580C',
  'Nigeria': '#16A34A',
  'North Korea': '#2563EB',
  'North Macedonia': '#B91C1C',
  'Norway': '#BE123C',
  
  // O
  'Oman': '#DC2626',
  
  // P
  'Pakistan': '#047857',
  'Palestine': '#6366F1',
  'Panama': '#3B82F6',
  'Papua New Guinea': '#BE123C',
  'Paraguay': '#C2410C',
  'Peru': '#B91C1C',
  'Philippines': '#1D4ED8',
  'Poland': '#DC2626',
  'Portugal': '#059669',
  'Puerto Rico': '#EF4444',
  
  // Q
  'Qatar': '#991B1B',
  
  // R
  'Romania': '#1E40AF',
  'Russia': '#1D4ED8',
  'Rwanda': '#0EA5E9',
  
  // S
  'Saudi Arabia': '#047857',
  'Senegal': '#16A34A',
  'Serbia': '#B91C1C',
  'Sierra Leone': '#15803D',
  'Slovakia': '#2563EB',
  'Slovenia': '#1D4ED8',
  'Solomon Islands': '#2563EB',
  'Somalia': '#0891B2',
  'South Africa': '#059669',
  'South Korea': '#B91C1C',
  'South Sudan': '#16A34A',
  'Spain': '#B91C1C',
  'Sri Lanka': '#991B1B',
  'Sudan': '#BE123C',
  'Suriname': '#10B981',
  'Sweden': '#0284C7',
  'Switzerland': '#DC2626',
  'Syria': '#BE123C',
  
  // T
  'Taiwan': '#DC2626',
  'Tajikistan': '#059669',
  'Tanzania': '#15803D',
  'Thailand': '#991B1B',
  'Timor-Leste': '#C2410C',
  'Togo': '#047857',
  'Trinidad and Tobago': '#BE123C',
  'Tunisia': '#E11D48',
  'Turkey': '#DC2626',
  'Turkmenistan': '#10B981',
  
  // U
  'Uganda': '#EAB308',
  'Ukraine': '#0891B2',
  'United Arab Emirates': '#047857',
  'United Kingdom': '#1E40AF',
  'United States': '#991B1B',
  'United States of America': '#991B1B',
  'Uruguay': '#1D4ED8',
  'Uzbekistan': '#06B6D4',
  
  // V
  'Venezuela': '#FBBF24',
  'Vietnam': '#B91C1C',
  
  // W
  'Western Sahara': '#BE123C',
  
  // Y
  'Yemen': '#BE123C',
  
  // Z
  'Zambia': '#16A34A',
  'Zimbabwe': '#15803D'
};
