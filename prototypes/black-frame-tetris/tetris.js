// Grid configuration
const COLS = 10;
const ROWS = 20;
const DANGER_LINE = 16; // 80% full
const BLOCK_SIZE = 30;

// Tetromino shapes
const SHAPES = {
    I: [[1, 1, 1, 1]],
    O: [[1, 1], [1, 1]],
    T: [[0, 1, 0], [1, 1, 1]],
    S: [[0, 1, 1], [1, 1, 0]],
    Z: [[1, 1, 0], [0, 1, 1]],
    J: [[1, 0, 0], [1, 1, 1]],
    L: [[0, 0, 1], [1, 1, 1]]
};

const SHAPE_COLORS = {
    I: 'cyan',
    O: 'yellow',
    T: 'purple',
    S: 'green',
    Z: 'red',
    J: 'blue',
    L: 'orange'
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
let score = 0;
let level = 1;
let linesCleared = 0;
let totalBlocks = 0;
let co2Impact = 0;
let co2Saved = 0;
let requestsToday = 0;

// Activity log
const activities = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeGrid();
    initializeDepartmentSelector();
    updateUI();
    addActivity('info', 'Welcome! Press SPACE to start the game');
    showInstructions();
});

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
                color: null
            };
        }
    }
}

// Start game
function startGame() {
    if (gameActive) return;

    gameActive = true;
    gamePaused = false;
    score = 0;
    level = 1;
    linesCleared = 0;
    totalBlocks = 0;
    co2Impact = 0;
    co2Saved = 0;
    requestsToday = 0;

    // Clear grid
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            clearCell(row, col);
        }
    }

    activities.length = 0;
    addActivity('info', 'Game started! Good luck!');

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
    const shapes = Object.keys(SHAPES);
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    return {
        shape: SHAPES[randomShape],
        color: SHAPE_COLORS[randomShape],
        type: randomShape,
        x: Math.floor(COLS / 2) - Math.floor(SHAPES[randomShape][0].length / 2),
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
    co2Impact += 0.015;

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

    score += dropDistance * 2;
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
                    fillCell(gridY, gridX, currentPiece.color);
                }
            }
        });
    });

    currentPiece = null;
}

// Fill a cell
function fillCell(row, col, color) {
    grid[row][col].filled = true;
    grid[row][col].color = color;
    grid[row][col].element.classList.add('filled');
    grid[row][col].element.classList.remove('preview');
    grid[row][col].element.style.backgroundColor = color;
}

// Clear a cell
function clearCell(row, col) {
    grid[row][col].filled = false;
    grid[row][col].color = null;
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

    // Log activity
    addActivity('cleared', `Cleared ${rows.length} line(s)! +${points} points`);

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
                    clearCell(row - 1, col);
                    fillCell(row, col, color);
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
    showNotification(`🎮 Game Over! Score: ${score} | Lines: ${linesCleared} | Level: ${level}`);

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
            scoreBonus: 200
        },
        library: {
            name: 'Used Library Prompts',
            linesCleared: 2,
            co2Saved: 0.4,
            scoreBonus: 200
        },
        quiz: {
            name: 'Completed Quiz',
            linesCleared: 3,
            co2Saved: 1.0,
            scoreBonus: 500
        },
        alternative: {
            name: 'Used Eco Alternative',
            linesCleared: 4,
            co2Saved: 1.5,
            scoreBonus: 800
        },
        efficiency: {
            name: 'Achieved Efficiency Goal',
            linesCleared: 5,
            co2Saved: 3.0,
            scoreBonus: 1500
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

        addActivity('cleared', `${actionData.name}: +${actionData.scoreBonus} points!`);
        showNotification(`✅ ${actionData.name}! +${actionData.scoreBonus} points | -${actionData.co2Saved}kg CO₂`);
    } else {
        showNotification('⚠️ No blocks to clear!');
    }

    updateUI();
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
    let currentHeight = 0;
    for (let row = 0; row < ROWS; row++) {
        if (grid[row].some(cell => cell.filled)) {
            currentHeight = ROWS - row;
            break;
        }
    }

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
}

// Department selector
function initializeDepartmentSelector() {
    const selector = document.getElementById('dept-select');
    selector.addEventListener('change', (e) => {
        addActivity('info', `Switched to ${e.target.options[e.target.selectedIndex].text}`);
    });
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
