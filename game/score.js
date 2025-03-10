let score = 0;
let bestScore = localStorage.getItem('bestScore') || 0;
const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('best-score');


function updateScore(points) {
    score += points;
    scoreElement.textContent = score;
    scoreElement.classList.add('updated'); 
    setTimeout(() => scoreElement.classList.remove('updated'), 300);
    updateBestScore();
}

function updateBestScore() {
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
    }
    bestScoreElement.textContent = bestScore;
}

function resetScore() {
    score = 0;
    scoreElement.textContent = 0;
}

function resetBestScore() {
    bestScore = 0;
    localStorage.setItem('bestScore', bestScore);
    bestScoreElement.textContent = bestScore;
}