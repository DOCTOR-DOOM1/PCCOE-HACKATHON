/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Diagnostic Route — POST /api/diagnostic/analyze
 */

import { Router, type Request, type Response } from 'express';
import { analyzeCropImage, type DiagnosticInput } from '../services/gemini.js';
import { TALUKA_LOOKUP } from './telemetry.js';

const router = Router();

router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const {
      imageBase64,
      mimeType = 'image/jpeg',
      crop,
      talukaId,
      soilMoisturePct,
      language = 'en',
    } = req.body;

    if (!imageBase64 || !crop || !talukaId) {
      return res.status(400).json({
        error: 'Missing required fields: imageBase64, crop, talukaId',
      });
    }

    const taluka = TALUKA_LOOKUP[talukaId];
    const talukaName = taluka
      ? taluka.name[language as 'en' | 'mr' | 'hi'] || taluka.name.en
      : talukaId;

    const moisture = soilMoisturePct ?? taluka?.soilMoisturePct ?? 30;

    const input: DiagnosticInput = {
      imageBase64,
      mimeType,
      crop,
      talukaId,
      talukaName,
      soilMoisturePct: moisture,
      language,
    };

    const result = await analyzeCropImage(input);

    return res.json(result);
  } catch (error: any) {
    console.error('[Diagnostic Route Error]', error.message);
    return res.status(500).json({ error: error.message || 'Image analysis failed' });
  }
});

export default router;

