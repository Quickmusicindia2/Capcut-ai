export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5';

export type Resolution = '720p' | '1080p' | '4K' | '8K';

export type TrackType = 'video' | 'overlay' | 'audio' | 'caption' | 'text';

export interface TimelineClip {
  id: string;
  trackId: string;
  type: TrackType;
  title: string;
  startTime: number; // in seconds on timeline
  duration: number; // in seconds
  sourceUrl?: string;
  thumbnail?: string;
  color?: string;
  // Video & Visual properties
  volume?: number;
  filter?: string;
  speed?: number;
  trimStart?: number;
  // Text & Caption properties
  text?: string;
  captionHighlight?: string;
  captionEmoji?: string;
  captionColor?: string;
  fontSize?: number;
  fontFamily?: string;
}

export interface TimelineTrack {
  id: string;
  type: TrackType;
  name: string;
  isMuted?: boolean;
  isLocked?: boolean;
  clips: TimelineClip[];
}

export interface CaptionItem {
  id: string;
  start: number;
  end: number;
  text: string;
  originalText?: string;
  highlightWord?: string;
  emoji?: string;
  color?: string;
}

export interface EnhancementProfile {
  enabled: boolean;
  splitView: boolean; // Before / After interactive split
  splitPosition: number; // 0 to 100%
  // 1. Automatic Color Grading
  colorGrading: {
    enabled: boolean;
    lut: string; // e.g. 'Teal & Orange', 'Cyberpunk Neon', 'Golden Hour'
    temperature: number; // 3000 to 9000K, default 6500
    contrast: number; // 0.8 to 1.5, default 1.15
    saturation: number; // 0.8 to 1.8, default 1.2
    vibrance: number; // 0 to 100, default 40
    exposure: number; // -2 to +2, default 0.2
    highlights: number; // -50 to +50
    shadows: number; // -50 to +50
  };
  // 2. AI Noise Reduction
  noiseReduction: {
    enabled: boolean;
    spatialDenoise: number; // 0 to 100
    temporalDenoise: number; // 0 to 100
    lowLightBoost: boolean;
    grainPreservation: number; // 0 to 50
  };
  // 3. AI Video Stabilization
  stabilization: {
    enabled: boolean;
    smoothness: number; // 0 to 100
    cropBuffer: number; // 0 to 20%
    rollingShutterFix: boolean;
    horizonLeveler: boolean;
  };
  // 4. AI 8K Neural Upscaling
  upscaling8K: {
    enabled: boolean;
    targetResolution: Resolution;
    neuralSharpness: number; // 0 to 100
    hdrBoost: number; // 0 to 100
    model: 'Neural-GAN-8K' | 'Spatial-Tensor-Ultra' | 'Cinematic-Master-8K';
  };
}

export interface RenderJob {
  id: string;
  projectName: string;
  resolution: Resolution;
  codec: string;
  fps: number;
  quality: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentStage: string;
  gpuNode: string;
  createdAt: number;
  completedAt?: number;
  downloadUrl?: string;
  fileSizeMb?: number;
}

export interface SubscriptionPlan {
  id: 'free' | 'pro' | 'ultra';
  name: string;
  price: string;
  billing: string;
  badge?: string;
  description: string;
  maxResolution: Resolution;
  features: string[];
  cloudStorage: string;
  aiGenerationsPerDay: number | 'Unlimited';
  priorityGpu: boolean;
}
