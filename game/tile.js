// Константы для анимаций
const animations = {
    merge: 'merged',
    new: 'new-tile'
};

// Обработка строки для сдвига и слияния плиток
function processRow(row) {
    validateRow(row); // Проверка корректности строки

    const slidRow = slideRow([...row]); // Сдвиг плиток
    const { mergedRow, score } = mergeRow(slidRow); // Слияние плиток
    const finalRow = slideRow(mergedRow); // Сдвиг после слияния

    return { newRow: finalRow, score };
}

// Проверка корректности строки
function validateRow(row) {
    if (!Array.isArray(row)) {
        throw new Error('Ошибка: строка должна быть массивом.');
    }
    if (row.length !== 4) {
        throw new Error('Ошибка: строка должна содержать 4 элемента.');
    }
}

// Сдвиг плиток в строке
function slideRow(row) {
    const filtered = row.filter(cell => cell !== 0); // Удаление пустых ячеек
    return [...filtered, ...Array(4 - filtered.length).fill(0)]; // Заполнение нулями
}

// Слияние плиток
function mergeRow(row) {
    let score = 0;
    const merged = [...row];

    for (let i = 0; i < 3; i++) {
        if (merged[i] !== 0 && merged[i] === merged[i + 1]) {
            const newValue = merged[i] * 2;
            score += newValue;

            merged[i] = newValue;
            merged[i + 1] = 0;

            triggerMergeAnimation(i, newValue); // Анимация слияния
        }
    }

    return { mergedRow: merged, score };
}

// Анимация слияния плиток
function triggerMergeAnimation(position, value) {
    const tiles = document.querySelectorAll('.tile');
    const tile = tiles[position];

    if (!tile) return;

    tile.classList.add(animations.merge);
    tile.textContent = value;

    const handleAnimationEnd = () => {
        tile.classList.remove(animations.merge);
        tile.removeEventListener('animationend', handleAnimationEnd);
    };

    tile.addEventListener('animationend', handleAnimationEnd, { once: true });
}

// Экспорт функций для тестирования
if (typeof window !== 'undefined') {
    window.tileHandler = {
        processRow,
        slideRow,
        mergeRow
    };
}
