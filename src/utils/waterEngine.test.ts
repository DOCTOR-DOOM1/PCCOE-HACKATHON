import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateWaterStress,
  calculateIrrigationAdvisory,
  calculateVillageWaterBudget,
  filterAndSortTalukas,
  formatNotificationPayloads,
  evaluateTalukaHighPriorityAlert,
  buildAquiferTrajectorySeries,
  calculateMonsoonArrivalCountdown,
  buildCropClimateCalendarData,
  type TalukaRecord,
} from './waterEngine';
import { buildOfflineAdvisorySnapshot } from './offlineAdvisoryCache';

const sampleTaluka: TalukaRecord = {
  id: 'ausa-latur',
  Region: 'Marathwada',
  name: { en: 'Ausa', mr: 'औसा', hi: 'औसा' },
  district: { en: 'Latur', mr: 'लातूर', hi: 'लातूर' },
  soilMoisturePct: 21,
  groundwaterDepletionPct: 14.5,
  groundwaterDepthMeters: 18.4,
  rainForecast7dMm: 18,
  rainExpectedDay: { en: 'Thursday', mr: 'गुरुवारी', hi: 'गुरुवार' },
  dailyRainMm: [0, 0, 2, 12, 4, 0, 0],
  ndviScore: 0.34,
  dominantCrop: 'soybean',
  soilType: {
    en: 'Medium to Deep Black Regur Soil',
    mr: 'मध्यम ते भारी काळी कसदार जमीन',
    hi: 'मध्यम से गहरी काली रेगुर मिट्टी',
  },
  kvkCenter: {
    en: 'KVK Latur (Manjara)',
    mr: 'कृषी विज्ञान केंद्र, लातूर (मांजरा)',
    hi: 'कृषि विज्ञान केंद्र, लातूर (मांजरा)',
  },
  kvkCitationCode: 'KVK-LTR-2026-IR09',
  aquiferTrend6m: [11.2, 12.8, 14.1, 15.6, 17.0, 18.4],
  mapX: 555,
  mapY: 410,
  farmersEnrolled: 1840,
  villageDemandMld: 4.8,
  rechargeCapacityMld: 3.3,
  droughtLeadDays: 14,
};

test('evaluateWaterStress maps low stress to #06ce06, mild intermediate to #74c328, and moderate stress to #d3b44a', () => {
  const low = evaluateWaterStress(46, 2, 24, 0.68);
  assert.equal(low.level, 'low');
  assert.equal(low.colorHex, '#06ce06');

  const mild = evaluateWaterStress(35, 8.6, 22, 0.56);
  assert.equal(mild.level, 'mild');
  assert.equal(mild.colorHex, '#74c328');

  const moderate = evaluateWaterStress(31, 9, 10, 0.50);
  assert.equal(moderate.level, 'moderate');
  assert.equal(moderate.colorHex, '#d3b44a');

  const severe = evaluateWaterStress(16, 18, 0, 0.28);
  assert.ok(severe.level === 'high' || severe.level === 'critical');
  assert.ok(severe.score > 60);
});

test('calculateIrrigationAdvisory delays irrigation when rain >= 14mm and computes positive water savings', () => {
  const result = calculateIrrigationAdvisory(sampleTaluka, 'cotton', 3, 'flood');
  assert.equal(result.delayDaysRecommended, 3);
  assert.ok(result.litersSavedPerCycle > 100000);
  assert.ok(result.waterSavedPct >= 45);
  assert.ok(result.vernacularAdvisory.en.includes('Delay irrigation 3 days'));
  assert.ok(result.vernacularAdvisory.mr.includes('सिंचन 3 दिवस पुढे ढकला'));
  assert.ok(result.vernacularAdvisory.hi.includes('सिंचाई 3 दिन टालें'));
});

test('formatNotificationPayloads generates concise location-specific SMS and WhatsApp advisories in English, Marathi, and Hindi', () => {
  const advisory = calculateIrrigationAdvisory(sampleTaluka, 'soybean', 3, 'flood');
  const payloads = formatNotificationPayloads(sampleTaluka, advisory, null);

  assert.ok(payloads.smsText.en.includes('JalMitra [Ausa]'));
  assert.ok(payloads.smsText.mr.includes('जलमित्र [औसा]'));
  assert.ok(payloads.smsText.hi.includes('जलमित्र [औसा]'));

  assert.ok(payloads.whatsappText.mr.includes('औसा, जि. लातूर'));
  assert.ok(payloads.whatsappText.hi.includes('औसा, जिला लातूर'));
  assert.equal(payloads.actionBullets.mr.length, 3);
});

test('calculateVillageWaterBudget improves deficit balance when drip adoption target increases', () => {
  const lowAdoption = calculateVillageWaterBudget(sampleTaluka, 20);
  const highAdoption = calculateVillageWaterBudget(sampleTaluka, 80);
  assert.ok(highAdoption.projectedSavingsMldWithDrip > lowAdoption.projectedSavingsMldWithDrip);
  assert.ok(highAdoption.postInterventionBalanceMld > lowAdoption.postInterventionBalanceMld);
});

test('filterAndSortTalukas filters by region and multilingual query', () => {
  const list = [sampleTaluka];
  assert.equal(filterAndSortTalukas(list, 'Marathwada', 'all', 'लातूर').length, 1);
  assert.equal(filterAndSortTalukas(list, 'Vidarbha', 'all', '').length, 0);
});

test('evaluateTalukaHighPriorityAlert generates localized high-priority weather and drought alerts', () => {
  const combinedAlert = evaluateTalukaHighPriorityAlert(sampleTaluka);
  assert.ok(combinedAlert !== null);
  assert.equal(combinedAlert.alertType, 'combined');
  assert.ok(combinedAlert.title.en.includes('Ausa'));
  assert.ok(combinedAlert.title.mr.includes('औसा'));
  assert.ok(combinedAlert.title.hi.includes('औसा'));

  const dryDroughtTaluka: TalukaRecord = {
    ...sampleTaluka,
    id: 'sangola-solapur',
    soilMoisturePct: 16,
    groundwaterDepletionPct: 18.2,
    rainForecast7dMm: 4,
  };
  const droughtAlert = evaluateTalukaHighPriorityAlert(dryDroughtTaluka);
  assert.ok(droughtAlert !== null);
  assert.equal(droughtAlert.alertType, 'drought');
  assert.equal(droughtAlert.accentHex, '#c92a2a');
});

test('buildOfflineAdvisorySnapshot serializes latest advisory and multilingual SMS/WhatsApp payloads for offline access', () => {
  const snapshot = buildOfflineAdvisorySnapshot(
    [sampleTaluka],
    sampleTaluka,
    'soybean',
    3,
    'flood',
    '2026-11-08T00:00:00.000Z'
  );
  assert.equal(snapshot.selectedTalukaId, 'ausa-latur');
  assert.equal(snapshot.cachedTalukaCount, 1);
  assert.ok(snapshot.activeEntry.vernacularAdvisory.mr.includes('औसा'));
  assert.ok(snapshot.activeEntry.smsPayload.hi.includes('जलमित्र [औसा]'));
});

test('buildAquiferTrajectorySeries generates 6-month historical and conserved groundwater trajectory points', () => {
  const seriesMr = buildAquiferTrajectorySeries(sampleTaluka, 65, 'mr');
  assert.equal(seriesMr.length, 6);
  assert.equal(seriesMr[0].monthLabel, 'जून');
  assert.equal(seriesMr[5].baselineDepthM, 18.4);
  assert.ok(seriesMr[5].conservedDepthM < seriesMr[5].baselineDepthM);
  assert.ok(seriesMr[5].waterTableSavedM > 2.5);
});

test('calculateMonsoonArrivalCountdown computes days, hours, minutes, seconds and regional onset telemetry', () => {
  const countdown0 = calculateMonsoonArrivalCountdown(sampleTaluka, 0);
  const countdown1 = calculateMonsoonArrivalCountdown(sampleTaluka, 1);
  assert.equal(countdown0.region, 'Marathwada');
  assert.equal(countdown0.daysLeft, 3);
  assert.equal(countdown1.secondsLeft, countdown0.secondsLeft - 1);
  assert.ok(countdown0.regionLabel.mr.includes('मराठवाडा'));
});

test('buildCropClimateCalendarData maps 12 monthly rainfall buckets and filters seasonal crop windows', () => {
  const allData = buildCropClimateCalendarData(sampleTaluka, 'all', 'mr');
  assert.equal(allData.months.length, 12);
  assert.equal(allData.months[0].monthShort, 'जून');
  assert.equal(allData.crops.length, 6);
  assert.ok(allData.annualExpectedRainMm > 400);

  const kharifOnly = buildCropClimateCalendarData(sampleTaluka, 'kharif', 'en');
  assert.equal(kharifOnly.crops.length, 3);
  assert.ok(kharifOnly.crops.every((c) => c.season === 'kharif'));
  assert.equal(kharifOnly.crops[0].monthlyStages.length, 12);
});
