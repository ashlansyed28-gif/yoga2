/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Heart, Sparkles, Send, Users, Volume2, CheckCircle2, MessageCircle, ArrowLeft } from 'lucide-react';
import { soundSanctuary } from '../utils/soundSanctuary.ts';

interface SanghaPost {
  id: string;
  author: string;
  location: string;
  text: string;
  likes: number;
  doctorReply?: string;
  timestamp: string;
}

const SEED_POSTS: SanghaPost[] = [
  {
    id: 'post-1',
    author: 'Meera K.',
    location: 'Kyoto, Japan',
    text: 'Completed the 15-minute Dawn Prana flow before the sunrise. Feeling the tight knots between my shoulder blades unravel into gentle warmth.',
    likes: 24,
    doctorReply: 'Radiant morning devotion, Meera. Let that warmth hold your heart steady through your workday.',
    timestamp: '2 hours ago'
  },
  {
    id: 'post-2',
    author: 'David L.',
    location: 'Vancouver, Canada',
    text: 'The 60-second Emergency Calm saved me during an intense presentation pause. Taking that double inhale through the nose was like stepping into an ocean breeze.',
    likes: 38,
    doctorReply: 'That is the innate wisdom of your vagus nerve at work, David. Proud of your mindful pause.',
    timestamp: '5 hours ago'
  },
  {
    id: 'post-3',
    author: 'Sunita P.',
    location: 'Kerala, India',
    text: 'Sipping the Golden Moon Milk with freshly grated nutmeg tonight. Grateful for this distraction-free sanctuary space.',
    likes: 19,
    timestamp: '8 hours ago'
  }
];

interface CommunitySanghaProps {
  onBackToHome?: () => void;
}

export const CommunitySangha: React.FC<CommunitySanghaProps> = ({ onBackToHome }) => {
  const [posts, setPosts] = useState<SanghaPost[]>(SEED_POSTS);
  const [newText, setNewText] = useState<string>('');
  const [inCircle, setInCircle] = useState<boolean>(false);
  const [meditatorCount, setMeditatorCount] = useState<number>(47);

  const handleJoinCircle = () => {
    if (!inCircle) {
      setMeditatorCount((c) => c + 1);
      setInCircle(true);
      soundSanctuary.playSingingBowl(216);
    } else {
      setMeditatorCount((c) => c - 1);
      setInCircle(false);
      soundSanctuary.playZenTingsha();
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newPost: SanghaPost = {
      id: `post-${Date.now()}`,
      author: 'Ashlan Syed',
      location: 'Sanctuary Member',
      text: newText.trim(),
      likes: 1,
      timestamp: 'Just now'
    };

    setPosts([newPost, ...posts]);
    setNewText('');
    soundSanctuary.playSingingBowl(324);
  };

  const handleLike = (id: string) => {
    setPosts(
      posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
    soundSanctuary.playZenTingsha();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10 animate-fadeIn">
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
          Living Sangha Community
        </span>
      </div>
      {/* Header */}
      <div className="max-w-2xl space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#7A7268]">
          <span>Sacred Sangha</span>
          <span>·</span>
          <span>Collective Stillness</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#26221E] font-normal">
          The Living Sanctuary Community
        </h1>
        <p className="text-sm text-[#5E5852] leading-relaxed">
          You are never alone in your spiritual sadhana. Join fellow practitioners sitting in noble silence, and share gentle words of mutual encouragement.
        </p>
      </div>

      {/* Global Silent Meditation Hall Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#F4EFE6] border border-[#E8E1D5] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-[#9E6E38]">
            <Users className="w-4 h-4" />
            <span>Global Silent Meditation Hall</span>
          </div>
          <h2 className="font-serif text-2xl text-[#26221E] font-medium">
            {meditatorCount} Souls Meditating in Presence Right Now
          </h2>
          <p className="text-xs text-[#5E5852] max-w-md">
            Enter the collective field of quiet. Zero conversation, zero notifications—simply sitting together in sacred resonance.
          </p>
        </div>

        <button
          onClick={handleJoinCircle}
          className={`px-7 py-3.5 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap shadow-sm shrink-0 flex items-center gap-2 ${
            inCircle
              ? 'bg-[#26221E] text-[#F9F6F0]'
              : 'bg-[#12161A] text-[#F9F6F0] hover:bg-[#252C33]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#E0AFA0]" />
          <span>{inCircle ? 'Sitting in Circle (Leave)' : 'Join Silent Circle'}</span>
        </button>
      </div>

      {/* Post a Sacred Note Form */}
      <form onSubmit={handleCreatePost} className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-[#5E5852]">
            Share a Gentle Realization or Gratitude Note
          </label>
          <span className="text-xs text-[#7A7268]">Dr. Syed Karishma periodically responds</span>
        </div>
        <textarea
          rows={3}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="What shifted in your breath, heart, or body during practice today? Write with gentle truth..."
          className="w-full px-4 py-3 rounded-2xl border border-[#E8E1D5] bg-[#FDFBF7] text-sm text-[#26221E] focus:outline-none focus:border-[#B88554]"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newText.trim()}
            className="px-6 py-2.5 rounded-full bg-[#12161A] text-[#F9F6F0] hover:bg-[#252C33] disabled:opacity-40 text-xs font-medium tracking-wide transition-colors cursor-pointer flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5 text-[#E0AFA0]" />
            <span>Share with Sangha</span>
          </button>
        </div>
      </form>

      {/* Sangha Posts Stream */}
      <div className="space-y-5">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#7A7268] block">
          Recent Shared Reflections
        </span>

        {posts.map((post) => (
          <div
            key={post.id}
            className="p-6 sm:p-7 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <strong className="text-sm font-medium text-[#26221E] block">
                  {post.author}
                </strong>
                <span className="text-[11px] text-[#7A7268]">
                  {post.location} · {post.timestamp}
                </span>
              </div>

              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center gap-1.5 text-xs text-[#7A7268] hover:text-[#CE4257] transition-colors cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5" />
                <span>{post.likes}</span>
              </button>
            </div>

            <p className="text-sm text-[#3D3732] leading-relaxed">
              {post.text}
            </p>

            {/* Doctor's caring reply */}
            {post.doctorReply && (
              <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E1D5] space-y-1">
                <div className="flex items-center gap-2 text-xs font-medium text-[#73532C]">
                  <span>Dr. Syed Karishma</span>
                  <span className="text-[10px] text-[#9E6E38]">· Mentor Note</span>
                </div>
                <p className="text-xs text-[#5E5852] italic leading-relaxed">
                  “{post.doctorReply}”
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
