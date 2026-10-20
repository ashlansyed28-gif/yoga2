/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Heart,
  Sparkles,
  Sun,
  Moon,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Clock,
  X,
  Film,
  Box,
  ExternalLink
} from 'lucide-react';
import { soundSanctuary } from '../utils/soundSanctuary.ts';
import { AsanaVisualAnimator } from './AsanaVisualAnimator.tsx';
import { WorkspaceTab } from '../types/workspaceTabs.ts';
import { lookupPose } from '../utils/poseDictionary.ts';

export interface ProtocolItem {
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
}

export const PROTOCOLS: ProtocolItem[] = [
  {
    id: 'spine-posture',
    title: 'Cervical Spine, Tech-Neck & Sacral Alignment',
    sanskrit: 'मेरुदण्ड विश्राम विधान',
    category: 'Structural Biomechanics',
    description: 'A 14-day corrective protocol for reversing forward-head posture, releasing trapped cervical nerves, and decompressing the lumbar vertebrae caused by sustained screen work.',
    dailyRoutine: {
      dawn: '5 mins neck traction with rolled linen towel + warm sesame oil massage along cervical spine.',
      midday: 'Chin-tuck prana glides every 90 minutes; stand and perform 3 gentle thoracic extensions.',
      dusk: '6 mins Supta Baddha Konasana on chest bolster before warm shower.'
    },
    herbalMedicine: [
      'Guggulu resin for joint inflammation',
      'Warm sesame oil infused with Bala (Sida cordifolia)',
      'Turmeric & black pepper golden infusion'
    ],
    targetedAsanas: [
      'Salamba Matsyasana (Supported Fish Pose)',
      'Garudasana Arms (Eagle Arms Shoulder Wrap)',
      'Marjaryasana (Cat-Cow Spinal Ripple)'
    ],
    pranayama: 'Ujjayi (Ocean Breath) to warm and lubricate throat and cervical nadis.'
  },
  {
    id: 'hormone-thyroid',
    title: 'Hormonal Equilibrium & Thyroid Vitality',
    sanskrit: 'ग्रन्थि सन्तुलन विधान',
    category: 'Endocrine & Metabolic',
    description: 'Restores the circadian endocrine axis, supports healthy thyroid metabolism, and relieves adrenal overproduction through inverted restorative postures and cooling lunar breathwork.',
    dailyRoutine: {
      dawn: '15 mins morning sunlight exposure directly in eyes (unfiltered by glass) to anchor cortisol awakening spike.',
      midday: 'Nourishing warm cooked lunch with ghee, sweet potatoes, and mineral salts.',
      dusk: 'Chandra Bhedana lunar left-nostril breathing for 7 minutes; zero blue light screens after 8:30 PM.'
    },
    herbalMedicine: [
      'Ashwagandha root powder (Withania somnifera) at dusk',
      'Organic Shatavari (Asparagus racemosus) for hormonal balance',
      'Coriander seed warm water steep in morning'
    ],
    targetedAsanas: [
      'Viparita Karani (Supported Inversion for Thyroid Bathing)',
      'Setu Bandhasana (Supported Bridge on Bolster)',
      'Bhujangasana (Gentle Cobra for Adrenal Stimulation)'
    ],
    pranayama: 'Jalandhara Bandha (Throat Lock) with gentle kumbhaka to stimulate thyroid gland.'
  },
  {
    id: 'vagus-anxiety',
    title: 'Vagus Nerve Reset & Acute Anxiety Downregulation',
    sanskrit: 'चित्त शान्ति विधान',
    category: 'Neuro-Somatic Calming',
    description: 'Directly stimulates the ventral vagal parasympathetic network to turn off chronic fight-or-flight states, lower resting heart rate, and restore bodily feelings of safety.',
    dailyRoutine: {
      dawn: 'Cold water splash over eyes and carotid arteries; gentle hum during morning shower.',
      midday: '60-second physiological sigh (two nasal sniffs, extended oral exhalation) prior to eating.',
      dusk: 'Ear lobe Marma point pressure with lavender or Brahmi oil before sleep.'
    },
    herbalMedicine: [
      'Brahmi (Bacopa monnieri) for neurotransmitter resilience',
      'Chamomile and Saffron infused warm brew',
      'Tulsi (Holy Basil) sacred tea'
    ],
    targetedAsanas: [
      'Balasana with Third-Eye Grounding',
      'Supta Matsyendrasana (Supine Spinal Twist)',
      'Savasana with weighted linen blanket over abdomen'
    ],
    pranayama: 'Bhramari (Humming Bee Breath) for 8 cycles to release soothing nitric oxide.'
  },
  {
    id: 'gut-agni',
    title: 'Deep Gut Agni & Microbiome Rekindling',
    sanskrit: 'जठराग्नि दीपन विधान',
    category: 'Metabolic & Digestion',
    description: 'Kindles the biological digestive flame (Agni) without creating acid heat (Pitta), resolving bloating, sluggish elimination, and gut-brain anxiety signals.',
    dailyRoutine: {
      dawn: 'Warm water with fresh grated ginger, half a lemon, and a tiny pinch of rock salt.',
      midday: 'Main meal eaten in silence with zero phone scrolling; 100 gentle steps post-meal.',
      dusk: 'Light soup dinner at least 3 hours before sleep.'
    },
    herbalMedicine: [
      'Triphala organic powder steeped in warm water before bedtime',
      'Cumin, Coriander, Fennel (CCF) therapeutic tea',
      'Pippali (Long pepper) trace microdose'
    ],
    targetedAsanas: [
      'Pawanmuktasana (Wind-Relieving Pose)',
      'Ardha Matsyendrasana (Gentle Seated Half Twist)',
      'Vajrasana (Thunderbolt Pose seated 5 mins post-meal)'
    ],
    pranayama: 'Kapalabhati gentle slow pulsing followed by Agnisara Kriya.'
  }
];

interface ProtocolsViewProps {
  onBackToHome?: () => void;
  onOpenTab?: (tab: WorkspaceTab) => void;
}

export const ProtocolsView: React.FC<ProtocolsViewProps> = ({ onBackToHome, onOpenTab }) => {
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolItem>(PROTOCOLS[0]);
  const [anchoredId, setAnchoredId] = useState<string | null>(null);

  // Pose Guidance Animation Video Modal & Practice Timer State
  const [activeModalAsana, setActiveModalAsana] = useState<{
    name: string;
    sanskritName: string;
    seconds: number;
    cue: string;
  } | null>(null);
  const [modalSecondsRemaining, setModalSecondsRemaining] = useState<number>(180);
  const [isModalTimerRunning, setIsModalTimerRunning] = useState<boolean>(false);

  const handleSelect = (item: ProtocolItem) => {
    setSelectedProtocol(item);
    soundSanctuary.playSingingBowl(324);
    if (onOpenTab) {
      onOpenTab({
        id: 'protocol-' + item.id,
        type: 'protocol',
        title: item.title,
        subtitle: item.sanskrit,
        data: item,
        canClose: true
      });
    }
  };

  const handleAnchor = (id: string) => {
    setAnchoredId(id);
    soundSanctuary.playSingingBowl(216);
    setTimeout(() => setAnchoredId(null), 3000);
  };

  const handleOpenAsanaModal = (asanaText: string) => {
    if (onOpenTab) {
      const pose = lookupPose(asanaText);
      onOpenTab({
        id: 'pose-' + pose.id,
        type: 'pose',
        title: pose.name,
        subtitle: pose.sanskritName,
        data: pose,
        canClose: true
      });
      return;
    }

    // Parse asana name and sanskrit name
    const parts = asanaText.split('(');
    const primaryName = parts[0].trim();
    const subName = parts[1] ? parts[1].replace(')', '').trim() : primaryName;

    const defaultSeconds = 180; // 3 minutes standard prescribed hold
    setActiveModalAsana({
      name: primaryName,
      sanskritName: subName,
      seconds: defaultSeconds,
      cue: `Prescribed hold for ${selectedProtocol.title}. Breathe deeply into the target area and allow the prana to circulate without strain.`
    });
    setModalSecondsRemaining(defaultSeconds);
    setIsModalTimerRunning(true);
    soundSanctuary.playZenTingsha();
  };

  // Dedicated second-by-second countdown playing up to the mentioned time
  useEffect(() => {
    if (!isModalTimerRunning || !activeModalAsana) return;

    const timer = setInterval(() => {
      setModalSecondsRemaining((sec) => {
        if (sec > 1) {
          return sec - 1;
        }
        soundSanctuary.playMeditationBell(432);
        setIsModalTimerRunning(false);
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isModalTimerRunning, activeModalAsana]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(Math.max(0, totalSec) / 60);
    const secs = Math.max(0, totalSec) % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

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

        <span className="text-xs text-[#7A7268] hidden sm:inline">
          Clinical Ayurveda & Yoga Protocols
        </span>
      </div>

      {/* Header */}
      <div className="max-w-2xl space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#7A7268]">
          <span>Clinical Ayurveda & Yoga</span>
          <span>·</span>
          <span>Dr. Syed Karishma</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#26221E] font-normal">
          Evidence-Based Holistic Protocols
        </h1>
        <p className="text-sm text-[#5E5852] leading-relaxed">
          Structured, multi-system healing regimens integrating ancient Ayurvedic lifestyle science with restorative yoga biomechanics.
        </p>
      </div>

      {/* Protocols Grid Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PROTOCOLS.map((p) => {
          const isSelected = selectedProtocol.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handleSelect(p)}
              className={`p-5 rounded-3xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#FFFFFF] border-[#B88554] shadow-md ring-1 ring-[#B88554]/20'
                  : 'bg-[#F4EFE6] border-[#E8E1D5] hover:border-[#D5C7B5]'
              }`}
            >
              <div>
                <span className="text-[11px] font-semibold text-[#9E6E38] uppercase tracking-wider block">
                  {p.category}
                </span>
                <h3 className="font-serif text-base text-[#26221E] font-medium mt-1 leading-snug">
                  {p.title}
                </h3>
                <p className="text-xs text-[#7A7268] italic mt-0.5 font-serif">
                  {p.sanskrit}
                </p>
              </div>

              <div className="pt-3 border-t border-[#EFE8DC] mt-3 text-xs font-medium text-[#B88554] flex items-center justify-between">
                <span>Open in Dedicated Tab</span>
                <ExternalLink className="w-3 h-3 text-[#B88554]" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Protocol Deep Dive Container */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EFE8DC] pb-6">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#9E6E38] uppercase tracking-wider">
              {selectedProtocol.category} Protocol
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#26221E] font-medium">
              {selectedProtocol.title}
            </h2>
            <p className="font-serif text-sm text-[#7A7268] italic">
              {selectedProtocol.sanskrit}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenTab && (
              <button
                onClick={() => {
                  onOpenTab({
                    id: 'protocol-' + selectedProtocol.id,
                    type: 'protocol',
                    title: selectedProtocol.title,
                    subtitle: selectedProtocol.sanskrit,
                    data: selectedProtocol,
                    canClose: true
                  });
                  soundSanctuary.playZenTingsha();
                }}
                className="px-4 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-[#F0EBE1] border border-[#D5C9B6] text-[#26221E] text-xs font-medium tracking-wide transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 shadow-2xs"
                title="Open this protocol in a separate dedicated tab"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#B88554]" />
                <span>Open in Dedicated Tab</span>
              </button>
            )}

            <button
              onClick={() => handleAnchor(selectedProtocol.id)}
              className="px-6 py-2.5 rounded-full bg-[#12161A] text-[#F9F6F0] hover:bg-[#252C33] text-xs font-medium tracking-wide transition-colors cursor-pointer shrink-0 flex items-center gap-2 shadow-sm"
            >
              {anchoredId === selectedProtocol.id ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#CCD5AE]" />
                  <span>Protocol Anchored to Profile</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#E0AFA0]" />
                  <span>Anchor to My Daily Sadhana</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Clinical Rationale */}
        <p className="text-sm text-[#5E5852] leading-relaxed max-w-3xl">
          {selectedProtocol.description}
        </p>

        {/* 3-Phase Daily Rhythm */}
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#5E5852]">
            Daily Chronobiology Routine
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#F9F6F0] border border-[#E8E1D5] space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-[#9E6E38] font-semibold">
                <Sun className="w-4 h-4" />
                <span>Morning Dawn</span>
              </div>
              <p className="text-xs text-[#26221E] leading-relaxed">
                {selectedProtocol.dailyRoutine.dawn}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F9F6F0] border border-[#E8E1D5] space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-[#9E6E38] font-semibold">
                <Sun className="w-4 h-4 text-[#D4A373]" />
                <span>Midday Solar Window</span>
              </div>
              <p className="text-xs text-[#26221E] leading-relaxed">
                {selectedProtocol.dailyRoutine.midday}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F9F6F0] border border-[#E8E1D5] space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-[#9E6E38] font-semibold">
                <Moon className="w-4 h-4 text-[#E0AFA0]" />
                <span>Twilight Dusk</span>
              </div>
              <p className="text-xs text-[#26221E] leading-relaxed">
                {selectedProtocol.dailyRoutine.dusk}
              </p>
            </div>
          </div>
        </div>

        {/* Asana & Herbal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#EFE8DC]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5E5852]">
                Prescribed Yoga Asanas & Breath
              </span>
              <span className="text-[11px] text-[#B88554] font-medium">
                Click any pose for Animation & Timer
              </span>
            </div>

            <div className="space-y-2">
              {selectedProtocol.targetedAsanas.map((as, i) => (
                <button
                  key={i}
                  onClick={() => handleOpenAsanaModal(as)}
                  className="w-full p-3 rounded-2xl bg-[#F9F6F0] hover:bg-[#F4EFE6] border border-[#E8E1D5] hover:border-[#B88554] transition-all flex items-center justify-between gap-3 text-left cursor-pointer group shadow-2xs"
                >
                  <div className="flex items-center gap-2 text-xs text-[#26221E]">
                    <span className="text-[#9E6E38] font-mono">#{i + 1}</span>
                    <span className="font-medium group-hover:text-[#B88554] transition-colors">{as}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#73532C] bg-[#EDE4D5] px-2.5 py-1 rounded-full group-hover:bg-[#E2D2BC] transition-colors shrink-0">
                    <Film className="w-3 h-3 text-[#9E6E38]" />
                    <span>Watch Pose & 3m Timer</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-[#F4EFE6] text-xs text-[#5E5852] mt-3">
              <strong>Pranayama:</strong> {selectedProtocol.pranayama}
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#5E5852]">
              Ayurvedic Herbal Formulas
            </span>
            <ul className="space-y-2 text-xs text-[#26221E]">
              {selectedProtocol.herbalMedicine.map((med, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#6C7A4D]">•</span>
                  <span>{med}</span>
                </li>
              ))}
            </ul>
            <p className="text-[11px] text-[#7A7268] italic pt-1">
              Curated by Dr. Syed Karishma for gentle home integration.
            </p>
          </div>
        </div>
      </div>

      {/* Asana Pose Guidance Animation Video Modal & Realtime Practice Timer */}
      {activeModalAsana && (
        <div className="fixed inset-0 z-50 bg-[#12161A]/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="bg-[#FAF7F2] rounded-3xl border border-[#E8E1D5] max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E8E1D5] pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#9E6E38] font-semibold">
                  Prescribed Clinical Guidance Video · Dr. Syed Karishma
                </span>
                <h3 className="font-serif text-2xl text-[#26221E] font-medium">
                  {activeModalAsana.name}
                </h3>
                <p className="font-serif text-sm text-[#7A7268] italic">
                  {activeModalAsana.sanskritName}
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveModalAsana(null);
                  setIsModalTimerRunning(false);
                }}
                className="p-2 rounded-full hover:bg-[#EAE2D5] text-[#5E5852] transition-colors cursor-pointer"
                title="Close Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visual Pose Guidance Animation Studio Component */}
            <AsanaVisualAnimator
              poseKey={activeModalAsana.sanskritName}
              poseName={activeModalAsana.name}
              sanskritName={activeModalAsana.sanskritName}
              cue={activeModalAsana.cue}
              isPlaying={isModalTimerRunning}
              onTogglePlay={() => setIsModalTimerRunning(!isModalTimerRunning)}
            />

            {/* Dedicated Practice Timer Section (Counts down up to mentioned time) */}
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8E1D5] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 -rotate-90">
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      stroke="#E8E1D5"
                      strokeWidth="3.5"
                      fill="none"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="24"
                      stroke="#B88554"
                      strokeWidth="4"
                      strokeDasharray={150.8}
                      strokeDashoffset={
                        150.8 -
                        (150.8 *
                          Math.max(
                            0,
                            activeModalAsana.seconds - modalSecondsRemaining
                          )) /
                          activeModalAsana.seconds
                      }
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-300"
                    />
                  </svg>
                  <span className="absolute text-xs font-mono font-bold text-[#26221E]">
                    {Math.round(
                      ((activeModalAsana.seconds - modalSecondsRemaining) /
                        activeModalAsana.seconds) *
                        100
                    )}
                    %
                  </span>
                </div>

                <div>
                  <span className="font-serif text-3xl font-light text-[#26221E] tabular-nums block">
                    {formatTime(modalSecondsRemaining)}
                  </span>
                  <span className="text-[11px] text-[#7A7268] uppercase tracking-wider block">
                    {isModalTimerRunning ? 'Timer Active' : 'Paused'} · Target:{' '}
                    {formatTime(activeModalAsana.seconds)} ({activeModalAsana.seconds}s)
                  </span>
                </div>
              </div>

              {/* Timer Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsModalTimerRunning(!isModalTimerRunning)}
                  className="px-6 py-2.5 rounded-full bg-[#12161A] hover:bg-[#252C33] text-[#F9F6F0] text-xs font-medium flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  {isModalTimerRunning ? (
                    <>
                      <Pause className="w-3.5 h-3.5 text-[#E0AFA0]" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 text-[#E0AFA0]" />
                      <span>Play ({formatTime(modalSecondsRemaining)})</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setModalSecondsRemaining(activeModalAsana.seconds);
                    soundSanctuary.playZenTingsha();
                  }}
                  className="p-2.5 rounded-full border border-[#E8E1D5] hover:bg-[#F4EFE6] text-[#5E5852] transition-colors cursor-pointer"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setModalSecondsRemaining((s) => s + 30);
                    soundSanctuary.playZenTingsha();
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-medium bg-[#F4EFE6] text-[#73532C] border border-[#E0D5C1] hover:bg-[#EAE0CD] transition-colors cursor-pointer"
                >
                  +30s
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
