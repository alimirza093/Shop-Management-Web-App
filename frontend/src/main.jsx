import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Password from './Password.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path="/login" element={<Password mode="login" />} />
        <Route path='/change-password' element={<Password mode='change' />} />
        <Route path='/set-password' element={<Password mode='set' />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
