/**
 * @fileoverview Reusable search bar component
 * @module components/SearchBar
 * @description Provides a search interface with magnifying glass icon
 * for filtering countries on the interactive map.
 */

import React from 'react';
import '../styles/SearchBar.css';

/**
 * SearchBar component properties
 * @interface SearchBarProps
 */
interface SearchBarProps {
    /** Current value of the search field */
    value: string;
    /** Callback executed when the value changes */
    onChange: (value: string) => void;
    /** Input placeholder text (optional) */
    placeholder?: string;
}

/**
 * Search bar component with integrated magnifying glass icon
 * 
 * @component
 * @description Renders a styled text input with an SVG search icon.
 * Primarily used to filter countries on the interactive map.
 * 
 * @example
 * ```tsx
 * <SearchBar 
 *   value={searchTerm}
 *   onChange={setSearchTerm}
 *   placeholder="Search country..."
 * />
 * ```
 * 
 * @param {SearchBarProps} props - The component properties
 * @returns {JSX.Element} Search input with magnifying glass icon
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
