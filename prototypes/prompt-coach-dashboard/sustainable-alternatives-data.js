/**
 * Comprehensive Sustainable AI Alternatives Database
 * Based on research from "Eco-Friendly Alternatives (Dashboard).xlsx"
 * Contains all 25 tools across 6 categories
 *
 * This data supports the Sustainable AI Hub prototype (REFINED_PROTOTYPES.md)
 * Addresses partner feedback: Show real alternatives with actionable information
 */

const sustainableAlternatives = {
    // Category 1: Sustainable AI Models (2 tools)
    aiModels: [
        {
            id: "deepseek-ai",
            name: "DeepSeek AI",
            category: "AI Model",
            description: "10x more energy efficient than ChatGPT-4",
            efficiency: "90% less energy",
            impact: "Uses only 2,000 chips vs 25,000 for GPT-4",
            co2Savings: "~0.29g per query vs 0.32g",
            features: [
                "Comparable performance for most tasks",
                "Faster response times",
                "Lower carbon footprint",
                "Cost-effective for high-volume usage"
            ],
            implementation: "Easy",
            url: "https://deepseek.com",
            incentive: "Efficiency",
            status: "recommended",
            ministryApproved: false,
            potentialSavings: "80% CO₂ reduction for routine queries"
        },
        {
            id: "viro-ai",
            name: "ViroAI / ViroGPT",
            category: "AI Model",
            description: "Carbon-neutral AI with transparent offset reporting",
            efficiency: "100% offset",
            impact: "Every query is carbon-neutral",
            co2Savings: "Net zero emissions",
            features: [
                "Complete carbon offsetting",
                "Transparency in environmental impact",
                "Detailed offset reports",
                "Supports reforestation projects"
            ],
            implementation: "Medium",
            url: "https://viro.ai",
            incentive: "Ethical Alignment",
            status: "available",
            ministryApproved: false,
            potentialSavings: "100% carbon neutrality"
        }
    ],

    // Category 2: Search Engines (5 tools)
    searchEngines: [
        {
            id: "ecosia",
            name: "Ecosia",
            category: "Search Engine",
            description: "Plants trees with search revenue, 200% renewable energy",
            efficiency: "200% renewable",
            impact: "Over 180 million trees planted",
            co2Savings: "Carbon negative operations",
            features: [
                "Plants 1 tree per ~45 searches",
                "100% renewable energy (2x offset)",
                "Complete financial transparency",
                "Privacy-focused (no tracking sold)"
            ],
            implementation: "Very Easy",
            url: "https://www.ecosia.org",
            incentive: "Environmental Impact + Convenience",
            status: "active",
            ministryApproved: true,
            potentialSavings: "45 trees planted per employee per year"
        },
        {
            id: "qwant",
            name: "Qwant",
            category: "Search Engine",
            description: "Privacy-first search engine, GDPR compliant, European servers",
            efficiency: "Low data center impact",
            impact: "Privacy protection reduces unnecessary data storage",
            co2Savings: "Reduced data processing = lower energy",
            features: [
                "No user tracking or profiling",
                "GDPR compliant by design",
                "European data centers",
                "No filter bubbles"
            ],
            implementation: "Very Easy",
            url: "https://www.qwant.com",
            incentive: "Privacy + Compliance",
            status: "available",
            ministryApproved: true,
            potentialSavings: "Enhanced privacy + reduced data footprint"
        },
        {
            id: "good-search",
            name: "GOOD Search",
            category: "Search Engine",
            description: "Ad-free, supports UN Sustainable Development Goals",
            efficiency: "Ad-free = less data transfer",
            impact: "Donations to sustainable causes",
            co2Savings: "50% less data than ad-heavy engines",
            features: [
                "No advertisements",
                "Supports UN SDGs",
                "Clean interface",
                "Transparent impact reporting"
            ],
            implementation: "Very Easy",
            url: "https://goodsearch.com",
            incentive: "Ethical Alignment + User Experience",
            status: "available",
            ministryApproved: false,
            potentialSavings: "Cleaner browsing + cause support"
        },
        {
            id: "ekoru",
            name: "Ekoru",
            category: "Search Engine",
            description: "Ocean conservation focus, donates to Big Blue Ocean Cleanup",
            efficiency: "Green hosting",
            impact: "60% of profits to ocean cleanup",
            co2Savings: "Carbon-neutral operations",
            features: [
                "Supports ocean cleanup",
                "Privacy-focused",
                "Green web hosting",
                "Transparent donation model"
            ],
            implementation: "Very Easy",
            url: "https://ekoru.org",
            incentive: "Environmental Impact + Privacy",
            status: "available",
            ministryApproved: false,
            potentialSavings: "Ocean cleanup + carbon neutrality"
        },
        {
            id: "lilo",
            name: "Lilo",
            category: "Search Engine",
            description: "User-directed donations to social and environmental projects",
            efficiency: "Green operations",
            impact: "Users choose which causes to support",
            co2Savings: "Efficient operations + cause support",
            features: [
                "Earn 'water drops' with searches",
                "Direct drops to chosen projects",
                "Wide variety of causes",
                "Transparent impact tracking"
            ],
            implementation: "Very Easy",
            url: "https://www.lilo.org",
            incentive: "User Choice + Impact Visibility",
            status: "available",
            ministryApproved: false,
            potentialSavings: "Personalized cause support"
        }
    ],

    // Category 3: Developer Tools (8 tools)
    developerTools: [
        {
            id: "carbon-aware-sdk",
            name: "Carbon Aware SDK",
            category: "Developer Tool",
            description: "Microsoft-developed SDK for carbon-aware computing",
            efficiency: "Intelligent scheduling",
            impact: "Time-shifts workloads to low-carbon periods",
            co2Savings: "Up to 45% reduction through smart timing",
            features: [
                "Real-time grid carbon intensity data",
                "Intelligent workload scheduling",
                "Multi-region optimization",
                "Open-source and free"
            ],
            implementation: "Medium (Developer)",
            url: "https://github.com/Green-Software-Foundation/carbon-aware-sdk",
            incentive: "Efficiency + Cost Savings",
            status: "recommended",
            ministryApproved: false,
            potentialSavings: "45% CO₂ reduction via smart scheduling"
        },
        {
            id: "co2js",
            name: "CO2.js",
            category: "Developer Tool",
            description: "Calculate carbon emissions of web pages and API calls",
            efficiency: "Measurement tool",
            impact: "Enables visibility and optimization",
            co2Savings: "Awareness leads to 20-30% reductions",
            features: [
                "Calculate page carbon footprint",
                "API endpoint emissions",
                "Easy JavaScript integration",
                "Open-source library"
            ],
            implementation: "Easy (Developer)",
            url: "https://www.thegreenwebfoundation.org/co2-js/",
            incentive: "Awareness + Measurement",
            status: "available",
            ministryApproved: false,
            potentialSavings: "Enable 20-30% optimization"
        },
        {
            id: "codecarbon",
            name: "CodeCarbon",
            category: "Developer Tool",
            description: "Track and reduce CO₂ emissions from code execution",
            efficiency: "Real-time monitoring",
            impact: "Python/ML model training emissions tracking",
            co2Savings: "Identify high-impact operations",
            features: [
                "Real-time CO₂ tracking",
                "ML training optimization",
                "Detailed reporting",
                "Integration with MLOps pipelines"
            ],
            implementation: "Easy (Developer)",
            url: "https://codecarbon.io/",
            incentive: "Awareness + Optimization",
            status: "available",
            ministryApproved: false,
            potentialSavings: "Optimize ML training emissions"
        },
        {
            id: "greenframe",
            name: "GreenFrame.io",
            category: "Developer Tool",
            description: "Measure and reduce web application carbon footprint",
            efficiency: "Automated testing",
            impact: "CI/CD integration for sustainability",
            co2Savings: "Continuous optimization feedback",
            features: [
                "Automated sustainability testing",
                "CI/CD pipeline integration",
                "Before/after comparisons",
                "Detailed optimization recommendations"
            ],
            implementation: "Medium (Developer)",
            url: "https://greenframe.io/",
            incentive: "Automation + Continuous Improvement",
            status: "available",
            ministryApproved: false,
            potentialSavings: "Continuous carbon optimization"
        },
        {
            id: "ecocode",
            name: "EcoCode",
            category: "Developer Tool",
            description: "IDE plugin for sustainable coding practices",
            efficiency: "Real-time guidance",
            impact: "Catch inefficient code during development",
            co2Savings: "Prevent waste before deployment",
            features: [
                "Real-time code analysis",
                "Sustainability recommendations",
                "Multiple language support",
                "VS Code, IntelliJ, Eclipse plugins"
            ],
            implementation: "Very Easy (Developer)",
            url: "https://github.com/green-code-initiative/ecoCode",
            incentive: "Convenience + Best Practices",
            status: "available",
            ministryApproved: false,
            potentialSavings: "Prevent inefficient code"
        },
        {
            id: "scaphandre",
            name: "Scaphandre",
            category: "Developer Tool",
            description: "Energy consumption monitoring agent",
            efficiency: "Hardware-level monitoring",
            impact: "Precise power usage metrics",
            co2Savings: "Identify energy hotspots",
            features: [
                "Per-process energy tracking",
                "Prometheus integration",
                "Cross-platform support",
                "Open-source"
            ],
            implementation: "Medium (Infrastructure)",
            url: "https://github.com/hubblo-org/scaphandre",
            incentive: "Precision + Optimization",
            status: "available",
            ministryApproved: false,
            potentialSavings: "Precise energy optimization"
        },
        {
            id: "cloud-carbon-footprint",
            name: "Cloud Carbon Footprint",
            category: "Developer Tool",
            description: "Measure and analyze cloud infrastructure emissions",
            efficiency: "Multi-cloud support",
            impact: "AWS, Azure, GCP emissions tracking",
            co2Savings: "Optimize cloud resources",
            features: [
                "Multi-cloud support (AWS, Azure, GCP)",
                "Historical emissions data",
                "Forecast future emissions",
                "Detailed recommendations"
            ],
            implementation: "Medium (Infrastructure)",
            url: "https://www.cloudcarbonfootprint.org/",
            incentive: "Multi-Cloud + ROI",
            status: "recommended",
            ministryApproved: false,
            potentialSavings: "15-30% cloud cost + emissions"
        },
        {
            id: "boavizta-api",
            name: "Boavizta API",
            category: "Developer Tool",
            description: "Environmental footprint API for digital services",
            efficiency: "Comprehensive lifecycle analysis",
            impact: "Hardware + usage emissions",
            co2Savings: "Total cost of ownership insights",
            features: [
                "Hardware manufacturing impact",
                "Usage phase emissions",
                "Lifecycle analysis",
                "REST API"
            ],
            implementation: "Medium (Developer)",
            url: "https://boavizta.org/",
            incentive: "Comprehensive Analysis",
            status: "available",
            ministryApproved: false,
            potentialSavings: "Full lifecycle optimization"
        }
    ],

    // Category 4: Green Hosting & Cloud (5 tools)
    hosting: [
        {
            id: "greengeeks",
            name: "GreenGeeks",
            category: "Green Hosting",
            description: "300% renewable energy hosting",
            efficiency: "300% wind energy offset",
            impact: "Carbon-reducing web hosting",
            co2Savings: "Net negative carbon footprint",
            features: [
                "300% renewable energy credits",
                "Eco-friendly data centers",
                "Tree planting program",
                "Performance optimized"
            ],
            implementation: "Easy (Migration)",
            url: "https://www.greengeeks.com/",
            incentive: "Performance + Environment",
            status: "available",
            ministryApproved: false,
            potentialSavings: "Net negative hosting"
        },
        {
            id: "dreamhost-green",
            name: "DreamHost Green",
            category: "Green Hosting",
            description: "Carbon-neutral hosting with renewable energy",
            efficiency: "100% renewable energy",
            impact: "Certified carbon-neutral",
            co2Savings: "Zero net emissions",
            features: [
                "Carbon-neutral operations",
                "Gold-level Green Power Partner (EPA)",
                "Renewable energy certificates",
                "Reliable performance"
            ],
            implementation: "Easy (Migration)",
            url: "https://www.dreamhost.com/",
            incentive: "Reliability + Environment",
            status: "available",
            ministryApproved: false,
            potentialSavings: "Carbon-neutral hosting"
        },
        {
            id: "infomaniak",
            name: "Infomaniak",
            category: "Green Hosting",
            description: "Swiss hosting powered 100% by renewable energy",
            efficiency: "100% renewable",
            impact: "European data sovereignty",
            co2Savings: "Clean Swiss hydropower",
            features: [
                "100% renewable Swiss energy",
                "GDPR compliant",
                "Data sovereignty",
                "Sustainable data centers"
            ],
            implementation: "Easy (Migration)",
            url: "https://www.infomaniak.com/",
            incentive: "Privacy + Sustainability",
            status: "available",
            ministryApproved: false,
            potentialSavings: "Clean energy + data sovereignty"
        },
        {
            id: "azure-carbon-optimization",
            name: "Azure Carbon Optimization",
            category: "Cloud Platform",
            description: "Microsoft Azure's carbon-aware features",
            efficiency: "Region selection + scheduling",
            impact: "Integrated with Carbon Aware SDK",
            co2Savings: "Up to 40% via smart region routing",
            features: [
                "Carbon intensity-based region selection",
                "Sustainability insights",
                "Integration with monitoring",
                "Native cloud platform feature"
            ],
            implementation: "Medium (Configuration)",
            url: "https://azure.microsoft.com/en-us/blog/sustainability/",
            incentive: "Native Integration + Efficiency",
            status: "recommended",
            ministryApproved: true,
            potentialSavings: "40% reduction via smart routing"
        },
        {
            id: "green-web-foundation-check",
            name: "Green Web Foundation Directory",
            category: "Green Hosting",
            description: "Database of green hosting providers worldwide",
            efficiency: "Verification service",
            impact: "Find certified green hosts",
            co2Savings: "Enable informed decisions",
            features: [
                "Verified green hosting directory",
                "Check if host is green",
                "API for verification",
                "Free service"
            ],
            implementation: "Very Easy",
            url: "https://www.thegreenwebfoundation.org/",
            incentive: "Verification + Choice",
            status: "available",
            ministryApproved: false,
            potentialSavings: "Informed green host selection"
        }
    ],

    // Category 5: Digital Footprint Calculators (4 tools)
    calculators: [
        {
            id: "website-carbon",
            name: "Website Carbon Calculator",
            category: "Calculator",
            description: "Calculate carbon footprint of any website",
            efficiency: "Instant analysis",
            impact: "Raises awareness of web carbon impact",
            co2Savings: "Awareness drives 15-25% reduction",
            features: [
                "Instant URL analysis",
                "Grams of CO₂ per page view",
                "Green hosting detection",
                "Badge for green sites"
            ],
            implementation: "Very Easy",
            url: "https://www.websitecarbon.com/",
            incentive: "Awareness + Gamification",
            status: "available",
            ministryApproved: false,
            potentialSavings: "Website optimization insights"
        },
        {
            id: "digital-beacon",
            name: "Digital Beacon",
            category: "Calculator",
            description: "Comprehensive digital footprint assessment",
            efficiency: "Multi-factor analysis",
            impact: "Device + usage + behavior tracking",
            co2Savings: "Personalized reduction roadmap",
            features: [
                "Device carbon footprint",
                "Usage pattern analysis",
                "Personalized recommendations",
                "Progress tracking"
            ],
            implementation: "Easy",
            url: "https://digitalbeacon.co/",
            incentive: "Personalization + Guidance",
            status: "available",
            ministryApproved: false,
            potentialSavings: "Personalized reduction plan"
        },
        {
            id: "climate-neutral-now",
            name: "UN Climate Neutral Now Calculator",
            category: "Calculator",
            description: "UN-backed carbon footprint calculator",
            efficiency: "Comprehensive methodology",
            impact: "Includes digital activities",
            co2Savings: "Credible offsetting options",
            features: [
                "UN-approved methodology",
                "Digital activities included",
                "Offset purchasing",
                "Impact tracking"
            ],
            implementation: "Easy",
            url: "https://www.climateneutralnow.org/",
            incentive: "Credibility + Action",
            status: "available",
            ministryApproved: false,
            potentialSavings: "Credible measurement + offsetting"
        },
        {
            id: "electricitymap",
            name: "Electricity Maps",
            category: "Calculator / Tool",
            description: "Real-time carbon intensity of electricity by region",
            efficiency: "Live data",
            impact: "Enables carbon-aware scheduling",
            co2Savings: "Time-shift workloads to clean energy",
            features: [
                "Real-time grid carbon intensity",
                "Global coverage",
                "API access",
                "Forecast data"
            ],
            implementation: "Easy (API)",
            url: "https://www.electricitymaps.com/",
            incentive: "Real-Time Data + Optimization",
            status: "recommended",
            ministryApproved: false,
            potentialSavings: "Smart timing = 30-50% reduction"
        }
    ],

    // Category 6: Awareness & Behavior Change Tools (1 tool)
    awarenessTools: [
        {
            id: "treeclicks",
            name: "TreeClicks",
            category: "Browser Extension",
            description: "Plant trees while shopping online",
            efficiency: "Zero extra effort",
            impact: "Partners plant trees with purchases",
            co2Savings: "Carbon offset via tree planting",
            features: [
                "Browser extension",
                "Automatic partner detection",
                "Free tree planting",
                "Track trees planted"
            ],
            implementation: "Very Easy",
            url: "https://treeclicks.com/",
            incentive: "Zero Effort + Visible Impact",
            status: "available",
            ministryApproved: false,
            potentialSavings: "Passive tree planting"
        }
    ]
};

/**
 * Get all alternatives as flat array
 */
function getAllAlternatives() {
    return [
        ...sustainableAlternatives.aiModels,
        ...sustainableAlternatives.searchEngines,
        ...sustainableAlternatives.developerTools,
        ...sustainableAlternatives.hosting,
        ...sustainableAlternatives.calculators,
        ...sustainableAlternatives.awarenessTools
    ];
}

/**
 * Get alternatives by category
 */
function getAlternativesByCategory(category) {
    return sustainableAlternatives[category] || [];
}

/**
 * Get recommended alternatives (ministry approved or high impact)
 */
function getRecommendedAlternatives() {
    return getAllAlternatives().filter(alt =>
        alt.status === 'recommended' || alt.ministryApproved === true
    );
}

/**
 * Get alternatives by implementation difficulty
 */
function getAlternativesByDifficulty(difficulty) {
    return getAllAlternatives().filter(alt =>
        alt.implementation.includes(difficulty)
    );
}

/**
 * Search alternatives
 */
function searchAlternatives(query) {
    const lowerQuery = query.toLowerCase();
    return getAllAlternatives().filter(alt =>
        alt.name.toLowerCase().includes(lowerQuery) ||
        alt.description.toLowerCase().includes(lowerQuery) ||
        alt.category.toLowerCase().includes(lowerQuery)
    );
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sustainableAlternatives,
        getAllAlternatives,
        getAlternativesByCategory,
        getRecommendedAlternatives,
        getAlternativesByDifficulty,
        searchAlternatives
    };
}
