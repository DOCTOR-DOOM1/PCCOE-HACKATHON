import React, { useState } from 'react';
import {
  Users,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import {
  calculateVillageWaterBudget,
  buildAquiferTrajectorySeries,
  type TalukaRecord,
  type Language,
} from '../utils/waterEngine';
import type { UITranslations } from '../data/translations';

interface VillageCommitteeSectionProps {
  selectedTaluka: TalukaRecord;
  lang: Language;
  t: UITranslations;
}

interface CommitteeResolutionRecord {
  id: string;
  villageName: string;
  talukaName: string;
  actionType: Record<Language, string>;
  targetAcres: number;
  projectedSavedLitersDay: number;
}

const RESOLUTION_OPTIONS: { id: string; label: Record<Language, string> }[] = [
  {
    id: 'drip-mandate',
    label: {
      en: 'PMKSY Drip Conversion & Mulching Mandate',
      mr: 'पंतप्रधान कृषी सिंचन ठिबक व मल्चिंग सक्ती',
      hi: 'पीएमकेएसवाई ड्रिप सिंचाई एवं मल्चिंग अनिवार्यता',
    },
  },
  {
    id: 'evening-roster',
    label: {
      en: 'Staggered Evening Canal Release Roster',
      mr: 'पाळीने संध्याकाळचे कालवा पाणी वाटप वेळापत्रक',
      hi: 'क्रमबद्ध शाम नहर जल वितरण रोस्टर',
    },
  },
  {
    id: 'rain-pause',
    label: {
      en: '3-Day Rain Delay Borewell Shutdown',
      mr: 'पावसापूर्वी ३ दिवस बोअरवेल उपसा बंद ठराव',
      hi: 'बारिश पूर्वानुमान पर 3-दिन बोरवेल विराम',
    },
  },
  {
    id: 'farm-pond',
    label: {
      en: 'Community Farm Pond Recharge Trenching',
      mr: 'सामूहिक शेततळे व पाणलोट चर पुनर्भरण',
      hi: 'सामुदायिक खेत तालाब एवं जल पुनर्भरण खंती',
    },
  },
];

const CHART_AXIS_COPY: Record<
  Language,
  {
    depthUnit: string;
    criticalThresholdLabel: string;
    savedLabel: string;
  }
> = {
  en: {
    depthUnit: 'm bgl',
    criticalThresholdLabel: 'Critical Borewell Stress Threshold',
    savedLabel: 'Water Table Saved',
  },
  mr: {
    depthUnit: 'मी. खोली',
    criticalThresholdLabel: 'धोकादायक बोअरवेल पातळी',
    savedLabel: 'वाचवलेली भूजल पातळी',
  },
  hi: {
    depthUnit: 'मी. गहराई',
    criticalThresholdLabel: 'गंभीर बोरवेल संकट सीमा',
    savedLabel: 'संरक्षित भूजल स्तर',
  },
};

export const VillageCommitteeSection: React.FC<VillageCommitteeSectionProps> = ({
  selectedTaluka,
  lang,
  t,
}) => {
  const [dripAdoptionTarget, setDripAdoptionTarget] = useState<number>(65);
  const [villageNameInput, setVillageNameInput] = useState<string>('Kasarwadi Gram Panchayat');
  const [selectedActionId, setSelectedActionId] = useState<string>('drip-mandate');
  const [targetAcresInput, setTargetAcresInput] = useState<string>('320');
  const [formError, setFormError] = useState<string | null>(null);

  const [resolutions, setResolutions] = useState<CommitteeResolutionRecord[]>([
    {
      id: 'res-1',
      villageName: 'Limbala Gram Panchayat',
      talukaName: 'Ausa, Latur',
      actionType: {
        en: 'Paired-Row Drip + Evening Canal Roster',
        mr: 'जोड-ओळ ठिबक + संध्याकाळचे कालवा वेळापत्रक',
        hi: 'जोड़ा-कतार ड्रिप + शाम का नहर रोस्टर',
      },
      targetAcres: 450,
      projectedSavedLitersDay: 675000,
    },
    {
      id: 'res-2',
      villageName: 'Kanherwadi Gram Panchayat',
      talukaName: 'Parli Vaijnath, Beed',
      actionType: {
        en: 'Micro-Drip Mandate for Cotton & Sugarcane',
        mr: 'कापूस व उसासाठी सूक्ष्म-ठिबक सिंचन नियम',
        hi: 'कपास और गन्ने के लिए सूक्ष्म-ड्रिप नियम',
      },
      targetAcres: 610,
      projectedSavedLitersDay: 1120000,
    },
    {
      id: 'res-3',
      villageName: 'Mahud Bk Gram Panchayat',
      talukaName: 'Sangola, Solapur',
      actionType: {
        en: 'Farm Pond Desilting & Solar Micro-Drip',
        mr: 'शेततळे गाळ उपसा आणि सौर सूक्ष्म-ठिबक',
        hi: 'खेत तालाब गाद निकासी एवं सोलर ड्रिप',
      },
      targetAcres: 380,
      projectedSavedLitersDay: 590000,
    },
  ]);

  const budget = calculateVillageWaterBudget(selectedTaluka, dripAdoptionTarget);
  const trajectoryData = buildAquiferTrajectorySeries(selectedTaluka, dripAdoptionTarget, lang);
  const chartCopy = CHART_AXIS_COPY[lang];
  const latestTrajectoryPoint = trajectoryData[trajectoryData.length - 1];

  const handleAddResolution = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedVillage = villageNameInput.trim();
    const parsedAcres = Number(targetAcresInput);

    if (!trimmedVillage || !Number.isFinite(parsedAcres) || parsedAcres < 1 || parsedAcres > 5000) {
      setFormError(t.validationErrorEmpty);
      return;
    }

    setFormError(null);
    const savedLitersDay = Math.round(parsedAcres * 1550);
    const matchedOption =
      RESOLUTION_OPTIONS.find((o) => o.id === selectedActionId) || RESOLUTION_OPTIONS[0];

    const newRec: CommitteeResolutionRecord = {
      id: `res-${Date.now()}`,
      villageName: trimmedVillage,
      talukaName: `${selectedTaluka.name[lang]}, ${selectedTaluka.district[lang]}`,
      actionType: matchedOption.label,
      targetAcres: parsedAcres,
      projectedSavedLitersDay: savedLitersDay,
    };

    setResolutions((prev) => [newRec, ...prev]);
    setVillageNameInput('');
    setTargetAcresInput('');
  };

  return (
    <section id="committee-section" className="py-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#182218] text-balance">
            {t.committeeTitle}
          </h2>
          <p className="mt-1.5 text-sm sm:text-base text-[#182218]/75 max-w-3xl">
            {t.committeeSubtitle}
          </p>
        </div>

        <div className="text-xs font-mono-tabular text-[#182218]/75 bg-white border border-[#182218]/15 px-3.5 py-2 rounded-lg shrink-0">
          {t.activeJurisdictionLabel}{' '}
          <strong className="text-[#182218]">
            {selectedTaluka.name[lang]} ({selectedTaluka.district[lang]})
          </strong>
        </div>
      </div>

      {/* Top Row: Interactive Drip Adoption Slider & 4 Village Aquifer Balance Metrics */}
      <div className="bg-white border border-[#182218]/12 rounded-xl p-5 sm:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#182218]/10">
          <div className="max-w-xl">
            <label
              htmlFor="drip-target-slider"
              className="block text-sm font-bold text-[#182218]"
            >
              {t.dripTargetSliderLabel}:{' '}
              <span className="font-mono-tabular text-[#059605]">{dripAdoptionTarget}%</span>
            </label>
            <p className="text-xs text-[#182218]/70 mt-0.5">{t.dripSliderDescription}</p>
          </div>

          <div className="w-full md:w-72 flex items-center gap-3">
            <span className="text-xs font-mono-tabular text-[#182218]/60">15%</span>
            <input
              id="drip-target-slider"
              type="range"
              min={15}
              max={90}
              step={5}
              value={dripAdoptionTarget}
              onChange={(e) => setDripAdoptionTarget(Number(e.target.value))}
              className="w-full accent-[#06ce06] cursor-pointer"
            />
            <span className="text-xs font-mono-tabular text-[#182218]/60">90%</span>
          </div>
        </div>

        {/* 4 Village Balance KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
          <div className="p-4 rounded-lg bg-[#F9F8F3] border border-[#182218]/10">
            <div className="text-xs text-[#182218]/65">{t.villageDemandLabel}</div>
            <div className="mt-1 text-2xl font-bold font-mono-tabular text-[#182218]">
              {selectedTaluka.villageDemandMld.toFixed(2)} MLD
            </div>
            <div className="mt-1 text-xs text-[#182218]/65">
              {selectedTaluka.farmersEnrolled.toLocaleString()} {t.smallholdersCountSuffix}
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#F9F8F3] border border-[#182218]/10">
            <div className="text-xs text-[#182218]/65">{t.aquiferRechargeLabel}</div>
            <div className="mt-1 text-2xl font-bold font-mono-tabular text-[#0284c7]">
              {selectedTaluka.rechargeCapacityMld.toFixed(2)} MLD
            </div>
            <div className="mt-1 text-xs text-[#182218]/65">{t.safeExtractionSub}</div>
          </div>

          <div className="p-4 rounded-lg bg-[#06ce06]/10 border border-[#06ce06]/40">
            <div className="text-xs font-semibold text-[#182218]">{t.projectedSavingsLabel}</div>
            <div className="mt-1 text-2xl font-bold font-mono-tabular text-[#182218]">
              +{budget.projectedSavingsMldWithDrip.toFixed(2)} MLD
            </div>
            <div className="mt-1 text-xs text-[#182218]/80 font-mono-tabular">
              {(budget.projectedSavingsMldWithDrip * 1000000).toLocaleString()} {t.conservedPerDaySuffix}
            </div>
          </div>

          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor:
                budget.resilienceStatus === 'surplus'
                  ? '#ecfdf3'
                  : budget.resilienceStatus === 'balanced'
                  ? '#fefce8'
                  : '#fff7ed',
              borderColor:
                budget.resilienceStatus === 'surplus'
                  ? '#06ce06'
                  : budget.resilienceStatus === 'balanced'
                  ? '#d3b44a'
                  : '#e07a2a',
            }}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-[#182218]">
              <span>{t.netBalanceLabel}</span>
              {budget.resilienceStatus === 'surplus' ? (
                <CheckCircle2 className="w-4 h-4 text-[#059605]" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-[#e07a2a]" />
              )}
            </div>
            <div className="mt-1 text-2xl font-bold font-mono-tabular text-[#182218]">
              {budget.postInterventionBalanceMld > 0 ? '+' : ''}
              {budget.postInterventionBalanceMld.toFixed(2)} MLD
            </div>
            <div className="mt-1 text-xs font-medium text-[#182218]/80">
              {t.droughtWarningPrefix} {selectedTaluka.droughtLeadDays}d
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 2-Column Split: Left = Recharts 6-Month Historical Groundwater Depletion LineChart, Right = Gram Panchayat Resolution Logger & Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 bg-white border border-[#182218]/12 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <h3 className="text-base font-bold text-[#182218]">{t.aquiferTrajectoryTitle}</h3>
              <span className="text-xs font-mono-tabular font-semibold text-[#182218] bg-[#F9F8F3] border border-[#182218]/15 px-2.5 py-0.5 rounded-md shrink-0">
                {selectedTaluka.groundwaterDepthMeters} {chartCopy.depthUnit} (-
                {selectedTaluka.groundwaterDepletionPct}%)
              </span>
            </div>
            <p className="text-xs text-[#182218]/70 mb-4">{t.aquiferTrajectorySubtitle}</p>

            {/* Recharts 6-Month Historical Groundwater Depletion Line Chart */}
            <div
              id="recharts-aquifer-line-chart"
              className="w-full h-64 pt-3 pb-1 px-2 bg-[#F9F8F3] border border-[#182218]/10 rounded-lg"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trajectoryData}
                  margin={{ top: 10, right: 18, left: -8, bottom: 4 }}
                >
                  <CartesianGrid stroke="#182218" strokeOpacity={0.08} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="monthLabel"
                    tick={{ fill: '#182218', fontSize: 11, fontWeight: 600 }}
                    axisLine={{ stroke: '#182218', strokeOpacity: 0.2 }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#182218', fontSize: 11, fontWeight: 500 }}
                    axisLine={{ stroke: '#182218', strokeOpacity: 0.2 }}
                    tickLine={false}
                    unit="m"
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#182218',
                      borderColor: '#d3b44a',
                      borderRadius: '8px',
                      color: '#F9F8F3',
                      fontSize: '12px',
                    }}
                    itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                    labelStyle={{ color: '#d3b44a', fontWeight: 700, marginBottom: '4px' }}
                    formatter={(value, name) => [
                      `${value} m bgl`,
                      name === 'baselineDepthM' ? t.legendBaselineDrawdown : t.legendManagedDepth,
                    ]}
                  />
                  <ReferenceLine
                    y={18}
                    stroke="#c92a2a"
                    strokeDasharray="4 4"
                    strokeOpacity={0.55}
                  />
                  <Line
                    type="monotone"
                    dataKey="baselineDepthM"
                    name="baselineDepthM"
                    stroke="#d3b44a"
                    strokeWidth={3}
                    dot={{ r: 4.5, fill: '#d3b44a', stroke: '#182218', strokeWidth: 1.5 }}
                    activeDot={{ r: 6, fill: '#d3b44a', stroke: '#182218', strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="conservedDepthM"
                    name="conservedDepthM"
                    stroke="#06ce06"
                    strokeWidth={3}
                    dot={{ r: 4.5, fill: '#06ce06', stroke: '#182218', strokeWidth: 1.5 }}
                    activeDot={{ r: 6, fill: '#06ce06', stroke: '#182218', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#182218]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5 font-medium text-[#182218]">
                <span className="w-3.5 h-1 rounded-xs bg-[#d3b44a] inline-block" />
                {t.legendBaselineDrawdown}
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium text-[#182218]">
                <span className="w-3.5 h-1 rounded-xs bg-[#06ce06] inline-block" />
                {t.legendManagedDepth}
              </span>
            </div>
            <span className="font-mono-tabular font-semibold text-[#059605]">
              +{latestTrajectoryPoint ? latestTrajectoryPoint.waterTableSavedM.toFixed(1) : '2.6'}m{' '}
              {t.waterTableProtectedSuffix}
            </span>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white border border-[#182218]/12 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-[#182218]" />
              <h3 className="text-base font-bold text-[#182218]">{t.scheduleResolutionTitle}</h3>
            </div>

            <form onSubmit={handleAddResolution} className="space-y-3 mb-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label
                    htmlFor="village-name-input"
                    className="block text-xs font-medium text-[#182218]/75 mb-1"
                  >
                    {t.villageNameInputLabel}
                  </label>
                  <input
                    id="village-name-input"
                    type="text"
                    value={villageNameInput}
                    onChange={(e) => setVillageNameInput(e.target.value)}
                    placeholder="e.g. Shirur Anantpal GP"
                    className="w-full px-3 py-2 bg-[#F9F8F3] border border-[#182218]/20 rounded-lg text-xs font-medium text-[#182218]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="committee-action-select"
                    className="block text-xs font-medium text-[#182218]/75 mb-1"
                  >
                    {t.committeeActionSelectLabel}
                  </label>
                  <select
                    id="committee-action-select"
                    value={selectedActionId}
                    onChange={(e) => setSelectedActionId(e.target.value)}
                    className="w-full px-2.5 py-2 bg-[#F9F8F3] border border-[#182218]/20 rounded-lg text-xs font-medium text-[#182218]"
                  >
                    {RESOLUTION_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label[lang]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="target-acres-input"
                    className="block text-xs font-medium text-[#182218]/75 mb-1"
                  >
                    {t.targetAcreageInputLabel}
                  </label>
                  <input
                    id="target-acres-input"
                    type="number"
                    min={1}
                    max={5000}
                    value={targetAcresInput}
                    onChange={(e) => setTargetAcresInput(e.target.value)}
                    placeholder="300"
                    className="w-full px-3 py-2 bg-[#F9F8F3] border border-[#182218]/20 rounded-lg text-xs font-mono-tabular font-semibold text-[#182218]"
                  />
                </div>
              </div>

              {formError && (
                <p className="text-xs font-semibold text-[#c92a2a]" role="alert">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#d3b44a] hover:bg-[#c5a63b] text-[#182218] text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{t.addResolutionBtn}</span>
              </button>
            </form>
          </div>

          <div className="overflow-x-auto border-t border-[#182218]/10 pt-3">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#182218]/10 text-[11px] font-semibold text-[#182218]/65">
                  <th className="py-2 pr-2">{t.tableColGp}</th>
                  <th className="py-2 px-2">{t.tableColResolution}</th>
                  <th className="py-2 px-2 text-right">{t.tableColArea}</th>
                  <th className="py-2 pl-2 text-right">{t.tableColSaved}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182218]/10 text-xs">
                {resolutions.map((res) => (
                  <tr key={res.id} className="hover:bg-[#F9F8F3]">
                    <td className="py-2.5 pr-2 font-semibold text-[#182218]">
                      <div>{res.villageName}</div>
                      <div className="text-[11px] font-normal text-[#182218]/65">
                        {res.talukaName}
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-[#182218]/85">{res.actionType[lang]}</td>
                    <td className="py-2.5 px-2 text-right font-mono-tabular text-[#182218]">
                      {res.targetAcres.toLocaleString()} ac
                    </td>
                    <td className="py-2.5 pl-2 text-right font-mono-tabular font-bold text-[#059605]">
                      {(res.projectedSavedLitersDay / 1000).toFixed(0)}k L
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
