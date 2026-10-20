/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, Sparkles, Wind, Bell } from 'lucide-react';
import { soundSanctuary } from '../utils/soundSanctuary.ts';

interface SanctuaryModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BreathPattern = 'box' | 'restorative' | 'balance';

interface PatternConfig {
  name: string;
  sanskrit: string;
  inhale: number;
  hold: number;
  exhale: number;
  pause: number;
  guidance: string;
}

const PATTERNS: Record<BreathPattern, PatternConfig> = {
  box: {
    name: 'Sama Vritti (Equal Breath)',
    sanskrit: 'समवृत्ति प्राणायाम',
    inhale: 4,
    hold: 4,
    exhale: 4,
    pause: 4,
    guidance: 'Stabilizes the sympathetic nervous system and centers scattered prana.'
  },
  restorative: {
    name: 'Chandra Relax (4-7-8)',
    sanskrit: 'चन्द्र प्राणायाम',
    inhale: 4,
    hold: 7,
    exhale: 8,
    pause: 1,
    guidance: 'Activates the vagus nerve, ideal for releasing evening fatigue and anxiety.'
  },
  balance: {
    name: 'Gentle Ocean Breath',
    sanskrit: 'उज्जायी प्राणायाम',
    inhale: 5,
    hold: 2,
    exhale: 6,
    pause: 2,
    guidance: 'Soft rhythmic soothing flow that warms the heart space and eases thoracic tension.'
  }
};

export const SanctuaryModeModal: React.FC<SanctuaryModeModalProps> = ({ isOpen, onClose }) => {
  const [patternKey, setPatternKey] = useState<BreathPattern>('box');
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState<number>(PATTERNS.box.inhale);
  const [cycleCount, setCycleCount] = useState<number>(1);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(soundSanctuary.getMutedState());
  const [ambientActive, setAmbientActive] = useState<boolean>(true);

  const pattern = PATTERNS[patternKey];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isOpen) {
      soundSanctuary.stopAmbientPrana();
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Play entry bowl
    soundSanctuary.playSingingBowl(216);
    if (ambientActive && !isSoundMuted) {
      soundSanctuary.startAmbientPrana();
    }

    setPhase('inhale');
    setSecondsLeft(pattern.inhale);

    return () => {
      soundSanctuary.stopAmbientPrana();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Transition to next breath phase
        if (phase === 'inhale') {
          if (pattern.hold > 0) {
            setPhase('hold');
            return pattern.hold;
          } else {
            setPhase('exhale');
            soundSanctuary.playZenTingsha();
            return pattern.exhale;
          }
        } else if (phase === 'hold') {
          setPhase('exhale');
          soundSanctuary.playZenTingsha();
          return pattern.exhale;
        } else if (phase === 'exhale') {
          if (pattern.pause > 0) {
            setPhase('pause');
            return pattern.pause;
          } else {
            setPhase('inhale');
            setCycleCount((c) => c + 1);
            soundSanctuary.playSingingBowl(288);
            return pattern.inhale;
          }
        } else {
          // from pause -> inhale
          setPhase('inhale');
          setCycleCount((c) => c + 1);
          soundSanctuary.playSingingBowl(288);
          return pattern.inhale;
        }
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, phase, patternKey]);

  if (!isOpen) return null;

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return 'Inhale deeply into the low belly & heart space';
      case 'hold':
        return 'Rest suspended in gentle stillness';
      case 'exhale':
        return 'Release through the lips, softening the shoulders';
      case 'pause':
        return 'Dwelling in calm emptiness before the next dawn';
    }
  };

  const getScaleClass = () => {
    switch (phase) {
      case 'inhale':
        return 'scale-125 duration-4000';
      case 'hold':
        return 'scale-125 duration-1000';
      case 'exhale':
        return 'scale-90 duration-4000';
      case 'pause':
        return 'scale-90 duration-1000';
    }
  };

  const toggleSound = () => {
    const muted = soundSanctuary.toggleMute();
    setIsSoundMuted(muted);
    if (muted) {
      soundSanctuary.stopAmbientPrana();
      setAmbientActive(false);
    } else {
      soundSanctuary.startAmbientPrana();
      setAmbientActive(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#12161A] text-[#F9F6F0] flex flex-col justify-between p-6 sm:p-10 select-none overflow-y-auto">
      {/* Top Controls */}
      <div className="flex items-center justify-between max-w-4xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-[#E0AFA0]" />
          <span className="font-serif text-lg tracking-wide text-[#E0AFA0]">
            Twilight Sanctuary
          </span>
          <span className="text-xs text-[#8A9BA8] hidden sm:inline">· Cycle {cycleCount}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => soundSanctuary.playSingingBowl(216)}
            title="Ring Tibetan Bowl"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#8A9BA8] hover:text-[#F9F6F0] bg-[#1B2127] hover:bg-[#252E36] transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
          </button>

          <button
            onClick={toggleSound}
            title={isSoundMuted ? 'Unmute Ambient Drone' : 'Mute Sound'}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#8A9BA8] hover:text-[#F9F6F0] bg-[#1B2127] hover:bg-[#252E36] transition-colors cursor-pointer"
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs font-medium bg-[#1B2127] hover:bg-[#252E36] text-[#D8E1E8] border border-[#2A333C] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <X className="w-3.5 h-3.5" />
            <span>Return</span>
          </button>
        </div>
      </div>

      {/* Main Breathing Core */}
      <div className="flex-1 flex flex-col items-center justify-center my-8 max-w-2xl mx-auto w-full text-center">
        {/* Rhythmic Prana Visual Sphere */}
        <div className="relative flex items-center justify-center w-72 h-72 sm:w-88 sm:h-88 my-6">
          {/* Outer glowing aura */}
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-tr from-[#D4A373]/15 via-[#E0AFA0]/10 to-[#CCD5AE]/15 blur-2xl transition-all ease-in-out ${getScaleClass()}`}
          />

          {/* Secondary concentric ripple */}
          <div
            className={`absolute inset-6 rounded-full border border-[#D4A373]/30 transition-all ease-in-out ${getScaleClass()}`}
          />

          {/* Tertiary delicate mandala ring */}
          <div
            className={`absolute inset-14 rounded-full border border-[#E0AFA0]/25 transition-all ease-in-out ${getScaleClass()}`}
          />

          {/* Center serene stone core */}
          <div
            className={`relative z-10 w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-b from-[#1E252D] to-[#151B21] border border-[#343F4B] flex flex-col items-center justify-center shadow-2xl transition-all ease-in-out ${getScaleClass()}`}
          >
            <span className="font-serif text-4xl sm:text-5xl font-light text-[#F9F6F0] tracking-wider">
              {secondsLeft}s
            </span>
            <span className="text-xs uppercase tracking-widest text-[#E0AFA0] mt-1 font-medium">
              {phase}
            </span>
          </div>
        </div>

        {/* Phase textual guidance */}
        <div className="mt-4 space-y-2">
          <p className="font-serif text-xl sm:text-2xl text-[#F9F6F0] transition-opacity duration-500">
            {getPhaseInstruction()}
          </p>
          <p className="text-xs sm:text-sm text-[#8A9BA8] max-w-md mx-auto">
            {pattern.guidance}
          </p>
        </div>
      </div>

      {/* Bottom Pattern Selector */}
      <div className="max-w-xl w-full mx-auto">
        <div className="flex items-center justify-center gap-1.5 p-1.5 bg-[#181F26] border border-[#28323C] rounded-2xl">
          {(Object.keys(PATTERNS) as BreathPattern[]).map((key) => {
            const p = PATTERNS[key];
            const isActive = patternKey === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setPatternKey(key);
                  setPhase('inhale');
                  setSecondsLeft(PATTERNS[key].inhale);
                  soundSanctuary.playSingingBowl(324);
                }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#2B3540] text-[#F9F6F0] shadow-sm'
                    : 'text-[#8A9BA8] hover:text-[#D8E1E8]'
                }`}
              >
                <span>{p.name.split(' (')[0]}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-[#6C7B88] mt-3">
          <span className="flex items-center gap-1">
            <Wind className="w-3.5 h-3.5 text-[#CCD5AE]" />
            Natural Nasal Breathing
          </span>
          <span>·</span>
          <span>Chest Relaxed</span>
          <span>·</span>
          <span>Tongue Resting on Palate</span>
        </div>
      </div>
    </div>
  );
};
