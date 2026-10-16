/* =========================
   Frase aleatória do header
   ---------------------------------------------------------
   OBS: antes existia aqui um fetch('/header.html') e um
   fetch('/footer.html') para montar o header/footer via
   JavaScript. Isso era resíduo de uma versão antiga do site:
   hoje o Jekyll já insere o header e o footer prontos no HTML
   através do {% include %} em _layouts/default.html.

   Esse fetch antigo sempre falhava (a URL não existe mais) e
   tentava escrever dentro de elementos #site-header/#site-footer
   que também não existem — ou seja, gerava erro no console em
   todas as páginas E, como a função carregarFraseHeader() só
   era chamada dentro desse fetch quebrado, a frase aleatória do
   topo nunca era exibida de verdade. Removido o fetch; a frase
   agora é sorteada assim que a página carrega (ver o final desta
   seção).
========================= */

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

// O header já vem pronto no HTML (inserido pelo Jekyll), então
// basta esperar o DOM carregar para sortear e exibir a frase.
document.addEventListener("DOMContentLoaded", carregarFraseHeader);

/* =========================
   Embaralhar imagens da galeria
   ---------------------------------------------------------
   Usado nas galerias com a classe "galeria--random" que já
   nascem prontas no HTML (ex.: galeria da página inicial).
   Reordena os elementos <img> existentes assim que a página
   carrega. Não é usado pela galeria da página Archive, que é
   montada dinamicamente (ver seção de carregamento infinito).
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
   SCRIPT PARA CARREGAMENTO INFINITO DE IMAGENS (PÁGINA ARCHIVE)
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const galeria = document.getElementById("galeria");
  const sentinela = document.getElementById("sentinela");

  if (!galeria || !sentinela) return;

  const totalImagens = 1068;
  const imagens = [];

  for (let i = 1; i <= totalImagens; i++) {
    const numeroFormatado = i.toString().padStart(4, '0');
    imagens.push(`/img/archive/arch-${numeroFormatado}.jpg`);
  }

  for (let i = imagens.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [imagens[i], imagens[j]] = [imagens[j], imagens[i]];
  }

  function obterNumeroColunas() {
    return window.matchMedia("(min-width: 1100px)").matches ? 3 : 1;
  }

  const colunas = [];
  galeria.classList.add("galeria--colunas");

  function criarColunas(qtd) {
    galeria.innerHTML = "";
    colunas.length = 0;
    for (let i = 0; i < qtd; i++) {
      const coluna = document.createElement("div");
      coluna.className = "coluna-galeria";
      galeria.appendChild(coluna);
      colunas.push(coluna);
    }
  }

  criarColunas(obterNumeroColunas());

  let indiceAtual = 0;
  const quantidadePorVez = 30;
  let carregando = false;

  function indiceColunaMaisCurta() {
    let indiceMenor = 0;
    let menorAltura = colunas[0].offsetHeight;

    for (let j = 1; j < colunas.length; j++) {
      if (colunas[j].offsetHeight < menorAltura) {
        menorAltura = colunas[j].offsetHeight;
        indiceMenor = j;
      }
    }

    // Se as alturas forem iguais (comum no início ou imagens ainda não renderizadas),
    // escolhemos a coluna que tem menos elementos dentro.
    if (colunas.every(c => c.offsetHeight === menorAltura)) {
      let minItens = colunas[0].children.length;
      indiceMenor = 0;
      for (let j = 1; j < colunas.length; j++) {
        if (colunas[j].children.length < minItens) {
          minItens = colunas[j].children.length;
          indiceMenor = j;
        }
      }
    }

    return indiceMenor;
  }

  function encaixarImagem(img, animar = true) {
    const indice = indiceColunaMaisCurta();
    colunas[indice].appendChild(img);

    if (animar) {
      // Forçamos o navegador a processar o layout antes de animar
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          img.classList.add("aparecer");
        });
      });
    } else {
      img.classList.add("aparecer");
    }
  }

  function carregarMaisImagens() {
    if (carregando || indiceAtual >= imagens.length) return;
    carregando = true;

    const limite = Math.min(indiceAtual + quantidadePorVez, imagens.length);
    let processadasNestaLeva = 0;
    const totalDestaLeva = limite - indiceAtual;

    const verificarFimDaLeva = () => {
      processadasNestaLeva++;
      if (processadasNestaLeva >= totalDestaLeva) {
        carregando = false;
        // Verifica se o sentinela ainda está visível (ex: telas 4k)
        setTimeout(checarProximidadeSentinela, 300);
      }
    };

    for (let i = indiceAtual; i < limite; i++) {
      const img = document.createElement("img");
      img.alt = "Imagem de arquivo";
      img.dataset.index = String(i);
      img.decoding = "async";
      
      const fonte = imagens[i];

      const aoFinalizar = () => {
        if (img.dataset.carregada === "true") return;
        img.dataset.carregada = "true";
        encaixarImagem(img);
        verificarFimDaLeva();
      };

      const aoFalhar = () => {
        if (img.dataset.carregada === "true") return;
        img.dataset.carregada = "true";
        console.warn("Não foi possível carregar:", fonte);
        verificarFimDaLeva();
      };

      img.onload = aoFinalizar;
      img.onerror = aoFalhar;
      img.src = fonte;

      // Se já estiver no cache
      if (img.complete && img.naturalWidth > 0) {
        aoFinalizar();
      }
    }

    indiceAtual = limite;
  }

  function checarProximidadeSentinela() {
    if (carregando || indiceAtual >= imagens.length) return;
    const rect = sentinela.getBoundingClientRect();
    if (rect.top <= window.innerHeight + 800) {
      carregarMaisImagens();
    }
  }

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        carregarMaisImagens();
      }
    });
  }, {
    rootMargin: "800px"
  });

  observador.observe(sentinela);
  window.addEventListener("scroll", checarProximidadeSentinela, { passive: true });

  window.addEventListener("resize", () => {
    const qtdDesejada = obterNumeroColunas();
    if (qtdDesejada !== colunas.length) {
      const todasImagens = Array.from(galeria.querySelectorAll("img")).sort((a, b) => {
        return Number(a.dataset.index) - Number(b.dataset.index);
      });
      criarColunas(qtdDesejada);
      todasImagens.forEach((img) => encaixarImagem(img, false));
    }
  });

  carregarMaisImagens();
});

/* =========================
   LIGHTBOX PARA AMPLIAR IMAGENS DA GALERIA (APENAS DESKTOP)
   ---------------------------------------------------------
   Cria o modal de lightbox uma única vez e usa delegação de
   eventos (clique no documento) para funcionar tanto com as
   imagens que já existem na página quanto com as que são
   adicionadas depois pelo infinite scroll do Archive.
   Desativado em telas <= 1100px (ver style.css).
========================= */

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

      // Pega todas as imagens daquela galeria e ordena pela posição
      // original (data-index). Isso é necessário porque, na página
      // Archive, as imagens agora ficam agrupadas por coluna no HTML
      // (ver seção de carregamento infinito) e não na ordem
      // sequencial de carregamento. Em galerias sem data-index (ex.:
      // a da home), o sort não altera nada, então a ordem visual
      // original é mantida normalmente.
      imagensGaleria = Array.from(galeriaPai.querySelectorAll("img")).sort((a, b) => {
        const indexA = a.dataset.index !== undefined ? Number(a.dataset.index) : 0;
        const indexB = b.dataset.index !== undefined ? Number(b.dataset.index) : 0;
        return indexA - indexB;
      });
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