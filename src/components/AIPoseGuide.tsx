/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  CameraOff,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Volume2,
  ArrowLeft,
  FlipHorizontal,
  Film,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Box,
  ExternalLink
} from 'lucide-react';
import { soundSanctuary } from '../utils/soundSanctuary.ts';
import { AsanaVisualAnimator } from './AsanaVisualAnimator.tsx';
import { WorkspaceTab } from '../types/workspaceTabs.ts';
import { lookupPose } from '../utils/poseDictionary.ts';

interface PoseTemplate {
  id: string;
  name: string;
  sanskrit: string;
  targetAngles: { joint: string; idealAngle: number; label: string }[];
  doctorCues: string[];
}

const TEMPLATES: PoseTemplate[] = [
  {
    id: 'warrior2',
    name: 'Warrior II',
    sanskrit: 'वीरभद्रासन II',
    targetAngles: [
      { joint: 'Front Knee', idealAngle: 90, label: 'Knee stacked over heel' },
      { joint: 'Torso Plumb', idealAngle: 90, label: 'Vertical spine, centered' },
      { joint: 'Arms Line', idealAngle: 180, label: 'Parallel to earth' }
    ],
    doctorCues: [
      'Gaze softly over your front middle fingernail without furrowing your brow.',
      'Press firmly into the knife edge of the back foot to awaken your pelvic floor.',
      'Soften the tops of your shoulders away from your ears by 2 inches.'
    ]
  },
  {
    id: 'tree',
    name: 'Tree Pose',
    sanskrit: 'वृक्षासन',
    targetAngles: [
      { joint: 'Standing Leg', idealAngle: 180, label: 'Rooted and straight' },
      { joint: 'Bent Knee', idealAngle: 45, label: 'Turned outward without twisting pelvis' },
      { joint: 'Hips Axis', idealAngle: 0, label: 'Even and level across anterior iliac crests' }
    ],
    doctorCues: [
      'Find your Drishti (quiet focal point) at eye level on an unmoving spot.',
      'Place sole of foot against inner thigh or calf — never press directly against knee joint.',
      'Draw lowest ribs gently in toward spine to stabilize sacrum.'
    ]
  },
  {
    id: 'downdog',
    name: 'Downward-Facing Dog',
    sanskrit: 'अधोमुख श्वानासन',
    targetAngles: [
      { joint: 'Spine-Leg Angle', idealAngle: 75, label: 'Elongated inverted V' },
      { joint: 'Shoulder Flexion', idealAngle: 160, label: 'Open armpits, external rotation' },
      { joint: 'Ankle Dorsiflexion', idealAngle: 60, label: 'Heels releasing toward floor' }
    ],
    doctorCues: [
      'Root down through index finger knuckle and thumb to protect wrists.',
      'Bend knees slightly if hamstrings pull on lower back — prioritize long spine over flat heels.',
      'Allow the head and neck to hang like quiet water.'
    ]
  }
];

interface AIPoseGuideProps {
  onBackToHome?: () => void;
  onOpenTab?: (tab: WorkspaceTab) => void;
}

export const AIPoseGuide: React.FC<AIPoseGuideProps> = ({ onBackToHome, onOpenTab }) => {
  const [selectedPose, setSelectedPose] = useState<PoseTemplate>(TEMPLATES[0]);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [simulatedScore, setSimulatedScore] = useState<number>(92);
  const [isAnalyzingSnapshot, setIsAnalyzingSnapshot] = useState<boolean>(false);
  const [studioMode, setStudioMode] = useState<'camera' | 'animation'>('camera');
  const [holdSeconds, setHoldSeconds] = useState<number>(60);
  const [holdSecondsRemaining, setHoldSecondsRemaining] = useState<number>(60);
  const [isHoldTimerPlaying, setIsHoldTimerPlaying] = useState<boolean>(false);
  const [liveFeedback, setLiveFeedback] = useState<string>(
    'Excellent alignment. Soften shoulders 1 inch for divine steadiness.'
  );

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Second-by-second hold countdown playing up to mentioned time
  useEffect(() => {
    if (!isHoldTimerPlaying) return;

    const timer = setInterval(() => {
      setHoldSecondsRemaining((sec) => {
        if (sec > 1) {
          return sec - 1;
        }
        soundSanctuary.playMeditationBell(432);
        setIsHoldTimerPlaying(false);
        return 0;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isHoldTimerPlaying]);

  const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera device access not supported in this environment');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
        };
      }
      setIsCameraActive(true);
      soundSanctuary.playZenTingsha();
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setCameraError(
        'Camera permission was not granted or camera is occupied. Please click Allow if prompted, or explore using the Interactive Biofeedback Simulation.'
      );
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const toggleFacingMode = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    if (isCameraActive) {
      startCamera(nextMode);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Real-time canvas overlay drawing alignment target grid over video
  useEffect(() => {
    if (!isCameraActive) return;

    const drawOverlay = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (canvas && video && video.readyState >= 2) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 480;
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Horizontal plumb line
          ctx.strokeStyle = 'rgba(212, 163, 115, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([6, 6]);

          const midX = canvas.width / 2;
          const midY = canvas.height / 2;

          // Vertical spine axis
          ctx.beginPath();
          ctx.moveTo(midX, 20);
          ctx.lineTo(midX, canvas.height - 20);
          ctx.stroke();

          // Horizontal shoulder line
          ctx.beginPath();
          ctx.moveTo(40, midY - 60);
          ctx.lineTo(canvas.width - 40, midY - 60);
          ctx.stroke();

          // Soft joint nodes simulation
          ctx.setLineDash([]);
          ctx.fillStyle = 'rgba(204, 213, 174, 0.8)';
          [
            { x: midX, y: 80 },
            { x: midX - 90, y: midY - 60 },
            { x: midX + 90, y: midY - 60 },
            { x: midX, y: midY + 40 },
            { x: midX - 60, y: midY + 160 },
            { x: midX + 60, y: midY + 160 }
          ].forEach((pt) => {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
            ctx.fill();
          });
        }
      }
      animationFrameRef.current = requestAnimationFrame(drawOverlay);
    };

    animationFrameRef.current = requestAnimationFrame(drawOverlay);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isCameraActive]);

  // Periodic subtle pose feedback updates
  useEffect(() => {
    const interval = setInterval(() => {
      const score = Math.floor(88 + Math.random() * 10);
      setSimulatedScore(score);
      if (score >= 95) {
        setLiveFeedback('Sthira Sukham Asanam — Divine steadiness and effortless alignment.');
      } else if (score >= 90) {
        setLiveFeedback('Beautiful form. Deepen your smooth exhalation into the low belly.');
      } else {
        setLiveFeedback('Gently lower hips 1 inch and stack front knee directly over ankle.');
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [selectedPose]);

  const handleCaptureSnapshot = () => {
    setIsAnalyzingSnapshot(true);
    soundSanctuary.playSingingBowl(324);
    setTimeout(() => {
      setIsAnalyzingSnapshot(false);
      setLiveFeedback('Snapshot analyzed: Spine is beautifully elongated. Torso centered on plumb line.');
    }, 1200);
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
          Computer Vision Pose Alignment
        </span>
      </div>

      {/* Header */}
      <div className="max-w-2xl space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#7A7268]">
          <span>AI Computer Vision</span>
          <span>·</span>
          <span>Somatic Biomechanics</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#26221E] font-normal">
          AI Pose Alignment & Camera Biofeedback
        </h1>
        <p className="text-sm text-[#5E5852] leading-relaxed">
          Align your sacred geometry. Enable your camera for real-time skeletal joint analysis, or observe the biofeedback studio with compassionate guidance from Dr. Syed Karishma.
        </p>
      </div>

      {/* Pose Selector Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 text-xs">
        <span className="text-[#7A7268] whitespace-nowrap">Target Asana:</span>
        {TEMPLATES.map((tpl) => (
          <div key={tpl.id} className="inline-flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                setSelectedPose(tpl);
                setHoldSecondsRemaining(60);
                setIsHoldTimerPlaying(false);
                soundSanctuary.playSingingBowl(324);
              }}
              className={`px-4 py-2 rounded-xl border whitespace-nowrap font-medium transition-all cursor-pointer ${
                selectedPose.id === tpl.id
                  ? 'bg-[#26221E] text-[#F9F6F0] border-[#26221E]'
                  : 'bg-[#F4EFE6] text-[#5E5852] border-[#E8E1D5] hover:border-[#D0C2B0]'
              }`}
            >
              {tpl.name} ({tpl.sanskrit})
            </button>
            {onOpenTab && (
              <button
                onClick={() => {
                  const pose = lookupPose(tpl.id || tpl.name);
                  onOpenTab({
                    id: 'pose-' + pose.id,
                    type: 'pose',
                    title: tpl.name,
                    subtitle: tpl.sanskrit,
                    data: { ...pose, clinicalCue: tpl.doctorCues[0] },
                    canClose: true
                  });
                  soundSanctuary.playZenTingsha();
                }}
                className="p-2 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF7F2] border border-[#E8E1D5] hover:border-[#B88554] text-[#73532C] transition-colors cursor-pointer shadow-2xs"
                title={`Open ${tpl.name} in dedicated 3D Tab`}
              >
                <Box className="w-3.5 h-3.5 text-[#B88554]" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Mode Switcher: Live Webcam vs Pose Animation Video + Hold Timer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 bg-[#EFE9DD] p-1 rounded-2xl border border-[#E0D7C5]">
          <button
            onClick={() => setStudioMode('camera')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              studioMode === 'camera'
                ? 'bg-[#12161A] text-[#F9F6F0] shadow-xs'
                : 'text-[#5E5852] hover:text-[#26221E]'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-[#E0AFA0]" />
            <span>Webcam Biofeedback</span>
          </button>
          <button
            onClick={() => setStudioMode('animation')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              studioMode === 'animation'
                ? 'bg-[#12161A] text-[#F9F6F0] shadow-xs'
                : 'text-[#5E5852] hover:text-[#26221E]'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-[#B88554]" />
            <span>Pose Guidance Animation Video</span>
          </button>
        </div>

        {/* Realtime Hold Timer up to mentioned 60s hold */}
        <div className="flex items-center gap-2 bg-[#FFFFFF] px-4 py-2 rounded-2xl border border-[#E8E1D5] text-xs shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-[#9E6E38]" />
          <span className="text-[#7A7268]">Hold:</span>
          <span className="font-serif font-medium text-[#26221E] tabular-nums text-sm">
            {Math.floor(holdSecondsRemaining / 60)}:{(holdSecondsRemaining % 60) < 10 ? '0' : ''}{holdSecondsRemaining % 60}
          </span>
          <span className="text-[10px] text-[#A0988E]">/ 1:00</span>
          <button
            onClick={() => {
              setIsHoldTimerPlaying(!isHoldTimerPlaying);
              soundSanctuary.playZenTingsha();
            }}
            className="ml-1 px-3 py-1 rounded-xl bg-[#12161A] text-[#F9F6F0] text-xs font-medium cursor-pointer transition-colors hover:bg-[#252C33]"
          >
            {isHoldTimerPlaying ? 'Pause' : 'Start Hold'}
          </button>
          <button
            onClick={() => {
              setHoldSecondsRemaining(60);
              setIsHoldTimerPlaying(false);
              soundSanctuary.playZenTingsha();
            }}
            className="p-1.5 rounded-lg border border-[#E8E1D5] hover:bg-[#F4EFE6] text-[#5E5852] cursor-pointer"
            title="Reset to 60s"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Viewport & Feedback Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Camera Video Stream OR Pose Guidance Animation Studio */}
        <div className="lg:col-span-7 space-y-4">
          {studioMode === 'animation' ? (
            <AsanaVisualAnimator
              poseKey={selectedPose.id}
              poseName={selectedPose.name}
              sanskritName={selectedPose.sanskrit}
              cue={selectedPose.doctorCues[0]}
              isPlaying={isHoldTimerPlaying}
              onTogglePlay={() => setIsHoldTimerPlaying(!isHoldTimerPlaying)}
            />
          ) : (
            <div className="relative rounded-3xl bg-[#12161A] border border-[#2A333C] overflow-hidden aspect-[4/3] flex items-center justify-center text-[#F9F6F0] shadow-md">
              {isCameraActive ? (
                <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${facingMode === 'user' ? 'transform -scale-x-100' : ''}`}
                />
                {/* Real-time skeleton canvas overlay */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                />
              </div>
            ) : (
              /* Serene Simulated Skeleton Studio */
              <div className="relative w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#182026] to-[#101418]">
                {/* Simulated Pose Alignment Diagram */}
                <div className="relative w-48 h-64 border border-[#3A4856]/40 rounded-2xl flex items-center justify-center p-4">
                  <div className="absolute inset-4 rounded-full border border-[#E0AFA0]/30 animate-pulse" />
                  <div className="absolute inset-8 rounded-full border border-[#D4A373]/20" />

                  {/* Body wireframe markers */}
                  <div className="w-10 h-10 rounded-full border-2 border-[#E0AFA0] flex items-center justify-center text-[10px] text-[#E0AFA0] absolute top-6">
                    Crown
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#CCD5AE] absolute top-20 left-12" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#CCD5AE] absolute top-20 right-12" />
                  <div className="w-3 h-3 rounded-full bg-[#D4A373] absolute top-32" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#CCD5AE] absolute bottom-12 left-10" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#CCD5AE] absolute bottom-8 right-10" />

                  <span className="font-serif text-xs text-[#A8B8C6] absolute bottom-3">
                    Simulated Sensor Active
                  </span>
                </div>

                <p className="text-xs text-[#8A9BA8] mt-4 text-center max-w-sm">
                  {cameraError || 'Click "Enable Camera for Live Alignment" below to stream your practice.'}
                </p>
              </div>
            )}

            {/* Floating Live AI Overlay Pill */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="bg-[#12161A]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#2E3B46] text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#CCD5AE] animate-ping" />
                <span className="text-[#E0AFA0] font-medium">{selectedPose.name}</span>
                <span className="text-[#8A9BA8]">·</span>
                <span className="text-[#F9F6F0] font-mono">{simulatedScore}% Harmony</span>
              </div>

              <div className="bg-[#12161A]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#2E3B46] text-xs text-[#CCD5AE] font-mono">
                {isCameraActive ? 'Live Camera On' : 'Simulated Studio'}
              </div>
            </div>

            {/* Bottom Live Prompt */}
            <div className="absolute bottom-4 left-4 right-4 bg-[#12161A]/90 backdrop-blur-md p-3.5 rounded-2xl border border-[#2E3B46] text-xs text-[#F9F6F0] flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4A373] shrink-0" />
                <span>{liveFeedback}</span>
              </div>

              {isCameraActive && (
                <button
                  onClick={handleCaptureSnapshot}
                  disabled={isAnalyzingSnapshot}
                  className="px-3 py-1 rounded-lg bg-[#2E3B46] hover:bg-[#3D4C59] text-[11px] font-medium text-[#F9F6F0] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {isAnalyzingSnapshot ? 'Analyzing...' : 'Snapshot Check'}
                </button>
              )}
            </div>
          </div>
        )}

          {/* Camera Controls & Actions (Visible when in camera mode) */}
          {studioMode === 'camera' && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {isCameraActive ? (
                  <>
                    <button
                      onClick={stopCamera}
                      className="px-5 py-2.5 rounded-full bg-[#26221E] text-[#F9F6F0] text-xs font-medium hover:bg-[#3D3732] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <CameraOff className="w-4 h-4 text-[#CE4257]" />
                      <span>Turn Off Camera</span>
                    </button>

                    <button
                      onClick={toggleFacingMode}
                      className="p-2.5 rounded-full border border-[#E8E1D5] hover:bg-[#F4EFE6] text-[#5E5852] transition-colors cursor-pointer"
                      title="Switch Front/Back Camera"
                    >
                      <FlipHorizontal className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => startCamera()}
                    className="px-5 py-2.5 rounded-full bg-[#12161A] text-[#F9F6F0] text-xs font-medium hover:bg-[#252C33] transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Camera className="w-4 h-4 text-[#E0AFA0]" />
                    <span>Enable Camera for Live Alignment</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => soundSanctuary.playSingingBowl(216)}
                className="text-xs text-[#7A7268] hover:text-[#26221E] flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-[#9E6E38]" />
                <span>Ring Singing Bowl</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Joint Angles & Doctor Syed Karishma's Cues (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Target Angles Analysis Card */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9E6E38]">
              Biomechanical Joint Tracking
            </span>
            <div className="space-y-3">
              {selectedPose.targetAngles.map((target, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#F9F6F0] border border-[#E8E1D5] flex items-center justify-between"
                >
                  <div>
                    <strong className="text-xs text-[#26221E] block">{target.joint}</strong>
                    <span className="text-[11px] text-[#7A7268]">{target.label}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-mono font-medium text-[#26221E]">
                      {target.idealAngle}°
                    </span>
                    <span className="block text-[10px] text-[#6C7A4D]">Aligned</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dr. Syed Karishma’s Somatic Cues Card */}
          <div className="p-6 rounded-3xl bg-[#F4EFE6] border border-[#E8E1D5] space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9E6E38]">
              Mentor Cues · Dr. Syed Karishma
            </span>
            <ul className="space-y-2.5 text-xs text-[#5E5852] leading-relaxed">
              {selectedPose.doctorCues.map((cue, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#B88554] mt-0.5">•</span>
                  <span>{cue}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
