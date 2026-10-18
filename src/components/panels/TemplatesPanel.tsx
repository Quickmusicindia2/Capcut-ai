import React from 'react';
import { LayoutTemplate, Sparkles, Plus, Clock, Layers, Check } from 'lucide-react';
import { TEMPLATES_LIBRARY, VideoTemplate } from '../../data/mockAssets';
import { CaptionItem, TimelineClip } from '../../types/editor';

interface TemplatesPanelProps {
  onApplyTemplate: (template: VideoTemplate) => void;
  onPreviewSource: (url: string) => void;
}

export const TemplatesPanel: React.FC<TemplatesPanelProps> = ({
  onApplyTemplate,
  onPreviewSource
}) => {
  return (
    <div className="flex flex-col h-full text-zinc-200">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4 text-blue-400" />
          <span>Advanced Viral Templates</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          1-Click apply pre-configured 8K clips, kinetic captions, transitions & sound design.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {TEMPLATES_LIBRARY.map((tpl) => (
          <div
            key={tpl.id}
            className="group rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-blue-500/60 transition-all flex flex-col"
          >
            {/* Thumbnail Header */}
            <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
              <img
                src={tpl.thumbnail}
                alt={tpl.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-blue-500 text-zinc-950 font-black text-[9px] uppercase tracking-wider">
                {tpl.category}
              </span>

              <div className="absolute top-2 right-2 flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-mono text-zinc-300 backdrop-blur-sm">
                  {tpl.aspectRatio}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-mono text-zinc-300 backdrop-blur-sm flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {tpl.duration}s
                </span>
              </div>

              <div className="absolute bottom-2 left-3 right-3">
                <h3 className="text-xs font-bold text-white drop-shadow-md">
                  {tpl.title}
                </h3>
              </div>
            </div>

            {/* Description & Subtitle Preview */}
            <div className="p-3 flex flex-col gap-2.5">
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {tpl.description}
              </p>

              {/* Sample Subtitle Hook */}
              {tpl.defaultCaptions.length > 0 && (
                <div className="p-2 rounded bg-zinc-950/80 border border-zinc-800 text-[10px] text-zinc-300 font-mono flex items-center gap-1.5">
                  <span className="text-amber-400 font-bold">Caption:</span>
                  <span className="truncate">{tpl.defaultCaptions[0].text}</span>
                </div>
              )}

              {/* Apply Button */}
              <button
                onClick={() => onApplyTemplate(tpl)}
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Apply Template to Timeline</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
