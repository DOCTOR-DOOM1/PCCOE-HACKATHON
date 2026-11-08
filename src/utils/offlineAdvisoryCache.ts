import {
  evaluateWaterStress,
  calculateIrrigationAdvisory,
  formatNotificationPayloads,
  evaluateTalukaHighPriorityAlert,
  type TalukaRecord,
  type CropType,
  type IrrigationMethod,
  type Language,
} from './waterEngine';

export const ADVISORY_CACHE_NAME = 'jalmitra-advisory-data-v1';
export const CORE_ASSETS_CACHE_NAME = 'jalmitra-core-assets-v1';
export const ADVISORY_CACHE_ENDPOINT = '/advisory-cache/latest-advisory.json';
export const TALUKAS_CACHE_ENDPOINT = '/advisory-cache/talukas-telemetry.json';
export const LOCAL_STORAGE_SNAPSHOT_KEY = 'jalmitra_offline_advisory_snapshot_v1';

export interface CachedTalukaAdvisoryEntry {
  talukaId: string;
  talukaName: Record<Language, string>;
  districtName: Record<Language, string>;
  stressScore: number;
  stressLevel: string;
  colorHex: string;
  soilMoisturePct: number;
  groundwaterDepletionPct: number;
  rainForecast7dMm: number;
  crop: CropType;
  acres: number;
  method: IrrigationMethod;
  delayDaysRecommended: number;
  litersSavedPerCycle: number;
  vernacularAdvisory: Record<Language, string>;
  smsPayload: Record<Language, string>;
  whatsappPayload: Record<Language, string>;
  kvkCitationCode: string;
  priorityAlertTitle: Record<Language, string> | null;
}

export interface OfflineAdvisorySnapshot {
  version: string;
  syncedAtIso: string;
  selectedTalukaId: string;
  selectedCrop: CropType;
  selectedAcres: number;
  selectedMethod: IrrigationMethod;
  cachedTalukaCount: number;
  activeEntry: CachedTalukaAdvisoryEntry;
  allTalukaEntries: Record<string, CachedTalukaAdvisoryEntry>;
}

/**
 * Pure function that builds a complete, deterministic offline advisory snapshot
 * for the active taluka and all pilot talukas so farmers can access advisories
 * even with zero or intermittent 2G connectivity.
 */
export function buildOfflineAdvisorySnapshot(
  talukas: TalukaRecord[],
  selectedTaluka: TalukaRecord,
  crop: CropType,
  acres: number,
  method: IrrigationMethod,
  timestampIso: string = new Date().toISOString()
): OfflineAdvisorySnapshot {
  const buildEntry = (
    taluka: TalukaRecord,
    targetCrop: CropType,
    targetAcres: number,
    targetMethod: IrrigationMethod
  ): CachedTalukaAdvisoryEntry => {
    const stress = evaluateWaterStress(
      taluka.soilMoisturePct,
      taluka.groundwaterDepletionPct,
      taluka.rainForecast7dMm,
      taluka.ndviScore
    );
    const calc = calculateIrrigationAdvisory(taluka, targetCrop, targetAcres, targetMethod);
    const notif = formatNotificationPayloads(taluka, calc, null);
    const priorityAlert = evaluateTalukaHighPriorityAlert(taluka);

    return {
      talukaId: taluka.id,
      talukaName: taluka.name,
      districtName: taluka.district,
      stressScore: stress.score,
      stressLevel: stress.level,
      colorHex: stress.colorHex,
      soilMoisturePct: taluka.soilMoisturePct,
      groundwaterDepletionPct: taluka.groundwaterDepletionPct,
      rainForecast7dMm: taluka.rainForecast7dMm,
      crop: targetCrop,
      acres: targetAcres,
      method: targetMethod,
      delayDaysRecommended: calc.delayDaysRecommended,
      litersSavedPerCycle: calc.litersSavedPerCycle,
      vernacularAdvisory: calc.vernacularAdvisory,
      smsPayload: notif.smsText,
      whatsappPayload: notif.whatsappText,
      kvkCitationCode: taluka.kvkCitationCode,
      priorityAlertTitle: priorityAlert ? priorityAlert.title : null,
    };
  };

  const allTalukaEntries: Record<string, CachedTalukaAdvisoryEntry> = {};
  for (const t of talukas) {
    const isSelected = t.id === selectedTaluka.id;
    allTalukaEntries[t.id] = buildEntry(
      t,
      isSelected ? crop : t.dominantCrop,
      isSelected ? acres : 3,
      isSelected ? method : 'flood'
    );
  }

  const activeEntry =
    allTalukaEntries[selectedTaluka.id] || buildEntry(selectedTaluka, crop, acres, method);

  return {
    version: '1.0.0',
    syncedAtIso: timestampIso,
    selectedTalukaId: selectedTaluka.id,
    selectedCrop: crop,
    selectedAcres: acres,
    selectedMethod: method,
    cachedTalukaCount: Object.keys(allTalukaEntries).length,
    activeEntry,
    allTalukaEntries,
  };
}

/**
 * Persists the offline advisory snapshot into both Service Worker CacheStorage
 * (`/advisory-cache/latest-advisory.json`) and `localStorage` for instant offline recovery.
 */
export async function persistAdvisorySnapshotToCache(
  snapshot: OfflineAdvisorySnapshot
): Promise<{ savedToCacheStorage: boolean; savedToLocalStorage: boolean }> {
  let savedToLocalStorage = false;
  let savedToCacheStorage = false;

  const jsonPayload = JSON.stringify(snapshot);

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(LOCAL_STORAGE_SNAPSHOT_KEY, jsonPayload);
      savedToLocalStorage = true;
    }
  } catch {
    // Ignore storage quota errors
  }

  try {
    if (typeof window !== 'undefined' && 'caches' in window) {
      const cache = await window.caches.open(ADVISORY_CACHE_NAME);
      const response = new Response(jsonPayload, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-JalMitra-Cache-Timestamp': snapshot.syncedAtIso,
        },
      });
      await cache.put(ADVISORY_CACHE_ENDPOINT, response);
      savedToCacheStorage = true;
    }

    if (
      typeof navigator !== 'undefined' &&
      'serviceWorker' in navigator &&
      navigator.serviceWorker.controller
    ) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_ADVISORY_SNAPSHOT',
        payload: snapshot,
      });
    }
  } catch {
    // Ignore CacheStorage errors in restricted environments
  }

  return { savedToCacheStorage, savedToLocalStorage };
}

/**
 * Reads the latest cached advisory snapshot from CacheStorage or localStorage.
 */
export async function loadCachedAdvisorySnapshot(): Promise<OfflineAdvisorySnapshot | null> {
  try {
    if (typeof window !== 'undefined' && 'caches' in window) {
      const cache = await window.caches.open(ADVISORY_CACHE_NAME);
      const match = await cache.match(ADVISORY_CACHE_ENDPOINT);
      if (match) {
        const parsed = (await match.json()) as OfflineAdvisorySnapshot;
        if (parsed && parsed.selectedTalukaId && parsed.activeEntry) {
          return parsed;
        }
      }
    }
  } catch {
    // Fall back to localStorage
  }

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(LOCAL_STORAGE_SNAPSHOT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as OfflineAdvisorySnapshot;
        if (parsed && parsed.selectedTalukaId && parsed.activeEntry) {
          return parsed;
        }
      }
    }
  } catch {
    // Ignore parse errors
  }

  return null;
}
