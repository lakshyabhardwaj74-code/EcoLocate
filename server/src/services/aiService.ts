export interface AIAnalysisResult {
  detectedItem: string;
  category: string;
  confidence: number;
  estimatedWeightKg: number;
  estimatedPoints: number;
  recyclableMaterials: {
    gold?: string;
    silver?: string;
    copper?: string;
    aluminum?: string;
    plastics?: string;
    hazardous?: string;
  };
  safetyNotes: string;
  disposalMethod: string;
  isDoorstepPickupRecommended: boolean;
  isDemoMode: boolean;
}

const DEMO_PRESETS: Record<string, AIAnalysisResult> = {
  smartphone: {
    detectedItem: 'Lithium-Ion Smartphone (Touchscreen Display)',
    category: 'Smartphone',
    confidence: 0.968,
    estimatedWeightKg: 0.22,
    estimatedPoints: 100,
    recyclableMaterials: {
      gold: '0.034 grams',
      silver: '0.35 grams',
      copper: '15.2 grams',
      aluminum: '28.0 grams',
      plastics: '85.0 grams',
      hazardous: 'Lithium battery (Puncture hazard)',
    },
    safetyNotes: 'Ensure device is powered off. Do not puncture or squeeze the battery pack. Wipe personal data prior to handover.',
    disposalMethod: 'Schedule doorstep collection or drop off at nearest EcoCycle kiosk.',
    isDoorstepPickupRecommended: true,
    isDemoMode: true,
  },
  laptop: {
    detectedItem: 'Portable Laptop / Notebook Computer',
    category: 'Laptop',
    confidence: 0.945,
    estimatedWeightKg: 2.1,
    estimatedPoints: 250,
    recyclableMaterials: {
      gold: '0.14 grams',
      silver: '1.20 grams',
      copper: '185.0 grams',
      aluminum: '420.0 grams',
      plastics: '650.0 grams',
      hazardous: 'Mercury backlights (in older LCD models), Li-Polymer cells',
    },
    safetyNotes: 'Remove storage drive (SSD/HDD) or use certified data sanitization.',
    disposalMethod: 'Recycle via authorized e-waste dismantler for rare metal recovery.',
    isDoorstepPickupRecommended: true,
    isDemoMode: true,
  },
  battery: {
    detectedItem: 'High-Density Lithium-Ion / Lead-Acid Battery',
    category: 'Battery (Li-Ion / Lead Acid)',
    confidence: 0.982,
    estimatedWeightKg: 0.85,
    estimatedPoints: 50,
    recyclableMaterials: {
      copper: '45.0 grams',
      aluminum: '35.0 grams',
      hazardous: 'Toxic Lithium Salts, Heavy Metals (Cobalt/Nickel)',
    },
    safetyNotes: 'DANGER: Highly flammable if punctured or exposed to high heat. Wrap terminals with non-conductive electrical tape.',
    disposalMethod: 'Dedicated hazardous battery recycling stream only. Do NOT toss in municipal trash.',
    isDoorstepPickupRecommended: true,
    isDemoMode: true,
  },
  monitor: {
    detectedItem: 'Flat Panel LED/LCD Computer Display',
    category: 'Monitor / TV',
    confidence: 0.912,
    estimatedWeightKg: 4.5,
    estimatedPoints: 150,
    recyclableMaterials: {
      copper: '110.0 grams',
      aluminum: '650.0 grams',
      plastics: '1.8 kg',
      hazardous: 'Lead solder, Indium Tin Oxide',
    },
    safetyNotes: 'Handle glass panel carefully to prevent shattering.',
    disposalMethod: 'Dismantle at verified e-waste processing facility.',
    isDoorstepPickupRecommended: true,
    isDemoMode: true,
  },
  keyboard: {
    detectedItem: 'Mechanical USB Keyboard (Broken Keys)',
    category: 'Keyboards & Mice',
    confidence: 0.925,
    estimatedWeightKg: 0.95,
    estimatedPoints: 40,
    recyclableMaterials: {
      copper: '18.5 grams',
      plastics: '650.0 grams',
      aluminum: '45.0 grams',
    },
    safetyNotes: 'Unplug keyboard. Watch out for plastic keycaps breaking off. Safe to handle.',
    disposalMethod: 'Dispose via small electronics collection or drop-off box.',
    isDoorstepPickupRecommended: false,
    isDemoMode: true,
  },
  mouse: {
    detectedItem: 'Optical Wired/Wireless Mouse',
    category: 'Keyboards & Mice',
    confidence: 0.951,
    estimatedWeightKg: 0.15,
    estimatedPoints: 20,
    recyclableMaterials: {
      copper: '5.2 grams',
      plastics: '95.0 grams',
    },
    safetyNotes: 'Remove AA/AAA batteries if wireless before recycling.',
    disposalMethod: 'Place in designated small electronic accessories collection bins.',
    isDoorstepPickupRecommended: false,
    isDemoMode: true,
  },
  television: {
    detectedItem: 'CRT / LED Flat Screen Television Set',
    category: 'Monitor / TV',
    confidence: 0.912,
    estimatedWeightKg: 12.5,
    estimatedPoints: 150,
    recyclableMaterials: {
      copper: '320.0 grams',
      aluminum: '850.0 grams',
      plastics: '3.2 kg',
      hazardous: 'Lead in glass, phosphorus coating (if CRT)',
    },
    safetyNotes: 'Glass hazard. Handle with care. If CRT, high voltage warning inside. Do not open casing.',
    disposalMethod: 'Bulky e-waste recycling only. Schedule doorstep pickup.',
    isDoorstepPickupRecommended: true,
    isDemoMode: true,
  },
  printer: {
    detectedItem: 'All-in-One Inkjet Printer / Scanner',
    category: 'Printer / Scanner',
    confidence: 0.934,
    estimatedWeightKg: 5.8,
    estimatedPoints: 120,
    recyclableMaterials: {
      copper: '85.0 grams',
      aluminum: '220.0 grams',
      plastics: '2.4 kg',
      hazardous: 'Residual toner/ink chemicals',
    },
    safetyNotes: 'Remove ink cartridges before handing over. Avoid contact with toner powder.',
    disposalMethod: 'Recycle through hardware recovery centers. Partner printer swap programs.',
    isDoorstepPickupRecommended: true,
    isDemoMode: true,
  },
};

export class AIService {
  public static async analyzeEWasteImage(imagePathOrName?: string, originalFilename?: string): Promise<AIAnalysisResult> {
    const apiKey = process.env.VISION_AI_API_KEY;

    // Check if real AI API key is configured
    if (apiKey && apiKey.trim() !== '') {
      try {
        // Placeholder integration call to external AI API
        // E.g. OpenAI / Google Vision call can be placed here
      } catch (err) {
        console.warn('Real AI API failed, falling back to Demo AI Mode', err);
      }
    }

    // Demo AI Mode Logic
    const filenameLower = (originalFilename || imagePathOrName || '').toLowerCase();

    if (filenameLower.includes('laptop') || filenameLower.includes('notebook') || filenameLower.includes('macbook')) {
      return DEMO_PRESETS.laptop;
    } else if (filenameLower.includes('smartphone') || filenameLower.includes('phone') || filenameLower.includes('mobile')) {
      return DEMO_PRESETS.smartphone;
    } else if (filenameLower.includes('keyboard')) {
      return DEMO_PRESETS.keyboard;
    } else if (filenameLower.includes('mouse')) {
      return DEMO_PRESETS.mouse;
    } else if (filenameLower.includes('tv') || filenameLower.includes('television') || filenameLower.includes('monitor') || filenameLower.includes('screen') || filenameLower.includes('display')) {
      return DEMO_PRESETS.television;
    } else if (filenameLower.includes('printer')) {
      return DEMO_PRESETS.printer;
    } else if (filenameLower.includes('battery') || filenameLower.includes('cell') || filenameLower.includes('powerbank')) {
      return DEMO_PRESETS.battery;
    }

    // Default high-precision smartphone classification demo result
    return DEMO_PRESETS.smartphone;
  }
}
