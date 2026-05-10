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
    <main className="min-h-screen p-4 sm:p-6 md:p-12 flex flex-col relative overflow-hidden bg-[#020617] text-slate-200">
      {/* Immersive Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '6s' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-cyan-500/20 blur-[130px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }}></div>
        <div className="absolute top-[20%] left-[50%] w-[500px] h-[500px] bg-pink-500/15 blur-[100px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '7s', animationDelay: '2s' }}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.25] mix-blend-overlay"></div>
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)]"></div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-6xl mx-auto z-10 relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center my-auto py-12 lg:py-24">
        
        {/* Left Column: Hero & Input */}
        <div className="space-y-10 md:space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_20px_rgba(168,85,247,0.15)]">
              <span className="flex h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></span>
              <span className="text-xs font-medium text-slate-300 uppercase tracking-widest font-mono">Dune SIM API Live</span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.05]">
              Discover your <br className="hidden sm:block"/>
              <span className="relative">
                <span className="absolute -inset-2 blur-2xl bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-40"></span>
                <span className="relative text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-purple-500 to-pink-500">
                  on-chain
                </span>
              </span> <br className="hidden sm:block"/>
              persona.
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-lg">
              We analyze your behavioral signals using real-time SVM data to roast your crypto trading habits. No fluff, just pure data.
            </p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-6 relative group">
            {/* Glow behind the input area */}
            <div className="absolute -inset-0.5 bg-linear-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            
            <div className="relative bg-[#0a0f25]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <label className="block text-purple-400 font-mono text-xs tracking-widest mb-4 uppercase">Solana Wallet Address</label>
              <input 
                type="text" 
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                placeholder="Enter wallet address..."
                className="w-full bg-slate-900/50 backdrop-blur-md border border-slate-700/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 rounded-2xl p-5 sm:p-6 text-white outline-none transition-all font-mono shadow-inner text-sm sm:text-base placeholder:text-slate-600"
              />
              
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button 
                  type="submit"
                  disabled={loading || !wallet}
                  className={`flex-1 py-4 sm:py-5 rounded-2xl font-bold tracking-widest text-sm transition-all duration-300 relative overflow-hidden group/btn ${
                    loading || !wallet
                      ? 'bg-slate-800/40 text-slate-500 cursor-not-allowed border border-slate-700/50'
                      : 'bg-white text-slate-950 hover:bg-slate-200 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:-translate-y-1'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      ANALYZING...
                    </span>
                  ) : 'GENERATE WRAPPED'}
                  {/* Subtle shine effect on hover */}
                  {!loading && wallet && (
                    <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] bg-linear-to-r from-transparent via-white/40 to-transparent"></div>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setWallet('vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg')}
                  className="px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold tracking-widest text-sm transition-all duration-300 bg-slate-800/50 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50 hover:border-slate-600 hover:-translate-y-1"
                >
                  TEST WALLET
                </button>
              </div>
            </div>
          </form>

          <div className="pt-8 border-t border-slate-800/60">
            <div className="text-xs text-slate-500 font-mono mb-4 tracking-widest uppercase">Recently Discovered</div>
            <div className="flex gap-3 flex-wrap">
              {['Exit Liquidity Human', 'Ape Extraordinaire', 'Diamond Hands', 'Jeet'].map(p => (
                <span key={p} className="bg-slate-900/60 backdrop-blur-md border border-slate-800 hover:border-slate-600 transition-colors cursor-default px-5 py-2 rounded-full text-xs font-semibold text-slate-400">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Result Card */}
        <div className="flex justify-center lg:justify-end w-full relative perspective-[2000px]">
          {showResult ? (
            <div className="animate-in fade-in slide-in-from-right-12 duration-1000 w-full max-w-[400px]">
              <div ref={cardRef} className="rounded-[3rem] bg-slate-950 p-2 shadow-2xl relative transform-gpu hover:scale-[1.02] transition-transform duration-500">
                <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-[3rem] blur-xl opacity-30"></div>
                <div className="relative">
                  <PersonaCard />
                </div>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
                <button onClick={handleDownload} className="flex-1 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 hover:bg-slate-700 hover:border-slate-600 text-white py-4 rounded-2xl transition-all duration-300 font-bold text-sm tracking-wide shadow-lg hover:-translate-y-1">
                  Download Card
                </button>
                <button onClick={handleShare} className="flex-1 bg-blue-600/90 backdrop-blur-md hover:bg-blue-500 text-white py-4 rounded-2xl transition-all duration-300 font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-1">
                  Share on X
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-[400px] aspect-[3/4] bg-slate-900/20 backdrop-blur-xl border border-slate-800/50 rounded-[3rem] flex flex-col items-center justify-center text-slate-500 p-10 text-center transition-all duration-700 relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              {/* Holographic scanner effect */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[scan_3s_ease-in-out_infinite] animate-[scan_3s_ease-in-out_infinite]" style={{ animationPlayState: 'paused' }}></div>

              <div className="w-24 h-24 rounded-full bg-slate-800/30 border border-slate-700/50 flex items-center justify-center mb-8 relative">
                <div className="absolute inset-0 rounded-full border border-purple-500/20 group-hover:border-purple-500/50 transition-colors duration-500 group-hover:animate-ping"></div>
                <span className="text-4xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform duration-500">✨</span>
              </div>
              <h3 className="text-xl font-bold text-slate-300 mb-3">Awaiting Wallet</h3>
              <p className="text-base font-medium leading-relaxed text-slate-500">Enter your address to generate a personalized on-chain trading card.</p>
            </div>
          )}
        </div>

      </div>
      
      {/* Custom Keyframes for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(300px); }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </main>
  );
}
