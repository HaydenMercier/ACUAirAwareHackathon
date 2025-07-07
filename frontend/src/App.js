import React from 'react';
import MapView from './components/MapView';
import Dashboard from './components/Dashboard';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Air Pollution Tracker</h1>
      </header>
      <main>
        <MapView />
        <Dashboard />
      </main>
    </div>
  );
}

export default App;