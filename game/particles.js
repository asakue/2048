/**
 * Система частиц для визуальных эффектов в игре
 */

// Настройки параметров частиц
const particleSettings = {
    count: 12,           // Количество частиц по умолчанию
    duration: 800,       // Длительность жизни частицы (мс)
    colors: {            // Цвета частиц в зависимости от значения плитки
        '2': '#eee4da',
        '4': '#ede0c8',
        '8': '#f2b179',
        '16': '#f59563',
        '32': '#f67c5f',
        '64': '#f65e3b',
        '128': '#edcf72',
        '256': '#edcc61',
        '512': '#edc850',
        '1024': '#edc53f',
        '2048': '#edc22e'
    },
    defaultColor: '#8f7a66'  // Цвет по умолчанию
};

/**
 * Создаёт частицы для плитки при слиянии
 * @param {HTMLElement} tile - DOM-элемент плитки
 * @param {string} direction - Направление движения
 */
function createParticlesForTile(tile, direction) {
    if (!tile) return;
    
    const rect = tile.getBoundingClientRect();
    const value = parseInt(tile.dataset.value) || 0;
    const color = particleSettings.colors[value] || particleSettings.defaultColor;
    
    // Количество частиц зависит от значения плитки (больше для больших значений)
    const particleCount = Math.min(Math.max(8, Math.log2(value) * 2), 20);
    
    // Создаем частицы
    for (let i = 0; i < particleCount; i++) {
        createParticle(rect, color, direction, value);
    }
}

/**
 * Создает одну частицу с заданными параметрами
 * @param {DOMRect} rect - Размеры и положение элемента
 * @param {string} color - Цвет частицы
 * @param {string} direction - Направление движения
 * @param {number} value - Значение плитки
 */
function createParticle(rect, color, direction, value) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Центр плитки
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Случайное положение частицы в пределах плитки
    let x, y;
    
    // Больше частиц в направлении движения
    if (direction === 'left' || direction === 'right') {
        const isLeft = direction === 'left';
        x = centerX + (isLeft ? -1 : 1) * (Math.random() * 0.7 + 0.3) * rect.width / 2;
        y = centerY + (Math.random() - 0.5) * rect.height * 0.8;
    } else {
        const isUp = direction === 'up';
        x = centerX + (Math.random() - 0.5) * rect.width * 0.8;
        y = centerY + (isUp ? -1 : 1) * (Math.random() * 0.7 + 0.3) * rect.height / 2;
    }
    
    // Случайный размер частицы (больше для больших значений)
    const size = 4 + Math.random() * 8 + Math.min(Math.log2(value) * 0.5, 4);
    
    // Скорость и направление движения (случайные отклонения)
    const velocityX = (Math.random() - 0.5) * 2;
    const velocityY = (Math.random() - 0.5) * 2;
    
    // Начальное время
    const startTime = performance.now();
    
    // Настройка стилей частицы
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    
    // Добавляем случайную прозрачность и поворот
    particle.style.opacity = 0.5 + Math.random() * 0.5;
    particle.style.transform = `rotate(${Math.random() * 360}deg)`;
    
    // Добавляем в DOM
    document.body.appendChild(particle);
    
    // Анимируем движение
    function updateParticle() {
        const now = performance.now();
        const elapsed = now - startTime;
        const progress = elapsed / particleSettings.duration;
        
        if (progress >= 1) {
            particle.remove();
            return;
        }
        
        // Нелинейное уменьшение прозрачности
        particle.style.opacity = (1 - progress) * (0.5 + Math.random() * 0.5);
        
        // Движение частицы
        const currentX = parseFloat(particle.style.left);
        const currentY = parseFloat(particle.style.top);
        
        particle.style.left = `${currentX + velocityX * 2}px`;
        particle.style.top = `${currentY + velocityY * 2 + progress * 2}px`; // Добавляем гравитацию
        
        // Плавное уменьшение размера
        const currentSize = size * (1 - progress * 0.5);
        particle.style.width = `${currentSize}px`;
        particle.style.height = `${currentSize}px`;
        
        requestAnimationFrame(updateParticle);
    }
    
    requestAnimationFrame(updateParticle);
}

/**
 * Создает эффект "взрыва" частиц в указанной позиции
 * @param {number} x - X координата центра взрыва
 * @param {number} y - Y координата центра взрыва
 * @param {string} color - Цвет частиц
 * @param {number} count - Количество частиц
 */
function createParticleBurst(x, y, color = '#ffcc00', count = 20) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Случайный размер частицы
        const size = 3 + Math.random() * 7;
        
        // Настройка стилей частицы
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.opacity = 0.7 + Math.random() * 0.3;
        particle.style.borderRadius = '50%';
        
        document.body.appendChild(particle);
        
        // Случайное направление движения
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        // Анимация
        let opacity = 1;
        const animate = () => {
            const currentX = parseFloat(particle.style.left);
            const currentY = parseFloat(particle.style.top);
            
            opacity -= 0.02;
            if (opacity <= 0) {
                particle.remove();
                return;
            }
            
            particle.style.left = `${currentX + vx}px`;
            particle.style.top = `${currentY + vy}px`;
            particle.style.opacity = opacity;
            
            requestAnimationFrame(animate);
        };
        
        requestAnimationFrame(animate);
    }
}

// Экспорт функций для доступа из других модулей
window.createParticlesForTile = createParticlesForTile;
window.createParticleBurst = createParticleBurst;
