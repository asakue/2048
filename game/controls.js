let touchStartX = 0;
let touchStartY = 0;
let isSwiping = false;

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    isSwiping = true;
}

function handleTouchMove(event) {
    if (!isSwiping) return;
    event.preventDefault();
}

function handleTouchEnd(event) {
    if (!isSwiping) return;
    
    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    const minSwipeDistance = 50;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) moveRight();
            else moveLeft();
        }
    } else {
        if (Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0) moveDown();
            else moveUp();
        }
    }
    
    isSwiping = false;
}

function arraysEqual(arr1, arr2) {
    return arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);
}

function moveLeft() {
    let moved = false;
    let points = 0;
    
    for (let y = 0; y < 4; y++) {
        const originalRow = [...boardMatrix[y]];
        const { newRow, score } = processRow(boardMatrix[y]);
        boardMatrix[y] = newRow;
        points += score;
        
        if (!arraysEqual(originalRow, newRow)) moved = true;
    }
    
    handleMove(moved, points);
}

function moveRight() {
    let moved = false;
    let points = 0;
    
    for (let y = 0; y < 4; y++) {
        const originalRow = [...boardMatrix[y]];
        const reversed = originalRow.reverse();
        const { newRow, score } = processRow(reversed);
        boardMatrix[y] = newRow.reverse();
        points += score;
        
        if (!arraysEqual(originalRow, boardMatrix[y])) moved = true;
    }
    
    handleMove(moved, points);
}

function moveUp() {
    let moved = false;
    let points = 0;
    
    for (let x = 0; x < 4; x++) {
        const originalColumn = [boardMatrix[0][x], boardMatrix[1][x], boardMatrix[2][x], boardMatrix[3][x]];
        const { newRow, score } = processRow(originalColumn);
        
        for (let y = 0; y < 4; y++) {
            boardMatrix[y][x] = newRow[y];
        }
        points += score;
        
        if (!arraysEqual(originalColumn, newRow)) moved = true;
    }
    
    handleMove(moved, points);
}

function moveDown() {
    let moved = false;
    let points = 0;
    
    for (let x = 0; x < 4; x++) {
        const originalColumn = [boardMatrix[0][x], boardMatrix[1][x], boardMatrix[2][x], boardMatrix[3][x]];
        const reversed = originalColumn.reverse();
        const { newRow, score } = processRow(reversed);
        const finalRow = newRow.reverse();
        
        for (let y = 0; y < 4; y++) {
            boardMatrix[y][x] = finalRow[y];
        }
        points += score;
        
        if (!arraysEqual(originalColumn, finalRow)) moved = true;
    }
    
    handleMove(moved, points);
}

function handleMove(moved, points) {
    if (moved) {
        updateScore(points);
        saveMove();
        addNewTile();
        renderBoard();
        
        if (checkGameOver()) {
            showGameOver();
        }
    }
}

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
document.addEventListener('touchend', handleTouchEnd, false);