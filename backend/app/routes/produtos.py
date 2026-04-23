from fastapi import APIRouter, HTTPException
from app.schemas.produto import ProdutoResponse, BoloOpcaoResponse
from app.database import supabase

router = APIRouter(prefix="/produtos", tags=["produtos"])


def _montar_produto(produto: dict, categorias: dict, fotos: list, sabores: list, tamanhos: list, pacotes: list) -> dict:
    """Monta o objeto completo do produto com todos os relacionamentos"""
    pid = produto["id"]
    categoria = categorias.get(produto["categoria_id"], {})
    return {
        **produto,
        "categoria": categoria,
        "fotos": sorted([f for f in fotos if f["produto_id"] == pid], key=lambda x: x["ordem"]),
        "sabores": [s for s in sabores if s["produto_id"] == pid],
        "tamanhos": sorted([t for t in tamanhos if t["produto_id"] == pid], key=lambda x: x["ordem"]),
        "pacotes": sorted([p for p in pacotes if p["produto_id"] == pid], key=lambda x: x["ordem"]),
    }


@router.get("/", response_model=list[ProdutoResponse])
def listar_produtos():
    """Retorna todos os produtos disponíveis com fotos, sabores, tamanhos e pacotes"""
    produtos = supabase.table("produtos").select("*").eq("disponivel", True).execute().data
    if not produtos:
        return []

    ids = [p["id"] for p in produtos]

    categorias_raw = supabase.table("categorias").select("*").order("ordem").execute().data
    categorias = {c["id"]: c for c in categorias_raw}

    fotos    = supabase.table("produto_fotos").select("*").in_("produto_id", ids).execute().data
    sabores  = supabase.table("produto_sabores").select("*").in_("produto_id", ids).execute().data
    tamanhos = supabase.table("produto_tamanhos").select("*").in_("produto_id", ids).execute().data
    pacotes  = supabase.table("produto_pacotes").select("*").in_("produto_id", ids).execute().data

    produtos_ordenados = sorted(produtos, key=lambda p: categorias.get(p["categoria_id"], {}).get("ordem", 99))

    return [_montar_produto(p, categorias, fotos, sabores, tamanhos, pacotes) for p in produtos_ordenados]


@router.get("/bolo-opcoes", response_model=list[BoloOpcaoResponse])
def listar_bolo_opcoes():
    """Retorna todas as opções disponíveis para o Monte seu Bolo"""
    response = supabase.table("bolo_opcoes").select("*").eq("disponivel", True).execute()
    return response.data


@router.get("/{produto_id}", response_model=ProdutoResponse)
def buscar_produto(produto_id: str):
    """Retorna um produto específico com todos os relacionamentos"""
    produto = supabase.table("produtos").select("*").eq("id", produto_id).single().execute().data
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    categorias_raw = supabase.table("categorias").select("*").execute().data
    categorias = {c["id"]: c for c in categorias_raw}

    fotos    = supabase.table("produto_fotos").select("*").eq("produto_id", produto_id).execute().data
    sabores  = supabase.table("produto_sabores").select("*").eq("produto_id", produto_id).execute().data
    tamanhos = supabase.table("produto_tamanhos").select("*").eq("produto_id", produto_id).execute().data
    pacotes  = supabase.table("produto_pacotes").select("*").eq("produto_id", produto_id).execute().data

    return _montar_produto(produto, categorias, fotos, sabores, tamanhos, pacotes)