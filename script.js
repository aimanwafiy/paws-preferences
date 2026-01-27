const TOTAL_CATS = 10;
const cards = [];
const likedCats = [];
let currentIndex = 0;

const container = document.getElementById("card-container");
const progress = document.getElementById("progress");
const likeBtn = document.getElementById("like");
const dislikeBtn = document.getElementById("dislike");

// Function to get a preload image
function preloadImages(urls) {
  urls.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

for (let i = 0; i < TOTAL_CATS; i++) {
  cards.push(`https://cataas.com/cat?width=400&height=400&type=square&${i}`);
}
// Call back the preload images to make it load faster
preloadImages(cards);

// Create cards with images and add swipe functionality
cards.reverse().forEach((src) => {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = src;
  img.loading = "lazy";

  card.appendChild(img);
  container.appendChild(card);

  addSwipe(card, src);
});

function addSwipe(card, imgSrc) {
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  card.addEventListener("pointerdown", (e) => {
    startX = e.clientX;
    isDragging = true;
    card.setPointerCapture(e.pointerId);
  });

  card.addEventListener("pointermove", (e) => {
    if (!isDragging) return;

    currentX = e.clientX;
    const diff = currentX - startX;

    card.style.transform = `translateX(${diff}px) rotate(${diff / 15}deg)`;
  });

  card.addEventListener("pointerup", () => {
    if (!isDragging) return;

    isDragging = false;
    const diff = currentX - startX;

    if (diff > 120) {
      swipeRight(card, imgSrc);
    } else if (diff < -120) {
      swipeLeft(card);
    } else {
      card.style.transform = "";
    }
  });

  card.addEventListener("pointercancel", () => {
    isDragging = false;
    card.style.transform = "";
  });
}

function swipeRight(card, imgSrc) {
  card.style.transform = "translateX(1000px)";
  likedCats.push(imgSrc);
  nextCard(card);
}

function swipeLeft(card) {
  card.style.transform = "translateX(-1000px)";
  nextCard(card);
}

function nextCard(card) {
  setTimeout(() => {
    card.remove();
    currentIndex++;
    updateProgress();
    if (currentIndex === TOTAL_CATS) showSummary();
  }, 300);
}

// Called out progress value e.g. 1/10
function updateProgress() {
  progress.textContent = `${Math.min(
    currentIndex + 1,
    TOTAL_CATS
  )} / ${TOTAL_CATS}`;
}

likeBtn.onclick = () => {
  const card = document.querySelector(".card:last-child");
  if (card) swipeRight(card, card.querySelector("img").src);
};

dislikeBtn.onclick = () => {
  const card = document.querySelector(".card:last-child");
  if (card) swipeLeft(card);
};

// Show summary of liked cats with their count at the end of swiping
function showSummary() {
  document.querySelector(".app").classList.add("hidden");
  document.getElementById("summary").classList.remove("hidden");
  document.getElementById("like-count").textContent = likedCats.length;

  const likedContainer = document.getElementById("liked-cats");
  likedCats.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    likedContainer.appendChild(img);
  });
}
