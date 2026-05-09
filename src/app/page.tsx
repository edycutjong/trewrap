"use client";

import React, { useState } from 'react';
import { PersonaCard } from '@/components/PersonaCard';

export default function Home() {
  const [wallet, setWallet] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_resultData, setResultData] = useState<unknown>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) return;
    
    setLoading(true);
    
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: wallet })
      });
      if (res.ok) {
        const data = await res.json();
        setResultData(data);
      }
    } catch (err) {
      console.error(err);
    }
    
    setLoading(false);
    setShowResult(true);
  };

  return (
    <main className="min-h-screen p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden bg-slate-950">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
        <div className="absolute top-[20%] left-[60%] w-[400px] h-[400px] bg-pink-600/20 blur-[100px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="w-full max-w-4xl mx-auto z-10 relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        <div className="space-y-8">
          <div>
            <h1 className="text-6xl font-black text-white mb-4 tracking-tighter">
              Discover your <br/>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-pink-500">on-chain</span> <br/>
              persona.
            </h1>
            <p className="text-slate-400 text-lg">
              We analyze 5 behavioral signals using Dune SQL to roast your crypto trading habits.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-purple-400 font-mono text-xs mb-2">SOLANA WALLET ADDRESS</label>
              <input 
                type="text" 
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="Enter wallet address..."
                className="w-full bg-slate-900 border-2 border-slate-800 focus:border-purple-500 rounded-xl p-4 text-white outline-none transition-colors font-mono"
              />
            </div>
            <div className="flex gap-2">
              <button 
                type="submit"
                disabled={loading || !wallet}
                className={`flex-1 py-4 rounded-xl font-bold tracking-widest text-sm transition-all ${
                  loading || !wallet
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                }`}
              >
                {loading ? 'ANALYZING ON DUNE...' : 'GENERATE WRAPPED'}
              </button>
              <button
                type="button"
                onClick={() => setWallet('7o1kM4ZkLHKoBxCg6ZtWjE2nN3zE6W18')}
                className="px-6 py-4 rounded-xl font-bold tracking-widest text-sm transition-all bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                TEST WALLET
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-slate-800">
            <div className="text-xs text-slate-500 font-mono mb-2">RECENT PERSONAS DISCOVERED</div>
            <div className="flex gap-2 flex-wrap">
              {['Exit Liquidity Human', 'Ape Extraordinaire', 'Diamond Hands', 'Jeet'].map(p => (
                <span key={p} className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-xs text-slate-400">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          {showResult ? (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 w-full">
              <PersonaCard />
              <div className="mt-4 flex gap-2 w-full max-w-sm mx-auto">
                <button className="flex-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white py-3 rounded-xl transition-colors font-bold text-sm">
                  Download
                </button>
                <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl transition-colors font-bold text-sm">
                  Share on X
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-sm aspect-4/5 bg-slate-900/50 border-2 border-slate-800 border-dashed rounded-3xl flex flex-col items-center justify-center text-slate-600 p-8 text-center">
              <span className="text-4xl mb-4">👀</span>
              <p>Enter your wallet address to reveal your true on-chain identity.</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
