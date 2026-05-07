import React from 'react';

export function PersonaCard({ persona = "Exit Liquidity Human", stats = {} }: { persona?: string, stats?: any }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 to-slate-900 border border-purple-500/30 rounded-3xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.2)] aspect-[4/5] flex flex-col justify-between max-w-sm mx-auto w-full group">
      
      {/* Decorative gradient orb */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
      
      <div className="relative z-10">
        <div className="text-purple-400 font-bold tracking-widest text-xs mb-2">TREWRAP 2026</div>
        <h2 className="text-4xl font-black text-white leading-tight">You are:<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{persona}</span></h2>
        
        <p className="mt-4 text-slate-300 font-mono text-sm leading-relaxed">
          You traded 847 times last quarter. Your average hold time was 4 minutes. Your bags are heavy, knees weak, arms are heavy.
        </p>
      </div>

      <div className="relative z-10 space-y-4 font-mono">
        <div className="bg-black/40 backdrop-blur border border-purple-500/20 p-4 rounded-xl">
          <div className="text-xs text-purple-400 mb-1">Win Rate</div>
          <div className="text-xl text-white font-bold">12.4%</div>
          <div className="w-full bg-slate-800 h-1 mt-2 rounded-full overflow-hidden">
            <div className="bg-purple-500 h-full w-[12.4%]"></div>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur border border-purple-500/20 p-4 rounded-xl flex justify-between items-center">
          <div>
            <div className="text-xs text-purple-400 mb-1">Top Traded Token</div>
            <div className="text-lg text-white font-bold">$WIF</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-purple-400 mb-1">Total PnL</div>
            <div className="text-lg text-red-400 font-bold">-$4,250</div>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 mt-6 flex justify-between items-end">
        <div className="text-xs text-slate-500 font-mono">Powered by Dune SQL</div>
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
          <span className="text-purple-900 font-black text-xs">d.</span>
        </div>
      </div>
    </div>
  );
}
