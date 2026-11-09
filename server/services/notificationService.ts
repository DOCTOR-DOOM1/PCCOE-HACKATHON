/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * JalMitra Notification Dispatch Service
 * Simulates SMS/WhatsApp delivery for hackathon demo with full logging.
 */

import { store, type NotificationLogEntry } from '../store/index.js';

export interface DispatchRequest {
  channel: 'whatsapp' | 'sms' | 'both';
  talukaId: string;
  recipientMode: 'cohort' | 'single';
  farmerName?: string;
  farmerPhone?: string;
  smsText: string;
  whatsappText: string;
  language: string;
}

export interface DispatchResult {
  success: boolean;
  messageId: string;
  channel: string;
  recipient: string;
  deliveredAt: string;
  message: string;
}

/**
 * Simulates dispatching a notification via SMS/WhatsApp gateway.
 * In production, this would integrate with Twilio, Gupshup, or MSG91.
 */
export function dispatchNotification(req: DispatchRequest): DispatchResult {
  // Validate phone number for individual dispatch
  if (req.recipientMode === 'single') {
    if (!req.farmerPhone || !/^\d{10}$/.test(req.farmerPhone.replace(/[^0-9]/g, '').slice(-10))) {
      return {
        success: false,
        messageId: '',
        channel: req.channel,
        recipient: req.farmerPhone || 'unknown',
        deliveredAt: '',
        message: 'Invalid phone number. Please provide a valid 10-digit Indian mobile number.',
      };
    }
  }

  // Log the notification
  const logEntry = store.addNotification({
    talukaId: req.talukaId,
    channel: req.channel,
    recipientMode: req.recipientMode,
    farmerName: req.farmerName,
    farmerPhone: req.farmerPhone,
    smsText: req.smsText,
    whatsappText: req.whatsappText,
    language: req.language,
  });

  const recipientLabel = req.recipientMode === 'cohort'
    ? `Taluka farmer cohort (${req.talukaId})`
    : `${req.farmerName || 'Farmer'} (+91 ${req.farmerPhone})`;

  const channelLabels: Record<string, string> = {
    whatsapp: 'WhatsApp Rich Advisory',
    sms: 'Standard SMS (160-char)',
    both: 'WhatsApp + SMS Dual Channel',
  };

  console.log(`[JalMitra Gateway] ✓ ${channelLabels[req.channel]} dispatched to ${recipientLabel}`);

  return {
    success: true,
    messageId: logEntry.id,
    channel: req.channel,
    recipient: recipientLabel,
    deliveredAt: logEntry.deliveredAt!,
    message: `${channelLabels[req.channel]} successfully delivered to ${recipientLabel}.`,
  };
}

/**
 * Retrieves dispatch log for a taluka.
 */
export function getDispatchLog(talukaId: string): NotificationLogEntry[] {
  return store.getNotificationsByTaluka(talukaId);
}

/**
 * Retrieves all dispatch logs.
 */
export function getAllDispatchLogs(): NotificationLogEntry[] {
  return store.getAllNotifications();
}

