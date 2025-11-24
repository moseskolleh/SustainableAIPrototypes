/**
 * Comprehensive Gamification System
 * Implements complete achievement, badge, and credits system
 * Based on REFINED_PROTOTYPES.md specifications
 * Addresses partner feedback: Make sustainability engaging and rewarding
 */

// Achievement Tiers as specified in REFINED_PROTOTYPES.md
const achievementTiers = {
    beginner: {
        name: "Beginner",
        icon: "🌱",
        color: "#86efac"
    },
    intermediate: {
        name: "Intermediate",
        icon: "🌿",
        color: "#4ade80"
    },
    advanced: {
        name: "Advanced",
        icon: "🌳",
        color: "#22c55e"
    },
    expert: {
        name: "Expert",
        icon: "🌟",
        color: "#16a34a"
    }
};

// Complete Achievement System from REFINED_PROTOTYPES.md
const achievements = {
    // BEGINNER TIER
    firstSteps: {
        id: "first-steps",
        tier: "beginner",
        name: "First Steps",
        description: "Install EcoPrompt Coach or access the Hub",
        icon: "🌱",
        requirement: "Access the sustainable AI tools",
        credits: 10,
        progress: { current: 0, target: 1 },
        unlocked: false
    },
    knowledgeSeeker: {
        id: "knowledge-seeker",
        tier: "beginner",
        name: "Knowledge Seeker",
        description: "Complete your first sustainability quiz",
        icon: "📚",
        requirement: "Score >50% on any quiz",
        credits: 25,
        progress: { current: 0, target: 1 },
        unlocked: false
    },
    efficientStarter: {
        id: "efficient-starter",
        tier: "beginner",
        name: "Efficient Starter",
        description: "Successfully optimize 10 prompts on first try",
        icon: "💬",
        requirement: "10 one-shot prompts",
        credits: 20,
        progress: { current: 0, target: 10 },
        unlocked: false
    },
    ecoCurious: {
        id: "eco-curious",
        tier: "beginner",
        name: "Eco Curious",
        description: "Try one sustainable AI alternative",
        icon: "🌍",
        requirement: "Use Ecosia, DeepSeek AI, or any eco tool once",
        credits: 15,
        progress: { current: 0, target: 1 },
        unlocked: false
    },

    // INTERMEDIATE TIER
    growingGreen: {
        id: "growing-green",
        tier: "intermediate",
        name: "Growing Green",
        description: "Save 100g of CO₂ through optimizations",
        icon: "🌿",
        requirement: "Accumulate 100g CO₂ savings",
        credits: 50,
        progress: { current: 0, target: 100 },
        unlocked: false
    },
    promptMaster: {
        id: "prompt-master",
        tier: "intermediate",
        name: "Prompt Master",
        description: "Achieve 50 one-shot prompt successes",
        icon: "🎯",
        requirement: "50 optimized prompts",
        credits: 50,
        progress: { current: 0, target: 50 },
        unlocked: false
    },
    toolSwitcher: {
        id: "tool-switcher",
        tier: "intermediate",
        name: "Tool Switcher",
        description: "Use 3 different sustainable alternatives",
        icon: "🔄",
        requirement: "Try 3 eco-friendly tools",
        credits: 40,
        progress: { current: 0, target: 3 },
        unlocked: false
    },
    progressTracker: {
        id: "progress-tracker",
        tier: "intermediate",
        name: "Progress Tracker",
        description: "Check your dashboard 10 times",
        icon: "📈",
        requirement: "10 dashboard visits",
        credits: 30,
        progress: { current: 0, target: 10 },
        unlocked: false
    },

    // ADVANCED TIER
    carbonChampion: {
        id: "carbon-champion",
        tier: "advanced",
        name: "Carbon Champion",
        description: "Save 1kg (1,000g) of CO₂",
        icon: "🌳",
        requirement: "1,000g cumulative CO₂ savings",
        credits: 100,
        progress: { current: 0, target: 1000 },
        unlocked: false
    },
    efficiencyExpert: {
        id: "efficiency-expert",
        tier: "advanced",
        name: "Efficiency Expert",
        description: "Maintain 90%+ one-shot success rate",
        icon: "🏅",
        requirement: "90% efficiency over 20+ prompts",
        credits: 100,
        progress: { current: 0, target: 90 },
        unlocked: false
    },
    fullAdopter: {
        id: "full-adopter",
        tier: "advanced",
        name: "Full Adopter",
        description: "Switch all your tools to sustainable options",
        icon: "🌐",
        requirement: "Use eco alternatives for search, AI, hosting",
        credits: 100,
        progress: { current: 0, target: 5 },
        unlocked: false
    },
    mentor: {
        id: "mentor",
        tier: "advanced",
        name: "Mentor",
        description: "Help 5 colleagues adopt sustainable tools",
        icon: "👨‍🏫",
        requirement: "Share 5 templates or refer 5 people",
        credits: 75,
        progress: { current: 0, target: 5 },
        unlocked: false
    },

    // EXPERT TIER
    sustainabilityStar: {
        id: "sustainability-star",
        tier: "expert",
        name: "Sustainability Star",
        description: "Save 10kg (10,000g) of CO₂",
        icon: "🌟",
        requirement: "10,000g cumulative savings",
        credits: 250,
        progress: { current: 0, target: 10000 },
        unlocked: false
    },
    streakMaster: {
        id: "streak-master",
        tier: "expert",
        name: "Streak Master",
        description: "Maintain consistent sustainable usage for 30 days",
        icon: "🔥",
        requirement: "30-day active streak",
        credits: 200,
        progress: { current: 0, target: 30 },
        unlocked: false
    },
    departmentLeader: {
        id: "department-leader",
        tier: "expert",
        name: "Department Leader",
        description: "Top scorer in your department for the month",
        icon: "🏆",
        requirement: "Highest score in department",
        credits: 150,
        progress: { current: 0, target: 1 },
        unlocked: false
    },
    innovator: {
        id: "innovator",
        tier: "expert",
        name: "Innovator",
        description: "Suggest a new sustainable practice that gets adopted",
        icon: "💡",
        requirement: "Submit approved sustainability idea",
        credits: 200,
        progress: { current: 0, target: 1 },
        unlocked: false
    },

    // TEAM ACHIEVEMENTS (from REFINED_PROTOTYPES.md)
    unitedFront: {
        id: "united-front",
        tier: "team",
        name: "United Front",
        description: "80% of department actively using tools",
        icon: "🤝",
        requirement: "Department adoption goal",
        credits: 500,
        progress: { current: 0, target: 80 },
        unlocked: false,
        isTeam: true
    },
    collectiveImpact: {
        id: "collective-impact",
        tier: "team",
        name: "Collective Impact",
        description: "Department achieves 30% CO₂ reduction",
        icon: "📉",
        requirement: "Team goal",
        credits: 500,
        progress: { current: 0, target: 30 },
        unlocked: false,
        isTeam: true
    },
    monthlyWinners: {
        id: "monthly-winners",
        tier: "team",
        name: "Monthly Winners",
        description: "Top-performing department of the month",
        icon: "🎊",
        requirement: "Win monthly competition",
        credits: 1000,
        progress: { current: 0, target: 1 },
        unlocked: false,
        isTeam: true
    },
    diversityChampions: {
        id: "diversity-champions",
        tier: "team",
        name: "Diversity Champions",
        description: "Department uses tools from all 6 categories",
        icon: "🌈",
        requirement: "Tool category diversity",
        credits: 300,
        progress: { current: 0, target: 6 },
        unlocked: false,
        isTeam: true
    },

    // MINISTRY-WIDE MILESTONES (from REFINED_PROTOTYPES.md)
    oneTonSaved: {
        id: "one-ton-saved",
        tier: "ministry",
        name: "1 Ton Saved",
        description: "Ministry collectively saves 1,000kg CO₂",
        icon: "🎯",
        requirement: "Collective 1,000,000g CO₂ reduction",
        credits: 0, // Shared achievement
        progress: { current: 0, target: 1000000 },
        unlocked: false,
        isMinistry: true
    },
    globalImpact: {
        id: "global-impact",
        tier: "ministry",
        name: "Global Impact",
        description: "Equivalent to 100 trees planted",
        icon: "🌍",
        requirement: "CO₂ offset = 100 tree equivalents",
        credits: 0,
        progress: { current: 0, target: 100 },
        unlocked: false,
        isMinistry: true
    },
    costEfficiency: {
        id: "cost-efficiency",
        tier: "ministry",
        name: "Cost Efficiency",
        description: "Save €10,000 in AI infrastructure costs",
        icon: "💰",
        requirement: "€10,000 cost savings",
        credits: 0,
        progress: { current: 0, target: 10000 },
        unlocked: false,
        isMinistry: true
    },
    externalRecognition: {
        id: "external-recognition",
        tier: "ministry",
        name: "External Recognition",
        description: "Win sustainability award or certification",
        icon: "📢",
        requirement: "External award",
        credits: 0,
        progress: { current: 0, target: 1 },
        unlocked: false,
        isMinistry: true
    }
};

// Guilt-Free AI Credits System (from REFINED_PROTOTYPES.md)
const creditEarningActions = {
    // Quiz completion
    completeQuizBasic: {
        action: "Complete sustainability quiz (basic)",
        credits: 50,
        description: "Score >80% on basic sustainability quiz"
    },
    completeQuizAdvanced: {
        action: "Complete advanced quiz",
        credits: 75,
        description: "Score >80% on advanced sustainability quiz"
    },

    // Eco-friendly tool usage
    useEcoSearch: {
        action: "Use eco-friendly search engine for 1 week",
        credits: 25,
        description: "Set Ecosia/Qwant as default for 7 days"
    },
    switchSustainableAI: {
        action: "Switch to sustainable AI model",
        credits: 100,
        description: "Use DeepSeek AI or ViroAI for your queries"
    },

    // Sustainable behaviors
    bikeToWork: {
        action: "Bike to work (logged)",
        credits: 5,
        description: "Log bike/walk commute (5 credits per day)"
    },
    optimizePrompt: {
        action: "Optimize a prompt successfully",
        credits: 10,
        description: "Use Prompt Coach to improve efficiency"
    },
    useLibraryPrompt: {
        action: "Use library prompt",
        credits: 5,
        description: "Select pre-optimized prompt from library"
    },
    sharePrompt: {
        action: "Share optimized prompt",
        credits: 15,
        description: "Contribute to library or share with team"
    },

    // Learning & engagement
    watchTutorial: {
        action: "Complete training module",
        credits: 30,
        description: "Finish any sustainability training"
    },
    dailyCheckIn: {
        action: "Daily dashboard check-in",
        credits: 3,
        description: "Check your impact daily (consecutive days bonus)"
    },

    // Special actions
    referColleague: {
        action: "Refer a colleague",
        credits: 50,
        description: "Help colleague set up sustainable tools"
    },
    achievementUnlock: {
        action: "Unlock achievement",
        credits: "varies",
        description: "Credits awarded with each achievement"
    }
};

// Credit spending options (from REFINED_PROTOTYPES.md)
const creditSpendingOptions = {
    // Guilt-free AI usage
    aiQuery: {
        cost: 1,
        description: "1 AI query credit (any model)"
    },
    premiumAIQuery: {
        cost: 3,
        description: "1 premium AI query (GPT-4, Claude Opus)"
    },

    // Carbon offsetting
    plantTree: {
        cost: 100,
        description: "Plant 1 tree through ministry partner"
    },
    offsetTon: {
        cost: 1000,
        description: "Offset 1 ton of CO₂ through certified program"
    },

    // Rewards
    ecoProductDiscount: {
        cost: 250,
        description: "10% discount on eco-friendly products"
    },
    extraHoliday: {
        cost: 5000,
        description: "1 extra sustainability day off"
    },
    teamLunch: {
        cost: 2000,
        description: "Team lunch at sustainable restaurant"
    },

    // Professional development
    trainingCourse: {
        cost: 500,
        description: "Sustainability certification course"
    },
    conference: {
        cost: 3000,
        description: "Green tech conference ticket"
    }
};

// Leaderboard categories
const leaderboardCategories = {
    overall: {
        name: "Overall Sustainability Score",
        metric: "totalScore",
        description: "Combination of all metrics"
    },
    co2Savings: {
        name: "CO₂ Savings Champion",
        metric: "co2Saved",
        description: "Most CO₂ saved"
    },
    efficiency: {
        name: "Efficiency Master",
        metric: "efficiencyScore",
        description: "Best prompt efficiency"
    },
    consistency: {
        name: "Consistency Award",
        metric: "streak",
        description: "Longest active streak"
    },
    innovation: {
        name: "Innovation Leader",
        metric: "newTools",
        description: "Most new tools adopted"
    },
    teamPlayer: {
        name: "Team Player",
        metric: "shared",
        description: "Most prompts/tips shared"
    }
};

// Gamification State Manager
class GamificationManager {
    constructor() {
        this.userProgress = {
            credits: 250, // Starting credits
            totalCreditsEarned: 250,
            totalCreditsSpent: 0,
            achievements: { ...achievements },
            streak: 0,
            lastCheckIn: null,
            totalCO2Saved: 0,
            promptsOptimized: 0,
            oneShotSuccesses: 0,
            toolsUsed: new Set(),
            quizzesCompleted: 0
        };
    }

    // Earn credits
    earnCredits(actionKey, amount = null) {
        const action = creditEarningActions[actionKey];
        if (!action) return false;

        const creditsToAdd = amount || action.credits;
        this.userProgress.credits += creditsToAdd;
        this.userProgress.totalCreditsEarned += creditsToAdd;

        this.checkAchievements();
        return {
            success: true,
            credits: creditsToAdd,
            newBalance: this.userProgress.credits,
            message: `+${creditsToAdd} credits! ${action.description}`
        };
    }

    // Spend credits
    spendCredits(optionKey, quantity = 1) {
        const option = creditSpendingOptions[optionKey];
        if (!option) return { success: false, message: "Invalid option" };

        const totalCost = option.cost * quantity;
        if (this.userProgress.credits < totalCost) {
            return { success: false, message: "Insufficient credits" };
        }

        this.userProgress.credits -= totalCost;
        this.userProgress.totalCreditsSpent += totalCost;

        return {
            success: true,
            spent: totalCost,
            newBalance: this.userProgress.credits,
            message: `Redeemed: ${option.description}`
        };
    }

    // Update achievement progress
    updateAchievementProgress(achievementKey, incrementBy = 1) {
        const achievement = this.userProgress.achievements[achievementKey];
        if (!achievement || achievement.unlocked) return false;

        achievement.progress.current += incrementBy;

        // Check if unlocked
        if (achievement.progress.current >= achievement.progress.target) {
            achievement.unlocked = true;
            this.earnCredits('achievementUnlock', achievement.credits);
            return {
                unlocked: true,
                achievement: achievement,
                credits: achievement.credits
            };
        }

        return {
            unlocked: false,
            progress: achievement.progress
        };
    }

    // Check all achievements based on current state
    checkAchievements() {
        const unlocked = [];

        // Check CO2-based achievements
        if (this.userProgress.totalCO2Saved >= 100) {
            const result = this.updateAchievementProgress('growingGreen', 0);
            if (result && result.unlocked) unlocked.push(result);
        }
        if (this.userProgress.totalCO2Saved >= 1000) {
            const result = this.updateAchievementProgress('carbonChampion', 0);
            if (result && result.unlocked) unlocked.push(result);
        }
        if (this.userProgress.totalCO2Saved >= 10000) {
            const result = this.updateAchievementProgress('sustainabilityStar', 0);
            if (result && result.unlocked) unlocked.push(result);
        }

        // Check prompt-based achievements
        if (this.userProgress.oneShotSuccesses >= 10) {
            const result = this.updateAchievementProgress('efficientStarter', 0);
            if (result && result.unlocked) unlocked.push(result);
        }
        if (this.userProgress.oneShotSuccesses >= 50) {
            const result = this.updateAchievementProgress('promptMaster', 0);
            if (result && result.unlocked) unlocked.push(result);
        }

        return unlocked;
    }

    // Get user's current tier
    getUserTier() {
        const unlockedCount = Object.values(this.userProgress.achievements)
            .filter(a => a.unlocked && !a.isTeam && !a.isMinistry).length;

        if (unlockedCount >= 12) return achievementTiers.expert;
        if (unlockedCount >= 8) return achievementTiers.advanced;
        if (unlockedCount >= 4) return achievementTiers.intermediate;
        return achievementTiers.beginner;
    }

    // Get leaderboard position
    calculateLeaderboardScore() {
        return {
            totalScore: this.userProgress.totalCreditsEarned,
            co2Saved: this.userProgress.totalCO2Saved,
            efficiencyScore: this.userProgress.oneShotSuccesses / (this.userProgress.promptsOptimized || 1),
            streak: this.userProgress.streak,
            newTools: this.userProgress.toolsUsed.size,
            shared: 0 // Track separately
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        achievements,
        achievementTiers,
        creditEarningActions,
        creditSpendingOptions,
        leaderboardCategories,
        GamificationManager
    };
}
