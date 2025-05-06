import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Vider le localStorage
    localStorage.clear();
    // Rediriger vers la page de connexion
    navigate('/signin');
  };

  return (
    <nav className="navbar">
      <h1>FootPro+</h1>
      <ul className="nav-links">
        <li><Link to="/acceuil">Accueil</Link></li>
        <li><Link to="/prediction">Prediction</Link></li>
        <li><Link to="/joueurs">Joueurs</Link></li>
        <li><Link to="/teams">Teams</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        {/* Remplacez le Link par un bouton pour la déconnexion */}
        <li><button onClick={handleLogout} className="logout-button">Déconnexion</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;