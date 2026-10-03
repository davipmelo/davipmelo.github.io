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
  "Ah shit, here we go again",
  "Grove Street. Home.",
  "I'll have two number 9s, a number 9 large, a number 6 with extra dip, a number 7, two number 45s, one with cheese, and a large soda.",
  "A guy opens his door and gets shot, and you think that of me?",
  "Ignorance is bliss.",
  "Analog is always better.",
  "The best or nothing.",
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
   ---------------------------------------------------------
   Usado apenas na página Archive (elementos #galeria e
   #sentinela). As <img> são criadas via JavaScript, em lotes,
   conforme o usuário rola a página.

   As imagens são distribuídas de forma alternada (round-robin)
   entre as colunas reais (<div> com flexbox). Isso garante que
   todas as colunas sejam preenchidas por igual e que novas fotos
   sejam inseridas sempre no final, abaixo das fotos já existentes,
   SEM NUNCA ALTERAR A ORDEM nem reposicionar o que já está na tela.
========================= */

document.addEventListener("DOMContentLoaded", () => {
  const galeria = document.getElementById("galeria");
  const sentinela = document.getElementById("sentinela");

  // Se a página atual não tiver #galeria/#sentinela (ex.: home, blog), não há nada a fazer.
  if (!galeria || !sentinela) return;

  // 1. Gera a lista de imagens dinamicamente (de 1 a 1068)
  // ESSE NÚMERO É A ÚNICA COISA QUE DEVE SER ALTERADA CASO NOVAS IMAGENS SEJAM ADICIONADAS
  const totalImagens = 1068;
  const imagens = [];

  for (let i = 1; i <= totalImagens; i++) {
    // Transforma "1" em "0001", "25" em "0025", etc.
    const numeroFormatado = i.toString().padStart(4, '0');
    imagens.push(`/img/archive/arch-${numeroFormatado}.jpg`);
  }

  // 2. Randomiza (embaralha) a ordem das imagens - Algoritmo Fisher-Yates
  for (let i = imagens.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [imagens[i], imagens[j]] = [imagens[j], imagens[i]];
  }

  // 3. Criação e gerenciamento das colunas
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

  // 4. Configuração do carregamento infinito
  let indiceAtual = 0;
  const quantidadePorVez = 30;
  let carregando = false;

  function carregarMaisImagens() {
    if (carregando || indiceAtual >= imagens.length) return;
    carregando = true;

    // Calcula até onde o loop deve ir neste lote
    const limite = Math.min(indiceAtual + quantidadePorVez, imagens.length);

    for (let i = indiceAtual; i < limite; i++) {
      const img = document.createElement("img");
      img.src = imagens[i];
      img.alt = "Imagem de arquivo";
      img.loading = "lazy"; // Carregamento sob demanda pelo navegador
      // Guarda a posição original no dataset para navegação do lightbox
      img.dataset.index = i;

      // Distribuição round-robin: cada imagem vai para a próxima coluna sequencialmente.
      // Isso preenche todas as colunas de forma homogênea e coloca as fotos novas
      // estritamente abaixo das já carregadas, sem alterar a ordem das existentes.
      colunas[i % colunas.length].appendChild(img);
    }

    indiceAtual = limite;

    if (indiceAtual >= imagens.length) {
      if (observador) observador.unobserve(sentinela);
      window.removeEventListener("scroll", checarProximidadeSentinela);
      carregando = false;
      return;
    }

    // Libera a trava e verifica se a tela precisa de mais um lote (ex.: telas grandes)
    setTimeout(() => {
      carregando = false;
      checarProximidadeSentinela();
    }, 150);
  }

  function checarProximidadeSentinela() {
    if (carregando || indiceAtual >= imagens.length) return;
    const rect = sentinela.getBoundingClientRect();
    // Se a sentinela estiver a 800px ou menos da parte inferior da tela, carrega mais um lote
    if (rect.top <= window.innerHeight + 800) {
      carregarMaisImagens();
    }
  }

  // 5. IntersectionObserver para carregar o lote quando estiver próximo ao fim
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        carregarMaisImagens();
      }
    });
  }, {
    // rootMargin de "800px" antecipa o carregamento enquanto o usuário chega perto do fim
    rootMargin: "800px"
  });

  observador.observe(sentinela);

  // Monitora a rolagem para garantir carregamento contínuo em qualquer circunstância
  window.addEventListener("scroll", checarProximidadeSentinela, { passive: true });

  // Se o usuário redimensionar a janela mudando a quantidade de colunas,
  // redistribui apenas as imagens já carregadas preservando 100% da ordem
  window.addEventListener("resize", () => {
    const qtdDesejada = obterNumeroColunas();
    if (qtdDesejada !== colunas.length) {
      const todasImagens = Array.from(galeria.querySelectorAll("img")).sort((a, b) => {
        return Number(a.dataset.index) - Number(b.dataset.index);
      });
      criarColunas(qtdDesejada);
      todasImagens.forEach((img, i) => {
        colunas[i % colunas.length].appendChild(img);
      });
    }
  });

  // Carrega o primeiro lote imediatamente
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
