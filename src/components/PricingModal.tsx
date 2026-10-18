import React from 'react';
import { X, Check, Crown, Zap, Sparkles, Shield, Cpu } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../data/mockAssets';
import { SubscriptionPlan } from '../types/editor';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePlan: SubscriptionPlan;
  setActivePlan: (plan: SubscriptionPlan) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  activePlan,
  setActivePlan
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col text-zinc-200">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between text-center relative">
          <div className="w-full">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
              CapCut AI Studio Subscription Plans
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5">
              Unlock Full 8K Rendering & Unlimited AI Power
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-lg mx-auto">
              Choose the right creative tier for your social media channels, studio productions, and client workflows.
            </p>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto max-h-[70vh] no-scrollbar">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isCurrent = activePlan.id === plan.id;
            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-5 border flex flex-col justify-between transition-all relative ${
                  plan.id === 'ultra'
                    ? 'bg-gradient-to-b from-amber-950/20 to-zinc-900 border-amber-500/40 shadow-xl shadow-amber-500/10'
                    : plan.id === 'pro'
                    ? 'bg-gradient-to-b from-cyan-950/20 to-zinc-900 border-cyan-500/40 shadow-xl shadow-cyan-500/10'
                    : 'bg-zinc-900/60 border-zinc-800'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md ${
                      plan.id === 'ultra'
                        ? 'bg-amber-400 text-zinc-950'
                        : 'bg-cyan-400 text-zinc-950'
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                      {plan.id === 'ultra' && <Crown className="w-4 h-4 text-amber-400" />}
                      {plan.id === 'pro' && <Zap className="w-4 h-4 text-cyan-400" />}
                      <span>{plan.name}</span>
                    </h3>
                  </div>

                  <p className="text-[11px] text-zinc-400 min-h-[32px] leading-relaxed">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="my-4 pb-4 border-b border-zinc-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">{plan.price}</span>
                      <span className="text-xs text-zinc-400 font-medium">/ {plan.billing}</span>
                    </div>
                    <div className="text-[11px] text-cyan-400 font-semibold mt-1">
                      Max Quality: <strong className="text-white">{plan.maxResolution} Ultra</strong>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2 text-xs text-zinc-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Selection Button */}
                <div className="mt-6 pt-4 border-t border-zinc-800/80">
                  <button
                    onClick={() => {
                      setActivePlan(plan);
                      onClose();
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      isCurrent
                        ? 'bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-default'
                        : plan.id === 'ultra'
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-zinc-950 shadow-lg shadow-amber-500/20'
                        : plan.id === 'pro'
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-zinc-950 shadow-lg shadow-cyan-500/20'
                        : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                    }`}
                  >
                    {isCurrent ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Active Plan</span>
                      </>
                    ) : (
                      <>
                        <span>Switch to {plan.name}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
