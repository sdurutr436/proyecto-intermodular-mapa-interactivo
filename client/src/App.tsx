import React from 'react';
import WorldMap from './components/WorldMap';
import './styles/App.css';

const App: React.FC = () => {
    const handleCountryClick = (countryName: string, countryCode: string) => {
        console.log('País seleccionado:', countryName, countryCode);
    };

    return (
        <div className="app-container">
            <h1 className="app-title">Mapa Traductor Interactivo</h1>
            <WorldMap 
                onCountryClick={handleCountryClick}
                inputText="Demo" 
            />
        </div>
    );
};

export default App;
