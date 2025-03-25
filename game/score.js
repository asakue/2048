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

    // Анимация изменения счета
    animateScoreChange(points);

    score += points;
    updateScoreDisplay('score', score);

    // Обновление рекорда, если текущий счет превышает его
    if (score > bestScore) {
        bestScore = score;
        storage.set('bestScore', bestScore);
        updateScoreDisplay('best-score', bestScore);
        
        // Анимация нового рекорда
        triggerNewBestScoreAnimation();
    }
}

// Анимация изменения счета
function animateScoreChange(points) {
    // Создаем элемент для анимации +очки
    const scoreElement = document.getElementById('score');
    const pointsPopup = document.createElement('div');
    pointsPopup.className = 'points-popup';
    pointsPopup.textContent = `+${points}`;
    
    // Применяем стили
    pointsPopup.style.position = 'absolute';
    pointsPopup.style.color = '#4ecdc4';
    pointsPopup.style.fontWeight = 'bold';
    pointsPopup.style.fontSize = '1.2rem';
    pointsPopup.style.pointerEvents = 'none';
    pointsPopup.style.zIndex = '100';
    pointsPopup.style.animation = 'float-up 1.2s ease-out forwards';
    
    // Добавляем стили для анимации, если они еще не добавлены
    if (!document.getElementById('score-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'score-animation-styles';
        style.textContent = `
            @keyframes float-up {
                0% { opacity: 0; transform: translateY(10px); }
                10% { opacity: 1; }
                80% { opacity: 1; }
                100% { opacity: 0; transform: translateY(-30px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Позиционируем и добавляем элемент
    const rect = scoreElement.getBoundingClientRect();
    pointsPopup.style.left = `${rect.left + rect.width / 2}px`;
    pointsPopup.style.top = `${rect.top + rect.height / 2}px`;
    
    document.body.appendChild(pointsPopup);
    
    // Удаляем элемент после анимации
    setTimeout(() => {
        pointsPopup.remove();
    }, 1200);
}

// Анимация нового рекорда
function triggerNewBestScoreAnimation() {
    const bestScoreElement = document.getElementById('best-score');
    bestScoreElement.classList.add('new-record');
    
    // Добавляем стили для анимации, если они еще не добавлены
    if (!document.getElementById('best-score-animation-styles')) {
        const style = document.createElement('style');
        style.id = 'best-score-animation-styles';
        style.textContent = `
            .new-record {
                animation: glow-pulse 1.5s ease-in-out;
            }
            
            @keyframes glow-pulse {
                0%, 100% { box-shadow: 0 0 0 rgba(78, 205, 196, 0); }
                50% { box-shadow: 0 0 15px rgba(78, 205, 196, 0.7); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Удаляем класс после анимации
    setTimeout(() => {
        bestScoreElement.classList.remove('new-record');
    }, 1500);
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
        // Анимация изменения значения
        const oldValue = parseInt(span.textContent) || 0;
        if (oldValue !== value) {
            animateNumberChange(span, oldValue, value);
        } else {
            span.textContent = value;
        }
        
        triggerVisualFeedback(container);
    }
}

// Анимация изменения числа
function animateNumberChange(element, oldValue, newValue) {
    const duration = 500; // ms
    const startTime = performance.now();
    
    function updateValue(timestamp) {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Используем функцию easeOutQuad для более естественной анимации
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        
        const currentValue = Math.floor(oldValue + (newValue - oldValue) * easeProgress);
        element.textContent = currentValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        } else {
            element.textContent = newValue;
        }
    }
    
    requestAnimationFrame(updateValue);
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
