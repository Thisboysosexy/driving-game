const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load images
const playerImg = new Image();
playerImg.src = "images/bara.png";

const girlImg = new Image();
girlImg.src = "images/demi.png";

const npcImg = new Image();
npcImg.src = "images/npc.png";

// Load kiss voice line
const kissAudio = new Audio("audio/kiss.mp3");

// Game objects
let player = {
  x: 50,
  y: 300,
  width: 40,
  height: 60,
  dy: 0,
  jumping: false,
  ducking: false,
};

let gravity = 1;           // slower fall
let jumpStrength = -15;    // lower jump
let scrollSpeed = 1.5;     // slower side scroll
let isGameOver = false;
let gameWon = false;

// Generate obstacles before and after the NPC
let obstacles = [];
for (let i = 1; i <= 4; i++) {
  obstacles.push({ x: 150 * i + 150, y: 300, width: 40, height: 60 });
}

// NPC obstacle
obstacles.push({ x: 900, y: 300, width: 40, height: 60, type: "npc" });

// Add 4 more obstacles after NPC
for (let i = 1; i <= 4; i++) {
  obstacles.push({ x: 1000 + 150 * i, y: 300, width: 40, height: 60 });
}

// Goal: Demilade
let goal = { x: 1700, y: 300, width: 40, height: 60 };

// Draw functions
function drawPlayer() {
  if (player.ducking) {
    ctx.drawImage(playerImg, player.x, player.y + 20, player.width, player.height - 20);
  } else {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  }
}

function drawObstacles() {
  obstacles.forEach(ob => {
    ctx.drawImage(npcImg, ob.x, ob.y, ob.width, ob.height);
  });
}

function drawGoal() {
  ctx.drawImage(girlImg, goal.x, goal.y, goal.width, goal.height);
}

// Update game state
function update() {
  if (!isGameOver) {
    player.y += player.dy;
    player.dy += gravity;

    if (player.y >= 300) {
      player.y = 300;
      player.dy = 0;
      player.jumping = false;
    }

    // Move obstacles and goal
    obstacles.forEach(ob => ob.x -= scrollSpeed);
    goal.x -= scrollSpeed;

    // Collision with NPC
    obstacles.forEach(ob => {
      if (
        player.x < ob.x + ob.width &&
        player.x + player.width > ob.x &&
        player.y < ob.y + ob.height &&
        player.y + player.height > ob.y
      ) {
        if (ob.type === "npc" && !player.ducking) {
          isGameOver = true;
          alert("You hit the wrong girl 😆 Try again!");
          restartGame();
        }
      }
    });

    // Reached Demilade
    if (
      player.x < goal.x + goal.width &&
      player.x + player.width > goal.x &&
      player.y < goal.y + goal.height &&
      player.y + player.height > goal.y
    ) {
      isGameOver = true;
      gameWon = true;
      kissAudio.play();
      document.getElementById("message").classList.remove("hidden");
    }
  }
}

// Draw everything
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawObstacles();
  drawGoal();
}

// Main game loop
function gameLoop() {
  update();
  draw();
  if (!isGameOver) {
    requestAnimationFrame(gameLoop);
  }
}

// Controls
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !player.jumping) {
    player.dy = jumpStrength;
    player.jumping = true;
  } else if (e.code === "ArrowDown") {
    player.ducking = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowDown") {
    player.ducking = false;
  }
});

// Restart
function restartGame() {
  player = {
    x: 50,
    y: 300,
    width: 40,
    height: 60,
    dy: 0,
    jumping: false,
    ducking: false,
  };

  // Reset obstacles
  obstacles = [];
  for (let i = 1; i <= 4; i++) {
    obstacles.push({ x: 150 * i + 150, y: 300, width: 40, height: 60 });
  }

  obstacles.push({ x: 900, y: 300, width: 40, height: 60, type: "npc" });

  for (let i = 1; i <= 4; i++) {
    obstacles.push({ x: 1000 + 150 * i, y: 300, width: 40, height: 60 });
  }

  goal = { x: 1700, y: 300, width: 40, height: 60 };

  isGameOver = false;
  gameWon = false;
  document.getElementById("message").classList.add("hidden");
  gameLoop();
}

window.onload = () => {
  gameLoop();
};

