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