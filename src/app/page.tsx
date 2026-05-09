"use client";

import React, { useState, useRef } from 'react';
import { PersonaCard } from '@/components/PersonaCard';
import * as htmlToImage from 'html-to-image';

export default function Home() {
  const [wallet, setWallet] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_resultData, setResultData] = useState<unknown>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    const node = cardRef.current;
    /* v8 ignore next */
    if (node) {
      try {
        const dataUrl = await htmlToImage.toPng(node, { 
          backgroundColor: '#020617', // slate-950 to match background
          pixelRatio: 2 
        });
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "trewrap-persona.png";
        link.click();
      } catch (err) {
        console.error("Failed to download image", err);
      }
    }
  };

  const handleShare = () => {
    const text = encodeURIComponent("I just discovered my on-chain persona using Trewrap! What's yours?");
    const url = encodeURIComponent("https://trewrap.edycu.dev");
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

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
    <main className="min-h-screen p-4 sm:p-6 md:p-12 flex flex-col relative overflow-hidden bg-slate-950">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-600/20 blur-[150px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
        <div className="absolute top-[30%] left-[50%] w-[500px] h-[500px] bg-pink-600/10 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay"></div>
      </div>

      <div className="w-full max-w-5xl mx-auto z-10 relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center my-auto py-12">
        
        <div className="space-y-8 md:space-y-10">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 md:mb-6 tracking-tighter leading-[1.1]">
              Discover your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 filter drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]">on-chain</span> <br/>
              persona.
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-lg">
              We analyze your behavioral signals using Dune SQL to roast your crypto trading habits.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block text-purple-400 font-mono text-xs tracking-widest mb-3 uppercase">Solana Wallet Address</label>
              <input 
                type="text" 
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="Enter wallet address..."
                className="w-full bg-slate-900/80 backdrop-blur-sm border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-2xl p-5 text-white outline-none transition-all font-mono shadow-inner"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                type="submit"
                disabled={loading || !wallet}
                className={`flex-1 py-4 sm:py-5 rounded-2xl font-bold tracking-widest text-sm transition-all ${
                  loading || !wallet
                    ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-800'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] hover:-translate-y-1'
                }`}
              >
                {loading ? 'ANALYZING ON DUNE...' : 'GENERATE WRAPPED'}
              </button>
              <button
                type="button"
                onClick={() => setWallet('7o1kM4ZkLHKoBxCg6ZtWjE2nN3zE6W18')}
                className="px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold tracking-widest text-sm transition-all bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 hover:-translate-y-1"
              >
                TEST WALLET
              </button>
            </div>
          </form>

          <div className="pt-6 border-t border-slate-800/50">
            <div className="text-xs text-slate-500 font-mono mb-3 tracking-widest uppercase">Recent Personas Discovered</div>
            <div className="flex gap-2 flex-wrap">
              {['Exit Liquidity Human', 'Ape Extraordinaire', 'Diamond Hands', 'Jeet'].map(p => (
                <span key={p} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/80 px-4 py-1.5 rounded-full text-xs font-medium text-slate-400">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end w-full">
          {showResult ? (
            <div className="animate-in fade-in slide-in-from-right-8 duration-1000 w-full max-w-sm">
              <div ref={cardRef} className="rounded-[3rem] bg-slate-950 p-2 -m-2">
                <PersonaCard />
              </div>
              <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 w-full">
                <button onClick={handleDownload} className="flex-1 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-white py-3 sm:py-4 rounded-2xl transition-all font-bold text-sm tracking-wide shadow-lg hover:-translate-y-1">
                  Download
                </button>
                <button onClick={handleShare} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 sm:py-4 rounded-2xl transition-all font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-1">
                  Share on X
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-sm min-h-[500px] bg-slate-900/30 backdrop-blur-sm border-2 border-slate-800/50 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center text-slate-500 p-10 text-center transition-all hover:border-slate-700/50 hover:bg-slate-900/40">
              <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">👀</span>
              </div>
              <p className="text-lg font-medium leading-relaxed">Enter your wallet address to reveal your true on-chain identity.</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
