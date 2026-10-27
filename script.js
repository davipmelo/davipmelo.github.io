/* ==========================================================
   SITE SCRIPTS (DAVI MELO)
   - Frase aleatória no cabeçalho
   - Embaralhamento e fade-in da galeria da Home
   - Carregamento infinito fluido (Archive) sem layout thrashing
   - Lightbox para desktop com atalhos de teclado e pré-carregamento
========================================================== */

/* ----------------------------------------------------------
   1. FRASE ALEATÓRIA DO CABEÇALHO
   (Frases carregadas a partir de /frases.js)
---------------------------------------------------------- */
function initFraseHeader() {
  const fraseHeader = document.getElementById("frase-header");
  if (!fraseHeader || typeof frases === "undefined" || !frases.length) return;

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
   5. FUNÇÕES UNIVERSAIS DE NIVELAMENTO DE GALERIAS MULTI-COLUNA
---------------------------------------------------------- */
function limparNivelamento(galeriaEl) {
  if (!galeriaEl) return;
  const equalizadas = galeriaEl.querySelectorAll("img[data-equalizada='true']");
  equalizadas.forEach((img) => {
    img.style.removeProperty("height");
    img.style.removeProperty("min-height");
    img.style.removeProperty("max-height");
    img.style.removeProperty("object-fit");
    img.style.removeProperty("object-position");
    delete img.dataset.equalizada;
  });
}

function nivelarGaleria(galeriaEl) {
  if (!galeriaEl) return;
  const colunas = Array.from(galeriaEl.querySelectorAll(":scope > .coluna-galeria"));
  if (colunas.length <= 1) return;

  limparNivelamento(galeriaEl);

  const alturas = colunas.map((col) => col.offsetHeight);
  const alturaMaxima = Math.max(...alturas);
  if (alturaMaxima <= 0) return;

  colunas.forEach((col, i) => {
    const diff = alturaMaxima - alturas[i];
    if (diff > 1) {
      const ultimaImg = col.lastElementChild;
      if (ultimaImg && ultimaImg.tagName === "IMG") {
        const alturaAtual = ultimaImg.offsetHeight;
        const novaAltura = Math.round(alturaAtual + diff);
        ultimaImg.style.setProperty("height", `${novaAltura}px`, "important");
        ultimaImg.style.setProperty("min-height", `${novaAltura}px`, "important");
        ultimaImg.style.setProperty("max-height", `${novaAltura}px`, "important");
        ultimaImg.style.setProperty("object-fit", "cover", "important");
        ultimaImg.style.setProperty("object-position", "center", "important");
        ultimaImg.dataset.equalizada = "true";
      }
    }
  });
}

function nivelarTodasAsGalerias() {
  document.querySelectorAll(".galeria.galeria--colunas").forEach(nivelarGaleria);
}

/* ----------------------------------------------------------
   6. GALERIAS ESTÁTICAS MULTI-COLUNA (BLOG POSTS / PÁGINAS)
---------------------------------------------------------- */
function initGaleriasEstaticas() {
  const galerias = Array.from(document.querySelectorAll(".galeria:not(#galeria)"));
  if (galerias.length === 0) return;

  const mediaDesktop = window.matchMedia("(min-width: 1100px)");
  const observadorFade = criarObservadorFade();

  galerias.forEach((galeria) => {
    // A galeria da Home (.galeria--index) é propositalmente 1 coluna
    if (galeria.closest(".galeria--index")) return;

    const imagens = Array.from(galeria.querySelectorAll("img"));
    if (imagens.length <= 1) return;

    galeria.classList.add("galeria--colunas");

    const obterQtdColunas = () => (mediaDesktop.matches ? 2 : 1);

    function organizarColunas() {
      const qtdColunas = obterQtdColunas();
      galeria.innerHTML = "";
      const colunas = [];
      const alturas = [];

      for (let i = 0; i < qtdColunas; i++) {
        const col = document.createElement("div");
        col.className = "coluna-galeria";
        galeria.appendChild(col);
        colunas.push(col);
        alturas.push(0);
      }

      imagens.forEach((img) => {
        let menorIndice = 0;
        let menorAltura = alturas[0];
        for (let j = 1; j < alturas.length; j++) {
          if (alturas[j] < menorAltura) {
            menorAltura = alturas[j];
            menorIndice = j;
          }
        }

        colunas[menorIndice].appendChild(img);

        const aspect = img.naturalWidth && img.naturalHeight
          ? (img.naturalHeight / img.naturalWidth)
          : 1.33;
        alturas[menorIndice] += aspect * 350 + 20;

        if (img.complete && img.naturalWidth > 0) {
          observadorFade.observe(img);
        } else {
          img.addEventListener("load", () => {
            observadorFade.observe(img);
            requestAnimationFrame(() => nivelarGaleria(galeria));
          }, { once: true });
        }
      });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => nivelarGaleria(galeria));
      });
    }

    organizarColunas();
    mediaDesktop.addEventListener("change", organizarColunas);
  });
}

/* ----------------------------------------------------------
   7. GALERIA ARCHIVE (CARREGAMENTO INFINITO OTIMIZADO)
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

    // Se a coluna já possuía uma imagem equalizada na ponta, restaura sua altura natural
    const ultimoFilho = colunas[indice].lastElementChild;
    if (ultimoFilho && ultimoFilho.dataset.equalizada === "true") {
      ultimoFilho.style.removeProperty("height");
      ultimoFilho.style.removeProperty("min-height");
      ultimoFilho.style.removeProperty("max-height");
      ultimoFilho.style.removeProperty("object-fit");
      ultimoFilho.style.removeProperty("object-position");
      delete ultimoFilho.dataset.equalizada;
    }

    colunas[indice].appendChild(img);

    // Atualiza a altura estimada da coluna em memória com base no aspect ratio real
    const aspect = img.naturalWidth && img.naturalHeight
      ? (img.naturalHeight / img.naturalWidth)
      : 1.33;
    const larguraColuna = colunas[0]?.offsetWidth || 350;
    alturasVirtuais[indice] += aspect * larguraColuna + 20;

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

        // SEMPRE executa o nivelamento após o carregamento da leva
        requestAnimationFrame(() => {
          requestAnimationFrame(() => nivelarGaleria(galeria));
        });

        // Se a tela for muito grande e o sentinela ainda estiver visível na carga inicial
        const rect = sentinela.getBoundingClientRect();
        if (rect.top <= window.innerHeight + 800 && indiceAtual < imagens.length) {
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
      limparNivelamento(galeria);
      const todasImagens = Array.from(galeria.querySelectorAll("img")).sort((a, b) => {
        return Number(a.dataset.index) - Number(b.dataset.index);
      });
      montarColunas(qtdDesejada);
      todasImagens.forEach((img) => encaixarImagem(img, false));
      if (qtdDesejada > 1) {
        requestAnimationFrame(() => requestAnimationFrame(() => nivelarGaleria(galeria)));
      }
    }
  });

  // Primeira leva inicial
  carregarMaisImagens();
}

/* ----------------------------------------------------------
   8. LIGHTBOX PARA DESKTOP COM CONTROLE ACESSÍVEL
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
   9. LISTENER GLOBAL DE REDIMENSIONAMENTO E SCROLL
---------------------------------------------------------- */
let scrollResizeTimer;
const dispararNivelamentoGeral = () => {
  clearTimeout(scrollResizeTimer);
  scrollResizeTimer = setTimeout(() => {
    requestAnimationFrame(nivelarTodasAsGalerias);
  }, 120);
};

window.addEventListener("scroll", dispararNivelamentoGeral, { passive: true });
window.addEventListener("resize", dispararNivelamentoGeral);

/* ----------------------------------------------------------
   10. INICIALIZAÇÃO UNIFICADA
---------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initFraseHeader();
  initGaleriaIndex();
  initGaleriasEstaticas();
  initGaleriaArchive();
  initLightbox();
});