/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Play, Pause, Bell, Sparkles, Volume2, Clock, RotateCcw, ArrowLeft, Share2, Activity, Music } from 'lucide-react';
import { soundSanctuary } from '../utils/soundSanctuary.ts';
import { BuddhaMeditationArtwork, HimalayanSunriseArtwork } from './ZenVisuals.tsx';
import { OmChantingMotionSanctuary } from './OmChantingMotionSanctuary.tsx';
import { streakSystem } from '../utils/streakSystem.ts';
import { ShareProgressModal } from './ShareProgressModal.tsx';

type SoundscapeType = 'om' | 'bowl' | 'tanpura' | 'rain' | 'stream' | 'silence';

interface MeditationTrack {
  id: string;
  title: string;
  sanskrit: string;
  theme: string;
  guidanceText: string;
}

const MEDITATIONS: MeditationTrack[] = [
  {
    id: 'om-dhyana',
    title: 'Om Chanting & Cosmic Grounding (136.1 Hz)',
    sanskrit: 'ॐकार ध्यान साधना',
    theme: 'Attuning to the primordial vibration of stillness',
    guidanceText: 'Breathe into the navel center. As the sacred OM vibration resonates, allow the sound to dissolve the boundary between yourself and the room. You are resting in pure consciousness.'
  },
  {
    id: 'antar-mouna',
    title: 'Antar Mouna (Inner Silence)',
    sanskrit: 'अन्तर्मौन धारणा',
    theme: 'Non-attachment to spontaneous thoughts',
    guidanceText: 'Sit quietly. Whatever thought crosses the screen of consciousness, do not push it away and do not invite it to stay. Watch it arise and fade like clouds across the vast blue sky.'
  },
  {
    id: 'chidakasha',
    title: 'Chidakasha (Space of Pure Consciousness)',
    sanskrit: 'चिदाकाश ध्यान',
    theme: 'Dwelling behind the eyebrow center',
    guidanceText: 'Close your physical eyes. Look gently into the dark velvety expanse directly in front of your forehead. In this sacred dark space, there is zero past and zero future. Pure resting presence.'
  },
  {
    id: 'metta',
    title: 'Metta Bhavana (Radiant Loving Kindness)',
    sanskrit: 'मैत्री भावना',
    theme: 'Cultivating universal benevolence',
    guidanceText: 'Touch your heart center. Whisper inwardly: May I be free from inner torment. May I be healthy and grounded. Now expand this golden warmth to your loved ones, to neutral beings, and to all living souls.'
  }
];

interface MeditationSanctuaryProps {
  onBackToHome?: () => void;
}

export const MeditationSanctuary: React.FC<MeditationSanctuaryProps> = ({ onBackToHome }) => {
  const [activeTab, setActiveTab] = useState<'om-motion' | 'altar'>('om-motion');
  const [selectedMeditation, setSelectedMeditation] = useState<MeditationTrack>(MEDITATIONS[0]);
  const [durationMinutes, setDurationMinutes] = useState<number>(10);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(10 * 60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [soundscape, setSoundscape] = useState<SoundscapeType>('om');
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Countdown for Altar mode
  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSecondsRemaining((sec) => {
        if (sec > 1) {
          // Halfway chime or interval chime every 5 mins
          if (sec % 300 === 0) {
            soundSanctuary.playZenTingsha();
          }
          return sec - 1;
        }

        // Completion
        setIsActive(false);
        soundSanctuary.stopAmbientPrana();
        soundSanctuary.playMeditationBell(432);
        streakSystem.recordPractice('meditation', selectedMeditation.title, durationMinutes);
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, durationMinutes, selectedMeditation]);

  const handleStart = () => {
    soundSanctuary.playMeditationBell(432);
    if (soundscape === 'om') {
      soundSanctuary.startOmMusic(136.1, 10);
    } else if (soundscape === 'tanpura') {
      soundSanctuary.startNatureSoundscape('tanpura');
    } else if (soundscape === 'rain') {
      soundSanctuary.startNatureSoundscape('rain');
    } else if (soundscape === 'stream') {
      soundSanctuary.startNatureSoundscape('stream');
    } else if (soundscape === 'bowl') {
      soundSanctuary.startAmbientPrana();
    }
    setIsActive(true);
  };

  const handlePause = () => {
    soundSanctuary.stopAmbientPrana();
    setIsActive(false);
  };

  const handleReset = (mins: number = durationMinutes) => {
    soundSanctuary.stopAmbientPrana();
    setIsActive(false);
    setDurationMinutes(mins);
    setSecondsRemaining(mins * 60);
  };

  const handleSelectSoundscape = (type: SoundscapeType) => {
    setSoundscape(type);
    if (isActive) {
      if (type === 'silence') {
        soundSanctuary.stopAmbientPrana();
      } else if (type === 'om') {
        soundSanctuary.startOmMusic(136.1, 10);
      } else if (type === 'tanpura' || type === 'rain' || type === 'stream') {
        soundSanctuary.startNatureSoundscape(type);
      } else {
        soundSanctuary.startAmbientPrana();
      }
    }
    soundSanctuary.playZenTingsha();
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Sanctuary Mode Navigation Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-[#F0EBE1] rounded-2xl border border-[#E2D8C7]">
          <button
            onClick={() => {
              setActiveTab('om-motion');
              soundSanctuary.playZenTingsha();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'om-motion'
                ? 'bg-[#FFFFFF] text-[#26221E] shadow-sm'
                : 'text-[#7A7268] hover:text-[#26221E]'
            }`}
          >
            <Music className="w-3.5 h-3.5 text-[#B88554]" />
            <span>136.1 Hz OM Motion Visualizer</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('altar');
              soundSanctuary.playZenTingsha();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'altar'
                ? 'bg-[#FFFFFF] text-[#26221E] shadow-sm'
                : 'text-[#7A7268] hover:text-[#26221E]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#6C7A4D]" />
            <span>Classic Dhyana Altar</span>
          </button>
        </div>

        <button
          onClick={() => setIsShareModalOpen(true)}
          className="flex items-center gap-1.5 text-xs font-medium text-[#73532C] bg-[#FFFFFF] hover:bg-[#F9F6F0] border border-[#E2D8C7] px-3.5 py-2 rounded-full transition-all cursor-pointer shadow-2xs"
        >
          <Share2 className="w-3.5 h-3.5 text-[#B88554]" />
          <span className="hidden sm:inline">Share Mindful Streak</span>
        </button>
      </div>

      {activeTab === 'om-motion' ? (
        <OmChantingMotionSanctuary
          onBackToHome={onBackToHome}
          onOpenShareModal={() => setIsShareModalOpen(true)}
        />
      ) : (
        <div className="max-w-4xl mx-auto px-6 py-6 space-y-10 animate-fadeIn">
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
              Dhyana · Inner Silence & Bells
            </span>
          </div>

          {/* Header */}
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs text-[#7A7268]">
              <span>Dhyana Sanctuary</span>
              <span>·</span>
              <span>Sacred Soundscapes & OM Music</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#26221E] font-normal">
              Classic Meditation Altar
            </h1>
            <p className="text-sm text-[#5E5852] leading-relaxed">
              Settle your posture. Close your eyes. Choose your time container and ambient resonance to enter deep, unhurried contemplation.
            </p>
          </div>

          {/* Main Meditation Altar Card */}
          <div className="p-8 sm:p-14 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] shadow-sm text-center space-y-8">
            {/* Selected Theme Header */}
            <div className="space-y-1 max-w-lg mx-auto">
              <span className="text-xs uppercase tracking-wider text-[#9E6E38] font-medium">
                {selectedMeditation.sanskrit}
              </span>
              <h2 className="font-serif text-2xl text-[#26221E] font-medium">
                {selectedMeditation.title}
              </h2>
              <p className="text-xs text-[#7A7268] italic font-serif">
                {selectedMeditation.theme}
              </p>
            </div>

            {/* Ambient Ring / Countdown Display with Sacred Buddha Artwork Backdrop */}
            <div className="relative flex items-center justify-center w-72 h-72 sm:w-96 sm:h-96 mx-auto my-4">
              <div
                className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-1000 ${
                  isActive ? 'opacity-40 sm:opacity-55 scale-105' : 'opacity-25 sm:opacity-35 scale-100'
                }`}
              >
                <BuddhaMeditationArtwork className="w-full h-full max-w-[340px] max-h-[340px]" />
              </div>

              {/* Radiating Halo Rings */}
              <div
                className={`absolute inset-2 sm:inset-4 rounded-full border border-[#D4A373]/30 transition-all duration-3000 ${
                  isActive ? 'scale-110 opacity-100' : 'scale-95 opacity-50'
                }`}
              />
              <div
                className={`absolute inset-8 sm:inset-12 rounded-full border border-[#E0AFA0]/30 transition-all duration-3000 ${
                  isActive ? 'scale-105 opacity-100' : 'scale-95 opacity-30'
                }`}
              />

              {/* Glassmorphic Time Capsule Badge */}
              <div className="relative z-10 flex flex-col items-center justify-center bg-[#FFFFFF]/75 backdrop-blur-xs px-8 py-6 rounded-full border border-[#E8E1D5]/80 shadow-xs">
                <span className="font-serif text-5xl sm:text-6xl font-light text-[#26221E] tabular-nums tracking-wider">
                  {formatTime(secondsRemaining)}
                </span>
                <span className="text-xs text-[#7A7268] uppercase tracking-widest mt-2 flex items-center gap-1.5">
                  {isActive ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-[#B88554] animate-ping" />
                      <span className="font-medium text-[#73532C]">
                        {soundscape === 'om' ? 'ॐ Cosmic OM Active (136.1Hz)' : 'Dhyana Stillness'}
                      </span>
                    </>
                  ) : (
                    'Poised in Grace'
                  )}
                </span>
              </div>
            </div>

            {/* Doctor's Guidance Passage */}
            <div className="max-w-xl mx-auto p-5 rounded-2xl bg-[#F9F6F0] border border-[#E8E1D5]">
              <p className="text-xs sm:text-sm text-[#5E5852] leading-relaxed italic font-serif">
                “{selectedMeditation.guidanceText}”
              </p>
            </div>

            {/* Timer Duration Preset Buttons */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {[5, 10, 15, 20, 30].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleReset(mins)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    durationMinutes === mins
                      ? 'bg-[#26221E] text-[#F9F6F0]'
                      : 'bg-[#F4EFE6] text-[#5E5852] hover:bg-[#EAE1D3]'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>

            {/* Main Play / Pause Controls */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => handleReset()}
                className="p-3 rounded-full border border-[#E8E1D5] hover:bg-[#F4EFE6] text-[#5E5852] transition-colors cursor-pointer"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {isActive ? (
                <button
                  onClick={handlePause}
                  className="px-8 py-3.5 rounded-full bg-[#12161A] text-[#F9F6F0] hover:bg-[#252C33] text-xs font-medium tracking-wide flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <Pause className="w-4 h-4 text-[#E0AFA0]" />
                  <span>Pause Stillness</span>
                </button>
              ) : (
                <button
                  onClick={handleStart}
                  className="px-8 py-3.5 rounded-full bg-[#12161A] text-[#F9F6F0] hover:bg-[#252C33] text-xs font-medium tracking-wide flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Play className="w-4 h-4 text-[#E0AFA0]" />
                  <span>Begin Meditation ({formatTime(secondsRemaining)})</span>
                </button>
              )}

              <button
                onClick={() => soundSanctuary.playMeditationBell(432)}
                className="p-3 rounded-full border border-[#E8E1D5] hover:bg-[#F4EFE6] text-[#5E5852] transition-colors cursor-pointer"
                title="Ring 432Hz Bell"
              >
                <Bell className="w-4 h-4 text-[#9E6E38]" />
              </button>
            </div>

            {/* Soundscape Selector */}
            <div className="pt-6 border-t border-[#EFE8DC] space-y-3">
              <div className="flex items-center justify-between max-w-md mx-auto">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7A7268] block">
                  Sacred Soundscapes & Frequencies
                </span>
                <span className="text-[11px] text-[#B88554] font-medium">
                  Native Web Audio Synthesis
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {[
                  { id: 'om', label: 'ॐ Sacred OM (136.1Hz)', featured: true },
                  { id: 'bowl', label: 'Tibetan Bowls', featured: false },
                  { id: 'tanpura', label: 'Vedic Tanpura', featured: false },
                  { id: 'rain', label: 'Temple Rain', featured: false },
                  { id: 'stream', label: 'Forest Stream', featured: false },
                  { id: 'silence', label: 'Noble Silence', featured: false }
                ].map((snd) => (
                  <button
                    key={snd.id}
                    onClick={() => handleSelectSoundscape(snd.id as SoundscapeType)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      soundscape === snd.id
                        ? 'bg-[#12161A] text-[#F9F6F0] shadow-sm ring-1 ring-[#D4A373]'
                        : snd.featured
                        ? 'bg-[#FBECE8] text-[#9E4A38] border border-[#F0D5CF] hover:bg-[#F7E1DB]'
                        : 'bg-[#F4EFE6] text-[#5E5852] hover:bg-[#EAE1D3]'
                    }`}
                  >
                    {snd.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Progress Modal */}
      <ShareProgressModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        streakState={streakSystem.getState()}
        userName="Practitioner"
        dailyIntention="136.1 Hz Cosmic OM Meditation & Inner Stillness"
      />
    </div>
  );
};
