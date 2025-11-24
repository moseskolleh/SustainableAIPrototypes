# Integration Guide: Enhanced Features

This guide explains how to integrate the new comprehensive features into the Prompt Coach + Dashboard prototype.

## New Files Added

1. **sustainable-alternatives-data.js** - Complete database of 25 eco-friendly tools
2. **gamification-system.js** - Full achievement, badge, and credits system

## Integration Steps

### Step 1: Load New Scripts in index.html

Add these script tags before `app.js`:

```html
<script src="sustainable-alternatives-data.js"></script>
<script src="gamification-system.js"></script>
<script src="app.js"></script>
```

### Step 2: Initialize Gamification Manager

Add at the top of `app.js`:

```javascript
// Initialize gamification
const gamificationManager = new GamificationManager();

// Update state to use gamification
const state = {
    ...gamificationManager.userProgress,
    currentTab: 'coach'
};
```

### Step 3: Enhance Dashboard Tab with Full Alternatives List

Replace the alternatives section in the Dashboard tab:

```javascript
// In initDashboard() function
function renderSustainableAlternatives() {
    const container = document.querySelector('.alternatives-grid');
    const recommended = getRecommendedAlternatives();

    container.innerHTML = recommended.map(alt => `
        <div class="alternative-item ${alt.ministryApproved ? 'approved' : ''}">
            <div class="alt-header">
                <span class="alt-name">${alt.name}</span>
                <span class="alt-badge ${alt.status}">${alt.status}</span>
                ${alt.ministryApproved ? '<span class="ministry-badge">✓ Ministry Approved</span>' : ''}
            </div>
            <p>${alt.description}</p>
            <div class="alt-stats">
                <div class="alt-stat">
                    <strong>Efficiency:</strong> ${alt.efficiency}
                </div>
                <div class="alt-stat">
                    <strong>Potential Savings:</strong> ${alt.potentialSavings}
                </div>
            </div>
            <div class="alt-features">
                ${alt.features.slice(0, 2).map(f => `<div class="feature">✓ ${f}</div>`).join('')}
            </div>
            <div class="alt-actions">
                <button onclick="learnMore('${alt.id}')" class="btn-secondary">Learn More</button>
                <button onclick="trackAdoption('${alt.id}')" class="btn-primary">I'm Using This</button>
            </div>
        </div>
    `).join('');
}
```

### Step 4: Add Complete Alternatives Explorer Tab

Add a new tab to showcase all 25 alternatives:

```html
<!-- In navigation -->
<button class="tab" data-tab="alternatives">
    <span class="icon">🌱</span> Eco Alternatives
</button>

<!-- In content area -->
<div class="tab-content" id="alternatives">
    <h2>Sustainable AI Alternatives Marketplace</h2>
    <p class="subtitle">Explore all 25 researched eco-friendly tools</p>

    <div class="alternatives-filters">
        <input type="text" id="alt-search" placeholder="Search alternatives...">
        <select id="alt-category">
            <option value="all">All Categories</option>
            <option value="aiModels">AI Models (2)</option>
            <option value="searchEngines">Search Engines (5)</option>
            <option value="developerTools">Developer Tools (8)</option>
            <option value="hosting">Green Hosting (5)</option>
            <option value="calculators">Calculators (4)</option>
            <option value="awarenessTools">Awareness Tools (1)</option>
        </select>
        <select id="alt-difficulty">
            <option value="all">All Difficulties</option>
            <option value="Very Easy">Very Easy</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
        </select>
    </div>

    <div class="alternatives-full-grid" id="alternatives-full-grid">
        <!-- Populated by JS -->
    </div>
</div>
```

### Step 5: Enhance Achievement System

Add comprehensive achievement tracking:

```javascript
function checkAndUnlockAchievements() {
    // Update CO2 savings
    gamificationManager.userProgress.totalCO2Saved = parseFloat(state.totalCO2Saved);

    // Update prompt stats
    gamificationManager.userProgress.promptsOptimized = state.optimizedQueries;
    gamificationManager.userProgress.oneShotSuccesses = state.oneShot Successes || state.optimizedQueries;

    // Check achievements
    const newUnlocks = gamificationManager.checkAchievements();

    // Show notifications for new achievements
    newUnlocks.forEach(unlock => {
        showAchievementNotification(unlock.achievement);
    });

    // Update UI
    renderAchievements();
}

function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-unlock-notification';
    notification.innerHTML = `
        <div class="achievement-unlock-content">
            <div class="achievement-icon-large">${achievement.icon}</div>
            <div class="achievement-details">
                <h3>Achievement Unlocked!</h3>
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
                <div class="credits-earned">+${achievement.credits} credits</div>
            </div>
        </div>
    `;

    document.body.appendChild(notification);

    // Animate and remove
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}
```

### Step 6: Add Credits Earning Tracking

Enhance existing functions to award credits:

```javascript
// In analyzePrompt() function, add:
function analyzePrompt(prompt) {
    // ... existing code ...

    // Award credits
    gamificationManager.earnCredits('optimizePrompt');

    // Check for achievements
    checkAndUnlockAchievements();

    // Update UI
    updateCreditsDisplay();
}

// In useLibraryPrompt() function, add:
function useLibraryPrompt(id) {
    // ... existing code ...

    // Award credits
    gamificationManager.earnCredits('useLibraryPrompt');
    updateCreditsDisplay();
}

function updateCreditsDisplay() {
    document.getElementById('credits').textContent = gamificationManager.userProgress.credits;

    // Also update dashboard stats
    document.getElementById('credits-earned').textContent =
        gamificationManager.userProgress.totalCreditsEarned;
}
```

### Step 7: Add Full Achievement Display

Create a comprehensive achievements panel:

```html
<!-- Add to Dashboard tab -->
<div class="achievements-full-panel">
    <h3>Your Achievements</h3>

    <div class="tier-progress">
        <div class="current-tier">
            <span class="tier-icon" id="current-tier-icon">🌱</span>
            <span class="tier-name" id="current-tier-name">Beginner</span>
        </div>
        <div class="tier-progress-bar">
            <div class="tier-fill" id="tier-fill"></div>
        </div>
        <div class="next-tier">
            <span>Next: Intermediate</span>
        </div>
    </div>

    <div class="achievements-by-tier">
        <div class="tier-section">
            <h4>🌱 Beginner Tier</h4>
            <div class="achievements-grid" id="beginner-achievements"></div>
        </div>

        <div class="tier-section">
            <h4>🌿 Intermediate Tier</h4>
            <div class="achievements-grid" id="intermediate-achievements"></div>
        </div>

        <div class="tier-section">
            <h4>🌳 Advanced Tier</h4>
            <div class="achievements-grid" id="advanced-achievements"></div>
        </div>

        <div class="tier-section">
            <h4>🌟 Expert Tier</h4>
            <div class="achievements-grid" id="expert-achievements"></div>
        </div>
    </div>
</div>
```

### Step 8: Implement Credits Shop

Add a new section for spending credits:

```html
<div class="credits-shop">
    <h3>
        <span class="icon">🏪</span>
        Credits Shop
    </h3>
    <p class="subtitle">Redeem your earned credits for rewards</p>

    <div class="shop-categories">
        <div class="shop-category">
            <h4>AI Usage</h4>
            <div class="shop-items">
                <div class="shop-item">
                    <div class="item-name">Standard AI Query</div>
                    <div class="item-cost">1 credit</div>
                    <button onclick="redeemCredits('aiQuery')">Redeem</button>
                </div>
                <div class="shop-item">
                    <div class="item-name">Premium AI Query</div>
                    <div class="item-cost">3 credits</div>
                    <button onclick="redeemCredits('premiumAIQuery')">Redeem</button>
                </div>
            </div>
        </div>

        <div class="shop-category">
            <h4>Environmental Impact</h4>
            <div class="shop-items">
                <div class="shop-item">
                    <div class="item-name">Plant a Tree</div>
                    <div class="item-cost">100 credits</div>
                    <button onclick="redeemCredits('plantTree')">Redeem</button>
                </div>
                <div class="shop-item">
                    <div class="item-name">Offset 1 Ton CO₂</div>
                    <div class="item-cost">1,000 credits</div>
                    <button onclick="redeemCredits('offsetTon')">Redeem</button>
                </div>
            </div>
        </div>
    </div>
</div>
```

## Partner Feedback Integration

### Matthijs's Feedback: Quality vs. Efficiency Trade-off
✅ **Already implemented** in trade-off indicator
- Shows clear balance between quality and efficiency
- Three modes: Quality First, Balanced, Efficiency First

### Thomas's Feedback: Behavior Change Focus
✅ **Implemented** through:
- Gamification system that rewards sustainable behaviors
- Real-time CO₂ tracking
- Achievement system focused on actions, not just awareness

### Jop's Feedback: Combine Prototypes 4 & 5
✅ **Implemented** - Single interface combines:
- Prompt Coach (training)
- Prompt Library (reusable templates)
- Dashboard (metrics)
- Analytics (deep dive)

### All Partners: Start with MVP
✅ **Architecture supports**:
- Core features implemented
- Azure metrics integration structure in place
- Extensible design for future enhancements

## Testing the Integration

### 1. Test Sustainable Alternatives
```javascript
// In browser console:
console.log(getAllAlternatives());
console.log(getRecommendedAlternatives());
console.log(searchAlternatives('deepseek'));
```

### 2. Test Gamification
```javascript
// Test credit earning
gamificationManager.earnCredits('optimizePrompt');
console.log(gamificationManager.userProgress.credits);

// Test achievement unlock
gamificationManager.userProgress.totalCO2Saved = 100;
gamificationManager.checkAchievements();
```

### 3. Test Achievement Progress
```javascript
// Simulate saving CO₂
gamificationManager.userProgress.totalCO2Saved += 50;
checkAndUnlockAchievements();
```

## Next Steps

1. **Azure Integration**: Connect to real Azure metrics API
2. **Backend API**: Create Node.js backend for persistence
3. **Real-time Updates**: Add WebSocket for live leaderboards
4. **Mobile App**: Create companion mobile apps

## Support

For questions or issues:
- Check main README.md
- Review PARTNER_FEEDBACK_SUMMARY.md for context
- See REFINED_PROTOTYPES.md for full specifications
