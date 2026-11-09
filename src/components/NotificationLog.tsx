/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * NotificationLog — Shows delivery history from the backend
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Clock, MessageSquare, Smartphone, CheckCircle2, RefreshCw } from 'lucide-react';
import { getNotificationLog, type NotificationLogEntry } from '../utils/apiClient';
import type { Language } from '../utils/waterEngine';

interface NotificationLogProps {
  talukaId: string;
  lang: Language;
  refreshTrigger?: number; // increment to trigger refresh
}

const LABELS: Record<Language, {
  title: string;
  empty: string;
  time: string;
  channel: string;
  recipient: string;
  status: string;
  refresh: string;
}> = {
  en: {
    title: 'Recent Dispatch Log',
    empty: 'No notifications dispatched yet for this taluka.',
    time: 'Time',
    channel: 'Channel',
    recipient: 'Recipient',
    status: 'Status',
    refresh: 'Refresh',
  },
  mr: {
    title: 'अलीकडील संदेश नोंदवही',
    empty: 'या तालुक्यासाठी अद्याप कोणतेही संदेश पाठवलेले नाहीत.',
    time: 'वेळ',
    channel: 'माध्यम',
    recipient: 'प्राप्तकर्ता',
    status: 'स्थिती',
    refresh: 'ताजे करा',
  },
  hi: {
    title: 'हाल का प्रेषण लॉग',
    empty: 'इस तालुका के लिए अभी तक कोई अधिसूचना नहीं भेजी गई।',
    time: 'समय',
    channel: 'माध्यम',
    recipient: 'प्राप्तकर्ता',
    status: 'स्थिति',
    refresh: 'ताज़ा करें',
  },
};

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  whatsapp: <MessageSquare className="w-3.5 h-3.5 text-green-600" />,
  sms: <Smartphone className="w-3.5 h-3.5 text-blue-600" />,
  both: <><MessageSquare className="w-3 h-3 text-green-600" /><Smartphone className="w-3 h-3 text-blue-600" /></>,
};

export function NotificationLog({ talukaId, lang, refreshTrigger }: NotificationLogProps) {
  const [logs, setLogs] = useState<NotificationLogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const t = LABELS[lang];

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getNotificationLog(talukaId);
      setLogs(data);
    } catch (err) {
      console.error('[NotificationLog] Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  }, [talukaId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs, refreshTrigger]);

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleTimeString(lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  if (logs.length === 0 && !loading) {
    return (
      <div className="mt-4 p-3 bg-[#EFECE3]/60 border border-[#182218]/8 rounded-lg text-center">
        <p className="text-xs text-[#182218]/50">{t.empty}</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold text-[#182218]/70 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {t.title}
        </h4>
        <button
          type="button"
          onClick={fetchLogs}
          disabled={loading}
          className="text-[10px] font-medium text-[#182218]/50 hover:text-[#182218] flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          {t.refresh}
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#182218]/12">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#EFECE3]/80 text-[#182218]/70">
              <th className="text-left px-3 py-2 font-semibold">{t.time}</th>
              <th className="text-left px-3 py-2 font-semibold">{t.channel}</th>
              <th className="text-left px-3 py-2 font-semibold">{t.recipient}</th>
              <th className="text-left px-3 py-2 font-semibold">{t.status}</th>
            </tr>
          </thead>
          <tbody>
            {logs.slice(0, 10).map((entry) => (
              <tr key={entry.id} className="border-t border-[#182218]/8 hover:bg-[#F9F8F3]">
                <td className="px-3 py-2 text-[#182218]/75 whitespace-nowrap">
                  {formatTime(entry.timestamp)}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    {CHANNEL_ICONS[entry.channel] || null}
                    <span className="text-[#182218]/80 capitalize">{entry.channel}</span>
                  </div>
                </td>
                <td className="px-3 py-2 text-[#182218]/80 max-w-[200px] truncate">
                  {entry.recipient || 'Cohort'}
                </td>
                <td className="px-3 py-2">
                  <span className="inline-flex items-center gap-1 text-[#059605] font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    {entry.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

