/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  Activity,
  Compass,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Share2,
  ExternalLink,
  ArrowLeft,
  X,
  Zap,
  Repeat,
  Info
} from 'lucide-react';
import { ThreeYogaHuman } from './ThreeYogaHuman.tsx';
import { soundSanctuary } from '../utils/soundSanctuary.ts';
import { streakSystem } from '../utils/streakSystem.ts';
import { ShareProgressModal } from './ShareProgressModal.tsx';

export interface PoseDetailData {
  id: string;
  name: string;
  sanskritName: string;
  category?: string;
  theme?: string;
  durationSeconds?: number;
  clinicalCue?: string;
  commonMistake?: string;
  breathRhythm?: { inhale: number; retain: number; exhale: number; settle: number };
  replicationSteps?: Array<{ step: number; phase: string; instruction: string }>;
  alignmentPoints?: Array<{ name: string; location: string; clinicalTip: string }>;
}

interface PoseDetailViewProps {
  poseData: PoseDetailData;
  onClose?: () => void;
  onOpenShareModal?: () => void;
}

export const PoseDetailView: React.FC<PoseDetailViewProps> = ({
  poseData,
  onClose,
  onOpenShareModal
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(poseData.durationSeconds || 180);
  const [totalSeconds] = useState<number>(poseData.durationSeconds || 180);
  const [soundChime, setSoundChime] = useState<boolean>(true);
  const [breathPace, setBreathPace] = useState<'gentle' | 'normal' | 'deep'>('normal');
  const [animTime, setAnimTime] = useState<number>(0);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  // Default replication steps if not provided
  const replicationSteps = poseData.replicationSteps || [
    { step: 1, phase: 'Ground & Align', instruction: 'Set up foundation on mat. Ground sit bones or feet evenly into the earth.' },
    { step: 2, phase: 'Lengthen Spine', instruction: 'Inhale to draw crown upward; relax shoulders down and broaden collarbones.' },
    { step: 3, phase: 'Enter Posture', instruction: 'Follow breath into the posture smoothly. Do not force joint angles past comfort.' },
    { step: 4, phase: 'Deepen & Surrender', instruction: 'Hold with steady breath awareness. Allow nervous system to feel safe and calm.' }
  ];

  // Breath rhythm calculations
  const rhythm = poseData.breathRhythm || { inhale: 4, retain: 2, exhale: 4, settle: 2 };
  const paceMult = breathPace === 'gentle' ? 0.8 : breathPace === 'deep' ? 1.3 : 1.0;
  const cycleDur = (rhythm.inhale + rhythm.retain + rhythm.exhale + rhythm.settle) * paceMult;

  // Frame loop for breath animation
  useEffect(() => {
    if (!isPlaying) return;
    let animId: number;
    let lastTime = performance.now();
    const loop = (timestamp: number) => {
      const dt = (timestamp - lastTime) / 1000;
      lastTime = timestamp;
      setAnimTime((t) => (t + dt) % cycleDur);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, cycleDur]);

  // Current breath phase
  const inhDur = rhythm.inhale * paceMult;
  const retDur = rhythm.retain * paceMult;
  const exhDur = rhythm.exhale * paceMult;

  const currentPhase: 'inhale' | 'retain' | 'exhale' | 'settle' = (() => {
    if (animTime < inhDur) return 'inhale';
    if (animTime < inhDur + retDur) return 'retain';
    if (animTime < inhDur + retDur + exhDur) return 'exhale';
    return 'settle';
  })();

  const phaseProgress: number = (() => {
    if (currentPhase === 'inhale') return animTime / inhDur;
    if (currentPhase === 'retain') return 1;
    if (currentPhase === 'exhale') return 1 - (animTime - (inhDur + retDur)) / exhDur;
    return 0;
  })();

  // Countdown Practice Timer
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setSecondsRemaining((sec) => {
        if (sec > 1) {
          if (sec === Math.floor(totalSeconds / 2)) {
            soundSanctuary.playZenTingsha();
          }
          return sec - 1;
        }
        soundSanctuary.playMeditationBell(432);
        setTimerRunning(false);
        handleLogPractice();
        return 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning, totalSeconds]);

  const handleLogPractice = () => {
    streakSystem.recordPractice(
      'yoga',
      poseData.name,
      Math.max(1, Math.round(totalSeconds / 60))
    );
    setIsLogged(true);
    soundSanctuary.playSingingBowl(324);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleOpenStandalone = () => {
    const url = `${window.location.origin}${window.location.pathname}?tab=pose&id=${encodeURIComponent(poseData.id)}&standalone=true`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fadeIn select-none">
      {/* Top Breadcrumb & Action Strip */}
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
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9E6E38]">
                Isolated Asana Tab
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#F4EFE6] text-[#73532C] font-mono border border-[#E2D8C7]">
                {poseData.category || 'Mindful Posture'}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#26221E] font-medium leading-tight">
              {poseData.name}
            </h1>
            <p className="font-serif text-sm text-[#7A7268] italic">
              {poseData.sanskritName} {poseData.theme ? `· ${poseData.theme}` : ''}
            </p>
          </div>
        </div>

        {/* Tab Header Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsShareOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F0EBE1] border border-[#D5C9B6] text-xs font-medium text-[#26221E] flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Share this pose with friends"
          >
            <Share2 className="w-3.5 h-3.5 text-[#B88554]" />
            <span className="hidden sm:inline">Share Pose</span>
          </button>

          <button
            onClick={handleOpenStandalone}
            className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F0EBE1] border border-[#D5C9B6] text-xs font-medium text-[#26221E] flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Open in a dedicated new browser tab"
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

      {/* Main 3D Studio Mannequin Section with 360 Rotation */}
      <div className="bg-[#12161A] rounded-3xl overflow-hidden border border-[#2D3944] shadow-xl p-2 sm:p-4 space-y-3">
        <div className="flex items-center justify-between px-3 pt-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E0AFA0] animate-ping" />
            <span className="font-semibold text-[#FFFFFF] uppercase tracking-wider text-[11px]">
              3D Interactive Human Anatomy Studio
            </span>
          </div>
          <span className="text-[#A8B2BD] text-[11px] hidden sm:inline">
            360° Turntable · Multi-Angle Inspection · Breath-Synced Kinematics
          </span>
        </div>

        {/* The 3D Three.js Human Model */}
        <ThreeYogaHuman
          poseType={poseData.id || poseData.sanskritName || poseData.name}
          expansion={phaseProgress}
          time={animTime}
          title={poseData.name}
          className="w-full h-[420px] rounded-2xl"
          showChakras={true}
        />

        {/* Breath Phase Indicator Strip */}
        <div className="bg-[#18222A] p-3 rounded-2xl border border-[#2B3844] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentPhase === 'inhale'
                  ? 'bg-[#CCD5AE] scale-125'
                  : currentPhase === 'retain'
                  ? 'bg-[#D4A373] scale-110'
                  : currentPhase === 'exhale'
                  ? 'bg-[#E0AFA0] scale-90'
                  : 'bg-[#7A8A96] scale-75'
              }`}
            />
            <span className="font-medium text-[#F9F6F0] capitalize">
              Breath Phase: {currentPhase} ({(phaseProgress * 100).toFixed(0)}%)
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-[#8C9AA8]">Pace:</span>
            {(['gentle', 'normal', 'deep'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setBreathPace(p)}
                className={`px-2 py-0.5 rounded capitalize cursor-pointer ${
                  breathPace === p ? 'bg-[#31414F] text-white font-semibold' : 'text-[#8C9AA8] hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dedicated Practice Timer & Sadhana Streak Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-[#FFFFFF] p-6 rounded-3xl border border-[#E8E1D5] shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9E6E38] block">
              Dedicated Pose Timer
            </span>
            <p className="text-xs text-[#7A7268]">
              Hold with mindful breath. Chimes gently sound halfway and at completion.
            </p>
          </div>

          <div className="text-center py-4">
            <div className="font-serif text-5xl font-light text-[#26221E] tracking-tight tabular-nums">
              {formatTimer(secondsRemaining)}
            </div>
            <span className="text-xs text-[#7A7268] mt-1 block">
              {timerRunning ? 'Deeply Breathing in Pose' : 'Timer Ready'}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setTimerRunning(!timerRunning);
                  soundSanctuary.playZenTingsha();
                }}
                className={`flex-1 py-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  timerRunning
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-[#12161A] hover:bg-[#252C33] text-white shadow-xs'
                }`}
              >
                {timerRunning ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause Timer</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start Practice ({Math.round(totalSeconds / 60)} min)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setTimerRunning(false);
                  setSecondsRemaining(totalSeconds);
                  soundSanctuary.playZenTingsha();
                }}
                className="p-3 rounded-xl border border-[#D5C9B6] text-[#7A7268] hover:bg-[#F9F6F0] transition-colors cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleLogPractice}
              className={`w-full py-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                isLogged
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#F4EFE6] hover:bg-[#EAE2D5] text-[#26221E]'
              }`}
            >
              {isLogged ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sadhana Logged to Streak!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#B88554]" />
                  <span>Mark Complete & Log Streak</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Doctor's Key Clinical Cue & Mistakes to Avoid */}
        <div className="md:col-span-2 bg-[#FFFFFF] p-6 rounded-3xl border border-[#E8E1D5] shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B88554]">
              <Heart className="w-3.5 h-3.5" />
              <span>Dr. Syed Karishma’s Clinical Posture Prescriptions</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5] space-y-1">
              <span className="text-xs font-semibold text-[#26221E] block">
                Primary Alignment Cue:
              </span>
              <p className="text-xs text-[#5E5852] leading-relaxed italic">
                “{poseData.clinicalCue || 'Allow the pelvic basin to drop like heavy stone while the occipital skull floats effortlessly upward. Do not force thoracic extension.'}”
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FDF2F0] border border-[#F5D5CE] space-y-1">
              <span className="text-xs font-semibold text-[#8C3A27] block">
                Common Mistake to Avoid:
              </span>
              <p className="text-xs text-[#7A3626] leading-relaxed">
                {poseData.commonMistake || 'Collapsing the lumbar spine, thrusting front ribs forward, or holding tension in the jaw and suboccipital neck muscles.'}
              </p>
            </div>
          </div>

          <div className="text-xs text-[#7A7268] flex items-center justify-between border-t border-[#EFE8DC] pt-3">
            <span>Holistic Alignment & Biomechanics</span>
            <span>Personalized Care &middot; Dr. Karishma Clinic</span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Human Replication Mirroring Cards (So everyone can replicate by seeing!) */}
      <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#E8E1D5] shadow-xs space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9E6E38]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#B88554]" />
            <span>How to Replicate This Pose (Step-by-Step Mirroring)</span>
          </div>
          <p className="text-xs text-[#7A7268]">
            Follow this 4-step sequence to mirror Dr. Syed Karishma’s posture and breath with absolute clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {replicationSteps.map((step) => (
            <div
              key={step.step}
              className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5] space-y-2 flex flex-col justify-between hover:border-[#B88554] transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#B88554]">
                  <span>STEP 0{step.step}</span>
                  <span className="text-[10px] uppercase text-[#7A7268]">{step.phase}</span>
                </div>
                <p className="text-xs text-[#26221E] leading-relaxed mt-2">
                  {step.instruction}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Share Progress Modal */}
      {isShareOpen && (
        <ShareProgressModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          streakState={streakSystem.getState()}
          userName="Practitioner"
          dailyIntention={`Sadhana: ${poseData.name} (${poseData.sanskritName})`}
        />
      )}
    </div>
  );
};
