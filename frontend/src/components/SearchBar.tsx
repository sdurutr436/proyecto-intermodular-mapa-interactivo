import React from 'react';
import '../styles/SearchBar.css';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

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
