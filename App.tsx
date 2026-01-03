
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AppRoute, User, UserRole, Job, Application } from './types';
import { api } from './services/api';
import { analyzeResumeForJob } from './services/geminiService';
import { generateResumeHash } from './services/solanaService';
import Layout from './components/Layout';

// --- Sub-Components ---

const Landing: React.FC<{ onNavigate: (r: AppRoute) => void }> = ({ onNavigate }) => {
  const fixesRef = useRef<HTMLDivElement>(null);
  const blockchainRef = useRef<HTMLDivElement>(null);
  const impactRef = useRef<HTMLDivElement>(null);

  const scrollContainer = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = ref.current.clientWidth;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-24 pb-20 overflow-hidden bg-[#05070a]">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center relative px-6 pt-24">
        <div className="blob -top-20 -left-20 opacity-40"></div>
        <div className="blob -bottom-20 -right-20 opacity-30" style={{ animationDelay: '4s' }}></div>
        
        <div className="space-y-8 max-w-5xl animate-fade-in relative z-10">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-[#14F195] shadow-2xl">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14F195] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#14F195]"></span>
            </span>
            Production Protocol Live
          </div>
          
          <h1 className="text-6xl sm:text-[8rem] font-black tracking-tighter leading-none text-white">
            HireTrust <br/>
            <span className="solana-text-gradient">Verifiable Merit.</span>
          </h1>
          
          <p className="text-lg sm:text-2xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
            Eliminate resume fraud forever. Authenticated identity and skill proofs secured by Solana L1 and Gemini AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <button 
              onClick={() => onNavigate(AppRoute.CANDIDATE_DASHBOARD)}
              className="group px-10 py-5 solana-gradient rounded-2xl font-black text-white text-xl shadow-[0_20px_40px_rgba(20,241,149,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
            >
              Candidate Nexus <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
            </button>
            <button 
              onClick={() => onNavigate(AppRoute.RECRUITER_DASHBOARD)}
              className="px-10 py-5 bg-white/5 border border-white/20 rounded-2xl font-black text-white text-xl hover:bg-white/10 transition-all flex items-center gap-4 backdrop-blur-xl"
            >
              Recruiter Suite <i className="fas fa-user-tie text-[#9945FF]"></i>
            </button>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-slate-700">
          <p className="text-[10px] font-black uppercase tracking-widest mb-2">Discover Vision</p>
          <i className="fas fa-chevron-down text-2xl"></i>
        </div>
      </section>

      {/* Section 1: What HireTrust Fixes (Interactive Slide) */}
      <section id="fixes" className="container mx-auto px-6 space-y-12 reveal">
        <div className="text-center space-y-4">
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter">What HireTrust Fixes</h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-bold uppercase tracking-[0.4em] text-xs">Modern solutions for legacy hiring failures</p>
        </div>

        <div className="relative group">
          <div 
            ref={fixesRef}
            className="snap-x-container pb-4"
          >
            {[
              { icon: 'fa-user-ninja', prob: 'Fake Resumes', sol: 'Cryptographic proof verified on-chain.', color: 'text-red-400', bg: 'bg-red-500/5' },
              { icon: 'fa-fingerprint', prob: 'Identity Theft', sol: 'Wallet-based signatures unique to the candidate.', color: 'text-blue-400', bg: 'bg-blue-500/5' },
              { icon: 'fa-microchip', prob: 'ATS Confusion', sol: 'Gemini AI extracts unbiased technical merit.', color: 'text-[#14F195]', bg: 'bg-[#14F195]/5' },
              { icon: 'fa-bolt', prob: 'Verif. Lag', sol: 'Zero-delay cryptographic checks (Sub-second).', color: 'text-purple-400', bg: 'bg-purple-500/5' },
              { icon: 'fa-scale-unbalanced', prob: 'Network Bias', sol: 'Equality through immutable merit scoring.', color: 'text-yellow-400', bg: 'bg-yellow-500/5' },
              { icon: 'fa-shield-halved', prob: 'Data Silos', sol: 'Portable credentials that YOU own.', color: 'text-green-400', bg: 'bg-green-500/5' }
            ].map((item, i) => (
              <div key={i} className="snap-item">
                <div className={`glass-card p-10 rounded-[2.5rem] h-full space-y-6 flex flex-col justify-between border-white/5 hover:border-white/20 transition-all ${item.bg}`}>
                  <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl ${item.color} shadow-2xl`}>
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-red-400/80 text-[10px] font-black uppercase tracking-widest line-through block">Problem: {item.prob}</span>
                      <h3 className="text-2xl font-black text-white leading-tight">Solution: {item.sol}</h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button onClick={() => scrollContainer(fixesRef, 'left')} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all z-20 hidden md:flex backdrop-blur-md">
            <i className="fas fa-chevron-left"></i>
          </button>
          <button onClick={() => scrollContainer(fixesRef, 'right')} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all z-20 hidden md:flex backdrop-blur-md">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </section>

      {/* Section 2: Why Blockchain? (Interactive Comparison) */}
      <section id="blockchain" className="relative reveal">
        <div className="absolute inset-0 bg-purple-600/5 -skew-y-3 pointer-events-none"></div>
        <div className="container mx-auto px-6 relative py-20 space-y-16">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
            <div className="lg:w-5/12 space-y-6">
              <h2 className="text-5xl sm:text-6xl font-black leading-none text-white tracking-tighter">Why Blockchain?</h2>
              <p className="text-xl text-slate-400 leading-relaxed font-medium">Traditional hiring relies on trust. HireTrust relies on <span className="text-white underline decoration-[#14F195] underline-offset-8">Mathematics</span>. Solana turns merit into an immutable public record.</p>
              
              <div className="grid grid-cols-1 gap-6">
                {[
                  { icon: 'fa-lock', label: 'Immutability', desc: 'Records once verified on Solana cannot be modified or hidden.' },
                  { icon: 'fa-network-wired', label: 'Decentralized', desc: 'Own your career history without relying on a central authority.' },
                  { icon: 'fa-eye', label: 'Universal Proof', desc: 'Verified once, accepted everywhere. No more background check delays.' }
                ].map((feat, i) => (
                  <div key={i} className="flex gap-5 items-start group">
                    <div className="mt-1 w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 text-lg border border-purple-500/20 group-hover:bg-[#14F195]/10 group-hover:text-[#14F195] group-hover:border-[#14F195]/20 transition-all">
                      <i className={`fas ${feat.icon}`}></i>
                    </div>
                    <div>
                      <p className="font-black text-xl text-white mb-1">{feat.label}</p>
                      <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-6/12 w-full space-y-6">
              <div 
                ref={blockchainRef}
                className="snap-x-container rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl"
              >
                {/* Slide 1: DB vs BC */}
                <div className="snap-item p-0">
                  <div className="grid grid-cols-2 bg-black/40 h-full">
                    <div className="p-10 border-r border-b border-white/5 space-y-6">
                       <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Old System (DB)</h4>
                       <ul className="space-y-4 text-base font-bold text-slate-400">
                          <li className="flex items-center gap-3"><i className="fas fa-times-circle text-red-500/50"></i> Alterable</li>
                          <li className="flex items-center gap-3"><i className="fas fa-times-circle text-red-500/50"></i> Centralized</li>
                          <li className="flex items-center gap-3"><i className="fas fa-times-circle text-red-500/50"></i> Private</li>
                          <li className="flex items-center gap-3"><i className="fas fa-times-circle text-red-500/50"></i> Fragile Trust</li>
                       </ul>
                    </div>
                    <div className="p-10 border-b border-white/5 space-y-6 bg-[#14F195]/5">
                       <h4 className="text-[10px] font-black text-[#14F195] uppercase tracking-widest">HireTrust (BC)</h4>
                       <ul className="space-y-4 text-base font-bold text-white">
                          <li className="flex items-center gap-3"><i className="fas fa-check-circle text-[#14F195]"></i> Immutable</li>
                          <li className="flex items-center gap-3"><i className="fas fa-check-circle text-[#14F195]"></i> Distributed</li>
                          <li className="flex items-center gap-3"><i className="fas fa-check-circle text-[#14F195]"></i> Verifiable</li>
                          <li className="flex items-center gap-3"><i className="fas fa-check-circle text-[#14F195]"></i> Hard Merit</li>
                       </ul>
                    </div>
                    <div className="col-span-2 p-8 bg-white/5 flex flex-col justify-center text-center">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-2">Core Technology</p>
                       <p className="text-2xl font-black text-white italic">"Trust math, not humans."</p>
                    </div>
                  </div>
                </div>

                {/* Slide 2: Why Solana */}
                <div className="snap-item p-0">
                  <div className="p-10 bg-gradient-to-br from-[#9945FF]/20 to-[#14F195]/20 h-full flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-xs font-black text-[#14F195] uppercase tracking-widest">Network Focus</h4>
                      <h3 className="text-4xl font-black text-white leading-tight">Solana Mainnet</h3>
                      <p className="text-sm text-slate-300">The world's most performant blockchain is the foundation for global talent verification.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                       {[
                         { icon: 'fa-bolt', val: '65K', label: 'TPS Speed' },
                         { icon: 'fa-coins', val: '<$0.01', label: 'Avg. Fee' },
                         { icon: 'fa-cube', val: '400ms', label: 'Block Time' },
                         { icon: 'fa-earth-americas', val: 'Global', label: 'Verifiability' }
                       ].map((stat, i) => (
                         <div key={i} className="space-y-1">
                           <p className="text-xl font-black text-white flex items-center gap-2">
                             <i className={`fas ${stat.icon} text-[#14F195] text-xs`}></i> {stat.val}
                           </p>
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <button onClick={() => scrollContainer(blockchainRef, 'left')} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"><i className="fas fa-chevron-left text-sm"></i></button>
                <button onClick={() => scrollContainer(blockchainRef, 'right')} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"><i className="fas fa-chevron-right text-sm"></i></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Impact HireTrust Creates (Animated Slides) */}
      <section id="impact" className="container mx-auto px-6 space-y-12 reveal">
        <div className="text-center space-y-4">
          <h2 className="text-5xl sm:text-7xl font-black text-white tracking-tighter">Impact</h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-bold uppercase tracking-[0.4em] text-xs">Transforming the global hiring ecosystem</p>
        </div>

        <div className="relative group">
          <div 
            ref={impactRef}
            className="snap-x-container pb-6"
          >
            {[
              { 
                role: 'Candidates', 
                icon: 'fa-user-graduate', 
                color: 'text-[#14F195]',
                bg: 'bg-[#14F195]/5',
                features: [
                  'Portable Verifiable Resume', 
                  'Instant Skill Credentialing', 
                  'Direct Proof of merit',
                  'Own your career data forever'
                ]
              },
              { 
                role: 'Recruiters', 
                icon: 'fa-magnifying-glass-chart', 
                color: 'text-purple-400',
                bg: 'bg-purple-500/5',
                features: [
                  '80% Reduction in screening', 
                  'Validated Identity assurance', 
                  'Objective AI merit analysis',
                  'Zero fake candidates'
                ]
              },
              { 
                role: 'Companies', 
                icon: 'fa-building-shield', 
                color: 'text-blue-400',
                bg: 'bg-blue-500/5',
                features: [
                  'Rapid Time-to-Hire speed', 
                  'Lower verification cost', 
                  'Higher talent retention',
                  'Immutable talent pipeline'
                ]
              }
            ].map((card, i) => (
              <div key={i} className="snap-item">
                <div className={`glass-card p-10 rounded-[3rem] h-full space-y-8 flex flex-col justify-between border-white/5 hover:border-white/30 transition-all ${card.bg}`}>
                   <div className="space-y-6">
                     <div className={`w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-3xl ${card.color} shadow-2xl`}>
                       <i className={`fas ${card.icon}`}></i>
                     </div>
                     <div className="space-y-3">
                       <h3 className="text-3xl font-black text-white">{card.role}</h3>
                       <ul className="space-y-4">
                          {card.features.map((f, j) => (
                            <li key={j} className="flex gap-3 text-base font-bold text-slate-300 leading-tight">
                              <i className={`fas fa-check-circle mt-1 ${card.color}`}></i>
                              {f}
                            </li>
                          ))}
                       </ul>
                     </div>
                   </div>
                   <button onClick={() => onNavigate(AppRoute.LOGIN)} className="w-full py-4 mt-6 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-[#14F195] hover:text-black transition-all">Activate Profile</button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4">
            <button onClick={() => scrollContainer(impactRef, 'left')} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"><i className="fas fa-chevron-left text-sm"></i></button>
            <button onClick={() => scrollContainer(impactRef, 'right')} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"><i className="fas fa-chevron-right text-sm"></i></button>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-6 reveal">
         <div className="bg-gradient-to-br from-purple-900/40 to-[#14F195]/20 rounded-[4rem] p-16 text-center space-y-8 relative overflow-hidden border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
            <div className="space-y-4 relative z-10">
              <h2 className="text-5xl sm:text-6xl font-black leading-none text-white tracking-tighter">The Future of Merit <br/>is On-Chain.</h2>
              <p className="text-xl text-white/70 max-w-3xl mx-auto font-medium">Join 50,000+ verified professionals building their careers on HireTrust. Trust is no longer a referral away—it's a signature away.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 relative z-10 pt-2">
               <button onClick={() => onNavigate(AppRoute.LOGIN)} className="px-12 py-5 solana-gradient rounded-[1.5rem] font-black text-white text-xl shadow-2xl hover:scale-105 transition-all">Get Started Now</button>
               <button className="px-12 py-5 bg-black/40 border border-white/20 rounded-[1.5rem] font-black text-white text-xl hover:bg-black/60 transition-all backdrop-blur-xl">Read Whitepaper</button>
            </div>

            <div className="blob -top-40 -left-40 opacity-40"></div>
            <div className="blob -bottom-40 -right-40 opacity-30" style={{ animationDelay: '5s' }}></div>
         </div>
      </section>

      {/* Section 6: Why HireTrust is Hackathon Ready (Icons Only) */}
      <section className="container mx-auto px-6 py-12 text-center space-y-12 reveal">
         <h3 className="text-[10px] font-black uppercase tracking-[1em] text-slate-600">Technological Foundation</h3>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { l: 'Gemini 2.5 Pro', i: 'fa-microchip', color: 'text-blue-400' },
              { l: 'Solana Mainnet', i: 'fa-cube', color: 'text-[#14F195]' },
              { l: 'Decentralized ID', i: 'fa-id-card-clip', color: 'text-purple-400' },
              { l: 'Zero-Knowledge Proofs', i: 'fa-mask', color: 'text-yellow-400' }
            ].map(h => (
              <div key={h.l} className="space-y-3 group cursor-default">
                 <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto ${h.color} border border-white/5 group-hover:scale-110 group-hover:border-white/20 transition-all duration-500`}>
                    <i className={`fas ${h.i} text-xl`}></i>
                 </div>
                 <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-white transition-colors">{h.l}</p>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
};

const Login: React.FC<{ 
  onAuthSuccess: (u: User) => void, 
  onBack: () => void 
}> = ({ onAuthSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await api.register({ email, password: pass, role: UserRole.CANDIDATE });
        setIsRegister(false);
        alert("Registration successful! Please login.");
      } else {
        const u = await api.login(email, pass);
        onAuthSuccess(u);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 animate-fade-in bg-[#05070a]">
      <div className="blob top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20"></div>
      <div className="glass-card w-full max-w-lg p-12 rounded-[3rem] space-y-8 shadow-[0_40px_80px_rgba(0,0,0,0.8)] relative overflow-hidden border-white/10">
        <div className="absolute top-0 left-0 w-full h-1.5 solana-gradient"></div>
        <button onClick={onBack} className="text-slate-500 hover:text-white transition-colors flex items-center gap-3 text-xs font-black uppercase tracking-widest">
          <i className="fas fa-chevron-left"></i> Exit to Vision
        </button>
        <div className="text-center space-y-3">
          <h2 className="text-4xl font-black text-white tracking-tighter">{isRegister ? 'Join Protocol' : 'Welcome Back'}</h2>
          <p className="text-sm text-slate-400 font-medium">Secure authentication for HireTrust Nexus</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Credential Email</label>
            <input 
              type="email" placeholder="name@company.com" required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#14F195] transition-all text-white placeholder:text-slate-700 font-medium"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Security Pass</label>
            <input 
              type="password" placeholder="••••••••" required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#14F195] transition-all text-white placeholder:text-slate-700 font-medium"
              value={pass} onChange={e => setPass(e.target.value)}
            />
          </div>
          {error && <p className="text-red-400 text-xs text-center font-black bg-red-400/10 py-3 rounded-xl border border-red-500/20">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-4 solana-gradient rounded-2xl font-black text-white text-lg shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : (isRegister ? 'Create Secure Profile' : 'Authenticate')}
          </button>
        </form>

        <div className="text-center space-y-6">
          <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="text-xs text-[#14F195] font-black hover:underline tracking-widest uppercase">
            {isRegister ? 'Existing User? Sign In' : 'New Candidate? Register Protocol'}
          </button>
          <div className="pt-6 border-t border-white/5 space-y-2">
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-[0.3em]">Demo Recruiter Environment</p>
            <div className="flex justify-between items-center text-[11px] font-mono bg-black/60 p-4 rounded-xl border border-white/5">
              <span className="text-slate-400">abc@abc.com</span>
              <span className="text-[#9945FF]">12345678</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CandidateDashboard: React.FC<{ 
  user: User, 
  jobs: Job[], 
  applications: Application[],
  onApply: (j: Job) => void,
  onLogout: () => void 
}> = ({ user, jobs, applications, onApply, onLogout }) => {
  const [timeFilter, setTimeFilter] = useState<'recent' | '7d' | '30d'>('recent');

  const filteredJobs = useMemo(() => {
    const now = Date.now();
    return jobs
      .filter(j => j.status === 'active')
      .filter(j => {
        if (timeFilter === 'recent') return true;
        const diff = now - j.createdAt;
        const limit = timeFilter === '7d' ? 7 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
        return diff <= limit;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [jobs, timeFilter]);

  const hasApplied = (jobId: string) => applications.some(a => a.jobId === jobId);

  return (
    <div className="space-y-10 animate-fade-in py-16 container mx-auto px-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <h2 className="text-5xl font-black text-white tracking-tighter leading-none">Candidate <span className="solana-text-gradient">Nexus</span></h2>
          <div className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#14F195] shadow-[0_0_8px_#14F195]"></div>
            Authenticated: <span className="text-white">{user.email}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-xl">
            <button onClick={() => setTimeFilter('recent')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${timeFilter === 'recent' ? 'bg-[#14F195] text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}>Recent</button>
            <button onClick={() => setTimeFilter('7d')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${timeFilter === '7d' ? 'bg-[#14F195] text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}>7D</button>
            <button onClick={() => setTimeFilter('30d')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${timeFilter === '30d' ? 'bg-[#14F195] text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}>30D</button>
          </div>
          <button onClick={onLogout} className="px-5 py-2.5 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">
            Exit Nexus
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.length === 0 ? (
          <div className="col-span-full glass-card p-24 text-center rounded-[3rem] border-dashed border-2 border-white/5">
            <i className="fas fa-search-minus text-5xl text-slate-800 mb-6 block"></i>
            <p className="text-slate-500 font-black text-xl uppercase tracking-widest">Zero Matching Roles Found</p>
          </div>
        ) : filteredJobs.map(j => {
          const applied = hasApplied(j.id);
          return (
            <div key={j.id} className="glass-card p-10 rounded-[2.5rem] space-y-5 group flex flex-col justify-between h-full border-white/5 hover:border-white/20">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
                    j.role === 'Cloud' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                    j.role === 'DevOps' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-[#14F195]/10 text-[#14F195] border-[#14F195]/20'
                  }`}>
                    {j.role}
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono font-black uppercase">{new Date(j.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-3xl font-black text-white group-hover:text-[#14F195] transition-colors leading-tight tracking-tighter">{j.title}</h3>
                <p className="text-base text-slate-400 line-clamp-3 leading-relaxed font-medium">{j.description}</p>
              </div>
              
              {applied ? (
                <div className="w-full mt-6 py-4 bg-white/5 text-[#14F195] rounded-2xl font-black text-center border border-[#14F195]/20 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]">
                   <i className="fas fa-check-double text-base"></i> Merit Verified
                </div>
              ) : (
                <button 
                  onClick={() => onApply(j)}
                  className="w-full mt-6 py-5 solana-gradient text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all hover:scale-[1.03] active:scale-95 shadow-xl shadow-[#14F195]/10"
                >
                  Apply & Secure Proof
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Apply: React.FC<{ 
  job: Job, 
  user: User, 
  allJobs: Job[],
  onBack: () => void, 
  onApplyToJob: (j: Job) => void,
  onSuccess: () => void
}> = ({ job, user, allJobs, onBack, onApplyToJob, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const recommendations = useMemo(() => {
    return allJobs
      .filter(j => j.id !== job.id && j.status === 'active')
      .slice(0, 3);
  }, [allJobs, job]);

  const handleApply = async () => {
    if (!file || !job || !user) return;
    setLoading(true);
    setStatus('Hashing Credentials...');
    try {
      const hash = await generateResumeHash(file);
      setStatus('AI Intelligence Audit...');
      const result = await analyzeResumeForJob(file, job);
      
      const app: Application = {
        id: Math.random().toString(36).substr(2, 9),
        jobId: job.id,
        candidateEmail: user.email,
        resumeHash: hash,
        aiScore: result.score,
        status: 'Verified',
        timestamp: Date.now(),
        analysis: result
      };

      await api.submitApplication(app);
      setIsSuccess(true);
      onSuccess();
    } catch (err) {
      setStatus('System Error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-16 px-6">
      <button onClick={onBack} className="text-slate-500 hover:text-white flex items-center gap-3 font-black text-xs uppercase tracking-widest transition-colors">
        <i className="fas fa-chevron-left"></i> All Opportunities
      </button>

      {!isSuccess ? (
        <div className="glass-card p-12 rounded-[3.5rem] space-y-8 border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
          <div className="text-center space-y-3">
             <span className="text-[11px] font-black text-[#14F195] uppercase tracking-[0.5em]">Candidate Submission</span>
            <h2 className="text-5xl font-black text-white tracking-tighter leading-none">Apply for {job.title}</h2>
            <p className="text-lg text-slate-400 font-medium">Your resume will be audited by Gemini 2.5 Pro and hashed on Solana.</p>
          </div>

          <div className="relative group cursor-pointer">
            <input 
              type="file" accept=".pdf" id="resume" className="hidden" 
              onChange={e => setFile(e.target.files?.[0] || null)} 
            />
            <label htmlFor="resume" className="cursor-pointer block border-2 border-dashed border-white/10 rounded-[2.5rem] p-16 text-center hover:border-[#14F195]/50 hover:bg-[#14F195]/5 transition-all duration-500">
              <div className="w-20 h-20 bg-white/5 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                <i className={`fas ${file ? 'fa-check-double text-[#14F195]' : 'fa-file-pdf text-red-500'} text-4xl`}></i>
              </div>
              <span className="block font-black text-xl text-white tracking-tight">{file ? file.name : 'Select PDF Credentials'}</span>
              <span className="block text-xs text-slate-600 font-black uppercase tracking-widest mt-3">Verified by HireTrust Protocol</span>
            </label>
          </div>

          <button 
            disabled={!file || loading}
            onClick={handleApply}
            className="w-full py-5 solana-gradient rounded-2xl font-black text-white text-lg shadow-2xl disabled:opacity-20 transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-[0.2em]"
          >
            {loading ? <><i className="fas fa-circle-notch fa-spin mr-3"></i> {status}</> : 'Submit & Secure Proof'}
          </button>
        </div>
      ) : (
        <div className="space-y-16">
          <div className="glass-card p-16 rounded-[4rem] space-y-8 border-2 border-[#14F195]/30 animate-scale-up shadow-[0_30px_70px_rgba(20,241,149,0.1)] bg-[#14F195]/5 text-center">
            <div className="w-24 h-24 bg-[#14F195] text-black rounded-full flex items-center justify-center mx-auto text-4xl shadow-[0_0_40px_rgba(20,241,149,0.5)] animate-bounce">
              <i className="fas fa-check"></i>
            </div>
            <div className="space-y-4">
              <h2 className="text-6xl font-black tracking-tighter text-white leading-none">Proof Immutable.</h2>
              <p className="text-xl text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
                🎉 Verification complete! You have successfully secured your position in the pipeline for <span className="text-[#14F195]">{job.title}</span>.
              </p>
            </div>
            <button onClick={onBack} className="px-10 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-white transition-all border border-white/10 uppercase tracking-[0.3em] text-xs">
              Back to Dashboard
            </button>
          </div>

          <div className="space-y-8">
            <h3 className="text-3xl font-black flex items-center gap-4 text-white tracking-tighter">
              <i className="fas fa-bolt text-[#14F195]"></i> 
              Next Opportunities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map(rj => (
                <div key={rj.id} className="glass-card p-8 rounded-[2.5rem] space-y-5 hover:border-[#14F195]/40 transition-all group flex flex-col justify-between border-white/5">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{rj.role}</span>
                    <h4 className="font-black text-xl text-white group-hover:text-[#14F195] transition-colors leading-tight tracking-tighter">{rj.title}</h4>
                  </div>
                  <button onClick={() => { setIsSuccess(false); setFile(null); onApplyToJob(rj); }} className="w-full py-3 bg-white/5 hover:bg-[#14F195] hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Apply Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RecruiterDashboard: React.FC<{ 
  user: User, 
  jobs: Job[], 
  onPostJob: () => void,
  onLogout: () => void,
  onRefresh: () => void
}> = ({ user, jobs, onPostJob, onLogout, onRefresh }) => {
  const [apps, setApps] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<'jobs' | 'applicants'>('jobs');
  const [loading, setLoading] = useState(true);
  const [viewingApp, setViewingApp] = useState<Application | null>(null);

  useEffect(() => {
    api.getApplications().then(data => {
      setApps(data);
      setLoading(false);
    });
  }, []);

  const handleCloseJob = async (jobId: string) => {
    if (confirm("Cease recruitment for this role? This is a permanent on-chain update for transparency.")) {
      await api.closeJob(jobId);
      onRefresh();
    }
  };

  const getMeritCategory = (score: number) => {
    if (score >= 81) return { label: 'Superior Merit', color: 'bg-green-500/10 text-green-400 border-green-500/30' };
    if (score >= 61) return { label: 'Validated Merit', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' };
    return { label: 'Limited Verification', color: 'bg-red-500/10 text-red-400 border-red-500/30' };
  };

  return (
    <div className="space-y-10 animate-fade-in relative py-16 container mx-auto px-6">
      {viewingApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-3xl animate-fade-in">
          <div className="glass-card w-full max-w-5xl p-12 rounded-[3.5rem] space-y-10 border-2 border-purple-500/20 shadow-[0_0_80px_rgba(153,69,255,0.15)] animate-scale-up max-h-[90vh] overflow-y-auto relative no-scrollbar">
            <button onClick={() => setViewingApp(null)} className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10 text-lg text-white">
                <i className="fas fa-times"></i>
            </button>
            <div className="space-y-3">
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.5em]">System Intelligence Audit</span>
              <h2 className="text-5xl font-black text-white tracking-tighter leading-none">Merit Analysis</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5 space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Candidate Profile Data</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-600 uppercase mb-1">Authenticated Identity</p>
                      <p className="font-bold text-xl text-white truncate">{viewingApp.candidateEmail}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-600 uppercase mb-1">Verified Seniority</p>
                      <p className="font-bold text-xl text-[#14F195]">{viewingApp.analysis.experience_level}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5 space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Core Technical Capabilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewingApp.analysis.strengths.map(s => (
                      <span key={s} className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-xl text-xs font-black border border-purple-500/20 shadow-xl">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-black/40 p-8 rounded-[2rem] border border-white/5 space-y-4">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Risk Factor Analysis</h4>
                  <div className="space-y-3">
                    {viewingApp.analysis.risk_flags.map((f, i) => (
                      <div key={i} className="flex gap-3 items-start text-sm text-yellow-500 font-bold leading-relaxed">
                        <i className="fas fa-warning mt-1"></i>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-purple-500/10 p-10 rounded-[3rem] border border-purple-500/20 text-center space-y-2 shadow-2xl shadow-purple-500/10">
                  <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">AI MERIT CONFIDENCE</p>
                  <p className="text-8xl font-black text-white leading-none tracking-tighter">{viewingApp.aiScore}</p>
                  <p className="text-[10px] text-purple-300/60 font-black uppercase tracking-widest">Verified Logic</p>
                </div>
                
                <div className="bg-black/60 p-8 rounded-[2rem] border border-white/10 space-y-3 shadow-inner">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] flex items-center gap-2">
                    <i className="fas fa-link text-[#14F195]"></i> Blockchain Record
                  </p>
                  <div className="flex items-center gap-2 text-[#14F195] text-[11px] font-black uppercase tracking-widest">
                    <i className="fas fa-shield-check"></i> IMMUTABLE PROOF
                  </div>
                  <p className="text-[10px] font-mono text-slate-600 break-all leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">{viewingApp.resumeHash}</p>
                </div>
              </div>
            </div>
            
            <button onClick={() => setViewingApp(null)} className="w-full py-5 bg-purple-600 hover:bg-purple-500 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-[0.3em] shadow-2xl transition-all">Close Integrity Audit</button>
          </div>
        </div>
      )}

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-8 border-b border-white/5">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-purple-500/10 border border-purple-500/20 rounded-[2rem] flex items-center justify-center text-purple-400 text-3xl shadow-2xl">
            <i className="fas fa-user-gear"></i>
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white tracking-tighter leading-none">Recruiter <span className="text-purple-500">Suite</span></h2>
            <div className="flex items-center gap-3 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
              Authenticated: <span className="text-purple-400">{user.email}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <button onClick={onPostJob} className="flex-1 sm:flex-none px-10 py-4 solana-gradient rounded-2xl font-black text-white shadow-2xl hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.2em] text-[10px]">
            + New Listing
          </button>
          <button onClick={onLogout} className="px-6 py-4 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">
            Exit Suite
          </button>
        </div>
      </header>

      <div className="flex gap-2 bg-white/5 p-1.5 rounded-2xl w-fit border border-white/5 backdrop-blur-xl">
        <button 
          onClick={() => setActiveTab('jobs')}
          className={`px-8 py-3 font-black text-xs rounded-xl transition-all uppercase tracking-widest ${activeTab === 'jobs' ? 'bg-purple-500 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
        >
          Active Roles ({jobs.length})
        </button>
        <button 
          onClick={() => setActiveTab('applicants')}
          className={`px-8 py-3 font-black text-xs rounded-xl transition-all uppercase tracking-widest ${activeTab === 'applicants' ? 'bg-purple-500 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
        >
          Verification Nexus ({apps.length})
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center"><i className="fas fa-circle-notch fa-spin text-5xl text-purple-500"></i></div>
      ) : activeTab === 'jobs' ? (
        <div className="grid grid-cols-1 gap-6">
          {jobs.length === 0 ? <p className="text-center py-16 text-slate-700 font-black uppercase tracking-[0.4em]">Zero Active Listings</p> : jobs.map(j => (
            <div key={j.id} className={`glass-card p-10 rounded-[3rem] flex flex-col md:flex-row justify-between items-center group border border-white/5 transition-all ${j.status === 'closed' ? 'opacity-30 grayscale' : 'hover:border-purple-500/40'}`}>
              <div className="space-y-3 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <h3 className="text-3xl font-black text-white group-hover:text-purple-400 transition-colors tracking-tighter leading-none">{j.title}</h3>
                  {j.status === 'closed' && <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1 rounded-full font-black uppercase tracking-widest">Closed</span>}
                </div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{j.role} • {apps.filter(a => a.jobId === j.id).length} Verified Applicants</p>
              </div>
              <div className="flex gap-5 mt-8 md:mt-0">
                {j.status === 'active' && (
                  <button 
                    onClick={() => handleCloseJob(j.id)}
                    className="px-6 py-3 bg-red-500/10 text-red-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 border border-red-500/20 transition-all"
                  >
                    Cease Hires
                  </button>
                )}
                <button className="w-14 h-14 bg-white/5 rounded-2xl text-xl hover:bg-white/10 flex items-center justify-center transition-all border border-white/10 text-white shadow-lg"><i className="fas fa-chart-pie"></i></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {apps.length === 0 ? <p className="text-center py-16 text-slate-700 font-black uppercase tracking-[0.4em]">Zero Verified Applicants</p> : apps.map(a => {
            const merit = getMeritCategory(a.aiScore);
            return (
              <div key={a.id} className="glass-card p-10 rounded-[3rem] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10 border border-white/5 hover:bg-purple-500/[0.04] transition-all">
                <div className="flex gap-8 items-center">
                  <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center text-slate-600 text-3xl shadow-inner border border-white/5">
                    <i className="fas fa-fingerprint"></i>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-5">
                      <h4 className="font-black text-2xl tracking-tighter text-white">{a.candidateEmail}</h4>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-[0.2em] shadow-xl ${merit.color}`}>
                        {merit.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-700 font-mono font-black uppercase tracking-tighter truncate max-w-[280px] bg-black/40 px-3 py-1 rounded-lg border border-white/5">{a.resumeHash}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-10 items-center w-full xl:w-auto bg-black/50 p-8 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                   <div className="text-center min-w-[100px]">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">MERIT SCORE</p>
                    <p className={`text-6xl font-black tracking-tighter leading-none ${a.aiScore > 70 ? 'text-[#14F195]' : 'text-yellow-500'}`}>{a.aiScore}</p>
                  </div>
                  <div className="text-center min-w-[130px] border-l border-white/10 pl-10">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 text-left">IMMUTABILITY</p>
                    <div className="flex items-center gap-3 bg-[#14F195]/10 text-[#14F195] text-[10px] font-black px-4 py-2 rounded-xl border border-[#14F195]/20 shadow-xl">
                      <i className="fas fa-link"></i> SOLANA VERIFIED
                    </div>
                  </div>
                  <button 
                    onClick={() => setViewingApp(a)}
                    className="flex-1 xl:flex-none ml-auto px-10 py-4 bg-purple-500 text-white rounded-[1.5rem] font-black text-xs hover:bg-purple-400 transition-all uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(153,69,255,0.3)]"
                  >
                    Examine Resume
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const PostJob: React.FC<{ 
  onBack: () => void, 
  onSuccess: () => void 
}> = ({ onBack, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [role, setRole] = useState<'Cloud' | 'DevOps' | 'Support'>('Cloud');
  const [desc, setDesc] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.postJob({
        title, role, description: desc, 
        skills: skills.split(',').map(s => s.trim()), 
        postedBy: 'abc@abc.com'
      });
      onSuccess();
    } catch (err) {
      alert("System update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-16 px-6">
      <button onClick={onBack} className="text-slate-500 hover:text-white font-black text-xs flex items-center gap-3 uppercase tracking-widest transition-colors">
        <i className="fas fa-chevron-left"></i> Suite Nexus
      </button>
      <div className="glass-card p-12 rounded-[3.5rem] space-y-10 shadow-[0_40px_80px_rgba(0,0,0,0.7)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-purple-500"></div>
        <div className="text-center space-y-3">
          <h2 className="text-5xl font-black tracking-tighter text-white leading-none">Deploy New Role</h2>
          <p className="text-sm text-slate-400 font-black uppercase tracking-[0.4em]">Propagate to Verified Global Talent</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-6">Position Nomenclature</label>
            <input type="text" placeholder="e.g. Principal Cloud Security Architect" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-purple-500 transition-all text-white font-bold placeholder:text-slate-700" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-6">Role Classification</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white appearance-none cursor-pointer focus:border-purple-500 font-bold" value={role} onChange={e => setRole(e.target.value as any)}>
                <option value="Cloud">Cloud Infrastructure</option>
                <option value="DevOps">DevOps Engineering</option>
                <option value="Support">Technical Support</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-6">Prerequisite Keys (Comma separated)</label>
              <input type="text" placeholder="AWS, Rust, CI/CD" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-purple-500 text-white font-bold placeholder:text-slate-700" value={skills} onChange={e => setSkills(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-6">Job Description & Parameters</label>
            <textarea 
              placeholder="Outline responsibilities, skills, and on-chain verification requirements..." 
              rows={6} 
              required 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-purple-500 resize-none text-white font-medium placeholder:text-slate-700 leading-relaxed outline-none" 
              value={desc} 
              onChange={e => setDesc(e.target.value)} 
            />
          </div>
          <button type="submit" disabled={loading} className="w-full py-6 solana-gradient rounded-[1.5rem] font-black text-2xl shadow-2xl transition-all hover:scale-[1.01] active:scale-95 uppercase tracking-[0.3em]">
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : 'Deploy Protocol Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Main App Entry ---

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [route, setRoute] = useState<AppRoute>(AppRoute.LANDING);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);

  const refreshData = () => {
    api.getJobs().then(setJobs);
    if (user && user.role === UserRole.CANDIDATE) {
        api.getApplicationsByCandidate(user.email).then(setApplications);
    }
  };

  useEffect(() => {
    refreshData();
  }, [route, user]);

  // Scroll Reveal Logic
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          target.classList.add('animate-fade-in');
          target.style.opacity = '1';
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [route]);

  const handleAuthSuccess = (u: User) => {
    setUser(u);
    setRoute(u.role === UserRole.RECRUITER ? AppRoute.RECRUITER_DASHBOARD : AppRoute.CANDIDATE_DASHBOARD);
  };

  const handleLogout = () => {
    setUser(null);
    setApplications([]);
    setRoute(AppRoute.LANDING);
  };

  const onNavigate = (newRoute: AppRoute) => {
    if (newRoute === AppRoute.CANDIDATE_DASHBOARD) {
        if (user && user.role === UserRole.CANDIDATE) {
            setRoute(newRoute);
        } else {
            setRoute(AppRoute.LOGIN);
        }
    } else if (newRoute === AppRoute.RECRUITER_DASHBOARD) {
        if (user && user.role === UserRole.RECRUITER) {
            setRoute(newRoute);
        } else {
            setRoute(AppRoute.LOGIN);
        }
    } else {
        setRoute(newRoute);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentView = () => {
    switch (route) {
      case AppRoute.LOGIN: 
        return <Login onAuthSuccess={handleAuthSuccess} onBack={() => setRoute(AppRoute.LANDING)} />;
      case AppRoute.CANDIDATE_DASHBOARD: 
        if (!user || user.role !== UserRole.CANDIDATE) {
            return <Login onAuthSuccess={handleAuthSuccess} onBack={() => setRoute(AppRoute.LANDING)} />;
        }
        return <CandidateDashboard user={user} jobs={jobs} applications={applications} onLogout={handleLogout} onApply={j => { setSelectedJob(j); setRoute(AppRoute.APPLY); }} />;
      case AppRoute.RECRUITER_DASHBOARD: 
        if (!user || user.role !== UserRole.RECRUITER) {
            return <Login onAuthSuccess={handleAuthSuccess} onBack={() => setRoute(AppRoute.LANDING)} />;
        }
        return <RecruiterDashboard user={user} jobs={jobs} onLogout={handleLogout} onPostJob={() => setRoute(AppRoute.POST_JOB)} onRefresh={refreshData} />;
      case AppRoute.APPLY: 
        if (!user || !selectedJob || user.role !== UserRole.CANDIDATE) return null;
        return (
          <Apply 
            user={user} 
            job={selectedJob} 
            allJobs={jobs}
            onBack={() => setRoute(AppRoute.CANDIDATE_DASHBOARD)} 
            onApplyToJob={(j) => setSelectedJob(j)}
            onSuccess={refreshData}
          />
        );
      case AppRoute.POST_JOB: 
        if (!user || user.role !== UserRole.RECRUITER) return null;
        return <PostJob onBack={() => setRoute(AppRoute.RECRUITER_DASHBOARD)} onSuccess={() => setRoute(AppRoute.RECRUITER_DASHBOARD)} />;
      default: 
        return <Landing onNavigate={onNavigate} />;
    }
  };

  return (
    <Layout 
      activeRoute={route} 
      onNavigate={onNavigate}
      walletConnected={walletConnected}
      onConnectWallet={() => setWalletConnected(true)}
    >
      {renderCurrentView()}
    </Layout>
  );
};

export default App;
