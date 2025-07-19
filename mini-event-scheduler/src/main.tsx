import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Layout/Home'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Home></Home>
  </StrictMode>,
)
