/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Moon, Volume2, VolumeX, Sparkles, ArrowLeft, Gamepad2, Flame, Share2 } from 'lucide-react';
import { soundSanctuary } from '../utils/soundSanctuary.ts';

import { AuthUser } from './GoogleLoginModal.tsx';

export type NavTabId =
  | 'yoga'
  | 'protocols'
  | 'aipose'
  | 'emergency'
  | 'meditation'
  | 'sleep'
  | 'faceyoga'
  | 'game'
  | 'consult'
  | 'progress'
  | 'community'
  | 'dosha'
  | 'sanctuary';

interface TopBarProps {
  currentTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  onOpenSanctuaryMode: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenAIGuide?: () => void;
  currentUser?: AuthUser | null;
  onOpenAuthModal?: () => void;
  currentStreak?: number;
  onOpenShareModal?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSanctuaryMode,
  isMuted,
  onToggleSound,
  onOpenAIGuide,
  currentUser,
  onOpenAuthModal,
  currentStreak = 5,
  onOpenShareModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F9F6F0]/95 backdrop-blur-md border-b border-[#E8E1D5] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand Zone: Dr. Syed Karishma + One-Click Back to Sanctuary */}
        <div className="flex items-center gap-3 shrink-0">
          {currentTab !== 'sanctuary' && (
            <button
              onClick={() => onSelectTab('sanctuary')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#5E5852] hover:text-[#26221E] bg-[#FFFFFF] hover:bg-[#F4EFE6] border border-[#E8E1D5] transition-all cursor-pointer shadow-2xs hover:shadow-xs"
              title="Return to Sanctuary Home"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#9E6E38]" />
              <span className="hidden sm:inline">Home</span>
            </button>
          )}

          <button
            onClick={() => onSelectTab('sanctuary')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-[#26221E] group-hover:text-[#B88554] transition-colors whitespace-nowrap">
              Dr. Syed Karishma
            </span>
          </button>
        </div>

        {/* Center Nav Links: Exactly matching the user's reference */}
        <nav className="hidden xl:flex items-center gap-4 text-sm font-medium text-[#5E5852] overflow-x-auto py-1">
          <button
            onClick={() => onSelectTab('yoga')}
            className={`cursor-pointer transition-colors whitespace-nowrap pb-1 border-b-2 ${
              currentTab === 'yoga'
                ? 'border-[#B88554] text-[#26221E] font-semibold'
                : 'border-transparent hover:text-[#26221E]'
            }`}
          >
            Yoga
          </button>

          <button
            onClick={() => onSelectTab('protocols')}
            className={`cursor-pointer transition-colors whitespace-nowrap pb-1 border-b-2 ${
              currentTab === 'protocols'
                ? 'border-[#B88554] text-[#26221E] font-semibold'
                : 'border-transparent hover:text-[#26221E]'
            }`}
          >
            Protocols
          </button>

          <button
            onClick={() => onSelectTab('aipose')}
            className={`cursor-pointer transition-colors whitespace-nowrap pb-1 border-b-2 ${
              currentTab === 'aipose'
                ? 'border-[#B88554] text-[#26221E] font-semibold'
                : 'border-transparent hover:text-[#26221E]'
            }`}
          >
            AI Pose
          </button>

          {/* Emergency Calm - Highlighted in soft sacred red/rose matching user image */}
          <button
            onClick={() => onSelectTab('emergency')}
            className={`cursor-pointer transition-colors whitespace-nowrap pb-1 border-b-2 text-[#CE4257] font-semibold ${
              currentTab === 'emergency'
                ? 'border-[#CE4257]'
                : 'border-transparent hover:text-[#A82B3E]'
            }`}
          >
            Emergency Calm
          </button>

          <button
            onClick={() => onSelectTab('meditation')}
            className={`cursor-pointer transition-colors whitespace-nowrap pb-1 border-b-2 ${
              currentTab === 'meditation'
                ? 'border-[#B88554] text-[#26221E] font-semibold'
                : 'border-transparent hover:text-[#26221E]'
            }`}
          >
            Meditation
          </button>

          <button
            onClick={() => onSelectTab('sleep')}
            className={`cursor-pointer transition-colors whitespace-nowrap pb-1 border-b-2 ${
              currentTab === 'sleep'
                ? 'border-[#B88554] text-[#26221E] font-semibold'
                : 'border-transparent hover:text-[#26221E]'
            }`}
          >
            Sleep
          </button>

          <button
            onClick={() => onSelectTab('faceyoga')}
            className={`cursor-pointer transition-colors whitespace-nowrap pb-1 border-b-2 ${
              currentTab === 'faceyoga'
                ? 'border-[#B88554] text-[#26221E] font-semibold'
                : 'border-transparent hover:text-[#26221E]'
            }`}
          >
            Face Yoga
          </button>

          <button
            onClick={() => onSelectTab('game')}
            className={`cursor-pointer transition-colors whitespace-nowrap pb-1 border-b-2 flex items-center gap-1.5 ${
              currentTab === 'game'
                ? 'border-[#B88554] text-[#26221E] font-semibold'
                : 'border-transparent hover:text-[#26221E]'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-[#B88554]" />
            <span>Yoga Game</span>
          </button>

          <button
            onClick={() => onSelectTab('consult')}
            className={`cursor-pointer transition-colors whitespace-nowrap pb-1 border-b-2 ${
              currentTab === 'consult'
                ? 'border-[#B88554] text-[#26221E] font-semibold'
                : 'border-transparent hover:text-[#26221E]'
            }`}
          >
            Consult
          </button>

          <button
            onClick={() => onSelectTab('progress')}
            className={`cursor-pointer transition-colors whitespace-nowrap pb-1 border-b-2 ${
              currentTab === 'progress'
                ? 'border-[#B88554] text-[#26221E] font-semibold'
                : 'border-transparent hover:text-[#26221E]'
            }`}
          >
            Progress
          </button>

          <button
            onClick={() => onSelectTab('community')}
            className={`cursor-pointer transition-colors whitespace-nowrap pb-1 border-b-2 ${
              currentTab === 'community'
                ? 'border-[#B88554] text-[#26221E] font-semibold'
                : 'border-transparent hover:text-[#26221E]'
            }`}
          >
            Community
          </button>
        </nav>

        {/* Action Zone: AI Guide + Sound Toggle + One-Tap Twilight Sanctuary Mode */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Google Sign-In / User Profile Button */}
          {onOpenAuthModal && (
            <button
              onClick={onOpenAuthModal}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-2xs ${
                currentUser
                  ? 'bg-[#FFFFFF] border-[#D5C9B6] text-[#26221E] hover:border-[#B88554]'
                  : 'bg-[#FFFFFF] border-[#D5C9B6] text-[#4A423A] hover:bg-[#F9F6F0] hover:border-[#B88554]'
              }`}
              title={currentUser ? `Signed in as ${currentUser.name}` : 'Sign in with Google'}
            >
              {currentUser ? (
                <>
                  {currentUser.picture ? (
                    <img
                      src={currentUser.picture}
                      alt={currentUser.name}
                      className="w-4 h-4 rounded-full object-cover border border-[#B88554]"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-[#B88554] text-white text-[9px] font-bold flex items-center justify-center">
                      {currentUser.name.charAt(0)}
                    </span>
                  )}
                  <span className="hidden sm:inline font-semibold max-w-[90px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                  <span className="hidden sm:inline font-medium">Google Sign-In</span>
                  <span className="sm:hidden font-medium">Sign-In</span>
                </>
              )}
            </button>
          )}

          {/* Progressive Sadhana Streak Quick Pill */}
          <button
            onClick={() => onSelectTab('progress')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#FBECE8] text-[#9E4A38] border border-[#F0D5CF] hover:bg-[#F7E1DB] transition-all cursor-pointer shadow-2xs shrink-0"
            title="View Sadhana Streaks & Milestones"
          >
            <Flame className="w-3.5 h-3.5 text-[#CE4257]" />
            <span className="font-semibold tabular-nums">{currentStreak}d Streak</span>
          </button>

          {/* Social Share Trigger */}
          {onOpenShareModal && (
            <button
              onClick={onOpenShareModal}
              title="Share Sadhana Progress"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#5E5852] hover:text-[#26221E] hover:bg-[#F0EBE1] transition-colors cursor-pointer shrink-0"
            >
              <Share2 className="w-4 h-4 text-[#B88554]" />
            </button>
          )}

          {onOpenAIGuide && (
            <button
              onClick={onOpenAIGuide}
              className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#F4EFE6] border border-[#E0D5C1] text-[#73532C] hover:bg-[#EAE0CD] transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B88554]" />
              <span className="hidden sm:inline">AI Guide</span>
            </button>
          )}

          <button
            onClick={() => {
              onToggleSound();
              soundSanctuary.playSingingBowl(324);
            }}
            title={isMuted ? 'Unmute Soundscapes' : 'Mute Sound'}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#5E5852] hover:text-[#26221E] hover:bg-[#F0EBE1] transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              soundSanctuary.playSingingBowl(216);
              onOpenSanctuaryMode();
            }}
            className="px-3.5 py-2 rounded-full text-xs tracking-wide font-medium bg-[#12161A] text-[#F9F6F0] hover:bg-[#252C33] transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 shadow-sm"
          >
            <Moon className="w-3.5 h-3.5 text-[#E0AFA0]" />
            <span className="hidden sm:inline">Sanctuary</span>
          </button>
        </div>
      </div>

      {/* Sub-strip navigation for screens below xl breakpoint */}
      <div className="xl:hidden flex items-center gap-4 px-4 py-2 bg-[#F4EFE6] border-t border-[#E8E1D5] overflow-x-auto text-xs font-medium text-[#5E5852] no-scrollbar">
        <button
          onClick={() => onSelectTab('yoga')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'yoga' ? 'bg-[#EAE2D5] text-[#26221E] font-semibold' : ''}`}
        >
          Yoga
        </button>
        <button
          onClick={() => onSelectTab('protocols')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'protocols' ? 'bg-[#EAE2D5] text-[#26221E] font-semibold' : ''}`}
        >
          Protocols
        </button>
        <button
          onClick={() => onSelectTab('aipose')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'aipose' ? 'bg-[#EAE2D5] text-[#26221E] font-semibold' : ''}`}
        >
          AI Pose
        </button>
        <button
          onClick={() => onSelectTab('emergency')}
          className={`whitespace-nowrap px-2 py-1 rounded text-[#CE4257] font-semibold ${currentTab === 'emergency' ? 'bg-[#FBE8EC]' : ''}`}
        >
          Emergency Calm
        </button>
        <button
          onClick={() => onSelectTab('meditation')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'meditation' ? 'bg-[#EAE2D5] text-[#26221E] font-semibold' : ''}`}
        >
          Meditation
        </button>
        <button
          onClick={() => onSelectTab('sleep')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'sleep' ? 'bg-[#EAE2D5] text-[#26221E] font-semibold' : ''}`}
        >
          Sleep
        </button>
        <button
          onClick={() => onSelectTab('faceyoga')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'faceyoga' ? 'bg-[#EAE2D5] text-[#26221E] font-semibold' : ''}`}
        >
          Face Yoga
        </button>
        <button
          onClick={() => onSelectTab('game')}
          className={`whitespace-nowrap px-2 py-1 rounded flex items-center gap-1 ${currentTab === 'game' ? 'bg-[#EAE2D5] text-[#26221E] font-semibold' : 'text-[#73532C]'}`}
        >
          <span>🎮</span>
          <span>Yoga Game</span>
        </button>
        <button
          onClick={() => onSelectTab('consult')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'consult' ? 'bg-[#EAE2D5] text-[#26221E] font-semibold' : ''}`}
        >
          Consult
        </button>
        <button
          onClick={() => onSelectTab('progress')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'progress' ? 'bg-[#EAE2D5] text-[#26221E] font-semibold' : ''}`}
        >
          Progress
        </button>
        <button
          onClick={() => onSelectTab('community')}
          className={`whitespace-nowrap px-2 py-1 rounded ${currentTab === 'community' ? 'bg-[#EAE2D5] text-[#26221E] font-semibold' : ''}`}
        >
          Community
        </button>
      </div>
    </header>
  );
};
