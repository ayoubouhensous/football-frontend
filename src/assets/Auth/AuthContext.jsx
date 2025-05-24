import React, { createContext, useState, useEffect } from 'react';


export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin'); // ✅ Bonne clé maintenant
  
    setIsAuthenticated(!!token);
    setRole(isAdmin ? 'admin' : 'user'); // isAdmin est un booléen, mais localStorage stocke tout en string
  }, []);

  const login = (token, isAdmin) => {
    localStorage.setItem('token', token);
    localStorage.setItem('isAdmin', isAdmin);
    setIsAuthenticated(true);
    setRole(isAdmin ? 'admin' : 'user');// ✅ Ajoute ceci
    console.log(token, isAdmin);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setRole(null); // Réinitialise le rôle
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext