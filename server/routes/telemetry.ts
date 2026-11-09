/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Telemetry Route — Serves taluka data and weather forecasts
 *   GET /api/telemetry/talukas
 *   GET /api/telemetry/weather/:talukaId
 */

import { Router, type Request, type Response } from 'express';

type Language = 'en' | 'mr' | 'hi';

interface TalukaData {
  id: string;
  Region: string;
  name: Record<Language, string>;
  district: Record<Language, string>;
  soilMoisturePct: number;
  groundwaterDepletionPct: number;
  groundwaterDepthMeters: number;
  rainForecast7dMm: number;
  rainExpectedDay: Record<Language, string>;
  dailyRainMm: number[];
  ndviScore: number;
  dominantCrop: string;
  soilType: Record<Language, string>;
  kvkCenter: Record<Language, string>;
  kvkCitationCode: string;
  aquiferTrend6m: number[];
  mapX: number;
  mapY: number;
  farmersEnrolled: number;
  villageDemandMld: number;
  rechargeCapacityMld: number;
  droughtLeadDays: number;
}

// ── Taluka Data (mirrors frontend maharashtraData.ts) ─────────
const TALUKAS: TalukaData[] = [
  {
    id: 'ausa-latur', Region: 'Marathwada',
    name: { en: 'Ausa', mr: 'औसा', hi: 'औसा' },
    district: { en: 'Latur', mr: 'लातूर', hi: 'लातूर' },
    soilMoisturePct: 21, groundwaterDepletionPct: 14.5, groundwaterDepthMeters: 18.4,
    rainForecast7dMm: 18, rainExpectedDay: { en: 'Thursday', mr: 'गुरुवारी', hi: 'गुरुवार' },
    dailyRainMm: [0,0,2,12,4,0,0], ndviScore: 0.34, dominantCrop: 'soybean',
    soilType: { en: 'Medium to Deep Black Regur Soil', mr: 'मध्यम ते भारी काळी कसदार जमीन', hi: 'मध्यम से गहरी काली रेगुर मिट्टी' },
    kvkCenter: { en: 'KVK Latur (Manjara)', mr: 'कृषी विज्ञान केंद्र, लातूर (मांजरा)', hi: 'कृषि विज्ञान केंद्र, लातूर (मांजरा)' },
    kvkCitationCode: 'KVK-LTR-2026-IR09', aquiferTrend6m: [11.2,12.8,14.1,15.6,17.0,18.4],
    mapX: 555, mapY: 410, farmersEnrolled: 1840, villageDemandMld: 4.8, rechargeCapacityMld: 3.3, droughtLeadDays: 14,
  },
  {
    id: 'parli-beed', Region: 'Marathwada',
    name: { en: 'Parli Vaijnath', mr: 'परळी वैजनाथ', hi: 'परली वैजनाथ' },
    district: { en: 'Beed', mr: 'बीड', hi: 'बीड' },
    soilMoisturePct: 16, groundwaterDepletionPct: 18.2, groundwaterDepthMeters: 22.6,
    rainForecast7dMm: 4, rainExpectedDay: { en: 'Saturday', mr: 'शनिवारी', hi: 'शनिवार' },
    dailyRainMm: [0,0,0,0,1,3,0], ndviScore: 0.26, dominantCrop: 'cotton',
    soilType: { en: 'Shallow to Medium Black Basaltic Soil', mr: 'हलकी ते मध्यम काळी जमीन', hi: 'उथली से मध्यम काली बेसाल्टिक मिट्टी' },
    kvkCenter: { en: 'KVK Ambajogai (Beed)', mr: 'कृषी विज्ञान केंद्र, अंबाजोगाई (बीड)', hi: 'कृषि विज्ञान केंद्र, अंबाजोगाई (बीड)' },
    kvkCitationCode: 'KVK-BED-2026-CT14', aquiferTrend6m: [14.0,15.8,17.4,19.1,20.9,22.6],
    mapX: 435, mapY: 350, farmersEnrolled: 2310, villageDemandMld: 5.4, rechargeCapacityMld: 3.1, droughtLeadDays: 16,
  },
  {
    id: 'tuljapur-dharashiv', Region: 'Marathwada',
    name: { en: 'Tuljapur', mr: 'तुळजापूर', hi: 'तुलजापुर' },
    district: { en: 'Dharashiv', mr: 'धाराशिव', hi: 'धाराशिव' },
    soilMoisturePct: 19, groundwaterDepletionPct: 15.8, groundwaterDepthMeters: 19.7,
    rainForecast7dMm: 15, rainExpectedDay: { en: 'Thursday', mr: 'गुरुवारी', hi: 'गुरुवार' },
    dailyRainMm: [0,1,0,11,3,0,0], ndviScore: 0.31, dominantCrop: 'tur',
    soilType: { en: 'Medium Black Gravelly Soil', mr: 'मध्यम काळी मुरमाड जमीन', hi: 'मध्यम काली पथरीली मिट्टी' },
    kvkCenter: { en: 'KVK Tuljapur (Dharashiv)', mr: 'कृषी विज्ञान केंद्र, तुळजापूर', hi: 'कृषि विज्ञान केंद्र, तुलजापुर' },
    kvkCitationCode: 'KVK-DHR-2026-TR04', aquiferTrend6m: [12.5,13.9,15.2,16.8,18.1,19.7],
    mapX: 450, mapY: 435, farmersEnrolled: 1590, villageDemandMld: 4.2, rechargeCapacityMld: 2.9, droughtLeadDays: 15,
  },
  {
    id: 'paithan-sambhajinagar', Region: 'Marathwada',
    name: { en: 'Paithan', mr: 'पैठण', hi: 'पैठण' },
    district: { en: 'Chh. Sambhajinagar', mr: 'छ. संभाजीनगर', hi: 'छ. संभाजीनगर' },
    soilMoisturePct: 33, groundwaterDepletionPct: 9.4, groundwaterDepthMeters: 13.2,
    rainForecast7dMm: 22, rainExpectedDay: { en: 'Wednesday', mr: 'बुधवारी', hi: 'बुधवार' },
    dailyRainMm: [0,4,14,4,0,0,0], ndviScore: 0.51, dominantCrop: 'cotton',
    soilType: { en: 'Deep Alluvial Godavari Basin Clay', mr: 'गोदावरी खोऱ्यातील खोल काळी जमीन', hi: 'गोदावरी बेसिन की गहरी जलोढ़ मिट्टी' },
    kvkCenter: { en: 'KVK Paithan Road (VNMKV)', mr: 'कृषी विज्ञान केंद्र, पैठण रोड', hi: 'कृषि विज्ञान केंद्र, पैठण रोड' },
    kvkCitationCode: 'KVK-CSN-2026-GD11', aquiferTrend6m: [9.8,10.4,11.1,11.9,12.6,13.2],
    mapX: 345, mapY: 255, farmersEnrolled: 2150, villageDemandMld: 5.1, rechargeCapacityMld: 4.3, droughtLeadDays: 12,
  },
  {
    id: 'jintur-parbhani', Region: 'Marathwada',
    name: { en: 'Jintur', mr: 'जिंतूर', hi: 'जिंतूर' },
    district: { en: 'Parbhani', mr: 'परभणी', hi: 'परभणी' },
    soilMoisturePct: 28, groundwaterDepletionPct: 11.8, groundwaterDepthMeters: 15.5,
    rainForecast7dMm: 16, rainExpectedDay: { en: 'Thursday', mr: 'गुरुवारी', hi: 'गुरुवार' },
    dailyRainMm: [0,0,3,10,3,0,0], ndviScore: 0.44, dominantCrop: 'soybean',
    soilType: { en: 'Deep Vertisol Black Cotton Soil', mr: 'भारी काळी कापसाची जमीन', hi: 'गहरी काली कपास मिट्टी (वर्टिसोल)' },
    kvkCenter: { en: 'KVK Parbhani (VNMKV)', mr: 'कृषी विज्ञान केंद्र, परभणी', hi: 'कृषि विज्ञान केंद्र, परभणी' },
    kvkCitationCode: 'KVK-PRB-2026-SB07', aquiferTrend6m: [10.6,11.5,12.4,13.5,14.6,15.5],
    mapX: 485, mapY: 285, farmersEnrolled: 1680, villageDemandMld: 4.4, rechargeCapacityMld: 3.5, droughtLeadDays: 13,
  },
  {
    id: 'pusad-yavatmal', Region: 'Vidarbha',
    name: { en: 'Pusad', mr: 'पुसद', hi: 'पुसद' },
    district: { en: 'Yavatmal', mr: 'यवतमाळ', hi: 'यवतमाल' },
    soilMoisturePct: 24, groundwaterDepletionPct: 13.2, groundwaterDepthMeters: 16.9,
    rainForecast7dMm: 19, rainExpectedDay: { en: 'Friday', mr: 'शुक्रवारी', hi: 'शुक्रवार' },
    dailyRainMm: [0,0,0,5,11,3,0], ndviScore: 0.39, dominantCrop: 'cotton',
    soilType: { en: 'Clayey Calcareous Black Soil', mr: 'चुनखडीयुक्त मध्यम काळी जमीन', hi: 'चूनायुक्त काली चिकनी मिट्टी' },
    kvkCenter: { en: 'KVK Yavatmal (Dr. PDKV)', mr: 'कृषी विज्ञान केंद्र, यवतमाळ (डॉ. पंदेकृवि)', hi: 'कृषि विज्ञान केंद्र, यवतमाल' },
    kvkCitationCode: 'KVK-YTL-2026-CT22', aquiferTrend6m: [11.0,12.1,13.3,14.5,15.8,16.9],
    mapX: 635, mapY: 255, farmersEnrolled: 2490, villageDemandMld: 5.0, rechargeCapacityMld: 3.6, droughtLeadDays: 14,
  },
  {
    id: 'akot-akola', Region: 'Vidarbha',
    name: { en: 'Akot', mr: 'अकोले / अकोट', hi: 'अकोट' },
    district: { en: 'Akola', mr: 'अकोला', hi: 'अकोला' },
    soilMoisturePct: 34, groundwaterDepletionPct: 8.6, groundwaterDepthMeters: 12.4,
    rainForecast7dMm: 26, rainExpectedDay: { en: 'Thursday', mr: 'गुरुवारी', hi: 'गुरुवार' },
    dailyRainMm: [0,2,6,14,4,0,0], ndviScore: 0.56, dominantCrop: 'soybean',
    soilType: { en: 'Purna Valley Deep Alluvial Soil', mr: 'पूर्णा खोऱ्यातील सखोल गाळाची जमीन', hi: 'पूर्णा घाटी की गहरी जलोढ़ मिट्टी' },
    kvkCenter: { en: 'KVK Akola (Dr. PDKV)', mr: 'कृषी विज्ञान केंद्र, अकोला', hi: 'कृषि विज्ञान केंद्र, अकोला' },
    kvkCitationCode: 'KVK-AKL-2026-PV03', aquiferTrend6m: [9.4,9.9,10.5,11.2,11.8,12.4],
    mapX: 495, mapY: 135, farmersEnrolled: 1920, villageDemandMld: 4.1, rechargeCapacityMld: 3.7, droughtLeadDays: 11,
  },
  {
    id: 'karanja-washim', Region: 'Vidarbha',
    name: { en: 'Karanja Lad', mr: 'कारंजा लाड', hi: 'कारंजा लाड' },
    district: { en: 'Washim', mr: 'वाशिम', hi: 'वाशिम' },
    soilMoisturePct: 44, groundwaterDepletionPct: 3.8, groundwaterDepthMeters: 8.9,
    rainForecast7dMm: 32, rainExpectedDay: { en: 'Wednesday', mr: 'बुधवारी', hi: 'बुधवार' },
    dailyRainMm: [2,8,15,7,0,0,0], ndviScore: 0.69, dominantCrop: 'tur',
    soilType: { en: 'Moisture-Retentive Black Loam', mr: 'ओलावा टिकवणारी काळी कसदार जमीन', hi: 'नमी सोखने वाली काली दोमट मिट्टी' },
    kvkCenter: { en: 'KVK Karda (Washim)', mr: 'कृषी विज्ञान केंद्र, करडा (वाशिम)', hi: 'कृषि विज्ञान केंद्र, करडा (वाशिम)' },
    kvkCitationCode: 'KVK-WSH-2026-BB18', aquiferTrend6m: [7.8,8.0,8.2,8.5,8.7,8.9],
    mapX: 545, mapY: 198, farmersEnrolled: 1470, villageDemandMld: 3.5, rechargeCapacityMld: 3.8, droughtLeadDays: 9,
  },
  {
    id: 'morshi-amravati', Region: 'Vidarbha',
    name: { en: 'Morshi', mr: 'मोर्शी', hi: 'मोर्शी' },
    district: { en: 'Amravati', mr: 'अमरावती', hi: 'अमरावती' },
    soilMoisturePct: 47, groundwaterDepletionPct: 2.4, groundwaterDepthMeters: 7.6,
    rainForecast7dMm: 35, rainExpectedDay: { en: 'Wednesday', mr: 'बुधवारी', hi: 'बुधवार' },
    dailyRainMm: [4,12,14,5,0,0,0], ndviScore: 0.74, dominantCrop: 'soybean',
    soilType: { en: 'Upper Wardha Basin Loamy Clay', mr: 'अप्पर वर्धा खोऱ्यातील सुपीक जमीन', hi: 'अपर वर्धा बेसिन की उपजाऊ दोमट मिट्टी' },
    kvkCenter: { en: 'KVK Durgapur (Amravati)', mr: 'कृषी विज्ञान केंद्र, दुर्गापूर (अमरावती)', hi: 'कृषि विज्ञान केंद्र, दुर्गापुर (अमरावती)' },
    kvkCitationCode: 'KVK-AMR-2026-WD05', aquiferTrend6m: [7.0,7.1,7.2,7.4,7.5,7.6],
    mapX: 640, mapY: 125, farmersEnrolled: 1750, villageDemandMld: 3.8, rechargeCapacityMld: 4.2, droughtLeadDays: 8,
  },
  {
    id: 'sangola-solapur', Region: 'Western Maharashtra',
    name: { en: 'Sangola', mr: 'सांगोला', hi: 'सांगोला' },
    district: { en: 'Solapur', mr: 'सोलापूर', hi: 'सोलापुर' },
    soilMoisturePct: 15, groundwaterDepletionPct: 19.5, groundwaterDepthMeters: 24.2,
    rainForecast7dMm: 3, rainExpectedDay: { en: 'Sunday', mr: 'रविवारी', hi: 'रविवार' },
    dailyRainMm: [0,0,0,0,0,1,2], ndviScore: 0.25, dominantCrop: 'pomegranate',
    soilType: { en: 'Light Murum Well-Drained Red-Black Soil', mr: 'हलकी मुरमाड निचऱ्याची जमीन', hi: 'हल्की मुरम वाली लाल-काली मिट्टी' },
    kvkCenter: { en: 'KVK Solapur (Mohol)', mr: 'कृषी विज्ञान केंद्र, सोलापूर (मोहोळ)', hi: 'कृषि विज्ञान केंद्र, सोलापुर (मोहोल)' },
    kvkCitationCode: 'KVK-SLP-2026-PM02', aquiferTrend6m: [15.4,17.1,18.9,20.6,22.5,24.2],
    mapX: 345, mapY: 430, farmersEnrolled: 2680, villageDemandMld: 5.9, rechargeCapacityMld: 3.2, droughtLeadDays: 18,
  },
  {
    id: 'baramati-pune', Region: 'Western Maharashtra',
    name: { en: 'Baramati', mr: 'बारामती', hi: 'बारामती' },
    district: { en: 'Pune', mr: 'पुणे', hi: 'पुणे' },
    soilMoisturePct: 32, groundwaterDepletionPct: 10.2, groundwaterDepthMeters: 14.1,
    rainForecast7dMm: 12, rainExpectedDay: { en: 'Friday', mr: 'शुक्रवारी', hi: 'शुक्रवार' },
    dailyRainMm: [0,0,1,3,6,2,0], ndviScore: 0.54, dominantCrop: 'sugarcane',
    soilType: { en: 'Nira-Karha Basin Medium Black Soil', mr: 'निरा-कऱ्हा खोऱ्यातील मध्यम काळी जमीन', hi: 'नीरा-कर्हा बेसिन की मध्यम काली मिट्टी' },
    kvkCenter: { en: 'KVK Baramati (Shardanagar)', mr: 'कृषी विज्ञान केंद्र, बारामती (शारदानगर)', hi: 'कृषि विज्ञान केंद्र, बारामती (शारदानगर)' },
    kvkCitationCode: 'KVK-BRM-2026-SC01', aquiferTrend6m: [10.2,11.0,11.8,12.6,13.4,14.1],
    mapX: 235, mapY: 365, farmersEnrolled: 3120, villageDemandMld: 6.4, rechargeCapacityMld: 5.1, droughtLeadDays: 14,
  },
  {
    id: 'parner-ahilyanagar', Region: 'Western Maharashtra',
    name: { en: 'Parner', mr: 'पारनेर', hi: 'पारनेर' },
    district: { en: 'Ahilyanagar', mr: 'अहिल्यानगर', hi: 'अहिल्यानगर' },
    soilMoisturePct: 23, groundwaterDepletionPct: 13.6, groundwaterDepthMeters: 17.5,
    rainForecast7dMm: 9, rainExpectedDay: { en: 'Friday', mr: 'शुक्रवारी', hi: 'शुक्रवार' },
    dailyRainMm: [0,0,0,2,5,2,0], ndviScore: 0.38, dominantCrop: 'onion',
    soilType: { en: 'Rain-Shadow Shallow Loamy Soil', mr: 'पर्जन्यछायेतील हलकी ते मध्यम जमीन', hi: 'वृष्टिछाया क्षेत्र की उथली दोमट मिट्टी' },
    kvkCenter: { en: 'KVK Babhaleshwar (Ahilyanagar)', mr: 'कृषी विज्ञान केंद्र, बाभळेश्वर (अहिल्यानगर)', hi: 'कृषि विज्ञान केंद्र, बाभलेश्वर (अहिल्यानगर)' },
    kvkCitationCode: 'KVK-AHN-2026-ON12', aquiferTrend6m: [11.8,12.9,14.0,15.2,16.4,17.5],
    mapX: 235, mapY: 295, farmersEnrolled: 2240, villageDemandMld: 4.9, rechargeCapacityMld: 3.5, droughtLeadDays: 15,
  },
  {
    id: 'jat-sangli', Region: 'Western Maharashtra',
    name: { en: 'Jat', mr: 'जत', hi: 'जत' },
    district: { en: 'Sangli', mr: 'सांगली', hi: 'सांगली' },
    soilMoisturePct: 17, groundwaterDepletionPct: 16.9, groundwaterDepthMeters: 21.3,
    rainForecast7dMm: 5, rainExpectedDay: { en: 'Saturday', mr: 'शनिवारी', hi: 'शनिवार' },
    dailyRainMm: [0,0,0,0,2,3,0], ndviScore: 0.29, dominantCrop: 'pomegranate',
    soilType: { en: 'Arid Plateau Gravelly Red-Brown Soil', mr: 'दुष्काळी पठारी मुरमाड जमीन', hi: 'शुष्क पठारी पथरीली लाल-भूरी मिट्टी' },
    kvkCenter: { en: 'KVK Sangli (Digraj)', mr: 'कृषी विज्ञान केंद्र, सांगली (दिग्रज)', hi: 'कृषि विज्ञान केंद्र, सांगली (दिग्रज)' },
    kvkCitationCode: 'KVK-SNG-2026-PM08', aquiferTrend6m: [13.9,15.3,16.8,18.2,19.8,21.3],
    mapX: 295, mapY: 490, farmersEnrolled: 1980, villageDemandMld: 4.6, rechargeCapacityMld: 2.8, droughtLeadDays: 17,
  },
  {
    id: 'maan-satara', Region: 'Western Maharashtra',
    name: { en: 'Maan (Dahiwadi)', mr: 'माण (दहिवडी)', hi: 'माण (दहिवडी)' },
    district: { en: 'Satara', mr: 'सातारा', hi: 'सातारा' },
    soilMoisturePct: 45, groundwaterDepletionPct: 3.2, groundwaterDepthMeters: 9.1,
    rainForecast7dMm: 28, rainExpectedDay: { en: 'Thursday', mr: 'गुरुवारी', hi: 'गुरुवार' },
    dailyRainMm: [1,4,8,12,3,0,0], ndviScore: 0.67, dominantCrop: 'onion',
    soilType: { en: 'Watershed Recharged Silty Loam', mr: 'पाणलोट उपचारित सुपीक गाळाची जमीन', hi: 'जलग्रहण उपचारित उपजाऊ दोमट मिट्टी' },
    kvkCenter: { en: 'KVK Borgaon (Satara)', mr: 'कृषी विज्ञान केंद्र, बोरगाव (सातारा)', hi: 'कृषि विज्ञान केंद्र, बोरगांव (सातारा)' },
    kvkCitationCode: 'KVK-STR-2026-WS15', aquiferTrend6m: [8.4,8.5,8.7,8.8,9.0,9.1],
    mapX: 195, mapY: 440, farmersEnrolled: 2050, villageDemandMld: 3.7, rechargeCapacityMld: 4.1, droughtLeadDays: 10,
  },
  {
    id: 'niphad-nashik', Region: 'Khandesh',
    name: { en: 'Niphad', mr: 'निफाड', hi: 'निफाड' },
    district: { en: 'Nashik', mr: 'नाशिक', hi: 'नाशिक' },
    soilMoisturePct: 46, groundwaterDepletionPct: 2.9, groundwaterDepthMeters: 8.4,
    rainForecast7dMm: 27, rainExpectedDay: { en: 'Wednesday', mr: 'बुधवारी', hi: 'बुधवार' },
    dailyRainMm: [2,7,13,5,0,0,0], ndviScore: 0.71, dominantCrop: 'onion',
    soilType: { en: 'Godavari Upper Valley Well-Drained Loam', mr: 'गोदावरी खोऱ्यातील निचऱ्याची सुपीक जमीन', hi: 'गोदावरी ऊपरी घाटी की सुअपवाहित दोमट मिट्टी' },
    kvkCenter: { en: 'KVK Malegaon / Nashik (MPKV)', mr: 'कृषी विज्ञान केंद्र, नाशिक (राहुरी विद्यापीठ)', hi: 'कृषि विज्ञान केंद्र, नाशिक' },
    kvkCitationCode: 'KVK-NSK-2026-ON06', aquiferTrend6m: [7.6,7.8,7.9,8.1,8.2,8.4],
    mapX: 185, mapY: 195, farmersEnrolled: 2890, villageDemandMld: 4.5, rechargeCapacityMld: 4.9, droughtLeadDays: 9,
  },
  {
    id: 'raver-jalgaon', Region: 'Khandesh',
    name: { en: 'Raver', mr: 'रावेर', hi: 'रावेर' },
    district: { en: 'Jalgaon', mr: 'जळगाव', hi: 'जलगांव' },
    soilMoisturePct: 31, groundwaterDepletionPct: 10.8, groundwaterDepthMeters: 15.2,
    rainForecast7dMm: 14, rainExpectedDay: { en: 'Thursday', mr: 'गुरुवारी', hi: 'गुरुवार' },
    dailyRainMm: [0,1,3,8,2,0,0], ndviScore: 0.52, dominantCrop: 'cotton',
    soilType: { en: 'Tapi Basin Deep Black Alluvial Soil', mr: 'तापी खोऱ्यातील खोल काळी जमीन', hi: 'तापी बेसिन की गहरी काली जलोढ़ मिट्टी' },
    kvkCenter: { en: 'KVK Pal (Raver, Jalgaon)', mr: 'कृषी विज्ञान केंद्र, पाल (रावेर, जळगाव)', hi: 'कृषि विज्ञान केंद्र, पाल (रावेर, जलगांव)' },
    kvkCitationCode: 'KVK-JLG-2026-TP19', aquiferTrend6m: [11.4,12.1,12.9,13.7,14.5,15.2],
    mapX: 355, mapY: 125, farmersEnrolled: 2410, villageDemandMld: 5.2, rechargeCapacityMld: 4.1, droughtLeadDays: 13,
  },
];

// Build fast lookup map exported for other routes
export const TALUKA_LOOKUP: Record<string, TalukaData> = {};
for (const t of TALUKAS) {
  TALUKA_LOOKUP[t.id] = t;
}

const router = Router();

// GET /api/telemetry/talukas
router.get('/talukas', (_req: Request, res: Response) => {
  return res.json({
    count: TALUKAS.length,
    talukas: TALUKAS,
  });
});

// GET /api/telemetry/weather/:talukaId
router.get('/weather/:talukaId', (req: Request, res: Response) => {
  const { talukaId } = req.params;
  const taluka = TALUKA_LOOKUP[talukaId];

  if (!taluka) {
    return res.status(404).json({ error: `Taluka '${talukaId}' not found` });
  }

  return res.json({
    talukaId: taluka.id,
    talukaName: taluka.name,
    district: taluka.district,
    region: taluka.Region,
    forecast: {
      rainForecast7dMm: taluka.rainForecast7dMm,
      rainExpectedDay: taluka.rainExpectedDay,
      dailyRainMm: taluka.dailyRainMm,
      soilMoisturePct: taluka.soilMoisturePct,
      ndviScore: taluka.ndviScore,
      groundwaterDepthMeters: taluka.groundwaterDepthMeters,
      groundwaterDepletionPct: taluka.groundwaterDepletionPct,
      aquiferTrend6m: taluka.aquiferTrend6m,
    },
    sources: ['IMD Pune', 'ISRO NRSC Bhuvan', 'CGWB'],
    lastUpdated: new Date().toISOString(),
  });
});

export default router;

