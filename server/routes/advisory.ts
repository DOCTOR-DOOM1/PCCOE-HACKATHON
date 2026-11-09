/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Advisory Route — POST /api/advisory/generate
 */

import { Router, type Request, type Response } from 'express';
import { generateAdvisory, type AdvisoryInput } from '../services/gemini.js';

// Taluka lookup map (minimal data for advisory context)
import { TALUKA_LOOKUP } from './telemetry.js';

const router = Router();

router.post('/generate', async (req: Request, res: Response) => {
  try {
    const {
      talukaId,
      crop,
      acres,
      currentMethod,
      language = 'en',
      diagnosticNote,
    } = req.body;

    // Validate required fields
    if (!talukaId || !crop || !acres || !currentMethod) {
      return res.status(400).json({
        error: 'Missing required fields: talukaId, crop, acres, currentMethod',
      });
    }

    // Look up taluka data
    const taluka = TALUKA_LOOKUP[talukaId];
    if (!taluka) {
      return res.status(404).json({ error: `Taluka '${talukaId}' not found` });
    }

    const input: AdvisoryInput = {
      talukaId,
      talukaName: taluka.name[language as 'en' | 'mr' | 'hi'] || taluka.name.en,
      district: taluka.district[language as 'en' | 'mr' | 'hi'] || taluka.district.en,
      region: taluka.Region,
      soilMoisturePct: taluka.soilMoisturePct,
      groundwaterDepletionPct: taluka.groundwaterDepletionPct,
      groundwaterDepthMeters: taluka.groundwaterDepthMeters,
      rainForecast7dMm: taluka.rainForecast7dMm,
      rainExpectedDay: taluka.rainExpectedDay[language as 'en' | 'mr' | 'hi'] || taluka.rainExpectedDay.en,
      ndviScore: taluka.ndviScore,
      crop,
      acres: Number(acres),
      currentMethod,
      soilType: taluka.soilType[language as 'en' | 'mr' | 'hi'] || taluka.soilType.en,
      kvkCenter: taluka.kvkCenter[language as 'en' | 'mr' | 'hi'] || taluka.kvkCenter.en,
      kvkCitationCode: taluka.kvkCitationCode,
      language,
      diagnosticNote,
    };

    const advisory = await generateAdvisory(input);

    return res.json(advisory);
  } catch (error: any) {
    console.error('[Advisory Route Error]', error.message);
    return res.status(500).json({ error: error.message || 'Advisory generation failed' });
  }
});

export default router;

