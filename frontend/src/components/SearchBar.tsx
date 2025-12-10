/**
 * @fileoverview Componente de barra de búsqueda reutilizable
 * @module components/SearchBar
 * @description Proporciona una interfaz de búsqueda con icono de lupa
 * para filtrar países en el mapa interactivo.
 */

import React from 'react';
import '../styles/SearchBar.css';

/**
 * Propiedades del componente SearchBar
 * @interface SearchBarProps
 */
interface SearchBarProps {
    /** Valor actual del campo de búsqueda */
    value: string;
    /** Callback que se ejecuta cuando el valor cambia */
    onChange: (value: string) => void;
    /** Texto placeholder del input (opcional) */
    placeholder?: string;
}

/**
 * Componente de barra de búsqueda con icono de lupa integrado
 * 
 * @component
 * @description Renderiza un input de texto estilizado con un icono SVG de búsqueda.
 * Se utiliza principalmente para filtrar países en el mapa interactivo.
 * 
 * @example
 * ```tsx
 * <SearchBar 
 *   value={searchTerm}
 *   onChange={setSearchTerm}
 *   placeholder="Buscar país..."
 * />
 * ```
 * 
 * @param {SearchBarProps} props - Las propiedades del componente
 * @returns {JSX.Element} Input de búsqueda con icono de lupa
 */
const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder }) => {
    return (
        <div className="search-bar-container">
            <svg
                className="search-bar-icon search-bar-icon-left"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
            </svg>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="search-bar-input"
            />
        </div>
    );
};

export default SearchBar;
