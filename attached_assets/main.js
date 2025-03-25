// main.js
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация элементов управления
    const resetButton = document.getElementById('reset');
    const undoButton = document.getElementById('undo');
    const themeToggle = document.getElementById('theme-toggle');

    // Инициализация игры
    function startGame() {
        // Сброс игрового поля
        for (let y = 0; y < 4; y++) {
            boardMatrix[y].fill(0);
        }

        // Сброс истории и счёта
        moveHistory = [];
        resetScore();

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
        if (document.body.classList.contains('game-over')) return;

        switch (event.key) {
            case 'ArrowLeft':
                moveLeft();
                break;
            case 'ArrowRight':
                moveRight();
                break;
            case 'ArrowUp':
                moveUp();
                break;
            case 'ArrowDown':
                moveDown();
                break;
        }
    }

    // Переключение темы
    function toggleTheme() {
        const isDark = document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        const icon = themeToggle.querySelector('i');
        icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Инициализация обработчиков событий
    function initializeEventListeners() {
        resetButton.addEventListener('click', startGame);
        undoButton.addEventListener('click', undoMove);
        themeToggle.addEventListener('click', toggleTheme);
        document.addEventListener('keydown', handleKeyPress);
    }

    // Загрузка сохранённых настроек
    function loadSettings() {
        // Тема
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.querySelector('i').className = 'fas fa-sun';
        }

        // Рекорд
        initializeScores();
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

    // Запуск игры
    function initializeGame() {
        checkLocalStorage();
        loadSettings();
        initializeEventListeners();
        startGame();
    }

    // Инициализация приложения
    initializeGame();
});