/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopBar, NavTabId } from './components/TopBar.tsx';
import { DailySanctuary } from './components/DailySanctuary.tsx';
import { SanctuaryModeModal } from './components/SanctuaryModeModal.tsx';
import { SymptomMatcher } from './components/SymptomMatcher.tsx';
import { SacredBooking } from './components/SacredBooking.tsx';
import { HealingPrescriptionView } from './components/HealingPrescriptionView.tsx';
import { MentorshipSangha } from './components/MentorshipSangha.tsx';
import { YogaFlows } from './components/YogaFlows.tsx';
import { ProtocolsView, PROTOCOLS } from './components/ProtocolsView.tsx';
import { AIPoseGuide } from './components/AIPoseGuide.tsx';
import { EmergencyCalm } from './components/EmergencyCalm.tsx';
import { MeditationSanctuary } from './components/MeditationSanctuary.tsx';
import { SleepSanctuary } from './components/SleepSanctuary.tsx';
import { FaceYogaView } from './components/FaceYogaView.tsx';
import { ProgressView } from './components/ProgressView.tsx';
import { CommunitySangha } from './components/CommunitySangha.tsx';
import { SanctuaryAIGuide } from './components/SanctuaryAIGuide.tsx';
import { YogaGame } from './components/YogaGame.tsx';
import { WorkspaceTabBar } from './components/WorkspaceTabBar.tsx';
import { WorkspaceTab } from './types/workspaceTabs.ts';
import { PoseDetailView } from './components/PoseDetailView.tsx';
import { ProtocolDetailView } from './components/ProtocolDetailView.tsx';
import { lookupPose } from './utils/poseDictionary.ts';
import { Sparkles, ArrowLeft, ExternalLink, Plus } from 'lucide-react';
import {
  DoctorScheduleSlot,
  Appointment,
  HealingPrescription,
  WeeklyReflection,
  MessageItem,
  UserProfile,
  SymptomZone
} from './types.ts';
import { soundSanctuary } from './utils/soundSanctuary.ts';
import { GoogleLoginModal, AuthUser } from './components/GoogleLoginModal.tsx';
import { streakSystem, SanctuaryStreakState } from './utils/streakSystem.ts';
import { ShareProgressModal } from './components/ShareProgressModal.tsx';
import { NewTabLauncherModal } from './components/NewTabLauncherModal.tsx';
import { DoshaAssessmentView } from './components/DoshaAssessmentView.tsx';
import { SoundAmbienceHearth } from './components/SoundAmbienceHearth.tsx';

export default function App() {
  const [workspaceTabs, setWorkspaceTabs] = useState<WorkspaceTab[]>([
    {
      id: 'sanctuary-home',
      type: 'home',
      title: 'Daily Sanctuary',
      subtitle: 'Dr. Syed Karishma Clinic',
      canClose: false
    }
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('sanctuary-home');
  const [isStandalone, setIsStandalone] = useState<boolean>(false);

  const [isSanctuaryModeOpen, setIsSanctuaryModeOpen] = useState<boolean>(false);
  const [isAIGuideOpen, setIsAIGuideOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isNewTabModalOpen, setIsNewTabModalOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundSanctuary.getMutedState());
  const [streakState, setStreakState] = useState<SanctuaryStreakState>(streakSystem.getState());

  // Authenticated Google User Session state
  const [authSessionUser, setAuthSessionUser] = useState<AuthUser | null>(null);

  // Backend state
  const [slots, setSlots] = useState<DoctorScheduleSlot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<HealingPrescription[]>([]);
  const [reflections, setReflections] = useState<WeeklyReflection[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'usr-1',
    name: 'Ashlan Syed',
    email: 'ashlansyed28@gmail.com',
    currentDoshaFocus: 'Vata-Pitta Balance',
    dailyIntention: 'Grounding into quiet presence and honoring my physical limits with gentleness.',
    currentStreakDays: 5,
    joinedDate: 'October 2026'
  });

  const [prefilledZone, setPrefilledZone] = useState<SymptomZone | null>(null);

  // Open any item in another tab so that tab has only the clicked details
  const openTab = (newTab: Omit<WorkspaceTab, 'canClose'> & { canClose?: boolean }) => {
    setWorkspaceTabs((prev) => {
      const existing = prev.find((t) => t.id === newTab.id);
      if (existing) {
        return prev;
      }
      return [
        ...prev,
        {
          ...newTab,
          canClose: newTab.canClose !== undefined ? newTab.canClose : true
        }
      ];
    });
    setActiveTabId(newTab.id);
    soundSanctuary.playZenTingsha();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close tab and fallback to nearest open tab
  const closeTab = (tabId: string) => {
    setWorkspaceTabs((prev) => {
      const remaining = prev.filter((t) => t.id !== tabId);
      if (activeTabId === tabId) {
        const closedIdx = prev.findIndex((t) => t.id === tabId);
        const fallback = remaining[Math.max(0, closedIdx - 1)] || remaining[0];
        if (fallback) {
          setActiveTabId(fallback.id);
        }
      }
      return remaining;
    });
  };

  // Handle URL deep-linking and standalone mode parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const idParam = params.get('id');
    const standaloneParam = params.get('standalone') === 'true';

    if (standaloneParam) {
      setIsStandalone(true);
    }

    if (tabParam === 'pose' && idParam) {
      const pose = lookupPose(idParam);
      openTab({
        id: 'pose-' + pose.id,
        type: 'pose',
        title: pose.name,
        subtitle: pose.sanskritName,
        data: pose,
        canClose: !standaloneParam
      });
    } else if (tabParam === 'protocol' && idParam) {
      const proto = PROTOCOLS.find((p) => p.id === idParam) || PROTOCOLS[0];
      openTab({
        id: 'protocol-' + proto.id,
        type: 'protocol',
        title: proto.title,
        subtitle: proto.sanskrit,
        data: proto,
        canClose: !standaloneParam
      });
    }
  }, []);

  // Initial data loading from server endpoints
  useEffect(() => {
    async function loadSanctuaryData() {
      try {
        const [schedRes, aptsRes, rxRes, refRes, msgRes, profRes] = await Promise.all([
          fetch('/api/schedule'),
          fetch('/api/appointments'),
          fetch('/api/prescriptions'),
          fetch('/api/reflections'),
          fetch('/api/messages'),
          fetch('/api/profile')
        ]);

        if (schedRes.ok) {
          const sData = await schedRes.json();
          setSlots(sData.slots || []);
        }
        if (aptsRes.ok) {
          const aData = await aptsRes.json();
          setAppointments(aData || []);
        }
        if (rxRes.ok) {
          const rData = await rxRes.json();
          setPrescriptions(rData || []);
        }
        if (refRes.ok) {
          const rfData = await refRes.json();
          setReflections(rfData || []);
        }
        if (msgRes.ok) {
          const mData = await msgRes.json();
          setMessages(mData || []);
        }
        if (profRes.ok) {
          const pData = await profRes.json();
          setUserProfile(pData || userProfile);
        }
      } catch (err) {
        console.warn('Backend fetch fallback to default state:', err);
      }
    }

    async function restoreGoogleSession() {
      const savedToken = localStorage.getItem('sanctuary_auth_token');
      if (savedToken) {
        try {
          const authRes = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          });
          if (authRes.ok) {
            const authData = await authRes.json();
            if (authData.user) {
              setAuthSessionUser(authData.user);
              setUserProfile((prev) => ({
                ...prev,
                name: authData.user.name,
                email: authData.user.email,
              }));
            }
          } else {
            localStorage.removeItem('sanctuary_auth_token');
          }
        } catch {
          // quiet fallback
        }
      }
    }

    loadSanctuaryData();
    restoreGoogleSession();

    const handleStreakChange = () => {
      setStreakState(streakSystem.getState());
    };
    window.addEventListener('sanctuary-streak-update', handleStreakChange);
    return () => window.removeEventListener('sanctuary-streak-update', handleStreakChange);
  }, []);

  const handleToggleSound = () => {
    const muted = soundSanctuary.toggleMute();
    setIsMuted(muted);
  };

  const handleUpdateIntention = async (dailyIntention: string) => {
    setUserProfile((prev) => ({ ...prev, dailyIntention }));
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dailyIntention })
      });
    } catch {
      // handled
    }
  };

  const handleBookAppointment = async (appointmentData: {
    slotId: string;
    patientName: string;
    patientEmail: string;
    intake: any;
    sessionType: string;
  }) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      });
      if (res.ok) {
        const result = await res.json();
        setAppointments((prev) => [result.appointment, ...prev]);
        setSlots((prev) =>
          prev.map((s) => (s.id === appointmentData.slotId ? { ...s, isAvailable: false } : s))
        );
        return result.appointment;
      }
    } catch {
      // handled
    }
  };

  // Map TopBar tab click to opening/switching to that tab in WorkspaceTabBar
  const handleNavSelect = (navTab: NavTabId) => {
    if (navTab === 'sanctuary') {
      setActiveTabId('sanctuary-home');
    } else if (navTab === 'yoga') {
      openTab({ id: 'tab-yoga', type: 'sequence', title: 'Yoga Sequences', canClose: true });
    } else if (navTab === 'protocols') {
      openTab({ id: 'tab-protocols', type: 'protocols-list', title: 'Clinical Protocols', canClose: true });
    } else if (navTab === 'meditation') {
      openTab({ id: 'tab-chanting', type: 'chanting', title: '136.1Hz OM Meditation', canClose: true });
    } else if (navTab === 'consult') {
      openTab({ id: 'tab-consult', type: 'consult', title: 'Doctor Consultation', canClose: true });
    } else if (navTab === 'emergency') {
      openTab({ id: 'tab-emergency', type: 'emergency', title: 'Emergency Calm', canClose: true });
    } else if (navTab === 'sleep') {
      openTab({ id: 'tab-sleep', type: 'sleep', title: 'Sleep Sanctuary', canClose: true });
    } else if (navTab === 'faceyoga') {
      openTab({ id: 'tab-faceyoga', type: 'faceyoga', title: 'Face Yoga & TMJ', canClose: true });
    } else if (navTab === 'progress') {
      openTab({ id: 'tab-progress', type: 'progress', title: 'Sadhana Streaks', canClose: true });
    } else if (navTab === 'community') {
      openTab({ id: 'tab-community', type: 'community', title: 'Sangha Community', canClose: true });
    } else if (navTab === 'game') {
      openTab({ id: 'tab-game', type: 'game', title: 'Yoga Arcade Game', canClose: true });
    } else if (navTab === 'aipose') {
      openTab({ id: 'tab-aipose', type: 'aipose', title: 'AI Pose Coach', canClose: true });
    } else if (navTab === 'dosha') {
      openTab({ id: 'tab-dosha', type: 'dosha', title: 'Ayurvedic Dosha Diagnostic', canClose: true });
    }
  };

  // Derive current active workspace tab
  const activeWorkspaceTab =
    workspaceTabs.find((t) => t.id === activeTabId) || workspaceTabs[0];

  // Map active tab type to TopBar highlighted tab
  const currentNavTab: NavTabId = (() => {
    switch (activeWorkspaceTab.type) {
      case 'home':
        return 'sanctuary';
      case 'sequence':
      case 'flow':
      case 'pose':
      case 'intention':
        return 'yoga';
      case 'protocol':
      case 'protocols-list':
      case 'matcher':
        return 'protocols';
      case 'chanting':
        return 'meditation';
      case 'consult':
      case 'prescriptions':
        return 'consult';
      case 'emergency':
        return 'emergency';
      case 'sleep':
        return 'sleep';
      case 'faceyoga':
        return 'faceyoga';
      case 'progress':
        return 'progress';
      case 'community':
        return 'community';
      case 'game':
        return 'game';
      case 'aipose':
        return 'aipose';
      case 'dosha':
        return 'dosha';
      default:
        return 'sanctuary';
    }
  })();

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#26221E] flex flex-col font-sans selection:bg-[#E0AFA0]/40">
      {/* Top Bar with all 10 sanctuary tabs, streak counter, sound, and Google session */}
      {!isStandalone && (
        <TopBar
          currentTab={currentNavTab}
          onSelectTab={handleNavSelect}
          onOpenSanctuaryMode={() => setIsSanctuaryModeOpen(true)}
          isMuted={isMuted}
          onToggleSound={handleToggleSound}
          onOpenAIGuide={() => {
            soundSanctuary.playSingingBowl(324);
            setIsAIGuideOpen(true);
          }}
          currentUser={authSessionUser}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          currentStreak={streakState.currentStreak}
          onOpenShareModal={() => setIsShareModalOpen(true)}
        />
      )}

      {/* Persistent Multi-Tab Workspace Bar: Shows all opened tabs with close buttons */}
      {!isStandalone && (
        <WorkspaceTabBar
          tabs={workspaceTabs}
          activeTabId={activeTabId}
          onSelectTab={(tabId) => {
            setActiveTabId(tabId);
            soundSanctuary.playZenTingsha();
          }}
          onCloseTab={closeTab}
          onOpenNewTabModal={() => {
            soundSanctuary.playZenTingsha();
            setIsNewTabModalOpen(true);
          }}
        />
      )}

      {/* Standalone Window Return Strip */}
      {isStandalone && (
        <div className="bg-[#12161A] text-white px-6 py-2.5 flex items-center justify-between text-xs border-b border-[#2D3944]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E0AFA0]" />
            <span className="font-serif tracking-wide text-[#D4A373]">
              Dr. Syed Karishma &middot; Dedicated Tab View
            </span>
          </div>
          <a
            href="/"
            className="text-xs text-[#CCD5AE] hover:text-white underline cursor-pointer"
          >
            Open Full Sanctuary
          </a>
        </div>
      )}

      {/* Main Content Area: Renders ONLY the clicked details in the active tab */}
      <main className="flex-1">
        {/* 1. HOME: Full Daily Sanctuary Dashboard */}
        {activeWorkspaceTab.type === 'home' && (
          <DailySanctuary
            userProfile={userProfile}
            onUpdateIntention={handleUpdateIntention}
            onOpenSanctuaryMode={() => setIsSanctuaryModeOpen(true)}
            onNavigate={(navDest) => {
              if (navDest === 'game') {
                openTab({ id: 'tab-game', type: 'game', title: 'Yoga Arcade Game', canClose: true });
              } else if (navDest === 'meditation') {
                openTab({ id: 'tab-chanting', type: 'chanting', title: '136.1 Hz OM Chanting', canClose: true });
              } else if (navDest === 'aipose') {
                openTab({ id: 'tab-aipose', type: 'aipose', title: 'AI Pose Coach', canClose: true });
              } else if (navDest === 'matcher') {
                openTab({ id: 'tab-matcher', type: 'matcher', title: 'Symptom Matcher', canClose: true });
              } else if (navDest === 'protocols') {
                openTab({ id: 'tab-protocols', type: 'protocols-list', title: 'Clinical Protocols', canClose: true });
              } else if (navDest === 'prescriptions') {
                openTab({ id: 'tab-prescriptions', type: 'prescriptions', title: 'Healing Prescriptions', canClose: true });
              } else if (navDest === 'booking' || navDest === 'consult') {
                openTab({ id: 'tab-consult', type: 'consult', title: 'Doctor Consultation', canClose: true });
              } else if (navDest === 'emergency') {
                openTab({ id: 'tab-emergency', type: 'emergency', title: 'Emergency Calm', canClose: true });
              } else if (navDest === 'sleep') {
                openTab({ id: 'tab-sleep', type: 'sleep', title: 'Sleep Sanctuary', canClose: true });
              } else if (navDest === 'faceyoga') {
                openTab({ id: 'tab-faceyoga', type: 'faceyoga', title: 'Face Yoga & TMJ', canClose: true });
              } else if (navDest === 'dosha') {
                openTab({ id: 'tab-dosha', type: 'dosha', title: 'Ayurvedic Dosha Diagnostic', canClose: true });
              } else if (navDest === 'progress') {
                openTab({ id: 'tab-progress', type: 'progress', title: 'Sadhana Streaks', canClose: true });
              } else if (navDest === 'community') {
                openTab({ id: 'tab-community', type: 'community', title: 'Sangha Community', canClose: true });
              } else {
                openTab({ id: 'tab-' + navDest, type: 'sequence', title: 'Yoga Sequences', canClose: true });
              }
            }}
            currentUser={authSessionUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenTab={openTab}
          />
        )}

        {/* 2. POSE / INTENTION: Displays ONLY the clicked pose's 3D anatomy, replication steps & timer */}
        {(activeWorkspaceTab.type === 'pose' || activeWorkspaceTab.type === 'intention') && (
          <PoseDetailView
            poseData={activeWorkspaceTab.data || lookupPose(activeWorkspaceTab.title)}
            onClose={() => closeTab(activeWorkspaceTab.id)}
            onOpenShareModal={() => setIsShareModalOpen(true)}
          />
        )}

        {/* 3. PROTOCOL: Displays ONLY the clicked clinical protocol details & prescribed asanas */}
        {activeWorkspaceTab.type === 'protocol' && (
          <ProtocolDetailView
            protocolData={activeWorkspaceTab.data || PROTOCOLS[0]}
            onClose={() => closeTab(activeWorkspaceTab.id)}
            onOpenPoseTab={(asanaName) => {
              const pose = lookupPose(asanaName);
              openTab({
                id: 'pose-' + pose.id,
                type: 'pose',
                title: pose.name,
                subtitle: pose.sanskritName,
                data: pose,
                canClose: true
              });
            }}
          />
        )}

        {/* 3b. PROTOCOLS LIST: Displays all clinical protocols with one-click isolated tab opening */}
        {activeWorkspaceTab.type === 'protocols-list' && (
          <ProtocolsView
            onBackToHome={() => closeTab(activeWorkspaceTab.id)}
            onOpenTab={openTab}
          />
        )}

        {/* 4. SEQUENCE / YOGA: Displays the flows with ability to click any asana to open its 3D tab */}
        {(activeWorkspaceTab.type === 'sequence' || activeWorkspaceTab.type === 'flow') && (
          <YogaFlows
            initialFlowId={activeWorkspaceTab.data?.id}
            onBackToHome={() => closeTab(activeWorkspaceTab.id)}
            onOpenTab={openTab}
          />
        )}

        {/* 5. CHANTING / MEDITATION: Displays 136.1Hz OM Meditation */}
        {activeWorkspaceTab.type === 'chanting' && (
          <MeditationSanctuary onBackToHome={() => closeTab(activeWorkspaceTab.id)} />
        )}

        {/* 6. CONSULTATION: Sacred Clinic Booking */}
        {activeWorkspaceTab.type === 'consult' && (
          <SacredBooking
            slots={slots}
            onBookAppointment={handleBookAppointment}
            prefilledZone={prefilledZone}
            onNavigateToPrescriptions={() => {
              openTab({ id: 'tab-prescriptions', type: 'prescriptions', title: 'Healing Prescriptions', canClose: true });
            }}
            onBackToHome={() => closeTab(activeWorkspaceTab.id)}
          />
        )}

        {/* 6b. SYMPTOM & ENERGY MATCHER: Displays dedicated somatic chakra mapper */}
        {activeWorkspaceTab.type === 'matcher' && (
          <SymptomMatcher
            onSelectForConsultation={(zone) => {
              setPrefilledZone(zone);
              openTab({ id: 'tab-consult', type: 'consult', title: 'Doctor Consultation', canClose: true });
            }}
            onNavigateToBooking={() =>
              openTab({ id: 'tab-consult', type: 'consult', title: 'Doctor Consultation', canClose: true })
            }
            onOpenPoseTab={(asanaName) => {
              const pose = lookupPose(asanaName);
              openTab({
                id: 'pose-' + pose.id,
                type: 'pose',
                title: pose.name,
                subtitle: pose.sanskritName,
                data: pose,
                canClose: true
              });
            }}
            onBackToHome={() => closeTab(activeWorkspaceTab.id)}
          />
        )}

        {/* 6c. HEALING PRESCRIPTIONS: Displays doctor's issued prescriptions */}
        {activeWorkspaceTab.type === 'prescriptions' && (
          <HealingPrescriptionView
            prescriptions={prescriptions}
            appointments={appointments}
            onCreatePrescription={async (rxData) => {
              try {
                const res = await fetch('/api/prescriptions', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(rxData)
                });
                if (res.ok) {
                  const result = await res.json();
                  setPrescriptions((prev) => [result.prescription, ...prev]);
                }
              } catch (e) {
                console.error(e);
              }
            }}
            onBackToHome={() => closeTab(activeWorkspaceTab.id)}
            onOpenPoseTab={(asanaName) => {
              const pose = lookupPose(asanaName);
              openTab({
                id: 'pose-' + pose.id,
                type: 'pose',
                title: pose.name,
                subtitle: pose.sanskritName,
                data: pose,
                canClose: true
              });
            }}
          />
        )}

        {/* 7. EMERGENCY CALM: Vagus nerve and grounding reset */}
        {activeWorkspaceTab.type === 'emergency' && (
          <EmergencyCalm
            onNavigateToYoga={() =>
              openTab({ id: 'tab-yoga', type: 'sequence', title: 'Yoga Sequences', canClose: true })
            }
            onNavigateToConsult={() =>
              openTab({ id: 'tab-consult', type: 'consult', title: 'Doctor Consultation', canClose: true })
            }
            onBackToHome={() => closeTab(activeWorkspaceTab.id)}
          />
        )}

        {/* 8. SLEEP SANCTUARY */}
        {activeWorkspaceTab.type === 'sleep' && (
          <SleepSanctuary
            onBackToHome={() => closeTab(activeWorkspaceTab.id)}
            onOpenTab={openTab}
          />
        )}

        {/* 9. FACE YOGA */}
        {activeWorkspaceTab.type === 'faceyoga' && (
          <FaceYogaView
            initialRoutineId={activeWorkspaceTab.data?.id}
            onBackToHome={() => closeTab(activeWorkspaceTab.id)}
            onOpenTab={openTab}
          />
        )}

        {/* 10. PROGRESS & STREAKS */}
        {activeWorkspaceTab.type === 'progress' && (
          <ProgressView userProfile={userProfile} onBackToHome={() => closeTab(activeWorkspaceTab.id)} />
        )}

        {/* 11. COMMUNITY SANGHA */}
        {activeWorkspaceTab.type === 'community' && (
          <CommunitySangha onBackToHome={() => closeTab(activeWorkspaceTab.id)} />
        )}

        {/* 12. YOGA ARCADE GAME */}
        {activeWorkspaceTab.type === 'game' && (
          <YogaGame onBackToHome={() => closeTab(activeWorkspaceTab.id)} />
        )}

        {/* 13. AI POSE COACH */}
        {activeWorkspaceTab.type === 'aipose' && (
          <AIPoseGuide
            onBackToHome={() => closeTab(activeWorkspaceTab.id)}
            onOpenTab={openTab}
          />
        )}

        {/* 14. AYURVEDIC DOSHA CONSTITUTION DIAGNOSTIC */}
        {activeWorkspaceTab.type === 'dosha' && (
          <DoshaAssessmentView
            onBackToHome={() => closeTab(activeWorkspaceTab.id)}
            onOpenTab={openTab}
          />
        )}
      </main>

      {/* Floating AI Guide Lotus Button (Always Accessible) */}
      <button
        onClick={() => {
          soundSanctuary.playSingingBowl(324);
          setIsAIGuideOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 bg-[#12161A] text-[#F9F6F0] hover:bg-[#252C33] border border-[#354350] px-4 py-3 rounded-full shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
        title="Ask Dr. Karishma AI Guide"
      >
        <Sparkles className="w-4 h-4 text-[#E0AFA0]" />
        <span className="text-xs font-medium tracking-wide">AI Guide</span>
      </button>

      {/* AI Sanctuary Guide Side Drawer */}
      <SanctuaryAIGuide
        isOpen={isAIGuideOpen}
        onClose={() => setIsAIGuideOpen(false)}
        currentContext={currentNavTab}
      />

      {/* One-Tap Twilight Sanctuary Mode Modal */}
      <SanctuaryModeModal
        isOpen={isSanctuaryModeOpen}
        onClose={() => setIsSanctuaryModeOpen(false)}
      />

      {/* Google Sign-In & User Session Modal */}
      <GoogleLoginModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={authSessionUser}
        onLoginSuccess={(user) => {
          setAuthSessionUser(user);
          setUserProfile((prev) => ({
            ...prev,
            name: user.name,
            email: user.email,
          }));
          soundSanctuary.playZenTingsha();
        }}
        onLogout={() => {
          setAuthSessionUser(null);
          soundSanctuary.playSingingBowl(216);
        }}
      />

      {/* Share Progress Modal */}
      {isShareModalOpen && (
        <ShareProgressModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          streakState={streakState}
          userName={userProfile.name}
          dailyIntention={userProfile.dailyIntention}
        />
      )}

      {/* Workspace Tab Launcher Modal */}
      <NewTabLauncherModal
        isOpen={isNewTabModalOpen}
        onClose={() => setIsNewTabModalOpen(false)}
        onOpenTab={openTab}
      />

      {/* Global Floating Sound & Breath Hearth Widget */}
      <SoundAmbienceHearth />
    </div>
  );
}
