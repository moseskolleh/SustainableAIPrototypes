// State management
const state = {
    credits: 250,
    totalCO2Saved: 24.3,
    efficiencyScore: 1.3,
    optimizedQueries: 47,
    totalQueries: 63,
    currentTab: 'coach',
    library: []
};

// Sample prompt library
const promptLibrary = [
    {
        id: 1,
        title: "Code Review Request",
        category: "code",
        prompt: "Review this code for best practices, security vulnerabilities, and performance issues:\n\n[CODE]\n\nProvide specific, actionable feedback.",
        co2: "0.28g",
        uses: 145,
        efficiency: "92%"
    },
    {
        id: 2,
        title: "Data Analysis Summary",
        category: "analysis",
        prompt: "Analyze this dataset and provide:\n1. Key patterns and trends\n2. Statistical insights\n3. Actionable recommendations\n\nData: [DATA]",
        co2: "0.25g",
        uses: 98,
        efficiency: "89%"
    },
    {
        id: 3,
        title: "Technical Documentation",
        category: "writing",
        prompt: "Create clear, comprehensive documentation for [FEATURE/API]. Include:\n- Overview\n- Usage examples\n- Parameters\n- Return values\n- Common errors",
        co2: "0.32g",
        uses: 76,
        efficiency: "87%"
    },
    {
        id: 4,
        title: "Bug Investigation",
        category: "code",
        prompt: "Debug this issue:\nError: [ERROR]\nContext: [CONTEXT]\n\nProvide root cause analysis and solution.",
        co2: "0.22g",
        uses: 203,
        efficiency: "94%"
    },
    {
        id: 5,
        title: "Research Synthesis",
        category: "research",
        prompt: "Synthesize key findings from these sources on [TOPIC]:\n[SOURCES]\n\nProvide structured summary with citations.",
        co2: "0.35g",
        uses: 54,
        efficiency: "85%"
    },
    {
        id: 6,
        title: "Email Draft",
        category: "writing",
        prompt: "Draft a professional email:\nTo: [RECIPIENT]\nPurpose: [PURPOSE]\nKey points: [POINTS]\n\nTone: [professional/friendly/formal]",
        co2: "0.18g",
        uses: 189,
        efficiency: "96%"
    }
];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initPromptCoach();
    initLibrary();
    initDashboard();
    updateUIState();
});

// Tab navigation
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            // Update active states
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(targetTab).classList.add('active');

            state.currentTab = targetTab;

            // Initialize charts if switching to analytics
            if (targetTab === 'analytics') {
                initAnalytics();
            }
        });
    });
}

// Prompt Coach functionality
function initPromptCoach() {
    const textarea = document.getElementById('original-prompt');
    const charCount = document.getElementById('char-count');
    const analyzeBtn = document.getElementById('analyze-btn');
    const copyBtn = document.getElementById('copy-btn');
    const saveLibraryBtn = document.getElementById('save-library-btn');

    // Character count
    textarea.addEventListener('input', () => {
        charCount.textContent = textarea.value.length;
    });

    // Analyze prompt
    analyzeBtn.addEventListener('click', () => {
        const prompt = textarea.value.trim();
        if (!prompt) {
            alert('Please enter a prompt to analyze');
            return;
        }

        analyzePrompt(prompt);
    });

    // Copy optimized prompt
    copyBtn.addEventListener('click', () => {
        const optimizedPrompt = document.getElementById('optimized-prompt').textContent;
        navigator.clipboard.writeText(optimizedPrompt).then(() => {
            showNotification('✅ Copied to clipboard!');
        });
    });

    // Save to library
    saveLibraryBtn.addEventListener('click', () => {
        showNotification('💾 Saved to your library!');
        state.credits += 25;
        updateUIState();
    });
}

// Analyze prompt logic
function analyzePrompt(prompt) {
    const taskType = document.getElementById('task-type').value;
    const priority = document.getElementById('priority').value;

    // Hide placeholder, show results
    document.getElementById('results-placeholder').classList.add('hidden');
    document.getElementById('results-content').classList.remove('hidden');

    // Calculate metrics
    const originalTokens = estimateTokens(prompt);
    const originalCO2 = (originalTokens * 0.0025).toFixed(2);

    // Optimize based on priority
    let optimizedPrompt = optimizePrompt(prompt, taskType, priority);
    const optimizedTokens = estimateTokens(optimizedPrompt);
    const optimizedCO2 = (optimizedTokens * 0.0025).toFixed(2);

    const savedCO2 = (originalCO2 - optimizedCO2).toFixed(2);
    const savingsPercent = ((savedCO2 / originalCO2) * 100).toFixed(0);

    // Update metrics
    document.getElementById('original-co2').textContent = originalCO2;
    document.getElementById('original-tokens').textContent = `~${originalTokens}`;
    document.getElementById('optimized-co2').textContent = optimizedCO2;
    document.getElementById('optimized-tokens').textContent = `~${optimizedTokens}`;
    document.getElementById('savings-co2').textContent = savedCO2;
    document.getElementById('savings-percent').textContent = savingsPercent;

    // Update trade-off indicator
    updateTradeOffIndicator(priority);

    // Display optimized prompt
    document.getElementById('optimized-prompt').textContent = optimizedPrompt;

    // Generate suggestions
    displaySuggestions(prompt, optimizedPrompt);

    // Update comparison
    updateComparison(savedCO2);

    // Update state
    state.totalCO2Saved = (parseFloat(state.totalCO2Saved) + parseFloat(savedCO2)).toFixed(2);
    state.optimizedQueries++;
    state.totalQueries++;
    state.credits += 10;

    updateUIState();
    showNotification('✨ Prompt optimized! +10 credits earned');
}

// Estimate token count (rough approximation)
function estimateTokens(text) {
    return Math.ceil(text.split(/\s+/).length * 1.3);
}

// Optimize prompt based on priority
function optimizePrompt(prompt, taskType, priority) {
    let optimized = prompt.trim();

    // Remove unnecessary words and fluff
    optimized = optimized.replace(/\b(please|kindly|would you|could you|I would like|I need)\b/gi, '');
    optimized = optimized.replace(/\s+/g, ' ');

    // Add structure based on task type
    const taskPrefixes = {
        code: "Task: Code ",
        analysis: "Analyze: ",
        writing: "Write: ",
        research: "Research: ",
        general: ""
    };

    // Priority-based optimization
    if (priority === 'efficiency') {
        optimized = taskPrefixes[taskType] + optimized;
        optimized = optimized.replace(/\b(very|really|quite|extremely)\b/gi, '');
        // More aggressive trimming
        optimized = optimized.split('.').slice(0, 3).join('.') + '.';
    } else if (priority === 'quality') {
        // Add context for better quality
        optimized += "\n\nProvide detailed, well-structured response with examples.";
    } else {
        // Balanced approach
        optimized = taskPrefixes[taskType] + optimized;
        optimized += "\n\nProvide clear, concise response.";
    }

    return optimized.trim();
}

// Update trade-off indicator
function updateTradeOffIndicator(priority) {
    const indicator = document.getElementById('trade-off-indicator');
    const note = document.getElementById('trade-off-note');

    const positions = {
        efficiency: { left: '15%', note: '⚡ Optimized for speed and low impact. May sacrifice some detail.' },
        balanced: { left: '50%', note: '⚖️ Balanced approach. Good quality with reasonable efficiency.' },
        quality: { left: '85%', note: '🎯 Optimized for best results. Higher token usage and impact.' }
    };

    const config = positions[priority];
    indicator.style.left = config.left;
    note.textContent = config.note;
}

// Display optimization suggestions
function displaySuggestions(original, optimized) {
    const suggestions = [
        { title: "Removed Fluff Words", desc: "Eliminated unnecessary politeness and filler words." },
        { title: "Added Structure", desc: "Structured prompt with clear task prefix for better parsing." },
        { title: "Concise Language", desc: "Reduced token count while maintaining clarity." }
    ];

    const suggestionsList = document.getElementById('suggestions-list');
    suggestionsList.innerHTML = suggestions.map(s => `
        <div class="suggestion-item">
            <strong>${s.title}</strong>
            <div>${s.desc}</div>
        </div>
    `).join('');
}

// Update environmental comparison
function updateComparison(savedCO2) {
    const co2Grams = parseFloat(savedCO2);
    document.getElementById('equiv-value').textContent = `${savedCO2}g`;

    const equivalents = [
        { threshold: 0.1, text: "That's like saving a breath of fresh air!" },
        { threshold: 0.3, text: "Equivalent to 30 seconds of smartphone charging." },
        { threshold: 0.5, text: "Equal to 2 meters of car driving avoided." },
        { threshold: 1.0, text: "Equivalent to 5 minutes of LED light bulb use." },
        { threshold: Infinity, text: "Equal to 10 meters of car driving avoided." }
    ];

    const equiv = equivalents.find(e => co2Grams < e.threshold);
    document.getElementById('equiv-text').textContent = equiv.text;
}

// Initialize Library
function initLibrary() {
    state.library = promptLibrary;
    renderLibrary();

    // Search functionality
    const searchInput = document.getElementById('library-search');
    const filterSelect = document.getElementById('library-filter');

    searchInput.addEventListener('input', renderLibrary);
    filterSelect.addEventListener('change', renderLibrary);
}

// Render library items
function renderLibrary() {
    const searchTerm = document.getElementById('library-search').value.toLowerCase();
    const categoryFilter = document.getElementById('library-filter').value;

    let filtered = state.library.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm) ||
                            item.prompt.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const grid = document.getElementById('library-grid');
    grid.innerHTML = filtered.map(item => `
        <div class="library-item" onclick="useLibraryPrompt(${item.id})">
            <div class="library-item-header">
                <div class="library-item-title">${item.title}</div>
                <div class="library-item-category">${item.category}</div>
            </div>
            <div class="library-item-prompt">${item.prompt}</div>
            <div class="library-item-stats">
                <div class="library-item-stat">
                    <span class="icon">💨</span>
                    <span>${item.co2}</span>
                </div>
                <div class="library-item-stat">
                    <span class="icon">👥</span>
                    <span>${item.uses} uses</span>
                </div>
                <div class="library-item-stat">
                    <span class="icon">⚡</span>
                    <span>${item.efficiency}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Use library prompt
function useLibraryPrompt(id) {
    const item = state.library.find(i => i.id === id);
    if (item) {
        // Switch to coach tab
        document.querySelector('[data-tab="coach"]').click();

        // Fill in the prompt
        const textarea = document.getElementById('original-prompt');
        textarea.value = item.prompt;
        textarea.dispatchEvent(new Event('input'));

        showNotification(`📚 Loaded: ${item.title}`);
        state.credits += 5;
        updateUIState();
    }
}

// Initialize Dashboard
function initDashboard() {
    // Create simple charts using Canvas API
    createUsageChart();
}

// Create usage chart
function createUsageChart() {
    const canvas = document.getElementById('usage-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    // Simple bar chart data
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const queries = [12, 18, 15, 22, 19, 8, 5];
    const co2Saved = [3.2, 4.8, 4.1, 5.9, 5.1, 2.1, 1.1];

    const maxQuery = Math.max(...queries);
    const barWidth = canvas.width / (days.length * 2);
    const barSpacing = 10;

    // Draw bars
    days.forEach((day, i) => {
        const x = i * (canvas.width / days.length) + barSpacing;
        const queryHeight = (queries[i] / maxQuery) * 200;
        const co2Height = (co2Saved[i] / Math.max(...co2Saved)) * 200;

        // Queries bar (blue)
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(x, canvas.height - queryHeight - 50, barWidth - barSpacing, queryHeight);

        // CO2 saved bar (green)
        ctx.fillStyle = '#10b981';
        ctx.fillRect(x + barWidth, canvas.height - co2Height - 50, barWidth - barSpacing, co2Height);

        // Day label
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(day, x + barWidth, canvas.height - 30);
    });

    // Legend
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(20, 20, 20, 20);
    ctx.fillStyle = '#111827';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Queries', 45, 35);

    ctx.fillStyle = '#10b981';
    ctx.fillRect(140, 20, 20, 20);
    ctx.fillStyle = '#111827';
    ctx.fillText('CO₂ Saved (g)', 165, 35);
}

// Initialize Analytics
function initAnalytics() {
    // Only initialize once
    if (document.getElementById('heatmap-chart').dataset.initialized) return;

    createHeatmapChart();
    createToolDiversityChart();
    createEfficiencyTrendChart();

    document.getElementById('heatmap-chart').dataset.initialized = 'true';
}

// Create heatmap chart
function createHeatmapChart() {
    const canvas = document.getElementById('heatmap-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    // Heatmap data (24 hours x 7 days)
    const hours = ['8AM', '9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM'];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

    const cellWidth = canvas.width / hours.length;
    const cellHeight = 40;

    // Random usage data (0-100)
    days.forEach((day, dayIndex) => {
        hours.forEach((hour, hourIndex) => {
            const usage = Math.random() * 100;
            const intensity = Math.floor(usage / 20);

            // Color intensity
            const colors = ['#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981'];
            ctx.fillStyle = colors[intensity];

            const x = hourIndex * cellWidth;
            const y = dayIndex * cellHeight + 40;

            ctx.fillRect(x, y, cellWidth - 2, cellHeight - 2);

            // Draw usage number
            if (usage > 50) {
                ctx.fillStyle = '#ffffff';
            } else {
                ctx.fillStyle = '#111827';
            }
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(Math.floor(usage), x + cellWidth / 2, y + cellHeight / 2 + 4);
        });

        // Day labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(day, 40, dayIndex * cellHeight + 65);
    });

    // Hour labels
    hours.forEach((hour, index) => {
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(hour, index * cellWidth + cellWidth / 2, 25);
    });
}

// Create tool diversity chart
function createToolDiversityChart() {
    const canvas = document.getElementById('tool-diversity-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    // Pie chart data
    const tools = [
        { name: 'ChatGPT', value: 45, color: '#10b981' },
        { name: 'Claude', value: 30, color: '#3b82f6' },
        { name: 'Gemini', value: 15, color: '#f59e0b' },
        { name: 'Other', value: 10, color: '#6b7280' }
    ];

    const total = tools.reduce((sum, tool) => sum + tool.value, 0);
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 50;

    let currentAngle = -Math.PI / 2;

    tools.forEach((tool, index) => {
        const sliceAngle = (tool.value / total) * 2 * Math.PI;

        // Draw slice
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = tool.color;
        ctx.fill();

        // Draw label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius + 30);
        const labelY = centerY + Math.sin(labelAngle) * (radius + 30);

        ctx.fillStyle = '#111827';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${tool.name}`, labelX, labelY);
        ctx.font = '12px sans-serif';
        ctx.fillText(`${tool.value}%`, labelX, labelY + 15);

        currentAngle += sliceAngle;
    });
}

// Create efficiency trend chart
function createEfficiencyTrendChart() {
    const canvas = document.getElementById('efficiency-trend-chart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    // Line chart data
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const efficiency = [2.1, 1.8, 1.5, 1.3];

    const padding = 50;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxValue = 3.0;

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;

    efficiency.forEach((value, index) => {
        const x = padding + (index / (weeks.length - 1)) * chartWidth;
        const y = canvas.height - padding - (value / maxValue) * chartHeight;

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

        // Draw label
        ctx.fillStyle = '#111827';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(weeks[index], x, canvas.height - padding + 20);
        ctx.fillText(value.toFixed(1), x, y - 15);
    });

    ctx.stroke();

    // Y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 3; i++) {
        const y = canvas.height - padding - (i / 3) * chartHeight;
        ctx.fillText((i).toFixed(1), padding - 10, y + 4);
    }

    // Target line
    ctx.beginPath();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    const targetY = canvas.height - padding - (1.5 / maxValue) * chartHeight;
    ctx.moveTo(padding, targetY);
    ctx.lineTo(canvas.width - padding, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Target: 1.5', canvas.width - padding + 10, targetY + 4);
}

// Update UI state
function updateUIState() {
    document.getElementById('credits').textContent = state.credits;
    document.getElementById('total-co2-saved').textContent = `${state.totalCO2Saved} g`;
    document.getElementById('efficiency-score').textContent = state.efficiencyScore;
    document.getElementById('optimized-queries').textContent = state.optimizedQueries;
    document.getElementById('credits-earned').textContent = state.credits;
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
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
