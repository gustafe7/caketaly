# 🎂 Caketaly — Confeitaria Artesanal

> Cada doce é feito com carinho, ingredientes selecionados e muito amor.

**Acesse o site:** [caketaly-frontend.vercel.app](https://caketaly-frontend.vercel.app)

---

## Sobre o Projeto

A Caketaly é uma confeitaria artesanal do Rio de Janeiro especializada em bolos personalizados, docinhos gourmet, brownies, tortas e muito mais.

Este projeto é o site oficial da Caketaly — uma vitrine digital onde os clientes podem conhecer os produtos, explorar o cardápio completo e fazer pedidos diretamente pelo WhatsApp.

---

## O que você encontra no site

- **Home** — apresentação da confeitaria, destaques do cardápio e informações de contato
- **Cardápio completo** — todos os produtos organizados por categoria, com fotos e preços
- **Monte seu Bolo** — personalize o bolo do jeito que você imaginou: tamanho, massa, recheio, cobertura e extras
- **Pedido pelo WhatsApp** — adicione itens ao carrinho e envie o pedido direto para a confeitaria

---

## Tecnologias utilizadas

- **React + Vite** — interface rápida e responsiva
- **Tailwind CSS** — design elegante e mobile-first
- **FastAPI** — backend em Python para servir o cardápio e gerenciar pedidos
- **Supabase** — banco de dados com todas as informações dos produtos
- **Vercel** — hospedagem do frontend
- **Railway** — hospedagem do backend

---

## Como rodar localmente

**Backend**
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Crie o arquivo `backend/.env`:
```
SUPABASE_URL=sua_url
SUPABASE_KEY=sua_chave_anon
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## Contato

📍 Rua Cinquenta e Sete, 246 — Cesarão, Santa Cruz, Rio de Janeiro  
📱 [WhatsApp: (21) 98832-1003](https://wa.me/5521988321003)  
📸 [Instagram: @caketaly](https://www.instagram.com/caketaly/)
