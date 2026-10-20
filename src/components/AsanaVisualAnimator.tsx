/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Activity, Eye, Zap, Layers, Maximize2, Minimize2, Box } from 'lucide-react';
import { soundSanctuary } from '../utils/soundSanctuary.ts';
import { ThreeYogaHuman } from './ThreeYogaHuman.tsx';

export type AsanaPoseKey =
  | 'sukhasana'
  | 'cat-cow'
  | 'anjaneyasana'
  | 'downdog'
  | 'tadasana'
  | 'balasana'
  | 'thread-needle'
  | 'sphinx'
  | 'supta-twist'
  | 'supta-baddha-konasana'
  | 'figure-four'
  | 'viparita-karani'
  | 'savasana'
  | 'warrior2'
  | 'tree'
  | 'fish'
  | 'bridge';

interface AsanaVisualAnimatorProps {
  poseKey: AsanaPoseKey | string;
  poseName: string;
  sanskritName: string;
  cue?: string;
  breathCue?: string;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  className?: string;
}

export const AsanaVisualAnimator: React.FC<AsanaVisualAnimatorProps> = ({
  poseKey,
  poseName,
  sanskritName,
  cue,
  breathCue,
  isPlaying: externalPlaying,
  onTogglePlay,
  className = ''
}) => {
  const [internalPlaying, setInternalPlaying] = useState<boolean>(true);
  const [speed, setSpeed] = useState<number>(1.0); // 0.5, 1.0, 1.5
  const [viewMode, setViewMode] = useState<'3d' | 'form' | 'biomechanics' | 'prana'>('3d');
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'retain' | 'exhale' | 'settle'>('inhale');
  const [breathProgress, setBreathProgress] = useState<number>(0);
  const [animTime, setAnimTime] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const isPlaying = externalPlaying !== undefined ? externalPlaying : internalPlaying;

  // Normalized key
  const normalizedKey = ((): AsanaPoseKey => {
    const k = poseKey.toLowerCase();
    if (k.includes('sukhasana') || k.includes('easy')) return 'sukhasana';
    if (k.includes('cat') || k.includes('cow') || k.includes('marjary')) return 'cat-cow';
    if (k.includes('lunge') || k.includes('anjaney')) return 'anjaneyasana';
    if (k.includes('dog') || k.includes('adho')) return 'downdog';
    if (k.includes('mountain') || k.includes('tadasana')) return 'tadasana';
    if (k.includes('child') || k.includes('balasana')) return 'balasana';
    if (k.includes('thread') || k.includes('parsva bala')) return 'thread-needle';
    if (k.includes('sphinx') || k.includes('salamba bhu')) return 'sphinx';
    if (k.includes('twist') || k.includes('matsyend')) return 'supta-twist';
    if (k.includes('bound angle') || k.includes('baddha kona')) return 'supta-baddha-konasana';
    if (k.includes('figure') || k.includes('pigeon') || k.includes('kapota')) return 'figure-four';
    if (k.includes('legs') || k.includes('viparita')) return 'viparita-karani';
    if (k.includes('savasana') || k.includes('corpse')) return 'savasana';
    if (k.includes('warrior') || k.includes('virabhadra')) return 'warrior2';
    if (k.includes('tree') || k.includes('vrksa')) return 'tree';
    if (k.includes('fish') || k.includes('matsya')) return 'fish';
    if (k.includes('bridge') || k.includes('setu')) return 'bridge';
    return 'sukhasana';
  })();

  // 10-second breath cycle loop (4s inhale, 2s retain, 4s exhale, 2s settle)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setAnimTime((t) => (t + 0.05 * speed) % 12);
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  useEffect(() => {
    const cycleTime = animTime % 12;
    if (cycleTime < 4) {
      setBreathPhase('inhale');
      setBreathProgress(cycleTime / 4);
    } else if (cycleTime < 6) {
      setBreathPhase('retain');
      setBreathProgress(1);
    } else if (cycleTime < 10) {
      setBreathPhase('exhale');
      setBreathProgress(1 - (cycleTime - 6) / 4);
    } else {
      setBreathPhase('settle');
      setBreathProgress(0);
    }
  }, [animTime]);

  const togglePlayback = () => {
    if (onTogglePlay) {
      onTogglePlay();
    } else {
      setInternalPlaying(!internalPlaying);
    }
    soundSanctuary.playZenTingsha();
  };

  // Breath sine wave oscillation value between -1 and 1
  const breathWave = Math.sin((animTime / 12) * Math.PI * 2);
  // Undulation factor
  const waveFactor = 0.5 + 0.5 * breathWave; // 0 to 1

  return (
    <div
      className={`relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#182026] via-[#12161A] to-[#0D1013] border border-[#2D3944] text-[#F9F6F0] flex flex-col justify-between shadow-lg select-none ${
        isFullscreen ? 'fixed inset-4 z-50 p-6' : 'p-4 sm:p-6'
      } ${className}`}
    >
      {/* Top Video Header HUD */}
      <div className="flex items-center justify-between gap-3 relative z-20 border-b border-[#2A3742]/70 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#E0AFA0] animate-ping" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#D4A373]">
                {sanskritName}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#232F38] text-[#CCD5AE] font-mono border border-[#374957]">
                LIVE ANIMATION LOOP
              </span>
            </div>
            <h3 className="font-serif text-base sm:text-lg text-[#F9F6F0] font-medium leading-tight">
              {poseName}
            </h3>
          </div>
        </div>

        {/* View Mode Switcher: 3D Studio, Form, Biomechanics, Prana */}
        <div className="flex items-center gap-1.5 bg-[#1B242C] p-1 rounded-xl border border-[#2F3D49]">
          <button
            onClick={() => {
              setViewMode('3d');
              soundSanctuary.playZenTingsha();
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
              viewMode === '3d'
                ? 'bg-[#FFFFFF] text-[#12161A] font-semibold shadow-xs'
                : 'text-[#A0B0BE] hover:text-[#F9F6F0]'
            }`}
            title="Interactive 3D Studio (360° Rotate, Zoom, Camera Presets)"
          >
            <Box className="w-3 h-3 text-[#D4A373]" />
            <span>3D Studio</span>
          </button>
          <button
            onClick={() => {
              setViewMode('form');
              soundSanctuary.playZenTingsha();
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
              viewMode === 'form'
                ? 'bg-[#D4A373] text-[#12161A] font-semibold shadow-xs'
                : 'text-[#A0B0BE] hover:text-[#F9F6F0]'
            }`}
            title="Natural Form View"
          >
            Form
          </button>
          <button
            onClick={() => {
              setViewMode('biomechanics');
              soundSanctuary.playZenTingsha();
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
              viewMode === 'biomechanics'
                ? 'bg-[#CCD5AE] text-[#12161A] font-semibold shadow-xs'
                : 'text-[#A0B0BE] hover:text-[#F9F6F0]'
            }`}
            title="Skeletal Biomechanics & Plumb Angles"
          >
            Angles
          </button>
          <button
            onClick={() => {
              setViewMode('prana');
              soundSanctuary.playZenTingsha();
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
              viewMode === 'prana'
                ? 'bg-[#E0AFA0] text-[#12161A] font-semibold shadow-xs'
                : 'text-[#A0B0BE] hover:text-[#F9F6F0]'
            }`}
            title="Prana Energy Waves & Breath Nadis"
          >
            Prana
          </button>
        </div>
      </div>

      {/* Main Animated Stage Area */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[380px] flex items-center justify-center overflow-hidden my-2 rounded-2xl bg-[#0D1013]">
        {viewMode === '3d' ? (
          <ThreeYogaHuman
            poseType={normalizedKey}
            expansion={waveFactor}
            time={animTime}
            title={poseName}
            className="w-full h-full min-h-[380px]"
            showChakras={true}
          />
        ) : (
          <>
            {/* Sacred Geometry Background Rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div
                className="w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-[#D4A373] transition-transform duration-1000"
                style={{ transform: `scale(${0.9 + waveFactor * 0.15})` }}
              />
              <div
                className="absolute w-56 h-56 sm:w-72 sm:h-72 rounded-full border border-[#CCD5AE] transition-transform duration-1000"
                style={{ transform: `scale(${0.95 + waveFactor * 0.1})` }}
              />
              <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4A373]/30 to-transparent bottom-12" />
            </div>

            {/* Yoga Mat Ground Plane in Studio */}
            <div className="absolute bottom-6 sm:bottom-8 w-4/5 h-4 bg-gradient-to-r from-transparent via-[#2D3944] to-transparent rounded-full opacity-60 blur-xs" />

            {/* SVG Pose Animation Renderer */}
            <svg
              viewBox="0 0 600 400"
              className="w-full h-full max-h-[380px] z-10 transition-transform duration-300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="bodySkin" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#EAD8C3" />
                  <stop offset="100%" stopColor="#C8B39B" />
                </linearGradient>
                <linearGradient id="linenTops" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#F9F6F0" />
                  <stop offset="100%" stopColor="#E2DCCE" />
                </linearGradient>
                <linearGradient id="linenPants" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D5C5B3" />
                  <stop offset="100%" stopColor="#A89480" />
                </linearGradient>
                <radialGradient id="pranaHalo" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFE0B2" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#E0AFA0" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#D4A373" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heartChakraGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#CCD5AE" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#CCD5AE" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Render Vector Kinematic Pose by Key */}
              {renderPoseVector(normalizedKey, waveFactor, viewMode)}
            </svg>
          </>
        )}

        {/* Floating Live Biomechanical Angle Callout Overlays */}
        {viewMode === 'biomechanics' && (
          <div className="absolute top-4 left-4 bg-[#12161A]/85 backdrop-blur-md px-3 py-2 rounded-xl border border-[#CCD5AE]/40 text-[11px] font-mono text-[#CCD5AE] space-y-1 z-20 pointer-events-none">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#CCD5AE]" />
              <span>Plumb Line: 0.0° Deviation</span>
            </div>
            <div className="text-[10px] text-[#A0B0BE]">
              Shoulder Depression: -2.4cm
            </div>
          </div>
        )}

        {/* Floating Prana Chakra Indicator */}
        {viewMode === 'prana' && (
          <div className="absolute top-4 right-4 bg-[#12161A]/85 backdrop-blur-md px-3 py-2 rounded-xl border border-[#E0AFA0]/40 text-[11px] text-[#E0AFA0] space-y-0.5 z-20 pointer-events-none">
            <div className="flex items-center gap-1.5 font-medium">
              <Zap className="w-3.5 h-3.5 text-[#E0AFA0]" />
              <span>Anahata Heart Expansion</span>
            </div>
            <div className="text-[10px] text-[#A0B0BE]">
              Sushumna Nadi Pulsing {breathPhase.toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Interactive HUD: Breath Waveform & Video Controls */}
      <div className="space-y-3 relative z-20 border-t border-[#2A3742]/70 pt-3">
        {/* Dynamic Breath Sync Wavebar */}
        <div className="bg-[#18222A] p-2.5 rounded-2xl border border-[#2B3844] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full transition-all duration-500 ${
                breathPhase === 'inhale'
                  ? 'bg-[#CCD5AE] scale-125'
                  : breathPhase === 'retain'
                  ? 'bg-[#D4A373] scale-110'
                  : breathPhase === 'exhale'
                  ? 'bg-[#E0AFA0] scale-90'
                  : 'bg-[#7A8A96] scale-75'
              }`}
            />
            <div className="leading-tight">
              <span className="text-[10px] text-[#A0B0BE] uppercase tracking-wider block">
                Breath Phase
              </span>
              <span className="text-xs font-semibold text-[#F9F6F0] capitalize">
                {breathPhase} ({(breathProgress * 100).toFixed(0)}%)
              </span>
            </div>
          </div>

          {/* Real-time Breath Progress Bar */}
          <div className="flex-1 max-w-xs h-2 bg-[#101519] rounded-full overflow-hidden border border-[#26333D]">
            <div
              className={`h-full transition-all duration-75 rounded-full ${
                breathPhase === 'inhale'
                  ? 'bg-[#CCD5AE]'
                  : breathPhase === 'retain'
                  ? 'bg-[#D4A373]'
                  : breathPhase === 'exhale'
                  ? 'bg-[#E0AFA0]'
                  : 'bg-[#7A8A96]'
              }`}
              style={{ width: `${breathProgress * 100}%` }}
            />
          </div>

          {/* Speed Multiplier (0.5x, 1x, 1.5x) */}
          <div className="flex items-center gap-1">
            {[0.5, 1.0, 1.5].map((spd) => (
              <button
                key={spd}
                onClick={() => setSpeed(spd)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                  speed === spd
                    ? 'bg-[#D4A373] text-[#12161A] font-bold'
                    : 'bg-[#232F38] text-[#A0B0BE] hover:text-[#F9F6F0]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Syed Karishma's Direct Cue Passage */}
        {(cue || breathCue) && (
          <div className="p-3 rounded-xl bg-[#151D24] border border-[#263440] flex items-start gap-2.5 text-xs text-[#CBD8E2] leading-relaxed">
            <Sparkles className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5" />
            <div>
              {cue && <p className="text-[#E6EFF5] font-medium">{cue}</p>}
              {breathCue && (
                <p className="text-[11px] text-[#A6BAC9] italic mt-0.5">
                  Prana: {breathCue}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Controls Strip: Play/Pause, Bell Chime, Fullscreen */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayback}
              className="px-4 py-2 rounded-xl bg-[#D4A373] hover:bg-[#C28F5E] text-[#12161A] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause Motion</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play Pose Motion</span>
                </>
              )}
            </button>

            <button
              onClick={() => soundSanctuary.playSingingBowl(324)}
              className="px-3 py-2 rounded-xl bg-[#1E2832] hover:bg-[#283542] text-[#CCD5AE] border border-[#2F3E4C] transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Ring Tibetan Bowl"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Singing Bowl</span>
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 rounded-xl bg-[#1E2832] hover:bg-[#283542] text-[#A0B0BE] hover:text-[#F9F6F0] border border-[#2F3E4C] transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Theater' : 'Expand Studio'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// RENDER VECTOR POSE GRAPHICS BY ASANA KEY
// ==========================================
function renderPoseVector(
  pose: AsanaPoseKey,
  wave: number, // 0 to 1 breathing undulation
  mode: 'form' | 'biomechanics' | 'prana'
) {
  const spineWaveOffset = (wave - 0.5) * 8; // subtle wave
  const chestExpansion = 1 + wave * 0.08;

  switch (pose) {
    case 'sukhasana': {
      // Seated Easy Pose with heart centering
      return (
        <g id="sukhasana-group">
          {/* Prana Aura */}
          {mode === 'prana' && (
            <circle cx="300" cy="180" r={90 + wave * 20} fill="url(#pranaHalo)" />
          )}

          {/* Crossed Legs Platform */}
          <path
            d={`M200 310 Q300 ${325 + spineWaveOffset} 400 310 Q370 340 300 345 Q230 340 200 310 Z`}
            fill="url(#linenPants)"
          />

          {/* Torso */}
          <path
            d={`M265 295 L270 210 Q300 ${200 - wave * 4} 330 210 L335 295 Z`}
            fill="url(#linenTops)"
          />

          {/* Arms resting on knees in Jnana / Anjali Mudra */}
          <path d="M270 215 Q220 250 230 300" stroke="url(#bodySkin)" strokeWidth="14" strokeLinecap="round" />
          <path d="M330 215 Q380 250 370 300" stroke="url(#bodySkin)" strokeWidth="14" strokeLinecap="round" />

          {/* Hands with golden mudra spark */}
          <circle cx="230" cy="300" r="8" fill="url(#bodySkin)" />
          <circle cx="370" cy="300" r="8" fill="url(#bodySkin)" />

          {/* Head & Neck */}
          <rect x="292" y="175" width="16" height="25" rx="6" fill="url(#bodySkin)" />
          <circle cx="300" cy="155" r="28" fill="url(#bodySkin)" />

          {/* Hair Bun / Ushnisha */}
          <circle cx="300" cy="125" r="12" fill="#5E5042" />

          {/* Biomechanical Plumb Line */}
          {mode === 'biomechanics' && (
            <>
              <line x1="300" y1="100" x2="300" y2="340" stroke="#CCD5AE" strokeWidth="2" strokeDasharray="6 4" />
              <circle cx="300" cy="155" r="5" fill="#CCD5AE" />
              <circle cx="300" cy="240" r="5" fill="#CCD5AE" />
              <circle cx="300" cy="320" r="5" fill="#CCD5AE" />
              <text x="315" y="155" fill="#CCD5AE" fontSize="12" fontFamily="monospace">Crown Center</text>
              <text x="315" y="240" fill="#CCD5AE" fontSize="12" fontFamily="monospace">Heart 180°</text>
            </>
          )}

          {/* Prana Chakras */}
          {mode === 'prana' && (
            <>
              <circle cx="300" cy="235" r={10 + wave * 6} fill="url(#heartChakraGlow)" />
              <circle cx="300" cy="155" r="6" fill="#FFF4E6" opacity="0.9" />
            </>
          )}
        </g>
      );
    }

    case 'cat-cow': {
      // Cat-Cow undulating spinal ripple
      const arch = (wave - 0.5) * 36; // -18 (cat arched up) to +18 (cow dip down)
      return (
        <g id="cat-cow-group">
          {/* Hands grounded on mat */}
          <rect x="180" y="310" width="20" height="8" rx="3" fill="url(#bodySkin)" />
          <rect x="380" y="310" width="20" height="8" rx="3" fill="url(#bodySkin)" />

          {/* Knees grounded */}
          <ellipse cx="400" cy="310" rx="14" ry="8" fill="url(#linenPants)" />
          <rect x="400" y="305" width="40" height="10" rx="4" fill="url(#linenPants)" />

          {/* Front Arms straight */}
          <line x1="200" y1="210" x2="190" y2="310" stroke="url(#bodySkin)" strokeWidth="16" strokeLinecap="round" />

          {/* Thighs vertical */}
          <line x1="380" y1="210" x2="400" y2="310" stroke="url(#linenPants)" strokeWidth="20" strokeLinecap="round" />

          {/* Undulating Spine & Torso (Curving dynamically) */}
          <path
            d={`M200 210 Q290 ${210 + arch} 380 210 L380 235 Q290 ${235 + arch} 200 235 Z`}
            fill="url(#linenTops)"
          />

          {/* Head moving with breath (Lifted in cow, tucked in cat) */}
          <circle cx="150" cy={195 - arch * 0.8} r="24" fill="url(#bodySkin)" />
          <circle cx="130" cy={185 - arch * 0.8} r="10" fill="#5E5042" />

          {/* Biomechanics Angle Arc */}
          {mode === 'biomechanics' && (
            <>
              <path
                d={`M200 210 Q290 ${210 + arch} 380 210`}
                stroke="#CCD5AE"
                strokeWidth="3"
                strokeDasharray="4 4"
                fill="none"
              />
              <circle cx="290" cy={210 + arch} r="6" fill="#D4A373" />
              <text x="250" y="150" fill="#CCD5AE" fontSize="12" fontFamily="monospace">
                Spine Flexion: {arch > 0 ? '+15° Cow Dip' : '-18° Cat Dome'}
              </text>
            </>
          )}

          {/* Prana Spinal Energy Wave */}
          {mode === 'prana' && (
            <path
              d={`M150 195 Q290 ${210 + arch} 400 310`}
              stroke="#E0AFA0"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="6 6"
              fill="none"
              opacity="0.85"
            />
          )}
        </g>
      );
    }

    case 'anjaneyasana': {
      // Low Lunge with chest lifted
      return (
        <g id="anjaneyasana-group">
          {/* Front foot forward */}
          <path d="M190 310 L220 310" stroke="url(#bodySkin)" strokeWidth="12" strokeLinecap="round" />
          {/* Front lower leg vertical */}
          <line x1="210" y1="310" x2="210" y2="230" stroke="url(#linenPants)" strokeWidth="18" strokeLinecap="round" />
          {/* Front thigh horizontal */}
          <line x1="210" y1="230" x2="310" y2="230" stroke="url(#linenPants)" strokeWidth="20" strokeLinecap="round" />

          {/* Back knee on ground, back leg extended */}
          <circle cx="390" cy="305" r="12" fill="url(#linenPants)" />
          <line x1="310" y1="230" x2="390" y2="305" stroke="url(#linenPants)" strokeWidth="20" strokeLinecap="round" />
          <line x1="390" y1="305" x2="450" y2="310" stroke="url(#linenPants)" strokeWidth="14" strokeLinecap="round" />

          {/* Torso arched gracefully back */}
          <path
            d={`M300 230 Q${320 + spineWaveOffset} 170 330 140 L350 145 Q${340 + spineWaveOffset} 180 320 230 Z`}
            fill="url(#linenTops)"
          />

          {/* Arms reaching skyward with heart opening */}
          <path d="M330 145 Q360 80 370 50" stroke="url(#bodySkin)" strokeWidth="14" strokeLinecap="round" />
          <path d="M340 145 Q375 80 385 50" stroke="url(#bodySkin)" strokeWidth="12" strokeLinecap="round" />

          {/* Head tilted with gaze upward */}
          <circle cx="345" cy="115" r="22" fill="url(#bodySkin)" />

          {mode === 'biomechanics' && (
            <>
              {/* 90-degree knee square */}
              <rect x="202" y="222" width="16" height="16" stroke="#CCD5AE" strokeWidth="1.5" fill="none" />
              <text x="140" y="235" fill="#CCD5AE" fontSize="11" fontFamily="monospace">Knee 90° Stack</text>
              <line x1="210" y1="230" x2="210" y2="310" stroke="#CCD5AE" strokeWidth="2" strokeDasharray="3 3" />
            </>
          )}

          {mode === 'prana' && (
            <circle cx="335" cy="160" r={16 + wave * 8} fill="url(#heartChakraGlow)" />
          )}
        </g>
      );
    }

    case 'downdog': {
      // Downward-Facing Dog (Inverted V)
      return (
        <g id="downdog-group">
          {/* Hands grounded */}
          <rect x="150" y="310" width="24" height="8" rx="3" fill="url(#bodySkin)" />
          {/* Feet grounded / heels releasing */}
          <rect x="420" y="305" width="24" height="8" rx="3" fill="url(#bodySkin)" />

          {/* Arms pressing firmly up to pelvis */}
          <line x1="160" y1="310" x2="280" y2="160" stroke="url(#bodySkin)" strokeWidth="16" strokeLinecap="round" />

          {/* Spine & Torso straight line to sacrum */}
          <line
            x1="280"
            y1="160"
            x2="310"
            y2="140"
            stroke="url(#linenTops)"
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* Head relaxed between arms */}
          <circle cx="215" cy="240" r="22" fill="url(#bodySkin)" />

          {/* Legs straight from pelvis down to heels */}
          <line x1="310" y1="140" x2="430" y2="305" stroke="url(#linenPants)" strokeWidth="20" strokeLinecap="round" />

          {/* Biomechanics Plumb Line */}
          {mode === 'biomechanics' && (
            <>
              <line x1="160" y1="310" x2="310" y2="140" stroke="#CCD5AE" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="310" y1="140" x2="430" y2="305" stroke="#CCD5AE" strokeWidth="2" strokeDasharray="4 4" />
              <circle cx="310" cy="140" r="6" fill="#D4A373" />
              <text x="325" y="135" fill="#CCD5AE" fontSize="12" fontFamily="monospace">Apex Sacrum 75°</text>
            </>
          )}

          {mode === 'prana' && (
            <line x1="430" y1="305" x2="160" y2="310" stroke="#E0AFA0" strokeWidth="2" strokeDasharray="8 6" opacity="0.6" />
          )}
        </g>
      );
    }

    case 'warrior2': {
      // Warrior II
      return (
        <g id="warrior2-group">
          {/* Front foot (left) turned forward */}
          <rect x="170" y="310" width="30" height="8" rx="3" fill="url(#bodySkin)" />
          {/* Back foot (right) perpendicular */}
          <rect x="420" y="310" width="30" height="8" rx="3" fill="url(#bodySkin)" />

          {/* Front bent knee 90° */}
          <line x1="185" y1="310" x2="185" y2="230" stroke="url(#linenPants)" strokeWidth="20" strokeLinecap="round" />
          <line x1="185" y1="230" x2="300" y2="230" stroke="url(#linenPants)" strokeWidth="22" strokeLinecap="round" />

          {/* Back straight rooted leg */}
          <line x1="300" y1="230" x2="435" y2="310" stroke="url(#linenPants)" strokeWidth="20" strokeLinecap="round" />

          {/* Vertical spine centered */}
          <line x1="300" y1="230" x2="300" y2="135" stroke="url(#linenTops)" strokeWidth="26" strokeLinecap="round" />

          {/* Extended arms parallel to ground */}
          <line x1="140" y1="145" x2="300" y2="145" stroke="url(#bodySkin)" strokeWidth="14" strokeLinecap="round" />
          <line x1="300" y1="145" x2="460" y2="145" stroke="url(#bodySkin)" strokeWidth="14" strokeLinecap="round" />

          {/* Head gazing over front fingertips */}
          <circle cx="300" cy="105" r="24" fill="url(#bodySkin)" />
          <circle cx="288" cy="102" r="4" fill="#5E5042" />

          {mode === 'biomechanics' && (
            <>
              <line x1="140" y1="145" x2="460" y2="145" stroke="#CCD5AE" strokeWidth="2" strokeDasharray="4 4" />
              <rect x="177" y="222" width="16" height="16" stroke="#CCD5AE" strokeWidth="1.5" fill="none" />
              <line x1="300" y1="90" x2="300" y2="310" stroke="#CCD5AE" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="310" y="200" fill="#CCD5AE" fontSize="11" fontFamily="monospace">Vertical Spine</text>
            </>
          )}

          {mode === 'prana' && (
            <circle cx="300" cy="155" r={16 + wave * 8} fill="url(#heartChakraGlow)" />
          )}
        </g>
      );
    }

    case 'tree': {
      // Tree Pose (Vrksasana)
      return (
        <g id="tree-group">
          {/* Standing Leg straight and rooted */}
          <rect x="290" y="315" width="20" height="8" rx="3" fill="url(#bodySkin)" />
          <line x1="300" y1="315" x2="300" y2="210" stroke="url(#linenPants)" strokeWidth="20" strokeLinecap="round" />

          {/* Bent Leg resting on inner thigh */}
          <line x1="300" y1="210" x2="230" y2="250" stroke="url(#linenPants)" strokeWidth="18" strokeLinecap="round" />
          <line x1="230" y1="250" x2="290" y2="240" stroke="url(#linenPants)" strokeWidth="16" strokeLinecap="round" />

          {/* Torso vertical */}
          <line x1="300" y1="210" x2="300" y2="125" stroke="url(#linenTops)" strokeWidth="24" strokeLinecap="round" />

          {/* Anjali Mudra prayer hands at heart or sky */}
          <path d="M300 145 L275 165 L300 150" stroke="url(#bodySkin)" strokeWidth="12" strokeLinecap="round" />
          <path d="M300 145 L325 165 L300 150" stroke="url(#bodySkin)" strokeWidth="12" strokeLinecap="round" />
          <circle cx="300" cy="150" r="7" fill="url(#bodySkin)" />

          {/* Head & Crown */}
          <circle cx="300" cy="95" r="24" fill="url(#bodySkin)" />
          <circle cx="300" cy="68" r="10" fill="#5E5042" />

          {mode === 'biomechanics' && (
            <>
              <line x1="300" y1="60" x2="300" y2="330" stroke="#CCD5AE" strokeWidth="2" strokeDasharray="5 5" />
              <text x="315" y="100" fill="#CCD5AE" fontSize="11" fontFamily="monospace">Rooted Axis 180°</text>
            </>
          )}

          {mode === 'prana' && (
            <circle cx="300" cy="150" r={18 + wave * 10} fill="url(#heartChakraGlow)" />
          )}
        </g>
      );
    }

    case 'balasana': {
      // Child's Pose (Balasana)
      return (
        <g id="balasana-group">
          {/* Hips on heels */}
          <ellipse cx="400" cy="290" rx="36" ry="24" fill="url(#linenPants)" />
          {/* Feet tucked */}
          <rect x="420" y="300" width="30" height="10" rx="4" fill="url(#bodySkin)" />

          {/* Folded torso resting on thighs */}
          <path
            d={`M400 280 Q310 ${250 - wave * 6} 220 285 L220 305 Q310 ${270 - wave * 6} 400 305 Z`}
            fill="url(#linenTops)"
          />

          {/* Head resting softly on mat */}
          <circle cx="190" cy="295" r="22" fill="url(#bodySkin)" />

          {/* Arms draped forward softly */}
          <path d="M220 285 Q160 295 110 305" stroke="url(#bodySkin)" strokeWidth="14" strokeLinecap="round" />

          {mode === 'biomechanics' && (
            <text x="250" y="230" fill="#CCD5AE" fontSize="11" fontFamily="monospace">
              Lumbar Sacral Release
            </text>
          )}

          {mode === 'prana' && (
            <circle cx="310" cy="260" r={16 + wave * 8} fill="url(#heartChakraGlow)" opacity="0.6" />
          )}
        </g>
      );
    }

    case 'viparita-karani': {
      // Legs-up-the-wall
      return (
        <g id="viparita-group">
          {/* Wall vertical line on right */}
          <line x1="420" y1="50" x2="420" y2="330" stroke="#3A4854" strokeWidth="4" />

          {/* Pelvis on cushion */}
          <rect x="360" y="270" width="55" height="30" rx="8" fill="#B88554" opacity="0.8" />
          <ellipse cx="385" cy="275" rx="26" ry="16" fill="url(#linenPants)" />

          {/* Legs extending straight up against wall */}
          <line x1="395" y1="270" x2="410" y2="80" stroke="url(#linenPants)" strokeWidth="22" strokeLinecap="round" />

          {/* Torso resting flat on floor */}
          <line x1="370" y1="285" x2="220" y2="295" stroke="url(#linenTops)" strokeWidth="24" strokeLinecap="round" />

          {/* Head on floor with chin soft */}
          <circle cx="190" cy="295" r="24" fill="url(#bodySkin)" />

          {/* Arms resting open in T or on belly */}
          <path d="M250 290 Q210 260 180 250" stroke="url(#bodySkin)" strokeWidth="12" strokeLinecap="round" />

          {mode === 'biomechanics' && (
            <>
              <line x1="410" y1="80" x2="410" y2="280" stroke="#CCD5AE" strokeWidth="2" strokeDasharray="4 4" />
              <text x="260" y="160" fill="#CCD5AE" fontSize="11" fontFamily="monospace">
                Venous Return Inversion
              </text>
            </>
          )}

          {mode === 'prana' && (
            <circle cx="280" cy="290" r={20 + wave * 10} fill="url(#pranaHalo)" opacity="0.7" />
          )}
        </g>
      );
    }

    case 'savasana': {
      // Corpse Pose (Savasana)
      return (
        <g id="savasana-group">
          {/* Feet falling naturally outward */}
          <ellipse cx="440" cy="305" rx="14" ry="7" fill="url(#bodySkin)" />
          <ellipse cx="430" cy="315" rx="14" ry="7" fill="url(#bodySkin)" />

          {/* Whole body lying flat, surrender to gravity */}
          <line x1="430" y1="310" x2="310" y2="305" stroke="url(#linenPants)" strokeWidth="22" strokeLinecap="round" />
          {/* Breathing abdomen and chest undulating gently */}
          <line
            x1="310"
            y1="305"
            x2="190"
            y2={`305`}
            stroke="url(#linenTops)"
            strokeWidth={24 + wave * 4}
            strokeLinecap="round"
          />

          {/* Head resting center */}
          <circle cx="160" cy="302" r="22" fill="url(#bodySkin)" />

          {/* Arms resting at sides, palms facing sky */}
          <line x1="240" y1="305" x2="290" y2="320" stroke="url(#bodySkin)" strokeWidth="12" strokeLinecap="round" />

          {/* Prana Light Body expanding */}
          {mode === 'prana' && (
            <ellipse cx="300" cy="300" rx={160 + wave * 30} ry={35 + wave * 15} fill="url(#pranaHalo)" />
          )}

          {mode === 'biomechanics' && (
            <text x="240" y="250" fill="#CCD5AE" fontSize="11" fontFamily="monospace">
              Zero Neuromuscular Tension
            </text>
          )}
        </g>
      );
    }

    default: {
      // Universal serene meditative flow pose fallback
      return (
        <g id="universal-group">
          <circle cx="300" cy="200" r={80 + wave * 20} fill="url(#pranaHalo)" />
          <path d="M220 310 Q300 325 380 310 Q350 340 300 345 Z" fill="url(#linenPants)" />
          <path d="M270 295 L275 220 Q300 210 325 220 L330 295 Z" fill="url(#linenTops)" />
          <circle cx="300" cy="165" r="26" fill="url(#bodySkin)" />
        </g>
      );
    }
  }
}
