/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Send, Volume2, Sparkles, Feather, CheckCircle2, MessageCircle } from 'lucide-react';
import { WeeklyReflection, MessageItem } from '../types.ts';
import { soundSanctuary } from '../utils/soundSanctuary.ts';

interface MentorshipSanghaProps {
  reflections: WeeklyReflection[];
  messages: MessageItem[];
  onSubmitReflection: (reflectionId: string, text: string, mood: string) => Promise<void>;
  onSendMessage: (text: string) => Promise<void>;
}

const MOOD_OPTIONS = ['Softening & Receptive', 'Grounded Presence', 'Tender & Healing', 'Restless but Aware', 'Expanding'];

export const MentorshipSangha: React.FC<MentorshipSanghaProps> = ({
  reflections,
  messages,
  onSubmitReflection,
  onSendMessage
}) => {
  const [activeTab, setActiveTab] = useState<'reflections' | 'messages'>('reflections');

  // Reflection form state
  const [selectedReflection, setSelectedReflection] = useState<WeeklyReflection>(reflections[1] || reflections[0]);
  const [reflectionText, setReflectionText] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<string>(MOOD_OPTIONS[0]);
  const [isSubmittingRef, setIsSubmittingRef] = useState<boolean>(false);
  const [refSuccess, setRefSuccess] = useState<boolean>(false);

  // Message chat state
  const [messageInput, setMessageInput] = useState<string>('');
  const [isSendingMsg, setIsSendingMsg] = useState<boolean>(false);

  const handleSubmitRef = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionText.trim()) return;

    setIsSubmittingRef(true);
    try {
      await onSubmitReflection(selectedReflection.id, reflectionText.trim(), selectedMood);
      soundSanctuary.playSingingBowl(216);
      setRefSuccess(true);
      setReflectionText('');
      setTimeout(() => setRefSuccess(false), 3000);
    } catch {
      // handled
    } finally {
      setIsSubmittingRef(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    setIsSendingMsg(true);
    try {
      await onSendMessage(messageInput.trim());
      soundSanctuary.playZenTingsha();
      setMessageInput('');
    } catch {
      // handled
    } finally {
      setIsSendingMsg(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E8E1D5] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#7A7268]">
            <span>Sangha & Guidance</span>
            <span>·</span>
            <span>1-on-1 Mentorship</span>
          </div>
          <h1 className="font-serif text-3xl text-[#26221E] font-normal mt-1">
            Gentle Inquiries & Safe Space Sharing
          </h1>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 bg-[#EFE9DD] rounded-xl border border-[#DFD7C7]">
          <button
            onClick={() => {
              setActiveTab('reflections');
              soundSanctuary.playZenTingsha();
            }}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'reflections'
                ? 'bg-[#FFFFFF] text-[#26221E] shadow-sm'
                : 'text-[#5E5852] hover:text-[#26221E]'
            }`}
          >
            Weekly Reflections
          </button>
          <button
            onClick={() => {
              setActiveTab('messages');
              soundSanctuary.playZenTingsha();
            }}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'messages'
                ? 'bg-[#26221E] text-[#F9F6F0] shadow-sm'
                : 'text-[#5E5852] hover:text-[#26221E]'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#E0AFA0]" />
            <span>Safe Space Thread</span>
          </button>
        </div>
      </div>

      {/* TAB 1: WEEKLY REFLECTIONS */}
      {activeTab === 'reflections' && (
        <div className="space-y-10">
          {/* Week Selector strip */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 text-xs">
            <span className="text-[#7A7268] whitespace-nowrap">Weekly Reflections:</span>
            {reflections.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedReflection(r);
                  soundSanctuary.playSingingBowl(324);
                }}
                className={`px-3.5 py-1.5 rounded-xl border whitespace-nowrap transition-colors cursor-pointer ${
                  selectedReflection.id === r.id
                    ? 'bg-[#26221E] text-[#F9F6F0] border-[#26221E]'
                    : 'bg-[#F4EFE6] text-[#5E5852] border-[#E8E1D5] hover:border-[#D5C7B5]'
                }`}
              >
                Week {r.weekNumber}: {r.theme}
              </button>
            ))}
          </div>

          {/* Current Reflection Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9E6E38]">
                Week {selectedReflection.weekNumber} Contemplation
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#26221E] font-medium">
                {selectedReflection.theme}
              </h2>
              <p className="font-serif text-lg text-[#3D3732] italic leading-relaxed">
                “{selectedReflection.inquiry}”
              </p>
              <p className="text-xs text-[#7A7268]">
                Mentor Prompt: {selectedReflection.mentorPrompt}
              </p>
            </div>

            {/* If previously answered, display response and mentor guidance */}
            {selectedReflection.userResponse && (
              <div className="p-6 rounded-2xl bg-[#F9F6F0] border border-[#E8E1D5] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#5E5852]">
                    Your Submitted Reflection
                  </span>
                  <span className="text-xs text-[#9E6E38] font-medium">
                    Mood: {selectedReflection.userResponse.recordedMood}
                  </span>
                </div>
                <p className="text-sm text-[#26221E] leading-relaxed italic">
                  “{selectedReflection.userResponse.reflectionText}”
                </p>

                {selectedReflection.mentorGuidance && (
                  <div className="pt-4 border-t border-[#E8E1D5] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#6C7A4D]">
                        Guidance from Dr. Syed Karishma
                      </span>
                      <button
                        onClick={() => soundSanctuary.playSingingBowl(216)}
                        title="Play Dr. Karishma Singing Bowl"
                        className="flex items-center gap-1.5 text-xs text-[#73532C] hover:text-[#26221E] cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Resonance Chime</span>
                      </button>
                    </div>
                    <p className="text-sm text-[#3D3732] leading-relaxed">
                      {selectedReflection.mentorGuidance.notes}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Response Input Form */}
            <form onSubmit={handleSubmitRef} className="space-y-5 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#5E5852] block">
                  Write Your Truthful Reflection
                </label>
                <textarea
                  rows={4}
                  required
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder="Take three steady breaths. What surfaced in your body and heart this week? Write without revising..."
                  className="w-full px-4 py-3 rounded-2xl border border-[#E8E1D5] bg-[#FDFBF7] text-sm text-[#26221E] focus:outline-none focus:border-[#B88554]"
                />
              </div>

              {/* Mood selector */}
              <div className="space-y-2">
                <span className="text-xs font-medium text-[#7A7268] block">
                  How does your prana feel in this present moment?
                </span>
                <div className="flex flex-wrap gap-2">
                  {MOOD_OPTIONS.map((mood) => (
                    <button
                      type="button"
                      key={mood}
                      onClick={() => setSelectedMood(mood)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                        selectedMood === mood
                          ? 'bg-[#26221E] text-[#F9F6F0]'
                          : 'bg-[#F4EFE6] text-[#5E5852] hover:bg-[#EAE1D3]'
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {refSuccess && (
                  <span className="text-xs text-[#6C7A4D] font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Reflection held with reverence. Dr. Karishma will review.
                  </span>
                )}
                <div className="ml-auto">
                  <button
                    type="submit"
                    disabled={isSubmittingRef}
                    className="px-7 py-3 rounded-full text-xs font-medium tracking-wide bg-[#12161A] text-[#F9F6F0] hover:bg-[#252C33] disabled:opacity-50 transition-all cursor-pointer shadow-sm"
                  >
                    <span>{isSubmittingRef ? 'Submitting...' : 'Submit Gentle Reflection'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: SAFE SPACE SHARING (DISTRACTION-FREE PRIVATE MESSAGES) */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E1D5] text-xs text-[#5E5852] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-[#9E6E38]" />
              Private, distraction-free sanctuary with Dr. Syed Karishma.
            </span>
            <span className="text-[#7A7268]">Responses arrive with mindful care</span>
          </div>

          {/* Messages Container */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] min-h-[380px] max-h-[480px] overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isDoctor = msg.sender === 'dr_karishma';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isDoctor ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-medium text-[#7A7268]">
                      {msg.senderName}
                    </span>
                    <span className="text-[10px] text-[#A0988E]">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div
                    className={`max-w-md p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isDoctor
                        ? 'bg-[#F4EFE6] text-[#26221E] border border-[#E8E1D5] rounded-tl-sm'
                        : 'bg-[#26221E] text-[#F9F6F0] rounded-tr-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              required
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Share a form check, bodily sensation, or personal growth note..."
              className="flex-1 px-5 py-3 rounded-2xl border border-[#E8E1D5] bg-[#FFFFFF] text-sm text-[#26221E] focus:outline-none focus:border-[#B88554]"
            />
            <button
              type="submit"
              disabled={isSendingMsg || !messageInput.trim()}
              className="px-6 py-3 rounded-2xl bg-[#12161A] text-[#F9F6F0] hover:bg-[#252C33] disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4 text-[#E0AFA0]" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
