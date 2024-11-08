// gameLogic.js
let score = 0;
let board = [];
let wordList = new Set();

export function initializeBoard(rows, columns) {
    board = Array.from({ length: rows }, () => Array(columns).fill(''));
}

export function spawnLetter(columns) {
    return {
        x: Math.floor(columns / 2),
        y: 0,
        letter: getRandomLetter(),
    };
}

export function moveLetterDown(letter, rows, columns) {
    if (letter.y + 1 < rows && !board[letter.y + 1][letter.x]) {
        letter.y++;
    } else {
        board[letter.y][letter.x] = letter.letter;
        return false;
    }
    return true;
}

export function checkGameOver() {
    return board[0].some(cell => cell !== '');
}

export function updateScore(newScore, scoreDisplay) {
    score = newScore;
    scoreDisplay.innerText = `Skor: ${score}`;
}

function getRandomLetter() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[Math.floor(Math.random() * letters.length)];
}

export function addScore(word, letterScores) {
    let wordScore = 0;
    for (let letter of word) {
        wordScore += letterScores[letter] || 0;
    }
    score += wordScore;
    return wordScore;
}

export function checkForWords(wordList) {
    // Burada bulunan kelimeleri kontrol eder ve varsa skor ekler.
}
