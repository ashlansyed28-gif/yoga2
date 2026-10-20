/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Bell,
  Clock,
  Heart,
  Share2,
  CheckCircle2,
  ArrowLeft,
  Flame,
  Award,
  Box
} from 'lucide-react';
import { soundSanctuary } from '../utils/soundSanctuary.ts';
import { streakSystem, StreakBadge } from '../utils/streakSystem.ts';
import { BuddhaMeditationArtwork } from './ZenVisuals.tsx';
import { ThreeYogaHuman } from './ThreeYogaHuman.tsx';

interface OmChantingMotionSanctuaryProps {
  onBackToHome?: () => void;
  onOpenShareModal?: () => void;
}

type ChantPhase = 'A' | 'U' | 'M' | 'Silence';

interface PhaseDetail {
  letter: string;
  sanskrit: string;
  chakra: string;
  color: string;
  guidance: string;
}

const CHANT_PHASES: Record<ChantPhase, PhaseDetail> = {
  A: {
    letter: 'A (अ)',
    sanskrit: 'अ-कार · नाभि मण्डल',
    chakra: 'Navel & Sacral (Manipura)',
    color: '#F4A261',
    guidance: 'Open the throat softly. Feel the visceral vibration awaken in the pelvic floor and lower abdomen.'
  },
  U: {
    letter: 'U (उ)',
    sanskrit: 'उ-कार · हृदय कण्ठ',
    chakra: 'Heart & Throat (Anahata & Vishuddha)',
    color: '#E0AFA0',
    guidance: 'Shape lips into a soft circle. Feel the warm resonance rise through the breastbone and collarbones.'
  },
  M: {
    letter: 'M (म)',
    sanskrit: 'म-कार · भ्रूमध्य सहस्रार',
    chakra: 'Third Eye & Crown (Ajna & Sahasrara)',
    color: '#D4A373',
    guidance: 'Close lips without clenching teeth. Let the hum vibrate the cranial bones and nasal sinuses.'
  },
  Silence: {
    letter: 'Silence (तुरीय)',
    sanskrit: 'तुरीय · विशुद्ध कैवल्य',
    chakra: 'All Chakras / Cosmic Space',
    color: '#FFFFFF',
    guidance: 'Rest in the silent after-glow of the sound. The boundary between practitioner and cosmos dissolves.'
  }
};

export const OmChantingMotionSanctuary: React.FC<OmChantingMotionSanctuaryProps> = ({
  onBackToHome,
  onOpenShareModal
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedFreq, setSelectedFreq] = useState<number>(136.1); // 136.1 Earth OM, 432, 528
  const [cyclePaceSec, setCyclePaceSec] = useState<number>(12); // 8s, 10s, 12s, 16s
  const [sessionMinutes, setSessionMinutes] = useState<number>(10);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(10 * 60);
  const [currentPhase, setCurrentPhase] = useState<ChantPhase>('A');
  const [cycleProgress, setCycleProgress] = useState<number>(0);
  const [sessionCompleted, setSessionCompleted] = useState<boolean>(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState<StreakBadge[]>([]);
  const [omVisualMode, setOmVisualMode] = useState<'3d' | 'yantra'>('3d');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Countdown timer
  useEffect(() => {
    if (!isPlaying) return;

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
        handleFinishSession();
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, sessionMinutes]);

  const handleFinishSession = () => {
    setIsPlaying(false);
    soundSanctuary.stopAmbientPrana();
    soundSanctuary.playMeditationBell(432);

    // Record progressive streak
    const { newlyUnlockedBadges } = streakSystem.recordPractice(
      'om-chant',
      `Sacred OM Chanting (${selectedFreq} Hz Resonance)`,
      sessionMinutes
    );
    setNewlyUnlocked(newlyUnlockedBadges);
    setSessionCompleted(true);
  };

  // Playback Toggle
  const togglePlay = () => {
    if (isPlaying) {
      soundSanctuary.stopAmbientPrana();
      setIsPlaying(false);
    } else {
      soundSanctuary.playMeditationBell(432);
      soundSanctuary.startOmMusic(selectedFreq, cyclePaceSec);
      setIsPlaying(true);
      setSessionCompleted(false);
    }
  };

  // Change Frequency
  const handleSelectFreq = (freq: number) => {
    setSelectedFreq(freq);
    if (isPlaying) {
      soundSanctuary.startOmMusic(freq, cyclePaceSec);
    }
    soundSanctuary.playZenTingsha();
  };

  // Change Cycle Pace
  const handleSelectPace = (sec: number) => {
    setCyclePaceSec(sec);
    if (isPlaying) {
      soundSanctuary.startOmMusic(selectedFreq, sec);
    }
    soundSanctuary.playZenTingsha();
  };

  // Reset Session
  const handleResetSession = (mins: number = sessionMinutes) => {
    soundSanctuary.stopAmbientPrana();
    setIsPlaying(false);
    setSessionMinutes(mins);
    setSecondsRemaining(mins * 60);
    setSessionCompleted(false);
  };

  // Web Audio Analyser and Procedural Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = performance.now();

    const render = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      const cycleTime = elapsed % cyclePaceSec;
      const progress = cycleTime / cyclePaceSec;
      setCycleProgress(progress);

      // Determine Chant Phase: A (0-30%), U (30-60%), M (60-85%), Silence (85-100%)
      let phase: ChantPhase = 'A';
      if (progress < 0.3) {
        phase = 'A';
      } else if (progress < 0.6) {
        phase = 'U';
      } else if (progress < 0.85) {
        phase = 'M';
      } else {
        phase = 'Silence';
      }
      setCurrentPhase(phase);

      const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
      const height = (canvas.height = 420);
      const cx = width / 2;
      const cy = height / 2;

      // Clear
      ctx.clearRect(0, 0, width, height);

      // Dark Sacred Atmosphere Gradient
      const grad = ctx.createRadialGradient(cx, cy, 30, cx, cy, Math.max(width, height) / 1.4);
      grad.addColorStop(0, '#1E252C');
      grad.addColorStop(0.7, '#111518');
      grad.addColorStop(1, '#0B0E11');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Read real Audio FFT Data from AnalyserNode
      const analyser = soundSanctuary.getAnalyser();
      let audioEnergy = 0;
      let freqData: Uint8Array = new Uint8Array(64);

      if (analyser && isPlaying) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);
        freqData = dataArray.slice(0, 64);

        let sum = 0;
        for (let i = 0; i < 32; i++) {
          sum += dataArray[i];
        }
        audioEnergy = sum / (32 * 255); // 0 to 1
      } else {
        // Procedural smooth breath wave fallback if muted or inactive
        const wave = 0.5 + 0.5 * Math.sin((elapsed / cyclePaceSec) * Math.PI * 2);
        audioEnergy = isPlaying ? 0.3 + wave * 0.4 : 0.15;
      }

      const activeColor = CHANT_PHASES[phase].color;

      // 1. Concentric Resonance Sound Ripples radiating outward
      const maxRings = 7;
      for (let r = 0; r < maxRings; r++) {
        const ringProgress = ((elapsed * 0.4 + r / maxRings) % 1);
        const radius = (40 + ringProgress * 160) * (1 + audioEnergy * 0.3);
        const alpha = Math.max(0, 1 - ringProgress) * (isPlaying ? 0.35 : 0.15);

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(212, 163, 115, ${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 2. Audio-reactive Frequency Ring
      if (isPlaying && freqData.length > 0) {
        ctx.beginPath();
        const baseRadius = 85 * (1 + audioEnergy * 0.25);
        const slices = 48;
        for (let i = 0; i < slices; i++) {
          const angle = (i / slices) * Math.PI * 2;
          const val = (freqData[i % freqData.length] || 0) / 255;
          const dist = baseRadius + val * 35;
          const px = cx + Math.cos(angle) * dist;
          const py = cy + Math.sin(angle) * dist;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = `${activeColor}88`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // 3. Sacred Geometry: Expanding 16-Petaled Chakra Lotus Mandala
      const petals = 16;
      const lotusScale = 1 + audioEnergy * 0.4;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(elapsed * 0.05);

      for (let p = 0; p < petals; p++) {
        const angle = (p / petals) * Math.PI * 2;
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(
          18 * lotusScale,
          25 * lotusScale,
          15 * lotusScale,
          75 * lotusScale,
          0,
          95 * lotusScale
        );
        ctx.bezierCurveTo(
          -15 * lotusScale,
          75 * lotusScale,
          -18 * lotusScale,
          25 * lotusScale,
          0,
          0
        );
        ctx.fillStyle = p % 2 === 0 ? 'rgba(212, 163, 115, 0.18)' : 'rgba(224, 175, 160, 0.14)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();

      // 4. Central Animated Human Yogi in Padmasana Meditation (Human Mirror Guide)
      const breathLift = (audioEnergy + (1 - progress)) * 5;
      const ribExpand = (audioEnergy + (1 - progress)) * 6;
      const yogiBaseY = cy + 65;

      // Meditation Mat Cushion Base
      ctx.beginPath();
      ctx.ellipse(cx, yogiBaseY + 6, 85, 18, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#1E2832';
      ctx.fill();
      ctx.strokeStyle = '#394B5A';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Crossed Legs Base (Linen Meditation Attire)
      ctx.beginPath();
      ctx.ellipse(cx, yogiBaseY - 6, 75, 20, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#CBBDA9';
      ctx.fill();
      ctx.strokeStyle = '#9E8D79';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Knees Left & Right
      ctx.beginPath();
      ctx.arc(cx - 70, yogiBaseY - 6, 11, 0, Math.PI * 2);
      ctx.arc(cx + 70, yogiBaseY - 6, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#B8A894';
      ctx.fill();

      // Torso in soft linen
      const torsoTopY = cy - 35 - breathLift;
      ctx.beginPath();
      ctx.moveTo(cx - 24 - ribExpand, torsoTopY + 35);
      ctx.bezierCurveTo(
        cx - 28 - ribExpand,
        torsoTopY + 12,
        cx - 22 - ribExpand,
        torsoTopY,
        cx - 18,
        torsoTopY - 14
      );
      ctx.lineTo(cx + 18, torsoTopY - 14);
      ctx.bezierCurveTo(
        cx + 22 + ribExpand,
        torsoTopY,
        cx + 28 + ribExpand,
        torsoTopY + 12,
        cx + 24 + ribExpand,
        torsoTopY + 35
      );
      ctx.lineTo(cx + 30, yogiBaseY - 12);
      ctx.lineTo(cx - 30, yogiBaseY - 12);
      ctx.closePath();
      ctx.fillStyle = '#F5EFE6';
      ctx.fill();
      ctx.strokeStyle = '#DDD2C1';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Arms extending to knees in Chin Mudra
      ctx.beginPath();
      ctx.moveTo(cx - 18, torsoTopY - 10);
      ctx.bezierCurveTo(cx - 42, torsoTopY + 20, cx - 60, yogiBaseY - 18, cx - 68, yogiBaseY - 6);
      ctx.strokeStyle = '#EAD8C3';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + 18, torsoTopY - 10);
      ctx.bezierCurveTo(cx + 42, torsoTopY + 20, cx + 60, yogiBaseY - 18, cx + 68, yogiBaseY - 6);
      ctx.strokeStyle = '#EAD8C3';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Hands with glowing Chin Mudra
      ctx.beginPath();
      ctx.arc(cx - 68, yogiBaseY - 8, 6, 0, Math.PI * 2);
      ctx.arc(cx + 68, yogiBaseY - 8, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#EAD8C3';
      ctx.fill();

      // Golden Mudra light spark
      ctx.beginPath();
      ctx.arc(cx - 68, yogiBaseY - 8, 3, 0, Math.PI * 2);
      ctx.arc(cx + 68, yogiBaseY - 8, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#FFD54F';
      ctx.shadowColor = '#FFD54F';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Neck & Head
      const neckY = torsoTopY - 14;
      ctx.beginPath();
      ctx.rect(cx - 6, neckY - 12, 12, 14);
      ctx.fillStyle = '#EAD8C3';
      ctx.fill();

      // Head
      const headCenterY = neckY - 26;
      ctx.beginPath();
      ctx.arc(cx, headCenterY, 17, 0, Math.PI * 2);
      ctx.fillStyle = '#EAD8C3';
      ctx.fill();

      // Hair Bun
      ctx.beginPath();
      ctx.arc(cx, headCenterY - 18, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#4A3B32';
      ctx.fill();

      // Serene closed eyes
      ctx.beginPath();
      ctx.arc(cx - 5, headCenterY - 1, 3, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.arc(cx + 5, headCenterY - 1, 3, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.strokeStyle = '#8C6F5A';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Active Resonating Chakra Marker based on OM Phase
      let activeChakraY = headCenterY; // Default third eye
      if (phase === 'A') {
        activeChakraY = torsoTopY + 28; // Manipura (Navel)
      } else if (phase === 'U') {
        activeChakraY = torsoTopY + 8; // Anahata (Heart)
      } else if (phase === 'M') {
        activeChakraY = headCenterY - 4; // Ajna (Third eye)
      } else {
        activeChakraY = headCenterY - 20; // Sahasrara (Crown)
      }

      ctx.beginPath();
      ctx.arc(cx, activeChakraY, 9 * (1 + audioEnergy * 0.6), 0, Math.PI * 2);
      ctx.fillStyle = activeColor;
      ctx.shadowColor = activeColor;
      ctx.shadowBlur = 20 * (1 + audioEnergy);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Floating Sacred OM ॐ Character above Crown
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 24px "Playfair Display", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ॐ', cx, headCenterY - 38);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, cyclePaceSec, selectedFreq]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Back Button Bar */}
      <div className="flex items-center justify-between">
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs font-medium text-[#5E5852] hover:text-[#26221E] bg-[#FFFFFF] border border-[#E8E1D5] px-4 py-2 rounded-full transition-all cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#9E6E38]" />
            <span>Return to Sanctuary Home</span>
          </button>
        )}

        <div className="flex items-center gap-2">
          {onOpenShareModal && (
            <button
              onClick={onOpenShareModal}
              className="flex items-center gap-1.5 text-xs font-medium text-[#73532C] bg-[#F4EFE6] hover:bg-[#EAE2D5] border border-[#E0D5C1] px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#B88554]" />
              <span>Share Sadhana</span>
            </button>
          )}

          <span className="text-xs text-[#7A7268] hidden sm:inline">
            136.1 Hz Sacred Cosmic Resonance
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-2xl space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#7A7268]">
          <span>Prana Vibration</span>
          <span>·</span>
          <span>Earth Frequency 136.1 Hz</span>
          <span>·</span>
          <span>Sadja Sa Resonance</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#26221E] font-normal">
          Sacred OM Chanting & Motion Sanctuary
        </h1>
        <p className="text-sm text-[#5E5852] leading-relaxed">
          136.1 Hz is the sacred primordial frequency corresponding to the Earth’s rotation around the Sun. Synchronize your breath, voice, and autonomic nervous system with the live harmonic synthesis below.
        </p>
      </div>

      {/* Main Altar Motion Visualizer Card */}
      <div className="rounded-3xl overflow-hidden bg-[#182026] border border-[#2D3944] shadow-2xl flex flex-col">
        {/* Top Frequency & Cycle Selector Bar */}
        <div className="px-6 py-4 border-b border-[#2A3742] bg-[#12161A]/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#D4A373]">
              Resonance Frequency:
            </span>
            <div className="flex items-center gap-1.5">
              {[
                { f: 136.1, label: '136.1 Hz (Cosmic Earth OM)' },
                { f: 432, label: '432 Hz (Sacred A)' },
                { f: 528, label: '528 Hz (Solfeggio)' }
              ].map((item) => (
                <button
                  key={item.f}
                  onClick={() => handleSelectFreq(item.f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedFreq === item.f
                      ? 'bg-[#FFFFFF] text-[#12161A] shadow-xs'
                      : 'bg-[#1E2730] text-[#A8B2BD] hover:text-[#FFFFFF]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Mode & Chant Cycle Tempo */}
          <div className="flex items-center gap-3 text-xs">
            {/* 3D vs 2D Switcher */}
            <div className="flex items-center gap-1 bg-[#1E2730] p-1 rounded-xl border border-[#31414F]">
              <button
                onClick={() => {
                  setOmVisualMode('3d');
                  soundSanctuary.playZenTingsha();
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  omVisualMode === '3d'
                    ? 'bg-[#FFFFFF] text-[#12161A] font-semibold shadow-xs'
                    : 'text-[#A8B2BD] hover:text-[#FFFFFF]'
                }`}
                title="3D Lotus Meditator with 360° Rotations & Chakras"
              >
                <Box className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>3D Sage</span>
              </button>
              <button
                onClick={() => {
                  setOmVisualMode('yantra');
                  soundSanctuary.playZenTingsha();
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 ${
                  omVisualMode === 'yantra'
                    ? 'bg-[#D4A373] text-[#12161A] font-semibold shadow-xs'
                    : 'text-[#A8B2BD] hover:text-[#FFFFFF]'
                }`}
                title="Sacred Yantra & Audio-Reactive Waveforms"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Yantra</span>
              </button>
            </div>

            <div className="flex items-center gap-1 bg-[#1E2730] p-1 rounded-lg">
              <span className="text-[#8C9AA8] px-1 text-[11px]">Breath:</span>
              {[8, 10, 12, 16].map((sec) => (
                <button
                  key={sec}
                  onClick={() => handleSelectPace(sec)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                    cyclePaceSec === sec ? 'bg-[#31414F] text-white' : 'text-[#8C9AA8] hover:text-white'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Audio-Reactive Visualizer: 3D Sage or Sacred Yantra */}
        <div className="relative w-full h-[420px] bg-[#0E1215] overflow-hidden flex items-center justify-center">
          {omVisualMode === '3d' ? (
            <ThreeYogaHuman
              poseType="stillness"
              expansion={cycleProgress}
              time={secondsRemaining}
              title={`${selectedFreq}Hz Lotus Chanting`}
              className="w-full h-full"
              showChakras={true}
            />
          ) : (
            <canvas ref={canvasRef} className="w-full h-full block" />
          )}

          {/* Current Chant Phase Overlay Badge */}
          <div className="absolute top-5 left-5 z-20 flex items-center gap-2.5 bg-[#12161A]/85 backdrop-blur-md px-4 py-2 rounded-full border border-[#2D3944]">
            <span
              className="w-3 h-3 rounded-full animate-ping"
              style={{ backgroundColor: CHANT_PHASES[currentPhase].color }}
            />
            <div className="text-left">
              <span className="text-xs font-semibold text-[#FFFFFF] block leading-none">
                Phase: {CHANT_PHASES[currentPhase].letter}
              </span>
              <span className="text-[10px] text-[#D4A373] font-mono">
                {CHANT_PHASES[currentPhase].sanskrit}
              </span>
            </div>
          </div>

          {/* Time Remaining Counter Glass Badge */}
          <div className="absolute top-5 right-5 z-20 bg-[#12161A]/85 backdrop-blur-md px-4 py-2 rounded-full border border-[#2D3944] text-right">
            <span className="font-serif text-lg font-light text-[#FFFFFF] tabular-nums">
              {formatTime(secondsRemaining)}
            </span>
            <span className="text-[10px] text-[#A8B2BD] block uppercase tracking-wider">
              {isPlaying ? 'Resonating' : 'Ready'}
            </span>
          </div>

          {/* Visual Breath Expansion Wave Bar */}
          <div className="absolute bottom-4 left-6 right-6 z-20 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-[#CCD5AE]">
              <span>Chakra: {CHANT_PHASES[currentPhase].chakra}</span>
              <span className="font-mono">{Math.round(cycleProgress * 100)}% cycle</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#1E2730] overflow-hidden border border-[#2A3742]">
              <div
                className="h-full transition-all duration-100 rounded-full"
                style={{
                  width: `${cycleProgress * 100}%`,
                  backgroundColor: CHANT_PHASES[currentPhase].color
                }}
              />
            </div>
          </div>
        </div>

        {/* Phase Instructional Guidance Panel */}
        <div className="p-6 bg-[#182026] border-t border-[#2A3742] space-y-6">
          <div className="p-4 rounded-2xl bg-[#1F2932] border border-[#31414F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#D4A373]">
                Chant Meditation Instruction
              </span>
              <p className="text-xs text-[#E8E1D5] leading-relaxed">
                {CHANT_PHASES[currentPhase].guidance}
              </p>
            </div>

            {/* Duration Presets */}
            <div className="flex items-center gap-1.5 shrink-0">
              {[5, 10, 15, 20].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleResetSession(mins)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                    sessionMinutes === mins
                      ? 'bg-[#FFFFFF] text-[#12161A]'
                      : 'bg-[#1E2730] text-[#A8B2BD] hover:text-[#FFFFFF]'
                  }`}
                >
                  {mins}m
                </button>
              ))}
            </div>
          </div>

          {/* Master Transport Controls */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleResetSession()}
              className="p-3.5 rounded-full border border-[#2D3944] hover:bg-[#232F38] text-[#A8B2BD] transition-colors cursor-pointer"
              title="Reset Session Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={togglePlay}
              className={`px-10 py-4 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2.5 shadow-lg ${
                isPlaying
                  ? 'bg-[#FFFFFF] text-[#12161A] hover:bg-[#EAE4D9]'
                  : 'bg-gradient-to-r from-[#D4A373] to-[#B88554] text-[#12161A] hover:opacity-95'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause Stillness</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Begin 136.1 Hz OM Chanting ({formatTime(secondsRemaining)})</span>
                </>
              )}
            </button>

            <button
              onClick={() => soundSanctuary.playMeditationBell(432)}
              className="p-3.5 rounded-full border border-[#2D3944] hover:bg-[#232F38] text-[#D4A373] transition-colors cursor-pointer"
              title="Ring 432 Hz Sacred Tibetan Gong"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>

          {/* Completed Session Celebration Toast */}
          {sessionCompleted && (
            <div className="p-4 rounded-2xl bg-[#1E2E24] border border-[#2E5E3D] text-[#D5EAD8] flex items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-emerald-300">
                    Sadhana Completed & Recorded!
                  </div>
                  <p className="text-[11px] text-[#A6CDB0] mt-0.5">
                    Your {sessionMinutes}-minute 136.1 Hz OM chanting session has been added to your daily streak.
                  </p>
                </div>
              </div>

              {onOpenShareModal && (
                <button
                  onClick={onOpenShareModal}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-emerald-500 hover:bg-emerald-400 text-[#12161A] transition-colors cursor-pointer shrink-0"
                >
                  Share Milestone
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
