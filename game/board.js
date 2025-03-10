const board = document.getElementById('board');
const boardMatrix = Array.from({ length: 4 }, () => Array(4).fill(0));
let moveHistory = [];

function renderBoard() {
    board.innerHTML = '';
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            const cellValue = boardMatrix[y][x];
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.setAttribute('data-x', x); 
            tile.setAttribute('data-y', y);
            if (cellValue !== 0) {
                tile.textContent = cellValue;
                tile.setAttribute('data-value', cellValue);
            }
            board.appendChild(tile);
        }
    }
}


function addNewTile() {
    const emptyCells = [];
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (boardMatrix[y][x] === 0) emptyCells.push({ x, y });
        }
    }
    if (emptyCells.length > 0) {
        const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        boardMatrix[y][x] = Math.random() < 0.9 ? 2 : 4;
        const tile = board.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        if (tile) {
            tile.classList.add('new-tile'); 
            tile.addEventListener('animationend', () => {
                tile.classList.remove('new-tile'); 
            }, { once: true });
        }
    }
}


function saveMove() {
    moveHistory.push(JSON.stringify(boardMatrix));
    if (moveHistory.length > 10) moveHistory.shift();
}

function undoMove() {
    if (moveHistory.length > 0) {
        const lastMove = JSON.parse(moveHistory.pop());
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                boardMatrix[y][x] = lastMove[y][x];
            }
        }
        removeGameOverMessage(); 
        renderBoard();
    }
}

function checkGameOver() {
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (boardMatrix[y][x] === 0) return false;
            if (x < 3 && boardMatrix[y][x] === boardMatrix[y][x + 1]) return false;
            if (y < 3 && boardMatrix[y][x] === boardMatrix[y + 1][x]) return false;
        }
    }
    if (!document.querySelector('.game-over-message')) {
        const message = document.createElement('div');
        message.textContent = 'Game Over!';
        message.className = 'game-over-message';
        board.parentElement.appendChild(message);
        message.addEventListener('animationend', () => {
            message.remove(); 
        }, { once: true });
    }
    return true;
}
