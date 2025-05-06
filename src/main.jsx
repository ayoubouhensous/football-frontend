import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider  } from '../src/assets/Auth/AuthContext';  // <-- Importer AuthContext ici

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* Enveloppe App avec AuthProvider */}
      <App />
    </AuthProvider>
  </StrictMode>
);