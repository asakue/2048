function processRow(row) {
    let score = 0;
    let newRow = slide(row);
    const mergeResult = merge(newRow);
    newRow = mergeResult.row;
    score = mergeResult.score;
    newRow = slide(newRow);
    
    return { newRow, score };
}

function slide(row) {
    const filteredRow = row.filter(num => num !== 0);
    const newRow = Array(4).fill(0);
    for (let i = 0; i < filteredRow.length; i++) {
        newRow[i] = filteredRow[i];
    }
    return newRow;
}

function merge(row) {
    let score = 0;
    const newRow = [...row];
    
    for (let i = 0; i < 3; i++) {
        if (newRow[i] !== 0 && newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2;
            score += newRow[i];
            newRow[i + 1] = 0;
            
            const tile = document.querySelector(`[data-value="${newRow[i]}"]`);
            if (tile) {
                tile.classList.add('merged');
                tile.addEventListener('animationend', () => {
                    tile.classList.remove('merged');
                }, { once: true });
            }
        }
    }
    
    return { row: newRow, score };
}

function addTileAnimation(tile, className) {
    tile.classList.add(className);
    tile.addEventListener('animationend', () => {
        tile.classList.remove(className);
    }, { once: true });
}