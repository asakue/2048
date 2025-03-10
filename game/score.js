let score = 0;
let bestScore = parseInt(localStorage.getItem('bestScore')) || 0;

function updateScore(points) {
    score += points;
    document.getElementById('score').querySelector('span').textContent = score;
    
    const scoreElement = document.querySelector('.score');
    scoreElement.classList.add('updated');
    setTimeout(() => scoreElement.classList.remove('updated'), 300);
    
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
        document.getElementById('best-score').querySelector('span').textContent = bestScore;
        
        const bestScoreElement = document.querySelector('.best-score');
        bestScoreElement.classList.add('updated');
        setTimeout(() => bestScoreElement.classList.remove('updated'), 300);
    }
}

function resetScore() {
    score = 0;
    document.getElementById('score').querySelector('span').textContent = '0';
}

function initializeScores() {
    document.getElementById('score').querySelector('span').textContent = '0';
    document.getElementById('best-score').querySelector('span').textContent = bestScore;
}