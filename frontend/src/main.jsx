import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './styles.css';


import App from './App.jsx';
import Corbeille from './components/Corbeille.jsx'; // ✅ importer la page corbeille

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <div className="p-3 bg-light border-bottom mb-3">
        <nav className="d-flex gap-3">
          <Link to="/" className="text-decoration-none">🏠 Accueil</Link>
          <Link to="/corbeille" className="text-decoration-none">🗑️ Corbeille</Link>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/corbeille" element={<Corbeille />} />
      </Routes>
    </Router>
  </StrictMode>
);
