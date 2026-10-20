/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Heart, Bell, Sparkles, Shield, ArrowRight, RefreshCw, CheckCircle2, ArrowLeft } from 'lucide-react';
import { soundSanctuary } from '../utils/soundSanctuary.ts';

interface EmergencyCalmProps {
  onNavigateToYoga?: () => void;
  onNavigateToConsult?: () => void;
  onBackToHome?: () => void;
}

export const EmergencyCalm: React.FC<EmergencyCalmProps> = ({
  onNavigateToYoga,
  onNavigateToConsult,
  onBackToHome
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [sighSeconds, setSighSeconds] = useState<number>(60);
  const [isActiveSigh, setIsActiveSigh] = useState<boolean>(true);
  const [breathPhase, setBreathPhase] = useState<'double-inhale' | 'long-exhale'>('double-inhale');

  // Trigger ground tone on mount
  useEffect(() => {
    soundSanctuary.playEmergencySighTone();
    soundSanctuary.playSingingBowl(216);
  }, []);

  // 60-second physiological sigh timer
  useEffect(() => {
    if (!isActiveSigh || sighSeconds <= 0) return;

    const interval = setInterval(() => {
      setSighSeconds((s) => {
        if (s <= 1) {
          setIsActiveSigh(false);
          soundSanctuary.playMeditationBell(432);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActiveSigh, sighSeconds]);

  // Rhythm of physiological sigh: 4s double inhale, 6s exhale
  useEffect(() => {
    if (!isActiveSigh) return;

    const phaseInterval = setInterval(() => {
      setBreathPhase((prev) => (prev === 'double-inhale' ? 'long-exhale' : 'double-inhale'));
    }, 5000);

    return () => clearInterval(phaseInterval);
  }, [isActiveSigh]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 animate-fadeIn">
      {/* Back Button Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs font-medium text-[#5E5852] hover:text-[#26221E] bg-[#FFFFFF] border border-[#E8E1D5] px-4 py-2 rounded-full transition-all cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#CE4257]" />
          <span>Return to Sanctuary Home</span>
        </button>

        <span className="text-xs text-[#CE4257] font-medium hidden sm:inline">
          Acute Vagal Reset Protocol
        </span>
      </div>
      {/* Acute Support Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#FFF6F7] border border-[#FAD2D7] relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#CE4257]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#CE4257] animate-ping" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#CE4257]">
              Instant Acute Relief · Somatosensory Reset
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#26221E] font-medium leading-tight">
            You are completely safe. Your body knows how to settle.
          </h1>

          <p className="text-sm sm:text-base text-[#5E5852] leading-relaxed">
            When adrenaline rushes, the mind races to explain it. You do not need to figure anything out right now. Follow this 60-second physiological sigh with Dr. Syed Karishma.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={() => {
                soundSanctuary.playEmergencySighTone();
                soundSanctuary.playSingingBowl(216);
              }}
              className="px-5 py-2.5 rounded-full bg-[#CE4257] text-[#FFFFFF] hover:bg-[#B52B40] text-xs font-medium tracking-wide transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Bell className="w-4 h-4" />
              <span>Resonate Grounding Bowl (136.1 Hz)</span>
            </button>

            <button
              onClick={() => {
                setSighSeconds(60);
                setIsActiveSigh(true);
              }}
              className="p-2.5 rounded-full border border-[#FAD2D7] hover:bg-[#FFFFFF] text-[#CE4257] transition-colors cursor-pointer"
              title="Restart 60s Cycle"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 60-Second Physiological Sigh Core Visualizer */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] text-center space-y-6">
        <div className="flex items-center justify-between border-b border-[#EFE8DC] pb-4 max-w-xl mx-auto">
          <span className="text-xs uppercase tracking-wider text-[#7A7268] font-medium">
            Step 1 · The Physiological Sigh
          </span>
          <span className="font-serif text-lg text-[#CE4257] font-semibold">
            {sighSeconds}s remaining
          </span>
        </div>

        {/* Breathing Sphere */}
        <div className="relative flex items-center justify-center w-60 h-60 sm:w-72 sm:h-72 mx-auto my-4">
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-tr from-[#CE4257]/15 to-[#E0AFA0]/20 blur-xl transition-all duration-3000 ${
              breathPhase === 'double-inhale' ? 'scale-120' : 'scale-85'
            }`}
          />
          <div
            className={`relative z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-full border-2 border-[#CE4257]/40 bg-[#FFFDFC] flex flex-col items-center justify-center shadow-lg transition-all duration-3000 ${
              breathPhase === 'double-inhale' ? 'scale-115' : 'scale-90'
            }`}
          >
            <Heart className="w-6 h-6 text-[#CE4257] mb-2 animate-pulse" />
            <span className="font-serif text-lg sm:text-xl font-medium text-[#26221E]">
              {breathPhase === 'double-inhale' ? 'Inhale... + Sniff In' : 'Long Sighing Exhale'}
            </span>
            <span className="text-[11px] text-[#7A7268] mt-1 max-w-[140px]">
              {breathPhase === 'double-inhale'
                ? 'Deep breath, then a second top-up sniff'
                : 'Slow unforced release through soft lips'}
            </span>
          </div>
        </div>

        <p className="font-serif text-sm text-[#5E5852] italic max-w-md mx-auto">
          “Two deep sniffs in through the nose inflate collapsed alveoli; the long slow exhalation immediately triggers parasympathetic vagal braking on heart rate.”
        </p>
      </div>

      {/* 3-Step Somatic Vagal Grounding Sequence */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Step A */}
        <div className="p-6 rounded-3xl bg-[#F4EFE6] border border-[#E8E1D5] space-y-3">
          <span className="text-xs font-mono text-[#CE4257] font-bold">01. PALM OVER HEART</span>
          <h3 className="font-serif text-base text-[#26221E] font-medium">
            Warm Physical Contact
          </h3>
          <p className="text-xs text-[#5E5852] leading-relaxed">
            Place your dominant warm palm firmly over the center of your chest. Place your other hand gently on your low belly. Feel the rise and fall without needing to change it.
          </p>
        </div>

        {/* Step B */}
        <div className="p-6 rounded-3xl bg-[#F4EFE6] border border-[#E8E1D5] space-y-3">
          <span className="text-xs font-mono text-[#CE4257] font-bold">02. UNCLENCH THE JAW</span>
          <h3 className="font-serif text-base text-[#26221E] font-medium">
            Drop the Tongue Down
          </h3>
          <p className="text-xs text-[#5E5852] leading-relaxed">
            Part your lips slightly. Allow your lower jaw to hang completely loose. Let the tongue drop away from the roof of your mouth. Your trigeminal nerve relaxes instantly.
          </p>
        </div>

        {/* Step C */}
        <div className="p-6 rounded-3xl bg-[#F4EFE6] border border-[#E8E1D5] space-y-3">
          <span className="text-xs font-mono text-[#CE4257] font-bold">03. HORIZON SOFT FOCUS</span>
          <h3 className="font-serif text-base text-[#26221E] font-medium">
            Panoramic Peripheral Vision
          </h3>
          <p className="text-xs text-[#5E5852] leading-relaxed">
            Do not stare intently at any single screen point. Widen your gaze to notice the corners of the room and the ambient light. Tunnel vision signals danger; panorama signals peace.
          </p>
        </div>
      </div>

      {/* Next Gentle Steps */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-serif text-base text-[#26221E] font-medium">
            Feeling the surge begin to soften?
          </h4>
          <p className="text-xs text-[#7A7268]">
            Transition gently into a 5-minute restorative yoga posture or schedule a calming consultation with Dr. Karishma.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onNavigateToYoga && (
            <button
              onClick={onNavigateToYoga}
              className="px-5 py-2.5 rounded-full text-xs font-medium bg-[#F4EFE6] hover:bg-[#EAE1D3] text-[#26221E] transition-colors cursor-pointer"
            >
              Restorative Yoga Flow
            </button>
          )}

          {onNavigateToConsult && (
            <button
              onClick={onNavigateToConsult}
              className="px-5 py-2.5 rounded-full text-xs font-medium bg-[#12161A] text-[#F9F6F0] hover:bg-[#252C33] transition-colors cursor-pointer"
            >
              Consult Dr. Karishma
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
