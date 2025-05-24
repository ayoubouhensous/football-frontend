import React, { useState, useEffect, useRef, useContext } from 'react';
import { Mail, Lock, Trophy, Star, Shield, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';

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

// Logo 3D animé avec effet de rebond
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

// Badge animé avec effet de lévitation
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

const SignInComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorData, setErrorData] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();

  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const er = await response.json();
        const message = er.message || 'Erreur lors de la connexion';
        setErrorData(message);
        throw new Error(message);
      }

      const data = await response.json();
      setShowSuccess(true);
      console.log('Utilisateur connecté avec succès:', data);

      localStorage.setItem('user', data.username);
      localStorage.setItem('token', data.token);
      localStorage.setItem('isAdmin', data.admin);

      console.log(data.token)

      login(data.token, data.admin); // met à jour le context
      navigate('/dashboard');
    } catch (err) {
      console.log(err);
      setError('Échec de la connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sign-in-container">
      <ParticleField />

      <div className="form-container">
        <div className="header">
          <h2>Football IA</h2>
          <p>L'avenir du football est ici</p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit}>
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

          {errorData && <p style={{ color: 'red' }}>{errorData}</p>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Connexion...' : 'Se Connecter'}
          </button>

          {showSuccess && <div className="success-message">Connexion réussie !</div>}

          <div className="sign-up-link">
            Pas encore de compte ? <Link to="/signup">Inscrivez-vous</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInComponent;
