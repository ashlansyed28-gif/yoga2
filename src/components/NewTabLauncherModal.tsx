/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Search,
  Box,
  ShieldCheck,
  Moon,
  Sparkles,
  Music,
  Calendar,
  AlertCircle,
  Flame,
  Activity,
  Compass,
  Heart,
  Camera,
  Gamepad2,
  Users
} from 'lucide-react';
import { WorkspaceTab } from '../types/workspaceTabs.ts';
import { soundSanctuary } from '../utils/soundSanctuary.ts';
import { PROTOCOLS } from './ProtocolsView.tsx';
import { POSE_DICTIONARY } from '../utils/poseDictionary.ts';

interface NewTabLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTab: (tab: WorkspaceTab) => void;
}

export const NewTabLauncherModal: React.FC<NewTabLauncherModalProps> = ({
  isOpen,
  onClose,
  onOpenTab
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | 'poses' | 'protocols' | 'restorative' | 'ayurveda'
  >('all');

  if (!isOpen) return null;

  const handleLaunch = (tab: WorkspaceTab) => {
    soundSanctuary.playZenTingsha();
    onOpenTab(tab);
    onClose();
  };

  const q = searchQuery.toLowerCase().trim();

  // Curated Poses from POSE_DICTIONARY
  const allPoses = Object.values(POSE_DICTIONARY);
  const posesList = allPoses.filter(
    (p) =>
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.sanskritName.toLowerCase().includes(q) ||
      (p.theme && p.theme.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q))
  );

  // Protocols
  const protocolsList = PROTOCOLS.filter(
    (pr) =>
      !q ||
      pr.title.toLowerCase().includes(q) ||
      pr.sanskrit.toLowerCase().includes(q) ||
      pr.category.toLowerCase().includes(q)
  );

  // Sanctuary Modules
  const sanctuaryModules = [
    {
      id: 'tab-sleep',
      type: 'sleep' as const,
      title: 'Sleep Sanctuary',
      subtitle: 'Restorative Postures & Yoga Nidra',
      category: 'restorative',
      icon: <Moon className="w-4 h-4 text-[#3A6073]" />
    },
    {
      id: 'tab-faceyoga',
      type: 'faceyoga' as const,
      title: 'Divine Face Yoga',
      subtitle: 'TMJ Release & Marma Acupressure',
      category: 'restorative',
      icon: <Sparkles className="w-4 h-4 text-[#E0AFA0]" />
    },
    {
      id: 'tab-chanting',
      type: 'chanting' as const,
      title: '136.1 Hz OM Meditation',
      subtitle: 'Earth Tone Vibrational Soundscape',
      category: 'restorative',
      icon: <Music className="w-4 h-4 text-[#B88554]" />
    },
    {
      id: 'tab-emergency',
      type: 'emergency' as const,
      title: 'Emergency Calm',
      subtitle: 'Vagus Nerve 60s Reset',
      category: 'restorative',
      icon: <AlertCircle className="w-4 h-4 text-[#CE4257]" />
    },
    {
      id: 'tab-dosha',
      type: 'dosha' as const,
      title: 'Ayurvedic Dosha Diagnostic',
      subtitle: 'Vata, Pitta & Kapha Mind-Body Profile',
      category: 'ayurveda',
      icon: <Flame className="w-4 h-4 text-[#E07A5F]" />
    },
    {
      id: 'tab-matcher',
      type: 'matcher' as const,
      title: 'Somatic Symptom Matcher',
      subtitle: 'Map Ailments to Chakra Energy Centers',
      category: 'ayurveda',
      icon: <Compass className="w-4 h-4 text-[#6C7A4D]" />
    },
    {
      id: 'tab-consult',
      type: 'consult' as const,
      title: 'Doctor Consultation Booking',
      subtitle: 'Private Clinic with Dr. Syed Karishma',
      category: 'ayurveda',
      icon: <Calendar className="w-4 h-4 text-[#9E6E38]" />
    },
    {
      id: 'tab-prescriptions',
      type: 'prescriptions' as const,
      title: 'Healing Prescriptions',
      subtitle: 'Clinical Asana & Herbal Protocols',
      category: 'ayurveda',
      icon: <Heart className="w-4 h-4 text-[#B88554]" />
    },
    {
      id: 'tab-aipose',
      type: 'aipose' as const,
      title: 'AI Pose Coach',
      subtitle: 'Webcam Alignment & Joint Kinematics',
      category: 'poses',
      icon: <Camera className="w-4 h-4 text-[#73532C]" />
    },
    {
      id: 'tab-game',
      type: 'game' as const,
      title: 'Yoga Arcade Game',
      subtitle: 'Interactive Balance & Flow Training',
      category: 'poses',
      icon: <Gamepad2 className="w-4 h-4 text-[#73532C]" />
    },
    {
      id: 'tab-community',
      type: 'community' as const,
      title: 'Community Sangha',
      subtitle: 'Peer Circles & Mentorship',
      category: 'restorative',
      icon: <Users className="w-4 h-4 text-[#6C7A4D]" />
    }
  ].filter(
    (m) =>
      (!q ||
        m.title.toLowerCase().includes(q) ||
        m.subtitle.toLowerCase().includes(q)) &&
      (selectedCategory === 'all' || m.category === selectedCategory)
  );

  return (
    <div className="fixed inset-0 z-50 bg-[#12161A]/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-[#FAF7F2] text-[#26221E] w-full max-w-3xl max-h-[85vh] rounded-3xl border border-[#D5C9B6] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E8E1D5] bg-[#FFFFFF] flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B88554]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9E6E38]">
                Sanctuary Workspace
              </span>
            </div>
            <h3 className="font-serif text-2xl font-medium text-[#26221E] mt-0.5">
              Open Module in Dedicated Tab
            </h3>
            <p className="text-xs text-[#5E5852]">
              Choose any pose, protocol, soundscape, or clinical diagnostic to isolate into its own tab:
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F4EFE6] text-[#7A7268] hover:text-[#26221E] transition-colors cursor-pointer"
            title="Close launcher"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 bg-[#F4EFE6] border-b border-[#E8E1D5] space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#9E6E38] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search poses, protocols, ailments, or modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#FFFFFF] border border-[#E0D5C1] rounded-2xl text-xs text-[#26221E] placeholder-[#9E968B] focus:outline-none focus:ring-1 focus:ring-[#B88554]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#7A7268] hover:text-[#26221E]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {(
              [
                { id: 'all', label: 'All Modules' },
                { id: 'poses', label: '3D Poses' },
                { id: 'protocols', label: 'Clinical Protocols' },
                { id: 'restorative', label: 'Restorative & Sound' },
                { id: 'ayurveda', label: 'Ayurveda & Consult' }
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-xl font-medium transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#12161A] text-[#F9F6F0] shadow-2xs'
                    : 'bg-[#FFFFFF] text-[#5E5852] hover:text-[#26221E] border border-[#E0D5C1]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Section: Sanctuaries & Tools */}
          {sanctuaryModules.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7A7268]">
                Sanctuaries & Clinical Tools
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {sanctuaryModules.map((m) => (
                  <button
                    key={m.id}
                    onClick={() =>
                      handleLaunch({
                        id: m.id,
                        type: m.type,
                        title: m.title,
                        subtitle: m.subtitle,
                        canClose: true
                      })
                    }
                    className="p-3.5 rounded-2xl bg-[#FFFFFF] hover:bg-[#FDFBF7] border border-[#E0D5C1] hover:border-[#B88554] text-left transition-all cursor-pointer shadow-2xs hover:shadow-xs group flex items-start gap-3"
                  >
                    <div className="p-2 rounded-xl bg-[#FAF7F2] border border-[#E8E1D5] group-hover:scale-110 transition-transform">
                      {m.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif text-sm font-medium text-[#26221E] group-hover:text-[#B88554] truncate">
                        {m.title}
                      </h4>
                      <p className="text-[11px] text-[#7A7268] line-clamp-1 mt-0.5">
                        {m.subtitle}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Section: 3D Asana Pose Studios */}
          {(selectedCategory === 'all' || selectedCategory === 'poses') &&
            posesList.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7A7268] flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-[#B88554]" />
                  <span>3D Human Studio Poses ({posesList.length})</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {posesList.map((p) => (
                    <button
                      key={p.id}
                      onClick={() =>
                        handleLaunch({
                          id: 'pose-' + p.id,
                          type: 'pose',
                          title: p.name,
                          subtitle: p.sanskritName,
                          data: p,
                          canClose: true
                        })
                      }
                      className="p-3.5 rounded-2xl bg-[#FFFFFF] hover:bg-[#FDFBF7] border border-[#E0D5C1] hover:border-[#B88554] text-left transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                    >
                      <div className="flex items-center justify-between text-[11px] text-[#9E6E38]">
                        <span className="font-serif italic truncate">{p.sanskritName}</span>
                        <span className="font-mono text-[10px] bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#E8E1D5]">
                          3D Studio
                        </span>
                      </div>
                      <h4 className="font-serif text-sm font-medium text-[#26221E] group-hover:text-[#B88554] mt-1 truncate">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-[#7A7268] line-clamp-1 mt-0.5">
                        {p.theme || p.category || p.clinicalCue}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

          {/* Section: Clinical Protocols */}
          {(selectedCategory === 'all' || selectedCategory === 'protocols') &&
            protocolsList.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#7A7268] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#6C7A4D]" />
                  <span>Dr. Karishma’s Clinical Protocols ({protocolsList.length})</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {protocolsList.map((pr) => (
                    <button
                      key={pr.id}
                      onClick={() =>
                        handleLaunch({
                          id: 'protocol-' + pr.id,
                          type: 'protocol',
                          title: pr.title,
                          subtitle: pr.category,
                          data: pr,
                          canClose: true
                        })
                      }
                      className="p-4 rounded-2xl bg-[#FFFFFF] hover:bg-[#FDFBF7] border border-[#E0D5C1] hover:border-[#6C7A4D] text-left transition-all cursor-pointer shadow-2xs hover:shadow-xs group"
                    >
                      <div className="flex items-center justify-between text-xs text-[#6C7A4D] font-medium">
                        <span>{pr.targetedAsanas.length} Asanas</span>
                        <span className="font-serif italic text-[11px]">{pr.sanskrit}</span>
                      </div>
                      <h4 className="font-serif text-base font-medium text-[#26221E] group-hover:text-[#6C7A4D] mt-1">
                        {pr.title}
                      </h4>
                      <p className="text-xs text-[#5E5852] mt-1 line-clamp-2 leading-relaxed">
                        {pr.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
