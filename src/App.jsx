import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignInComponent from './assets/components/SignIn';
import SignupComponent from './assets/components/SignUp';
import MainLayout from './assets/components/MainLayout';
import AcceuilComponent from './assets/components/Accueil';
import Dashboard from './assets/components/dashboard';
import TopPlayers from './assets/components/sidebar/TopPlayers';
import Prediction from './assets/components/predection/prediction';
import Team from './assets/components/Team';
import { AuthContext } from '../src/assets/Auth/AuthContext';  // <-- Importer AuthContext ici

function App() {
  const { isAuthenticated } = React.useContext(AuthContext);
  if (isAuthenticated === null) {
    return <div>Chargement...</div>; // ou un loader élégant
  }
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInComponent />} /> {/* Page de connexion */}
        <Route path="/signin" element={<SignInComponent />} /> {/* Page de connexion */}
        <Route path="/signup" element={<SignupComponent />} /> {/* Page d'inscription */}
        
        {/* Routes protégées */}
        <Route element={<MainLayout />}>
          <Route path="/acceuil" element={isAuthenticated ? <AcceuilComponent /> : <Navigate to="/signin" />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" />} />
          <Route path="/prediction" element={isAuthenticated ? <Prediction /> : <Navigate to="/signin" />} />
          <Route path="/teams" element={isAuthenticated ? <Team /> : <Navigate to="/signin" />} />
          <Route path="/joueurs" element={isAuthenticated ? <TopPlayers /> : <Navigate to="/signin" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
