/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Notification Route
 *   POST /api/notification/dispatch
 *   GET  /api/notification/log/:talukaId
 *   GET  /api/notification/log
 */

import { Router, type Request, type Response } from 'express';
import {
  dispatchNotification,
  getDispatchLog,
  getAllDispatchLogs,
} from '../services/notificationService.js';

const router = Router();

router.post('/dispatch', (req: Request, res: Response) => {
  try {
    const {
      channel,
      talukaId,
      recipientMode = 'cohort',
      farmerName,
      farmerPhone,
      smsText,
      whatsappText,
      language = 'en',
    } = req.body;

    if (!channel || !talukaId || !smsText || !whatsappText) {
      return res.status(400).json({
        error: 'Missing required fields: channel, talukaId, smsText, whatsappText',
      });
    }

    if (recipientMode === 'single' && !farmerPhone) {
      return res.status(400).json({
        error: 'farmerPhone is required for individual dispatch',
      });
    }

    const result = dispatchNotification({
      channel,
      talukaId,
      recipientMode,
      farmerName,
      farmerPhone,
      smsText,
      whatsappText,
      language,
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.json(result);
  } catch (error: any) {
    console.error('[Notification Route Error]', error.message);
    return res.status(500).json({ error: error.message || 'Dispatch failed' });
  }
});

router.get('/log/:talukaId', (req: Request, res: Response) => {
  const { talukaId } = req.params;
  const log = getDispatchLog(talukaId);
  return res.json(log);
});

router.get('/log', (_req: Request, res: Response) => {
  const log = getAllDispatchLogs();
  return res.json(log);
});

export default router;

