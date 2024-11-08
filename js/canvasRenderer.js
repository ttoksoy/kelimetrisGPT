// canvasRenderer.js
export const canvas = document.getElementById('game-board');
export const ctx = canvas.getContext('2d');

export function drawBoard(board, currentLetter, currentX, currentY, CELL_SIZE, letterScores, currentTheme) {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    board.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell) {
                const pixelX = x * CELL_SIZE;
                const pixelY = y * CELL_SIZE;
                drawCell(pixelX, pixelY, cell, CELL_SIZE, currentTheme, letterScores);
            }
        });
    });

    if (currentLetter) {
        const pixelX = currentX * CELL_SIZE;
        const pixelY = currentY * CELL_SIZE;
        drawCell(pixelX, pixelY, currentLetter, CELL_SIZE, currentTheme, letterScores);
    }
}

function drawCell(x, y, letter, CELL_SIZE, theme, letterScores) {
    const gradient = ctx.createLinearGradient(x, y, x + CELL_SIZE, y + CELL_SIZE);
    gradient.addColorStop(0, theme.light);
    gradient.addColorStop(1, theme.dark);
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
    ctx.strokeStyle = theme.border;
    ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);

    ctx.font = `bold ${CELL_SIZE / 1.5}px Arial`;
    ctx.fillStyle = '#fff';
    ctx.fillText(letter, x + CELL_SIZE / 4, y + CELL_SIZE / 1.5);
    ctx.font = `bold ${CELL_SIZE / 3.5}px Arial`;
    ctx.fillText(letterScores[letter], x + CELL_SIZE - 10, y + CELL_SIZE - 5);
}

export function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
