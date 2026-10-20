/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  Clock,
  Award,
  CheckCircle2,
  TrendingUp,
  Feather,
  ArrowLeft,
  Flame,
  Share2,
  Lock,
  Activity,
  Music,
  Flower2,
  Sun,
  Crown
} from 'lucide-react';
import { UserProfile } from '../types.ts';
import { streakSystem, SanctuaryStreakState, ALL_SANCTUARY_BADGES, StreakBadge } from '../utils/streakSystem.ts';
import { ShareProgressModal } from './ShareProgressModal.tsx';
import { soundSanctuary } from '../utils/soundSanctuary.ts';

interface ProgressViewProps {
  userProfile: UserProfile;
  onBackToHome?: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ userProfile, onBackToHome }) => {
  const [streakState, setStreakState] = useState<SanctuaryStreakState>(streakSystem.getState());
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleUpdate = () => {
      setStreakState(streakSystem.getState());
    };
    window.addEventListener('sanctuary-streak-update', handleUpdate);
    return () => window.removeEventListener('sanctuary-streak-update', handleUpdate);
  }, []);

  // Compute next milestone
  const streakMilestones = [1, 3, 7, 14, 30, 100];
  const nextMilestone = streakMilestones.find((m) => m > streakState.currentStreak) || 100;
  const prevMilestone = [...streakMilestones].reverse().find((m) => m <= streakState.currentStreak) || 0;
  const progressToNext = Math.min(
    100,
    Math.round(((streakState.currentStreak - prevMilestone) / (nextMilestone - prevMilestone)) * 100)
  );

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-5 h-5 text-[#CE4257]" />;
      case 'Flower2':
        return <Flower2 className="w-5 h-5 text-[#D4A373]" />;
      case 'Activity':
        return <Activity className="w-5 h-5 text-[#6C7A4D]" />;
      case 'Sun':
        return <Sun className="w-5 h-5 text-[#E0AFA0]" />;
      case 'Crown':
        return <Crown className="w-5 h-5 text-[#B88554]" />;
      case 'Music':
        return <Music className="w-5 h-5 text-[#3A6073]" />;
      case 'Heart':
        return <Heart className="w-5 h-5 text-[#CE4257]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#D4A373]" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10 animate-fadeIn">
      {/* Back Button & Share Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-2 text-xs font-medium text-[#5E5852] hover:text-[#26221E] bg-[#FFFFFF] border border-[#E8E1D5] px-4 py-2 rounded-full transition-all cursor-pointer shadow-2xs hover:shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#9E6E38]" />
          <span>Return to Sanctuary Home</span>
        </button>

        <button
          onClick={() => {
            soundSanctuary.playZenTingsha();
            setIsShareModalOpen(true);
          }}
          className="flex items-center gap-2 text-xs font-medium text-[#73532C] bg-[#FFFFFF] hover:bg-[#F9F6F0] border border-[#D5C9B6] hover:border-[#B88554] px-4 py-2 rounded-full transition-all cursor-pointer shadow-2xs"
        >
          <Share2 className="w-3.5 h-3.5 text-[#B88554]" />
          <span>Share Sadhana Milestones</span>
        </button>
      </div>

      {/* Header */}
      <div className="max-w-2xl space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#7A7268]">
          <span>Soulful Evolution</span>
          <span>·</span>
          <span>Sadhana Milestones & Streaks</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#26221E] font-normal">
          Your Mindful Journey in Presence
        </h1>
        <p className="text-sm text-[#5E5852] leading-relaxed">
          In yoga, we do not track rigid performance or vanity streaks. We celebrate how gently you return to your breath, and how deeply your nervous system softens over time.
        </p>
      </div>

      {/* Sacred Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9E6E38]">
              Consecutive Streak
            </span>
            <Flame className="w-4 h-4 text-[#CE4257]" />
          </div>
          <div className="font-serif text-3xl text-[#26221E] font-light">
            {streakState.currentStreak} <span className="text-sm font-sans text-[#7A7268]">days</span>
          </div>
          <p className="text-[11px] text-[#7A7268]">
            Longest record: {streakState.longestStreak} days
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6C7A4D]">
              Mindful Stillness
            </span>
            <Clock className="w-4 h-4 text-[#6C7A4D]" />
          </div>
          <div className="font-serif text-3xl text-[#26221E] font-light">
            {streakState.totalMinutes} <span className="text-sm font-sans text-[#7A7268]">minutes</span>
          </div>
          <p className="text-[11px] text-[#7A7268]">
            Across {streakState.totalSessions} guided practices
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#B88554]">
              Prana Ease Index
            </span>
            <TrendingUp className="w-4 h-4 text-[#B88554]" />
          </div>
          <div className="font-serif text-3xl text-[#26221E] font-light">
            8.2 <span className="text-sm font-sans text-[#7A7268]">/ 10</span>
          </div>
          <p className="text-[11px] text-[#7A7268]">
            Up from 5.4 baseline at first consultation
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#CE4257]">
              Badges Unlocked
            </span>
            <Award className="w-4 h-4 text-[#CE4257]" />
          </div>
          <div className="font-serif text-3xl text-[#26221E] font-light">
            {streakState.unlockedBadgeIds.length} <span className="text-sm font-sans text-[#7A7268]">/ {ALL_SANCTUARY_BADGES.length}</span>
          </div>
          <p className="text-[11px] text-[#7A7268]">
            Next badge: {nextMilestone}-day milestone
          </p>
        </div>
      </div>

      {/* Progressive Streak Next Milestone Meter */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#F4EFE6] via-[#EFE7D8] to-[#EAE0D0] border border-[#E0D5C1] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#73532C] font-semibold uppercase tracking-wider">
            <Flame className="w-4 h-4 text-[#CE4257]" />
            <span>Next Sadhana Milestone: {nextMilestone} Days</span>
          </div>
          <span className="text-[#5E5852] font-medium">
            {nextMilestone - streakState.currentStreak} days remaining
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-[#E2D6C3] overflow-hidden border border-[#D5C6B0]">
          <div
            className="h-full bg-gradient-to-r from-[#D4A373] to-[#B88554] transition-all duration-700 rounded-full"
            style={{ width: `${progressToNext}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#7A7268]">
          <span>Current: {streakState.currentStreak} Days</span>
          <span>Target: {nextMilestone} Days</span>
        </div>
      </div>

      {/* Visual Reward Badges Gallery */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#9E6E38]">
              Sacred Sadhana Badges
            </span>
            <h2 className="font-serif text-2xl text-[#26221E] font-medium">
              Milestone Badges & Sacred Petals
            </h2>
            <p className="text-xs text-[#5E5852]">
              Each badge represents a sustained threshold of gentle return to your body and breath.
            </p>
          </div>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#F4EFE6] hover:bg-[#EAE2D5] text-[#26221E] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Share2 className="w-3.5 h-3.5 text-[#B88554]" />
            <span>Share My Badges</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_SANCTUARY_BADGES.map((badge) => {
            const isUnlocked = streakState.unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  isUnlocked
                    ? 'bg-[#FAF7F2] border-[#D5C9B6] shadow-xs'
                    : 'bg-[#F9F6F0]/60 border-[#E8E1D5]/70 opacity-60'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#FFFFFF] border border-[#E8E1D5] flex items-center justify-center">
                      {getBadgeIcon(badge.iconName)}
                    </div>
                    {isUnlocked ? (
                      <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Unlocked
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#A8A096] flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {badge.requiredDays ? `${badge.requiredDays} Days` : 'Special Flow'}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-serif text-base text-[#26221E] font-medium">
                      {badge.title}
                    </h4>
                    <span className="text-[11px] font-mono text-[#9E6E38]">
                      {badge.sanskrit}
                    </span>
                  </div>

                  <p className="text-xs text-[#5E5852] leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#EAE2D5] flex items-center justify-between text-[10px] text-[#7A7268]">
                  <span className="uppercase tracking-wider">{badge.category}</span>
                  <span className="capitalize">{badge.tier} tier</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Sadhana History Log */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-4">
        <h3 className="font-serif text-xl text-[#26221E] font-normal">
          Recent Mindful Sessions
        </h3>
        <div className="divide-y divide-[#EFE8DC]">
          {streakState.history.slice(0, 6).map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F4EFE6] flex items-center justify-center text-[#9E6E38]">
                  {item.type === 'om-chant' ? (
                    <Music className="w-4 h-4" />
                  ) : item.type === 'meditation' ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    <Activity className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h5 className="text-xs font-medium text-[#26221E]">
                    {item.title}
                  </h5>
                  <span className="text-[11px] text-[#7A7268]">{item.date}</span>
                </div>
              </div>

              <div className="text-xs font-mono text-[#5E5852]">
                {item.durationMinutes} min
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Practitioner Reflection Note */}
      <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-[#F4EFE6] flex items-center justify-center text-[#73532C] shrink-0 font-serif font-bold">
          SK
        </div>
        <div className="space-y-1">
          <h4 className="font-serif text-base text-[#26221E] font-medium">
            Doctor’s Mid-Cycle Encouragement
          </h4>
          <p className="text-xs text-[#5E5852] leading-relaxed">
            “Dearest {userProfile.name}, the change in your shoulder mobility and jaw relaxation is profound. Remember that progress in yoga is measured not by how deep you fold, but by the kindness with which you inhabit your own skin.” — Dr. Syed Karishma
          </p>
        </div>
      </div>

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
