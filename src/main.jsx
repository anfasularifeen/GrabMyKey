import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { PropertyProvider } from './context/PropertyContext'
import { Toaster } from 'sonner'

// Ensure browser storage is cleared of any legacy mock properties
try {
  localStorage.removeItem('grabmykey_properties');
  localStorage.removeItem('grabmykey_hero_settings');
} catch (e) {}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PropertyProvider>
        <App />
        <Toaster position="top-right" richColors closeButton />
      </PropertyProvider>
    </BrowserRouter>
  </StrictMode>,
)
