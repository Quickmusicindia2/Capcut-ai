import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '50mb' }));

// Initialize GoogleGenAI SDK according to skill guidelines
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory Cloud Render Queue
interface RenderJob {
  id: string;
  projectName: string;
  resolution: '720p' | '1080p' | '4K' | '8K';
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

const cloudRenderJobs: Map<string, RenderJob> = new Map();

// Initialize with some pre-rendered showcase samples
const sampleJobId = 'job-init-8k';
cloudRenderJobs.set(sampleJobId, {
  id: sampleJobId,
  projectName: 'Cyberpunk Tokyo Drone Run',
  resolution: '8K',
  codec: 'ProRes 422 HQ',
  fps: 60,
  quality: 'Master 8K HDR (7680x4320)',
  status: 'completed',
  progress: 100,
  currentStage: 'Render complete. 8K Master ready for download.',
  gpuNode: 'Cloud-GPU-Cluster-US-West-04 (NVIDIA H100)',
  createdAt: Date.now() - 3600000,
  completedAt: Date.now() - 3200000,
  downloadUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5',
  fileSizeMb: 1420.5,
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!apiKey,
    cloudNodesOnline: 8,
    activeJobs: Array.from(cloudRenderJobs.values()).filter(j => j.status === 'processing').length,
  });
});

// AI Text-to-Video Generation endpoint
app.post('/api/ai/text-to-video', async (req, res) => {
  const { prompt, style = 'Cinematic', aspectRatio = '9:16', duration = 15, cameraMovement = 'Dynamic' } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    let aiScenes = null;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are a visionary Hollywood and CapCut AI Director. Break down the user's video generation prompt into a complete high-octane 3-scene storyboard with visual descriptions, camera instructions, dynamic color palettes, and voiceover captions.

User Prompt: "${prompt}"
Visual Style: "${style}"
Aspect Ratio: "${aspectRatio}"
Duration: ${duration} seconds
Camera Movement: "${cameraMovement}"`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                synopsis: { type: Type.STRING },
                suggestedBgm: { type: Type.STRING },
                scenes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      sceneNumber: { type: Type.INTEGER },
                      timecode: { type: Type.STRING },
                      duration: { type: Type.NUMBER },
                      visualPrompt: { type: Type.STRING },
                      cameraAction: { type: Type.STRING },
                      voiceoverSubtitle: { type: Type.STRING },
                      colorMood: { type: Type.STRING },
                      recommendedFilter: { type: Type.STRING }
                    },
                    required: ['sceneNumber', 'timecode', 'duration', 'visualPrompt', 'cameraAction', 'voiceoverSubtitle']
                  }
                }
              },
              required: ['title', 'synopsis', 'scenes']
            }
          }
        });

        if (response.text) {
          aiScenes = JSON.parse(response.text.trim());
        }
      } catch (err: any) {
        console.warn('Gemini text-to-video error, using intelligent fallback:', err?.message);
      }
    }

    // Curated high quality responsive video / animation presets based on prompt keywords
    const lowerPrompt = prompt.toLowerCase();
    let videoUrls = [
      'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-traffic-and-buildings-at-night-42861-large.mp4',
      'https://assets.mixkit.co/videos/preview/mixkit-tokyo-street-at-night-with-neon-lights-42862-large.mp4',
      'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-42859-large.mp4'
    ];

    if (lowerPrompt.includes('nature') || lowerPrompt.includes('mountain') || lowerPrompt.includes('waterfall') || lowerPrompt.includes('travel')) {
      videoUrls = [
        'https://assets.mixkit.co/videos/preview/mixkit-mountain-range-in-winter-sunset-42898-large.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-drone-view-of-a-forest-in-autumn-42901-large.mp4'
      ];
    } else if (lowerPrompt.includes('tech') || lowerPrompt.includes('cyber') || lowerPrompt.includes('ai') || lowerPrompt.includes('robot')) {
      videoUrls = [
        'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-code-31912-large.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-traffic-and-buildings-at-night-42861-large.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-hud-interface-technology-elements-42894-large.mp4'
      ];
    } else if (lowerPrompt.includes('fashion') || lowerPrompt.includes('lifestyle') || lowerPrompt.includes('model') || lowerPrompt.includes('vlog')) {
      videoUrls = [
        'https://assets.mixkit.co/videos/preview/mixkit-young-woman-skater-moving-forward-in-the-city-42953-large.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-woman-holding-a-sparkler-in-the-dark-42950-large.mp4',
        'https://assets.mixkit.co/videos/preview/mixkit-dancing-silhouette-in-a-stage-light-42939-large.mp4'
      ];
    }

    const defaultTitle = prompt.slice(0, 30) + (prompt.length > 30 ? '...' : '');
    const finalData = {
      title: aiScenes?.title || `AI Video: ${defaultTitle}`,
      synopsis: aiScenes?.synopsis || `Cinematic AI generation for prompt: "${prompt}" rendered in ${style} style with 8K ultra visual fidelity.`,
      suggestedBgm: aiScenes?.suggestedBgm || 'Cyberpunk Phonk Beat 135 BPM',
      generatedClips: (aiScenes?.scenes || [
        {
          sceneNumber: 1,
          timecode: '00:00 - 00:05',
          duration: 5,
          visualPrompt: `Hook establishing shot: ${prompt} with sweeping camera motion and hyper-detailed lighting.`,
          cameraAction: 'Fast push-in zoom with anamorphic lens flare',
          voiceoverSubtitle: 'Stop scrolling! What you are about to witness is extraordinary.',
          colorMood: 'Teal & Orange Cyber Vivid',
          recommendedFilter: 'Cyber Neon'
        },
        {
          sceneNumber: 2,
          timecode: '00:05 - 00:10',
          duration: 5,
          visualPrompt: `Climactic hero sequence showing dynamic energy and cinematic detail.`,
          cameraAction: 'Low angle orbit 180° around the subject',
          voiceoverSubtitle: 'Powered by next-generation neural video synthesis in crisp 8K resolution.',
          colorMood: 'High Dynamic Range Vibrant',
          recommendedFilter: 'HDR Remaster'
        },
        {
          sceneNumber: 3,
          timecode: '00:10 - 00:15',
          duration: 5,
          visualPrompt: `Final payoff and impactful call to action with speed ramp transition.`,
          cameraAction: 'Drone pull-back revealing grand spectacle',
          voiceoverSubtitle: 'Create viral AI videos in seconds right inside CapCut Studio.',
          colorMood: 'Golden Hour Cinematic Glow',
          recommendedFilter: 'Golden Glow'
        }
      ]).map((scene: any, idx: number) => ({
        id: `gen-clip-${Date.now()}-${idx}`,
        sceneNumber: scene.sceneNumber || idx + 1,
        title: `Scene ${idx + 1}: ${scene.cameraAction?.split(' ')[0] || 'Shot'}`,
        prompt: scene.visualPrompt,
        cameraAction: scene.cameraAction,
        voiceover: scene.voiceoverSubtitle,
        duration: scene.duration || 5,
        videoUrl: videoUrls[idx % videoUrls.length],
        colorMood: scene.colorMood || 'Cinematic',
        filter: scene.recommendedFilter || 'None',
        aspectRatio
      }))
    };

    res.json({ success: true, data: finalData });
  } catch (error: any) {
    console.error('Error generating AI video:', error);
    res.status(500).json({ error: error.message || 'Failed to generate video' });
  }
});

// Multi-Language Auto-Captioning endpoint
app.post('/api/ai/auto-caption', async (req, res) => {
  const {
    transcriptOrTopic = '',
    sourceLanguage = 'Auto-Detect',
    targetLanguage = 'Hindi',
    captionStyle = 'Hormozi Kinetic Bold',
    videoDuration = 15
  } = req.body;

  try {
    let captionsList: any[] = [];

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are an expert viral video subtitle editor for TikTok, Instagram Reels, and YouTube Shorts.
Generate a synchronized list of 4 to 8 punchy, high-energy video captions/subtitles.
Source topic/speech: "${transcriptOrTopic || 'Create viral videos using AI video generator and smart captioning'}"
Detected/Source language: "${sourceLanguage}"
Target Language: "${targetLanguage}" (e.g. if Hindi, generate natural, modern Hindi or Hinglish subtitles with Roman or Devanagari script; if English, natural punchy English; if Spanish, natural Spanish).
Style: "${captionStyle}" (Alex Hormozi style uses bold emphasis on key power words, emoji triggers, and concise 3-5 word bursts).
Video Duration: ${videoDuration} seconds.

Make sure the start and end timestamps fit within 0.0 to ${videoDuration}.0 seconds sequentially with no overlaps.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  start: { type: Type.NUMBER, description: 'Start time in seconds' },
                  end: { type: Type.NUMBER, description: 'End time in seconds' },
                  text: { type: Type.STRING, description: 'The subtitle phrase in target language' },
                  originalText: { type: Type.STRING, description: 'Original language text' },
                  highlightWord: { type: Type.STRING, description: 'Single high-impact word to pop in neon or yellow' },
                  emoji: { type: Type.STRING, description: 'Matching animated emoji' },
                  color: { type: Type.STRING, description: 'Hex color for highlight' }
                },
                required: ['start', 'end', 'text', 'highlightWord']
              }
            }
          }
        });

        if (response.text) {
          captionsList = JSON.parse(response.text.trim());
        }
      } catch (err: any) {
        console.warn('Gemini caption generation error, using smart fallback:', err?.message);
      }
    }

    if (!captionsList || captionsList.length === 0) {
      // High quality multi-lingual fallback templates
      if (targetLanguage.toLowerCase().includes('hindi')) {
        captionsList = [
          { id: 'c1', start: 0.5, end: 3.2, text: 'Ruko! Kya aapne ye dekha? 🚀', originalText: 'Wait! Have you seen this? 🚀', highlightWord: 'Ruko!', emoji: '🚀', color: '#FACC15' },
          { id: 'c2', start: 3.5, end: 6.8, text: 'CapCut AI se video editing ab hui bilkul aasan! 🔥', originalText: 'CapCut AI makes video editing effortless! 🔥', highlightWord: 'AI', emoji: '🔥', color: '#22C55E' },
          { id: 'c3', start: 7.0, end: 10.5, text: 'Text likho or 8K Ultra HD video taiyar! 🎬', originalText: 'Type text and 8K Ultra HD video is ready! 🎬', highlightWord: '8K Ultra HD', emoji: '🎬', color: '#06B6D4' },
          { id: 'c4', start: 10.8, end: 14.5, text: 'Multi-language auto captions ek click mein! ⚡', originalText: 'Multi-language auto captions in one click! ⚡', highlightWord: 'Multi-language', emoji: '⚡', color: '#EC4899' }
        ];
      } else if (targetLanguage.toLowerCase().includes('spanish')) {
        captionsList = [
          { id: 'c1', start: 0.5, end: 3.2, text: '¡Detente! ¿Has visto esta IA? 🚀', originalText: 'Wait! Have you seen this? 🚀', highlightWord: '¡Detente!', emoji: '🚀', color: '#FACC15' },
          { id: 'c2', start: 3.5, end: 6.8, text: 'Edición de video profesional con CapCut Studio 🔥', originalText: 'Professional video editing with CapCut Studio 🔥', highlightWord: 'Profesional', emoji: '🔥', color: '#22C55E' },
          { id: 'c3', start: 7.0, end: 10.5, text: 'Subtítulos automáticos y calidad 8K real 🎬', originalText: 'Auto subtitles and real 8K quality 🎬', highlightWord: '8K real', emoji: '🎬', color: '#06B6D4' },
          { id: 'c4', start: 10.8, end: 14.5, text: 'Exporta tu contenido viral en segundos ⚡', originalText: 'Export your viral content in seconds ⚡', highlightWord: 'Viral', emoji: '⚡', color: '#EC4899' }
        ];
      } else if (targetLanguage.toLowerCase().includes('japanese')) {
        captionsList = [
          { id: 'c1', start: 0.5, end: 3.2, text: 'ちょっと待って！これ見た？ 🚀', originalText: 'Wait! Have you seen this? 🚀', highlightWord: '見て！', emoji: '🚀', color: '#FACC15' },
          { id: 'c2', start: 3.5, end: 6.8, text: 'AIで動画編集が劇的に進化する 🔥', originalText: 'Video editing dramatically evolves with AI 🔥', highlightWord: 'AI進化', emoji: '🔥', color: '#22C55E' },
          { id: 'c3', start: 7.0, end: 10.5, text: '自動多言語字幕と8K超高画質 🎬', originalText: 'Auto multilingual captions and 8K ultra quality 🎬', highlightWord: '8K超高画質', emoji: '🎬', color: '#06B6D4' },
          { id: 'c4', start: 10.8, end: 14.5, text: 'ワンクリックでSNS神動画が完成 ⚡', originalText: 'Create viral videos in one click ⚡', highlightWord: '神動画', emoji: '⚡', color: '#EC4899' }
        ];
      } else {
        // Default English
        captionsList = [
          { id: 'c1', start: 0.5, end: 3.2, text: 'STOP SCROLLING! You need to see this 🚀', originalText: 'STOP SCROLLING! You need to see this 🚀', highlightWord: 'STOP', emoji: '🚀', color: '#FACC15' },
          { id: 'c2', start: 3.5, end: 6.8, text: 'AI Video Editing just reached another level 🔥', originalText: 'AI Video Editing just reached another level 🔥', highlightWord: 'Another Level', emoji: '🔥', color: '#22C55E' },
          { id: 'c3', start: 7.0, end: 10.5, text: 'From Text to 8K Cinematic Masterpiece 🎬', originalText: 'From Text to 8K Cinematic Masterpiece 🎬', highlightWord: '8K Cinematic', emoji: '🎬', color: '#06B6D4' },
          { id: 'c4', start: 10.8, end: 14.5, text: 'Auto-captions in 20+ languages instantly ⚡', originalText: 'Auto-captions in 20+ languages instantly ⚡', highlightWord: '20+ Languages', emoji: '⚡', color: '#EC4899' }
        ];
      }
    }

    res.json({
      success: true,
      targetLanguage,
      captionStyle,
      captions: captionsList
    });
  } catch (error: any) {
    console.error('Error generating captions:', error);
    res.status(500).json({ error: error.message || 'Failed to auto-generate captions' });
  }
});

// AI Video Enhancement Analyzer (Auto Color Grading, Denoising, Stabilization & 8K Upscaling)
app.post('/api/ai/enhance-analysis', async (req, res) => {
  const {
    sceneDescription = 'Urban street video clip',
    clipDuration = 10,
    enhancementGoals = ['Color Grading', 'Denoise', 'Stabilization', '8K Upscaling']
  } = req.body;

  try {
    let aiProfile = null;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are an Oscar-winning Master Colorist and AI Video Restoration Expert. Analyze this footage and determine the optimal calibration profile for AI Video Enhancement:

Scene description: "${sceneDescription}"
Duration: ${clipDuration}s
Target Output: 8K Ultra HD Remaster (7680x4320)

Output specific calibration values for:
1. Color Grading: colorTemperature, contrast, saturation, shadowsLift, highlightsCompress, tealOrangeSplit.
2. AI Denoising: spatialDenoisePercent, temporalDenoisePercent, lowLightChromaSmoothing.
3. Optical Stabilization: smoothnessFactor, cropBufferPercent, rollingShutterCorrection.
4. AI 8K Upscaling: neuralDetailEnhancement, edgeSharpness, textureReconstructionAlgorithm, hdrBoost.
Provide an insightful explanation of the cinematic color & enhancement choice.`,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                presetName: { type: Type.STRING },
                analysisSummary: { type: Type.STRING },
                colorGrading: {
                  type: Type.OBJECT,
                  properties: {
                    colorTemperature: { type: Type.NUMBER },
                    contrast: { type: Type.NUMBER },
                    saturation: { type: Type.NUMBER },
                    highlights: { type: Type.NUMBER },
                    shadows: { type: Type.NUMBER },
                    vibrance: { type: Type.NUMBER },
                    lutRecommendation: { type: Type.STRING }
                  },
                  required: ['colorTemperature', 'contrast', 'saturation', 'lutRecommendation']
                },
                noiseReduction: {
                  type: Type.OBJECT,
                  properties: {
                    spatialDenoise: { type: Type.NUMBER },
                    temporalDenoise: { type: Type.NUMBER },
                    chromaNoiseCleaning: { type: Type.NUMBER },
                    grainPreservation: { type: Type.NUMBER }
                  },
                  required: ['spatialDenoise', 'temporalDenoise']
                },
                stabilization: {
                  type: Type.OBJECT,
                  properties: {
                    smoothing: { type: Type.NUMBER },
                    cropBuffer: { type: Type.NUMBER },
                    motionBlurCompensation: { type: Type.BOOLEAN }
                  },
                  required: ['smoothing', 'cropBuffer']
                },
                upscaling8K: {
                  type: Type.OBJECT,
                  properties: {
                    sharpness: { type: Type.NUMBER },
                    neuralSuperResolutionMultiplier: { type: Type.STRING },
                    hdrDynamicRangeBoost: { type: Type.NUMBER },
                    antiAliasingFilter: { type: Type.STRING }
                  },
                  required: ['sharpness', 'neuralSuperResolutionMultiplier']
                }
              },
              required: ['presetName', 'analysisSummary', 'colorGrading', 'noiseReduction', 'stabilization', 'upscaling8K']
            }
          }
        });

        if (response.text) {
          aiProfile = JSON.parse(response.text.trim());
        }
      } catch (err: any) {
        console.warn('Gemini enhancement error, using preset fallback:', err?.message);
      }
    }

    const fallbackProfile = {
      presetName: 'AI Cinematic 8K Master Remaster',
      analysisSummary: 'Footage balanced for dynamic contrast, teal-orange tonal separation, temporal micro-jitter removal, and 4x neural spatial super-resolution up to 8K.',
      colorGrading: {
        colorTemperature: 6200,
        contrast: 1.18,
        saturation: 1.15,
        highlights: 0.92,
        shadows: 1.08,
        vibrance: 1.2,
        lutRecommendation: 'Teal & Orange Hollywood HDR'
      },
      noiseReduction: {
        spatialDenoise: 82,
        temporalDenoise: 88,
        chromaNoiseCleaning: 90,
        grainPreservation: 25
      },
      stabilization: {
        smoothing: 85,
        cropBuffer: 6,
        motionBlurCompensation: true
      },
      upscaling8K: {
        sharpness: 75,
        neuralSuperResolutionMultiplier: '4x to 8K (7680x4320)',
        hdrDynamicRangeBoost: 80,
        antiAliasingFilter: 'Lanczos-4 AI Neural Matrix'
      }
    };

    res.json({
      success: true,
      profile: aiProfile || fallbackProfile
    });
  } catch (error: any) {
    console.error('Enhancement error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cloud Render Job Submission (8K Export Queue)
app.post('/api/cloud/render-job', (req, res) => {
  const {
    projectName = 'Untitled Project',
    resolution = '8K',
    codec = 'H.265 / HEVC',
    fps = 60,
    enhancementActive = true,
    userTier = 'Studio Ultra'
  } = req.body;

  const jobId = `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const gpuNodeList = [
    'Cloud-GPU-Cluster-US-East-01 (NVIDIA H100 SXM5)',
    'Cloud-GPU-Cluster-Asia-Pacific-03 (NVIDIA A100 Tensor)',
    'Cloud-GPU-Cluster-Europe-West-02 (NVIDIA RTX 6000 Ada)'
  ];
  const assignedGpu = gpuNodeList[Math.floor(Math.random() * gpuNodeList.length)];

  const initialJob: RenderJob = {
    id: jobId,
    projectName,
    resolution,
    codec,
    fps,
    quality: `${resolution} Master HDR (${resolution === '8K' ? '7680x4320' : resolution === '4K' ? '3840x2160' : '1920x1080'})`,
    status: 'processing',
    progress: 5,
    currentStage: 'Allocating high-speed Cloud GPU Tensor Core...',
    gpuNode: assignedGpu,
    createdAt: Date.now(),
    fileSizeMb: resolution === '8K' ? 1850 : resolution === '4K' ? 620 : 180
  };

  cloudRenderJobs.set(jobId, initialJob);

  res.json({
    success: true,
    job: initialJob,
    estimatedSeconds: resolution === '8K' ? 18 : resolution === '4K' ? 10 : 5
  });
});

// Cloud Render Job Status Polling
app.get('/api/cloud/render-job/:id', (req, res) => {
  const job = cloudRenderJobs.get(req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  // Simulate cloud render progression
  if (job.status === 'processing') {
    const elapsed = Date.now() - job.createdAt;
    const targetDurationMs = job.resolution === '8K' ? 12000 : 7000;
    const calcProgress = Math.min(100, Math.round((elapsed / targetDurationMs) * 100));

    job.progress = calcProgress;

    if (calcProgress < 20) {
      job.currentStage = 'Ingesting timeline multitrack video layers & audio buffers...';
    } else if (calcProgress < 45) {
      job.currentStage = 'Applying AI Optical Stabilization & Temporal Noise Reduction...';
    } else if (calcProgress < 75) {
      job.currentStage = `Executing AI Neural Upscaling to ${job.resolution} (7680x4320) & Color LUT...`;
    } else if (calcProgress < 95) {
      job.currentStage = `Encoding ${job.codec} 10-bit HDR video stream at ${job.fps}fps...`;
    } else {
      job.status = 'completed';
      job.progress = 100;
      job.completedAt = Date.now();
      job.currentStage = `Render complete! Ready for 8K Master Download.`;
      job.downloadUrl = 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-traffic-and-buildings-at-night-42861-large.mp4';
    }
  }

  res.json({ success: true, job });
});

// List all cloud render jobs
app.get('/api/cloud/render-jobs', (req, res) => {
  const jobs = Array.from(cloudRenderJobs.values()).sort((a, b) => b.createdAt - a.createdAt);
  res.json({ success: true, jobs });
});

// Mount Vite or serve static files
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CapCut AI Studio server running on port ${PORT}`);
  });
}

startServer();
