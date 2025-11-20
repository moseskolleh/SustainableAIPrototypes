// EcoPrompt Coach - Background Service Worker

// Initialize storage on install
chrome.runtime.onInstalled.addListener(() => {
  initializeStorage();
});

function initializeStorage() {
  chrome.storage.local.get(['initialized'], (result) => {
    if (!result.initialized) {
      chrome.storage.local.set({
        initialized: true,
        todayCO2: 0,
        todayQueries: 0,
        totalCO2: 0,
        totalQueries: 0,
        efficiency: 100,
        savedCO2: 0,
        treesGrown: 0,
        creditsBalance: 150,
        weeklyData: [0, 0, 0, 0, 0, 0, 0],
        achievements: [],
        settings: {
          notificationsEnabled: true,
          trackingEnabled: true,
          showImpactBefore: true
        }
      });
    }
  });
}

// Track AI query
function trackQuery(details) {
  chrome.storage.local.get([
    'todayCO2',
    'todayQueries',
    'totalCO2',
    'totalQueries',
    'weeklyData'
  ], (result) => {
    const co2PerQuery = details.estimatedCO2 || 0.32; // grams

    const newTodayCO2 = (result.todayCO2 || 0) + co2PerQuery;
    const newTodayQueries = (result.todayQueries || 0) + 1;
    const newTotalCO2 = (result.totalCO2 || 0) + co2PerQuery;
    const newTotalQueries = (result.totalQueries || 0) + 1;

    // Update weekly data (today is last element)
    const weeklyData = result.weeklyData || [0, 0, 0, 0, 0, 0, 0];
    weeklyData[6] += co2PerQuery;

    // Calculate efficiency (queries that got answer on first try)
    const efficiency = Math.round(
      ((details.oneShotSuccess ? 1 : 0) / newTodayQueries) * 100
    );

    chrome.storage.local.set({
      todayCO2: Number(newTodayCO2.toFixed(2)),
      todayQueries: newTodayQueries,
      totalCO2: Number(newTotalCO2.toFixed(2)),
      totalQueries: newTotalQueries,
      efficiency,
      weeklyData
    });

    // Check for achievements
    checkAchievements(newTodayCO2, newTodayQueries, efficiency);
  });
}

// Check and unlock achievements
function checkAchievements(co2, queries, efficiency) {
  chrome.storage.local.get(['achievements'], (result) => {
    const achievements = result.achievements || [];

    // Define achievement conditions
    const newAchievements = [];

    if (queries >= 10 && !achievements.includes('efficient_starter')) {
      newAchievements.push('efficient_starter');
      showAchievementNotification('Efficient Starter', '10 queries completed!');
    }

    if (co2 >= 100 && !achievements.includes('growing_green')) {
      newAchievements.push('growing_green');
      showAchievementNotification('Growing Green', 'Saved 100g CO₂!');
    }

    if (efficiency >= 90 && queries >= 50 && !achievements.includes('prompt_master')) {
      newAchievements.push('prompt_master');
      showAchievementNotification('Prompt Master', '90%+ efficiency!');
    }

    if (newAchievements.length > 0) {
      chrome.storage.local.set({
        achievements: [...achievements, ...newAchievements]
      });
    }
  });
}

// Show achievement notification
function showAchievementNotification(title, message) {
  chrome.storage.local.get(['settings'], (result) => {
    if (result.settings?.notificationsEnabled !== false) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: `🏆 Achievement Unlocked: ${title}`,
        message,
        priority: 2
      });
    }
  });
}

// Reset daily stats at midnight
function resetDailyStats() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const msUntilMidnight = tomorrow - now;

  setTimeout(() => {
    chrome.storage.local.get(['weeklyData', 'todayCO2'], (result) => {
      // Shift weekly data (remove oldest, add today's as new)
      const weeklyData = result.weeklyData || [0, 0, 0, 0, 0, 0, 0];
      weeklyData.shift(); // Remove oldest day
      weeklyData.push(result.todayCO2 || 0); // Add today

      chrome.storage.local.set({
        todayCO2: 0,
        todayQueries: 0,
        weeklyData
      });
    });

    // Schedule next reset
    resetDailyStats();
  }, msUntilMidnight);
}

// Start daily reset timer
resetDailyStats();

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'trackQuery') {
    trackQuery(request.details);
    sendResponse({ success: true });
  }

  if (request.action === 'getStats') {
    chrome.storage.local.get([
      'todayCO2',
      'todayQueries',
      'efficiency',
      'creditsBalance'
    ], (result) => {
      sendResponse(result);
    });
    return true; // Async response
  }

  if (request.action === 'analyzePrompt') {
    // Could call external API here for real analysis
    const analysis = {
      score: Math.floor(Math.random() * 40) + 60,
      suggestions: [
        'Add more context',
        'Specify output format'
      ]
    };
    sendResponse(analysis);
  }
});

// Context menu for quick access
chrome.contextMenus.create({
  id: 'ecoprompt-analyze',
  title: 'Analyze with EcoPrompt Coach',
  contexts: ['selection']
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'ecoprompt-analyze') {
    // Send selected text to extension for analysis
    chrome.tabs.sendMessage(tab.id, {
      action: 'analyzeSelection',
      text: info.selectionText
    });
  }
});

console.log('EcoPrompt Coach background service worker loaded');
