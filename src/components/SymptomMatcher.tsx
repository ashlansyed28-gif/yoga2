/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Heart, Activity, Brain, Flame, Feather, Compass, Volume2, ArrowRight, Check, Box, ExternalLink, ArrowLeft } from 'lucide-react';
import { SymptomZone, TargetedAsana } from '../types.ts';
import { soundSanctuary } from '../utils/soundSanctuary.ts';

interface SymptomMatcherProps {
  onSelectForConsultation?: (zone: SymptomZone) => void;
  onNavigateToBooking: () => void;
  onOpenPoseTab?: (asanaName: string) => void;
  onBackToHome?: () => void;
}

const SYMPTOM_ZONES: SymptomZone[] = [
  {
    id: 'heart-anxiety',
    name: 'Heart & Chest (Anahata)',
    sanskritName: 'अनाहत चक्र',
    element: 'Air & Ether',
    color: '#E0AFA0',
    description: 'Anxiety, tightness in the upper thoracic cavity, emotional grief, or feeling constricted by rushing.',
    symptoms: [
      'Shallow chest breathing',
      'Sudden anxiety or elevated heart rate',
      'Emotional heaviness or unspoken grief',
      'Tightness across collarbones'
    ],
    recommendedAsanas: [
      {
        name: 'Supported Heart Opening with Bolster',
        sanskrit: 'Salamba Matsyasana',
        duration: '5 minutes',
        breathFocus: 'Inhale expansively into the sternum; exhale allowing shoulders to drape down.',
        therapeuticCue: 'Place a folded blanket or bolster horizontally across mid-back. Let the arms open in a cactus shape.'
      },
      {
        name: 'Reclined Bound Angle with Palm over Heart',
        sanskrit: 'Supta Baddha Konasana',
        duration: '6 minutes',
        breathFocus: 'Feel the rhythm of your own heartbeat beneath your palm without trying to alter it.',
        therapeuticCue: 'Support each knee with blocks so the groin feels zero strain. Release the jaw.'
      },
      {
        name: 'Humming Bee Breath for Vagus Nerve',
        sanskrit: 'Bhramari Pranayama',
        duration: '4 minutes (8 cycles)',
        breathFocus: 'Smooth inhalation; produce a steady, gentle humming vibration on the entire exhalation.',
        therapeuticCue: 'Rest fingertips lightly on collarbones to feel the soothing mechanical vibration.'
      }
    ],
    herbalRemedy: 'Warm organic rose water, saffron thread, and crushed green cardamom in warm water or oat milk.',
    pranayamaTip: 'Bhramari humming stimulates nitric oxide release and immediately signals safety to the heart.'
  },
  {
    id: 'lower-back-tension',
    name: 'Lower Back & Sacrum (Svadhisthana)',
    sanskritName: 'स्वाधिष्ठान चक्र',
    element: 'Water & Earth',
    color: '#D4A373',
    description: 'Aching lower spine from prolonged desk work, rigid pelvis, sacral compression, or chronic physical stiffness.',
    symptoms: [
      'Dull ache in lumbar spine after sitting',
      'Tight hip flexors and groin clenching',
      'Difficulty transitioning from sitting to standing',
      'Resistance in lateral torso twists'
    ],
    recommendedAsanas: [
      {
        name: 'Slow Cat-Cow Wave with Pelvic Lead',
        sanskrit: 'Marjaryasana-Bitilasana',
        duration: '4 minutes',
        breathFocus: 'Initiate arching from the tailbone on inhale; round from the pelvis on exhale.',
        therapeuticCue: 'Do not rush the movement. Imagine each lumbar vertebra articulating separately like pearls.'
      },
      {
        name: 'Supported Reclined Gentle Spinal Twist',
        sanskrit: 'Supta Matsyendrasana',
        duration: '4 minutes each side',
        breathFocus: 'Direct warm breath into the flank and outer hip.',
        therapeuticCue: 'Place a cushion beneath your top knee so your opposite shoulder stays grounded effortlessly.'
      },
      {
        name: 'Wide-Knee Supported Child’s Pose',
        sanskrit: 'Utthita Balasana',
        duration: '5 minutes',
        breathFocus: 'Breathe into the rear kidneys and lumbar expansion.',
        therapeuticCue: 'Sink your hips fully back toward your heels. Rest forehead on a cushion.'
      }
    ],
    herbalRemedy: 'Warm sesame oil gentle sacral anointment followed by ginger-turmeric warming tea.',
    pranayamaTip: 'Dirgha Pranayama: Expand the lower pelvic bowl on inhalation to create decompression space.'
  },
  {
    id: 'mind-overwhelm',
    name: 'Mind & Temples (Ajna)',
    sanskritName: 'आज्ञा चक्र',
    element: 'Light & Ether',
    color: '#A3B18A',
    description: 'Mental overload, racing thoughts, late-night insomnia, screen fatigue, or brain fog.',
    symptoms: [
      'Racing thoughts before sleep',
      'Eyestrain and forehead tension',
      'Sensory exhaustion from notifications',
      'Scattered attention span'
    ],
    recommendedAsanas: [
      {
        name: 'Child’s Pose with Forehead Grounding',
        sanskrit: 'Balasana with Earth Contact',
        duration: '5 minutes',
        breathFocus: 'Slow nasal breath; feel the forehead resting heavy against the mat or wood floor.',
        therapeuticCue: 'The contact of the third eye (brow center) with the earth stimulates calming parasympathetic tone.'
      },
      {
        name: 'Legs-Up-The-Wall Inversion',
        sanskrit: 'Viparita Karani',
        duration: '7 minutes',
        breathFocus: 'Effortless breathing; let the breath breathe itself.',
        therapeuticCue: 'Elevate your pelvis on a folded linen blanket. Cover your eyes with a soft dark cloth.'
      },
      {
        name: 'Alternate Nostril Equal Flow',
        sanskrit: 'Nadi Shodhana',
        duration: '6 minutes',
        breathFocus: '4 counts in left nostril, 4 counts out right; 4 counts in right, 4 counts out left.',
        therapeuticCue: 'Keep the touch on the nose as light as a butterfly wing. Zero strain.'
      }
    ],
    herbalRemedy: 'Warm infusion of organic Brahmi (Bacopa monnieri), Gotu Kola, and raw honey at twilight.',
    pranayamaTip: 'Nadi Shodhana brings balance between solar (Pingala) and lunar (Ida) mental currents.'
  },
  {
    id: 'gut-digestion',
    name: 'Gut & Solar Plexus (Manipura)',
    sanskritName: 'मणिपूर चक्र',
    element: 'Fire (Agni)',
    color: '#D4A373',
    description: 'Sluggish digestion, abdominal bloating, nervous stomach knots, or difficulty metabolizing experiences.',
    symptoms: [
      'Tight belly or holding stomach in',
      'Sluggish assimilation or irregular digestion',
      'Nervous knot before difficult conversations',
      'Midday energy dip'
    ],
    recommendedAsanas: [
      {
        name: 'Wind-Relieving Knee-to-Chest',
        sanskrit: 'Pawanmuktasana',
        duration: '4 minutes',
        breathFocus: 'Exhale as thigh compresses into belly; inhale releasing slightly.',
        therapeuticCue: 'Gently hug right knee first (ascending colon), then left knee (descending colon).'
      },
      {
        name: 'Gentle Seated Half Twist',
        sanskrit: 'Ardha Matsyendrasana',
        duration: '3 minutes each side',
        breathFocus: 'Lengthen spine tall on inhale; twist from the thoracic center on exhale.',
        therapeuticCue: 'Never force the twist with arms; let the abdominal core guide the gentle turn.'
      },
      {
        name: 'Sphinx Pose Abdominal Extension',
        sanskrit: 'Salamba Bhujangasana',
        duration: '3 minutes',
        breathFocus: 'Breathe directly into the stomach wall resting against the mat.',
        therapeuticCue: 'Elbows under shoulders, pull the chest gently forward like a quiet sphinx.'
      }
    ],
    herbalRemedy: 'Cumin, Coriander, Fennel (CCF) tea simmered for 5 minutes and sipped lukewarm.',
    pranayamaTip: 'Sheetali (Cooling Breath) if acidity is present, or gentle belly breathing to restore gut-brain axis.'
  },
  {
    id: 'neck-shoulders',
    name: 'Neck & Trapezius (Vishuddha)',
    sanskritName: 'विशुद्ध चक्र',
    element: 'Space (Akasha)',
    color: '#B5C49B',
    description: 'Carrying burdens, shoulders crept up to the ears, inability to speak truth, or tension headaches.',
    symptoms: [
      'Hard knots in upper trapezius',
      'Clenched teeth / jaw stiffness (TMJ)',
      'Hesitation in speaking boundaries',
      'Forward head posture from devices'
    ],
    recommendedAsanas: [
      {
        name: 'Seated Eagle Arms Wrap & Lift',
        sanskrit: 'Garudasana Arms',
        duration: '3 minutes each arm cross',
        breathFocus: 'Breathe into the space between the shoulder blades (rhomboids).',
        therapeuticCue: 'Gently lift elbows to shoulder height and move forearms away from face. Soften facial muscles.'
      },
      {
        name: 'Supported Neck Traction with Rolled Linen',
        sanskrit: 'Griva Shanti Rest',
        duration: '5 minutes',
        breathFocus: 'Smooth effortless rhythm; feel the back of neck elongating.',
        therapeuticCue: 'Roll a linen hand towel tightly and place it beneath the cervical curve while lying down.'
      },
      {
        name: 'Gentle Cow Face Arms with Strap',
        sanskrit: 'Gomukhasana Arms',
        duration: '3 minutes each side',
        breathFocus: 'Inhale into the armpits; exhale releasing tension from upper chest.',
        therapeuticCue: 'Hold a linen belt or strap between hands if fingertips do not touch naturally.'
      }
    ],
    herbalRemedy: 'Warm sesame oil application to cervical vertebrae with warm damp compress.',
    pranayamaTip: 'Ujjayi (Ocean breath) creates soft throat warmth and relaxes constriction in Vishuddha.'
  }
];

export const SymptomMatcher: React.FC<SymptomMatcherProps> = ({
  onSelectForConsultation,
  onNavigateToBooking,
  onOpenPoseTab,
  onBackToHome
}) => {
  const [selectedZone, setSelectedZone] = useState<SymptomZone>(SYMPTOM_ZONES[0]);
  const [activeAsanaIndex, setActiveAsanaIndex] = useState<number>(0);
  const [isCopiedToBooking, setIsCopiedToBooking] = useState<boolean>(false);

  const handleSelectZone = (zone: SymptomZone) => {
    setSelectedZone(zone);
    setActiveAsanaIndex(0);
    soundSanctuary.playSingingBowl(324);
  };

  const handleAttachToBooking = () => {
    if (onSelectForConsultation) {
      onSelectForConsultation(selectedZone);
    }
    soundSanctuary.playSingingBowl(216);
    setIsCopiedToBooking(true);
    setTimeout(() => {
      onNavigateToBooking();
    }, 600);
  };

  const currentAsana = selectedZone.recommendedAsanas[activeAsanaIndex];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-10 animate-fadeIn">
      {/* Back Button Bar */}
      {onBackToHome && (
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs font-medium text-[#5E5852] hover:text-[#26221E] bg-[#FFFFFF] border border-[#E8E1D5] px-4 py-2 rounded-full transition-all cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#9E6E38]" />
            <span>Return to Sanctuary Home</span>
          </button>
          <span className="text-xs text-[#7A7268] hidden sm:inline">
            Somatic Energy & Symptom Matcher
          </span>
        </div>
      )}

      {/* Intro Header */}
      <div className="max-w-2xl space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#7A7268]">
          <span>Energetic Mapping</span>
          <span>·</span>
          <span>Somatic Symptom Matcher</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#26221E] font-normal">
          Where is your prana asking for attention?
        </h1>
        <p className="text-sm text-[#5E5852] leading-relaxed">
          The body holds what the mind struggles to process. Tap a body zone or energetic center below to reveal Dr. Syed Karishma’s targeted therapeutic sequence.
        </p>
      </div>

      {/* Elemental & Body Zone Selector Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {SYMPTOM_ZONES.map((zone) => {
          const isSelected = selectedZone.id === zone.id;
          return (
            <button
              key={zone.id}
              onClick={() => handleSelectZone(zone)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-36 ${
                isSelected
                  ? 'bg-[#FFFFFF] border-[#B88554] shadow-sm'
                  : 'bg-[#F4EFE6] border-[#E8E1D5] hover:border-[#D0C2B0]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#9E6E38]">
                  {zone.element}
                </span>
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: zone.color }}
                />
              </div>

              <div>
                <h3 className="font-serif text-sm sm:text-base text-[#26221E] font-medium leading-snug">
                  {zone.name.split(' (')[0]}
                </h3>
                <span className="text-[11px] text-[#7A7268] block mt-0.5">
                  {zone.sanskritName}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Therapeutic Flow & Clinical Guidance for Selected Zone */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Asana Sequence (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-7 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-6">
            <div className="flex items-center justify-between border-b border-[#EFEBE3] pb-4">
              <div>
                <span className="text-xs text-[#9E6E38] font-medium uppercase tracking-wider">
                  Targeted Sequence · {selectedZone.name}
                </span>
                <h2 className="font-serif text-2xl text-[#26221E] font-medium mt-1">
                  {currentAsana.name}
                </h2>
                <p className="font-serif text-sm text-[#7A7268] italic">
                  {currentAsana.sanskrit} · {currentAsana.duration}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {onOpenPoseTab && (
                  <button
                    onClick={() => {
                      onOpenPoseTab(currentAsana.sanskrit || currentAsana.name);
                      soundSanctuary.playZenTingsha();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-[#F0EBE1] border border-[#D5C9B6] text-xs font-semibold text-[#73532C] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    title="Open this pose in a dedicated 3D tab"
                  >
                    <Box className="w-3.5 h-3.5 text-[#B88554]" />
                    <span>Open 3D Tab</span>
                  </button>
                )}
                <button
                  onClick={() => soundSanctuary.playSingingBowl(288)}
                  title="Ring Tibetan Bowl for Asana"
                  className="w-10 h-10 rounded-full bg-[#F4EFE6] hover:bg-[#EBE3D4] flex items-center justify-center text-[#73532C] transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Asana step indicators */}
            <div className="flex items-center gap-2">
              {selectedZone.recommendedAsanas.map((asana, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveAsanaIndex(idx);
                    soundSanctuary.playZenTingsha();
                  }}
                  className={`flex-1 py-2 px-2 rounded-xl text-xs font-medium transition-colors cursor-pointer text-center truncate ${
                    activeAsanaIndex === idx
                      ? 'bg-[#26221E] text-[#F9F6F0]'
                      : 'bg-[#F4EFE6] text-[#5E5852] hover:bg-[#EAE1D3]'
                  }`}
                >
                  Step {idx + 1}: {asana.name.split(' with')[0].split(' for')[0]}
                </button>
              ))}
            </div>

            {/* Deep Instruction & Clinical Cue */}
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#F9F6F0] border border-[#EFE8DC] space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#9E6E38]">
                  Therapeutic Alignment Cue
                </span>
                <p className="text-sm text-[#26221E] leading-relaxed">
                  {currentAsana.therapeuticCue}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F9F6F0] border border-[#EFE8DC] space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6C7A4D]">
                  Breath & Prana Focus
                </span>
                <p className="text-sm text-[#26221E] leading-relaxed">
                  {currentAsana.breathFocus}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Ayurvedic Remedy, Prana Note & Booking Callout (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Ayurvedic & Herbal Ritual Card */}
          <div className="p-7 rounded-3xl bg-[#F4EFE6] border border-[#E8E1D5] space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-medium uppercase tracking-wider text-[#9E6E38]">
                Dr. Karishma’s Clinical Insights
              </span>
              <h3 className="font-serif text-lg text-[#26221E] font-medium">
                Ayurvedic & Herbal Balancing
              </h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-[#5E5852]">
                  Herbal Ritual:
                </span>
                <p className="text-xs sm:text-sm text-[#26221E] leading-relaxed">
                  {selectedZone.herbalRemedy}
                </p>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#E5DCce]">
                <span className="text-xs font-semibold text-[#5E5852]">
                  Pranayama Principle:
                </span>
                <p className="text-xs sm:text-sm text-[#26221E] leading-relaxed">
                  {selectedZone.pranayamaTip}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-semibold text-[#5E5852] block mb-2">
                Recognizable Manifestations:
              </span>
              <ul className="space-y-1.5">
                {selectedZone.symptoms.map((symp, i) => (
                  <li key={i} className="text-xs text-[#5E5852] flex items-start gap-2">
                    <span className="text-[#9E6E38] mt-0.5">•</span>
                    <span>{symp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action CTA: Carry this into pre-consultation check-in */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-3">
            <h4 className="font-serif text-base text-[#26221E] font-medium">
              Want 1-on-1 personalized guidance?
            </h4>
            <p className="text-xs text-[#5E5852] leading-relaxed">
              Dr. Syed Karishma can assess your root imbalances during a sacred clinical consultation.
            </p>
            <button
              onClick={handleAttachToBooking}
              className="w-full py-3 rounded-xl text-xs font-medium tracking-wide bg-[#12161A] text-[#F9F6F0] hover:bg-[#252C33] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isCopiedToBooking ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#CCD5AE]" />
                  <span>Attached to Pre-Consultation</span>
                </>
              ) : (
                <>
                  <span>Bring {selectedZone.name.split(' (')[0]} into Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E0AFA0]" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
