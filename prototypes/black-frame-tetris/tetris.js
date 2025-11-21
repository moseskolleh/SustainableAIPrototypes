// Grid configuration
const COLS = 10;
const ROWS = 20;
const DANGER_LINE = 16; // 80% full

// State
let grid = [];
let currentHeight = 0;
let requestsToday = 247;
let blocksAdded = 18;
let linesCleared = 3;
let co2Impact = 3.8;
let efficiencyScore = 1.4;

// Activity log
const activities = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeGrid();
    initializeDepartmentSelector();
    startSimulation();
    updateUI();
});

// Initialize grid
function initializeGrid() {
    const gridContainer = document.getElementById('tetris-grid');

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
                intensity: null
            };
        }
    }

    // Initial population based on current requests
    populateInitialBlocks();
}

// Populate initial blocks based on usage
function populateInitialBlocks() {
    const initialBlocks = Math.floor(requestsToday / 5); // 5 requests = 1 block
    addRandomBlocks(initialBlocks);
}

// Add random blocks
function addRandomBlocks(count) {
    let added = 0;

    while (added < count && currentHeight < ROWS) {
        const col = Math.floor(Math.random() * COLS);

        // Find lowest empty cell in this column
        for (let row = ROWS - 1; row >= 0; row--) {
            if (!grid[row][col].filled) {
                const intensity = getIntensityLevel();
                fillCell(row, col, intensity);
                added++;
                break;
            }
        }
    }

    updateHeight();
}

// Get intensity level based on current usage
function getIntensityLevel() {
    if (requestsToday < 50) return 'low';
    if (requestsToday < 150) return 'moderate';
    if (requestsToday < 300) return 'high';
    return 'critical';
}

// Fill a cell
function fillCell(row, col, intensity) {
    grid[row][col].filled = true;
    grid[row][col].intensity = intensity;
    grid[row][col].element.classList.add('filled', intensity);
}

// Clear a cell
function clearCell(row, col) {
    grid[row][col].filled = false;
    grid[row][col].intensity = null;
    grid[row][col].element.className = 'tetris-cell';
}

// Update current height
function updateHeight() {
    currentHeight = 0;

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

    // Update intensity label
    const intensity = document.getElementById('usage-intensity');
    const intensityClass = getIntensityLevel();
    intensity.className = `stat-value intensity ${intensityClass}`;
    intensity.textContent = intensityClass.charAt(0).toUpperCase() + intensityClass.slice(1);
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
        return linesFound.length;
    }

    return 0;
}

// Clear lines
function clearLines(rows) {
    // Animate clearing
    rows.forEach(row => {
        grid[row].forEach(cell => {
            cell.element.classList.add('cleared');
        });
    });

    // After animation, actually clear
    setTimeout(() => {
        rows.forEach(row => {
            grid[row].forEach((cell, col) => {
                clearCell(row, col);
            });
        });

        // Drop blocks above
        dropBlocks(rows);

        updateHeight();
    }, 500);
}

// Drop blocks after clearing lines
function dropBlocks(clearedRows) {
    // Sort rows from bottom to top
    clearedRows.sort((a, b) => b - a);

    clearedRows.forEach(clearedRow => {
        // Move all rows above down by one
        for (let row = clearedRow; row > 0; row--) {
            for (let col = 0; col < COLS; col++) {
                if (grid[row - 1][col].filled) {
                    const intensity = grid[row - 1][col].intensity;
                    clearCell(row - 1, col);
                    fillCell(row, col, intensity);
                } else {
                    clearCell(row, col);
                }
            }
        }
    });
}

// Simulate new AI requests
function simulateRequest() {
    requestsToday++;
    blocksAdded++;

    // Every 5 requests, add a block
    if (requestsToday % 5 === 0) {
        addRandomBlocks(1);

        // Log activity
        addActivity('added', `New AI request processed (+1 block)`);
    }

    // Check if any lines can be cleared
    const cleared = checkLines();
    if (cleared > 0) {
        linesCleared += cleared;
        blocksAdded -= cleared * COLS;

        addActivity('cleared', `Cleared ${cleared} line(s) automatically!`);
    }

    // Update stats
    co2Impact = (requestsToday * 0.015).toFixed(1);
    efficiencyScore = (1.2 + Math.random() * 0.6).toFixed(1);

    updateUI();
}

// Perform sustainable action
function performAction(action) {
    const actions = {
        optimize: {
            name: 'Optimized Prompts',
            linesCleared: 1,
            co2Saved: 0.5
        },
        library: {
            name: 'Used Library Prompts',
            linesCleared: 1,
            co2Saved: 0.4
        },
        quiz: {
            name: 'Completed Quiz',
            linesCleared: 2,
            co2Saved: 1.0
        },
        alternative: {
            name: 'Used Eco Alternative',
            linesCleared: 3,
            co2Saved: 1.5
        },
        efficiency: {
            name: 'Achieved Efficiency Goal',
            linesCleared: 5,
            co2Saved: 3.0
        }
    };

    const actionData = actions[action];

    // Clear lines from bottom
    let cleared = 0;
    for (let row = ROWS - 1; row >= 0 && cleared < actionData.linesCleared; row--) {
        // Check if line has any blocks
        if (grid[row].some(cell => cell.filled)) {
            clearLines([row]);
            cleared++;
            linesCleared++;
        }
    }

    // Update CO2
    co2Impact = Math.max(0, co2Impact - actionData.co2Saved).toFixed(1);

    // Log activity
    addActivity('cleared', `${actionData.name}: Cleared ${cleared} line(s)!`);

    // Show notification
    showNotification(`✅ ${actionData.name}! Cleared ${cleared} line(s) and saved ${actionData.co2Saved}kg CO₂`);

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

    // Keep only last 20 activities
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
    document.getElementById('blocks-added').textContent = `+${blocksAdded}`;
    document.getElementById('lines-cleared').textContent = linesCleared;
    document.getElementById('co2-impact').textContent = `${co2Impact} kg`;
    document.getElementById('efficiency-score').textContent = efficiencyScore;
}

// Department selector
function initializeDepartmentSelector() {
    const selector = document.getElementById('dept-select');
    selector.addEventListener('change', (e) => {
        // Reset for different department
        resetGrid();
        requestsToday = Math.floor(Math.random() * 400) + 100;
        populateInitialBlocks();
        updateUI();
    });
}

// Reset grid
function resetGrid() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            clearCell(row, col);
        }
    }
    currentHeight = 0;
    blocksAdded = 0;
    linesCleared = 0;
}

// Start simulation
function startSimulation() {
    // Simulate new request every 5-10 seconds
    setInterval(() => {
        if (Math.random() > 0.5) {
            simulateRequest();
        }
    }, 7000);

    // Auto-check for completed lines every second
    setInterval(() => {
        const cleared = checkLines();
        if (cleared > 0) {
            linesCleared += cleared;
            addActivity('cleared', `Auto-cleared ${cleared} complete line(s)`);
            updateUI();
        }
    }, 1000);
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

// Initial activity log
addActivity('added', 'Tracking started - current usage loaded');
