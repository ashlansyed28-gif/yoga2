/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, Clock, Feather, CheckCircle2, Sparkles, Heart, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';
import { DoctorScheduleSlot, PreConsultationIntake, Appointment, SymptomZone } from '../types.ts';
import { soundSanctuary } from '../utils/soundSanctuary.ts';

interface SacredBookingProps {
  slots: DoctorScheduleSlot[];
  onBookAppointment: (appointmentData: {
    slotId: string;
    patientName: string;
    patientEmail: string;
    intake: PreConsultationIntake;
    sessionType: string;
  }) => Promise<Appointment | void>;
  prefilledZone?: SymptomZone | null;
  onNavigateToPrescriptions: () => void;
  onBackToHome?: () => void;
}

const TIGHTNESS_OPTIONS = [
  'Neck & Cervical Spine',
  'Shoulders & Trapezius',
  'Chest & Thoracic Ribs',
  'Lower Back & Lumbar',
  'Pelvis & Hip Flexors',
  'Solar Plexus & Abdomen',
  'Jaw, Face & Temples',
  'Feet & Foundation'
];

const MODALITY_OPTIONS = [
  'Therapeutic Asana (Targeted Postures)',
  'Pranayama (Breath Regimen)',
  'Ayurvedic Herbal & Lifestyle Rituals',
  'Restorative Stillness & Yoga Nidra',
  'Sound & Vocal Vibration (Mantra)'
];

export const SacredBooking: React.FC<SacredBookingProps> = ({
  slots,
  onBookAppointment,
  prefilledZone,
  onNavigateToPrescriptions,
  onBackToHome
}) => {
  const [step, setStep] = useState<'slots' | 'intake' | 'confirmed'>('slots');
  const [selectedSlot, setSelectedSlot] = useState<DoctorScheduleSlot | null>(slots[0] || null);
  const [sessionType, setSessionType] = useState<string>(
    slots[0]?.sessionType || 'Sacred Prana Consultation & Alignment'
  );

  // Reflective Pre-Consultation Soul & Body Intake State
  const [energyBaseline, setEnergyBaseline] = useState<number>(6);
  const [emotionalLandscape, setEmotionalLandscape] = useState<string>(
    prefilledZone ? `Feeling tension related to ${prefilledZone.name}. Seeking grounded calm.` : ''
  );
  const [selectedTightness, setSelectedTightness] = useState<string[]>(
    prefilledZone ? [prefilledZone.name.split(' (')[0]] : ['Neck & Cervical Spine', 'Lower Back & Lumbar']
  );
  const [burdenOrSeeking, setBurdenOrSeeking] = useState<string>('');
  const [selectedModalities, setSelectedModalities] = useState<string[]>([
    'Therapeutic Asana (Targeted Postures)',
    'Ayurvedic Herbal & Lifestyle Rituals'
  ]);
  const [sleepAndDigestion, setSleepAndDigestion] = useState<string>('');

  // User details
  const [name, setName] = useState<string>('Ashlan Syed');
  const [email, setEmail] = useState<string>('ashlansyed28@gmail.com');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  const toggleTightness = (area: string) => {
    setSelectedTightness((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const toggleModality = (modality: string) => {
    setSelectedModalities((prev) =>
      prev.includes(modality) ? prev.filter((m) => m !== modality) : [...prev, modality]
    );
  };

  const handleProceedToIntake = () => {
    if (!selectedSlot) return;
    soundSanctuary.playSingingBowl(324);
    setStep('intake');
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setIsSubmitting(true);
    const intake: PreConsultationIntake = {
      energyBaseline,
      emotionalLandscape: emotionalLandscape.trim() || 'Seeking grounded presence and bodily ease.',
      physicalTightness: selectedTightness,
      burdenOrSeeking: burdenOrSeeking.trim() || 'Release tension and learn customized daily alignment.',
      modalityPreference: selectedModalities,
      sleepAndDigestionNotes: sleepAndDigestion.trim() || 'Normal routine.'
    };

    try {
      const result = await onBookAppointment({
        slotId: selectedSlot.id,
        patientName: name,
        patientEmail: email,
        intake,
        sessionType
      });

      soundSanctuary.playSingingBowl(216);
      if (result) {
        setConfirmedAppointment(result as Appointment);
      }
      setStep('confirmed');
    } catch {
      // handled
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEnergyDescriptor = (val: number) => {
    if (val <= 3) return 'Deep depletion; body asking for restorative stillness & gentle warmth.';
    if (val <= 6) return 'Moderate baseline; carrying subtle fatigue and tension in specific nodes.';
    if (val <= 8) return 'Steady prana; seeking higher alignment and refinement of daily practice.';
    return 'Luminous & energized; ready for dynamic therapeutic integration.';
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
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
          Dr. Syed Karishma Clinic
        </span>
      </div>
      {/* Step Header */}
      <div className="max-w-2xl space-y-2">
        <div className="flex items-center gap-2 text-xs text-[#7A7268]">
          <span>Holistic Clinic</span>
          <span>·</span>
          <span>Dr. Syed Karishma</span>
          <span>·</span>
          <span>Sacred Space Reservation</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#26221E] font-normal">
          {step === 'slots' && 'Choose an Inviting Window of Time'}
          {step === 'intake' && 'Soul & Body Reflective Check-in'}
          {step === 'confirmed' && 'Your Sacred Space is Reserved'}
        </h1>
        <p className="text-sm text-[#5E5852] leading-relaxed">
          {step === 'slots' &&
            'Sessions are held virtually or in sanctuary rooms. Every slot is an unhurried, intentional container for deep listening and healing alignment.'}
          {step === 'intake' &&
            'This is not a cold clinical form. Treat this as a journal reflection so Dr. Syed Karishma can tune directly into your field before you meet.'}
          {step === 'confirmed' &&
            'We hold this hour with deep reverence. Below are your appointment notes and recommendations to prepare your space.'}
        </p>
      </div>

      {/* Step 1: Minimalist Calendar & Inviting Time Windows */}
      {step === 'slots' && (
        <div className="space-y-8">
          {/* Session Type Selectors */}
          <div className="space-y-3">
            <label className="text-xs font-medium uppercase tracking-wider text-[#5E5852]">
              Select Consultation Intention
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  title: 'Sacred Prana Consultation & Alignment',
                  duration: '45 mins',
                  desc: 'Holistic assessment of your breath, doshic balance, and personalized asana regimen.'
                },
                {
                  title: 'Integrative Therapeutic Asana Assessment',
                  duration: '45 mins',
                  desc: 'Targeted biomechanical and subtle energy alignment for persistent spine, neck, or hip tension.'
                },
                {
                  title: 'Dosha Assessment & Herbal Living Guide',
                  duration: '45 mins',
                  desc: 'Comprehensive Ayurvedic constitution diagnosis with herbal and culinary prescriptions.'
                },
                {
                  title: 'Mind-Body Deep Reset & Restorative Flow',
                  duration: '45 mins',
                  desc: 'Somatic nervous system unwinding, guided pranayama, and yoga nidra integration.'
                }
              ].map((s) => {
                const isSelected = sessionType === s.title;
                return (
                  <button
                    key={s.title}
                    onClick={() => {
                      setSessionType(s.title);
                      soundSanctuary.playSingingBowl(324);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFFFFF] border-[#B88554] shadow-sm'
                        : 'bg-[#F4EFE6] border-[#E8E1D5] hover:border-[#D5C7B5]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-base text-[#26221E] font-medium">
                        {s.title}
                      </span>
                      <span className="text-xs text-[#9E6E38] font-medium">{s.duration}</span>
                    </div>
                    <p className="text-xs text-[#5E5852] mt-1.5 leading-relaxed">{s.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Windows */}
          <div className="space-y-3">
            <label className="text-xs font-medium uppercase tracking-wider text-[#5E5852]">
              Available Windows with Dr. Syed Karishma
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {slots
                .filter((s) => s.isAvailable)
                .map((slot) => {
                  const isSelected = selectedSlot?.id === slot.id;
                  return (
                    <button
                      key={slot.id}
                      onClick={() => {
                        setSelectedSlot(slot);
                        soundSanctuary.playZenTingsha();
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#FFFFFF] border-[#B88554] shadow-sm'
                          : 'bg-[#F9F6F0] border-[#E8E1D5] hover:border-[#D5C7B5]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs text-[#9E6E38] font-medium">
                        <span>{slot.dayLabel}</span>
                        <span>{slot.period}</span>
                      </div>

                      <div className="my-2">
                        <span className="font-serif text-lg text-[#26221E] font-medium">
                          {slot.startTime} – {slot.endTime}
                        </span>
                        <span className="block text-xs text-[#7A7268] mt-0.5">
                          {slot.date}
                        </span>
                      </div>

                      <div className="text-[11px] text-[#5E5852] truncate">
                        {slot.sessionType}
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 flex justify-end">
            <button
              onClick={handleProceedToIntake}
              disabled={!selectedSlot}
              className="px-7 py-3.5 rounded-full text-xs font-medium tracking-wide bg-[#12161A] text-[#F9F6F0] hover:bg-[#252C33] disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Begin Pre-Consultation Check-in</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E0AFA0]" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Pre-Consultation Soul & Body Check-in (The Reflective Journal) */}
      {step === 'intake' && (
        <form onSubmit={handleSubmitBooking} className="space-y-8">
          {/* Selected Slot Recap */}
          <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#E8E1D5] flex items-center justify-between text-xs text-[#5E5852]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#9E6E38]" />
              <span>
                {selectedSlot?.dayLabel}, {selectedSlot?.date} ({selectedSlot?.startTime})
              </span>
              <span>·</span>
              <span className="font-medium text-[#26221E]">{sessionType}</span>
            </div>
            <button
              type="button"
              onClick={() => setStep('slots')}
              className="text-[#9E6E38] hover:underline cursor-pointer"
            >
              Change window
            </button>
          </div>

          {/* Patient Details */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-4">
            <h3 className="font-serif text-lg text-[#26221E] font-medium">
              1. Your Sacred Name & Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#5E5852] block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7] text-sm text-[#26221E] focus:outline-none focus:border-[#B88554]"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-[#5E5852] block mb-1">
                  Email Address for Sacred Meeting Details
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7] text-sm text-[#26221E] focus:outline-none focus:border-[#B88554]"
                />
              </div>
            </div>
          </div>

          {/* Energy Baseline Slider */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg text-[#26221E] font-medium">
                2. Energy Baseline Today ({energyBaseline} / 10)
              </h3>
              <span className="text-xs text-[#9E6E38] font-medium">Prana Scale</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={energyBaseline}
              onChange={(e) => setEnergyBaseline(parseInt(e.target.value, 10))}
              className="w-full accent-[#B88554] cursor-pointer"
            />
            <p className="text-xs text-[#5E5852] italic">
              {getEnergyDescriptor(energyBaseline)}
            </p>
          </div>

          {/* Physical Tightness Areas (Reflective Tags) */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-4">
            <h3 className="font-serif text-lg text-[#26221E] font-medium">
              3. Where does your physical body hold tightness right now?
            </h3>
            <p className="text-xs text-[#7A7268]">
              Select all areas that call for therapeutic softening:
            </p>
            <div className="flex flex-wrap gap-2">
              {TIGHTNESS_OPTIONS.map((area) => {
                const isSelected = selectedTightness.includes(area);
                return (
                  <button
                    type="button"
                    key={area}
                    onClick={() => toggleTightness(area)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#26221E] text-[#F9F6F0]'
                        : 'bg-[#F4EFE6] text-[#5E5852] hover:bg-[#EAE1D3]'
                    }`}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Emotional Landscape & Burden */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-4">
            <h3 className="font-serif text-lg text-[#26221E] font-medium">
              4. Emotional Landscape & What You Seek to Unburden
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[#5E5852] block mb-1">
                  How does your emotional heart feel right now?
                </label>
                <textarea
                  rows={3}
                  value={emotionalLandscape}
                  onChange={(e) => setEmotionalLandscape(e.target.value)}
                  placeholder="e.g. Squeezed between deadlines, feeling a subtle grief or fatigue, yearning to breathe freely..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7] text-sm text-[#26221E] focus:outline-none focus:border-[#B88554]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#5E5852] block mb-1">
                  What single burden or question do you wish to lay down during our consultation?
                </label>
                <textarea
                  rows={2}
                  value={burdenOrSeeking}
                  onChange={(e) => setBurdenOrSeeking(e.target.value)}
                  placeholder="e.g. I want to release the habit of clenching my jaw and establish an unhurried morning sadhana."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7] text-sm text-[#26221E] focus:outline-none focus:border-[#B88554]"
                />
              </div>
            </div>
          </div>

          {/* Preferred Modality Focus */}
          <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-4">
            <h3 className="font-serif text-lg text-[#26221E] font-medium">
              5. Preferred Healing Modalities
            </h3>
            <div className="flex flex-wrap gap-2">
              {MODALITY_OPTIONS.map((m) => {
                const isSelected = selectedModalities.includes(m);
                return (
                  <button
                    type="button"
                    key={m}
                    onClick={() => toggleModality(m)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#B88554] text-[#FFFFFF]'
                        : 'bg-[#F4EFE6] text-[#5E5852] hover:bg-[#EAE1D3]'
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <label className="text-xs font-medium text-[#5E5852] block mb-1">
                Sleep & Digestion Rhythm (Optional Note)
              </label>
              <input
                type="text"
                value={sleepAndDigestion}
                onChange={(e) => setSleepAndDigestion(e.target.value)}
                placeholder="e.g. Sleep is light around 3 AM; digestion feels cold or slow."
                className="w-full px-4 py-2 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7] text-xs text-[#26221E] focus:outline-none focus:border-[#B88554]"
              />
            </div>
          </div>

          {/* Submit Row */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep('slots')}
              className="text-xs text-[#5E5852] hover:text-[#26221E] cursor-pointer"
            >
              ← Back to Time Windows
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-full text-xs font-medium tracking-wide bg-[#12161A] text-[#F9F6F0] hover:bg-[#252C33] disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Feather className="w-4 h-4 text-[#E0AFA0]" />
              <span>{isSubmitting ? 'Confirming Sacred Space...' : 'Confirm Sacred Reservation'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Sacred Confirmation & Preparation Guide */}
      {step === 'confirmed' && (
        <div className="space-y-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#EBF0DC] text-[#6C7A4D] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <span className="text-xs uppercase tracking-wider text-[#9E6E38] font-medium">
                Confirmed with Dr. Syed Karishma
              </span>
              <h2 className="font-serif text-3xl text-[#26221E] font-medium">
                Your Window is Lovingly Prepared
              </h2>
              <p className="text-sm text-[#5E5852] leading-relaxed">
                Thank you, {name}. Dr. Syed Karishma has received your pre-consultation reflection and will hold space for you on:
              </p>
            </div>

            {/* Appointment Box */}
            <div className="p-6 rounded-2xl bg-[#F9F6F0] border border-[#E8E1D5] max-w-md mx-auto text-left space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg text-[#26221E] font-medium">
                  {selectedSlot?.dayLabel}, {selectedSlot?.date}
                </span>
                <span className="text-xs text-[#9E6E38] font-semibold">
                  {selectedSlot?.startTime} – {selectedSlot?.endTime}
                </span>
              </div>
              <p className="text-xs text-[#5E5852] font-medium">
                {sessionType}
              </p>
              <div className="text-[11px] text-[#7A7268] pt-2 border-t border-[#E8E1D5] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#6C7A4D]" />
                Private encrypted consultation room link sent to {email}
              </div>
            </div>

            {/* Preparation Sanctuary Guide */}
            <div className="p-6 rounded-2xl bg-[#F4EFE6] text-left max-w-xl mx-auto space-y-3">
              <h4 className="font-serif text-sm font-semibold text-[#26221E]">
                Preparation Sanctuary Guide before meeting Dr. Karishma:
              </h4>
              <ul className="text-xs text-[#5E5852] space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#9E6E38]">•</span>
                  <span>Wear comfortable, unrestrictive clothing made of natural fibers (cotton, linen).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#9E6E38]">•</span>
                  <span>Avoid heavy meals 90 minutes prior to session; warm water or herbal tea is recommended.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#9E6E38]">•</span>
                  <span>Set aside a quiet corner with a mat or chair where you will not be disturbed.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={onNavigateToPrescriptions}
                className="px-6 py-3 rounded-full text-xs font-medium tracking-wide bg-[#26221E] text-[#F9F6F0] hover:bg-[#3D3732] transition-colors cursor-pointer"
              >
                <span>View Assigned Healing Prescriptions</span>
              </button>

              <button
                onClick={() => {
                  setStep('slots');
                }}
                className="px-6 py-3 rounded-full text-xs font-medium tracking-wide bg-[#F4EFE6] text-[#26221E] hover:bg-[#EAE2D5] transition-colors cursor-pointer"
              >
                <span>Book Another Session</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
