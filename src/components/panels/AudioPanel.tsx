import React, { useState } from 'react';
import { Music, Volume2, Plus, Play, Pause, Disc } from 'lucide-react';
import { STOCK_AUDIOS, StockAudio } from '../../data/mockAssets';
import { TimelineClip } from '../../types/editor';

interface AudioPanelProps {
  onAddAudioClip: (clip: TimelineClip) => void;
}

export const AudioPanel: React.FC<AudioPanelProps> = ({ onAddAudioClip }) => {
  const [filter, setFilter] = useState<'ALL' | 'BGM' | 'SFX'>('ALL');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const filteredAudios = filter === 'ALL' 
    ? STOCK_AUDIOS 
    : STOCK_AUDIOS.filter(a => a.category === filter);

  const togglePreview = (item: StockAudio) => {
    if (playingId === item.id) {
      audioElement?.pause();
      setPlayingId(null);
    } else {
      audioElement?.pause();
      const newAudio = new Audio(item.audioUrl);
      newAudio.play().catch(e => console.log('Audio autoplay prevented:', e));
      newAudio.onended = () => setPlayingId(null);
      setAudioElement(newAudio);
      setPlayingId(item.id);
    }
  };

  const handleAdd = (item: StockAudio) => {
    const newClip: TimelineClip = {
      id: `audio-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      trackId: 'track-audio',
      type: 'audio',
      title: item.title,
      startTime: 0,
      duration: Math.min(item.duration, 15),
      sourceUrl: item.audioUrl,
      volume: item.category === 'BGM' ? 0.7 : 1.0
    };

    onAddAudioClip(newClip);
  };

  return (
    <div className="flex flex-col h-full text-zinc-200">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Music className="w-4 h-4 text-emerald-400" />
          <span>Royalty-Free Audio & SFX</span>
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Trending phonk, cinematic swells, lofi chill & viral sound effects.
        </p>

        {/* Filter Pills */}
        <div className="mt-3 flex items-center gap-1.5">
          {(['ALL', 'BGM', 'SFX'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                filter === f
                  ? 'bg-emerald-500 text-zinc-950 font-bold'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              {f === 'ALL' ? 'All Sounds' : f === 'BGM' ? 'Background Music' : 'Sound Effects'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
        {filteredAudios.map((item) => (
          <div
            key={item.id}
            className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex items-center justify-between gap-3 transition-colors"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => togglePreview(item)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  playingId === item.id
                    ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/30'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                }`}
              >
                {playingId === item.id ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{item.title}</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-zinc-800 text-emerald-400 font-mono">
                    {item.category}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400 flex items-center gap-2 mt-0.5">
                  <span>{item.artist}</span>
                  <span>•</span>
                  <span>{item.duration}s</span>
                  {item.bpm && (
                    <>
                      <span>•</span>
                      <span className="text-zinc-500">{item.bpm} BPM</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => handleAdd(item)}
              title="Add to Audio Track"
              className="p-2 rounded-lg bg-zinc-800 hover:bg-emerald-600 hover:text-white text-zinc-300 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
