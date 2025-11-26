// Grid configuration
const COLS = 10;
const ROWS = 20;
const DANGER_LINE = 16; // 80% full
const BLOCK_SIZE = 30;

// Color intensity mapping - blocks now have meaning!
const INTENSITY_COLORS = {
    blue: { name: 'Low Impact', co2: 0.01, intensity: 'low', score: 10 },
    green: { name: 'Sustainable', co2: -0.02, intensity: 'eco', score: 25 },
    yellow: { name: 'Moderate', co2: 0.05, intensity: 'moderate', score: 5 },
    red: { name: 'High Impact', co2: 0.15, intensity: 'high', score: -5 }
};

// Tetromino shapes with color-intensity mapping
const SHAPES = {
    I: { shape: [[1, 1, 1, 1]], color: 'blue', benefit: 'efficient' },
    O: { shape: [[1, 1], [1, 1]], color: 'yellow', benefit: 'standard' },
    T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'green', benefit: 'optimized' },
    S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'green', benefit: 'eco' },
    Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'red', benefit: 'heavy' },
    J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'blue', benefit: 'efficient' },
    L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'yellow', benefit: 'standard' }
};

// Game state
let grid = [];
let currentPiece = null;
let nextPiece = null;
let gameActive = false;
let gamePaused = false;
let gameLoop = null;
let dropInterval = 1000;
let lastDropTime = 0;

// Stats
let score = 800; // User's current score
let level = 1;
let linesCleared = 0;
let totalBlocks = 0;
let co2Impact = 0;
let co2Saved = 0;
let requestsToday = 0;

// AI Usage tracking for graphs
let usageHistory = {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [25, 38, 22, 35, 55, 30, 18], // Starting data
    currentDay: 6
};

// CO2 Savings by action type
let co2SavingsByAction = {
    'Optimized\nPrompts': 23.4,
    'Library\nPrompts': 16.6,
    'Complete\nTour': 9.4,
    'Use Eco\nAlternative': 5.4,
    'Achieve x1.5\nEfficiency': 3.0
};

// Leaderboard data
let leaderboard = [
    { name: 'Adrian A.', score: 2522, rank: 1 },
    { name: 'Male B.', score: 1394, rank: 2 },
    { name: 'Mark R.', score: 1024, rank: 3 },
    { name: 'User Name', score: 800, rank: 4, isUser: true },
    { name: 'Krtm C.', score: 579, rank: 5 },
    { name: 'Mttldel L.', score: 424, rank: 6 }
];

// Canvas contexts
let usageChartCtx = null;
let co2ChartCtx = null;

// Activity log
const activities = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeGrid();
    initializeCharts();
    updateUI();
    updateLeaderboard();
    updateRecommendations();
    addActivity('info', 'Welcome! Press SPACE to start the game');
    showInstructions();
});

// Initialize charts
function initializeCharts() {
    const usageCanvas = document.getElementById('usage-chart');
    const co2Canvas = document.getElementById('co2-chart');

    if (usageCanvas && co2Canvas) {
        usageChartCtx = usageCanvas.getContext('2d');
        co2ChartCtx = co2Canvas.getContext('2d');

        drawUsageChart();
        drawCO2Chart();
    }
}

// Draw AI Usage Intensity Chart
function drawUsageChart() {
    if (!usageChartCtx) return;

    const canvas = usageChartCtx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;

    // Clear canvas
    usageChartCtx.clearRect(0, 0, width, height);

    // Background
    usageChartCtx.fillStyle = '#1a1a2e';
    usageChartCtx.fillRect(0, 0, width, height);

    // Grid lines
    usageChartCtx.strokeStyle = '#2a2a3e';
    usageChartCtx.lineWidth = 1;
    for (let i = 0; i <= 6; i++) {
        const y = padding + (i * (height - 2 * padding) / 6);
        usageChartCtx.beginPath();
        usageChartCtx.moveTo(padding, y);
        usageChartCtx.lineTo(width - padding, y);
        usageChartCtx.stroke();
    }

    // Y-axis labels
    usageChartCtx.fillStyle = '#8e8ea0';
    usageChartCtx.font = '10px Arial';
    usageChartCtx.textAlign = 'right';
    for (let i = 0; i <= 6; i++) {
        const y = padding + (i * (height - 2 * padding) / 6);
        const value = 60 - (i * 10);
        usageChartCtx.fillText(value.toString(), padding - 10, y + 4);
    }

    // Danger zone line
    const dangerY = padding + ((60 - 40) * (height - 2 * padding) / 60);
    usageChartCtx.strokeStyle = '#ef4444';
    usageChartCtx.lineWidth = 2;
    usageChartCtx.setLineDash([5, 5]);
    usageChartCtx.beginPath();
    usageChartCtx.moveTo(padding, dangerY);
    usageChartCtx.lineTo(width - padding, dangerY);
    usageChartCtx.stroke();
    usageChartCtx.setLineDash([]);

    // Danger zone label
    usageChartCtx.fillStyle = '#ef4444';
    usageChartCtx.font = 'bold 10px Arial';
    usageChartCtx.textAlign = 'right';
    usageChartCtx.fillText('Danger Zone', width - padding - 10, dangerY - 5);

    // Plot data
    const points = [];
    const stepX = (width - 2 * padding) / (usageHistory.values.length - 1);

    usageHistory.values.forEach((value, index) => {
        const x = padding + (index * stepX);
        const y = padding + ((60 - value) * (height - 2 * padding) / 60);
        points.push({ x, y, value });
    });

    // Draw gradient area under line
    const gradient = usageChartCtx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)');

    usageChartCtx.fillStyle = gradient;
    usageChartCtx.beginPath();
    usageChartCtx.moveTo(points[0].x, height - padding);
    points.forEach(p => usageChartCtx.lineTo(p.x, p.y));
    usageChartCtx.lineTo(points[points.length - 1].x, height - padding);
    usageChartCtx.closePath();
    usageChartCtx.fill();

    // Draw line
    usageChartCtx.strokeStyle = '#10b981';
    usageChartCtx.lineWidth = 3;
    usageChartCtx.beginPath();
    usageChartCtx.moveTo(points[0].x, points[0].y);
    points.forEach(p => usageChartCtx.lineTo(p.x, p.y));
    usageChartCtx.stroke();

    // Draw points
    points.forEach((p, index) => {
        usageChartCtx.fillStyle = index === usageHistory.currentDay ? '#ef4444' : '#10b981';
        usageChartCtx.beginPath();
        usageChartCtx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        usageChartCtx.fill();
    });

    // X-axis labels
    usageChartCtx.fillStyle = '#8e8ea0';
    usageChartCtx.font = '10px Arial';
    usageChartCtx.textAlign = 'center';
    usageHistory.days.forEach((day, index) => {
        const x = padding + (index * stepX);
        usageChartCtx.fillText(day, x, height - padding + 15);
    });
}

// Draw CO2 Saved Bar Chart
function drawCO2Chart() {
    if (!co2ChartCtx) return;

    const canvas = co2ChartCtx.canvas;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;

    // Clear canvas
    co2ChartCtx.clearRect(0, 0, width, height);

    // Background
    co2ChartCtx.fillStyle = '#1a1a2e';
    co2ChartCtx.fillRect(0, 0, width, height);

    const data = Object.entries(co2SavingsByAction);
    const maxValue = Math.max(...data.map(d => d[1]));
    const barWidth = (width - 2 * padding) / data.length - 10;

    // Draw bars
    data.forEach((entry, index) => {
        const [label, value] = entry;
        const barHeight = (value / maxValue) * (height - 2 * padding);
        const x = padding + index * ((width - 2 * padding) / data.length);
        const y = height - padding - barHeight;

        // Bar gradient
        const gradient = co2ChartCtx.createLinearGradient(0, y, 0, height - padding);

        if (index === 0) {
            gradient.addColorStop(0, '#06b6d4');
            gradient.addColorStop(1, '#0891b2');
        } else if (index === 1) {
            gradient.addColorStop(0, '#10b981');
            gradient.addColorStop(1, '#059669');
        } else if (index === 2) {
            gradient.addColorStop(0, '#f59e0b');
            gradient.addColorStop(1, '#d97706');
        } else if (index === 3) {
            gradient.addColorStop(0, '#8b5cf6');
            gradient.addColorStop(1, '#7c3aed');
        } else {
            gradient.addColorStop(0, '#10b981');
            gradient.addColorStop(1, '#059669');
        }

        co2ChartCtx.fillStyle = gradient;
        co2ChartCtx.fillRect(x, y, barWidth, barHeight);

        // Value label on top
        co2ChartCtx.fillStyle = '#ffffff';
        co2ChartCtx.font = 'bold 12px Arial';
        co2ChartCtx.textAlign = 'center';
        co2ChartCtx.fillText(value.toFixed(1), x + barWidth / 2, y - 5);

        // X-axis label
        co2ChartCtx.fillStyle = '#8e8ea0';
        co2ChartCtx.font = '9px Arial';
        const lines = label.split('\n');
        lines.forEach((line, lineIndex) => {
            co2ChartCtx.fillText(line, x + barWidth / 2, height - padding + 15 + (lineIndex * 12));
        });
    });

    // Y-axis labels
    co2ChartCtx.fillStyle = '#8e8ea0';
    co2ChartCtx.font = '10px Arial';
    co2ChartCtx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
        const y = height - padding - (i * (height - 2 * padding) / 4);
        const value = (i * maxValue / 4).toFixed(0);
        co2ChartCtx.fillText(value, padding - 5, y + 4);
    }
}

// Update leaderboard display
function updateLeaderboard() {
    const leaderboardEl = document.getElementById('leaderboard');
    if (!leaderboardEl) return;

    // Update user's score in leaderboard
    const userEntry = leaderboard.find(entry => entry.isUser);
    if (userEntry) {
        userEntry.score = score;

        // Re-sort leaderboard
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard.forEach((entry, index) => {
            entry.rank = index + 1;
        });
    }

    leaderboardEl.innerHTML = leaderboard.map(entry => `
        <div class="leaderboard-item ${entry.isUser ? 'user' : ''}">
            <span class="rank">${entry.rank}</span>
            <span class="name">${entry.name}</span>
            <span class="score">${entry.score}</span>
        </div>
    `).join('');
}

// Update recommendations based on game state
function updateRecommendations() {
    const recommendationsEl = document.getElementById('recommendations');
    if (!recommendationsEl) return;

    const currentHeight = calculateCurrentHeight();
    const heightPercent = (currentHeight / ROWS) * 100;

    let recommendations = [];

    if (heightPercent > 80) {
        recommendations.push({
            icon: '⚠️',
            title: 'Critical Usage Level',
            text: 'Blocks at 80%+ capacity. Use sustainable power-ups immediately!'
        });
    } else if (heightPercent > 60) {
        recommendations.push({
            icon: '⚡',
            title: 'Block Accumulation',
            text: 'Every 5 AI requests = +1 block. Blocks stack.'
        });
    } else {
        recommendations.push({
            icon: '🌱',
            title: 'Optimal Efficiency',
            text: 'Green blocks represent sustainable AI usage patterns.'
        });
    }

    if (linesCleared > 10) {
        recommendations.push({
            icon: '✅',
            title: 'Auto-Clear',
            text: 'Full rows auto-clear, representing perfect efficiency.'
        });
    } else {
        recommendations.push({
            icon: '🎯',
            title: 'Clear Lines',
            text: 'Perform sustainable actions to reduce blocks and save CO₂.'
        });
    }

    recommendationsEl.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item">
            <span class="rec-icon">${rec.icon}</span>
            <div class="rec-content">
                <strong>${rec.title}:</strong> ${rec.text}
            </div>
        </div>
    `).join('');
}

// Calculate current height helper
function calculateCurrentHeight() {
    let currentHeight = 0;
    for (let row = 0; row < ROWS; row++) {
        if (grid[row].some(cell => cell.filled)) {
            currentHeight = ROWS - row;
            break;
        }
    }
    return currentHeight;
}

// Show instructions
function showInstructions() {
    const instructions = `
        🎮 Controls:
        ← → : Move left/right
        ↓ : Soft drop
        ↑ : Rotate piece
        SPACE : Hard drop
        P : Pause/Resume

        🎯 Goal: Clear lines with sustainable actions!

        🎨 Block Colors:
        🔵 Blue = Low Impact (+10 pts, -0.01kg CO₂)
        🟢 Green = Sustainable (+25 pts, -0.02kg CO₂)
        🟡 Yellow = Moderate (+5 pts, +0.05kg CO₂)
        🔴 Red = High Impact (-5 pts, +0.15kg CO₂)
    `;
    console.log(instructions);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameActive && e.code === 'Space') {
        startGame();
        return;
    }

    if (!gameActive || gamePaused) return;

    switch(e.code) {
        case 'ArrowLeft':
            movePiece(-1, 0);
            e.preventDefault();
            break;
        case 'ArrowRight':
            movePiece(1, 0);
            e.preventDefault();
            break;
        case 'ArrowDown':
            movePiece(0, 1);
            e.preventDefault();
            break;
        case 'ArrowUp':
            rotatePiece();
            e.preventDefault();
            break;
        case 'Space':
            hardDrop();
            e.preventDefault();
            break;
        case 'KeyP':
            togglePause();
            e.preventDefault();
            break;
    }
});

// Initialize grid
function initializeGrid() {
    const gridContainer = document.getElementById('tetris-grid');
    gridContainer.innerHTML = '';

    for (let row = 0; row < ROWS; row++) {
        grid[row] = [];
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement('div');
            cell.className = 'tetris-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            gridContainer.appendChild(cell);
            grid[row][col] = {
                element: cell,
                filled: false,
                color: null,
                intensity: null
            };
        }
    }
}

// Start game
function startGame() {
    if (gameActive) return;

    gameActive = true;
    gamePaused = false;
    level = 1;
    linesCleared = 0;
    totalBlocks = 0;
    requestsToday = 0;

    // Clear grid
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            clearCell(row, col);
        }
    }

    activities.length = 0;
    addActivity('info', 'Game started! Watch the graphs update in real-time!');

    spawnNewPiece();
    updateUI();
    gameLoop = requestAnimationFrame(update);
}

// Game loop
function update(currentTime) {
    if (!gameActive) return;

    if (gamePaused) {
        gameLoop = requestAnimationFrame(update);
        return;
    }

    if (currentTime - lastDropTime > dropInterval) {
        if (!movePiece(0, 1)) {
            lockPiece();
            checkLines();
            spawnNewPiece();

            if (checkGameOver()) {
                endGame();
                return;
            }
        }
        lastDropTime = currentTime;
    }

    gameLoop = requestAnimationFrame(update);
}

// Create new piece
function createPiece() {
    const shapeKeys = Object.keys(SHAPES);
    const randomKey = shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
    const shapeData = SHAPES[randomKey];

    return {
        shape: shapeData.shape,
        color: shapeData.color,
        benefit: shapeData.benefit,
        type: randomKey,
        x: Math.floor(COLS / 2) - Math.floor(shapeData.shape[0].length / 2),
        y: 0
    };
}

// Spawn new piece
function spawnNewPiece() {
    if (nextPiece) {
        currentPiece = nextPiece;
    } else {
        currentPiece = createPiece();
    }
    nextPiece = createPiece();

    totalBlocks++;
    requestsToday++;

    // Update AI usage based on block color
    const colorData = INTENSITY_COLORS[currentPiece.color];
    co2Impact += colorData.co2;

    // Update usage graph dynamically
    const currentValue = usageHistory.values[usageHistory.currentDay];
    const change = colorData.co2 > 0 ? 5 : -2;
    usageHistory.values[usageHistory.currentDay] = Math.max(0, Math.min(60, currentValue + change));

    drawUsageChart();
    drawPiece();
    updateUI();
}

// Draw current piece
function drawPiece() {
    if (!currentPiece) return;

    // Clear previous preview
    document.querySelectorAll('.tetris-cell.preview').forEach(cell => {
        cell.classList.remove('preview');
        cell.style.backgroundColor = '';
    });

    // Draw piece
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                const gridY = currentPiece.y + y;
                const gridX = currentPiece.x + x;
                if (gridY >= 0 && gridY < ROWS && gridX >= 0 && gridX < COLS) {
                    const cell = grid[gridY][gridX].element;
                    cell.classList.add('preview');
                    cell.style.backgroundColor = currentPiece.color;
                }
            }
        });
    });
}

// Clear piece from display
function clearPieceDisplay() {
    document.querySelectorAll('.tetris-cell.preview').forEach(cell => {
        cell.classList.remove('preview');
        cell.style.backgroundColor = '';
    });
}

// Move piece
function movePiece(dx, dy) {
    if (!currentPiece) return false;

    clearPieceDisplay();

    currentPiece.x += dx;
    currentPiece.y += dy;

    if (checkCollision()) {
        currentPiece.x -= dx;
        currentPiece.y -= dy;
        drawPiece();
        return false;
    }

    drawPiece();
    return true;
}

// Hard drop
function hardDrop() {
    if (!currentPiece) return;

    let dropDistance = 0;
    while (movePiece(0, 1)) {
        dropDistance++;
    }

    const colorData = INTENSITY_COLORS[currentPiece.color];
    score += dropDistance * 2 + colorData.score;

    lockPiece();
    checkLines();
    spawnNewPiece();

    if (checkGameOver()) {
        endGame();
    }
}

// Rotate piece
function rotatePiece() {
    if (!currentPiece) return;

    clearPieceDisplay();

    const oldShape = currentPiece.shape;
    currentPiece.shape = rotateMatrix(currentPiece.shape);

    if (checkCollision()) {
        // Try wall kicks
        const kicks = [
            [1, 0], [-1, 0], [2, 0], [-2, 0],
            [0, -1], [1, -1], [-1, -1]
        ];

        let kicked = false;
        for (const [dx, dy] of kicks) {
            currentPiece.x += dx;
            currentPiece.y += dy;
            if (!checkCollision()) {
                kicked = true;
                break;
            }
            currentPiece.x -= dx;
            currentPiece.y -= dy;
        }

        if (!kicked) {
            currentPiece.shape = oldShape;
        }
    }

    drawPiece();
}

// Rotate matrix
function rotateMatrix(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const rotated = [];

    for (let col = 0; col < cols; col++) {
        rotated[col] = [];
        for (let row = rows - 1; row >= 0; row--) {
            rotated[col].push(matrix[row][col]);
        }
    }

    return rotated;
}

// Check collision
function checkCollision() {
    if (!currentPiece) return false;

    for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x]) {
                const gridY = currentPiece.y + y;
                const gridX = currentPiece.x + x;

                // Check bounds
                if (gridX < 0 || gridX >= COLS || gridY >= ROWS) {
                    return true;
                }

                // Check filled cells
                if (gridY >= 0 && grid[gridY][gridX].filled) {
                    return true;
                }
            }
        }
    }

    return false;
}

// Lock piece to grid
function lockPiece() {
    if (!currentPiece) return;

    clearPieceDisplay();

    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                const gridY = currentPiece.y + y;
                const gridX = currentPiece.x + x;
                if (gridY >= 0 && gridY < ROWS && gridX >= 0 && gridX < COLS) {
                    fillCell(gridY, gridX, currentPiece.color, currentPiece.benefit);
                }
            }
        });
    });

    currentPiece = null;
}

// Fill a cell
function fillCell(row, col, color, intensity) {
    grid[row][col].filled = true;
    grid[row][col].color = color;
    grid[row][col].intensity = intensity;
    grid[row][col].element.classList.add('filled');
    grid[row][col].element.classList.remove('preview');
    grid[row][col].element.style.backgroundColor = color;
}

// Clear a cell
function clearCell(row, col) {
    grid[row][col].filled = false;
    grid[row][col].color = null;
    grid[row][col].intensity = null;
    grid[row][col].element.classList.remove('filled', 'preview', 'cleared');
    grid[row][col].element.style.backgroundColor = '';
}

// Check and clear completed lines
function checkLines() {
    let linesFound = [];

    for (let row = 0; row < ROWS; row++) {
        if (grid[row].every(cell => cell.filled)) {
            linesFound.push(row);
        }
    }

    if (linesFound.length > 0) {
        clearLines(linesFound);
    }
}

// Clear lines
function clearLines(rows) {
    // Animate clearing
    rows.forEach(row => {
        grid[row].forEach(cell => {
            cell.element.classList.add('cleared');
        });
    });

    // Calculate score
    const linePoints = [0, 100, 300, 500, 800];
    const points = linePoints[Math.min(rows.length, 4)] * level;
    score += points;
    linesCleared += rows.length;

    // Update level
    level = Math.floor(linesCleared / 10) + 1;
    dropInterval = Math.max(100, 1000 - (level - 1) * 100);

    // Update CO2 savings
    const co2Reduction = rows.length * 0.5;
    co2Saved += co2Reduction;
    co2Impact = Math.max(0, co2Impact - co2Reduction);

    // Log activity
    addActivity('cleared', `Cleared ${rows.length} line(s)! +${points} points, -${co2Reduction.toFixed(1)}kg CO₂`);

    // After animation, actually clear
    setTimeout(() => {
        rows.forEach(row => {
            grid[row].forEach((cell, col) => {
                clearCell(row, col);
            });
        });

        // Drop blocks above
        dropBlocks(rows);
        updateUI();
        updateLeaderboard();
        updateRecommendations();

        // Update usage graph when lines cleared
        usageHistory.values[usageHistory.currentDay] = Math.max(0, usageHistory.values[usageHistory.currentDay] - 5);
        drawUsageChart();
    }, 300);
}

// Drop blocks after clearing lines
function dropBlocks(clearedRows) {
    clearedRows.sort((a, b) => b - a);

    clearedRows.forEach(clearedRow => {
        for (let row = clearedRow; row > 0; row--) {
            for (let col = 0; col < COLS; col++) {
                if (grid[row - 1][col].filled) {
                    const color = grid[row - 1][col].color;
                    const intensity = grid[row - 1][col].intensity;
                    clearCell(row - 1, col);
                    fillCell(row, col, color, intensity);
                } else {
                    clearCell(row, col);
                }
            }
        }
    });
}

// Check game over
function checkGameOver() {
    // Check if any cells in top rows are filled
    for (let col = 0; col < COLS; col++) {
        if (grid[0][col].filled || grid[1][col].filled) {
            return true;
        }
    }
    return false;
}

// End game
function endGame() {
    gameActive = false;
    cancelAnimationFrame(gameLoop);

    addActivity('info', `Game Over! Final Score: ${score}`);
    showNotification(`🎮 Game Over! Score: ${score} | Lines: ${linesCleared} | Level: ${level} | CO₂ Saved: ${co2Saved.toFixed(2)}kg`);

    // Show restart prompt
    setTimeout(() => {
        showNotification('Press SPACE to play again!');
    }, 2000);
}

// Toggle pause
function togglePause() {
    if (!gameActive) return;

    gamePaused = !gamePaused;

    if (gamePaused) {
        addActivity('info', 'Game paused');
        showNotification('⏸️ Paused - Press P to resume');
    } else {
        addActivity('info', 'Game resumed');
        showNotification('▶️ Resumed');
    }
}

// Perform sustainable action
function performAction(action) {
    if (!gameActive) {
        showNotification('⚠️ Start the game first!');
        return;
    }

    const actions = {
        optimize: {
            name: 'Optimized Prompts',
            linesCleared: 2,
            co2Saved: 0.5,
            scoreBonus: 200,
            key: 'Optimized\nPrompts'
        },
        library: {
            name: 'Used Library Prompts',
            linesCleared: 2,
            co2Saved: 0.4,
            scoreBonus: 200,
            key: 'Library\nPrompts'
        },
        quiz: {
            name: 'Completed Quiz',
            linesCleared: 3,
            co2Saved: 1.0,
            scoreBonus: 500,
            key: 'Complete\nTour'
        },
        alternative: {
            name: 'Used Eco Alternative',
            linesCleared: 4,
            co2Saved: 1.5,
            scoreBonus: 800,
            key: 'Use Eco\nAlternative'
        },
        efficiency: {
            name: 'Achieved Efficiency Goal',
            linesCleared: 5,
            co2Saved: 3.0,
            scoreBonus: 1500,
            key: 'Achieve x1.5\nEfficiency'
        }
    };

    const actionData = actions[action];

    // Clear lines from bottom
    let cleared = 0;
    let rowsToClear = [];

    for (let row = ROWS - 1; row >= 0 && cleared < actionData.linesCleared; row--) {
        if (grid[row].some(cell => cell.filled)) {
            rowsToClear.push(row);
            cleared++;
        }
    }

    if (rowsToClear.length > 0) {
        clearLines(rowsToClear);
        score += actionData.scoreBonus;
        co2Saved += actionData.co2Saved;
        co2Impact = Math.max(0, co2Impact - actionData.co2Saved);

        // Update CO2 chart
        if (co2SavingsByAction[actionData.key] !== undefined) {
            co2SavingsByAction[actionData.key] += actionData.co2Saved;
            drawCO2Chart();
        }

        addActivity('cleared', `${actionData.name}: +${actionData.scoreBonus} points!`);
        showNotification(`✅ ${actionData.name}! +${actionData.scoreBonus} points | -${actionData.co2Saved}kg CO₂`);
    } else {
        showNotification('⚠️ No blocks to clear!');
    }

    updateUI();
    updateLeaderboard();
}

// Add activity to log
function addActivity(type, text) {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    activities.unshift({
        type,
        text,
        time
    });

    if (activities.length > 20) {
        activities.pop();
    }

    updateActivityFeed();
}

// Update activity feed
function updateActivityFeed() {
    const feed = document.getElementById('activity-feed');

    feed.innerHTML = activities.map(activity => `
        <div class="activity-item ${activity.type}">
            <div class="activity-time">${activity.time}</div>
            <div class="activity-text">${activity.text}</div>
        </div>
    `).join('');
}

// Update UI
function updateUI() {
    document.getElementById('requests-today').textContent = requestsToday;
    document.getElementById('blocks-added').textContent = `${totalBlocks}`;
    document.getElementById('lines-cleared').textContent = linesCleared;
    document.getElementById('co2-impact').textContent = `${co2Impact.toFixed(2)} kg`;
    document.getElementById('efficiency-score').textContent = score;
    document.getElementById('level-value').textContent = level;

    // Update height
    const currentHeight = calculateCurrentHeight();
    const heightPercent = (currentHeight / ROWS) * 100;
    document.getElementById('height-value').textContent = `${heightPercent.toFixed(0)}%`;
    document.getElementById('height-fill').style.width = `${heightPercent}%`;

    // Update danger indicator
    const dangerIndicator = document.getElementById('danger-indicator');
    if (currentHeight >= DANGER_LINE) {
        dangerIndicator.classList.add('active');
    } else {
        dangerIndicator.classList.remove('active');
    }

    // Update game status
    const statusText = gameActive
        ? (gamePaused ? '⏸️ PAUSED' : '▶️ PLAYING')
        : '⏹️ Press SPACE to Start';
    document.getElementById('game-status').textContent = statusText;

    // Update intensity display
    const intensityEl = document.getElementById('intensity-status');
    if (intensityEl) {
        const avgIntensity = usageHistory.values[usageHistory.currentDay];
        let status = 'LOW';
        let statusClass = 'low';

        if (avgIntensity >= 40) {
            status = 'HIGH';
            statusClass = 'high';
        } else if (avgIntensity >= 25) {
            status = 'MODERATE';
            statusClass = 'moderate';
        }

        intensityEl.textContent = status;
        intensityEl.className = `intensity-badge ${statusClass}`;
    }
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
