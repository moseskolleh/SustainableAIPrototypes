# EcoPrompt Coach Browser Extension

An intelligent browser extension that helps users craft better AI prompts while tracking environmental impact in real-time.

## Features

- 🌱 **Real-Time Impact Tracking**: See CO₂ emissions before submitting queries
- ✨ **Prompt Optimization**: AI-powered suggestions to improve prompt quality
- 🏆 **Gamification**: Earn achievements and guilt-free AI credits
- 🌍 **Sustainable Alternatives**: Discover eco-friendly AI tools
- 📊 **Analytics Dashboard**: Track your efficiency and environmental savings

## Installation

### Chrome/Edge
1. Download or clone this repository
2. Open Chrome/Edge and navigate to `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `ecoprompt-coach` folder
5. The extension icon should appear in your toolbar

### Firefox
1. Navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Select the `manifest.json` file from the `ecoprompt-coach` folder

## Usage

### Basic Usage
1. Visit any supported AI platform (ChatGPT, Claude, Gemini)
2. The extension automatically tracks your queries
3. Click the extension icon to view your impact dashboard

### Prompt Coach
1. Click the extension icon
2. Navigate to the "Coach" tab
3. Paste your prompt and click "Analyze"
4. Review suggestions and copy the improved version

### Earn Credits
Complete sustainable actions to earn guilt-free AI credits:
- 📚 Complete sustainability quizzes: +50 credits
- 🌍 Use eco-friendly search engines: +25 credits
- ♻️ Switch to sustainable AI models: +100 credits

## Supported Platforms

- ✅ ChatGPT (chat.openai.com)
- ✅ Claude (claude.ai)
- ✅ Gemini (gemini.google.com)
- ✅ Bing Chat (bing.com)

## Technical Details

### Files Structure
```
ecoprompt-coach/
├── manifest.json        # Extension configuration
├── popup.html          # Main UI
├── popup.css           # Styles
├── popup.js            # UI logic
├── background.js       # Background service worker
├── content.js          # Content script for AI platforms
├── icons/              # Extension icons
└── README.md           # This file
```

### Storage
The extension uses `chrome.storage.local` to store:
- Daily/weekly CO₂ emissions
- Query count and efficiency scores
- Achievement progress
- Credits balance
- User settings

### Privacy
- ❌ No data sent to external servers
- ❌ No tracking or analytics
- ✅ All data stored locally
- ✅ GDPR compliant

## Development

### Prerequisites
- Node.js (optional, for development tools)
- Chrome/Firefox browser

### Building
No build step required! The extension runs directly from source files.

### Testing
1. Load the extension in developer mode
2. Visit a supported AI platform
3. Check browser console for any errors
4. Test all features in the popup

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: sustainability@mof.gov
- Slack: #sustainable-ai channel

## Roadmap

### Version 1.1
- [ ] Team leaderboards (requires backend)
- [ ] More AI platform support
- [ ] Custom prompt templates
- [ ] Export analytics reports

### Version 1.2
- [ ] Integration with GAIA dashboard
- [ ] Real-time carbon awareness (time-shifting)
- [ ] Mobile app companion
- [ ] Social sharing features

## Acknowledgments

- Ministry of Finance - Sustainable AI Initiative
- Research team for eco-friendly alternatives
- Beta testers from MoF departments
- Green Software Foundation for methodologies

---

**Made with 💚 for a sustainable future**
