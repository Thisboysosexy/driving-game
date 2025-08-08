const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

// Load images
const playerImg = new Image();
playerImg.src = "bara.png";

const girlfriendImg = new Image();
girlfriendImg.src = "demi.png";

const npcImg = new Image();
npcImg.src = "npc.png";

// Load audio
const kissAudio = new Audio("kiss.mp3");
const bgMusic = new Audio("bg-music.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.3;
bgMusic.play();

// Game variables
let player = {
  x: 50,
  y: canvas.height - 70,
  width: 40,
  height: 40,
  vy: 0,
  jumpForce: -10,
  grounded: true,
  ducking: false
};

let gravity = 0.5;
let speed = 2.5;
let gameRunning = true;
let obstacles = [];
let obstacleCount = 21;
let currentObstacle = 0;
let frame = 0;
let birdX = 0;
let startDate = new Date("2025-06-16T00:00:00");
let hearts = [];
let endingPlayed = false;

function drawPixelEnvironment() {
  // Grass
  ctx.fillStyle = "green";
  ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

  // Sun
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(700, 60, 20, 0, 2 * Math.PI);
  ctx.fill();

  // Rainbow
  let colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
  colors.forEach((c, i) => {
    ctx.strokeStyle = c;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(150, 200, 60 + i * 5, Math.PI, 2 * Math.PI);
    ctx.stroke();
  });

  // Clouds
  ctx.fillStyle = "white";
  for (let i = 0; i < canvas.width; i += 100) {
    ctx.beginPath();
    ctx.arc(i + 20, 40, 15, 0, 2 * Math.PI);
    ctx.arc(i + 35, 40, 20, 0, 2 * Math.PI);
    ctx.arc(i + 50, 40, 15, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Bird
  ctx.fillStyle = "black";
  birdX += 1;
  if (birdX > canvas.width) birdX = -30;
  ctx.beginPath();
  ctx.moveTo(birdX, 90);
  ctx.lineTo(birdX + 10, 85);
  ctx.lineTo(birdX + 20, 90);
  ctx.stroke();
}

function createObstacle() {
  if (currentObstacle >= obstacleCount) return;

  let isNPC = currentObstacle === 10;
  let width = isNPC ? 50 : 20 + Math.floor(Math.random() * 30);
  let height = isNPC ? 60 : 20 + Math.floor(Math.random() * 30);
  let type = isNPC ? "npc" : "jump";

  obstacles.push({
    x: canvas.width,
    y: canvas.height - height - 20,
    width,
    height,
    type
  });

  currentObstacle++;
}

function updatePlayer() {
  player.vy += gravity;
  player.y += player.vy;

  if (player.y > canvas.height - player.height - 20) {
    player.y = canvas.height - player.height - 20;
    player.vy = 0;
    player.grounded = true;
  }

  player.height = player.ducking ? 25 : 40;
}

function checkCollision(ob) {
  return (
    player.x < ob.x + ob.width &&
    player.x + player.width > ob.x &&
    player.y < ob.y + ob.height &&
    player.y + player.height > ob.y
  );
}

function updateObstacles() {
  obstacles.forEach(ob => ob.x -= speed);

  if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 200) {
    createObstacle();
  }

  if (obstacles.length > 0 && checkCollision(obstacles[0])) {
    let ob = obstacles[0];
    if (ob.type === "npc" && player.ducking) {
      // ducked under npc = okay
    } else if (ob.type === "jump" && player.y + player.height < ob.y + 10) {
      // jumped over = okay
    } else {
      gameRunning = false;
    }
  }

  if (obstacles.length && obstacles[0].x + obstacles[0].width < 0) {
    obstacles.shift();
  }
}

function updateTimer() {
  let now = new Date();
  let diff = now - startDate;
  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  let hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  let minutes = Math.floor((diff / (1000 * 60)) % 60);
  let seconds = Math.floor((diff / 1000) % 60);
  document.getElementById("timeTogether").textContent =
    `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function drawObstacles() {
  obstacles.forEach(ob => {
    if (ob.type === "npc") {
      ctx.drawImage(npcImg, ob.x, ob.y, ob.width, ob.height);
    } else {
      ctx.fillStyle = "red";
      ctx.fillRect(ob.x, ob.y, ob.width, ob.height);
    }
  });
}

function drawEnding() {
  if (endingPlayed) return;
  endingPlayed = true;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPixelEnvironment();
  ctx.drawImage(playerImg, 300, canvas.height - 100, 50, 50);
  ctx.drawImage(girlfriendImg, 360, canvas.height - 100, 50, 50);
  kissAudio.play();

  document.getElementById("message").style.display = "block";
  document.getElementById("message").innerHTML = `
    💖 Happy 2 Months Anniversary Demilade, I love you 💖<br><br>
    <button onclick="restartGame()">Play Again</button>
  `;

  rainHearts();
}

function rainHearts() {
  for (let i = 0; i < 100; i++) {
    hearts.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      speed: 1 + Math.random() * 3
    });
  }

  function animateHearts() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPixelEnvironment();
    ctx.drawImage(playerImg, 300, canvas.height - 100, 50, 50);
    ctx.drawImage(girlfriendImg, 360, canvas.height - 100, 50, 50);
    hearts.forEach(heart => {
      ctx.font = "20px Arial";
      ctx.fillText("❤️", heart.x, heart.y);
      heart.y += heart.speed;
    });
    if (hearts[0].y < canvas.height) {
      requestAnimationFrame(animateHearts);
    }
  }

  animateHearts();
}

function restartGame() {
  player.y = canvas.height - 70;
  player.vy = 0;
  player.grounded = true;
  player.ducking = false;
  currentObstacle = 0;
  obstacles = [];
  hearts = [];
  speed = 2.5;
  gameRunning = true;
  endingPlayed = false;
  document.getElementById("message").style.display = "none";
  requestAnimationFrame(gameLoop);
}

function gameLoop() {
  if (!gameRunning && currentObstacle >= obstacleCount && obstacles.length === 0) {
    drawEnding();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPixelEnvironment();
  updatePlayer();
  updateObstacles();
  updateTimer();
  drawPlayer();
  drawObstacles();

  frame++;
  if (frame % 150 === 0 && speed < 7) {
    speed += 0.2;
  }

  if (currentObstacle >= obstacleCount && obstacles.length === 0) {
    gameRunning = false;
  }

  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", e => {
  if (e.code === "Space" && player.grounded) {
    player.vy = player.jumpForce;
    player.grounded = false;
  } else if (e.code === "ArrowDown") {
    player.ducking = true;
  }
});

document.addEventListener("keyup", e => {
  if (e.code === "ArrowDown") {
    player.ducking = false;
  }
});

requestAnimationFrame(gameLoop);

