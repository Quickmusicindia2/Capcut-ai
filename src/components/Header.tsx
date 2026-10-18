import React, { useState } from 'react';
import { 
  Film, 
  Sparkles, 
  Cloud, 
  Crown, 
  Download, 
  RotateCcw, 
  RotateCw, 
  Smartphone, 
  Tv, 
  Square, 
  Layers, 
  Globe2,
  ChevronDown
} from 'lucide-react';
import { AspectRatio, SubscriptionPlan } from '../types/editor';

interface HeaderProps {
  projectName: string;
  setProjectName: (name: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  activePlan: SubscriptionPlan;
  onOpenPricing: () => void;
  onOpenExport: () => void;
  onOpenNetlify: () => void;
  cloudQueueCount: number;
  onOpenCloudQueue: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  projectName,
  setProjectName,
  aspectRatio,
  setAspectRatio,
  activePlan,
  onOpenPricing,
  onOpenExport,
  onOpenNetlify,
  cloudQueueCount,
  onOpenCloudQueue,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showRatioDropdown, setShowRatioDropdown] = useState(false);

  const aspectRatios: { id: AspectRatio; label: string; desc: string }[] = [
    { id: '9:16', label: '9:16', desc: 'TikTok / Reels' },
    { id: '16:9', label: '16:9', desc: 'YouTube 8K' },
    { id: '1:1', label: '1:1', desc: 'Square' },
    { id: '4:5', label: '4:5', desc: 'Portrait' },
  ];

  return (
    <header className="h-12 bg-zinc-950 border-b border-zinc-800/80 px-2 sm:px-4 flex items-center justify-between select-none z-30 shrink-0">
      {/* Brand & Project Name */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-fuchsia-600 flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/20">
          <Film className="w-3.5 h-3.5 text-white" />
        </div>
        
        {/* Project Title */}
        <div className="min-w-0">
          {isEditingTitle ? (
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              autoFocus
              className="bg-zinc-900 text-xs font-semibold text-white px-2 py-0.5 rounded border border-cyan-500 focus:outline-none w-32 sm:w-48"
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="text-xs font-bold text-white hover:text-cyan-300 transition-colors flex items-center gap-1 truncate max-w-[110px] sm:max-w-[180px]"
            >
              <span className="truncate">{projectName}</span>
              <span className="text-[10px] text-zinc-500 shrink-0">✏️</span>
            </button>
          )}
        </div>

        {/* Aspect Ratio Picker (Dropdown for Mobile) */}
        <div className="relative">
          <button
            onClick={() => setShowRatioDropdown(prev => !prev)}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-bold text-zinc-300 hover:text-white"
          >
            <span>{aspectRatio}</span>
            <ChevronDown className="w-2.5 h-2.5 text-zinc-500" />
          </button>

          {showRatioDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl py-1 z-50 w-28">
              {aspectRatios.map(r => (
                <button
                  key={r.id}
                  onClick={() => {
                    setAspectRatio(r.id);
                    setShowRatioDropdown(false);
                  }}
                  className={`w-full px-2.5 py-1 text-left text-xs flex items-center justify-between ${
                    aspectRatio === r.id ? 'text-cyan-400 font-bold bg-zinc-800' : 'text-zinc-300 hover:bg-zinc-800/60'
                  }`}
                >
                  <span>{r.label}</span>
                  <span className="text-[9px] text-zinc-500">{r.desc.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Undo/Redo + VIP badge + Export 8K */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-20"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-20"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* VIP Plan Badge */}
        <button
          onClick={onOpenPricing}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold"
        >
          <Crown className="w-3 h-3 text-amber-400" />
          <span className="hidden sm:inline">8K VIP</span>
        </button>

        {/* Netlify Deploy button */}
        <button
          onClick={onOpenNetlify}
          title="Netlify Publish"
          className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-teal-500/10 border border-teal-500/30 text-teal-300 text-[10px] font-semibold"
        >
          <Globe2 className="w-3 h-3 text-teal-400" />
          <span>Netlify</span>
        </button>

        {/* Primary Export 8K Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs shadow-md shadow-cyan-500/25 active:scale-95 transition-transform"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export 8K</span>
        </button>
      </div>
    </header>
  );
};
