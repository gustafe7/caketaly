import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Pedidos from './pages/Pedidos'
import NovoPedido from './pages/NovoPedido'
import Cardapio from './pages/Cardapio'
import Home from './pages/Home'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Página inicial pública */}
        <Route path="/" element={<Home />} />
        {/* Cardápio público */}
        <Route path="/cardapio" element={<Cardapio />} />
        {/* Painel admin — acesso restrito */}
        <Route path="/admin" element={<Pedidos />} />
        {/* Formulário de novo pedido — admin */}
        <Route path="/admin/novo" element={<NovoPedido />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)