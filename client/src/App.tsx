import React from 'react';
import './styles/App.css';

/**
 * Componente Principal - Sprint 1
 * 
 * En este sprint solo configuramos la estructura básica.
 * Los componentes WorldMap, SearchBar y TranslationModal
 * se implementarán en los siguientes sprints.
 */
const App: React.FC = () => {
    return (
        <div className="app-container">
            <header className="app-header">
                <h1>🌍 Global Translator App</h1>
                <p className="sprint-badge">Sprint 1 - Configuración Básica</p>
            </header>

            <main className="app-main">
                <div className="info-card">
                    <h2>✅ Sprint 1 Completado</h2>
                    <ul className="checklist">
                        <li>✓ Estructura del proyecto configurada</li>
                        <li>✓ React + TypeScript funcionando</li>
                        <li>✓ Vite configurado</li>
                        <li>✓ Docker básico implementado</li>
                        <li>✓ Git inicializado</li>
                    </ul>
                </div>

                <div className="info-card">
                    <h3>📋 Próximos Sprints</h3>
                    <p><strong>Sprint 2:</strong> Backend y Base de Datos (MongoDB, Express, API REST)</p>
                    <p><strong>Sprint 3:</strong> Frontend UI (Mapa interactivo, componentes)</p>
                    <p><strong>Sprint 4:</strong> Integración y Despliegue (APIs de traducción, Docker completo)</p>
                </div>
            </main>

            <footer className="app-footer">
                <p>Desarrollado con MERN Stack + Docker</p>
            </footer>
        </div>
    );
};

export default App;
