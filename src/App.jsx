import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignInComponent from './assets/components/SignIn';
import SignupComponent from './assets/components/SignUp';
import MainLayout from './assets/components/MainLayout';
import AcceuilComponent from './assets/components/Accueil';
import Dashboard from './assets/components/Dashboard';
import TopPlayers from './assets/components/sidebar/TopPlayers';
import Prediction from './assets/components/predection/prediction';
import Team from './assets/components/Team';
import { AuthContext } from '../src/assets/Auth/AuthContext';
import UserManagement from './assets/components/admin/UserManagement';
import ProtectedRoute from './assets/privateroute/ProtectedRoute';

function App() {
  const { isAuthenticated, role } = React.useContext(AuthContext);
  
  console.log('Authenticated:', isAuthenticated); // Log de l'authentification
  console.log('Role:', role); // Log du rôle

  if (isAuthenticated === null) {
    return <div>Chargement...</div>; // Affiche un loader tant que l'authentification est en cours
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInComponent />} />
        <Route path="/signin" element={<SignInComponent />} />
        <Route path="/signup" element={<SignupComponent />} />

        {/* Routes protégées */}
        <Route element={<MainLayout />}>
          <Route path="/acceuil" element={isAuthenticated ? <AcceuilComponent /> : <Navigate to="/signin" />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/signin" />} />
          <Route path="/prediction" element={isAuthenticated ? <Prediction /> : <Navigate to="/signin" />} />
          <Route path="/teams" element={isAuthenticated ? <Team /> : <Navigate to="/signin" />} />
          <Route path="/joueurs" element={isAuthenticated ? <TopPlayers /> : <Navigate to="/signin" />} />

          {/* Route protégée pour la gestion des utilisateurs (admin uniquement) */}
          <Route
            path="/usermanagement"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserManagement />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;