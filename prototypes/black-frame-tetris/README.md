# Black Frame - Tetris-Style AI Usage Intensity Tracker

## Overview

Inspired by Jop's innovative suggestion, this prototype transforms the manual "Black Frame" concept into an **automated, gamified Tetris-style visualization** that makes AI usage intensity impossible to ignore.

## The Evolution

### Original Concept (Black Frame)
- Manual drawing of lines for each AI interaction
- Physical board with markers
- Static visualization

### Jop's Suggestion
> "It popped into my head that you could make it in some way like a Tetris screen that is filling up: As more requests or interactions with the AI system come in, the Tetris-like screen fills up. Blocks pile up with each request/interaction."

### This Implementation
- ✅ Fully automated tracking (no manual input)
- ✅ Real-time visualization of AI usage intensity
- ✅ Gamified: sustainable actions "clear lines"
- ✅ Color-coded intensity levels
- ✅ Department-level and ministry-wide views

## Key Features Based on Feedback

### From All Partners

**Matthijs:**
✅ Actionable - clear connection between behavior and visualization
✅ Shows what you can do with the insights (not just awareness)

**Thomas:**
✅ Makes usage intensity visible and "to the front"
✅ Reveals how much AI is used throughout the day
✅ Connects to behavior change opportunities

**Jop:**
✅ Automated tracking (no manual drawing)
✅ Tetris-style visual metaphor
✅ Gamification for engagement

## How It Works

### Block Accumulation
- **Every 5 AI requests = +1 block**
- Blocks stack from bottom to top
- Color indicates intensity level:
  - 🔵 **Blue**: Low usage (0-50 requests/day)
  - 🟢 **Green**: Moderate (51-150 requests/day)
  - 🟡 **Yellow**: High (151-300 requests/day)
  - 🔴 **Red**: Critical (300+ requests/day)

### Danger Zone
- Warning threshold at 80% capacity
- Visual alert when nearing limit
- Encourages proactive action

### Clearing Lines
Complete any of these sustainable actions to clear blocks:

| Action | Lines Cleared | CO₂ Saved |
|--------|---------------|-----------|
| Optimize 5 Prompts | 1 line (-5 blocks) | 0.5 kg |
| Use Library Prompts | 1 line (-5 blocks) | 0.4 kg |
| Complete Quiz | 2 lines (-10 blocks) | 1.0 kg |
| Use Eco Alternative | 3 lines (-15 blocks) | 1.5 kg |
| Achieve <1.5 Efficiency | 5 lines (-25 blocks) | 3.0 kg |

### Auto-Clearing
- When a row fills completely, it auto-clears (like Tetris)
- Represents achieving perfect efficiency
- Rare but celebrated event

## Technical Implementation

### Data Sources

#### 1. Azure Monitoring (Real-time)
```javascript
// Pull AI request count every minute
const requests = await azureAPI.getRequestCount();
addBlocks(Math.floor(requests / 5));
```

#### 2. Prompt Coach Integration
```javascript
// When user optimizes prompts
promptCoach.on('optimize', (count) => {
    if (count >= 5) {
        clearLines(1);
    }
});
```

#### 3. Dashboard Metrics
```javascript
// Check efficiency achievements
if (efficiencyScore < 1.5 && duration >= 7days) {
    clearLines(5);
    celebrate();
}
```

### Visualization Engine

```javascript
class TetrisGrid {
    constructor(rows = 20, cols = 10) {
        this.rows = rows;
        this.cols = cols;
        this.grid = [];
        this.dangerLine = Math.floor(rows * 0.8);
    }

    addBlock(intensity) {
        // Find lowest empty cell
        // Fill with color based on intensity
        // Animate drop
    }

    clearLine(rowIndex) {
        // Animate clear
        // Drop blocks above
        // Update stats
    }

    checkComplete() {
        // Auto-clear full rows
    }
}
```

## Installation

### Quick Start
```bash
# Navigate to prototype
cd prototypes/black-frame-tetris

# Start server
python3 -m http.server 8080

# Open browser
open http://localhost:8080
```

### Deployment Options

#### Option 1: Desktop Display
- Large monitor in common area
- Always-on display
- Auto-refreshing

#### Option 2: Public Dashboard
- Integrate into ministry intranet
- Accessible from any device
- Department-specific views

#### Option 3: Meeting Room Display
- Show before/during meetings
- Discussion starter
- Real-time accountability

## Integration Architecture

```
[Azure Monitoring]
        ↓
[Request Counter] → [Tetris Engine] → [Visual Display]
        ↑                ↑
[Prompt Coach]    [Dashboard Metrics]
```

### API Endpoints Needed

```javascript
// GET current request count
GET /api/requests/today?department=it
Response: { count: 247, timestamp: "..." }

// POST sustainable action
POST /api/actions/clear
Body: { action: "optimize", count: 5, department: "it" }
Response: { linesCleared: 1, co2Saved: 0.5 }

// GET current grid state
GET /api/tetris/state?department=it
Response: { height: 45, blocks: [...], intensity: "moderate" }
```

## Gamification Strategy

### Individual Level
- Participate in sustainable actions
- See personal impact on department grid
- Earn badges for clearing lines

### Department Level
- Each department has their own grid
- Friendly competition
- Weekly challenges

### Ministry Level
- Combined visualization
- Collective goals
- Celebration of milestones

## User Interface

### Main Grid (Left)
- 10x20 Tetris grid
- Color-coded blocks
- Height indicator
- Danger zone warning

### Stats Panel (Right)
- Live request counter
- Blocks added today
- Lines cleared
- CO₂ impact
- Efficiency score

### Actions Panel
- Quick-access buttons
- Clear reward amounts
- Visual feedback on click

### Activity Feed
- Real-time log
- Recent blocks added
- Recent lines cleared
- Timestamped events

## Comparison: Original vs. Tetris Version

| Feature | Original (Manual) | Tetris (Automated) |
|---------|------------------|-------------------|
| **Tracking** | ❌ Manual drawing | ✅ Automated |
| **Engagement** | 🤷 Limited | ✅ High (gamified) |
| **Accuracy** | ❌ Low | ✅ Precise |
| **Scalability** | ❌ One board | ✅ Unlimited depts |
| **Actionability** | ❌ Unclear | ✅ Clear rewards |
| **Visual Impact** | ✅ Physical | ✅ Digital + dynamic |

## Success Metrics

### Quantitative
- **Awareness**: 80%+ staff understand the visualization
- **Engagement**: 40%+ take actions to clear lines weekly
- **Behavior Change**: 20% reduction in unnecessary requests
- **Lines Cleared**: Average 5+ lines/department/week

### Qualitative
- Staff proactively mention "clearing lines"
- Departments compete in friendly manner
- Usage intensity becomes conversation topic
- Visualization cited in sustainability discussions

## Future Enhancements

### Phase 1 (Current)
- ✅ Basic Tetris grid
- ✅ Automated block addition
- ✅ Manual action buttons
- ✅ Department switching

### Phase 2 (3 months)
- [ ] Real Azure API integration
- [ ] Auto-clear line detection
- [ ] Websocket real-time updates
- [ ] Mobile companion app

### Phase 3 (6 months)
- [ ] Multi-department simultaneous display
- [ ] Predictive "blocks incoming" indicator
- [ ] Team challenges and tournaments
- [ ] Historical playback feature

## Educational Value

### What Users Learn
1. **Volume Awareness**: How many AI requests happen daily
2. **Collective Impact**: Individual actions affect the whole
3. **Actionable Steps**: Exactly what to do to reduce impact
4. **Immediate Feedback**: Visual reward for sustainable choices

### Discussion Starter
- "Have you seen our Tetris board today?"
- "Let's clear some lines before the meeting"
- "We're in the danger zone - time to optimize!"

## Privacy & Compliance

✅ **Aggregated Data**: Department-level only
✅ **No Personal Info**: Can't identify individuals
✅ **Transparent**: All data sources documented
✅ **Opt-Out**: Departments can request exclusion

## Technical Requirements

### Frontend
- HTML5 Canvas or CSS Grid
- JavaScript for interactivity
- Responsive design

### Backend (Minimal)
- REST API for metrics
- Websocket for real-time (optional)
- Simple database for activity log

### Infrastructure
- Any web server
- Can run on Raspberry Pi
- Cloud-hosted or on-premise

## Cost Estimate

### Development
- Frontend: 3-5 days
- Backend integration: 5-7 days
- Testing & polish: 2-3 days
**Total: 2-3 weeks**

### Hardware (Display)
- Repurpose existing screens: €0
- New 43" display: €300-500
- Touch-enabled kiosk: €800-1200

### Maintenance
- Minimal: automated system
- Monitor API health
- Update rules/thresholds

## Why This Works

### Psychological Principles

1. **Visual Metaphor**: Everyone understands Tetris
2. **Loss Aversion**: Don't want grid to fill up!
3. **Immediate Feedback**: See impact instantly
4. **Gamification**: Makes sustainability fun
5. **Social Proof**: Compare with other departments

### Jop's Insight
The Tetris metaphor is brilliant because:
- ✅ Universally recognized
- ✅ Inherently engaging
- ✅ Built-in tension (filling up)
- ✅ Clear goal (clear lines)
- ✅ Satisfying rewards

## Support

### Technical Issues
- IT Helpdesk: ext. 2400

### Content Questions
- Sustainability Team: sustainability@mof.gov

### Feature Requests
- GitHub Issues
- Monthly feedback sessions

## License

MIT License - See LICENSE file

## Acknowledgments

- **Jop**: Original Tetris concept suggestion - brilliant!
- **Thomas & Matthijs**: Feedback on actionability
- **Ministry IT**: Infrastructure support
- **Tetris**: For the timeless game mechanic

---

**Made with 💚 for a sustainable future**

*"Just like Tetris, sustainable AI usage is all about making smart moves and clearing lines"*

---

## Fun Facts

- 🎮 Tetris was created in 1984 by Alexey Pajitnov
- 🧠 Playing Tetris has been shown to reduce cravings and intrusive thoughts
- 🏆 The world record for Tetris is over 4.9 million points
- 🌍 Our goal: Clear infinite lines toward sustainability!
