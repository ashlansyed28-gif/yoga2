/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Bell,
  Sparkles,
  X,
  Wind,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { soundSanctuary } from '../utils/soundSanctuary.ts';

export const SoundAmbienceHearth: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundSanctuary.getMutedState());
  const [activeDrone, setActiveDrone] = useState<'none' | 'om' | 'tanpura' | 'water'>('none');
  const [breathActive, setBreathActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [breathSec, setBreathSec] = useState<number>(0);

  // 5.5s Coherence breathing loop (5.5s inhale, 5.5s exhale = 0.1Hz heart rate variability frequency)
  useEffect(() => {
    if (!breathActive) return;

    let animId: number;
    let startTime = performance.now();
    const cycleMs = 11000; // 11 seconds total

    const loop = (timestamp: number) => {
      const elapsed = (timestamp - startTime) % cycleMs;
      const progress = elapsed / cycleMs;
      if (progress < 0.5) {
        setBreathPhase('inhale');
        setBreathSec(Math.round((progress / 0.5) * 5.5 * 10) / 10);
      } else {
        setBreathPhase('exhale');
        setBreathSec(Math.round(((progress - 0.5) / 0.5) * 5.5 * 10) / 10);
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [breathActive]);

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = soundSanctuary.toggleMute();
    setIsMuted(newMuted);
    if (!newMuted) {
      soundSanctuary.playZenTingsha();
    }
  };

  const handlePlayStrike = (type: 'bowl' | 'tingsha' | 'bell' | 'om-sigh') => {
    if (isMuted) {
      soundSanctuary.toggleMute();
      setIsMuted(false);
    }
    if (type === 'bowl') soundSanctuary.playSingingBowl(216);
    if (type === 'tingsha') soundSanctuary.playZenTingsha();
    if (type === 'bell') soundSanctuary.playMeditationBell(432);
    if (type === 'om-sigh') soundSanctuary.playEmergencySighTone();
  };

  const handleToggleDrone = (drone: 'om' | 'tanpura' | 'water') => {
    if (isMuted) {
      soundSanctuary.toggleMute();
      setIsMuted(false);
    }
    if (activeDrone === drone) {
      soundSanctuary.stopAmbientPrana();
      setActiveDrone('none');
    } else {
      if (drone === 'om') {
        soundSanctuary.startOmMusic(136.1, 10);
      } else if (drone === 'tanpura') {
        soundSanctuary.startNatureSoundscape('tanpura');
      } else {
        soundSanctuary.startNatureSoundscape('stream');
      }
      setActiveDrone(drone);
    }
  };

  const stopAllSound = () => {
    soundSanctuary.stopAmbientPrana();
    setActiveDrone('none');
    soundSanctuary.playZenTingsha();
  };

  return (
    <aside aria-label="Sound Hearth" className="fixed bottom-6 left-6 z-40 select-none">
      {!isExpanded ? (
        /* Collapsed Floating Pill */
        <button
          onClick={() => {
            setIsExpanded(true);
            soundSanctuary.playZenTingsha();
          }}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#12161A]/90 hover:bg-[#161C22] text-[#F9F6F0] backdrop-blur-md border border-[#2D3944] shadow-xl hover:shadow-2xl transition-all cursor-pointer ring-1 ring-white/10"
          title="Open Sacred Ambience & Sound Hearth"
        >
          {/* Glowing Animated Prana Indicator */}
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                activeDrone !== 'none' || breathActive
                  ? 'bg-emerald-400'
                  : 'bg-[#E0AFA0]'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                activeDrone !== 'none' || breathActive
                  ? 'bg-emerald-500'
                  : 'bg-[#E0AFA0]'
              }`}
            />
          </span>

          <Music className="w-3.5 h-3.5 text-[#E0AFA0]" />

          <span className="text-xs font-medium tracking-wide">
            {activeDrone !== 'none'
              ? `Soundscape: ${activeDrone.toUpperCase()}`
              : 'Sound & Breath Hearth'}
          </span>

          {/* Quick Mute Toggle Button */}
          <button
            onClick={handleToggleMute}
            className="p-1 rounded-full hover:bg-white/10 text-[#A0ACB8] hover:text-white transition-colors cursor-pointer ml-0.5"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </button>
      ) : (
        /* Expanded Floating Sound Altar */
        <div className="w-80 sm:w-96 rounded-3xl bg-[#12161A]/95 backdrop-blur-xl border border-[#2D3944] text-[#F9F6F0] shadow-2xl overflow-hidden p-5 space-y-4 animate-scaleUp">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#222B33] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E0AFA0]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#E0AFA0]">
                Sacred Sound & Breath Hearth
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleToggleMute}
                className="p-1.5 rounded-lg hover:bg-white/10 text-[#A0ACB8] hover:text-white transition-colors cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                )}
              </button>

              <button
                onClick={() => setIsExpanded(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-[#A0ACB8] hover:text-white transition-colors cursor-pointer"
                title="Minimize hearth"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 1-Click Tibetan Bells & Instruments */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-semibold text-[#8C9AA8] tracking-wider block">
              1-Click Sacred Resonance Strike
            </span>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handlePlayStrike('bowl')}
                className="p-2.5 rounded-xl bg-[#182129] hover:bg-[#202B36] border border-[#2B3946] text-center cursor-pointer transition-colors group flex flex-col items-center gap-1"
                title="Tibetan Singing Bowl (216 Hz)"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E0AFA0] group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-medium text-[#CAD4DF]">216Hz Bowl</span>
              </button>

              <button
                onClick={() => handlePlayStrike('tingsha')}
                className="p-2.5 rounded-xl bg-[#182129] hover:bg-[#202B36] border border-[#2B3946] text-center cursor-pointer transition-colors group flex flex-col items-center gap-1"
                title="Zen Tingsha Chime"
              >
                <Bell className="w-3.5 h-3.5 text-[#D4A373] group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-medium text-[#CAD4DF]">Tingsha</span>
              </button>

              <button
                onClick={() => handlePlayStrike('bell')}
                className="p-2.5 rounded-xl bg-[#182129] hover:bg-[#202B36] border border-[#2B3946] text-center cursor-pointer transition-colors group flex flex-col items-center gap-1"
                title="Sacred Meditation Bell (432 Hz)"
              >
                <Music className="w-3.5 h-3.5 text-sky-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-medium text-[#CAD4DF]">432Hz Bell</span>
              </button>

              <button
                onClick={() => handlePlayStrike('om-sigh')}
                className="p-2.5 rounded-xl bg-[#182129] hover:bg-[#202B36] border border-[#2B3946] text-center cursor-pointer transition-colors group flex flex-col items-center gap-1"
                title="Emergency Vagus Sigh (136.1 Hz)"
              >
                <Wind className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-medium text-[#CAD4DF]">Earth Sigh</span>
              </button>
            </div>
          </div>

          {/* Continuous Atmospheric Drones */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-semibold text-[#8C9AA8] tracking-wider block">
              Continuous Ambient Soundscapes
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleToggleDrone('om')}
                className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                  activeDrone === 'om'
                    ? 'bg-[#E0AFA0] text-[#12161A] font-semibold border-[#E0AFA0] shadow-sm'
                    : 'bg-[#182129] hover:bg-[#202B36] border-[#2B3946] text-[#CAD4DF]'
                }`}
              >
                <span className="text-xs block">136.1Hz OM</span>
                <span className="text-[9px] opacity-75">Earth Drone</span>
              </button>

              <button
                onClick={() => handleToggleDrone('tanpura')}
                className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                  activeDrone === 'tanpura'
                    ? 'bg-[#E0AFA0] text-[#12161A] font-semibold border-[#E0AFA0] shadow-sm'
                    : 'bg-[#182129] hover:bg-[#202B36] border-[#2B3946] text-[#CAD4DF]'
                }`}
              >
                <span className="text-xs block">Tanpura</span>
                <span className="text-[9px] opacity-75">Vedic String</span>
              </button>

              <button
                onClick={() => handleToggleDrone('water')}
                className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                  activeDrone === 'water'
                    ? 'bg-[#E0AFA0] text-[#12161A] font-semibold border-[#E0AFA0] shadow-sm'
                    : 'bg-[#182129] hover:bg-[#202B36] border-[#2B3946] text-[#CAD4DF]'
                }`}
              >
                <span className="text-xs block">Temple River</span>
                <span className="text-[9px] opacity-75">Water Prana</span>
              </button>
            </div>

            {activeDrone !== 'none' && (
              <button
                onClick={stopAllSound}
                className="w-full py-1.5 rounded-lg bg-[#222C36] hover:bg-[#2B3743] text-[11px] text-[#A0ACB8] hover:text-white cursor-pointer transition-colors"
              >
                Silence Active Soundscape
              </button>
            )}
          </div>

          {/* Heart-Brain Coherence Breath Pacer Toggle */}
          <div className="pt-2 border-t border-[#222B33] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-[#E0AFA0]" />
                <span className="text-xs font-medium text-white">
                  0.1Hz Coherence Breath Pacer
                </span>
              </div>

              <button
                onClick={() => setBreathActive(!breathActive)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors cursor-pointer ${
                  breathActive
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[#202B36] text-[#A0ACB8] hover:text-white'
                }`}
              >
                {breathActive ? 'Active' : 'Enable'}
              </button>
            </div>

            {/* Live Breath Visualization Ring */}
            {breathActive && (
              <div className="p-3 rounded-2xl bg-[#161E26] border border-[#273543] flex items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full transition-all duration-700 flex items-center justify-center ${
                      breathPhase === 'inhale'
                        ? 'bg-gradient-to-tr from-sky-400 to-[#E0AFA0] scale-125 shadow-lg'
                        : 'bg-[#2A3746] scale-90'
                    }`}
                  >
                    <span className="text-[9px] font-mono text-white font-bold">
                      {breathSec}s
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-white block capitalize">
                      {breathPhase === 'inhale' ? 'Inhale Expand...' : 'Exhale Surrender...'}
                    </span>
                    <span className="text-[10px] text-[#8C9AA8]">
                      5.5s Heart-Rate Coherence
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-[#D4A373] bg-[#1E2732] px-2 py-0.5 rounded-full border border-[#2F3E4E]">
                  0.1 Hz
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
};
