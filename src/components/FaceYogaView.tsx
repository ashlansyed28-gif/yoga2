/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  Clock,
  Play,
  Pause,
  CheckCircle2,
  Volume2,
  ArrowLeft,
  Box,
  ExternalLink,
  Activity,
  Shield,
  Compass,
  Eye,
  Droplets
} from 'lucide-react';
import { soundSanctuary } from '../utils/soundSanctuary.ts';
import { FaceYogaVisualizer } from './FaceYogaVisualizer.tsx';
import { WorkspaceTab } from '../types/workspaceTabs.ts';

interface FaceYogaRoutine {
  id: string;
  title: string;
  sanskrit: string;
  duration: string;
  targetArea: string;
  benefits: string;
  steps: Array<{
    name: string;
    seconds: number;
    instructions: string;
    marmaPoint: string;
  }>;
}

const ROUTINES: FaceYogaRoutine[] = [
  {
    id: 'jaw-tmj',
    title: 'TMJ & Masseter Jaw Clench Release',
    sanskrit: 'हनु सन्धि विश्राम',
    duration: '6 min',
    targetArea: 'Jaw, Teeth Grinding & Temporal Muscles',
    benefits: 'Releases subconscious stress held in the masseter, alleviates morning tension headaches, and softens facial clenching.',
    steps: [
      {
        name: 'The Gentle Jaw Drop & Tongue Sweep',
        seconds: 90,
        instructions: 'Open your mouth slightly in an elongated "O". Slowly glide the tip of your tongue in a smooth circle behind the lips. Relax lower jaw completely.',
        marmaPoint: 'Hanu Marma (center of chin depression)'
      },
      {
        name: 'Knuckle Glide along Masseter Muscle',
        seconds: 120,
        instructions: 'Form soft fists. Use the flats of your index and middle knuckles to glide gently from the cheekbones down toward the angle of your jaw with unforced pressure.',
        marmaPoint: 'Krukatika & Mandibular notch'
      },
      {
        name: 'Temple Release with Slow Exhalation',
        seconds: 90,
        instructions: 'Place the pads of three middle fingers on your temples. Make slow, outward circular motions while exhaling through parted lips.',
        marmaPoint: 'Shankha Marma (temple hollow)'
      }
    ]
  },
  {
    id: 'brow-smoothing',
    title: 'Third-Eye & Forehead Furrow Softening',
    sanskrit: 'ललाट शान्ति साधना',
    duration: '5 min',
    targetArea: 'Corrugator & Frontalis Muscles (Worry Lines)',
    benefits: 'Relieves mental screen strain, smooths horizontal forehead tension, and stimulates the Ajna chakra center.',
    steps: [
      {
        name: 'Horizontal Brow Wave Sweep',
        seconds: 90,
        instructions: 'Place both index fingers horizontally across the center of your forehead. Sweep gently outward toward your temples with light feather pressure.',
        marmaPoint: 'Sthapani Marma (third eye between eyebrows)'
      },
      {
        name: 'Eyebrow Pinch & Glide',
        seconds: 120,
        instructions: 'Gently pinch the inner eyebrow between thumb and index finger. Walk the gentle pinch along the brow arch all the way to the tail. Release tension with each step.',
        marmaPoint: 'Avarta Marma (depression above eyebrow mid-point)'
      }
    ]
  },
  {
    id: 'neck-platysma',
    title: 'Neck Elongation & Platysma Muscle Lift',
    sanskrit: 'ग्रीवा सौन्दर्य क्रिया',
    duration: '7 min',
    targetArea: 'Cervical Neck, Double Chin & Collarbones',
    benefits: 'Stimulates lymphatic drainage from the head, tones the platysma sheath, and reverses forward-head tech slump.',
    steps: [
      {
        name: 'Ceiling Kiss & Gentle Swallow',
        seconds: 120,
        instructions: 'Gently tilt your head back to look toward the ceiling. Pout lips toward the sky like blowing a gentle kiss, then swallow softly to tone deep throat muscles.',
        marmaPoint: 'Kanthika (throat pit)'
      },
      {
        name: 'Collarbone Anchored Neck Traction',
        seconds: 120,
        instructions: 'Place both hands flat across your upper chest below the collarbones with gentle downward traction. Slowly tilt chin 45 degrees toward the left ceiling, breathe, then right.',
        marmaPoint: 'Jatru Marma (collarbone notches)'
      }
    ]
  }
];

interface FaceYogaViewProps {
  onBackToHome?: () => void;
  onOpenTab?: (tab: WorkspaceTab) => void;
  initialRoutineId?: string;
}

export const FaceYogaView: React.FC<FaceYogaViewProps> = ({ onBackToHome, onOpenTab, initialRoutineId }) => {
  const [selectedRoutine, setSelectedRoutine] = useState<FaceYogaRoutine>(() => {
    if (initialRoutineId) {
      return ROUTINES.find((r) => r.id === initialRoutineId) || ROUTINES[0];
    }
    return ROUTINES[0];
  });
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [secLeft, setSecLeft] = useState<number>(ROUTINES[0].steps[0].seconds);

  const currentStep = selectedRoutine.steps[activeStepIdx];
  const totalMentionedSeconds = currentStep.seconds;

  // Real-time second-by-second countdown playing up to full mentioned time
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSecLeft((sec) => {
        if (sec > 1) {
          return sec - 1;
        }
        soundSanctuary.playMeditationBell(432);
        if (activeStepIdx < selectedRoutine.steps.length - 1) {
          const nextIdx = activeStepIdx + 1;
          setActiveStepIdx(nextIdx);
          return selectedRoutine.steps[nextIdx].seconds;
        } else {
          setIsPlaying(false);
          soundSanctuary.playSingingBowl(216);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, activeStepIdx, selectedRoutine]);

  const handleSelect = (r: FaceYogaRoutine) => {
    setSelectedRoutine(r);
    setActiveStepIdx(0);
    setSecLeft(r.steps[0].seconds);
    setIsPlaying(false);
    soundSanctuary.playSingingBowl(324);
  };

  const handleTogglePlay = () => {
    if (!isPlaying) {
      soundSanctuary.playZenTingsha();
      if (secLeft <= 0) {
        setSecLeft(currentStep.seconds);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleResetStep = () => {
    setSecLeft(currentStep.seconds);
    soundSanctuary.playZenTingsha();
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(Math.max(0, totalSec) / 60);
    const secs = Math.max(0, totalSec) % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const elapsedSeconds = Math.max(0, totalMentionedSeconds - secLeft);
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / totalMentionedSeconds) * 100));

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
          Facial Rejuvenation & Marma Acupressure
        </span>
      </div>

      {/* Header */}
      <div className="max-w-2xl space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#7A7268]">
          <span>Facial Sadhana</span>
          <span>·</span>
          <span>Marma Acupressure</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#26221E] font-normal">
          Divine Face Yoga & TMJ Release
        </h1>
        <p className="text-sm text-[#5E5852] leading-relaxed">
          The face expresses the subconscious state of the soul. These gentle somatic techniques release clenched jaw muscles, smooth worry furrows, and stimulate vital Ayurvedic Marma points.
        </p>
      </div>

      {/* Routine Selector Cards with Visual Region Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {ROUTINES.map((r) => {
          const isSelected = selectedRoutine.id === r.id;
          return (
            <button
              key={r.id}
              onClick={() => handleSelect(r)}
              className={`p-6 rounded-3xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#FFFFFF] border-[#B88554] shadow-md ring-1 ring-[#B88554]/20'
                  : 'bg-[#F4EFE6] border-[#E8E1D5] hover:border-[#D0C2B0]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#9E6E38] font-medium">
                  <span>{r.duration}</span>
                  <span className="flex items-center gap-1 font-serif italic">{r.sanskrit}</span>
                </div>

                {/* Mini Visual Diagram Indicator */}
                <div className="my-3 py-2 px-3 rounded-2xl bg-[#EDE4D5]/60 flex items-center gap-3">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-[#FFFFFF] border border-[#D5C9B6] flex items-center justify-center p-1 shadow-2xs">
                    {r.id === 'jaw-tmj' && (
                      <svg viewBox="0 0 40 40" className="w-full h-full text-[#B88554]">
                        <ellipse cx="20" cy="18" rx="12" ry="15" fill="none" stroke="#8C7A6B" strokeWidth="1.2" />
                        {/* Highlighted masseter jaw zone */}
                        <path d="M 10 20 Q 12 30 20 32 Q 28 30 30 20" fill="none" stroke="#B88554" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="12" cy="24" r="2" fill="#E0AFA0" />
                        <circle cx="28" cy="24" r="2" fill="#E0AFA0" />
                      </svg>
                    )}
                    {r.id === 'brow-smoothing' && (
                      <svg viewBox="0 0 40 40" className="w-full h-full text-[#B88554]">
                        <ellipse cx="20" cy="20" rx="12" ry="15" fill="none" stroke="#8C7A6B" strokeWidth="1.2" />
                        {/* Highlighted brow & 3rd eye zone */}
                        <path d="M 12 14 Q 20 12 28 14" fill="none" stroke="#B88554" strokeWidth="2.5" strokeLinecap="round" />
                        <circle cx="20" cy="14" r="2.2" fill="#E0AFA0" />
                        <line x1="14" y1="14" x2="26" y2="14" stroke="#E0AFA0" strokeWidth="1" strokeDasharray="1,1" />
                      </svg>
                    )}
                    {r.id === 'neck-platysma' && (
                      <svg viewBox="0 0 40 40" className="w-full h-full text-[#B88554]">
                        {/* Highlighted neck & platysma fan */}
                        <ellipse cx="20" cy="12" rx="8" ry="10" fill="none" stroke="#8C7A6B" strokeWidth="1" />
                        <path d="M 14 20 L 10 34 L 30 34 L 26 20 Z" fill="#E0AFA0" fillOpacity="0.25" stroke="#B88554" strokeWidth="1.5" />
                        <line x1="20" y1="20" x2="20" y2="34" stroke="#B88554" strokeWidth="1.5" strokeDasharray="2,1" />
                        <circle cx="20" cy="30" r="2" fill="#E0AFA0" />
                      </svg>
                    )}
                  </div>
                  <div className="text-[11px] leading-tight">
                    <span className="font-semibold text-[#26221E] block">Target Zone:</span>
                    <span className="text-[#5E5852]">{r.targetArea.split('&')[0]}</span>
                  </div>
                </div>

                <h3 className="font-serif text-lg text-[#26221E] font-medium mt-1">
                  {r.title}
                </h3>
                <p className="text-xs text-[#5E5852] mt-2 leading-relaxed">
                  {r.benefits}
                </p>
              </div>

              <div className="pt-3 border-t border-[#EFE8DC] mt-4 flex items-center justify-between text-xs font-medium text-[#B88554]">
                <span>{isSelected ? 'Active Routine' : 'Practice Now'}</span>
                {onOpenTab && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTab({
                        id: 'faceyoga-' + r.id,
                        type: 'faceyoga',
                        title: r.title,
                        subtitle: r.sanskrit,
                        data: r,
                        canClose: true
                      });
                      soundSanctuary.playZenTingsha();
                    }}
                    className="px-2 py-0.5 rounded-md bg-[#FAF7F2] hover:bg-[#FFFFFF] border border-[#D5C9B6] text-[10px] text-[#73532C] flex items-center gap-1 shadow-2xs hover:border-[#B88554]"
                    title="Open this face yoga routine in a dedicated tab"
                  >
                    <ExternalLink className="w-2.5 h-2.5 text-[#B88554]" />
                    <span>Dedicated Tab</span>
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Somatic Animated Face Yoga & Marma Acupressure Studio Visualizer */}
      <FaceYogaVisualizer
        routineId={selectedRoutine.id}
        stepIndex={activeStepIdx}
        stepName={currentStep.name}
        marmaPointName={currentStep.marmaPoint}
        instructions={currentStep.instructions}
        secondsRemaining={secLeft}
        totalSeconds={totalMentionedSeconds}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onReset={handleResetStep}
      />

      {/* Routine Steps Altar & Acupressure Details */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EFE8DC] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9E6E38]">
              {selectedRoutine.title} · Routine Steps
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#26221E] font-medium">
              Step {activeStepIdx + 1}: {currentStep.name}
            </h3>
            <p className="text-xs text-[#6C7A4D] font-medium">
              Active Marma Point: {currentStep.marmaPoint}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#E8E1D5]">
            {selectedRoutine.steps.map((st, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveStepIdx(i);
                  setSecLeft(st.seconds);
                  soundSanctuary.playZenTingsha();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                  activeStepIdx === i
                    ? 'bg-[#12161A] text-[#F9F6F0] shadow-xs'
                    : 'bg-transparent text-[#5E5852] hover:text-[#26221E]'
                }`}
              >
                Part {i + 1} ({st.seconds}s)
              </button>
            ))}
          </div>
        </div>

        {/* Somatic Guidance Box */}
        <div className="p-5 rounded-2xl bg-[#F9F6F0] border border-[#E8E1D5] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9E6E38]">
              Dr. Syed Karishma’s Acupressure Clinical Guidance
            </span>
            <span className="text-[11px] text-[#73532C] bg-[#EDE4D5] px-2.5 py-0.5 rounded-full font-medium">
              Prescribed Duration: {totalMentionedSeconds}s
            </span>
          </div>
          <p className="text-sm text-[#26221E] leading-relaxed">
            {currentStep.instructions}
          </p>
          <div className="pt-2 text-xs text-[#7A7268] italic border-t border-[#EFE8DC]">
            Ayurvedic Tip: Warm 2 drops of organic Kumkumadi or cold-pressed sweet almond oil between your ring fingers before beginning strokes to avoid pulling delicate facial fascia.
          </div>
        </div>
      </div>

      {/* Visual Facial Marma & Somatic Emotion Atlas */}
      <div className="space-y-4 pt-2">
        <div className="space-y-1">
          <span className="text-xs text-[#7A7268] uppercase tracking-wider font-semibold">
            Ayurvedic Somatosensory Mapping
          </span>
          <h2 className="font-serif text-2xl text-[#26221E] font-medium">
            Facial Marma & Somatic Emotion Atlas
          </h2>
          <p className="text-xs text-[#5E5852]">
            Every facial muscle layer mirrors an emotional autonomic state. Learn why your face clenches and how somatic strokes release it:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Masseter & TMJ */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#9E6E38] uppercase tracking-wider">
                Hanu & Krukatika Marma
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EDE4D5] text-[#73532C]">
                Jaw & Mandible
              </span>
            </div>
            <h3 className="font-serif text-lg text-[#26221E] font-medium">
              The Clenched Jaw: Unexpressed Anger & Overcontrol
            </h3>
            <p className="text-xs text-[#5E5852] leading-relaxed">
              The masseter can exert over 150 lbs of bite force. During times of withheld boundary-setting or swallowed frustration, the brain locks this muscle into nocturnal clenching (bruxism).
            </p>
            <div className="p-3 rounded-2xl bg-[#F9F6F0] border border-[#EFE8DC] text-[11px] text-[#26221E] space-y-1">
              <strong>Somatic Stroke Solution:</strong> Knuckle down-glides from zygomatic arch toward mandibular angle while keeping mouth slightly parted in a soft “O”.
            </div>
          </div>

          {/* Card 2: Corrugator & Glabella */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#9E6E38] uppercase tracking-wider">
                Sthapani & Avarta Marma
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EDE4D5] text-[#73532C]">
                Third Eye & Eyebrows
              </span>
            </div>
            <h3 className="font-serif text-lg text-[#26221E] font-medium">
              The Furrowed Brow: Analytical Worry & Screen Strain
            </h3>
            <p className="text-xs text-[#5E5852] leading-relaxed">
              Prolonged digital focus draws the corrugator muscles inward, pinching Sthapani Marma. This stimulates hyperactive beta brain waves and suppresses melatonin onset.
            </p>
            <div className="p-3 rounded-2xl bg-[#F9F6F0] border border-[#EFE8DC] text-[11px] text-[#26221E] space-y-1">
              <strong>Somatic Stroke Solution:</strong> Outward horizontal sweeps from center brow to temples with feather pressure (20g), followed by gentle eyebrow pinch walks.
            </div>
          </div>

          {/* Card 3: Temples */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#9E6E38] uppercase tracking-wider">
                Shankha Marma
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EDE4D5] text-[#73532C]">
                Temporal Hollows
              </span>
            </div>
            <h3 className="font-serif text-lg text-[#26221E] font-medium">
              Temporal Throbbing: Pitta Heat & Time Urgency
            </h3>
            <p className="text-xs text-[#5E5852] leading-relaxed">
              When the mind is locked in multi-tasking and rush, metabolic arterial heat pools in the superficial temporal vessels, creating dull tension behind the eyes and temples.
            </p>
            <div className="p-3 rounded-2xl bg-[#F9F6F0] border border-[#EFE8DC] text-[11px] text-[#26221E] space-y-1">
              <strong>Somatic Stroke Solution:</strong> Slow outward clockwise spirals with three finger pads while exhaling through gently parted lips.
            </div>
          </div>

          {/* Card 4: Platysma & Neck */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#9E6E38] uppercase tracking-wider">
                Kanthika & Jatru Marma
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EDE4D5] text-[#73532C]">
                Throat & Clavicles
              </span>
            </div>
            <h3 className="font-serif text-lg text-[#26221E] font-medium">
              The Tech Neck: Voice Suppression & Heavy Shoulders
            </h3>
            <p className="text-xs text-[#5E5852] leading-relaxed">
              Forward-head posture weighs up to 40 lbs on the cervical spine. The platysma muscle contracts and wrinkles, stagnating lymphatic drainage from the face down into the body.
            </p>
            <div className="p-3 rounded-2xl bg-[#F9F6F0] border border-[#EFE8DC] text-[11px] text-[#26221E] space-y-1">
              <strong>Somatic Stroke Solution:</strong> Clavicle hand anchor with 45° chin elevation, followed by ceiling kiss pouts and mindful swallows.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
