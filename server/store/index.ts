/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * JalMitra In-Memory Data Store
 * Stores notification logs, committee resolutions, and session data.
 */

export interface NotificationLogEntry {
  id: string;
  timestamp: string;
  talukaId: string;
  channel: 'whatsapp' | 'sms' | 'both';
  recipientMode: 'cohort' | 'single';
  farmerName?: string;
  farmerPhone?: string;
  smsText: string;
  whatsappText: string;
  language: string;
  status: 'delivered' | 'pending' | 'failed';
  deliveredAt?: string;
}

export interface CommitteeResolution {
  id: string;
  talukaId: string;
  villageName: string;
  resolutionType: string;
  targetAcreage: number;
  language: string;
  estimatedSavingsLPerDay: number;
  createdAt: string;
}

class DataStore {
  private notifications: NotificationLogEntry[] = [];
  private resolutions: CommitteeResolution[] = [];
  private idCounter = 0;

  generateId(prefix: string): string {
    this.idCounter++;
    return `${prefix}-${Date.now()}-${this.idCounter}`;
  }

  // ── Notification Log ──────────────────────────────────────────
  addNotification(entry: Omit<NotificationLogEntry, 'id' | 'timestamp' | 'status' | 'deliveredAt'>): NotificationLogEntry {
    const record: NotificationLogEntry = {
      ...entry,
      id: this.generateId('ntf'),
      timestamp: new Date().toISOString(),
      status: 'delivered',
      deliveredAt: new Date().toISOString(),
    };
    this.notifications.unshift(record);
    // Keep only last 500 entries
    if (this.notifications.length > 500) {
      this.notifications = this.notifications.slice(0, 500);
    }
    return record;
  }

  getNotificationsByTaluka(talukaId: string): NotificationLogEntry[] {
    return this.notifications.filter((n) => n.talukaId === talukaId);
  }

  getAllNotifications(): NotificationLogEntry[] {
    return this.notifications;
  }

  // ── Committee Resolutions ─────────────────────────────────────
  addResolution(entry: Omit<CommitteeResolution, 'id' | 'createdAt'>): CommitteeResolution {
    const record: CommitteeResolution = {
      ...entry,
      id: this.generateId('res'),
      createdAt: new Date().toISOString(),
    };
    this.resolutions.unshift(record);
    return record;
  }

  getResolutionsByTaluka(talukaId: string): CommitteeResolution[] {
    return this.resolutions.filter((r) => r.talukaId === talukaId);
  }

  getAllResolutions(): CommitteeResolution[] {
    return this.resolutions;
  }
}

// Singleton instance
export const store = new DataStore();

