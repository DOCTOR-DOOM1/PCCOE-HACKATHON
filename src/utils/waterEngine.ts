export type Language = 'en' | 'mr' | 'hi';

export type StressLevel = 'low' | 'mild' | 'moderate' | 'high' | 'critical';

export type CropType = 'cotton' | 'sugarcane' | 'soybean' | 'onion' | 'tur' | 'pomegranate';

export type IrrigationMethod = 'flood' | 'sprinkler' | 'drip';

export type NotificationChannel = 'whatsapp' | 'sms' | 'both';

export interface TalukaRecord {
  id: string;
  Region: 'Marathwada' | 'Vidarbha' | 'Western Maharashtra' | 'Khandesh';
  name: Record<Language, string>;
  district: Record<Language, string>;
  soilMoisturePct: number; // Bhuvan ISRO satellite surface soil moisture (0-100%)
  groundwaterDepletionPct: number; // CGWB monthly change (positive means depletion drop)
  groundwaterDepthMeters: number; // Depth to water table in meters bgl
  rainForecast7dMm: number; // IMD 7-day cumulative rainfall forecast in mm
  rainExpectedDay: Record<Language, string>;
  dailyRainMm: number[]; // 7 days forecast
  ndviScore: number; // 0.15 to 0.85
  dominantCrop: CropType;
  soilType: Record<Language, string>;
  kvkCenter: Record<Language, string>;
  kvkCitationCode: string;
  aquiferTrend6m: number[]; // 6 months depth in meters
  mapX: number; // SVG coordinate X (0-760)
  mapY: number; // SVG coordinate Y (0-540)
  farmersEnrolled: number;
  villageDemandMld: number; // Million Liters per Day
  rechargeCapacityMld: number;
  droughtLeadDays: number;
}

export interface StressEvaluation {
  score: number; // 0-100 (higher = more water stress)
  level: StressLevel;
  colorHex: string;
  bgTintHex: string;
  borderHex: string;
  badgeText: Record<Language, string>;
  shortAction: Record<Language, string>;
}

export interface IrrigationCalculationResult {
  crop: CropType;
  acres: number;
  currentMethod: IrrigationMethod;
  recommendedMethod: IrrigationMethod;
  delayDaysRecommended: number;
  baselineLitersPerCycle: number;
  optimizedLitersPerCycle: number;
  litersSavedPerCycle: number;
  litersSavedSeason: number;
  waterSavedPct: number;
  electricityKwhSaved: number;
  costSavedInr: number;
  droughtBufferDaysAdded: number;
  vernacularAdvisory: Record<Language, string>;
  kvkReferenceNote: Record<Language, string>;
}

export interface FormattedNotificationPayloads {
  smsText: Record<Language, string>;
  whatsappText: Record<Language, string>;
  actionBullets: Record<Language, string[]>;
}

const CROP_WATER_NEEDS_LITERS_PER_ACRE_CYCLE: Record<CropType, number> = {
  cotton: 95000,
  sugarcane: 185000,
  soybean: 68000,
  onion: 78000,
  tur: 62000,
  pomegranate: 82000,
};

const CROP_CYCLES_PER_SEASON: Record<CropType, number> = {
  cotton: 8,
  sugarcane: 18,
  soybean: 6,
  onion: 10,
  tur: 5,
  pomegranate: 12,
};

const METHOD_EFFICIENCY_MULTIPLIER: Record<IrrigationMethod, number> = {
  flood: 1.0,
  sprinkler: 0.72,
  drip: 0.52,
};

export const CROP_NAMES: Record<CropType, Record<Language, string>> = {
  cotton: { en: 'Cotton', mr: 'कापूस', hi: 'कपास' },
  sugarcane: { en: 'Sugarcane', mr: 'ऊस', hi: 'गन्ना' },
  soybean: { en: 'Soybean', mr: 'सोयाबीन', hi: 'सोयाबीन' },
  onion: { en: 'Onion', mr: 'कांदा', hi: 'प्याज' },
  tur: { en: 'Tur (Pigeon Pea)', mr: 'तूर', hi: 'तूर (अरहर)' },
  pomegranate: { en: 'Pomegranate', mr: 'डाळिंब', hi: 'अनार' },
};

/**
 * Pure calculation of composite Water Stress Score (0-100) and accessible 5-band palette mapping:
 * - Low Stress: #06ce06 (Vibrant Crop Green)
 * - Mild Stress (Intermediate): #74c328 (Lime-Meadow Transitional Green)
 * - Moderate Stress: #d3b44a (Base Harvest Ochre)
 * - High Stress (Intermediate Severe): #e07a2a (Warm Amber-Terracotta)
 * - Critical Stress: #c92a2a (Deep Crimson Alert)
 */
export function evaluateWaterStress(
  soilMoisturePct: number,
  groundwaterDepletionPct: number,
  rainForecast7dMm: number,
  ndviScore: number
): StressEvaluation {
  const moistureDeficit = Math.max(0, Math.min(50, (48 - soilMoisturePct) * 1.35));
  const gwComponent = Math.max(0, Math.min(35, groundwaterDepletionPct * 1.8));
  const ndviComponent = Math.max(0, Math.min(15, (0.65 - ndviScore) * 30));
  const rainRelief = Math.min(18, rainForecast7dMm * 0.35);

  const rawScore = Math.round(
    Math.max(4, Math.min(98, moistureDeficit + gwComponent + ndviComponent - rainRelief))
  );

  if (rawScore <= 22) {
    return {
      score: rawScore,
      level: 'low',
      colorHex: '#06ce06', // User specified low stress green
      bgTintHex: '#ecfdf3',
      borderHex: '#06ce06',
      badgeText: {
        en: 'Low Stress (Safe)',
        mr: 'कमी ताण (सुरक्षित ओलावा)',
        hi: 'कम तनाव (सुरक्षित नमी)',
      },
      shortAction: {
        en: 'Soil moisture is healthy; follow normal schedule & recharge aquifer',
        mr: 'जमिनीत पुरेसा ओलावा आहे; नियमित वेळापत्रक पाळा व पाणी जपा',
        hi: 'मिट्टी में पर्याप्त नमी है; सामान्य सिंचाई करें और भूजल बचाएं',
      },
    };
  }

  if (rawScore <= 38) {
    return {
      score: rawScore,
      level: 'mild',
      colorHex: '#74c328', // Intuitive intermediate yellow-green between #06ce06 and #d3b44a
      bgTintHex: '#f4fce3',
      borderHex: '#74c328',
      badgeText: {
        en: 'Mild Watch',
        mr: 'हलका पाण्याचा ताण',
        hi: 'हल्का जल तनाव',
      },
      shortAction: {
        en: 'Mulch crop rows & irrigate in evening to retain moisture',
        mr: 'पिकात आच्छादन (मल्चिंग) करा आणि संध्याकाळी पाणी द्या',
        hi: 'नमी बचाने के लिए मल्चिंग करें और शाम को सिंचाई करें',
      },
    };
  }

  if (rawScore <= 55) {
    return {
      score: rawScore,
      level: 'moderate',
      colorHex: '#d3b44a', // User specified base moderate stress ochre
      bgTintHex: '#fefce8',
      borderHex: '#d3b44a',
      badgeText: {
        en: 'Moderate Stress',
        mr: 'मध्यम पाण्याचा ताण',
        hi: 'मध्यम जल तनाव',
      },
      shortAction: {
        en: 'Delay irrigation to match IMD rain window; avoid flood watering',
        mr: 'पावसाचा अंदाज पाहून सिंचन पुढे ढकला; पाटाने पाणी देणे टाळा',
        hi: 'बारिश के पूर्वानुमान अनुसार सिंचाई टालें; बाढ़ सिंचाई न करें',
      },
    };
  }

  if (rawScore <= 74) {
    return {
      score: rawScore,
      level: 'high',
      colorHex: '#e07a2a', // Intuitive intermediate warm amber-terracotta
      bgTintHex: '#fff7ed',
      borderHex: '#e07a2a',
      badgeText: {
        en: 'High Water Stress',
        mr: 'तीव्र पाणी टंचाई',
        hi: 'उच्च जल संकट',
      },
      shortAction: {
        en: 'Switch to paired-row drip & organic mulching immediately',
        mr: 'तातडीने जोड-ओळ ठिबक व सेंद्रिय मल्चिंगचा वापर करा',
        hi: 'तुरंत जोड़ा-कतार ड्रिप और जैविक मल्चिंग अपनाएं',
      },
    };
  }

  return {
    score: rawScore,
    level: 'critical',
    colorHex: '#c92a2a', // High-contrast deep crimson for severe drought stress
    bgTintHex: '#fef2f2',
    borderHex: '#c92a2a',
    badgeText: {
      en: 'Critical Depletion',
      mr: 'अति-तीव्र पाणी संकट',
      hi: 'गंभीर भूजल संकट',
    },
    shortAction: {
      en: 'Apply life-saving pulse drip irrigation only; pause borewell over-pumping',
      mr: 'केवळ संरक्षित ठिबक सिंचन वापरा; बोअरवेलचा अतिरिक्त उपसा थांबवा',
      hi: 'केवल जीवनरक्षक ड्रिप सिंचाई करें; बोरवेल का अत्यधिक दोहन रोकें',
    },
  };
}

/**
 * Calculates concrete water savings (liters, electricity, cost) and generates Nugen LLM + KVK RAG grounded vernacular advisory
 */
export function calculateIrrigationAdvisory(
  taluka: TalukaRecord,
  crop: CropType,
  acres: number,
  currentMethod: IrrigationMethod
): IrrigationCalculationResult {
  const safeAcres = Math.max(0.5, Math.min(100, Number.isFinite(acres) ? acres : 2));
  const basePerAcre = CROP_WATER_NEEDS_LITERS_PER_ACRE_CYCLE[crop];
  const cycles = CROP_CYCLES_PER_SEASON[crop];

  let delayDaysRecommended = 0;
  if (taluka.rainForecast7dMm >= 25) {
    delayDaysRecommended = 4;
  } else if (taluka.rainForecast7dMm >= 14) {
    delayDaysRecommended = 3;
  } else if (taluka.rainForecast7dMm >= 8) {
    delayDaysRecommended = 2;
  }

  const recommendedMethod: IrrigationMethod = 'drip';
  const currentMultiplier = METHOD_EFFICIENCY_MULTIPLIER[currentMethod];
  const rainFactor =
    delayDaysRecommended > 0 ? Math.max(0.55, 1 - taluka.rainForecast7dMm * 0.012) : 1;

  const optimizedMultiplier =
    (currentMethod === 'drip' ? 0.46 : METHOD_EFFICIENCY_MULTIPLIER[recommendedMethod]) * rainFactor;

  const baselineLitersPerCycle = Math.round(basePerAcre * safeAcres * currentMultiplier);
  const optimizedLitersPerCycle = Math.round(basePerAcre * safeAcres * optimizedMultiplier);
  const litersSavedPerCycle = Math.max(0, baselineLitersPerCycle - optimizedLitersPerCycle);
  const litersSavedSeason = Math.round(litersSavedPerCycle * cycles);

  const waterSavedPct =
    baselineLitersPerCycle > 0
      ? Math.round((litersSavedPerCycle / baselineLitersPerCycle) * 100)
      : 0;

  const electricityKwhSaved = Math.round((litersSavedSeason / 1000) * 0.42);
  const costSavedInr = Math.round(electricityKwhSaved * 6.5);
  const droughtBufferDaysAdded = Math.max(
    3,
    Math.round((litersSavedSeason / (basePerAcre * safeAcres)) * 4.5)
  );

  const cropNameEn = CROP_NAMES[crop].en;
  const cropNameMr = CROP_NAMES[crop].mr;
  const cropNameHi = CROP_NAMES[crop].hi;

  const rainClauseEn =
    delayDaysRecommended > 0
      ? `Delay irrigation ${delayDaysRecommended} days — ${taluka.rainForecast7dMm}mm rain expected ${taluka.rainExpectedDay.en}. `
      : `Low rainfall forecast (${taluka.rainForecast7dMm}mm next 7 days) — irrigate during evening hours to cut evaporation by 18%. `;

  const rainClauseMr =
    delayDaysRecommended > 0
      ? `सिंचन ${delayDaysRecommended} दिवस पुढे ढकला — ${taluka.rainExpectedDay.mr} रोजी ${taluka.rainForecast7dMm} मिमी पाऊस अपेक्षित आहे. `
      : `पुढील ७ दिवसांत कमी पाऊस (${taluka.rainForecast7dMm} मिमी) — बाष्पीभवन १८% टाळण्यासाठी संध्याकाळी पाणी द्या. `;

  const rainClauseHi =
    delayDaysRecommended > 0
      ? `सिंचाई ${delayDaysRecommended} दिन टालें — ${taluka.rainExpectedDay.hi} को ${taluka.rainForecast7dMm} मिमी बारिश की संभावना है। `
      : `अगले 7 दिनों में कम बारिश (${taluka.rainForecast7dMm} मिमी) — वाष्पीकरण 18% घटाने के लिए शाम को सिंचाई करें। `;

  const gwClauseEn =
    taluka.groundwaterDepletionPct > 8
      ? `Groundwater in ${taluka.name.en} taluka dropped ${taluka.groundwaterDepletionPct}% this month (${taluka.groundwaterDepthMeters}m depth) — switch to drip for ${cropNameEn} to save ${(litersSavedPerCycle / 1000).toFixed(1)}k L/cycle.`
      : `Soil moisture in ${taluka.name.en} is ${taluka.soilMoisturePct}% — apply micro-irrigation for ${cropNameEn} to save ${(litersSavedPerCycle / 1000).toFixed(1)}k L/cycle.`;

  const gwClauseMr =
    taluka.groundwaterDepletionPct > 8
      ? `${taluka.name.mr} तालुक्यात या महिन्यात भूजल पातळी ${taluka.groundwaterDepletionPct}% ने खालावली आहे (${taluka.groundwaterDepthMeters} मीटर खोली) — ${cropNameMr} पिकासाठी ठिबक सिंचन वापरा आणि प्रति पाळी ${(litersSavedPerCycle / 1000).toFixed(1)} हजार लिटर पाणी वाचवा.`
      : `${taluka.name.mr} मध्ये जमिनीतील ओलावा ${taluka.soilMoisturePct}% आहे — ${cropNameMr} पिकासाठी सूक्ष्म सिंचन वापरून प्रति पाळी ${(litersSavedPerCycle / 1000).toFixed(1)} हजार लिटर पाणी वाचवा.`;

  const gwClauseHi =
    taluka.groundwaterDepletionPct > 8
      ? `${taluka.name.hi} तालुका में इस महीने भूजल स्तर ${taluka.groundwaterDepletionPct}% गिरा है (${taluka.groundwaterDepthMeters} मीटर गहराई) — ${cropNameHi} के लिए ड्रिप सिंचाई अपनाएं और प्रति चक्र ${(litersSavedPerCycle / 1000).toFixed(1)} हजार लीटर पानी बचाएं।`
      : `${taluka.name.hi} में मिट्टी की नमी ${taluka.soilMoisturePct}% है — ${cropNameHi} में सूक्ष्म सिंचाई से प्रति चक्र ${(litersSavedPerCycle / 1000).toFixed(1)} हजार लीटर पानी बचाएं।`;

  return {
    crop,
    acres: safeAcres,
    currentMethod,
    recommendedMethod,
    delayDaysRecommended,
    baselineLitersPerCycle,
    optimizedLitersPerCycle,
    litersSavedPerCycle,
    litersSavedSeason,
    waterSavedPct,
    electricityKwhSaved,
    costSavedInr,
    droughtBufferDaysAdded,
    vernacularAdvisory: {
      en: `${rainClauseEn}${gwClauseEn}`,
      mr: `${rainClauseMr}${gwClauseMr}`,
      hi: `${rainClauseHi}${gwClauseHi}`,
    },
    kvkReferenceNote: {
      en: `Grounded in ${taluka.kvkCenter.en} Bulletin (${taluka.kvkCitationCode}): For ${cropNameEn} on ${taluka.soilType.en}, maintain root-zone moisture at 40–45% via paired-row drip & organic trash mulching.`,
      mr: `${taluka.kvkCenter.mr} मार्गदर्शिका (${taluka.kvkCitationCode}): ${taluka.soilType.mr} जमिनीत ${cropNameMr} पिकासाठी जोड-ओळ ठिबक आणि सेंद्रिय आच्छादन (मल्चिंग) वापरून मुळाशी ४०-४५% ओलावा राखा.`,
      hi: `${taluka.kvkCenter.hi} दिशानिर्देश (${taluka.kvkCitationCode}): ${taluka.soilType.hi} मिट्टी में ${cropNameHi} के लिए जोड़ा-कतार ड्रिप और जैविक मल्चिंग द्वारा जड़ क्षेत्र में 40-45% नमी बनाए रखें।`,
    },
  };
}

/**
 * Formats concise, actionable SMS and WhatsApp vernacular notification payloads
 * tailored to the farmer's taluka, crop, and AI multi-source analysis.
 */
export function formatNotificationPayloads(
  taluka: TalukaRecord,
  advisory: IrrigationCalculationResult,
  diagnosticOverrideNote: string | null = null
): FormattedNotificationPayloads {
  const cropEn = CROP_NAMES[advisory.crop].en;
  const cropMr = CROP_NAMES[advisory.crop].mr;
  const cropHi = CROP_NAMES[advisory.crop].hi;

  const savedKL = (advisory.litersSavedPerCycle / 1000).toFixed(0);
  const targetKL = (advisory.optimizedLitersPerCycle / 1000).toFixed(0);

  const actionStep1En =
    advisory.delayDaysRecommended > 0
      ? `Wait ${advisory.delayDaysRecommended} days (${taluka.rainForecast7dMm}mm rain expected ${taluka.rainExpectedDay.en})`
      : `Irrigate in evening hours (${taluka.rainForecast7dMm}mm rain in 7d)`;
  const actionStep1Mr =
    advisory.delayDaysRecommended > 0
      ? `सिंचन ${advisory.delayDaysRecommended} दिवस थांबवा (${taluka.rainExpectedDay.mr} ${taluka.rainForecast7dMm} मिमी पाऊस)`
      : `संध्याकाळी पाणी द्या (७ दिवसांत ${taluka.rainForecast7dMm} मिमी पाऊस)`;
  const actionStep1Hi =
    advisory.delayDaysRecommended > 0
      ? `सिंचाई ${advisory.delayDaysRecommended} दिन टालें (${taluka.rainExpectedDay.hi} को ${taluka.rainForecast7dMm} मिमी बारिश)`
      : `शाम के समय सिंचाई करें (7 दिन में ${taluka.rainForecast7dMm} मिमी बारिश)`;

  const smsText: Record<Language, string> = {
    en: `JalMitra [${taluka.name.en}]: Soil moisture ${taluka.soilMoisturePct}%, GW -${taluka.groundwaterDepletionPct}%. ${actionStep1En}. Use Drip (${targetKL}k L) for ${cropEn}; save ${savedKL}k L. Ref:${taluka.kvkCitationCode}`,
    mr: `जलमित्र [${taluka.name.mr}]: ओलावा ${taluka.soilMoisturePct}%, भूजल -${taluka.groundwaterDepletionPct}%. ${actionStep1Mr}. ${cropMr} साठी ठिबकने ${targetKL}k L पाणी द्या; ${savedKL}k L वाचवा. (${taluka.kvkCitationCode})`,
    hi: `जलमित्र [${taluka.name.hi}]: नमी ${taluka.soilMoisturePct}%, भूजल -${taluka.groundwaterDepletionPct}%. ${actionStep1Hi}. ${cropHi} में ड्रिप से ${targetKL}k L पानी दें; ${savedKL}k L बचाएं. (${taluka.kvkCitationCode})`,
  };

  const diagLineEn = diagnosticOverrideNote ? `\n• Field Photo Alert: ${diagnosticOverrideNote}` : '';
  const diagLineMr = diagnosticOverrideNote ? `\n• पीक फोटो निदान: ${diagnosticOverrideNote}` : '';
  const diagLineHi = diagnosticOverrideNote ? `\n• फसल फोटो निदान: ${diagnosticOverrideNote}` : '';

  const whatsappText: Record<Language, string> = {
    en: `*JalMitra Irrigation Advisory — ${taluka.name.en}, ${taluka.district.en}*\n• Soil Moisture: ${taluka.soilMoisturePct}% | Water Table: ${taluka.groundwaterDepthMeters}m (-${taluka.groundwaterDepletionPct}%)\n• *Action 1*: ${actionStep1En}\n• *Action 2*: Apply ${targetKL},000 L via Drip for ${advisory.acres} ac ${cropEn} (Saves ${savedKL},000 L / cycle)\n• *KVK Tip*: ${taluka.kvkCenter.en} (${taluka.kvkCitationCode}) — Use organic straw mulch to retain root moisture.${diagLineEn}`,
    mr: `*जलमित्र सिंचन सल्ला — ${taluka.name.mr}, जि. ${taluka.district.mr}*\n• जमिनीतील ओलावा: ${taluka.soilMoisturePct}% | भूजल पातळी: ${taluka.groundwaterDepthMeters} मी. (-${taluka.groundwaterDepletionPct}%)\n• *कृती १*: ${actionStep1Mr}\n• *कृती २*: ${advisory.acres} एकर ${cropMr} पिकासाठी ठिबकने ${targetKL},००० लिटर पाणी द्या (बचत: ${savedKL},००० लिटर/पाळी)\n• *KVK सल्ला*: ${taluka.kvkCenter.mr} (${taluka.kvkCitationCode}) — बाष्पीभवन रोखण्यासाठी सेंद्रिय मल्चिंग करा.${diagLineMr}`,
    hi: `*जलमित्र सिंचाई सलाह — ${taluka.name.hi}, जिला ${taluka.district.hi}*\n• मिट्टी की नमी: ${taluka.soilMoisturePct}% | भूजल गहराई: ${taluka.groundwaterDepthMeters} मी. (-${taluka.groundwaterDepletionPct}%)\n• *कदम 1*: ${actionStep1Hi}\n• *कदम 2*: ${advisory.acres} एकड़ ${cropHi} में ड्रिप से ${targetKL},000 लीटर पानी दें (बचत: ${savedKL},000 लीटर/चक्र)\n• *KVK सलाह*: ${taluka.kvkCenter.hi} (${taluka.kvkCitationCode}) — जड़ों में नमी बनाए रखने हेतु जैविक मल्चिंग करें।${diagLineHi}`,
  };

  return {
    smsText,
    whatsappText,
    actionBullets: {
      en: [
        actionStep1En,
        `Drip target: ${targetKL},000 L for ${advisory.acres} ac ${cropEn} (Saves ${savedKL},000 L)`,
        `KVK Grounded: ${taluka.kvkCitationCode}`,
      ],
      mr: [
        actionStep1Mr,
        `ठिबक मात्रा: ${advisory.acres} एकर ${cropMr} साठी ${targetKL},००० लिटर (${savedKL},००० लिटर बचत)`,
        `KVK संदर्भ: ${taluka.kvkCitationCode}`,
      ],
      hi: [
        actionStep1Hi,
        `ड्रिप मात्रा: ${advisory.acres} एकड़ ${cropHi} हेतु ${targetKL},000 लीटर (${savedKL},000 लीटर बचत)`,
        `KVK संदर्भ: ${taluka.kvkCitationCode}`,
      ],
    },
  };
}

export function filterAndSortTalukas(
  talukas: TalukaRecord[],
  regionFilter: string,
  stressFilter: string,
  searchQuery: string
): TalukaRecord[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  return talukas.filter((t) => {
    if (regionFilter !== 'all' && t.Region !== regionFilter) {
      return false;
    }
    const stress = evaluateWaterStress(
      t.soilMoisturePct,
      t.groundwaterDepletionPct,
      t.rainForecast7dMm,
      t.ndviScore
    );
    if (stressFilter !== 'all' && stress.level !== stressFilter) {
      return false;
    }
    if (normalizedQuery.length > 0) {
      const matchEn =
        t.name.en.toLowerCase().includes(normalizedQuery) ||
        t.district.en.toLowerCase().includes(normalizedQuery);
      const matchMr =
        t.name.mr.includes(normalizedQuery) || t.district.mr.includes(normalizedQuery);
      const matchHi =
        t.name.hi.includes(normalizedQuery) || t.district.hi.includes(normalizedQuery);
      return matchEn || matchMr || matchHi;
    }
    return true;
  });
}

export interface VillageBudgetSummary {
  dailyDeficitMld: number;
  demandToSupplyRatioPct: number;
  projectedSavingsMldWithDrip: number;
  postInterventionBalanceMld: number;
  resilienceStatus: 'surplus' | 'balanced' | 'deficit';
}

export function calculateVillageWaterBudget(
  taluka: TalukaRecord,
  dripAdoptionTargetPct: number
): VillageBudgetSummary {
  const safeTarget = Math.max(10, Math.min(95, dripAdoptionTargetPct));
  const dailyDeficitMld = Number((taluka.villageDemandMld - taluka.rechargeCapacityMld).toFixed(2));
  const demandToSupplyRatioPct = Math.round(
    (taluka.villageDemandMld / Math.max(0.1, taluka.rechargeCapacityMld)) * 100
  );
  const reductionFraction = (safeTarget / 100) * 0.44;
  const projectedSavingsMldWithDrip = Number((taluka.villageDemandMld * reductionFraction).toFixed(2));
  const newDemand = taluka.villageDemandMld - projectedSavingsMldWithDrip;
  const postInterventionBalanceMld = Number((taluka.rechargeCapacityMld - newDemand).toFixed(2));

  let resilienceStatus: 'surplus' | 'balanced' | 'deficit' = 'deficit';
  if (postInterventionBalanceMld >= 0.4) {
    resilienceStatus = 'surplus';
  } else if (postInterventionBalanceMld >= -0.2) {
    resilienceStatus = 'balanced';
  }

  return {
    dailyDeficitMld,
    demandToSupplyRatioPct,
    projectedSavingsMldWithDrip,
    postInterventionBalanceMld,
    resilienceStatus,
  };
}

export interface HighPriorityTalukaAlert {
  id: string;
  talukaId: string;
  alertType: 'drought' | 'weather' | 'combined';
  stressLevel: StressLevel;
  accentHex: string;
  bgHex: string;
  borderHex: string;
  badgeText: Record<Language, string>;
  title: Record<Language, string>;
  message: Record<Language, string>;
  metricChip: Record<Language, string>;
}

/**
 * Evaluates whether a selected taluka has an incoming high-priority IMD weather
 * event or CGWB/Bhuvan drought alert when the user interacts with the heatmap.
 */
export function evaluateTalukaHighPriorityAlert(
  taluka: TalukaRecord
): HighPriorityTalukaAlert | null {
  const stress = evaluateWaterStress(
    taluka.soilMoisturePct,
    taluka.groundwaterDepletionPct,
    taluka.rainForecast7dMm,
    taluka.ndviScore
  );

  const hasSevereDrought =
    stress.level === 'critical' ||
    stress.level === 'high' ||
    taluka.groundwaterDepletionPct >= 11 ||
    taluka.soilMoisturePct <= 25;

  const hasModerateDrought =
    stress.level === 'moderate' || taluka.groundwaterDepletionPct >= 8.5;

  const hasIncomingRainWindow = taluka.rainForecast7dMm >= 16;

  if (hasSevereDrought && hasIncomingRainWindow) {
    return {
      id: `alert-combined-${taluka.id}`,
      talukaId: taluka.id,
      alertType: 'combined',
      stressLevel: stress.level,
      accentHex: '#e07a2a',
      bgHex: '#182218',
      borderHex: '#d3b44a',
      badgeText: {
        en: 'HIGH-PRIORITY DROUGHT + IMD RAIN ALERT',
        mr: 'तीव्र पाणी टंचाई + IMD पाऊस पूर्वसूचना',
        hi: 'उच्च सूखा संकट + IMD बारिश अलर्ट',
      },
      title: {
        en: `${taluka.name.en} (${taluka.district.en}): Groundwater -${taluka.groundwaterDepletionPct}% · ${taluka.rainForecast7dMm}mm Rain ${taluka.rainExpectedDay.en}`,
        mr: `${taluka.name.mr} (${taluka.district.mr}): भूजल -${taluka.groundwaterDepletionPct}% · ${taluka.rainExpectedDay.mr} ${taluka.rainForecast7dMm} मिमी पाऊस`,
        hi: `${taluka.name.hi} (${taluka.district.hi}): भूजल -${taluka.groundwaterDepletionPct}% · ${taluka.rainExpectedDay.hi} को ${taluka.rainForecast7dMm} मिमी बारिश`,
      },
      message: {
        en: `Root moisture is critically low (${taluka.soilMoisturePct}%), but IMD forecasts ${taluka.rainForecast7dMm}mm rain on ${taluka.rainExpectedDay.en}. Delay flood pumping 3 days & use pulse drip.`,
        mr: `मातीतील ओलावा अत्यंत कमी (${taluka.soilMoisturePct}%) आहे, पण ${taluka.rainExpectedDay.mr} ${taluka.rainForecast7dMm} मिमी पाऊस अपेक्षित आहे. सिंचन ३ दिवस थांबवा व ठिबक वापरा.`,
        hi: `मिट्टी की नमी कम (${taluka.soilMoisturePct}%) है, पर ${taluka.rainExpectedDay.hi} को ${taluka.rainForecast7dMm} मिमी बारिश संभावित है। सिंचाई 3 दिन टालें और ड्रिप अपनाएं।`,
      },
      metricChip: {
        en: `${taluka.droughtLeadDays}d Drought Lead · ${taluka.rainForecast7dMm}mm IMD`,
        mr: `${taluka.droughtLeadDays} दिवस पूर्वसूचना · ${taluka.rainForecast7dMm} मिमी पाऊस`,
        hi: `${taluka.droughtLeadDays} दिन पूर्व-चेतावनी · ${taluka.rainForecast7dMm} मिमी बारिश`,
      },
    };
  }

  if (hasSevereDrought) {
    const isCritical = stress.level === 'critical';
    return {
      id: `alert-drought-${taluka.id}`,
      talukaId: taluka.id,
      alertType: 'drought',
      stressLevel: stress.level,
      accentHex: isCritical ? '#c92a2a' : '#e07a2a',
      bgHex: '#182218',
      borderHex: isCritical ? '#c92a2a' : '#e07a2a',
      badgeText: {
        en: isCritical ? 'CRITICAL DROUGHT DEPLETION ALERT' : 'HIGH WATER STRESS ALERT',
        mr: isCritical ? 'अति-तीव्र दुष्काळ व भूजल इशारा' : 'तीव्र पाणी टंचाई धोक्याची सूचना',
        hi: isCritical ? 'गंभीर सूखा एवं भूजल संकट अलर्ट' : 'उच्च जल तनाव चेतावनी',
      },
      title: {
        en: `${taluka.name.en} (${taluka.district.en}): Soil Moisture ${taluka.soilMoisturePct}% · Aquifer -${taluka.groundwaterDepletionPct}%`,
        mr: `${taluka.name.mr} (${taluka.district.mr}): जमिनीतील ओलावा ${taluka.soilMoisturePct}% · भूजल घट -${taluka.groundwaterDepletionPct}%`,
        hi: `${taluka.name.hi} (${taluka.district.hi}): मिट्टी की नमी ${taluka.soilMoisturePct}% · भूजल गिरावट -${taluka.groundwaterDepletionPct}%`,
      },
      message: {
        en: `Low 7-day rain (${taluka.rainForecast7dMm}mm) with water table at ${taluka.groundwaterDepthMeters}m. Switch immediately to protective pulse drip & mulch to prevent crop wilt.`,
        mr: `पुढील ७ दिवसांत कमी पाऊस (${taluka.rainForecast7dMm} मिमी) व भूजल पातळी ${taluka.groundwaterDepthMeters} मीटरवर. पीक वाचवण्यासाठी तातडीने संरक्षित ठिबक व मल्चिंग करा.`,
        hi: `अगले 7 दिनों में कम बारिश (${taluka.rainForecast7dMm} मिमी) और भूजल ${taluka.groundwaterDepthMeters} मीटर गहरा। फसल बचाने हेतु तुरंत संरक्षित ड्रिप और मल्चिंग करें।`,
      },
      metricChip: {
        en: `Score ${stress.score}/100 · ${taluka.droughtLeadDays}d Early Warning`,
        mr: `ताण निर्देशांक ${stress.score}/100 · ${taluka.droughtLeadDays} दिवस आधी इशारा`,
        hi: `तनाव सूचकांक ${stress.score}/100 · ${taluka.droughtLeadDays} दिन पूर्व चेतावनी`,
      },
    };
  }

  if (hasIncomingRainWindow) {
    return {
      id: `alert-weather-${taluka.id}`,
      talukaId: taluka.id,
      alertType: 'weather',
      stressLevel: stress.level,
      accentHex: '#06ce06',
      bgHex: '#182218',
      borderHex: '#06ce06',
      badgeText: {
        en: 'IMD MONSOON SPELL ADVISORY',
        mr: 'IMD मान्सून पाऊस पूर्वसूचना',
        hi: 'IMD मानसून बारिश अलर्ट',
      },
      title: {
        en: `${taluka.name.en} (${taluka.district.en}): ${taluka.rainForecast7dMm}mm Rain Expected ${taluka.rainExpectedDay.en}`,
        mr: `${taluka.name.mr} (${taluka.district.mr}): ${taluka.rainExpectedDay.mr} ${taluka.rainForecast7dMm} मिमी पावसाचा अंदाज`,
        hi: `${taluka.name.hi} (${taluka.district.hi}): ${taluka.rainExpectedDay.hi} को ${taluka.rainForecast7dMm} मिमी बारिश की संभावना`,
      },
      message: {
        en: `Incoming IMD wet spell (${taluka.rainForecast7dMm}mm over 7 days). Pause borewell pumping for 3–4 days to conserve groundwater and avoid root waterlogging.`,
        mr: `पुढील ७ दिवसांत ${taluka.rainForecast7dMm} मिमी पाऊस अपेक्षित आहे. भूजल वाचवण्यासाठी ३-४ दिवस बोअरवेल उपसा बंद ठेवा.`,
        hi: `अगले 7 दिनों में ${taluka.rainForecast7dMm} मिमी बारिश का अनुमान है। भूजल बचाने के लिए 3-4 दिन बोरवेल पंपिंग रोकें।`,
      },
      metricChip: {
        en: `IMD +${taluka.rainForecast7dMm}mm · Pause Irrigation`,
        mr: `IMD +${taluka.rainForecast7dMm} मिमी · सिंचन थांबवा`,
        hi: `IMD +${taluka.rainForecast7dMm} मिमी · सिंचाई टालें`,
      },
    };
  }

  if (hasModerateDrought) {
    return {
      id: `alert-mod-drought-${taluka.id}`,
      talukaId: taluka.id,
      alertType: 'drought',
      stressLevel: stress.level,
      accentHex: '#d3b44a',
      bgHex: '#182218',
      borderHex: '#d3b44a',
      badgeText: {
        en: 'MODERATE DROUGHT WATCH',
        mr: 'मध्यम पाणी ताण सतर्कता',
        hi: 'मध्यम सूखा निगरानी अलर्ट',
      },
      title: {
        en: `${taluka.name.en} (${taluka.district.en}): Moisture ${taluka.soilMoisturePct}% · GW Drop -${taluka.groundwaterDepletionPct}%`,
        mr: `${taluka.name.mr} (${taluka.district.mr}): ओलावा ${taluka.soilMoisturePct}% · भूजल घट -${taluka.groundwaterDepletionPct}%`,
        hi: `${taluka.name.hi} (${taluka.district.hi}): नमी ${taluka.soilMoisturePct}% · भूजल गिरावट -${taluka.groundwaterDepletionPct}%`,
      },
      message: {
        en: `Aquifer drawdown is accelerating (-${taluka.groundwaterDepletionPct}%/mo). Irrigate during evening hours only and align watering with ${taluka.rainExpectedDay.en}'s ${taluka.rainForecast7dMm}mm forecast.`,
        mr: `भूजल पातळीत मासिक -${taluka.groundwaterDepletionPct}% घट होत आहे. केवळ संध्याकाळी सिंचन करा व ${taluka.rainExpectedDay.mr}च्या पावसाचा अंदाज पाळा.`,
        hi: `भूजल स्तर में -${taluka.groundwaterDepletionPct}% मासिक गिरावट है। केवल शाम को सिंचाई करें और ${taluka.rainExpectedDay.hi} की बारिश का लाभ लें।`,
      },
      metricChip: {
        en: `Stress ${stress.score}/100 · Evening Drip`,
        mr: `ताण ${stress.score}/100 · संध्याकाळी ठिबक`,
        hi: `तनाव ${stress.score}/100 · शाम को ड्रिप`,
      },
    };
  }

  return null;
}

export interface AquiferTrajectoryPoint {
  monthIndex: number;
  monthLabel: string;
  baselineDepthM: number;
  conservedDepthM: number;
  waterTableSavedM: number;
}

const AQUIFER_MONTH_LABELS: Record<Language, string[]> = {
  en: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
  mr: ['जून', 'जुलै', 'ऑगस्ट', 'सप्टें', 'ऑक्टो', 'नोव्हें'],
  hi: ['जून', 'जुलाई', 'अगस्त', 'सितं', 'अक्टू', 'नवं'],
};

/**
 * Builds the 6-month historical groundwater depletion series (depth in meters below ground level)
 * for Recharts line visualization, comparing unmitigated borewell drawdown against
 * JalMitra micro-irrigation conservation.
 */
export function buildAquiferTrajectorySeries(
  taluka: TalukaRecord,
  dripAdoptionTargetPct: number,
  lang: Language
): AquiferTrajectoryPoint[] {
  const safeAdoption = Math.max(10, Math.min(95, dripAdoptionTargetPct));
  const labels = AQUIFER_MONTH_LABELS[lang];

  return taluka.aquiferTrend6m.map((depthM, idx) => {
    const conservedDepthM = Number(
      Math.max(4.5, depthM - (idx + 1) * (safeAdoption / 100) * 0.85).toFixed(1)
    );
    const waterTableSavedM = Number(Math.max(0, depthM - conservedDepthM).toFixed(1));

    return {
      monthIndex: idx,
      monthLabel: labels[idx] || `M${idx + 1}`,
      baselineDepthM: Number(depthM.toFixed(1)),
      conservedDepthM,
      waterTableSavedM,
    };
  });
}

export interface MonsoonCountdownStatus {
  region: TalukaRecord['Region'];
  regionLabel: Record<Language, string>;
  talukaName: Record<Language, string>;
  districtName: Record<Language, string>;
  daysLeft: number;
  hoursLeft: number;
  minutesLeft: number;
  secondsLeft: number;
  expectedOnsetRainMm: number;
  imdConfidencePct: number;
  expectedWindowLabel: Record<Language, string>;
  preMonsoonAction: Record<Language, string>;
  progressPct: number;
}

const REGION_MONSOON_PROFILES: Record<
  TalukaRecord['Region'],
  {
    baseDays: number;
    baseHoursOffset: number;
    confidencePct: number;
    regionLabel: Record<Language, string>;
    preMonsoonAction: Record<Language, string>;
  }
> = {
  Marathwada: {
    baseDays: 3,
    baseHoursOffset: 14,
    confidencePct: 91,
    regionLabel: {
      en: 'Marathwada (Godavari-Manjara Basin)',
      mr: 'मराठवाडा (गोदावरी-मांजरा खोरे)',
      hi: 'मराठवाड़ा (गोदावरी-मांजरा बेसिन)',
    },
    preMonsoonAction: {
      en: 'Delay flood irrigation 3 days; clear farm-pond inlet trenches before Thursday spell',
      mr: 'पाटाने पाणी देणे ३ दिवस थांबवा; गुरुवारच्या पावसापूर्वी शेततळ्याचे चर मोकळे करा',
      hi: 'बाढ़ सिंचाई 3 दिन टालें; गुरुवार की बारिश से पहले खेत तालाब की नालियां साफ करें',
    },
  },
  Vidarbha: {
    baseDays: 2,
    baseHoursOffset: 9,
    confidencePct: 94,
    regionLabel: {
      en: 'Vidarbha (Purna-Wardha Basin)',
      mr: 'विदर्भ (पूर्णा-वर्धा खोरे)',
      hi: 'विदर्भ (पूर्णा-वर्धा बेसिन)',
    },
    preMonsoonAction: {
      en: 'Pause borewell extraction; prepare broad-bed furrow (BBF) drainage for cotton & tur',
      mr: 'बोअरवेल उपसा थांबवा; कापूस व तुरीसाठी रुंद सरी-वरंबा (BBF) निचरा तयार ठेवा',
      hi: 'बोरवेल पंपिंग रोकें; कपास और तूर के लिए चौड़ी क्यारी-नाली (BBF) जल निकासी तैयार रखें',
    },
  },
  'Western Maharashtra': {
    baseDays: 5,
    baseHoursOffset: 18,
    confidencePct: 86,
    regionLabel: {
      en: 'Western Maharashtra (Bhima-Krishna)',
      mr: 'पश्चिम महाराष्ट्र (भीमा-कृष्णा खोरे)',
      hi: 'पश्चिम महाराष्ट्र (भीमा-कृष्णा बेसिन)',
    },
    preMonsoonAction: {
      en: 'Rain-shadow delay expected; maintain evening pulse drip & organic trash mulching',
      mr: 'पावसाला ५ दिवस अवकाश; संध्याकाळी संरक्षित ठिबक व सेंद्रिय मल्चिंग सुरू ठेवा',
      hi: 'बारिश में 5 दिन शेष; शाम को संरक्षित ड्रिप और जैविक मल्चिंग जारी रखें',
    },
  },
  Khandesh: {
    baseDays: 4,
    baseHoursOffset: 11,
    confidencePct: 89,
    regionLabel: {
      en: 'Khandesh (Tapi-Girna Basin)',
      mr: 'खानदेश (तापी-गिरणा खोरे)',
      hi: 'खानदेश (तापी-गिरणा बेसिन)',
    },
    preMonsoonAction: {
      en: 'Moderate Tapi-basin trough approaching; reduce drip cycle duration by 35%',
      mr: 'तापी खोऱ्यात ४ दिवसांत पाऊस अपेक्षित; ठिबक सिंचनाचा कालावधी ३५% कमी करा',
      hi: 'तापी बेसिन में 4 दिन में बारिश संभावित; ड्रिप सिंचाई का समय 35% घटाएं',
    },
  },
};

/**
 * Calculates the real-time Monsoon / Relief Onset countdown for the selected region and taluka.
 */
export function calculateMonsoonArrivalCountdown(
  taluka: TalukaRecord,
  elapsedSeconds: number = 0
): MonsoonCountdownStatus {
  const profile = REGION_MONSOON_PROFILES[taluka.Region];

  // Combine regional base onset lead time with taluka-specific rainfall intensity adjustment
  const talukaDayModifier =
    taluka.rainForecast7dMm >= 28 ? -1 : taluka.rainForecast7dMm <= 6 ? 2 : 0;
  const initialDays = Math.max(1, profile.baseDays + talukaDayModifier);

  const totalInitialSeconds =
    initialDays * 86400 + profile.baseHoursOffset * 3600 + 27 * 60 + 45;
  const remainingTotalSeconds = Math.max(
    60,
    totalInitialSeconds - Math.max(0, Math.floor(elapsedSeconds))
  );

  const daysLeft = Math.floor(remainingTotalSeconds / 86400);
  const hoursLeft = Math.floor((remainingTotalSeconds % 86400) / 3600);
  const minutesLeft = Math.floor((remainingTotalSeconds % 3600) / 60);
  const secondsLeft = remainingTotalSeconds % 60;

  const progressPct = Math.min(
    96,
    Math.max(12, Math.round(((10 - daysLeft) / 10) * 100))
  );

  return {
    region: taluka.Region,
    regionLabel: profile.regionLabel,
    talukaName: taluka.name,
    districtName: taluka.district,
    daysLeft,
    hoursLeft,
    minutesLeft,
    secondsLeft,
    expectedOnsetRainMm: Math.max(12, taluka.rainForecast7dMm),
    imdConfidencePct: profile.confidencePct,
    expectedWindowLabel: taluka.rainExpectedDay,
    preMonsoonAction: profile.preMonsoonAction,
    progressPct,
  };
}

export type AgriculturalSeason = 'kharif' | 'rabi' | 'perennial';

export type CropStageType =
  | 'sowing'
  | 'vegetative'
  | 'critical-irrigation'
  | 'harvest'
  | 'fallow';

export interface MonthlyRainfallBucket {
  monthIndex: number;
  monthShort: string;
  predictedRainMm: number;
  isMonsoonCore: boolean;
}

export interface CropCalendarRow {
  crop: CropType;
  cropName: Record<Language, string>;
  season: AgriculturalSeason;
  seasonBadge: Record<Language, string>;
  monthlyStages: CropStageType[]; // 12 months: Jun (0) through May (11)
  sowingWindowText: Record<Language, string>;
  harvestWindowText: Record<Language, string>;
  criticalMoistureStage: Record<Language, string>;
  kvkRecommendedVariety: Record<Language, string>;
  rainfallAlignmentNote: Record<Language, string>;
  waterRequirementMm: number;
}

export interface CropClimateCalendarData {
  talukaId: string;
  region: TalukaRecord['Region'];
  annualExpectedRainMm: number;
  months: MonthlyRainfallBucket[];
  crops: CropCalendarRow[];
}

const CALENDAR_MONTH_LABELS: Record<Language, string[]> = {
  en: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
  mr: ['जून', 'जुलै', 'ऑग', 'सप्टें', 'ऑक्टो', 'नोव्हें', 'डिसें', 'जाने', 'फेब्रु', 'मार्च', 'एप्रि', 'मे'],
  hi: ['जून', 'जुला', 'अग', 'सितं', 'अक्टू', 'नवं', 'दिसं', 'जन', 'फ़र', 'मार्च', 'अप्रै', 'मई'],
};

const REGIONAL_MONTHLY_BASE_RAIN_MM: Record<TalukaRecord['Region'], number[]> = {
  // Jun, Jul, Aug, Sep, Oct, Nov, Dec, Jan, Feb, Mar, Apr, May
  Marathwada: [115, 165, 155, 175, 68, 22, 8, 5, 4, 7, 11, 18],
  Vidarbha: [145, 255, 230, 165, 58, 18, 10, 8, 9, 12, 14, 16],
  'Western Maharashtra': [98, 130, 115, 145, 82, 28, 9, 4, 3, 6, 15, 24],
  Khandesh: [120, 195, 175, 140, 52, 16, 6, 4, 3, 5, 8, 14],
};

/**
 * Generates the 12-month (Jun–May) seasonal Crop-Climate Calendar mapping sowing,
 * vegetative growth, critical irrigation, and harvest windows against predicted local
 * rainfall patterns for the selected taluka.
 */
export function buildCropClimateCalendarData(
  taluka: TalukaRecord,
  seasonFilter: AgriculturalSeason | 'all',
  lang: Language
): CropClimateCalendarData {
  const baseRain = REGIONAL_MONTHLY_BASE_RAIN_MM[taluka.Region];
  const labels = CALENDAR_MONTH_LABELS[lang];

  // Modulate local rainfall pattern slightly using the taluka's active moisture & 7d forecast
  const localScale = Math.max(
    0.78,
    Math.min(1.22, 0.85 + taluka.rainForecast7dMm * 0.008 + (taluka.soilMoisturePct - 25) * 0.003)
  );

  const months: MonthlyRainfallBucket[] = baseRain.map((mm, idx) => {
    const predictedRainMm = Math.round(mm * localScale);
    return {
      monthIndex: idx,
      monthShort: labels[idx],
      predictedRainMm,
      isMonsoonCore: idx >= 0 && idx <= 3,
    };
  });

  const annualExpectedRainMm = months.reduce((sum, m) => sum + m.predictedRainMm, 0);

  const isDryTaluka = taluka.soilMoisturePct <= 26 || taluka.groundwaterDepletionPct >= 11;

  const allCrops: CropCalendarRow[] = [
    {
      crop: 'soybean',
      cropName: CROP_NAMES.soybean,
      season: 'kharif',
      seasonBadge: { en: 'Kharif (Monsoon)', mr: 'खरीप हंगाम', hi: 'खरीफ सीजन' },
      // Jun: sowing, Jul-Aug: vegetative, Sep: critical-irrigation (pod filling), Oct: harvest
      monthlyStages: [
        'sowing',
        'vegetative',
        'vegetative',
        'critical-irrigation',
        'harvest',
        'fallow',
        'fallow',
        'fallow',
        'fallow',
        'fallow',
        'fallow',
        'fallow',
      ],
      sowingWindowText: {
        en: 'Jun 15 – Jul 07 (After 75–100mm cumulative monsoon rain)',
        mr: '१५ जून – ०७ जुलै (७५–१०० मिमी पाऊस झाल्यानंतर पेरणी)',
        hi: '15 जून – 07 जुलाई (75–100 मिमी मानसून बारिश के बाद बुवाई)',
      },
      harvestWindowText: {
        en: 'Oct 01 – Oct 20 (95–105 days maturity)',
        mr: '०१ ऑक्टोबर – २० ऑक्टोबर (९५–१०५ दिवसांत काढणी)',
        hi: '01 अक्टूबर – 20 अक्टूबर (95–105 दिन में कटाई)',
      },
      criticalMoistureStage: {
        en: 'September Pod-Filling Stage (Apply 1 protective sprinkler/drip pulse if dry spell > 12 days)',
        mr: 'सप्टेंबर शेंगा भरण्याची अवस्था (१२ दिवसांचा खंड पडल्यास संरक्षित तुषार/ठिबक पाणी द्या)',
        hi: 'सितंबर फली बनने की अवस्था (12 दिन सूखा रहने पर 1 संरक्षित ड्रिप/फव्वारा सिंचाई करें)',
      },
      kvkRecommendedVariety: {
        en: 'MAUS-158 / JS-9305 (KVK Drought-Resilient Broad-Bed Furrow)',
        mr: 'MAUS-158 / फुले संगम (रुंद सरी-वरंबा BBF पद्धत)',
        hi: 'MAUS-158 / JS-9305 (चौड़ी क्यारी-नाली BBF पद्धति)',
      },
      rainfallAlignmentNote: {
        en: isDryTaluka
          ? `In ${taluka.name.en}, wait for 85mm soil-wetting rain in June before sowing; use BBF ridges to conserve 28% runoff.`
          : `Well-aligned with ${taluka.name.en}'s Jul–Sep monsoon peak (${months[1].predictedRainMm}–${months[3].predictedRainMm}mm/mo).`,
        mr: isDryTaluka
          ? `${taluka.name.mr} मध्ये जूनमध्ये ८५ मिमी ओलाव्याचा पाऊस झाल्याशिवाय पेरणी करू नका; BBF पद्धतीने २८% पाणी वाचवा.`
          : `${taluka.name.mr} मधील जुलै–सप्टेंबर मान्सून पावसाशी (${months[1].predictedRainMm}–${months[3].predictedRainMm} मिमी) उत्तम जुळणी.`,
        hi: isDryTaluka
          ? `${taluka.name.hi} में जून में 85 मिमी बारिश के बाद ही बुवाई करें; BBF पद्धति से 28% नमी बचाएं।`
          : `${taluka.name.hi} के जुलाई–सितंबर मानसून (${months[1].predictedRainMm}–${months[3].predictedRainMm} मिमी) के अनुकूल।`,
      },
      waterRequirementMm: 450,
    },
    {
      crop: 'cotton',
      cropName: CROP_NAMES.cotton,
      season: 'kharif',
      seasonBadge: { en: 'Kharif Long-Duration', mr: 'खरीप (दीर्घ मुदत)', hi: 'खरीफ (लंबी अवधि)' },
      // Jun: sowing, Jul-Aug: vegetative, Sep-Oct: critical-irrigation, Nov-Dec: harvest
      monthlyStages: [
        'sowing',
        'vegetative',
        'vegetative',
        'critical-irrigation',
        'critical-irrigation',
        'harvest',
        'harvest',
        'fallow',
        'fallow',
        'fallow',
        'fallow',
        'fallow',
      ],
      sowingWindowText: {
        en: 'Jun 10 – Jun 30 (Pre-monsoon drip or onset rain)',
        mr: '१० जून – ३० जून (पूर्व-मान्सून ठिबक किंवा पहिल्या पावसात)',
        hi: '10 जून – 30 जून (प्री-मानसून ड्रिप या पहली बारिश पर)',
      },
      harvestWindowText: {
        en: 'Nov 05 – Dec 25 (2 Pickings; avoid late ratoon extensions)',
        mr: '०५ नोव्हेंबर – २५ डिसेंबर (२ वेचण्या; फरदड कापूस टाळा)',
        hi: '05 नवंबर – 25 दिसंबर (2 चुनाई; देर तक फसल न खींचें)',
      },
      criticalMoistureStage: {
        en: 'Sep–Oct Square & Boll Formation (Critical paired-row drip needed as monsoon retreats)',
        mr: 'सप्टेंबर–ऑक्टोबर पाते व बोंडे लागण्याची अवस्था (परतीच्या पावसात जोड-ओळ ठिबक आवश्यक)',
        hi: 'सितंबर–अक्टूबर टिंडे बनने की अवस्था (मानसून वापसी पर जोड़ा-कतार ड्रिप आवश्यक)',
      },
      kvkRecommendedVariety: {
        en: 'PDKV High-Density Bt / NH-615 with Organic Trash Mulch',
        mr: 'PDKV अति-घनता लागवड / NH-615 सेंद्रिय आच्छादनासह',
        hi: 'PDKV सघन बागवानी / NH-615 जैविक मल्चिंग सहित',
      },
      rainfallAlignmentNote: {
        en: `October rainfall drops to ${months[4].predictedRainMm}mm in ${taluka.name.en} — pulse drip during boll development prevents 35% boll shedding.`,
        mr: `${taluka.name.mr} मध्ये ऑक्टोबर पाऊस ${months[4].predictedRainMm} मिमी वर येतो — बोंडे भरताना ठिबक दिल्यास ३५% गळ थांबते.`,
        hi: `${taluka.name.hi} में अक्टूबर में बारिश घटकर ${months[4].predictedRainMm} मिमी रहती है — टिंडे बनते समय ड्रिप से 35% झड़न रुकती है।`,
      },
      waterRequirementMm: 680,
    },
    {
      crop: 'tur',
      cropName: CROP_NAMES.tur,
      season: 'kharif',
      seasonBadge: { en: 'Kharif Pulse', mr: 'खरीप कडधान्य', hi: 'खरीफ दलहन' },
      // Jun: sowing, Jul-Sep: vegetative, Oct-Nov: critical-irrigation, Dec-Jan: harvest
      monthlyStages: [
        'sowing',
        'vegetative',
        'vegetative',
        'vegetative',
        'critical-irrigation',
        'critical-irrigation',
        'harvest',
        'harvest',
        'fallow',
        'fallow',
        'fallow',
        'fallow',
      ],
      sowingWindowText: {
        en: 'Jun 15 – Jul 10 (Intercrop 4:1 with Soybean)',
        mr: '१५ जून – १० जुलै (सोयाबीनमध्ये ४:१ आंतरपीक)',
        hi: '15 जून – 10 जुलाई (सोयाबीन के साथ 4:1 अंतर-फसल)',
      },
      harvestWindowText: {
        en: 'Dec 15 – Jan 15 (Medium-duration wilt-resistant)',
        mr: '१५ डिसेंबर – १५ जानेवारी (मध्यम मुदत मर-रोग प्रतिकारक)',
        hi: '15 दिसंबर – 15 जनवरी (मध्यम अवधि उकठा-रोधी)',
      },
      criticalMoistureStage: {
        en: 'Oct–Nov Flowering & Pod Development (1 life-saving 40mm drip/furrow irrigation boosts yield 32%)',
        mr: 'ऑक्टोबर–नोव्हेंबर फुलोरा व शेंगा अवस्था (१ संरक्षित पाणी दिल्यास उत्पादनात ३२% वाढ)',
        hi: 'अक्टूबर–नवंबर फूल और फली अवस्था (1 जीवनरक्षक सिंचाई से उपज में 32% वृद्धि)',
      },
      kvkRecommendedVariety: {
        en: 'BDN-711 / Phule Rajeshwari (Low-Moisture Resilient)',
        mr: 'BDN-711 / फुले राजेश्वरी (कमी पाण्यात येणारी जात)',
        hi: 'BDN-711 / फुले राजेश्वरी (कम पानी में अधिक उत्पादन)',
      },
      rainfallAlignmentNote: {
        en: `Deep taproot utilizes Sep monsoon moisture (${months[3].predictedRainMm}mm); needs only 1 supplemental watering in November.`,
        mr: `खोल मुळांमुळे सप्टेंबरमधील (${months[3].predictedRainMm} मिमी) ओलावा वापरला जातो; नोव्हेंबरमध्ये फक्त १ संरक्षित पाण्याची गरज.`,
        hi: `गहरी जड़ें सितंबर की नमी (${months[3].predictedRainMm} मिमी) का उपयोग करती हैं; नवंबर में केवल 1 सिंचाई पर्याप्त है।`,
      },
      waterRequirementMm: 390,
    },
    {
      crop: 'onion',
      cropName: CROP_NAMES.onion,
      season: 'rabi',
      seasonBadge: { en: 'Rabi / Late Kharif', mr: 'रब्बी / रांगडा कांदा', hi: 'रबी / पछेती खरीफ' },
      // Oct-Nov: sowing (nursery/transplant), Dec-Jan: vegetative, Feb: critical-irrigation (bulb), Mar-Apr: harvest
      monthlyStages: [
        'fallow',
        'fallow',
        'fallow',
        'fallow',
        'sowing',
        'sowing',
        'vegetative',
        'vegetative',
        'critical-irrigation',
        'harvest',
        'harvest',
        'fallow',
      ],
      sowingWindowText: {
        en: 'Oct 15 – Nov 25 (Rabi nursery & raised-bed transplanting)',
        mr: '१५ ऑक्टोबर – २५ नोव्हेंबर (रब्बी रोपवाटिका व गादीवाफा लागवड)',
        hi: '15 अक्टूबर – 25 नवंबर (रबी नर्सरी एवं उठी क्यारी रोपाई)',
      },
      harvestWindowText: {
        en: 'Mar 15 – Apr 25 (Stop irrigation 15 days before neck-fall)',
        mr: '१५ मार्च – २५ एप्रिल (काढणीपूर्वी १५ दिवस पाणी बंद करा)',
        hi: '15 मार्च – 25 अप्रैल (कटाई से 15 दिन पूर्व सिंचाई बंद करें)',
      },
      criticalMoistureStage: {
        en: 'Jan–Feb Bulb Enlargement (Shallow roots require frequent 4-day micro-drip intervals)',
        mr: 'जानेवारी–फेब्रुवारी कांदा पोसण्याची अवस्था (४ दिवसांच्या अंतराने सूक्ष्म ठिबक किंवा तुषार)',
        hi: 'जनवरी–फ़रवरी कंद बनने की अवस्था (4 दिन के अंतराल पर सूक्ष्म ड्रिप या फव्वारा)',
      },
      kvkRecommendedVariety: {
        en: 'Bhima Shakti / NHRDF Red (High-Storage Rabi)',
        mr: 'भीमा शक्ती / फुले समर्थ (साठवणुकीस उत्तम रब्बी जात)',
        hi: 'भीमा शक्ति / NHRDF रेड (उच्च भंडारण क्षमता)',
      },
      rainfallAlignmentNote: {
        en: `Grown on post-monsoon stored aquifer water in ${taluka.name.en}; raised-bed drip cuts borewell extraction by 44%.`,
        mr: `${taluka.name.mr} मध्ये साठवलेल्या भूजलावर आधारित पीक; गादीवाफा ठिबकमुळे ४४% बोअरवेल पाणी वाचते.`,
        hi: `${taluka.name.hi} में मानसून-पश्चात संचित भूजल पर आधारित; उठी क्यारी ड्रिप से 44% पानी बचता है।`,
      },
      waterRequirementMm: 520,
    },
    {
      crop: 'pomegranate',
      cropName: CROP_NAMES.pomegranate,
      season: 'perennial',
      seasonBadge: { en: 'Horticulture (Bahar)', mr: 'फळबाग (मृग/आंबे बहार)', hi: 'बागवानी (बहार)' },
      // Jun: sowing (bahar pruning), Jul-Sep: vegetative, Oct-Nov: critical-irrigation (fruit), Dec-Feb: harvest
      monthlyStages: [
        'sowing',
        'vegetative',
        'vegetative',
        'vegetative',
        'critical-irrigation',
        'critical-irrigation',
        'harvest',
        'harvest',
        'fallow',
        'fallow',
        'fallow',
        'fallow',
      ],
      sowingWindowText: {
        en: 'Jun 01 – Jul 15 (Mrig Bahar defoliation) or Jan (Ambe Bahar)',
        mr: '०१ जून – १५ जुलै (मृग बहार ताण व छाटणी) किंवा जानेवारी (आंबे बहार)',
        hi: '01 जून – 15 जुलाई (मृग बहार छंटाई) या जनवरी (अंबे बहार)',
      },
      harvestWindowText: {
        en: 'Dec 10 – Feb 15 (135–150 days from flowering)',
        mr: '१० डिसेंबर – १५ फेब्रुवारी (फुलोऱ्यापासून १३५–१५० दिवस)',
        hi: '10 दिसंबर – 15 फ़रवरी (फूल आने के 135–150 दिन बाद)',
      },
      criticalMoistureStage: {
        en: 'Oct–Nov Fruit Development (Uniform dual-lateral drip prevents fruit cracking)',
        mr: 'ऑक्टोबर–नोव्हेंबर फळ फुगवणी अवस्था (समान ठिबक पाण्यामुळे फळे तडकणे थांबते)',
        hi: 'अक्टूबर–नवंबर फल विकास अवस्था (समान ड्रिप नमी से फल फटना रुकता है)',
      },
      kvkRecommendedVariety: {
        en: 'Bhagwa / Solapur Lal with Polypropylene Crop Cover',
        mr: 'भगवा / सोलापूर लाल (क्रॉप कव्हर व सेंद्रिय आच्छादनासह)',
        hi: 'भगवा / सोलापुर लाल (क्रॉप कवर एवं मल्चिंग सहित)',
      },
      rainfallAlignmentNote: {
        en: `Taking Mrig Bahar in June leverages ${taluka.name.en}'s monsoon rains, saving 60% summer farm-pond water.`,
        mr: `जूनमध्ये मृग बहार धरल्यास ${taluka.name.mr} मधील मान्सून पावसाचा लाभ मिळतो व उन्हाळी शेततळ्यातील ६०% पाणी वाचते.`,
        hi: `जून में मृग बहार लेने से ${taluka.name.hi} की मानसून बारिश का लाभ मिलता है और 60% तालाब जल बचता है।`,
      },
      waterRequirementMm: 560,
    },
    {
      crop: 'sugarcane',
      cropName: CROP_NAMES.sugarcane,
      season: 'perennial',
      seasonBadge: { en: 'Annual Cash Crop', mr: 'वार्षिक नगदी पीक', hi: 'वार्षिक नकदी फसल' },
      // Jan/Oct planting; Jun-Sep vegetative monsoon, Oct-Nov critical, Dec-Feb harvest, Mar-May critical summer drip
      monthlyStages: [
        'vegetative',
        'vegetative',
        'vegetative',
        'vegetative',
        'sowing',
        'vegetative',
        'harvest',
        'harvest',
        'harvest',
        'critical-irrigation',
        'critical-irrigation',
        'critical-irrigation',
      ],
      sowingWindowText: {
        en: 'Oct–Nov (Pre-Seasonal) or Jan–Feb (Suru Single-Bud Sett Planting)',
        mr: 'ऑक्टोबर–नोव्हेंबर (पूर्वहंगामी) किंवा जानेवारी–फेब्रुवारी (सुरू एक-डोळा रोप लागवड)',
        hi: 'अक्टूबर–नवंबर (पूर्व-मौसमी) या जनवरी–फ़रवरी (सुरू एक-आंख पौध रोपाई)',
      },
      harvestWindowText: {
        en: 'Dec 01 – Feb 28 (12–14 months crushing maturity)',
        mr: '०१ डिसेंबर – २८ फेब्रुवारी (१२–१४ महिने तोडणी हंगाम)',
        hi: '01 दिसंबर – 28 फ़रवरी (12–14 माह पेराई परिपक्वता)',
      },
      criticalMoistureStage: {
        en: 'Mar–May Peak Evaporative Demand (Subsurface/paired-row drip + trash mulch mandatory)',
        mr: 'मार्च–मे उन्हाळी तीव्र बाष्पीभवन काळ (जोड-ओळ ठिबक व पाचट आच्छादन अनिवार्य)',
        hi: 'मार्च–मई ग्रीष्मकालीन उच्च वाष्पीकरण (जोड़ा-कतार ड्रिप और पत्ती मल्चिंग अनिवार्य)',
      },
      kvkRecommendedVariety: {
        en: 'Co-86032 / Phule 265 (Single-Bud Sett + Paired-Row 4.5ft Drip)',
        mr: 'को-८६०३२ / फुले २६५ (एक-डोळा रोप + ४.५ फूट जोड-ओळ ठिबक)',
        hi: 'को-86032 / फुले 265 (सिंगल-बड नर्सरी + 4.5 फीट जोड़ा-कतार ड्रिप)',
      },
      rainfallAlignmentNote: {
        en: isDryTaluka
          ? `High groundwater stress in ${taluka.name.en} (-${taluka.groundwaterDepletionPct}%): avoid flood-irrigated sugarcane; convert 100% to subsurface drip.`
          : `Monsoon months (Jun–Sep) supply 55% of water need; use trash mulching in Mar–May to cut borewell draw by 48%.`,
        mr: isDryTaluka
          ? `${taluka.name.mr} मध्ये तीव्र भूजल घट (-${taluka.groundwaterDepletionPct}%): पाटाने ऊस देणे टाळा; १००% ठिबक व पाचट आच्छादन वापरा.`
          : `मान्सून काळात (जून–सप्टें) ५५% पाण्याची गरज भागते; मार्च–मे मध्ये पाचट आच्छादनाने ४८% पाणी वाचवा.`,
        hi: isDryTaluka
          ? `${taluka.name.hi} में गंभीर भूजल गिरावट (-${taluka.groundwaterDepletionPct}%): बाढ़ सिंचाई वाला गन्ना न लगाएं; 100% ड्रिप अपनाएं।`
          : `मानसून (जून–सितं) से 55% जल पूर्ति होती है; मार्च–मई में पत्ती मल्चिंग से 48% भूजल बचाएं।`,
      },
      waterRequirementMm: 1650,
    },
  ];

  const filteredCrops =
    seasonFilter === 'all' ? allCrops : allCrops.filter((c) => c.season === seasonFilter);

  return {
    talukaId: taluka.id,
    region: taluka.Region,
    annualExpectedRainMm,
    months,
    crops: filteredCrops,
  };
}




