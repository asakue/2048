
function slide(row) {
    const filteredRow = row.filter(num => num !== 0);
    while (filteredRow.length < 4) filteredRow.push(0);
    return filteredRow;
}

function merge(row) {
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1] && row[i] !== 0) {
            row[i] *= 2;
            updateScore(row[i]);
            row[i + 1] = 0;
            const tile = board.querySelector(`[data-value="${row[i]}"].new-tile`);
            if (tile) {
                tile.classList.add('merged'); 
                tile.addEventListener('animationend', () => {
                    tile.classList.remove('merged'); 
                }, { once: true });
            }
        }
    }
    return row;
}


function processRow(row, reverse = false) {
    if (reverse) row.reverse();
    let newRow = slide(row);
    newRow = merge(newRow);
    newRow = slide(newRow);
    if (reverse) newRow.reverse();
    return newRow;
}
