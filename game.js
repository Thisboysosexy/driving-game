const gameArea = document.getElementById("gameArea");
const playerCar = document.getElementById("playerCar");
const scoreDisplay = document.getElementById("score");
const gameOverScreen = document.getElementById("gameOver");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

let playerX = 175;
let gameSpeed = 5;
let score = 0;
let gameRunning = true;

function movePlayer(direction) {
  if (!gameRunning) return;

  if (direction === "left" && playerX > 0) {
    playerX -= 10;
  } else if (direction === "right" && playerX < 350) {
    playerX += 10;
  }
  playerCar.style.left = playerX + "px";
}

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") movePlayer("left");
  else if (e.key === "ArrowRight") movePlayer("right");
});

// Touch controls
leftBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  movePlayer("left");
});
rightBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  movePlayer("right");
});

function createObstacle() {
  if (!gameRunning) return;

  const obs = document.createElement("div");
  obs.classList.add("obstacle");
  obs.style.left = Math.floor(Math.random() * 350) + "px";
  obs.style.top = "0px";
  gameArea.appendChild(obs);
}

function createRoadLine() {
  const line = document.createElement("div");
  line.classList.add("road-line");
  line.style.top = "0px";
  gameArea.appendChild(line);
}

function moveElements() {
  if (!gameRunning) return;

  // Obstacles
  const obstacles = document.querySelectorAll(".obstacle");
  obstacles.forEach(obs => {
    let top = parseInt(obs.style.top);
    if (top > 600) {
      obs.remove();
    } else {
      obs.style.top = top + gameSpeed + "px";

      // Collision check
      if (
        top + 100 > 500 &&
        top < 600 &&
        parseInt(obs.style.left) < playerX + 50 &&
        parseInt(obs.style.left) + 50 > playerX
      ) {
        endGame();
      }
    }
  });

  // Road lines
  const lines = document.querySelectorAll(".road-line");
  lines.forEach(line => {
    let top = parseInt(line.style.top);
    if (top > 600) {
      line.remove();
    } else {
      line.style.top = top + gameSpeed + "px";
    }
  });
}

function updateScore() {
  if (!gameRunning) return;
  score += 1;
  scoreDisplay.textContent = "Score: " + score;

  if (score % 100 === 0) {
    gameSpeed += 0.5;
  }
}

function endGame() {
  gameRunning = false;
  gameOverScreen.style.display = "flex";
}

function restartGame() {
  location.reload();
}

// Game loop
setInterval(createObstacle, 1200);
setInterval(createRoadLine, 300);
setInterval(() => {
  moveElements();
  updateScore();
}, 30);