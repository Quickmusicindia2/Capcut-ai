import React from 'react';
import { 
  FolderPlus, 
  Sparkles, 
  Subtitles, 
  Wand2, 
  LayoutTemplate, 
  Music, 
  Type, 
  Cloud, 
  CreditCard,
  Globe2
} from 'lucide-react';

export type ActiveTab = 
  | 'media' 
  | 'text-to-video' 
  | 'captions' 
  | 'enhance' 
  | 'templates' 
  | 'audio' 
  | 'text' 
  | 'cloud-queue' 
  | 'pricing'
  | 'netlify';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
}) => {
  const tabs = [
    {
      id: 'media' as ActiveTab,
      label: 'Media',
      icon: <FolderPlus className="w-5 h-5" />,
      badge: 'Stock'
    },
    {
      id: 'text-to-video' as ActiveTab,
      label: 'AI Video',
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
      badge: 'AI Gen'
    },
    {
      id: 'captions' as ActiveTab,
      label: 'Auto Captions',
      icon: <Subtitles className="w-5 h-5 text-amber-400" />,
      badge: 'Multi-Lang'
    },
    {
      id: 'enhance' as ActiveTab,
      label: 'AI Enhance',
      icon: <Wand2 className="w-5 h-5 text-fuchsia-400" />,
      badge: '8K Suite'
    },
    {
      id: 'templates' as ActiveTab,
      label: 'Templates',
      icon: <LayoutTemplate className="w-5 h-5 text-blue-400" />,
      badge: 'Viral'
    },
    {
      id: 'audio' as ActiveTab,
      label: 'Audio & SFX',
      icon: <Music className="w-5 h-5" />
    },
    {
      id: 'text' as ActiveTab,
      label: 'Titles & Text',
      icon: <Type className="w-5 h-5" />
    },
    {
      id: 'cloud-queue' as ActiveTab,
      label: 'Cloud Render',
      icon: <Cloud className="w-5 h-5 text-sky-400" />
    },
    {
      id: 'pricing' as ActiveTab,
      label: 'Plans',
      icon: <CreditCard className="w-5 h-5 text-emerald-400" />
    },
    {
      id: 'netlify' as ActiveTab,
      label: 'Netlify',
      icon: <Globe2 className="w-5 h-5 text-teal-400" />,
      badge: 'Deploy'
    }
  ];

  return (
    <aside className="w-20 bg-zinc-950 border-r border-zinc-800/80 flex flex-col justify-between py-2 shrink-0 select-none z-20">
      <div className="flex flex-col gap-1 items-center px-1.5 overflow-y-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id && isOpen;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (activeTab === tab.id && isOpen) {
                  setIsOpen(false);
                } else {
                  setActiveTab(tab.id);
                  setIsOpen(true);
                }
              }}
              title={tab.label}
              className={`w-full py-2.5 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all relative group ${
                isActive
                  ? 'bg-zinc-800 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 text-[8px] font-bold px-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium tracking-tight text-center leading-tight">
                {tab.label}
              </span>

              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
