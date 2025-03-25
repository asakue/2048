/**
 * Модуль для управления темами оформления игры
 */

// Доступные темы
const themes = {
    'light': {
        name: 'Светлая',
        icon: 'fas fa-sun',
        colors: {
            background: '#faf8ef',
            gameContainer: 'rgba(255, 255, 255, 0.8)',
            tileColors: {
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
                '2048': { background: '#edc22e', text: '#f9f6f2' },
            }
        }
    },
    'dark': {
        name: 'Тёмная',
        icon: 'fas fa-moon',
        colors: {
            background: '#1a1f35',
            gameContainer: 'rgba(30, 40, 60, 0.8)',
            tileColors: {
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
                '2048': { background: '#e83f28', text: '#f9f6f2' },
            }
        }
    },
    'neon': {
        name: 'Неон',
        icon: 'fas fa-bolt',
        colors: {
            background: '#0f0c29',
            gameContainer: 'rgba(20, 20, 50, 0.7)',
            tileColors: {
                '2': { background: '#2c3e50', text: '#ecf0f1' },
                '4': { background: '#3498db', text: '#ecf0f1' },
                '8': { background: '#2980b9', text: '#ecf0f1' },
                '16': { background: '#8e44ad', text: '#ecf0f1' },
                '32': { background: '#9b59b6', text: '#ecf0f1' },
                '64': { background: '#16a085', text: '#ecf0f1' },
                '128': { background: '#27ae60', text: '#ecf0f1' },
                '256': { background: '#f39c12', text: '#ecf0f1' },
                '512': { background: '#f1c40f', text: '#ecf0f1' },
                '1024': { background: '#e67e22', text: '#ecf0f1' },
                '2048': { background: '#d35400', text: '#ecf0f1' },
            }
        }
    },
    'pastel': {
        name: 'Пастель',
        icon: 'fas fa-palette',
        colors: {
            background: '#f5f7fa',
            gameContainer: 'rgba(240, 245, 255, 0.8)',
            tileColors: {
                '2': { background: '#dbe9f6', text: '#7986cb' },
                '4': { background: '#c5cae9', text: '#5c6bc0' },
                '8': { background: '#b3e5fc', text: '#039be5' },
                '16': { background: '#b2ebf2', text: '#00acc1' },
                '32': { background: '#b2dfdb', text: '#00897b' },
                '64': { background: '#c8e6c9', text: '#43a047' },
                '128': { background: '#dcedc8', text: '#7cb342' },
                '256': { background: '#f0f4c3', text: '#c0ca33' },
                '512': { background: '#fff9c4', text: '#fdd835' },
                '1024': { background: '#ffecb3', text: '#ffb300' },
                '2048': { background: '#ffe0b2', text: '#fb8c00' },
            }
        }
    }
};

// Текущая тема
let currentTheme = 'light';

/**
 * Применение темы по идентификатору
 * @param {string} themeId - Идентификатор темы
 */
function applyTheme(themeId) {
    if (!themes[themeId]) {
        console.error(`Тема "${themeId}" не найдена`);
        return;
    }
    
    const theme = themes[themeId];
    currentTheme = themeId;
    
    // Применение цвета фона
    document.body.style.backgroundColor = theme.colors.background;
    
    // Применение цвета контейнера игры
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
        gameContainer.style.backgroundColor = theme.colors.gameContainer;
    }
    
    // Добавление/удаление класса 'dark-theme' для body
    if (themeId === 'dark' || themeId === 'neon') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    // Обновление цветов плиток
    updateTileColors();
    
    // Сохранение темы в localStorage
    saveTheme();
    
    // Обновление UI кнопок тем
    updateThemeButtonsUI();
}

/**
 * Обновление цветов плиток в соответствии с текущей темой
 */
function updateTileColors() {
    const theme = themes[currentTheme];
    if (!theme) return;
    
    // Создание стилей для плиток
    let styleElement = document.getElementById('theme-tile-styles');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'theme-tile-styles';
        document.head.appendChild(styleElement);
    }
    
    // Генерация CSS для всех плиток
    let css = '';
    Object.entries(theme.colors.tileColors).forEach(([value, colors]) => {
        css += `
        .tile-${value} {
            background-color: ${colors.background};
            color: ${colors.text};
        }
        `;
    });
    
    styleElement.textContent = css;
}

/**
 * Получение следующей темы в списке
 * @returns {string} - Идентификатор следующей темы
 */
function getNextTheme() {
    const themeIds = Object.keys(themes);
    const currentIndex = themeIds.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeIds.length;
    return themeIds[nextIndex];
}

/**
 * Циклическое переключение темы
 */
function cycleTheme() {
    const nextTheme = getNextTheme();
    applyTheme(nextTheme);
}

/**
 * Сохранение текущей темы в localStorage
 */
function saveTheme() {
    try {
        localStorage.setItem('2048_theme', currentTheme);
    } catch (e) {
        console.error('Ошибка при сохранении темы:', e);
    }
}

/**
 * Загрузка сохраненной темы из localStorage
 */
function loadSavedTheme() {
    try {
        const savedTheme = localStorage.getItem('2048_theme');
        if (savedTheme && themes[savedTheme]) {
            currentTheme = savedTheme;
        }
    } catch (e) {
        console.error('Ошибка при загрузке темы:', e);
    }
    
    // Применение текущей темы
    applyTheme(currentTheme);
}

/**
 * Создание селектора тем в указанном контейнере
 * @param {string} containerId - ID контейнера для размещения кнопок тем
 */
function createThemeSelector(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Очистка контейнера
    container.innerHTML = '';
    
    // Создание кнопок для каждой темы
    Object.entries(themes).forEach(([themeId, theme]) => {
        const button = document.createElement('button');
        button.classList.add('theme-button');
        button.dataset.theme = themeId;
        button.setAttribute('aria-label', theme.name);
        button.title = theme.name;
        
        // Добавление иконки
        const icon = document.createElement('i');
        icon.className = theme.icon;
        button.appendChild(icon);
        
        // Добавление обработчика клика
        button.addEventListener('click', () => applyTheme(themeId));
        
        // Добавление кнопки в контейнер
        container.appendChild(button);
    });
    
    // Обновление UI
    updateThemeButtonsUI();
}

/**
 * Обновление UI кнопок тем
 */
function updateThemeButtonsUI() {
    const themeButtons = document.querySelectorAll('.theme-button');
    themeButtons.forEach(button => {
        if (button.dataset.theme === currentTheme) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

/**
 * Инициализация модуля тем
 */
function initThemes() {
    // Загрузка сохраненной темы
    loadSavedTheme();
    
    // Создание селектора тем
    createThemeSelector('theme-selector-container');
}

// При загрузке страницы
document.addEventListener('DOMContentLoaded', initThemes);

// Экспорт функций
window.applyTheme = applyTheme;
window.cycleTheme = cycleTheme;
window.themes = themes;
window.currentTheme = () => currentTheme;