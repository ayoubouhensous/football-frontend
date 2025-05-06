// src/assets/privateroute/ProtectedRoute.js
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const valid = await verifyToken();
      setIsValid(valid);
    };
    checkToken();
  }, []);

  if (isValid === null) {
    return <div>Chargement...</div>; // Ou un spinner
  }

  if (!isValid) {
    return <Navigate to="/sigin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;