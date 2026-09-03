// ============================================
// 🎮 GAME CONTROLLER - Switch between games
// ============================================
const gameBtns = document.querySelectorAll('.game-btn');
const gameContainers = document.querySelectorAll('.game-container');

gameBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    gameBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // Show selected game
    const gameId = btn.dataset.game;
    gameContainers.forEach(g => g.classList.remove('active'));
    document.getElementById(gameId).classList.add('active');

    // Reset memory if switching away
    if (gameId !== 'memory' && memoryInterval) {
      clearInterval(memoryInterval);
    }
  });
});
// ============================================
// 🐍 SNAKE GAME
// ============================================
const snakeCanvas = document.getElementById('snakeCanvas');
const ctx = snakeCanvas.getContext('2d');
const snakeScore = document.getElementById('snakeScore');
const snakeHighScore = document.getElementById('snakeHighScore');

let snake = [];
let snakeDirection = 'right';
let snakeFood = {};
let snakeGameRunning = false;
let snakeGameLoop = null;
let snakeSpeed = 150;
let highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
snakeHighScore.textContent = highScore;
function initSnake() {
  snake = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 }
  ];
  snakeDirection = 'right';
  spawnFood();
  snakeScore.textContent = 0;
}
function spawnFood() {
  const cols = 20;
  const size = 20;
  let newFood;
  let isOnSnake;
  do {
    newFood = {
      x: Math.floor(Math.random() * cols) * size,
      y: Math.floor(Math.random() * cols) * size
    };
    isOnSnake = snake.some(segment =>
      segment.x === newFood.x && segment.y === newFood.y
    );
  } while (isOnSnake);
  snakeFood = newFood;
}
function drawSnake() {
  ctx.clearRect(0, 0, 400, 400);

  // Draw grid
  ctx.strokeStyle = '#2a2a4a';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= 20; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 20, 0);
    ctx.lineTo(i * 20, 400);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * 20);
    ctx.lineTo(400, i * 20);
    ctx.stroke();
  }
  // Draw food
  ctx.fillStyle = '#ff6b6b';
  ctx.shadowColor = '#ff6b6b';
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.arc(snakeFood.x + 10, snakeFood.y + 10, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  // Draw snake
  snake.forEach((segment, index) => {
    const gradient = ctx.createRadialGradient(
      segment.x + 5, segment.y + 5, 2,
      segment.x + 10, segment.y + 10, 12
    );
    if (index === 0) {
      gradient.addColorStop(0, '#4caf50');
      gradient.addColorStop(1, '#2e7d32');
    } else {
      gradient.addColorStop(0, '#66bb6a');
      gradient.addColorStop(1, '#388e3c');
    }
    ctx.fillStyle = gradient;
    ctx.shadowColor = '#4caf50';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(segment.x + 1, segment.y + 1, 18, 18, 5);
    ctx.fill();
    ctx.shadowBlur = 0;
  });
  // Draw eyes on head
  const head = snake[0];
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(head.x + 6, head.y + 6, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(head.x + 14, head.y + 6, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath();
  ctx.arc(head.x + 7, head.y + 5, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(head.x + 15, head.y + 5, 1.5, 0, Math.PI * 2);
  ctx.fill();
}
// roundRect polyfill for canvas
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (r > w / 2) r = w / 2;
    if (r > h / 2) r = h / 2;
    this.moveTo(x + r, y);
    this.lineTo(x + w - r, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r);
    this.lineTo(x + w, y + h - r);
    this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    this.lineTo(x + r, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r);
    this.lineTo(x, y + r);
    this.quadraticCurveTo(x, y, x + r, y);
    return this;
  };
}
function moveSnake() {
  const head = { ...snake[0] };

  switch (snakeDirection) {
    case 'right': head.x += 20; break;
    case 'left': head.x -= 20; break;
    case 'up': head.y -= 20; break;
    case 'down': head.y += 20; break;
  }
  // Check wall collision
  if (head.x < 0 || head.x >= 400 || head.y < 0 || head.y >= 400) {
    gameOver();
    return;
  }
  // Check self collision
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    gameOver();
    return;
  }

  snake.unshift(head);
  // Check food
  if (head.x === snakeFood.x && head.y === snakeFood.y) {
    snakeScore.textContent = parseInt(snakeScore.textContent) + 1;
    spawnFood();
  } else {
    snake.pop();
  }

  drawSnake();
}

function gameOver() {
  if (snakeGameLoop) {
    clearInterval(snakeGameLoop);
    snakeGameLoop = null;
  }
  snakeGameRunning = false;

  const score = parseInt(snakeScore.textContent);
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('snakeHighScore', highScore);
    snakeHighScore.textContent = highScore;
  }
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, 400, 400);
  ctx.fillStyle = 'white';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('💀 Game Over', 200, 180);
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 200, 230);
  ctx.fillText('Click "New Game" to restart', 200, 280);
}
function startSnake() {
  if (snakeGameLoop) {
    clearInterval(snakeGameLoop);
    snakeGameLoop = null;
  }
  initSnake();
  snakeGameRunning = true;
  drawSnake();
  snakeGameLoop = setInterval(moveSnake, snakeSpeed);
}
// Snake controls
document.getElementById('snakeStartBtn').addEventListener('click', startSnake);

document.querySelectorAll('.arrow').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!snakeGameRunning) return;
    const dir = btn.dataset.dir;
    const opposites = { up: 'down', down: 'up', left: 'right', right: 'left' };
    if (dir !== opposites[snakeDirection]) {
      snakeDirection = dir;
    }
  });
});

// Keyboard controls for snake
document.addEventListener('keydown', (e) => {
  if (!snakeGameRunning) return;
  const keyMap = {
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'ArrowLeft': 'left',
    'ArrowRight': 'right'
  };
  const dir = keyMap[e.key];
  if (dir) {
    e.preventDefault();
    const opposites = { up: 'down', down: 'up', left: 'right', right: 'left' };
    if (dir !== opposites[snakeDirection]) {
      snakeDirection = dir;
    }
  }
});
// ============================================
// ❌ TIC-TAC-TOE
// ============================================
let ticBoard = Array(9).fill(null);
let ticCurrentPlayer = 'X';
let ticGameActive = true;
let ticScores = { X: 0, O: 0, draw: 0 };

const ticBoardEl = document.getElementById('ticBoard');
const ticStatus = document.getElementById('ticStatus');
const ticX = document.getElementById('ticX');
const ticO = document.getElementById('ticO');
const ticDraw = document.getElementById('ticDraw');
function renderTicBoard() {
  ticBoardEl.innerHTML = '';
  ticBoard.forEach((cell, index) => {
    const div = document.createElement('div');
    div.className = 'tic-cell';
    div.textContent = cell || '';
    div.dataset.index = index;
    div.addEventListener('click', () => handleTicClick(index));
    ticBoardEl.appendChild(div);
  });
}
function handleTicClick(index) {
  if (!ticGameActive || ticBoard[index]) return;

  ticBoard[index] = ticCurrentPlayer;
  renderTicBoard();

  const winner = checkTicWinner();
  if (winner) {
    ticGameActive = false;
    ticScores[winner]++;
    updateTicScores();
    ticStatus.textContent = `🎉 Player ${winner} wins!`;
    highlightTicWinner(winner);
    return;
  }
  if (ticBoard.every(cell => cell !== null)) {
    ticGameActive = false;
    ticScores.draw++;
    updateTicScores();
    ticStatus.textContent = "🤝 It's a draw!";
    return;
  }

  ticCurrentPlayer = ticCurrentPlayer === 'X' ? 'O' : 'X';
  ticStatus.textContent = `Player ${ticCurrentPlayer}'s turn`;
}
function checkTicWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (ticBoard[a] && ticBoard[a] === ticBoard[b] && ticBoard[a] === ticBoard[c]) {
      return ticBoard[a];
    }
  }
  return null;
}
