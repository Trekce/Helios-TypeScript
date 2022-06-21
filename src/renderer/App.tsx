import { Routes, Route, Link, Navigate } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import Ericsson from './pages/Ericsson';
import Esd from './pages/Esd';
import Sfp from './pages/Sfp';
import logo from './assets/logoSvg.svg';

export default function App() {
  const [navEnabled, setNavEnabled] = useState(true);

  function toggleNav() {
    if (navEnabled) setNavEnabled(false);
    else if (!navEnabled) setNavEnabled(true);
  }

  const Nav = () => {
    return (
      <nav>
        <img
          className="logo"
          src={logo}
          onDoubleClick={() => toggleNav()}
          alt=""
        />
        <Link to="/ericsson">
          <button type="button">Ericsson Test</button>
        </Link>
        <Link to="/sfp">
          <button type="button">SFP Test</button>
        </Link>
        <Link to="/esd">
          <button type="button">ESD Test</button>
        </Link>
      </nav>
    );
  };

  return (
    <div>
      {navEnabled && <Nav />}

      <div className={navEnabled ? 'Content' : 'Content Content-Full'}>
        {!navEnabled && (
          <FontAwesomeIcon
            className="back-icon"
            icon={faAngleLeft}
            onClick={() => toggleNav()}
          />
        )}

        <Routes>
          <Route
            path="/index.html"
            element={<Navigate to="/ericsson" replace />}
          />
          <Route path="/ericsson" element={<Ericsson />} />
          <Route path="/sfp" element={<Sfp />} />
          <Route path="/esd" element={<Esd />} />
        </Routes>
      </div>
    </div>
  );
}
