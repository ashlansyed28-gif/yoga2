/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Heart,
  Sparkles,
  Sun,
  Moon,
  Clock,
  ArrowLeft,
  X,
  Share2,
  ExternalLink,
  CheckCircle2,
  Play,
  Volume2,
  VolumeX,
  Activity,
  Layers,
  Box
} from 'lucide-react';
import { soundSanctuary } from '../utils/soundSanctuary.ts';
import { streakSystem } from '../utils/streakSystem.ts';
import { ShareProgressModal } from './ShareProgressModal.tsx';

export interface ProtocolDetailData {
  id: string;
  title: string;
  sanskrit: string;
  category: string;
  description: string;
  dailyRoutine: {
    dawn: string;
    midday: string;
    dusk: string;
  };
  herbalMedicine: string[];
  targetedAsanas: string[];
  pranayama: string;
  contraindications?: string[];
}

interface ProtocolDetailViewProps {
  protocolData: ProtocolDetailData;
  onClose?: () => void;
  onOpenPoseTab?: (asanaName: string) => void;
}

export const ProtocolDetailView: React.FC<ProtocolDetailViewProps> = ({
  protocolData,
  onClose,
  onOpenPoseTab
}) => {
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [audioActive, setAudioActive] = useState<boolean>(false);

  const handleRecordPractice = () => {
    streakSystem.recordPractice(
      'yoga',
      `Protocol: ${protocolData.title}`,
      20
    );
    setIsLogged(true);
    soundSanctuary.playSingingBowl(324);
  };

  const handlePlayPranayama = () => {
    if (audioActive) {
      soundSanctuary.stopAmbientPrana();
      setAudioActive(false);
    } else {
      soundSanctuary.startAmbientPrana();
      setAudioActive(true);
    }
  };

  const handleOpenStandalone = () => {
    const url = `${window.location.origin}${window.location.pathname}?tab=protocol&id=${encodeURIComponent(protocolData.id)}&standalone=true`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn select-none">
      {/* Top Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFFFFF] p-4 rounded-2xl border border-[#E8E1D5] shadow-xs">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#F9F6F0] hover:bg-[#EAE2D5] text-[#5E5852] hover:text-[#26221E] transition-colors cursor-pointer border border-[#E2D8C7]"
              title="Close Tab"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6C7A4D]">
                Clinical Protocol Tab
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F4EFE6] text-[#73532C] font-mono border border-[#E2D8C7]">
                {protocolData.category}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#26221E] font-medium leading-tight">
              {protocolData.title}
            </h1>
            <p className="font-serif text-sm text-[#7A7268] italic">
              {protocolData.sanskrit} &middot; Dr. Syed Karishma Integrative Clinic
            </p>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsShareOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F0EBE1] border border-[#D5C9B6] text-xs font-medium text-[#26221E] flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Share Protocol"
          >
            <Share2 className="w-3.5 h-3.5 text-[#B88554]" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={handleOpenStandalone}
            className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F0EBE1] border border-[#D5C9B6] text-xs font-medium text-[#26221E] flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Open in new window"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#73532C]" />
            <span className="hidden sm:inline">New Window</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F0EBE1] border border-[#D5C9B6] text-[#7A7268] hover:text-[#26221E] transition-colors cursor-pointer"
              title="Close this detail tab"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Clinical Description & Pathophysiology */}
      <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#E8E1D5] shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6C7A4D]">
          <ShieldCheck className="w-4 h-4" />
          <span>Doctor’s Clinical Rationale & Therapeutic Scope</span>
        </div>
        <p className="text-sm sm:text-base text-[#5E5852] leading-relaxed">
          {protocolData.description}
        </p>

        <div className="pt-4 border-t border-[#EFE8DC] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-[#7A7268]">
            <span>Daily Protocol Duration: <strong>14 Days</strong></span>
            <span>&middot;</span>
            <span>Guidance: <strong>Gentle Somatic Healing</strong></span>
          </div>

          <button
            onClick={handleRecordPractice}
            className={`px-5 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 cursor-pointer transition-all ${
              isLogged
                ? 'bg-emerald-600 text-white'
                : 'bg-[#12161A] hover:bg-[#252C33] text-white shadow-xs'
            }`}
          >
            {isLogged ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Protocol Recorded to Sadhana Streak!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#E0AFA0]" />
                <span>Complete Today's Protocol Routine</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3-Phase Daily Routine Grid: Dawn, Midday, Dusk */}
      <div className="space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#9E6E38] block px-1">
          Tri-Daily Circadian Routine (Ritucharya)
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E8E1D5] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B88554]">
              <Sun className="w-4 h-4 text-[#D4A373]" />
              <span>1. Dawn Practice (Brahma Muhurta)</span>
            </div>
            <p className="text-xs text-[#5E5852] leading-relaxed">
              {protocolData.dailyRoutine.dawn}
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E8E1D5] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6C7A4D]">
              <Clock className="w-4 h-4 text-[#8C9B6A]" />
              <span>2. Midday Tuning (Madhyahna)</span>
            </div>
            <p className="text-xs text-[#5E5852] leading-relaxed">
              {protocolData.dailyRoutine.midday}
            </p>
          </div>

          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#E8E1D5] shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3A6073]">
              <Moon className="w-4 h-4 text-[#64B5F6]" />
              <span>3. Dusk Surrender (Sandhya)</span>
            </div>
            <p className="text-xs text-[#5E5852] leading-relaxed">
              {protocolData.dailyRoutine.dusk}
            </p>
          </div>
        </div>
      </div>

      {/* Prescribed Asanas & Herbal Formulations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Prescribed Asanas with Direct "Open in 3D Tab" Buttons */}
        <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-3xl border border-[#E8E1D5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#26221E]">
              Prescribed Yoga Asanas
            </span>
            <span className="text-[11px] text-[#B88554]">
              Click any pose to open its 3D tab
            </span>
          </div>

          <div className="space-y-2.5">
            {protocolData.targetedAsanas.map((asana, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5] hover:border-[#B88554] flex items-center justify-between gap-3 transition-all"
              >
                <div className="flex items-center gap-2.5 text-xs text-[#26221E]">
                  <span className="w-5 h-5 rounded-full bg-[#EBE3D4] text-[#73532C] font-mono text-[10px] flex items-center justify-center font-bold">
                    {idx + 1}
                  </span>
                  <span className="font-medium">{asana}</span>
                </div>

                <button
                  onClick={() => {
                    if (onOpenPoseTab) {
                      onOpenPoseTab(asana);
                      soundSanctuary.playZenTingsha();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F4EFE6] border border-[#D5C9B6] text-[11px] font-semibold text-[#73532C] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0"
                  title="Open this pose in a new 3D tab"
                >
                  <Box className="w-3.5 h-3.5 text-[#B88554]" />
                  <span>Open 3D Tab</span>
                </button>
              </div>
            ))}
          </div>

          {/* Pranayama Audio Bar */}
          <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#E2D8C7] flex items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-semibold text-[#26221E] block">
                Prescribed Pranayama:
              </span>
              <p className="text-[11px] text-[#5E5852]">{protocolData.pranayama}</p>
            </div>
            <button
              onClick={handlePlayPranayama}
              className={`p-2.5 rounded-xl border transition-colors cursor-pointer shrink-0 ${
                audioActive
                  ? 'bg-[#12161A] text-white border-transparent'
                  : 'bg-[#FFFFFF] text-[#26221E] border-[#D5C9B6] hover:bg-[#F9F6F0]'
              }`}
              title={audioActive ? 'Stop Breath Audio' : 'Play Breath Audio'}
            >
              {audioActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Ayurvedic Herbal Medicine Formulas */}
        <div className="bg-[#FFFFFF] p-6 sm:p-7 rounded-3xl border border-[#E8E1D5] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#26221E]">
              Ayurvedic Herbal Medicines & Rasayanas
            </span>
            <span className="text-[11px] text-[#7A7268]">Doctor Curated</span>
          </div>

          <ul className="space-y-3 text-xs text-[#26221E]">
            {protocolData.herbalMedicine.map((med, idx) => (
              <li
                key={idx}
                className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5] flex items-start gap-3"
              >
                <span className="w-2 h-2 rounded-full bg-[#6C7A4D] shrink-0 mt-1.5" />
                <span className="leading-relaxed">{med}</span>
              </li>
            ))}
          </ul>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5] text-xs text-[#7A7268] space-y-1">
            <span className="font-semibold text-[#26221E] block">Clinical Safety Notice:</span>
            <p className="text-[11px] leading-relaxed">
              Formulas are non-habit-forming botanical remedies designed to work synergistically with asanas. Consult Dr. Syed Karishma if pregnant or nursing.
            </p>
          </div>
        </div>
      </div>

      {/* Share Progress Modal */}
      {isShareOpen && (
        <ShareProgressModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          streakState={streakSystem.getState()}
          userName="Practitioner"
          dailyIntention={`Clinical Protocol: ${protocolData.title}`}
        />
      )}
    </div>
  );
};
