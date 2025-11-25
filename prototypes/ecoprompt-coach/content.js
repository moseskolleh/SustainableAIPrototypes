// EcoPrompt Coach - Content Script
// Injects impact tracking into AI platforms

(function() {
  'use strict';

  // Configuration for different AI platforms
  const PLATFORMS = {
    'chat.openai.com': {
      name: 'ChatGPT',
      textareaSelectors: ['#prompt-textarea', 'textarea[data-id]', 'textarea'],
      submitButtonSelectors: ['button[data-testid="send-button"]', 'button[data-testid="fruitjuice-send-button"]'],
      co2PerQuery: 0.35,
      usesContentEditable: false
    },
    'claude.ai': {
      name: 'Claude',
      textareaSelectors: ['div[contenteditable="true"]', 'div[role="textbox"]'],
      submitButtonSelectors: ['button[aria-label="Send Message"]', 'button[type="submit"]'],
      co2PerQuery: 0.30,
      usesContentEditable: true
    },
    'gemini.google.com': {
      name: 'Gemini',
      textareaSelectors: ['rich-textarea', 'textarea', 'div[contenteditable="true"]'],
      submitButtonSelectors: ['button[aria-label="Send message"]', 'button[aria-label*="Send"]'],
      co2PerQuery: 0.32,
      usesContentEditable: false
    },
    'www.bing.com': {
      name: 'Bing Chat',
      textareaSelectors: ['textarea[id*="search"]', 'textarea.b_searchbox'],
      submitButtonSelectors: ['button[id*="submit"]', 'button[aria-label*="Send"]'],
      co2PerQuery: 0.33,
      usesContentEditable: false
    },
    'www.perplexity.ai': {
      name: 'Perplexity',
      textareaSelectors: ['textarea', 'div[contenteditable="true"]'],
      submitButtonSelectors: ['button[type="submit"]', 'button[aria-label*="Submit"]'],
      co2PerQuery: 0.31,
      usesContentEditable: false
    },
    'you.com': {
      name: 'You.com',
      textareaSelectors: ['textarea', 'input[type="text"]'],
      submitButtonSelectors: ['button[type="submit"]'],
      co2PerQuery: 0.32,
      usesContentEditable: false
    },
    'copilot.microsoft.com': {
      name: 'Microsoft Copilot',
      textareaSelectors: ['textarea', 'div[contenteditable="true"]'],
      submitButtonSelectors: ['button[aria-label*="Send"]', 'button[type="submit"]'],
      co2PerQuery: 0.33,
      usesContentEditable: false
    }
  };

  const currentPlatform = PLATFORMS[window.location.hostname];

  if (!currentPlatform) {
    console.log('EcoPrompt Coach: Platform not supported');
    return;
  }

  console.log(`EcoPrompt Coach: Initialized on ${currentPlatform.name}`);

  // State management
  let currentPromptText = '';
  let currentTextarea = null;

  // Get the prompt text from the textarea
  function getPromptText() {
    if (!currentTextarea) return '';

    if (currentPlatform.usesContentEditable) {
      return currentTextarea.textContent || currentTextarea.innerText || '';
    } else {
      return currentTextarea.value || '';
    }
  }

  // Calculate dynamic CO2 based on actual prompt text
  function calculateDynamicCO2(promptText) {
    if (!promptText || promptText.trim().length === 0) {
      return currentPlatform.co2PerQuery; // Default fallback
    }

    // Use the core engine to calculate actual CO2
    if (typeof EcoSmartEngine !== 'undefined') {
      const impact = EcoSmartEngine.calculateEnvironmentalImpact(promptText, {
        outputType: 'general',
        gridProfile: 'AZURE_OPENAI'
      });
      return impact.impact.carbon.grams;
    }

    // Fallback: simple token-based estimation
    const tokens = Math.ceil(promptText.length / 4);
    const co2PerToken = currentPlatform.co2PerQuery / 100; // Rough estimate
    return Math.max(tokens * co2PerToken, currentPlatform.co2PerQuery);
  }

  // Create impact indicator UI
  function createImpactIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'ecoprompt-indicator';
    indicator.innerHTML = `
      <div class="ecoprompt-widget">
        <div class="ecoprompt-header">
          <span class="ecoprompt-icon">🌱</span>
          <span class="ecoprompt-title">Impact Preview</span>
          <button class="ecoprompt-close" title="Hide">×</button>
        </div>
        <div class="ecoprompt-body">
          <div class="ecoprompt-stat">
            <span class="ecoprompt-label">This query:</span>
            <span class="ecoprompt-value" id="ecoprompt-current">~${currentPlatform.co2PerQuery}g CO₂</span>
          </div>
          <div class="ecoprompt-stat">
            <span class="ecoprompt-label">Today total:</span>
            <span class="ecoprompt-value" id="ecoprompt-today">Loading...</span>
          </div>
          <div class="ecoprompt-tip">
            💡 Tip: Be specific to get answers on first try!
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(indicator);

    // Close button
    indicator.querySelector('.ecoprompt-close').addEventListener('click', () => {
      indicator.style.display = 'none';
    });

    return indicator;
  }

  // Add CSS for impact indicator
  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #ecoprompt-indicator {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .ecoprompt-widget {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        width: 280px;
        overflow: hidden;
        animation: slideInRight 0.3s ease-out;
      }

      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .ecoprompt-header {
        background: linear-gradient(135deg, #2D5016, #4A7C2F);
        color: white;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .ecoprompt-icon {
        font-size: 20px;
      }

      .ecoprompt-title {
        flex: 1;
        font-weight: 600;
        font-size: 14px;
      }

      .ecoprompt-close {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.8;
        transition: opacity 0.2s;
      }

      .ecoprompt-close:hover {
        opacity: 1;
      }

      .ecoprompt-body {
        padding: 16px;
      }

      .ecoprompt-stat {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        font-size: 13px;
      }

      .ecoprompt-label {
        color: #7F8C8D;
      }

      .ecoprompt-value {
        font-weight: 700;
        color: #2D5016;
      }

      .ecoprompt-tip {
        background: #E8F5E0;
        padding: 10px;
        border-radius: 8px;
        font-size: 12px;
        color: #2D5016;
        margin-top: 12px;
      }

      .ecoprompt-pulse {
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%, 100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Update indicator with current stats and dynamic CO2
  async function updateIndicator(indicator) {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'getStats'
      });

      const todayElement = indicator.querySelector('#ecoprompt-today');
      if (todayElement && response) {
        todayElement.textContent = `${response.todayCO2 || 0}g CO₂`;
      }

      // Update current query CO2 based on prompt text
      const promptText = getPromptText();
      if (promptText !== currentPromptText) {
        currentPromptText = promptText;
        updateCurrentCO2(indicator, promptText);
      }
    } catch (error) {
      console.error('EcoPrompt Coach: Error updating stats', error);
    }
  }

  // Update the "This query" CO2 display
  function updateCurrentCO2(indicator, promptText) {
    const currentElement = indicator.querySelector('#ecoprompt-current');
    if (currentElement) {
      const co2Value = calculateDynamicCO2(promptText);
      currentElement.textContent = `~${co2Value.toFixed(2)}g CO₂`;
    }
  }

  // Track query submission with dynamic CO2
  function trackQuerySubmission() {
    const promptText = getPromptText();
    const estimatedCO2 = calculateDynamicCO2(promptText);

    chrome.runtime.sendMessage({
      action: 'trackQuery',
      details: {
        platform: currentPlatform.name,
        estimatedCO2: estimatedCO2,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Find textarea using multiple selectors
  function findTextarea() {
    for (const selector of currentPlatform.textareaSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element;
      }
    }
    return null;
  }

  // Find submit button using multiple selectors
  function findSubmitButton() {
    for (const selector of currentPlatform.submitButtonSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        return element;
      }
    }
    return null;
  }

  // Monitor for query submissions
  function monitorSubmissions() {
    const submitButton = findSubmitButton();

    if (submitButton) {
      submitButton.addEventListener('click', trackQuerySubmission);
    }

    // Also monitor for Enter key in textarea
    currentTextarea = findTextarea();
    if (currentTextarea) {
      currentTextarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          trackQuerySubmission();
        }
      });

      // Monitor text input for real-time CO2 updates
      const inputHandler = () => {
        const indicator = document.getElementById('ecoprompt-indicator');
        if (indicator) {
          const promptText = getPromptText();
          updateCurrentCO2(indicator, promptText);
        }
      };

      if (currentPlatform.usesContentEditable) {
        currentTextarea.addEventListener('input', inputHandler);
      } else {
        currentTextarea.addEventListener('input', inputHandler);
        currentTextarea.addEventListener('keyup', inputHandler);
      }
    }
  }

  // Initialize
  function init() {
    injectStyles();
    const indicator = createImpactIndicator();
    updateIndicator(indicator);

    // Update stats every 5 seconds
    setInterval(() => updateIndicator(indicator), 5000);

    // Monitor for submissions after page loads
    setTimeout(monitorSubmissions, 2000);

    // Re-check for new elements (for SPAs)
    const observer = new MutationObserver(() => {
      if (!document.querySelector('.ecoprompt-widget')) {
        // Widget removed, recreate
        init();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Listen for messages from background
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyzeSelection') {
      // Open popup with selected text
      console.log('Analyzing:', request.text);
      // Could open a modal here for analysis
    }
  });

})();
