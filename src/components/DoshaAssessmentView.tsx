/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Flame,
  Wind,
  Droplets,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Box,
  Moon,
  Heart,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { WorkspaceTab } from '../types/workspaceTabs.ts';
import { soundSanctuary } from '../utils/soundSanctuary.ts';

interface Question {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  options: {
    dosha: 'vata' | 'pitta' | 'kapha';
    label: string;
    description: string;
  }[];
}

const DOSHA_QUESTIONS: Question[] = [
  {
    id: 'energy-movement',
    category: 'Prana & Movement',
    title: 'Physical Energy & Natural Movement Pace',
    subtitle: 'How does your daily stamina and movement pattern feel most naturally?',
    options: [
      {
        dosha: 'vata',
        label: 'Quick, variable, bursts of high energy followed by sudden fatigue',
        description: 'Movement is swift and light; tend to speak rapidly and multi-task easily.'
      },
      {
        dosha: 'pitta',
        label: 'Focused, purposeful, medium-high stamina with strong drive',
        description: 'Movement is precise, decisive, and goal-directed with intense willpower.'
      },
      {
        dosha: 'kapha',
        label: 'Steady, methodical, high endurance, slow to start but long-lasting',
        description: 'Movement is graceful and unhurried; retains physical energy effortlessly.'
      }
    ]
  },
  {
    id: 'sleep-pattern',
    category: 'Nidra (Sleep)',
    title: 'Sleep Depth & Nocturnal Awakenings',
    subtitle: 'What is your typical nighttime sleep experience?',
    options: [
      {
        dosha: 'vata',
        label: 'Light, variable sleeper; prone to waking at 2–4 AM with a racing mind',
        description: 'Dreams are active, vivid, flying, or restlessness; easily startled by sounds.'
      },
      {
        dosha: 'pitta',
        label: 'Moderate, sound sleeper; wake up easily if overheated or thirst occurs',
        description: 'Dreams are colorful, problem-solving, or fiery; wake feeling alert and ready.'
      },
      {
        dosha: 'kapha',
        label: 'Deep, heavy, uninterrupted sleep; difficult to get out of bed early',
        description: 'Dreams are serene, watery, romantic, or rare; feel groggy if waking before dawn.'
      }
    ]
  },
  {
    id: 'temperature-climate',
    category: 'Agni (Thermoregulation)',
    title: 'Thermoregulation & Climate Sensitivity',
    subtitle: 'Which climate conditions make your body feel most depleted or balanced?',
    options: [
      {
        dosha: 'vata',
        label: 'Prone to cold hands & feet; love warm radiant sunshine, dislike drafty winds',
        description: 'Skin tends to get dry or rough in air conditioning or autumn winds.'
      },
      {
        dosha: 'pitta',
        label: 'Naturally warm or hot; easily flushed or sweating, dislike intense noon sun',
        description: 'Prefer cool rooms, iced water, and shade; sensitive to heat waves.'
      },
      {
        dosha: 'kapha',
        label: 'Tolerate warm heat well; dislike cold damp rainy weather and morning chill',
        description: 'Good resilience to weather shifts, but damp cold induces congestion or sluggishness.'
      }
    ]
  },
  {
    id: 'stress-response',
    category: 'Manas (Emotional State)',
    title: 'Stress Response & Emotional Baseline',
    subtitle: 'When faced with prolonged stress or uncertainty, what is your reflex?',
    options: [
      {
        dosha: 'vata',
        label: 'Anxiety, anticipatory worry, scattered thoughts, and feeling ungrounded',
        description: 'Brain feels like a leaf in the wind; craving safety, warmth, and reassurance.'
      },
      {
        dosha: 'pitta',
        label: 'Irritability, impatience, sharp critique, and wanting to take command',
        description: 'Inner heat rises; frustration when schedules slip or perfection is compromised.'
      },
      {
        dosha: 'kapha',
        label: 'Withdrawal, hesitation, comfort-eating, emotional holding, and resistance',
        description: 'Desire to retreat into a cozy shell; takes time to process changes.'
      }
    ]
  },
  {
    id: 'digestion-metabolism',
    category: 'Jathara Agni (Digestion)',
    title: 'Digestion & Appetite Rhythm',
    subtitle: 'How does your metabolic digestive fire behave throughout the day?',
    options: [
      {
        dosha: 'vata',
        label: 'Irregular appetite (Vishama Agni); prone to gas, dry bloating, and variable hunger',
        description: 'Sometimes ravenous, sometimes forget to eat; digestion changes with travel.'
      },
      {
        dosha: 'pitta',
        label: 'Sharp, intense hunger (Tikshna Agni); become irritable if meals are delayed',
        description: 'Fast digestion, prone to acid reflux, heartburn, or burning sensations if skipping food.'
      },
      {
        dosha: 'kapha',
        label: 'Slow, steady metabolism (Manda Agni); can skip meals easily without discomfort',
        description: 'Heavy feeling in stomach for hours after rich food; slow lymphatic clearance.'
      }
    ]
  }
];

interface DoshaAssessmentViewProps {
  onBackToHome?: () => void;
  onOpenTab?: (tab: WorkspaceTab) => void;
}

export const DoshaAssessmentView: React.FC<DoshaAssessmentViewProps> = ({
  onBackToHome,
  onOpenTab
}) => {
  const [answers, setAnswers] = useState<Record<string, 'vata' | 'pitta' | 'kapha'>>({});
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentQ = DOSHA_QUESTIONS[activeStep];
  const totalQuestions = DOSHA_QUESTIONS.length;

  const handleSelectOption = (qId: string, dosha: 'vata' | 'pitta' | 'kapha') => {
    soundSanctuary.playZenTingsha();
    setAnswers((prev) => ({ ...prev, [qId]: dosha }));

    if (activeStep < totalQuestions - 1) {
      setActiveStep((s) => s + 1);
    } else {
      setIsCompleted(true);
      soundSanctuary.playSingingBowl(324);
    }
  };

  const handleReset = () => {
    soundSanctuary.playZenTingsha();
    setAnswers({});
    setActiveStep(0);
    setIsCompleted(false);
  };

  // Compute Scores
  const totalAnswers = Object.values(answers).length;
  const vataCount = Object.values(answers).filter((v) => v === 'vata').length;
  const pittaCount = Object.values(answers).filter((v) => v === 'pitta').length;
  const kaphaCount = Object.values(answers).filter((v) => v === 'kapha').length;

  const vataPct = totalAnswers ? Math.round((vataCount / totalAnswers) * 100) : 33;
  const pittaPct = totalAnswers ? Math.round((pittaCount / totalAnswers) * 100) : 33;
  const kaphaPct = totalAnswers ? Math.round((kaphaCount / totalAnswers) * 100) : 34;

  const dominantDosha: 'vata' | 'pitta' | 'kapha' = (() => {
    if (vataCount >= pittaCount && vataCount >= kaphaCount) return 'vata';
    if (pittaCount >= vataCount && pittaCount >= kaphaCount) return 'pitta';
    return 'kapha';
  })();

  const doshaProfiles = {
    vata: {
      name: 'Vata Dosha (वाता)',
      elements: 'Air (Vayu) & Ether (Akasha)',
      qualities: 'Light, Cold, Dry, Mobile, Subtle',
      coreTheme: 'The Kinetic Master of the Nervous System & Prana',
      doctorPrescription:
        'Your body requires grounding, warmth, regular circadian rhythm, and unhurried stability. Avoid erratic fasting or extreme high-intensity workouts when depleted.',
      recommendedAsanas: [
        { name: 'Supported Child’s Pose (Balasana)', id: 'balasana' },
        { name: 'Tree Pose (Vrksasana)', id: 'tree' },
        { name: 'Supported Reclined Butterfly', id: 'viparita-karani' }
      ],
      recommendedPranayama: 'Nadi Shodhana (Alternate Nostril) & Chandra Bhedana',
      herbs: 'Ashwagandha, Warm Organic Sesame Oil (Abhyanga), Golden Moon Milk with Nutmeg'
    },
    pitta: {
      name: 'Pitta Dosha (पित्त)',
      elements: 'Fire (Tejas) & Water (Apas)',
      qualities: 'Hot, Sharp, Light, Oily, Spreading',
      coreTheme: 'The Transformative Master of Digestion & Mental Clarity',
      doctorPrescription:
        'Your body requires cooling, emotional softening, boundary surrender, and releasing perfectionism. Avoid exercising in direct midday heat or skipping meals.',
      recommendedAsanas: [
        { name: 'Camel Pose (Ustrasana)', id: 'camel' },
        { name: 'Cobra Pose (Bhujangasana)', id: 'cobra' },
        { name: 'Warrior II (Virabhadrasana II)', id: 'warrior-ii' }
      ],
      recommendedPranayama: 'Sheetali (Cooling Tongue Breath) & Chandra Bhedana',
      herbs: 'Shatavari, Brahmi, Organic Coconut Oil, Rose Water Mist'
    },
    kapha: {
      name: 'Kapha Dosha (कफ)',
      elements: 'Earth (Prithvi) & Water (Jala)',
      qualities: 'Heavy, Slow, Cool, Oily, Smooth, Stable',
      coreTheme: 'The Structural Master of Immunity & Cellular Lubrication',
      doctorPrescription:
        'Your body requires invigorating movement, warmth, dryness, and stimulating lightness. Avoid daytime naps and rich dairy/sugar that stagnates lymph fluid.',
      recommendedAsanas: [
        { name: 'Downward-Facing Dog', id: 'downward-dog' },
        { name: 'Warrior II (Virabhadrasana II)', id: 'warrior-ii' },
        { name: 'Cobra Pose (Bhujangasana)', id: 'cobra' }
      ],
      recommendedPranayama: 'Kapalabhati (Skull Shining) & Bhastrika (Bellows Breath)',
      herbs: 'Triphala, Fresh Ginger, Raw Wild Honey, Warm Spices (Cinnamon & Clove)'
    }
  };

  const profile = doshaProfiles[dominantDosha];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10 animate-fadeIn">
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
          Ayurvedic Constitutional Diagnostic (Charaka Samhita)
        </span>
      </div>

      {/* Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#12161A] text-[#F9F6F0] border border-[#2A333C] relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E07A5F]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="flex items-center gap-2 text-xs text-[#E0AFA0] uppercase tracking-wider font-medium">
            <Flame className="w-3.5 h-3.5" />
            <span>Prakriti Sadhana · Dr. Syed Karishma Clinical Diagnostic</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-light leading-tight">
            Discover Your Sacred Ayurvedic Constitution
          </h1>

          <p className="text-xs sm:text-sm text-[#8A9BA8] leading-relaxed">
            In Ayurvedic medicine, health is not one-size-fits-all. When you know your dominant Dosha (Vata, Pitta, or Kapha), your yoga asanas, breathwork, and nighttime rituals become targeted medicine for your unique nervous system.
          </p>
        </div>
      </div>

      {/* Main Interactive Questionnaire or Results View */}
      {!isCompleted ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] shadow-xs space-y-6">
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#7A7268]">
              <span className="font-medium uppercase tracking-wider text-[#9E6E38]">
                Diagnostic Question {activeStep + 1} of {totalQuestions}
              </span>
              <span>{Math.round(((activeStep + 1) / totalQuestions) * 100)}% Complete</span>
            </div>

            <div className="w-full bg-[#EFE8DC] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#B88554] h-full transition-all duration-300 rounded-full"
                style={{ width: `${((activeStep + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Prompt */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#9E6E38]">
              {currentQ.category}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#26221E] font-medium">
              {currentQ.title}
            </h3>
            <p className="text-xs text-[#5E5852] leading-relaxed">
              {currentQ.subtitle}
            </p>
          </div>

          {/* 3 Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((opt, i) => {
              const isSelected = answers[currentQ.id] === opt.dosha;
              return (
                <button
                  key={i}
                  onClick={() => handleSelectOption(currentQ.id, opt.dosha)}
                  className={`w-full p-5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-4 ${
                    isSelected
                      ? 'bg-[#FAF7F2] border-[#B88554] shadow-xs ring-1 ring-[#B88554]/25'
                      : 'bg-[#FFFFFF] border-[#E8E1D5] hover:border-[#C4B39C] hover:bg-[#FAF7F2]/50'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'border-[#B88554] bg-[#B88554] text-white'
                        : 'border-[#C4B39C] bg-transparent'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-serif text-base font-medium text-[#26221E]">
                      {opt.label}
                    </h4>
                    <p className="text-xs text-[#7A7268] leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#EFE8DC]">
            <button
              onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
              disabled={activeStep === 0}
              className={`px-4 py-2 rounded-xl text-xs font-medium cursor-pointer ${
                activeStep === 0
                  ? 'text-[#C4B39C] cursor-not-allowed'
                  : 'text-[#5E5852] hover:text-[#26221E]'
              }`}
            >
              Previous Question
            </button>

            <span className="text-xs text-[#7A7268]">
              Select an option to proceed
            </span>
          </div>
        </div>
      ) : (
        /* Completed Results Altar */
        <div className="space-y-6 animate-fadeIn">
          {/* Main Result Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] shadow-xs space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8DC] pb-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#9E6E38]">
                  Clinical Constitution Analysis
                </span>
                <h2 className="font-serif text-2xl sm:text-4xl text-[#26221E] font-medium mt-1">
                  Primary Constitution: {profile.name}
                </h2>
                <p className="text-xs text-[#6C7A4D] font-medium mt-0.5">
                  Governing Elements: {profile.elements} · {profile.qualities}
                </p>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#D5C9B6] text-xs font-medium text-[#5E5852] hover:text-[#26221E] hover:bg-[#FAF7F2] transition-colors cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#9E6E38]" />
                <span>Retake Diagnostic</span>
              </button>
            </div>

            {/* Dosha Balance Meter */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7A7268]">
                Constitutional Ratio Breakdown
              </span>
              <div className="w-full h-4 rounded-full bg-[#EFE8DC] overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${vataPct}%` }}
                  className="bg-sky-500 transition-all duration-700"
                  title={`Vata: ${vataPct}%`}
                />
                <div
                  style={{ width: `${pittaPct}%` }}
                  className="bg-amber-500 transition-all duration-700"
                  title={`Pitta: ${pittaPct}%`}
                />
                <div
                  style={{ width: `${kaphaPct}%` }}
                  className="bg-emerald-600 transition-all duration-700"
                  title={`Kapha: ${kaphaPct}%`}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-mono pt-1">
                <div className="flex items-center gap-1.5 text-sky-700">
                  <Wind className="w-3.5 h-3.5" />
                  <span>Vata {vataPct}%</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-700">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Pitta {pittaPct}%</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Kapha {kaphaPct}%</span>
                </div>
              </div>
            </div>

            {/* Doctor Syed Karishma's Clinical Prescription */}
            <div className="p-6 rounded-2xl bg-[#F9F6F0] border border-[#E8E1D5] space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9E6E38]">
                Dr. Syed Karishma’s Clinical Prescription
              </span>
              <p className="text-sm text-[#26221E] leading-relaxed">
                {profile.doctorPrescription}
              </p>
              <div className="pt-2 text-xs text-[#7A7268] border-t border-[#EFE8DC]">
                <strong>Key Herbal & Mineral Allies:</strong> {profile.herbs}
              </div>
            </div>

            {/* Targeted Asanas Tailored to This Dosha */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7A7268] flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-[#B88554]" />
                <span>Prescribed Asanas for Your Constitution</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {profile.recommendedAsanas.map((as, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (onOpenTab) {
                        onOpenTab({
                          id: 'pose-' + as.id,
                          type: 'pose',
                          title: as.name,
                          subtitle: profile.name,
                          canClose: true
                        });
                        soundSanctuary.playZenTingsha();
                      }
                    }}
                    className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E0D5C1] hover:border-[#B88554] text-left transition-all cursor-pointer shadow-2xs hover:shadow-xs group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-mono text-[#9E6E38] block">
                        Prescription 0{i + 1}
                      </span>
                      <h4 className="font-serif text-sm font-medium text-[#26221E] group-hover:text-[#B88554] mt-1">
                        {as.name}
                      </h4>
                    </div>

                    <div className="pt-3 border-t border-[#EFE8DC] mt-3 flex items-center justify-between text-[11px] text-[#B88554]">
                      <span>Open 3D Pose Tab</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recommended Pranayama */}
            <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E0D5C1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#6C7A4D] block">
                  Prescribed Pranayama Breathwork
                </span>
                <span className="font-serif text-base font-medium text-[#26221E]">
                  {profile.recommendedPranayama}
                </span>
              </div>

              {onOpenTab && (
                <button
                  onClick={() => {
                    onOpenTab({
                      id: 'tab-sleep',
                      type: 'sleep',
                      title: 'Chandra Lunar Pranayama',
                      canClose: true
                    });
                    soundSanctuary.playZenTingsha();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#12161A] text-white hover:bg-[#202830] transition-colors cursor-pointer shrink-0"
                >
                  Practice Lunar Breath
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
