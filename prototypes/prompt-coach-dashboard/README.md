# Sustainable AI Prompt Coach + Dashboard

## Overview

This combined prototype integrates the **Prompt Coach** and **Dashboard** based on partner feedback. It provides both training/coaching for better prompts AND a comprehensive analytics dashboard to track sustainability impact.

## Key Features (Based on Partner Feedback)

### 1. Prompt Coach
- **AI-Powered Optimization**: Analyze and improve prompts for efficiency
- **CO₂ Tracking**: Real-time display (e.g., "0.32g CO₂") before and after optimization
- **Quality vs. Efficiency Trade-off**: Visual indicator showing the balance
- **Three Priority Modes**:
  - Quality First: Best results, higher impact
  - Balanced: Good quality, moderate impact
  - Efficiency First: Fastest, lowest impact

### 2. Prompt Library
- **Reusable Templates**: Curated collection of optimized prompts
- **Category Filtering**: Code, Analysis, Writing, Research
- **Usage Statistics**: See how many others benefit from each template
- **Search Functionality**: Quickly find the right prompt

### 3. Dashboard (MVP Approach)
- **Quick Stats Overview**:
  - Total CO₂ Saved
  - Efficiency Score (avg prompts per query)
  - Queries Optimized
  - Credits Earned

- **Goals & Progress Tracking**:
  - Weekly CO₂ reduction goals
  - Efficiency targets
  - Visual progress bars

- **Achievements System**:
  - Gamification for sustained engagement
  - Unlock rewards for milestones

- **Sustainable Alternatives**:
  - Discover eco-friendly AI tools
  - DeepSeek AI (10x more efficient)
  - Ecosia Search
  - Green Cloud hosting

### 4. Advanced Analytics (Azure Integration)
- **Azure Platform Metrics**:
  - Total interactions
  - Database calls
  - Prompt requests
  - Estimated CO₂ emissions

- **Usage Patterns**:
  - Heatmap showing peak usage times
  - Suggestions for time-shifting

- **Tool Diversity**:
  - Track which AI tools you use
  - Encourage healthy diversity

- **Efficiency Trends**:
  - Historical prompt efficiency
  - Progress over time

## Partner Feedback Addressed

### From Matthijs:
✅ Focus on actionable behavior change (not just awareness)
✅ Start with MVP using Azure metrics as baseline
✅ Show clear trade-off between efficiency and quality
✅ Design roadmap for future enhancements

### From Thomas:
✅ Combine prompt coaching with visualization
✅ Enable real behavior change through better prompts
✅ Show environmental impact (CO₂ usage display)
✅ Integrate with existing department initiatives

### From Jop:
✅ Combine Coach (training) + Library (reusable prompts)
✅ Add GAIA-style dashboard overview
✅ Highest impact prototype - time-saving and sustainable
✅ Personal preference: "prototypes 4 & 5 combined"

## Technical Implementation

### Files
- `index.html` - Main application structure
- `styles.css` - Comprehensive styling
- `app.js` - Interactive functionality and state management

### Technologies
- Pure HTML/CSS/JavaScript (no dependencies)
- Canvas API for charts
- LocalStorage for persistence
- Responsive design

## Installation & Usage

### Quick Start
```bash
# Navigate to prototype directory
cd prototypes/prompt-coach-dashboard

# Start local server
python3 -m http.server 8080
# Or: npx http-server -p 8080

# Open browser
open http://localhost:8080
```

### Browser Extension Version
This prototype can be adapted as a browser extension to integrate directly with AI platforms like ChatGPT, Claude, and Gemini.

## User Flow

### 1. Optimize a Prompt
1. Navigate to "Prompt Coach" tab
2. Enter your prompt
3. Select task type and priority
4. Click "Analyze Prompt"
5. Review optimization suggestions
6. Copy optimized version
7. Optionally save to library

### 2. Use Prompt Library
1. Navigate to "Prompt Library" tab
2. Search or filter by category
3. Click on a template
4. Automatically switches to Coach tab with template loaded
5. Customize for your needs

### 3. Track Your Impact
1. Navigate to "Dashboard" tab
2. View quick stats and progress
3. Check goals and achievements
4. Discover sustainable alternatives

### 4. Deep Dive Analytics
1. Navigate to "Analytics" tab
2. View Azure platform metrics
3. Analyze usage patterns (heatmap)
4. Check tool diversity
5. Monitor efficiency trends

## MVP Roadmap (As suggested by Matthijs)

### Phase 1: Core Functionality (Current)
- ✅ Prompt optimization engine
- ✅ Basic library with 6 templates
- ✅ Essential dashboard metrics
- ✅ Azure metrics integration

### Phase 2: Enhanced Features (Next 3 months)
- [ ] Backend API for real Azure data
- [ ] Team leaderboards
- [ ] Custom template creation
- [ ] Export analytics reports
- [ ] Mobile responsive improvements

### Phase 3: Advanced Integration (6 months)
- [ ] Real-time carbon awareness (grid intensity)
- [ ] Time-shifting recommendations
- [ ] Multi-language support
- [ ] API for third-party integrations
- [ ] Advanced ML-based optimization

## Key Metrics & Success Indicators

### Quantitative
- **Efficiency Score**: Target <1.5 prompts per successful query
- **CO₂ Reduction**: Target 25% within 6 months
- **Adoption Rate**: Target 60% of active users
- **Library Usage**: Target 40% of queries use templates

### Qualitative
- User satisfaction: Target 4.2/5 stars
- Behavior change: Target 70% self-reported improvement
- Time savings: Target 5-10 minutes per day per user

## Integration with Existing Systems

### Azure Platform
- Pull metrics from Azure monitoring
- Database interaction counts
- Prompt request logging
- CO₂ estimation algorithms

### Ministry AI Tools
- ChatGPT integration
- Claude integration
- Gemini integration
- Custom AI endpoints

### Authentication
- Single Sign-On (SSO) ready
- Department-level data aggregation
- Privacy-compliant data handling

## Privacy & Compliance

- ❌ No personal prompts stored on servers
- ✅ All data stored locally or encrypted
- ✅ GDPR compliant
- ✅ No third-party tracking
- ✅ Opt-in for team leaderboards
- ✅ Anonymized analytics

## Credits System

### Earning Credits
- **Optimize a prompt**: +10 credits
- **Use library template**: +5 credits
- **Save to library**: +25 credits
- **Achieve efficiency goal**: +50 credits
- **Complete sustainability quiz**: +50 credits
- **Try sustainable alternative**: +25 credits

### Using Credits
Credits are primarily for gamification and can unlock:
- Custom themes
- Advanced analytics
- Priority support
- Special badges

## Support & Feedback

### Ministry of Finance (Internal)
- **IT Helpdesk**: ext. 2400
- **Sustainability Team**: sustainability@mof.gov
- **Slack Channel**: #sustainable-ai

### External
- **GitHub Issues**: Report bugs or request features
- **Email**: info@sustainable-ai-prototypes.org

## Contributing

We welcome contributions! Areas for improvement:
- Additional prompt templates
- Better optimization algorithms
- New chart types for analytics
- Accessibility enhancements
- Internationalization

## License

MIT License - See LICENSE file for details

## Acknowledgments

- **Matthijs, Thomas, Jop**: Invaluable feedback and guidance
- **Ministry of Finance**: Beta testing and real-world insights
- **Green Software Foundation**: Methodologies and best practices
- **Research Team**: Eco-friendly alternatives analysis

---

**Made with 💚 for a sustainable future**

*This prototype directly addresses feedback from all three partners and combines the two highest-rated concepts (Prompt Coach #1 + Dashboard #2) into a single, powerful tool.*
