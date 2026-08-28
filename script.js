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