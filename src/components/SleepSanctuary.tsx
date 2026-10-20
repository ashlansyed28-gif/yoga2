import React, { useState } from 'react';
import {
  Moon,
  Sparkles,
  Volume2,
  Clock,
  CheckCircle2,
  Bed,
  ArrowLeft,
  Coffee,
  Flame,
  Droplets,
  Eye,
  Heart,
  ShieldAlert,
  Compass,
  Box
} from 'lucide-react';
import { soundSanctuary } from '../utils/soundSanctuary.ts';
import { SleepVisualizer } from './SleepVisualizer.tsx';
import { WorkspaceTab } from '../types/workspaceTabs.ts';

interface SleepSanctuaryProps {
  onBackToHome?: () => void;
  onOpenTab?: (tab: WorkspaceTab) => void;
}

export const SleepSanctuary: React.FC<SleepSanctuaryProps> = ({ onBackToHome, onOpenTab }) => {
  const [isPlayingNidra, setIsPlayingNidra] = useState<boolean>(false);

  const toggleNidra = () => {
    if (!isPlayingNidra) {
      soundSanctuary.playSingingBowl(216);
      soundSanctuary.startNatureSoundscape('tanpura');
      setIsPlayingNidra(true);
    } else {
      soundSanctuary.stopAmbientPrana();
      setIsPlayingNidra(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10 animate-fadeIn">
      {/* Back Button Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs font-medium text-[#5E5852] hover:text-[#26221E] bg-[#FFFFFF] border border-[#E8E1D5] px-4 py-2 rounded-full transition-all cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#9E6E38]" />
          <span>Return to Sanctuary Home</span>
        </button>

        <span className="text-xs text-[#7A7268] hidden sm:inline">
          Nighttime Restorative, Chandra Pranayama & Yoga Nidra
        </span>
      </div>

      {/* Twilight Header with Quick Soundscape Audio */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#12161A] text-[#F9F6F0] border border-[#2A333C] relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E0AFA0]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="flex items-center gap-2 text-xs text-[#E0AFA0] uppercase tracking-wider font-medium">
            <Moon className="w-3.5 h-3.5" />
            <span>Nidra Sanctuary · Deep Sleep & Lunar Restoration Visualizer</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-light leading-tight">
            Surrender the Day. Rest in the Divine Stillpoint.
          </h1>

          <p className="text-sm text-[#8A9BA8] leading-relaxed">
            Sleep is the body’s most sacred Ayurvedic medicine. Transition peacefully from waking consciousness into deep delta repair through interactive anatomical posture guides, lunar Chandra breathing, and guided Yoga Nidra body scans.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={toggleNidra}
              className="px-6 py-3 rounded-full bg-[#1B2228] border border-[#354350] hover:bg-[#252F38] text-xs font-medium tracking-wide text-[#F9F6F0] flex items-center gap-2.5 transition-all cursor-pointer shadow-sm"
            >
              <Volume2 className="w-4 h-4 text-[#E0AFA0]" />
              <span>{isPlayingNidra ? 'Pause Tanpura Soundscape' : 'Begin 20m Sleep Soundscape'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Visual Sleep Guide Studio (Bedtime Postures, Lunar Breath Pacer, 61-Point Body Scan) */}
      <div className="space-y-4">
        <div className="space-y-1">
          <span className="text-xs text-[#7A7268] uppercase tracking-wider font-semibold">
            Interactive Somatic Visualizer
          </span>
          <h2 className="font-serif text-2xl text-[#26221E] font-medium">
            Visual Guide to Restorative Sleep & Nervous System Reset
          </h2>
          <p className="text-xs text-[#5E5852]">
            Select among Bedtime Postures with prop alignment, Lunar Breath (Chandra Bhedana), or Yoga Nidra Consciousness Rotation:
          </p>
        </div>

        {/* Embedded SleepVisualizer */}
        <SleepVisualizer onOpenTab={onOpenTab} />
      </div>

      {/* Ayurvedic Circadian Science & Golden Moon Milk Ritual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Visual Bedtime Ayurvedic Routine (Dinacharya / Ratricharya) */}
        <div className="p-7 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-5 shadow-xs">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9E6E38]">
              Ayurvedic Ratricharya (Nighttime Code)
            </span>
            <h3 className="font-serif text-xl text-[#26221E] font-medium">
              4 Somatic Triggers for Unbroken Delta Sleep
            </h3>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#F9F6F0] border border-[#EFE8DC] flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-[#EDE4D5] text-[#9E6E38] shrink-0 mt-0.5">
                <Moon className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-[#26221E]">
                  1. Left-Side Reclining (Vam-Kukshi)
                </h4>
                <p className="text-[11px] text-[#5E5852] leading-relaxed">
                  Lying on your left side prevents stomach acid reflux, opens the solar Ida Nadi, and encourages spleen-mediated lymphatic drainage.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F9F6F0] border border-[#EFE8DC] flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-[#EDE4D5] text-[#9E6E38] shrink-0 mt-0.5">
                <Droplets className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-[#26221E]">
                  2. Padabhyanga (Foot Sole Anointing)
                </h4>
                <p className="text-[11px] text-[#5E5852] leading-relaxed">
                  Massaging warm sesame or ghee into Kshipra Marma (webbing between big toe) grounds upward surging Vata thoughts down into the earth.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F9F6F0] border border-[#EFE8DC] flex items-start gap-3.5">
              <div className="p-2 rounded-xl bg-[#EDE4D5] text-[#9E6E38] shrink-0 mt-0.5">
                <Eye className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-[#26221E]">
                  3. Amber Darkness & Screen Curfew
                </h4>
                <p className="text-[11px] text-[#5E5852] leading-relaxed">
                  Melatonin synthesis starts 2 hours before habitual bedtime. Shift room lighting to amber candle tone 45 minutes prior to rest.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ayurvedic Golden Moon Milk Visual Recipe */}
        <div className="p-7 rounded-3xl bg-[#F4EFE6] border border-[#E8E1D5] space-y-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9E6E38]">
                Nourishing Sleep Elixir
              </span>
              <h3 className="font-serif text-xl text-[#26221E] font-medium">
                Dr. Syed Karishma’s Golden Moon Milk
              </h3>
              <p className="text-xs text-[#5E5852] leading-relaxed">
                Warm medicinal elixir for racing thoughts, nocturnal awakenings, and nervous system depletion:
              </p>
            </div>

            {/* Visual Ingredient Badges */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#9E6E38] block">Base Liquid</span>
                <span className="text-xs font-medium text-[#26221E] block">1 Cup Warm Milk</span>
                <span className="text-[10px] text-[#7A7268]">Organic whole or almond milk</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#9E6E38] block">Anti-Inflammatory</span>
                <span className="text-xs font-medium text-[#26221E] block">1/4 tsp Turmeric + Pepper</span>
                <span className="text-[10px] text-[#7A7268]">Black pepper activates curcumin 2000%</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#9E6E38] block">Natural Sedative</span>
                <span className="text-xs font-medium text-[#26221E] block">1/8 tsp Fresh Nutmeg</span>
                <span className="text-[10px] text-[#7A7268]">Ayurvedic myristicin deep sleep inducer</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#9E6E38] block">Nerve Lipid Carrier</span>
                <span className="text-xs font-medium text-[#26221E] block">1/2 tsp Grass-Fed Ghee</span>
                <span className="text-[10px] text-[#7A7268]">Lubricates myelin and coats nerve sheath</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#EBE4D6] text-xs text-[#73532C] space-y-1">
            <span className="font-semibold block">Preparation & Timing:</span>
            <p className="leading-relaxed text-[11px]">
              Simmer on low heat for 3 minutes without boiling over. Sip slowly in dim warm light 45 minutes prior to sleep. Avoid phones after your last sip.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
