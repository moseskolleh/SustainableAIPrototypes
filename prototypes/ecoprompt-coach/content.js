// EcoPrompt Coach - Content Script
// Injects impact tracking into AI platforms

(function() {
  'use strict';

  // Configuration for different AI platforms
  const PLATFORMS = {
    'chat.openai.com': {
      name: 'ChatGPT',
      textareaSelector: '#prompt-textarea',
      submitButtonSelector: 'button[data-testid="send-button"]',
      co2PerQuery: 0.35
    },
    'claude.ai': {
      name: 'Claude',
      textareaSelector: 'div[contenteditable="true"]',
      submitButtonSelector: 'button[aria-label="Send Message"]',
      co2PerQuery: 0.30
    },
    'gemini.google.com': {
      name: 'Gemini',
      textareaSelector: 'rich-textarea',
      submitButtonSelector: 'button[aria-label="Send message"]',
      co2PerQuery: 0.32
    }
  };

  const currentPlatform = PLATFORMS[window.location.hostname];

  if (!currentPlatform) {
    console.log('EcoPrompt Coach: Platform not supported');
    return;
  }

  console.log(`EcoPrompt Coach: Initialized on ${currentPlatform.name}`);

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
            <span class="ecoprompt-value">~${currentPlatform.co2PerQuery}g CO₂</span>
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

  // Update indicator with current stats
  async function updateIndicator(indicator) {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'getStats'
      });

      const todayElement = indicator.querySelector('#ecoprompt-today');
      if (todayElement && response) {
        todayElement.textContent = `${response.todayCO2 || 0}g CO₂`;
      }
    } catch (error) {
      console.error('EcoPrompt Coach: Error updating stats', error);
    }
  }

  // Track query submission
  function trackQuerySubmission() {
    chrome.runtime.sendMessage({
      action: 'trackQuery',
      details: {
        platform: currentPlatform.name,
        estimatedCO2: currentPlatform.co2PerQuery,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Monitor for query submissions
  function monitorSubmissions() {
    const submitButton = document.querySelector(currentPlatform.submitButtonSelector);

    if (submitButton) {
      submitButton.addEventListener('click', trackQuerySubmission);
    }

    // Also monitor for Enter key in textarea
    const textarea = document.querySelector(currentPlatform.textareaSelector);
    if (textarea) {
      textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          trackQuerySubmission();
        }
      });
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
