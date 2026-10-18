import React from 'react';
import { 
  FolderPlus, 
  Wand2, 
  Subtitles, 
  Sparkles, 
  LayoutTemplate, 
  Music, 
  Type, 
  Cloud, 
  Globe2,
  Crown
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface MobileBottomBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  activeTab,
  setActiveTab,
  isDrawerOpen,
  setIsDrawerOpen,
}) => {
  const tools = [
    { id: 'enhance' as ActiveTab, label: 'Enhance', icon: <Wand2 className="w-4 h-4 text-fuchsia-400" />, badge: '8K' },
    { id: 'captions' as ActiveTab, label: 'Captions', icon: <Subtitles className="w-4 h-4 text-amber-400" />, badge: 'Hindi' },
    { id: 'text-to-video' as ActiveTab, label: 'AI Video', icon: <Sparkles className="w-4 h-4 text-cyan-400" />, badge: 'AI' },
    { id: 'media' as ActiveTab, label: 'Media', icon: <FolderPlus className="w-4 h-4 text-zinc-300" /> },
    { id: 'templates' as ActiveTab, label: 'Templates', icon: <LayoutTemplate className="w-4 h-4 text-blue-400" /> },
    { id: 'audio' as ActiveTab, label: 'Audio', icon: <Music className="w-4 h-4 text-emerald-400" /> },
    { id: 'text' as ActiveTab, label: 'Text', icon: <Type className="w-4 h-4 text-cyan-300" /> },
    { id: 'cloud-queue' as ActiveTab, label: 'Cloud GPU', icon: <Cloud className="w-4 h-4 text-sky-400" /> },
    { id: 'netlify' as ActiveTab, label: 'Netlify', icon: <Globe2 className="w-4 h-4 text-teal-400" /> },
  ];

  const handleToolClick = (id: ActiveTab) => {
    if (activeTab === id && isDrawerOpen) {
      setIsDrawerOpen(false);
    } else {
      setActiveTab(id);
      setIsDrawerOpen(true);
    }
  };

  return (
    <div className="h-14 bg-zinc-950 border-t border-zinc-800/80 px-1 flex items-center justify-between shrink-0 select-none z-30 overflow-x-auto no-scrollbar pb-safe">
      <div className="flex items-center gap-1 min-w-max mx-auto px-1">
        {tools.map((tool) => {
          const isActive = activeTab === tool.id && isDrawerOpen;
          return (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
              className={`py-1 px-2.5 rounded-lg flex flex-col items-center justify-center gap-0.5 min-w-[56px] transition-all relative ${
                isActive
                  ? 'bg-zinc-800 text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <div className="relative">
                {tool.icon}
                {tool.badge && (
                  <span className="absolute -top-1.5 -right-3 text-[7px] font-black px-1 rounded-full bg-cyan-500 text-zinc-950">
                    {tool.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium leading-tight">
                {tool.label}
              </span>

              {isActive && (
                <div className="w-3 h-0.5 bg-cyan-400 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
