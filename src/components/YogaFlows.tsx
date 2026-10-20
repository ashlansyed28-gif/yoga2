/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Sparkles,
  Clock,
  CheckCircle2,
  Heart,
  ArrowLeft,
  RotateCcw,
  Plus,
  Eye,
  Film,
  Share2,
  Box,
  ExternalLink
} from 'lucide-react';
import { soundSanctuary } from '../utils/soundSanctuary.ts';
import { AsanaVisualAnimator } from './AsanaVisualAnimator.tsx';
import { streakSystem } from '../utils/streakSystem.ts';
import { ShareProgressModal } from './ShareProgressModal.tsx';
import { WorkspaceTab } from '../types/workspaceTabs.ts';
import { lookupPose } from '../utils/poseDictionary.ts';

interface YogaFlow {
  id: string;
  title: string;
  sanskrit: string;
  duration: string;
  level: string;
  intention: string;
  tone: string;
  asanas: Array<{
    name: string;
    sanskritName: string;
    seconds: number;
    breath: string;
    cue: string;
  }>;
}

const FLOWS: YogaFlow[] = [
  {
    id: 'dawn-prana',
    title: 'Dawn Prana Awakening',
    sanskrit: 'प्रातःकाल प्राण साधना',
    duration: '15 min',
    level: 'All Levels',
    intention: 'Gently awakes the subtle channels (nadis), clears morning stagnancy, and aligns breath with movement.',
    tone: 'Soft Sunrise Gold',
    asanas: [
      {
        name: 'Seated Easy Pose with Heart Centering',
        sanskritName: 'Sukhasana',
        seconds: 120,
        breath: 'Deep 4-4 diaphragmatic rhythm',
        cue: 'Root both sitting bones evenly. Roll shoulders up, back, and melt them down the spine.'
      },
      {
        name: 'Cat-Cow Spinal Wave with Prana Ripple',
        sanskritName: 'Marjaryasana-Bitilasana',
        seconds: 180,
        breath: 'Inhale arching from pelvis; exhale tucking tailbone',
        cue: 'Feel the spinal fluid undulating like gentle morning tide. Keep arms straight and palms wide.'
      },
      {
        name: 'Low Lunge Heart Awakening',
        sanskritName: 'Anjaneyasana',
        seconds: 150,
        breath: 'Expansive inhale into upper chest; soft sink on exhale',
        cue: 'Right knee above ankle. Lift ribcage off waist, softening the throat without collapsing back.'
      },
      {
        name: 'Gentle Downward Dog Ripple',
        sanskritName: 'Adho Mukha Svanasana',
        seconds: 180,
        breath: 'Calm rhythmic nasal breath',
        cue: 'Pedal the heels softly. Press index knuckle down. Allow head to hang completely unburdened.'
      },
      {
        name: 'Standing Mountain Center',
        sanskritName: 'Tadasana',
        seconds: 120,
        breath: 'Resting in natural stillness',
        cue: 'Lift toes, spread them wide, and place them softly. Feel the crown reaching toward the light.'
      }
    ]
  },
  {
    id: 'spine-unwind',
    title: 'Cervical Spine & Shoulder Decompression',
    sanskrit: 'कशेरुका विश्राम साधना',
    duration: '20 min',
    level: 'Therapeutic',
    intention: 'Dissolves screen fatigue, releases trapezius knotting, and relieves sacral pressure.',
    tone: 'Sage Healing Green',
    asanas: [
      {
        name: 'Supported Child’s Pose with Wide Knees',
        sanskritName: 'Utthita Balasana',
        seconds: 240,
        breath: 'Deep breath into rear ribs and kidneys',
        cue: 'Sink hips back toward heels. Rest forehead on the mat, surrendering all mental weight.'
      },
      {
        name: 'Thread-the-Needle Shoulder Release',
        sanskritName: 'Parsva Balasana',
        seconds: 200,
        breath: 'Exhale releasing outer shoulder into floor',
        cue: 'Slide right arm beneath left chest. Rest temple softly on floor; breathe behind shoulder blade.'
      },
      {
        name: 'Sphinx Pose Chest Extension',
        sanskritName: 'Salamba Bhujangasana',
        seconds: 180,
        breath: 'Inhale pulling chest gently forward through upper arms',
        cue: 'Elbows under shoulders. Soften glutes and lumbar curve; let the heart open forward.'
      },
      {
        name: 'Reclining Gentle Spinal Twist',
        sanskritName: 'Supta Matsyendrasana',
        seconds: 240,
        breath: 'Smooth exhale emptying abdomen',
        cue: 'Keep both shoulder blades flush against the earth. Soften eyes, jaw, and brow.'
      }
    ]
  },
  {
    id: 'yin-restorative',
    title: 'Deep Restorative Yin & Hip Surrender',
    sanskrit: 'गम्भीर विश्रान्ति योग',
    duration: '25 min',
    level: 'Gentle Restorative',
    intention: 'Long, supported passive holds that release deep fascia, calm the nervous system, and restore prana.',
    tone: 'Sacred Lotus Rose',
    asanas: [
      {
        name: 'Reclining Bound Angle with Heart Bolster',
        sanskritName: 'Supta Baddha Konasana',
        seconds: 300,
        breath: 'Effortless abdominal expansion',
        cue: 'Soles of feet together, knees falling wide over cushions. Zero muscular effort.'
      },
      {
        name: 'Supported Half Pigeon or Reclined Figure Four',
        sanskritName: 'Supta Kapotasana',
        seconds: 300,
        breath: 'Breathing directly into outer hip tissue',
        cue: 'No forcing. Let the weight of gravity do the unraveling over time.'
      },
      {
        name: 'Legs-Up-The-Wall Nectar Pose',
        sanskritName: 'Viparita Karani',
        seconds: 360,
        breath: 'Quiet stillness; observe pulse settling',
        cue: 'Elevate hips with a folded blanket. Let feet feel light and blood return smoothly toward heart.'
      },
      {
        name: 'Corpse Pose Sacred Stillness',
        sanskritName: 'Savasana',
        seconds: 300,
        breath: 'Pure effortless presence',
        cue: 'Dissolve all boundaries between your body and the floor. You are held.'
      }
    ]
  }
];

interface YogaFlowsProps {
  onBackToHome?: () => void;
  onOpenTab?: (tab: WorkspaceTab) => void;
  initialFlowId?: string;
}

export const YogaFlows: React.FC<YogaFlowsProps> = ({ onBackToHome, onOpenTab, initialFlowId }) => {
  const [selectedFlow, setSelectedFlow] = useState<YogaFlow>(() => {
    if (initialFlowId) {
      return FLOWS.find((f) => f.id === initialFlowId) || FLOWS[0];
    }
    return FLOWS[0];
  });
  const [activeAsanaIdx, setActiveAsanaIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(FLOWS[0].asanas[0].seconds);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [showAnimationVideo, setShowAnimationVideo] = useState<boolean>(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  const currentAsana = selectedFlow.asanas[activeAsanaIdx];
  const totalMentionedSeconds = currentAsana.seconds;

  // Track halfway chime to prevent repeats
  const halfwaySeconds = Math.floor(totalMentionedSeconds / 2);
  const hasChimedHalfway = useRef<boolean>(false);

  // Reliable second-by-second countdown playing up to full mentioned time
  useEffect(() => {
    hasChimedHalfway.current = false;
  }, [activeAsanaIdx, selectedFlow]);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prevSec) => {
        if (prevSec > 1) {
          const nextSec = prevSec - 1;

          // Sound gentle chime halfway through the mentioned time
          if (nextSec === halfwaySeconds && !hasChimedHalfway.current) {
            hasChimedHalfway.current = true;
            soundSanctuary.playZenTingsha();
          }

          return nextSec;
        }

        // Timer reached 0:00 -> Completed full mentioned time!
        soundSanctuary.playMeditationBell(432);

        if (autoAdvance && activeAsanaIdx < selectedFlow.asanas.length - 1) {
          // Smoothly advance to next asana and set timer to its full mentioned time
          const nextIdx = activeAsanaIdx + 1;
          setActiveAsanaIdx(nextIdx);
          return selectedFlow.asanas[nextIdx].seconds;
        } else {
          // Session ended or auto-advance off
          setIsPlaying(false);
          soundSanctuary.playSingingBowl(216);
          const totalMins = Math.max(5, Math.round(selectedFlow.asanas.reduce((a, b) => a + b.seconds, 0) / 60));
          streakSystem.recordPractice('yoga', `${selectedFlow.title} Guided Practice`, totalMins);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, activeAsanaIdx, selectedFlow, autoAdvance, halfwaySeconds]);

  const handleSelectFlow = (flow: YogaFlow) => {
    setSelectedFlow(flow);
    setActiveAsanaIdx(0);
    setSecondsRemaining(flow.asanas[0].seconds);
    setIsPlaying(false);
    soundSanctuary.playSingingBowl(324);
  };

  const handleTogglePlay = () => {
    if (!isPlaying) {
      soundSanctuary.playZenTingsha();
      if (secondsRemaining <= 0) {
        setSecondsRemaining(currentAsana.seconds);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleNextAsana = () => {
    if (activeAsanaIdx < selectedFlow.asanas.length - 1) {
      soundSanctuary.playZenTingsha();
      const nextIdx = activeAsanaIdx + 1;
      setActiveAsanaIdx(nextIdx);
      setSecondsRemaining(selectedFlow.asanas[nextIdx].seconds);
    }
  };

  const handlePrevAsana = () => {
    if (activeAsanaIdx > 0) {
      soundSanctuary.playZenTingsha();
      const prevIdx = activeAsanaIdx - 1;
      setActiveAsanaIdx(prevIdx);
      setSecondsRemaining(selectedFlow.asanas[prevIdx].seconds);
    }
  };

  const handleResetPoseTimer = () => {
    setSecondsRemaining(currentAsana.seconds);
    hasChimedHalfway.current = false;
    soundSanctuary.playZenTingsha();
  };

  const handleAdd30Seconds = () => {
    setSecondsRemaining((s) => s + 30);
    soundSanctuary.playZenTingsha();
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(Math.max(0, totalSec) / 60);
    const secs = Math.max(0, totalSec) % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const elapsedSeconds = Math.max(0, totalMentionedSeconds - secondsRemaining);
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / totalMentionedSeconds) * 100));

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10 animate-fadeIn">
      {/* Back Button Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs font-medium text-[#5E5852] hover:text-[#26221E] bg-[#FFFFFF] border border-[#E8E1D5] px-4 py-2 rounded-full transition-all cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#9E6E38]" />
          <span>Return to Sanctuary Home</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundSanctuary.playZenTingsha();
              setIsShareModalOpen(true);
            }}
            className="flex items-center gap-1.5 text-xs font-medium text-[#73532C] bg-[#FFFFFF] hover:bg-[#F9F6F0] border border-[#D5C9B6] hover:border-[#B88554] px-3.5 py-2 rounded-full transition-all cursor-pointer shadow-2xs"
          >
            <Share2 className="w-3.5 h-3.5 text-[#B88554]" />
            <span>Share Practice Streak</span>
          </button>
          <span className="text-xs text-[#7A7268] hidden sm:inline">
            Sanctuary Studio · Asana Alignment
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-2xl space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#7A7268]">
          <span>Sanctuary Studio</span>
          <span>·</span>
          <span>Sacred Asana Alignment</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#26221E] font-normal">
          Divine Yoga Flows for Mind & Body
        </h1>
        <p className="text-sm text-[#5E5852] leading-relaxed">
          Step softly onto your mat. These therapeutic sequences curated by Dr. Syed Karishma are designed to heal energetic knots, soften tension, and reconnect you to your innate grace.
        </p>
      </div>

      {/* Flow Selection Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {FLOWS.map((flow) => {
          const isSelected = selectedFlow.id === flow.id;
          return (
            <button
              key={flow.id}
              onClick={() => handleSelectFlow(flow)}
              className={`p-6 rounded-3xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#FFFFFF] border-[#B88554] shadow-md ring-1 ring-[#B88554]/20'
                  : 'bg-[#F4EFE6] border-[#E8E1D5] hover:border-[#D0C2B0]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#9E6E38] font-medium">
                  <span>{flow.level}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {flow.duration}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-[#26221E] font-medium">
                  {flow.title}
                </h3>
                <p className="text-xs text-[#7A7268] italic font-serif">
                  {flow.sanskrit}
                </p>
                <p className="text-xs text-[#5E5852] leading-relaxed pt-1">
                  {flow.intention}
                </p>
              </div>

              <div className="pt-4 border-t border-[#EFE8DC] mt-4 flex items-center justify-between text-xs font-medium text-[#26221E]">
                <span>{flow.asanas.length} Asanas</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#9E6E38]">
                    {isSelected ? 'Selected' : 'Select'}
                  </span>
                  {onOpenTab && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenTab({
                          id: 'flow-' + flow.id,
                          type: 'flow',
                          title: flow.title,
                          subtitle: flow.sanskrit,
                          data: flow,
                          canClose: true
                        });
                        soundSanctuary.playZenTingsha();
                      }}
                      className="px-2 py-0.5 rounded-md bg-[#FAF7F2] hover:bg-[#FFFFFF] border border-[#D5C9B6] text-[10px] text-[#73532C] flex items-center gap-1 shadow-2xs hover:border-[#B88554]"
                      title="Open this flow in an isolated dedicated tab"
                    >
                      <ExternalLink className="w-2.5 h-2.5 text-[#B88554]" />
                      <span>Dedicated Tab</span>
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Guided Asana Practice Player with Professional Pose Guidance Animation Video */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] shadow-sm space-y-6">
        {/* Top Header of the Player */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EFE8DC] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[#9E6E38] font-medium uppercase tracking-wider">
              <span>{selectedFlow.title}</span>
              <span>·</span>
              <span>Pose {activeAsanaIdx + 1} of {selectedFlow.asanas.length}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F4EFE6] text-[#73532C] border border-[#E0D5C1] font-sans lowercase">
                {currentAsana.seconds}s mentioned duration
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#26221E] font-medium">
              {currentAsana.name}
            </h2>
            <p className="font-serif text-base text-[#7A7268] italic">
              {currentAsana.sanskritName}
            </p>

            {onOpenTab && (
              <button
                onClick={() => {
                  const pose = lookupPose(currentAsana.sanskritName || currentAsana.name);
                  onOpenTab({
                    id: 'pose-' + pose.id,
                    type: 'pose',
                    title: currentAsana.name,
                    subtitle: currentAsana.sanskritName,
                    data: { ...pose, durationSeconds: currentAsana.seconds, clinicalCue: currentAsana.cue },
                    canClose: true
                  });
                  soundSanctuary.playZenTingsha();
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F0EBE1] border border-[#D5C9B6] text-xs font-semibold text-[#73532C] transition-colors cursor-pointer shadow-2xs"
                title="Open this pose in a dedicated 3D tab"
              >
                <Box className="w-3.5 h-3.5 text-[#B88554]" />
                <span>Open Pose in Dedicated 3D Tab</span>
                <ExternalLink className="w-3 h-3 text-[#A8A096]" />
              </button>
            )}
          </div>

          {/* Time Countdown & Total Duration Badge */}
          <div className="flex items-center gap-3 sm:text-right shrink-0 bg-[#FBF9F5] p-3 rounded-2xl border border-[#E8E1D5]">
            {/* Circular Progress Ring */}
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              <svg className="w-12 h-12 -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#E8E1D5"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="#B88554"
                  strokeWidth="3.5"
                  strokeDasharray={125.6}
                  strokeDashoffset={125.6 - (125.6 * progressPercent) / 100}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-300"
                />
              </svg>
              <span className="absolute text-[10px] font-mono font-bold text-[#26221E]">
                {progressPercent}%
              </span>
            </div>

            <div className="text-left sm:text-right">
              <span className="font-serif text-3xl sm:text-4xl font-light text-[#26221E] tabular-nums block leading-none">
                {formatTime(secondsRemaining)}
              </span>
              <span className="text-[11px] text-[#7A7268] uppercase tracking-wider mt-1 block">
                {isPlaying ? 'Timer Running' : 'Paused'} · {formatTime(elapsedSeconds)} of {formatTime(totalMentionedSeconds)}
              </span>
            </div>
          </div>
        </div>

        {/* Linear Progress Bar for Mentioned Time */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-[#7A7268]">
            <span className="font-medium text-[#26221E]">
              Hold Progress: {formatTime(elapsedSeconds)} elapsed
            </span>
            <span>
              Target: {formatTime(totalMentionedSeconds)} ({totalMentionedSeconds} seconds)
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#F4EFE6] rounded-full overflow-hidden border border-[#E8E1D5]">
            <div
              className="h-full bg-gradient-to-r from-[#D4A373] to-[#B88554] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Visual Pose Guidance Animation Video (Professional Animator Studio) */}
        {showAnimationVideo && (
          <div className="pt-2">
            <AsanaVisualAnimator
              poseKey={currentAsana.sanskritName}
              poseName={currentAsana.name}
              sanskritName={currentAsana.sanskritName}
              cue={currentAsana.cue}
              breathCue={currentAsana.breath}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
            />
          </div>
        )}

        {/* Alignment Guidance & Prana Breath Cues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#F9F6F0] border border-[#E8E1D5] space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9E6E38]">
              Therapeutic Alignment Cue · Dr. Syed Karishma
            </span>
            <p className="text-xs sm:text-sm text-[#26221E] leading-relaxed">
              {currentAsana.cue}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F9F6F0] border border-[#E8E1D5] space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6C7A4D]">
              Breath & Prana Focus
            </span>
            <p className="text-xs sm:text-sm text-[#26221E] leading-relaxed">
              {currentAsana.breath}
            </p>
          </div>
        </div>

        {/* Flow Controls & Timer Fine-tuning Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#EFE8DC]">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevAsana}
              disabled={activeAsanaIdx === 0}
              className="p-3 rounded-full border border-[#E8E1D5] hover:bg-[#F4EFE6] disabled:opacity-30 text-[#26221E] transition-colors cursor-pointer"
              title="Previous Asana"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="px-7 py-3 rounded-full bg-[#12161A] hover:bg-[#252C33] text-[#F9F6F0] text-xs font-medium tracking-wide flex items-center gap-2.5 transition-all shadow-md cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 text-[#E0AFA0]" />
                  <span>Pause Timer & Video</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-[#E0AFA0]" />
                  <span>
                    Play Full Asana ({formatTime(secondsRemaining)})
                  </span>
                </>
              )}
            </button>

            <button
              onClick={handleNextAsana}
              disabled={activeAsanaIdx === selectedFlow.asanas.length - 1}
              className="p-3 rounded-full border border-[#E8E1D5] hover:bg-[#F4EFE6] disabled:opacity-30 text-[#26221E] transition-colors cursor-pointer"
              title="Next Asana"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Timer Helpers: +30s and Reset to Full Duration */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAdd30Seconds}
              className="px-3.5 py-2 rounded-xl text-xs font-medium bg-[#F4EFE6] hover:bg-[#EAE0CD] text-[#73532C] border border-[#E0D5C1] flex items-center gap-1 transition-colors cursor-pointer"
              title="Add 30 seconds to hold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+30s Hold</span>
            </button>

            <button
              onClick={handleResetPoseTimer}
              className="px-3.5 py-2 rounded-xl text-xs font-medium bg-[#F4EFE6] hover:bg-[#EAE0CD] text-[#5E5852] border border-[#E8E1D5] flex items-center gap-1 transition-colors cursor-pointer"
              title={`Reset to full ${totalMentionedSeconds}s`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset {totalMentionedSeconds}s</span>
            </button>

            <label className="flex items-center gap-1.5 text-xs text-[#5E5852] cursor-pointer pl-2">
              <input
                type="checkbox"
                checked={autoAdvance}
                onChange={(e) => setAutoAdvance(e.target.checked)}
                className="accent-[#B88554] w-3.5 h-3.5 rounded cursor-pointer"
              />
              <span className="hidden sm:inline">Auto-Flow</span>
            </label>
          </div>
        </div>

        {/* Asana Timeline Sequence Strip with Clickable Pose Cards */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-[#7A7268]">
            <span className="font-medium text-[#26221E]">
              Flow Sequence ({selectedFlow.asanas.length} Asanas)
            </span>
            <span>Click any asana to switch video and timer</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {selectedFlow.asanas.map((as, idx) => {
              const isCurrent = idx === activeAsanaIdx;
              const isDone = idx < activeAsanaIdx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveAsanaIdx(idx);
                    setSecondsRemaining(as.seconds);
                    hasChimedHalfway.current = false;
                    soundSanctuary.playZenTingsha();
                  }}
                  className={`p-3 rounded-2xl text-left border text-xs transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                    isCurrent
                      ? 'bg-[#12161A] text-[#F9F6F0] border-[#12161A] shadow-md ring-2 ring-[#D4A373]'
                      : isDone
                      ? 'bg-[#EBF0DC] text-[#4F5B36] border-[#CCD5AE]'
                      : 'bg-[#F9F6F0] text-[#5E5852] border-[#E8E1D5] hover:border-[#D0C2B0]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono opacity-80">
                      #{idx + 1}
                    </span>
                    {isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-[#E0AFA0] animate-ping" />
                    ) : isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#6C7A4D]" />
                    ) : (
                      <Film className="w-3 h-3 opacity-40" />
                    )}
                  </div>
                  <div className="font-medium truncate leading-tight">
                    {as.name.split(' with')[0]}
                  </div>
                  <div className="text-[10px] opacity-75 font-mono flex items-center justify-between pt-1">
                    <span className="truncate">{as.sanskritName.split(' ')[0]}</span>
                    {onOpenTab && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          const pose = lookupPose(as.sanskritName || as.name);
                          onOpenTab({
                            id: 'pose-' + pose.id,
                            type: 'pose',
                            title: as.name,
                            subtitle: as.sanskritName,
                            data: { ...pose, durationSeconds: as.seconds, clinicalCue: as.cue },
                            canClose: true
                          });
                          soundSanctuary.playZenTingsha();
                        }}
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[9px] font-semibold transition-all hover:scale-105 ${
                          isCurrent
                            ? 'bg-[#2D3944] text-[#F9F6F0] border-[#4A5B6B]'
                            : 'bg-[#FFFFFF] text-[#73532C] border-[#D5C9B6] hover:bg-[#F4EFE6]'
                        }`}
                        title="Open this pose in an isolated dedicated 3D tab"
                      >
                        <Box className="w-2.5 h-2.5 text-[#B88554]" />
                        <span>3D Tab</span>
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Share Practice Modal */}
      <ShareProgressModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        streakState={streakSystem.getState()}
        userName="Practitioner"
        dailyIntention={`${selectedFlow.title} Yoga Sadhana`}
      />
    </div>
  );
};
