// EcoPrompt Coach - Popup JavaScript

// Initialize on load
document.addEventListener('DOMContentLoaded', init);

function init() {
  setupTabs();
  setupCoach();
  loadData();
  setupEventListeners();
  drawChart();
}

// Tab Management
function setupTabs() {
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;

      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Add active class to clicked tab and corresponding content
      tab.classList.add('active');
      document.getElementById(targetTab).classList.add('active');

      // Track tab view
      trackEvent('tab_view', { tab: targetTab });
    });
  });
}

// Load Data from Storage
async function loadData() {
  const data = await chrome.storage.local.get([
    'todayCO2',
    'todayQueries',
    'efficiency',
    'savedCO2',
    'treesGrown',
    'weeklyData',
    'creditsBalance',
    'achievements'
  ]);

  // Update Impact Tab
  updateElement('todayCO2', data.todayCO2 || 0);
  updateElement('todayQueries', data.todayQueries || 0);
  updateElement('efficiency', `${data.efficiency || 0}%`);
  updateElement('savedCO2', `${data.savedCO2 || 0}g`);
  updateElement('treesGrown', data.treesGrown || 0);

  // Update comparison
  const cupsOfTea = Math.round((data.todayCO2 || 0) / 16); // 16g CO2 per cup of tea
  updateElement('comparison', `Equal to ${cupsOfTea} cup${cupsOfTea !== 1 ? 's' : ''} of tea`);

  // Update Credits
  updateElement('creditsBalance', data.creditsBalance || 150);

  // Draw weekly chart if data exists
  if (data.weeklyData) {
    drawChart(data.weeklyData);
  }
}

// Update element text content
function updateElement(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

// Coach Functionality
function setupCoach() {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const promptInput = document.getElementById('promptInput');
  const copyBtn = document.getElementById('copyBtn');

  analyzeBtn.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();

    if (!prompt) {
      showNotification('Please enter a prompt to analyze', 'warning');
      return;
    }

    // Disable button and show loading
    analyzeBtn.textContent = 'Analyzing...';
    analyzeBtn.disabled = true;

    try {
      const analysis = await analyzePrompt(prompt);
      displayAnalysis(analysis);
      trackEvent('prompt_analyzed', { score: analysis.score });
    } catch (error) {
      showNotification('Error analyzing prompt', 'error');
      console.error(error);
    } finally {
      analyzeBtn.textContent = 'Analyze Prompt';
      analyzeBtn.disabled = false;
    }
  });

  copyBtn.addEventListener('click', () => {
    const improvedPrompt = document.getElementById('improvedPrompt').textContent;
    navigator.clipboard.writeText(improvedPrompt);
    showNotification('Copied to clipboard!', 'success');
    trackEvent('improved_prompt_copied');
  });
}

// Analyze Prompt (Mock implementation - replace with actual AI analysis)
async function analyzePrompt(prompt) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  const words = prompt.split(' ').length;
  const hasContext = prompt.toLowerCase().includes('context') || words > 20;
  const hasFormat = /format|structure|style/.test(prompt.toLowerCase());
  const hasConstraints = /limit|maximum|minimum|between/.test(prompt.toLowerCase());

  const score = Math.min(100,
    30 + // Base score
    (hasContext ? 25 : 0) +
    (hasFormat ? 20 : 0) +
    (hasConstraints ? 25 : 0)
  );

  const suggestions = [];
  if (!hasContext) suggestions.push('Add more context about what you\'re trying to achieve');
  if (!hasFormat) suggestions.push('Specify the desired output format');
  if (!hasConstraints) suggestions.push('Include any constraints or limitations');
  if (words < 15) suggestions.push('Provide more details to reduce follow-up queries');

  const improvedPrompt = `${prompt}${!hasContext ? ' Please provide relevant context.' : ''}${!hasFormat ? ' Format the response as a structured list.' : ''}${!hasConstraints ? ' Keep it concise (under 200 words).' : ''}`;

  return {
    score,
    suggestions,
    improvedPrompt,
    queriesBefore: 5 - Math.floor(score / 33),
    queriesAfter: 1,
    co2Saved: (4 - Math.floor(score / 33)) * 0.32
  };
}

// Display Analysis Results
function displayAnalysis(analysis) {
  const resultsDiv = document.getElementById('analysisResults');
  const scoreValue = document.getElementById('scoreValue');
  const suggestionsList = document.getElementById('suggestionsList');
  const improvedPrompt = document.getElementById('improvedPrompt');
  const beforeImpact = document.getElementById('beforeImpact');
  const afterImpact = document.getElementById('afterImpact');
  const savingsAmount = document.getElementById('savingsAmount');

  // Show results
  resultsDiv.style.display = 'block';

  // Update score
  scoreValue.textContent = analysis.score;

  // Update score circle color
  const scoreCircle = document.getElementById('scoreCircle');
  if (analysis.score >= 80) {
    scoreCircle.style.background = 'linear-gradient(135deg, #E8F5E0, #4A7C2F)';
  } else if (analysis.score >= 60) {
    scoreCircle.style.background = 'linear-gradient(135deg, #FFF9E6, #F5A623)';
  } else {
    scoreCircle.style.background = 'linear-gradient(135deg, #FFE6E6, #E74C3C)';
  }

  // Update suggestions
  suggestionsList.innerHTML = '';
  if (analysis.suggestions.length === 0) {
    suggestionsList.innerHTML = '<li style="color: #27AE60;">Your prompt looks great! 🎉</li>';
  } else {
    analysis.suggestions.forEach(suggestion => {
      const li = document.createElement('li');
      li.textContent = suggestion;
      suggestionsList.appendChild(li);
    });
  }

  // Update improved prompt
  improvedPrompt.textContent = analysis.improvedPrompt;

  // Update impact comparison
  beforeImpact.textContent = `~${analysis.queriesBefore} queries`;
  afterImpact.textContent = `~${analysis.queriesAfter} query`;
  savingsAmount.textContent = `${analysis.co2Saved.toFixed(2)}g CO₂`;

  // Scroll to results
  resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

// Draw Weekly Chart (simplified version)
function drawChart(data = [10, 15, 8, 12, 18, 14, 9]) {
  const canvas = document.getElementById('weeklyChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = 120;

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Chart settings
  const padding = 20;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  const barWidth = chartWidth / data.length;
  const maxValue = Math.max(...data);

  // Draw bars
  data.forEach((value, index) => {
    const barHeight = (value / maxValue) * chartHeight;
    const x = padding + index * barWidth + barWidth * 0.2;
    const y = height - padding - barHeight;
    const w = barWidth * 0.6;

    // Bar
    ctx.fillStyle = '#4A7C2F';
    ctx.fillRect(x, y, w, barHeight);

    // Value label
    ctx.fillStyle = '#2C3E50';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(value + 'g', x + w / 2, y - 5);
  });

  // Day labels
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  ctx.fillStyle = '#7F8C8D';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  days.forEach((day, index) => {
    const x = padding + index * barWidth + barWidth / 2;
    const y = height - 5;
    ctx.fillText(day, x, y);
  });
}

// Event Listeners
function setupEventListeners() {
  // Settings button
  document.getElementById('settingsBtn')?.addEventListener('click', () => {
    // Open settings page (to be implemented)
    showNotification('Settings coming soon!', 'info');
  });

  // Credit action buttons
  document.querySelectorAll('.credit-action').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = e.currentTarget.querySelector('span:first-child').textContent;
      showNotification(`Opening: ${action}`, 'info');
      // Handle credit earning actions
    });
  });

  // Alternative actions
  document.querySelectorAll('.alternative-actions .btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = e.currentTarget.closest('.alternative-card');
      const title = card.querySelector('h4').textContent;
      showNotification(`Setting up ${title}...`, 'success');
      trackEvent('alternative_selected', { tool: title });
    });
  });
}

// Utility Functions
function showNotification(message, type = 'info') {
  // Simple notification (could be enhanced with a proper notification UI)
  console.log(`[${type.toUpperCase()}] ${message}`);

  // Could create a toast notification here
  const colors = {
    success: '#27AE60',
    error: '#E74C3C',
    warning: '#F5A623',
    info: '#4A90E2'
  };

  // Create toast element
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${colors[type] || colors.info};
    color: white;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease-out;
  `;
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function trackEvent(eventName, data = {}) {
  // Analytics tracking (to be implemented with actual analytics)
  console.log('Track Event:', eventName, data);

  // Could send to backend or use chrome.storage to track locally
  chrome.storage.local.get(['events'], (result) => {
    const events = result.events || [];
    events.push({
      event: eventName,
      data,
      timestamp: new Date().toISOString()
    });

    // Keep only last 100 events
    if (events.length > 100) {
      events.shift();
    }

    chrome.storage.local.set({ events });
  });
}

// Sample data update (would be replaced with actual tracking)
function simulateDataUpdate() {
  chrome.storage.local.set({
    todayCO2: Math.floor(Math.random() * 50),
    todayQueries: Math.floor(Math.random() * 30),
    efficiency: Math.floor(Math.random() * 40) + 60,
    savedCO2: Math.floor(Math.random() * 100),
    treesGrown: Math.floor(Math.random() * 10),
    creditsBalance: 150 + Math.floor(Math.random() * 100),
    weeklyData: Array.from({ length: 7 }, () => Math.floor(Math.random() * 20) + 5)
  }, () => {
    loadData();
  });
}

// Refresh data every 30 seconds
setInterval(loadData, 30000);

// Add CSS for toast animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
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
      transform: translateX(100%);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
