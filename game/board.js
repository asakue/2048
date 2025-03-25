// Инициализация игрового поля
const board = document.getElementById('board');
const boardMatrix = Array.from({ length: 4 }, () => Array(4).fill(0));
let moveHistory = [];

// Рендеринг игрового поля
function renderBoard() {
    const fragment = document.createDocumentFragment();

    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            const value = boardMatrix[y][x];
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.dataset.x = x;
            tile.dataset.y = y;

            if (value !== 0) {
                tile.textContent = value;
                tile.dataset.value = value;

                // Анимация для новых плиток
                if (tile.dataset.new === 'true') {
                    tile.classList.add('new-tile');
                    tile.dataset.new = 'false';
                    tile.addEventListener('animationend', () => {
                        tile.classList.remove('new-tile');
                    }, { once: true });
                }
            }
            fragment.appendChild(tile);
        }
    }

    // Очистка и обновление доски
    board.innerHTML = '';
    board.appendChild(fragment);
    
}

// Добавление новой плитки
function addNewTile() {
    const emptyCells = [];

    // Поиск пустых ячеек
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

        // Анимация новой плитки
        const tile = board.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        if (tile) {
            tile.dataset.new = 'true';
        }

        renderBoard();
    }
}

// Сохранение хода
function saveMove() {
    // Сохраняем только последние 5 ходов
    moveHistory.push({
        board: JSON.stringify(boardMatrix),
        score: score
    });
    if (moveHistory.length > 5) moveHistory.shift();
}

// Отмена хода
function undoMove() {
    if (moveHistory.length > 0) {
        const lastMove = moveHistory.pop();
        try {
            const lastBoard = JSON.parse(lastMove.board);

            // Восстановление состояния доски
            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    boardMatrix[y][x] = lastBoard[y][x];
                }
            }

            // Обновление интерфейса
            score = lastMove.score;
            document.getElementById('score').querySelector('span').textContent = score;
            renderBoard();
            
            // Звуковой эффект отмены хода
            playSound('undo');
        } catch (e) {
            console.error('Ошибка восстановления хода:', e);
        }
    } else {
        // Визуальное уведомление о невозможности отмены
        animateButtonError(document.getElementById('undo'));
    }
}

// Анимация ошибки кнопки
function animateButtonError(button) {
    button.classList.add('error-shake');
    setTimeout(() => {
        button.classList.remove('error-shake');
    }, 500);
}

// Проверка завершения игры
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

// Отображение экрана "Игра окончена"
function showGameOver() {
    document.body.classList.add('game-over');
    
    // Воспроизводим звук окончания игры
    if (window.playSound) {
        window.playSound('gameOver');
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'game-over-overlay';

    const message = document.createElement('div');
    message.className = 'game-over-message';

    const button = document.createElement('button');
    button.textContent = 'Играть снова';
    button.addEventListener('click', () => {
        overlay.remove();
        document.body.classList.remove('game-over');
        startGame();
    });

    // Находим максимальную плитку
    let maxTile = 0;
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            maxTile = Math.max(maxTile, boardMatrix[y][x]);
        }
    }

    let gameOverText = '';
    if (maxTile >= 2048) {
        gameOverText = 'Великолепно! Вы достигли 2048!';
    } else if (maxTile >= 1024) {
        gameOverText = 'Отличная игра! Почти достигли 2048!';
    } else if (maxTile >= 512) {
        gameOverText = 'Хорошая попытка! В следующий раз будет лучше!';
    } else {
        gameOverText = 'Игра окончена! Попробуйте ещё раз!';
    }

    message.innerHTML = `
        <h2>Игра окончена!</h2>
        <p>${gameOverText}</p>
        <p>Ваш счет: <strong>${score}</strong></p>
    `;
    message.appendChild(button);
    overlay.appendChild(message);

    document.body.appendChild(overlay);
}



// Инициализация игры
function startGame() {
    // Сброс состояния игры
    for (let y = 0; y < 4; y++) {
        boardMatrix[y].fill(0);
    }

    moveHistory = [];
    resetScore();

    // Удаление оверлея "Игра окончена"
    document.querySelector('.game-over-overlay')?.remove();
    document.body.classList.remove('game-over');

    // Добавление начальных плиток
    addNewTile();
    addNewTile();
    renderBoard();
}

// Экспорт функций для глобального доступа
window.startGame = startGame;
window.renderBoard = renderBoard;
window.addNewTile = addNewTile;
window.saveMove = saveMove;
window.undoMove = undoMove;
window.checkGameOver = checkGameOver;
window.showGameOver = showGameOver;
