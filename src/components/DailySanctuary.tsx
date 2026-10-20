/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Moon,
  ArrowRight,
  Heart,
  Feather,
  Compass,
  CheckCircle2,
  Volume2,
  Gamepad2,
  Camera,
  Bot,
  Play,
  Flame,
  Share2,
  Award,
  Activity,
  Check,
  Music,
  ExternalLink,
  Box
} from 'lucide-react';
import { UserProfile } from '../types.ts';
import { soundSanctuary } from '../utils/soundSanctuary.ts';
import { AuthUser } from './GoogleLoginModal.tsx';
import {
  BuddhaMeditationArtwork,
  HimalayanSunriseArtwork,
  ZenStonesWaterArtwork
} from './ZenVisuals.tsx';
import { ProceduralMotionGuide, MotionGuideType } from './ProceduralMotionGuide.tsx';
import { streakSystem, SanctuaryStreakState, ALL_SANCTUARY_BADGES } from '../utils/streakSystem.ts';
import { ShareProgressModal } from './ShareProgressModal.tsx';
import { WorkspaceTab } from '../types/workspaceTabs.ts';
import { lookupPose } from '../utils/poseDictionary.ts';

interface DailySanctuaryProps {
  userProfile: UserProfile;
  onUpdateIntention: (intention: string) => void;
  onOpenSanctuaryMode: () => void;
  onNavigate: (tab: string) => void;
  currentUser?: AuthUser | null;
  onOpenAuthModal?: () => void;
  onOpenTab?: (tab: WorkspaceTab) => void;
}

const GENTLE_INTENTIONS: Array<{ id: MotionGuideType; label: string; sub: string }> = [
  { id: 'stillness', label: 'Deep Stillness', sub: 'Calming the nervous system' },
  { id: 'spine', label: 'Spinal Softening', sub: 'Releasing lower back & neck strain' },
  { id: 'heart', label: 'Heart Space Ease', sub: 'Unburdening subtle emotional holding' },
  { id: 'prana', label: 'Restorative Prana', sub: 'Replenishing cellular exhaustion' },
  { id: 'grounding', label: 'Rooted Grounding', sub: 'Anchoring scattered mental speed' }
];

export const DailySanctuary: React.FC<DailySanctuaryProps> = ({
  userProfile,
  onUpdateIntention,
  onOpenSanctuaryMode,
  onNavigate,
  currentUser,
  onOpenAuthModal,
  onOpenTab
}) => {
  const [selectedIntentId, setSelectedIntentId] = useState<MotionGuideType>('stillness');
  const [customInput, setCustomInput] = useState<string>('');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Progressive Streak System State
  const [streakState, setStreakState] = useState<SanctuaryStreakState>(streakSystem.getState());
  const [recentDays, setRecentDays] = useState(streakSystem.getRecent7Days());
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [quickLogged, setQuickLogged] = useState<boolean>(false);

  useEffect(() => {
    const handleStreakUpdate = () => {
      setStreakState(streakSystem.getState());
      setRecentDays(streakSystem.getRecent7Days());
    };
    window.addEventListener('sanctuary-streak-update', handleStreakUpdate);
    return () => window.removeEventListener('sanctuary-streak-update', handleStreakUpdate);
  }, []);

  const handleSelectIntention = (item: typeof GENTLE_INTENTIONS[0]) => {
    setSelectedIntentId(item.id);
    setCustomInput(item.label + ' — ' + item.sub);
    onUpdateIntention(item.label + ' — ' + item.sub);
    soundSanctuary.playSingingBowl(324);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);

    if (onOpenTab) {
      const pose = lookupPose(item.id);
      onOpenTab({
        id: 'pose-' + item.id,
        type: 'pose',
        title: item.label,
        subtitle: item.sub,
        data: pose,
        canClose: true
      });
    }
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    onUpdateIntention(customInput.trim());
    soundSanctuary.playSingingBowl(216);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleQuickLogToday = () => {
    soundSanctuary.playMeditationBell(432);
    const activeIntention = GENTLE_INTENTIONS.find((i) => i.id === selectedIntentId)?.label || 'Deep Stillness';
    streakSystem.recordPractice('yoga', `Daily Sadhana: ${activeIntention}`, 15);
    setQuickLogged(true);
    setTimeout(() => setQuickLogged(false), 3000);
  };

  const currentBadge = ALL_SANCTUARY_BADGES.find((b) =>
    streakState.unlockedBadgeIds.includes(b.id)
  ) || ALL_SANCTUARY_BADGES[0];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16 animate-fadeIn">
      {/* Hero Welcome & Sanctuary Invitation with Sacred Buddha Artwork */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F5EFE6] via-[#EFE7D8] to-[#E8DCCB] border border-[#E0D5C1] p-8 md:p-14 shadow-sm">
        {/* Divine Buddha Vector Artwork with Soft Translucent Halo Glow */}
        <div className="absolute -right-8 -bottom-10 w-72 h-72 sm:w-96 sm:h-96 md:w-[440px] md:h-[440px] opacity-40 md:opacity-85 pointer-events-none transition-all">
          <BuddhaMeditationArtwork />
        </div>

        {/* Ambient Halo Ring behind content */}
        <div className="absolute -left-16 -top-16 w-80 h-80 rounded-full bg-[#E0AFA0]/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="flex items-center gap-2 text-xs tracking-wider text-[#9E6E38] font-medium uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
            <span>Digital Sanctuary · Dr. Syed Karishma</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-[#26221E] font-normal leading-tight">
            Where your breath settles, healing softly begins.
          </h1>

          <p className="text-base text-[#5E5852] leading-relaxed">
            Welcome, {userProfile.name}. Step out of the relentless rush. This sacred space is dedicated to therapeutic yoga alignment, conscious Ayurveda, and deep mental ease.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={onOpenSanctuaryMode}
              className="px-6 py-3 rounded-full text-xs font-medium tracking-wide bg-[#12161A] text-[#F9F6F0] hover:bg-[#232B33] transition-all flex items-center gap-2.5 shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Moon className="w-4 h-4 text-[#E0AFA0]" />
              <span>One-Tap Twilight Sanctuary</span>
            </button>

            <button
              onClick={() => onNavigate('meditation')}
              className="px-5 py-3 rounded-full text-xs font-medium tracking-wide bg-[#FFFFFF] text-[#26221E] border border-[#D8CEBE] hover:border-[#B88554] hover:bg-[#FAF7F2] transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-2xs"
            >
              <Music className="w-4 h-4 text-[#B88554]" />
              <span>136.1 Hz OM Motion</span>
            </button>

            <button
              onClick={() => onNavigate('game')}
              className="px-5 py-3 rounded-full text-xs font-medium tracking-wide bg-[#FFFFFF] text-[#26221E] border border-[#D8CEBE] hover:border-[#B88554] hover:bg-[#FAF7F2] transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-2xs"
            >
              <Gamepad2 className="w-4 h-4 text-[#B88554]" />
              <span>Play Yoga Game</span>
            </button>

            <button
              onClick={() => onNavigate('aipose')}
              className="px-5 py-3 rounded-full text-xs font-medium tracking-wide bg-[#E8DEC8] text-[#26221E] hover:bg-[#DFCFA8] transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shadow-2xs"
            >
              <Camera className="w-4 h-4 text-[#73532C]" />
              <span>Camera Pose AI</span>
            </button>
          </div>
        </div>
      </section>

      {/* Progressive Daily Streaks & Milestones Dashboard Banner */}
      <section className="bg-gradient-to-br from-[#FFFFFF] via-[#FCFAF7] to-[#F7F3EB] border border-[#E8E1D5] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Left: Streak Counter & Sacred Flame */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FBECE8] border border-[#F0D5CF] flex items-center justify-center shrink-0 shadow-xs">
              <Flame className="w-7 h-7 text-[#CE4257] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-3xl text-[#26221E] font-medium tabular-nums">
                  {streakState.currentStreak}
                </span>
                <span className="font-serif text-lg text-[#5E5852]">Consecutive Days in Presence</span>
              </div>
              <p className="text-xs text-[#7A7268] mt-0.5 flex items-center gap-2">
                <span>{streakState.totalMinutes} minutes total stillness</span>
                <span>·</span>
                <span>{streakState.totalSessions} mindful sessions</span>
                <span>·</span>
                <span>Best: {streakState.longestStreak} days</span>
              </p>
            </div>
          </div>

          {/* Right: Milestone Badge & Social Share Trigger */}
          <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#F4EFE6] border border-[#E2D8C7] text-xs">
              <Award className="w-4 h-4 text-[#B88554]" />
              <div>
                <span className="text-[10px] text-[#7A7268] block uppercase tracking-wider leading-none">
                  Active Badge
                </span>
                <span className="font-medium text-[#26221E]">{currentBadge.title}</span>
              </div>
            </div>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#F9F6F0] border border-[#D5C9B6] hover:border-[#B88554] text-xs font-medium text-[#26221E] flex items-center gap-2 transition-all cursor-pointer shadow-2xs whitespace-nowrap"
            >
              <Share2 className="w-3.5 h-3.5 text-[#B88554]" />
              <span>Share Progress</span>
            </button>

            <button
              onClick={handleQuickLogToday}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                quickLogged
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#12161A] hover:bg-[#252C33] text-[#F9F6F0] shadow-sm'
              }`}
            >
              {quickLogged ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Sadhana Recorded!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#E0AFA0]" />
                  <span>Log Today's Practice</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 7-Day Past Week Visual Heatmap Dots */}
        <div className="pt-4 border-t border-[#EFE8DC] flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-[#7A7268] font-medium flex items-center gap-1.5">
            <span>Last 7 Days Sadhana Rhythm:</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {recentDays.map((d) => (
              <div
                key={d.dateStr}
                className="flex flex-col items-center gap-1.5"
                title={`${d.dateStr}: ${d.isCompleted ? 'Mindful session completed' : 'Rest'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-medium transition-all ${
                    d.isCompleted
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs'
                      : d.isToday
                      ? 'bg-amber-50 text-amber-800 border border-amber-300 ring-2 ring-amber-200'
                      : 'bg-[#F4EFE6] text-[#A8A096] border border-[#E8E1D5]'
                  }`}
                >
                  {d.isCompleted ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <span>{d.dayLabel.charAt(0)}</span>
                  )}
                </div>
                <span className="text-[10px] text-[#7A7268] font-mono">{d.dayLabel}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google OAuth 2.0 User Session Status Banner */}
      <section className="bg-[#FFFFFF] border border-[#E8E1D5] rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] border border-[#E2D8C7] flex items-center justify-center shrink-0">
            {currentUser?.picture ? (
              <img
                src={currentUser.picture}
                alt={currentUser.name}
                className="w-10 h-10 rounded-lg object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#26221E] uppercase tracking-wider">
                {currentUser ? 'Google Account Verified' : 'Google Sign-In & Backend Auth'}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  currentUser ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'
                }`}
              />
            </div>
            <p className="text-xs text-[#5E5852] mt-0.5">
              {currentUser ? (
                <>
                  Authenticated as <strong>{currentUser.name}</strong> ({currentUser.email}) &middot; Stored in Database
                </>
              ) : (
                'Secure OAuth 2.0 verification with Express, Mongoose schema, Helmet, and google-auth-library.'
              )}
            </p>
          </div>
        </div>

        {onOpenAuthModal && (
          <button
            onClick={onOpenAuthModal}
            className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
              currentUser
                ? 'bg-[#FAF7F2] hover:bg-[#F0EBE1] border-[#D5C9B6] text-[#26221E]'
                : 'bg-[#12161A] hover:bg-[#252C33] text-[#FFFFFF] border-transparent'
            }`}
          >
            {currentUser ? 'View Session & DB Records' : 'Sign In with Google'}
          </button>
        )}
      </section>

      {/* Daily Intention & Prompt Card: "What does your body need today?" */}
      <section className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#7A7268]">
            <span>Mindful Sadhana</span>
            <span>·</span>
            <span>Daily Tuning</span>
            <span>·</span>
            <span>Procedural Motion Guides</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#26221E] font-normal">
            What does your body need today?
          </h2>
          <p className="text-sm text-[#7A7268]">
            Select an intention below to dynamically bind its animated visualizer, anatomical spinal wave, and prana breath guide.
          </p>
        </div>

        {/* Gentle Choice Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {GENTLE_INTENTIONS.map((item) => {
            const isSelected = selectedIntentId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectIntention(item)}
                className={`p-5 text-left rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFFFFF] border-[#B88554] shadow-sm ring-1 ring-[#B88554]/30'
                    : 'bg-[#F9F6F0] border-[#E8E1D5] hover:border-[#D5C7B5] hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-base text-[#26221E] font-medium">
                    {item.label}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#B88554]" />}
                </div>
                <p className="text-xs text-[#7A7268] mt-1.5 leading-relaxed">
                  {item.sub}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-[#B88554] mt-2 font-medium">
                  <ExternalLink className="w-3 h-3" />
                  <span>Opens in isolated tab</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Procedural Motion Guide (Real Animated Motion Loops & Breath Pacing - No Fakes!) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9E6E38]">
              <Activity className="w-3.5 h-3.5 text-[#B88554]" />
              <span>Real-Time Motion Visualizer & Anatomical Guide</span>
            </div>
            <span className="text-xs text-[#5E5852]">
              Bound to: <strong>{GENTLE_INTENTIONS.find((g) => g.id === selectedIntentId)?.label}</strong>
            </span>
          </div>

          <ProceduralMotionGuide
            selectedType={selectedIntentId}
            onSelectType={(newType) => {
              setSelectedIntentId(newType);
              const found = GENTLE_INTENTIONS.find((g) => g.id === newType);
              if (found) {
                setCustomInput(found.label + ' — ' + found.sub);
                onUpdateIntention(found.label + ' — ' + found.sub);
              }
            }}
          />
        </div>

        {/* Custom Reflective Intake / Journal Row */}
        <form onSubmit={handleSaveCustom} className="p-6 bg-[#FFFFFF] rounded-2xl border border-[#E8E1D5] space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="intentionInput" className="text-xs font-medium text-[#5E5852] uppercase tracking-wider">
              Articulate Your Heart’s Word
            </label>
            {isSaved && (
              <span className="text-xs text-[#6C7A4D] font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Intention anchored for today
              </span>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="intentionInput"
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. Softening my shoulders, listening before reacting, walking barefoot on grass..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7] text-sm text-[#26221E] focus:outline-none focus:border-[#B88554]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-medium tracking-wide bg-[#26221E] text-[#F9F6F0] hover:bg-[#3D3732] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Anchor Intention
            </button>
          </div>
          {userProfile.dailyIntention && (
            <p className="text-xs text-[#7A7268] italic">
              Currently anchored: "{userProfile.dailyIntention}"
            </p>
          )}
        </form>
      </section>

      {/* Serene Daily Mantra & Vedic Contemplation */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Sacred Mantra Card */}
        <div className="p-8 rounded-3xl bg-[#F4EFE6] border border-[#E8E1D5] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#9E6E38] font-medium">
                Daily Vedic Contemplation
              </span>
              <button
                onClick={() => soundSanctuary.playSingingBowl(216)}
                title="Listen to Tibetan Singing Bowl"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[#EBE4D6] hover:bg-[#DFD6C4] text-[#26221E] transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-[#9E6E38]" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="font-serif text-2xl text-[#26221E] italic">
                “योगश्चित्तवृत्तिनिरोधः”
              </p>
              <p className="font-serif text-lg text-[#5E5852]">
                Yogas Chitta Vritti Nirodha
              </p>
            </div>

            <p className="text-sm text-[#5E5852] leading-relaxed">
              Yoga is the stilling of the fluctuations of the mind. When mental waves subside, your inner divine luminosity emerges naturally without striving.
            </p>
          </div>

          <div className="pt-4 border-t border-[#E2D9C9] text-xs text-[#7A7268] flex items-center justify-between">
            <span>Patanjali Yoga Sutra 1.2</span>
            <span>Curated by Dr. Syed Karishma</span>
          </div>
        </div>

        {/* Doctor's Guidance Card */}
        <div className="p-8 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#E8DCCB] flex items-center justify-center text-[#73532C] font-serif font-bold text-lg">
                SK
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#26221E] font-medium">
                  Dr. Syed Karishma
                </h3>
                <p className="text-xs text-[#7A7268]">
                  Integrative Ayurvedic Physician & Yoga Mentor
                </p>
              </div>
            </div>

            <blockquote className="text-sm text-[#5E5852] leading-relaxed italic border-l-2 border-[#D4A373] pl-4">
              “True wellness is not pushing the body to fit a rigid posture. It is meeting where you are right now with reverence, aligning the prana, and allowing the nervous system to feel safe enough to rest.”
            </blockquote>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#F9F6F0] text-center">
                <span className="block font-serif text-base text-[#26221E] font-medium">45 min</span>
                <span className="text-[11px] text-[#7A7268]">Sacred Consults</span>
              </div>
              <div className="p-3 rounded-xl bg-[#F9F6F0] text-center">
                <span className="block font-serif text-base text-[#26221E] font-medium">100% Gentle</span>
                <span className="text-[11px] text-[#7A7268]">Holistic Mentorship</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('matcher')}
            className="w-full py-3 rounded-xl text-xs font-medium tracking-wide bg-[#F4EFE6] hover:bg-[#EAE2D5] text-[#26221E] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-[#9E6E38]" />
            <span>Map Today's Physical & Energetic Symptoms</span>
          </button>
        </div>
      </section>

      {/* Sanctuary Pillars Bento Grid */}
      <section className="space-y-6">
        <div className="space-y-1">
          <div className="text-xs text-[#7A7268]">Sacred Pathways</div>
          <h2 className="font-serif text-2xl text-[#26221E] font-normal">
            Holistic Offerings & Sanctuary Spaces
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Entertaining Yoga Game */}
          <div
            onClick={() => onNavigate('game')}
            className="relative overflow-hidden p-7 rounded-3xl bg-gradient-to-br from-[#F5EFE6] via-[#EFE7D8] to-[#E7D6C1] border border-[#DFCDB7] hover:border-[#B88554] transition-all cursor-pointer flex flex-col justify-between space-y-4 group shadow-xs hover:shadow-md"
          >
            <div className="absolute -right-6 -bottom-6 w-36 h-36 opacity-30 group-hover:opacity-45 transition-opacity pointer-events-none">
              <ZenStonesWaterArtwork />
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#EBE3D4] flex items-center justify-center text-[#73532C] group-hover:scale-110 transition-transform shadow-2xs">
                  <Gamepad2 className="w-5 h-5 text-[#B88554]" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E0D5C1] text-[#543D1E]">
                  Playful Sadhana
                </span>
              </div>
              <h3 className="font-serif text-xl text-[#26221E] font-medium">
                Prana Harmony: Yoga Arcade
              </h3>
              <p className="text-xs text-[#5E5852] leading-relaxed">
                Entertaining yoga game! Test your rhythm in asana beats, stack river stones in deep concentration, or pair sacred Sanskrit cards.
              </p>
            </div>
            <div className="relative z-10 text-xs font-semibold text-[#9E6E38] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Play Yoga Game Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Sacred OM Meditation & 136.1 Hz Motion Guide */}
          <div
            onClick={() => onNavigate('meditation')}
            className="relative overflow-hidden p-7 rounded-3xl bg-gradient-to-br from-[#F7F4EE] to-[#EFE7DA] border border-[#E8E1D5] hover:border-[#B88554] transition-all cursor-pointer flex flex-col justify-between space-y-4 group shadow-xs hover:shadow-md"
          >
            <div className="absolute -right-10 -bottom-8 w-44 h-28 opacity-25 group-hover:opacity-40 transition-opacity pointer-events-none">
              <HimalayanSunriseArtwork />
            </div>

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#F0E6D8] flex items-center justify-center text-[#9E6E38] group-hover:scale-110 transition-transform shadow-2xs">
                  <Music className="w-5 h-5 text-[#B88554]" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F5D8CE] text-[#8C3A27]">
                  136.1 Hz OM Motion
                </span>
              </div>
              <h3 className="font-serif text-xl text-[#26221E] font-medium">
                Sacred Meditation & OM Chanting
              </h3>
              <p className="text-xs text-[#5E5852] leading-relaxed">
                Sit with serene Buddha presence. Resonate with native Web Audio 136.1 Hz OM synthesis, live chakra motion visuals, and timer bells.
              </p>
            </div>
            <div className="relative z-10 text-xs font-semibold text-[#9E6E38] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Enter 136.1 Hz OM Chamber</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Camera AI Pose Alignment */}
          <div
            onClick={() => onNavigate('aipose')}
            className="p-7 rounded-3xl bg-[#F4EFE6] border border-[#E8E1D5] hover:border-[#B88554] transition-all cursor-pointer flex flex-col justify-between space-y-4 group shadow-xs hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#EBE3D4] flex items-center justify-center text-[#73532C] group-hover:scale-110 transition-transform shadow-2xs">
                  <Camera className="w-5 h-5 text-[#73532C]" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E0D5C1] text-[#543D1E]">
                  Webcam Ready
                </span>
              </div>
              <h3 className="font-serif text-xl text-[#26221E] font-medium">
                AI Pose & Camera Biofeedback
              </h3>
              <p className="text-xs text-[#5E5852] leading-relaxed">
                Enable camera to track skeletal joints, measure plumb-line angles, and receive gentle alignment cues from Dr. Syed Karishma.
              </p>
            </div>
            <div className="text-xs font-semibold text-[#9E6E38] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Start Camera Pose Check</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Symptom Matcher */}
          <div
            onClick={() => onNavigate('matcher')}
            className="p-7 rounded-3xl bg-[#F4EFE6] border border-[#E8E1D5] hover:border-[#CBBDA9] transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EBE3D4] flex items-center justify-center text-[#73532C] group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#26221E] font-medium">
                Symptom & Energy Matcher
              </h3>
              <p className="text-xs text-[#5E5852] leading-relaxed">
                Tap soft glowing body zones (Chest, Lower Back, Mind, Digestion) to uncover customized therapeutic relief flows.
              </p>
            </div>
            <div className="text-xs font-medium text-[#9E6E38] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Find Relief Flows</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 5: Clinic Booking */}
          <div
            onClick={() => onNavigate('booking')}
            className="p-7 rounded-3xl bg-[#F4EFE6] border border-[#E8E1D5] hover:border-[#CBBDA9] transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EBE3D4] flex items-center justify-center text-[#73532C] group-hover:scale-105 transition-transform">
                <Feather className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#26221E] font-medium">
                Sacred Clinic Booking
              </h3>
              <p className="text-xs text-[#5E5852] leading-relaxed">
                Reserve an inviting window of time for a 1-on-1 consultation, accompanied by our reflective Soul & Body pre-check-in.
              </p>
            </div>
            <div className="text-xs font-medium text-[#9E6E38] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>View Open Windows</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 6: Healing Prescriptions */}
          <div
            onClick={() => onNavigate('prescriptions')}
            className="p-7 rounded-3xl bg-[#F4EFE6] border border-[#E8E1D5] hover:border-[#CBBDA9] transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EBE3D4] flex items-center justify-center text-[#73532C] group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl text-[#26221E] font-medium">
                Doctor’s Healing Prescriptions
              </h3>
              <p className="text-xs text-[#5E5852] leading-relaxed">
                Access your personalized herbal protocols, targeted asana alignments, and warm lifestyle notes issued by Dr. Karishma.
              </p>
            </div>
            <div className="text-xs font-medium text-[#9E6E38] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Review Prescriptions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 7: Ayurvedic Dosha Constitution Diagnostic */}
          <div
            onClick={() => onNavigate('dosha')}
            className="p-7 rounded-3xl bg-gradient-to-br from-[#FFFBF5] to-[#F7EDE2] border border-[#E8D5C4] hover:border-[#E07A5F] transition-all cursor-pointer flex flex-col justify-between space-y-4 group shadow-xs hover:shadow-md col-span-1 md:col-span-3 lg:col-span-1"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#FDE8DF] flex items-center justify-center text-[#E07A5F] group-hover:scale-110 transition-transform shadow-2xs">
                  <Flame className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FCE2D6] text-[#A63C1E]">
                  Charaka Samhita
                </span>
              </div>
              <h3 className="font-serif text-xl text-[#26221E] font-medium">
                Ayurvedic Dosha Diagnostic
              </h3>
              <p className="text-xs text-[#5E5852] leading-relaxed">
                Discover whether your nervous system and metabolism are governed by Vata, Pitta, or Kapha, and receive targeted constitutional asanas.
              </p>
            </div>
            <div className="text-xs font-semibold text-[#E07A5F] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Take Dosha Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Share Progress Modal */}
      <ShareProgressModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        streakState={streakState}
        userName={userProfile.name}
        dailyIntention={userProfile.dailyIntention}
      />
    </div>
  );
};
