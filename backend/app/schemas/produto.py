from pydantic import BaseModel
from typing import Optional


class FotoResponse(BaseModel):
    id: str
    url: str
    sabor: Optional[str] = None
    ordem: int


class SaborResponse(BaseModel):
    id: str
    nome: str


class TamanhoResponse(BaseModel):
    id: str
    label: str
    preco: float
    ordem: int


class PacoteResponse(BaseModel):
    id: str
    label: str
    preco: float
    ordem: int


class CategoriaResponse(BaseModel):
    id: str
    nome: str
    ordem: int


class ProdutoResponse(BaseModel):
    id: str
    categoria_id: str
    categoria: CategoriaResponse
    nome: str
    descricao: Optional[str] = None
    tipo: str
    preco: Optional[float] = None
    disponivel: bool
    fotos: list[FotoResponse] = []
    sabores: list[SaborResponse] = []
    tamanhos: list[TamanhoResponse] = []
    pacotes: list[PacoteResponse] = []


class BoloOpcaoResponse(BaseModel):
    id: str
    tipo: str
    label: str
    preco: float
    fruta: bool
    disponivel: bool