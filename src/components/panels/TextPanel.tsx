import React, { useState } from 'react';
import { Type, Plus, Sparkles, Flame } from 'lucide-react';
import { TimelineClip } from '../../types/editor';

interface TextPanelProps {
  onAddTextClip: (clip: TimelineClip) => void;
}

export const TextPanel: React.FC<TextPanelProps> = ({ onAddTextClip }) => {
  const [customText, setCustomText] = useState('VIRAL HEADLINE');
  const [selectedColor, setSelectedColor] = useState('#FACC15');

  const textPresets = [
    { id: 'tp-1', name: 'Bold Yellow Viral', text: 'DON’T MISS THIS 🔥', color: '#FACC15', font: 'sans-serif' },
    { id: 'tp-2', name: 'Neon Cyber Blue', text: 'NEURAL 8K MATRIX ⚡', color: '#06B6D4', font: 'monospace' },
    { id: 'tp-3', name: 'Hot Pink Glow', text: 'TRENDING 2026 ✨', color: '#F43F5E', font: 'sans-serif' },
    { id: 'tp-4', name: 'Clean White Sub', text: 'Cinematic Minimalist', color: '#FFFFFF', font: 'serif' },
    { id: 'tp-5', name: 'Green Punch', text: 'PROFIT & SCALE 🚀', color: '#22C55E', font: 'sans-serif' },
  ];

  const handleAddPreset = (preset: typeof textPresets[0]) => {
    const clip: TimelineClip = {
      id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      trackId: 'track-text',
      type: 'text',
      title: preset.text,
      text: preset.text,
      startTime: 1,
      duration: 4,
      captionColor: preset.color,
      fontFamily: preset.font,
      fontSize: 28
    };

    onAddTextClip(clip);
  };

  const handleAddCustom = () => {
    if (!customText.trim()) return;

    const clip: TimelineClip = {
      id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      trackId: 'track-text',
      type: 'text',
      title: customText,
      text: customText,
      startTime: 1,
      duration: 4,
      captionColor: selectedColor,
      fontFamily: 'sans-serif',
      fontSize: 32
    };

    onAddTextClip(clip);
  };

  return (
    <div className="flex flex-col h-full text-zinc-200">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Type className="w-4 h-4 text-cyan-400" />
          <span>Animated Titles & Text</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Add high-retention text titles, meme stickers, and kinetic lower-thirds.
        </p>

        {/* Custom text builder */}
        <div className="mt-3 space-y-2">
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Type your title here..."
            className="w-full bg-zinc-900 border border-zinc-700 focus:border-cyan-500 rounded-lg p-2 text-xs text-white focus:outline-none"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {['#FACC15', '#06B6D4', '#F43F5E', '#22C55E', '#FFFFFF'].map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-5 h-5 rounded-full transition-transform ${
                    selectedColor === c ? 'scale-125 ring-2 ring-white' : ''
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleAddCustom}
              className="py-1 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Title</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2.5 no-scrollbar">
        <span className="text-xs font-bold text-zinc-400 block mb-1">
          Preset Kinetic Styles
        </span>
        {textPresets.map((tp) => (
          <div
            key={tp.id}
            onClick={() => handleAddPreset(tp)}
            className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/60 transition-all flex items-center justify-between cursor-pointer group"
          >
            <div>
              <span className="text-[10px] text-zinc-500 block mb-0.5">{tp.name}</span>
              <span
                className="text-sm font-black tracking-wide drop-shadow-sm group-hover:scale-105 transition-transform inline-block"
                style={{ color: tp.color, fontFamily: tp.font }}
              >
                {tp.text}
              </span>
            </div>
            <button className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 group-hover:bg-cyan-500 group-hover:text-zinc-950 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
