/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Sparkles,
  Flame,
  Award,
  Heart,
  ExternalLink,
  MessageCircle,
  Twitter,
  Linkedin
} from 'lucide-react';
import { SanctuaryStreakState, ALL_SANCTUARY_BADGES } from '../utils/streakSystem.ts';
import { soundSanctuary } from '../utils/soundSanctuary.ts';

interface ShareProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  streakState: SanctuaryStreakState;
  userName: string;
  dailyIntention?: string;
}

export const ShareProgressModal: React.FC<ShareProgressModalProps> = ({
  isOpen,
  onClose,
  streakState,
  userName,
  dailyIntention
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedQuote, setCopiedQuote] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentBadge = ALL_SANCTUARY_BADGES.find((b) =>
    streakState.unlockedBadgeIds.includes(b.id)
  ) || ALL_SANCTUARY_BADGES[0];

  const shareTitle = `${userName}’s Mindful Journey · ${streakState.currentStreak}-Day Sadhana Streak`;
  const shareText = `🕊️ I've maintained a ${streakState.currentStreak}-day mindful presence streak at Dr. Syed Karishma's Yoga Sanctuary & Holistic Clinic.\n\n✨ Total Stillness: ${streakState.totalMinutes} minutes across ${streakState.totalSessions} sessions.\n🪷 Badge: ${currentBadge.title} (${currentBadge.sanskrit})\n🧘 Intention: "${dailyIntention || 'Honoring physical limits with gentleness.'}"\n\nJoin the digital sanctuary:`;
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://yoga-sanctuary.app';

  const handleNativeShare = async () => {
    soundSanctuary.playZenTingsha();
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyText();
    }
  };

  const handleCopyText = () => {
    const fullMessage = `${shareTitle}\n\n${shareText}\n${shareUrl}`;
    navigator.clipboard.writeText(fullMessage);
    soundSanctuary.playSingingBowl(324);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyQuote = () => {
    const quote = `“True wellness is not pushing the body to fit a rigid posture. It is meeting where you are right now with reverence, aligning the prana, and allowing the nervous system to feel safe enough to rest.” — Dr. Syed Karishma\n\nPracticing mindful yoga & holistic Ayurveda: ${shareUrl}`;
    navigator.clipboard.writeText(quote);
    soundSanctuary.playZenTingsha();
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2500);
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(`${shareText}\n${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const openTwitter = () => {
    const tweet = encodeURIComponent(`Honoring my nervous system with a ${streakState.currentStreak}-day mindful yoga & breathwork streak at Dr. Syed Karishma's Yoga Sanctuary. 🕊️✨ #YogaSanctuary #Mindfulness #HolisticWellness`);
    window.open(`https://twitter.com/intent/tweet?text=${tweet}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const openLinkedIn = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#12161A]/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl border border-[#E2D8C7] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E1D5] bg-[#FFFFFF]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#F4EFE6] flex items-center justify-center text-[#9E6E38]">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#26221E] font-medium leading-none">
                Share Mindful Progress
              </h3>
              <p className="text-[11px] text-[#7A7268] mt-1">
                Inspire friends and sangha with your sacred sadhana
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A7268] hover:text-[#26221E] hover:bg-[#F4EFE6] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Aesthetic Sanctuary Progress Card Preview */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#26221E] via-[#1E252C] to-[#12161A] text-[#F9F6F0] p-6 shadow-md border border-[#3E4A56]">
            {/* Subtle sacred lotus watermark */}
            <div className="absolute -right-8 -bottom-8 w-44 h-44 opacity-10 pointer-events-none text-[#E0AFA0]">
              <svg viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M50 10 C60 35 65 45 50 70 C35 45 40 35 50 10 Z" />
                <path d="M10 50 C35 60 45 65 70 50 C45 35 35 40 10 50 Z" />
                <path d="M22 22 C43 37 49 47 50 70 C37 49 27 43 22 22 Z" />
                <path d="M78 22 C57 37 51 47 50 70 C63 49 73 43 78 22 Z" />
              </svg>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#D4A373] tracking-wider uppercase font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Dr. Syed Karishma · Yoga Sanctuary
                </span>
                <span className="text-[#9E9589] font-mono text-[10px]">
                  {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <div>
                <span className="text-xs text-[#CCD5AE]">Practitioner Sadhana</span>
                <h4 className="font-serif text-2xl text-[#FFFFFF] font-normal mt-0.5">
                  {userName}
                </h4>
              </div>

              <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#354350]">
                <div>
                  <div className="text-[10px] text-[#A8A096] uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3 h-3 text-[#E0AFA0]" />
                    Streak
                  </div>
                  <div className="font-serif text-xl text-[#F9F6F0] font-medium mt-0.5">
                    {streakState.currentStreak} <span className="text-xs font-sans text-[#A8A096]">days</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#A8A096] uppercase tracking-wider">
                    Stillness
                  </div>
                  <div className="font-serif text-xl text-[#F9F6F0] font-medium mt-0.5">
                    {streakState.totalMinutes} <span className="text-xs font-sans text-[#A8A096]">mins</span>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-[#A8A096] uppercase tracking-wider">
                    Sessions
                  </div>
                  <div className="font-serif text-xl text-[#F9F6F0] font-medium mt-0.5">
                    {streakState.totalSessions}
                  </div>
                </div>
              </div>

              {/* Badge & Intention */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-2 text-xs text-[#E0AFA0]">
                  <Award className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span className="font-medium">{currentBadge.title}</span>
                  <span className="text-[#8E9B97] text-[11px]">({currentBadge.sanskrit})</span>
                </div>
                {dailyIntention && (
                  <p className="text-xs text-[#C5BDB2] italic line-clamp-2">
                    “{dailyIntention}”
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Direct Social Channels */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A7268] block">
              Share Direct to Sangha
            </span>

            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={openWhatsApp}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#FFFFFF] border border-[#E8E1D5] hover:border-[#25D366] hover:bg-[#F2FAF4] text-[#26221E] transition-all cursor-pointer text-xs font-medium"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={openTwitter}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#FFFFFF] border border-[#E8E1D5] hover:border-[#1DA1F2] hover:bg-[#F2F8FC] text-[#26221E] transition-all cursor-pointer text-xs font-medium"
              >
                <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                <span>X / Post</span>
              </button>

              <button
                onClick={openLinkedIn}
                className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#FFFFFF] border border-[#E8E1D5] hover:border-[#0A66C2] hover:bg-[#F2F7FC] text-[#26221E] transition-all cursor-pointer text-xs font-medium"
              >
                <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                <span>LinkedIn</span>
              </button>
            </div>
          </div>

          {/* Quick Copy & Native Share Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleNativeShare}
              className="w-full py-3.5 rounded-xl bg-[#12161A] hover:bg-[#252C33] text-[#F9F6F0] text-xs font-medium tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Share2 className="w-4 h-4 text-[#E0AFA0]" />
              <span>Share via Device Sheet (Web Share API)</span>
            </button>

            <button
              onClick={handleCopyText}
              className="w-full py-3 rounded-xl bg-[#FFFFFF] hover:bg-[#F4EFE6] text-[#26221E] border border-[#E8E1D5] text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Streak Card Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[#9E6E38]" />
                  <span>Copy Streak Card & Link</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopyQuote}
              className="w-full py-2.5 rounded-xl text-xs text-[#7A7268] hover:text-[#26221E] hover:bg-[#F0EAE0] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              {copiedQuote ? (
                <span className="text-emerald-700 font-medium">Doctor's quote copied!</span>
              ) : (
                <span>Copy Dr. Karishma's Wisdom Quote Only</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
