import React, { useEffect, useState } from 'react';
import { Cloud, Cpu, CheckCircle2, Clock, Download, RefreshCw, Zap, Server } from 'lucide-react';
import { RenderJob } from '../../types/editor';

interface CloudQueuePanelProps {
  onOpenExport: () => void;
}

export const CloudQueuePanel: React.FC<CloudQueuePanelProps> = ({ onOpenExport }) => {
  const [jobs, setJobs] = useState<RenderJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/cloud/render-jobs');
      const data = await res.json();
      if (data.success && data.jobs) {
        setJobs(data.jobs);
      }
    } catch (e) {
      // Fallback in-memory jobs if serverless/static
      console.log('Polling client render queue');
    }
  };

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full text-zinc-200">
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Cloud className="w-4 h-4 text-cyan-400" />
            <span>Cloud GPU Render Farm</span>
          </h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>8 GPU Nodes Active</span>
          </span>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Cloud-based hardware accelerated rendering for 4K and 8K master exports without heating your device.
        </p>

        <button
          onClick={onOpenExport}
          className="w-full mt-3 py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Start New 8K Cloud Render</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {jobs.length === 0 ? (
          <div className="text-center py-10 px-4">
            <Server className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <h3 className="text-xs font-semibold text-zinc-300">No active render jobs</h3>
            <p className="text-[11px] text-zinc-500 mt-1">
              Click &quot;Export 8K&quot; on the top right to start a high-speed cloud GPU rendering job.
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{job.projectName}</span>
                    <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[9px] font-bold">
                      {job.resolution}
                    </span>
                  </h4>
                  <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                    {job.codec} • {job.fps}fps • {job.fileSizeMb || 450} MB
                  </p>
                </div>

                {job.status === 'completed' ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Ready</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>{job.progress}%</span>
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    job.status === 'completed'
                      ? 'bg-emerald-500'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  }`}
                  style={{ width: `${job.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-zinc-400">
                <span className="truncate max-w-[200px] text-zinc-300">
                  {job.currentStage}
                </span>
                <span className="font-mono text-zinc-500">
                  {job.gpuNode.split(' ')[0]}
                </span>
              </div>

              {job.status === 'completed' && (
                <a
                  href={job.downloadUrl || 'https://assets.mixkit.co/videos/preview/mixkit-futuristic-city-traffic-and-buildings-at-night-42861-large.mp4'}
                  download="CapCut-8K-Export.mp4"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-emerald-600 hover:text-white text-xs font-semibold text-emerald-400 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download 8K Master File</span>
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
