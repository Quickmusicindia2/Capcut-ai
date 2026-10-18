import React, { useRef, useState } from 'react';
import { 
  Scissors, 
  Trash2, 
  Copy, 
  ZoomIn, 
  ZoomOut, 
  Magnet, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Volume2, 
  VolumeX,
  Subtitles,
  Type,
  Layers,
  Film,
  Music,
  Plus
} from 'lucide-react';
import { TimelineClip, TimelineTrack } from '../types/editor';

interface TimelineProps {
  tracks: TimelineTrack[];
  setTracks: React.Dispatch<React.SetStateAction<TimelineTrack[]>>;
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  totalDuration: number;
  selectedClipId: string | null;
  setSelectedClipId: (id: string | null) => void;
  onSplitClip: () => void;
  onDeleteClip: () => void;
  onDuplicateClip: () => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  tracks,
  setTracks,
  currentTime,
  setCurrentTime,
  totalDuration,
  selectedClipId,
  setSelectedClipId,
  onSplitClip,
  onDeleteClip,
  onDuplicateClip,
}) => {
  const [zoomLevel, setZoomLevel] = useState(40); // pixels per second
  const [isSnapping, setIsSnapping] = useState(true);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [draggingClip, setDraggingClip] = useState<{ id: string; startX: number; origStart: number } | null>(null);
  const [resizingClip, setResizingClip] = useState<{ id: string; side: 'left' | 'right'; startX: number; origDuration: number; origStart: number } | null>(null);
  
  const timelineContentRef = useRef<HTMLDivElement>(null);

  // Ruler tick interval based on zoom
  const stepSeconds = zoomLevel > 60 ? 1 : zoomLevel > 30 ? 2 : 5;
  const rulerTicksCount = Math.ceil(totalDuration / stepSeconds) + 2;

  // Handle Playhead Scrubbing from ruler or empty space (Mouse & Touch)
  const handleRulerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineContentRef.current) return;
    const rect = timelineContentRef.current.getBoundingClientRect();
    const scrollLeft = timelineContentRef.current.scrollLeft;
    const x = e.clientX - rect.left + scrollLeft;
    const newTime = Math.max(0, Math.min(totalDuration, x / zoomLevel));
    setCurrentTime(newTime);
    setIsDraggingPlayhead(true);
  };

  const handleRulerTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!timelineContentRef.current || e.touches.length === 0) return;
    const rect = timelineContentRef.current.getBoundingClientRect();
    const scrollLeft = timelineContentRef.current.scrollLeft;
    const x = e.touches[0].clientX - rect.left + scrollLeft;
    const newTime = Math.max(0, Math.min(totalDuration, x / zoomLevel));
    setCurrentTime(newTime);
    setIsDraggingPlayhead(true);
  };

  const handleGlobalTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isDraggingPlayhead && timelineContentRef.current && e.touches.length > 0) {
      const rect = timelineContentRef.current.getBoundingClientRect();
      const scrollLeft = timelineContentRef.current.scrollLeft;
      const x = e.touches[0].clientX - rect.left + scrollLeft;
      let newTime = Math.max(0, Math.min(totalDuration, x / zoomLevel));
      if (isSnapping) {
        newTime = Math.round(newTime * 10) / 10;
      }
      setCurrentTime(newTime);
    }
  };

  const handleGlobalMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingPlayhead && timelineContentRef.current) {
      const rect = timelineContentRef.current.getBoundingClientRect();
      const scrollLeft = timelineContentRef.current.scrollLeft;
      const x = e.clientX - rect.left + scrollLeft;
      let newTime = Math.max(0, Math.min(totalDuration, x / zoomLevel));
      if (isSnapping) {
        newTime = Math.round(newTime * 10) / 10;
      }
      setCurrentTime(newTime);
    } else if (draggingClip && timelineContentRef.current) {
      const dx = (e.clientX - draggingClip.startX) / zoomLevel;
      let newStart = Math.max(0, draggingClip.origStart + dx);
      if (isSnapping) newStart = Math.round(newStart * 4) / 4;

      setTracks(prev => prev.map(t => ({
        ...t,
        clips: t.clips.map(c => c.id === draggingClip.id ? { ...c, startTime: newStart } : c)
      })));
    } else if (resizingClip && timelineContentRef.current) {
      const dx = (e.clientX - resizingClip.startX) / zoomLevel;
      if (resizingClip.side === 'right') {
        const newDur = Math.max(1, resizingClip.origDuration + dx);
        setTracks(prev => prev.map(t => ({
          ...t,
          clips: t.clips.map(c => c.id === resizingClip.id ? { ...c, duration: newDur } : c)
        })));
      } else {
        const newStart = Math.max(0, resizingClip.origStart + dx);
        const newDur = Math.max(1, resizingClip.origDuration - dx);
        setTracks(prev => prev.map(t => ({
          ...t,
          clips: t.clips.map(c => c.id === resizingClip.id ? { ...c, startTime: newStart, duration: newDur } : c)
        })));
      }
    }
  };

  const handleGlobalMouseUp = () => {
    setIsDraggingPlayhead(false);
    setDraggingClip(null);
    setResizingClip(null);
  };

  // Toggle track mute
  const toggleTrackMute = (trackId: string) => {
    setTracks(prev => prev.map(t => t.id === trackId ? { ...t, isMuted: !t.isMuted } : t));
  };

  // Toggle track lock
  const toggleTrackLock = (trackId: string) => {
    setTracks(prev => prev.map(t => t.id === trackId ? { ...t, isLocked: !t.isLocked } : t));
  };

  const getTrackIcon = (type: string) => {
    switch (type) {
      case 'caption':
        return <Subtitles className="w-3.5 h-3.5 text-amber-400" />;
      case 'text':
        return <Type className="w-3.5 h-3.5 text-cyan-400" />;
      case 'overlay':
        return <Layers className="w-3.5 h-3.5 text-fuchsia-400" />;
      case 'video':
        return <Film className="w-3.5 h-3.5 text-blue-400" />;
      case 'audio':
        return <Music className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Film className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div
      className="h-44 sm:h-60 bg-zinc-950 border-t border-zinc-800 flex flex-col select-none relative shrink-0"
      onMouseMove={handleGlobalMouseMove}
      onMouseUp={handleGlobalMouseUp}
      onMouseLeave={handleGlobalMouseUp}
      onTouchMove={handleGlobalTouchMove}
      onTouchEnd={handleGlobalMouseUp}
    >
      {/* Top Action Toolbar */}
      <div className="h-9 sm:h-10 bg-zinc-900/90 border-b border-zinc-800 px-2 sm:px-4 flex items-center justify-between text-zinc-300">
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Split button */}
          <button
            onClick={onSplitClip}
            title="Split Clip at Playhead (S)"
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
          >
            <Scissors className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] sm:text-xs">Split</span>
          </button>

          {/* Delete button */}
          <button
            onClick={onDeleteClip}
            disabled={!selectedClipId}
            title="Delete Selected Clip (Del)"
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-rose-400 disabled:opacity-30 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs">Delete</span>
          </button>

          {/* Duplicate button */}
          <button
            onClick={onDuplicateClip}
            disabled={!selectedClipId}
            title="Duplicate Clip (Ctrl+D)"
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white disabled:opacity-30 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy</span>
          </button>

          <div className="h-4 w-px bg-zinc-800 mx-1" />

          {/* Snapping magnet toggle */}
          <button
            onClick={() => setIsSnapping(prev => !prev)}
            title="Toggle Snapping Magnet"
            className={`p-1.5 rounded transition-colors ${
              isSnapping ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Magnet className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Zoom controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoomLevel(prev => Math.max(15, prev - 10))}
            title="Zoom Out Timeline"
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <input
            type="range"
            min={15}
            max={100}
            value={zoomLevel}
            onChange={(e) => setZoomLevel(parseInt(e.target.value))}
            className="w-20 accent-cyan-400 h-1 bg-zinc-800 rounded"
          />

          <button
            onClick={() => setZoomLevel(prev => Math.min(100, prev + 10))}
            title="Zoom In Timeline"
            className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Multitrack Viewport (Track Headers on Left, Scroller on Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Track Headers */}
        <div className="w-24 sm:w-40 bg-zinc-950 border-r border-zinc-800 shrink-0 flex flex-col z-10 select-none">
          {/* Header spacer for ruler */}
          <div className="h-6 border-b border-zinc-800/80 px-1.5 sm:px-2 flex items-center justify-between text-[9px] sm:text-[10px] text-zinc-500 font-mono">
            <span>TRACKS</span>
            <span className="hidden sm:inline">M / L</span>
          </div>

          {/* Track Labels */}
          <div className="flex-1 flex flex-col justify-around py-0.5">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="h-8 sm:h-9 px-1.5 sm:px-2 flex items-center justify-between border-b border-zinc-900/60 hover:bg-zinc-900/40 text-xs font-medium text-zinc-300"
              >
                <div className="flex items-center gap-1 sm:gap-1.5 truncate">
                  {getTrackIcon(track.type)}
                  <span className="truncate text-[10px] sm:text-[11px] font-semibold">{track.name.split(' ')[0]}</span>
                </div>

                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => toggleTrackMute(track.id)}
                    title={track.isMuted ? 'Unmute track' : 'Mute track'}
                    className={`p-0.5 rounded hover:bg-zinc-800 ${
                      track.isMuted ? 'text-rose-400' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {track.isMuted ? <VolumeX className="w-2.5 h-2.5" /> : <Volume2 className="w-2.5 h-2.5" />}
                  </button>

                  <button
                    onClick={() => toggleTrackLock(track.id)}
                    title={track.isLocked ? 'Unlock track' : 'Lock track'}
                    className={`p-0.5 rounded hover:bg-zinc-800 ${
                      track.isLocked ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {track.isLocked ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Scrollable Tracks & Ruler */}
        <div 
          ref={timelineContentRef}
          className="flex-1 overflow-x-auto overflow-y-hidden relative no-scrollbar"
        >
          <div 
            style={{ width: `${Math.max(600, (totalDuration + 5) * zoomLevel)}px` }}
            className="h-full flex flex-col relative"
          >
            {/* Time Ruler */}
            <div
              className="h-6 border-b border-zinc-800 bg-zinc-950/80 cursor-pointer relative"
              onMouseDown={handleRulerMouseDown}
              onTouchStart={handleRulerTouchStart}
            >
              {Array.from({ length: rulerTicksCount }).map((_, i) => {
                const sec = i * stepSeconds;
                return (
                  <div
                    key={sec}
                    style={{ left: `${sec * zoomLevel}px` }}
                    className="absolute top-0 bottom-0 flex flex-col justify-end pointer-events-none"
                  >
                    <span className="text-[9px] font-mono text-zinc-500 pl-1 select-none">
                      {sec}s
                    </span>
                    <div className="w-px h-2 bg-zinc-700" />
                  </div>
                );
              })}
            </div>

            {/* Track Lanes */}
            <div className="flex-1 flex flex-col justify-around relative py-1">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="h-9 relative border-b border-zinc-900/60 bg-zinc-950/40"
                >
                  {/* Clips on this track */}
                  {track.clips.map((clip) => {
                    const isSelected = selectedClipId === clip.id;
                    const left = clip.startTime * zoomLevel;
                    const width = clip.duration * zoomLevel;

                    return (
                      <div
                        key={clip.id}
                        style={{
                          left: `${left}px`,
                          width: `${Math.max(20, width)}px`
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClipId(clip.id);
                        }}
                        onMouseDown={(e) => {
                          if (!track.isLocked) {
                            setDraggingClip({
                              id: clip.id,
                              startX: e.clientX,
                              origStart: clip.startTime
                            });
                          }
                        }}
                        className={`absolute top-0.5 bottom-0.5 rounded-md overflow-hidden cursor-move transition-shadow flex items-center group ${
                          isSelected
                            ? 'ring-2 ring-cyan-400 z-20 shadow-lg'
                            : 'border border-white/10 hover:border-white/30 z-10'
                        } ${
                          clip.type === 'caption'
                            ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                            : clip.type === 'text'
                            ? 'bg-cyan-500/25 text-cyan-200 border-cyan-500/40'
                            : clip.type === 'audio'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                            : 'bg-blue-950/80 text-blue-200 border-blue-500/30'
                        }`}
                      >
                        {/* Left Trim Handle */}
                        <div
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setResizingClip({
                              id: clip.id,
                              side: 'left',
                              startX: e.clientX,
                              origDuration: clip.duration,
                              origStart: clip.startTime
                            });
                          }}
                          className="w-1.5 h-full bg-white/20 hover:bg-white cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity z-20"
                        />

                        {/* Clip Content */}
                        <div className="flex-1 px-1.5 truncate flex items-center gap-1.5 pointer-events-none">
                          {clip.thumbnail && (
                            <img
                              src={clip.thumbnail}
                              alt=""
                              className="w-5 h-5 rounded object-cover shrink-0"
                            />
                          )}
                          <span className="text-[11px] font-semibold truncate">
                            {clip.title}
                          </span>
                        </div>

                        {/* Right Trim Handle */}
                        <div
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            setResizingClip({
                              id: clip.id,
                              side: 'right',
                              startX: e.clientX,
                              origDuration: clip.duration,
                              origStart: clip.startTime
                            });
                          }}
                          className="w-1.5 h-full bg-white/20 hover:bg-white cursor-ew-resize opacity-0 group-hover:opacity-100 transition-opacity z-20"
                        />
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Red Playhead Line and Scrubber Needle */}
              <div
                style={{ left: `${currentTime * zoomLevel}px` }}
                className="absolute top-0 bottom-0 w-0.5 bg-rose-500 pointer-events-none z-30 flex flex-col items-center"
              >
                {/* Needle top marker */}
                <div className="w-3 h-3 bg-rose-500 rotate-45 -translate-y-1.5 shadow-md shadow-rose-500/50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
