/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Globe, Droplets, ArrowDownRight } from 'lucide-react';
import { MAHARASHTRA_TALUKAS } from './data/maharashtraData';
import { TRANSLATIONS } from './data/translations';
import type { Language, TalukaRecord } from './utils/waterEngine';
import { HeatMapSection } from './components/HeatMapSection';
import { CropClimateCalendarSection } from './components/CropClimateCalendarSection';
import { CropDiagnosticSection } from './components/CropDiagnosticSection';
import { VillageCommitteeSection } from './components/VillageCommitteeSection';
import { OfflineResilienceBanner } from './components/PWAOfflineManager';
import { MonsoonCountdownTracker } from './components/MonsoonCountdownTracker';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [selectedTaluka, setSelectedTaluka] = useState<TalukaRecord>(MAHARASHTRA_TALUKAS[0]);
  const [diagnosticOverrideNote, setDiagnosticOverrideNote] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F8F3] text-[#182218]">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-[#F9F8F3]/95 backdrop-blur-xs border-b border-[#182218]/12">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="text-lg font-extrabold tracking-tight text-[#182218] whitespace-nowrap shrink-0"
        >
          {t.brandTitle}
        </a>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#182218]/75"
        >
          <a
            href="#heatmap-section"
            className="hover:text-[#182218] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {t.navHeatMap}
          </a>
          <a
            href="#advisory-section"
            className="hover:text-[#182218] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {t.navAdvisory}
          </a>
          <a
            href="#diagnostics-section"
            className="hover:text-[#182218] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {t.navDiagnostics}
          </a>
          <a
            href="#committee-section"
            className="hover:text-[#182218] hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {t.navCommittee}
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => scrollToSection('advisory-section')}
            className="px-4 py-2 text-xs font-bold text-[#182218] bg-[#06ce06] hover:bg-[#05b505] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {t.ctaSendAdvisory}
          </button>
        </div>
      </header>

      {/* Main Content Container (1440px Desktop Presence) */}
      <main id="top" className="flex-1 max-w-[1380px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero & Multilingual Workspace Toolbar */}
        <section className="pt-7 pb-8 border-b border-[#182218]/12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
            {/* Unboxed Metadata Kicker with Typographic Separators */}
            <div className="text-xs font-semibold text-[#182218]/70">
              {t.heroKicker}
            </div>

            {/* Multilingual Switcher (English, Marathi मराठी, Hindi हिन्दी) */}
            <div
              className="inline-flex items-center gap-1 p-1 bg-[#EFECE3] border border-[#182218]/15 rounded-lg self-start lg:self-auto"
              role="group"
              aria-label="Select Interface Language"
            >
              <span className="px-2 text-xs font-medium text-[#182218]/75 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#9a7b1c]" />
                <span>{t.languageSelectorLabel}</span>
              </span>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  lang === 'en'
                    ? 'bg-[#182218] text-[#d3b44a]'
                    : 'text-[#182218]/75 hover:text-[#182218]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLang('mr')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  lang === 'mr'
                    ? 'bg-[#182218] text-[#d3b44a]'
                    : 'text-[#182218]/75 hover:text-[#182218]'
                }`}
              >
                मराठी (Marathi)
              </button>
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  lang === 'hi'
                    ? 'bg-[#182218] text-[#d3b44a]'
                    : 'text-[#182218]/75 hover:text-[#182218]'
                }`}
              >
                हिन्दी (Hindi)
              </button>
            </div>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-[#182218] leading-[1.15] text-balance">
              {t.heroHeadline}
            </h1>
            <p className="mt-3 text-base sm:text-lg text-[#182218]/80 max-w-3xl leading-relaxed">
              {t.heroSubheadline}
            </p>
          </div>

          {/* Real-Time Regional Monsoon Arrival Countdown Tracker */}
          <MonsoonCountdownTracker
            talukas={MAHARASHTRA_TALUKAS}
            selectedTaluka={selectedTaluka}
            onSelectTaluka={(taluka) => setSelectedTaluka(taluka)}
            lang={lang}
          />

          {/* Service Worker & Offline Advisory Cache Status Bar */}
          <OfflineResilienceBanner
            talukas={MAHARASHTRA_TALUKAS}
            selectedTaluka={selectedTaluka}
            lang={lang}
          />

          {/* Full-Width 4-Column Quantifiable Impact Strip */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-[#182218]/12 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#182218]/65">
                  {t.kpiTitleWaterSaved}
                </span>
                <Droplets className="w-4 h-4 text-[#059605]" />
              </div>
              <div className="mt-1.5 text-2xl font-extrabold font-mono-tabular text-[#182218]">
                {t.kpiLitersSavedLabel}
              </div>
              <p className="mt-1 text-xs text-[#182218]/70">{t.kpiLitersSavedSub}</p>
            </div>

            <div className="p-4 bg-white border border-[#182218]/12 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#182218]/65">
                  {t.kpiTitleDroughtLead}
                </span>
                <ArrowDownRight className="w-4 h-4 text-[#9a7b1c]" />
              </div>
              <div className="mt-1.5 text-2xl font-extrabold font-mono-tabular text-[#182218]">
                {t.kpiDroughtLeadLabel}
              </div>
              <p className="mt-1 text-xs text-[#182218]/70">{t.kpiDroughtLeadSub}</p>
            </div>

            <div className="p-4 bg-white border border-[#182218]/12 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#182218]/65">
                  {t.kpiTitleFarmersReach}
                </span>
                <span
                  className="w-3 h-3 rounded-xs"
                  style={{ backgroundColor: '#06ce06' }}
                  aria-hidden="true"
                />
              </div>
              <div className="mt-1.5 text-2xl font-extrabold font-mono-tabular text-[#182218]">
                {t.kpiFarmersCoveredLabel}
              </div>
              <p className="mt-1 text-xs text-[#182218]/70">{t.kpiFarmersCoveredSub}</p>
            </div>

            <div className="p-4 bg-white border border-[#182218]/12 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#182218]/65">
                  {t.kpiTitleKvkGrounded}
                </span>
                <span
                  className="w-3 h-3 rounded-xs"
                  style={{ backgroundColor: '#d3b44a' }}
                  aria-hidden="true"
                />
              </div>
              <div className="mt-1.5 text-2xl font-extrabold font-mono-tabular text-[#182218]">
                {t.kpiKvkGroundedLabel}
              </div>
              <p className="mt-1 text-xs text-[#182218]/70">{t.kpiKvkGroundedSub}</p>
            </div>
          </div>
        </section>

        {/* Section 01: Interactive Maharashtra Water Stress Heat Map & Vernacular Advisory */}
        <HeatMapSection
          talukas={MAHARASHTRA_TALUKAS}
          selectedTaluka={selectedTaluka}
          onSelectTaluka={(taluka) => setSelectedTaluka(taluka)}
          lang={lang}
          t={t}
          diagnosticOverrideNote={diagnosticOverrideNote}
        />

        {/* Section 02: Seasonal Crop-Climate & Monsoon Alignment Calendar */}
        <CropClimateCalendarSection
          selectedTaluka={selectedTaluka}
          lang={lang}
        />

        {/* Section 03: Multimodal Crop Stress vs. Disease Diagnostic */}
        <CropDiagnosticSection
          lang={lang}
          t={t}
          onApplyDiagnosisToAdvisory={(note) => {
            setDiagnosticOverrideNote(note);
            scrollToSection('advisory-section');
          }}
        />

        {/* Section 04: Gram Panchayat Village Water Committee Dashboard */}
        <VillageCommitteeSection
          selectedTaluka={selectedTaluka}
          lang={lang}
          t={t}
        />
      </main>

      {/* Clean Quiet Footer */}
      <footer className="mt-12 border-t border-[#182218]/12 bg-[#EFECE3]/60 py-6 px-6">
        <div className="max-w-[1380px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#182218]/70">
          <div>
            <strong>{t.brandTitle}</strong> · {t.footerTagline}
          </div>
          <div>{t.footerSources}</div>
        </div>
      </footer>
    </div>
  );
}
