/* =========================
   Header
========================= */

fetch('/header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('site-header').innerHTML = data;

    // A frase só é carregada depois que o header existe na página
    carregarFraseHeader();
  });

/* =========================
   Footer
========================= */

fetch('/footer.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('site-footer').innerHTML = data;
  });

  /* =========================
   Frase aleatória do header
========================= */

const frases = [
  "There's nothing more precious than time.",
  "Virgil Was Here.",
  "The world produces waves. Surf or drown, you decide.",
  "I did it for me. I liked it. I was good at it. And... I was alive.",
  "The impossible is possible.",
  "Open source!",
  "Thank you, Virgil.",
  "Wish you were here!",
  "You had to be there!",
  "You can only trust yourself and the BLINK™ R&D team.",
  "Despite everything, it's still you.",
  "Get out of your own way.",
  "Stealth edition.",
  "S05E01 - Live Free or Die.",
  "Hey... You. You're finally awake.",
  "Same again?",
  "Honestly, nevermind.",
  "Good for health, bad for education!",
  "Blink and you'll miss it.",
  "Creation over consumption.",
  "When you have the chance, take it. Laugh, sing, dance. Don't allow the night to end...",
  "...But when the time comes, let go. Nothing lasts forever.",
  "Mamba mentality.",
  "Every time i get closer to the answer, the question changes.",
  "There is always a bigger picture.",
  "You vs. you.",
  "Written by Vince Gilligan.",
  "A new hand touches the beacon!",
  "Every living creature dies alone.",
  "GORE-TEX COVERS MY SOUL.",
  "Everything I do is for the 17-year-old version of myself.",
  "How did you get this job? I dreamt about it.",
  "They will ignore you, until they can't.",
  "Treino é jogo, jogo é guerra.",
  "-20.553647, -47.405210",
  "Say my name.",
  "Better call Saul!",
  "Nothing good happens after 2 a.m.",
  "Put these foolish ambitions to rest!",
  "Together, we will devour the very gods!",
  "Nacho Varga deserved better!",
  "I need a new dust filter for my Hoover Max Extract Pressure Pro, Model 60.",
  "Wake up, Neo...",
  "Follow the white rabbit.",
  "Red deck wins.",
  "From the underground to the underground, since 2017 'til god knows when."
  
];

/* =========================
   Carregar frase aleatória no header
========================= */

function carregarFraseHeader() {
  const fraseHeader = document.getElementById("frase-header");

  if (!fraseHeader) {
    return;
  }

  const indiceAleatorio = Math.floor(Math.random() * frases.length);

  fraseHeader.textContent = `"${frases[indiceAleatorio]}"`;
}

/* =========================
   Embaralhar imagens da galeria
========================= */

function embaralharElementos(container) {
  const itens = Array.from(container.querySelectorAll("img"));

  for (let i = itens.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [itens[i], itens[j]] = [itens[j], itens[i]];
  }

  itens.forEach((item) => container.appendChild(item));
}

function embaralharGalerias() {
  const galerias = document.querySelectorAll(".galeria--random");
  galerias.forEach((galeria) => embaralharElementos(galeria));
}

document.addEventListener("DOMContentLoaded", embaralharGalerias);

/* =========================
   SCRIPT PARA CARREGAMENTO INFINITO DE IMAGENS
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const galeria = document.getElementById("galeria");
  const sentinela = document.getElementById("sentinela");
  
  // 1. Gera a lista de imagens dinamicamente (de 1 a 318)
  // ESSE NÚMERO É A ÚNICA COISA QUE DEVE SER ALTERADA CASO NOVAS IMAGENS SEJAM ADICIONADAS
  const totalImagens = 1049;
  const imagens = [];
  
  for (let i = 1; i <= totalImagens; i++) {
    // Transforma "1" em "0001", "25" em "0025", etc.
    const numeroFormatado = i.toString().padStart(4, '0');
    imagens.push(`../img/archive/arch-${numeroFormatado}.jpg`);
  }

  // 2. Randomiza (embaralha) a ordem das imagens - Algoritmo Fisher-Yates
  for (let i = imagens.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [imagens[i], imagens[j]] = [imagens[j], imagens[i]];
  }

  // 3. Configuração do carregamento infinito
  let indiceAtual = 0;
  const quantidadePorVez = 30;

  function carregarMaisImagens() {
    // Calcula até onde o loop deve ir neste lote
    const limite = Math.min(indiceAtual + quantidadePorVez, imagens.length);
    
    // Usar um fragmento melhora a performance ao inserir no DOM
    const fragmento = document.createDocumentFragment();

    for (let i = indiceAtual; i < limite; i++) {
      const img = document.createElement("img");
      img.src = imagens[i];
      img.alt = `Imagem de arquivo`;
      img.loading = "lazy"; // Garante carregamento suave
      fragmento.appendChild(img);
    }

    galeria.appendChild(fragmento);
    indiceAtual = limite;

    // Se todas as imagens foram carregadas, para de observar a sentinela
    if (indiceAtual >= imagens.length) {
      observador.unobserve(sentinela);
    }
  }

  // 4. Observa a rolagem para ativar o carregamento
  const observador = new IntersectionObserver((entradas) => {
    // Quando a div #sentinela aparecer na tela, carrega mais fotos
    if (entradas[0].isIntersecting) {
      carregarMaisImagens();
    }
  }, { 
    // rootMargin de "200px" faz com que comece a carregar 200px antes 
    // de chegar no fim, evitando que o usuário veja a página vazia
    rootMargin: "200px" 
  });

  // Inicia a observação
  if (galeria && sentinela) {
    observador.observe(sentinela);
  }
});

// LIGHTBOX PARA AMPLIAR IMAGENS DA GALERIA (APENAS DESKTOP) ------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  // Cria a estrutura HTML do Lightbox dinamicamente
  const lightboxHTML = `
    <div class="lightbox-overlay" id="lightbox">
      <button class="lightbox-botao lightbox-fechar">&times;</button>
      <button class="lightbox-botao lightbox-anterior">&#10094;</button>
      <div class="lightbox-conteudo">
        <img src="" alt="Imagem ampliada">
      </div>
      <button class="lightbox-botao lightbox-proxima">&#10095;</button>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', lightboxHTML);

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox.querySelector(".lightbox-conteudo img");
  const btnFechar = lightbox.querySelector(".lightbox-fechar");
  const btnAnterior = lightbox.querySelector(".lightbox-anterior");
  const btnProxima = lightbox.querySelector(".lightbox-proxima");

  let imagensGaleria = [];
  let indiceAtual = 0;

  // Usa delegação de eventos no documento para pegar imagens atuais e futuras (infinite scroll)
  document.addEventListener("click", (e) => {
    // Se a tela for menor ou igual a 1100px (Mobile/Tablet), o Lightbox não é acionado
    if (window.innerWidth <= 1100) return;

    if (e.target.tagName === "IMG" && e.target.closest(".galeria")) {
      const imgClicada = e.target;
      const galeriaPai = imgClicada.closest(".galeria");
      
      // Pega todas as imagens daquela galeria específica naquele exato momento
      imagensGaleria = Array.from(galeriaPai.querySelectorAll("img"));
      indiceAtual = imagensGaleria.indexOf(imgClicada);

      if (indiceAtual !== -1) {
        atualizarImagemLightbox();
        lightbox.classList.add("ativo");
        document.body.style.overflow = "hidden"; // Trava a rolagem da página de fundo
      }
    }
  });

  function atualizarImagemLightbox() {
    if (imagensGaleria.length > 0 && imagensGaleria[indiceAtual]) {
      lightboxImg.src = imagensGaleria[indiceAtual].src;
    }
  }

  function fecharLightbox() {
    lightbox.classList.remove("ativo");
    document.body.style.overflow = "auto"; // Libera a rolagem
  }

  function proximaImagem(e) {
    if (e) e.stopPropagation();
    if (imagensGaleria.length === 0) return;
    indiceAtual = (indiceAtual + 1) % imagensGaleria.length;
    atualizarImagemLightbox();
  }

  function imagemAnterior(e) {
    if (e) e.stopPropagation();
    if (imagensGaleria.length === 0) return;
    indiceAtual = (indiceAtual - 1 + imagensGaleria.length) % imagensGaleria.length;
    atualizarImagemLightbox();
  }

  // Eventos de clique nos botões
  btnFechar.addEventListener("click", fecharLightbox);
  btnProxima.addEventListener("click", proximaImagem);
  btnAnterior.addEventListener("click", imagemAnterior);

  // Fechar ao clicar fora da imagem (no fundo escuro)
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      fecharLightbox();
    }
  });

  // Navegação por teclado (Setas esquerda/direita e ESC para fechar)
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("ativo")) return;
    
    if (e.key === "Escape") fecharLightbox();
    if (e.key === "ArrowRight") proximaImagem();
    if (e.key === "ArrowLeft") imagemAnterior();
  });
});