import React, { useState } from 'react';
import { Globe2, CheckCircle2, Copy, ExternalLink, Terminal, Sparkles, ArrowRight, Folder } from 'lucide-react';

export const NetlifyDeployPanel: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const stepsHindi = [
    {
      title: '1. Netlify Config Ready (तैयार है)',
      desc: 'आपकी ऍप में netlify.toml और public/_redirects फ़ाइल पहले से बना दी गई है, जिससे SPA राउटिंग और 8K रेंडरिंग बिल्कुल सही काम करेगी।'
    },
    {
      title: '2. GitHub रेपो से कनेक्ट करें (Method 1: ऑटोमैटिक डिप्लॉय)',
      desc: 'इस प्रोजेक्ट को अपने GitHub अकाउंट पर पुश करें, फिर netlify.com पर जाकर "Add new site > Import an existing project" चुनें।',
      command: 'git add . && git commit -m "Deploy CapCut AI Studio" && git push origin main'
    },
    {
      title: '3. Build Settings सेट करें',
      desc: 'Netlify डैशबोर्ड में ये सेटिंग्स रखें:',
      settings: [
        { label: 'Build command', val: 'npm run build' },
        { label: 'Publish directory', val: 'dist' },
        { label: 'Functions directory', val: 'netlify/functions (optional)' }
      ]
    },
    {
      title: '4. Environment Variables जोड़ें',
      desc: 'Netlify Site configuration > Environment variables में जाकर GEMINI_API_KEY जोड़ें ताकि AI फीचर्स सर्वरलेस पर भी एक्टिव रहें।',
      command: 'GEMINI_API_KEY = your_gemini_api_key'
    },
    {
      title: 'Method 2: Netlify Drop (बिना Git के 1 मिनट में लाइव)',
      desc: 'अगर आप Git का इस्तेमाल नहीं करना चाहते, तो आप "dist" फ़ोल्डर को सीधे app.netlify.com/drop पर ड्रैग-एंड-ड्रॉप कर सकते हैं!',
      command: 'npm run build'
    }
  ];

  return (
    <div className="flex flex-col h-full text-zinc-200">
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-teal-400" />
            <span>Netlify Deployment Guide</span>
          </h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40">
            Pre-Configured
          </span>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          इस CapCut AI Video Editor को Netlify पर पब्लिश करने के आसान स्टेप्स।
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {/* Status Card */}
        <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-500/30 space-y-2">
          <div className="flex items-center gap-2 text-teal-300 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Netlify Configuration Files Created</span>
          </div>
          <p className="text-[11px] text-zinc-300">
            ✅ <strong className="text-white">netlify.toml</strong> (build: npm run build, publish: dist)
            <br />
            ✅ <strong className="text-white">public/_redirects</strong> (SPA fallback routing /* 200)
          </p>
          <a
            href="https://app.netlify.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300 mt-1"
          >
            <span>Open Netlify Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Step by Step Hindi/English guide */}
        <div className="space-y-3">
          {stepsHindi.map((step, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2"
            >
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-zinc-800 text-teal-400 text-[10px] flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <span>{step.title}</span>
              </h3>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {step.desc}
              </p>

              {step.settings && (
                <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800/80 space-y-1.5">
                  {step.settings.map((s, sIdx) => (
                    <div key={sIdx} className="flex justify-between text-[11px]">
                      <span className="text-zinc-400">{s.label}:</span>
                      <code className="text-teal-300 font-mono font-bold bg-teal-950/60 px-1 rounded">
                        {s.val}
                      </code>
                    </div>
                  ))}
                </div>
              )}

              {step.command && (
                <div className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-zinc-300">
                  <span className="truncate max-w-[240px] text-teal-300">
                    {step.command}
                  </span>
                  <button
                    onClick={() => copyToClipboard(step.command!, idx)}
                    className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    title="Copy command"
                  >
                    {copiedIndex === idx ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Netlify Drop quick banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-teal-900/40 to-cyan-900/40 border border-teal-500/40 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-white">Netlify Drop Drag & Drop</h4>
            <p className="text-[10px] text-zinc-300 mt-0.5">
              Instant hosting without configuring Git.
            </p>
          </div>
          <a
            href="https://app.netlify.com/drop"
            target="_blank"
            rel="noreferrer"
            className="py-1.5 px-3 rounded-lg bg-teal-500 hover:bg-teal-400 text-zinc-950 font-black text-xs transition-all"
          >
            Go to Drop
          </a>
        </div>
      </div>
    </div>
  );
};
