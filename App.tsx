
import React, { useState, useEffect, useMemo } from 'react';
import { AppRoute, User, UserRole, Job, Application } from './types';
import { api } from './services/api';
import { analyzeResumeForJob } from './services/geminiService';
import { generateResumeHash } from './services/solanaService';
import Layout from './components/Layout';

// --- Sub-Components ---

const Landing: React.FC<{ onNavigate: (r: AppRoute) => void }> = ({ onNavigate }) => (
  <div className="space-y-32 pb-32 overflow-hidden">
    {/* Hero Section */}
    <section className="min-h-[90vh] flex flex-col items-center justify-center text-center relative px-6">
      <div className="blob -top-20 -left-20"></div>
      <div className="blob -bottom-20 -right-20" style={{ animationDelay: '4s' }}></div>
      
      <div className="space-y-8 max-w-5xl animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-[0.2em] text-[#14F195]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14F195] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14F195]"></span>
          </span>
          Reinventing Trust in Hiring
        </div>
        
        <h1 className="text-7xl sm:text-9xl font-black tracking-tighter leading-none">
          HireTrust <br/>
          <span className="solana-text-gradient">Verifiable Identity.</span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed">
          From claims to credentials. We turn resumes into cryptographic proofs on Solana, powered by Gemini AI.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
          <button 
            onClick={() => onNavigate(AppRoute.CANDIDATE_DASHBOARD)}
            className="group px-10 py-5 solana-gradient rounded-2xl font-black text-white text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
          >
            Candidate Portal <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </button>
          <button 
            onClick={() => onNavigate(AppRoute.RECRUITER_DASHBOARD)}
            className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-white text-lg hover:bg-white/10 transition-all flex items-center gap-3"
          >
            Recruiter Suite <i className="fas fa-user-tie text-purple-500"></i>
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-gray-600">
        <i className="fas fa-chevron-down text-2xl"></i>
      </div>
    </section>

    {/* Section 1: What HireTrust Fixes */}
    <section id="fixes" className="container mx-auto px-6 space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-4xl sm:text-6xl font-black">What HireTrust Fixes</h2>
        <p className="text-gray-500 max-w-2xl mx-auto font-bold uppercase tracking-widest text-xs">The end of resume fraud and screening latency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { icon: 'fa-shield-virus', prob: 'Fake Resumes', sol: 'Cryptographic proof verified on-chain.', color: 'text-red-400' },
          { icon: 'fa-history', prob: 'Resume Edits', sol: 'Immutable blockchain record preventing tampering.', color: 'text-blue-400' },
          { icon: 'fa-robot', prob: 'ATS Confusion', sol: 'Transparent, objective Gemini AI scoring.', color: 'text-[#14F195]' },
          { icon: 'fa-hourglass-half', prob: 'Verif. Delays', sol: 'Instant wallet-based verification (Zero lag).', color: 'text-purple-400' },
          { icon: 'fa-balance-scale', prob: 'Bias', sol: 'Consistent AI logic applied to every profile.', color: 'text-yellow-400' },
          { icon: 'fa-globe', prob: 'Portability', sol: 'Verified credentials follow you everywhere.', color: 'text-green-400' }
        ].map((item, i) => (
          <div key={i} className="glass-card p-10 rounded-[2.5rem] space-y-6 group">
            <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-2xl ${item.color}`}>
              <i className={`fas ${item.icon}`}></i>
            </div>
            <div className="space-y-2">
              <h4 className="text-red-400/80 text-[10px] font-black uppercase tracking-widest line-through">Problem: {item.prob}</h4>
              <h3 className="text-2xl font-black group-hover:text-[#14F195] transition-colors leading-tight">Solution: {item.sol}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Section 2: Why Blockchain? */}
    <section id="blockchain" className="relative">
      <div className="absolute inset-0 bg-purple-600/5 -skew-y-3"></div>
      <div className="container mx-auto px-6 relative py-32 space-y-20">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-16">
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-5xl sm:text-7xl font-black leading-tight">Why Blockchain — Not Just a Database?</h2>
            <p className="text-xl text-gray-400 leading-relaxed">In a traditional database, records can be altered, deleted, or hidden. On Solana, a candidate's merit is recorded as immutable truth.</p>
            
            <div className="space-y-4">
               {[
                 { label: 'Immutable', desc: 'Merit records cannot be changed or falsified.' },
                 { label: 'Decentralized', desc: 'No single company controls your career data.' },
                 { label: 'Publicly Verifiable', desc: 'Instantly check any signature on Solana Explorer.' }
               ].map((feat, i) => (
                 <div key={i} className="flex gap-4 items-start">
                   <div className="mt-1 w-6 h-6 rounded-full bg-[#14F195]/20 flex items-center justify-center text-[#14F195] text-[10px]">
                     <i className="fas fa-check"></i>
                   </div>
                   <div>
                     <p className="font-black text-lg">{feat.label}</p>
                     <p className="text-sm text-gray-500">{feat.desc}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="lg:w-1/2 w-full glass-card p-1 rounded-[3rem] overflow-hidden border-[#14F195]/20">
            <div className="grid grid-cols-2 bg-black/40">
              <div className="p-10 border-r border-b border-white/5 space-y-6">
                 <h4 className="text-xs font-black text-gray-500 uppercase">Database</h4>
                 <ul className="space-y-4 text-sm font-bold text-gray-400">
                    <li className="flex items-center gap-2"><i className="fas fa-times text-red-500"></i> Editable</li>
                    <li className="flex items-center gap-2"><i className="fas fa-times text-red-500"></i> Centralized</li>
                    <li className="flex items-center gap-2"><i className="fas fa-times text-red-500"></i> Opaque Trust</li>
                 </ul>
              </div>
              <div className="p-10 border-b border-white/5 space-y-6 bg-[#14F195]/5">
                 <h4 className="text-xs font-black text-[#14F195] uppercase">Blockchain</h4>
                 <ul className="space-y-4 text-sm font-bold text-white">
                    <li className="flex items-center gap-2"><i className="fas fa-check text-[#14F195]"></i> Immutable</li>
                    <li className="flex items-center gap-2"><i className="fas fa-check text-[#14F195]"></i> Distributed</li>
                    <li className="flex items-center gap-2"><i className="fas fa-check text-[#14F195]"></i> Math-based Trust</li>
                 </ul>
              </div>
              <div className="col-span-2 p-10 bg-gradient-to-br from-purple-500/10 to-[#14F195]/10 flex items-center justify-between">
                <div>
                   <p className="text-xs font-black text-gray-500 uppercase mb-2">Network Selection</p>
                   <p className="text-3xl font-black italic text-white">Why Solana?</p>
                </div>
                <div className="text-right space-y-1">
                   <p className="text-xs font-bold text-[#14F195]"><i className="fas fa-bolt"></i> 65,000 TPS</p>
                   <p className="text-xs font-bold text-[#14F195]"><i className="fas fa-coins"></i> &lt;$0.001 Fees</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Section 3: AI + Solana */}
    <section className="container mx-auto px-6 py-20">
       <div className="glass-card rounded-[4rem] p-16 flex flex-col items-center text-center space-y-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 solana-gradient"></div>
          <div className="max-w-3xl space-y-6">
            <h2 className="text-5xl font-black">AI + Solana: Better Together</h2>
            <p className="text-lg text-gray-400 leading-relaxed">
              AI evaluates merit with high-resolution intelligence. Solana preserves that evaluation forever. Together, they create <strong>Verifiable Intelligence</strong>.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12 w-full max-w-4xl">
             <div className="flex-1 p-8 rounded-3xl bg-blue-500/5 border border-blue-500/10 space-y-4">
                <i className="fas fa-brain text-4xl text-blue-400"></i>
                <h4 className="text-xl font-black">Gemini AI</h4>
                <p className="text-xs text-gray-500">Decides context, extracts skills, and scores candidates objectively.</p>
             </div>
             <div className="text-4xl text-gray-700 animate-pulse"><i className="fas fa-plus"></i></div>
             <div className="flex-1 p-8 rounded-3xl bg-[#14F195]/5 border border-[#14F195]/10 space-y-4">
                <i className="fas fa-link text-4xl text-[#14F195]"></i>
                <h4 className="text-xl font-black">Solana L1</h4>
                <p className="text-xs text-gray-500">Proves identity, timestamps merit, and ensures data ownership.</p>
             </div>
          </div>

          <div className="pt-10 w-full">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center gap-4">
               <span className="text-[10px] font-black uppercase text-purple-400 tracking-widest">Permanent Outcome</span>
               <p className="text-2xl font-black">Your career as a digital asset.</p>
            </div>
          </div>
       </div>
    </section>

    {/* Section 4: Impact HireTrust Creates */}
    <section id="impact" className="container mx-auto px-6 space-y-20">
       <div className="text-center">
          <h2 className="text-5xl font-black">Platform Impact</h2>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            { 
              role: 'For Candidates', 
              icon: 'fa-graduation-cap', 
              color: 'text-[#14F195]',
              features: ['Verifiable Resume', 'One-Time Verification', 'Proof of Skills without referrals']
            },
            { 
              role: 'For Recruiters', 
              icon: 'fa-briefcase', 
              color: 'text-purple-400',
              features: ['80% Screening Reduction', 'Zero Fake Resumes', 'Objective AI Merit Matrix']
            },
            { 
              role: 'For Companies', 
              icon: 'fa-city', 
              color: 'text-blue-400',
              features: ['Lower Hiring Cost', 'Faster Time-to-Hire', 'Immutable Talent Pipeline']
            }
          ].map((card, i) => (
            <div key={i} className="glass-card p-12 rounded-[3rem] space-y-8 flex flex-col justify-between hover:-translate-y-2 transition-transform">
               <div className="space-y-6">
                 <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl ${card.color}`}>
                   <i className={`fas ${card.icon}`}></i>
                 </div>
                 <h3 className="text-3xl font-black">{card.role}</h3>
                 <ul className="space-y-4">
                    {card.features.map((f, j) => (
                      <li key={j} className="flex gap-3 text-sm font-bold text-gray-400">
                        <i className={`fas fa-check-circle mt-0.5 ${card.color}`}></i>
                        {f}
                      </li>
                    ))}
                 </ul>
               </div>
               <button onClick={() => onNavigate(AppRoute.LOGIN)} className="w-full py-4 mt-8 bg-white/5 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Get Started</button>
            </div>
          ))}
       </div>
    </section>

    {/* Section 5: Future Vision */}
    <section className="container mx-auto px-6">
       <div className="bg-gradient-to-br from-purple-900/40 to-[#14F195]/20 rounded-[4rem] p-20 text-center space-y-10 relative overflow-hidden border border-white/5">
          <div className="space-y-4 relative z-10">
            <h2 className="text-6xl font-black leading-tight">The Future of Hiring <br/>is Trustless.</h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">Soon, referrals won't matter. Only verified merit will. HireTrust is building the protocol for decentralized skill NFTs and on-chain professional certifications.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 relative z-10">
            {['Skill NFTs', 'On-Chain Certs', 'Decentralized LinkedIn', 'Proof of Experience'].map(tag => (
              <span key={tag} className="px-6 py-3 bg-black/40 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest text-[#14F195]">{tag}</span>
            ))}
          </div>

          <div className="blob -top-40 -left-40 opacity-40"></div>
       </div>
    </section>

    {/* Section 6: Why HireTrust is Hackathon Ready */}
    <section className="container mx-auto px-6 py-20 text-center space-y-12">
       <h3 className="text-2xl font-black uppercase tracking-[0.5em] text-gray-600">Production Ready MVP</h3>
       <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { l: 'AI Driven', i: 'fa-microchip' },
            { l: 'Solana Built', i: 'fa-cube' },
            { l: 'Real Impact', i: 'fa-earth-americas' },
            { l: 'Recruiter Verified', i: 'fa-id-card' }
          ].map(h => (
            <div key={h.l} className="space-y-3">
               <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto text-[#14F195]"><i className={`fas ${h.i}`}></i></div>
               <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{h.l}</p>
            </div>
          ))}
       </div>
    </section>
  </div>
);

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
    <div className="min-h-[80vh] flex items-center justify-center p-6 animate-fade-in">
      <div className="glass-card w-full max-w-md p-10 rounded-[2rem] space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 solana-gradient"></div>
        <button onClick={onBack} className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold">
          <i className="fas fa-chevron-left"></i> Back to Explore
        </button>
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black">{isRegister ? 'Join Us' : 'Welcome Back'}</h2>
          <p className="text-sm text-gray-500">Secure gateway to HireTrust</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 tracking-widest">Email Address</label>
            <input 
              type="email" placeholder="name@company.com" required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#14F195]/50 transition-all text-sm"
              value={email} onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase ml-2 tracking-widest">Security Password</label>
            <input 
              type="password" placeholder="••••••••" required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-[#14F195]/50 transition-all text-sm"
              value={pass} onChange={e => setPass(e.target.value)}
            />
          </div>
          {error && <p className="text-red-400 text-xs text-center font-bold bg-red-400/10 py-2 rounded-lg">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-4 solana-gradient rounded-2xl font-black text-white shadow-xl hover:brightness-110 active:scale-95 transition-all">
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : (isRegister ? 'Create Account' : 'Authenticate')}
          </button>
        </form>

        <div className="text-center space-y-4">
          <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="text-xs text-[#14F195] font-bold hover:underline tracking-wide">
            {isRegister ? 'Already have an account? Sign In' : 'Need a candidate account? Register here'}
          </button>
          <div className="pt-6 border-t border-white/5 space-y-2">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Recruiter Demo (Fixed)</p>
            <div className="flex justify-between items-center text-[10px] font-mono bg-black/40 p-3 rounded-xl border border-white/5">
              <span className="text-gray-400">abc@abc.com</span>
              <span className="text-purple-400">12345678</span>
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
    <div className="space-y-8 animate-fade-in py-12">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-black">Candidate <span className="text-[#14F195]">Nexus</span></h2>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-[#14F195]"></div>
            Logged in as: {user.email}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
            <button onClick={() => setTimeFilter('recent')} className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${timeFilter === 'recent' ? 'bg-[#14F195] text-black' : 'text-gray-500 hover:text-white'}`}>Recent</button>
            <button onClick={() => setTimeFilter('7d')} className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${timeFilter === '7d' ? 'bg-[#14F195] text-black' : 'text-gray-500 hover:text-white'}`}>7 Days</button>
            <button onClick={() => setTimeFilter('30d')} className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${timeFilter === '30d' ? 'bg-[#14F195] text-black' : 'text-gray-500 hover:text-white'}`}>30 Days</button>
          </div>
          <button onClick={onLogout} className="px-4 py-2 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-xl text-xs font-bold transition-all border border-white/5">
            Log Out
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredJobs.length === 0 ? (
          <div className="col-span-full glass-card p-20 text-center rounded-[3rem] border-dashed border-2 border-white/10">
            <i className="fas fa-search text-5xl text-gray-700 mb-6 block"></i>
            <p className="text-gray-500 font-bold text-xl">No active roles found matching your filter.</p>
          </div>
        ) : filteredJobs.map(j => {
          const applied = hasApplied(j.id);
          return (
            <div key={j.id} className="glass-card p-8 rounded-[2rem] space-y-5 hover:border-[#14F195]/40 transition-all group flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                    j.role === 'Cloud' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                    j.role === 'DevOps' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'
                  }`}>
                    {j.role}
                  </span>
                  <span className="text-[10px] text-gray-600 font-mono font-bold">{new Date(j.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-3xl font-black group-hover:text-[#14F195] transition-colors leading-tight">{j.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">{j.description}</p>
              </div>
              
              {applied ? (
                <div className="w-full mt-6 py-4 bg-white/5 text-gray-500 rounded-2xl font-black text-center border border-white/5 flex items-center justify-center gap-2">
                   <i className="fas fa-check-circle text-[#14F195]"></i> Applied
                </div>
              ) : (
                <button 
                  onClick={() => onApply(j)}
                  className="w-full mt-6 py-4 solana-gradient text-white rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-[#14F195]/10"
                >
                  Verify & Apply
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
    setStatus('Hashing & Encrypting...');
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
      setStatus('Verification Interrupted.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in py-12">
      <button onClick={onBack} className="text-gray-500 hover:text-white flex items-center gap-2 font-bold text-sm">
        <i className="fas fa-chevron-left"></i> Job Search
      </button>

      {!isSuccess ? (
        <div className="glass-card p-12 rounded-[3rem] space-y-10 border border-white/10 shadow-2xl">
          <div className="text-center space-y-3">
             <span className="text-[10px] font-black text-[#14F195] uppercase tracking-[0.3em]">Hiring Protocol</span>
            <h2 className="text-5xl font-black tracking-tighter">Apply for {job.title}</h2>
            <p className="text-gray-400 font-medium">Your credentials will be scored by AI and hashed on Solana.</p>
          </div>

          <div className="relative group cursor-pointer">
            <input 
              type="file" accept=".pdf" id="resume" className="hidden" 
              onChange={e => setFile(e.target.files?.[0] || null)} 
            />
            <label htmlFor="resume" className="cursor-pointer block border-2 border-dashed border-white/10 rounded-[2rem] p-16 text-center hover:border-[#14F195]/50 hover:bg-[#14F195]/5 transition-all">
              <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <i className={`fas ${file ? 'fa-check text-[#14F195]' : 'fa-file-pdf text-red-500'} text-4xl`}></i>
              </div>
              <span className="block font-black text-xl text-gray-200">{file ? file.name : 'Select PDF Resume'}</span>
            </label>
          </div>

          <button 
            disabled={!file || loading}
            onClick={handleApply}
            className="w-full py-5 solana-gradient rounded-2xl font-black text-white text-lg shadow-2xl disabled:opacity-30 transition-all hover:scale-[1.02] active:scale-95"
          >
            {loading ? <><i className="fas fa-circle-notch fa-spin mr-3"></i> {status}</> : 'Submit & Secure Proof'}
          </button>
        </div>
      ) : (
        <div className="space-y-16">
          <div className="glass-card p-16 rounded-[4rem] space-y-8 border-2 border-[#14F195]/40 animate-scale-up shadow-2xl bg-[#14F195]/5 text-center">
            <div className="w-24 h-24 bg-[#14F195] text-black rounded-full flex items-center justify-center mx-auto text-4xl shadow-2xl animate-bounce">
              <i className="fas fa-check"></i>
            </div>
            <div className="space-y-4">
              <h2 className="text-6xl font-black tracking-tight text-white leading-none">Proof Stored.</h2>
              <p className="text-xl text-gray-400 font-medium max-w-md mx-auto">
                🎉 Success! You have applied for the <span className="text-[#14F195]">{job.title}</span> role.
              </p>
            </div>
            <button onClick={onBack} className="px-10 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-white transition-all border border-white/10 uppercase tracking-widest text-xs">
              Return to Dashboard
            </button>
          </div>

          <div className="space-y-8">
            <h3 className="text-3xl font-black flex items-center gap-3">
              <i className="fas fa-search-plus text-[#14F195]"></i> 
              Recommended Roles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map(rj => (
                <div key={rj.id} className="glass-card p-6 rounded-[2rem] space-y-4 hover:border-[#14F195]/30 transition-all group flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase text-gray-500">{rj.role}</span>
                    <h4 className="font-bold text-lg group-hover:text-[#14F195] transition-colors">{rj.title}</h4>
                  </div>
                  <button onClick={() => { setIsSuccess(false); setFile(null); onApplyToJob(rj); }} className="w-full py-2 bg-white/5 hover:bg-[#14F195] hover:text-black rounded-xl text-xs font-black transition-all">
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
    if (confirm("Stop hiring for this role? Listing will be hidden from candidates.")) {
      await api.closeJob(jobId);
      onRefresh();
    }
  };

  const getMeritCategory = (score: number) => {
    if (score >= 81) return { label: 'High Merit', color: 'bg-green-500/10 text-green-400 border-green-500/20' };
    if (score >= 61) return { label: 'Medium Merit', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' };
    return { label: 'Low Merit', color: 'bg-red-500/10 text-red-400 border-red-500/20' };
  };

  return (
    <div className="space-y-10 animate-fade-in relative py-12">
      {viewingApp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="glass-card w-full max-w-4xl p-12 rounded-[4rem] space-y-8 border-2 border-purple-500/30 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => setViewingApp(null)} className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10">
                <i className="fas fa-times"></i>
            </button>
            <div className="space-y-2">
              <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">Integrity Audit</span>
              <h2 className="text-5xl font-black">Audit Report</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-black/40 p-8 rounded-3xl border border-white/5 space-y-4">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Candidate Credentials</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Authenticated ID</p>
                      <p className="font-bold text-lg">{viewingApp.candidateEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">AI Verified Seniority</p>
                      <p className="font-bold text-lg text-[#14F195]">{viewingApp.analysis.experience_level}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 p-8 rounded-3xl border border-white/5 space-y-4">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Extracted Capabilities</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewingApp.analysis.strengths.map(s => (
                      <span key={s} className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-xl text-xs font-black border border-purple-500/20">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-black/40 p-8 rounded-3xl border border-white/5 space-y-4">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Integrity Risks</h4>
                  <div className="space-y-3">
                    {viewingApp.analysis.risk_flags.map((f, i) => (
                      <div key={i} className="flex gap-4 items-center text-sm text-yellow-500 font-medium">
                        <i className="fas fa-exclamation-triangle"></i>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-purple-500/10 p-10 rounded-[3rem] border border-purple-500/20 text-center space-y-2 shadow-2xl shadow-purple-500/10">
                  <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Merit Confidence</p>
                  <p className="text-8xl font-black text-white">{viewingApp.aiScore}</p>
                  <p className="text-[10px] text-purple-300/60 font-black">AI VERIFIED</p>
                </div>
                
                <div className="bg-black/60 p-8 rounded-3xl border border-white/5 space-y-3">
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <i className="fas fa-fingerprint"></i> On-Chain Proof
                  </p>
                  <div className="flex items-center gap-2 text-[#14F195] text-xs font-black">
                    <i className="fas fa-check-circle"></i> SOLANA RECORDED
                  </div>
                  <p className="text-[9px] font-mono text-gray-600 break-all leading-relaxed">{viewingApp.resumeHash}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-8 border-b border-white/5">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-purple-500/10 border border-purple-500/20 rounded-3xl flex items-center justify-center text-purple-400 text-3xl shadow-2xl">
            <i className="fas fa-user-tie"></i>
          </div>
          <div>
            <h2 className="text-4xl font-black">Recruiter <span className="text-purple-500">Nexus</span></h2>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
              <span className="text-purple-400">{user.email}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <button onClick={onPostJob} className="flex-1 sm:flex-none px-10 py-4 solana-gradient rounded-2xl font-black text-white shadow-2xl hover:scale-105 transition-all uppercase tracking-[0.2em] text-xs">
            + Create Role
          </button>
          <button onClick={onLogout} className="px-6 py-4 bg-white/5 hover:bg-red-500/10 hover:text-red-400 rounded-2xl text-xs font-black transition-all border border-white/5">
            Log Out
          </button>
        </div>
      </header>

      <div className="flex gap-2 bg-white/5 p-2 rounded-2xl w-fit border border-white/5">
        <button 
          onClick={() => setActiveTab('jobs')}
          className={`px-8 py-3 font-black text-xs rounded-xl transition-all uppercase tracking-widest ${activeTab === 'jobs' ? 'bg-purple-500 text-white shadow-2xl' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Active Listings ({jobs.length})
        </button>
        <button 
          onClick={() => setActiveTab('applicants')}
          className={`px-8 py-3 font-black text-xs rounded-xl transition-all uppercase tracking-widest ${activeTab === 'applicants' ? 'bg-purple-500 text-white shadow-2xl' : 'text-gray-500 hover:text-gray-300'}`}
        >
          Applicants ({apps.length})
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center"><i className="fas fa-circle-notch fa-spin text-4xl text-purple-500"></i></div>
      ) : activeTab === 'jobs' ? (
        <div className="grid grid-cols-1 gap-6">
          {jobs.length === 0 ? <p className="text-center py-20 text-gray-600 font-bold">No active listings.</p> : jobs.map(j => (
            <div key={j.id} className={`glass-card p-10 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center group border border-white/5 transition-all ${j.status === 'closed' ? 'opacity-40 grayscale' : 'hover:border-purple-500/40'}`}>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <h3 className="text-3xl font-black group-hover:text-purple-400 transition-colors">{j.title}</h3>
                  {j.status === 'closed' && <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1 rounded-full font-black uppercase">Role Closed</span>}
                </div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{j.role} • {apps.filter(a => a.jobId === j.id).length} Active Applicants</p>
              </div>
              <div className="flex gap-4 mt-6 md:mt-0">
                {j.status === 'active' && (
                  <button 
                    onClick={() => handleCloseJob(j.id)}
                    className="px-6 py-3 bg-red-500/10 text-red-400 rounded-xl text-xs font-black hover:bg-red-500/20 border border-red-500/20 transition-all"
                  >
                    Close Role
                  </button>
                )}
                <button className="w-12 h-12 bg-white/5 rounded-xl text-lg hover:bg-white/10 flex items-center justify-center transition-all border border-white/10"><i className="fas fa-chart-line"></i></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {apps.length === 0 ? <p className="text-center py-20 text-gray-600 font-bold">No candidates have applied yet.</p> : apps.map(a => {
            const merit = getMeritCategory(a.aiScore);
            return (
              <div key={a.id} className="glass-card p-10 rounded-[3rem] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10 border border-white/5 hover:bg-purple-500/[0.03] transition-all">
                <div className="flex gap-8 items-center">
                  <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-gray-500 text-3xl shadow-inner border border-white/5">
                    <i className="fas fa-fingerprint"></i>
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-4">
                      <h4 className="font-black text-2xl tracking-tight">{a.candidateEmail}</h4>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-[0.1em] ${merit.color}`}>
                        {merit.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-600 font-mono font-black uppercase tracking-tighter truncate max-w-[250px]">{a.resumeHash}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-10 items-center w-full xl:w-auto bg-black/50 p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                   <div className="text-center min-w-[100px]">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">Merit</p>
                    <p className={`text-6xl font-black ${a.aiScore > 70 ? 'text-[#14F195]' : 'text-yellow-500'}`}>{a.aiScore}</p>
                  </div>
                  <div className="text-center min-w-[120px] border-l border-white/10 pl-10">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 text-left">Integrity Proof</p>
                    <div className="flex items-center gap-2 bg-[#14F195]/10 text-[#14F195] text-[10px] font-black px-4 py-2 rounded-xl border border-[#14F195]/20">
                      <i className="fas fa-link"></i> Solana Verified
                    </div>
                  </div>
                  <button 
                    onClick={() => setViewingApp(a)}
                    className="flex-1 xl:flex-none ml-auto px-10 py-4 bg-purple-500 text-white rounded-2xl font-black text-xs hover:bg-purple-400 transition-all uppercase tracking-[0.2em] shadow-2xl shadow-purple-500/20"
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
      alert("System failure.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in py-12">
      <button onClick={onBack} className="text-gray-500 hover:text-white font-black text-sm flex items-center gap-2 uppercase tracking-widest">
        <i className="fas fa-chevron-left"></i> Dashboard
      </button>
      <div className="glass-card p-12 rounded-[3.5rem] space-y-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-purple-500"></div>
        <div className="text-center space-y-2">
          <h2 className="text-5xl font-black tracking-tighter">Deploy New Role</h2>
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Broadcast to Verified Global Talent</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Job Designation</label>
            <input type="text" placeholder="e.g. Lead Kubernetes Architect" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 outline-none focus:border-purple-500 transition-all" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Role Type</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white appearance-none cursor-pointer focus:border-purple-500" value={role} onChange={e => setRole(e.target.value as any)}>
                <option value="Cloud">Cloud Infrastructure</option>
                <option value="DevOps">DevOps Engineering</option>
                <option value="Support">Technical Support</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Skill Keys (Comma separated)</label>
              <input type="text" placeholder="AWS, Terraform, Go" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-purple-500" value={skills} onChange={e => setSkills(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-4">Job Brief</label>
            <textarea placeholder="Detailed expectations..." rows={6} required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-purple-500 resize-none" value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <button type="submit" disabled={loading} className="w-full py-6 solana-gradient rounded-2xl font-black text-xl shadow-2xl transition-all hover:scale-[1.01] active:scale-95">
            {loading ? <i className="fas fa-circle-notch fa-spin"></i> : 'Publish Listing'}
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
