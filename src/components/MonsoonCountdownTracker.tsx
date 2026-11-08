import React, { useEffect, useState } from 'react';
import { CloudRain, Compass, ShieldCheck, Timer } from 'lucide-react';
import {
  calculateMonsoonArrivalCountdown,
  type TalukaRecord,
  type Language,
} from '../utils/waterEngine';

interface MonsoonCountdownTrackerProps {
  talukas: TalukaRecord[];
  selectedTaluka: TalukaRecord;
  onSelectTaluka: (taluka: TalukaRecord) => void;
  lang: Language;
}

const TRACKER_COPY: Record<
  Language,
  {
    kicker: string;
    title: string;
    regionSelectLabel: string;
    daysUnit: string;
    hoursUnit: string;
    minsUnit: string;
    secsUnit: string;
    expectedSpellLabel: string;
    confidenceLabel: string;
    onsetDayLabel: string;
    actionHeading: string;
  }
> = {
  en: {
    kicker: 'IMD PUNE DOPPLER + ISRO INSAT-3DR LIVE TRACKER',
    title: 'Real-Time Regional Monsoon Arrival Countdown',
    regionSelectLabel: 'Switch Region:',
    daysUnit: 'DAYS',
    hoursUnit: 'HRS',
    minsUnit: 'MIN',
    secsUnit: 'SEC',
    expectedSpellLabel: 'Expected Onset Spell',
    confidenceLabel: 'IMD Model Confidence',
    onsetDayLabel: 'Peak Arrival Window',
    actionHeading: 'Pre-Monsoon Farmer Action:',
  },
  mr: {
    kicker: 'IMD पुणे डॉपलर + इस्रो INSAT-3DR थेट मान्सून ट्रॅकर',
    title: 'विभागनिहाय मान्सून आगमन रिअल-टाइम काउंटडाऊन',
    regionSelectLabel: 'विभाग निवडा:',
    daysUnit: 'दिवस',
    hoursUnit: 'तास',
    minsUnit: 'मिनिटे',
    secsUnit: 'सेकंद',
    expectedSpellLabel: 'अपेक्षित पहिला पाऊस',
    confidenceLabel: 'IMD अंदाज अचूकता',
    onsetDayLabel: 'आगमनाचा वार',
    actionHeading: 'मान्सूनपूर्व शेतकरी कृती:',
  },
  hi: {
    kicker: 'IMD पुणे डॉप्लर + इसरो INSAT-3DR लाइव मानसून ट्रैकर',
    title: 'क्षेत्रीय मानसून आगमन रियल-टाइम काउंटडाउन',
    regionSelectLabel: 'क्षेत्र चुनें:',
    daysUnit: 'दिन',
    hoursUnit: 'घंटे',
    minsUnit: 'मिनट',
    secsUnit: 'सेकंड',
    expectedSpellLabel: 'संभावित मानसून वर्षा',
    confidenceLabel: 'IMD मॉडल सटीकता',
    onsetDayLabel: 'मुख्य आगमन दिवस',
    actionHeading: 'मानसून-पूर्व किसान सलाह:',
  },
};

const REGION_BUTTONS: {
  id: TalukaRecord['Region'];
  shortName: Record<Language, string>;
}[] = [
  {
    id: 'Marathwada',
    shortName: { en: 'Marathwada', mr: 'मराठवाडा', hi: 'मराठवाड़ा' },
  },
  {
    id: 'Vidarbha',
    shortName: { en: 'Vidarbha', mr: 'विदर्भ', hi: 'विदर्भ' },
  },
  {
    id: 'Western Maharashtra',
    shortName: { en: 'Western MH', mr: 'पश्चिम महाराष्ट्र', hi: 'पश्चिम महाराष्ट्र' },
  },
  {
    id: 'Khandesh',
    shortName: { en: 'Khandesh', mr: 'खानदेश', hi: 'खानदेश' },
  },
];

export const MonsoonCountdownTracker: React.FC<MonsoonCountdownTrackerProps> = ({
  talukas,
  selectedTaluka,
  onSelectTaluka,
  lang,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Reset elapsed counter when selected taluka changes and tick every second
  useEffect(() => {
    setElapsedSeconds(0);
    const interval = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [selectedTaluka.id]);

  const countdown = calculateMonsoonArrivalCountdown(selectedTaluka, elapsedSeconds);
  const copy = TRACKER_COPY[lang];

  const handleRegionQuickSwitch = (region: TalukaRecord['Region']) => {
    const firstInRegion = talukas.find((t) => t.Region === region);
    if (firstInRegion) {
      onSelectTaluka(firstInRegion);
    }
  };

  return (
    <div
      id="monsoon-countdown-tracker"
      className="mt-5 p-4 sm:p-5 rounded-xl bg-white border border-[#182218]/15 shadow-xs"
    >
      {/* Top Header Row: Title + Quick Region Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3.5 border-b border-[#182218]/10">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono-tabular font-bold text-[#059605] uppercase tracking-wider">
            <Timer className="w-3.5 h-3.5 text-[#06ce06] shrink-0" />
            <span>{copy.kicker}</span>
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-[#182218] mt-0.5">
            {copy.title} —{' '}
            <span className="text-[#9a7b1c]">{countdown.regionLabel[lang]}</span>
          </h2>
        </div>

        {/* Regional Selector Tabs */}
        <div
          className="flex flex-wrap items-center gap-1.5 p-1 bg-[#EFECE3] border border-[#182218]/15 rounded-lg self-start lg:self-auto"
          role="group"
          aria-label={copy.regionSelectLabel}
        >
          <span className="px-2 text-[11px] font-semibold text-[#182218]/70 flex items-center gap-1">
            <Compass className="w-3 h-3 text-[#9a7b1c]" />
            <span>{copy.regionSelectLabel}</span>
          </span>
          {REGION_BUTTONS.map((reg) => {
            const isActive = selectedTaluka.Region === reg.id;
            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => handleRegionQuickSwitch(reg.id)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#182218] text-[#06ce06]'
                    : 'text-[#182218]/75 hover:text-[#182218]'
                }`}
              >
                {reg.shortName[lang]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Countdown & Regional Telemetry Grid */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* 4-Unit Digital Countdown Clock (Days, Hours, Minutes, Seconds) */}
        <div className="lg:col-span-5 grid grid-cols-4 gap-2.5">
          <div className="p-3 rounded-lg bg-[#182218] text-[#F9F8F3] text-center border-b-4 border-[#06ce06]">
            <div
              id="monsoon-days-left"
              className="text-2xl sm:text-3xl font-extrabold font-mono-tabular text-[#06ce06]"
            >
              {String(countdown.daysLeft).padStart(2, '0')}
            </div>
            <div className="mt-0.5 text-[10px] font-bold tracking-wider text-[#F9F8F3]/80 uppercase">
              {copy.daysUnit}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#182218] text-[#F9F8F3] text-center border-b-4 border-[#74c328]">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono-tabular text-[#F9F8F3]">
              {String(countdown.hoursLeft).padStart(2, '0')}
            </div>
            <div className="mt-0.5 text-[10px] font-bold tracking-wider text-[#F9F8F3]/80 uppercase">
              {copy.hoursUnit}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#182218] text-[#F9F8F3] text-center border-b-4 border-[#d3b44a]">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono-tabular text-[#F9F8F3]">
              {String(countdown.minutesLeft).padStart(2, '0')}
            </div>
            <div className="mt-0.5 text-[10px] font-bold tracking-wider text-[#F9F8F3]/80 uppercase">
              {copy.minsUnit}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#182218] text-[#F9F8F3] text-center border-b-4 border-[#06ce06]">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono-tabular text-[#d3b44a]">
              {String(countdown.secondsLeft).padStart(2, '0')}
            </div>
            <div className="mt-0.5 text-[10px] font-bold tracking-wider text-[#F9F8F3]/80 uppercase">
              {copy.secsUnit}
            </div>
          </div>
        </div>

        {/* Regional Onset Telemetry & Pre-Monsoon Advisory */}
        <div className="lg:col-span-7 flex flex-col gap-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="px-3 py-2 rounded-lg bg-[#F9F8F3] border border-[#182218]/10">
              <div className="text-[11px] text-[#182218]/65">{copy.onsetDayLabel}</div>
              <div className="mt-0.5 text-sm font-bold text-[#182218] flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-[#0284c7] shrink-0" />
                <span>
                  {countdown.expectedWindowLabel[lang]} ({countdown.talukaName[lang]})
                </span>
              </div>
            </div>

            <div className="px-3 py-2 rounded-lg bg-[#F9F8F3] border border-[#182218]/10">
              <div className="text-[11px] text-[#182218]/65">{copy.expectedSpellLabel}</div>
              <div className="mt-0.5 text-sm font-bold font-mono-tabular text-[#059605]">
                +{countdown.expectedOnsetRainMm} mm (7d IMD)
              </div>
            </div>

            <div className="px-3 py-2 rounded-lg bg-[#F9F8F3] border border-[#182218]/10">
              <div className="text-[11px] text-[#182218]/65">{copy.confidenceLabel}</div>
              <div className="mt-0.5 text-sm font-bold font-mono-tabular text-[#182218] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#06ce06] shrink-0" />
                <span>{countdown.imdConfidencePct}% Verified</span>
              </div>
            </div>
          </div>

          <div className="px-3.5 py-2.5 rounded-lg bg-[#ecfdf3] border border-[#06ce06]/50 text-xs text-[#182218] flex flex-wrap items-center justify-between gap-2">
            <div>
              <strong className="font-bold text-[#182218]">{copy.actionHeading} </strong>
              <span>{countdown.preMonsoonAction[lang]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
