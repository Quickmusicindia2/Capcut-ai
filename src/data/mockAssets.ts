import { SubscriptionPlan } from '../types/editor';

export interface StockVideo {
  id: string;
  title: string;
  category: 'Cyberpunk' | 'Nature' | 'Urban' | 'Tech' | 'Lifestyle';
  duration: number;
  resolution: string;
  thumbnail: string;
  videoUrl: string;
}

export interface StockAudio {
  id: string;
  title: string;
  artist: string;
  category: 'BGM' | 'SFX';
  duration: number;
  bpm?: number;
  audioUrl: string;
}

export const STOCK_VIDEOS: StockVideo[] = [
  {
    id: 'sv-1',
    title: 'Cyberpunk Neon Metropolis',
    category: 'Cyberpunk',
    duration: 8,
    resolution: '8K Ultra HD',
    thumbnail: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-traffic-and-buildings-at-night-42861-large.mp4'
  },
  {
    id: 'sv-2',
    title: 'Tokyo Street Lights Slow Motion',
    category: 'Cyberpunk',
    duration: 7,
    resolution: '8K Ultra HD',
    thumbnail: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tokyo-street-at-night-with-neon-lights-42862-large.mp4'
  },
  {
    id: 'sv-3',
    title: 'Alpine Peak Sunrise Flight',
    category: 'Nature',
    duration: 10,
    resolution: '8K Cinematic',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-mountain-range-in-winter-sunset-42898-large.mp4'
  },
  {
    id: 'sv-4',
    title: 'Emerald Ocean Rolling Waves',
    category: 'Nature',
    duration: 6,
    resolution: '4K UHD',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4'
  },
  {
    id: 'sv-5',
    title: 'Neural Matrix Data Flow',
    category: 'Tech',
    duration: 9,
    resolution: '8K HDR',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-code-31912-large.mp4'
  },
  {
    id: 'sv-6',
    title: 'High Tech HUD Interface',
    category: 'Tech',
    duration: 6,
    resolution: '4K UHD',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hud-interface-technology-elements-42894-large.mp4'
  },
  {
    id: 'sv-7',
    title: 'Urban Skater Girl Golden Hour',
    category: 'Lifestyle',
    duration: 7,
    resolution: '4K UHD',
    thumbnail: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-skater-moving-forward-in-the-city-42953-large.mp4'
  },
  {
    id: 'sv-8',
    title: 'Sparkler Night Magic Celebration',
    category: 'Lifestyle',
    duration: 5,
    resolution: '4K UHD',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-holding-a-sparkler-in-the-dark-42950-large.mp4'
  }
];

export const STOCK_AUDIOS: StockAudio[] = [
  {
    id: 'aud-1',
    title: 'Viral Phonk 2026 Beat',
    artist: 'AI Beatmaker Pro',
    category: 'BGM',
    duration: 30,
    bpm: 135,
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3'
  },
  {
    id: 'aud-2',
    title: 'Cinematic Ambient Swell 8K',
    artist: 'Horizon Orchestra',
    category: 'BGM',
    duration: 45,
    bpm: 90,
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-cinematic-mystery-suspense-hum-2852.mp3'
  },
  {
    id: 'aud-3',
    title: 'Lofi Chill Study Vibe',
    artist: 'Tokyo Midnight Beats',
    category: 'BGM',
    duration: 35,
    bpm: 85,
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-chill-bro-494.mp3'
  },
  {
    id: 'aud-4',
    title: 'Cyberpunk Drive Synthwave',
    artist: 'Neon Runner',
    category: 'BGM',
    duration: 40,
    bpm: 120,
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-games-world-beat-466.mp3'
  },
  {
    id: 'sfx-1',
    title: 'Fast Cinematic Whoosh Transition',
    artist: 'CapCut SFX Library',
    category: 'SFX',
    duration: 1.5,
    audioUrl: 'https://assets.mixkit.co/sfx/preview/mixkit-fast-whoosh-transition-1476.mp3'
  },
  {
    id: 'sfx-2',
    title: 'Sub Bass Impact Boom',
    artist: 'CapCut SFX Library',
    category: 'SFX',
    duration: 2.0,
    audioUrl: 'https://assets.mixkit.co/sfx/preview/mixkit-cinematic-mystery-suspense-hum-2852.mp3'
  },
  {
    id: 'sfx-3',
    title: 'Digital UI Camera Click',
    artist: 'CapCut SFX Library',
    category: 'SFX',
    duration: 0.8,
    audioUrl: 'https://assets.mixkit.co/sfx/preview/mixkit-modern-technology-select-3124.mp3'
  }
];

export interface VideoTemplate {
  id: string;
  title: string;
  category: 'TikTok / Reels' | 'Podcast' | 'Cinematic 8K' | 'Commercial' | 'Gaming';
  thumbnail: string;
  duration: number;
  aspectRatio: '9:16' | '16:9' | '1:1';
  description: string;
  clipsCount: number;
  sampleVideoUrl: string;
  defaultCaptions: {
    start: number;
    end: number;
    text: string;
    highlightWord: string;
    emoji: string;
    color: string;
  }[];
}

export const TEMPLATES_LIBRARY: VideoTemplate[] = [
  {
    id: 'tpl-1',
    title: 'Viral TikTok/Reels Hook & Rapid Cuts',
    category: 'TikTok / Reels',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    duration: 15,
    aspectRatio: '9:16',
    description: 'High-retention 3-second hook with Hormozi kinetic typography, neon accents, and bass-boosted transitions.',
    clipsCount: 3,
    sampleVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-skater-moving-forward-in-the-city-42953-large.mp4',
    defaultCaptions: [
      { start: 0.3, end: 3.0, text: 'STOP SCROLLING! Look at this AI tool 🚀', highlightWord: 'STOP', emoji: '🚀', color: '#FACC15' },
      { start: 3.2, end: 7.0, text: 'It automatically edits your videos in 8K! 🔥', highlightWord: '8K', emoji: '🔥', color: '#22C55E' },
      { start: 7.2, end: 11.0, text: 'Auto-captions with word-by-word bounce ⚡', highlightWord: 'Auto-captions', emoji: '⚡', color: '#06B6D4' },
      { start: 11.2, end: 14.8, text: 'Try CapCut AI Studio right now! 🎬', highlightWord: 'CapCut AI', emoji: '🎬', color: '#EC4899' }
    ]
  },
  {
    id: 'tpl-2',
    title: 'Podcast Talking Head & Multi-Lang Subtitles',
    category: 'Podcast',
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&auto=format&fit=crop&q=80',
    duration: 18,
    aspectRatio: '9:16',
    description: 'Perfect for Joe Rogan / Lex Fridman style interview clips with karaoke subtitles, audio waveform, and smart face centering.',
    clipsCount: 2,
    sampleVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-holding-a-sparkler-in-the-dark-42950-large.mp4',
    defaultCaptions: [
      { start: 0.5, end: 4.5, text: 'Ek baat hamesha yaad rakhna dost 💡', highlightWord: 'Hamesha', emoji: '💡', color: '#FACC15' },
      { start: 4.8, end: 9.0, text: 'Consistency is what separates the dreamers from achievers 🏆', highlightWord: 'Consistency', emoji: '🏆', color: '#22C55E' },
      { start: 9.2, end: 13.5, text: 'AI is not replacing you, but people using AI will! 🤖', highlightWord: 'AI', emoji: '🤖', color: '#3B82F6' },
      { start: 13.8, end: 17.5, text: 'Start mastering modern creative workflows today 📈', highlightWord: 'Today', emoji: '📈', color: '#A855F7' }
    ]
  },
  {
    id: 'tpl-3',
    title: 'Cinematic 8K Travel Vlog & Teal/Orange Grade',
    category: 'Cinematic 8K',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    duration: 16,
    aspectRatio: '16:9',
    description: 'Hollywood widescreen 16:9 with optical stabilization, anamorphic letterboxing, 8K remastering, and rich acoustic soundtrack.',
    clipsCount: 3,
    sampleVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-mountain-range-in-winter-sunset-42898-large.mp4',
    defaultCaptions: [
      { start: 0.5, end: 5.0, text: 'Lost in the majesty of the Swiss Alps 🏔️', highlightWord: 'Majesty', emoji: '🏔️', color: '#38BDF8' },
      { start: 5.3, end: 10.5, text: 'Captured in uncompressed 8K Ultra HDR 🌄', highlightWord: '8K Ultra HDR', emoji: '🌄', color: '#FB923C' },
      { start: 10.8, end: 15.5, text: 'Every peak whispers a timeless story ❄️', highlightWord: 'Timeless', emoji: '❄️', color: '#E2E8F0' }
    ]
  },
  {
    id: 'tpl-4',
    title: 'Cyberpunk 2026 Tech Launch & 3D Glow',
    category: 'Commercial',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    duration: 15,
    aspectRatio: '9:16',
    description: 'High-octane commercial product video with neon glows, RGB aberration transitions, and 8K neural sharpness.',
    clipsCount: 3,
    sampleVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-traffic-and-buildings-at-night-42861-large.mp4',
    defaultCaptions: [
      { start: 0.2, end: 3.5, text: 'The Future of Creative Intelligence is Here ⚡', highlightWord: 'Future', emoji: '⚡', color: '#06B6D4' },
      { start: 3.8, end: 7.5, text: 'Neural processing up to 8K resolution 🧬', highlightWord: '8K Resolution', emoji: '🧬', color: '#A855F7' },
      { start: 7.8, end: 11.5, text: 'Zero latency cloud GPU render farm 🚀', highlightWord: 'Cloud GPU', emoji: '🚀', color: '#10B981' },
      { start: 11.8, end: 14.8, text: 'Unlock your creative superpower 💥', highlightWord: 'Superpower', emoji: '💥', color: '#F43F5E' }
    ]
  }
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free Starter',
    price: '$0',
    billing: 'Forever free',
    description: 'Essential AI video editing tools for casual social media creators.',
    maxResolution: '1080p',
    features: [
      'Export up to 1080p FHD (30fps)',
      '5 AI Text-to-Video generations / day',
      'Standard Auto-captions (English only)',
      'Basic Drag-and-Drop Multitrack Timeline',
      '10GB Cloud Storage',
      'Standard Render Queue'
    ],
    cloudStorage: '10 GB',
    aiGenerationsPerDay: 5,
    priorityGpu: false
  },
  {
    id: 'pro',
    name: 'Pro Creator',
    price: '$19',
    billing: 'per month',
    badge: 'Most Popular',
    description: 'For growing creators, YouTubers, and social agencies needing speed and power.',
    maxResolution: '4K',
    features: [
      'Export up to 4K UHD 60fps',
      '50 AI Text-to-Video generations / day',
      'Multi-Language Auto-Captions (20+ languages)',
      'AI Denoising & Video Stabilization',
      'Full VIP Templates Library',
      '500GB Fast Cloud Storage',
      'Fast Cloud GPU Processing',
      'No Watermark & Commercial License'
    ],
    cloudStorage: '500 GB',
    aiGenerationsPerDay: 50,
    priorityGpu: false
  },
  {
    id: 'ultra',
    name: 'Studio Ultra 8K',
    price: '$49',
    billing: 'per month',
    badge: 'Ultimate Power',
    description: 'For professional studios, filmmakers, and elite content creators demanding 8K master quality.',
    maxResolution: '8K',
    features: [
      'Export up to 8K Ultra HD (7680x4320) 60fps',
      'Apple ProRes 422 HQ & H.265 Master Codecs',
      'Unlimited AI Text-to-Video generation',
      'Unlimited Multi-Language Auto-Captions with Kinetic Word Pop',
      'Full AI Enhancement Suite (Auto Color Grade, Temporal Denoise, Optical Flow Stabilization, 8K Neural Upscaling)',
      'Dedicated NVIDIA H100 Cloud GPU Priority Cluster',
      '2TB High-Speed NVMe Cloud Storage',
      'Priority 24/7 VIP Concierge & Team Collaboration'
    ],
    cloudStorage: '2 TB',
    aiGenerationsPerDay: 'Unlimited',
    priorityGpu: true
  }
];

export const COLOR_LUTS = [
  { id: 'lut-none', name: 'Original (Neutral)', filterString: 'none', temp: 6500, contrast: 1.0, sat: 1.0 },
  { id: 'lut-teal-orange', name: 'Teal & Orange Hollywood', filterString: 'contrast(1.2) saturate(1.3) hue-rotate(-8deg) brightness(1.05)', temp: 6200, contrast: 1.2, sat: 1.3 },
  { id: 'lut-cyberpunk', name: 'Cyberpunk Neon Glow', filterString: 'contrast(1.35) saturate(1.55) hue-rotate(15deg) brightness(1.02)', temp: 7500, contrast: 1.35, sat: 1.55 },
  { id: 'lut-golden', name: 'Golden Hour Sunset', filterString: 'contrast(1.15) saturate(1.35) sepia(0.2) brightness(1.08)', temp: 5200, contrast: 1.15, sat: 1.35 },
  { id: 'lut-hdr-8k', name: '8K HDR Master Vivid', filterString: 'contrast(1.25) saturate(1.4) brightness(1.03)', temp: 6400, contrast: 1.25, sat: 1.4 },
  { id: 'lut-noir', name: 'Cinematic Film Noir', filterString: 'grayscale(1) contrast(1.45) brightness(0.95)', temp: 6500, contrast: 1.45, sat: 0.0 },
  { id: 'lut-vintage', name: 'Vintage 90s Camcorder', filterString: 'sepia(0.35) contrast(1.1) saturate(1.2) brightness(1.05)', temp: 5800, contrast: 1.1, sat: 1.2 }
];
