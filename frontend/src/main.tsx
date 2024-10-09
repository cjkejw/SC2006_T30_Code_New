import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './pages/LandingPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
