import React from 'react';
import type { BehavioralSignals } from '@/lib/dune-client';

const defaultStats: BehavioralSignals = {
  portfolioValueUsd: 847.32,
  solBalance: "2.41",
  tokenCount: 14,
  topToken: "dogwifhat",
  topTokenSymbol: "$WIF",
  txCount: 312,
  recentActivity: "Today",
};

export function PersonaCard({ persona = "Exit Liquidity Human", description = "You traded 847 times last quarter...", stats = defaultStats }: { persona?: string, description?: string, stats?: BehavioralSignals }) {
  const portfolioDisplay = `$${stats.portfolioValueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  // Clamp progress bar to max 100%
  const progressPct = Math.min(stats.txCount / 5, 100);

  return (
    <div className="relative overflow-hidden bg-slate-950 rounded-[2.5rem] p-6 sm:p-8 md:p-10 shadow-2xl flex flex-col justify-between max-w-sm mx-auto w-full group border border-white/10 ring-1 ring-inset ring-white/5">
      
      {/* Deep Space Background with dynamic gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-black pointer-events-none"></div>
      
      {/* Dynamic Background Noise */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
      
      {/* Decorative animated gradient orbs */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-fuchsia-500 rounded-full mix-blend-screen filter blur-[80px] opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-1000 animate-pulse" style={{ animationDuration: '4s' }}></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-cyan-500 rounded-full mix-blend-screen filter blur-[80px] opacity-30 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000 animate-pulse" style={{ animationDuration: '5s' }}></div>
      
      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="inline-flex items-center px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full text-white font-mono text-[10px] tracking-widest uppercase shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2 animate-pulse"></span>
            Trewrap 2026
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-[10px] font-mono text-purple-300/80 uppercase tracking-[0.2em] ml-1">Identity Confirmed</p>
          <h2 className="text-4xl sm:text-5xl font-black text-white leading-none tracking-tighter break-words">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 filter drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] pb-1 leading-tight">
              {persona}
            </span>
          </h2>
        </div>
        
        <p className="mt-2 text-slate-300 font-mono text-sm leading-relaxed max-w-[90%]">
          {description}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="relative z-10 mt-auto pt-8 flex flex-col gap-3 font-mono w-full">
        {/* Main Stat — Portfolio Value */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 sm:p-5 rounded-2xl shadow-inner transition-transform group-hover:-translate-y-1 duration-500 hover:bg-white/10">
          <div className="flex justify-between items-end mb-3">
            <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Portfolio</div>
            <div className="text-xl sm:text-2xl text-white font-black tracking-tighter">{portfolioDisplay}</div>
          </div>
          <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden shadow-inner">
            <div className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 h-full shadow-[0_0_10px_rgba(56,189,248,0.8)] relative rounded-full" style={{ width: `${progressPct}%` }}>
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/50 blur-[2px]"></div>
            </div>
          </div>
        </div>

        {/* Sub Stats */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-3 sm:p-4 rounded-2xl shadow-inner transition-transform group-hover:-translate-y-1 duration-500 delay-75 hover:bg-white/10 flex flex-col justify-between">
            <div className="text-[10px] text-slate-400 mb-2 uppercase tracking-widest font-semibold">Top Token</div>
            <div className="text-lg sm:text-xl text-white font-black truncate">{stats.topTokenSymbol}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-3 sm:p-4 rounded-2xl shadow-inner transition-transform group-hover:-translate-y-1 duration-500 delay-150 hover:bg-white/10 flex flex-col justify-between">
            <div className="text-[10px] text-slate-400 mb-2 uppercase tracking-widest font-semibold">Transactions</div>
            <div className="text-lg sm:text-xl text-cyan-400 font-black truncate filter drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">{stats.txCount}</div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="relative z-10 mt-6 flex justify-between items-center border-t border-white/10 pt-4">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">Powered by SIM</div>
        </div>
        <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
          <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            <span className="text-slate-900 font-black text-[9px] leading-none">d.</span>
          </div>
          <span className="text-[10px] font-bold text-white tracking-widest uppercase">Dune SIM</span>
        </div>
      </div>
    </div>
  );
}
