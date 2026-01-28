const TOTAL_CATS = 10;
const cards = [];     
const likedCats = [];   
let currentIndex = 0;

const container = document.getElementById("card-container");
const progress = document.getElementById("progress");
const likeBtn = document.getElementById("like");
const dislikeBtn = document.getElementById("dislike");

// ----------------- PRELOAD IMAGES -----------------
for (let i = 0; i < TOTAL_CATS; i++) {
  const img = new Image();
  img.src = `https://cataas.com/cat?width=400&height=400&type=square&${i}`;
  cards.push(img);
}

// ----------------- CREATE CARDS -----------------
cards.forEach((imgObj, index) => {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.index = index;

  const likeLabel = document.createElement("div");
  likeLabel.className = "swipe-label swipe-like";
  likeLabel.textContent = "LIKE";

  const nopeLabel = document.createElement("div");
  nopeLabel.className = "swipe-label swipe-nope";
  nopeLabel.textContent = "DISLIKE";

  card.appendChild(likeLabel);
  card.appendChild(nopeLabel);
  card.appendChild(imgObj.cloneNode());

  container.appendChild(card);
  addSwipe(card);
});

// ----------------- SWIPE FUNCTION -----------------
function addSwipe(card) {
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

    if (diff > 120) swipeRight(card);
    else if (diff < -120) swipeLeft(card);
    else card.style.transform = "";
  });

  card.addEventListener("pointercancel", () => {
    isDragging = false;
    card.style.transform = "";
    likeLabel.style.opacity = 0;
    nopeLabel.style.opacity = 0;
  });
}

// ----------------- SWIPE ACTIONS -----------------
function swipeRight(card) {
  const index = card.dataset.index;
  likedCats.push(cards[index]);
  card.style.transform = "translateX(1000px)";
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

// ----------------- PROGRESS -----------------
function updateProgress() {
  progress.textContent = `${Math.min(currentIndex + 1, TOTAL_CATS)} / ${TOTAL_CATS}`;
}

// ----------------- BUTTONS -----------------
likeBtn.onclick = () => {
  const card = container.lastElementChild;
  if (card) swipeRight(card);
};

dislikeBtn.onclick = () => {
  const card = container.lastElementChild;
  if (card) swipeLeft(card);
};

// ----------------- SHOW SUMMARY -----------------
function showSummary() {
  document.querySelector(".app").classList.add("hidden");
  const summary = document.getElementById("summary");
  summary.classList.remove("hidden");
  document.getElementById("like-count").textContent = likedCats.length;

  const likedContainer = document.getElementById("liked-cats");
  likedContainer.innerHTML = "";

  likedCats.forEach((imgObj) => {
    const img = imgObj.cloneNode();
    img.style.cursor = "pointer";

    // Click to open large view
    img.onclick = () => {
      const modal = document.createElement("div");
      modal.style.position = "fixed";
      modal.style.top = "0";
      modal.style.left = "0";
      modal.style.width = "100%";
      modal.style.height = "100%";
      modal.style.backgroundColor = "rgba(0,0,0,0.8)";
      modal.style.display = "flex";
      modal.style.alignItems = "center";
      modal.style.justifyContent = "center";
      modal.style.cursor = "pointer";
      modal.onclick = () => modal.remove();

      const largeImg = imgObj.cloneNode();
      largeImg.style.maxWidth = "90%";
      largeImg.style.maxHeight = "90%";
      largeImg.style.borderRadius = "12px";
      modal.appendChild(largeImg);

      document.body.appendChild(modal);
    };

    likedContainer.appendChild(img);
  });
}