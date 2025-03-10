const board = document.getElementById('board');
const boardMatrix = Array.from({ length: 4 }, () => Array(4).fill(0));
let moveHistory = [];

function renderBoard() {
    board.innerHTML = '';
    
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            const value = boardMatrix[y][x];
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.setAttribute('data-x', x);
            tile.setAttribute('data-y', y);
            
            if (value !== 0) {
                tile.textContent = value;
                tile.setAttribute('data-value', value);
            }
            
            board.appendChild(tile);
        }
    }
}

function addNewTile() {
    const emptyCells = [];
    
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (boardMatrix[y][x] === 0) {
                emptyCells.push({ x, y });
            }
        }
    }
    
    if (emptyCells.length > 0) {
        const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        boardMatrix[y][x] = Math.random() < 0.9 ? 2 : 4;
        
        const tile = board.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        if (tile) {
            tile.classList.add('new-tile');
        }
    }
}

function saveMove() {
    moveHistory.push({
        board: JSON.stringify(boardMatrix),
        score: score
    });
    if (moveHistory.length > 10) moveHistory.shift();
}

function undoMove() {
    if (moveHistory.length > 0) {
        const lastMove = moveHistory.pop();
        const lastBoard = JSON.parse(lastMove.board);
        
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                boardMatrix[y][x] = lastBoard[y][x];
            }
        }
        
        score = lastMove.score;
        document.getElementById('score').querySelector('span').textContent = score;
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
    return true;
}

function showGameOver() {
    const overlay = document.createElement('div');
    overlay.className = 'game-over-overlay';
    overlay.innerHTML = `
        <div class="game-over-message">
            <h2>Game Over!</h2>
            <p>Score: ${score}</p>
            <button onclick="startGame()">Play Again</button>
        </div>
    `;
    document.body.appendChild(overlay);
}