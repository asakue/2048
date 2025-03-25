// Переменные для хранения счета
let score = 0;
let bestScore = 0;

// Обертка для работы с LocalStorage
const storage = {
    get: (key) => {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.error('Ошибка LocalStorage:', e);
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.error('Ошибка LocalStorage:', e);
        }
    }
};

// Обновление счета
function updateScore(points) {
    if (!points || points < 0) return;

    score += points;
    updateScoreDisplay('score', score);

    // Обновление рекорда, если текущий счет превышает его
    if (score > bestScore) {
        bestScore = score;
        storage.set('bestScore', bestScore);
        updateScoreDisplay('best-score', bestScore);
    }
}

// Сброс счета
function resetScore() {
    score = 0;
    updateScoreDisplay('score', 0);
}

// Инициализация счетов
function initializeScores() {
    const savedBest = parseInt(storage.get('bestScore')) || 0;
    bestScore = isNaN(savedBest) ? 0 : savedBest;

    // Обновление отображения счета и рекорда
    updateScoreDisplay('score', 0);
    updateScoreDisplay('best-score', bestScore);
}

// Обновление отображения счета
function updateScoreDisplay(elementId, value) {
    const container = document.getElementById(elementId);
    if (!container) return;

    const span = container.querySelector('span');
    if (span) {
        span.textContent = value;
        triggerVisualFeedback(container);
    }
}

// Визуальная обратная связь при обновлении счета
function triggerVisualFeedback(element) {
    element.classList.add('updated');
    setTimeout(() => {
        element.classList.remove('updated');
    }, 300);
}

// Экспорт функций для глобального доступа
window.updateScore = updateScore;
window.resetScore = resetScore;
window.initializeScores = initializeScores;
