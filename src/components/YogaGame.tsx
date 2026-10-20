/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Trophy, RotateCcw, ArrowLeft, Volume2, Heart, Award, Play, Pause, Flame, Smile } from 'lucide-react';
import { soundSanctuary } from '../utils/soundSanctuary.ts';
import { ZenStonesWaterArtwork, BuddhaMeditationArtwork } from './ZenVisuals.tsx';

type GameMode = 'rhythm' | 'balance' | 'memory';

interface YogaGameProps {
  onBackToHome?: () => void;
}

// Data for Rhythm Game
const RHYTHM_POSES = [
  { id: 'tree', name: 'Tree Pose', sanskrit: 'Vrksasana', key: '1', symbol: '🌲', color: '#6C7A4D' },
  { id: 'warrior', name: 'Warrior II', sanskrit: 'Virabhadrasana', key: '2', symbol: '⚔️', color: '#D4A373' },
  { id: 'lotus', name: 'Lotus Seat', sanskrit: 'Padmasana', key: '3', symbol: '🪷', color: '#E0AFA0' },
  { id: 'cobra', name: 'Cobra Pose', sanskrit: 'Bhujangasana', key: '4', symbol: '🐍', color: '#B88554' }
];

// Data for Memory Game
const MEMORY_CARDS_DATA = [
  { id: 'm1', pairId: 'tree', title: 'Vrksasana', sub: 'Sanskrit Name', icon: '🌲' },
  { id: 'm2', pairId: 'tree', title: 'Tree Pose', sub: 'Rooted Balance', icon: '🌲' },
  { id: 'm3', pairId: 'lotus', title: 'Padmasana', sub: 'Sanskrit Name', icon: '🪷' },
  { id: 'm4', pairId: 'lotus', title: 'Lotus Seat', sub: 'Dhyana Stillness', icon: '🪷' },
  { id: 'm5', pairId: 'warrior', title: 'Virabhadrasana', sub: 'Sanskrit Name', icon: '🏹' },
  { id: 'm6', pairId: 'warrior', title: 'Warrior Flow', sub: 'Grounded Courage', icon: '🏹' },
  { id: 'm7', pairId: 'dog', title: 'Adho Mukha', sub: 'Sanskrit Name', icon: '🐕' },
  { id: 'm8', pairId: 'dog', title: 'Downward Dog', sub: 'Spinal Traction', icon: '🐕' }
];

export const YogaGame: React.FC<YogaGameProps> = ({ onBackToHome }) => {
  const [mode, setMode] = useState<GameMode>('rhythm');

  // Rhythm Mode State
  const [rhythmScore, setRhythmScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [activeTargetIndex, setActiveTargetIndex] = useState<number>(0);
  const [rhythmPlaying, setRhythmPlaying] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<string>('Press start to flow!');
  const [pranaPulse, setPranaPulse] = useState<number>(50); // 0 to 100 ring expansion

  // Balance Stone State
  const [stackedStones, setStackedStones] = useState<number[]>([120]); // stone widths
  const [currentStoneWidth, setCurrentStoneWidth] = useState<number>(90);
  const [swingPos, setSwingPos] = useState<number>(50); // 10% to 90%
  const [swingDir, setSwingDir] = useState<number>(1);
  const [balanceGameOver, setBalanceGameOver] = useState<boolean>(false);
  const [balanceWon, setBalanceWon] = useState<boolean>(false);

  // Memory Card State
  const [cards, setCards] = useState<Array<typeof MEMORY_CARDS_DATA[0] & { isFlipped: boolean; isMatched: boolean }>>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [memoryMatches, setMemoryMatches] = useState<number>(0);

  // Init memory cards shuffled
  const initMemoryGame = () => {
    const shuffled = [...MEMORY_CARDS_DATA]
      .sort(() => Math.random() - 0.5)
      .map((c) => ({ ...c, isFlipped: false, isMatched: false }));
    setCards(shuffled);
    setFlippedIds([]);
    setMemoryMatches(0);
  };

  useEffect(() => {
    initMemoryGame();
  }, []);

  // Rhythm Animation Loop
  useEffect(() => {
    if (!rhythmPlaying) return;

    const interval = setInterval(() => {
      setPranaPulse((p) => {
        if (p >= 98) {
          // Missed beat
          setCombo(0);
          setFeedbackText('Missed! Stay centered...');
          setActiveTargetIndex(Math.floor(Math.random() * RHYTHM_POSES.length));
          return 10;
        }
        return p + 3.5;
      });
    }, 70);

    return () => clearInterval(interval);
  }, [rhythmPlaying]);

  // Balance Stone Swing Loop
  useEffect(() => {
    if (balanceGameOver || balanceWon) return;

    const swingTimer = setInterval(() => {
      setSwingPos((pos) => {
        if (pos >= 85) setSwingDir(-1);
        if (pos <= 15) setSwingDir(1);
        return pos + swingDir * 2.2;
      });
    }, 30);

    return () => clearInterval(swingTimer);
  }, [swingDir, balanceGameOver, balanceWon]);

  // Handle Rhythm Input
  const handleRhythmTap = (poseIndex: number) => {
    if (!rhythmPlaying) {
      setRhythmPlaying(true);
      soundSanctuary.playSingingBowl(324);
      return;
    }

    if (poseIndex === activeTargetIndex) {
      // Check timing accuracy (ideal is between 75 and 95)
      if (pranaPulse >= 70 && pranaPulse <= 95) {
        const points = 100 + combo * 10;
        setRhythmScore((s) => s + points);
        setCombo((c) => {
          const next = c + 1;
          if (next > maxCombo) setMaxCombo(next);
          return next;
        });
        setFeedbackText('✨ Divine Sthira! Perfect Alignment!');
        soundSanctuary.playMeditationBell(432 + combo * 20);
      } else {
        setRhythmScore((s) => s + 40);
        setCombo(1);
        setFeedbackText('Gentle flow! Closer to the pulse next time.');
        soundSanctuary.playZenTingsha();
      }
      setPranaPulse(10);
      setActiveTargetIndex(Math.floor(Math.random() * RHYTHM_POSES.length));
    } else {
      setCombo(0);
      setFeedbackText('Wrong asana! Take a settling breath.');
      soundSanctuary.playSingingBowl(216);
    }
  };

  // Handle Stone Drop
  const handleDropStone = () => {
    if (balanceGameOver || balanceWon) return;

    const targetCenter = 50;
    const diff = Math.abs(swingPos - targetCenter);

    if (diff > 18) {
      // Toppled!
      setBalanceGameOver(true);
      soundSanctuary.playSingingBowl(216);
    } else {
      // Stone landed smoothly
      const nextStack = [...stackedStones, Math.max(35, currentStoneWidth - 10)];
      setStackedStones(nextStack);
      setCurrentStoneWidth(Math.max(35, currentStoneWidth - 12));
      soundSanctuary.playMeditationBell(324 + nextStack.length * 40);

      if (nextStack.length >= 7) {
        setBalanceWon(true);
        soundSanctuary.playSingingBowl(432);
      }
    }
  };

  const handleResetBalance = () => {
    setStackedStones([120]);
    setCurrentStoneWidth(90);
    setBalanceGameOver(false);
    setBalanceWon(false);
    soundSanctuary.playZenTingsha();
  };

  // Handle Memory Card Flip
  const handleCardClick = (cardId: string) => {
    if (flippedIds.length >= 2) return;

    const clickedCard = cards.find((c) => c.id === cardId);
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return;

    soundSanctuary.playZenTingsha();

    const newCards = cards.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c));
    setCards(newCards);

    const newFlipped = [...flippedIds, cardId];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      const [firstId, secondId] = newFlipped;
      const first = newCards.find((c) => c.id === firstId);
      const second = newCards.find((c) => c.id === secondId);

      if (first && second && first.pairId === second.pairId) {
        // Match!
        setTimeout(() => {
          soundSanctuary.playMeditationBell(432);
          setCards((prev) =>
            prev.map((c) => (c.pairId === first.pairId ? { ...c, isMatched: true } : c))
          );
          setMemoryMatches((m) => m + 1);
          setFlippedIds([]);
        }, 500);
      } else {
        // No match -> flip back
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c))
          );
          setFlippedIds([]);
        }, 1000);
      }
    }
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
          Prana Harmony · Playful Yoga Mindfulness
        </span>
      </div>

      {/* Header Banner with Calming Zen Art */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F5EFE6] via-[#EFE7D8] to-[#E5D7C2] border border-[#E0D5C1] p-6 sm:p-10 shadow-sm">
        {/* Subtle Zen Pebble Illustration in Header Background */}
        <div className="absolute -right-6 -bottom-6 w-48 h-48 opacity-25 sm:opacity-40 pointer-events-none">
          <ZenStonesWaterArtwork />
        </div>

        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#7A7268]">
            <Sparkles className="w-3.5 h-3.5 text-[#B88554]" />
            <span>Mindful Play</span>
            <span>·</span>
            <span>Prana Flow Game Studio</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#26221E] font-normal">
            Prana Harmony: The Sacred Yoga Arcade
          </h1>
          <p className="text-sm text-[#5E5852] leading-relaxed">
            Yoga is joy, concentration, and playful presence. Flow to the rhythmic pulse of asanas, balance smooth river stones, or match sacred Sanskrit poses!
          </p>
        </div>
      </div>

      {/* Game Mode Selector */}
      <div className="flex items-center justify-center p-1.5 bg-[#EFE9DD] rounded-2xl max-w-md mx-auto border border-[#E0D7C5]">
        <button
          onClick={() => {
            setMode('rhythm');
            soundSanctuary.playZenTingsha();
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer text-center ${
            mode === 'rhythm'
              ? 'bg-[#FFFFFF] text-[#26221E] shadow-sm'
              : 'text-[#5E5852] hover:text-[#26221E]'
          }`}
        >
          🎵 Chakra Rhythm Flow
        </button>
        <button
          onClick={() => {
            setMode('balance');
            soundSanctuary.playZenTingsha();
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer text-center ${
            mode === 'balance'
              ? 'bg-[#FFFFFF] text-[#26221E] shadow-sm'
              : 'text-[#5E5852] hover:text-[#26221E]'
          }`}
        >
          🪨 Zen Stone Stacker
        </button>
        <button
          onClick={() => {
            setMode('memory');
            soundSanctuary.playZenTingsha();
          }}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer text-center ${
            mode === 'memory'
              ? 'bg-[#FFFFFF] text-[#26221E] shadow-sm'
              : 'text-[#5E5852] hover:text-[#26221E]'
          }`}
        >
          🎴 Sanskrit Card Quest
        </button>
      </div>

      {/* MODE 1: CHAKRA RHYTHM FLOW */}
      {mode === 'rhythm' && (
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] shadow-sm text-center space-y-8">
          <div className="flex items-center justify-between border-b border-[#EFE8DC] pb-4">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-wider text-[#9E6E38] font-semibold">
                Prana Energy Score:
              </span>
              <span className="font-serif text-2xl text-[#26221E] font-medium tabular-nums">
                {rhythmScore}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#6C7A4D] font-medium">
                Combo: <strong>{combo}x</strong>
              </span>
              <span className="text-xs text-[#7A7268]">· Max {maxCombo}</span>
            </div>
          </div>

          {/* Central Prana Rhythm Halo Ring */}
          <div className="relative flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80 mx-auto my-4">
            {/* Target Alignment Circle */}
            <div className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full border-2 border-[#D4A373] opacity-80" />
            <div className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full border border-[#E0AFA0]/40" />

            {/* Expanding Pulse Ring */}
            <div
              className="absolute rounded-full border-4 border-[#B88554] transition-all ease-linear"
              style={{
                width: `${pranaPulse * 2.4}px`,
                height: `${pranaPulse * 2.4}px`,
                opacity: pranaPulse > 70 && pranaPulse < 95 ? 1 : 0.4
              }}
            />

            {/* Target Pose Symbol in Center */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <span className="text-5xl sm:text-6xl animate-bounce">
                {RHYTHM_POSES[activeTargetIndex].symbol}
              </span>
              <span className="font-serif text-lg sm:text-xl text-[#26221E] font-medium mt-2">
                {RHYTHM_POSES[activeTargetIndex].name}
              </span>
              <span className="text-xs text-[#7A7268] italic">
                {RHYTHM_POSES[activeTargetIndex].sanskrit}
              </span>
            </div>
          </div>

          {/* Feedback banner */}
          <div className="font-serif text-sm text-[#73532C] italic">
            {feedbackText}
          </div>

          {/* Controls: Tap the matching Pose */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-2">
            {RHYTHM_POSES.map((pose, idx) => (
              <button
                key={pose.id}
                onClick={() => handleRhythmTap(idx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 active:scale-95 ${
                  activeTargetIndex === idx && rhythmPlaying
                    ? 'bg-[#FFF9F2] border-[#B88554] shadow-md ring-2 ring-[#B88554]/30'
                    : 'bg-[#F9F6F0] border-[#E8E1D5] hover:bg-[#F3EFE7]'
                }`}
              >
                <span className="text-2xl">{pose.symbol}</span>
                <span className="font-serif text-xs font-medium text-[#26221E]">
                  {pose.name}
                </span>
                <span className="text-[10px] text-[#7A7268]">{pose.key}</span>
              </button>
            ))}
          </div>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setRhythmPlaying(!rhythmPlaying);
                soundSanctuary.playSingingBowl(324);
              }}
              className="px-7 py-3 rounded-full bg-[#12161A] text-[#F9F6F0] text-xs font-medium tracking-wide hover:bg-[#252C33] transition-colors cursor-pointer shadow-sm flex items-center gap-2"
            >
              {rhythmPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#E0AFA0]" />
                  <span>Pause Flow</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-[#E0AFA0]" />
                  <span>Start Rhythm Flow</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setRhythmScore(0);
                setCombo(0);
                setPranaPulse(10);
                soundSanctuary.playZenTingsha();
              }}
              className="p-3 rounded-full border border-[#E8E1D5] hover:bg-[#F4EFE6] text-[#5E5852] transition-colors cursor-pointer"
              title="Reset Score"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: ZEN STONE STACKER */}
      {mode === 'balance' && (
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] shadow-sm text-center space-y-8">
          <div className="flex items-center justify-between border-b border-[#EFE8DC] pb-4">
            <div className="space-y-0.5 text-left">
              <span className="text-xs uppercase tracking-wider text-[#9E6E38] font-semibold">
                Stones Stacked in Stillness:
              </span>
              <span className="font-serif text-2xl text-[#26221E] font-medium block">
                {stackedStones.length} / 7
              </span>
            </div>

            <button
              onClick={handleResetBalance}
              className="px-4 py-2 rounded-full border border-[#E8E1D5] text-xs font-medium text-[#5E5852] hover:bg-[#F4EFE6] transition-colors cursor-pointer"
            >
              Restart Stacking
            </button>
          </div>

          {/* Stacking Physics Canvas Area */}
          <div className="relative h-80 sm:h-96 w-full max-w-lg mx-auto bg-gradient-to-b from-[#F9F6F0] to-[#EFE7DC] rounded-3xl border border-[#E2D8C7] overflow-hidden flex flex-col justify-between p-6">
            {/* Swinging Hanging Stone */}
            <div className="relative w-full h-16">
              {!balanceGameOver && !balanceWon && (
                <div
                  className="absolute top-0 transition-transform -translate-x-1/2 flex flex-col items-center"
                  style={{ left: `${swingPos}%` }}
                >
                  <div className="w-0.5 h-6 bg-[#A39686]" />
                  <div
                    className="h-7 rounded-full bg-gradient-to-b from-[#A39686] to-[#6E6254] shadow-md border border-[#C5B7A6]"
                    style={{ width: `${currentStoneWidth}px` }}
                  />
                </div>
              )}
            </div>

            {/* Stacked Stones Base */}
            <div className="w-full flex flex-col items-center justify-end pb-4 space-y-1">
              {stackedStones.map((w, i) => (
                <div
                  key={i}
                  className="h-8 rounded-full bg-gradient-to-b from-[#B8A896] to-[#7B6E5F] border border-[#E0D4C5] shadow-sm transition-all"
                  style={{ width: `${w}px` }}
                />
              ))}

              {/* Water Pebble Base */}
              <div className="w-48 h-4 rounded-full bg-[#CCD5AE]/60 mt-1 blur-2xs" />
            </div>

            {/* Game Over / Won Overlays */}
            {balanceGameOver && (
              <div className="absolute inset-0 bg-[#12161A]/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-[#F9F6F0] space-y-3">
                <span className="text-3xl">🪨💨</span>
                <h3 className="font-serif text-2xl font-medium">The Cairn Swayed & Toppled</h3>
                <p className="text-xs text-[#8A9BA8] max-w-xs">
                  Balance is not holding rigidly; it is finding center again after falling.
                </p>
                <button
                  onClick={handleResetBalance}
                  className="px-6 py-2.5 rounded-full bg-[#D4A373] text-[#26221E] text-xs font-semibold hover:bg-[#C29060] transition-colors cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            )}

            {balanceWon && (
              <div className="absolute inset-0 bg-[#12161A]/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-[#F9F6F0] space-y-3">
                <span className="text-4xl animate-bounce">🪷✨</span>
                <h3 className="font-serif text-2xl font-medium text-[#CCD5AE]">
                  Sacred 7-Stone Cairn Completed!
                </h3>
                <p className="text-xs text-[#8A9BA8] max-w-xs">
                  Profound steadiness. You hold the peaceful stillness of a Himalayan monk.
                </p>
                <button
                  onClick={handleResetBalance}
                  className="px-6 py-2.5 rounded-full bg-[#CCD5AE] text-[#26221E] text-xs font-semibold hover:bg-[#B5BF95] transition-colors cursor-pointer"
                >
                  Stack Again
                </button>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              onClick={handleDropStone}
              disabled={balanceGameOver || balanceWon}
              className="px-8 py-3.5 rounded-full bg-[#12161A] text-[#F9F6F0] hover:bg-[#252C33] disabled:opacity-40 text-xs font-medium tracking-wide transition-all cursor-pointer shadow-md"
            >
              Release & Drop Stone on Center
            </button>
          </div>
        </div>
      )}

      {/* MODE 3: SANSKRIT CARD QUEST */}
      {mode === 'memory' && (
        <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] shadow-sm text-center space-y-8">
          <div className="flex items-center justify-between border-b border-[#EFE8DC] pb-4">
            <div className="space-y-0.5 text-left">
              <span className="text-xs uppercase tracking-wider text-[#9E6E38] font-semibold">
                Sanskrit Pairs Awakened:
              </span>
              <span className="font-serif text-2xl text-[#26221E] font-medium block">
                {memoryMatches} / 4
              </span>
            </div>

            <button
              onClick={initMemoryGame}
              className="px-4 py-2 rounded-full border border-[#E8E1D5] text-xs font-medium text-[#5E5852] hover:bg-[#F4EFE6] transition-colors cursor-pointer"
            >
              Reshuffle Cards
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {cards.map((card) => {
              const showFront = card.isFlipped || card.isMatched;
              return (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={card.isMatched}
                  className={`h-36 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-center p-3 select-none ${
                    showFront
                      ? 'bg-[#F4EFE6] border-[#B88554] shadow-sm'
                      : 'bg-[#12161A] border-[#2A333C] hover:bg-[#1B2228]'
                  }`}
                >
                  {showFront ? (
                    <div className="space-y-1">
                      <span className="text-3xl">{card.icon}</span>
                      <h4 className="font-serif text-sm font-medium text-[#26221E] leading-snug">
                        {card.title}
                      </h4>
                      <span className="text-[10px] text-[#7A7268] block">{card.sub}</span>
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <span className="text-2xl text-[#D4A373] opacity-60">ॐ</span>
                      <span className="text-[10px] uppercase tracking-widest text-[#8A9BA8] block">
                        Reveal
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {memoryMatches === 4 && (
            <div className="p-4 rounded-2xl bg-[#EBF0DC] text-xs text-[#6C7A4D] font-medium max-w-md mx-auto">
              🎉 Divine mastery! All 4 sacred asana pairs awakened with clarity.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
