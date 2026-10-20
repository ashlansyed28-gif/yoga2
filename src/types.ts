/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PreConsultationIntake {
  energyBaseline: number; // 1 to 10
  emotionalLandscape: string;
  physicalTightness: string[];
  burdenOrSeeking: string;
  modalityPreference: string[];
  sleepAndDigestionNotes: string;
}

export interface DoctorScheduleSlot {
  id: string;
  date: string;
  dayLabel: string;
  startTime: string;
  endTime: string;
  period: 'Morning Dawn' | 'Midday Prana' | 'Twilight Sanctuary';
  isAvailable: boolean;
  sessionType: string;
}

export interface Appointment {
  id: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  sessionType: string;
  patientName: string;
  patientEmail: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  intake: PreConsultationIntake;
  createdAt: string;
}

export interface TargetedAsana {
  name: string;
  sanskrit: string;
  duration: string;
  breathFocus: string;
  therapeuticCue: string;
}

export interface HerbalRitual {
  timeOfDay: string;
  ritualName: string;
  herbalFormula: string;
  instructions: string;
}

export interface HealingPrescription {
  id: string;
  appointmentId?: string;
  patientName: string;
  doctorName: string;
  issuedDate: string;
  primaryEnergyState: string;
  personalDoctorNote: string;
  targetedYogaSequence: {
    sequenceTitle: string;
    totalDuration: string;
    intention: string;
    asanas: TargetedAsana[];
  };
  herbalRituals: HerbalRitual[];
  pranayamaPrescription: {
    breathName: string;
    ratio: string;
    dailyDuration: string;
    guidance: string;
  };
  followUpWindow: string;
}

export interface WeeklyReflection {
  id: string;
  weekNumber: number;
  theme: string;
  inquiry: string;
  mentorPrompt: string;
  userResponse?: {
    reflectionText: string;
    recordedMood: string;
    submittedAt: string;
  };
  mentorGuidance?: {
    notes: string;
    audioCueTitle?: string;
    repliedAt: string;
  };
}

export interface MessageItem {
  id: string;
  sender: 'user' | 'dr_karishma';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  currentDoshaFocus: string;
  dailyIntention: string;
  currentStreakDays: number;
  joinedDate: string;
}

export interface SymptomZone {
  id: string;
  name: string;
  sanskritName: string;
  element: string;
  color: string;
  description: string;
  symptoms: string[];
  recommendedAsanas: TargetedAsana[];
  herbalRemedy: string;
  pranayamaTip: string;
}
