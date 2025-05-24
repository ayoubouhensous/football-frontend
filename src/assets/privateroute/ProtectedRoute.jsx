import { useEffect, useState, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../Auth/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();
  const { isAuthenticated, role } = useContext(AuthContext); // Récupération du rôle depuis le context
  const [isValid, setIsValid] = useState(null); // État pour vérifier si l'accès est valide

  useEffect(() => {
    const checkAccess = () => {
      const token = localStorage.getItem('token');
      // Vérifie si le token existe et si le rôle correspond à celui requis
      if (token && (!requiredRole || role === requiredRole)) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    };

    checkAccess();
  }, [role, requiredRole]); // Vérification chaque fois que le rôle ou le rôle requis change

  if (isValid === null) {
    return <div>Chargement...</div>; // Affiche un message pendant le processus de vérification
  }

  if (!isValid) {
    // Redirige l'utilisateur si l'accès est refusé
    return <Navigate to="/acceuil" state={{ from: location }} replace />;
  }

  // Rendre l'élément 'children' (ici, UserManagement)
  return children;
};

export default ProtectedRoute;