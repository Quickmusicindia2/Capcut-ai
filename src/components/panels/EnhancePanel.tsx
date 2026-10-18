import React, { useState } from 'react';
import { 
  Wand2, 
  Sparkles, 
  Sliders, 
  Eye, 
  Check, 
  RefreshCw, 
  Zap, 
  SunMedium, 
  ShieldCheck, 
  Compass, 
  Tv, 
  Layers,
  SplitSquareVertical
} from 'lucide-react';
import { EnhancementProfile, Resolution } from '../../types/editor';
import { COLOR_LUTS } from '../../data/mockAssets';

interface EnhancePanelProps {
  enhancement: EnhancementProfile;
  setEnhancement: React.Dispatch<React.SetStateAction<EnhancementProfile>>;
  activeClipTitle?: string;
}

export const EnhancePanel: React.FC<EnhancePanelProps> = ({
  enhancement,
  setEnhancement,
  activeClipTitle = 'Main Timeline Footage'
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'color' | 'denoise' | 'stabilize' | 'upscale'>('color');

  const handleToggleMaster = () => {
    setEnhancement(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  const handleToggleSplit = () => {
    setEnhancement(prev => ({ ...prev, splitView: !prev.splitView }));
  };

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/enhance-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneDescription: activeClipTitle,
          clipDuration: 10,
          enhancementGoals: ['Color Grading', 'Denoise', 'Stabilization', '8K Upscaling']
        })
      });

      const data = await response.json();
      if (data.success && data.profile) {
        const p = data.profile;
        setEnhancement(prev => ({
          ...prev,
          enabled: true,
          colorGrading: {
            ...prev.colorGrading,
            enabled: true,
            temperature: p.colorGrading.colorTemperature || 6200,
            contrast: p.colorGrading.contrast || 1.2,
            saturation: p.colorGrading.saturation || 1.25,
            vibrance: 50,
            lut: p.colorGrading.lutRecommendation || 'Teal & Orange Hollywood'
          },
          noiseReduction: {
            ...prev.noiseReduction,
            enabled: true,
            spatialDenoise: p.noiseReduction.spatialDenoise || 80,
            temporalDenoise: p.noiseReduction.temporalDenoise || 85,
            lowLightBoost: true
          },
          stabilization: {
            ...prev.stabilization,
            enabled: true,
            smoothness: p.stabilization.smoothing || 85,
            cropBuffer: p.stabilization.cropBuffer || 6,
            horizonLeveler: true
          },
          upscaling8K: {
            ...prev.upscaling8K,
            enabled: true,
            targetResolution: '8K',
            neuralSharpness: p.upscaling8K.sharpness || 80,
            hdrBoost: 75
          }
        }));
      }
    } catch (err) {
      console.warn('Using client-side AI enhancement optimizer:', err);
      // Client-side auto grade
      setEnhancement(prev => ({
        ...prev,
        enabled: true,
        colorGrading: {
          ...prev.colorGrading,
          enabled: true,
          temperature: 6300,
          contrast: 1.22,
          saturation: 1.3,
          vibrance: 55,
          lut: 'Teal & Orange Hollywood'
        },
        noiseReduction: {
          ...prev.noiseReduction,
          enabled: true,
          spatialDenoise: 85,
          temporalDenoise: 90
        },
        stabilization: {
          ...prev.stabilization,
          enabled: true,
          smoothness: 90,
          cropBuffer: 5
        },
        upscaling8K: {
          ...prev.upscaling8K,
          enabled: true,
          targetResolution: '8K',
          neuralSharpness: 85,
          hdrBoost: 80
        }
      }));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectLut = (lutName: string) => {
    setEnhancement(prev => ({
      ...prev,
      colorGrading: {
        ...prev.colorGrading,
        lut: lutName
      }
    }));
  };

  return (
    <div className="flex flex-col h-full text-zinc-200">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-fuchsia-400" />
            <h2 className="text-sm font-bold text-white">AI Enhancement Suite</h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-fuchsia-500/15 text-fuchsia-400 border border-fuchsia-500/30">
            8K Master
          </span>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Auto color grade, denoise, motion stabilization, and neural upscaling to 8K.
        </p>

        {/* Master Switches & Before/After */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={handleToggleMaster}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              enhancement.enabled
                ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/20'
                : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 ${enhancement.enabled ? 'fill-current' : ''}`} />
            <span>{enhancement.enabled ? 'AI Enhancements ACTIVE' : 'Enable AI Suite'}</span>
          </button>

          <button
            onClick={handleToggleSplit}
            title="Toggle Split Before / After interactive view"
            className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              enhancement.splitView
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Before/After</span>
          </button>
        </div>

        {/* 1-Click AI Auto-Analyze Button */}
        <button
          onClick={handleRunAiAnalysis}
          disabled={isAnalyzing}
          className="w-full mt-2.5 py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Video Scene with Gemini AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>1-Click AI Auto-Grade & 8K Remaster</span>
            </>
          )}
        </button>
      </div>

      {/* Enhancement Feature Tabs */}
      <div className="grid grid-cols-4 border-b border-zinc-800 text-[11px] font-semibold bg-zinc-950/60 select-none">
        <button
          onClick={() => setActiveTab('color')}
          className={`py-2 text-center transition-colors border-b-2 ${
            activeTab === 'color' 
              ? 'border-fuchsia-500 text-white bg-zinc-900/60' 
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Color
        </button>
        <button
          onClick={() => setActiveTab('denoise')}
          className={`py-2 text-center transition-colors border-b-2 ${
            activeTab === 'denoise' 
              ? 'border-fuchsia-500 text-white bg-zinc-900/60' 
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Denoise
        </button>
        <button
          onClick={() => setActiveTab('stabilize')}
          className={`py-2 text-center transition-colors border-b-2 ${
            activeTab === 'stabilize' 
              ? 'border-fuchsia-500 text-white bg-zinc-900/60' 
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Stabilize
        </button>
        <button
          onClick={() => setActiveTab('upscale')}
          className={`py-2 text-center transition-colors border-b-2 ${
            activeTab === 'upscale' 
              ? 'border-fuchsia-500 text-white bg-zinc-900/60' 
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          8K Upscale
        </button>
      </div>

      {/* Tool Drawer Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {/* TAB 1: AUTOMATIC COLOR GRADING */}
        {activeTab === 'color' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <SunMedium className="w-3.5 h-3.5 text-amber-400" />
                <span>Automatic Color Grading & LUTs</span>
              </span>
              <input
                type="checkbox"
                checked={enhancement.colorGrading.enabled}
                onChange={(e) => setEnhancement(prev => ({
                  ...prev,
                  colorGrading: { ...prev.colorGrading, enabled: e.target.checked }
                }))}
                className="accent-fuchsia-500 rounded cursor-pointer"
              />
            </div>

            {/* LUT Presets Grid */}
            <div>
              <label className="text-[11px] font-semibold text-zinc-300 mb-1.5 block">
                Cinematic Color LUT
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {COLOR_LUTS.map(lut => (
                  <button
                    key={lut.id}
                    onClick={() => handleSelectLut(lut.name)}
                    className={`p-2 rounded-lg text-left border text-xs transition-all ${
                      enhancement.colorGrading.lut === lut.name
                        ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500 font-semibold shadow-sm'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <div className="truncate">{lut.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Fine Tuning Sliders */}
            <div className="space-y-3 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
              {/* Temperature */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-400">Color Temperature</span>
                  <span className="font-mono text-amber-300 font-bold">{enhancement.colorGrading.temperature}K</span>
                </div>
                <input
                  type="range"
                  min={3200}
                  max={8500}
                  step={100}
                  value={enhancement.colorGrading.temperature}
                  onChange={(e) => setEnhancement(prev => ({
                    ...prev,
                    colorGrading: { ...prev.colorGrading, temperature: parseInt(e.target.value) }
                  }))}
                  className="w-full accent-amber-400 h-1 bg-zinc-800 rounded"
                />
              </div>

              {/* Contrast */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-400">Contrast</span>
                  <span className="font-mono text-cyan-300 font-bold">{enhancement.colorGrading.contrast.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min={0.8}
                  max={1.6}
                  step={0.05}
                  value={enhancement.colorGrading.contrast}
                  onChange={(e) => setEnhancement(prev => ({
                    ...prev,
                    colorGrading: { ...prev.colorGrading, contrast: parseFloat(e.target.value) }
                  }))}
                  className="w-full accent-cyan-400 h-1 bg-zinc-800 rounded"
                />
              </div>

              {/* Saturation */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-400">Saturation</span>
                  <span className="font-mono text-fuchsia-300 font-bold">{enhancement.colorGrading.saturation.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min={0.7}
                  max={1.8}
                  step={0.05}
                  value={enhancement.colorGrading.saturation}
                  onChange={(e) => setEnhancement(prev => ({
                    ...prev,
                    colorGrading: { ...prev.colorGrading, saturation: parseFloat(e.target.value) }
                  }))}
                  className="w-full accent-fuchsia-400 h-1 bg-zinc-800 rounded"
                />
              </div>

              {/* Vibrance */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-400">Vibrance Boost</span>
                  <span className="font-mono text-zinc-300">{enhancement.colorGrading.vibrance}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={enhancement.colorGrading.vibrance}
                  onChange={(e) => setEnhancement(prev => ({
                    ...prev,
                    colorGrading: { ...prev.colorGrading, vibrance: parseInt(e.target.value) }
                  }))}
                  className="w-full accent-zinc-400 h-1 bg-zinc-800 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NOISE REDUCTION */}
        {activeTab === 'denoise' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Neural Noise Reduction</span>
              </span>
              <input
                type="checkbox"
                checked={enhancement.noiseReduction.enabled}
                onChange={(e) => setEnhancement(prev => ({
                  ...prev,
                  noiseReduction: { ...prev.noiseReduction, enabled: e.target.checked }
                }))}
                className="accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            <p className="text-xs text-zinc-400">
              Eliminates ISO sensor grain and compression artifacts without blurring edge sharpness.
            </p>

            <div className="space-y-3 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
              {/* Spatial Denoise */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-300">Spatial Denoising</span>
                  <span className="font-mono text-emerald-400 font-bold">{enhancement.noiseReduction.spatialDenoise}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={enhancement.noiseReduction.spatialDenoise}
                  onChange={(e) => setEnhancement(prev => ({
                    ...prev,
                    noiseReduction: { ...prev.noiseReduction, spatialDenoise: parseInt(e.target.value) }
                  }))}
                  className="w-full accent-emerald-400 h-1 bg-zinc-800 rounded"
                />
                <span className="text-[10px] text-zinc-500">Cleans high-frequency pixel noise</span>
              </div>

              {/* Temporal Denoise */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-300">Temporal Multi-Frame Denoising</span>
                  <span className="font-mono text-cyan-400 font-bold">{enhancement.noiseReduction.temporalDenoise}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={enhancement.noiseReduction.temporalDenoise}
                  onChange={(e) => setEnhancement(prev => ({
                    ...prev,
                    noiseReduction: { ...prev.noiseReduction, temporalDenoise: parseInt(e.target.value) }
                  }))}
                  className="w-full accent-cyan-400 h-1 bg-zinc-800 rounded"
                />
                <span className="text-[10px] text-zinc-500">Compares 5 consecutive frames for zero-ghosting</span>
              </div>

              {/* Low Light Boost */}
              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enhancement.noiseReduction.lowLightBoost}
                  onChange={(e) => setEnhancement(prev => ({
                    ...prev,
                    noiseReduction: { ...prev.noiseReduction, lowLightBoost: e.target.checked }
                  }))}
                  className="accent-emerald-400 rounded"
                />
                <span className="text-xs text-zinc-300 font-medium">Low-Light Chroma Noise Cleaning</span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 3: VIDEO STABILIZATION */}
        {activeTab === 'stabilize' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-blue-400" />
                <span>AI Optical Flow Stabilization</span>
              </span>
              <input
                type="checkbox"
                checked={enhancement.stabilization.enabled}
                onChange={(e) => setEnhancement(prev => ({
                  ...prev,
                  stabilization: { ...prev.stabilization, enabled: e.target.checked }
                }))}
                className="accent-blue-500 rounded cursor-pointer"
              />
            </div>

            <p className="text-xs text-zinc-400">
              Real-time gimbal-level smoothing for shaky handheld and action footage.
            </p>

            <div className="space-y-3 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
              {/* Smoothness */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-300">Stabilization Smoothness</span>
                  <span className="font-mono text-blue-400 font-bold">{enhancement.stabilization.smoothness}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={enhancement.stabilization.smoothness}
                  onChange={(e) => setEnhancement(prev => ({
                    ...prev,
                    stabilization: { ...prev.stabilization, smoothness: parseInt(e.target.value) }
                  }))}
                  className="w-full accent-blue-400 h-1 bg-zinc-800 rounded"
                />
              </div>

              {/* Crop Buffer */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-300">Dynamic Crop Compensation</span>
                  <span className="font-mono text-zinc-400">{enhancement.stabilization.cropBuffer}%</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={15}
                  value={enhancement.stabilization.cropBuffer}
                  onChange={(e) => setEnhancement(prev => ({
                    ...prev,
                    stabilization: { ...prev.stabilization, cropBuffer: parseInt(e.target.value) }
                  }))}
                  className="w-full accent-zinc-500 h-1 bg-zinc-800 rounded"
                />
              </div>

              {/* Horizon Leveler */}
              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enhancement.stabilization.horizonLeveler}
                  onChange={(e) => setEnhancement(prev => ({
                    ...prev,
                    stabilization: { ...prev.stabilization, horizonLeveler: e.target.checked }
                  }))}
                  className="accent-blue-400 rounded"
                />
                <span className="text-xs text-zinc-300 font-medium">Automatic Horizon Leveling Lock</span>
              </label>

              {/* Rolling Shutter Fix */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enhancement.stabilization.rollingShutterFix}
                  onChange={(e) => setEnhancement(prev => ({
                    ...prev,
                    stabilization: { ...prev.stabilization, rollingShutterFix: e.target.checked }
                  }))}
                  className="accent-blue-400 rounded"
                />
                <span className="text-xs text-zinc-300 font-medium">Anti-Wobble / Rolling Shutter Fix</span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 4: 8K NEURAL UPSCALING */}
        {activeTab === 'upscale' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Super-Resolution 8K Upscaling</span>
              </span>
              <input
                type="checkbox"
                checked={enhancement.upscaling8K.enabled}
                onChange={(e) => setEnhancement(prev => ({
                  ...prev,
                  upscaling8K: { ...prev.upscaling8K, enabled: e.target.checked }
                }))}
                className="accent-cyan-400 rounded cursor-pointer"
              />
            </div>

            <p className="text-xs text-zinc-400">
              Synthesize sub-pixel details and render up to 8K Ultra HD (7680x4320) master resolution.
            </p>

            {/* Target Resolution Selection */}
            <div>
              <label className="text-[11px] font-semibold text-zinc-300 mb-1.5 block">
                Target Upscale Resolution
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['1080p', '4K', '8K'] as Resolution[]).map(res => (
                  <button
                    key={res}
                    onClick={() => setEnhancement(prev => ({
                      ...prev,
                      upscaling8K: { ...prev.upscaling8K, targetResolution: res }
                    }))}
                    className={`py-2 px-1 rounded-lg text-center border transition-all ${
                      enhancement.upscaling8K.targetResolution === res
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold shadow-md'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-extrabold">{res}</div>
                    <div className="text-[9px] text-zinc-500">
                      {res === '8K' ? '7680x4320' : res === '4K' ? '3840x2160' : '1920x1080'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800">
              {/* Neural Sharpness */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-300">Neural Edge Refinement</span>
                  <span className="font-mono text-cyan-400 font-bold">{enhancement.upscaling8K.neuralSharpness}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={enhancement.upscaling8K.neuralSharpness}
                  onChange={(e) => setEnhancement(prev => ({
                    ...prev,
                    upscaling8K: { ...prev.upscaling8K, neuralSharpness: parseInt(e.target.value) }
                  }))}
                  className="w-full accent-cyan-400 h-1 bg-zinc-800 rounded"
                />
              </div>

              {/* HDR Boost */}
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-zinc-300">HDR Dynamic Range Expansion</span>
                  <span className="font-mono text-fuchsia-400 font-bold">{enhancement.upscaling8K.hdrBoost}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={enhancement.upscaling8K.hdrBoost}
                  onChange={(e) => setEnhancement(prev => ({
                    ...prev,
                    upscaling8K: { ...prev.upscaling8K, hdrBoost: parseInt(e.target.value) }
                  }))}
                  className="w-full accent-fuchsia-400 h-1 bg-zinc-800 rounded"
                />
              </div>

              {/* Model selection */}
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Neural Upscaling Engine</label>
                <select
                  value={enhancement.upscaling8K.model}
                  onChange={(e: any) => setEnhancement(prev => ({
                    ...prev,
                    upscaling8K: { ...prev.upscaling8K, model: e.target.value }
                  }))}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded p-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="Neural-GAN-8K">Neural-GAN-8K (Cinema Detail)</option>
                  <option value="Spatial-Tensor-Ultra">Spatial-Tensor-Ultra (Zero Artifacts)</option>
                  <option value="Cinematic-Master-8K">Cinematic-Master-8K (Hollywood Grade)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
