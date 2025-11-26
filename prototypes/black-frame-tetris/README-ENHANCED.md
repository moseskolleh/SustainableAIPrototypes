# Enhanced Tetris - Dynamic AI Usage Intensity Dashboard

## Overview

This enhanced version of the Tetris game transforms it into a **dynamic dashboard** where every game action has meaning and directly impacts sustainability metrics in real-time.

## Key Features

### 1. **Meaningful Block Colors**
Each Tetris block color represents different AI usage patterns and sustainability impacts:

| Color | Meaning | CO2 Impact | Score Bonus | Description |
|-------|---------|------------|-------------|-------------|
| 🔵 **Blue** | Low Impact | -0.01 kg | +10 pts | Efficient AI usage, sustainable patterns |
| 🟢 **Green** | Sustainable | -0.02 kg | +25 pts | Optimized prompts, eco-friendly actions |
| 🟡 **Yellow** | Moderate | +0.05 kg | +5 pts | Standard usage, room for improvement |
| 🔴 **Red** | High Impact | +0.15 kg | -5 pts | Heavy AI usage, needs optimization |

### 2. **Dynamic AI Usage Intensity Graph**
- **Location**: Left panel
- **Purpose**: Tracks AI usage intensity over the last 7 days
- **Dynamic Updates**:
  - When blocks are placed, the current day's usage increases/decreases based on block color
  - Green blocks reduce intensity (sustainable usage)
  - Red blocks increase intensity (high usage)
  - The graph updates in real-time during gameplay

### 3. **Dynamic CO2 Saved Bar Chart**
- **Location**: Bottom left panel
- **Purpose**: Shows CO2 savings by different action types
- **Dynamic Updates**:
  - Updates when sustainable power-ups are used
  - Each action type accumulates savings over time
  - Visual representation of sustainability impact

### 4. **Team Leaderboard**
- **Location**: Top right panel
- **Features**:
  - Shows top 6 players/teams
  - User's current position is highlighted
  - Updates in real-time as score changes
  - Dynamic ranking based on performance

### 5. **Personalized Recommendations**
- **Location**: Bottom right panel
- **Features**:
  - Context-aware recommendations based on game state
  - Changes based on block height (usage intensity)
  - Provides tips for sustainable actions
  - Updates dynamically throughout gameplay

### 6. **Black-Frame Design**
- Futuristic, technical aesthetic matching ministry dashboard style
- Cyan/teal accent colors with glowing effects
- Dark navy/black background for professional look
- High contrast for readability

## How Dynamic Integration Works

### Block Placement → Graph Updates
```javascript
When a block is placed:
1. Block color determines its sustainability impact
2. AI Usage Intensity graph adjusts current day's value:
   - Green blocks: -2 usage points
   - Red blocks: +5 usage points
3. Graph redraws in real-time
4. CO2 impact accumulates based on block color
```

### Line Clearing → Multiple Effects
```javascript
When lines are cleared:
1. Score increases
2. CO2 savings accumulate
3. AI Usage Intensity decreases (efficient action)
4. Leaderboard updates with new score
5. Recommendations update based on new state
6. Graphs redraw to reflect changes
```

### Sustainable Actions → Chart Updates
```javascript
When power-ups are used:
1. Lines are cleared from bottom
2. CO2 Saved bar chart updates
3. Specific action category increases:
   - "Optimized Prompts" += action's CO2 savings
   - "Library Prompts" += action's CO2 savings
   - etc.
4. Chart redraws with new values
```

## Game Controls

| Key | Action |
|-----|--------|
| ← → | Move piece left/right |
| ↑ | Rotate piece |
| ↓ | Soft drop |
| SPACE | Hard drop / Start game |
| P | Pause/Resume |

## Sustainable Power-Ups

| Power-Up | Points | Lines Cleared | CO2 Saved | Description |
|----------|--------|---------------|-----------|-------------|
| ✨ Optimize Prompts | +200 | 2 lines | -0.5 kg | Efficient prompt engineering |
| 📚 Library Prompts | +200 | 2 lines | -0.4 kg | Reusable prompt templates |
| 🎓 Complete Quiz | +500 | 3 lines | -1.0 kg | Sustainability training |
| 🌱 Eco Alternative | +800 | 4 lines | -1.5 kg | Alternative eco-friendly methods |
| 🏆 Efficiency Goal | +1500 | 5 lines | -3.0 kg | Achieve efficiency targets |

## Technical Architecture

### Files Structure
```
black-frame-tetris/
├── index-enhanced.html      # Enhanced HTML with new layout
├── styles-enhanced.css      # Black-frame styling
├── tetris-enhanced.js       # Dynamic game logic with graphs
├── index.html               # Original version
├── styles.css               # Original styling
└── tetris.js                # Original game logic
```

### Canvas-Based Charts
- **AI Usage Intensity**: Line graph with gradient fill
- **CO2 Saved**: Bar chart with color-coded categories
- Both charts redraw on every update for smooth animations

### Data Flow
```
Game Action → Update Game State → Update Metrics → Redraw Charts → Update UI Components
```

## Installation & Usage

### Option 1: Direct File Access
1. Open `index-enhanced.html` in a modern web browser
2. Press SPACE to start the game
3. Watch the graphs and metrics update in real-time

### Option 2: Local Server (Recommended)
```bash
# Using Python
python server.py

# Or using Python 3's built-in server
python3 -m http.server 8000

# Then open: http://localhost:8000/index-enhanced.html
```

## Color Intensity Mapping

The game uses intelligent color mapping to make each block meaningful:

```javascript
const INTENSITY_COLORS = {
    blue: { name: 'Low Impact', co2: 0.01, intensity: 'low', score: 10 },
    green: { name: 'Sustainable', co2: -0.02, intensity: 'eco', score: 25 },
    yellow: { name: 'Moderate', co2: 0.05, intensity: 'moderate', score: 5 },
    red: { name: 'High Impact', co2: 0.15, intensity: 'high', score: -5 }
};

const SHAPES = {
    I: { shape: [[1, 1, 1, 1]], color: 'blue', benefit: 'efficient' },
    T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'green', benefit: 'optimized' },
    S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'green', benefit: 'eco' },
    O: { shape: [[1, 1], [1, 1]], color: 'yellow', benefit: 'standard' },
    L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'yellow', benefit: 'standard' },
    Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'red', benefit: 'heavy' },
    // Each shape has a meaningful color assignment
};
```

## Real-Time Updates

### 1. **Per Block Spawn**
- AI Usage Intensity graph updates
- CO2 impact accumulates
- Request counter increments

### 2. **Per Line Clear**
- Score updates
- Leaderboard re-ranks
- CO2 savings increase
- Usage intensity decreases
- Recommendations refresh

### 3. **Per Power-Up Use**
- CO2 chart updates
- Multiple lines cleared
- Bonus score added
- Activity log updated

## Danger Zone Alert

When blocks reach 80% capacity (16/20 rows):
- 🚨 Danger Zone indicator activates
- Pulsing warning animation
- Recommendations emphasize urgent action
- Visual alert on right side of Tetris grid

## Scoring System

### Base Scoring
- Hard drop: +2 pts per row
- Color bonus: -5 to +25 pts depending on block color
- Line clear: 100/300/500/800 pts (1/2/3/4 lines) × level

### Bonus Scoring
- Sustainable actions: +200 to +1500 pts
- Level multiplier on line clears
- Combo bonuses for consecutive clears

## Future Enhancements

Potential additions:
1. Historical data persistence (localStorage)
2. Multi-player competitive mode
3. Department-specific leaderboards
4. Export sustainability reports
5. Integration with actual AI usage APIs
6. Achievement system
7. Daily/weekly challenges

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- Requires: Canvas API, ES6+ JavaScript

## Credits

Created as part of the Sustainable AI Prototypes project to demonstrate how gamification can drive sustainable AI usage in government/enterprise settings.

## License

Part of the SustainableAIPrototypes repository.
