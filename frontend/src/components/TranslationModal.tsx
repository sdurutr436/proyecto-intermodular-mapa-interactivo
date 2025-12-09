import React from 'react';
import type { TranslationResult } from '../types';
import '../styles/TranslationModal.css';

interface TranslationModalProps {
    countryName: string;
    originalText: string;
    result: TranslationResult | null;
    isLoading: boolean;
    error: string | null;
    onClose: () => void;
}

const Spinner: React.FC = () => (
    <div className="spinner"></div>
);

const TranslationModal: React.FC<TranslationModalProps> = ({
    countryName,
    originalText,
    result,
    isLoading,
    error,
    onClose,
}) => {
    return (
        <div 
            className="modal-overlay"
            onClick={onClose}
        >
            <div 
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-body">
                    <button 
                        onClick={onClose} 
                        className="modal-close-button"
                    >
                        <svg className="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>

                    <h2 className="modal-title">
                        Traducción para {countryName}
                    </h2>
                    
                    <div className="modal-sections">
                        <div className="modal-section">
                            <p className="section-label">Texto Original</p>
                            <p className="section-text">"{originalText}"</p>
                        </div>
                        
                        <div className="modal-section loading-section">
                            {isLoading && <Spinner />}
                            {error && <p className="error-text">{error}</p>}
                            {result && (
                                <div>
                                    <div className="section-header">
                                        <p className="section-label">Traducción ({result.language})</p>
                                        {result.fromCache && (
                                            <span title="Resultado obtenido de la caché" className="cache-badge">
                                                Caché ⚡️
                                            </span>
                                        )}
                                    </div>
                                    <p className="translation-text">"{result.translation}"</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TranslationModal;
