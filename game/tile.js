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
    const mergedPositions = [];

    for (let i = 0; i < 3; i++) {
        if (merged[i] !== 0 && merged[i] === merged[i + 1]) {
            const newValue = merged[i] * 2;
            score += newValue;

            merged[i] = newValue;
            merged[i + 1] = 0;

            // Сохраняем позицию для анимации
            mergedPositions.push(i);
        }
    }

    // Применяем анимацию к слитым плиткам после обновления доски
    setTimeout(() => {
        applyMergeAnimations(mergedPositions);
    }, 50);

    return { mergedRow: merged, score };
}

// Анимация слияния плиток
function applyMergeAnimations(positions) {
    positions.forEach(position => {
        const tiles = document.querySelectorAll('.tile[data-value]');
        const tile = tiles[position];
        
        if (tile) {
            tile.classList.add(animations.merge);
            
            // Создаем эффект частиц при слиянии
            createMergeParticleEffect(tile);
            
            tile.addEventListener('animationend', () => {
                tile.classList.remove(animations.merge);
            }, { once: true });
        }
    });
}

// Создание эффекта частиц при слиянии
function createMergeParticleEffect(tile) {
    const rect = tile.getBoundingClientRect();
    const value = parseInt(tile.dataset.value);
    const color = getColorForValue(value);
    
    // Количество частиц зависит от значения плитки
    const particleCount = Math.min(Math.log2(value) * 3, 20);
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.backgroundColor = color;
        
        // Рассчитываем случайную позицию вокруг плитки
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Случайный угол и расстояние
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * rect.width * 0.5;
        
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Случайный размер частицы
        const size = 5 + Math.random() * 8;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Добавляем частицу в DOM
        document.body.appendChild(particle);
        
        // Удаляем частицу после завершения анимации
        particle.addEventListener('animationend', () => {
            particle.remove();
        });
    }
}

// Определение цвета для значения плитки
function getColorForValue(value) {
    const colors = {
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e'
    };
    
    return colors[value] || '#edc22e';
}

// Экспорт функций для тестирования и доступа из других модулей
if (typeof window !== 'undefined') {
    window.tileHandler = {
        processRow,
        slideRow,
        mergeRow,
        createMergeParticleEffect
    };
}
