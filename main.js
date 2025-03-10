document.addEventListener('DOMContentLoaded', () => {
    const resetButton = document.getElementById('reset');
    const undoButton = document.getElementById('undo');
    const themeToggle = document.getElementById('theme-toggle');
    
    function startGame() {
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                boardMatrix[y][x] = 0;
            }
        }
        
        moveHistory = [];
        resetScore();
        
        const overlay = document.querySelector('.game-over-overlay');
        if (overlay) overlay.remove();
        
        addNewTile();
        addNewTile();
        renderBoard();
    }
    
    function handleKeyPress(event) {
        switch(event.key) {
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
    
    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = document.body.classList.contains('dark-theme') ? 
                'fas fa-sun' : 'fas fa-moon';
        }
    }
    
    // Initialize
    resetButton.addEventListener('click', startGame);
    undoButton.addEventListener('click', undoMove);
    themeToggle.addEventListener('click', toggleTheme);
    document.addEventListener('keydown', handleKeyPress);
    
    // Load saved theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.querySelector('i').className = 'fas fa-sun';
    }
    
    initializeScores();
    startGame();
});