/**
 * Модуль для управления звуковыми эффектами в игре
 */

// Звуки игры
const sounds = {
    merge: {},   // Звуки слияния плиток
    move: null,  // Звук перемещения
    error: null, // Звук ошибки (невозможный ход)
    win: null,   // Звук победы
    gameOver: null // Звук окончания игры
};

// Настройки звука
let soundEnabled = true; // Звук включен по умолчанию
let volume = 0.5; // Громкость от 0 до 1

/**
 * Инициализация аудио-системы
 */
function initAudio() {
    // Загрузка настроек
    loadSoundSettings();
    
    // Создание звука перемещения
    sounds.move = new Audio();
    sounds.move.src = '/sounds/move.mp3';
    sounds.move.volume = volume;
    
    // Создание звука ошибки
    sounds.error = new Audio();
    sounds.error.src = '/sounds/error.mp3';
    sounds.error.volume = volume;
    
    // Создание звука победы
    sounds.win = new Audio();
    sounds.win.src = '/sounds/win.mp3';
    sounds.win.volume = volume;
    
    // Создание звука окончания игры
    sounds.gameOver = new Audio();
    sounds.gameOver.src = '/sounds/game-over.mp3';
    sounds.gameOver.volume = volume;
    
    // Создание звуков слияния для разных значений плиток
    const baseValues = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];
    baseValues.forEach(value => {
        sounds.merge[value] = new Audio();
        sounds.merge[value].src = `/sounds/merge-${value}.mp3`;
        sounds.merge[value].volume = volume;
    });
    
    // Установка начального состояния кнопки звука
    updateSoundButtonUI();
    
    // Добавление обработчика клика для кнопки звука
    const soundToggleBtn = document.getElementById('sound-toggle');
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', toggleSound);
    }
}

/**
 * Загрузка настроек звука из localStorage
 */
function loadSoundSettings() {
    try {
        const savedSettings = localStorage.getItem('2048_sound_settings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            soundEnabled = settings.enabled;
            volume = settings.volume;
        }
    } catch (e) {
        console.error('Ошибка при загрузке настроек звука:', e);
        soundEnabled = true; // По умолчанию звук включен
        volume = 0.5;
    }
}

/**
 * Сохранение настроек звука в localStorage
 */
function saveSoundSettings() {
    try {
        const settings = {
            enabled: soundEnabled,
            volume: volume
        };
        localStorage.setItem('2048_sound_settings', JSON.stringify(settings));
    } catch (e) {
        console.error('Ошибка при сохранении настроек звука:', e);
    }
}

/**
 * Переключение состояния звука
 */
function toggleSound() {
    soundEnabled = !soundEnabled;
    
    // Анимация кнопки
    const soundToggleBtn = document.getElementById('sound-toggle');
    if (soundToggleBtn) {
        soundToggleBtn.classList.add('sound-wave');
        setTimeout(() => {
            soundToggleBtn.classList.remove('sound-wave');
        }, 500);
    }
    
    // Обновление UI
    updateSoundButtonUI();
    
    // Сохранение настроек
    saveSoundSettings();
}

/**
 * Обновление UI кнопки звука в соответствии с текущим состоянием
 */
function updateSoundButtonUI() {
    const soundToggleBtn = document.getElementById('sound-toggle');
    if (!soundToggleBtn) return;
    
    const iconEl = soundToggleBtn.querySelector('i');
    
    if (soundEnabled) {
        soundToggleBtn.classList.add('active');
        if (iconEl) {
            iconEl.className = 'fas fa-volume-up';
        }
        soundToggleBtn.setAttribute('aria-label', 'Выключить звук');
    } else {
        soundToggleBtn.classList.remove('active');
        if (iconEl) {
            iconEl.className = 'fas fa-volume-mute';
        }
        soundToggleBtn.setAttribute('aria-label', 'Включить звук');
    }
}

/**
 * Установка громкости звука
 * @param {number} value - Громкость от 0 до 1
 */
function setVolume(value) {
    volume = Math.max(0, Math.min(1, value));
    
    // Обновление громкости для всех звуков
    if (sounds.move) sounds.move.volume = volume;
    if (sounds.error) sounds.error.volume = volume;
    if (sounds.win) sounds.win.volume = volume;
    if (sounds.gameOver) sounds.gameOver.volume = volume;
    
    Object.values(sounds.merge).forEach(sound => {
        if (sound) sound.volume = volume;
    });
    
    // Сохранение настроек
    saveSoundSettings();
}

/**
 * Воспроизведение звука слияния плиток
 * @param {number} value - Значение плитки
 */
function playMergeSound(value = 2) {
    if (!soundEnabled) return;
    
    // Убедимся, что значение есть в sounds.merge
    const closestValue = findClosestMergeSound(value);
    
    if (sounds.merge[closestValue]) {
        // Клонируем аудио для возможности одновременного воспроизведения
        const sound = sounds.merge[closestValue].cloneNode();
        sound.volume = volume;
        sound.play().catch(e => console.error('Ошибка воспроизведения звука:', e));
    }
}

/**
 * Найти ближайшее доступное значение для звука слияния
 * @param {number} value - Значение плитки
 * @returns {number} - Ближайшее доступное значение
 */
function findClosestMergeSound(value) {
    const availableValues = Object.keys(sounds.merge).map(Number);
    if (availableValues.includes(value)) return value;
    
    // Находим ближайшее значение, которое меньше или равно
    const closestValue = availableValues
        .filter(v => v <= value)
        .sort((a, b) => b - a)[0] || availableValues[0];
        
    return closestValue;
}

/**
 * Воспроизведение звука перемещения
 */
function playMoveSound() {
    if (!soundEnabled || !sounds.move) return;
    
    sounds.move.currentTime = 0;
    sounds.move.play().catch(e => console.error('Ошибка воспроизведения звука:', e));
}

/**
 * Воспроизведение звука ошибки
 */
function playErrorSound() {
    if (!soundEnabled || !sounds.error) return;
    
    sounds.error.currentTime = 0;
    sounds.error.play().catch(e => console.error('Ошибка воспроизведения звука:', e));
}

/**
 * Воспроизведение звука победы
 */
function playWinSound() {
    if (!soundEnabled || !sounds.win) return;
    
    sounds.win.currentTime = 0;
    sounds.win.play().catch(e => console.error('Ошибка воспроизведения звука:', e));
}

/**
 * Воспроизведение звука окончания игры
 */
function playGameOverSound() {
    if (!soundEnabled || !sounds.gameOver) return;
    
    sounds.gameOver.currentTime = 0;
    sounds.gameOver.play().catch(e => console.error('Ошибка воспроизведения звука:', e));
}

/**
 * Воспроизведение звука определенного типа
 * @param {string} type - Тип звука ('move', 'error', 'win', 'gameOver')
 * @param {number} value - Значение плитки (только для 'merge')
 */
function playSound(type, value) {
    if (!soundEnabled) return;
    
    switch (type) {
        case 'merge':
            playMergeSound(value);
            break;
        case 'move':
            playMoveSound();
            break;
        case 'error':
            playErrorSound();
            break;
        case 'win':
            playWinSound();
            break;
        case 'gameOver':
            playGameOverSound();
            break;
    }
}

// При загрузке страницы
document.addEventListener('DOMContentLoaded', initAudio);

// Экспорт функций
window.playSound = playSound;
window.toggleSound = toggleSound;
window.setVolume = setVolume;