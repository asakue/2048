
function arraysEqual(arr1, arr2) {
    return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
}

function moveLeft() {
    let moved = false;
    for (let y = 0; y < 4; y++) {
        const originalRow = [...boardMatrix[y]];
        boardMatrix[y] = processRow(boardMatrix[y]);
        if (!arraysEqual(originalRow, boardMatrix[y])) moved = true;
    }
    if (moved) {
        saveMove();
        addNewTile();
        renderBoard();
        if (checkGameOver()) alert('Game Over!');
    }
}

function moveRight() {
    let moved = false;
    for (let y = 0; y < 4; y++) {
        const originalRow = [...boardMatrix[y]];
        boardMatrix[y] = processRow(boardMatrix[y], true);
        if (!arraysEqual(originalRow, boardMatrix[y])) moved = true;
    }
    if (moved) {
        saveMove();
        addNewTile();
        renderBoard();
        if (checkGameOver()) alert('Game Over!');
    }
}

function moveUp() {
    let moved = false;
    for (let x = 0; x < 4; x++) {
        const originalRow = [boardMatrix[0][x], boardMatrix[1][x], boardMatrix[2][x], boardMatrix[3][x]];
        const newRow = processRow(originalRow);
        for (let y = 0; y < 4; y++) {
            boardMatrix[y][x] = newRow[y];
        }
        if (!arraysEqual(originalRow, newRow)) moved = true;
    }
    if (moved) {
        saveMove();
        addNewTile();
        renderBoard();
        if (checkGameOver()) alert('Game Over!');
    }
}

function moveDown() {
    let moved = false;
    for (let x = 0; x < 4; x++) {
        const originalRow = [boardMatrix[0][x], boardMatrix[1][x], boardMatrix[2][x], boardMatrix[3][x]];
        const newRow = processRow(originalRow, true);
        for (let y = 0; y < 4; y++) {
            boardMatrix[y][x] = newRow[y];
        }
        if (!arraysEqual(originalRow, newRow)) moved = true;
    }
    if (moved) {
        saveMove();
        addNewTile();
        renderBoard();
        if (checkGameOver()) alert('Game Over!');
    }
}