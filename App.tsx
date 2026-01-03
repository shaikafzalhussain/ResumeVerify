
import React, { useState } from 'react';
import Layout from './components/Layout';
import CandidateFlow from './components/CandidateFlow';
import RecruiterFlow from './components/RecruiterFlow';
import { AppRoute } from './types';

const Home: React.FC<{ onNavigate: (r: AppRoute) => void }> = ({ onNavigate }) => (
  <div className="text-center space-y-12 py-12 animate-fade-in">
    <div className="space-y-6">
      <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-tight">
        Trusted Resumes.<br />
        Powered by <span className="text-[#14F195]">AI</span>.<br />
        Backed by <span className="text-purple-500">Solana</span>.
      </h1>
      <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
        Eliminate credentials fraud. AI-scored for accuracy, hashed for integrity, and immutably stored on the Solana blockchain.
      </p>
    </div>

    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
      <button 
        onClick={() => onNavigate(AppRoute.CANDIDATE)}
        className="group w-64 h-24 glass-card rounded-2xl flex items-center justify-between px-6 hover:border-[#14F195]/50 transition-all hover:scale-105 shadow-xl shadow-[#14F195]/5"
      >
        <div className="text-left">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">I am a</div>
          <div className="text-xl font-bold">Candidate</div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#14F195]/20 group-hover:text-[#14F195] transition-all">
          <i className="fas fa-file-upload text-xl"></i>
        </div>
      </button>

      <button 
        onClick={() => onNavigate(AppRoute.RECRUITER)}
        className="group w-64 h-24 glass-card rounded-2xl flex items-center justify-between px-6 hover:border-purple-500/50 transition-all hover:scale-105 shadow-xl shadow-purple-500/5"
      >
        <div className="text-left">
          <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">I am a</div>
          <div className="text-xl font-bold">Recruiter</div>
        </div>
        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-all">
          <i className="fas fa-search-dollar text-xl"></i>
        </div>
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12 border-t border-white/5">
      <div className="space-y-3 p-6 glass-card rounded-2xl border-white/5">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto text-xl shadow-lg shadow-blue-500/10">
          <i className="fas fa-brain"></i>
        </div>
        <h3 className="font-bold">Gemini 3.0 Vision</h3>
        <p className="text-sm text-gray-500 leading-relaxed">Multimodal AI analyzes document structure, quantified impact, and technical depth.</p>
      </div>
      <div className="space-y-3 p-6 glass-card rounded-2xl border-white/5">
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto text-xl shadow-lg shadow-purple-500/10">
          <i className="fas fa-fingerprint"></i>
        </div>
        <h3 className="font-bold">SHA-256 Hashing</h3>
        <p className="text-sm text-gray-500 leading-relaxed">Cryptographic proof ensures the resume analyzed is the exact same one being verified.</p>
      </div>
      <div className="space-y-3 p-6 glass-card rounded-2xl border-white/5">
        <div className="w-12 h-12 rounded-xl bg-[#14F195]/10 text-[#14F195] flex items-center justify-center mx-auto text-xl shadow-lg shadow-[#14F195]/10">
          <i className="fas fa-layer-group"></i>
        </div>
        <h3 className="font-bold">Solana Immutability</h3>
        <p className="text-sm text-gray-500 leading-relaxed">Record scores and hashes on Devnet for decentralized, tamper-proof proof-of-work.</p>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [activeRoute, setActiveRoute] = useState<AppRoute>(AppRoute.HOME);
  const [walletConnected, setWalletConnected] = useState(false);
  const [prefilledHash, setPrefilledHash] = useState<string | undefined>(undefined);

  const handleConnectWallet = () => {
    setWalletConnected(true);
  };

  const navigateToRoute = (route: AppRoute, hash?: string) => {
    setPrefilledHash(hash);
    setActiveRoute(route);
  };

  const renderContent = () => {
    switch (activeRoute) {
      case AppRoute.CANDIDATE:
        return <CandidateFlow walletConnected={walletConnected} onConnect={handleConnectWallet} onNavigate={navigateToRoute} />;
      case AppRoute.RECRUITER:
        return <RecruiterFlow initialHash={prefilledHash} />;
      case AppRoute.HOME:
      default:
        return <Home onNavigate={(r) => navigateToRoute(r)} />;
    }
  };

  return (
    <Layout 
      activeRoute={activeRoute} 
      onNavigate={(r) => navigateToRoute(r)}
      walletConnected={walletConnected}
      onConnectWallet={handleConnectWallet}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
