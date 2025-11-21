# 🌱 Sustainable AI Prototypes
## Ministry of Finance - Sustainable AI Initiative

A comprehensive collection of interactive prototypes designed to promote sustainable AI usage through gamification, real-time feedback, and eco-friendly alternatives.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Made with Love](https://img.shields.io/badge/Made%20with-💚-success)](https://github.com/yourusername/SustainableAIPrototypes)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Research Foundation](#research-foundation)
- [Prototypes](#prototypes)
- [Getting Started](#getting-started)
- [Installation](#installation)
- [Physical Implementations](#physical-implementations)
- [Documentation](#documentation)
- [Success Metrics](#success-metrics)
- [Contributing](#contributing)
- [Support & Contact](#support--contact)
- [License](#license)

---

## 🎯 Overview

This project addresses a critical challenge: **How do we make the environmental impact of AI usage visible and actionable?**

Based on extensive research with Ministry of Finance employees (70% aware & willing to change) and **comprehensive partner feedback** from three ministry stakeholders, we've developed refined prototypes that prioritize **actionable behavior change** over awareness alone.

### 🆕 Latest Updates (November 2025)

**Partner Feedback Implemented:**
- ✅ Combined Prompt Coach + Dashboard (unanimous #1 choice)
- ✅ Redesigned Magic Mirror as department-level display (compliance-friendly)
- ✅ Created Tetris-style usage visualization (innovative gamification)
- ✅ Enhanced Digital Forest with automated tracking architecture

See [PARTNER_FEEDBACK_SUMMARY.md](PARTNER_FEEDBACK_SUMMARY.md) for full details.

### Key Principles

1. **Actionability First** - Enable behavior change, not just awareness
2. **Start with MVP** - Minimal viable version, then iterate
3. **Use Existing Data** - Leverage Azure metrics as foundation
4. **Combine Visual + Analytics** - Data provides foundation, visuals drive engagement

### Impact Goals

- 📉 **25% reduction** in AI-related CO₂ emissions
- ⚡ **20% cost savings** through efficiency
- 🎓 **60% active engagement** with sustainable practices
- 🏆 **Model organization** for government sustainability

---

## 🔬 Research Foundation

### Ministry of Finance Field Research

**Key Findings:**
- **70% aware & willing** to adopt sustainable practices
- **15% unaware but willing** to learn
- **Awareness alone doesn't change behavior** - need immediate feedback
- **Impact is too abstract** - require relatable comparisons
- **Usefulness trumps environmental cost** - must maintain productivity

### Eco-Friendly Alternatives Analysis

Researched **25 sustainable tools** across 6 categories:

1. **Developer Tools (8)**: Carbon Aware SDK, CO2.js, CodeCarbon, GreenFrame.io
2. **Eco-Friendly Search Engines (5)**: Ecosia, Qwant, GOOD Search, Ekoru, Lilo
3. **Green Hosting & Cloud (5)**: GreenGeeks, DreamHost, Cloud Carbon Footprint
4. **Digital Footprint Calculators (4)**: Website Carbon Calculator, Digital Beacon
5. **Sustainable AI Models (2)**: DeepSeek AI (10x more efficient), ViroAI
6. **Awareness Tools (1)**: TreeClicks

---

## 🚀 Prototypes (Partner-Validated)

### 🌟 PRIORITY 1: Prompt Coach + Dashboard (Combined) ⭐⭐⭐⭐⭐
**The unanimous favorite - combining training, analytics, and sustainability tracking**

**Status**: ✅ Built & Ready
**Partner Rating**: Highest Impact (All three partners)

**Features:**
- **Prompt Coach**: Real-time CO₂ tracking, AI optimization, quality vs. efficiency trade-offs
- **Prompt Library**: Reusable templates with search, categories, and usage stats
- **Dashboard**: Quick stats, goals, achievements, sustainable alternatives
- **Analytics**: Azure metrics integration, usage patterns, efficiency trends

**What Partners Said:**
- Matthijs: "Actionable prototype"
- Thomas: "This is my favorite so far"
- Jop: "Highest impact - would save me time"

**Location:** `/prototypes/prompt-coach-dashboard/`

---

### 🪞 PRIORITY 2: Magic Mirror - Department Display
**Public sustainability dashboard for departments (not personalized)**

**Status**: ✅ Built & Ready
**Partner Feedback**: "Make it department-level, not personal"

**Features:**
- Department-level metrics (compliance-friendly)
- Prompt efficiency, energy usage, tool diversity, CO₂ impact
- Generic actionable tips
- Ministry-wide leaderboard
- Works on existing screens
- QR codes for more info

**What Changed Based on Feedback:**
- ❌ Removed: Personal facial recognition, individual data
- ✅ Added: Department aggregation, generic tips, compliance focus

**Location:** `/prototypes/magic-mirror-department/`

---

### 🎮 PRIORITY 3: Black Frame - Tetris Visualization
**Automated AI usage intensity tracker with gamified clearing**

**Status**: ✅ Built & Ready
**Partner Innovation**: Jop's brilliant Tetris suggestion

**Features:**
- Tetris-style grid that fills with AI requests
- Color-coded blocks (low/moderate/high/critical)
- Sustainable actions "clear lines"
- Automated tracking (no manual input)
- Real-time activity feed
- Gamified rewards

**Jop's Quote:**
> "Make it like a Tetris screen that is filling up... sustainable actions could knock off some blocks"

**Location:** `/prototypes/black-frame-tetris/`

---

### 🌲 Enhanced: Digital Carbon Forest
**Collective visualization with defined behaviors and automated tracking**

**Status**: ✅ Documentation Updated
**Partner Feedback**: "What behavior do you want to create?"

**Key Enhancements:**
- Defined clear target behaviors (what grows trees)
- Automated tracking architecture
- Integration plan with Prompt Coach + Dashboard
- Tiered implementation (MVP→Automated→Real-time)
- Behavior matrix documented

**Recommendation**: Deploy as "celebration layer" on top of Dashboard data

**Location:** `/prototypes/digital-forest/` + `FEEDBACK_UPDATES.md`

---

### 📱 Original: EcoPrompt Coach Browser Extension
**Browser extension version of Prompt Coach**

**Features:**
- Real-time CO₂ tracking before query submission
- AI-powered prompt optimization suggestions
- Achievement system and guilt-free AI credits
- Sustainable AI alternative recommendations

**Note**: Core features now integrated into Priority 1 prototype

**Location:** `/prototypes/ecoprompt-coach/`

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** 16+ (for JavaScript projects)
- **Python** 3.8+ (for Carbon Router)
- **Modern browser** (Chrome/Firefox/Edge)
- **Git** for version control

### Quick Start

```bash
# Clone repository
git clone https://github.com/moseskolleh/SustainableAIPrototypes.git
cd SustainableAIPrototypes

# Try Digital Forest (simplest to run)
cd prototypes/digital-forest
npx http-server -p 8080
# Open http://localhost:8080 in browser
```

---

## 📦 Installation

### EcoPrompt Coach Extension

```bash
# Chrome/Edge
1. Navigate to chrome://extensions
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select: prototypes/ecoprompt-coach/
5. Extension icon appears in toolbar
```

### Digital Forest Display

```bash
cd prototypes/digital-forest
python3 -m http.server 8080
# Or: npx http-server -p 8080
# Access: http://localhost:8080
```

---

## 🏗️ Physical Implementations

See comprehensive guide: [📖 Physical Building Guide](docs/physical-implementations/BUILDING_GUIDE.md)

**Quick Budget Overview:**
- Magic Mirror: €300-1,200
- Digital Forest Wall: €2,000-10,000
- Prompt Coach Station: €500-1,500
- Game Station: €1,400-3,500
- Sustainability Kiosk: €600-2,000
- Carbon Router Display: €1,500-4,000

**Total Setup Cost:** €6,300 - €20,000+

---

## 📖 Documentation

### Partner Feedback & Implementation
- [📋 Partner Feedback Summary](PARTNER_FEEDBACK_SUMMARY.md) - **NEW!** Comprehensive feedback & responses
- [📄 Original Partner Feedback Report](Prototypes%20PartnerFeedback%20DetailedReport.pdf) - Raw feedback document

### Prototype Specifications
- [📄 Refined Prototypes Specification](REFINED_PROTOTYPES.md) - Original detailed descriptions
- [🌱 Prompt Coach + Dashboard](prototypes/prompt-coach-dashboard/README.md) - Priority 1 implementation
- [🪞 Magic Mirror Department Display](prototypes/magic-mirror-department/README.md) - Priority 2 implementation
- [🎮 Tetris Visualization](prototypes/black-frame-tetris/README.md) - Priority 3 implementation
- [🌲 Digital Forest Updates](prototypes/digital-forest/FEEDBACK_UPDATES.md) - Enhanced documentation

### Research & Alternatives
- [🔨 Physical Building Guide](docs/physical-implementations/BUILDING_GUIDE.md) - Hardware setup
- [🌍 Eco-Friendly Alternatives](Eco-Friendly%20Alternatives%20(Dashboard).xlsx) - Research data
- [📊 Ministry of Finance Research](MVF.EIA.S2.REV-Presentation%20conv.pdf) - Field research findings

---

## 📊 Success Metrics

### Quantitative KPIs
- **CO₂ Reduction**: Target 25% in 6 months
- **Efficiency Score**: Average <1.5 prompts per successful query
- **Sustainable AI Adoption**: 40% of users
- **Engagement Rate**: 60% active users
- **Cost Savings**: 20% reduction in AI infrastructure costs

### Qualitative KPIs
- User satisfaction: 4.2/5 stars
- Behavior change: 70% self-reported improvement
- Cultural impact: Sustainability conversations normalized

---

## 🤝 Contributing

We welcome contributions from the community!

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

---

## 📞 Support & Contact

### Internal (Ministry of Finance)
- **IT Helpdesk**: ext. 2400
- **Sustainability Team**: sustainability@mof.gov
- **Slack Channel**: #sustainable-ai

### External Inquiries
- **GitHub Issues**: [Open an issue](https://github.com/moseskolleh/SustainableAIPrototypes/issues)
- **Email**: info@sustainable-ai-prototypes.org

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Vision

> "The best time to plant a tree was 20 years ago. The second best time is now."

We believe technology and sustainability are not just compatible—they're inseparable. Every query, every line of code, every decision has an environmental footprint. By making the invisible visible, we empower people to make informed choices without sacrificing productivity.

**This project proves that awareness + action + gamification = real behavior change.**

---

## 👥 Team & Acknowledgments

### Core Team
- **Moses** - SCRUM Master & Integration Lead
- **Cora** - Storytelling & Visual Design
- **Mirai** - UX Design & Prototyping
- **Zahra** - Research & Analysis
- **Ali** - Research & Technical Analysis

### Special Thanks
- Ministry of Finance employees (beta testers)
- Research participants (136 students, 5 experts)
- Green Software Foundation (methodologies)
- Open-source community

---

**Made with 💚 for a sustainable future**

*Ministry of Finance • Sustainable AI Initiative*
*November 2025*
