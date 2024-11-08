// inputController.js
export function setupInputControls(moveLeft, moveRight, moveDown) {
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') moveLeft();
        else if (event.key === 'ArrowRight') moveRight();
        else if (event.key === 'ArrowDown') moveDown();
    });
}

export function setupTouchControls(canvas, handleGesture) {
    let touchStartX = 0;
    let touchStartY = 0;

    canvas.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    });

    canvas.addEventListener('touchend', (event) => {
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;
        handleGesture(touchStartX, touchStartY, touchEndX, touchEndY);
    });
}
