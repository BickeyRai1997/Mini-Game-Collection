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