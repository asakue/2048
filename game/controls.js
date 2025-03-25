// Константы для направлений движения
const directions = {
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down'
};

// Переменные для обработки касаний и перемещений
let touchStartX = 0;
let touchStartY = 0;
let isSwiping = false;
let mouseIsDown = false;
const minSwipeDistance = 50;
let GAME_PAUSED = false;

// Общая обработка направления свайпа или движения мышью
function handleSwipe(deltaX, deltaY) {
    if (GAME_PAUSED || document.body.classList.contains('game-over')) return;

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (absDeltaX > absDeltaY) {
        if (absDeltaX > minSwipeDistance) {
            deltaX > 0 ? move(directions.RIGHT) : move(directions.LEFT);
        }
    } else {
        if (absDeltaY > minSwipeDistance) {
            deltaY > 0 ? move(directions.DOWN) : move(directions.UP);
        }
    }
}

// Обработчики для сенсорных устройств
function handleTouchStart(e) {
    if (GAME_PAUSED || document.body.classList.contains('game-over')) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    isSwiping = true;
}

function handleTouchEnd(e) {
    if (!isSwiping || GAME_PAUSED || document.body.classList.contains('game-over')) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;

    handleSwipe(deltaX, deltaY);
    isSwiping = false;
}

// Обработчики для мыши
function handleMouseDown(e) {
    if (GAME_PAUSED || document.body.classList.contains('game-over')) return;
    mouseIsDown = true;
    touchStartX = e.clientX;
    touchStartY = e.clientY;
}

function handleMouseUp(e) {
    if (!mouseIsDown || GAME_PAUSED || document.body.classList.contains('game-over')) return;

    const deltaX = e.clientX - touchStartX;
    const deltaY = e.clientY - touchStartY;

    handleSwipe(deltaX, deltaY);
    mouseIsDown = false;
}

// Предотвращение нежелательного поведения (прокрутка страницы)
function handleMove(e) {
    if ((isSwiping || mouseIsDown) && !GAME_PAUSED && !document.body.classList.contains('game-over')) {
        e.preventDefault();
    }
}

// Анимация движения плитки
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
document.addEventListener('touchstart', handleTouchStart, { passive: false });
document.addEventListener('touchend', handleTouchEnd);
document.addEventListener('mousedown', handleMouseDown);
document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('touchmove', handleMove, { passive: false });
document.addEventListener('mousemove', handleMove);

// Общая функция для движения в любом направлении
function move(direction) {
    if (GAME_PAUSED || document.body.classList.contains('game-over')) return;

    let moved = false;
    let points = 0;

    // Обработка всех строк или столбцов в зависимости от направления
    for (let i = 0; i < 4; i++) {
        // Получаем текущую строку или столбец
        let line = [];
        
        if (direction === directions.LEFT || direction === directions.RIGHT) {
            // Для горизонтальных движений берем строку
            line = [...boardMatrix[i]];
        } else {
            // Для вертикальных движений собираем столбец
            for (let j = 0; j < 4; j++) {
                line.push(boardMatrix[direction === directions.UP ? j : 3-j][i]);
            }
        }
        
        // Сохраняем оригинальную линию для сравнения
        const originalLine = [...line];
        
        // Обрабатываем линию в зависимости от направления
        let processedLine;
        if (direction === directions.LEFT || direction === directions.UP) {
            processedLine = tileHandler.processRow(line);
        } else {
            // Для RIGHT и DOWN переворачиваем линию, обрабатываем и снова переворачиваем
            const reversed = [...line].reverse();
            const processed = tileHandler.processRow(reversed);
            processed.newRow = processed.newRow.reverse();
            processedLine = processed;
        }
        
        // Проверяем, было ли движение
        if (!arraysEqual(originalLine, processedLine.newRow)) {
            // Обновляем матрицу в зависимости от направления
            if (direction === directions.LEFT || direction === directions.RIGHT) {
                boardMatrix[i] = processedLine.newRow;
            } else {
                for (let j = 0; j < 4; j++) {
                    boardMatrix[direction === directions.UP ? j : 3-j][i] = processedLine.newRow[j];
                }
            }
            
            points += processedLine.score;
            moved = true;
        }
    }

    if (moved) {
        // Добавляем анимацию для всех плиток
        const tiles = document.querySelectorAll('.tile[data-value]');
        tiles.forEach(tile => {
            animateTile(tile, direction);
        });
        
        // Воспроизводим звук движения
        if (window.playSound) {
            window.playSound('move');
        }
        
        // Создаем частицы для слитых плиток и воспроизводим звук слияния
        if (points > 0) {
            createMergeParticles(direction);
            
            // Находим максимальное значение созданной плитки для звука
            const mergedTiles = document.querySelectorAll('.tile.merged');
            if (mergedTiles.length > 0 && window.playSound) {
                let maxValue = 2;
                mergedTiles.forEach(tile => {
                    const value = parseInt(tile.getAttribute('data-value'));
                    if (value > maxValue) maxValue = value;
                });
                window.playSound('merge', maxValue);
            }
        }
        
        // Завершаем ход
        finalizeMove(points);
    } else if (window.playSound) {
        // Если движение невозможно, воспроизводим звук ошибки
        window.playSound('error');
    }
}

// Создание частиц при слиянии плиток
function createMergeParticles(direction) {
    const mergedTiles = document.querySelectorAll('.tile.merged');
    mergedTiles.forEach(tile => {
        createParticlesForTile(tile, direction);
    });
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

// Движение влево (для обратной совместимости)
function moveLeft() {
    move(directions.LEFT);
}

// Движение вправо (для обратной совместимости)
function moveRight() {
    move(directions.RIGHT);
}

// Движение вверх (для обратной совместимости)
function moveUp() {
    move(directions.UP);
}

// Движение вниз (для обратной совместимости)
function moveDown() {
    move(directions.DOWN);
}

// Экспорт функций в глобальное пространство имен
window.moveLeft = moveLeft;
window.moveRight = moveRight;
window.moveUp = moveUp;
window.moveDown = moveDown;
window.finalizeMove = finalizeMove;
window.directions = directions;
