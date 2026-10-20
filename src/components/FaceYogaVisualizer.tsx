/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Eye,
  Camera,
  CameraOff,
  Activity,
  Compass,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Info,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { soundSanctuary } from '../utils/soundSanctuary.ts';

export interface MarmaPointData {
  id: string;
  name: string;
  sanskrit: string;
  location: string;
  benefit: string;
  x: number; // percentage in SVG coordinate space (0-100)
  y: number;
}

export const FACIAL_MARMA_POINTS: MarmaPointData[] = [
  {
    id: 'sthapani',
    name: 'Sthapani Marma',
    sanskrit: 'स्थापनी मर्म',
    location: 'Center of forehead between the eyebrows (Third Eye / Ajna)',
    benefit: 'Soothes mental screen strain, stills racing thoughts, balances pituitary & melatonin rhythms.',
    x: 50,
    y: 32
  },
  {
    id: 'avarta-l',
    name: 'Avarta Marma (Left)',
    sanskrit: 'आवर्त मर्म',
    location: 'Depression at the midpoint directly above left eyebrow arch',
    benefit: 'Releases ocular fatigue, relieves forehead tension lines, lifts brow heaviness.',
    x: 37,
    y: 28
  },
  {
    id: 'avarta-r',
    name: 'Avarta Marma (Right)',
    sanskrit: 'आवर्त मर्म',
    location: 'Depression at the midpoint directly above right eyebrow arch',
    benefit: 'Dissolves concentration headaches and mental furrowing.',
    x: 63,
    y: 28
  },
  {
    id: 'shankha-l',
    name: 'Shankha Marma (Left Temple)',
    sanskrit: 'शङ्ख मर्म',
    location: 'Soft depression in the hollow of the left temple',
    benefit: 'Alleviates temporal stress, calms Pitta heat, relieves teeth-clenching headaches.',
    x: 23,
    y: 35
  },
  {
    id: 'shankha-r',
    name: 'Shankha Marma (Right Temple)',
    sanskrit: 'शङ्ख मर्म',
    location: 'Soft depression in the hollow of the right temple',
    benefit: 'Downregulates sympathetic nervous firing, cools ocular burning.',
    x: 77,
    y: 35
  },
  {
    id: 'krukatika-l',
    name: 'Krukatika (Masseter Left)',
    sanskrit: 'कृकाटिका मर्म',
    location: 'Angle of the jaw beneath earlobe over the masseter muscle',
    benefit: 'The key locus for releasing TMJ clenching, night bruxism, and emotional jaw armor.',
    x: 30,
    y: 62
  },
  {
    id: 'krukatika-r',
    name: 'Krukatika (Masseter Right)',
    sanskrit: 'कृकाटिका मर्म',
    location: 'Angle of the jaw beneath right earlobe over the masseter muscle',
    benefit: 'Unlocks deep subconscious anger and emotional gripping stored in the jaw.',
    x: 70,
    y: 62
  },
  {
    id: 'hanu',
    name: 'Hanu Marma',
    sanskrit: 'हनु मर्म',
    location: 'Center depression in the chin directly below the lower lip',
    benefit: 'Regulates facial circulation, relaxes lower mentalis muscle, promotes lymphatic drainage.',
    x: 50,
    y: 74
  },
  {
    id: 'kanthika',
    name: 'Kanthika Marma',
    sanskrit: 'कण्ठिका मर्म',
    location: 'Jugular notch at the soft base of the throat pit',
    benefit: 'Tones the platysma sheath, stimulates thyroid/parathyroid, enhances vocal resonance.',
    x: 50,
    y: 89
  }
];

interface FaceYogaVisualizerProps {
  routineId: string;
  stepIndex: number;
  stepName: string;
  marmaPointName: string;
  instructions: string;
  secondsRemaining: number;
  totalSeconds: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
}

export const FaceYogaVisualizer: React.FC<FaceYogaVisualizerProps> = ({
  routineId,
  stepIndex,
  stepName,
  marmaPointName,
  instructions,
  secondsRemaining,
  totalSeconds,
  isPlaying,
  onTogglePlay,
  onReset
}) => {
  const [activeTab, setActiveTab] = useState<'motion' | 'anatomy' | 'technique' | 'mirror'>('motion');
  const [selectedMarma, setSelectedMarma] = useState<MarmaPointData | null>(null);
  const [animProgress, setAnimProgress] = useState<number>(0);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Animation cycle loop for stroke motions & breath rhythm (4 second cycle)
  useEffect(() => {
    let animId: number;
    let startTime = performance.now();
    const cycleDuration = 4000; // 4s cycle

    const loop = (timestamp: number) => {
      const elapsed = (timestamp - startTime) % cycleDuration;
      setAnimProgress(elapsed / cycleDuration);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Camera stream handling for Selfie Mirror mode
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (activeTab === 'mirror') {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            setCameraActive(true);
          }
        })
        .catch(() => {
          setCameraActive(false);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const s = videoRef.current.srcObject as MediaStream;
        s.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [activeTab]);

  // Determine current active Marma point based on prop
  const currentMarma =
    FACIAL_MARMA_POINTS.find(
      (m) =>
        marmaPointName.toLowerCase().includes(m.name.toLowerCase().split(' ')[0]) ||
        marmaPointName.toLowerCase().includes(m.id)
    ) || FACIAL_MARMA_POINTS[0];

  // Stroke movement interpolations
  // Phase: 0-0.5 Exhale & Glide, 0.5-1.0 Inhale & Reset
  const isGlidePhase = animProgress < 0.6;
  const glideFactor = isGlidePhase ? animProgress / 0.6 : 1 - (animProgress - 0.6) / 0.4;

  return (
    <div className="bg-[#12161A] text-[#F9F6F0] rounded-3xl overflow-hidden border border-[#2D3944] shadow-xl">
      {/* Visualizer Top Bar Controls */}
      <div className="p-4 sm:p-5 border-b border-[#222B33] flex flex-wrap items-center justify-between gap-3 bg-[#161C22]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E0AFA0] animate-ping" />
          <span className="font-semibold text-xs tracking-wider uppercase text-[#E0AFA0]">
            Somatic Facial Motion & Acupressure Guide
          </span>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1 bg-[#1F2730] p-1 rounded-xl border border-[#313E4B] text-xs">
          <button
            onClick={() => setActiveTab('motion')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'motion'
                ? 'bg-[#E0AFA0] text-[#12161A] font-semibold shadow-xs'
                : 'text-[#A0ACB8] hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Animated Motion</span>
          </button>

          <button
            onClick={() => setActiveTab('anatomy')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'anatomy'
                ? 'bg-[#E0AFA0] text-[#12161A] font-semibold shadow-xs'
                : 'text-[#A0ACB8] hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Marma Points</span>
          </button>

          <button
            onClick={() => setActiveTab('technique')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'technique'
                ? 'bg-[#E0AFA0] text-[#12161A] font-semibold shadow-xs'
                : 'text-[#A0ACB8] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Pressure & Muscles</span>
          </button>

          <button
            onClick={() => setActiveTab('mirror')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'mirror'
                ? 'bg-[#E0AFA0] text-[#12161A] font-semibold shadow-xs'
                : 'text-[#A0ACB8] hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Selfie Mirror</span>
          </button>
        </div>
      </div>

      {/* Main Visual Stage */}
      <div className="relative w-full h-[400px] sm:h-[460px] bg-gradient-to-b from-[#13191F] via-[#11161B] to-[#0D1115] flex items-center justify-center overflow-hidden">
        {/* Soft Ambient Radial Glow centered behind face */}
        <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-[#E0AFA0]/10 blur-3xl pointer-events-none" />

        {/* Pressure & Muscle Mechanics Technique Breakdown Mode */}
        {activeTab === 'technique' ? (
          <div className="relative w-full h-full p-6 overflow-y-auto flex flex-col justify-between max-w-2xl mx-auto space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-semibold text-[#E0AFA0] tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Anatomical Pressure & Muscle Release Blueprint</span>
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-white font-medium">
                {stepName}
              </h3>
              <p className="text-xs text-[#A0ACB8] leading-relaxed">
                {instructions}
              </p>
            </div>

            {/* Visual Pressure Gauge & Tactile Scale */}
            <div className="bg-[#182129] p-4 rounded-2xl border border-[#2B3946] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white">Somatic Pressure Meter</span>
                <span className="font-mono text-[#E0AFA0]">
                  {routineId === 'brow-smoothing'
                    ? '15–20g (Light Feather Glide)'
                    : routineId === 'jaw-tmj'
                    ? '45–60g (Myofascial Glide)'
                    : '40–50g (Clavicular Traction Anchor)'}
                </span>
              </div>

              {/* Graphical Pressure Bar */}
              <div className="w-full bg-[#11161B] h-3 rounded-full overflow-hidden p-0.5 border border-[#303E4C]">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    routineId === 'brow-smoothing'
                      ? 'w-[25%] bg-gradient-to-r from-emerald-400 to-[#E0AFA0]'
                      : routineId === 'jaw-tmj'
                      ? 'w-[65%] bg-gradient-to-r from-amber-400 to-[#E0AFA0]'
                      : 'w-[50%] bg-gradient-to-r from-cyan-400 to-[#E0AFA0]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-3 text-[10px] text-[#7A8A99] text-center pt-0.5">
                <span>Feather (Lymphatic)</span>
                <span className="font-medium text-[#CAD4DF]">Myofascial (Fascial Glide)</span>
                <span>Deep (Marma Point)</span>
              </div>
            </div>

            {/* Target Muscle & Hand Formation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#161E26] p-3.5 rounded-2xl border border-[#273543] space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#D4A373] block">
                  Target Muscle Group
                </span>
                <h4 className="font-semibold text-white">
                  {routineId === 'jaw-tmj'
                    ? 'Masseter & Temporalis Fascia'
                    : routineId === 'brow-smoothing'
                    ? 'Frontalis & Corrugator Supercilii'
                    : 'Platysma Sheath & Hyoid Sling'}
                </h4>
                <p className="text-[11px] text-[#8C9AA8] leading-tight">
                  {routineId === 'jaw-tmj'
                    ? 'Releases 80% of subconscious bite force clenching, softening the lower jaw angles.'
                    : routineId === 'brow-smoothing'
                    ? 'Smoothes horizontal forehead worry furrows and releases ocular screen fatigue.'
                    : 'Tones cervical platysma fibers and counteracts forward-head computer slump.'}
                </p>
              </div>

              <div className="bg-[#161E26] p-3.5 rounded-2xl border border-[#273543] space-y-1">
                <span className="text-[10px] uppercase font-semibold text-[#D4A373] block">
                  Recommended Hand Grip
                </span>
                <h4 className="font-semibold text-white">
                  {routineId === 'jaw-tmj'
                    ? stepIndex === 1
                      ? 'Soft Flat Knuckles'
                      : 'Three Finger Pads Spiral'
                    : routineId === 'brow-smoothing'
                    ? stepIndex === 0
                      ? 'Horizontal Index Finger Pads'
                      : 'Thumb & Index Finger Pinch'
                    : stepIndex === 0
                    ? 'Skyward Lip Pout + Swallow'
                    : 'Dual Crossed Clavicle Anchor'}
                </h4>
                <p className="text-[11px] text-[#8C9AA8] leading-tight">
                  Always use light facial oil to provide effortless glide without tugging delicate skin capillaries.
                </p>
              </div>
            </div>
          </div>
        ) : activeTab === 'mirror' ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {cameraActive ? (
              <div className="relative w-full h-full max-w-lg overflow-hidden rounded-2xl border border-[#354350]">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                {/* Overlaid Facial Alignment Target Silhouette */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40">
                  <svg viewBox="0 0 100 100" className="w-64 h-64 text-[#E0AFA0] stroke-current fill-none stroke-[0.8] stroke-dasharray-[3,3]">
                    <ellipse cx="50" cy="46" rx="26" ry="34" />
                    <line x1="50" y1="12" x2="50" y2="80" />
                    <line x1="24" y1="46" x2="76" y2="46" />
                  </svg>
                </div>
                <div className="absolute bottom-3 left-3 right-3 bg-[#12161A]/85 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-xs text-center text-[#E0AFA0]">
                  Match your face into the frame. Follow the animated stroke motion with gentle fingertip pressure.
                </div>
              </div>
            ) : (
              <div className="text-center p-6 space-y-3 max-w-sm">
                <CameraOff className="w-10 h-10 text-[#8C9AA8] mx-auto" />
                <h4 className="font-serif text-lg text-white">Camera Access Required</h4>
                <p className="text-xs text-[#8C9AA8] leading-relaxed">
                  Allow camera permissions in your browser to mirror and verify your hand placement in real-time.
                </p>
                <button
                  onClick={() => setActiveTab('motion')}
                  className="px-4 py-2 rounded-xl bg-[#E0AFA0] text-[#12161A] text-xs font-semibold cursor-pointer"
                >
                  Return to Animated Visual
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Animated Vector Anatomical Face */
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full max-h-[380px] max-w-[380px] select-none"
            >
              <defs>
                {/* Radiant Glow Filter */}
                <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <filter id="pulseGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#252D36" />
                  <stop offset="60%" stopColor="#1E252D" />
                  <stop offset="100%" stopColor="#191F26" />
                </linearGradient>
                <linearGradient id="muscleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E0AFA0" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#D4A373" stopOpacity="0.15" />
                </linearGradient>
              </defs>

              {/* Serene Head & Neck Contour */}
              <g className="transition-all duration-500">
                {/* Neck & Trapezius */}
                <path
                  d="M 37 72 C 37 84 25 96 15 100 L 85 100 C 75 96 63 84 63 72 Z"
                  fill="url(#skinGrad)"
                  stroke="#3A4856"
                  strokeWidth="0.8"
                />

                {/* Platysma Muscle Sheath Highlight (for Neck Lift routine) */}
                {routineId === 'neck-platysma' && (
                  <path
                    d="M 39 74 C 40 85 30 95 20 98 L 80 98 C 70 95 60 85 61 74 Z"
                    fill="url(#muscleGrad)"
                    stroke="#E0AFA0"
                    strokeWidth="0.6"
                    strokeDasharray="2,2"
                    opacity={0.7}
                  />
                )}

                {/* Cranium & Jaw Outline */}
                <path
                  d="M 50 12 C 28 12 25 28 25 46 C 25 64 36 76 50 78 C 64 76 75 64 75 46 C 75 28 72 12 50 12 Z"
                  fill="url(#skinGrad)"
                  stroke="#475666"
                  strokeWidth="0.9"
                />

                {/* Ears */}
                <path
                  d="M 25 40 C 22 40 21 48 24 54 C 25 56 26 55 25 51 Z"
                  fill="#1C232A"
                  stroke="#3A4856"
                  strokeWidth="0.7"
                />
                <path
                  d="M 75 40 C 78 40 79 48 76 54 C 75 56 74 55 75 51 Z"
                  fill="#1C232A"
                  stroke="#3A4856"
                  strokeWidth="0.7"
                />

                {/* Eyebrow Arches */}
                <path
                  d="M 32 34 Q 40 31 47 34"
                  stroke="#8C9CA8"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 53 34 Q 60 31 68 34"
                  stroke="#8C9CA8"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Eyes (Serenely Closed in Meditation) */}
                <path
                  d="M 34 40 Q 40 44 46 40"
                  stroke="#D4A373"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 54 40 Q 60 44 66 40"
                  stroke="#D4A373"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Soft Eyelashes */}
                <line x1="40" y1="42" x2="40" y2="44" stroke="#D4A373" strokeWidth="0.8" />
                <line x1="60" y1="42" x2="60" y2="44" stroke="#D4A373" strokeWidth="0.8" />

                {/* Gentle Nose Ridge & Base */}
                <path
                  d="M 50 35 L 50 51 Q 48 53 46 53 Q 50 54 54 53 Q 52 53 50 51"
                  stroke="#637382"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Relaxed Lips & Smile Line */}
                <path
                  d="M 43 62 Q 50 64 57 62"
                  stroke="#E0AFA0"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 46 65 Q 50 67 54 65"
                  stroke="#8C9CA8"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Chin Soft Depression */}
                <ellipse cx="50" cy="72" rx="3.5" ry="1.5" fill="#20272F" opacity="0.6" />
              </g>

              {/* Dynamic Muscle Tension Highlight Layer */}
              {routineId === 'jaw-tmj' && (
                <g className="transition-opacity duration-300">
                  {/* Left Masseter Muscle */}
                  <path
                    d="M 28 48 C 29 55 31 63 34 67 C 32 67 27 58 28 48 Z"
                    fill="url(#muscleGrad)"
                    stroke="#E0AFA0"
                    strokeWidth="0.6"
                    opacity={0.8}
                  />
                  {/* Right Masseter Muscle */}
                  <path
                    d="M 72 48 C 71 55 69 63 66 67 C 68 67 73 58 72 48 Z"
                    fill="url(#muscleGrad)"
                    stroke="#E0AFA0"
                    strokeWidth="0.6"
                    opacity={0.8}
                  />
                </g>
              )}

              {routineId === 'brow-smoothing' && (
                <g className="transition-opacity duration-300">
                  {/* Frontalis & Corrugator Muscle Band */}
                  <rect
                    x="30"
                    y="22"
                    width="40"
                    height="10"
                    rx="3"
                    fill="url(#muscleGrad)"
                    stroke="#E0AFA0"
                    strokeWidth="0.6"
                    opacity={0.7}
                  />
                </g>
              )}

              {/* Animated Motion Vectors & Stroke Guides (Mode: motion) */}
              {activeTab === 'motion' && (
                <g className="stroke-guides">
                  {/* Routine 1: TMJ Masseter Knuckle Glide Downward */}
                  {routineId === 'jaw-tmj' && stepIndex === 1 && (
                    <g>
                      {/* Left Masseter Glide Track */}
                      <path
                        d="M 30 46 L 33 66"
                        stroke="#E0AFA0"
                        strokeWidth="1.5"
                        strokeDasharray="2,2"
                        strokeLinecap="round"
                      />
                      {/* Left Moving Pressure Knuckle Node */}
                      <circle
                        cx={30 + 3 * glideFactor}
                        cy={46 + 20 * glideFactor}
                        r="3.5"
                        fill="#E0AFA0"
                        filter="url(#glowGold)"
                      />
                      <circle
                        cx={30 + 3 * glideFactor}
                        cy={46 + 20 * glideFactor}
                        r="6"
                        fill="none"
                        stroke="#E0AFA0"
                        strokeWidth="0.6"
                        opacity={1 - glideFactor}
                      />

                      {/* Right Masseter Glide Track */}
                      <path
                        d="M 70 46 L 67 66"
                        stroke="#E0AFA0"
                        strokeWidth="1.5"
                        strokeDasharray="2,2"
                        strokeLinecap="round"
                      />
                      {/* Right Moving Pressure Knuckle Node */}
                      <circle
                        cx={70 - 3 * glideFactor}
                        cy={46 + 20 * glideFactor}
                        r="3.5"
                        fill="#E0AFA0"
                        filter="url(#glowGold)"
                      />
                      <circle
                        cx={70 - 3 * glideFactor}
                        cy={46 + 20 * glideFactor}
                        r="6"
                        fill="none"
                        stroke="#E0AFA0"
                        strokeWidth="0.6"
                        opacity={1 - glideFactor}
                      />

                      {/* Motion Indicator Label */}
                      <text
                        x="50"
                        y="82"
                        textAnchor="middle"
                        fill="#E0AFA0"
                        fontSize="3.2"
                        fontWeight="600"
                        letterSpacing="0.05em"
                      >
                        {isGlidePhase ? '↓ GLIDE DOWNWARD WITH EXHALE' : '↑ RELEASE & RESET TO CHEEKBONE'}
                      </text>
                    </g>
                  )}

                  {/* Routine 1: TMJ Temple Release Circular Outward */}
                  {routineId === 'jaw-tmj' && stepIndex === 2 && (
                    <g>
                      {/* Temple Circles */}
                      <circle
                        cx="24"
                        cy="35"
                        r={4 + 2 * Math.sin(animProgress * Math.PI * 2)}
                        fill="none"
                        stroke="#E0AFA0"
                        strokeWidth="1.2"
                      />
                      <circle cx="24" cy="35" r="3" fill="#E0AFA0" filter="url(#glowGold)" />

                      <circle
                        cx="76"
                        cy="35"
                        r={4 + 2 * Math.sin(animProgress * Math.PI * 2)}
                        fill="none"
                        stroke="#E0AFA0"
                        strokeWidth="1.2"
                      />
                      <circle cx="76" cy="35" r="3" fill="#E0AFA0" filter="url(#glowGold)" />

                      <text
                        x="50"
                        y="82"
                        textAnchor="middle"
                        fill="#E0AFA0"
                        fontSize="3.2"
                        fontWeight="600"
                      >
                        ↻ SLOW OUTWARD SPIRALS WITH PARTED LIPS
                      </text>
                    </g>
                  )}

                  {/* Routine 1: Gentle Jaw Drop & Tongue Sweep */}
                  {routineId === 'jaw-tmj' && stepIndex === 0 && (
                    <g>
                      {/* Circular tongue path behind lips */}
                      <ellipse
                        cx="50"
                        cy="63"
                        rx="7"
                        ry="4"
                        fill="none"
                        stroke="#E0AFA0"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                      />
                      {/* Moving tongue particle */}
                      <circle
                        cx={50 + 6 * Math.cos(animProgress * Math.PI * 2)}
                        cy={63 + 3.5 * Math.sin(animProgress * Math.PI * 2)}
                        r="2.5"
                        fill="#D4A373"
                        filter="url(#glowGold)"
                      />
                      <text
                        x="50"
                        y="82"
                        textAnchor="middle"
                        fill="#D4A373"
                        fontSize="3.2"
                        fontWeight="600"
                      >
                        ↻ SMOOTH CIRCULAR TONGUE SWEEP · LOWER JAW SLACK
                      </text>
                    </g>
                  )}

                  {/* Routine 2: Horizontal Brow Wave Sweep */}
                  {routineId === 'brow-smoothing' && stepIndex === 0 && (
                    <g>
                      {/* Outward Brow Sweep Arrows */}
                      <path
                        d="M 48 26 L 25 32"
                        stroke="#E0AFA0"
                        strokeWidth="1.5"
                        strokeDasharray="2,2"
                      />
                      <path
                        d="M 52 26 L 75 32"
                        stroke="#E0AFA0"
                        strokeWidth="1.5"
                        strokeDasharray="2,2"
                      />

                      {/* Moving Finger Pads Outward */}
                      <circle
                        cx={48 - 22 * glideFactor}
                        cy={26 + 6 * glideFactor}
                        r="3"
                        fill="#E0AFA0"
                        filter="url(#glowGold)"
                      />
                      <circle
                        cx={52 + 22 * glideFactor}
                        cy={26 + 6 * glideFactor}
                        r="3"
                        fill="#E0AFA0"
                        filter="url(#glowGold)"
                      />

                      <text
                        x="50"
                        y="18"
                        textAnchor="middle"
                        fill="#E0AFA0"
                        fontSize="3.2"
                        fontWeight="600"
                      >
                        ← SWEEP OUTWARD TOWARD TEMPLES →
                      </text>
                    </g>
                  )}

                  {/* Routine 2: Eyebrow Pinch & Walk */}
                  {routineId === 'brow-smoothing' && stepIndex === 1 && (
                    <g>
                      {/* Left and right eyebrow arch pinches */}
                      <circle
                        cx={33 + 12 * glideFactor}
                        cy={34 - 2 * Math.sin(glideFactor * Math.PI)}
                        r="3"
                        fill="#D4A373"
                        filter="url(#glowGold)"
                      />
                      <circle
                        cx={67 - 12 * glideFactor}
                        cy={34 - 2 * Math.sin(glideFactor * Math.PI)}
                        r="3"
                        fill="#D4A373"
                        filter="url(#glowGold)"
                      />
                      <text
                        x="50"
                        y="18"
                        textAnchor="middle"
                        fill="#D4A373"
                        fontSize="3.2"
                        fontWeight="600"
                      >
                        GENTLE PINCH & WALK FROM ARCH TO TAIL
                      </text>
                    </g>
                  )}

                  {/* Routine 3: Ceiling Kiss & Platysma Lift (Step 0) */}
                  {routineId === 'neck-platysma' && stepIndex === 0 && (
                    <g>
                      {/* Upward throat elongation arrows */}
                      <path
                        d="M 50 86 L 50 68"
                        stroke="#E0AFA0"
                        strokeWidth="1.5"
                        strokeDasharray="2,2"
                      />
                      <polygon
                        points="50,65 47,70 53,70"
                        fill="#E0AFA0"
                      />
                      {/* Moving pulse up neck */}
                      <circle
                        cx="50"
                        cy={86 - 20 * glideFactor}
                        r="3.5"
                        fill="#E0AFA0"
                        filter="url(#glowGold)"
                      />

                      <text
                        x="50"
                        y="95"
                        textAnchor="middle"
                        fill="#E0AFA0"
                        fontSize="3.2"
                        fontWeight="600"
                      >
                        ↑ POUT TO CEILING · GENTLE SWALLOW · TONE PLATYSMA
                      </text>
                    </g>
                  )}

                  {/* Routine 3: Collarbone Anchored Neck Traction (Step 1) */}
                  {routineId === 'neck-platysma' && stepIndex === 1 && (
                    <g>
                      {/* Dual Hand Clavicle Anchor */}
                      <rect
                        x="25"
                        y="88"
                        width="50"
                        height="7"
                        rx="2"
                        fill="#B88554"
                        opacity="0.85"
                      />
                      <text
                        x="50"
                        y="93"
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="2.4"
                        fontWeight="600"
                      >
                        DUAL CLAVICLE TRACTION ANCHOR ↓
                      </text>

                      {/* Lateral diagonal stretch vectors */}
                      <path
                        d="M 45 78 L 32 64"
                        stroke="#E0AFA0"
                        strokeWidth="1.5"
                        strokeDasharray="2,2"
                      />
                      <polygon points="30,62 35,64 32,67" fill="#E0AFA0" />

                      <path
                        d="M 55 78 L 68 64"
                        stroke="#E0AFA0"
                        strokeWidth="1.5"
                        strokeDasharray="2,2"
                      />
                      <polygon points="70,62 68,67 65,64" fill="#E0AFA0" />

                      <text
                        x="50"
                        y="60"
                        textAnchor="middle"
                        fill="#E0AFA0"
                        fontSize="3.2"
                        fontWeight="600"
                      >
                        ← TILT CHIN 45° LEFT · BREATHE · THEN RIGHT →
                      </text>
                    </g>
                  )}
                </g>
              )}

              {/* Marma Acupressure Points Overlay (Clickable & Glowing) */}
              <g className="marma-points">
                {FACIAL_MARMA_POINTS.map((m) => {
                  const isHighlighted =
                    currentMarma.id === m.id ||
                    (selectedMarma && selectedMarma.id === m.id);

                  return (
                    <g
                      key={m.id}
                      onClick={() => {
                        setSelectedMarma(m);
                        soundSanctuary.playSingingBowl(324);
                      }}
                      className="cursor-pointer group"
                    >
                      {/* Outer Pulse Wave for active point */}
                      {isHighlighted && (
                        <circle
                          cx={m.x}
                          cy={m.y}
                          r={5 + 3 * Math.sin(animProgress * Math.PI * 2)}
                          fill="none"
                          stroke="#E0AFA0"
                          strokeWidth="0.8"
                          opacity={0.8}
                        />
                      )}

                      {/* Main Marma Node */}
                      <circle
                        cx={m.x}
                        cy={m.y}
                        r={isHighlighted ? 3.2 : 2.2}
                        fill={isHighlighted ? '#FCEADE' : '#B88554'}
                        stroke={isHighlighted ? '#E0AFA0' : '#475666'}
                        strokeWidth={isHighlighted ? 1.2 : 0.6}
                        filter={isHighlighted ? 'url(#glowGold)' : undefined}
                        className="transition-all duration-300 group-hover:scale-125"
                      />

                      {/* Marma Label in Anatomy Mode */}
                      {activeTab === 'anatomy' && (
                        <text
                          x={m.x}
                          y={m.y - 4}
                          textAnchor="middle"
                          fill={isHighlighted ? '#FCEADE' : '#A0ACB8'}
                          fontSize="2.4"
                          fontWeight={isHighlighted ? 'bold' : 'normal'}
                          className="pointer-events-none select-none"
                        >
                          {m.name.split(' ')[0]}
                        </text>
                      )}
                    </g>
                  );
                })}
              </g>
            </svg>
          </div>
        )}

        {/* Breath Phase Indicator Badge at Top Right */}
        <div className="absolute top-4 right-4 bg-[#1B232B]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#313F4E] flex items-center gap-2 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              isGlidePhase ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
            }`}
          />
          <span className="font-mono text-[11px] text-[#E0AFA0]">
            {isGlidePhase ? 'Exhale · Gentle Glide' : 'Inhale · Soft Release'}
          </span>
        </div>

        {/* Active Marma Callout Chip at Bottom Left */}
        <div className="absolute bottom-4 left-4 max-w-[260px] bg-[#161D24]/90 backdrop-blur-md p-3 rounded-2xl border border-[#2F3E4D] shadow-md space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-[#D4A373] uppercase font-semibold">
            <Sparkles className="w-3 h-3 text-[#E0AFA0]" />
            <span>Target Marma Point</span>
          </div>
          <h4 className="font-serif text-xs sm:text-sm text-white font-medium">
            {selectedMarma?.name || currentMarma.name}
          </h4>
          <p className="text-[10px] text-[#A0ACB8] leading-tight">
            {selectedMarma?.benefit || currentMarma.benefit}
          </p>
        </div>
      </div>

      {/* Somatic Practice Guidance & Timer Controls Bar */}
      <div className="p-5 bg-[#161C22] border-t border-[#222B33] space-y-4">
        {/* Step Context & Instruction */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#E0AFA0] uppercase tracking-wider font-semibold">
              <span>Step {stepIndex + 1}</span>
              <span>·</span>
              <span>{stepName}</span>
            </div>
            <p className="text-xs sm:text-sm text-[#CAD4DF] leading-relaxed mt-1 max-w-2xl">
              {instructions}
            </p>
          </div>

          {/* Large Countdown Clock */}
          <div className="flex items-center gap-3 bg-[#1B232B] px-4 py-2.5 rounded-2xl border border-[#303E4C] shrink-0 self-stretch sm:self-auto justify-between sm:justify-end">
            <div className="text-left sm:text-right">
              <span className="font-serif text-2xl font-light text-white tabular-nums block leading-none">
                {Math.floor(secondsRemaining / 60)}:
                {(secondsRemaining % 60) < 10 ? '0' : ''}
                {secondsRemaining % 60}
              </span>
              <span className="text-[10px] text-[#8C9AA8] uppercase tracking-wider mt-0.5 block">
                {isPlaying ? 'Timer Running' : 'Paused'} · / {Math.floor(totalSeconds / 60)}:{(totalSeconds % 60) < 10 ? '0' : ''}{totalSeconds % 60}
              </span>
            </div>

            <button
              onClick={onTogglePlay}
              className="p-3 rounded-xl bg-[#E0AFA0] hover:bg-[#D4A373] text-[#12161A] transition-colors cursor-pointer shadow-sm"
              title={isPlaying ? 'Pause Timer' : 'Start Timer'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
