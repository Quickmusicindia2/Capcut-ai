import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Player } from './components/Player';
import { Timeline } from './components/Timeline';
import { MobileBottomBar } from './components/MobileBottomBar';
import { MediaPanel } from './components/panels/MediaPanel';
import { TextToVideoPanel } from './components/panels/TextToVideoPanel';
import { CaptionsPanel } from './components/panels/CaptionsPanel';
import { EnhancePanel } from './components/panels/EnhancePanel';
import { TemplatesPanel } from './components/panels/TemplatesPanel';
import { AudioPanel } from './components/panels/AudioPanel';
import { TextPanel } from './components/panels/TextPanel';
import { CloudQueuePanel } from './components/panels/CloudQueuePanel';
import { NetlifyDeployPanel } from './components/panels/NetlifyDeployPanel';
import { ExportModal } from './components/ExportModal';
import { PricingModal } from './components/PricingModal';
import { 
  AspectRatio, 
  CaptionItem, 
  EnhancementProfile, 
  SubscriptionPlan, 
  TimelineClip, 
  TimelineTrack 
} from './types/editor';
import { SUBSCRIPTION_PLANS, TEMPLATES_LIBRARY, STOCK_VIDEOS } from './data/mockAssets';
import { X } from 'lucide-react';

export default function App() {
  // Project settings
  const [projectName, setProjectName] = useState('Cyberpunk Tokyo - 8K Remaster');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [activePlan, setActivePlan] = useState<SubscriptionPlan>(SUBSCRIPTION_PLANS[2]); // Studio Ultra 8K
  
  // Navigation & Drawer
  const [activeTab, setActiveTab] = useState<ActiveTab>('enhance');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Closed initially on mobile so video player & timeline are immediately visible

  // Modals
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [cloudQueueCount, setCloudQueueCount] = useState(1);

  // Playhead & Transport
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>('clip-init-1');

  // Initial Captions
  const [captions, setCaptions] = useState<CaptionItem[]>([
    { id: 'c-1', start: 0.5, end: 3.5, text: 'RUKO! Kya aapne ye dekha? 🚀', highlightWord: 'RUKO!', emoji: '🚀', color: '#FACC15' },
    { id: 'c-2', start: 3.8, end: 7.2, text: 'CapCut AI se video editing ab hui aasan 🔥', highlightWord: 'CapCut', emoji: '🔥', color: '#22C55E' },
    { id: 'c-3', start: 7.5, end: 11.0, text: 'AI Optical Flow & 8K Neural Remastering 🎬', highlightWord: '8K Neural', emoji: '🎬', color: '#06B6D4' },
    { id: 'c-4', start: 11.3, end: 14.8, text: 'Auto-captions in 20+ languages instantly ⚡', highlightWord: 'Auto-captions', emoji: '⚡', color: '#EC4899' }
  ]);

  // AI Video Enhancement Profile (Auto Color Grade, Denoise, Stabilize, 8K Upscale)
  const [enhancement, setEnhancement] = useState<EnhancementProfile>({
    enabled: true,
    splitView: true,
    splitPosition: 50,
    colorGrading: {
      enabled: true,
      lut: 'Teal & Orange Hollywood',
      temperature: 6300,
      contrast: 1.2,
      saturation: 1.3,
      vibrance: 50,
      exposure: 0.1,
      highlights: 0,
      shadows: 0
    },
    noiseReduction: {
      enabled: true,
      spatialDenoise: 85,
      temporalDenoise: 90,
      lowLightBoost: true,
      grainPreservation: 20
    },
    stabilization: {
      enabled: true,
      smoothness: 88,
      cropBuffer: 5,
      rollingShutterFix: true,
      horizonLeveler: true
    },
    upscaling8K: {
      enabled: true,
      targetResolution: '8K',
      neuralSharpness: 85,
      hdrBoost: 80,
      model: 'Cinematic-Master-8K'
    }
  });

  // Multitrack Timeline Tracks
  const [tracks, setTracks] = useState<TimelineTrack[]>([
    {
      id: 'track-caption',
      type: 'caption',
      name: 'Subtitles',
      clips: [
        { id: 'clip-cap-1', trackId: 'track-caption', type: 'caption', title: 'RUKO! Kya aapne ye dekha? 🚀', startTime: 0.5, duration: 3.0 },
        { id: 'clip-cap-2', trackId: 'track-caption', type: 'caption', title: 'CapCut AI Editing 🔥', startTime: 3.8, duration: 3.4 },
        { id: 'clip-cap-3', trackId: 'track-caption', type: 'caption', title: '8K Neural Remastering 🎬', startTime: 7.5, duration: 3.5 },
        { id: 'clip-cap-4', trackId: 'track-caption', type: 'caption', title: 'Auto-captions instantly ⚡', startTime: 11.3, duration: 3.5 }
      ]
    },
    {
      id: 'track-text',
      type: 'text',
      name: 'Titles & Text',
      clips: [
        {
          id: 'clip-txt-1',
          trackId: 'track-text',
          type: 'text',
          title: 'VIRAL 8K MASTER',
          text: 'VIRAL 8K MASTER',
          startTime: 1.0,
          duration: 4.5,
          captionColor: '#06B6D4'
        }
      ]
    },
    {
      id: 'track-overlay',
      type: 'overlay',
      name: 'Overlay',
      clips: []
    },
    {
      id: 'track-video',
      type: 'video',
      name: 'Main Video',
      clips: [
        {
          id: 'clip-init-1',
          trackId: 'track-video',
          type: 'video',
          title: 'Tokyo Neon Street Slow Motion',
          startTime: 0,
          duration: 7,
          sourceUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tokyo-street-at-night-with-neon-lights-42862-large.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
          volume: 1,
          filter: 'Teal & Orange Hollywood'
        },
        {
          id: 'clip-init-2',
          trackId: 'track-video',
          type: 'video',
          title: 'Cyberpunk Metropolis Traffic 8K',
          startTime: 7,
          duration: 8,
          sourceUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-traffic-and-buildings-at-night-42861-large.mp4',
          thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80',
          volume: 1,
          filter: '8K HDR Master Vivid'
        }
      ]
    },
    {
      id: 'track-audio',
      type: 'audio',
      name: 'BGM Beat',
      clips: [
        {
          id: 'clip-aud-1',
          trackId: 'track-audio',
          type: 'audio',
          title: 'Viral Phonk 2026 Beat',
          startTime: 0,
          duration: 15,
          sourceUrl: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
          volume: 0.8
        }
      ]
    }
  ]);

  // Calculate total duration from the longest clip across all tracks
  const totalDuration = Math.max(
    15,
    ...tracks.flatMap(t => t.clips.map(c => c.startTime + c.duration))
  );

  // Undo / Redo history stacks
  const [history, setHistory] = useState<TimelineTrack[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveToHistory = (newTracks: TimelineTrack[]) => {
    const updated = history.slice(0, historyIndex + 1);
    updated.push(JSON.parse(JSON.stringify(newTracks)));
    setHistory(updated);
    setHistoryIndex(updated.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setTracks(JSON.parse(JSON.stringify(history[historyIndex - 1])));
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setTracks(JSON.parse(JSON.stringify(history[historyIndex + 1])));
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Add Clip to timeline
  const handleAddClip = (clip: TimelineClip) => {
    saveToHistory(tracks);
    setTracks(prev => prev.map(t => {
      if (t.id === clip.trackId) {
        const lastEndTime = t.clips.reduce((max, c) => Math.max(max, c.startTime + c.duration), 0);
        const adjustedClip = { ...clip, startTime: lastEndTime };
        return {
          ...t,
          clips: [...t.clips, adjustedClip]
        };
      }
      return t;
    }));
    setSelectedClipId(clip.id);
  };

  // Add multiple clips
  const handleAddMultipleClips = (newClips: TimelineClip[]) => {
    saveToHistory(tracks);
    setTracks(prev => prev.map(t => {
      if (t.id === 'track-video') {
        const lastEndTime = t.clips.reduce((max, c) => Math.max(max, c.startTime + c.duration), 0);
        let offset = lastEndTime;
        const offsetClips = newClips.map(c => {
          const res = { ...c, startTime: offset };
          offset += c.duration;
          return res;
        });
        return {
          ...t,
          clips: [...t.clips, ...offsetClips]
        };
      }
      return t;
    }));
  };

  // Sync captions to track
  const handleApplyCaptionsToTrack = (newCaptions: CaptionItem[]) => {
    saveToHistory(tracks);
    const captionClips: TimelineClip[] = newCaptions.map((c, i) => ({
      id: `cap-clip-${c.id || i}`,
      trackId: 'track-caption',
      type: 'caption',
      title: c.text,
      startTime: c.start,
      duration: Math.max(1, c.end - c.start)
    }));

    setTracks(prev => prev.map(t => {
      if (t.id === 'track-caption') {
        return { ...t, clips: captionClips };
      }
      return t;
    }));
  };

  // 1-Click Template Apply
  const handleApplyTemplate = (tpl: typeof TEMPLATES_LIBRARY[0]) => {
    saveToHistory(tracks);
    setProjectName(tpl.title);
    setAspectRatio(tpl.aspectRatio as AspectRatio);

    const newCaps: CaptionItem[] = tpl.defaultCaptions.map((dc, i) => ({
      id: `tpl-cap-${i}`,
      start: dc.start,
      end: dc.end,
      text: dc.text,
      highlightWord: dc.highlightWord,
      emoji: dc.emoji,
      color: dc.color
    }));
    setCaptions(newCaps);

    const videoClips: TimelineClip[] = [
      {
        id: `tpl-v-1`,
        trackId: 'track-video',
        type: 'video',
        title: `${tpl.category} Scene 1`,
        startTime: 0,
        duration: Math.round(tpl.duration / 2),
        sourceUrl: tpl.sampleVideoUrl,
        thumbnail: tpl.thumbnail,
        volume: 1
      },
      {
        id: `tpl-v-2`,
        trackId: 'track-video',
        type: 'video',
        title: `${tpl.category} Climax 8K`,
        startTime: Math.round(tpl.duration / 2),
        duration: Math.round(tpl.duration / 2),
        sourceUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-traffic-and-buildings-at-night-42861-large.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80',
        volume: 1
      }
    ];

    const captionClips: TimelineClip[] = newCaps.map((c, idx) => ({
      id: `tpl-clip-${idx}`,
      trackId: 'track-caption',
      type: 'caption',
      title: c.text,
      startTime: c.start,
      duration: Math.max(1, c.end - c.start)
    }));

    setTracks(prev => prev.map(t => {
      if (t.id === 'track-video') return { ...t, clips: videoClips };
      if (t.id === 'track-caption') return { ...t, clips: captionClips };
      return t;
    }));

    setCurrentTime(0);
    setIsDrawerOpen(false); // Close drawer to show result on timeline
  };

  // Timeline operations
  const handleSplitClip = () => {
    saveToHistory(tracks);
    setTracks(prev => prev.map(track => {
      const clipToSplit = track.clips.find(
        c => currentTime > c.startTime && currentTime < c.startTime + c.duration
      );

      if (clipToSplit) {
        const firstPartDur = currentTime - clipToSplit.startTime;
        const secondPartDur = clipToSplit.duration - firstPartDur;

        const firstPart: TimelineClip = {
          ...clipToSplit,
          duration: firstPartDur
        };

        const secondPart: TimelineClip = {
          ...clipToSplit,
          id: `clip-split-${Date.now()}`,
          startTime: currentTime,
          duration: secondPartDur
        };

        return {
          ...track,
          clips: track.clips.flatMap(c => c.id === clipToSplit.id ? [firstPart, secondPart] : [c])
        };
      }
      return track;
    }));
  };

  const handleDeleteClip = () => {
    if (!selectedClipId) return;
    saveToHistory(tracks);
    setTracks(prev => prev.map(t => ({
      ...t,
      clips: t.clips.filter(c => c.id !== selectedClipId)
    })));
    setSelectedClipId(null);
  };

  const handleDuplicateClip = () => {
    if (!selectedClipId) return;
    saveToHistory(tracks);

    setTracks(prev => prev.map(t => {
      const clip = t.clips.find(c => c.id === selectedClipId);
      if (clip) {
        const duplicated: TimelineClip = {
          ...clip,
          id: `clip-dup-${Date.now()}`,
          startTime: clip.startTime + clip.duration + 0.5
        };
        return {
          ...t,
          clips: [...t.clips, duplicated]
        };
      }
      return t;
    }));
  };

  // Keyboard hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleSplitClip();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        handleDeleteClip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentTime, selectedClipId, tracks]);

  const handlePreviewSource = (url: string) => {
    const previewClip: TimelineClip = {
      id: `preview-${Date.now()}`,
      trackId: 'track-video',
      type: 'video',
      title: 'Preview Video Asset',
      startTime: currentTime,
      duration: 6,
      sourceUrl: url,
      volume: 1
    };
    handleAddClip(previewClip);
  };

  const renderActiveDrawerContent = () => {
    switch (activeTab) {
      case 'media':
        return <MediaPanel onAddClip={handleAddClip} onPreviewSource={handlePreviewSource} />;
      case 'text-to-video':
        return <TextToVideoPanel onAddClips={handleAddMultipleClips} onPreviewSource={handlePreviewSource} />;
      case 'captions':
        return (
          <CaptionsPanel
            captions={captions}
            setCaptions={setCaptions}
            onApplyCaptionsToTrack={handleApplyCaptionsToTrack}
            videoDuration={totalDuration}
          />
        );
      case 'enhance':
        return (
          <EnhancePanel
            enhancement={enhancement}
            setEnhancement={setEnhancement}
            activeClipTitle={projectName}
          />
        );
      case 'templates':
        return <TemplatesPanel onApplyTemplate={handleApplyTemplate} onPreviewSource={handlePreviewSource} />;
      case 'audio':
        return <AudioPanel onAddAudioClip={handleAddClip} />;
      case 'text':
        return <TextPanel onAddTextClip={handleAddClip} />;
      case 'cloud-queue':
        return <CloudQueuePanel onOpenExport={() => setIsExportOpen(true)} />;
      case 'netlify':
        return <NetlifyDeployPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-zinc-950 text-white overflow-hidden select-none font-sans">
      {/* 1. Mobile & Desktop Responsive Header */}
      <Header
        projectName={projectName}
        setProjectName={setProjectName}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        activePlan={activePlan}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenNetlify={() => {
          setActiveTab('netlify');
          setIsDrawerOpen(true);
        }}
        cloudQueueCount={cloudQueueCount}
        onOpenCloudQueue={() => {
          setActiveTab('cloud-queue');
          setIsDrawerOpen(true);
        }}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />

      {/* 2. Middle Body: Mobile Viewport vs Desktop Dual Layout */}
      <div className="flex-1 flex overflow-hidden relative min-h-0">
        {/* Desktop Sidebar (hidden on mobile) */}
        <div className="hidden md:flex">
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isOpen={isDrawerOpen}
            setIsOpen={setIsDrawerOpen}
          />
        </div>

        {/* Desktop Side Drawer (hidden on mobile, on mobile it slides as bottom sheet) */}
        {isDrawerOpen && (
          <div className="hidden md:flex w-80 lg:w-96 bg-zinc-950 border-r border-zinc-800 flex-col shrink-0 z-20 animate-in slide-in-from-left-2 duration-200">
            {renderActiveDrawerContent()}
          </div>
        )}

        {/* Video Canvas Player (Always visible in top half on mobile!) */}
        <div className="flex-1 flex flex-col min-h-0 relative">
          <Player
            tracks={tracks}
            captions={captions}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            totalDuration={totalDuration}
            aspectRatio={aspectRatio}
            enhancement={enhancement}
            setEnhancement={setEnhancement}
          />
        </div>

        {/* Mobile Bottom Sheet Drawer (Slides up from bottom over timeline on mobile screens) */}
        {isDrawerOpen && (
          <div className="md:hidden absolute inset-x-0 bottom-14 top-20 bg-zinc-950/98 backdrop-blur-xl border-t border-zinc-700/80 rounded-t-3xl z-40 flex flex-col shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
            {/* Drag handle & close header */}
            <div className="pt-2 pb-1.5 px-4 flex items-center justify-between border-b border-zinc-800/80 shrink-0">
              <div className="w-8" />
              <div className="w-10 h-1 bg-zinc-700 rounded-full" />
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tool Content in Bottom Sheet */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {renderActiveDrawerContent()}
            </div>
          </div>
        )}
      </div>

      {/* 3. Bottom Multitrack Timeline (Always docked below player on mobile) */}
      <Timeline
        tracks={tracks}
        setTracks={setTracks}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        totalDuration={totalDuration}
        selectedClipId={selectedClipId}
        setSelectedClipId={setSelectedClipId}
        onSplitClip={handleSplitClip}
        onDeleteClip={handleDeleteClip}
        onDuplicateClip={handleDuplicateClip}
      />

      {/* 4. Mobile Bottom Toolbar (CapCut Mobile Signature Dock) */}
      <MobileBottomBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />

      {/* 5. Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        projectName={projectName}
        activePlan={activePlan}
        onJobCreated={() => setCloudQueueCount(prev => prev + 1)}
      />

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        activePlan={activePlan}
        setActivePlan={setActivePlan}
      />
    </div>
  );
}
