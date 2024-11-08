// uiController.js
export function setupEventListeners(startGame, restartGame, pauseGame) {
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('restart-btn').addEventListener('click', restartGame);
    document.getElementById('pause-btn').addEventListener('click', pauseGame);
}

export function toggleVisibility(elementId, visible) {
    const element = document.getElementById(elementId);
    element.style.display = visible ? 'block' : 'none';
}

export function updateUI(score, level) {
    document.getElementById('score').innerText = `Skor: ${score}`;
    document.getElementById('level').innerText = `Seviye: ${level}`;
}
