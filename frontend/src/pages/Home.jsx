import { useNavigate } from 'react-router-dom';


// Produtos em destaque
const destaques = [
  {
    nome: 'Bolo de Chocolate',
    foto: 'https://gbczuixvwjzgfohjvjss.supabase.co/storage/v1/object/public/produtos/WhatsApp%20Image%202026-04-18%20at%2012.43.34.jpeg',
    categoria: 'Bolos',
  },
  {
    nome: 'Ovo de Páscoa Recheado',
    foto: 'https://gbczuixvwjzgfohjvjss.supabase.co/storage/v1/object/public/produtos/WhatsApp%20Image%202026-04-18%20at%2012.42.26%20(1).jpeg',
    categoria: 'Ovo de Páscoa Gourmet',
  },
  {
    nome: 'Docinhos Gourmet',
    foto: 'https://gbczuixvwjzgfohjvjss.supabase.co/storage/v1/object/public/produtos/WhatsApp%20Image%202026-04-18%20at%2012.43.47%20(1).jpeg',
    categoria: 'Docinhos Gourmet',
  },
  {
    nome: 'Banoffee',
    foto: 'https://gbczuixvwjzgfohjvjss.supabase.co/storage/v1/object/public/produtos/WhatsApp%20Image%202026-04-18%20at%2012.43.50%20(1).jpeg',
    categoria: 'Tortas',
  },
];

// Diferenciais da confeitaria
const diferenciais = [
  {
    titulo: 'Feito artesanalmente',
    descricao: 'Cada produto é preparado com dedicação e cuidado, sem pressa e sem atalhos.',
  },
  {
    titulo: 'Ingredientes selecionados',
    descricao: 'Usamos apenas ingredientes de qualidade para garantir o melhor sabor em cada mordida.',
  },
  {
    titulo: 'Encomenda personalizada',
    descricao: 'Seu pedido feito do jeito que você imaginou, com o sabor e o toque que só a Caketaly tem.',
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50">

      {/* Header */}
      <header className="bg-white border-b border-stone-100 px-4 py-4 sticky top-0 z-50 md:px-6 md:py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-left cursor-pointer">
            <h1 className="text-xl font-normal tracking-[0.2em] text-stone-900 uppercase md:text-2xl">Caketaly</h1>
            <p className="text-xs text-stone-700 tracking-widest mt-0.5">Confeitaria Artesanal</p>
          </button>
          <div className="flex items-center gap-3 md:gap-4">
            <a
              href="https://www.instagram.com/caketaly/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-stone-600 hover:text-stone-800 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <button
              onClick={() => navigate('/cardapio')}
              className="border border-stone-200 text-stone-600 px-3 py-2 text-xs tracking-widest uppercase hover:bg-stone-50 transition md:px-4"
            >
              Cardápio
            </button>
          </div>
        </div>
      </header>

      {/* Hero com foto de fundo */}
      <div
        className="relative flex items-center justify-center"
        style={{
          backgroundImage: "url('https://gbczuixvwjzgfohjvjss.supabase.co/storage/v1/object/public/produtos/WhatsApp%20Image%202026-04-18%20at%2012.43.05.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100svh',
        }}
      >
        <div className="absolute inset-0 bg-black/78" />
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto py-24 flex flex-col items-center gap-6 md:gap-8 md:py-28">
          <p className="text-xs tracking-[0.4em] text-white/100 uppercase">Bem-vindo à</p>
          <h2 className="text-4xl font-light tracking-[0.2em] text-white/100 uppercase md:text-7xl md:tracking-[0.3em]">Caketaly</h2>
          <div className="w-12 h-px bg-pink-300 md:w-16"></div>
          <p className="text-base font-light text-white/100 leading-relaxed md:text-xl">
            Cada doce é feito com carinho, ingredientes selecionados e muito amor. Uma experiência que vai além do sabor.
          </p>
          <button
            onClick={() => navigate('/cardapio')}
            className="border border-white/60 text-white px-8 py-4 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-stone-800 transition duration-300 md:px-10 md:py-3.5 md:tracking-[0.3em]"
          >
            Ver Cardápio
          </button>
        </div>
      </div>

      {/* Secao de destaques */}
      <div className="bg-white py-12 px-4 md:py-16 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-10">
            <p className="text-xs tracking-[0.3em] text-stone-400 uppercase mb-3">Irresistíveis</p>
            <h2 className="text-2xl font-light text-stone-800 tracking-wide">Nossos Favoritos</h2>
            <div className="w-10 h-px bg-pink-300 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
            {destaques.map((produto, idx) => (
              <div
                key={idx}
                onClick={() => navigate('/cardapio')}
                className="group cursor-pointer flex sm:flex-col gap-4 sm:gap-0"
              >
                <div className="w-28 h-28 flex-shrink-0 overflow-hidden bg-stone-100 sm:w-full sm:h-auto sm:aspect-square">
                  <img
                    src={produto.foto}
                    alt={produto.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                </div>
                <div className="flex flex-col justify-center sm:pt-3">
                  <p className="text-xs text-stone-400 tracking-widest uppercase mb-1">{produto.categoria}</p>
                  <p className="text-sm text-stone-800 font-normal">{produto.nome}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => navigate('/cardapio')}
              className="border border-stone-300 text-stone-600 px-8 py-3 text-xs tracking-widest uppercase hover:bg-stone-50 transition w-full sm:w-auto"
            >
              Ver Cardápio Completo
            </button>
          </div>
        </div>
      </div>

      {/* Secao de diferenciais */}
      <div className="py-12 px-4 md:py-16 md:px-6" style={{ backgroundColor: '#faf8f5' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <p className="text-xs tracking-[0.3em] text-stone-400 uppercase mb-3">Nossa essência</p>
            <h2 className="text-2xl font-light text-stone-800 tracking-wide">Por que nos escolher</h2>
            <div className="w-10 h-px bg-pink-300 mx-auto mt-4"></div>
          </div>

          <div className="flex flex-col gap-10 md:grid md:grid-cols-3 md:gap-10">
            {diferenciais.map((item, idx) => (
              <div key={idx} className="text-center px-4 md:px-0">
                <div className="w-8 h-px bg-pink-300 mx-auto mb-5"></div>
                <h3 className="text-sm font-normal text-stone-800 tracking-widest uppercase mb-3">{item.titulo}</h3>
                <p className="text-sm text-stone-400 font-light leading-relaxed">{item.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rodape */}
      <footer className="bg-stone-900 text-white px-4 py-10 md:px-6 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col gap-8 mb-8 md:grid md:grid-cols-4 md:gap-10 md:mb-10">

            {/* Marca */}
            <div>
              <h3 className="text-base font-normal tracking-[0.2em] uppercase mb-2 md:text-lg md:mb-3">Caketaly</h3>
              <p className="text-xs text-stone-400 tracking-widest">Confeitaria Artesanal</p>
            </div>

            {/* Contato */}
            <div>
              <p className="text-xs tracking-widest uppercase text-stone-400 mb-3 md:mb-4">Contato</p>
              <a
                href="https://wa.me/5521988321003"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-stone-300 hover:text-white transition block mb-2"
              >
                WhatsApp: (21) 98832-1003
              </a>
              <a
                href="https://www.instagram.com/caketaly/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-stone-300 hover:text-white transition block"
              >
                Instagram: @caketaly
              </a>
            </div>

            {/* Retirada */}
            <div>
              <p className="text-xs tracking-widest uppercase text-stone-400 mb-3 md:mb-4">Retirada</p>
              <p className="text-sm text-stone-300 leading-relaxed">
                Rua Cinquenta e Sete, 246<br />
                Cesarão — Santa Cruz<br />
                Rio de Janeiro
              </p>
            </div>

            {/* Pagamento */}
            <div>
              <p className="text-xs tracking-widest uppercase text-stone-400 mb-3 md:mb-4">Pagamento</p>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-stone-300">Pix</p>
                <p className="text-sm text-stone-300">Cartão de Débito</p>
                <p className="text-sm text-stone-300">Cartão de Crédito</p>
                <p className="text-sm text-stone-300">Dinheiro</p>
              </div>
            </div>

          </div>

          {/* Linha divisoria e copyright */}
          <div className="border-t border-stone-700 pt-6 text-center">
            <p className="text-xs text-stone-500">© 2026 Caketaly. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
