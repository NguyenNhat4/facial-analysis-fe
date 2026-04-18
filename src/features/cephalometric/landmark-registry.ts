/**
 * Centralized Landmark Registry
 * 
 * Single source of truth for all cephalometric landmarks.
 * Defines canonical names, backend aliases, descriptions, and categories.
 * 
 * Prevents name mismatches between backend API and frontend measurements.
 */

export interface LandmarkDefinition {
  /** Canonical symbol used throughout frontend (e.g., "Li", "Pog`") */
  symbol: string;
  /** Full descriptive name */
  name: string;
  /** Anatomical description */
  description: string;
  /** Category for organization */
  category: "skeletal" | "dental" | "soft-tissue" | "reference";
  /** Alternative names that might come from backend API */
  aliases: string[];
  /** Whether this is a key landmark used in major measurements */
  isKey: boolean;
  /** Measurements that depend on this landmark */
  usedInMeasurements: string[];
}

export const LANDMARK_REGISTRY: Record<string, LandmarkDefinition> = {
  // ============ SKELETAL LANDMARKS ============
  S: {
    symbol: "S",
    name: "Sella",
    description: "Center of sella turcica",
    category: "skeletal",
    aliases: [],
    isKey: true,
    usedInMeasurements: ["SNA", "SNB", "ANB", "SN-GoMe", "SGo-GoMe"],
  },
  N: {
    symbol: "N",
    name: "Nasion",
    description: "Most anterior point of nasofrontal suture",
    category: "skeletal",
    aliases: [],
    isKey: true,
    usedInMeasurements: ["SNA", "SNB", "ANB", "N-Me", "I-NA", "i-NB", "N-Sn-Pg"],
  },
  A: {
    symbol: "A",
    name: "A-point",
    description: "Deepest point of maxillary alveolar process",
    category: "skeletal",
    aliases: [],
    isKey: true,
    usedInMeasurements: ["SNA", "ANB", "I-NA"],
  },
  B: {
    symbol: "B",
    name: "B-point",
    description: "Deepest point of mandibular alveolar process",
    category: "skeletal",
    aliases: [],
    isKey: true,
    usedInMeasurements: ["SNB", "ANB", "i-NB"],
  },
  Pog: {
    symbol: "Pog",
    name: "Pogonion (bony)",
    description: "Most anterior point of bony chin",
    category: "skeletal",
    aliases: [],
    isKey: true,
    usedInMeasurements: ["Pog-NB", "N-Sn-Pg"],
  },
  Gn: {
    symbol: "Gn",
    name: "Gnathion",
    description: "Lowest point on symphysis of mandible",
    category: "skeletal",
    aliases: [],
    isKey: false,
    usedInMeasurements: [],
  },
  Me: {
    symbol: "Me",
    name: "Menton",
    description: "Most inferior point of mandible",
    category: "skeletal",
    aliases: [],
    isKey: true,
    usedInMeasurements: ["N-Me", "SN-GoMe", "AMPA"],
  },
  Go: {
    symbol: "Go",
    name: "Gonion",
    description: "Most posterior point of angle of mandible",
    category: "skeletal",
    aliases: ["go"],
    isKey: true,
    usedInMeasurements: ["SGo-GoMe", "SN-GoMe", "i/MP"],
  },
  ANS: {
    symbol: "ANS",
    name: "Anterior Nasal Spine",
    description: "Tip of anterior nasal spine",
    category: "skeletal",
    aliases: [],
    isKey: false,
    usedInMeasurements: [],
  },
  PNS: {
    symbol: "PNS",
    name: "Posterior Nasal Spine",
    description: "Posterior point of hard palate",
    category: "skeletal",
    aliases: [],
    isKey: false,
    usedInMeasurements: [],
  },
  Or: {
    symbol: "Or",
    name: "Orbitale",
    description: "Lowest point on orbital rim",
    category: "skeletal",
    aliases: [],
    isKey: false,
    usedInMeasurements: [],
  },
  Po: {
    symbol: "Po",
    name: "Porion",
    description: "Topmost point of external auditory meatus",
    category: "skeletal",
    aliases: [],
    isKey: false,
    usedInMeasurements: [],
  },
  Ar: {
    symbol: "Ar",
    name: "Articulare",
    description: "Intersection of posterior border of ramus and temporal bone",
    category: "skeletal",
    aliases: [],
    isKey: false,
    usedInMeasurements: [],
  },
  Co: {
    symbol: "Co",
    name: "Condylion",
    description: "Most superior point of mandibular condyle",
    category: "skeletal",
    aliases: [],
    isKey: false,
    usedInMeasurements: [],
  },
  R: {
    symbol: "R",
    name: "Ramus",
    description: "Midpoint of posterior border of ramus",
    category: "skeletal",
    aliases: [],
    isKey: false,
    usedInMeasurements: [],
  },

  // ============ DENTAL LANDMARKS ============
  I: {
    symbol: "I",
    name: "Upper Incisor Tip",
    description: "Most incisal point of upper central incisor",
    category: "dental",
    aliases: ["UIT"],
    isKey: true,
    usedInMeasurements: ["I-NA", "I/i"],
  },
  UIT: {
    symbol: "UIT",
    name: "Upper Incisor Tip",
    description: "Most incisal point of upper central incisor",
    category: "dental",
    aliases: ["I"],
    isKey: true,
    usedInMeasurements: ["I-NA", "I/i"],
  },
  UIA: {
    symbol: "UIA",
    name: "Upper Incisor Apex",
    description: "Root apex of upper central incisor",
    category: "dental",
    aliases: [],
    isKey: true,
    usedInMeasurements: ["I/i"],
  },
  i: {
    symbol: "i",
    name: "Lower Incisor Tip",
    description: "Most incisal point of lower central incisor",
    category: "dental",
    aliases: ["LIT"],
    isKey: true,
    usedInMeasurements: ["i-NB", "i/MP", "I/i"],
  },
  LIT: {
    symbol: "LIT",
    name: "Lower Incisor Tip",
    description: "Most incisal point of lower central incisor",
    category: "dental",
    aliases: ["i"],
    isKey: true,
    usedInMeasurements: ["i-NB", "i/MP", "I/i"],
  },
  LIA: {
    symbol: "LIA",
    name: "Lower Incisor Apex",
    description: "Root apex of lower central incisor",
    category: "dental",
    aliases: [],
    isKey: true,
    usedInMeasurements: ["i/MP", "I/i"],
  },
  UPM: {
    symbol: "UPM",
    name: "Upper 2nd PM Cusp Tip",
    description: "Cusp tip of upper second premolar",
    category: "dental",
    aliases: [],
    isKey: false,
    usedInMeasurements: [],
  },
  UMT: {
    symbol: "UMT",
    name: "Upper Molar Cusp Tip",
    description: "Mesiobuccal cusp tip of upper first molar",
    category: "dental",
    aliases: [],
    isKey: false,
    usedInMeasurements: [],
  },
  LPM: {
    symbol: "LPM",
    name: "Lower 2nd PM Cusp Tip",
    description: "Cusp tip of lower second premolar",
    category: "dental",
    aliases: [],
    isKey: false,
    usedInMeasurements: [],
  },
  LMT:
   {
    symbol: "LMT",
    name: "Lower Molar Cusp Tip",
    description: "Mesiobuccal cusp tip of lower first molar",
    category: "dental",
    aliases: [],
    isKey: false,
    usedInMeasurements: [],
  },

  // ============ SOFT TISSUE LANDMARKS ============
  Pn: {
    symbol: "Pn",
    name: "Pronasale",
    description: "Most protrusive point of nose (soft tissue)",
    category: "soft-tissue",
    aliases: [],
    isKey: true,
    usedInMeasurements: ["Li-E", "Ls-E", "N-Sn-Pg", "E-line"],
  },
  Sn: {
    symbol: "Sn",
    name: "Subnasale",
    description: "Soft tissue point at nasolabial junction",
    category: "soft-tissue",
    aliases: [],
    isKey: false,
    usedInMeasurements: ["N-Sn-Pg"],
  },
  Li: {
    symbol: "Li",
    name: "Labrale inferius",
    description: "Midpoint of lower lip vermillion border",
    category: "soft-tissue",
    aliases: ["li"],
    isKey: true,
    usedInMeasurements: ["Li-E"],
  },
  Ls: {
    symbol: "Ls",
    name: "Labrale superius",
    description: "Midpoint of upper lip vermillion border",
    category: "soft-tissue",
    aliases: ["ls"],
    isKey: true,
    usedInMeasurements: ["Ls-E"],
  },
  "Pog`": {
    symbol: "Pog`",
    name: "Soft Tissue Pogonion",
    description: "Most anterior point of soft tissue chin",
    category: "soft-tissue",
    aliases: ["Pg'"],
    isKey: true,
    usedInMeasurements: ["Li-E", "Ls-E", "N-Sn-Pg", "E-line"],
  },
  "N`": {
    symbol: "N`",
    name: "Soft Tissue Nasion",
    description: "Soft tissue point corresponding to nasion",
    category: "soft-tissue",
    aliases: [],
    isKey: false,
    usedInMeasurements: [],
  },

  // ============ REFERENCE LINES (Calculated) ============
  NA: {
    symbol: "NA",
    name: "N-A Line",
    description: "Reference line from N to A (for I-NA measurement)",
    category: "reference",
    aliases: [],
    isKey: false,
    usedInMeasurements: ["I-NA"],
  },
  NB: {
    symbol: "NB",
    name: "N-B Line",
    description: "Reference line from N to B (for i-NB measurement)",
    category: "reference",
    aliases: [],
    isKey: false,
    usedInMeasurements: ["i-NB"],
  },
  "SN": {
    symbol: "SN",
    name: "S-N Line",
    description: "Cranial base reference line",
    category: "reference",
    aliases: [],
    isKey: false,
    usedInMeasurements: ["SNA", "SNB", "ANB"],
  },
};

/**
 * Get a landmark by its symbol or alias
 * Useful for resolving name mismatches
 */
export function getLandmarkBySymbolOrAlias(symbolOrAlias: string): LandmarkDefinition | undefined {
  // Direct match
  if (LANDMARK_REGISTRY[symbolOrAlias]) {
    return LANDMARK_REGISTRY[symbolOrAlias];
  }

  // Check aliases
  for (const landmark of Object.values(LANDMARK_REGISTRY)) {
    if (landmark.aliases.includes(symbolOrAlias)) {
      return landmark;
    }
  }

  return undefined;
}

/**
 * Get canonical symbol for a landmark (resolves aliases)
 */
export function getCanonicalSymbol(symbolOrAlias: string): string {
  const landmark = getLandmarkBySymbolOrAlias(symbolOrAlias);
  return landmark ? landmark.symbol : symbolOrAlias;
}

/**
 * Get all landmarks used in a specific measurement
 */
export function getLandmarksForMeasurement(measurementName: string): LandmarkDefinition[] {
  return Object.values(LANDMARK_REGISTRY).filter(lm =>
    lm.usedInMeasurements.includes(measurementName)
  );
}

/**
 * Get all landmarks in a category
 */
export function getLandmarksByCategory(category: LandmarkDefinition["category"]): LandmarkDefinition[] {
  return Object.values(LANDMARK_REGISTRY).filter(lm => lm.category === category);
}

/**
 * Validate that all required landmarks for a measurement exist
 */
export function validateLandmarksForMeasurement(
  measurementName: string,
  availableLandmarks: Record<string, any>
): { valid: boolean; missing: string[] } {
  const required = getLandmarksForMeasurement(measurementName);
  const missing: string[] = [];

  for (const landmark of required) {
    // Check if canonical symbol exists
    if (!availableLandmarks[landmark.symbol]) {
      // Check if any alias exists
      const hasAlias = landmark.aliases.some(alias => availableLandmarks[alias]);
      if (!hasAlias) {
        missing.push(landmark.symbol);
      }
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}
