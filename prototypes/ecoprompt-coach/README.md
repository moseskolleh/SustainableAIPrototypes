# Eco-Smart: AI Sustainability Tool (v2.0)

A robust, data-driven browser extension that helps users understand and minimize the environmental impact of AI usage through research-backed calculations and intelligent prompt optimization.

## 🌟 Version 2.0 - Major Refactor

This version represents a complete overhaul of the application, transforming it from a static tracker into a comprehensive, research-based sustainability tool.

### What's New in v2.0

- **Research-Based Calculations**: All formulas derived from peer-reviewed paper "How Hungry is AI?" (2025)
- **Real-Time Calculator**: Dynamic environmental impact calculation as you type
- **Prompt Optimizer**: Analyze and optimize prompts for efficiency with before/after comparisons
- **Eco-Prompt Library**: Personal database of efficient prompts with tagging and export
- **Advanced Settings**: Customizable grid intensity profiles for different regions
- **Accurate Analogies**: Physics-based real-world equivalents (1 kWh = 3.6 MJ)

## 📊 Features

### 1. Real-Time Calculator
- **Dynamic Input**: Type your prompt and see environmental impact update live
- **Comprehensive Metrics**:
  - ⚡ Energy consumption (Wh)
  - 💧 Water usage (liters)
  - 🌍 Carbon emissions (gCO2e)
- **Eco-Score**: 0-100 rating of prompt efficiency (lower is better)
- **Real-World Analogies**:
  - LED lightbulb hours
  - Smartphone charges
  - Cups of coffee boiled
  - Google searches equivalent
  - Driving distance
- **Output Type Selection**: Adjust calculations based on expected response type

### 2. Prompt Analyzer & Optimizer
- **Quality Analysis**: Identify redundancy and token inefficiency
- **Concrete Optimization**: Get an improved version that achieves the same intent
- **Before/After Comparison**: See exact environmental savings:
  - Token reduction
  - Energy saved
  - Water saved
  - Carbon saved
- **Actionable Suggestions**: Specific improvements to make

### 3. Eco-Prompt Library
- **Personal Database**: Save your most efficient prompts
- **Rich Metadata**: Each prompt stores:
  - Full text content
  - User-defined tags
  - Eco-score rating
  - Token counts
  - Complete environmental impact data
  - Usage statistics
- **Search & Filter**: Find prompts by text or tags
- **Export to JSON**: Backup your library or share with team
- **Quick Actions**: Copy, use, or delete prompts with one click

### 4. Advanced Settings
- **Unit System**: Toggle between Metric and Imperial
- **Grid Intensity Profiles**:
  - Azure/OpenAI (US) - Default
  - AWS/Anthropic (US)
  - DeepSeek (China)
- **Custom Carbon Intensity**: Override with your local grid's CIF
- **Usage Statistics**: Track your total queries, tokens, energy used, and savings

## 🔬 Research Foundation

All calculations are based on the peer-reviewed research paper:

**"How Hungry is AI? Benchmarking Energy, Water, and Carbon Footprint of LLM Inference"**
*Jegham et al., 2025*

### Key Data Points

**Energy Baselines (GPT-4o):**
- Short prompt (100 in, 300 out): 0.42 Wh
- Medium prompt (1k in, 1k out): 1.214 Wh
- Long prompt (10k in, 1.5k out): 1.788 Wh

**Environmental Coefficients (Azure/OpenAI):**
- PUE: 1.12 (Power Usage Effectiveness)
- WUE (on-site): 0.30 L/kWh (cooling water)
- WUE (off-site): 3.142 L/kWh (electricity generation)
- CIF: 0.3528 kgCO2e/kWh (carbon intensity)

**Formulas:**
```
Water (L) = (E/PUE) × WUE_site + E × WUE_source
Carbon (kgCO2e) = E × CIF
```

## 🛠️ Installation

### Chrome/Edge/Brave
1. Download or clone this repository
2. Open browser and navigate to `chrome://extensions`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `prototypes/ecoprompt-coach` folder
6. The 🌱 extension icon should appear in your toolbar

### Firefox
1. Navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select the `manifest.json` file from the folder

## 📖 Usage Guide

### Calculator Tab
1. Click the extension icon
2. Type or paste your AI prompt in the text area
3. Watch as metrics update in real-time
4. Select expected output type for more accurate calculations
5. Review analogies to understand impact
6. Click "💾 Save to Library" to store efficient prompts

### Optimizer Tab
1. Navigate to the "✨ Optimizer" tab
2. Paste your prompt to analyze
3. Click "🔍 Analyze & Optimize"
4. Review suggestions for improvement
5. Copy the optimized version
6. See exact environmental savings

### Library Tab
1. Navigate to the "📚 Library" tab
2. Browse your saved prompts (sorted by eco-score)
3. Use the search bar to filter by text or tags
4. Click "📋 Copy" to copy prompt text
5. Click "✨ Use" to load in calculator
6. Click "📥 Export" to download as JSON

### Settings Tab
1. Navigate to the "⚙️ Settings" tab
2. Choose your unit system (Metric/Imperial)
3. Select appropriate grid profile for your region
4. Optionally set custom carbon intensity
5. View your cumulative usage statistics

## 🏗️ Technical Architecture

### File Structure
```
ecoprompt-coach/
├── manifest.json          # Extension configuration
├── popup.html            # Main UI (Tailwind CSS)
├── popup.js              # Main application logic
├── core-engine.js        # Environmental impact calculator
├── storage-manager.js    # chrome.storage.local wrapper
├── popup.css             # Legacy styles (minimal)
├── background.js         # Service worker
├── content.js            # Content script
├── content.css           # Content styles
├── icons/                # Extension icons
└── README.md             # This file
```

### Core Components

**core-engine.js**
- Research-based calculation formulas
- Token estimation
- Energy/water/carbon calculators
- Real-world analogy converters
- Eco-score algorithm

**storage-manager.js**
- Prompt library CRUD operations
- Settings persistence
- Usage statistics tracking
- JSON import/export
- Search and filtering

**popup.js**
- Tab management
- Real-time calculator UI
- Optimizer logic
- Library display
- Settings interface

### Data Schemas

**Saved Prompt:**
```javascript
{
  id: "uuid",
  text: "prompt content",
  tags: ["tag1", "tag2"],
  eco_score: 25,
  tokens: { input: 100, output: 300, total: 400 },
  impact: { energy, water, carbon objects },
  saved_at: "ISO timestamp",
  last_used: "ISO timestamp",
  use_count: 5
}
```

**Settings:**
```javascript
{
  units: "metric",
  gridProfile: "AZURE_OPENAI",
  customCIF: null,
  outputEstimation: "general",
  showAnalogies: true
}
```

## 🔒 Privacy & Security

- ✅ **100% Local**: All data stored in `chrome.storage.local`
- ✅ **No External Servers**: Zero network requests for calculations
- ✅ **No Tracking**: No analytics or telemetry
- ✅ **Open Source**: Full code transparency
- ✅ **GDPR Compliant**: User maintains full data control

## 🧪 Testing

### Manual Testing
1. Load extension in developer mode
2. Test Calculator with various prompt lengths
3. Verify Optimizer generates different output
4. Save prompts to Library and verify persistence
5. Export Library and verify JSON format
6. Change Settings and verify recalculations
7. Check browser console for errors

### Test Scenarios
- Empty prompts (should reset display)
- Very long prompts (>10k characters)
- Special characters in prompts
- Tag management in library
- Export/import workflow
- Settings persistence across sessions

## 🚀 Development

### Prerequisites
- Modern browser (Chrome 88+, Firefox 89+, Edge 88+)
- No build tools required
- Tailwind CSS loaded via CDN

### Local Development
1. Clone the repository
2. Make changes to source files
3. Reload extension in browser
4. Test changes immediately

### Code Style
- ES6+ JavaScript
- Async/await for promises
- JSDoc comments for functions
- Semantic HTML5
- Tailwind CSS utility classes

## 📈 Roadmap

### Version 2.1
- [ ] Model-specific calculations (GPT-4, Claude, Gemini)
- [ ] Batch prompt analysis
- [ ] Library sharing via URL
- [ ] More grid profiles (EU, Asia-Pacific)
- [ ] Dark mode theme

### Version 2.2
- [ ] API for external integrations
- [ ] Team/organization features
- [ ] Historical trend visualization
- [ ] Carbon offset suggestions
- [ ] Browser sync across devices

### Version 3.0
- [ ] Real-time carbon awareness (time-shifting)
- [ ] Integration with GAIA dashboard
- [ ] Mobile companion app
- [ ] AI model recommendations
- [ ] Sustainability certifications

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow existing code style
- Add JSDoc comments for new functions
- Test thoroughly before submitting
- Update README if adding features
- Reference research sources for calculations

## 📚 References

1. Jegham, N., Abdelatti, M., Elmoubarki, L., & Hendawi, A. (2025). How Hungry is AI? Benchmarking Energy, Water, and Carbon Footprint of LLM Inference. *arXiv preprint arXiv:2505.09598v4*.

2. Patterson, D., et al. (2021). Carbon Emissions and Large Neural Network Training. *arXiv preprint arXiv:2104.10350*.

3. Li, S. (2023). Making AI less "thirsty": Uncovering and addressing the secret water footprint of AI models. *arXiv preprint arXiv:2304.03271*.

## 📄 License

MIT License - See LICENSE file for details

## 💬 Support

For issues, questions, or suggestions:
- **GitHub Issues**: [Report a bug](https://github.com/moseskolleh/SustainableAIPrototypes/issues)
- **Email**: sustainability@mof.gov
- **Slack**: #sustainable-ai channel

## 🙏 Acknowledgments

- **Ministry of Finance** - Sustainable AI Initiative
- **Research Authors** - Jegham et al. for groundbreaking research
- **Beta Testers** - MoF departments for valuable feedback
- **Green Software Foundation** - For sustainable computing methodologies
- **Tailwind CSS** - For beautiful, responsive UI components

---

## 🎯 Impact Statement

**With Eco-Smart v2.0, a single user saving 1 Wh per day through prompt optimization equals:**
- 365 Wh per year
- Equivalent to 37 Google searches
- 0.13 kgCO2e avoided
- 1.4 liters of water saved

**If 10,000 users adopt efficient practices:**
- 3.65 MWh saved annually
- 1,300 kg CO2e avoided
- 14,000 liters of water conserved
- **Impact of 62 trees planted** 🌳

---

**Made with 💚 for a sustainable AI future**

*Version 2.0 - Research-Driven, User-Focused, Planet-Conscious*
