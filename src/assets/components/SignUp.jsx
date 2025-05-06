import React, { useState, useEffect, useRef } from 'react';
import { Mail, Lock, User,Trophy, Star, Shield, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Animation des particules avec CSS
const ParticleField = () => {
  const particles = Array.from({ length: 50 });
  return (
    <div className="particles-container">
      {particles.map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 5}s`
          }}
        />
      ))}
    </div>
  );
};

// Logo 3D animé
const SoccerBallIcon3D = () => (
  <div className="soccer-ball-container">
    <div className="soccer-ball-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="soccer-ball-svg">
        <circle cx="12" cy="12" r="10" className="spin" />
        <path d="M12 2L12 22M2 12H22M5 5L19 19M19 5L5 19" strokeLinecap="round" className="pulse" />
      </svg>
    </div>
  </div>
);

const FloatingBadge = ({ icon: Icon, text, className }) => (
  <div className={`badge-container ${className}`}>
    <Icon className="badge-icon" />
    <span className="badge-text">{text}</span>
  </div>
);

// Effet de vague animée
const WaveEffect = () => (
  <div className="wave-effect">
    <div className="wave-background"></div>
    <div className="wave-background-delayed"></div>
  </div>
);

const SignUpComponent = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();

  // Effet de particules interactives au survol
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const cursor = document.createElement('div');
      cursor.className = 'particle-cursor';
      cursor.style.left = `${clientX}px`;
      cursor.style.top = `${clientY}px`;
      document.body.appendChild(cursor);
      setTimeout(() => cursor.remove(), 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'inscription');
      }

      const data = await response.json();
      console.log('Utilisateur inscrit avec succès:', data);
      setShowSuccess(true);
      setTimeout(() => navigate('/signin'), 1000); // Redirection vers la page de connexion

      // Enregistrement des informations dans le localStorage
      localStorage.setItem('user', data.name);
      localStorage.setItem('token', data.access);
      localStorage.setItem('refresh', data.refresh);
    } catch (err) {
      console.log(err);
      setError('Échec de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sign-in-container">
      <ParticleField />
      <div className="floating-badges">
                {/* Les badges sans texte */}
              </div>

      <div className="form-container">
        <div className="header">
          <h2>Football IA</h2>
          <p>L'avenir du football est ici</p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Votre nom"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              placeholder="Confirmez votre mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Inscription...' : 'S\'inscrire'}
          </button>

          {showSuccess && <div className="success-message">Inscription réussie !</div>}

          <div className="sign-up-link">
            Déjà un compte? <Link to="/signin">Connectez-vous</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpComponent;
