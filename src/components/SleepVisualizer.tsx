/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Moon,
  Sparkles,
  Volume2,
  Clock,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  Box,
  Compass,
  ArrowRight,
  Shield,
  Activity,
  Heart
} from 'lucide-react';
import { soundSanctuary } from '../utils/soundSanctuary.ts';
import { ThreeYogaHuman } from './ThreeYogaHuman.tsx';
import { WorkspaceTab } from '../types/workspaceTabs.ts';

export interface SleepPostureVisual {
  id: string;
  name: string;
  sanskrit: string;
  durationMinutes: number;
  threePoseKey: string;
  propsUsed: string[];
  physiologicalEffect: string;
  doctorCue: string;
  anatomicalFocus: string;
}

export const SLEEP_POSTURES: SleepPostureVisual[] = [
  {
    id: 'viparita-karani',
    name: 'Legs-Up-The-Wall',
    sanskrit: 'विपरीत करणी',
    durationMinutes: 7,
    threePoseKey: 'legs-up-wall',
    propsUsed: ['Firm wall surface', 'Folded linen blanket or bolster under sacrum', 'Eye pillow'],
    physiologicalEffect:
      'Inverts hydrostatic venous pressure, accelerates lymph drainage from tired ankles, and activates carotid baroreceptors to lower resting heart rate.',
    doctorCue:
      'Wiggle your sitting bones right up against baseboard. Allow thighs to soften into hip sockets. Let your abdomen drop back toward the spine like a soft bowl.',
    anatomicalFocus: 'Venous return, baroreceptors, thoracic diaphragm'
  },
  {
    id: 'supta-baddha',
    name: 'Supported Reclined Butterfly',
    sanskrit: 'सुप्त बद्ध कोणासन',
    durationMinutes: 6,
    threePoseKey: 'stillness',
    propsUsed: ['Long bolster lengthwise under spine', 'Yoga blocks or pillows under outer knees', 'Warm blanket over chest'],
    physiologicalEffect:
      'Opens the anterior intercostal muscles to deepen diaphragmatic excursion; releases iliopsoas tightness that keeps the nervous system in fight-or-flight.',
    doctorCue:
      'Place soles of feet together with knees resting securely on blocks. Rest left hand on heart and right hand on low belly. Do not force knees downward.',
    anatomicalFocus: 'Iliopsoas, pelvic diaphragm, Anahata heart center'
  },
  {
    id: 'supported-balasana',
    name: 'Supported Child’s Pose',
    sanskrit: 'उत्थित बालासन',
    durationMinutes: 5,
    threePoseKey: 'balasana',
    propsUsed: ['Large bolster pulled between wide knees', 'Head turned softly to one side', 'Linen blanket over back'],
    physiologicalEffect:
      'Downregulates dorsal vagal strain, decompresses the lumbar vertebrae, and creates sensory containment that makes the nervous system feel held and safe.',
    doctorCue:
      'Hips sink back toward heels. Hug the bolster with both arms. Breathe directly into the rear ribs and kidneys, feeling your back body expand with each inhale.',
    anatomicalFocus: 'Adrenal glands, lumbar spine, posterior lung lobes'
  }
];

// 12 key Somatic Points in 61-point Yoga Nidra Body Scan
const NIDRA_BODY_POINTS = [
  { name: 'Third Eye Center (Bhrumadhya)', x: 50, y: 15, cue: 'Center of forehead bathed in indigo light' },
  { name: 'Throat Center (Vishuddha)', x: 50, y: 24, cue: 'Throat pit softened, swallowing all words' },
  { name: 'Right Shoulder & Hand', x: 28, y: 35, cue: 'Right arm and fingertips dissolved of weight' },
  { name: 'Left Shoulder & Hand', x: 72, y: 35, cue: 'Left arm and fingertips resting like water' },
  { name: 'Heart Space (Anahata)', x: 50, y: 38, cue: 'Golden warmth radiating from heart cave' },
  { name: 'Solar Plexus (Manipura)', x: 50, y: 48, cue: 'Digestive fire cooling to warm embers' },
  { name: 'Sacral Basin (Svadhisthana)', x: 50, y: 56, cue: 'Pelvis unclenching into gravity' },
  { name: 'Right Knee & Foot', x: 38, y: 82, cue: 'Right leg resting heavy and still' },
  { name: 'Left Knee & Foot', x: 62, y: 82, cue: 'Left leg resting heavy and still' },
  { name: 'Entire Physical Body', x: 50, y: 50, cue: 'Whole body bathed in deep delta stillness' }
];

interface SleepVisualizerProps {
  onOpenTab?: (tab: WorkspaceTab) => void;
}

export const SleepVisualizer: React.FC<SleepVisualizerProps> = ({ onOpenTab }) => {
  const [selectedPostureIdx, setSelectedPostureIdx] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'visual' | '3d'>('visual');
  const [activeModule, setActiveModule] = useState<'postures' | 'pranayama' | 'nidra'>('postures');

  // Chandra Bhedana Lunar Breath Pacer State
  const [isBreathPacing, setIsBreathPacing] = useState<boolean>(true);
  const [breathPhaseTime, setBreathPhaseTime] = useState<number>(0);

  // Yoga Nidra Body Scan State
  const [isPlayingNidra, setIsPlayingNidra] = useState<boolean>(false);
  const [activeNidraPointIdx, setActiveNidraPointIdx] = useState<number>(0);

  const currentPosture = SLEEP_POSTURES[selectedPostureIdx];

  // Chandra Bhedana Cycle: 4s Inhale Left -> 2s Retain -> 6s Exhale Right -> 2s Settle = 14s cycle
  useEffect(() => {
    if (!isBreathPacing) return;
    let animId: number;
    let lastTime = performance.now();
    const cycleDuration = 14000; // 14 seconds

    const loop = (timestamp: number) => {
      const dt = timestamp - lastTime;
      lastTime = timestamp;
      setBreathPhaseTime((t) => (t + dt) % cycleDuration);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isBreathPacing]);

  // Derived breath phase
  const cycleSeconds = breathPhaseTime / 1000;
  const breathPhase: 'inhale-left' | 'retain' | 'exhale-right' | 'settle' = (() => {
    if (cycleSeconds < 4) return 'inhale-left';
    if (cycleSeconds < 6) return 'retain';
    if (cycleSeconds < 12) return 'exhale-right';
    return 'settle';
  })();

  const breathProgress: number = (() => {
    if (breathPhase === 'inhale-left') return cycleSeconds / 4;
    if (breathPhase === 'retain') return 1;
    if (breathPhase === 'exhale-right') return 1 - (cycleSeconds - 6) / 6;
    return 0;
  })();

  // Yoga Nidra Body Scan sequencer (advances every 4 seconds)
  useEffect(() => {
    if (!isPlayingNidra) return;
    const interval = setInterval(() => {
      setActiveNidraPointIdx((prev) => (prev + 1) % NIDRA_BODY_POINTS.length);
      soundSanctuary.playSingingBowl(216);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlayingNidra]);

  const handleToggleNidraSound = () => {
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
    <div className="space-y-6">
      {/* Visual Navigation Pill Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFFFFF] p-2.5 rounded-2xl border border-[#E8E1D5] shadow-xs">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveModule('postures')}
            className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
              activeModule === 'postures'
                ? 'bg-[#12161A] text-[#F9F6F0] shadow-sm'
                : 'text-[#5E5852] hover:text-[#26221E] hover:bg-[#F9F6F0]'
            }`}
          >
            <BedIcon className="w-3.5 h-3.5 text-[#E0AFA0]" />
            <span>3 Bedtime Restoratives</span>
          </button>

          <button
            onClick={() => setActiveModule('pranayama')}
            className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
              activeModule === 'pranayama'
                ? 'bg-[#12161A] text-[#F9F6F0] shadow-sm'
                : 'text-[#5E5852] hover:text-[#26221E] hover:bg-[#F9F6F0]'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-[#B88554]" />
            <span>Lunar Breath Pacer (Ida Nadi)</span>
          </button>

          <button
            onClick={() => setActiveModule('nidra')}
            className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
              activeModule === 'nidra'
                ? 'bg-[#12161A] text-[#F9F6F0] shadow-sm'
                : 'text-[#5E5852] hover:text-[#26221E] hover:bg-[#F9F6F0]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#9E6E38]" />
            <span>Yoga Nidra Body Scan</span>
          </button>
        </div>

        <span className="text-xs text-[#7A7268] hidden md:inline px-3">
          Curated by Dr. Syed Karishma
        </span>
      </div>

      {/* MODULE 1: 3 BEDTIME RESTORATIVE POSTURES WITH ANATOMICAL VISUAL DIAGRAMS */}
      {activeModule === 'postures' && (
        <div className="space-y-6">
          {/* Posture Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SLEEP_POSTURES.map((p, idx) => {
              const isSelected = selectedPostureIdx === idx;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPostureIdx(idx);
                    soundSanctuary.playZenTingsha();
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-1 ${
                    isSelected
                      ? 'bg-[#FFFFFF] border-[#B88554] shadow-md ring-1 ring-[#B88554]/25'
                      : 'bg-[#F9F6F0] border-[#E8E1D5] hover:border-[#D0C2B0]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-[#9E6E38] font-mono">
                    <span>0{idx + 1}. {p.durationMinutes} MINS</span>
                    <span className="font-serif italic">{p.sanskrit}</span>
                  </div>
                  <h4 className="font-serif text-base text-[#26221E] font-medium leading-snug">
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-[#7A7268] line-clamp-1">
                    {p.anatomicalFocus}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Visual Stage Container */}
          <div className="bg-[#12161A] text-white rounded-3xl overflow-hidden border border-[#2D3944] shadow-xl">
            {/* Stage Header */}
            <div className="p-4 sm:p-5 border-b border-[#232C35] flex flex-wrap items-center justify-between gap-3 bg-[#161C22]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E0AFA0] animate-ping" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#E0AFA0]">
                    {currentPosture.name} · {currentPosture.sanskrit}
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl text-white font-medium mt-0.5">
                  Anatomical Sleep Alignment Guide
                </h3>
              </div>

              {/* 2D Vector Visual vs 3D Interactive Mannequin Switcher */}
              <div className="flex items-center gap-1.5 bg-[#1F2730] p-1 rounded-xl border border-[#313E4B] text-xs">
                <button
                  onClick={() => setViewMode('visual')}
                  className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    viewMode === 'visual'
                      ? 'bg-[#E0AFA0] text-[#12161A] font-semibold'
                      : 'text-[#A0ACB8] hover:text-white'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Props & Anatomy</span>
                </button>
                <button
                  onClick={() => setViewMode('3d')}
                  className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    viewMode === '3d'
                      ? 'bg-[#E0AFA0] text-[#12161A] font-semibold'
                      : 'text-[#A0ACB8] hover:text-white'
                  }`}
                >
                  <Box className="w-3.5 h-3.5 text-[#B88554]" />
                  <span>3D Mannequin Studio</span>
                </button>
              </div>
            </div>

            {/* Stage Body */}
            <div className="relative w-full h-[380px] sm:h-[440px] bg-gradient-to-b from-[#13191F] to-[#0D1115] flex items-center justify-center overflow-hidden">
              {viewMode === '3d' ? (
                /* 3D Three.js Studio Mannequin for this sleep posture */
                <ThreeYogaHuman
                  poseType={currentPosture.threePoseKey}
                  expansion={breathProgress}
                  time={breathPhaseTime / 1000}
                  title={currentPosture.name}
                  className="w-full h-full"
                  showChakras={true}
                />
              ) : (
                /* High-Fidelity Vector Anatomical Alignment Visual */
                <div className="relative w-full h-full flex items-center justify-center p-6">
                  {/* Subtle Moonlight Background Halo */}
                  <div className="absolute w-80 h-80 rounded-full bg-[#E0AFA0]/10 blur-3xl pointer-events-none" />

                  {/* 1. VIPARITA KARANI (Legs Up Wall) */}
                  {currentPosture.id === 'viparita-karani' && (
                    <svg viewBox="0 0 100 100" className="w-full h-full max-h-[360px] max-w-[480px]">
                      {/* Floor & Wall Outline */}
                      <line x1="10" y1="80" x2="90" y2="80" stroke="#374553" strokeWidth="1.5" />
                      <line x1="75" y1="15" x2="75" y2="80" stroke="#4A5C6F" strokeWidth="2.5" />
                      <text x="77" y="24" fill="#8C9CA8" fontSize="3" fontStyle="italic">Firm Wall Support</text>

                      {/* Bolster / Folded Blanket Under Pelvis */}
                      <rect x="52" y="74" width="18" height="6" rx="2" fill="#B88554" opacity="0.8" />
                      <text x="61" y="78" textAnchor="middle" fill="#FFFFFF" fontSize="2.4" fontWeight="600">Pelvic Bolster</text>

                      {/* Head Pillow */}
                      <rect x="18" y="75" width="12" height="5" rx="1.5" fill="#3D4B59" />

                      {/* Reclined Human Body Silhouette */}
                      {/* Head on pillow */}
                      <circle cx="24" cy="74" r="4" fill="#E0AFA0" />
                      {/* Torso horizontal */}
                      <line x1="28" y1="75" x2="62" y2="76" stroke="#E0AFA0" strokeWidth="5" strokeLinecap="round" />
                      {/* Arms open in soft cactus / resting with palms up */}
                      <path d="M 36 75 L 36 68 L 28 68" stroke="#E0AFA0" strokeWidth="2" strokeLinecap="round" fill="none" />
                      {/* Legs vertical against wall */}
                      <line x1="66" y1="75" x2="73" y2="28" stroke="#E0AFA0" strokeWidth="4.5" strokeLinecap="round" />
                      {/* Feet soft */}
                      <line x1="73" y1="28" x2="78" y2="28" stroke="#E0AFA0" strokeWidth="3" strokeLinecap="round" />

                      {/* Animated Lymphatic Drainage Flow Arrows (Moving Downward Toward Heart) */}
                      <g className="lymph-arrows" opacity="0.85">
                        <line x1="68" y1="36" x2="68" y2="60" stroke="#90CAF9" strokeWidth="1.2" strokeDasharray="3,3" />
                        <polygon points="68,64 66,59 70,59" fill="#90CAF9" />
                        <text x="63" y="48" textAnchor="end" fill="#90CAF9" fontSize="2.8" fontStyle="italic">
                          Lymphatic drainage flow ↓
                        </text>
                      </g>

                      {/* 90-Degree Angle Callout */}
                      <path d="M 62 70 L 66 70 L 66 74" fill="none" stroke="#D4A373" strokeWidth="0.8" />
                      <text x="68" y="68" fill="#D4A373" fontSize="2.8" fontWeight="bold">90°</text>

                      {/* Physiological Baroreceptors Neck Callout */}
                      <circle cx="30" cy="74" r="3" fill="none" stroke="#E0AFA0" strokeWidth="0.8" className="animate-ping" />
                      <line x1="30" y1="71" x2="30" y2="52" stroke="#E0AFA0" strokeWidth="0.8" strokeDasharray="2,2" />
                      <text x="30" y="48" textAnchor="middle" fill="#E0AFA0" fontSize="2.8">
                        Carotid Baroreceptors: Calms Heart Rate
                      </text>
                    </svg>
                  )}

                  {/* 2. SUPTA BADDHA KONASANA (Supported Butterfly) */}
                  {currentPosture.id === 'supta-baddha' && (
                    <svg viewBox="0 0 100 100" className="w-full h-full max-h-[360px] max-w-[480px]">
                      {/* Floor line */}
                      <line x1="10" y1="78" x2="90" y2="78" stroke="#374553" strokeWidth="1.5" />

                      {/* Slanted Thoracic Bolster */}
                      <polygon points="26,72 65,77 65,78 26,78" fill="#B88554" opacity="0.85" />
                      <text x="45" y="75" fill="#FFFFFF" fontSize="2.4" fontWeight="600">Spine Bolster</text>

                      {/* Knee Support Blocks on both sides */}
                      <rect x="58" y="70" width="8" height="6" rx="1.5" fill="#475869" />
                      <rect x="74" y="70" width="8" height="6" rx="1.5" fill="#475869" />
                      <text x="70" y="67" textAnchor="middle" fill="#8C9CA8" fontSize="2.4">Knee Blocks</text>

                      {/* Human Body Reclined with Soles Together */}
                      <circle cx="22" cy="68" r="4" fill="#E0AFA0" />
                      {/* Torso resting back on bolster */}
                      <line x1="26" y1="70" x2="58" y2="76" stroke="#E0AFA0" strokeWidth="5" strokeLinecap="round" />
                      {/* Hand resting on heart, other on belly */}
                      <path d="M 38 72 Q 40 66 42 70" stroke="#E0AFA0" strokeWidth="1.8" fill="none" />
                      {/* Butterfly Legs open */}
                      <path d="M 58 76 Q 66 69 72 76" stroke="#E0AFA0" strokeWidth="4" strokeLinecap="round" fill="none" />
                      <path d="M 58 76 Q 66 73 72 76" stroke="#E0AFA0" strokeWidth="3" strokeLinecap="round" fill="none" />

                      {/* Expanding Heart and Pelvic Aura Rings */}
                      <circle cx="42" cy="70" r="6" fill="none" stroke="#E0AFA0" strokeWidth="0.8" opacity="0.6" />
                      <circle cx="58" cy="76" r="8" fill="none" stroke="#D4A373" strokeWidth="0.8" opacity="0.6" />

                      <text x="42" y="58" textAnchor="middle" fill="#E0AFA0" fontSize="2.8">
                        Intercostal Expansion · Diaphragm Deepening
                      </text>
                      <text x="68" y="85" textAnchor="middle" fill="#D4A373" fontSize="2.8">
                        Psoas Surrender · Zero Groin Strain
                      </text>
                    </svg>
                  )}

                  {/* 3. SUPPORTED BALASANA (Child's Pose) */}
                  {currentPosture.id === 'supported-balasana' && (
                    <svg viewBox="0 0 100 100" className="w-full h-full max-h-[360px] max-w-[480px]">
                      {/* Floor line */}
                      <line x1="10" y1="78" x2="90" y2="78" stroke="#374553" strokeWidth="1.5" />

                      {/* Large Hugged Bolster */}
                      <ellipse cx="50" cy="71" rx="22" ry="7" fill="#B88554" opacity="0.85" />
                      <text x="50" y="72" textAnchor="middle" fill="#FFFFFF" fontSize="2.4" fontWeight="600">Soft Chest Bolster</text>

                      {/* Folded Knees and Hips */}
                      {/* Feet and Hips on heels */}
                      <circle cx="24" cy="74" r="5" fill="#3D4B59" />
                      <text x="24" y="84" textAnchor="middle" fill="#8C9CA8" fontSize="2.4">Hips to Heels</text>

                      {/* Spine curving smoothly forward over bolster */}
                      <path d="M 24 73 Q 40 61 68 67" stroke="#E0AFA0" strokeWidth="5" strokeLinecap="round" fill="none" />
                      {/* Head turned sideways resting on bolster */}
                      <circle cx="71" cy="67" r="4" fill="#E0AFA0" />
                      {/* Arms hugging around bolster */}
                      <path d="M 52 68 Q 62 65 65 74" stroke="#E0AFA0" strokeWidth="2" strokeLinecap="round" fill="none" />

                      {/* Kidney and Adrenal Relaxation Aura */}
                      <ellipse cx="38" cy="64" rx="8" ry="4" fill="none" stroke="#90CAF9" strokeWidth="0.8" strokeDasharray="2,2" />
                      <text x="38" y="53" textAnchor="middle" fill="#90CAF9" fontSize="2.8">
                        Kidney & Adrenal Decompression Wave
                      </text>
                      <text x="72" y="58" textAnchor="middle" fill="#E0AFA0" fontSize="2.8">
                        Temple Turned Sideways
                      </text>
                    </svg>
                  )}
                </div>
              )}
            </div>

            {/* Posture Clinical Breakdown Strip */}
            <div className="p-6 bg-[#161C22] border-t border-[#232C35] grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#E0AFA0] flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#E0AFA0]" />
                  <span>Physiological Mechanism · Somatic Science</span>
                </span>
                <p className="text-xs text-[#CAD4DF] leading-relaxed">
                  {currentPosture.physiologicalEffect}
                </p>
                <div className="pt-2 text-[11px] text-[#8C9AA8]">
                  <strong>Props Recommended:</strong> {currentPosture.propsUsed.join(' · ')}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#1B232B] border border-[#2B3846] space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D4A373]">
                  Dr. Syed Karishma’s Bedside Cue
                </span>
                <p className="text-xs text-[#EAEFF5] leading-relaxed italic">
                  “{currentPosture.doctorCue}”
                </p>
                {onOpenTab && (
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        onOpenTab({
                          id: 'pose-' + currentPosture.id,
                          type: 'pose',
                          title: currentPosture.name,
                          subtitle: currentPosture.sanskrit,
                          data: {
                            id: currentPosture.id,
                            name: currentPosture.name,
                            sanskritName: currentPosture.sanskrit,
                            durationSeconds: currentPosture.durationMinutes * 60,
                            clinicalCue: currentPosture.doctorCue
                          },
                          canClose: true
                        });
                        soundSanctuary.playZenTingsha();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#E0AFA0] text-[#12161A] text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-[#D4A373] transition-colors"
                    >
                      <Box className="w-3.5 h-3.5" />
                      <span>Open in Dedicated 3D Pose Tab</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: CHANDRA BHEDANA (LUNAR BREATH PACER FOR PARASYMPATHETIC ACTIVATION) */}
      {activeModule === 'pranayama' && (
        <div className="bg-[#12161A] text-white rounded-3xl p-6 sm:p-10 border border-[#2D3944] shadow-xl space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#E0AFA0] font-semibold uppercase tracking-wider">
              <Moon className="w-3.5 h-3.5" />
              <span>Chandra Bhedana Pranayama (Ida Nadi Activation)</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white">
              Left-Nostril Lunar Current Breathing
            </h3>
            <p className="text-xs sm:text-sm text-[#A0ACB8] leading-relaxed">
              In Ayurvedic neuro-anatomy, the left nostril governs the cooling, restorative Ida Nadi connected to the right parasympathetic hemisphere. Inhaling through the left and exhaling through the right turns down bodily heat and switches on drowsiness.
            </p>
          </div>

          {/* Interactive Breathing Aura Visual Stage */}
          <div className="relative w-full h-[320px] rounded-2xl bg-gradient-to-b from-[#161D24] to-[#101418] border border-[#2B3744] flex flex-col items-center justify-center overflow-hidden p-6">
            {/* Visual Expanding Moon & Cooling Glow */}
            <div
              className="absolute rounded-full bg-gradient-to-tr from-[#90CAF9]/20 to-[#E0AFA0]/30 blur-2xl transition-all duration-700 pointer-events-none"
              style={{
                width: `${180 + breathProgress * 120}px`,
                height: `${180 + breathProgress * 120}px`
              }}
            />

            {/* Central Animated Breathing Mandala */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-3">
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* SVG Progress Ring */}
                <svg className="w-32 h-32 -rotate-90">
                  <circle cx="64" cy="64" r="54" stroke="#2D3B48" strokeWidth="4" fill="none" />
                  <circle
                    cx="64"
                    cy="64"
                    r="54"
                    stroke="#E0AFA0"
                    strokeWidth="5"
                    strokeDasharray={339.2}
                    strokeDashoffset={339.2 - 339.2 * breathProgress}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-200"
                  />
                </svg>

                {/* Center Phase Icon & Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <Moon className="w-6 h-6 text-[#E0AFA0] animate-pulse" />
                  <span className="font-serif text-lg font-light text-white mt-1">
                    {breathPhase === 'inhale-left' && 'Inhale Left'}
                    {breathPhase === 'retain' && 'Soft Hold'}
                    {breathPhase === 'exhale-right' && 'Exhale Right'}
                    {breathPhase === 'settle' && 'Stillness'}
                  </span>
                </div>
              </div>

              {/* Instructions Bar */}
              <div className="bg-[#1C252F] px-5 py-2.5 rounded-full border border-[#354555] text-xs font-mono text-[#D4A373]">
                {breathPhase === 'inhale-left' && 'Close Right Nostril with Thumb · Inhale 4 counts Left'}
                {breathPhase === 'retain' && 'Gently retain breath in throat pit (2s pause)'}
                {breathPhase === 'exhale-right' && 'Close Left with Ring Finger · Exhale 6 counts Right'}
                {breathPhase === 'settle' && 'Rest in quiet void before next lunar breath'}
              </div>
            </div>
          </div>

          {/* 3 Step Instruction Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#161D24] border border-[#26333F] space-y-1">
              <span className="font-mono text-[#E0AFA0] block">01. INHALE LEFT (4s)</span>
              <p className="text-[#A0ACB8] leading-relaxed">
                Draw cool lunar prana through left nostril. Feel the stream soothe the forehead and eye sockets.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#161D24] border border-[#26333F] space-y-1">
              <span className="font-mono text-[#D4A373] block">02. RETENTION (2s)</span>
              <p className="text-[#A0ACB8] leading-relaxed">
                Both nostrils lightly closed. Allow heart rate to slow into tranquil stillness.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#161D24] border border-[#26333F] space-y-1">
              <span className="font-mono text-[#90CAF9] block">03. EXHALE RIGHT (6s)</span>
              <p className="text-[#A0ACB8] leading-relaxed">
                Release warm metabolic solar fire through right nostril. Complete abdominal empty.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: YOGA NIDRA 61-POINT SOMATIC BODY SCAN */}
      {activeModule === 'nidra' && (
        <div className="bg-[#12161A] text-white rounded-3xl p-6 sm:p-10 border border-[#2D3944] shadow-xl space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-[#E0AFA0] font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Yoga Nidra 61-Point Somatic Body Scan</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white">
                Delta Repair: Guided Consciousness Rotation
              </h3>
              <p className="text-xs sm:text-sm text-[#A0ACB8] leading-relaxed max-w-xl">
                Yoga Nidra leads the brain waves from Beta (alert) down into Alpha, Theta, and restorative Delta (0.5–4 Hz) while maintaining quiet awareness without falling into unconsciousness.
              </p>
            </div>

            <button
              onClick={handleToggleNidraSound}
              className={`px-5 py-3 rounded-full text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
                isPlayingNidra
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-[#E0AFA0] text-[#12161A] hover:bg-[#D4A373]'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlayingNidra ? 'Pause Soundscape' : 'Start 20m Tanpura Journey'}</span>
            </button>
          </div>

          {/* Visual Body Scan Altar */}
          <div className="relative w-full h-[360px] rounded-2xl bg-gradient-to-b from-[#161D24] to-[#0E1216] border border-[#2A3744] flex items-center justify-center overflow-hidden p-4">
            {/* Ambient Background Silhouette SVG */}
            <svg viewBox="0 0 100 100" className="w-full h-full max-h-[320px] max-w-[340px]">
              {/* Meditative Reclining Figure */}
              <ellipse cx="50" cy="50" rx="30" ry="44" fill="#1C242C" opacity="0.4" />
              {/* Head */}
              <circle cx="50" cy="15" r="7" fill="#25303B" />
              {/* Torso */}
              <path d="M 40 22 C 36 34 36 50 42 62 L 58 62 C 64 50 64 34 60 22 Z" fill="#25303B" />
              {/* Arms */}
              <line x1="39" y1="24" x2="26" y2="44" stroke="#25303B" strokeWidth="4" strokeLinecap="round" />
              <line x1="61" y1="24" x2="74" y2="44" stroke="#25303B" strokeWidth="4" strokeLinecap="round" />
              {/* Legs */}
              <line x1="44" y1="62" x2="38" y2="90" stroke="#25303B" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="56" y1="62" x2="62" y2="90" stroke="#25303B" strokeWidth="4.5" strokeLinecap="round" />

              {/* Render 10 Representative Body Nodes */}
              {NIDRA_BODY_POINTS.map((pt, idx) => {
                const isActive = activeNidraPointIdx === idx;
                return (
                  <g key={idx} className="transition-all duration-500">
                    {isActive && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="8"
                        fill="none"
                        stroke="#E0AFA0"
                        strokeWidth="1"
                        className="animate-ping"
                      />
                    )}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isActive ? 4 : 2.5}
                      fill={isActive ? '#FCEADE' : '#73532C'}
                      stroke={isActive ? '#E0AFA0' : '#475666'}
                      strokeWidth={isActive ? 1.5 : 0.8}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Active Rotating Consciousness Chip at Bottom */}
            <div className="absolute bottom-4 left-4 right-4 bg-[#141A20]/90 backdrop-blur-md p-3.5 rounded-2xl border border-[#2F3E4D] flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#E0AFA0] uppercase font-semibold block">
                  Active Point {activeNidraPointIdx + 1} of {NIDRA_BODY_POINTS.length}
                </span>
                <h4 className="font-serif text-sm font-medium text-white">
                  {NIDRA_BODY_POINTS[activeNidraPointIdx].name}
                </h4>
                <p className="text-[11px] text-[#A0ACB8]">
                  {NIDRA_BODY_POINTS[activeNidraPointIdx].cue}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() =>
                    setActiveNidraPointIdx((p) => (p === 0 ? NIDRA_BODY_POINTS.length - 1 : p - 1))
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-[#202932] hover:bg-[#2C3844] text-[#E0AFA0] text-xs cursor-pointer"
                >
                  Prev
                </button>
                <button
                  onClick={() =>
                    setActiveNidraPointIdx((p) => (p + 1) % NIDRA_BODY_POINTS.length)
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-[#202932] hover:bg-[#2C3844] text-[#E0AFA0] text-xs cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function BedIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 4v16" />
      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
      <path d="M2 17h20" />
      <path d="M6 8v9" />
    </svg>
  );
}
