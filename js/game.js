// game.js
import { canvas, drawBoard, clearCanvas } from './canvasRenderer.js';
import { initializeBoard, spawnLetter, moveLetterDown, checkGameOver, updateScore, addScore } from './gameLogic.js';
import { loadWords, isWordValid } from './dataManager.js';
import { setupEventListeners, toggleVisibility } from './uiController.js';
import { setupInputControls, setupTouchControls } from './inputController.js';

const rows = 16;
const columns = 8;
const CELL_SIZE = 37;
const scoreDisplay = document.getElementById('score');
let board = [];
let currentLetter = null;
let gameInterval;
let isPaused = false;

function startGame() {
    loadWords(() => {
        initializeBoard(rows, columns);
        currentLetter = spawnLetter(columns);
        gameInterval = setInterval(gameLoop, 500);
        toggleVisibility('start-btn', false);
    });
}

function restartGame() {
    clearInterval(gameInterval);
    initializeBoard(rows, columns);
    updateScore(0, scoreDisplay);
    currentLetter = spawnLetter(columns);
    gameInterval = setInterval(gameLoop, 500);
}

function pauseGame() {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(gameInterval);
    } else {
        gameInterval = setInterval(gameLoop, 500);
    }
}

function gameLoop() {
    if (isPaused) return;

    if (checkGameOver()) {
        clearInterval(gameInterval);
        alert("Game Over!");
        toggleVisibility('restart-btn', true);
        return;
    }

    if (!moveLetterDown(currentLetter, rows, columns)) {
        currentLetter = spawnLetter(columns);
    }

    clearCanvas();
    drawBoard(board, currentLetter.letter, currentLetter.x, currentLetter.y, CELL_SIZE, letterScores, currentTheme);
}

// Kullanıcı arayüzü ve kontrol işlevlerini başlat
setupEventListeners(startGame, restartGame, pauseGame);
setupInputControls(() => { currentLetter.x--; }, () => { currentLetter.x++; }, () => { currentLetter.y++; });
setupTouchControls(canvas, handleGesture);
