/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * JalMitra Gemini AI Service
 * Advisory generation and multimodal crop diagnostics using Google Gemini.
 */

import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      throw new Error(
        'GEMINI_API_KEY is not configured. Set it in the .env file.',
      );
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// ── Types ─────────────────────────────────────────────────────

export interface AdvisoryInput {
  talukaId: string;
  talukaName: string;
  district: string;
  region: string;
  soilMoisturePct: number;
  groundwaterDepletionPct: number;
  groundwaterDepthMeters: number;
  rainForecast7dMm: number;
  rainExpectedDay: string;
  ndviScore: number;
  crop: string;
  acres: number;
  currentMethod: string;
  soilType: string;
  kvkCenter: string;
  kvkCitationCode: string;
  language: string;
  diagnosticNote?: string;
}

export interface AdvisoryOutput {
  advisoryText: string;
  kvkReference: string;
  actionItems: string[];
  waterSavingEstimate: string;
  generatedAt: string;
}

export interface DiagnosticInput {
  imageBase64: string;
  mimeType: string;
  crop: string;
  talukaId: string;
  talukaName: string;
  soilMoisturePct: number;
  language: string;
}

export interface DiagnosticOutput {
  diagnosis: string;
  diagnosisType: 'water_stress' | 'foliar_disease' | 'healthy' | 'unknown';
  confidence: number;
  irrigationAdjustment: string;
  kvkRemedy: string;
  litersSavedPerAcre: number;
  generatedAt: string;
}

// ── Advisory Generation ───────────────────────────────────────

const LANG_LABELS: Record<string, string> = {
  en: 'English',
  mr: 'Marathi (मराठी)',
  hi: 'Hindi (हिन्दी)',
};

export async function generateAdvisory(
  input: AdvisoryInput,
): Promise<AdvisoryOutput> {
  const ai = getClient();
  const langLabel = LANG_LABELS[input.language] || 'English';

  const prompt = `You are JalMitra — an AI irrigation and groundwater advisory system for Maharashtra's smallholder farmers. You produce precise, actionable, and empathetic advisories grounded in Krishi Vigyan Kendra (KVK) extension science.

## Context Data (Live Telemetry)
- **Taluka**: ${input.talukaName}, District: ${input.district}, Region: ${input.region}
- **Soil Moisture (Bhuvan ISRO)**: ${input.soilMoisturePct}%
- **Groundwater Depletion (CGWB)**: -${input.groundwaterDepletionPct}% this month, depth ${input.groundwaterDepthMeters}m
- **7-Day IMD Rain Forecast**: ${input.rainForecast7dMm}mm, expected ${input.rainExpectedDay}
- **Crop NDVI**: ${input.ndviScore}
- **Farmer's Crop**: ${input.crop} on ${input.acres} acres
- **Current Irrigation Method**: ${input.currentMethod}
- **Soil Type**: ${input.soilType}
- **KVK Center**: ${input.kvkCenter} (${input.kvkCitationCode})
${input.diagnosticNote ? `- **Field Diagnostic Note**: ${input.diagnosticNote}` : ''}

## Task
Generate a comprehensive yet concise irrigation advisory in **${langLabel}** language. Include:

1. **Advisory Text** (2-3 paragraphs): Explain the current water stress situation, why the advisory matters, and exactly what the farmer should do. Use simple, farmer-friendly language.

2. **KVK Reference**: A one-line citation grounding the advice in the local KVK bulletin (use ${input.kvkCitationCode}).

3. **Action Items**: Exactly 3-4 bullet-point actions (irrigation timing, method change, mulching, etc.)

4. **Water Saving Estimate**: Estimated liters saved per cycle with the recommended changes.

## Output Format (JSON)
Respond ONLY with a valid JSON object:
{
  "advisoryText": "...",
  "kvkReference": "...",
  "actionItems": ["...", "...", "..."],
  "waterSavingEstimate": "..."
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        temperature: 0.4,
        topP: 0.9,
        maxOutputTokens: 1500,
      },
    });

    const text = response.text ?? '';
    // Extract JSON from response (handle markdown code fences)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse Gemini response as JSON');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      advisoryText: parsed.advisoryText || 'Advisory generation failed.',
      kvkReference: parsed.kvkReference || `${input.kvkCenter} (${input.kvkCitationCode})`,
      actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
      waterSavingEstimate: parsed.waterSavingEstimate || 'See advisory for details.',
      generatedAt: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Gemini Advisory Error]', error.message);
    // Return a fallback advisory on error
    return {
      advisoryText: getFallbackAdvisory(input),
      kvkReference: `${input.kvkCenter} (${input.kvkCitationCode})`,
      actionItems: getFallbackActions(input),
      waterSavingEstimate: `~${Math.round(input.acres * 28000)} L/cycle with drip`,
      generatedAt: new Date().toISOString(),
    };
  }
}

function getFallbackAdvisory(input: AdvisoryInput): string {
  if (input.language === 'mr') {
    return `${input.talukaName} तालुक्यात जमिनीतील ओलावा ${input.soilMoisturePct}% आहे आणि भूजल पातळी ${input.groundwaterDepletionPct}% ने खालावली आहे. पुढील ${input.rainForecast7dMm} मिमी पावसाचा अंदाज लक्षात घेता, ${input.crop} पिकासाठी ठिबक सिंचन पद्धत वापरण्याची शिफारस करण्यात येत आहे. ${input.kvkCenter} (${input.kvkCitationCode}) मार्गदर्शनानुसार जोड-ओळ ठिबक व सेंद्रिय मल्चिंग करा.`;
  }
  if (input.language === 'hi') {
    return `${input.talukaName} तालुका में मिट्टी की नमी ${input.soilMoisturePct}% है और भूजल स्तर ${input.groundwaterDepletionPct}% गिरा है। अगले ${input.rainForecast7dMm} मिमी बारिश के पूर्वानुमान को देखते हुए, ${input.crop} फसल के लिए ड्रिप सिंचाई पद्धति अपनाएं। ${input.kvkCenter} (${input.kvkCitationCode}) के अनुसार जोड़ा-कतार ड्रिप और जैविक मल्चिंग करें।`;
  }
  return `Soil moisture in ${input.talukaName} is at ${input.soilMoisturePct}% with groundwater depleted by ${input.groundwaterDepletionPct}%. With ${input.rainForecast7dMm}mm rain expected ${input.rainExpectedDay}, switch ${input.crop} to drip irrigation to save water. Reference: ${input.kvkCenter} (${input.kvkCitationCode}).`;
}

function getFallbackActions(input: AdvisoryInput): string[] {
  if (input.language === 'mr') {
    return [
      `${input.crop} पिकासाठी ठिबक सिंचन पद्धत वापरा`,
      input.rainForecast7dMm >= 14 ? `सिंचन ${Math.min(4, Math.floor(input.rainForecast7dMm / 7))} दिवस पुढे ढकला` : 'संध्याकाळी पाणी द्या',
      'सेंद्रिय मल्चिंग (आच्छादन) करा',
    ];
  }
  if (input.language === 'hi') {
    return [
      `${input.crop} के लिए ड्रिप सिंचाई अपनाएं`,
      input.rainForecast7dMm >= 14 ? `सिंचाई ${Math.min(4, Math.floor(input.rainForecast7dMm / 7))} दिन टालें` : 'शाम को सिंचाई करें',
      'जैविक मल्चिंग करें',
    ];
  }
  return [
    `Switch ${input.crop} to drip irrigation`,
    input.rainForecast7dMm >= 14 ? `Delay irrigation ${Math.min(4, Math.floor(input.rainForecast7dMm / 7))} days (rain expected)` : 'Irrigate during evening hours',
    'Apply organic trash mulch between crop rows',
  ];
}

// ── Multimodal Crop Diagnostic ────────────────────────────────

export async function analyzeCropImage(
  input: DiagnosticInput,
): Promise<DiagnosticOutput> {
  const ai = getClient();
  const langLabel = LANG_LABELS[input.language] || 'English';

  const prompt = `You are JalMitra's crop diagnostic AI. Analyze this field photograph to determine whether the crop symptoms are caused by:
1. **Abiotic Water Stress** (drought, low soil moisture) — which requires irrigation
2. **Biotic Foliar Disease** (fungal spots, bacterial blight) — where over-irrigation worsens the problem
3. **Healthy crop** — no intervention needed

## Context
- **Crop**: ${input.crop}
- **Taluka**: ${input.talukaName}
- **Current Soil Moisture**: ${input.soilMoisturePct}%
- **Language**: ${langLabel}

## Analysis Steps
1. Look for symmetrical leaf droop vs. asymmetric necrotic lesions
2. Check for concentric ring patterns (fungal) vs. uniform wilting (water stress)
3. Note soil surface cracks (stress indicator) vs. damp surface (disease risk)
4. Factor in the ${input.soilMoisturePct}% soil moisture reading

## Output (JSON only)
{
  "diagnosis": "Plain-language explanation in ${langLabel}",
  "diagnosisType": "water_stress" | "foliar_disease" | "healthy" | "unknown",
  "confidence": 85,
  "irrigationAdjustment": "What to do about irrigation, in ${langLabel}",
  "kvkRemedy": "KVK-recommended treatment, in ${langLabel}",
  "litersSavedPerAcre": 40000
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: input.mimeType || 'image/jpeg',
                data: input.imageBase64,
              },
            },
          ],
        },
      ],
      config: {
        temperature: 0.3,
        maxOutputTokens: 1000,
      },
    });

    const text = response.text ?? '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse diagnostic response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      diagnosis: parsed.diagnosis || 'Unable to determine diagnosis.',
      diagnosisType: parsed.diagnosisType || 'unknown',
      confidence: Number(parsed.confidence) || 70,
      irrigationAdjustment: parsed.irrigationAdjustment || 'Consult local KVK for guidance.',
      kvkRemedy: parsed.kvkRemedy || 'Contact your nearest KVK extension officer.',
      litersSavedPerAcre: Number(parsed.litersSavedPerAcre) || 0,
      generatedAt: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('[Gemini Diagnostic Error]', error.message);
    return {
      diagnosis: 'Image analysis could not be completed. Please try again or consult your local KVK.',
      diagnosisType: 'unknown',
      confidence: 0,
      irrigationAdjustment: 'Follow your current irrigation schedule until diagnosis is available.',
      kvkRemedy: 'Contact your nearest Krishi Vigyan Kendra for in-person crop inspection.',
      litersSavedPerAcre: 0,
      generatedAt: new Date().toISOString(),
    };
  }
}

