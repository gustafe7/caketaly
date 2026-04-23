from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import pedidos
from app.routes import pedidos, produtos

# Inicia a aplicação do FastAPI

app = FastAPI(
    title = "Caketaly API",
    description = "API de gestão de pedidos da confeitaria Caketaly",
    version = "1.0.0" 
)

# Configura o CORS para permitir requisições do frontend

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "http://localhost:5174",
                   "http://localhost:5175",
    ], #URL padrão do Vite em desenvolvimento
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Registra as rotas de pedidos
app.include_router(pedidos.router)
app.include_router(produtos.router)

@app.get("/")
def health_check():
    # Verifica se a API está no ar
    return {"status": "ok", "messege": "Caketaly API rodando"}

