/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Feather, Heart, Sparkles, Volume2, Plus, Check, Clock, Sun, Moon, Shield, Box, ArrowLeft } from 'lucide-react';
import { HealingPrescription, Appointment } from '../types.ts';
import { soundSanctuary } from '../utils/soundSanctuary.ts';

interface HealingPrescriptionViewProps {
  prescriptions: HealingPrescription[];
  appointments: Appointment[];
  onCreatePrescription: (prescriptionData: Partial<HealingPrescription>) => Promise<void>;
  onBackToHome?: () => void;
  onOpenPoseTab?: (asanaName: string) => void;
}

export const HealingPrescriptionView: React.FC<HealingPrescriptionViewProps> = ({
  prescriptions,
  appointments,
  onCreatePrescription,
  onBackToHome,
  onOpenPoseTab
}) => {
  const [viewMode, setViewMode] = useState<'patient' | 'doctor'>('patient');
  const [selectedRx, setSelectedRx] = useState<HealingPrescription>(prescriptions[0]);

  // Doctor Form State
  const [patientName, setPatientName] = useState<string>('Ashlan Syed');
  const [energyState, setEnergyState] = useState<string>(
    'Vata-Pitta Aggravation with Upper Spine Compression'
  );
  const [doctorNote, setDoctorNote] = useState<string>(
    'Honor the quiet pauses between calls. Prioritize warmth, cooked root vegetables, and slow exhalations.'
  );
  const [sequenceTitle, setSequenceTitle] = useState<string>(
    'Apana Grounding & Thoracic Softening Flow'
  );
  const [duration, setDuration] = useState<string>('20 minutes');
  const [herbalMorning, setHerbalMorning] = useState<string>(
    'Abhyanga with warm sesame oil; warm ginger-cardamom water'
  );
  const [herbalDusk, setHerbalDusk] = useState<string>(
    'Warm golden milk with nutmeg and pinch of ashwagandha'
  );
  const [pranayamaName, setPranayamaName] = useState<string>(
    'Nadi Shodhana & Sheetali Pranayama'
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleIssuePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onCreatePrescription({
        patientName,
        doctorName: 'Dr. Syed Karishma',
        primaryEnergyState: energyState,
        personalDoctorNote: doctorNote,
        targetedYogaSequence: {
          sequenceTitle,
          totalDuration: duration,
          intention: 'Restoring nervous system equilibrium and softening tissue resistance.',
          asanas: [
            {
              name: 'Supported Reclining Butterfly',
              sanskrit: 'Supta Baddha Konasana',
              duration: '6 mins',
              breathFocus: 'Deep diaphragmatic expansion; releasing sacrum',
              therapeuticCue: 'Support knees with soft bolsters; relax face muscles.'
            },
            {
              name: 'Gentle Cat-Cow Prana Ripple',
              sanskrit: 'Marjaryasana-Bitilasana',
              duration: '5 mins',
              breathFocus: 'Inhale arching from tailbone; exhale rounding from pelvis',
              therapeuticCue: 'Keep neck soft; articulate each lumbar vertebra with care.'
            },
            {
              name: 'Restorative Legs-Up-The-Wall',
              sanskrit: 'Viparita Karani',
              duration: '6 mins',
              breathFocus: 'Passive effortless surrender',
              therapeuticCue: 'Place a folded blanket under hips for lymphatic drainage.'
            }
          ]
        },
        herbalRituals: [
          {
            timeOfDay: 'Morning Dawn',
            ritualName: 'Warming Body Anointment',
            herbalFormula: herbalMorning,
            instructions: 'Apply gently before warm shower. Leave on skin for 10 minutes.'
          },
          {
            timeOfDay: 'Twilight Dusk',
            ritualName: 'Nourishing Moon Tonic',
            herbalFormula: herbalDusk,
            instructions: 'Sip warm 30 minutes before sleep away from devices.'
          }
        ],
        pranayamaPrescription: {
          breathName: pranayamaName,
          ratio: '4-4 equal ratio',
          dailyDuration: '8 minutes daily',
          guidance: 'Never strain the breath; keep the lips slightly softened.'
        },
        followUpWindow: '2 weeks'
      });

      soundSanctuary.playSingingBowl(216);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setViewMode('patient');
      }, 1500);
    } catch {
      // handled
    } finally {
      setIsSubmitting(false);
    }
  };

  const rx = selectedRx || prescriptions[0];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8 animate-fadeIn">
      {/* Back Button Bar */}
      {onBackToHome && (
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs font-medium text-[#5E5852] hover:text-[#26221E] bg-[#FFFFFF] border border-[#E8E1D5] px-4 py-2 rounded-full transition-all cursor-pointer shadow-2xs hover:shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#9E6E38]" />
            <span>Return to Sanctuary Home</span>
          </button>
          <span className="text-xs text-[#7A7268] hidden sm:inline">
            Prescriptions & Clinical Care Plans
          </span>
        </div>
      )}

      {/* View Mode Segmented Control Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E8E1D5] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#7A7268]">
            <span>Holistic Clinic Records</span>
            <span>·</span>
            <span>Dr. Syed Karishma</span>
          </div>
          <h1 className="font-serif text-3xl text-[#26221E] font-normal mt-1">
            Doctor’s Healing Prescription
          </h1>
        </div>

        {/* View Switcher: Patient View vs. Doctor Portal */}
        <div className="flex items-center p-1 bg-[#EFE9DD] rounded-xl border border-[#DFD7C7]">
          <button
            onClick={() => {
              setViewMode('patient');
              soundSanctuary.playZenTingsha();
            }}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              viewMode === 'patient'
                ? 'bg-[#FFFFFF] text-[#26221E] shadow-sm'
                : 'text-[#5E5852] hover:text-[#26221E]'
            }`}
          >
            Patient Prescription Scroll
          </button>
          <button
            onClick={() => {
              setViewMode('doctor');
              soundSanctuary.playZenTingsha();
            }}
            className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              viewMode === 'doctor'
                ? 'bg-[#26221E] text-[#F9F6F0] shadow-sm'
                : 'text-[#5E5852] hover:text-[#26221E]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#E0AFA0]" />
            <span>Dr. Karishma Clinic Portal</span>
          </button>
        </div>
      </div>

      {/* PATIENT VIEW: Divine Parchment Presentation */}
      {viewMode === 'patient' && rx && (
        <div className="space-y-10">
          {/* Scroll Selector if multiple prescriptions exist */}
          {prescriptions.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
              <span className="text-[#7A7268] whitespace-nowrap">Prescriptions:</span>
              {prescriptions.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedRx(p);
                    soundSanctuary.playSingingBowl(324);
                  }}
                  className={`px-3 py-1.5 rounded-lg border whitespace-nowrap cursor-pointer ${
                    p.id === rx.id
                      ? 'bg-[#26221E] text-[#F9F6F0] border-[#26221E]'
                      : 'bg-[#F4EFE6] text-[#5E5852] border-[#E8E1D5]'
                  }`}
                >
                  Issued {p.issuedDate} ({p.targetedYogaSequence.sequenceTitle.slice(0, 24)}...)
                </button>
              ))}
            </div>
          )}

          {/* Main Parchment Container */}
          <div className="relative p-8 sm:p-14 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] shadow-sm space-y-10">
            {/* Parchment Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EFE8DC] pb-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#9E6E38] font-medium">
                  Holistic Sadhana & Healing Protocol
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#26221E] font-medium mt-1">
                  {rx.targetedYogaSequence.sequenceTitle}
                </h2>
                <div className="flex items-center gap-2 text-xs text-[#7A7268] mt-2">
                  <span>Prescribed for: <strong>{rx.patientName}</strong></span>
                  <span>·</span>
                  <span>Issued: {rx.issuedDate}</span>
                  <span>·</span>
                  <span>By: {rx.doctorName}</span>
                </div>
              </div>

              <button
                onClick={() => soundSanctuary.playSingingBowl(216)}
                title="Ring Singing Bowl for Sadhana"
                className="w-12 h-12 rounded-full bg-[#F4EFE6] hover:bg-[#EBE3D4] flex items-center justify-center text-[#73532C] transition-colors cursor-pointer shrink-0"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Primary Energy State Diagnosis */}
            <div className="p-5 rounded-2xl bg-[#F9F6F0] border border-[#E8E1D5] space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9E6E38]">
                Energetic Constitution Assessment
              </span>
              <p className="text-sm font-medium text-[#26221E]">
                {rx.primaryEnergyState}
              </p>
            </div>

            {/* Personal Doctor Note */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5E5852]">
                Personal Doctor’s Note from Dr. Karishma
              </span>
              <div className="p-6 rounded-2xl bg-[#FDFBF7] border border-[#EFE8DC] relative">
                <blockquote className="font-serif text-base sm:text-lg text-[#3D3732] leading-relaxed italic">
                  “{rx.personalDoctorNote}”
                </blockquote>
                <div className="pt-4 mt-4 border-t border-[#EFE8DC] text-right font-serif text-xs text-[#73532C]">
                  — Dr. Syed Karishma, BAMS, MD (Yoga & Holistic Medicine)
                </div>
              </div>
            </div>

            {/* Targeted Yoga Sequence */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#5E5852]">
                    Targeted Therapeutic Asanas
                  </span>
                  <p className="text-xs text-[#7A7268]">
                    Duration: {rx.targetedYogaSequence.totalDuration} · Intention: {rx.targetedYogaSequence.intention}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {rx.targetedYogaSequence.asanas.map((asana, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#F9F6F0] border border-[#E8E1D5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#9E6E38]">0{idx + 1}.</span>
                        <h4 className="font-serif text-base text-[#26221E] font-medium">
                          {asana.name}
                        </h4>
                        <span className="text-xs text-[#7A7268] italic">
                          ({asana.sanskrit})
                        </span>
                      </div>
                      <p className="text-xs text-[#5E5852] pl-6">
                        <strong>Alignment:</strong> {asana.therapeuticCue}
                      </p>
                      <p className="text-xs text-[#6C7A4D] pl-6">
                        <strong>Breath:</strong> {asana.breathFocus}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:text-right shrink-0 pl-6 sm:pl-0">
                      <span className="text-xs font-medium text-[#26221E] bg-[#EFE9DD] px-3 py-1 rounded-full whitespace-nowrap">
                        {asana.duration}
                      </span>
                      {onOpenPoseTab && (
                        <button
                          onClick={() => {
                            onOpenPoseTab(asana.sanskrit || asana.name);
                            soundSanctuary.playZenTingsha();
                          }}
                          className="px-2.5 py-1 rounded-xl bg-[#FFFFFF] hover:bg-[#FAF7F2] border border-[#D5C9B6] text-[11px] font-semibold text-[#73532C] flex items-center gap-1 transition-colors cursor-pointer shadow-2xs hover:border-[#B88554]"
                          title="Open this pose in a dedicated 3D tab"
                        >
                          <Box className="w-3 h-3 text-[#B88554]" />
                          <span>3D Tab</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Herbal & Lifestyle Rituals */}
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#5E5852]">
                Prescribed Herbal & Lifestyle Rituals
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rx.herbalRituals.map((ritual, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-[#F9F6F0] border border-[#E8E1D5] space-y-3"
                  >
                    <div className="flex items-center gap-2 text-xs text-[#9E6E38] font-medium">
                      {ritual.timeOfDay.toLowerCase().includes('morning') ? (
                        <Sun className="w-4 h-4" />
                      ) : (
                        <Moon className="w-4 h-4" />
                      )}
                      <span>{ritual.timeOfDay}</span>
                    </div>
                    <h4 className="font-serif text-base text-[#26221E] font-medium">
                      {ritual.ritualName}
                    </h4>
                    <p className="text-xs text-[#26221E] font-medium">
                      {ritual.herbalFormula}
                    </p>
                    <p className="text-xs text-[#5E5852] leading-relaxed">
                      {ritual.instructions}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pranayama Prescription & Follow-up */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#EFE8DC]">
              <div className="p-5 rounded-2xl bg-[#F4EFE6] space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#6C7A4D]">
                  Breath Prescription
                </span>
                <h4 className="font-serif text-base text-[#26221E] font-medium">
                  {rx.pranayamaPrescription.breathName}
                </h4>
                <p className="text-xs text-[#5E5852]">
                  <strong>Ratio:</strong> {rx.pranayamaPrescription.ratio} · <strong>Duration:</strong> {rx.pranayamaPrescription.dailyDuration}
                </p>
                <p className="text-xs text-[#5E5852]">
                  {rx.pranayamaPrescription.guidance}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F4EFE6] space-y-2 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#9E6E38]">
                    Follow-Up Window
                  </span>
                  <h4 className="font-serif text-base text-[#26221E] font-medium">
                    {rx.followUpWindow}
                  </h4>
                  <p className="text-xs text-[#5E5852] mt-1">
                    Book your alignment check-in after completing 14 days of this sadhana to adjust posture loads.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOCTOR CLINIC PORTAL: Dr. Syed Karishma Management & Prescription Composer */}
      {viewMode === 'doctor' && (
        <div className="space-y-10">
          {/* Recent Patient Intakes from Appointments */}
          <div className="p-6 rounded-3xl bg-[#F4EFE6] border border-[#E8E1D5] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9E6E38]">
                Recent Patient Pre-Consultation Intakes
              </span>
              <span className="text-xs text-[#7A7268]">
                {appointments.length} Consultations Recorded
              </span>
            </div>

            <div className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-sm text-[#26221E]">{apt.patientName}</strong>
                      <span className="text-xs text-[#7A7268] ml-2">({apt.patientEmail})</span>
                    </div>
                    <span className="text-xs font-mono text-[#9E6E38] bg-[#F4EFE6] px-2 py-0.5 rounded">
                      Energy: {apt.intake.energyBaseline}/10
                    </span>
                  </div>

                  <p className="text-xs text-[#5E5852]">
                    <strong>Emotional Landscape:</strong> {apt.intake.emotionalLandscape}
                  </p>
                  <p className="text-xs text-[#5E5852]">
                    <strong>Physical Tightness Areas:</strong> {apt.intake.physicalTightness.join(', ')}
                  </p>
                  <p className="text-xs text-[#5E5852]">
                    <strong>Seeking to Unburden:</strong> {apt.intake.burdenOrSeeking}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Form to Issue New Prescription */}
          <form
            onSubmit={handleIssuePrescription}
            className="p-8 sm:p-10 rounded-3xl bg-[#FFFFFF] border border-[#E8E1D5] space-y-6"
          >
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9E6E38]">
                Clinic Composer · Dr. Syed Karishma
              </span>
              <h3 className="font-serif text-2xl text-[#26221E] font-medium">
                Assign Custom Healing Prescription
              </h3>
              <p className="text-xs text-[#7A7268]">
                Issue personalized lifestyle notes, herbal rituals, and targeted yoga sequences.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#5E5852] block mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7] text-sm text-[#26221E] focus:outline-none focus:border-[#B88554]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#5E5852] block mb-1">
                  Doshic Imbalance / Primary Energy State
                </label>
                <input
                  type="text"
                  required
                  value={energyState}
                  onChange={(e) => setEnergyState(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7] text-sm text-[#26221E] focus:outline-none focus:border-[#B88554]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#5E5852] block mb-1">
                Personal Doctor’s Healing Note
              </label>
              <textarea
                rows={3}
                required
                value={doctorNote}
                onChange={(e) => setDoctorNote(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7] text-sm text-[#26221E] focus:outline-none focus:border-[#B88554]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#5E5852] block mb-1">
                  Targeted Sequence Title
                </label>
                <input
                  type="text"
                  required
                  value={sequenceTitle}
                  onChange={(e) => setSequenceTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7] text-sm text-[#26221E] focus:outline-none focus:border-[#B88554]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#5E5852] block mb-1">
                  Practice Duration
                </label>
                <input
                  type="text"
                  required
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7] text-sm text-[#26221E] focus:outline-none focus:border-[#B88554]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-[#5E5852] block mb-1">
                  Morning Herbal Ritual & Formula
                </label>
                <input
                  type="text"
                  required
                  value={herbalMorning}
                  onChange={(e) => setHerbalMorning(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7] text-sm text-[#26221E] focus:outline-none focus:border-[#B88554]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#5E5852] block mb-1">
                  Dusk / Evening Moon Ritual
                </label>
                <input
                  type="text"
                  required
                  value={herbalDusk}
                  onChange={(e) => setHerbalDusk(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7] text-sm text-[#26221E] focus:outline-none focus:border-[#B88554]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#5E5852] block mb-1">
                Prescribed Pranayama Breath Protocol
              </label>
              <input
                type="text"
                required
                value={pranayamaName}
                onChange={(e) => setPranayamaName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8E1D5] bg-[#FDFBF7] text-sm text-[#26221E] focus:outline-none focus:border-[#B88554]"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              {isSuccess && (
                <span className="text-xs text-[#6C7A4D] font-medium flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  Prescription Issued with Reverence
                </span>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-full text-xs font-medium tracking-wide bg-[#12161A] text-[#F9F6F0] hover:bg-[#252C33] disabled:opacity-50 transition-all cursor-pointer whitespace-nowrap shadow-sm"
              >
                <span>{isSubmitting ? 'Issuing...' : 'Issue Prescription'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
