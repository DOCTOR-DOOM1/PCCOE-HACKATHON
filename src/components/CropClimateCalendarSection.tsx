import React, { useState } from 'react';
import {
  Calendar,
  CloudRain,
  Sprout,
  Droplets,
  Sun,
  Award,
  CheckCircle2,
} from 'lucide-react';
import {
  buildCropClimateCalendarData,
  type TalukaRecord,
  type Language,
  type AgriculturalSeason,
  type CropStageType,
  type CropType,
} from '../utils/waterEngine';

interface CropClimateCalendarSectionProps {
  selectedTaluka: TalukaRecord;
  lang: Language;
}

const CALENDAR_UI_COPY: Record<
  Language,
  {
    sectionTitle: string;
    sectionSubtitle: string;
    filterAll: string;
    filterKharif: string;
    filterRabi: string;
    filterPerennial: string;
    rainfallHeader: string;
    annualRainPrefix: string;
    cropColHeader: string;
    stageLegendTitle: string;
    stageSowing: string;
    stageVegetative: string;
    stageCritical: string;
    stageHarvest: string;
    stageFallow: string;
     stageShortSowing: string;
    stageShortVeg: string;
    stageShortCrit: string;
    stageShortHarv: string;
    inspectorHeading: string;
    sowingWindowLabel: string;
    criticalStageLabel: string;
    harvestWindowLabel: string;
    kvkVarietyLabel: string;
    alignmentAdvisoryLabel: string;
    seasonalWaterLabel: string;
  }
> = {
  en: {
    sectionTitle: '02. Seasonal Crop-Climate & Monsoon Alignment Calendar',
    sectionSubtitle:
      'Maps optimal sowing, rain-fed vegetative growth, critical drip-irrigation windows, and harvest periods against predicted 12-month local rainfall patterns for the active taluka.',
    filterAll: 'All Seasons (6 Crops)',
    filterKharif: 'Kharif (Monsoon)',
    filterRabi: 'Rabi (Winter)',
    filterPerennial: 'Perennial / Horticulture',
    rainfallHeader: 'Predicted Local Monthly Rainfall (mm)',
    annualRainPrefix: 'Annual Expected:',
    cropColHeader: 'Crop & Season',
    stageLegendTitle: 'Crop Cycle Stage Legend (Click any crop row for KVK schedule):',
    stageSowing: 'Sowing / Planting (#06ce06)',
    stageVegetative: 'Rain-Fed Growth (#74c328)',
    stageCritical: 'Critical Drip Stage (#e07a2a)',
    stageHarvest: 'Maturity & Harvest (#d3b44a)',
    stageFallow: 'Fallow / Mulch Rest',
    stageShortSowing: 'SOW',
    stageShortVeg: 'GROW',
    stageShortCrit: 'DRIP',
    stageShortHarv: 'HARV',
    inspectorHeading: 'KVK Crop-Climate Schedule & Rainfall Alignment',
    sowingWindowLabel: 'Optimal Sowing Window',
    criticalStageLabel: 'Critical Moisture & Drip Window',
    harvestWindowLabel: 'Maturity & Harvest Window',
    kvkVarietyLabel: 'Recommended Drought-Resilient KVK Variety',
    alignmentAdvisoryLabel: 'Local Rainfall & Aquifer Alignment Advisory',
    seasonalWaterLabel: 'Crop Water Need',
  },
  mr: {
    sectionTitle: '०२. हंगामी पीक-हवामान आणि पाऊस सुसंगतता दिनदर्शिका (Crop-Climate Calendar)',
    sectionSubtitle:
      'निवडलेल्या तालुक्यातील १२ महिन्यांच्या अपेक्षित पावसाच्या आराखड्यानुसार पेरणी, वाढीची अवस्था, संरक्षित ठिबक सिंचन आणि काढणीचे अचूक वेळापत्रक.',
    filterAll: 'सर्व हंगाम (६ पिके)',
    filterKharif: 'खरीप (मान्सून)',
    filterRabi: 'रब्बी (हिवाळी)',
    filterPerennial: 'बागायती / फळबाग',
    rainfallHeader: 'अपेक्षित स्थानिक मासिक पाऊस (मिमी)',
    annualRainPrefix: 'वार्षिक अपेक्षित पाऊस:',
    cropColHeader: 'पीक व हंगाम',
    stageLegendTitle: 'पीक अवस्था मार्गदर्शक (सविस्तर वेळापत्रकासाठी पिकावर क्लिक करा):',
    stageSowing: 'पेरणी / लागवड (#06ce06)',
    stageVegetative: 'पावसाधारित वाढ (#74c328)',
    stageCritical: 'संरक्षित ठिबक अवस्था (#e07a2a)',
    stageHarvest: 'पक्वता व काढणी (#d3b44a)',
    stageFallow: 'पडीक / मल्चिंग विश्रांती',
    stageShortSowing: 'पेरणी',
    stageShortVeg: 'वाढ',
    stageShortCrit: 'ठिबक',
    stageShortHarv: 'काढणी',
    inspectorHeading: 'KVK पीक-हवामान वेळापत्रक आणि मान्सून जुळणी सल्ला',
    sowingWindowLabel: 'योग्य पेरणी / लागवड कालावधी',
    criticalStageLabel: 'संवेदनशील ओलावा व ठिबक अवस्था',
    harvestWindowLabel: 'पक्वता आणि काढणी कालावधी',
    kvkVarietyLabel: 'शिफारस केलेले KVK दुष्काळ-प्रतिकारक वाण',
    alignmentAdvisoryLabel: 'स्थानिक पाऊस व भूजल सुसंगतता सल्ला',
    seasonalWaterLabel: 'पिकाची पाणी गरज',
  },
  hi: {
    sectionTitle: '02. मौसमी फसल-जलवायु और मानसून समन्वय कैलेंडर (Crop-Climate Calendar)',
    sectionSubtitle:
      'चयनित तालुका के 12-महीने के अनुमानित स्थानीय वर्षा पैटर्न के अनुसार बुवाई, वानस्पतिक वृद्धि, महत्वपूर्ण ड्रिप सिंचाई और कटाई की समय-सारणी।',
    filterAll: 'सभी सीजन (6 फसलें)',
    filterKharif: 'खरीफ (मानसून)',
    filterRabi: 'रबी (शीतकालीन)',
    filterPerennial: 'बागवानी / नकदी',
    rainfallHeader: 'अनुमानित स्थानीय मासिक वर्षा (मिमी)',
    annualRainPrefix: 'वार्षिक संभावित वर्षा:',
    cropColHeader: 'फसल एवं सीजन',
    stageLegendTitle: 'फसल चक्र चरण संकेतक (विस्तृत KVK सलाह के लिए किसी भी फसल पर क्लिक करें):',
    stageSowing: 'बुवाई / रोपाई (#06ce06)',
    stageVegetative: 'वर्षा-आधारित वृद्धि (#74c328)',
    stageCritical: 'महत्वपूर्ण ड्रिप अवस्था (#e07a2a)',
    stageHarvest: 'पकने व कटाई का समय (#d3b44a)',
    stageFallow: 'परती / मल्चिंग विश्राम',
    stageShortSowing: 'बुवाई',
    stageShortVeg: 'वृद्धि',
    stageShortCrit: 'ड्रिप',
    stageShortHarv: 'कटाई',
    inspectorHeading: 'KVK फसल-जलवायु समय-सारणी और वर्षा समन्वय सलाह',
    sowingWindowLabel: 'अनुकूल बुवाई / रोपाई समय',
    criticalStageLabel: 'संवेदनशील नमी एवं ड्रिप अवस्था',
    harvestWindowLabel: 'परिपक्वता एवं कटाई समय',
    kvkVarietyLabel: 'अनुशंसित KVK सूखा-सहिष्णु किस्म',
    alignmentAdvisoryLabel: 'स्थानीय वर्षा एवं भूजल समन्वय सलाह',
    seasonalWaterLabel: 'कुल जल आवश्यकता',
  },
};

export const CropClimateCalendarSection: React.FC<CropClimateCalendarSectionProps> = ({
  selectedTaluka,
  lang,
}) => {
  const [seasonFilter, setSeasonFilter] = useState<AgriculturalSeason | 'all'>('all');
  const [inspectedCropType, setInspectedCropType] = useState<CropType>(selectedTaluka.dominantCrop);

  const calendarData = buildCropClimateCalendarData(selectedTaluka, seasonFilter, lang);
  const copy = CALENDAR_UI_COPY[lang];

  const activeInspectedCrop =
    calendarData.crops.find((c) => c.crop === inspectedCropType) || calendarData.crops[0];

  const getStageStyleAndLabel = (stage: CropStageType) => {
    switch (stage) {
      case 'sowing':
        return {
          bg: '#06ce06',
          text: '#182218',
          border: '#059605',
          shortLabel: copy.stageShortSowing,
          fullLabel: copy.stageSowing,
        };
      case 'vegetative':
        return {
          bg: '#74c328',
          text: '#182218',
          border: '#5c9e1e',
          shortLabel: copy.stageShortVeg,
          fullLabel: copy.stageVegetative,
        };
      case 'critical-irrigation':
        return {
          bg: '#e07a2a',
          text: '#FFFFFF',
          border: '#c25e14',
          shortLabel: copy.stageShortCrit,
          fullLabel: copy.stageCritical,
        };
      case 'harvest':
        return {
          bg: '#d3b44a',
          text: '#182218',
          border: '#9a7b1c',
          shortLabel: copy.stageShortHarv,
          fullLabel: copy.stageHarvest,
        };
      default:
        return {
          bg: '#EFECE3',
          text: '#182218',
          border: 'transparent',
          shortLabel: '—',
          fullLabel: copy.stageFallow,
        };
    }
  };

  return (
    <section id="crop-calendar-section" className="py-8 scroll-mt-20 border-b border-[#182218]/10">
      {/* Header & Season Filter Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 mb-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#182218] text-balance">
            {copy.sectionTitle}
          </h2>
          <p className="mt-1.5 text-sm sm:text-base text-[#182218]/75">
            {copy.sectionSubtitle}
          </p>
        </div>

        <div
          className="inline-flex flex-wrap sm:flex-nowrap items-center gap-1 p-1 bg-[#EFECE3] border border-[#182218]/15 rounded-lg self-start xl:self-auto shrink-0"
          role="group"
          aria-label="Filter Crop Calendar by Season"
        >
          {(
            [
              { id: 'all', label: copy.filterAll },
              { id: 'kharif', label: copy.filterKharif },
              { id: 'rabi', label: copy.filterRabi },
              { id: 'perennial', label: copy.filterPerennial },
            ] as { id: AgriculturalSeason | 'all'; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSeasonFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                seasonFilter === tab.id
                  ? 'bg-[#182218] text-[#d3b44a]'
                  : 'text-[#182218]/75 hover:text-[#182218]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stage Color Legend Strip */}
      <div className="mb-5 p-3.5 bg-white border border-[#182218]/12 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-[#182218] flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#059605]" />
          <span>{copy.stageLegendTitle}</span>
        </span>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#182218]">
            <span className="w-3.5 h-3.5 rounded-xs bg-[#06ce06] border border-[#182218]/25" />
            {copy.stageSowing}
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#182218]">
            <span className="w-3.5 h-3.5 rounded-xs bg-[#74c328] border border-[#182218]/25" />
            {copy.stageVegetative}
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#182218]">
            <span className="w-3.5 h-3.5 rounded-xs bg-[#e07a2a] border border-[#182218]/25" />
            {copy.stageCritical}
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#182218]">
            <span className="w-3.5 h-3.5 rounded-xs bg-[#d3b44a] border border-[#182218]/25" />
            {copy.stageHarvest}
          </span>
        </div>
      </div>

      {/* 12-Month Rainfall + Crop Stage Timeline Matrix */}
      <div className="bg-white border border-[#182218]/12 rounded-xl p-4 sm:p-5 overflow-x-auto">
        <div className="min-w-[820px]">
          {/* Row 1: Predicted 12-Month Local Rainfall Hyetograph Bar Strip */}
          <div className="grid grid-cols-[210px_repeat(12,minmax(0,1fr))] gap-1.5 items-end pb-3.5 mb-3 border-b border-[#182218]/12">
            <div className="pr-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#182218]">
                <CloudRain className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
                <span>{copy.rainfallHeader}</span>
              </div>
              <div className="mt-1 text-[11px] font-mono-tabular text-[#182218]/70">
                {selectedTaluka.name[lang]} ({selectedTaluka.district[lang]}) ·{' '}
                {copy.annualRainPrefix}{' '}
                <strong className="text-[#0284c7]">{calendarData.annualExpectedRainMm} mm</strong>
              </div>
            </div>

            {calendarData.months.map((m) => {
              const barPct = Math.max(8, Math.min(100, Math.round((m.predictedRainMm / 250) * 100)));
              return (
                <div
                  key={m.monthIndex}
                  className="flex flex-col items-center justify-end"
                >
                  <span className="text-[10px] font-mono-tabular font-semibold text-[#182218]/75 mb-1">
                    {m.predictedRainMm}
                  </span>
                  <div className="w-full h-12 bg-[#F5F3EB] rounded-xs flex items-end p-0.5 border border-[#182218]/10">
                    <div
                      className="w-full rounded-xs transition-all"
                      style={{
                        height: `${barPct}%`,
                        backgroundColor: m.isMonsoonCore
                          ? '#0284c7'
                          : m.predictedRainMm >= 40
                          ? '#38bdf8'
                          : '#cbd5e1',
                      }}
                    />
                  </div>
                  <span
                    className={`mt-1.5 text-xs font-bold ${
                      m.isMonsoonCore ? 'text-[#182218]' : 'text-[#182218]/65'
                    }`}
                  >
                    {m.monthShort}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Crop Timeline Rows */}
          <div className="space-y-2">
            {calendarData.crops.map((row) => {
              const isSelected = activeInspectedCrop.crop === row.crop;
              return (
                <div
                  key={row.crop}
                  onClick={() => setInspectedCropType(row.crop)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setInspectedCropType(row.crop);
                    }
                  }}
                  className={`grid grid-cols-[210px_repeat(12,minmax(0,1fr))] gap-1.5 items-center p-2 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#F9F8F3] border-[#182218] ring-1 ring-[#182218]'
                      : 'bg-white border-[#182218]/10 hover:bg-[#F9F8F3]/60'
                  }`}
                >
                  <div className="pr-2 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-[#182218] truncate">
                        {row.cropName[lang]}
                      </span>
                      <span className="text-[10px] font-mono-tabular font-semibold px-1.5 py-0.5 rounded-xs bg-[#EFECE3] text-[#182218]/80 shrink-0">
                        {row.waterRequirementMm}mm
                      </span>
                    </div>
                    <div className="text-[11px] text-[#182218]/65 truncate">
                      {row.seasonBadge[lang]}
                    </div>
                  </div>

                  {row.monthlyStages.map((stage, mIdx) => {
                    const st = getStageStyleAndLabel(stage);
                    return (
                      <div
                        key={`${row.crop}-${mIdx}`}
                        title={`${row.cropName[lang]} (${calendarData.months[mIdx].monthShort}): ${st.fullLabel}`}
                        className="h-9 rounded-md flex items-center justify-center text-[10px] font-bold tracking-tight border select-none"
                        style={{
                          backgroundColor: st.bg,
                          color: st.text,
                          borderColor: st.border,
                          opacity: stage === 'fallow' ? 0.45 : 1,
                        }}
                      >
                        {st.shortLabel}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Crop Detailed KVK Agronomic & Rainfall Alignment Inspector */}
      {activeInspectedCrop && (
        <div
          id="crop-calendar-inspector"
          className="mt-4 p-5 rounded-xl bg-white border border-[#182218]/15"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-[#182218]/10">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-[#059605]" />
              <h3 className="text-base font-bold text-[#182218]">
                {copy.inspectorHeading} —{' '}
                <span className="text-[#059605]">{activeInspectedCrop.cropName[lang]}</span> (
                {selectedTaluka.name[lang]})
              </h3>
            </div>
            <span className="text-xs font-mono-tabular font-semibold text-[#182218]/75 bg-[#F9F8F3] px-2.5 py-1 rounded-md border border-[#182218]/12">
              {copy.seasonalWaterLabel}: {activeInspectedCrop.waterRequirementMm} mm ·{' '}
              {activeInspectedCrop.seasonBadge[lang]}
            </span>
          </div>

          <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-3.5 rounded-lg bg-[#ecfdf3] border border-[#06ce06]/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#182218]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059605] shrink-0" />
                <span>{copy.sowingWindowLabel}</span>
              </div>
              <p className="mt-1.5 text-xs font-medium text-[#182218] leading-relaxed">
                {activeInspectedCrop.sowingWindowText[lang]}
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#fff7ed] border border-[#e07a2a]/50">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#182218]">
                <Droplets className="w-3.5 h-3.5 text-[#e07a2a] shrink-0" />
                <span>{copy.criticalStageLabel}</span>
              </div>
              <p className="mt-1.5 text-xs font-medium text-[#182218] leading-relaxed">
                {activeInspectedCrop.criticalMoistureStage[lang]}
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#fefce8] border border-[#d3b44a]/70">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#182218]">
                <Sun className="w-3.5 h-3.5 text-[#9a7b1c] shrink-0" />
                <span>{copy.harvestWindowLabel}</span>
              </div>
              <p className="mt-1.5 text-xs font-medium text-[#182218] leading-relaxed">
                {activeInspectedCrop.harvestWindowText[lang]}
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#F9F8F3] border border-[#182218]/15">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#182218]">
                <Award className="w-3.5 h-3.5 text-[#9a7b1c] shrink-0" />
                <span>{copy.kvkVarietyLabel}</span>
              </div>
              <p className="mt-1.5 text-xs font-medium text-[#182218] leading-relaxed">
                {activeInspectedCrop.kvkRecommendedVariety[lang]}
              </p>
            </div>
          </div>

          <div className="mt-3.5 p-3 rounded-lg bg-[#182218] text-[#F9F8F3] text-xs flex flex-wrap items-center justify-between gap-2">
            <div>
              <strong className="text-[#d3b44a]">{copy.alignmentAdvisoryLabel}: </strong>
              <span>{activeInspectedCrop.rainfallAlignmentNote[lang]}</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
