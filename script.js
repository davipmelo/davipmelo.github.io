/* ==========================================================
   SITE SCRIPTS (DAVI MELO)
   - Frase aleatória no cabeçalho
   - Embaralhamento e fade-in da galeria da Home
   - Carregamento infinito fluido (Archive) sem layout thrashing
   - Lightbox para desktop com atalhos de teclado e pré-carregamento
========================================================== */

/* ----------------------------------------------------------
   1. COLEÇÃO DE FRASES DO HEADER
---------------------------------------------------------- */
const frases = [
  "There's nothing more precious than time.",
  "Virgil was here.",
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
  "-20.519004, -47.382654",
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
  "What is better? To be born good, or to overcome your evil nature through great effort?",
  "Look around, Ted. You're all alone.",
  "I went to DM's website and all I got was this f**king quote.",
  "In a space where there is no room, in a structure that was never built, meets the guild that doesn't exist.",
  "The cycle of life and death continues. We will live, they will die.",
  "Spiritual healing.",
  "Reading the card explains the card.",
  "A real artist flirts with failure daily.",
  "Enter the labyrinth...",
  "Hard to imagine The Neighbourhood ever changing.",
  "Let me solo her!",
  "All those moments will be lost in time, like tears in rain.",
  "If you're reading this it's too late.",
  "WORK IN PROGRESS",
  "Ah shit, here we go again.",
  "Grove Street. Home.",
  "I'll have two number 9s, a number 9 large, a number 6 with extra dip, a number 7, two number 45s, one with cheese, and a large soda.",
  "A guy opens his door and gets shot, and you think that of me?",
  "Ignorance is bliss.",
  "Analog is always better.",
  "Horizontal is always better.",
  "The best or nothing.",
  "Some may call this junk. Me, I call them treasures!",
  "Gludio theme playing softly in the background.",
  "Grand Chase main menu theme playing softly in the background.",
  "Far Horizons playing softly in the background.",
  "There's no place better than Gludio.",
  "This is my own private domicile and I will not be harassed... bitch!",
  "I miss the 2017 SK Gaming.",
  "In a long distance relationship with the city of Milan.",
  "A lot can change if you reload the page...",
  "The shortest poem is a name.",
  "In my restless dreams, I see that town.",
  "They are minerals, Marie!",
  "As the sky opened up, we ran for shelter. Halfway there I came to the sudden realization that, already soaked, there might be more to gain from experiencing the rain than running from it.",
  "From the underground to the underground, since 2017 'til god knows when."
];

/* ----------------------------------------------------------
   2. FRASE ALEATÓRIA DO CABEÇALHO
---------------------------------------------------------- */
function initFraseHeader() {
  const fraseHeader = document.getElementById("frase-header");
  if (!fraseHeader) return;

  const indiceAleatorio = Math.floor(Math.random() * frases.length);
  fraseHeader.textContent = `"${frases[indiceAleatorio]}"`;
}

/* ----------------------------------------------------------
   3. OBSERVADOR DE FADE-IN COMPARTILHADO
---------------------------------------------------------- */
function criarObservadorFade() {
  return new IntersectionObserver((entradas, observer) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add("aparecer");
        observer.unobserve(entrada.target);
      }
    });
  }, {
    rootMargin: "0px 0px -50px 0px"
  });
}

/* ----------------------------------------------------------
   4. GALERIA DA HOME (EMBARALHAMENTO E FADE)
---------------------------------------------------------- */
function initGaleriaIndex() {
  const galeria = document.querySelector(".galeria--index .galeria");
  if (!galeria) return;

  // Embaralha itens existentes no HTML usando DocumentFragment para um único reflow
  const itens = Array.from(galeria.querySelectorAll("img"));
  if (itens.length > 1) {
    for (let i = itens.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [itens[i], itens[j]] = [itens[j], itens[i]];
    }

    const fragment = document.createDocumentFragment();
    itens.forEach((item) => fragment.appendChild(item));
    galeria.appendChild(fragment);
  }

  // Aplica o observador de fade-in
  const observadorFade = criarObservadorFade();
  itens.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      observadorFade.observe(img);
    } else {
      img.addEventListener("load", () => observadorFade.observe(img), { once: true });
      img.addEventListener("error", () => observadorFade.observe(img), { once: true });
    }
  });
}

/* ----------------------------------------------------------
   5. GALERIA ARCHIVE (CARREGAMENTO INFINITO OTIMIZADO)
---------------------------------------------------------- */
function initGaleriaArchive() {
  const galeria = document.getElementById("galeria");
  const sentinela = document.getElementById("sentinela");
  if (!galeria || !sentinela) return;

  const totalImagens = 1119;
  const imagens = [];

  for (let i = 1; i <= totalImagens; i++) {
    const numeroFormatado = i.toString().padStart(4, "0");
    imagens.push(`/img/archive/arch-${numeroFormatado}.jpg`);
  }

  // Embaralha ordem das imagens
  for (let i = imagens.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [imagens[i], imagens[j]] = [imagens[j], imagens[i]];
  }

  const mediaDesktop = window.matchMedia("(min-width: 1100px)");
  const obterNumeroColunas = () => (mediaDesktop.matches ? 3 : 1);

  const colunas = [];
  const alturasVirtuais = [];
  galeria.classList.add("galeria--colunas");

  const observadorFade = criarObservadorFade();

  function montarColunas(qtd) {
    galeria.innerHTML = "";
    colunas.length = 0;
    alturasVirtuais.length = 0;

    for (let i = 0; i < qtd; i++) {
      const coluna = document.createElement("div");
      coluna.className = "coluna-galeria";
      galeria.appendChild(coluna);
      colunas.push(coluna);
      alturasVirtuais.push(0);
    }
  }

  montarColunas(obterNumeroColunas());

  // Encontra a coluna mais baixa em memória, evitando leitura de offsetHeight síncrona
  function obterIndiceColunaMaisCurta() {
    let indiceMenor = 0;
    let menorAltura = alturasVirtuais[0];

    for (let j = 1; j < alturasVirtuais.length; j++) {
      if (alturasVirtuais[j] < menorAltura) {
        menorAltura = alturasVirtuais[j];
        indiceMenor = j;
      }
    }
    return indiceMenor;
  }

  function encaixarImagem(img, animar = true) {
    const indice = obterIndiceColunaMaisCurta();
    colunas[indice].appendChild(img);

    // Atualiza a altura estimada da coluna em memória com base no aspect ratio
    const aspect = img.naturalWidth && img.naturalHeight
      ? (img.naturalHeight / img.naturalWidth)
      : 1.33;
    alturasVirtuais[indice] += aspect * 300 + 20;

    if (animar) {
      observadorFade.observe(img);
    } else {
      img.classList.add("aparecer");
    }
  }

  let indiceAtual = 0;
  const quantidadePorLeva = 30;
  let carregando = false;

  function carregarMaisImagens() {
    if (carregando || indiceAtual >= imagens.length) return;
    carregando = true;

    const limite = Math.min(indiceAtual + quantidadePorLeva, imagens.length);
    let processadas = 0;
    const totalDestaLeva = limite - indiceAtual;

    const aoFinalizarLeva = () => {
      processadas++;
      if (processadas >= totalDestaLeva) {
        carregando = false;
        // Se a tela for muito grande e o sentinela ainda estiver visível, carrega mais uma leva
        const rect = sentinela.getBoundingClientRect();
        if (rect.top <= window.innerHeight + 800) {
          requestAnimationFrame(carregarMaisImagens);
        }
      }
    };

    for (let i = indiceAtual; i < limite; i++) {
      const img = document.createElement("img");
      img.alt = "Imagem de arquivo";
      img.dataset.index = String(i);
      img.decoding = "async";

      const fonte = imagens[i];

      const aoCarregarOuErro = () => {
        if (img.dataset.processada === "true") return;
        img.dataset.processada = "true";
        encaixarImagem(img);
        aoFinalizarLeva();
      };

      img.onload = aoCarregarOuErro;
      img.onerror = () => {
        console.warn("Imagem não encontrada:", fonte);
        aoCarregarOuErro();
      };

      img.src = fonte;

      if (img.complete && img.naturalWidth > 0) {
        aoCarregarOuErro();
      }
    }

    indiceAtual = limite;
  }

  // Observador exclusivo para o sentinela: dispensa listeners pesados no window scroll
  const observadorSentinela = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        carregarMaisImagens();
      }
    });
  }, {
    rootMargin: "800px"
  });

  observadorSentinela.observe(sentinela);

  // Escuta alteração do breakpoint através de matchMedia (dispara apenas ao trocar desktop/mobile)
  mediaDesktop.addEventListener("change", () => {
    const qtdDesejada = obterNumeroColunas();
    if (qtdDesejada !== colunas.length) {
      const todasImagens = Array.from(galeria.querySelectorAll("img")).sort((a, b) => {
        return Number(a.dataset.index) - Number(b.dataset.index);
      });
      montarColunas(qtdDesejada);
      todasImagens.forEach((img) => encaixarImagem(img, false));
    }
  });

  // Primeira leva inicial
  carregarMaisImagens();
}

/* ----------------------------------------------------------
   6. LIGHTBOX PARA DESKTOP COM CONTROLE ACESSÍVEL
---------------------------------------------------------- */
function initLightbox() {
  if (!document.querySelector(".galeria")) return;

  const lightboxHTML = `
    <div class="lightbox-overlay" id="lightbox" role="dialog" aria-modal="true" aria-label="Visualizador de Imagem">
      <button class="lightbox-botao lightbox-fechar" aria-label="Fechar lightbox">&times;</button>
      <button class="lightbox-botao lightbox-anterior" aria-label="Imagem anterior">&#10094;</button>
      <div class="lightbox-conteudo">
        <img src="" alt="Imagem ampliada">
      </div>
      <button class="lightbox-botao lightbox-proxima" aria-label="Próxima imagem">&#10095;</button>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", lightboxHTML);

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = lightbox.querySelector(".lightbox-conteudo img");
  const btnFechar = lightbox.querySelector(".lightbox-fechar");
  const btnAnterior = lightbox.querySelector(".lightbox-anterior");
  const btnProxima = lightbox.querySelector(".lightbox-proxima");

  let imagensGaleria = [];
  let indiceAtual = 0;

  function precarregarProxima(indice) {
    if (imagensGaleria.length === 0) return;
    const prox = (indice + 1) % imagensGaleria.length;
    const ant = (indice - 1 + imagensGaleria.length) % imagensGaleria.length;
    if (imagensGaleria[prox]) {
      const imgProx = new Image();
      imgProx.src = imagensGaleria[prox].src;
    }
    if (imagensGaleria[ant]) {
      const imgAnt = new Image();
      imgAnt.src = imagensGaleria[ant].src;
    }
  }

  function atualizarImagemLightbox() {
    if (imagensGaleria.length > 0 && imagensGaleria[indiceAtual]) {
      lightboxImg.src = imagensGaleria[indiceAtual].src;
      precarregarProxima(indiceAtual);
    }
  }

  function fecharLightbox() {
    lightbox.classList.remove("ativo");
    document.body.style.overflow = "";
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

  // Delegação de clique para imagens de qualquer galeria
  document.addEventListener("click", (e) => {
    if (window.innerWidth < 1100) return;

    if (e.target.tagName === "IMG" && e.target.closest(".galeria")) {
      const imgClicada = e.target;
      const galeriaPai = imgClicada.closest(".galeria");

      const lista = Array.from(galeriaPai.querySelectorAll("img"));
      // Ordena por data-index somente se a galeria tiver esse atributo (Archive)
      if (lista.length > 0 && lista[0].dataset.index !== undefined) {
        imagensGaleria = lista.sort((a, b) => Number(a.dataset.index) - Number(b.dataset.index));
      } else {
        imagensGaleria = lista;
      }

      indiceAtual = imagensGaleria.indexOf(imgClicada);

      if (indiceAtual !== -1) {
        atualizarImagemLightbox();
        lightbox.classList.add("ativo");
        document.body.style.overflow = "hidden";
      }
    }
  });

  btnFechar.addEventListener("click", fecharLightbox);
  btnProxima.addEventListener("click", proximaImagem);
  btnAnterior.addEventListener("click", imagemAnterior);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) fecharLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("ativo")) return;

    if (e.key === "Escape") fecharLightbox();
    if (e.key === "ArrowRight") proximaImagem();
    if (e.key === "ArrowLeft") imagemAnterior();
  });
}

/* ----------------------------------------------------------
   7. INICIALIZAÇÃO UNIFICADA
---------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initFraseHeader();
  initGaleriaIndex();
  initGaleriaArchive();
  initLightbox();
});