from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class StatusPedido(str, Enum):
    #Valores permitidos para o status de um pedido
    pendente = "pendente"
    em_producao = "em_producao"
    pronto = "pronto"
    entregue = "entregue"

class PedidoCreate(BaseModel):
    #Dados obrigatórios para criar um novo pedido 

    cliente_nome: str
    cliente_telefone: str
    descricao: str
    valor: float
    data_entrega: datetime

class PedidoUpdate(BaseModel):
    # Campos opcionais para atualizar um pedido existente

    status: Optional[StatusPedido] = None
    descricao: Optional[str] = None
    valor: Optional[float] = None
    data_entrega: Optional[datetime] = None

class PedidoResponse(BaseModel):
    # Formato de resposta retomando pela API ao frontend

    id: str
    cliente_nome: str
    cliente_telefone: str
    descricao: str
    valor: float
    status: StatusPedido
    data_entrega: datetime
    created_at: datetime