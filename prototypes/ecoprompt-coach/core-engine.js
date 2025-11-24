/**
 * Eco-Smart Core Calculation Engine
 * Based on "How Hungry is AI?" research paper
 * Ground truth for all environmental impact calculations
 */

// ==============================================================================
// SECTION 1: Research-Based Constants and Coefficients
// ==============================================================================

/**
 * Environmental multipliers from research paper (Table 1, Page 4)
 * Source: Microsoft Azure / OpenAI infrastructure
 */
const ENVIRONMENTAL_CONSTANTS = {
  AZURE_OPENAI: {
    name: 'Azure/OpenAI (Default)',
    PUE: 1.12,                    // Power Usage Effectiveness
    WUE_SITE: 0.30,               // Water Usage Effectiveness (on-site cooling) L/kWh
    WUE_SOURCE: 3.142,            // Water Usage Effectiveness (off-site electricity) L/kWh
    CIF: 0.3528,                  // Carbon Intensity Factor kgCO2e/kWh
    region: 'US'
  },
  AWS_ANTHROPIC: {
    name: 'AWS/Anthropic',
    PUE: 1.14,
    WUE_SITE: 0.18,
    WUE_SOURCE: 3.142,
    CIF: 0.385,
    region: 'US'
  },
  DEEPSEEK_CHINA: {
    name: 'DeepSeek (China)',
    PUE: 1.27,
    WUE_SITE: 1.20,
    WUE_SOURCE: 6.016,
    CIF: 0.6,
    region: 'CN'
  }
};

/**
 * Energy consumption baselines from research (Table 4, Page 8)
 * Model: GPT-4o (March 2025)
 */
const ENERGY_BASELINES_GPT4O = {
  SHORT: {
    inputTokens: 100,
    outputTokens: 300,
    totalTokens: 400,
    energyWh: 0.421,
    stdDev: 0.127
  },
  MEDIUM: {
    inputTokens: 1000,
    outputTokens: 1000,
    totalTokens: 2000,
    energyWh: 1.214,
    stdDev: 0.391
  },
  LONG: {
    inputTokens: 10000,
    outputTokens: 1500,
    totalTokens: 11500,
    energyWh: 1.788,
    stdDev: 0.363
  }
};

/**
 * Physics constants for real-world conversions
 */
const PHYSICS_CONSTANTS = {
  KWH_TO_MJ: 3.6,                    // 1 kWh = 3.6 megajoules
  KWH_TO_WH: 1000,                   // 1 kWh = 1000 Wh
  LED_BULB_WATTS: 10,                // Typical LED bulb
  SMARTPHONE_CHARGE_WH: 15,          // iPhone ~15Wh battery
  LAPTOP_CHARGE_WH: 60,              // Typical laptop battery
  COFFEE_MAKER_WATTS: 1000,          // Coffee maker power
  COFFEE_BOIL_TIME_MINUTES: 5,       // Time to boil water for coffee
  TV_65_INCH_WATTS: 130,             // 65" LED TV
  LITERS_PER_GALLON: 3.785,         // US gallon
  CUPS_OF_COFFEE_ML: 237,           // 1 cup = 8 oz = 237ml
  CO2_CAR_PER_KM: 0.192,            // kg CO2 per km (gasoline car)
  CO2_TREE_ABSORPTION_KG_YEAR: 21   // Average tree absorbs 21kg CO2/year
};

// ==============================================================================
// SECTION 2: Core Calculation Functions (Based on Research Formulas)
// ==============================================================================

/**
 * Calculate energy consumption based on token count
 * Uses linear interpolation between research benchmarks
 *
 * Formula approach: Since energy scales roughly linearly with tokens,
 * we interpolate between known benchmarks from Table 4
 *
 * @param {number} inputTokens - Estimated input tokens
 * @param {number} outputTokens - Estimated output tokens
 * @returns {number} Energy in Wh (watt-hours)
 */
function calculateEnergy(inputTokens, outputTokens) {
  const totalTokens = inputTokens + outputTokens;

  // Use benchmarks for interpolation
  const benchmarks = [
    { tokens: ENERGY_BASELINES_GPT4O.SHORT.totalTokens, energy: ENERGY_BASELINES_GPT4O.SHORT.energyWh },
    { tokens: ENERGY_BASELINES_GPT4O.MEDIUM.totalTokens, energy: ENERGY_BASELINES_GPT4O.MEDIUM.energyWh },
    { tokens: ENERGY_BASELINES_GPT4O.LONG.totalTokens, energy: ENERGY_BASELINES_GPT4O.LONG.energyWh }
  ];

  // Find the right range for interpolation
  if (totalTokens <= benchmarks[0].tokens) {
    // Below shortest benchmark - linear from 0
    return (totalTokens / benchmarks[0].tokens) * benchmarks[0].energy;
  } else if (totalTokens <= benchmarks[1].tokens) {
    // Between short and medium
    return linearInterpolate(
      benchmarks[0].tokens, benchmarks[0].energy,
      benchmarks[1].tokens, benchmarks[1].energy,
      totalTokens
    );
  } else if (totalTokens <= benchmarks[2].tokens) {
    // Between medium and long
    return linearInterpolate(
      benchmarks[1].tokens, benchmarks[1].energy,
      benchmarks[2].tokens, benchmarks[2].energy,
      totalTokens
    );
  } else {
    // Beyond long benchmark - extrapolate linearly
    const rate = (benchmarks[2].energy - benchmarks[1].energy) /
                 (benchmarks[2].tokens - benchmarks[1].tokens);
    return benchmarks[2].energy + (totalTokens - benchmarks[2].tokens) * rate;
  }
}

/**
 * Linear interpolation helper
 */
function linearInterpolate(x1, y1, x2, y2, x) {
  return y1 + (y2 - y1) * (x - x1) / (x2 - x1);
}

/**
 * Calculate water consumption
 * Formula from Equation (3), Page 7:
 * Water (L) = (E_query / PUE) × WUE_site + E_query × WUE_source
 *
 * @param {number} energyWh - Energy in watt-hours
 * @param {object} constants - Environmental constants object
 * @returns {number} Water consumption in liters
 */
function calculateWater(energyWh, constants = ENVIRONMENTAL_CONSTANTS.AZURE_OPENAI) {
  const energyKWh = energyWh / PHYSICS_CONSTANTS.KWH_TO_WH;

  // On-site cooling water (evaporated)
  const onSiteWater = (energyKWh / constants.PUE) * constants.WUE_SITE;

  // Off-site electricity generation water
  const offSiteWater = energyKWh * constants.WUE_SOURCE;

  return onSiteWater + offSiteWater;
}

/**
 * Calculate carbon emissions
 * Formula from Equation (4), Page 7:
 * Carbon (kgCO2e) = E_query × CIF
 *
 * @param {number} energyWh - Energy in watt-hours
 * @param {object} constants - Environmental constants object
 * @returns {number} Carbon emissions in kg CO2e
 */
function calculateCarbon(energyWh, constants = ENVIRONMENTAL_CONSTANTS.AZURE_OPENAI) {
  const energyKWh = energyWh / PHYSICS_CONSTANTS.KWH_TO_WH;
  return energyKWh * constants.CIF;
}

// ==============================================================================
// SECTION 3: Token Estimation (Approximation)
// ==============================================================================

/**
 * Estimate token count from text
 * Rough approximation: ~4 characters per token (OpenAI standard)
 * More accurate than word count for technical/code content
 *
 * @param {string} text - Input text
 * @returns {number} Estimated token count
 */
function estimateTokens(text) {
  if (!text || text.trim().length === 0) return 0;

  // Average: 1 token ≈ 4 characters (including spaces)
  // This is a simplified approximation from OpenAI's tokenizer
  return Math.ceil(text.length / 4);
}

/**
 * Estimate output tokens based on prompt type
 * Conservative estimates for common use cases
 */
function estimateOutputTokens(inputTokens, promptType = 'general') {
  const ratios = {
    general: 1.5,      // General queries typically get ~1.5x response
    code: 2.0,         // Code generation produces more output
    creative: 3.0,     // Creative writing produces longer output
    brief: 0.5,        // Brief answers are shorter
    analysis: 2.5      // Analysis produces detailed output
  };

  return Math.round(inputTokens * (ratios[promptType] || ratios.general));
}

// ==============================================================================
// SECTION 4: Real-World Analogies (Accurate Physics Conversions)
// ==============================================================================

/**
 * Convert energy to relatable real-world equivalents
 * All conversions use accurate physics (1 kWh = 3.6 MJ)
 *
 * @param {number} energyWh - Energy in watt-hours
 * @returns {object} Object with various analogies
 */
function getEnergyAnalogies(energyWh) {
  return {
    // LED lightbulb hours (10W LED)
    ledHours: (energyWh / PHYSICS_CONSTANTS.LED_BULB_WATTS).toFixed(2),

    // Smartphone charges (15 Wh per charge)
    smartphoneCharges: (energyWh / PHYSICS_CONSTANTS.SMARTPHONE_CHARGE_WH).toFixed(2),

    // Laptop charges (60 Wh per charge)
    laptopCharges: (energyWh / PHYSICS_CONSTANTS.LAPTOP_CHARGE_WH).toFixed(2),

    // Coffee brewing (1000W for 5 minutes = 83.33 Wh per cup)
    cupsOfCoffee: (energyWh / (PHYSICS_CONSTANTS.COFFEE_MAKER_WATTS * PHYSICS_CONSTANTS.COFFEE_BOIL_TIME_MINUTES / 60)).toFixed(2),

    // TV watching hours (130W 65" TV)
    tvHours: (energyWh / PHYSICS_CONSTANTS.TV_65_INCH_WATTS).toFixed(2),

    // Google searches (0.3 Wh per search, from research)
    googleSearches: (energyWh / 0.3).toFixed(1)
  };
}

/**
 * Convert water to relatable real-world equivalents
 *
 * @param {number} waterLiters - Water in liters
 * @returns {object} Object with various analogies
 */
function getWaterAnalogies(waterLiters) {
  return {
    // Cups of coffee (237ml per cup)
    cupsOfCoffee: (waterLiters * 1000 / PHYSICS_CONSTANTS.CUPS_OF_COFFEE_ML).toFixed(2),

    // Water bottles (500ml)
    waterBottles: (waterLiters * 2).toFixed(2),

    // Gallons
    gallons: (waterLiters / PHYSICS_CONSTANTS.LITERS_PER_GALLON).toFixed(3),

    // Daily drinking water (2 liters recommended)
    daysOfDrinking: (waterLiters / 2).toFixed(3)
  };
}

/**
 * Convert carbon to relatable real-world equivalents
 *
 * @param {number} carbonKg - Carbon in kg CO2e
 * @returns {object} Object with various analogies
 */
function getCarbonAnalogies(carbonKg) {
  return {
    // Driving distance in km (0.192 kg CO2 per km)
    drivingKm: (carbonKg / PHYSICS_CONSTANTS.CO2_CAR_PER_KM).toFixed(2),

    // Driving distance in miles
    drivingMiles: (carbonKg / PHYSICS_CONSTANTS.CO2_CAR_PER_KM * 0.621371).toFixed(2),

    // Trees needed for 1 year to offset (21 kg CO2 per tree per year)
    treesPerYear: (carbonKg / PHYSICS_CONSTANTS.CO2_TREE_ABSORPTION_KG_YEAR).toFixed(3),

    // Days of tree absorption (for 1 tree)
    treeDays: (carbonKg / PHYSICS_CONSTANTS.CO2_TREE_ABSORPTION_KG_YEAR * 365).toFixed(1)
  };
}

// ==============================================================================
// SECTION 5: Main Impact Calculator
// ==============================================================================

/**
 * Calculate complete environmental impact for a prompt
 * This is the main function that ties everything together
 *
 * @param {string} promptText - The user's prompt text
 * @param {object} options - Configuration options
 * @returns {object} Complete environmental impact analysis
 */
function calculateEnvironmentalImpact(promptText, options = {}) {
  const {
    outputType = 'general',
    gridProfile = 'AZURE_OPENAI',
    customOutputTokens = null
  } = options;

  // Step 1: Estimate tokens
  const inputTokens = estimateTokens(promptText);
  const outputTokens = customOutputTokens || estimateOutputTokens(inputTokens, outputType);
  const totalTokens = inputTokens + outputTokens;

  // Step 2: Get environmental constants
  const constants = ENVIRONMENTAL_CONSTANTS[gridProfile] || ENVIRONMENTAL_CONSTANTS.AZURE_OPENAI;

  // Step 3: Calculate core metrics using research formulas
  const energyWh = calculateEnergy(inputTokens, outputTokens);
  const waterLiters = calculateWater(energyWh, constants);
  const carbonKg = calculateCarbon(energyWh, constants);

  // Step 4: Generate analogies
  const energyAnalogies = getEnergyAnalogies(energyWh);
  const waterAnalogies = getWaterAnalogies(waterLiters);
  const carbonAnalogies = getCarbonAnalogies(carbonKg);

  // Step 5: Calculate eco-score (0-100, lower is better)
  // Based on normalized values relative to SHORT benchmark
  const ecoScore = calculateEcoScore(energyWh, waterLiters, carbonKg);

  return {
    tokens: {
      input: inputTokens,
      output: outputTokens,
      total: totalTokens
    },
    impact: {
      energy: {
        wh: energyWh,
        kwh: energyWh / 1000,
        analogies: energyAnalogies
      },
      water: {
        liters: waterLiters,
        milliliters: waterLiters * 1000,
        analogies: waterAnalogies
      },
      carbon: {
        kg: carbonKg,
        grams: carbonKg * 1000,
        analogies: carbonAnalogies
      }
    },
    metadata: {
      gridProfile: constants.name,
      region: constants.region,
      ecoScore: ecoScore,
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * Calculate eco-score (0-100 scale)
 * Lower is better (more efficient)
 */
function calculateEcoScore(energyWh, waterLiters, carbonKg) {
  // Normalize against SHORT benchmark (best case)
  const baselineEnergy = ENERGY_BASELINES_GPT4O.SHORT.energyWh;
  const baselineWater = calculateWater(baselineEnergy);
  const baselineCarbon = calculateCarbon(baselineEnergy);

  // Calculate ratios
  const energyRatio = energyWh / baselineEnergy;
  const waterRatio = waterLiters / baselineWater;
  const carbonRatio = carbonKg / baselineCarbon;

  // Weighted average (energy weighted most heavily)
  const compositeRatio = (energyRatio * 0.5) + (waterRatio * 0.25) + (carbonRatio * 0.25);

  // Convert to 0-100 scale (inverted so lower is better)
  // Cap at 100
  const score = Math.min(100, Math.round(compositeRatio * 50));

  return score;
}

// ==============================================================================
// SECTION 6: Comparison and Optimization Functions
// ==============================================================================

/**
 * Compare two prompts to show optimization savings
 *
 * @param {string} originalPrompt - Original prompt text
 * @param {string} optimizedPrompt - Optimized prompt text
 * @param {object} options - Configuration options
 * @returns {object} Comparison data
 */
function comparePrompts(originalPrompt, optimizedPrompt, options = {}) {
  const original = calculateEnvironmentalImpact(originalPrompt, options);
  const optimized = calculateEnvironmentalImpact(optimizedPrompt, options);

  const savings = {
    energy: {
      wh: original.impact.energy.wh - optimized.impact.energy.wh,
      percentage: ((1 - optimized.impact.energy.wh / original.impact.energy.wh) * 100).toFixed(1)
    },
    water: {
      liters: original.impact.water.liters - optimized.impact.water.liters,
      percentage: ((1 - optimized.impact.water.liters / original.impact.water.liters) * 100).toFixed(1)
    },
    carbon: {
      kg: original.impact.carbon.kg - optimized.impact.carbon.kg,
      percentage: ((1 - optimized.impact.carbon.kg / original.impact.carbon.kg) * 100).toFixed(1)
    },
    tokens: {
      saved: original.tokens.total - optimized.tokens.total,
      percentage: ((1 - optimized.tokens.total / original.tokens.total) * 100).toFixed(1)
    }
  };

  return {
    original,
    optimized,
    savings
  };
}

// ==============================================================================
// EXPORTS
// ==============================================================================

// Make functions available globally for the extension
if (typeof window !== 'undefined') {
  window.EcoSmartEngine = {
    // Constants
    ENVIRONMENTAL_CONSTANTS,
    ENERGY_BASELINES_GPT4O,
    PHYSICS_CONSTANTS,

    // Main functions
    calculateEnvironmentalImpact,
    comparePrompts,
    estimateTokens,
    estimateOutputTokens,

    // Component functions
    calculateEnergy,
    calculateWater,
    calculateCarbon,
    getEnergyAnalogies,
    getWaterAnalogies,
    getCarbonAnalogies,
    calculateEcoScore
  };
}
