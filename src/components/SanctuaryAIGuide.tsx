/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Volume2, Feather, Compass, Heart, Bot } from 'lucide-react';
import { soundSanctuary } from '../utils/soundSanctuary.ts';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface SanctuaryAIGuideProps {
  isOpen: boolean;
  onClose: () => void;
  currentContext?: string;
}

const QUICK_PROMPTS = [
  'How do I modify Cobra for lower back comfort?',
  'Guide me through a breathwork for racing thoughts',
  'What Ayurvedic ritual balances evening fatigue?',
  'How can Face Yoga relieve my clenched jaw?'
];

export const SanctuaryAIGuide: React.FC<SanctuaryAIGuideProps> = ({
  isOpen,
  onClose,
  currentContext = 'Sanctuary Studio'
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Namaste. I am your AI Sanctuary Guide, grounded in Dr. Syed Karishma’s teachings. Ask me about posture modifications, breath ratios, Ayurvedic dosha balancing, or calming practices for your nervous system today.'
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: textToSend.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    soundSanctuary.playZenTingsha();

    try {
      const res = await fetch('/api/ai-guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          context: currentContext
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply }
        ]);
        soundSanctuary.playSingingBowl(324);
      } else {
        throw new Error('Response error');
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Breathe gently and listen to your body. Honor your edges with compassion today; healing unfolds naturally when you release the need to force.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] bg-[#FAF7F2] border-l border-[#E8E1D5] shadow-2xl flex flex-col justify-between animate-fadeIn select-none">
      {/* Top Bar Header */}
      <div className="p-5 border-b border-[#E8E1D5] bg-[#FFFFFF] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#F4EFE6] flex items-center justify-center text-[#9E6E38]">
            <Sparkles className="w-4 h-4 text-[#D4A373]" />
          </div>
          <div>
            <h3 className="font-serif text-base text-[#26221E] font-medium leading-none">
              AI Sanctuary Guide
            </h3>
            <span className="text-[11px] text-[#7A7268] mt-0.5 block">
              Grounded in Dr. Syed Karishma’s Wisdom
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => soundSanctuary.playSingingBowl(216)}
            title="Ring Tibetan Bowl"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A7268] hover:text-[#26221E] hover:bg-[#F4EFE6] transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-[#9E6E38]" />
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#7A7268] hover:text-[#26221E] hover:bg-[#F4EFE6] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message Chat History */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={idx}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] text-[#A0988E] mb-1 px-1">
                {isUser ? 'You' : 'Dr. Karishma AI Guide'}
              </span>
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[88%] ${
                  isUser
                    ? 'bg-[#12161A] text-[#F9F6F0] rounded-tr-sm'
                    : 'bg-[#FFFFFF] text-[#26221E] border border-[#E8E1D5] rounded-tl-sm shadow-xs'
                }`}
              >
                {m.content}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-[#7A7268] pl-2 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#B88554]" />
            <span>Consulting Ayurvedic & Yogic wisdom...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Container */}
      <div className="px-4 py-2 border-t border-[#E8E1D5] bg-[#FFFFFF]/80 overflow-x-auto no-scrollbar flex items-center gap-2">
        {QUICK_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-xl bg-[#F4EFE6] hover:bg-[#EAE2D5] text-[11px] text-[#5E5852] whitespace-nowrap transition-colors cursor-pointer shrink-0"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-4 border-t border-[#E8E1D5] bg-[#FFFFFF] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask for posture cues, herbal remedies, breathing..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7] text-xs sm:text-sm text-[#26221E] focus:outline-none focus:border-[#B88554]"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="w-10 h-10 rounded-xl bg-[#12161A] text-[#F9F6F0] hover:bg-[#252C33] disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer shrink-0"
        >
          <Send className="w-4 h-4 text-[#E0AFA0]" />
        </button>
      </form>
    </div>
  );
};
