/**
 * Модуль для управления анимированным фоном игры
 */

// Настройки анимированного фона
let bgEnabled = true; // Анимированный фон включен по умолчанию
let bgElements = [];
let animationRunning = false;

/**
 * Инициализация анимированного фона
 */
function initAnimatedBackground() {
    // Загрузка настроек
    loadBackgroundSettings();
    
    // Создание контейнера для анимированного фона, если его еще нет
    let bgContainer = document.querySelector('.animated-background');
    if (!bgContainer) {
        bgContainer = document.createElement('div');
        bgContainer.className = 'animated-background';
        document.body.appendChild(bgContainer);
    }
    
    // Установка начального состояния кнопки
    updateBackgroundButtonUI();
    
    // Добавление обработчика клика для кнопки
    const bgToggleBtn = document.getElementById('bg-toggle');
    if (bgToggleBtn) {
        bgToggleBtn.addEventListener('click', toggleBackgroundAnimation);
    }
    
    // Если анимация включена - создаем элементы
    if (bgEnabled) {
        startBackgroundAnimation();
    }
}

/**
 * Загрузка настроек анимированного фона из localStorage
 */
function loadBackgroundSettings() {
    try {
        const savedSettings = localStorage.getItem('2048_background_settings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            bgEnabled = settings.enabled;
        }
    } catch (e) {
        console.error('Ошибка при загрузке настроек фона:', e);
        bgEnabled = true; // По умолчанию анимированный фон включен
    }
}

/**
 * Сохранение настроек анимированного фона в localStorage
 */
function saveBackgroundSettings() {
    try {
        const settings = {
            enabled: bgEnabled
        };
        localStorage.setItem('2048_background_settings', JSON.stringify(settings));
    } catch (e) {
        console.error('Ошибка при сохранении настроек фона:', e);
    }
}

/**
 * Переключение состояния анимированного фона
 */
function toggleBackgroundAnimation() {
    bgEnabled = !bgEnabled;
    
    // Анимация кнопки
    const bgToggleBtn = document.getElementById('bg-toggle');
    if (bgToggleBtn) {
        bgToggleBtn.classList.add('sound-wave');
        setTimeout(() => {
            bgToggleBtn.classList.remove('sound-wave');
        }, 500);
    }
    
    // Обновление UI
    updateBackgroundButtonUI();
    
    // Обновление состояния анимации
    updateBackgroundState();
    
    // Сохранение настроек
    saveBackgroundSettings();
}

/**
 * Обновление UI кнопки анимированного фона в соответствии с текущим состоянием
 */
function updateBackgroundButtonUI() {
    const bgToggleBtn = document.getElementById('bg-toggle');
    if (!bgToggleBtn) return;
    
    if (bgEnabled) {
        bgToggleBtn.classList.add('active');
        bgToggleBtn.setAttribute('aria-label', 'Выключить анимированный фон');
    } else {
        bgToggleBtn.classList.remove('active');
        bgToggleBtn.setAttribute('aria-label', 'Включить анимированный фон');
    }
}

/**
 * Обновление состояния анимации фона
 */
function updateBackgroundState() {
    if (bgEnabled && !animationRunning) {
        startBackgroundAnimation();
    } else if (!bgEnabled && animationRunning) {
        stopBackgroundAnimation();
    }
}

/**
 * Запуск анимации фона
 */
function startBackgroundAnimation() {
    if (animationRunning) return;
    
    animationRunning = true;
    
    // Получаем контейнер
    const bgContainer = document.querySelector('.animated-background');
    if (!bgContainer) return;
    
    // Очистка предыдущих элементов
    bgContainer.innerHTML = '';
    bgElements = [];
    
    // Создание новых элементов
    createBackgroundElements();
    
    // Запуск анимации
    requestAnimationFrame(animateBackground);
}

/**
 * Остановка анимации фона
 */
function stopBackgroundAnimation() {
    animationRunning = false;
    
    // Получаем контейнер
    const bgContainer = document.querySelector('.animated-background');
    if (!bgContainer) return;
    
    // Очистка элементов
    bgContainer.innerHTML = '';
    bgElements = [];
}

/**
 * Создание элементов для анимированного фона
 */
function createBackgroundElements() {
    const bgContainer = document.querySelector('.animated-background');
    if (!bgContainer) return;
    
    // Количество плиток в фоне
    const totalTiles = 15;
    
    // Создание плиток разных номиналов
    const tileValues = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
    
    for (let i = 0; i < totalTiles; i++) {
        // Случайное значение плитки
        const value = tileValues[Math.floor(Math.random() * tileValues.length)];
        
        // Создание элемента фона
        createBackgroundTile(value, bgContainer);
    }
}

/**
 * Создание одной плитки для анимированного фона
 * @param {number} value - Значение плитки
 * @param {HTMLElement} container - Контейнер для размещения плитки
 */
function createBackgroundTile(value, container) {
    // Создание элемента
    const tile = document.createElement('div');
    tile.className = 'bg-tile';
    tile.textContent = value;
    
    // Случайный размер (меньше, чем обычные плитки)
    const size = randomRange(40, 80);
    tile.style.width = `${size}px`;
    tile.style.height = `${size}px`;
    tile.style.fontSize = `${size * 0.45}px`;
    
    // Случайная начальная позиция
    const posX = randomRange(0, window.innerWidth);
    const posY = randomRange(-200, window.innerHeight + 200);
    
    // Случайное направление и скорость
    const speedX = randomRange(-0.5, 0.5);
    const speedY = randomRange(-0.5, 0.5);
    
    // Случайное вращение
    const rotation = randomRange(0, 360);
    const rotationSpeed = randomRange(-0.2, 0.2);
    
    // Прозрачность
    const opacity = randomRange(0.05, 0.15);
    
    // Определение цвета в зависимости от темы
    const isDarkTheme = document.body.classList.contains('dark-theme');
    const color = isDarkTheme ? getColorForDarkTheme(value) : getColorForLightTheme(value);
    
    // Применение стилей
    tile.style.position = 'absolute';
    tile.style.left = `${posX}px`;
    tile.style.top = `${posY}px`;
    tile.style.backgroundColor = color.background;
    tile.style.color = color.text;
    tile.style.transform = `rotate(${rotation}deg)`;
    tile.style.opacity = opacity.toString();
    tile.style.display = 'flex';
    tile.style.alignItems = 'center';
    tile.style.justifyContent = 'center';
    tile.style.borderRadius = '5px';
    tile.style.fontWeight = 'bold';
    tile.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    
    // Добавление в контейнер
    container.appendChild(tile);
    
    // Сохранение данных для анимации
    bgElements.push({
        element: tile,
        x: posX,
        y: posY,
        speedX,
        speedY,
        rotation,
        rotationSpeed,
        value
    });
}

/**
 * Анимация элементов фона
 */
function animateBackground() {
    if (!animationRunning) return;
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Обработка каждого элемента
    bgElements.forEach(item => {
        // Перемещение
        item.x += item.speedX;
        item.y += item.speedY;
        
        // Вращение
        item.rotation += item.rotationSpeed;
        
        // Проверка границ по X
        if (item.x < -100) item.x = width + 50;
        if (item.x > width + 100) item.x = -50;
        
        // Проверка границ по Y
        if (item.y < -100) item.y = height + 50;
        if (item.y > height + 100) item.y = -50;
        
        // Применение новых значений
        item.element.style.left = `${item.x}px`;
        item.element.style.top = `${item.y}px`;
        item.element.style.transform = `rotate(${item.rotation}deg)`;
        
        // Обновление цвета при изменении темы
        const isDarkTheme = document.body.classList.contains('dark-theme');
        const color = isDarkTheme ? getColorForDarkTheme(item.value) : getColorForLightTheme(item.value);
        item.element.style.backgroundColor = color.background;
        item.element.style.color = color.text;
    });
    
    // Продолжение анимации
    if (animationRunning) {
        requestAnimationFrame(animateBackground);
    }
}

/**
 * Получение цвета для плитки в темной теме
 * @param {number} value - Значение плитки
 * @returns {Object} - Объект с цветами фона и текста
 */
function getColorForDarkTheme(value) {
    // Цвета плиток для темной темы
    const colors = {
        '2': { background: '#3d4466', text: '#f0f0f0' },
        '4': { background: '#4a4f6a', text: '#f0f0f0' },
        '8': { background: '#5c5470', text: '#f9f6f2' },
        '16': { background: '#705c71', text: '#f9f6f2' },
        '32': { background: '#845c6d', text: '#f9f6f2' },
        '64': { background: '#955866', text: '#f9f6f2' },
        '128': { background: '#a75559', text: '#f9f6f2' },
        '256': { background: '#b45051', text: '#f9f6f2' },
        '512': { background: '#c54b44', text: '#f9f6f2' },
        '1024': { background: '#d54d3d', text: '#f9f6f2' },
        '2048': { background: '#e83f28', text: '#f9f6f2' }
    };
    
    return colors[value] || colors['2'];
}

/**
 * Получение цвета для плитки в светлой теме
 * @param {number} value - Значение плитки
 * @returns {Object} - Объект с цветами фона и текста
 */
function getColorForLightTheme(value) {
    // Цвета плиток для светлой темы
    const colors = {
        '2': { background: '#eee4da', text: '#776e65' },
        '4': { background: '#ede0c8', text: '#776e65' },
        '8': { background: '#f2b179', text: '#f9f6f2' },
        '16': { background: '#f59563', text: '#f9f6f2' },
        '32': { background: '#f67c5f', text: '#f9f6f2' },
        '64': { background: '#f65e3b', text: '#f9f6f2' },
        '128': { background: '#edcf72', text: '#f9f6f2' },
        '256': { background: '#edcc61', text: '#f9f6f2' },
        '512': { background: '#edc850', text: '#f9f6f2' },
        '1024': { background: '#edc53f', text: '#f9f6f2' },
        '2048': { background: '#edc22e', text: '#f9f6f2' }
    };
    
    return colors[value] || colors['2'];
}

/**
 * Генерация случайного числа в заданном диапазоне
 * @param {number} min - Минимальное значение
 * @param {number} max - Максимальное значение
 * @returns {number} - Случайное число
 */
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

// При загрузке страницы
document.addEventListener('DOMContentLoaded', initAnimatedBackground);

// Экспорт функций
window.toggleBackgroundAnimation = toggleBackgroundAnimation;