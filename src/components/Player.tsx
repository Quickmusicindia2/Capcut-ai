import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  Wand2, 
  SplitSquareVertical, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { AspectRatio, CaptionItem, EnhancementProfile, TimelineClip, TimelineTrack } from '../types/editor';
import { COLOR_LUTS } from '../data/mockAssets';

interface PlayerProps {
  tracks: TimelineTrack[];
  captions: CaptionItem[];
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  totalDuration: number;
  aspectRatio: AspectRatio;
  enhancement: EnhancementProfile;
  setEnhancement: React.Dispatch<React.SetStateAction<EnhancementProfile>>;
}

export const Player: React.FC<PlayerProps> = ({
  tracks,
  captions,
  currentTime,
  setCurrentTime,
  isPlaying,
  setIsPlaying,
  totalDuration,
  aspectRatio,
  enhancement,
  setEnhancement
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const secondVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [splitPos, setSplitPos] = useState(50); // percentage 0 to 100
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Find active video clip on main video track
  const videoTrack = tracks.find(t => t.id === 'track-video');
  const activeVideoClip = videoTrack?.clips.find(
    c => currentTime >= c.startTime && currentTime < c.startTime + c.duration
  );

  // Find active text overlay
  const textTrack = tracks.find(t => t.id === 'track-text');
  const activeTextClip = textTrack?.clips.find(
    c => currentTime >= c.startTime && currentTime < c.startTime + c.duration
  );

  // Find active caption
  const activeCaption = captions.find(
    c => currentTime >= c.start && currentTime <= c.end
  );

  // Handle Play/Pause
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  // Keyboard shortcut: Spacebar for play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync video element time and playback
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
        secondVideoRef.current?.play().catch(() => {});
      } else {
        videoRef.current.pause();
        secondVideoRef.current?.pause();
      }
    }
  }, [isPlaying]);

  // Video time update sync
  const handleVideoTimeUpdate = () => {
    if (videoRef.current && isPlaying) {
      // Keep second video in sync
      if (secondVideoRef.current && Math.abs(secondVideoRef.current.currentTime - videoRef.current.currentTime) > 0.1) {
        secondVideoRef.current.currentTime = videoRef.current.currentTime;
      }

      // Offset clip start time
      const clipOffset = activeVideoClip ? activeVideoClip.startTime : 0;
      const calculatedCurrentTime = clipOffset + videoRef.current.currentTime;
      if (calculatedCurrentTime >= totalDuration) {
        setIsPlaying(false);
        setCurrentTime(0);
        if (videoRef.current) videoRef.current.currentTime = 0;
        if (secondVideoRef.current) secondVideoRef.current.currentTime = 0;
      } else {
        setCurrentTime(calculatedCurrentTime);
      }
    }
  };

  // Sync playback speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
    if (secondVideoRef.current) {
      secondVideoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // When scrubbing from timeline
  useEffect(() => {
    if (videoRef.current && activeVideoClip) {
      const internalClipTime = Math.max(0, currentTime - activeVideoClip.startTime);
      if (Math.abs(videoRef.current.currentTime - internalClipTime) > 0.3) {
        videoRef.current.currentTime = internalClipTime;
        if (secondVideoRef.current) secondVideoRef.current.currentTime = internalClipTime;
      }
    }
  }, [currentTime, activeVideoClip]);

  // Format timecode
  const formatTimecode = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  // Calculate CSS Filter for Enhanced Side
  const getEnhancedFilterString = () => {
    if (!enhancement.enabled) return 'none';

    let filterString = '';
    const { colorGrading, upscaling8K, noiseReduction } = enhancement;

    if (colorGrading.enabled) {
      const selectedLut = COLOR_LUTS.find(l => l.name === colorGrading.lut);
      if (selectedLut && selectedLut.filterString !== 'none') {
        filterString += `${selectedLut.filterString} `;
      }

      filterString += `contrast(${colorGrading.contrast}) saturate(${colorGrading.saturation}) `;
      if (colorGrading.temperature > 6500) {
        filterString += `hue-rotate(5deg) `;
      } else if (colorGrading.temperature < 6500) {
        filterString += `sepia(0.15) `;
      }
    }

    if (upscaling8K.enabled) {
      // 8K sharpness simulation filter
      filterString += `drop-shadow(0 0 1px rgba(255,255,255,0.2)) `;
    }

    return filterString.trim() || 'none';
  };

  // Aspect Ratio styles
  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case '9:16':
        return 'aspect-[9/16] max-h-full max-w-[340px]';
      case '16:9':
        return 'aspect-video max-h-full w-full max-w-[850px]';
      case '1:1':
        return 'aspect-square max-h-full max-w-[460px]';
      case '4:5':
        return 'aspect-[4/5] max-h-full max-w-[380px]';
      default:
        return 'aspect-[9/16] max-h-full max-w-[340px]';
    }
  };

  // Split-screen mouse & touch drag
  const handleSplitMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingSplit || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSplitPos(percent);
  };

  const handleSplitTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percent = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSplitPos(percent);
  };

  const currentSource = activeVideoClip?.sourceUrl || 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-skater-moving-forward-in-the-city-42953-large.mp4';

  return (
    <div className="flex-1 flex flex-col bg-zinc-950/90 relative overflow-hidden select-none min-h-0">
      {/* Canvas Viewport Area */}
      <div 
        className="flex-1 flex items-center justify-center p-2 relative overflow-hidden min-h-0"
        onMouseMove={handleSplitMouseMove}
        onMouseUp={() => setIsDraggingSplit(false)}
        onMouseLeave={() => setIsDraggingSplit(false)}
        onTouchMove={handleSplitTouchMove}
        onTouchEnd={() => setIsDraggingSplit(false)}
      >
        <div
          ref={containerRef}
          className={`relative rounded-xl overflow-hidden bg-black shadow-2xl border border-zinc-800/80 flex items-center justify-center ${getAspectRatioClasses()}`}
        >
          {/* Base Video Element */}
          <video
            ref={videoRef}
            src={currentSource}
            playsInline
            loop
            muted={isMuted}
            onTimeUpdate={handleVideoTimeUpdate}
            style={{
              filter: enhancement.enabled && !enhancement.splitView ? getEnhancedFilterString() : 'none'
            }}
            className="w-full h-full object-cover pointer-events-none"
          />

          {/* Interactive Split-Screen (Before / After Comparison) */}
          {enhancement.enabled && enhancement.splitView && (
            <div 
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{
                clipPath: `polygon(${splitPos}% 0, 100% 0, 100% 100%, ${splitPos}% 100%)`
              }}
            >
              {/* Duplicate video for right enhanced side */}
              <video
                ref={secondVideoRef}
                src={currentSource}
                playsInline
                loop
                muted
                style={{
                  filter: getEnhancedFilterString()
                }}
                className="w-full h-full object-cover"
              />

              {/* Enhanced Side Badge */}
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-fuchsia-600/90 text-white font-black text-[10px] tracking-wider shadow-lg flex items-center gap-1 backdrop-blur-sm">
                <Sparkles className="w-3 h-3 text-cyan-300" />
                <span>AI 8K ENHANCED</span>
              </div>
            </div>
          )}

          {/* Split Screen Divider Handle */}
          {enhancement.enabled && enhancement.splitView && (
            <>
              {/* Original Side Badge */}
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-zinc-900/90 text-zinc-300 font-bold text-[10px] tracking-wider shadow-lg border border-zinc-700 backdrop-blur-sm pointer-events-none">
                ORIGINAL RAW
              </div>

              {/* Draggable Vertical Divider Bar */}
              <div
                style={{ left: `${splitPos}%` }}
                onMouseDown={() => setIsDraggingSplit(true)}
                onTouchStart={() => setIsDraggingSplit(true)}
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(255,255,255,0.8)] z-30 flex items-center justify-center -translate-x-1/2 pointer-events-auto"
              >
                <div 
                  onTouchStart={() => setIsDraggingSplit(true)}
                  className="w-7 h-7 rounded-full bg-white text-zinc-950 font-black flex items-center justify-center shadow-xl border-2 border-zinc-950 text-[10px]"
                >
                  ⬌
                </div>
              </div>
            </>
          )}

          {/* Real-time Subtitle / Caption Overlay */}
          {activeCaption && (
            <div className="absolute bottom-10 left-4 right-4 text-center pointer-events-none z-20 transition-all duration-150 animate-in fade-in zoom-in-95">
              <div className="inline-block px-4 py-1.5 rounded-lg bg-black/75 backdrop-blur-sm shadow-2xl border border-white/10 max-w-full">
                <span className="text-base sm:text-lg font-black tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] uppercase">
                  {/* Highlight word logic */}
                  {activeCaption.highlightWord ? (
                    activeCaption.text.split(new RegExp(`(${activeCaption.highlightWord})`, 'gi')).map((part, i) => {
                      if (part.toLowerCase() === activeCaption.highlightWord?.toLowerCase()) {
                        return (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 mx-0.5 rounded text-zinc-950 font-black inline-block scale-110 shadow-lg"
                            style={{ backgroundColor: activeCaption.color || '#FACC15' }}
                          >
                            {part}
                          </span>
                        );
                      }
                      return <span key={i}>{part} </span>;
                    })
                  ) : (
                    <span>{activeCaption.text}</span>
                  )}
                  {activeCaption.emoji && (
                    <span className="ml-1.5 inline-block animate-bounce">{activeCaption.emoji}</span>
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Active Title Overlay */}
          {activeTextClip && activeTextClip.text && (
            <div className="absolute top-12 left-4 right-4 text-center pointer-events-none z-10">
              <span
                className="text-xl sm:text-2xl font-black drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)] uppercase tracking-wider inline-block px-3 py-1 rounded bg-black/40 backdrop-blur-sm"
                style={{
                  color: activeTextClip.captionColor || '#FACC15',
                  fontFamily: activeTextClip.fontFamily || 'sans-serif'
                }}
              >
                {activeTextClip.text}
              </span>
            </div>
          )}

          {/* Resolution Badge in top right when not split */}
          {(!enhancement.enabled || !enhancement.splitView) && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 text-zinc-300 font-mono text-[9px] font-bold border border-zinc-700/60 backdrop-blur-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>{enhancement.enabled ? `${enhancement.upscaling8K.targetResolution} HDR` : '1080p'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Playhead Bottom Transport Bar */}
      <div className="h-12 bg-zinc-950 border-t border-zinc-800/80 px-4 flex items-center justify-between text-zinc-300">
        {/* Left: Transport controls */}
        <div className="flex items-center gap-2">
          {/* Skip to start */}
          <button
            onClick={() => {
              setCurrentTime(0);
              if (videoRef.current) videoRef.current.currentTime = 0;
            }}
            title="Jump to Start"
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            className="w-8 h-8 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Timecode display */}
          <div className="text-xs font-mono font-semibold text-zinc-400 ml-2">
            <span className="text-white font-bold">{formatTimecode(currentTime)}</span>
            <span className="text-zinc-600 mx-1">/</span>
            <span>{formatTimecode(totalDuration)}</span>
          </div>
        </div>

        {/* Center: AI Enhancement Indicator */}
        <div className="hidden md:flex items-center gap-2">
          {enhancement.enabled ? (
            <button
              onClick={() => setEnhancement(prev => ({ ...prev, splitView: !prev.splitView }))}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-fuchsia-500/15 border border-fuchsia-500/30 text-fuchsia-300 text-[11px] font-bold hover:bg-fuchsia-500/25 transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>AI 8K Enhanced: {enhancement.colorGrading.lut}</span>
              <span className="text-[9px] px-1 rounded bg-fuchsia-950 text-fuchsia-300">
                {enhancement.splitView ? 'Split View' : 'Full'}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setEnhancement(prev => ({ ...prev, enabled: true, splitView: true }))}
              className="text-xs text-zinc-500 hover:text-fuchsia-400 flex items-center gap-1 transition-colors"
            >
              <Zap className="w-3 h-3" />
              <span>Enable 8K AI Suite</span>
            </button>
          )}
        </div>

        {/* Right: Audio & Screen Controls */}
        <div className="flex items-center gap-3">
          {/* Playback Speed */}
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
            className="bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 font-mono rounded px-1.5 py-1 focus:outline-none"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1.0x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2.0x</option>
          </select>

          {/* Volume */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsMuted(prev => !prev)}
              className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-16 accent-cyan-400 h-1 bg-zinc-800 rounded hidden sm:inline-block"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
