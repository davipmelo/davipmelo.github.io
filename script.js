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
  "Take the good with the bad.",
  "Same again?",
  "Honestly, nevermind.",
  "Good for health, bad for education!",
  "Blink and you'll miss it.",
  "Creation over consumption.",
  "When you have the chance, take it. Laugh, sing, dance. Don't allow the night to end...",
  "...But when the time comes, let go. Nothing lasts forever.",
  "Mamba mentality.",
  "Every time i get closer to the answer, the question changes.",
  "From the underground to the underground, since 2017 'til god knows when."
];

function carregarFraseHeader() {
  const fraseHeader = document.getElementById("frase-header");

  if (!fraseHeader) {
    return;
  }

  const indiceAleatorio = Math.floor(Math.random() * frases.length);

  fraseHeader.textContent = `"${frases[indiceAleatorio]}"`;
}

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
