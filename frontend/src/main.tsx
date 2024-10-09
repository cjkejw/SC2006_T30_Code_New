import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './pages/LandingPage.tsx'
import './components/layout/layout.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
