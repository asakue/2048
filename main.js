const resetButton = document.getElementById('reset');
const undoButton = document.getElementById('undo');
const themeToggle = document.getElementById('theme-toggle');

function startGame() {
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            boardMatrix[y][x] = 0;
        }
    }
    resetScore();
    removeGameOverMessage();
    addNewTile();
    addNewTile();
    renderBoard();
}

function removeGameOverMessage() {
    const message = document.querySelector('.game-over-message');
    if (message) message.remove();
}

function handleKeyPress(event) {
    switch (event.key) {
        case 'ArrowLeft': moveLeft(); break;
        case 'ArrowRight': moveRight(); break;
        case 'ArrowUp': moveUp(); break;
        case 'ArrowDown': moveDown(); break;
    }
}

let startX = 0, startY = 0;

function handleMouseStart(event) {
    startX = event.clientX;
    startY = event.clientY;
}

function handleMouseEnd(event) {
    const endX = event.clientX;
    const endY = event.clientY;
    handleSwipe(startX, startY, endX, endY);
}

function handleSwipe(startX, startY, endX, endY) {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (Math.max(absDeltaX, absDeltaY) < 30) return;

    if (absDeltaX > absDeltaY) {
        if (deltaX > 0) moveRight();
        else moveLeft();
    } else {
        if (deltaY > 0) moveDown();
        else moveUp();
    }
}

resetButton.addEventListener('click', startGame);
undoButton.addEventListener('click', undoMove);
themeToggle.addEventListener('click', () => document.body.classList.toggle('dark-theme'));
document.addEventListener('keydown', handleKeyPress);
document.addEventListener('mousedown', handleMouseStart);
document.addEventListener('mouseup', handleMouseEnd);

startGame();
