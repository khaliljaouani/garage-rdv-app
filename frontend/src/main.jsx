import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './styles.css';

import App from './App.jsx';
import Corbeille from './components/Corbeille.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      {/* Barre du haut */}
      <div className="p-3 bg-light border-bottom mb-3 d-flex justify-content-between align-items-center">

        {/* Liens de navigation */}
        <nav className="d-flex gap-3">
          <Link to="/" className="text-decoration-none">🏠 Accueil</Link>
          <Link to="/corbeille" className="text-decoration-none">🗑️ Corbeille</Link>
        </nav>

        {/* 🔄 Bouton refresh à droite */}
        <button
          className="btn-refresh-right"
          onClick={() => window.location.reload()}
          title="Rafraîchir les données"
        >
          <i className="bi bi-arrow-repeat"></i>
        </button>
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/corbeille" element={<Corbeille />} />
      </Routes>
    </Router>
  </StrictMode>
);
