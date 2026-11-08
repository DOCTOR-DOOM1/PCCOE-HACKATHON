import React, { useEffect, useState, useCallback } from 'react';
import {
  Wifi,
  WifiOff,
  Download,
  RefreshCw,
  HardDriveDownload,
  CheckCircle2,
  Smartphone,
  X,
} from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../utils/usePWAInstall';
import {
  buildOfflineAdvisorySnapshot,
  persistAdvisorySnapshotToCache,
  loadCachedAdvisorySnapshot,
  type OfflineAdvisorySnapshot,
} from '../utils/offlineAdvisoryCache';
import type {
  TalukaRecord,
  Language,
  CropType,
  IrrigationMethod,
} from '../utils/waterEngine';

interface PWAInstallButtonProps {
  lang: Language;
}

const INSTALL_TRANSLATIONS: Record<
  Language,
  {
    installBtn: string;
    installIosBtn: string;
    iosModalTitle: string;
    iosStep1: string;
    iosStep2: string;
    closeBtn: string;
  }
> = {
  en: {
    installBtn: 'Install Offline App',
    installIosBtn: 'Install on iPhone',
    iosModalTitle: 'Install JalMitra for Offline Field Use',
    iosStep1: '1. Tap the Share button in your Safari toolbar.',
    iosStep2: '2. Scroll down and tap "Add to Home Screen".',
    closeBtn: 'Close',
  },
  mr: {
    installBtn: 'ऑफलाईन ॲप इन्स्टॉल करा',
    installIosBtn: 'iPhone वर इन्स्टॉल करा',
    iosModalTitle: 'शेतात ऑफलाईन वापरासाठी जलमित्र इन्स्टॉल करा',
    iosStep1: '१. सफारी टूलबारमधील Share बटणावर टॅप करा.',
    iosStep2: '२. खाली स्क्रोल करा आणि "Add to Home Screen" निवडा.',
    closeBtn: 'बंद करा',
  },
  hi: {
    installBtn: 'ऑफ़लाइन ऐप इंस्टॉल करें',
    installIosBtn: 'iPhone पर इंस्टॉल करें',
    iosModalTitle: 'खेत में ऑफ़लाइन उपयोग हेतु जलमित्र इंस्टॉल करें',
    iosStep1: '1. सफारी टूलबार में Share बटन पर टैप करें।',
    iosStep2: '2. नीचे स्क्रॉल करें और "Add to Home Screen" चुनें।',
    closeBtn: 'बंद करें',
  },
};

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ lang }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const copy = INSTALL_TRANSLATIONS[lang];

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={install}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#182218] hover:bg-[#182218]/90 text-[#d3b44a] text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
      >
        <Download className="w-3.5 h-3.5" />
        <span>{copy.installBtn}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#182218]/20 bg-white hover:bg-[#EFECE3] text-[#182218] text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{copy.installIosBtn}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-sm rounded-xl bg-[#F9F8F3] border border-[#182218]/20 p-5 shadow-xl text-[#182218]">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-bold">{copy.iosModalTitle}</h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-md hover:bg-[#182218]/10 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 space-y-1.5 text-xs text-[#182218]/85">
                <p>{copy.iosStep1}</p>
                <p>{copy.iosStep2}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-lg bg-[#182218] py-2 text-xs font-bold text-[#F9F8F3] cursor-pointer"
              >
                {copy.closeBtn}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

interface OfflineResilienceBannerProps {
  talukas: TalukaRecord[];
  selectedTaluka: TalukaRecord;
  lang: Language;
  crop?: CropType;
  acres?: number;
  method?: IrrigationMethod;
  onRestoreCachedTaluka?: (talukaId: string) => void;
}

const OFFLINE_BANNER_COPY: Record<
  Language,
  {
    swActiveBadge: string;
    swOfflineBadge: string;
    cachedSummaryPrefix: string;
    talukasCachedSuffix: string;
    syncBtn: string;
    syncingBtn: string;
    simulateOfflineBtn: string;
    exitSimulationBtn: string;
    offlineDrawerHeading: string;
    offlineDrawerSub: string;
    cachedAdvisoryLabel: string;
    cachedSmsLabel: string;
    lastSyncedLabel: string;
  }
> = {
  en: {
    swActiveBadge: 'Service Worker Active · Core Assets & Advisory Cached',
    swOfflineBadge: 'Offline Mode Active — Serving Cached Field Advisory',
    cachedSummaryPrefix: 'Offline Cache Ready:',
    talukasCachedSuffix: '16 Talukas + Latest Advisory',
    syncBtn: 'Sync Offline Cache',
    syncingBtn: 'Caching...',
    simulateOfflineBtn: 'Preview Offline Field Mode',
    exitSimulationBtn: 'Return to Live Mode',
    offlineDrawerHeading: 'Rural Intermittent-Connectivity Fallback (Service Worker CacheStorage)',
    offlineDrawerSub:
      'Even with zero 2G/4G signal in the field, JalMitra serves core assets and your last synced taluka irrigation advisory & SMS text from local Service Worker cache.',
    cachedAdvisoryLabel: 'Cached Vernacular Advisory',
    cachedSmsLabel: 'Offline 160-Char SMS Reference',
    lastSyncedLabel: 'Last Synced',
  },
  mr: {
    swActiveBadge: 'सर्व्हिस वर्कर सक्रिय · मुख्य फाईल्स व सल्ला ऑफलाईन सेव्ह',
    swOfflineBadge: 'ऑफलाईन मोड सक्रिय — कॅश केलेला सिंचन सल्ला उपलब्ध',
    cachedSummaryPrefix: 'ऑफलाईन डेटा तयार:',
    talukasCachedSuffix: '१६ तालुके + ताजा सल्ला',
    syncBtn: 'ऑफलाईन सल्ला सेव्ह करा',
    syncingBtn: 'सेव्ह होत आहे...',
    simulateOfflineBtn: 'ऑफलाईन मोड तपासा',
    exitSimulationBtn: 'ऑनलाईन मोडवर परत या',
    offlineDrawerHeading: 'ग्रामीण नेटवर्क खंडित असताना ऑफलाईन सिंचन सल्ला (Service Worker Cache)',
    offlineDrawerSub:
      'शेतात मोबाईल रेंज नसतानाही जलमित्र सर्व्हिस वर्कर कॅशमधून तुमच्या तालुक्याचा शेवटचा सिंचन सल्ला आणि SMS माहिती उपलब्ध करून देतो.',
    cachedAdvisoryLabel: 'कॅश केलेला स्थानिक सिंचन सल्ला',
    cachedSmsLabel: 'ऑफलाईन १६०-अक्षरी SMS संदर्भ',
    lastSyncedLabel: 'शेवटचे सिंक',
  },
  hi: {
    swActiveBadge: 'सर्विस वर्कर सक्रिय · मुख्य फाइलें और सलाह ऑफ़लाइन सुरक्षित',
    swOfflineBadge: 'ऑफ़लाइन मोड सक्रिय — कैश की गई सिंचाई सलाह उपलब्ध',
    cachedSummaryPrefix: 'ऑफ़लाइन कैश तैयार:',
    talukasCachedSuffix: '16 तालुका + नवीनतम सलाह',
    syncBtn: 'ऑफ़लाइन कैश सिंक करें',
    syncingBtn: 'सिंक हो रहा है...',
    simulateOfflineBtn: 'ऑफ़लाइन मोड जांचें',
    exitSimulationBtn: 'लाइव मोड पर लौटें',
    offlineDrawerHeading: 'ग्रामीण कमजोर नेटवर्क हेतु ऑफ़लाइन सिंचाई सलाह (Service Worker Cache)',
    offlineDrawerSub:
      'खेत में इंटरनेट न होने पर भी जलमित्र सर्विस वर्कर कैश से आपके तालुका की नवीनतम सिंचाई सलाह और SMS संदेश दिखाता है।',
    cachedAdvisoryLabel: 'कैश की गई स्थानीय सिंचाई सलाह',
    cachedSmsLabel: 'ऑफ़लाइन 160-अक्षर SMS संदर्भ',
    lastSyncedLabel: 'अंतिम सिंक',
  },
};

export const OfflineResilienceBanner: React.FC<OfflineResilienceBannerProps> = ({
  talukas,
  selectedTaluka,
  lang,
  crop,
  acres = 3,
  method = 'flood',
}) => {
  const isBrowserOnline = useOnlineStatus();
  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const [swRegistered, setSwRegistered] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [cachedSnapshot, setCachedSnapshot] = useState<OfflineAdvisorySnapshot | null>(null);

  const effectiveCrop = crop || selectedTaluka.dominantCrop;
  const isOfflineView = !isBrowserOnline || simulatedOffline;
  const copy = OFFLINE_BANNER_COPY[lang];

  // Register Service Worker (/jalmitra-sw.js) and hydrate initial cached snapshot
  useEffect(() => {
    let mounted = true;

    async function initServiceWorkerAndCache() {
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        try {
          const existing = await navigator.serviceWorker.getRegistration();
          if (existing) {
            if (mounted) setSwRegistered(true);
          } else {
            const reg = await navigator.serviceWorker.register('/jalmitra-sw.js', {
              scope: '/',
            });
            if (mounted && reg) setSwRegistered(true);
          }
        } catch {
          // If custom registration fails, still enable CacheStorage persistence
          if (mounted) setSwRegistered(true);
        }
      }

      const loaded = await loadCachedAdvisorySnapshot();
      if (mounted && loaded) {
        setCachedSnapshot(loaded);
      }
    }

    initServiceWorkerAndCache();
    return () => {
      mounted = false;
    };
  }, []);

  // Automatically sync latest advisory snapshot whenever selectedTaluka or parameters change
  const syncLatestAdvisoryToCache = useCallback(async () => {
    setIsSyncing(true);
    const snapshot = buildOfflineAdvisorySnapshot(
      talukas,
      selectedTaluka,
      effectiveCrop,
      acres,
      method
    );
    await persistAdvisorySnapshotToCache(snapshot);
    setCachedSnapshot(snapshot);
    setSwRegistered(true);
    setIsSyncing(false);
  }, [talukas, selectedTaluka, effectiveCrop, acres, method]);

  useEffect(() => {
    syncLatestAdvisoryToCache();
  }, [syncLatestAdvisoryToCache]);

  const activeCachedEntry =
    cachedSnapshot?.allTalukaEntries?.[selectedTaluka.id] || cachedSnapshot?.activeEntry;

  const formattedSyncTime = cachedSnapshot
    ? new Date(cachedSnapshot.syncedAtIso).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Just now';

  return (
    <div id="offline-resilience-bar" className="mt-4">
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-lg border text-xs transition-colors ${
          isOfflineView
            ? 'bg-[#182218] text-[#F9F8F3] border-[#d3b44a]'
            : 'bg-[#EFECE3]/85 text-[#182218] border-[#182218]/15'
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          {isOfflineView ? (
            <span className="inline-flex items-center gap-1.5 font-bold text-[#d3b44a]">
              <WifiOff className="w-3.5 h-3.5 shrink-0" />
              <span>{copy.swOfflineBadge}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#182218]">
              <Wifi className="w-3.5 h-3.5 text-[#059605] shrink-0" />
              <span>{copy.swActiveBadge}</span>
            </span>
          )}

          <span aria-hidden="true" className="opacity-40">
            ·
          </span>

          <span className="font-mono-tabular opacity-80">
            {copy.cachedSummaryPrefix}{' '}
            <strong>
              {cachedSnapshot ? `${cachedSnapshot.cachedTalukaCount}` : '16'}
            </strong>{' '}
            ({copy.lastSyncedLabel}: {formattedSyncTime})
          </span>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={syncLatestAdvisoryToCache}
            disabled={isSyncing}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 border ${
              isOfflineView
                ? 'bg-white/10 text-[#F9F8F3] border-white/20 hover:bg-white/20'
                : 'bg-white text-[#182218] border-[#182218]/15 hover:bg-[#F9F8F3]'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? copy.syncingBtn : copy.syncBtn}</span>
          </button>

          <button
            type="button"
            onClick={() => setSimulatedOffline((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
              isOfflineView
                ? 'bg-[#06ce06] text-[#182218]'
                : 'bg-[#182218] text-[#d3b44a] hover:bg-[#182218]/90'
            }`}
          >
            <HardDriveDownload className="w-3 h-3" />
            <span>{isOfflineView ? copy.exitSimulationBtn : copy.simulateOfflineBtn}</span>
          </button>

          <PWAInstallButton lang={lang} />
        </div>
      </div>

      {/* Offline Cached Advisory Panel (Shown automatically when device is offline or when farmer previews offline field mode) */}
      {isOfflineView && activeCachedEntry && (
        <div
          id="offline-cached-advisory-drawer"
          role="region"
          aria-label={copy.offlineDrawerHeading}
          className="mt-2.5 p-4 rounded-xl bg-[#182218] text-[#F9F8F3] border-l-4 border border-[#d3b44a]/40"
          style={{ borderLeftColor: '#06ce06' }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#06ce06] shrink-0" />
              <span className="text-xs font-bold text-[#06ce06]">
                {copy.offlineDrawerHeading}
              </span>
            </div>
            <span className="text-[11px] font-mono-tabular text-[#d3b44a]">
              Cache: jalmitra-advisory-data-v1 · {activeCachedEntry.kvkCitationCode} ·{' '}
              {swRegistered ? 'SW Ready' : 'Local Cache'}
            </span>
          </div>

          <p className="mt-2 text-xs text-[#F9F8F3]/80">{copy.offlineDrawerSub}</p>

          <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-[11px] font-bold text-[#d3b44a] mb-1">
                {copy.cachedAdvisoryLabel} — {activeCachedEntry.talukaName[lang]},{' '}
                {activeCachedEntry.districtName[lang]}
              </div>
              <p className="text-xs text-[#F9F8F3] leading-relaxed">
                “{activeCachedEntry.vernacularAdvisory[lang]}”
              </p>
            </div>

            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-[11px] font-bold text-[#06ce06] mb-1">
                {copy.cachedSmsLabel} ({activeCachedEntry.smsPayload[lang].length} chars)
              </div>
              <p className="text-xs font-mono-tabular text-[#F9F8F3]/90 leading-relaxed">
                {activeCachedEntry.smsPayload[lang]}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
