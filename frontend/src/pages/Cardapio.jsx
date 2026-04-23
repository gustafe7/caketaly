import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarProdutos, listarBoloOpcoes } from '../services/produtos';

const WHATSAPP_NUMBER = '5521991928167';

const getFoto = (produto, sabor, idx) => {
  const fotoPorSabor = produto.fotos.find(f => f.sabor === sabor);
  if (fotoPorSabor) return fotoPorSabor.url;
  const fotosGerais = produto.fotos.filter(f => !f.sabor);
  if (fotosGerais.length === 0) return '';
  return fotosGerais[idx % fotosGerais.length].url;
};

const boloInicial = { tamanho: null, massa: null, recheio: null, cobertura: null, extras: [] };

export default function Cardapio() {
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState([]);
  const [boloOpcoes, setBoloOpcoes] = useState({ tamanhos: [], massas: [], recheios: [], coberturas: [], extras: [] });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [modal, setModal] = useState(null);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
  const [pacoteSelecionado, setPacoteSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [form, setForm] = useState({ cliente_nome: '', cliente_telefone: '', data_retirada: '' });
  const [busca, setBusca] = useState('');
  const [mostrarProdutos, setMostrarProdutos] = useState(false);
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);

  const [modalBolo, setModalBolo] = useState(false);
  const [bolo, setBolo] = useState(boloInicial);
  const [passoBolo, setPassoBolo] = useState(0);

  const secoesRef = useRef({});
  const produtosRef = useRef(null);
  const barraRef = useRef(null);
  const passosRef = useRef(null);

  useEffect(() => {
    const carregar = async () => {
      try {
        setCarregando(true);
        const [produtosData, opcoesData] = await Promise.all([listarProdutos(), listarBoloOpcoes()]);
        setProdutos(produtosData);
        setBoloOpcoes({
          tamanhos: opcoesData.filter(o => o.tipo === 'tamanho' && o.disponivel),
          massas: opcoesData.filter(o => o.tipo === 'massa' && o.disponivel).map(o => o.label),
          recheios: opcoesData.filter(o => o.tipo === 'recheio' && o.disponivel).map(o => o.label),
          coberturas: opcoesData.filter(o => o.tipo === 'cobertura' && o.disponivel).map(o => o.label),
          extras: opcoesData.filter(o => o.tipo === 'extra' && o.disponivel),
        });
      } catch {
        setErro('Erro ao carregar o cardápio. Tente novamente.');
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, []);

  useEffect(() => {
    if (!mostrarProdutos) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(entry => { if (entry.isIntersecting) setCategoriaAtiva(entry.target.id); }),
      { rootMargin: '-20% 0px -70% 0px' }
    );
    Object.entries(secoesRef.current).forEach(([, el]) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [mostrarProdutos, produtos]);

  useEffect(() => {
    if (!categoriaAtiva || !barraRef.current) return;
    const botaoAtivo = barraRef.current.querySelector(`[data-id="${categoriaAtiva}"]`);
    if (botaoAtivo) botaoAtivo.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [categoriaAtiva]);

  useEffect(() => {
    if (!passosRef.current) return;
    const passoAtivo = passosRef.current.querySelector(`[data-passo="${passoBolo}"]`);
    if (passoAtivo) passoAtivo.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [passoBolo]);

  const totalCarrinho = carrinho.reduce((acc, i) => acc + i.preco * i.quantidade, 0);
  const totalItens = carrinho.reduce((acc, i) => acc + i.quantidade, 0);

  const irParaCategoria = (id) => {
    setMostrarProdutos(true);
    setCategoriaAtiva(id);
    setTimeout(() => { secoesRef.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
  };

  const produtosFiltrados = produtos.filter(p => {
    if (!busca) return true;
    return p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.sabores.some(s => s.nome.toLowerCase().includes(busca.toLowerCase()));
  });

  const saboresFiltrados = (produto) => {
    if (!busca) return produto.sabores;
    return produto.sabores.filter(s =>
      s.nome.toLowerCase().includes(busca.toLowerCase()) ||
      produto.nome.toLowerCase().includes(busca.toLowerCase())
    );
  };

  const abrirModal = (produto, sabor, idx) => {
    setModal({ produto, sabor: sabor.nome, foto: getFoto(produto, sabor.nome, idx) });
    setTamanhoSelecionado(produto.tamanhos?.[0] || null);
    setPacoteSelecionado(produto.pacotes?.[0] || null);
    setQuantidade(1);
  };

  const precoModal = () => {
    if (!modal) return 0;
    if (modal.produto.tipo === 'tamanho') return tamanhoSelecionado?.preco || 0;
    if (modal.produto.tipo === 'pacote') return pacoteSelecionado?.preco || 0;
    return modal.produto.preco || 0;
  };

  const labelModal = () => {
    if (!modal) return '';
    if (modal.produto.tipo === 'tamanho') return tamanhoSelecionado?.label || '';
    if (modal.produto.tipo === 'pacote') return pacoteSelecionado?.label || '';
    return '';
  };

  const adicionarAoCarrinho = () => {
    if (!modal) return;
    const item = {
      id: `${modal.produto.id}-${modal.sabor}-${labelModal()}`,
      nome: `${modal.produto.nome} - ${modal.sabor}${labelModal() ? ` (${labelModal()})` : ''}`,
      preco: precoModal(),
      quantidade,
    };
    const existente = carrinho.find(i => i.id === item.id);
    if (existente) {
      setCarrinho(carrinho.map(i => i.id === item.id ? { ...i, quantidade: i.quantidade + quantidade } : i));
    } else {
      setCarrinho([...carrinho, item]);
    }
    setModal(null);
  };

  const precoBolo = () => {
    if (!bolo.tamanho) return 0;
    return bolo.tamanho.preco + bolo.extras.reduce((acc, e) => acc + e.preco, 0);
  };

  const adicionarBoloAoCarrinho = () => {
    const extrasDesc = bolo.extras.length > 0 ? ` + ${bolo.extras.map(e => e.label).join(', ')}` : '';
    const item = {
      id: `bolo-personalizado-${Date.now()}`,
      nome: `Bolo Personalizado (${bolo.tamanho.label}) — ${bolo.massa}, Recheio de ${bolo.recheio}, Cobertura de ${bolo.cobertura}${extrasDesc}`,
      preco: precoBolo(),
      quantidade: 1,
    };
    setCarrinho([...carrinho, item]);
    setModalBolo(false);
    setBolo(boloInicial);
    setPassoBolo(0);
  };

  const toggleExtra = (extra) => {
    const existe = bolo.extras.find(e => e.label === extra.label);
    setBolo({ ...bolo, extras: existe ? bolo.extras.filter(e => e.label !== extra.label) : [...bolo.extras, extra] });
  };

  const passos = ['Tamanho', 'Massa', 'Recheio', 'Cobertura', 'Extras'];

  const podeAvancar = () => {
    if (passoBolo === 0) return !!bolo.tamanho;
    if (passoBolo === 1) return !!bolo.massa;
    if (passoBolo === 2) return !!bolo.recheio;
    if (passoBolo === 3) return !!bolo.cobertura;
    return true;
  };

  const removerItem = (id) => setCarrinho(carrinho.filter(i => i.id !== id));
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFinalizar = (e) => {
    e.preventDefault();
    const itensMsg = carrinho.map(i => `• ${i.quantidade}x ${i.nome} - R$ ${(i.preco * i.quantidade).toFixed(2)}`).join('\n');
    const dataFormatada = new Date(form.data_retirada).toLocaleString('pt-BR');
    const mensagem = `Olá! Gostaria de fazer um pedido na *Caketaly*\n\n*>> Itens do Pedido:*\n${itensMsg}\n\n*Total: R$ ${totalCarrinho.toFixed(2)}*\n\n*>> Dados do Cliente:*\nNome: ${form.cliente_nome}\nWhatsApp: ${form.cliente_telefone}\n\n*Data de Retirada:* ${dataFormatada}\n\n*Local de Retirada:*\nRua Cinquenta e Sete, 246, Cesarão - Santa Cruz\n\nAguardo a confirmação do pedido. Obrigado(a)!`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`, '_blank');
  };

  if (carregando) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf8f5' }}>
      <p className="text-stone-400 text-sm tracking-widest uppercase">Carregando cardápio...</p>
    </div>
  );

  if (erro) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#faf8f5' }}>
      <p className="text-red-400 text-sm">{erro}</p>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#faf8f5' }}>

      {/* Header */}
      <header className="bg-white border-b border-stone-100 px-4 py-4 sticky top-0 z-20 md:px-6 md:py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-left">
            <h1 className="text-xl font-normal tracking-[0.2em] text-stone-900 uppercase md:text-2xl">Caketaly</h1>
            <p className="text-xs text-stone-600 tracking-widest mt-0.5">Confeitaria Artesanal</p>
          </button>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/caketaly/" target="_blank" rel="noopener noreferrer"
              className="text-stone-600 hover:text-stone-800 transition flex flex-col items-center justify-center gap-1 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
              <span className="text-xs tracking-widest uppercase">Instagram</span>
            </a>
            {totalItens > 0 && (
              <button onClick={() => setCarrinhoAberto(true)}
                className="hidden md:flex items-center gap-3 border border-stone-200 px-4 py-2.5 hover:bg-stone-50 transition">
                <span className="text-xs tracking-widest text-stone-600 uppercase">Carrinho</span>
                <span className="bg-pink-400 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">{totalItens}</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-white border-b border-stone-100 py-10 px-4 text-center md:py-14 md:px-6">
        <p className="text-xs tracking-[0.3em] text-stone-500 uppercase mb-3">Feito com amor</p>
        <h2 className="text-2xl font-light text-stone-800 tracking-wide mb-4 md:text-4xl">Nosso Cardápio</h2>
        <div className="w-12 h-px bg-pink-300 mx-auto mb-6"></div>
        <p className="text-sm text-stone-500 font-light max-w-md mx-auto leading-relaxed">
          Escolha uma categoria para explorar ou busque pelo seu favorito
        </p>
      </div>

      {/* Busca */}
      <div className="bg-white border-b border-stone-100 px-4 py-4 md:px-6">
        <div className="max-w-md mx-auto">
          <input type="text" placeholder="Buscar produto ou sabor..." value={busca}
            onChange={e => { setBusca(e.target.value); if (e.target.value) setMostrarProdutos(true); }}
            className="w-full border border-stone-200 px-4 py-3 text-sm text-stone-700 focus:outline-none focus:border-stone-400 placeholder:text-stone-300 bg-white"
          />
        </div>
      </div>

      {/* Grade de categorias */}
      {!mostrarProdutos && !busca && (
        <div className="max-w-6xl mx-auto px-4 py-8 md:px-6 md:py-12">
          <button onClick={() => { setModalBolo(true); setBolo(boloInicial); setPassoBolo(0); }}
            className="w-full bg-stone-900 group hover:bg-stone-800 transition p-6 text-left flex items-center justify-between mb-4">
            <div>
              <p className="text-xs tracking-[0.3em] text-stone-400 uppercase mb-1">Personalizado</p>
              <p className="text-lg font-light text-white tracking-wide">Monte o seu Bolo</p>
              <p className="text-xs text-stone-400 mt-1">Escolha massa, recheio, cobertura e extras</p>
            </div>
            <div className="w-10 h-10 border border-stone-600 flex items-center justify-center text-white text-xl group-hover:border-stone-400 transition">+</div>
          </button>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {produtos.map(produto => (
              <button key={produto.id} onClick={() => irParaCategoria(produto.categoria_id)} className="bg-white group text-left">
                <div className="aspect-square overflow-hidden" style={{ backgroundColor: '#f5f0eb' }}>
                  {produto.fotos.filter(f => !f.sabor)[0] && (
                    <img src={produto.fotos.filter(f => !f.sabor)[0].url} alt={produto.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm font-normal text-stone-800 tracking-wide">{produto.nome}</p>
                  <p className="text-xs text-stone-400 mt-1">{produto.sabores.length} opções</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Listagem de produtos */}
      {(mostrarProdutos || busca) && (
        <div ref={produtosRef} className="max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-10">
          {!busca && (
            <div className="bg-white border-b border-stone-100 px-4 py-3 sticky top-[72px] z-10 -mx-4 mb-6 md:top-[90px] md:-mx-6 md:px-6 md:mb-8">
              <div ref={barraRef} className="flex gap-6 overflow-x-auto">
                <button onClick={() => { setMostrarProdutos(false); setCategoriaAtiva(null); }}
                  className="whitespace-nowrap text-xs tracking-widest uppercase pb-1 border-b-2 border-transparent text-stone-400 hover:text-stone-600 transition flex-shrink-0">
                  ← Início
                </button>
                {produtos.map(produto => (
                  <button key={produto.id} data-id={produto.categoria_id}
                    onClick={() => secoesRef.current[produto.categoria_id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                    className={`whitespace-nowrap text-xs tracking-widest uppercase pb-1 border-b-2 transition flex-shrink-0 ${
                      categoriaAtiva === produto.categoria_id ? 'border-pink-400 text-stone-800' : 'border-transparent text-stone-400 hover:text-stone-600 hover:border-pink-300'
                    }`}>
                    {produto.nome}
                  </button>
                ))}
              </div>
            </div>
          )}

          {produtosFiltrados.map(produto => {
            const sabores = saboresFiltrados(produto);
            if (sabores.length === 0) return null;
            return (
              <div key={produto.id} id={produto.categoria_id}
                ref={el => secoesRef.current[produto.categoria_id] = el}
                className="mb-16 scroll-mt-32">
                <div className="flex items-baseline gap-4 mb-6 pb-4 border-b border-stone-100">
                  <h3 className="text-xl font-light text-stone-800 tracking-wide">{produto.nome}</h3>
                  <span className="text-xs text-stone-400">{sabores.length} opções</span>
                </div>

                {produto.categoria_id === 'bolos' && (
                  <div className="mb-6">
                    <button onClick={() => { setModalBolo(true); setBolo(boloInicial); setPassoBolo(0); }}
                      className="w-full bg-stone-900 group hover:bg-stone-800 transition p-6 text-left flex items-center justify-between">
                      <div>
                        <p className="text-xs tracking-[0.3em] text-stone-400 uppercase mb-1">Personalizado</p>
                        <p className="text-lg font-light text-white tracking-wide">Monte o seu Bolo</p>
                        <p className="text-xs text-stone-400 mt-1">Escolha massa, recheio, cobertura e extras</p>
                      </div>
                      <div className="w-10 h-10 border border-stone-600 flex items-center justify-center text-white text-xl group-hover:border-stone-400 transition">+</div>
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {sabores.map((sabor, idx) => (
                    <div key={sabor.id} onClick={() => abrirModal(produto, sabor, idx)} className="bg-white group cursor-pointer">
                      <div className="aspect-square overflow-hidden" style={{ backgroundColor: '#f5f0eb' }}>
                        <img src={getFoto(produto, sabor.nome, idx)} alt={sabor.nome}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                      </div>
                      <div className="p-4">
                        <p className="text-xs text-stone-400 tracking-widest uppercase mb-1">{produto.nome}</p>
                        <p className="text-sm font-normal text-stone-800 leading-snug">{sabor.nome}</p>
                        {produto.descricao && <p className="text-xs text-stone-400 mt-0.5">{produto.descricao}</p>}
                        <p className="text-xs text-pink-400 mt-2">
                          {produto.tipo === 'simples' && `R$ ${Number(produto.preco).toFixed(2)}`}
                          {produto.tipo === 'tamanho' && `a partir de R$ ${Math.min(...produto.tamanhos.map(t => t.preco)).toFixed(2)}`}
                          {produto.tipo === 'pacote' && `a partir de R$ ${Math.min(...produto.pacotes.map(p => p.preco)).toFixed(2)}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Monte seu Bolo */}
      {modalBolo && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalBolo(false)} />
          <div className="relative bg-white w-full max-w-md flex flex-col" style={{ maxHeight: '90vh' }}>
            <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between flex-shrink-0">
              <div>
                <p className="text-xs text-stone-400 tracking-widest uppercase mb-0.5">Personalizado</p>
                <h3 className="text-lg font-light text-stone-800">Monte o seu Bolo</h3>
              </div>
              <button onClick={() => setModalBolo(false)} className="text-stone-400 hover:text-stone-600 text-2xl leading-none">×</button>
            </div>
            <div className="px-6 py-4 border-b border-stone-100 flex-shrink-0">
              <div ref={passosRef} className="flex items-center gap-2 overflow-x-auto">
                {passos.map((passo, idx) => (
                  <div key={idx} data-passo={idx} className="flex items-center gap-2 flex-shrink-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition ${
                      idx === passoBolo ? 'bg-stone-900 text-white' : idx < passoBolo ? 'bg-pink-400 text-white' : 'bg-stone-100 text-stone-400'
                    }`}>{idx < passoBolo ? '✓' : idx + 1}</div>
                    <span className={`text-xs tracking-widest uppercase ${idx === passoBolo ? 'text-stone-800' : 'text-stone-400'}`}>{passo}</span>
                    {idx < passos.length - 1 && <div className="w-4 h-px bg-stone-200"></div>}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {passoBolo === 0 && (
                <div>
                  <p className="text-xs text-stone-400 tracking-widest uppercase mb-4">Escolha o tamanho</p>
                  <div className="flex flex-col gap-2">
                    {boloOpcoes.tamanhos.map(t => (
                      <button key={t.id} onClick={() => setBolo({ ...bolo, tamanho: t })}
                        className={`flex justify-between px-4 py-3 border text-sm transition ${
                          bolo.tamanho?.id === t.id ? 'border-stone-900 text-stone-900 bg-stone-50' : 'border-stone-200 text-stone-500 hover:border-stone-400'
                        }`}>
                        <span>{t.label}</span><span>R$ {Number(t.preco).toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {passoBolo === 1 && (
                <div>
                  <p className="text-xs text-stone-400 tracking-widest uppercase mb-4">Escolha a massa</p>
                  <div className="flex flex-col gap-2">
                    {boloOpcoes.massas.map(m => (
                      <button key={m} onClick={() => setBolo({ ...bolo, massa: m })}
                        className={`px-4 py-3 border text-sm text-left transition ${
                          bolo.massa === m ? 'border-stone-900 text-stone-900 bg-stone-50' : 'border-stone-200 text-stone-500 hover:border-stone-400'
                        }`}>{m}</button>
                    ))}
                  </div>
                </div>
              )}
              {passoBolo === 2 && (
                <div>
                  <p className="text-xs text-stone-400 tracking-widest uppercase mb-4">Escolha o recheio</p>
                  <div className="flex flex-col gap-2">
                    {boloOpcoes.recheios.map(r => (
                      <button key={r} onClick={() => setBolo({ ...bolo, recheio: r })}
                        className={`px-4 py-3 border text-sm text-left transition ${
                          bolo.recheio === r ? 'border-stone-900 text-stone-900 bg-stone-50' : 'border-stone-200 text-stone-500 hover:border-stone-400'
                        }`}>{r}</button>
                    ))}
                  </div>
                </div>
              )}
              {passoBolo === 3 && (
                <div>
                  <p className="text-xs text-stone-400 tracking-widest uppercase mb-4">Escolha a cobertura</p>
                  <div className="flex flex-col gap-2">
                    {boloOpcoes.coberturas.map(c => (
                      <button key={c} onClick={() => setBolo({ ...bolo, cobertura: c })}
                        className={`px-4 py-3 border text-sm text-left transition ${
                          bolo.cobertura === c ? 'border-stone-900 text-stone-900 bg-stone-50' : 'border-stone-200 text-stone-500 hover:border-stone-400'
                        }`}>{c}</button>
                    ))}
                  </div>
                </div>
              )}
              {passoBolo === 4 && (
                <div>
                  <p className="text-xs text-stone-400 tracking-widest uppercase mb-1">Extras opcionais</p>
                  <p className="text-xs text-stone-400 mb-4">Pode selecionar mais de um</p>
                  <div className="flex flex-col gap-2">
                    {boloOpcoes.extras.filter(e => !e.fruta).map(e => {
                      const selecionado = bolo.extras.find(ex => ex.label === e.label);
                      return (
                        <button key={e.id} onClick={() => toggleExtra(e)}
                          className={`flex justify-between px-4 py-3 border text-sm transition ${
                            selecionado ? 'border-stone-900 text-stone-900 bg-stone-50' : 'border-stone-200 text-stone-500 hover:border-stone-400'
                          }`}>
                          <span>{e.label}</span><span>+ R$ {Number(e.preco).toFixed(2)}</span>
                        </button>
                      );
                    })}
                    <p className="text-xs text-stone-400 tracking-widest uppercase mt-4 mb-2">Frutas (incluso)</p>
                    <div className="flex flex-wrap gap-2">
                      {boloOpcoes.extras.filter(e => e.fruta).map(e => {
                        const selecionado = bolo.extras.find(ex => ex.label === e.label);
                        return (
                          <button key={e.id} onClick={() => toggleExtra(e)}
                            className={`px-4 py-2 border text-sm transition ${
                              selecionado ? 'border-stone-900 text-stone-900 bg-stone-50' : 'border-stone-200 text-stone-500 hover:border-stone-400'
                            }`}>{e.label}</button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-stone-50 border border-stone-100">
                    <p className="text-xs text-stone-400 tracking-widest uppercase mb-3">Resumo do seu bolo</p>
                    <div className="flex flex-col gap-1 text-sm text-stone-600">
                      <p><span className="text-stone-400">Tamanho:</span> {bolo.tamanho?.label}</p>
                      <p><span className="text-stone-400">Massa:</span> {bolo.massa}</p>
                      <p><span className="text-stone-400">Recheio:</span> {bolo.recheio}</p>
                      <p><span className="text-stone-400">Cobertura:</span> {bolo.cobertura}</p>
                      {bolo.extras.length > 0 && <p><span className="text-stone-400">Extras:</span> {bolo.extras.map(e => e.label).join(', ')}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-5 border-t border-stone-100 flex-shrink-0">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-stone-400">Total: <span className="text-stone-800 font-medium">R$ {precoBolo().toFixed(2)}</span></p>
                {passoBolo > 0 && (
                  <button onClick={() => setPassoBolo(passoBolo - 1)} className="text-xs text-stone-400 hover:text-stone-600 tracking-widest uppercase transition">← Voltar</button>
                )}
              </div>
              {passoBolo < 4 ? (
                <button onClick={() => podeAvancar() && setPassoBolo(passoBolo + 1)}
                  className={`w-full py-3 text-xs tracking-widest uppercase transition ${
                    podeAvancar() ? 'bg-stone-900 hover:bg-stone-700 text-white' : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}>Continuar</button>
              ) : (
                <button onClick={adicionarBoloAoCarrinho}
                  className="w-full bg-stone-900 hover:bg-stone-700 text-white py-3 text-xs tracking-widest uppercase transition">
                  Adicionar ao Carrinho
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Barra carrinho mobile */}
      {totalItens > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
          <button onClick={() => setCarrinhoAberto(true)}
            className="w-full bg-stone-900 hover:bg-stone-800 transition px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-pink-400 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-medium flex-shrink-0">{totalItens}</span>
              <span className="text-xs tracking-widest text-white uppercase">Ver Carrinho</span>
            </div>
            <span className="text-sm text-white font-medium">R$ {totalCarrinho.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Modal produto */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(null)} />
          <div className="relative bg-white w-full max-w-md p-6">
            <button onClick={() => setModal(null)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 text-2xl leading-none">×</button>
            <div className="aspect-video overflow-hidden mb-5 -mx-6 -mt-6">
              <img src={modal.foto} alt={modal.sabor} className="w-full h-full object-cover" />
            </div>
            <p className="text-xs text-stone-400 tracking-widest uppercase mb-1">{modal.produto.nome}</p>
            <h3 className="text-xl font-light text-stone-800 mb-4">{modal.sabor}</h3>
            {modal.produto.tipo === 'tamanho' && (
              <div className="mb-4">
                <p className="text-xs text-stone-400 tracking-widest uppercase mb-2">Tamanho</p>
                <div className="flex flex-col gap-2">
                  {modal.produto.tamanhos.map(t => (
                    <button key={t.id} onClick={() => setTamanhoSelecionado(t)}
                      className={`flex justify-between px-3 py-2.5 border text-sm transition ${
                        tamanhoSelecionado?.id === t.id ? 'border-stone-800 text-stone-800' : 'border-stone-200 text-stone-500 hover:border-stone-400'
                      }`}>
                      <span>{t.label}</span><span>R$ {Number(t.preco).toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {modal.produto.tipo === 'pacote' && (
              <div className="mb-4">
                <p className="text-xs text-stone-400 tracking-widest uppercase mb-2">Quantidade</p>
                <div className="flex flex-col gap-2">
                  {modal.produto.pacotes.map(p => (
                    <button key={p.id} onClick={() => setPacoteSelecionado(p)}
                      className={`flex justify-between px-3 py-2.5 border text-sm transition ${
                        pacoteSelecionado?.id === p.id ? 'border-stone-800 text-stone-800' : 'border-stone-200 text-stone-500 hover:border-stone-400'
                      }`}>
                      <span>{p.label}</span><span>R$ {Number(p.preco).toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {modal.produto.tipo === 'simples' && (
              <div className="mb-4">
                <p className="text-xs text-stone-400 tracking-widest uppercase mb-2">Quantidade</p>
                <div className="flex items-center border border-stone-200 w-fit">
                  <button onClick={() => setQuantidade(Math.max(1, quantidade - 1))} className="w-10 h-10 text-stone-500 hover:bg-stone-50 transition text-lg">−</button>
                  <span className="text-sm text-stone-800 w-8 text-center">{quantidade}</span>
                  <button onClick={() => setQuantidade(quantidade + 1)} className="w-10 h-10 text-stone-500 hover:bg-stone-50 transition text-lg">+</button>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-stone-100">
              <p className="text-sm text-stone-400">Total: <span className="text-stone-800 font-medium">R$ {(precoModal() * quantidade).toFixed(2)}</span></p>
              <button onClick={adicionarAoCarrinho}
                className="bg-stone-900 hover:bg-stone-700 text-white px-8 py-2.5 text-xs tracking-widest uppercase transition">
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Carrinho sidebar */}
      {carrinhoAberto && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/30" onClick={() => setCarrinhoAberto(false)} />
          <div className="w-full max-w-md bg-white flex flex-col h-full">
            <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
              <h3 className="text-sm tracking-widest uppercase text-stone-700">Seu pedido</h3>
              <button onClick={() => setCarrinhoAberto(false)} className="text-stone-400 hover:text-stone-600 text-xl">×</button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
              {carrinho.map(item => (
                <div key={item.id} className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-stone-800">{item.nome}</p>
                    <p className="text-xs text-stone-400 mt-0.5">R$ {Number(item.preco).toFixed(2)} cada</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-stone-600">
                    <span>{item.quantidade}x</span>
                    <span className="text-stone-800 font-medium ml-2">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                  </div>
                  <button onClick={() => removerItem(item.id)} className="text-stone-300 hover:text-red-400 transition text-lg leading-none">×</button>
                </div>
              ))}
            </div>
            <div className="border-t border-stone-100 px-6 py-5">
              <div className="flex justify-between text-sm mb-6">
                <span className="text-stone-500 tracking-widest uppercase text-xs">Total</span>
                <span className="text-stone-800 font-medium">R$ {totalCarrinho.toFixed(2)}</span>
              </div>
              <form onSubmit={handleFinalizar} className="flex flex-col gap-3">
                <input name="cliente_nome" placeholder="Seu nome" value={form.cliente_nome} onChange={handleChange} required
                  className="w-full border border-stone-200 px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400 placeholder:text-stone-300" />
                <input name="cliente_telefone" placeholder="Seu WhatsApp" value={form.cliente_telefone} onChange={handleChange} required
                  className="w-full border border-stone-200 px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400 placeholder:text-stone-300" />
                <div>
                  <p className="text-xs text-stone-400 tracking-widest uppercase mb-1">Retirada no local</p>
                  <p className="text-xs text-stone-500 mb-2">Rua Cinquenta e Sete, 246, Cesarão - Santa Cruz</p>
                </div>
                <div>
                  <p className="text-xs text-stone-400 tracking-widest uppercase mb-1">Data de Retirada</p>
                  <input name="data_retirada" type="datetime-local" value={form.data_retirada} onChange={handleChange} required
                    className="w-full border border-stone-200 px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-stone-400" />
                </div>
                <button type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white py-3 text-xs tracking-widest uppercase transition mt-1">
                  Finalizar pelo WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
