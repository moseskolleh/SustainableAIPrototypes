// Department data
const departmentData = {
    it: {
        name: "IT Department",
        score: 75,
        promptEfficiency: 1.4,
        energyUsage: 8.7,
        toolDiversity: 5,
        co2Impact: 3.4,
        trends: {
            promptEfficiency: -0.3,
            energyUsage: 1.2,
            toolDiversity: 1,
            co2Impact: -0.8
        }
    },
    finance: {
        name: "Finance Team",
        score: 68,
        promptEfficiency: 1.7,
        energyUsage: 6.2,
        toolDiversity: 3,
        co2Impact: 2.8,
        trends: {
            promptEfficiency: -0.2,
            energyUsage: 0.5,
            toolDiversity: 0,
            co2Impact: -0.3
        }
    },
    hr: {
        name: "Human Resources",
        score: 87,
        promptEfficiency: 1.2,
        energyUsage: 4.5,
        toolDiversity: 6,
        co2Impact: 1.9,
        trends: {
            promptEfficiency: -0.5,
            energyUsage: -0.8,
            toolDiversity: 2,
            co2Impact: -1.2
        }
    },
    policy: {
        name: "Policy & Strategy",
        score: 92,
        promptEfficiency: 1.1,
        energyUsage: 3.8,
        toolDiversity: 7,
        co2Impact: 1.5,
        trends: {
            promptEfficiency: -0.4,
            energyUsage: -1.0,
            toolDiversity: 1,
            co2Impact: -1.5
        }
    },
    operations: {
        name: "Operations",
        score: 62,
        promptEfficiency: 1.9,
        energyUsage: 9.5,
        toolDiversity: 4,
        co2Impact: 4.2,
        trends: {
            promptEfficiency: -0.1,
            energyUsage: 1.8,
            toolDiversity: 1,
            co2Impact: 0.2
        }
    }
};

// Tips database based on department performance
const tipsDatabase = [
    {
        icon: "⚡",
        title: "Optimize Your Prompts",
        category: "Efficiency",
        description: "Use the Prompt Coach tool to reduce your average prompts per query. Every refined prompt saves energy and time.",
        action: "Try Prompt Coach",
        condition: (dept) => dept.promptEfficiency > 1.5
    },
    {
        icon: "📚",
        title: "Use the Prompt Library",
        category: "Best Practice",
        description: "Leverage pre-optimized prompts from the library. Templates are 30% more efficient than custom prompts.",
        action: "Browse Library",
        condition: (dept) => dept.toolDiversity < 5
    },
    {
        icon: "🌱",
        title: "Try DeepSeek AI",
        category: "Sustainable Tool",
        description: "DeepSeek AI is 10x more energy efficient than standard models. Perfect for routine queries.",
        action: "Learn More",
        condition: (dept) => dept.co2Impact > 3.0
    },
    {
        icon: "🕐",
        title: "Time-Shift Non-Urgent Tasks",
        category: "Energy Saving",
        description: "Run non-urgent AI queries during off-peak hours (6PM-8AM) when grid carbon intensity is lowest.",
        action: "Set Scheduler",
        condition: (dept) => dept.energyUsage > 7.0
    },
    {
        icon: "🎯",
        title: "Set Efficiency Goals",
        category: "Goal Setting",
        description: "Your team can achieve <1.3 prompts per query with focused training. Set a team goal today!",
        action: "Set Team Goal",
        condition: (dept) => dept.promptEfficiency > 1.3
    },
    {
        icon: "🧰",
        title: "Diversify Your AI Tools",
        category: "Tool Usage",
        description: "Explore different AI tools for different tasks. Each tool has strengths that can improve efficiency.",
        action: "View Tool Guide",
        condition: (dept) => dept.toolDiversity < 5
    },
    {
        icon: "📊",
        title: "Monitor Your Dashboard",
        category: "Analytics",
        description: "Check your sustainability dashboard weekly. Regular monitoring improves awareness and behavior.",
        action: "Open Dashboard",
        condition: (dept) => true // Always show
    },
    {
        icon: "🏆",
        title: "Join the Challenge",
        category: "Competition",
        description: "Participate in the monthly sustainability challenge. Top teams win recognition and rewards!",
        action: "Join Challenge",
        condition: (dept) => dept.score < 80
    }
];

let currentDepartment = 'it';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initDepartmentSelector();
    updateDepartmentData();
    createWeeklyChart();
    updateTime();

    // Auto-refresh every 30 seconds
    setInterval(updateDepartmentData, 30000);
    setInterval(updateTime, 60000);
});

// Initialize department selector
function initDepartmentSelector() {
    const selector = document.getElementById('department-select');
    selector.addEventListener('change', (e) => {
        currentDepartment = e.target.value;
        updateDepartmentData();
        createWeeklyChart(); // Refresh chart with new data
    });
}

// Update department data
function updateDepartmentData() {
    const dept = departmentData[currentDepartment];

    // Update health score
    updateHealthScore(dept.score);

    // Update metrics
    document.getElementById('prompt-efficiency').textContent = dept.promptEfficiency.toFixed(1);
    document.getElementById('energy-usage').textContent = dept.energyUsage.toFixed(1);
    document.getElementById('tool-diversity').textContent = dept.toolDiversity;
    document.getElementById('co2-impact').textContent = dept.co2Impact.toFixed(1);

    // Update trends
    updateTrends(dept.trends);

    // Generate relevant tips
    generateTips(dept);
}

// Update health score and visual
function updateHealthScore(score) {
    const circle = document.getElementById('health-progress');
    const scoreValue = document.getElementById('score-value');
    const healthMessage = document.getElementById('health-message');

    // Update number
    scoreValue.textContent = score;

    // Update circle (circumference = 2 * π * r = 754)
    const circumference = 754;
    const offset = circumference - (score / 100) * circumference;
    circle.style.strokeDashoffset = offset;

    // Update color based on score
    if (score >= 80) {
        circle.style.stroke = '#22c55e'; // Green
        healthMessage.innerHTML = `
            <span class="icon">🌟</span>
            <p class="message-text">Your department is doing <strong>Excellent</strong>!</p>
            <p class="message-subtext">You're a sustainability champion</p>
        `;
    } else if (score >= 60) {
        circle.style.stroke = '#10b981'; // Primary green
        healthMessage.innerHTML = `
            <span class="icon">🌱</span>
            <p class="message-text">Your department is doing <strong>Good</strong>!</p>
            <p class="message-subtext">Keep up the sustainable AI practices</p>
        `;
    } else {
        circle.style.stroke = '#f59e0b'; // Warning
        healthMessage.innerHTML = `
            <span class="icon">💪</span>
            <p class="message-text">Your department can do <strong>Better</strong>!</p>
            <p class="message-subtext">Check out the tips below to improve</p>
        `;
    }
}

// Update trend indicators
function updateTrends(trends) {
    const cards = document.querySelectorAll('.metric-card');

    // Prompt Efficiency
    const promptTrend = cards[0].querySelector('.metric-trend span');
    promptTrend.textContent = `${trends.promptEfficiency > 0 ? '↑' : '↓'} ${Math.abs(trends.promptEfficiency)}`;
    cards[0].querySelector('.metric-trend').className =
        trends.promptEfficiency < 0 ? 'metric-trend success' : 'metric-trend warning';

    // Energy Usage
    const energyTrend = cards[1].querySelector('.metric-trend span');
    energyTrend.textContent = `${trends.energyUsage > 0 ? '↑' : '↓'} ${Math.abs(trends.energyUsage)}`;
    cards[1].querySelector('.metric-trend').className =
        trends.energyUsage < 0 ? 'metric-trend success' : 'metric-trend warning';

    // Tool Diversity
    const toolTrend = cards[2].querySelector('.metric-trend span');
    toolTrend.textContent = `${trends.toolDiversity > 0 ? '+' : ''}${trends.toolDiversity}`;
    cards[2].querySelector('.metric-trend').className =
        trends.toolDiversity > 0 ? 'metric-trend success' : 'metric-trend warning';

    // CO2 Impact
    const co2Trend = cards[3].querySelector('.metric-trend span');
    co2Trend.textContent = `${trends.co2Impact > 0 ? '↑' : '↓'} ${Math.abs(trends.co2Impact)} kg`;
    cards[3].querySelector('.metric-trend').className =
        trends.co2Impact < 0 ? 'metric-trend success' : 'metric-trend warning';
}

// Generate relevant tips
function generateTips(dept) {
    const tipsGrid = document.getElementById('tips-grid');

    // Filter tips based on conditions
    const relevantTips = tipsDatabase
        .filter(tip => tip.condition(dept))
        .slice(0, 6); // Show max 6 tips

    tipsGrid.innerHTML = relevantTips.map(tip => `
        <div class="tip-card">
            <div class="tip-header">
                <span class="tip-icon">${tip.icon}</span>
                <div>
                    <h3 class="tip-title">${tip.title}</h3>
                    <span class="tip-category">${tip.category}</span>
                </div>
            </div>
            <p class="tip-description">${tip.description}</p>
            <a href="#" class="tip-action">
                <span class="icon">→</span>
                ${tip.action}
            </a>
        </div>
    `).join('');
}

// Create weekly performance chart
function createWeeklyChart() {
    const canvas = document.getElementById('weekly-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    const dept = departmentData[currentDepartment];

    // Weekly data (simulated)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const efficiencyData = [1.8, 1.6, 1.5, 1.4, 1.3, 1.5, 1.4];
    const co2Data = [4.2, 3.9, 3.7, 3.5, 3.2, 3.0, 3.4];

    const padding = 60;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (i / 5) * chartHeight;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Draw efficiency line (green)
    ctx.beginPath();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;

    efficiencyData.forEach((value, index) => {
        const x = padding + (index / (days.length - 1)) * chartWidth;
        const y = canvas.height - padding - ((value - 1) / 1) * chartHeight;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }

        // Draw point
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();

        // Draw value
        ctx.fillStyle = '#f1f5f9';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(value.toFixed(1), x, y - 15);
    });

    ctx.stroke();

    // Draw CO2 line (blue)
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;

    co2Data.forEach((value, index) => {
        const x = padding + (index / (days.length - 1)) * chartWidth;
        const y = canvas.height - padding - ((value - 1) / 4) * chartHeight;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }

        // Draw point
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fill();
    });

    ctx.stroke();

    // Draw day labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    days.forEach((day, index) => {
        const x = padding + (index / (days.length - 1)) * chartWidth;
        ctx.fillText(day, x, canvas.height - padding + 25);
    });

    // Draw legend
    ctx.fillStyle = '#10b981';
    ctx.fillRect(padding, 20, 20, 20);
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Prompt Efficiency', padding + 30, 35);

    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(padding + 180, 20, 20, 20);
    ctx.fillStyle = '#f1f5f9';
    ctx.fillText('CO₂ Impact (kg)', padding + 210, 35);

    // Y-axis labels (left)
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 2; i++) {
        const value = 1 + (i * 0.5);
        const y = canvas.height - padding - ((value - 1) / 1) * chartHeight;
        ctx.fillText(value.toFixed(1), padding - 10, y + 4);
    }

    // Y-axis labels (right) for CO2
    ctx.textAlign = 'left';
    for (let i = 0; i <= 4; i++) {
        const value = 1 + i;
        const y = canvas.height - padding - ((value - 1) / 4) * chartHeight;
        ctx.fillText(value.toFixed(1) + ' kg', canvas.width - padding + 10, y + 4);
    }

    // Target line
    ctx.beginPath();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    const targetY = canvas.height - padding - ((1.5 - 1) / 1) * chartHeight;
    ctx.moveTo(padding, targetY);
    ctx.lineTo(canvas.width - padding, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Target: 1.5', padding + 80, targetY - 10);
}

// Update time
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    const relativeTime = 'Just now';
    document.getElementById('update-time').textContent = relativeTime;
}

// Auto-cycle through departments (for public display)
function startAutoCycle() {
    const departments = Object.keys(departmentData);
    let currentIndex = 0;

    setInterval(() => {
        currentIndex = (currentIndex + 1) % departments.length;
        const selector = document.getElementById('department-select');
        selector.value = departments[currentIndex];
        selector.dispatchEvent(new Event('change'));
    }, 45000); // Change every 45 seconds
}

// Uncomment to enable auto-cycling for public displays
// startAutoCycle();
