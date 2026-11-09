/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Committee Route — Gram Panchayat Water Resolutions
 *   POST /api/committee/resolution
 *   GET  /api/committee/resolutions/:talukaId
 *   GET  /api/committee/resolutions
 */

import { Router, type Request, type Response } from 'express';
import { store } from '../store/index.js';

const RESOLUTION_TYPES: Record<string, Record<string, string>> = {
  'drip-conversion': {
    en: 'Drip Irrigation Conversion Subsidy',
    mr: 'ठिबक सिंचन रूपांतरण अनुदान',
    hi: 'ड्रिप सिंचाई रूपांतरण अनुदान',
  },
  'canal-schedule': {
    en: 'Staggered Canal Water Release Schedule',
    mr: 'पाळीने कालवा पाणी सोडण्याचे वेळापत्रक',
    hi: 'बारी-बारी से नहर जल विमोचन कार्यक्रम',
  },
  'farm-pond': {
    en: 'Farm Pond & Recharge Well Construction',
    mr: 'शेततळे व पुनर्भरण विहीर बांधकाम',
    hi: 'खेत तालाब एवं रिचार्ज कुआं निर्माण',
  },
  'mulching-drive': {
    en: 'Village-Wide Organic Mulching Drive',
    mr: 'गावपातळीवर सेंद्रिय आच्छादन मोहीम',
    hi: 'ग्राम-स्तरीय जैविक मल्चिंग अभियान',
  },
  'borewell-roster': {
    en: 'Community Borewell Extraction Roster',
    mr: 'सामूहिक बोअरवेल उपसा वेळापत्रक',
    hi: 'सामुदायिक बोरवेल दोहन कार्यक्रम',
  },
};

// Estimated liters saved per day per acre for each resolution type
const SAVINGS_PER_ACRE_PER_DAY: Record<string, number> = {
  'drip-conversion': 2200,
  'canal-schedule': 1400,
  'farm-pond': 1800,
  'mulching-drive': 900,
  'borewell-roster': 1600,
};

const router = Router();

router.post('/resolution', (req: Request, res: Response) => {
  try {
    const {
      talukaId,
      villageName,
      resolutionType,
      targetAcreage,
      language = 'en',
    } = req.body;

    if (!talukaId || !villageName || !resolutionType || !targetAcreage) {
      return res.status(400).json({
        error: 'Missing required fields: talukaId, villageName, resolutionType, targetAcreage',
      });
    }

    const acres = Number(targetAcreage);
    if (!Number.isFinite(acres) || acres < 1 || acres > 5000) {
      return res.status(400).json({
        error: 'targetAcreage must be between 1 and 5000',
      });
    }

    const resolutionLabel =
      RESOLUTION_TYPES[resolutionType]?.[language] ||
      RESOLUTION_TYPES[resolutionType]?.en ||
      resolutionType;

    const savingsPerAcreDay = SAVINGS_PER_ACRE_PER_DAY[resolutionType] || 1500;
    const estimatedSavingsLPerDay = Math.round(acres * savingsPerAcreDay);

    const record = store.addResolution({
      talukaId,
      villageName,
      resolutionType: resolutionLabel,
      targetAcreage: acres,
      language,
      estimatedSavingsLPerDay,
    });

    return res.json({
      success: true,
      resolution: record,
    });
  } catch (error: any) {
    console.error('[Committee Route Error]', error.message);
    return res.status(500).json({ error: error.message || 'Failed to save resolution' });
  }
});

router.get('/resolutions/:talukaId', (req: Request, res: Response) => {
  const { talukaId } = req.params;
  const resolutions = store.getResolutionsByTaluka(talukaId);
  return res.json(resolutions);
});

router.get('/resolutions', (_req: Request, res: Response) => {
  const resolutions = store.getAllResolutions();
  return res.json(resolutions);
});

export default router;

