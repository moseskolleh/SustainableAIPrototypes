/**
 * Eco-Smart Main Application Logic
 * Integrates core-engine.js and storage-manager.js
 */

// ==============================================================================
// STATE MANAGEMENT
// ==============================================================================

let currentSettings = {};
let currentImpactData = null;
let lastPromptText = '';

// ==============================================================================
// INITIALIZATION
// ==============================================================================

document.addEventListener('DOMContentLoaded', async () => {
  // Load settings
  currentSettings = await StorageManager.getSettings();

  // Initialize tabs
  initializeTabs();

  // Initialize Calculator tab
  initializeCalculator();

  // Initialize Optimizer tab
  initializeOptimizer();

  // Initialize Library tab
  await initializeLibrary();

  // Initialize Settings tab
  await initializeSettings();

  // Load and display usage stats
  await updateUsageStatsDisplay();
});

// ==============================================================================
// TAB MANAGEMENT
// ==============================================================================

function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;

      // Remove active class from all tabs
      tabButtons.forEach(btn => {
        btn.classList.remove('active', 'text-eco-green-600', 'border-eco-green-600');
        btn.classList.add('text-gray-600', 'border-transparent');
      });

      // Add active class to clicked tab
      button.classList.add('active', 'text-eco-green-600', 'border-eco-green-600');
      button.classList.remove('text-gray-600', 'border-transparent');

      // Hide all tab contents
      tabContents.forEach(content => {
        content.classList.add('hidden');
      });

      // Show selected tab content
      const selectedTab = document.getElementById(`${tabName}-tab`);
      if (selectedTab) {
        selectedTab.classList.remove('hidden');
      }

      // Refresh library when switching to it
      if (tabName === 'library') {
        initializeLibrary();
      }
    });
  });

  // Settings button in header
  document.getElementById('settingsBtn').addEventListener('click', () => {
    const settingsTab = document.querySelector('[data-tab="settings"]');
    if (settingsTab) {
      settingsTab.click();
    }
  });
}

// ==============================================================================
// CALCULATOR TAB LOGIC
// ==============================================================================

function initializeCalculator() {
  const promptInput = document.getElementById('promptInput');
  const outputType = document.getElementById('outputType');
  const saveBtn = document.getElementById('saveToLibraryBtn');

  // Real-time calculation on input
  let debounceTimer;
  promptInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      calculateAndDisplay();
    }, 300); // 300ms debounce for better UX
  });

  // Recalculate when output type changes
  outputType.addEventListener('change', () => {
    calculateAndDisplay();
  });

  // Save to library
  saveBtn.addEventListener('click', async () => {
    await saveCurrentPromptToLibrary();
  });
}

async function calculateAndDisplay() {
  const promptText = document.getElementById('promptInput').value;
  const outputType = document.getElementById('outputType').value;

  // Update character count
  const charCount = promptText.length;
  const estimatedTokens = EcoSmartEngine.estimateTokens(promptText);
  document.getElementById('charCount').textContent =
    `${charCount} characters (~${estimatedTokens} tokens)`;

  // If empty, reset display
  if (!promptText.trim()) {
    resetImpactDisplay();
    document.getElementById('saveToLibraryBtn').disabled = true;
    return;
  }

  // Calculate environmental impact
  const impactData = EcoSmartEngine.calculateEnvironmentalImpact(promptText, {
    outputType: outputType,
    gridProfile: currentSettings.gridProfile || 'AZURE_OPENAI'
  });

  // Store for later use
  currentImpactData = impactData;
  lastPromptText = promptText;

  // Update display
  displayImpactResults(impactData);

  // Enable save button
  document.getElementById('saveToLibraryBtn').disabled = false;

  // Update usage stats
  await StorageManager.updateUsageStats(impactData);
}

function displayImpactResults(impactData) {
  const { tokens, impact, metadata } = impactData;

  // Eco Score
  document.getElementById('ecoScore').textContent = metadata.ecoScore;
  document.getElementById('ecoRating').textContent = getEcoRating(metadata.ecoScore);

  // Core Metrics
  document.getElementById('energyValue').textContent =
    `${impact.energy.wh.toFixed(2)} Wh`;
  document.getElementById('waterValue').textContent =
    `${impact.water.milliliters.toFixed(1)} mL`;
  document.getElementById('carbonValue').textContent =
    `${impact.carbon.grams.toFixed(2)} g`;

  // Analogies
  document.getElementById('analogyLED').textContent = impact.energy.analogies.ledHours;
  document.getElementById('analogyPhone').textContent = impact.energy.analogies.smartphoneCharges;
  document.getElementById('analogyCoffee').textContent = impact.energy.analogies.cupsOfCoffee;
  document.getElementById('analogySearch').textContent = impact.energy.analogies.googleSearches;

  // Driving analogy (respect units setting)
  const drivingValue = currentSettings.units === 'imperial'
    ? impact.carbon.analogies.drivingMiles + ' mi'
    : impact.carbon.analogies.drivingKm + ' km';
  document.getElementById('analogyDriving').textContent = drivingValue;
}

function resetImpactDisplay() {
  document.getElementById('ecoScore').textContent = '0';
  document.getElementById('ecoRating').textContent = 'Excellent';
  document.getElementById('energyValue').textContent = '0 Wh';
  document.getElementById('waterValue').textContent = '0 mL';
  document.getElementById('carbonValue').textContent = '0 g';
  document.getElementById('analogyLED').textContent = '0';
  document.getElementById('analogyPhone').textContent = '0';
  document.getElementById('analogyCoffee').textContent = '0';
  document.getElementById('analogySearch').textContent = '0';
  document.getElementById('analogyDriving').textContent = '0 km';
}

function getEcoRating(score) {
  if (score <= 20) return 'Excellent';
  if (score <= 40) return 'Good';
  if (score <= 60) return 'Fair';
  if (score <= 80) return 'Poor';
  return 'Very High';
}

async function saveCurrentPromptToLibrary() {
  if (!currentImpactData || !lastPromptText) {
    showNotification('No prompt to save', 'warning');
    return;
  }

  // Prompt for tags
  const tagsInput = prompt('Add tags (comma-separated, optional):');
  const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];

  const promptData = {
    text: lastPromptText,
    tags: tags,
    eco_score: currentImpactData.metadata.ecoScore,
    tokens: currentImpactData.tokens,
    impact: currentImpactData.impact
  };

  try {
    await StorageManager.savePromptToLibrary(promptData);
    showNotification('Prompt saved to library!', 'success');

    // Clear the calculator input as feedback
    document.getElementById('promptInput').value = '';
    resetImpactDisplay();
    document.getElementById('saveToLibraryBtn').disabled = true;
  } catch (error) {
    showNotification('Failed to save prompt', 'error');
    console.error(error);
  }
}

// ==============================================================================
// OPTIMIZER TAB LOGIC
// ==============================================================================

function initializeOptimizer() {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const copyBtn = document.getElementById('copyOptimizedBtn');

  analyzeBtn.addEventListener('click', async () => {
    await analyzeAndOptimizePrompt();
  });

  copyBtn.addEventListener('click', () => {
    const optimizedText = document.getElementById('optimizedPrompt').textContent;
    navigator.clipboard.writeText(optimizedText);
    showNotification('Copied to clipboard!', 'success');
  });
}

async function analyzeAndOptimizePrompt() {
  const promptText = document.getElementById('optimizerInput').value.trim();

  if (!promptText) {
    showNotification('Please enter a prompt to analyze', 'warning');
    return;
  }

  // Show loading state
  const analyzeBtn = document.getElementById('analyzeBtn');
  analyzeBtn.textContent = '🔄 Analyzing...';
  analyzeBtn.disabled = true;

  // Simulate analysis (in a real app, this could call an API)
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Analyze prompt
  const analysis = analyzePromptQuality(promptText);
  const optimizedText = generateOptimizedPrompt(promptText, analysis);

  // Calculate impact comparison
  const originalImpact = EcoSmartEngine.calculateEnvironmentalImpact(promptText, {
    gridProfile: currentSettings.gridProfile || 'AZURE_OPENAI'
  });

  const optimizedImpact = EcoSmartEngine.calculateEnvironmentalImpact(optimizedText, {
    gridProfile: currentSettings.gridProfile || 'AZURE_OPENAI'
  });

  // Display results
  displayOptimizerResults(analysis, optimizedText, originalImpact, optimizedImpact);

  // Record savings
  const savings = {
    energy: {
      wh: originalImpact.impact.energy.wh - optimizedImpact.impact.energy.wh
    },
    water: {
      liters: originalImpact.impact.water.liters - optimizedImpact.impact.water.liters
    },
    carbon: {
      kg: originalImpact.impact.carbon.kg - optimizedImpact.impact.carbon.kg
    }
  };

  if (savings.energy.wh > 0) {
    await StorageManager.recordSavings(savings);
  }

  // Reset button
  analyzeBtn.textContent = '🔍 Analyze & Optimize';
  analyzeBtn.disabled = false;
}

function analyzePromptQuality(prompt) {
  const suggestions = [];
  const words = prompt.split(/\s+/).length;

  // Check for various quality indicators
  const hasContext = /context|background|specifically|particular/.test(prompt.toLowerCase());
  const hasFormat = /format|structure|style|markdown|json|list/.test(prompt.toLowerCase());
  const hasConstraints = /limit|maximum|minimum|between|under|over|brief|concise/.test(prompt.toLowerCase());
  const hasUnnecessaryPhrases = /(please|kindly|could you|would you|i would like|can you)/i.test(prompt);
  const hasRedundancy = /(very very|really really|please please)/.test(prompt.toLowerCase());

  if (!hasContext && words < 20) {
    suggestions.push('Add more context about what you want to achieve');
  }

  if (!hasFormat) {
    suggestions.push('Specify the desired output format (e.g., list, table, JSON)');
  }

  if (!hasConstraints) {
    suggestions.push('Include constraints (e.g., length limits, key requirements)');
  }

  if (hasUnnecessaryPhrases) {
    suggestions.push('Remove pleasantries like "please", "could you" - be direct');
  }

  if (hasRedundancy) {
    suggestions.push('Remove redundant words and phrases');
  }

  if (words < 10) {
    suggestions.push('Provide more detail to get better results in one shot');
  }

  return {
    suggestions,
    hasContext,
    hasFormat,
    hasConstraints,
    hasUnnecessaryPhrases,
    hasRedundancy
  };
}

function generateOptimizedPrompt(original, analysis) {
  let optimized = original;

  // Remove pleasantries
  optimized = optimized.replace(/(please|kindly|could you|would you|i would like|can you)\s*/gi, '');

  // Remove redundancies
  optimized = optimized.replace(/(very very|really really|please please)/gi, (match) => {
    return match.split(' ')[0];
  });

  // Add format specification if missing
  if (!analysis.hasFormat) {
    optimized += ' Format as a clear, structured response.';
  }

  // Add constraint if missing
  if (!analysis.hasConstraints) {
    optimized += ' Be concise (max 200 words).';
  }

  // Trim extra whitespace
  optimized = optimized.replace(/\s+/g, ' ').trim();

  return optimized;
}

function displayOptimizerResults(analysis, optimizedText, originalImpact, optimizedImpact) {
  // Show results section
  document.getElementById('optimizerResults').classList.remove('hidden');

  // Display optimized prompt
  document.getElementById('optimizedPrompt').textContent = optimizedText;

  // Display suggestions
  const suggestionsList = document.getElementById('suggestionsList');
  suggestionsList.innerHTML = '';

  if (analysis.suggestions.length === 0) {
    suggestionsList.innerHTML = '<li class="text-eco-green-600">✨ Your prompt is already well-optimized!</li>';
  } else {
    analysis.suggestions.forEach(suggestion => {
      const li = document.createElement('li');
      li.className = 'flex items-start gap-2';
      li.innerHTML = `<span class="text-purple-600">→</span><span>${suggestion}</span>`;
      suggestionsList.appendChild(li);
    });
  }

  // Display token comparison
  document.getElementById('beforeTokens').textContent = originalImpact.tokens.total;
  document.getElementById('afterTokens').textContent = optimizedImpact.tokens.total;

  // Display savings
  const energySaved = originalImpact.impact.energy.wh - optimizedImpact.impact.energy.wh;
  const waterSaved = originalImpact.impact.water.milliliters - optimizedImpact.impact.water.milliliters;
  const carbonSaved = originalImpact.impact.carbon.grams - optimizedImpact.impact.carbon.grams;

  document.getElementById('savedEnergy').textContent =
    energySaved > 0 ? `${energySaved.toFixed(2)} Wh` : '0 Wh';
  document.getElementById('savedWater').textContent =
    waterSaved > 0 ? `${waterSaved.toFixed(1)} mL` : '0 mL';
  document.getElementById('savedCarbon').textContent =
    carbonSaved > 0 ? `${carbonSaved.toFixed(2)} g` : '0 g';
}

// ==============================================================================
// LIBRARY TAB LOGIC
// ==============================================================================

async function initializeLibrary() {
  const prompts = await StorageManager.getPromptLibrary();

  // Update count
  document.getElementById('libraryCount').textContent = `${prompts.length} prompt${prompts.length !== 1 ? 's' : ''}`;

  // Display prompts
  displayLibraryPrompts(prompts);

  // Setup search
  const searchInput = document.getElementById('librarySearch');
  let searchDebounce;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(async () => {
      const query = searchInput.value.trim();
      if (query) {
        const results = await StorageManager.searchPrompts(query);
        displayLibraryPrompts(results);
      } else {
        const allPrompts = await StorageManager.getPromptLibrary();
        displayLibraryPrompts(allPrompts);
      }
    }, 300);
  });

  // Export button
  document.getElementById('exportLibraryBtn').addEventListener('click', async () => {
    await exportLibrary();
  });
}

function displayLibraryPrompts(prompts) {
  const container = document.getElementById('libraryItems');
  const emptyState = document.getElementById('emptyLibrary');

  if (prompts.length === 0) {
    emptyState.classList.remove('hidden');
    // Hide any existing prompts
    Array.from(container.children).forEach(child => {
      if (child.id !== 'emptyLibrary') {
        child.remove();
      }
    });
    return;
  }

  emptyState.classList.add('hidden');

  // Clear existing items (except empty state)
  Array.from(container.children).forEach(child => {
    if (child.id !== 'emptyLibrary') {
      child.remove();
    }
  });

  // Sort by eco_score (best first)
  const sortedPrompts = [...prompts].sort((a, b) => a.eco_score - b.eco_score);

  // Display each prompt
  sortedPrompts.forEach(prompt => {
    const promptCard = createPromptCard(prompt);
    container.appendChild(promptCard);
  });
}

function createPromptCard(prompt) {
  const card = document.createElement('div');
  card.className = 'bg-white rounded-lg shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow';

  const ecoRating = getEcoRating(prompt.eco_score);
  const ecoColor = prompt.eco_score <= 20 ? 'eco-green' :
                   prompt.eco_score <= 40 ? 'blue' :
                   prompt.eco_score <= 60 ? 'yellow' : 'red';

  card.innerHTML = `
    <div class="flex items-start justify-between mb-2">
      <div class="flex-1">
        <div class="text-sm text-gray-700 line-clamp-2 mb-2">${escapeHtml(prompt.text)}</div>
        <div class="flex flex-wrap gap-1 mb-2">
          ${prompt.tags.map(tag => `<span class="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">${escapeHtml(tag)}</span>`).join('')}
        </div>
      </div>
      <div class="ml-3 flex-shrink-0">
        <div class="w-12 h-12 rounded-full bg-${ecoColor}-100 flex items-center justify-center">
          <span class="text-lg font-bold text-${ecoColor}-700">${prompt.eco_score}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-2 text-xs mb-3">
      <div class="text-gray-600">
        <span class="font-medium">⚡</span> ${prompt.impact.energy.wh.toFixed(2)} Wh
      </div>
      <div class="text-gray-600">
        <span class="font-medium">💧</span> ${prompt.impact.water.milliliters.toFixed(1)} mL
      </div>
      <div class="text-gray-600">
        <span class="font-medium">🌍</span> ${prompt.impact.carbon.grams.toFixed(2)} g
      </div>
    </div>

    <div class="flex gap-2">
      <button class="flex-1 px-3 py-2 bg-eco-green-50 text-eco-green-700 text-sm font-medium rounded hover:bg-eco-green-100 transition" onclick="copyPromptText('${prompt.id}')">
        📋 Copy
      </button>
      <button class="flex-1 px-3 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded hover:bg-blue-100 transition" onclick="usePrompt('${prompt.id}')">
        ✨ Use
      </button>
      <button class="px-3 py-2 bg-red-50 text-red-700 text-sm font-medium rounded hover:bg-red-100 transition" onclick="deletePrompt('${prompt.id}')">
        🗑️
      </button>
    </div>
  `;

  return card;
}

// Global functions for prompt card actions
window.copyPromptText = async function(promptId) {
  const prompts = await StorageManager.getPromptLibrary();
  const prompt = prompts.find(p => p.id === promptId);
  if (prompt) {
    navigator.clipboard.writeText(prompt.text);
    showNotification('Prompt copied to clipboard!', 'success');
  }
};

window.usePrompt = async function(promptId) {
  const prompts = await StorageManager.getPromptLibrary();
  const prompt = prompts.find(p => p.id === promptId);
  if (prompt) {
    // Switch to calculator tab
    document.querySelector('[data-tab="calculator"]').click();
    // Fill in the prompt
    document.getElementById('promptInput').value = prompt.text;
    // Trigger calculation
    calculateAndDisplay();
    // Increment use count
    await StorageManager.incrementPromptUseCount(promptId);
    showNotification('Prompt loaded in calculator!', 'success');
  }
};

window.deletePrompt = async function(promptId) {
  if (confirm('Are you sure you want to delete this prompt?')) {
    await StorageManager.deletePromptFromLibrary(promptId);
    await initializeLibrary();
    showNotification('Prompt deleted', 'info');
  }
};

async function exportLibrary() {
  try {
    const jsonData = await StorageManager.exportLibraryAsJSON();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `eco-prompt-library-${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);
    showNotification('Library exported successfully!', 'success');
  } catch (error) {
    showNotification('Export failed', 'error');
    console.error(error);
  }
}

// ==============================================================================
// SETTINGS TAB LOGIC
// ==============================================================================

async function initializeSettings() {
  const settings = await StorageManager.getSettings();

  // Set unit system
  const unitInputs = document.querySelectorAll('input[name="units"]');
  unitInputs.forEach(input => {
    input.checked = input.value === settings.units;
    input.addEventListener('change', async (e) => {
      if (e.target.checked) {
        await StorageManager.updateSettings({ units: e.target.value });
        currentSettings = await StorageManager.getSettings();
        showNotification('Unit system updated', 'success');
        // Recalculate if there's a prompt
        if (document.getElementById('promptInput').value.trim()) {
          calculateAndDisplay();
        }
      }
    });
  });

  // Set grid profile
  const gridProfileSelect = document.getElementById('gridProfile');
  gridProfileSelect.value = settings.gridProfile || 'AZURE_OPENAI';
  gridProfileSelect.addEventListener('change', async (e) => {
    await StorageManager.updateSettings({ gridProfile: e.target.value });
    currentSettings = await StorageManager.getSettings();
    showNotification('Grid profile updated', 'success');
    // Recalculate if there's a prompt
    if (document.getElementById('promptInput').value.trim()) {
      calculateAndDisplay();
    }
  });

  // Custom CIF
  const customCIFInput = document.getElementById('customCIF');
  if (settings.customCIF) {
    customCIFInput.value = settings.customCIF;
  }
  customCIFInput.addEventListener('change', async (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      await StorageManager.updateSettings({ customCIF: value });
      currentSettings = await StorageManager.getSettings();
      showNotification('Custom CIF updated', 'success');
    }
  });
}

async function updateUsageStatsDisplay() {
  const stats = await StorageManager.getUsageStats();

  document.getElementById('statQueries').textContent = stats.totalQueries;
  document.getElementById('statTokens').textContent = stats.totalTokens.toLocaleString();
  document.getElementById('statEnergy').textContent = `${stats.totalEnergy.toFixed(2)} Wh`;
  document.getElementById('statSaved').textContent = `${stats.savedEnergy.toFixed(2)} Wh`;
}

// ==============================================================================
// UTILITY FUNCTIONS
// ==============================================================================

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showNotification(message, type = 'info') {
  const colors = {
    success: 'bg-eco-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-4 py-3 rounded-lg shadow-lg z-50 transition-opacity duration-300`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}
