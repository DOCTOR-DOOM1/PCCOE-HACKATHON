import React, { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  Sprout,
  Droplets,
  ThermometerSun,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { DIAGNOSTIC_SAMPLES, type DiagnosticSample } from '../data/maharashtraData';
import type { Language } from '../utils/waterEngine';
import type { UITranslations } from '../data/translations';

interface CropDiagnosticSectionProps {
  lang: Language;
  t: UITranslations;
  onApplyDiagnosisToAdvisory: (note: string) => void;
}

export const CropDiagnosticSection: React.FC<CropDiagnosticSectionProps> = ({
  lang,
  t,
  onApplyDiagnosisToAdvisory,
}) => {
  const [selectedSample, setSelectedSample] = useState<DiagnosticSample>(DIAGNOSTIC_SAMPLES[0]);
  const [customPhotoPreview, setCustomPhotoPreview] = useState<string | null>(null);
  const [customPhotoName, setCustomPhotoName] = useState<string | null>(null);
  const [appliedBanner, setAppliedBanner] = useState<boolean>(false);
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomPhotoPreview(reader.result);
        setCustomPhotoName(file.name);
        setSelectedSample(DIAGNOSTIC_SAMPLES[0]);
        setAppliedBanner(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (sample: DiagnosticSample) => {
    setSelectedSample(sample);
    setCustomPhotoPreview(null);
    setCustomPhotoName(null);
    setAppliedBanner(false);
  };

  const handleFoldIntoAdvisory = () => {
    onApplyDiagnosisToAdvisory(
      `${selectedSample.badgeLabel[lang]} — ${selectedSample.irrigationAdjustment[lang]}`
    );
    setAppliedBanner(true);
  };

  const getDiagnosisColors = (type: DiagnosticSample['diagnosisType']) => {
    if (type === 'healthy_drip') {
      return {
        bg: '#ecfdf3',
        border: '#06ce06',
        accent: '#06ce06',
      };
    }
    if (type === 'foliar_disease') {
      return {
        bg: '#fefce8',
        border: '#d3b44a',
        accent: '#d3b44a',
      };
    }
    return {
      bg: '#fff7ed',
      border: '#d95326',
      accent: '#d95326',
    };
  };

  const activeColors = getDiagnosisColors(selectedSample.diagnosisType);

  return (
    <section id="diagnostics-section" className="py-8 border-b border-[#182218]/10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#182218] text-balance">
            {t.diagnosticsTitle}
          </h2>
          <p className="mt-1.5 text-sm sm:text-base text-[#182218]/75 max-w-3xl">
            {t.diagnosticsSubtitle}
          </p>
        </div>

        {/* Custom Field Photo Upload Control */}
        <div className="shrink-0">
          <label
            htmlFor="field-photo-upload"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#182218] text-[#F9F8F3] hover:bg-[#182218]/90 text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap shrink-0"
          >
            <Camera className="w-4 h-4 text-[#d3b44a]" />
            <span>{t.uploadCustomPhotoBtn}</span>
            <input
              id="field-photo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="sr-only"
            />
          </label>
        </div>
      </div>

      {/* 3 Preset Field Sample Selector Cards */}
      <div className="mb-6">
        <div className="text-xs font-semibold text-[#182218]/75 mb-3">
          {t.selectSamplePrompt}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DIAGNOSTIC_SAMPLES.map((sample) => {
            const isSelected = sample.id === selectedSample.id && !customPhotoPreview;
            const c = getDiagnosisColors(sample.diagnosisType);
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectPreset(sample)}
                className={`text-left rounded-xl overflow-hidden border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#182218] ring-2 ring-[#d3b44a] bg-white'
                    : 'border-[#182218]/15 bg-white hover:border-[#182218]/40'
                }`}
              >
                <div className="relative h-44 w-full bg-[#EFECE3] overflow-hidden">
                  {!imgErrorMap[sample.id] ? (
                    <img
                      src={sample.imageUrl}
                      alt={sample.title[lang]}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setImgErrorMap((prev) => ({ ...prev, [sample.id]: true }))
                      }
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#EFECE3] to-[#d3b44a]/30 text-[#182218]">
                      <Sprout className="w-8 h-8 mb-2 text-[#182218]/60" />
                      <span className="text-xs font-semibold text-center">
                        {sample.title[lang]}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
                    <span
                      className="inline-block px-2 py-0.5 text-[11px] font-bold rounded-xs text-[#182218]"
                      style={{ backgroundColor: c.accent }}
                    >
                      {sample.badgeLabel[lang]}
                    </span>
                  </div>
                </div>

                <div className="p-3.5">
                  <div className="text-xs text-[#182218]/65">{sample.locationTag[lang]}</div>
                  <div className="text-sm font-bold text-[#182218] mt-0.5">
                    {sample.title[lang]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed Multimodal Diagnostic Breakdown */}
      <div className="bg-white border border-[#182218]/12 rounded-xl p-5 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: High-Res Inspected Image Frame */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#F9F8F3] border border-[#182218]/10 rounded-lg overflow-hidden">
            <div className="relative h-64 sm:h-72 w-full bg-[#EFECE3]">
              <img
                src={customPhotoPreview || selectedSample.imageUrl}
                alt={selectedSample.title[lang]}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {customPhotoName && (
                <div className="absolute top-3 left-3 bg-[#182218]/90 text-[#F9F8F3] px-2.5 py-1 rounded-xs text-xs font-mono-tabular">
                  Uploaded: {customPhotoName}
                </div>
              )}
            </div>

            {/* 3 Telemetry Readouts Under Image */}
            <div className="grid grid-cols-3 divide-x divide-[#182218]/10 border-t border-[#182218]/10 bg-white p-3 text-center">
              <div>
                <div className="text-[11px] text-[#182218]/65">{t.confidenceLabel}</div>
                <div className="text-sm font-bold font-mono-tabular text-[#182218] mt-0.5">
                  {selectedSample.confidencePct}%
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#182218]/65 flex items-center justify-center gap-1">
                  <Droplets className="w-3 h-3 text-[#0284c7]" />
                  <span>{t.observedMoistureLabel}</span>
                </div>
                <div className="text-sm font-bold font-mono-tabular text-[#182218] mt-0.5">
                  {selectedSample.soilMoistureObservedPct}%
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#182218]/65 flex items-center justify-center gap-1">
                  <ThermometerSun className="w-3 h-3 text-[#d95326]" />
                  <span>{t.canopyDeltaLabel}</span>
                </div>
                <div className="text-sm font-bold font-mono-tabular text-[#182218] mt-0.5">
                  {selectedSample.canopyTempDeltaC > 0 ? '+' : ''}
                  {selectedSample.canopyTempDeltaC}°C
                </div>
              </div>
            </div>
          </div>

          {/* Right: Pathology vs Water Stress Reasoning & Irrigation Action */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-bold mb-3"
                style={{
                  backgroundColor: activeColors.bg,
                  borderColor: activeColors.border,
                  color: '#182218',
                }}
              >
                {selectedSample.diagnosisType === 'healthy_drip' ? (
                  <CheckCircle2 className="w-4 h-4 text-[#059605]" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-[#d95326]" />
                )}
                <span>{selectedSample.badgeLabel[lang]}</span>
              </div>

              <h3 className="text-xl font-bold text-[#182218]">
                {selectedSample.title[lang]}
              </h3>

              <div className="mt-4 space-y-3.5">
                <div className="p-3.5 rounded-lg bg-[#F9F8F3] border border-[#182218]/10">
                  <div className="text-xs font-bold text-[#182218] mb-1">
                    {t.visualFindingTitle}
                  </div>
                  <p className="text-sm text-[#182218]/85 leading-relaxed">
                    {selectedSample.summaryFinding[lang]}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#06ce06]/10 border border-[#06ce06]/40">
                  <div className="flex items-center justify-between text-xs font-bold text-[#182218] mb-1">
                    <span>{t.irrigationActionTitle}</span>
                    <span className="font-mono-tabular">
                      {t.savesPerAcrePrefix} {selectedSample.litersSavedPerAcre.toLocaleString()} L/acre
                    </span>
                  </div>
                  <p className="text-sm font-medium text-[#182218] leading-relaxed">
                    {selectedSample.irrigationAdjustment[lang]}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-[#d3b44a]/15 border border-[#d3b44a]/50">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#182218] mb-1">
                    <BookOpen className="w-3.5 h-3.5 text-[#9a7b1c]" />
                    <span>{t.kvkExtensionProtocolTitle}</span>
                  </div>
                  <p className="text-sm text-[#182218]/90 leading-relaxed">
                    {selectedSample.kvkRemedy[lang]}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#182218]/10">
              <button
                type="button"
                onClick={handleFoldIntoAdvisory}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#182218] hover:bg-[#182218]/90 text-[#F9F8F3] text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>{t.applyToAdvisoryBtn}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#06ce06]" />
              </button>

              {appliedBanner && (
                <span className="text-xs font-semibold text-[#059605]">
                  ✓ {t.syncedAdvisoryBanner}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
