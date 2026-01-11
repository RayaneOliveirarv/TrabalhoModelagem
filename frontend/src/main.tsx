import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// NOVO: Import do Provider de autenticação
import { AuthProvider } from './contexts/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* NOVO: AuthProvider envolve toda aplicação para disponibilizar contexto de autenticação */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
