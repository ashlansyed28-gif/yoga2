/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StreakBadge {
  id: string;
  title: string;
  sanskrit: string;
  description: string;
  iconName: string; // 'Flame' | 'Flower2' | 'Sparkles' | 'Sun' | 'Crown' | 'Heart' | 'Activity' | 'Music'
  unlockedAt?: string;
  tier: 'bronze' | 'silver' | 'gold' | 'celestial';
  requiredDays?: number;
  category: 'streak' | 'mastery' | 'sound';
}

export interface PracticeSessionRecord {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'yoga' | 'meditation' | 'om-chant' | 'faceyoga' | 'emergency-calm';
  title: string;
  durationMinutes: number;
  timestamp: number;
}

export interface SanctuaryStreakState {
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  totalMinutes: number;
  lastActiveDate: string; // YYYY-MM-DD
  history: PracticeSessionRecord[];
  unlockedBadgeIds: string[];
}

export const ALL_SANCTUARY_BADGES: StreakBadge[] = [
  {
    id: 'first-breath',
    title: 'First Prana Awakening',
    sanskrit: 'प्राण आरम्भ',
    description: 'Began the sacred journey with your first completed mindful session.',
    iconName: 'Sparkles',
    tier: 'bronze',
    requiredDays: 1,
    category: 'streak'
  },
  {
    id: 'awakening-3',
    title: 'Three Dawns of Stillness',
    sanskrit: 'त्रिदिवस शान्ति',
    description: 'Honored 3 consecutive days of mindful movement or breathwork.',
    iconName: 'Flame',
    tier: 'bronze',
    requiredDays: 3,
    category: 'streak'
  },
  {
    id: 'lotus-7',
    title: 'Serene Lotus Petal',
    sanskrit: 'सप्तम पद्म विकास',
    description: 'A full week of uninterrupted daily presence and sacred alignment.',
    iconName: 'Flower2',
    tier: 'silver',
    requiredDays: 7,
    category: 'streak'
  },
  {
    id: 'prana-14',
    title: 'Prana Alchemist',
    sanskrit: 'प्राण रसायन साधक',
    description: 'Two continuous weeks of honoring physical and nervous boundaries.',
    iconName: 'Activity',
    tier: 'silver',
    requiredDays: 14,
    category: 'streak'
  },
  {
    id: 'illumination-30',
    title: 'Sacred Moon Illumination',
    sanskrit: 'पूर्ण मास दीप्ति',
    description: 'A complete lunar cycle (30 days) of devotion to inner wellness.',
    iconName: 'Sun',
    tier: 'gold',
    requiredDays: 30,
    category: 'streak'
  },
  {
    id: 'century-100',
    title: 'Centennial Cosmic Stillness',
    sanskrit: 'शतदिवस कैवल्य',
    description: '100 days of transcendent peace and effortless return to breath.',
    iconName: 'Crown',
    tier: 'celestial',
    requiredDays: 100,
    category: 'streak'
  },
  {
    id: 'om-resonance',
    title: '136.1 Hz Harmonic Resonator',
    sanskrit: 'ॐकार ध्वनि सिद्ध',
    description: 'Immersed in deep sacred OM chanting and cosmic Earth vibration.',
    iconName: 'Music',
    tier: 'silver',
    category: 'sound'
  },
  {
    id: 'spinal-liberation',
    title: 'Spinal Meridian Freedom',
    sanskrit: 'मेरुदण्ड विश्रान्ति',
    description: 'Engaged the dynamic spinal softening and decompression flow.',
    iconName: 'Activity',
    tier: 'bronze',
    category: 'mastery'
  },
  {
    id: 'heart-anahata',
    title: 'Anahata Loving Kindness',
    sanskrit: 'अनाहत हृदय विस्तार',
    description: 'Dedicated practice to unburdening emotional holding in the heart.',
    iconName: 'Heart',
    tier: 'gold',
    category: 'mastery'
  }
];

const STORAGE_KEY = 'sanctuary_streak_system_v2';

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const DEFAULT_STATE: SanctuaryStreakState = {
  currentStreak: 5,
  longestStreak: 8,
  totalSessions: 14,
  totalMinutes: 195,
  lastActiveDate: getYesterdayString(),
  history: [
    {
      id: 'init-1',
      date: getYesterdayString(),
      type: 'meditation',
      title: 'Om Chanting & Cosmic Grounding (136.1 Hz)',
      durationMinutes: 15,
      timestamp: Date.now() - 86400000
    },
    {
      id: 'init-2',
      date: getYesterdayString(),
      type: 'yoga',
      title: 'Dawn Prana Awakening',
      durationMinutes: 15,
      timestamp: Date.now() - 86400000 - 3600000
    }
  ],
  unlockedBadgeIds: ['first-breath', 'awakening-3', 'om-resonance']
};

export class SanctuaryStreakSystem {
  private static instance: SanctuaryStreakSystem;

  public static getInstance(): SanctuaryStreakSystem {
    if (!this.instance) {
      this.instance = new SanctuaryStreakSystem();
    }
    return this.instance;
  }

  public getState(): SanctuaryStreakState {
    if (typeof window === 'undefined') return DEFAULT_STATE;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.saveState(DEFAULT_STATE);
        return DEFAULT_STATE;
      }
      return JSON.parse(raw);
    } catch {
      return DEFAULT_STATE;
    }
  }

  public saveState(state: SanctuaryStreakState): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new CustomEvent('sanctuary-streak-update', { detail: state }));
    } catch {
      // quiet fallback
    }
  }

  public isTodayCompleted(): boolean {
    const state = this.getState();
    return state.lastActiveDate === getTodayString();
  }

  public recordPractice(
    type: PracticeSessionRecord['type'],
    title: string,
    durationMinutes: number
  ): { newState: SanctuaryStreakState; newlyUnlockedBadges: StreakBadge[] } {
    const state = this.getState();
    const today = getTodayString();
    const yesterday = getYesterdayString();

    let newStreak = state.currentStreak;

    if (state.lastActiveDate === today) {
      // Already practiced today, keep current streak
    } else if (state.lastActiveDate === yesterday) {
      // Practiced yesterday, advance streak!
      newStreak = state.currentStreak + 1;
    } else {
      // Missed more than 1 day, start new streak of 1
      newStreak = 1;
    }

    const newLongest = Math.max(state.longestStreak, newStreak);
    const newTotalSessions = state.totalSessions + 1;
    const newTotalMinutes = state.totalMinutes + durationMinutes;

    const newRecord: PracticeSessionRecord = {
      id: 'rec-' + Date.now(),
      date: today,
      type,
      title,
      durationMinutes,
      timestamp: Date.now()
    };

    const newHistory = [newRecord, ...state.history.slice(0, 49)];

    // Evaluate badges
    const currentUnlocked = new Set(state.unlockedBadgeIds);
    const newlyUnlocked: StreakBadge[] = [];

    ALL_SANCTUARY_BADGES.forEach((badge) => {
      if (currentUnlocked.has(badge.id)) return;

      let shouldUnlock = false;
      if (badge.requiredDays !== undefined && newStreak >= badge.requiredDays) {
        shouldUnlock = true;
      }
      if (badge.id === 'om-resonance' && (type === 'om-chant' || title.toLowerCase().includes('om'))) {
        shouldUnlock = true;
      }
      if (badge.id === 'spinal-liberation' && title.toLowerCase().includes('spin')) {
        shouldUnlock = true;
      }
      if (badge.id === 'heart-anahata' && (title.toLowerCase().includes('heart') || title.toLowerCase().includes('metta'))) {
        shouldUnlock = true;
      }

      if (shouldUnlock) {
        currentUnlocked.add(badge.id);
        newlyUnlocked.push(badge);
      }
    });

    const newState: SanctuaryStreakState = {
      currentStreak: newStreak,
      longestStreak: newLongest,
      totalSessions: newTotalSessions,
      totalMinutes: newTotalMinutes,
      lastActiveDate: today,
      history: newHistory,
      unlockedBadgeIds: Array.from(currentUnlocked)
    };

    this.saveState(newState);
    return { newState, newlyUnlockedBadges: newlyUnlocked };
  }

  public getRecent7Days(): Array<{
    dateStr: string;
    dayLabel: string;
    isCompleted: boolean;
    isToday: boolean;
  }> {
    const state = this.getState();
    const result = [];
    const today = new Date();
    const completedDates = new Set(state.history.map((h) => h.date));
    if (state.lastActiveDate) {
      completedDates.add(state.lastActiveDate);
    }

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      result.push({
        dateStr,
        dayLabel: dayNames[d.getDay()],
        isCompleted: completedDates.has(dateStr),
        isToday: i === 0
      });
    }

    return result;
  }
}

export const streakSystem = SanctuaryStreakSystem.getInstance();
