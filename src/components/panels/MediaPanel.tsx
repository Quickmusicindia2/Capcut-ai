import React, { useRef, useState } from 'react';
import { UploadCloud, Film, Image as ImageIcon, Plus, Check, Play } from 'lucide-react';
import { STOCK_VIDEOS, StockVideo } from '../../data/mockAssets';
import { TimelineClip } from '../../types/editor';

interface MediaPanelProps {
  onAddClip: (clip: TimelineClip) => void;
  onPreviewSource: (url: string) => void;
}

export const MediaPanel: React.FC<MediaPanelProps> = ({ onAddClip, onPreviewSource }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [customClips, setCustomClips] = useState<StockVideo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', 'Cyberpunk', 'Nature', 'Tech', 'Lifestyle'];

  const filteredStock = selectedCategory === 'All' 
    ? [...customClips, ...STOCK_VIDEOS]
    : [...customClips, ...STOCK_VIDEOS].filter(v => v.category === selectedCategory);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const objectUrl = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video');

      const newMedia: StockVideo = {
        id: `upload-${Date.now()}-${i}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        category: 'Lifestyle',
        duration: isVideo ? 8 : 4,
        resolution: 'User Upload',
        thumbnail: isVideo 
          ? 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80'
          : objectUrl,
        videoUrl: objectUrl
      };

      setCustomClips(prev => [newMedia, ...prev]);
    }
  };

  const handleAddToTimeline = (item: StockVideo) => {
    const newClip: TimelineClip = {
      id: `clip-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      trackId: 'track-video',
      type: 'video',
      title: item.title,
      startTime: 0, // will be auto-positioned at end of current track
      duration: item.duration || 6,
      sourceUrl: item.videoUrl,
      thumbnail: item.thumbnail,
      volume: 1,
      speed: 1,
      filter: 'none'
    };

    onAddClip(newClip);
  };

  return (
    <div className="flex flex-col h-full text-zinc-200">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Film className="w-4 h-4 text-cyan-400" />
          <span>Project Media & Stock 8K</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Upload your local footage or drag from high-definition stock assets.
        </p>

        {/* Upload box */}
        <input 
          ref={fileInputRef}
          type="file" 
          accept="video/*,image/*,audio/*" 
          multiple 
          onChange={handleFileUpload} 
          className="hidden" 
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full mt-3 py-3 px-4 rounded-xl border-2 border-dashed border-zinc-700 hover:border-cyan-500 bg-zinc-900/50 hover:bg-zinc-900 flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer"
        >
          <UploadCloud className="w-5 h-5 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
          <span className="text-xs font-semibold text-zinc-300 group-hover:text-white">
            Upload Video, Audio or Photos
          </span>
          <span className="text-[10px] text-zinc-500">
            Supports MP4, MOV, WebM, PNG, JPG up to 8K
          </span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-zinc-800/60 bg-zinc-950/40">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat 
                ? 'bg-cyan-500 text-zinc-950 font-bold' 
                : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 no-scrollbar">
        {filteredStock.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-cyan-500/60 transition-all flex flex-col"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
              <img 
                src={item.thumbnail} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/70 text-[9px] font-mono text-zinc-300">
                {item.duration}s
              </span>
              <span className="absolute top-1 left-1 px-1 py-0.5 rounded bg-cyan-950/80 text-[8px] font-bold text-cyan-300 border border-cyan-500/30">
                {item.resolution}
              </span>

              {/* Hover Overlay Controls */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => onPreviewSource(item.videoUrl)}
                  title="Preview clip"
                  className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
                <button
                  onClick={() => handleAddToTimeline(item)}
                  title="Add to Timeline"
                  className="p-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-2 flex flex-col justify-between flex-1">
              <span className="text-[11px] font-medium text-zinc-200 truncate" title={item.title}>
                {item.title}
              </span>
              <button
                onClick={() => handleAddToTimeline(item)}
                className="mt-1.5 w-full py-1 rounded bg-zinc-800 hover:bg-cyan-600 hover:text-white text-[10px] font-semibold text-zinc-300 transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add to Track</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
