from fastapi import APIRouter, HTTPException
from app.schemas.pedido import PedidoCreate, PedidoUpdate, PedidoResponse
from app.database import supabase

# AAgrupa todas as rotas de pedidos sob o prefixo / pedidos
router = APIRouter(prefix='/pedidos', tags=["pedidos"])

@router.get("/", response_model=list[PedidoResponse])
def listar_pedidos():
    # Retorna todos os pedidos ordenados do mais recente para o mais antigo
    response = supabase.table("pedidos"). select("*").order("created_at", desc=True).execute()
    return response.data

@router.get("/{pedido_id}", response_model=PedidoResponse)
def buscar_pedido(pedido_id: str):
    # Retorna um pedido específico pelo ID
    response = supabase.table("pedidos").select("*").eq("id", pedido_id).single().execute
    if not response.data:
        raise HTTPException(status_code=404, datail="Pedido não encontrado")
    return response.data

@router.post("/", response_model=PedidoResponse, status_code=201)
def criar_pedido(pedido: PedidoCreate):
    # Cria um pedido com status inicial "pendente"

    novo_pedido = pedido.model_dump()
    novo_pedido["status"] = "pendente"
    
    # Converte datetime para string ISO antes de enviar ao Supabase
    
    novo_pedido["data_entrega"] = novo_pedido["data_entrega"].isoformat()
    response = supabase.table("pedidos").insert(novo_pedido).execute()
    return response.data[0]

@router.patch("/{pedido_id}", response_model=PedidoResponse)
def atualizar_pedido(pedido_id: str, pedido: PedidoUpdate):
    
    """Atualiza campos específicos de um pedido existente
    Remove campos None para não sobrescrever dados existentes """
    
    dados = {k: v for k, v in pedido.model_dump().items() if v is not None}
    if not dados:
        raise HTTPException(status_code=400, detail="Nenhum campo para atualizar")
    response = supabase.table("pedidos").update(dados).eq("id", pedido_id).execute()
    return response.data[0]


@router.delete("/{pedido_id}", status_code=204)
def deletar_pedido(pedido_id: str):
    
    #Remove um pedido pelo ID
    supabase.table("pedidos").delete().eq("id", pedido_id).execute()