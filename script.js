const TOTAL_CATS = 10;
const cards = [];
const likedCats = [];
let currentIndex = 0;

// ----------------- CARD FUNCTION START -----------------
const container = document.getElementById("card-container");
const progress = document.getElementById("progress");
const likeBtn = document.getElementById("like");
const dislikeBtn = document.getElementById("dislike");

// Preload images
function preloadImages(urls) {
  urls.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

// Generate cat image URLs from Cataas API
for (let i = 0; i < TOTAL_CATS; i++) {
  cards.push(`https://cataas.com/cat?width=400&height=400&type=square&${i}`);
}
preloadImages(cards);

// Create cards in normal order
cards.forEach((src) => {
  const card = document.createElement("div");
  card.className = "card";

  const likeLabel = document.createElement("div");
  likeLabel.className = "swipe-label swipe-like";
  likeLabel.textContent = "LIKE";

  const nopeLabel = document.createElement("div");
  nopeLabel.className = "swipe-label swipe-nope";
  nopeLabel.textContent = "DISLIKE";

  const img = document.createElement("img");
  img.src = src;
  img.loading = "lazy";

  card.appendChild(likeLabel);
  card.appendChild(nopeLabel);
  card.appendChild(img);

  container.appendChild(card);
  addSwipe(card, src);  // Pass the exact image URL function
});

// ----------------- SWIPE FUNCTION -----------------
function addSwipe(card, imgSrc) {
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  const likeLabel = card.querySelector(".swipe-like");
  const nopeLabel = card.querySelector(".swipe-nope");

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

    if (diff > 0) {
      likeLabel.style.opacity = Math.min(diff / 100, 1);
      nopeLabel.style.opacity = 0;
    } else {
      nopeLabel.style.opacity = Math.min(Math.abs(diff) / 100, 1);
      likeLabel.style.opacity = 0;
    }
  });

  card.addEventListener("pointerup", () => {
    if (!isDragging) return;

    isDragging = false;
    const diff = currentX - startX;

    likeLabel.style.opacity = 0;
    nopeLabel.style.opacity = 0;

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
    likeLabel.style.opacity = 0;
    nopeLabel.style.opacity = 0;
  });
}

// Swipe right → Like
function swipeRight(card, imgSrc) {
  likedCats.push(imgSrc);  // Function to store the exact image after swipe
  card.style.transform = "translateX(1000px)";
  nextCard(card);
}

// Swipe left → Dislike
function swipeLeft(card) {
  card.style.transform = "translateX(-1000px)";
  nextCard(card);
}

// Move to next card
function nextCard(card) {
  setTimeout(() => {
    card.remove();
    currentIndex++;
    updateProgress();
    if (currentIndex === TOTAL_CATS) showSummary();
  }, 300);
}

// ----------------- PROGRESS -----------------
function updateProgress() {
  progress.textContent = `${Math.min(currentIndex + 1, TOTAL_CATS)} / ${TOTAL_CATS}`;
}

// Like / Dislike buttons
likeBtn.onclick = () => {
  const card = container.lastElementChild;
  if (card) swipeRight(card, card.querySelector("img").src);
};

dislikeBtn.onclick = () => {
  const card = container.lastElementChild;
  if (card) swipeLeft(card);
};

// ----------------- SUMMARY -----------------
function showSummary() {
  document.querySelector(".app").classList.add("hidden");
  const summary = document.getElementById("summary");
  summary.classList.remove("hidden");
  document.getElementById("like-count").textContent = likedCats.length;

  const likedContainer = document.getElementById("liked-cats");
  likedContainer.innerHTML = "";

  likedCats.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;

    img.style.cursor = "pointer";
    img.onclick = () => {
      window.open(src, "_blank");
    };

    likedContainer.appendChild(img);
  });
}
