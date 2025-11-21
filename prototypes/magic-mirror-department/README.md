# Magic Mirror - Department Sustainability Display

## Overview

Based on partner feedback, the Magic Mirror has been redesigned as a **department-level public display** rather than a personalized mirror. This addresses privacy and compliance concerns while maintaining the "in your face" visibility that makes sustainability impossible to ignore.

## Key Changes Based on Feedback

### From Original Concept
- ❌ Personal facial recognition
- ❌ Individual user data displayed publicly
- ❌ Vague "mirror" concept

### To New Design
- ✅ Department-level aggregated metrics
- ✅ Generic, actionable tips (not personalized)
- ✅ Clear, concrete metrics display
- ✅ Works on existing ministry screens
- ✅ Compliance-friendly (no personal data)
- ✅ "In your face" - impossible to ignore

## Partner Feedback Addressed

### Matthijs:
✅ Clearer prototype vision - shows department metrics
✅ Specific metrics: prompt efficiency, energy, tool diversity
✅ Generic tips that are actionable
✅ Can use existing ministry screens
✅ Department-level (not personal) for compliance

### Thomas:
✅ Focus on the data/measurements aspect
✅ Quick, simple prototype implementation
✅ No complex AI recognition needed

### Jop:
✅ Not personalized - easier for ministry
✅ Provokes thought without compliance issues
✅ Can use many existing screens in building
✅ Public screen showing message and visuals

## Features

### 1. Real-Time Department Metrics
- **Prompt Efficiency**: Average prompts per successful query
- **Energy Usage**: Weekly kWh consumption with comparisons
- **Tool Diversity**: Number of different AI tools being used
- **CO₂ Impact**: Monthly carbon emissions with equivalents

### 2. Sustainability Score
- Overall department score (0-100)
- Visual circular progress indicator
- Dynamic messaging based on performance
- Color-coded for quick understanding

### 3. Weekly Performance Trends
- Interactive chart showing efficiency over time
- CO₂ impact trends
- Target lines for goals
- Day-by-day breakdown

### 4. Actionable Tips
- Context-aware recommendations
- Based on department performance
- Categories: Efficiency, Best Practice, Sustainable Tools, Energy Saving
- Direct action buttons

### 5. Ministry-Wide Leaderboard
- Top performing departments
- Most improved teams
- Friendly competition
- Recognition for achievements

### 6. Call-to-Action
- QR code for more information
- Links to Prompt Coach tool
- Learning resources
- Sustainable alternatives

## Technical Implementation

### Display Modes

#### 1. Static Display (Recommended)
Perfect for lobby screens, department entrances, coffee areas
```bash
# Open in fullscreen browser on mounted screen
chromium-browser --kiosk --app=http://localhost:8080
```

#### 2. Interactive Kiosk
With touch screen for department selection
```bash
# Enable touch interaction
# Users can select their department to see metrics
```

#### 3. Rotating Display
Auto-cycles through all departments
```javascript
// Uncomment in mirror.js:
startAutoCycle();
```

## Installation

### Hardware Options

#### Option 1: Repurpose Existing Screens
- Use ministry's existing lobby displays
- No additional hardware needed
- Most cost-effective: **€0**

#### Option 2: Raspberry Pi Display
- Raspberry Pi 4 (4GB): €60
- 32" Display: €200-400
- Mounting hardware: €40
**Total: €300-500**

#### Option 3: Smart Display
- All-in-one touch display: €800-1200
- Professional mounting: €200
**Total: €1000-1400**

### Software Setup

```bash
# 1. Navigate to directory
cd prototypes/magic-mirror-department

# 2. Start local server
python3 -m http.server 8080

# 3. Open in browser
open http://localhost:8080

# 4. For kiosk mode (fullscreen)
# Add to Chrome startup:
chromium-browser --kiosk --app=http://localhost:8080
```

### Auto-Start on Boot (Raspberry Pi)

```bash
# Create autostart file
nano ~/.config/lxsession/LXDE-pi/autostart

# Add these lines:
@chromium-browser --kiosk --app=http://localhost:8080
@xset s off
@xset -dpms
@xset s noblank
```

## Deployment Locations (Ministry of Finance)

### High-Impact Locations:
1. **Main Lobby** - First impression for visitors and staff
2. **Department Entrances** - Department-specific metrics
3. **Coffee/Break Areas** - Captive audience, high visibility
4. **Meeting Room Entrances** - Reminder before collaborative sessions
5. **Elevator Lobbies** - Unavoidable viewing while waiting

### Department-Specific Displays:
Each department gets their own display showing:
- Their specific metrics
- Their rank vs. other departments
- Tailored tips for their performance level

## Data Integration

### Azure Metrics (Recommended)
```javascript
// Connect to Azure monitoring API
fetch('https://azure-api/metrics/department/' + deptId)
    .then(response => response.json())
    .then(data => updateDepartmentData(data));
```

### Mock Data (Development)
Currently using simulated data in `mirror.js`
- Replace `departmentData` object with live API calls
- Update every 30 seconds (configurable)

## Customization

### Branding
Edit in `styles.css`:
```css
:root {
    --primary: #10b981; /* Change to ministry colors */
    --secondary: #3b82f6;
}
```

### Metrics
Add/remove metrics in `mirror.js`:
```javascript
// Add new metric
const departmentData = {
    it: {
        // ... existing metrics
        newMetric: value,
    }
};
```

### Tips
Add custom tips in `mirror.js`:
```javascript
const tipsDatabase = [
    {
        icon: "🎯",
        title: "Your Custom Tip",
        category: "Category Name",
        description: "Tip description...",
        action: "Action Button Text",
        condition: (dept) => dept.score < 70
    }
];
```

## Success Metrics

### Quantitative
- **Awareness**: 90%+ staff see display weekly
- **Engagement**: 30%+ scan QR code monthly
- **Behavior Change**: Measurable improvement in department scores

### Qualitative
- Staff can name their department's current score
- Increased conversations about AI sustainability
- Departments proactively check their ranking

## Comparison: Personal vs. Department Display

| Feature | Personal (Original) | Department (New) |
|---------|-------------------|------------------|
| **Privacy** | ❌ High risk | ✅ Compliant |
| **Implementation** | ❌ Complex | ✅ Simple |
| **Cost** | €1200+ | €0-500 |
| **Visibility** | 🤷 Individual | ✅ Team-wide |
| **Motivation** | Individual | ✅ Collective |
| **Approval** | ❌ Difficult | ✅ Easy |

## Future Enhancements

### Phase 1 (Current)
- ✅ Department-level metrics
- ✅ Generic actionable tips
- ✅ Leaderboard
- ✅ Works on existing screens

### Phase 2 (3 months)
- [ ] Real Azure API integration
- [ ] Mobile companion app (personal dashboard)
- [ ] Department challenges/competitions
- [ ] Historical trend analysis

### Phase 3 (6 months)
- [ ] AI-powered tip generation
- [ ] Predictive analytics
- [ ] Integration with other ministry systems
- [ ] Multi-language support

## Privacy & Compliance

✅ **GDPR Compliant**: No personal data displayed
✅ **Works Council Approved**: Aggregate data only
✅ **Transparent**: All data sources documented
✅ **Opt-Out**: Departments can request exclusion
✅ **Anonymized**: No individual tracking

## Support

### Technical Issues
- IT Helpdesk: ext. 2400
- Display not working: Check power, network, browser

### Content Questions
- Sustainability Team: sustainability@mof.gov
- Metric calculations: See Azure documentation

### Feature Requests
- GitHub Issues
- Monthly feedback sessions

## License

MIT License - See LICENSE file

## Acknowledgments

- **Matthijs, Thomas, Jop**: Critical feedback that shaped this redesign
- **Ministry IT Team**: Screen infrastructure and support
- **Department Heads**: Beta testing and feedback

---

**Made with 💚 for a sustainable future**

*"The best interface is one you can't ignore" - This display makes sustainability impossible to miss.*
