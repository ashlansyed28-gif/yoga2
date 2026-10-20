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
  Heart,
  Activity,
  Compass,
  CheckCircle2,
  Layers,
  Info,
  ChevronRight,
  User,
  Eye,
  Zap,
  Repeat,
  Box
} from 'lucide-react';
import { soundSanctuary } from '../utils/soundSanctuary.ts';
import { streakSystem } from '../utils/streakSystem.ts';
import { ThreeYogaHuman } from './ThreeYogaHuman.tsx';

export type MotionGuideType = 'stillness' | 'spine' | 'heart' | 'prana' | 'grounding';

interface ReplicationStep {
  step: number;
  phase: string;
  instruction: string;
}

interface MotionGuideConfig {
  id: MotionGuideType;
  title: string;
  poseName: string;
  sanskrit: string;
  theme: string;
  breathRhythm: { inhale: number; retain: number; exhale: number; settle: number };
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  clinicalCue: string;
  commonMistake: string;
  replicationSteps: ReplicationStep[];
  alignmentPoints: Array<{
    name: string;
    location: string;
    clinicalTip: string;
  }>;
}

const MOTION_CONFIGS: Record<MotionGuideType, MotionGuideConfig> = {
  stillness: {
    id: 'stillness',
    title: 'Deep Stillness',
    poseName: 'Seated Lotus Meditation (Sukhasana)',
    sanskrit: 'सुखासन ध्यान धारणा',
    theme: 'Calming the autonomic nervous system & steadying mental waves',
    breathRhythm: { inhale: 4, retain: 2, exhale: 4, settle: 2 },
    primaryColor: '#B88554',
    secondaryColor: '#E0AFA0',
    accentColor: '#D4A373',
    clinicalCue: 'Allow the pelvic basin to drop like heavy stone while the occipital skull floats effortlessly upward.',
    commonMistake: 'Slumping the lumbar spine or tensing the shoulders up toward the ears.',
    replicationSteps: [
      { step: 1, phase: 'Setup Base', instruction: 'Sit on a mat or cushion. Cross shins gently, placing feet under opposite knees.' },
      { step: 2, phase: 'Spine & Hands', instruction: 'Rest wrists on knees in Chin Mudra (index finger lightly touching thumb tip).' },
      { step: 3, phase: 'Inhale (4s)', instruction: 'Lengthen the spine upward, broaden collarbones, and feel chest softly expand.' },
      { step: 4, phase: 'Exhale (4s)', instruction: 'Drop shoulders down away from ears, soften jaw, and root sit bones into mat.' }
    ],
    alignmentPoints: [
      { name: 'Occipital Crown', location: 'Top of Head', clinicalTip: 'Gently tuck chin 2mm to lengthen suboccipital muscles and reduce cervical strain.' },
      { name: 'Thoracic Heart', location: 'Center of Chest', clinicalTip: 'Broaden collarbones outward without thrusting front ribs forward.' },
      { name: 'Sushumna Axis', location: 'Spinal Core', clinicalTip: 'Visualize a luminous vertical filament of light connecting root to crown.' },
      { name: 'Ischial Tuberosities', location: 'Sit Bones', clinicalTip: 'Distribute 50/50 pelvic weight into the bolster to relieve hip flexor gripping.' }
    ]
  },
  spine: {
    id: 'spine',
    title: 'Spinal Softening',
    poseName: 'Cat-Cow Spinal Wave (Marjaryasana-Bitilasana)',
    sanskrit: 'मार्जरी-कशेरुका तरंग',
    theme: 'Articulating individual vertebrae & hydrating intervertebral discs',
    breathRhythm: { inhale: 5, retain: 1, exhale: 5, settle: 1 },
    primaryColor: '#6C7A4D',
    secondaryColor: '#CCD5AE',
    accentColor: '#8C9B6A',
    clinicalCue: 'Initiate every wave from the tailbone first; let the skull be the very last to tilt.',
    commonMistake: 'Bending elbows or cranking the neck backwards rather than moving the spine.',
    replicationSteps: [
      { step: 1, phase: 'Tabletop Stance', instruction: 'Come to hands and knees. Wrists directly under shoulders, knees under hips.' },
      { step: 2, phase: 'Inhale Cow (5s)', instruction: 'Dip belly down toward floor, tilt tailbone up, roll shoulders back, gaze forward.' },
      { step: 3, phase: 'Exhale Cat (5s)', instruction: 'Press palms down, dome spine up toward ceiling, tuck tailbone, chin to chest.' },
      { step: 4, phase: 'Fluid Wave', instruction: 'Continue moving smoothly between Cat and Cow with each breath like an ocean wave.' }
    ],
    alignmentPoints: [
      { name: 'Cervical Curve (C1-C7)', location: 'Neck Base', clinicalTip: 'Keep back of neck unwrinkled during extension to prevent arterial compression.' },
      { name: 'Thoracic Kyphosis (T1-T12)', location: 'Mid Back', clinicalTip: 'Direct the breath between the shoulder blades to free frozen rib articulations.' },
      { name: 'Lumbar Lordosis (L1-L5)', location: 'Lower Back', clinicalTip: 'Maintain gentle transverse abdominis engagement to protect L4-L5 discs.' },
      { name: 'Sacral Base', location: 'Tailbone', clinicalTip: 'Tuck tailbone downward smoothly on exhale to decompress the sacroiliac joint.' }
    ]
  },
  heart: {
    id: 'heart',
    title: 'Heart Space Ease',
    poseName: 'Melting Heart Puppy Pose (Anahatasana)',
    sanskrit: 'अनाहत चक्र विस्तार',
    theme: 'Unburdening emotional constriction & opening thoracic spine',
    breathRhythm: { inhale: 4, retain: 4, exhale: 4, settle: 4 }, // Sama Vritti
    primaryColor: '#CE4257',
    secondaryColor: '#E0AFA0',
    accentColor: '#F4A261',
    clinicalCue: 'Inhale into the back of the heart as much as the front. True opening happens 360 degrees.',
    commonMistake: 'Letting hips drift forward past the knees or straining the cervical neck.',
    replicationSteps: [
      { step: 1, phase: 'Kneeling Alignment', instruction: 'Start on all fours. Keep hips stacked strictly directly above your knees.' },
      { step: 2, phase: 'Walk Arms Forward', instruction: 'Walk hands forward along the mat shoulder-width apart, arms straight.' },
      { step: 3, phase: 'Melt Heart on Exhale', instruction: 'Soften chest down toward the mat, resting forehead or chin lightly on floor.' },
      { step: 4, phase: 'Breathe in Anahata', instruction: 'Breathe deeply into the upper chest and under armpits, feeling tension melt.' }
    ],
    alignmentPoints: [
      { name: 'Manubrium Sterni', location: 'Upper Breastbone', clinicalTip: 'Lift the breastbone at a 45-degree angle toward the dawn sun.' },
      { name: 'Scapular Depressors', location: 'Shoulder Blades', clinicalTip: 'Slide lower scapular tips toward back pockets to release neck tension.' },
      { name: 'Pectoralis Minor', location: 'Front Shoulders', clinicalTip: 'Allow external humeral rotation to open congested respiratory pathways.' },
      { name: 'Vagus Nerve Conduit', location: 'Diaphragm Core', clinicalTip: 'Feel the vagus nerve signal safety to the heart rate variability pacemaker.' }
    ]
  },
  prana: {
    id: 'prana',
    title: 'Restorative Prana',
    poseName: 'Legs-Up-The-Wall Pose (Viparita Karani)',
    sanskrit: 'विपरीत करणी प्राण संचार',
    theme: 'Replenishing cellular vitality & relieving nervous exhaustion',
    breathRhythm: { inhale: 4, retain: 7, exhale: 8, settle: 1 }, // 4-7-8 parasympathetic
    primaryColor: '#3A6073',
    secondaryColor: '#64B5F6',
    accentColor: '#81D4FA',
    clinicalCue: 'Surrender all muscular holding. Let gravity pull blood back toward the liver and kidneys.',
    commonMistake: 'Placing hips too far from the wall or locking the knees rigidly.',
    replicationSteps: [
      { step: 1, phase: 'Wall & Bolster Setup', instruction: 'Place a folded blanket or bolster 4 inches away from a smooth wall.' },
      { step: 2, phase: 'Extend Legs Upward', instruction: 'Lie on your back, swinging legs straight up the wall, resting hips on support.' },
      { step: 3, phase: 'Open Arms Wide', instruction: 'Rest arms out by sides at 45 degrees, palms facing ceiling, chest wide.' },
      { step: 4, phase: '4-7-8 Breath', instruction: 'Inhale 4s, hold prana 7s, exhale 8s through lips, allowing nervous system to settle.' }
    ],
    alignmentPoints: [
      { name: 'Ida & Pingala Nadis', location: 'Dual Channels', clinicalTip: 'Balance the cooling moon (left) and warming sun (right) energetic streams.' },
      { name: 'Cellular Mitochondria', location: 'Whole Body', clinicalTip: 'Sustained parasympathetic breath signals cellular DNA repair pathways.' },
      { name: 'Venous Return Valve', location: 'Lower Limbs', clinicalTip: 'Inverted legs reduce lymphatic stagnation in calves and ankles effortlessly.' },
      { name: 'Pituitary Gland Focus', location: 'Third Eye', clinicalTip: 'Cool, downward inverted blood flow soothes the neuroendocrine master gland.' }
    ]
  },
  grounding: {
    id: 'grounding',
    title: 'Rooted Grounding',
    poseName: 'Mountain to Upward Salute (Tadasana to Urdhva Hastasana)',
    sanskrit: 'मूलाधार पृथ्वी स्थिरता',
    theme: 'Anchoring scattered mental speed & stabilizing the base energy center',
    breathRhythm: { inhale: 5, retain: 2, exhale: 5, settle: 3 },
    primaryColor: '#73532C',
    secondaryColor: '#D4A373',
    accentColor: '#9E6E38',
    clinicalCue: 'Feel three points of contact on each foot: big toe mound, pinky toe mound, and center of heel.',
    commonMistake: 'Arching lower back excessively when raising arms or locking knees backward.',
    replicationSteps: [
      { step: 1, phase: 'Standing Base', instruction: 'Stand with feet parallel, hip-width apart. Spread toes wide and grip earth.' },
      { step: 2, phase: 'Inhale Sweep Arms Up', instruction: 'Inhale deeply as arms sweep wide and overhead, joining palms in Anjali Mudra.' },
      { step: 3, phase: 'Exhale Lower to Heart', instruction: 'Exhale lowering hands slowly through heart center back to Mountain Pose.' },
      { step: 4, phase: 'Root & Lengthen', instruction: 'Feel roots pushing down into the earth as the crown of head reaches to the sky.' }
    ],
    alignmentPoints: [
      { name: 'Muladhara Core', location: 'Perineal Base', clinicalTip: 'Gently draw the pelvic floor inward and upward to contain energetic leakage.' },
      { name: 'Center of Gravity', location: '2 Inches Below Navel', clinicalTip: 'Rest mental awareness in the lower Dantian to still galloping thoughts.' },
      { name: 'Knee Micro-Flexion', location: 'Joint Springs', clinicalTip: 'Never lock knees; keep a 1% soft spring to absorb terrestrial ground force.' },
      { name: 'Earth Podalic Arches', location: 'Soles of Feet', clinicalTip: 'Engage the plantar vault to awaken reciprocal stabilizing reflexes in the hips.' }
    ]
  }
};

interface ProceduralMotionGuideProps {
  selectedType: MotionGuideType | string;
  onSelectType?: (type: MotionGuideType) => void;
  className?: string;
  showPracticeLogger?: boolean;
}

export const ProceduralMotionGuide: React.FC<ProceduralMotionGuideProps> = ({
  selectedType: rawType,
  onSelectType,
  className = '',
  showPracticeLogger = true
}) => {
  // Normalize type
  const activeType: MotionGuideType = ((): MotionGuideType => {
    const k = rawType.toLowerCase();
    if (k.includes('spine')) return 'spine';
    if (k.includes('heart')) return 'heart';
    if (k.includes('prana')) return 'prana';
    if (k.includes('ground')) return 'grounding';
    return 'stillness';
  })();

  const config = MOTION_CONFIGS[activeType] || MOTION_CONFIGS.stillness;

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [breathPace, setBreathPace] = useState<'gentle' | 'normal' | 'deep'>('normal');
  const [animTime, setAnimTime] = useState<number>(0);
  const [soundChime, setSoundChime] = useState<boolean>(true);
  const [activePointIdx, setActivePointIdx] = useState<number>(0);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'3d' | 'human' | 'skeleton' | 'prana'>('3d');
  const [mirrorMode, setMirrorMode] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastPhaseRef = useRef<string>('inhale');

  // Cycle durations based on rhythm
  const paceMultiplier = breathPace === 'gentle' ? 0.8 : breathPace === 'deep' ? 1.3 : 1.0;
  const inhaleDur = config.breathRhythm.inhale * paceMultiplier;
  const retainDur = config.breathRhythm.retain * paceMultiplier;
  const exhaleDur = config.breathRhythm.exhale * paceMultiplier;
  const settleDur = config.breathRhythm.settle * paceMultiplier;
  const totalCycleDur = inhaleDur + retainDur + exhaleDur + settleDur;

  // Frame animation loop
  useEffect(() => {
    if (!isPlaying) return;

    let animId: number;
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const dt = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      setAnimTime((t) => (t + dt) % totalCycleDur);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, totalCycleDur]);

  // Determine current breath phase and expansion progress (0 to 1)
  const currentPhase: 'inhale' | 'retain' | 'exhale' | 'settle' = ((): 'inhale' | 'retain' | 'exhale' | 'settle' => {
    const t = animTime;
    if (t < inhaleDur) return 'inhale';
    if (t < inhaleDur + retainDur) return 'retain';
    if (t < inhaleDur + retainDur + exhaleDur) return 'exhale';
    return 'settle';
  })();

  const phaseProgress: number = ((): number => {
    const t = animTime;
    if (currentPhase === 'inhale') return t / inhaleDur;
    if (currentPhase === 'retain') return 1;
    if (currentPhase === 'exhale') return 1 - (t - (inhaleDur + retainDur)) / exhaleDur;
    return 0;
  })();

  // Trigger gentle bowl on phase switch
  useEffect(() => {
    if (lastPhaseRef.current !== currentPhase) {
      if (soundChime && isPlaying) {
        if (currentPhase === 'inhale') {
          soundSanctuary.playSingingBowl(216);
        } else if (currentPhase === 'exhale') {
          soundSanctuary.playZenTingsha();
        }
      }
      lastPhaseRef.current = currentPhase;
    }
  }, [currentPhase, soundChime, isPlaying]);

  // Main Canvas Render Loop (Draws Realistic Animated Human Model)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 380);

    const cx = width / 2;
    const cy = height / 2;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Warm Studio Backdrop Gradient
    const bgGrad = ctx.createRadialGradient(cx, cy - 20, 40, cx, cy, Math.max(width, height) / 1.3);
    bgGrad.addColorStop(0, '#1C232A');
    bgGrad.addColorStop(0.7, '#12161A');
    bgGrad.addColorStop(1, '#0C0E11');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Soft Studio Lighting Radial Spot
    const spotGrad = ctx.createRadialGradient(cx, cy + 80, 20, cx, cy + 80, 220);
    spotGrad.addColorStop(0, 'rgba(212, 163, 115, 0.12)');
    spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = spotGrad;
    ctx.fillRect(0, 0, width, height);

    // Yoga Mat on Studio Floor
    ctx.save();
    if (mirrorMode) {
      ctx.translate(width, 0);
      ctx.scale(-1, 1);
    }

    const matY = cy + 120;
    // Mat shadow
    ctx.beginPath();
    ctx.ellipse(cx, matY + 4, width * 0.42, 10, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fill();

    // Mat surface
    ctx.beginPath();
    ctx.roundRect(cx - width * 0.38, matY - 6, width * 0.76, 12, 6);
    ctx.fillStyle = '#263440';
    ctx.fill();
    ctx.strokeStyle = '#394B5A';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Render Human Figure According to Active Motion Guide
    const canvasMode: 'human' | 'skeleton' | 'prana' = viewMode === '3d' ? 'human' : viewMode;
    if (activeType === 'stillness') {
      renderHumanStillness(ctx, cx, cy, phaseProgress, animTime, config, canvasMode);
    } else if (activeType === 'spine') {
      renderHumanCatCow(ctx, cx, cy, phaseProgress, animTime, config, canvasMode);
    } else if (activeType === 'heart') {
      renderHumanMeltingHeart(ctx, cx, cy, phaseProgress, animTime, config, canvasMode);
    } else if (activeType === 'prana') {
      renderHumanViparitaKarani(ctx, cx, cy, phaseProgress, animTime, config, canvasMode);
    } else if (activeType === 'grounding') {
      renderHumanTadasana(ctx, cx, cy, phaseProgress, animTime, config, canvasMode);
    }

    ctx.restore();
  }, [activeType, phaseProgress, animTime, config, viewMode, mirrorMode]);

  // =========================================================================
  // 1. HUMAN FIGURE: DEEP STILLNESS (Sukhasana / Padmasana Seated Lotus)
  // =========================================================================
  const renderHumanStillness = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    expansion: number,
    time: number,
    cfg: MotionGuideConfig,
    mode: 'human' | 'skeleton' | 'prana'
  ) => {
    // Kinematic Breath undulation: Chest lifts 6px, expands 8px on inhale
    const breathLift = expansion * 6;
    const ribExpansion = expansion * 7;
    const bodyBaseY = cy + 105;

    // Prana Aura field
    if (mode === 'prana') {
      const haloGrad = ctx.createRadialGradient(cx, cy - 20, 20, cx, cy - 20, 140 * (1 + expansion * 0.2));
      haloGrad.addColorStop(0, 'rgba(212, 163, 115, 0.3)');
      haloGrad.addColorStop(0.6, 'rgba(224, 175, 160, 0.15)');
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = haloGrad;
      ctx.beginPath();
      ctx.arc(cx, cy - 20, 140 * (1 + expansion * 0.2), 0, Math.PI * 2);
      ctx.fill();
    }

    // Crossed Legs Base (Linen Meditation Trousers)
    ctx.beginPath();
    ctx.ellipse(cx, bodyBaseY - 12, 100, 26, 0, 0, Math.PI * 2);
    ctx.fillStyle = mode === 'skeleton' ? 'rgba(205, 213, 174, 0.2)' : '#CBBDA9';
    ctx.fill();
    ctx.strokeStyle = mode === 'skeleton' ? '#CCD5AE' : '#9E8D79';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Knee Caps Left & Right
    ctx.beginPath();
    ctx.arc(cx - 90, bodyBaseY - 12, 14, 0, Math.PI * 2);
    ctx.arc(cx + 90, bodyBaseY - 12, 14, 0, Math.PI * 2);
    ctx.fillStyle = mode === 'skeleton' ? '#CCD5AE' : '#B8A894';
    ctx.fill();

    // Torso / Abdomen & Chest
    const torsoTopY = cy - 40 - breathLift;
    ctx.beginPath();
    ctx.moveTo(cx - 32 - ribExpansion, torsoTopY + 45); // Left rib
    ctx.bezierCurveTo(
      cx - 36 - ribExpansion,
      torsoTopY + 15,
      cx - 28 - ribExpansion,
      torsoTopY,
      cx - 24,
      torsoTopY - 20
    ); // Left shoulder
    ctx.lineTo(cx + 24, torsoTopY - 20); // Right shoulder
    ctx.bezierCurveTo(
      cx + 28 + ribExpansion,
      torsoTopY,
      cx + 36 + ribExpansion,
      torsoTopY + 15,
      cx + 32 + ribExpansion,
      torsoTopY + 45
    ); // Right rib
    ctx.lineTo(cx + 38, bodyBaseY - 20);
    ctx.lineTo(cx - 38, bodyBaseY - 20);
    ctx.closePath();

    ctx.fillStyle = mode === 'skeleton' ? 'rgba(205, 213, 174, 0.15)' : '#F5EFE6';
    ctx.fill();
    ctx.strokeStyle = mode === 'skeleton' ? '#CCD5AE' : '#DDD2C1';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Arms extending down to knees in Chin Mudra
    // Left Arm
    ctx.beginPath();
    ctx.moveTo(cx - 24, torsoTopY - 15);
    ctx.bezierCurveTo(cx - 55, torsoTopY + 30, cx - 80, bodyBaseY - 30, cx - 85, bodyBaseY - 12);
    ctx.strokeStyle = mode === 'skeleton' ? '#CCD5AE' : '#EAD8C3';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Right Arm
    ctx.beginPath();
    ctx.moveTo(cx + 24, torsoTopY - 15);
    ctx.bezierCurveTo(cx + 55, torsoTopY + 30, cx + 80, bodyBaseY - 30, cx + 85, bodyBaseY - 12);
    ctx.strokeStyle = mode === 'skeleton' ? '#CCD5AE' : '#EAD8C3';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Hands with Chin Mudra (Index finger to thumb touch)
    ctx.beginPath();
    ctx.arc(cx - 85, bodyBaseY - 14, 8, 0, Math.PI * 2);
    ctx.arc(cx + 85, bodyBaseY - 14, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#EAD8C3';
    ctx.fill();

    // Golden Mudra Light Sparks
    ctx.beginPath();
    ctx.arc(cx - 85, bodyBaseY - 14, 4, 0, Math.PI * 2);
    ctx.arc(cx + 85, bodyBaseY - 14, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD54F';
    ctx.shadowColor = '#FFD54F';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Neck
    const neckY = torsoTopY - 20;
    ctx.beginPath();
    ctx.rect(cx - 8, neckY - 16, 16, 18);
    ctx.fillStyle = '#EAD8C3';
    ctx.fill();

    // Head with Meditative Profile & Closed Eyelashes
    const headCenterY = neckY - 35;
    ctx.beginPath();
    ctx.arc(cx, headCenterY, 22, 0, Math.PI * 2);
    ctx.fillStyle = '#EAD8C3';
    ctx.fill();

    // Hair Topknot (Ushnisha)
    ctx.beginPath();
    ctx.arc(cx, headCenterY - 24, 11, 0, Math.PI * 2);
    ctx.fillStyle = '#4A3B32';
    ctx.fill();

    // Hair base crown
    ctx.beginPath();
    ctx.arc(cx, headCenterY - 10, 23, Math.PI * 1.1, Math.PI * 1.9);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#4A3B32';
    ctx.stroke();

    // Serene Face: Closed eyes & peaceful mouth
    ctx.beginPath();
    // Left eye arc
    ctx.arc(cx - 7, headCenterY - 2, 4, 0.2 * Math.PI, 0.8 * Math.PI);
    // Right eye arc
    ctx.arc(cx + 7, headCenterY - 2, 4, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.strokeStyle = '#8C6F5A';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Peaceful soft smile
    ctx.beginPath();
    ctx.arc(cx, headCenterY + 8, 5, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.strokeStyle = '#8C6F5A';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Skeletal / Plumb Line Overlay
    if (mode === 'skeleton') {
      ctx.beginPath();
      ctx.moveTo(cx, headCenterY - 35);
      ctx.lineTo(cx, bodyBaseY);
      ctx.strokeStyle = '#CCD5AE';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#CCD5AE';
      ctx.font = '10px monospace';
      ctx.fillText('Vertical Plumb: 0°', cx + 15, headCenterY - 20);
      ctx.fillText('Anahata Centered', cx + 45, torsoTopY + 15);
    }

    // Prana Sushumna Light Channel
    if (mode === 'prana') {
      const pranaGrad = ctx.createLinearGradient(cx, headCenterY - 30, cx, bodyBaseY);
      pranaGrad.addColorStop(0, '#FFFFFF');
      pranaGrad.addColorStop(0.3, '#E0AFA0');
      pranaGrad.addColorStop(0.7, '#D4A373');
      pranaGrad.addColorStop(1, '#B88554');

      ctx.beginPath();
      ctx.moveTo(cx, headCenterY - 20);
      ctx.lineTo(cx, bodyBaseY - 10);
      ctx.strokeStyle = pranaGrad;
      ctx.lineWidth = 4;
      ctx.shadowColor = '#D4A373';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  };

  // =========================================================================
  // 2. HUMAN FIGURE: SPINAL SOFTENING (Cat-Cow: Marjaryasana - Bitilasana)
  // =========================================================================
  const renderHumanCatCow = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    expansion: number,
    time: number,
    cfg: MotionGuideConfig,
    mode: 'human' | 'skeleton' | 'prana'
  ) => {
    // 0 = Full Cow (arch down, gaze up), 1 = Full Cat (dome up, chin to chest)
    const cowToCat = 0.5 - 0.5 * Math.cos(expansion * Math.PI); // smooth wave 0 to 1
    const groundY = cy + 115;

    // Anchor coordinates for all-fours
    // Hands under shoulders (right side)
    const handX = cx + 85;
    const handY = groundY;
    const shoulderX = cx + 80;
    const shoulderY = groundY - 110 + cowToCat * 15; // slightly lower in Cat

    // Knees under hips (left side)
    const kneeX = cx - 85;
    const kneeY = groundY;
    const hipX = cx - 80;
    const hipY = groundY - 95 - (1 - cowToCat) * 10; // tilts up in Cow

    // Mid-Spine Position:
    // Cow: dips down (cy + 25)
    // Cat: domes high up (cy - 35)
    const midSpineX = cx;
    const midSpineY = cy + 10 - cowToCat * 50;

    // Head Position & Angle:
    // Cow: lifts up and forward (shoulderX + 35, shoulderY - 30)
    // Cat: tucks down and inward toward chest (shoulderX + 15, shoulderY + 25)
    const headX = shoulderX + 35 - cowToCat * 20;
    const headY = shoulderY - 28 + cowToCat * 48;

    // Arms (Vertical pillars from shoulder to hands)
    ctx.beginPath();
    ctx.moveTo(shoulderX, shoulderY);
    ctx.lineTo(handX, handY);
    ctx.strokeStyle = mode === 'skeleton' ? '#CCD5AE' : '#EAD8C3';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Hands Flat on Mat
    ctx.beginPath();
    ctx.roundRect(handX - 8, handY - 6, 26, 10, 4);
    ctx.fillStyle = '#EAD8C3';
    ctx.fill();

    // Thighs / Legs (Vertical from hip to knee)
    ctx.beginPath();
    ctx.moveTo(hipX, hipY);
    ctx.lineTo(kneeX, kneeY);
    ctx.strokeStyle = mode === 'skeleton' ? '#CCD5AE' : '#CBBDA9';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Feet resting flat/toes curled
    ctx.beginPath();
    ctx.roundRect(kneeX - 45, kneeY - 6, 45, 10, 4);
    ctx.fillStyle = '#CBBDA9';
    ctx.fill();

    // Torso Flesh / Clothes Filling
    ctx.beginPath();
    ctx.moveTo(hipX, hipY + 10);
    // Lower belly contour
    ctx.quadraticCurveTo(midSpineX, midSpineY + 28, shoulderX, shoulderY + 15);
    // Chest to shoulder
    ctx.lineTo(shoulderX, shoulderY - 12);
    // Spinal Curve top contour (Cat dome or Cow dip)
    ctx.quadraticCurveTo(midSpineX, midSpineY - 12, hipX, hipY - 10);
    ctx.closePath();
    ctx.fillStyle = mode === 'skeleton' ? 'rgba(205, 213, 174, 0.15)' : '#F5EFE6';
    ctx.fill();
    ctx.strokeStyle = mode === 'skeleton' ? '#CCD5AE' : '#DDD2C1';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Spinal Curve Line & Individual Vertebrae
    ctx.beginPath();
    ctx.moveTo(hipX, hipY - 5);
    ctx.quadraticCurveTo(midSpineX, midSpineY - 8, shoulderX, shoulderY - 10);
    ctx.strokeStyle = mode === 'skeleton' ? '#6C7A4D' : '#8C9B6A';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Vertebral articulation markers
    for (let v = 1; v <= 7; v++) {
      const t = v / 8;
      const vx = (1 - t) * (1 - t) * hipX + 2 * (1 - t) * t * midSpineX + t * t * shoulderX;
      const vy = (1 - t) * (1 - t) * (hipY - 5) + 2 * (1 - t) * t * (midSpineY - 8) + t * t * (shoulderY - 10);

      ctx.beginPath();
      ctx.arc(vx, vy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    }

    // Neck & Head
    ctx.beginPath();
    ctx.moveTo(shoulderX, shoulderY - 5);
    ctx.lineTo(headX, headY);
    ctx.strokeStyle = '#EAD8C3';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Head
    ctx.beginPath();
    ctx.arc(headX + (1 - cowToCat) * 6, headY, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#EAD8C3';
    ctx.fill();

    // Hair Bun
    ctx.beginPath();
    ctx.arc(headX - 10, headY - 12, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#4A3B32';
    ctx.fill();

    // Tailbone Angle indicator
    const tailAngle = (1 - cowToCat) * 0.4 - cowToCat * 0.4;
    ctx.beginPath();
    ctx.moveTo(hipX - 5, hipY);
    ctx.lineTo(hipX - 25, hipY - 10 + cowToCat * 20);
    ctx.strokeStyle = '#9E8D79';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Visual Status Text Callout directly on canvas
    ctx.fillStyle = '#CCD5AE';
    ctx.font = '11px sans-serif';
    ctx.fillText(
      cowToCat > 0.5 ? 'Cat Phase: Dome Spine Up (Exhale)' : 'Cow Phase: Dip Belly Down & Lift Heart (Inhale)',
      cx - 130,
      cy - 120
    );
  };

  // =========================================================================
  // 3. HUMAN FIGURE: HEART SPACE EASE (Anahatasana - Melting Heart Puppy Pose)
  // =========================================================================
  const renderHumanMeltingHeart = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    expansion: number,
    time: number,
    cfg: MotionGuideConfig,
    mode: 'human' | 'skeleton' | 'prana'
  ) => {
    // Kinematic Melt: Chest descends on exhale (1 - expansion)
    const meltFactor = 1 - expansion; // 1 = fully melted to mat
    const groundY = cy + 115;

    // Knees stacked directly under hips
    const kneeX = cx - 120;
    const kneeY = groundY;
    const hipX = cx - 115;
    const hipY = groundY - 100; // Hips stay high at 90°

    // Hands reaching far forward
    const handX = cx + 130;
    const handY = groundY;

    // Chest & Heart Center melts down toward mat
    const chestX = cx + 25;
    const chestY = groundY - 25 - meltFactor * 20; // 5px above mat when fully melted

    // Forehead resting on floor
    const headX = cx + 55;
    const headY = groundY - 15;

    // Thighs (Vertical 90° over knees)
    ctx.beginPath();
    ctx.moveTo(hipX, hipY);
    ctx.lineTo(kneeX, kneeY);
    ctx.strokeStyle = mode === 'skeleton' ? '#CCD5AE' : '#CBBDA9';
    ctx.lineWidth = 18;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Shins on mat
    ctx.beginPath();
    ctx.roundRect(kneeX - 45, kneeY - 6, 45, 10, 4);
    ctx.fillStyle = '#CBBDA9';
    ctx.fill();

    // Extended Arms along mat
    ctx.beginPath();
    ctx.moveTo(chestX + 15, chestY);
    ctx.lineTo(handX, handY);
    ctx.strokeStyle = mode === 'skeleton' ? '#CCD5AE' : '#EAD8C3';
    ctx.lineWidth = 13;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Palms flat on mat
    ctx.beginPath();
    ctx.roundRect(handX - 5, handY - 6, 26, 10, 4);
    ctx.fillStyle = '#EAD8C3';
    ctx.fill();

    // Torso stretching from high hips down to melted chest
    ctx.beginPath();
    ctx.moveTo(hipX, hipY + 8);
    ctx.quadraticCurveTo(cx - 40, cy + 20, chestX, chestY + 12); // Underbelly
    ctx.lineTo(chestX + 15, chestY);
    // Melting thoracic back curve
    ctx.quadraticCurveTo(cx - 30, cy - 20 - meltFactor * 10, hipX, hipY - 10);
    ctx.closePath();
    ctx.fillStyle = mode === 'skeleton' ? 'rgba(205, 213, 174, 0.15)' : '#F5EFE6';
    ctx.fill();
    ctx.strokeStyle = mode === 'skeleton' ? '#CCD5AE' : '#DDD2C1';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Head resting on mat
    ctx.beginPath();
    ctx.arc(headX, headY - 12, 17, 0, Math.PI * 2);
    ctx.fillStyle = '#EAD8C3';
    ctx.fill();

    // Hair
    ctx.beginPath();
    ctx.arc(headX - 6, headY - 18, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#4A3B32';
    ctx.fill();

    // Anahata Heart Glowing Blossom at chest
    ctx.beginPath();
    ctx.arc(chestX, chestY, 14 * (1 + meltFactor * 0.4), 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(206, 66, 87, 0.35)';
    ctx.shadowColor = '#CE4257';
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = '#E0AFA0';
    ctx.font = '11px sans-serif';
    ctx.fillText('Hips 90° Over Knees · Chest Melts to Earth', cx - 110, cy - 120);
  };

  // =========================================================================
  // 4. HUMAN FIGURE: RESTORATIVE PRANA (Viparita Karani - Legs Up The Wall)
  // =========================================================================
  const renderHumanViparitaKarani = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    expansion: number,
    time: number,
    cfg: MotionGuideConfig,
    mode: 'human' | 'skeleton' | 'prana'
  ) => {
    const groundY = cy + 115;
    const wallX = cx + 110;

    // Draw Studio Wall on the right
    ctx.beginPath();
    ctx.moveTo(wallX, groundY - 220);
    ctx.lineTo(wallX, groundY + 10);
    ctx.strokeStyle = '#394B5A';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Supportive Bolster under hips
    const bolsterX = wallX - 35;
    const bolsterY = groundY - 15;
    ctx.beginPath();
    ctx.roundRect(bolsterX - 35, bolsterY - 18, 70, 24, 10);
    ctx.fillStyle = '#73532C';
    ctx.fill();

    // Pelvis resting on bolster
    const hipX = bolsterX;
    const hipY = bolsterY - 16;

    // Legs extending straight up the wall
    const footY = groundY - 195;
    ctx.beginPath();
    ctx.moveTo(hipX + 10, hipY);
    ctx.lineTo(wallX - 8, footY);
    ctx.strokeStyle = mode === 'skeleton' ? '#CCD5AE' : '#CBBDA9';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Feet relaxed against wall
    ctx.beginPath();
    ctx.roundRect(wallX - 12, footY - 16, 12, 28, 4);
    ctx.fillStyle = '#EAD8C3';
    ctx.fill();

    // Torso lying back on floor, belly rising on inhale
    const breathBelly = expansion * 8;
    const shoulderX = hipX - 95;
    const shoulderY = groundY - 12;

    ctx.beginPath();
    ctx.moveTo(hipX - 10, hipY);
    // Rising chest & belly
    ctx.quadraticCurveTo(hipX - 50, groundY - 25 - breathBelly, shoulderX, shoulderY);
    ctx.lineTo(shoulderX, groundY - 4);
    ctx.lineTo(hipX, groundY - 4);
    ctx.closePath();
    ctx.fillStyle = mode === 'skeleton' ? 'rgba(205, 213, 174, 0.15)' : '#F5EFE6';
    ctx.fill();
    ctx.strokeStyle = mode === 'skeleton' ? '#CCD5AE' : '#DDD2C1';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Arms resting out by sides in open surrender
    ctx.beginPath();
    ctx.moveTo(shoulderX + 10, shoulderY);
    ctx.lineTo(shoulderX - 40, groundY - 6);
    ctx.strokeStyle = mode === 'skeleton' ? '#CCD5AE' : '#EAD8C3';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Open Palms facing ceiling
    ctx.beginPath();
    ctx.arc(shoulderX - 48, groundY - 8, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#EAD8C3';
    ctx.fill();

    // Head on mat
    const headX = shoulderX - 25;
    const headY = groundY - 14;
    ctx.beginPath();
    ctx.arc(headX, headY, 17, 0, Math.PI * 2);
    ctx.fillStyle = '#EAD8C3';
    ctx.fill();

    // Hair spread peacefully on mat
    ctx.beginPath();
    ctx.arc(headX - 6, headY, 15, Math.PI * 0.7, Math.PI * 1.5);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#4A3B32';
    ctx.stroke();

    ctx.fillStyle = '#81D4FA';
    ctx.font = '11px sans-serif';
    ctx.fillText('Hips on Bolster · Legs Relaxed on Wall · Palms Up', cx - 130, cy - 120);
  };

  // =========================================================================
  // 5. HUMAN FIGURE: ROOTED GROUNDING (Tadasana - Mountain Pose to Upward Salute)
  // =========================================================================
  const renderHumanTadasana = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    expansion: number,
    time: number,
    cfg: MotionGuideConfig,
    mode: 'human' | 'skeleton' | 'prana'
  ) => {
    const groundY = cy + 115;
    // Arm Sweep motion: arms rise on inhale (expansion 0 -> 1)
    const armAngle = expansion * Math.PI * 0.85; // 0 = down at sides, 1 = overhead prayer

    // Grounded Feet on mat
    const leftFootX = cx - 18;
    const rightFootX = cx + 18;

    // Both Feet flat on mat
    ctx.beginPath();
    ctx.roundRect(leftFootX - 10, groundY - 8, 22, 12, 4);
    ctx.roundRect(rightFootX - 10, groundY - 8, 22, 12, 4);
    ctx.fillStyle = '#EAD8C3';
    ctx.fill();

    // Rooting Earth Vectors radiating downward from feet
    for (let f = -1; f <= 1; f += 2) {
      const fx = cx + f * 18;
      ctx.beginPath();
      ctx.moveTo(fx, groundY + 4);
      ctx.lineTo(fx - 10, groundY + 22);
      ctx.moveTo(fx, groundY + 4);
      ctx.lineTo(fx + 10, groundY + 22);
      ctx.strokeStyle = 'rgba(184, 133, 84, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Legs (Thighs & Calves strong and tall)
    const kneeY = groundY - 65;
    const hipY = groundY - 135;

    // Left Leg
    ctx.beginPath();
    ctx.moveTo(leftFootX, groundY - 8);
    ctx.lineTo(leftFootX - 2, kneeY);
    ctx.lineTo(leftFootX - 4, hipY);
    ctx.strokeStyle = mode === 'skeleton' ? '#CCD5AE' : '#CBBDA9';
    ctx.lineWidth = 14;
    ctx.stroke();

    // Right Leg
    ctx.beginPath();
    ctx.moveTo(rightFootX, groundY - 8);
    ctx.lineTo(rightFootX + 2, kneeY);
    ctx.lineTo(rightFootX + 4, hipY);
    ctx.strokeStyle = mode === 'skeleton' ? '#CCD5AE' : '#CBBDA9';
    ctx.lineWidth = 14;
    ctx.stroke();

    // Pelvis & Torso
    const shoulderY = hipY - 75;
    const ribExpand = expansion * 6;

    ctx.beginPath();
    ctx.moveTo(cx - 20 - ribExpand, hipY);
    ctx.lineTo(cx - 24 - ribExpand, shoulderY + 30);
    ctx.lineTo(cx - 20, shoulderY); // Left shoulder
    ctx.lineTo(cx + 20, shoulderY); // Right shoulder
    ctx.lineTo(cx + 24 + ribExpand, shoulderY + 30);
    ctx.lineTo(cx + 20 + ribExpand, hipY);
    ctx.closePath();
    ctx.fillStyle = mode === 'skeleton' ? 'rgba(205, 213, 174, 0.15)' : '#F5EFE6';
    ctx.fill();
    ctx.strokeStyle = mode === 'skeleton' ? '#CCD5AE' : '#DDD2C1';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Neck & Head
    ctx.beginPath();
    ctx.rect(cx - 6, shoulderY - 14, 12, 16);
    ctx.fillStyle = '#EAD8C3';
    ctx.fill();

    // Head
    const headY = shoulderY - 32;
    ctx.beginPath();
    ctx.arc(cx, headY, 18, 0, Math.PI * 2);
    ctx.fillStyle = '#EAD8C3';
    ctx.fill();

    // Hair Topknot
    ctx.beginPath();
    ctx.arc(cx, headY - 18, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#4A3B32';
    ctx.fill();

    // Arms kinematic sweeping motion:
    // When expansion = 0: down at sides
    // When expansion = 1: overhead with palms together
    const armLength = 65;
    const leftArmEndX = cx - 20 - Math.sin(armAngle) * armLength + (expansion > 0.8 ? (expansion - 0.8) * 100 : 0);
    const leftArmEndY = shoulderY + Math.cos(armAngle) * armLength;
    const rightArmEndX = cx + 20 + Math.sin(armAngle) * armLength - (expansion > 0.8 ? (expansion - 0.8) * 100 : 0);
    const rightArmEndY = shoulderY + Math.cos(armAngle) * armLength;

    // Left Arm
    ctx.beginPath();
    ctx.moveTo(cx - 20, shoulderY + 5);
    ctx.lineTo(leftArmEndX, leftArmEndY);
    ctx.strokeStyle = mode === 'skeleton' ? '#CCD5AE' : '#EAD8C3';
    ctx.lineWidth = 11;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Right Arm
    ctx.beginPath();
    ctx.moveTo(cx + 20, shoulderY + 5);
    ctx.lineTo(rightArmEndX, rightArmEndY);
    ctx.strokeStyle = mode === 'skeleton' ? '#CCD5AE' : '#EAD8C3';
    ctx.lineWidth = 11;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Hands
    ctx.beginPath();
    ctx.arc(leftArmEndX, leftArmEndY, 6, 0, Math.PI * 2);
    ctx.arc(rightArmEndX, rightArmEndY, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#EAD8C3';
    ctx.fill();

    ctx.fillStyle = '#D4A373';
    ctx.font = '11px sans-serif';
    ctx.fillText(
      expansion > 0.7 ? 'Upward Salute: Inhale Tall & Join Palms' : 'Rooted Mountain: Exhale Grounding Feet to Earth',
      cx - 130,
      cy - 120
    );
  };

  // Handle Log Session
  const handleLogPractice = () => {
    soundSanctuary.playMeditationBell(432);
    streakSystem.recordPractice('yoga', `${config.title} (${config.poseName})`, 10);
    setIsLogged(true);
    setTimeout(() => setIsLogged(false), 3000);
  };

  return (
    <div
      className={`rounded-3xl overflow-hidden bg-[#182026] text-[#F9F6F0] border border-[#2D3944] shadow-xl flex flex-col ${className}`}
    >
      {/* Top Controller Bar */}
      <div className="px-6 py-4 border-b border-[#2A3742] flex flex-wrap items-center justify-between gap-4 bg-[#12161A]/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div
            className="w-3.5 h-3.5 rounded-full animate-ping"
            style={{ backgroundColor: config.primaryColor }}
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg text-[#FFFFFF] font-medium leading-none">
                {config.title}
              </h3>
              <span className="text-xs text-[#A8B2BD]">
                · {config.poseName}
              </span>
            </div>
            <p className="text-[11px] text-[#D4A373] mt-1 font-mono">
              {config.sanskrit} · {config.theme}
            </p>
          </div>
        </div>

        {/* Intention Quick Selector Tabs */}
        {onSelectType && (
          <div className="flex items-center gap-1.5 p-1 bg-[#1E2730] rounded-xl border border-[#31414F] overflow-x-auto max-w-full">
            {(Object.keys(MOTION_CONFIGS) as MotionGuideType[]).map((typeKey) => {
              const item = MOTION_CONFIGS[typeKey];
              const isCur = activeType === typeKey;
              return (
                <button
                  key={typeKey}
                  onClick={() => {
                    onSelectType(typeKey);
                    soundSanctuary.playZenTingsha();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isCur
                      ? 'bg-[#FFFFFF] text-[#12161A] shadow-xs'
                      : 'text-[#A8B2BD] hover:text-[#FFFFFF]'
                  }`}
                >
                  {item.title}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Visualizer Area (3D Three.js Studio or 2D Responsive Canvas) */}
      <div className="relative w-full h-[400px] bg-[#111518] overflow-hidden flex items-center justify-center">
        {viewMode === '3d' ? (
          <ThreeYogaHuman
            poseType={activeType}
            expansion={phaseProgress}
            time={animTime}
            title={config.title}
            className="w-full h-full"
            showChakras={true}
          />
        ) : (
          <canvas ref={canvasRef} className="w-full h-full block" />
        )}

        {/* View Mode Switcher: 3D Human Studio / Human Model / Skeletal / Prana */}
        <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-1 bg-[#12161A]/85 backdrop-blur-md p-1 rounded-xl border border-[#2D3944] text-xs">
          <button
            onClick={() => {
              setViewMode('3d');
              soundSanctuary.playZenTingsha();
            }}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === '3d' ? 'bg-[#FFFFFF] text-[#12161A] font-semibold' : 'text-[#8C9AA8] hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>3D Studio</span>
          </button>
          <button
            onClick={() => {
              setViewMode('human');
              soundSanctuary.playZenTingsha();
            }}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'human' ? 'bg-[#FFFFFF] text-[#12161A] font-semibold' : 'text-[#8C9AA8] hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>2D Form</span>
          </button>
          <button
            onClick={() => {
              setViewMode('skeleton');
              soundSanctuary.playZenTingsha();
            }}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'skeleton' ? 'bg-[#CCD5AE] text-[#12161A] font-semibold' : 'text-[#8C9AA8] hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Skeletal</span>
          </button>
          <button
            onClick={() => {
              setViewMode('prana');
              soundSanctuary.playZenTingsha();
            }}
            className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'prana' ? 'bg-[#E0AFA0] text-[#12161A] font-semibold' : 'text-[#8C9AA8] hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Prana</span>
          </button>
        </div>

        {/* Mirror Mode Toggle & Breath Pace */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {/* Mirror Me button */}
          <button
            onClick={() => setMirrorMode(!mirrorMode)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md ${
              mirrorMode
                ? 'bg-[#D4A373] text-[#12161A] border-[#D4A373]'
                : 'bg-[#12161A]/85 text-[#CCD5AE] border-[#2D3944] hover:bg-[#1E2730]'
            }`}
            title="Flip view horizontally to mirror in class"
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Mirror: {mirrorMode ? 'ON' : 'OFF'}</span>
          </button>

          {/* Breath Pace Multiplier Selector */}
          <div className="flex items-center gap-1 bg-[#12161A]/85 backdrop-blur-md p-1 rounded-xl border border-[#2D3944] text-xs">
            <button
              onClick={() => setBreathPace('gentle')}
              className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                breathPace === 'gentle' ? 'bg-[#31414F] text-white' : 'text-[#8C9AA8] hover:text-white'
              }`}
            >
              Gentle
            </button>
            <button
              onClick={() => setBreathPace('normal')}
              className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                breathPace === 'normal' ? 'bg-[#31414F] text-white' : 'text-[#8C9AA8] hover:text-white'
              }`}
            >
              Natural
            </button>
            <button
              onClick={() => setBreathPace('deep')}
              className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                breathPace === 'deep' ? 'bg-[#31414F] text-white' : 'text-[#8C9AA8] hover:text-white'
              }`}
            >
              Deep
            </button>
          </div>
        </div>

        {/* Live Breath Phase Overlay HUD */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2.5 bg-[#12161A]/85 backdrop-blur-md px-4 py-2 rounded-full border border-[#2D3944]">
          <span
            className="w-2.5 h-2.5 rounded-full transition-transform duration-500"
            style={{
              backgroundColor: config.primaryColor,
              transform: `scale(${1 + phaseProgress * 0.8})`
            }}
          />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#F9F6F0]">
            {currentPhase === 'inhale' && '1. Inhale Prana (Expansion)'}
            {currentPhase === 'retain' && '2. Antara Kumbhaka (Contain)'}
            {currentPhase === 'exhale' && '3. Exhale Softening (Release)'}
            {currentPhase === 'settle' && '4. Bahya Kumbhaka (Pure Stillness)'}
          </span>
        </div>

        {/* Floating Alignment Touchpoints & Controls */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => setSoundChime(!soundChime)}
            className={`p-2.5 rounded-full border transition-colors cursor-pointer backdrop-blur-md ${
              soundChime
                ? 'bg-[#1E2730] border-[#3A4B59] text-[#D4A373]'
                : 'bg-[#12161A] border-[#252E37] text-[#6A7885]'
            }`}
            title={soundChime ? 'Singing Bowl Chimes Active' : 'Muted'}
          >
            {soundChime ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
              soundSanctuary.playZenTingsha();
            }}
            className="p-2.5 rounded-full bg-[#FFFFFF] text-[#12161A] hover:bg-[#EAE4D9] transition-all cursor-pointer shadow-md"
            title={isPlaying ? 'Pause Motion Guide' : 'Play Motion Guide'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Step-by-Step Human Replication Guide Cards (So anyone can replicate by seeing!) */}
      <div className="p-6 bg-[#182026] border-t border-[#2A3742] space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#D4A373]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>How to Replicate This Pose (Step-by-Step Mirroring)</span>
          </div>
          <p className="text-xs text-[#A8B2BD]">
            Follow this 4-step sequence to mirror Dr. Syed Karishma’s posture and breath with ease.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {config.replicationSteps.map((step) => (
            <div
              key={step.step}
              className="p-4 rounded-2xl bg-[#1E2730] border border-[#2F3E4C] space-y-1.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-[#D4A373]">
                  <span>STEP 0{step.step}</span>
                  <span className="text-[10px] uppercase text-[#A8B2BD]">{step.phase}</span>
                </div>
                <p className="text-xs text-[#E8E1D5] leading-relaxed mt-1">
                  {step.instruction}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Clinical Alignment & Mistake Prevention Notice */}
        <div className="p-4 rounded-2xl bg-[#1F2932] border border-[#31414F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 flex-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#CCD5AE] block">
              Doctor’s Key Alignment & Common Mistake to Avoid
            </span>
            <p className="text-xs text-[#E8E1D5] leading-relaxed">
              <strong>Cue:</strong> “{config.clinicalCue}”
            </p>
            <p className="text-xs text-[#E0AFA0] leading-relaxed">
              <strong>Caution:</strong> {config.commonMistake}
            </p>
          </div>

          {showPracticeLogger && (
            <button
              onClick={handleLogPractice}
              className={`px-5 py-3 rounded-xl text-xs font-medium tracking-wide flex items-center gap-2 cursor-pointer transition-all shrink-0 ${
                isLogged
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#FFFFFF] text-[#12161A] hover:bg-[#EAE4D9] shadow-sm'
              }`}
            >
              {isLogged ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sadhana Logged to Streak!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#B88554]" />
                  <span>Mirror Complete & Advance Streak</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
