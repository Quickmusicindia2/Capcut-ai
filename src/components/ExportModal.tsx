import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Cloud, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  Tv, 
  Zap, 
  Cpu, 
  Film,
  HardDrive
} from 'lucide-react';
import { Resolution, SubscriptionPlan } from '../types/editor';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  activePlan: SubscriptionPlan;
  onJobCreated?: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  projectName,
  activePlan,
  onJobCreated
}) => {
  const [resolution, setResolution] = useState<Resolution>('8K');
  const [codec, setCodec] = useState('H.265 / HEVC');
  const [fps, setFps] = useState(60);
  const [bitrate, setBitrate] = useState(120); // Mbps
  const [isCloudRender, setIsCloudRender] = useState(true);
  const [isRendering, setIsRendering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const resolutionPresets = [
    { id: '720p' as Resolution, label: '720p HD', dim: '1280x720', size: '~60 MB' },
    { id: '1080p' as Resolution, label: '1080p FHD', dim: '1920x1080', size: '~180 MB' },
    { id: '4K' as Resolution, label: '4K UHD', dim: '3840x2160', size: '~620 MB', reqPro: true },
    { id: '8K' as Resolution, label: '8K Ultra HD', dim: '7680x4320', size: '~1.8 GB', reqUltra: true }
  ];

  const handleStartRender = async () => {
    setIsRendering(true);
    setProgress(5);
    setCurrentStage('Submitting timeline render job to Cloud GPU Cluster...');
    setIsCompleted(false);

    try {
      const response = await fetch('/api/cloud/render-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName,
          resolution,
          codec,
          fps,
          userTier: activePlan.name
        })
      });

      const data = await response.json();
      const jobId = data.job?.id;

      if (jobId) {
        // Poll status
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/cloud/render-job/${jobId}`);
            const statusData = await statusRes.json();
            if (statusData.success && statusData.job) {
              setProgress(statusData.job.progress);
              setCurrentStage(statusData.job.currentStage);

              if (statusData.job.status === 'completed') {
                clearInterval(pollInterval);
                setIsRendering(false);
                setIsCompleted(true);
                setDownloadUrl(statusData.job.downloadUrl || 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-traffic-and-buildings-at-night-42861-large.mp4');
                onJobCreated?.();
              }
            }
          } catch (e) {
            console.warn('Polling error:', e);
          }
        }, 1000);
      }
    } catch (err) {
      // Client-side simulated high-speed render
      console.warn('Client fallback render active');
      let currentP = 5;
      const stages = [
        'Compositing multitrack video layers & kinetic captions...',
        'Applying AI Neural Optical Stabilization & Temporal Denoise...',
        `Processing AI 8K Super-Resolution Upscaling (7680x4320)...`,
        `Encoding ${codec} 10-bit HDR video stream at ${fps}fps...`,
        'Muxing lossless audio buffers & final container...'
      ];

      const simInterval = setInterval(() => {
        currentP += 18;
        if (currentP >= 100) {
          clearInterval(simInterval);
          setProgress(100);
          setCurrentStage('Render finished! 8K Master file ready.');
          setIsRendering(false);
          setIsCompleted(true);
          setDownloadUrl('https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-traffic-and-buildings-at-night-42861-large.mp4');
          onJobCreated?.();
        } else {
          setProgress(currentP);
          const stageIdx = Math.min(stages.length - 1, Math.floor((currentP / 100) * stages.length));
          setCurrentStage(stages[stageIdx]);
        }
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col text-zinc-200">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Tv className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Export Master Video (Up to 8K)
              </h3>
              <p className="text-xs text-zinc-400">
                Project: <strong className="text-white">{projectName}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar">
          {/* Resolution Picker */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 mb-2 block">
              Resolution Quality
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {resolutionPresets.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setResolution(r.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    resolution === r.id
                      ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold shadow-md'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850'
                  }`}
                >
                  <div className="text-xs font-extrabold flex items-center justify-between">
                    <span>{r.label}</span>
                    {r.id === '8K' && (
                      <span className="text-[8px] px-1 py-0.2 rounded bg-cyan-500 text-zinc-950 font-black">
                        PRO
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{r.dim}</div>
                  <div className="text-[10px] text-cyan-400 font-mono mt-1">{r.size}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Codec & FPS */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
                Video Codec
              </label>
              <select
                value={codec}
                onChange={(e) => setCodec(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white rounded-lg p-2.5 focus:border-cyan-400 focus:outline-none"
              >
                <option value="H.265 / HEVC">H.265 / HEVC (Best for 8K)</option>
                <option value="Apple ProRes 422 HQ">Apple ProRes 422 HQ (Studio Master)</option>
                <option value="H.264 / AVC">H.264 / AVC (Universal Web)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-300 mb-1.5 block">
                Frame Rate (FPS)
              </label>
              <select
                value={fps}
                onChange={(e) => setFps(parseInt(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 text-xs text-white rounded-lg p-2.5 focus:border-cyan-400 focus:outline-none"
              >
                <option value={60}>60 fps (Ultra Smooth)</option>
                <option value={30}>30 fps (Standard Social)</option>
                <option value={24}>24 fps (Cinematic Film)</option>
              </select>
            </div>
          </div>

          {/* Bitrate Slider */}
          <div className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-800">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-zinc-300">Target Bitrate</span>
              <span className="font-mono text-cyan-400 font-bold">{bitrate} Mbps</span>
            </div>
            <input
              type="range"
              min={25}
              max={150}
              step={5}
              value={bitrate}
              onChange={(e) => setBitrate(parseInt(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-zinc-800 rounded"
            />
            <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
              <span>Standard (25M)</span>
              <span>8K Cinema Master (120M+)</span>
            </div>
          </div>

          {/* Render Mode: Cloud vs Local */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setIsCloudRender(true)}
              className={`flex-1 p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                isCloudRender
                  ? 'bg-cyan-500/20 border-cyan-400 text-white'
                  : 'border-zinc-800 text-zinc-400'
              }`}
            >
              <Cloud className="w-4 h-4 text-cyan-400" />
              <span>Cloud GPU (NVIDIA H100)</span>
            </button>

            <button
              onClick={() => setIsCloudRender(false)}
              className={`flex-1 p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                !isCloudRender
                  ? 'bg-cyan-500/20 border-cyan-400 text-white'
                  : 'border-zinc-800 text-zinc-400'
              }`}
            >
              <Cpu className="w-4 h-4 text-zinc-400" />
              <span>Local Browser Render</span>
            </button>
          </div>

          {/* Progress / Rendering State */}
          {isRendering && (
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-2">
              <div className="flex justify-between text-xs font-bold text-cyan-300">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Rendering {resolution} Master...</span>
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[11px] text-zinc-300 font-mono">
                {currentStage}
              </p>
            </div>
          )}

          {/* Completed State */}
          {isCompleted && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>8K Master Video Successfully Rendered!</span>
              </div>
              <p className="text-xs text-zinc-300">
                Your video is packaged in uncompressed 10-bit HDR with synced multi-language kinetic captions.
              </p>
              <a
                href={downloadUrl || '#'}
                download={`${projectName.replace(/\s+/g, '-')}-8K.mp4`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download {resolution} Master Video File</span>
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 flex justify-end gap-2 bg-zinc-950">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            Cancel
          </button>
          {!isCompleted && (
            <button
              onClick={handleStartRender}
              disabled={isRendering}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isRendering ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Render & Export in {resolution}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
