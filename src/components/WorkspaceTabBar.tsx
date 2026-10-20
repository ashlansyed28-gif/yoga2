/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import {
  X,
  Plus,
  Home,
  Activity,
  ShieldCheck,
  Music,
  Calendar,
  AlertCircle,
  Moon,
  Sparkles,
  Award,
  Users,
  Gamepad2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Box,
  Compass,
  Heart,
  Camera,
  Flame
} from 'lucide-react';
import { WorkspaceTab } from '../types/workspaceTabs.ts';
import { soundSanctuary } from '../utils/soundSanctuary.ts';

interface WorkspaceTabBarProps {
  tabs: WorkspaceTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onOpenNewTabModal?: () => void;
  className?: string;
}

export const WorkspaceTabBar: React.FC<WorkspaceTabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onOpenNewTabModal,
  className = ''
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const getTabIcon = (tab: WorkspaceTab) => {
    switch (tab.type) {
      case 'home':
        return <Home className="w-3.5 h-3.5 text-[#B88554]" />;
      case 'pose':
      case 'intention':
        return <Box className="w-3.5 h-3.5 text-[#B88554]" />;
      case 'protocol':
      case 'protocols-list':
        return <ShieldCheck className="w-3.5 h-3.5 text-[#6C7A4D]" />;
      case 'sequence':
      case 'flow':
        return <Activity className="w-3.5 h-3.5 text-[#D4A373]" />;
      case 'matcher':
        return <Compass className="w-3.5 h-3.5 text-[#9E6E38]" />;
      case 'prescriptions':
        return <Heart className="w-3.5 h-3.5 text-[#CE4257]" />;
      case 'aipose':
        return <Camera className="w-3.5 h-3.5 text-[#73532C]" />;
      case 'chanting':
        return <Music className="w-3.5 h-3.5 text-[#E0AFA0]" />;
      case 'consult':
        return <Calendar className="w-3.5 h-3.5 text-[#9E6E38]" />;
      case 'emergency':
        return <AlertCircle className="w-3.5 h-3.5 text-[#CE4257]" />;
      case 'sleep':
        return <Moon className="w-3.5 h-3.5 text-[#3A6073]" />;
      case 'faceyoga':
        return <Sparkles className="w-3.5 h-3.5 text-[#E0AFA0]" />;
      case 'progress':
        return <Award className="w-3.5 h-3.5 text-[#B88554]" />;
      case 'community':
        return <Users className="w-3.5 h-3.5 text-[#6C7A4D]" />;
      case 'game':
        return <Gamepad2 className="w-3.5 h-3.5 text-[#73532C]" />;
      case 'dosha':
        return <Flame className="w-3.5 h-3.5 text-[#E07A5F]" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-[#B88554]" />;
    }
  };

  return (
    <div
      className={`bg-[#EDE7DC] border-b border-[#D5C9B6] px-2 sm:px-4 py-1.5 flex items-center gap-1 relative z-30 select-none shadow-2xs ${className}`}
    >
      {/* Scroll Left Button if overflow */}
      <button
        onClick={scrollLeft}
        className="p-1 rounded-lg hover:bg-[#E0D5C1] text-[#7A7268] hover:text-[#26221E] transition-colors cursor-pointer shrink-0 hidden sm:flex items-center justify-center"
        title="Scroll tabs left"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>

      {/* Tabs Container */}
      <div
        ref={scrollRef}
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth flex-1 py-0.5"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => {
                if (!isActive) {
                  onSelectTab(tab.id);
                  soundSanctuary.playZenTingsha();
                }
              }}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer border shrink-0 max-w-[220px] ${
                isActive
                  ? 'bg-[#FFFFFF] border-[#D5C9B6] text-[#26221E] font-medium shadow-xs ring-1 ring-[#B88554]/20'
                  : 'bg-[#F4EFE6] hover:bg-[#FAF7F2] border-[#E0D5C1] text-[#5E5852] hover:text-[#26221E]'
              }`}
              title={`${tab.title}${tab.subtitle ? ` · ${tab.subtitle}` : ''}`}
            >
              <span className="shrink-0">{getTabIcon(tab)}</span>
              <span className="truncate text-xs">{tab.title}</span>

              {/* Close Tab Button */}
              {tab.canClose && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                    soundSanctuary.playZenTingsha();
                  }}
                  className="p-0.5 rounded-md hover:bg-[#EAE2D5] text-[#A8A096] hover:text-[#26221E] transition-colors cursor-pointer shrink-0 ml-0.5 opacity-60 group-hover:opacity-100"
                  title="Close tab"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={scrollRight}
        className="p-1 rounded-lg hover:bg-[#E0D5C1] text-[#7A7268] hover:text-[#26221E] transition-colors cursor-pointer shrink-0 hidden sm:flex items-center justify-center"
        title="Scroll tabs right"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      {/* Quick Add / Open Tab Button */}
      {onOpenNewTabModal && (
        <button
          onClick={onOpenNewTabModal}
          className="p-1.5 rounded-xl bg-[#F4EFE6] hover:bg-[#FFFFFF] border border-[#E0D5C1] text-[#73532C] transition-all cursor-pointer shrink-0 ml-1 shadow-2xs"
          title="Open a sanctuary module in a new tab"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
