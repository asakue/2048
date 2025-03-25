let touchStartX = 0;
let touchStartY = 0;
let isSwiping = false;
let mouseIsDown = false;
const minSwipeDistance = 50;

// Общая обработка направления свайпа или движения мышью
function handleSwipe(deltaX, deltaY) {
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > absDeltaY) {
        if (absDeltaX > minSwipeDistance) {
            deltaX > 0 ? moveRight() : moveLeft();
        }
    } else {
        if (absDeltaY > minSwipeDistance) {
            deltaY > 0 ? moveDown() : moveUp();
        }
    }
}

// Обработчики для сенсорных устройств
function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isSwiping = true;
}

function handleTouchEnd(e) {
    if (!isSwiping) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;

    handleSwipe(deltaX, deltaY);
    isSwiping = false;
}

// Обработчики для мыши
function handleMouseDown(e) {
    mouseIsDown = true;
    touchStartX = e.clientX;
    touchStartY = e.clientY;
}

function handleMouseUp(e) {
    if (!mouseIsDown) return;

    const deltaX = e.clientX - touchStartX;
    const deltaY = e.clientY - touchStartY;

    handleSwipe(deltaX, deltaY);
    mouseIsDown = false;
}

// Предотвращение нежелательного поведения (прокрутка страницы)
function handleMove(e) {
    if (isSwiping || mouseIsDown) {
        e.preventDefault();
    }
}

function animateTile(tile, direction) {
    const animationClass = `slide-${direction}`;

    // Добавляем класс анимации
    tile.classList.add(animationClass);

    // Удаляем класс анимации после завершения
    tile.addEventListener('animationend', () => {
        tile.classList.remove(animationClass);
    }, { once: true });
}

// Инициализация событий
document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchend', handleTouchEnd);
document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('touchmove', handleMove, { passive: false });
document.addEventListener('mousemove', handleMove);

// Логика движения (moveLeft)
function moveLeft() {
    let moved = false;
    let points = 0;

    for (let y = 0; y < 4; y++) {
        const original = [...boardMatrix[y]];
        const processed = processRow(boardMatrix[y]);

        if (!arraysEqual(original, processed.newRow)) {
            boardMatrix[y] = processed.newRow;
            points += processed.score;
            moved = true;
        }
    }

    if (moved) finalizeMove(points);
}

// Остальные направления (moveRight, moveUp, moveDown) аналогично
function moveRight() {
    let moved = false;
    let points = 0;

    for (let y = 0; y < 4; y++) {
        const original = [...boardMatrix[y]];
        const processed = processRow(boardMatrix[y].reverse()).newRow.reverse();

        if (!arraysEqual(original, processed)) {
            boardMatrix[y] = processed;
            points += processed.score;
            moved = true;
        }
    }

    if (moved) finalizeMove(points);
}

function moveUp() {
    let moved = false;
    let points = 0;

    for (let x = 0; x < 4; x++) {
        const column = [];
        for (let y = 0; y < 4; y++) {
            column.push(boardMatrix[y][x]);
        }

        const original = [...column];
        const processed = processRow(column);

        if (!arraysEqual(original, processed.newRow)) {
            for (let y = 0; y < 4; y++) {
                boardMatrix[y][x] = processed.newRow[y];
            }
            points += processed.score;
            moved = true;
        }
    }

    if (moved) finalizeMove(points);
}

function moveDown() {
    let moved = false;
    let points = 0;

    for (let x = 0; x < 4; x++) {
        const column = [];
        for (let y = 3; y >= 0; y--) {
            column.push(boardMatrix[y][x]);
        }

        const original = [...column];
        const processed = processRow(column);

        if (!arraysEqual(original, processed.newRow)) {
            for (let y = 0; y < 4; y++) {
                boardMatrix[3 - y][x] = processed.newRow[y];
            }
            points += processed.score;
            moved = true;
        }
    }

    if (moved) finalizeMove(points);
}

// Вспомогательные функции
function arraysEqual(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
}

function finalizeMove(points) {
    updateScore(points);
    saveMove();
    addNewTile();
    renderBoard();

    if (checkGameOver()) showGameOver();
}

// Обработка строки для объединения плиток
function processRow(row) {
    const newRow = row.filter(val => val !== 0);
    let score = 0;

    for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2;
            score += newRow[i];
            newRow.splice(i + 1, 1);
        }
    }

    while (newRow.length < 4) {
        newRow.push(0);
    }

    return { newRow, score };
}
function move(direction) {
    if (GAME_PAUSED) return;

    let moved = false;
    let points = 0;

    for (let y = 0; y < 4; y++) {
        let row = [];

        if (direction === directions.LEFT || direction === directions.RIGHT) {
            row = [...boardMatrix[y]];
        } else {
            for (let x = 0; x < 4; x++) {
                row.push(direction === directions.UP ? boardMatrix[x][y] : boardMatrix[3 - x][y]);
            }
        }

        const original = [...row];
        const processed = processRow(direction === directions.LEFT || direction === directions.UP ? row : row.reverse());

        if (!arraysEqual(original, direction === directions.LEFT || direction === directions.UP ? processed.newRow : processed.newRow.reverse())) {
            if (direction === directions.LEFT || direction === directions.RIGHT) {
                boardMatrix[y] = direction === directions.LEFT ? processed.newRow : processed.newRow.reverse();
            } else {
                for (let x = 0; x < 4; x++) {
                    boardMatrix[direction === directions.UP ? x : 3 - x][y] = processed.newRow[x];
                }
            }

            points += processed.score;
            moved = true;
        }
    }

    if (moved) {
        // Анимация всех плиток
        const tiles = document.querySelectorAll('.tile');
        tiles.forEach(tile => animateTile(tile, direction));

        finalizeMove(points);
    }
}