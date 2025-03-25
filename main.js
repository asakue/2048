// main.js
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация элементов управления
    const resetButton = document.getElementById('reset');
    const undoButton = document.getElementById('undo');
    const themeToggle = document.getElementById('theme-toggle');
    
    // Состояние игры
    let gameActive = true;
    
    // Флаг первого взаимодействия с игрой
    let firstInteraction = true;

    // Инициализация игры
    function startGame() {
        // Сброс игрового поля
        for (let y = 0; y < 4; y++) {
            boardMatrix[y].fill(0);
        }

        // Сброс истории и счёта
        moveHistory = [];
        resetScore();
        gameActive = true;

        // Удаление оверлея "Игра окончена"
        const overlay = document.querySelector('.game-over-overlay');
        if (overlay) overlay.remove();

        // Добавление начальных плиток
        addNewTile();
        addNewTile();
        renderBoard();
    }

    // Обработка нажатий клавиш
    function handleKeyPress(event) {
        if (!gameActive) return;

        // Скрытие подсказки по управлению в нижней части экрана при первом взаимодействии
        if (firstInteraction) {
            firstInteraction = false;
            
            // Скрытие подсказки по управлению в нижней части экрана
            const controlHints = document.querySelectorAll('.control-hint');
            controlHints.forEach(hint => {
                hint.style.opacity = '0.5';
            });
        }

        let moved = false;
        
        switch (event.key) {
            case 'ArrowLeft':
                moved = moveLeft();
                if (moved && window.playSound) {
                    window.playSound('move');
                } else if (!moved && window.playSound) {
                    window.playSound('error');
                }
                break;
            case 'ArrowRight':
                moved = moveRight();
                if (moved && window.playSound) {
                    window.playSound('move');
                } else if (!moved && window.playSound) {
                    window.playSound('error');
                }
                break;
            case 'ArrowUp':
                moved = moveUp();
                if (moved && window.playSound) {
                    window.playSound('move');
                } else if (!moved && window.playSound) {
                    window.playSound('error');
                }
                break;
            case 'ArrowDown':
                moved = moveDown();
                if (moved && window.playSound) {
                    window.playSound('move');
                } else if (!moved && window.playSound) {
                    window.playSound('error');
                }
                break;
        }
    }

    // Переключение темы
    function toggleTheme() {
        // Используем функцию cycleTheme из модуля themes.js
        if (window.cycleTheme) {
            window.cycleTheme();
        } else {
            // Для обратной совместимости - базовое переключение темы
            const isDark = document.body.classList.toggle('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');

            const icon = themeToggle.querySelector('i');
            icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
            
            // Анимация перехода
            document.body.style.transition = 'background 0.5s ease, color 0.5s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 500);
        }
    }

    // Инициализация обработчиков событий
    function initializeEventListeners() {
        resetButton.addEventListener('click', () => {
            createRipple(resetButton);
            
            // Воспроизведение звука при клике, если доступно
            if (window.playSound) {
                window.playSound('move');
            }
            
            startGame();
        });
        
        undoButton.addEventListener('click', () => {
            createRipple(undoButton);
            undoMove();
        });
        
        themeToggle.addEventListener('click', () => {
            createRipple(themeToggle);
            toggleTheme();
        });
        
        // Добавляем обработчики для кнопок звука и анимированного фона
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle && window.toggleSound) {
            soundToggle.addEventListener('click', () => {
                createRipple(soundToggle);
                window.toggleSound();
            });
        }
        
        const bgToggle = document.getElementById('bg-toggle');
        if (bgToggle && window.toggleBackgroundAnimation) {
            bgToggle.addEventListener('click', () => {
                createRipple(bgToggle);
                window.toggleBackgroundAnimation();
            });
        }
        
        document.addEventListener('keydown', handleKeyPress);
    }

    // Загрузка сохранённых настроек
    function loadSettings() {
        // Настройки темы теперь загружаются в themes.js
        // Для совместимости со старой версией:
        if (!window.themes) {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-theme');
                themeToggle.querySelector('i').className = 'fas fa-sun';
            }
        }

        // Рекорд
        initializeScores();
    }

    // Создание эффекта "волны" при клике на кнопки
    function createRipple(button) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        button.appendChild(ripple);

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${rect.width / 2 - size / 2}px`;
        ripple.style.top = `${rect.height / 2 - size / 2}px`;

        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }

    // Проверка поддержки LocalStorage
    function checkLocalStorage() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            console.warn('LocalStorage недоступен!');
            return false;
        }
    }

    // Проверка достижения плитки 2048
    function check2048Achievement() {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (boardMatrix[y][x] === 2048) {
                    celebrate2048();
                    break;
                }
            }
        }
    }

    // Празднование достижения 2048
    function celebrate2048() {
        // Проверяем, не праздновали ли мы уже
        if (localStorage.getItem('celebrated2048') === 'true') {
            return;
        }
        
        // Создаем эффект конфетти
        createConfetti();
        
        // Воспроизведение звука победы
        if (window.playSound) {
            window.playSound('win');
        }
        
        // Показываем поздравительное сообщение
        const container = document.querySelector('.container');
        const celebrationMessage = document.createElement('div');
        celebrationMessage.classList.add('celebration-message', 'glass-effect');
        celebrationMessage.innerHTML = `
            <h2>Поздравляем!</h2>
            <p>Вы достигли плитки 2048!</p>
            <p>Можете продолжать игру, чтобы получить еще более высокие плитки!</p>
            <button class="glow-effect" id="continue-playing">Продолжить</button>
        `;
        
        container.appendChild(celebrationMessage);
        
        // Анимация появления сообщения
        setTimeout(() => {
            celebrationMessage.style.opacity = '1';
            celebrationMessage.style.transform = 'scale(1)';
        }, 10);
        
        // Обработчик для кнопки "Продолжить"
        const continueButton = document.getElementById('continue-playing');
        continueButton.addEventListener('click', () => {
            createRipple(continueButton);
            celebrationMessage.style.opacity = '0';
            celebrationMessage.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                celebrationMessage.remove();
            }, 300);
        });
        
        // Отмечаем, что уже праздновали
        localStorage.setItem('celebrated2048', 'true');
    }

    // Создание эффекта конфетти
    function createConfetti() {
        const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a18cd1', '#ff8c69'];
        const confettiCount = 100;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            // Случайный цвет
            const color = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.backgroundColor = color;
            
            // Случайное положение
            const left = Math.random() * 100;
            confetti.style.left = `${left}vw`;
            
            // Случайная задержка
            const delay = Math.random() * 2;
            confetti.style.animationDelay = `${delay}s`;

            document.body.appendChild(confetti);
            
            // Удаление после анимации
            confetti.addEventListener('animationend', () => {
                confetti.remove();
            });
        }
    }

    // Запуск игры
    function initializeGame() {
        checkLocalStorage();
        
        // Инициализация звука, если функция доступна
        if (window.initAudio) {
            window.initAudio();
        }
        
        // Инициализация тем, если функция доступна
        if (window.initThemes) {
            window.initThemes();
            // Создание селектора тем в контейнере
            if (window.createThemeSelector) {
                window.createThemeSelector('theme-selector-container');
            }
        }
        
        // Инициализация анимированного фона, если функция доступна
        if (window.initAnimatedBackground) {
            window.initAnimatedBackground();
        }
        
        loadSettings();
        initializeEventListeners();
        startGame();

        // Интеграция функции playSound с событием игры окончена
        if (window.showGameOver && window.playSound) {
            const originalShowGameOver = window.showGameOver;
            window.showGameOver = function() {
                originalShowGameOver();
                window.playSound('gameOver');
            };
        }
        
        // Интеграция проверки 2048 с функцией finalizeMove
        const originalFinalizeMove = window.finalizeMove;
        window.finalizeMove = function(points) {
            originalFinalizeMove(points);
            check2048Achievement();
            
            // Воспроизведение звука победы при достижении 2048
            if (points >= 2048 && window.playSound) {
                window.playSound('win');
            }
        };
        
        // Обработка первого взаимодействия с игрой 
        // При любом взаимодействии: клик, тач, клавиатура
        const handleFirstInteraction = function() {
            if (firstInteraction) {
                firstInteraction = false;
                
                // Скрытие подсказки по управлению в нижней части экрана
                const controlHints = document.querySelectorAll('.control-hint');
                controlHints.forEach(hint => {
                    hint.style.opacity = '0.5';
                });
                
                // Удаляем все обработчики, которые следили за первым взаимодействием
                document.removeEventListener('touchstart', handleFirstInteraction);
                document.removeEventListener('click', handleFirstInteraction);
                document.removeEventListener('keydown', handleFirstInteraction);
                document.removeEventListener('mousemove', handleFirstInteraction);
            }
        };
        
        // Добавляем различные обработчики для первого взаимодействия
        document.addEventListener('touchstart', handleFirstInteraction);
        document.addEventListener('click', handleFirstInteraction);
        document.addEventListener('keydown', handleFirstInteraction);
        document.addEventListener('mousemove', handleFirstInteraction);
    }

    // Инициализация приложения
    initializeGame();
});
