/**
 * Storage Manager for Eco-Prompt Library
 * Handles all chrome.storage.local operations for persisting user data
 */

// ==============================================================================
// STORAGE KEYS
// ==============================================================================

const STORAGE_KEYS = {
  PROMPT_LIBRARY: 'ecoPromptLibrary',
  SETTINGS: 'ecoSmartSettings',
  USAGE_STATS: 'ecoSmartUsageStats',
  ACHIEVEMENTS: 'ecoSmartAchievements'
};

// ==============================================================================
// DEFAULT DATA STRUCTURES
// ==============================================================================

const DEFAULT_SETTINGS = {
  units: 'metric',              // 'metric' or 'imperial'
  gridProfile: 'AZURE_OPENAI',  // 'AZURE_OPENAI', 'AWS_ANTHROPIC', 'DEEPSEEK_CHINA'
  customCIF: null,              // Optional custom Carbon Intensity Factor
  outputEstimation: 'general',  // Default output type estimation
  showAnalogies: true,
  theme: 'green'                // UI theme
};

const DEFAULT_STATS = {
  totalQueries: 0,
  totalTokens: 0,
  totalEnergy: 0,
  totalWater: 0,
  totalCarbon: 0,
  savedEnergy: 0,
  savedWater: 0,
  savedCarbon: 0,
  firstUsed: null,
  lastUsed: null
};

// ==============================================================================
// ECO-PROMPT LIBRARY OPERATIONS
// ==============================================================================

/**
 * Data schema for saved prompts:
 * {
 *   id: string (UUID),
 *   text: string (the prompt content),
 *   tags: string[] (user-defined tags),
 *   eco_score: number (0-100),
 *   tokens: { input: number, output: number, total: number },
 *   impact: { energy, water, carbon objects },
 *   saved_at: timestamp,
 *   last_used: timestamp,
 *   use_count: number
 * }
 */

/**
 * Get all saved prompts from library
 * @returns {Promise<Array>} Array of saved prompt objects
 */
async function getPromptLibrary() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEYS.PROMPT_LIBRARY], (result) => {
      resolve(result[STORAGE_KEYS.PROMPT_LIBRARY] || []);
    });
  });
}

/**
 * Save a new prompt to the library
 * @param {object} promptData - The prompt data to save
 * @returns {Promise<object>} The saved prompt with ID
 */
async function savePromptToLibrary(promptData) {
  const prompts = await getPromptLibrary();

  const newPrompt = {
    id: generateUUID(),
    text: promptData.text,
    tags: promptData.tags || [],
    eco_score: promptData.eco_score,
    tokens: promptData.tokens,
    impact: promptData.impact,
    saved_at: new Date().toISOString(),
    last_used: new Date().toISOString(),
    use_count: 0
  };

  prompts.push(newPrompt);

  return new Promise((resolve) => {
    chrome.storage.local.set({
      [STORAGE_KEYS.PROMPT_LIBRARY]: prompts
    }, () => {
      resolve(newPrompt);
    });
  });
}

/**
 * Update an existing prompt in the library
 * @param {string} promptId - The ID of the prompt to update
 * @param {object} updates - Object with fields to update
 * @returns {Promise<object>} The updated prompt
 */
async function updatePromptInLibrary(promptId, updates) {
  const prompts = await getPromptLibrary();
  const index = prompts.findIndex(p => p.id === promptId);

  if (index === -1) {
    throw new Error(`Prompt with ID ${promptId} not found`);
  }

  prompts[index] = {
    ...prompts[index],
    ...updates
  };

  return new Promise((resolve) => {
    chrome.storage.local.set({
      [STORAGE_KEYS.PROMPT_LIBRARY]: prompts
    }, () => {
      resolve(prompts[index]);
    });
  });
}

/**
 * Delete a prompt from the library
 * @param {string} promptId - The ID of the prompt to delete
 * @returns {Promise<boolean>} True if deleted successfully
 */
async function deletePromptFromLibrary(promptId) {
  const prompts = await getPromptLibrary();
  const filtered = prompts.filter(p => p.id !== promptId);

  return new Promise((resolve) => {
    chrome.storage.local.set({
      [STORAGE_KEYS.PROMPT_LIBRARY]: filtered
    }, () => {
      resolve(true);
    });
  });
}

/**
 * Search prompts by tag or text content
 * @param {string} query - Search query
 * @returns {Promise<Array>} Matching prompts
 */
async function searchPrompts(query) {
  const prompts = await getPromptLibrary();
  const lowerQuery = query.toLowerCase();

  return prompts.filter(prompt => {
    // Search in text content
    if (prompt.text.toLowerCase().includes(lowerQuery)) return true;

    // Search in tags
    if (prompt.tags.some(tag => tag.toLowerCase().includes(lowerQuery))) return true;

    return false;
  });
}

/**
 * Get prompts filtered by tags
 * @param {string[]} tags - Array of tags to filter by
 * @returns {Promise<Array>} Matching prompts
 */
async function getPromptsByTags(tags) {
  const prompts = await getPromptLibrary();

  return prompts.filter(prompt => {
    return tags.some(tag => prompt.tags.includes(tag));
  });
}

/**
 * Get all unique tags from the library
 * @returns {Promise<Array>} Array of unique tags
 */
async function getAllTags() {
  const prompts = await getPromptLibrary();
  const tagSet = new Set();

  prompts.forEach(prompt => {
    prompt.tags.forEach(tag => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}

/**
 * Export library as JSON file
 * @returns {Promise<string>} JSON string of the library
 */
async function exportLibraryAsJSON() {
  const prompts = await getPromptLibrary();
  const exportData = {
    version: '1.0',
    exported_at: new Date().toISOString(),
    prompt_count: prompts.length,
    prompts: prompts
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Import library from JSON
 * @param {string} jsonString - JSON string to import
 * @param {boolean} merge - Whether to merge with existing or replace
 * @returns {Promise<number>} Number of prompts imported
 */
async function importLibraryFromJSON(jsonString, merge = true) {
  try {
    const importData = JSON.parse(jsonString);

    if (!importData.prompts || !Array.isArray(importData.prompts)) {
      throw new Error('Invalid import format');
    }

    let finalPrompts = importData.prompts;

    if (merge) {
      const existingPrompts = await getPromptLibrary();
      // Merge, avoiding duplicates based on text content
      const existingTexts = new Set(existingPrompts.map(p => p.text));
      const newPrompts = importData.prompts.filter(p => !existingTexts.has(p.text));
      finalPrompts = [...existingPrompts, ...newPrompts];
    }

    return new Promise((resolve, reject) => {
      chrome.storage.local.set({
        [STORAGE_KEYS.PROMPT_LIBRARY]: finalPrompts
      }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(finalPrompts.length);
        }
      });
    });
  } catch (error) {
    throw new Error(`Import failed: ${error.message}`);
  }
}

/**
 * Increment use count for a prompt
 * @param {string} promptId - The ID of the prompt
 * @returns {Promise<void>}
 */
async function incrementPromptUseCount(promptId) {
  const prompts = await getPromptLibrary();
  const prompt = prompts.find(p => p.id === promptId);

  if (prompt) {
    prompt.use_count++;
    prompt.last_used = new Date().toISOString();

    return new Promise((resolve) => {
      chrome.storage.local.set({
        [STORAGE_KEYS.PROMPT_LIBRARY]: prompts
      }, resolve);
    });
  }
}

// ==============================================================================
// SETTINGS OPERATIONS
// ==============================================================================

/**
 * Get user settings
 * @returns {Promise<object>} Settings object
 */
async function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEYS.SETTINGS], (result) => {
      resolve({
        ...DEFAULT_SETTINGS,
        ...(result[STORAGE_KEYS.SETTINGS] || {})
      });
    });
  });
}

/**
 * Update settings
 * @param {object} updates - Settings to update
 * @returns {Promise<object>} Updated settings
 */
async function updateSettings(updates) {
  const currentSettings = await getSettings();
  const newSettings = { ...currentSettings, ...updates };

  return new Promise((resolve) => {
    chrome.storage.local.set({
      [STORAGE_KEYS.SETTINGS]: newSettings
    }, () => {
      resolve(newSettings);
    });
  });
}

/**
 * Reset settings to default
 * @returns {Promise<object>} Default settings
 */
async function resetSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.set({
      [STORAGE_KEYS.SETTINGS]: DEFAULT_SETTINGS
    }, () => {
      resolve(DEFAULT_SETTINGS);
    });
  });
}

// ==============================================================================
// USAGE STATISTICS OPERATIONS
// ==============================================================================

/**
 * Get usage statistics
 * @returns {Promise<object>} Usage stats object
 */
async function getUsageStats() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEYS.USAGE_STATS], (result) => {
      const stats = result[STORAGE_KEYS.USAGE_STATS] || { ...DEFAULT_STATS };
      if (!stats.firstUsed) {
        stats.firstUsed = new Date().toISOString();
      }
      resolve(stats);
    });
  });
}

/**
 * Update usage statistics with new query data
 * @param {object} impactData - Impact calculation result
 * @returns {Promise<object>} Updated stats
 */
async function updateUsageStats(impactData) {
  const stats = await getUsageStats();

  stats.totalQueries++;
  stats.totalTokens += impactData.tokens.total;
  stats.totalEnergy += impactData.impact.energy.wh;
  stats.totalWater += impactData.impact.water.liters;
  stats.totalCarbon += impactData.impact.carbon.kg;
  stats.lastUsed = new Date().toISOString();

  return new Promise((resolve) => {
    chrome.storage.local.set({
      [STORAGE_KEYS.USAGE_STATS]: stats
    }, () => {
      resolve(stats);
    });
  });
}

/**
 * Record savings from optimization
 * @param {object} savingsData - Savings calculation result
 * @returns {Promise<object>} Updated stats
 */
async function recordSavings(savingsData) {
  const stats = await getUsageStats();

  stats.savedEnergy += savingsData.energy.wh;
  stats.savedWater += savingsData.water.liters;
  stats.savedCarbon += savingsData.carbon.kg;

  return new Promise((resolve) => {
    chrome.storage.local.set({
      [STORAGE_KEYS.USAGE_STATS]: stats
    }, () => {
      resolve(stats);
    });
  });
}

/**
 * Reset all statistics
 * @returns {Promise<object>} Reset stats
 */
async function resetUsageStats() {
  const resetStats = {
    ...DEFAULT_STATS,
    firstUsed: new Date().toISOString()
  };

  return new Promise((resolve) => {
    chrome.storage.local.set({
      [STORAGE_KEYS.USAGE_STATS]: resetStats
    }, () => {
      resolve(resetStats);
    });
  });
}

// ==============================================================================
// UTILITY FUNCTIONS
// ==============================================================================

/**
 * Generate a UUID for unique identifiers
 * @returns {string} UUID
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Get total storage usage
 * @returns {Promise<number>} Bytes used
 */
async function getStorageUsage() {
  return new Promise((resolve) => {
    chrome.storage.local.getBytesInUse(null, (bytes) => {
      resolve(bytes);
    });
  });
}

/**
 * Clear all app data (use with caution!)
 * @returns {Promise<void>}
 */
async function clearAllData() {
  return new Promise((resolve) => {
    chrome.storage.local.remove(Object.values(STORAGE_KEYS), resolve);
  });
}

// ==============================================================================
// EXPORTS
// ==============================================================================

if (typeof window !== 'undefined') {
  window.StorageManager = {
    // Prompt Library
    getPromptLibrary,
    savePromptToLibrary,
    updatePromptInLibrary,
    deletePromptFromLibrary,
    searchPrompts,
    getPromptsByTags,
    getAllTags,
    exportLibraryAsJSON,
    importLibraryFromJSON,
    incrementPromptUseCount,

    // Settings
    getSettings,
    updateSettings,
    resetSettings,

    // Usage Stats
    getUsageStats,
    updateUsageStats,
    recordSavings,
    resetUsageStats,

    // Utilities
    getStorageUsage,
    clearAllData,

    // Constants
    STORAGE_KEYS
  };
}
