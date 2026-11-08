import type { Language } from '../utils/waterEngine';

export interface UITranslations {
  brandTitle: string;
  navHeatMap: string;
  navAdvisory: string;
  navDiagnostics: string;
  navCommittee: string;
  ctaSendAdvisory: string;
  languageSelectorLabel: string;
  heroKicker: string;
  heroHeadline: string;
  heroSubheadline: string;
  // KPI card titles & values
  kpiTitleWaterSaved: string;
  kpiLitersSavedLabel: string;
  kpiLitersSavedSub: string;
  kpiTitleDroughtLead: string;
  kpiDroughtLeadLabel: string;
  kpiDroughtLeadSub: string;
  kpiTitleFarmersReach: string;
  kpiFarmersCoveredLabel: string;
  kpiFarmersCoveredSub: string;
  kpiTitleKvkGrounded: string;
  kpiKvkGroundedLabel: string;
  kpiKvkGroundedSub: string;
  // Heat Map section
  heatMapSectionTitle: string;
  heatMapSectionSubtitle: string;
  viewModeMap: string;
  viewModeMatrix: string;
  filterRegionAll: string;
  regionMarathwada: string;
  regionVidarbha: string;
  regionWesternMh: string;
  regionKhandesh: string;
  filterStressAll: string;
  searchPlaceholder: string;
  metricTabStress: string;
  metricTabSoil: string;
  metricTabAquifer: string;
  metricTabRain: string;
  // 5-Band Accessible Legend
  legendTitle: string;
  legendSubtitle: string;
  legendLow: string;
  legendMild: string;
  legendModerate: string;
  legendHigh: string;
  legendCritical: string;
  // Map & Tooltip Labels
  mapHeaderSubtitle: string;
  talukasActiveSuffix: string;
  activeTalukaPrefix: string;
  basinKhandesh: string;
  basinVidarbha: string;
  basinMarathwada: string;
  basinWesternMh: string;
  tooltipScoreLabel: string;
  tooltipSoilMoisture: string;
  tooltipGwDrop: string;
  tooltipRain7d: string;
  tooltipActionLabel: string;
  tooltipClickToInspect: string;
  quickSelectLabel: string;
  subBasinTableTitle: string;
  subBasinColRegion: string;
  subBasinColMoisture: string;
  subBasinColGwDrop: string;
  subBasinColRain: string;
  // Taluka Inspector & Calculator
  metricSoilMoisture: string;
  metricGwDepletion: string;
  metricRainForecast: string;
  metricNdvi: string;
  metricWaterTable: string;
  rainWindowHeader: string;
  rainPeakPrefix: string;
  nugenAdvisoryHeading: string;
  kvkGroundedHeading: string;
  calculatorTitle: string;
  selectCropLabel: string;
  fieldAreaAcresLabel: string;
  currentMethodLabel: string;
  methodFlood: string;
  methodSprinkler: string;
  methodDrip: string;
  beforeWaterLabel: string;
  afterWaterLabel: string;
  seasonSavingsLabel: string;
  droughtBufferLabel: string;
  // SMS & WhatsApp Notification Hub
  notificationHubTitle: string;
  notificationHubSubtitle: string;
  channelLabel: string;
  channelWhatsapp: string;
  channelSms: string;
  channelBoth: string;
  recipientModeCohort: string;
  recipientModeSingle: string;
  farmerNameInputLabel: string;
  farmerPhoneInputLabel: string;
  phonePreviewHeading: string;
  smsPreviewHeading: string;
  sendWhatsappBtn: string;
  openWhatsappDirectBtn: string;
  whatsappDispatchedMsg: string;
  phoneValidationError: string;
  deliveryHistoryTitle: string;
  // Multimodal Diagnostics
  diagnosticsTitle: string;
  diagnosticsSubtitle: string;
  uploadCustomPhotoBtn: string;
  selectSamplePrompt: string;
  confidenceLabel: string;
  observedMoistureLabel: string;
  canopyDeltaLabel: string;
  visualFindingTitle: string;
  irrigationActionTitle: string;
  savesPerAcrePrefix: string;
  kvkExtensionProtocolTitle: string;
  applyToAdvisoryBtn: string;
  syncedAdvisoryBanner: string;
  // Village Water Committee
  committeeTitle: string;
  committeeSubtitle: string;
  activeJurisdictionLabel: string;
  dripTargetSliderLabel: string;
  dripSliderDescription: string;
  villageDemandLabel: string;
  smallholdersCountSuffix: string;
  aquiferRechargeLabel: string;
  safeExtractionSub: string;
  netBalanceLabel: string;
  droughtWarningPrefix: string;
  projectedSavingsLabel: string;
  conservedPerDaySuffix: string;
  aquiferTrajectoryTitle: string;
  aquiferTrajectorySubtitle: string;
  legendBaselineDrawdown: string;
  legendManagedDepth: string;
  waterTableProtectedSuffix: string;
  scheduleResolutionTitle: string;
  villageNameInputLabel: string;
  committeeActionSelectLabel: string;
  targetAcreageInputLabel: string;
  addResolutionBtn: string;
  validationErrorEmpty: string;
  tableColGp: string;
  tableColResolution: string;
  tableColArea: string;
  tableColSaved: string;
  footerTagline: string;
  footerSources: string;
}

export const TRANSLATIONS: Record<Language, UITranslations> = {
  en: {
    brandTitle: 'JalMitra',
    navHeatMap: 'Stress Heat Map',
    navAdvisory: 'SMS / WhatsApp Advisory',
    navDiagnostics: 'Crop Diagnostics',
    navCommittee: 'Village Committee',
    ctaSendAdvisory: 'Dispatch SMS / WhatsApp',
    languageSelectorLabel: 'Language:',
    heroKicker: 'Maharashtra Climate & Groundwater Resilience · IMD + Bhuvan ISRO + CGWB + KVK RAG',
    heroHeadline: 'Hyperlocal Groundwater & Irrigation Intelligence for Smallholder Farmers',
    heroSubheadline:
      'Turns satellite soil-moisture, district aquifer trends, and 7-day monsoon forecasts into grounded Marathi, Hindi, and English irrigation advisories — preventing crop failure and borewell depletion.',
    kpiTitleWaterSaved: 'Quantified Water Saved',
    kpiLitersSavedLabel: '48.2 Cr Liters',
    kpiLitersSavedSub: 'Water conserved across 16 pilot talukas this season',
    kpiTitleDroughtLead: 'Drought Prediction Lead',
    kpiDroughtLeadLabel: '14 Days Early',
    kpiDroughtLeadSub: 'Root-zone drought stress early warning before visible wilt',
    kpiTitleFarmersReach: 'Smallholder Reach',
    kpiFarmersCoveredLabel: '34,570 Farmers',
    kpiFarmersCoveredSub: 'Receiving bi-weekly WhatsApp & SMS advisories',
    kpiTitleKvkGrounded: 'Domain-Aligned AI (RAG)',
    kpiKvkGroundedLabel: '100% KVK Grounded',
    kpiKvkGroundedSub: 'Zero-hallucination RAG over VNMKV, PDKV & MPKV bulletins',
    heatMapSectionTitle: '01. Interactive Maharashtra Water Stress & Aquifer Heat Map',
    heatMapSectionSubtitle:
      'Hover or click any taluka on the map or matrix to inspect live Bhuvan ISRO soil moisture, CGWB groundwater depletion, and 7-day IMD rainfall relief windows.',
    viewModeMap: 'Geospatial Basin Map',
    viewModeMatrix: 'Taluka Heat Matrix',
    filterRegionAll: 'All Regions (16)',
    regionMarathwada: 'Marathwada (Godavari-Manjara)',
    regionVidarbha: 'Vidarbha (Purna-Wardha)',
    regionWesternMh: 'Western MH (Bhima-Krishna)',
    regionKhandesh: 'Khandesh (Tapi-Girna)',
    filterStressAll: 'All Stress Levels (5 Bands)',
    searchPlaceholder: 'Search taluka or district (e.g. Latur, Beed, संगोला)...',
    metricTabStress: 'Stress',
    metricTabSoil: 'Soil %',
    metricTabAquifer: 'Aquifer',
    metricTabRain: 'Rain',
    legendTitle: 'Accessible Water Stress Spectrum (#06ce06 Low Stress → #d3b44a Moderate → Critical)',
    legendSubtitle: 'Click any band to filter talukas · Hover map nodes for plain-language tooltips',
    legendLow: 'Low Stress (#06ce06) · Safe Moisture',
    legendMild: 'Mild Watch (#74c328) · Mulch & Conserve',
    legendModerate: 'Moderate Stress (#d3b44a) · Time with Rain',
    legendHigh: 'High Stress (#e07a2a) · Switch to Drip',
    legendCritical: 'Critical Depletion (#c92a2a) · Protective Pulse Only',
    mapHeaderSubtitle: 'Maharashtra River Basins & Taluka Piezometer Grid',
    talukasActiveSuffix: 'Talukas Active',
    activeTalukaPrefix: 'Selected:',
    basinKhandesh: 'KHANDESH (TAPI BASIN)',
    basinVidarbha: 'VIDARBHA (PURNA-WARDHA)',
    basinMarathwada: 'MARATHWADA (GODAVARI)',
    basinWesternMh: 'WESTERN MH (BHIMA-KRISHNA)',
    tooltipScoreLabel: 'Water Stress Index',
    tooltipSoilMoisture: 'Soil Moisture (Bhuvan)',
    tooltipGwDrop: 'Monthly Aquifer Change',
    tooltipRain7d: '7-Day IMD Forecast',
    tooltipActionLabel: 'Farmer Action',
    tooltipClickToInspect: 'Click node to load full advisory & SMS composer',
    quickSelectLabel: 'Quick-Select Pilot Talukas',
    subBasinTableTitle: 'Maharashtra Sub-Basin Aquifer & Monsoon Summary (CGWB + IMD)',
    subBasinColRegion: 'Region / Basin',
    subBasinColMoisture: 'Avg Soil Moisture',
    subBasinColGwDrop: 'Monthly GW Drop',
    subBasinColRain: '7-Day Rain',
    metricSoilMoisture: 'Bhuvan Soil Moisture',
    metricGwDepletion: 'Monthly Aquifer Drop',
    metricRainForecast: '7-Day IMD Rain',
    metricNdvi: 'Crop NDVI Vigor',
    metricWaterTable: 'Water Table Depth',
    rainWindowHeader: '7-Day IMD Rainfall Forecast Window',
    rainPeakPrefix: 'Expected Rain:',
    nugenAdvisoryHeading: 'Nugen LLM Vernacular Advisory (Plain-Language Synthesis)',
    kvkGroundedHeading: 'Krishi Vigyan Kendra (KVK) RAG Citation',
    calculatorTitle: 'Farm-Level Water Budget & Before/After Savings Calculator',
    selectCropLabel: 'Select Crop',
    fieldAreaAcresLabel: 'Field Area (Acres)',
    currentMethodLabel: 'Current Irrigation Method',
    methodFlood: 'Flood / Furrow Irrigation',
    methodSprinkler: 'Sprinkler System',
    methodDrip: 'Precision Drip System',
    beforeWaterLabel: 'Current Usage / Cycle',
    afterWaterLabel: 'JalMitra Advisory / Cycle',
    seasonSavingsLabel: 'Total Season Water Saved',
    droughtBufferLabel: 'Extra Drought Survival Buffer',
    notificationHubTitle: 'SMS & WhatsApp Vernacular Advisory Gateway',
    notificationHubSubtitle:
      'Dispatch concise, location-specific irrigation alerts to enrolled farmer cohorts or individual mobile numbers.',
    channelLabel: 'Notification Channel',
    channelWhatsapp: 'WhatsApp Rich Advisory',
    channelSms: 'Standard SMS (2G Phone)',
    channelBoth: 'Both (WhatsApp + SMS)',
    recipientModeCohort: 'Entire Taluka Farmer Group',
    recipientModeSingle: 'Individual Farmer Mobile',
    farmerNameInputLabel: 'Farmer Name',
    farmerPhoneInputLabel: 'Mobile Number (+91)',
    phonePreviewHeading: 'WhatsApp Vernacular Message Preview',
    smsPreviewHeading: '160-Char Concise SMS Alert Preview',
    sendWhatsappBtn: 'Dispatch Vernacular Notification',
    openWhatsappDirectBtn: 'Share via WhatsApp',
    whatsappDispatchedMsg: 'Delivered via Gateway to',
    phoneValidationError: 'Please enter a valid 10-digit Indian mobile number (e.g. 9823012345).',
    deliveryHistoryTitle: 'Recent SMS & WhatsApp Dispatch Log',
    diagnosticsTitle: '02. Multimodal Field Photo Diagnostic (Water Stress vs. Disease)',
    diagnosticsSubtitle:
      'Farmers often mistake fungal leaf yellowing for drought and over-irrigate. Inspect a field sample or upload a crop photo to fold visual plant pathology directly into the irrigation schedule.',
    uploadCustomPhotoBtn: 'Upload Field Photo',
    selectSamplePrompt: 'Select a field inspection sample or upload your own photo:',
    confidenceLabel: 'Diagnostic Confidence',
    observedMoistureLabel: 'Root-Zone Moisture',
    canopyDeltaLabel: 'Canopy Thermal Delta',
    visualFindingTitle: 'Multimodal Vision Analysis',
    irrigationActionTitle: 'Irrigation Schedule Adjustment',
    savesPerAcrePrefix: 'Saves',
    kvkExtensionProtocolTitle: 'Grounded KVK Extension Remedy',
    applyToAdvisoryBtn: 'Fold Diagnosis into Taluka Advisory & SMS',
    syncedAdvisoryBanner: 'Synced with active Taluka WhatsApp & SMS Advisory above',
    committeeTitle: '03. Gram Panchayat Water Committee (Pani Samiti) Resilience Dashboard',
    committeeSubtitle:
      'Aggregated village water demand versus CGWB aquifer recharge capacity, allowing village water committees to plan drip conversion subsidies and staggered canal schedules.',
    activeJurisdictionLabel: 'Active Committee Jurisdiction:',
    dripTargetSliderLabel: 'Village Drip Irrigation Adoption Target',
    dripSliderDescription:
      'Adjusting village-wide micro-irrigation adoption shows real-time impact on daily MLD (Million Liters/Day) groundwater extraction vs natural recharge.',
    villageDemandLabel: 'Current Daily Demand',
    smallholdersCountSuffix: 'smallholders enrolled',
    aquiferRechargeLabel: 'Safe Aquifer Recharge',
    safeExtractionSub: 'CGWB safe extraction limit',
    netBalanceLabel: 'Post-Drip Net Aquifer Balance',
    droughtWarningPrefix: 'Drought Early Warning:',
    projectedSavingsLabel: 'Community Water Saved / Day',
    conservedPerDaySuffix: 'L / day conserved',
    aquiferTrajectoryTitle: '6-Month CGWB Depth-to-Water-Table Trajectory (Meters Below Ground)',
    aquiferTrajectorySubtitle:
      'Compares unmitigated borewell drawdown against JalMitra KVK-guided drip & rain-delay conservation.',
    legendBaselineDrawdown: 'Baseline Borewell Drawdown (m)',
    legendManagedDepth: 'JalMitra Managed Depth (Shallower = Better)',
    waterTableProtectedSuffix: 'Water Table Protected',
    scheduleResolutionTitle: 'Log Gram Panchayat Water Resolution & Irrigation Roster',
    villageNameInputLabel: 'Village / Gram Panchayat Name',
    committeeActionSelectLabel: 'Conservation Resolution Type',
    targetAcreageInputLabel: 'Target Command Area (Acres)',
    addResolutionBtn: 'Record Committee Resolution',
    validationErrorEmpty: 'Please enter a valid village name and target acreage (1 to 5,000 acres).',
    tableColGp: 'Gram Panchayat',
    tableColResolution: 'Conservation Resolution',
    tableColArea: 'Command Area',
    tableColSaved: 'Water Saved / Day',
    footerTagline: 'AI Groundwater & Irrigation Advisory for Maharashtra Smallholder Farmers',
    footerSources:
      'Public Telemetry: IMD Pune · ISRO NRSC Bhuvan · Central Ground Water Board (CGWB) · State KVK Extension Network',
  },
  mr: {
    brandTitle: 'जलमित्र (JalMitra)',
    navHeatMap: 'पाणी टंचाई नकाशा',
    navAdvisory: 'SMS / व्हॉट्सॲप सल्ला',
    navDiagnostics: 'पीक फोटो निदान',
    navCommittee: 'ग्राम पाणी समिती',
    ctaSendAdvisory: 'SMS / WhatsApp पाठवा',
    languageSelectorLabel: 'भाषा निवडा:',
    heroKicker: 'महाराष्ट्र हवामान व भूजल सक्षमीकरण · IMD + इस्रो भुवन + भूजल सर्वेक्षण + कृषी विज्ञान केंद्र',
    heroHeadline: 'अल्पभूधारक शेतकऱ्यांसाठी एआय (AI) भूजल आणि अचूक सिंचन सल्लागार',
    heroSubheadline:
      'उपग्रह मातीतील ओलावा, तालुक्याची भूजल पातळी आणि ७ दिवसांचा पावसाचा अंदाज एकत्र करून सोप्या मराठी, हिन्दी आणि इंग्रजीत सिंचन सल्ला देणारी प्रणाली — पाण्याची बचत आणि पिकांचे रक्षण.',
    kpiTitleWaterSaved: 'एकूण वाचवलेले पाणी',
    kpiLitersSavedLabel: '४८.२ कोटी लिटर',
    kpiLitersSavedSub: 'या हंगामात १६ तालुक्यांमध्ये वाचवलेले पाणी',
    kpiTitleDroughtLead: 'दुष्काळ पूर्वसूचना कालावधी',
    kpiDroughtLeadLabel: '१४ दिवस आधीच',
    kpiDroughtLeadSub: 'पीक कोमेजण्यापूर्वीच मुळाशी पाण्याच्या ताणाची पूर्वसूचना',
    kpiTitleFarmersReach: 'शेतकरी संपर्क व्याप्ती',
    kpiFarmersCoveredLabel: '३४,५७० शेतकरी',
    kpiFarmersCoveredSub: 'आठवड्यातून दोनदा व्हॉट्सॲप व एसएमएस सल्ला मिळणारे शेतकरी',
    kpiTitleKvkGrounded: 'कृषी विज्ञान प्रमाणित (RAG)',
    kpiKvkGroundedLabel: '१००% KVK प्रमाणित',
    kpiKvkGroundedSub: 'कृषी विद्यापीठ व KVK शिफारशींवर आधारित विश्वासार्ह माहिती',
    heatMapSectionTitle: '०१. महाराष्ट्र पाणी ताण व भूजल पातळी इंटरॅक्टिव्ह हीट-मॅप',
    heatMapSectionSubtitle:
      'नकाशावरील कोणत्याही तालुक्यावर माऊस फिरवा (Hover) किंवा क्लिक करा आणि इस्रो (Bhuvan) जमिनीतील ओलावा, भूजल पातळीतील घट व ७ दिवसांचा पावसाचा अंदाज पहा.',
    viewModeMap: 'भौगोलिक नदी-खोरे नकाशा',
    viewModeMatrix: 'तालुका हीट-मॅट्रिक्स तक्ता',
    filterRegionAll: 'सर्व विभाग (१६ तालुके)',
    regionMarathwada: 'मराठवाडा (गोदावरी-मांजरा खोरे)',
    regionVidarbha: 'विदर्भ (पूर्णा-वर्धा खोरे)',
    regionWesternMh: 'पश्चिम महाराष्ट्र (भीमा-कृष्णा)',
    regionKhandesh: 'खानदेश / उत्तर महाराष्ट्र (तापी खोरे)',
    filterStressAll: 'सर्व पाणी ताण श्रेणी (५ स्तर)',
    searchPlaceholder: 'तालुका किंवा जिल्हा शोधा (उदा. लातूर, बीड, सांगोला)...',
    metricTabStress: 'पाणी ताण',
    metricTabSoil: 'ओलावा %',
    metricTabAquifer: 'भूजल घट',
    metricTabRain: 'पाऊस',
    legendTitle: 'सोपी पाणी ताण रंग-पटल श्रेणी (#06ce06 कमी ताण → #d3b44a मध्यम ताण → अति-तीव्र)',
    legendSubtitle: 'कोणत्याही रंगावर क्लिक करून तालुके फिल्टर करा · माहितीसाठी नकाशावरील बिंदूंवर माऊस न्या',
    legendLow: 'कमी ताण (#06ce06) · सुरक्षित ओलावा',
    legendMild: 'हलका ताण (#74c328) · मल्चिंग करा',
    legendModerate: 'मध्यम ताण (#d3b44a) · पावसाचा अंदाज पहा',
    legendHigh: 'तीव्र टंचाई (#e07a2a) · ठिबक सिंचन वापरा',
    legendCritical: 'अति-तीव्र (#c92a2a) · केवळ संरक्षित पाणी',
    mapHeaderSubtitle: 'महाराष्ट्र नदी खोरे आणि तालुका भूजल मापन नकाशा',
    talukasActiveSuffix: 'तालुके सक्रिय',
    activeTalukaPrefix: 'निवडलेला तालुका:',
    basinKhandesh: 'खानदेश (तापी खोरे)',
    basinVidarbha: 'विदर्भ (पूर्णा-वर्धा खोरे)',
    basinMarathwada: 'मराठवाडा (गोदावरी खोरे)',
    basinWesternMh: 'पश्चिम महाराष्ट्र (भीमा-कृष्णा)',
    tooltipScoreLabel: 'पाणी ताण निर्देशांक',
    tooltipSoilMoisture: 'जमिनीतील ओलावा (Bhuvan)',
    tooltipGwDrop: 'मासिक भूजल बदल',
    tooltipRain7d: '७-दिवस पाऊस अंदाज',
    tooltipActionLabel: 'शेतकऱ्यांसाठी कृती',
    tooltipClickToInspect: 'सविस्तर सल्ला व SMS पाठवण्यासाठी येथे क्लिक करा',
    quickSelectLabel: 'जलद निवडीसाठी पायलट तालुके',
    subBasinTableTitle: 'महाराष्ट्र विभागनिहाय भूजल व मान्सून सारांश तक्ता (CGWB + IMD)',
    subBasinColRegion: 'विभाग / नदी खोरे',
    subBasinColMoisture: 'सरासरी ओलावा',
    subBasinColGwDrop: 'मासिक भूजल घट',
    subBasinColRain: '७-दिवस पाऊस',
    metricSoilMoisture: 'जमिनीतील ओलावा (Bhuvan)',
    metricGwDepletion: 'मासिक भूजल घट',
    metricRainForecast: '७-दिवस पाऊस अंदाज',
    metricNdvi: 'पीक हिरवळ निर्देशांक (NDVI)',
    metricWaterTable: 'भूजल पातळी खोली',
    rainWindowHeader: 'पुढील ७ दिवसांचा IMD पाऊस अंदाज',
    rainPeakPrefix: 'मुख्य पाऊस:',
    nugenAdvisoryHeading: 'Nugen LLM मराठी सिंचन सल्ला (सोप्या भाषेतील विश्लेषण)',
    kvkGroundedHeading: 'कृषी विज्ञान केंद्र (KVK RAG) अधिकृत संदर्भ',
    calculatorTitle: 'शेत पातळीवरील पाणी बचत आणि सिंचन गणितज्ञ (Calculator)',
    selectCropLabel: 'पीक निवडा',
    fieldAreaAcresLabel: 'शेतीचे क्षेत्र (एकर)',
    currentMethodLabel: 'सध्याची सिंचन पद्धत',
    methodFlood: 'मोकाट / पाटाने पाणी',
    methodSprinkler: 'तुषार सिंचन (Sprinkler)',
    methodDrip: 'ठिबक सिंचन (Drip)',
    beforeWaterLabel: 'सध्याचा वापर / पाळी',
    afterWaterLabel: 'जलमित्र सल्ल्यानुसार / पाळी',
    seasonSavingsLabel: 'संपूर्ण हंगामातील पाणी बचत',
    droughtBufferLabel: 'दुष्काळात अतिरिक्त तग धरण्याचा काळ',
    notificationHubTitle: 'SMS आणि WhatsApp स्थानिक भाषा सूचना केंद्र',
    notificationHubSubtitle:
      'तालुक्यातील शेतकरी गटाला किंवा वैयक्तिक मोबाईल क्रमांकावर सोप्या मराठीत सिंचन संदेश पाठवा.',
    channelLabel: 'संदेश माध्यम निवडा',
    channelWhatsapp: 'व्हॉट्सॲप सविस्तर सल्ला',
    channelSms: 'साधा SMS (किपॅड फोनसाठी)',
    channelBoth: 'दोन्ही (WhatsApp + SMS)',
    recipientModeCohort: 'संपूर्ण तालुका शेतकरी गट',
    recipientModeSingle: 'वैयक्तिक शेतकरी मोबाईल',
    farmerNameInputLabel: 'शेतकऱ्याचे नाव',
    farmerPhoneInputLabel: 'मोबाईल क्रमांक (+91)',
    phonePreviewHeading: 'व्हॉट्सॲप संदेश पूर्वदृश्य (Preview)',
    smsPreviewHeading: '१६०-अक्षरी लघु SMS संदेश पूर्वदृश्य',
    sendWhatsappBtn: 'शेतकऱ्यांना SMS / WhatsApp सल्ला पाठवा',
    openWhatsappDirectBtn: 'व्हॉट्सॲपवर शेअर करा',
    whatsappDispatchedMsg: 'गेटवेद्वारे यशस्वीरित्या संदेश पाठवला:',
    phoneValidationError: 'कृपया वैध १०-अंकी मोबाईल क्रमांक प्रविष्ट करा (उदा. 9823012345).',
    deliveryHistoryTitle: 'अलीकडे पाठवलेले SMS व WhatsApp संदेश नोंदवही',
    diagnosticsTitle: '०२. मल्टीमोडल पीक फोटो निदान (पाण्याचा ताण की बुरशीजन्य रोग?)',
    diagnosticsSubtitle:
      'पाने पिवळी पडल्यास शेतकरी अनेकदा पाण्याचा ताण समजून जास्तीचे पाणी देतात, ज्यामुळे बुरशी वाढते. अचूक निदानासाठी खालील नमुना निवडा किंवा तुमच्या शेतातील फोटो अपलोड करा.',
    uploadCustomPhotoBtn: 'शेतातील फोटो अपलोड करा',
    selectSamplePrompt: 'तपासणीसाठी खालीलपैकी एक नमुना फोटो निवडा किंवा स्वतःचा फोटो जोडा:',
    confidenceLabel: 'निदान अचूकता',
    observedMoistureLabel: 'मुळाशी असलेला ओलावा',
    canopyDeltaLabel: 'पानांचे तापमान अंतर',
    visualFindingTitle: 'मल्टीमोडल फोटो विश्लेषण निष्कर्ष',
    irrigationActionTitle: 'सिंचन वेळापत्रकात आवश्यक बदल',
    savesPerAcrePrefix: 'बचत:',
    kvkExtensionProtocolTitle: 'कृषी विज्ञान केंद्र (KVK) उपाययोजना',
    applyToAdvisoryBtn: 'हा निष्कर्ष तालुका सल्ला व SMS मध्ये समाविष्ट करा',
    syncedAdvisoryBanner: 'तालुक्याच्या व्हॉट्सॲप व SMS सल्ल्यामध्ये यशस्वीरित्या जोडले गेले',
    committeeTitle: '०३. ग्रामपंचायत पाणी समिती (पाणी ताळेबंद व नियोजन डॅशबोर्ड)',
    committeeSubtitle:
      'गावातील एकूण पाण्याची मागणी आणि भूजल पुनर्भरण क्षमता यांचा ताळेबंद पाहून ठिबक अनुदान व पाळीने पाणी सोडण्याचे नियोजन करा.',
    activeJurisdictionLabel: 'सक्रिय पाणी समिती कार्यक्षेत्र:',
    dripTargetSliderLabel: 'गावातील ठिबक सिंचन उद्दिष्ट (%)',
    dripSliderDescription:
      'गावातील सूक्ष्म-सिंचन (ठिबक) क्षेत्र वाढवल्यास दैनंदिन भूजल उपसा आणि पुनर्भरण यावर होणारा परिणाम खालीलप्रमाणे दिसतो.',
    villageDemandLabel: 'सध्याची दैनंदिन मागणी',
    smallholdersCountSuffix: 'नोंदणीकृत शेतकरी',
    aquiferRechargeLabel: 'सुरक्षित भूजल पुनर्भरण',
    safeExtractionSub: 'भूजल सर्वेक्षण सुरक्षित मर्यादा',
    netBalanceLabel: 'ठिबकनंतर निव्वळ भूजल शिल्लक',
    droughtWarningPrefix: 'दुष्काळ पूर्वसूचना:',
    projectedSavingsLabel: 'गावाची दैनंदिन पाणी बचत',
    conservedPerDaySuffix: 'लिटर / दिवस बचत',
    aquiferTrajectoryTitle: 'मागील ६ महिन्यांतील भूजल पातळीतील बदल (मीटर खोली)',
    aquiferTrajectorySubtitle:
      'अनियंत्रित बोअरवेल उपसा विरुद्ध जलमित्र ठिबक व पावसाधारित सिंचन नियोजनामुळे राखलेली भूजल पातळी.',
    legendBaselineDrawdown: 'नेहमीचा बोअरवेल उपसा खोली (मी.)',
    legendManagedDepth: 'जलमित्र नियोजित पातळी (कमी खोली = उत्तम)',
    waterTableProtectedSuffix: 'भूजल पातळी सुरक्षित राहिली',
    scheduleResolutionTitle: 'ग्राम पाणी समिती ठराव आणि सिंचन वेळापत्रक नोंदणी',
    villageNameInputLabel: 'गावाचे / ग्रामपंचायतीचे नाव',
    committeeActionSelectLabel: 'जलसंधारण ठरावाचा प्रकार',
    targetAcreageInputLabel: 'लक्षित क्षेत्र (एकर)',
    addResolutionBtn: 'समितीचा ठराव नोंदवा',
    validationErrorEmpty: 'कृपया गावाचे नाव आणि वैध क्षेत्र (१ ते ५,००० एकर) प्रविष्ट करा.',
    tableColGp: 'ग्रामपंचायत',
    tableColResolution: 'जलसंधारण ठराव',
    tableColArea: 'क्षेत्र (एकर)',
    tableColSaved: 'पाणी बचत / दिवस',
    footerTagline: 'महाराष्ट्रातील अल्पभूधारक शेतकऱ्यांसाठी एआय भूजल व सिंचन सल्लागार',
    footerSources:
      'माहिती स्रोत: भारतीय हवामान विभाग (IMD पुणे) · इस्रो भुवन · केंद्रीय भूजल मंडळ (CGWB) · कृषी विज्ञान केंद्र नेटवर्क',
  },
  hi: {
    brandTitle: 'जलमित्र (JalMitra)',
    navHeatMap: 'जल संकट हीट-मैप',
    navAdvisory: 'SMS / व्हाट्सएप सलाह',
    navDiagnostics: 'फसल फोटो निदान',
    navCommittee: 'ग्राम जल समिति',
    ctaSendAdvisory: 'SMS / WhatsApp भेजें',
    languageSelectorLabel: 'भाषा चुनें:',
    heroKicker: 'महाराष्ट्र जलवायु एवं भूजल संरक्षण · IMD + इसरो भुवन + CGWB + कृषि विज्ञान केंद्र',
    heroHeadline: 'छोटे किसानों के लिए एआई (AI) भूजल और सटीक सिंचाई सलाहकार',
    heroSubheadline:
      'उपग्रह मिट्टी नमी, तालुका भूजल रुझान और 7-दिन के मानसून पूर्वानुमान को सरल मराठी, हिन्दी और अंग्रेजी सलाह में बदलता है — जल की बचत और फसल सुरक्षा।',
    kpiTitleWaterSaved: 'कुल बचाया गया पानी',
    kpiLitersSavedLabel: '48.2 करोड़ लीटर',
    kpiLitersSavedSub: 'इस सीजन में 16 पायलट तालुकों में बचाया गया पानी',
    kpiTitleDroughtLead: 'सूखा पूर्व-चेतावनी समय',
    kpiDroughtLeadLabel: '14 दिन पहले',
    kpiDroughtLeadSub: 'फसल मुरझाने से पहले जड़ क्षेत्र में सूखे के तनाव की चेतावनी',
    kpiTitleFarmersReach: 'किसान नेटवर्क पहुंच',
    kpiFarmersCoveredLabel: '34,570 किसान',
    kpiFarmersCoveredSub: 'सप्ताह में दो बार व्हाट्सएप और एसएमएस सलाह पाने वाले किसान',
    kpiTitleKvkGrounded: 'कृषि विज्ञान प्रमाणित (RAG)',
    kpiKvkGroundedLabel: '100% KVK प्रमाणित',
    kpiKvkGroundedSub: 'कृषि विज्ञान केंद्र के आधिकारिक दिशानिर्देशों पर आधारित',
    heatMapSectionTitle: '01. महाराष्ट्र जल तनाव और भूजल स्तर इंटरैक्टिव हीट-मैप',
    heatMapSectionSubtitle:
      'इसरो (Bhuvan) मिट्टी की नमी, भूजल गिरावट और 7-दिवसीय IMD बारिश पूर्वानुमान देखने के लिए मानचित्र पर किसी भी तालुका पर माउस ले जाएं (Hover) या क्लिक करें।',
    viewModeMap: 'भौगोलिक बेसिन मानचित्र',
    viewModeMatrix: 'तालुका हीट-मैट्रिक्स तालिका',
    filterRegionAll: 'सभी क्षेत्र (16 तालुका)',
    regionMarathwada: 'मराठवाड़ा (गोदावरी-मांजरा बेसिन)',
    regionVidarbha: 'विदर्भ (पूर्णा-वर्धा बेसिन)',
    regionWesternMh: 'पश्चिम महाराष्ट्र (भीमा-कृष्णा)',
    regionKhandesh: 'खानदेश / उत्तर महाराष्ट्र (तापी बेसिन)',
    filterStressAll: 'सभी जल तनाव स्तर (5 श्रेणियां)',
    searchPlaceholder: 'तालुका या जिला खोजें (जैसे लातूर, बीड, सांगोला)...',
    metricTabStress: 'जल तनाव',
    metricTabSoil: 'मिट्टी नमी %',
    metricTabAquifer: 'भूजल गिरावट',
    metricTabRain: 'बारिश',
    legendTitle: 'सुलभ जल तनाव रंग पैमाना (#06ce06 कम तनाव → #d3b44a मध्यम तनाव → गंभीर संकट)',
    legendSubtitle: 'तालुका फ़िल्टर करने के लिए किसी भी रंग श्रेणी पर क्लिक करें · टूलटिप के लिए बिंदुओं पर माउस ले जाएं',
    legendLow: 'कम तनाव (#06ce06) · सुरक्षित नमी',
    legendMild: 'हल्का तनाव (#74c328) · मल्चिंग करें',
    legendModerate: 'मध्यम तनाव (#d3b44a) · बारिश अनुसार सिंचाई',
    legendHigh: 'उच्च संकट (#e07a2a) · ड्रिप सिंचाई अपनाएं',
    legendCritical: 'गंभीर गिरावट (#c92a2a) · केवल जीवनरक्षक सिंचाई',
    mapHeaderSubtitle: 'महाराष्ट्र नदी बेसिन और तालुका भूजल मापन मानचित्र',
    talukasActiveSuffix: 'तालुका सक्रिय',
    activeTalukaPrefix: 'चयनित तालुका:',
    basinKhandesh: 'खानदेश (तापी बेसिन)',
    basinVidarbha: 'विदर्भ (पूर्णा-वर्धा बेसिन)',
    basinMarathwada: 'मराठवाड़ा (गोदावरी बेसिन)',
    basinWesternMh: 'पश्चिम महाराष्ट्र (भीमा-कृष्णा)',
    tooltipScoreLabel: 'जल तनाव सूचकांक',
    tooltipSoilMoisture: 'मिट्टी की नमी (Bhuvan)',
    tooltipGwDrop: 'मासिक भूजल बदलाव',
    tooltipRain7d: '7-दिन बारिश पूर्वानुमान',
    tooltipActionLabel: 'किसान के लिए सलाह',
    tooltipClickToInspect: 'पूरी सलाह और SMS भेजने के लिए क्लिक करें',
    quickSelectLabel: 'त्वरित चयन हेतु पायलट तालुका',
    subBasinTableTitle: 'महाराष्ट्र उप-बेसिन भूजल एवं मानसून सारांश तालिका (CGWB + IMD)',
    subBasinColRegion: 'क्षेत्र / नदी बेसिन',
    subBasinColMoisture: 'औसत मिट्टी नमी',
    subBasinColGwDrop: 'मासिक भूजल गिरावट',
    subBasinColRain: '7-दिन बारिश',
    metricSoilMoisture: 'मिट्टी की नमी (Bhuvan)',
    metricGwDepletion: 'मासिक भूजल गिरावट',
    metricRainForecast: '7-दिन बारिश पूर्वानुमान',
    metricNdvi: 'फसल हरियाली (NDVI)',
    metricWaterTable: 'भूजल स्तर गहराई',
    rainWindowHeader: 'अगले 7 दिनों का IMD बारिश पूर्वानुमान',
    rainPeakPrefix: 'मुख्य बारिश:',
    nugenAdvisoryHeading: 'Nugen LLM स्थानीय सिंचाई सलाह (सरल भाषा विश्लेषण)',
    kvkGroundedHeading: 'कृषि विज्ञान केंद्र (KVK RAG) आधिकारिक संदर्भ',
    calculatorTitle: 'खेत स्तरीय जल बजट और बचत कैलकुलेटर',
    selectCropLabel: 'फसल चुनें',
    fieldAreaAcresLabel: 'खेत का क्षेत्रफल (एकड़)',
    currentMethodLabel: 'वर्तमान सिंचाई पद्धति',
    methodFlood: 'खुली / बाढ़ सिंचाई (Flood)',
    methodSprinkler: 'फव्वारा सिंचाई (Sprinkler)',
    methodDrip: 'ड्रिप / टपक सिंचाई (Drip)',
    beforeWaterLabel: 'वर्तमान खपत / चक्र',
    afterWaterLabel: 'जलमित्र सलाह अनुसार / चक्र',
    seasonSavingsLabel: 'पूरे सीजन में कुल जल बचत',
    droughtBufferLabel: 'सूखे में अतिरिक्त सुरक्षा दिवस',
    notificationHubTitle: 'SMS और WhatsApp स्थानीय भाषा अधिसूचना केंद्र',
    notificationHubSubtitle:
      'तालुका के किसान समूह या व्यक्तिगत मोबाइल नंबर पर सरल भाषा में सिंचाई सलाह भेजें।',
    channelLabel: 'संदेश माध्यम चुनें',
    channelWhatsapp: 'व्हाट्सएप विस्तृत सलाह',
    channelSms: 'साधारण SMS (2G कीपैड फोन)',
    channelBoth: 'दोनों (WhatsApp + SMS)',
    recipientModeCohort: 'पूरा तालुका किसान समूह',
    recipientModeSingle: 'व्यक्तिगत किसान मोबाइल',
    farmerNameInputLabel: 'किसान का नाम',
    farmerPhoneInputLabel: 'मोबाइल नंबर (+91)',
    phonePreviewHeading: 'व्हाट्सएप संदेश पूर्वावलोकन (Preview)',
    smsPreviewHeading: '160-अक्षर संक्षिप्त SMS पूर्वावलोकन',
    sendWhatsappBtn: 'किसानों को SMS / WhatsApp सलाह भेजें',
    openWhatsappDirectBtn: 'व्हाट्सएप पर साझा करें',
    whatsappDispatchedMsg: 'गेटवे द्वारा सफलतापूर्वक भेजा गया:',
    phoneValidationError: 'कृपया वैध 10-अंकीय मोबाइल नंबर दर्ज करें (जैसे 9823012345)।',
    deliveryHistoryTitle: 'हाल ही में भेजे गए SMS और WhatsApp संदेश लॉग',
    diagnosticsTitle: '02. मल्टीमोडल खेत फोटो निदान (जल तनाव बनाम फसल रोग)',
    diagnosticsSubtitle:
      'किसान अक्सर फंगल पीलेपन को सूखा समझकर अधिक पानी दे देते हैं। सटीक निदान और सिंचाई समायोजन के लिए नीचे दिए गए नमूने को चुनें या अपनी फसल की फोटो अपलोड करें।',
    uploadCustomPhotoBtn: 'खेत की फोटो अपलोड करें',
    selectSamplePrompt: 'निरीक्षण के लिए एक नमूना चुनें या अपनी फोटो अपलोड करें:',
    confidenceLabel: 'निदान सटीकता',
    observedMoistureLabel: 'जड़ क्षेत्र में नमी',
    canopyDeltaLabel: 'कैनोपी तापमान अंतर',
    visualFindingTitle: 'मल्टीमोडल विज़न विश्लेषण निष्कर्ष',
    irrigationActionTitle: 'सिंचाई समय-सारणी में बदलाव',
    savesPerAcrePrefix: 'बचत:',
    kvkExtensionProtocolTitle: 'कृषि विज्ञान केंद्र (KVK) उपचार सलाह',
    applyToAdvisoryBtn: 'इस निदान को तालुका सलाह और SMS में जोड़ें',
    syncedAdvisoryBanner: 'तालुका के व्हाट्सएप और SMS सलाह में सफलतापूर्वक जोड़ा गया',
    committeeTitle: '03. ग्राम पंचायत जल समिति (पानी समिति) लचीलापन डैशबोर्ड',
    committeeSubtitle:
      'गांव की कुल जल मांग बनाम भूजल पुनर्भरण क्षमता का विश्लेषण करें, जिससे ग्राम जल समिति ड्रिप सब्सिडी और नहर रोस्टर की योजना बना सके।',
    activeJurisdictionLabel: 'सक्रिय समिति क्षेत्राधिकार:',
    dripTargetSliderLabel: 'ग्राम ड्रिप सिंचाई अपनाने का लक्ष्य (%)',
    dripSliderDescription:
      'गांव में सूक्ष्म-सिंचाई (ड्रिप) बढ़ाने से दैनिक भूजल दोहन और प्राकृतिक पुनर्भरण पर सीधा प्रभाव दिखता है।',
    villageDemandLabel: 'वर्तमान दैनिक मांग',
    smallholdersCountSuffix: 'पंजीकृत किसान',
    aquiferRechargeLabel: 'सुरक्षित भूजल पुनर्भरण',
    safeExtractionSub: 'CGWB सुरक्षित दोहन सीमा',
    netBalanceLabel: 'ड्रिप के बाद शुद्ध भूजल संतुलन',
    droughtWarningPrefix: 'सूखा पूर्व-चेतावनी:',
    projectedSavingsLabel: 'दैनिक सामुदायिक जल बचत',
    conservedPerDaySuffix: 'लीटर / दिन बचत',
    aquiferTrajectoryTitle: 'पिछले 6 महीनों का भूजल गहराई रुझान (मीटर जमीन के नीचे)',
    aquiferTrajectorySubtitle:
      'अनियंत्रित बोरवेल दोहन बनाम जलमित्र ड्रिप और वर्षा-आधारित सिंचाई संरक्षण की तुलना।',
    legendBaselineDrawdown: 'सामान्य बोरवेल गिरावट (मी.)',
    legendManagedDepth: 'जलमित्र संरक्षित गहराई (कम गहराई = बेहतर)',
    waterTableProtectedSuffix: 'भूजल स्तर सुरक्षित',
    scheduleResolutionTitle: 'ग्राम जल समिति प्रस्ताव और सिंचाई रोस्टर दर्ज करें',
    villageNameInputLabel: 'गांव / ग्राम पंचायत का नाम',
    committeeActionSelectLabel: 'जल संरक्षण प्रस्ताव प्रकार',
    targetAcreageInputLabel: 'लक्षित क्षेत्र (एकड़)',
    addResolutionBtn: 'समिति प्रस्ताव दर्ज करें',
    validationErrorEmpty: 'कृपया वैध गांव का नाम और लक्षित क्षेत्रफल (1 से 5,000 एकड़) दर्ज करें।',
    tableColGp: 'ग्राम पंचायत',
    tableColResolution: 'जल संरक्षण प्रस्ताव',
    tableColArea: 'क्षेत्रफल',
    tableColSaved: 'जल बचत / दिन',
    footerTagline: 'महाराष्ट्र के छोटे किसानों के लिए एआई भूजल एवं सिंचाई सलाहकार',
    footerSources:
      'डेटा स्रोत: भारतीय मौसम विभाग (IMD पुणे) · इसरो भुवन · केंद्रीय भूजल बोर्ड (CGWB) · कृषि विज्ञान केंद्र नेटवर्क',
  },
};
