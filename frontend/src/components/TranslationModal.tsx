/**
 * @file TranslationModal.tsx
 * @description Modal that displays the result of a translation.
 * Includes the original text, the translation and loading/error states.
 * @module components/TranslationModal
 */

import React from 'react';
import type { TranslationResult } from '../types';
import '../styles/TranslationModal.css';

/**
 * TranslationModal component props
 */
interface TranslationModalProps {
    /** Name of the country the text was translated to */
    countryName: string;
    /** Original text entered by the user */
    originalText: string;
    /** Translation result (null if no result yet) */
    result: TranslationResult | null;
    /** Indicates if translation is in progress */
    isLoading: boolean;
    /** Error message if translation failed */
    error: string | null;
    /** Callback to close the modal */
    onClose: () => void;
}

/**
 * Animated loading spinner component
 * @component
 */
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
        <aside 
            className="modal-overlay"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="translation-modal-title"
        >
            <article 
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="modal-body">
                    <button 
                        onClick={onClose} 
                        className="modal-close-button"
                        aria-label="Close modal"
                    >
                        <svg className="modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>

                    <h2 id="translation-modal-title" className="modal-title">
                        Translation for {countryName}
                    </h2>
                    
                    <section className="modal-sections">
                        <article className="modal-section">
                            <h3 className="section-label">Original Text</h3>
                            <blockquote className="section-text">"{originalText}"</blockquote>
                        </article>
                        
                        <article className="modal-section loading-section">
                            {isLoading && <Spinner />}
                            {error && <p className="error-text" role="alert">{error}</p>}
                            {result && (
                                <figure>
                                    <figcaption className="section-header">
                                        <h3 className="section-label">Translation ({result.language})</h3>
                                        {result.fromCache && (
                                            <mark title="Result obtained from cache" className="cache-badge">
                                                Cache ⚡️
                                            </mark>
                                        )}
                                    </figcaption>
                                    <blockquote className="translation-text">"{result.translation}"</blockquote>
                                </figure>
                            )}
                        </article>
                    </section>
                </header>
            </article>
        </aside>
    );
};

export default TranslationModal;
