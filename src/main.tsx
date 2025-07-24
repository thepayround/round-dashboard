import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.tsx'
import { SecurityUtils } from './shared/utils/security'

// Initialize security measures
SecurityUtils.disableDevToolsInProduction()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
