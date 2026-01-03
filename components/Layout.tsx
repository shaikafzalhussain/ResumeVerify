
import React, { useEffect, useState } from 'react';
import { AppRoute } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  walletConnected: boolean;
  onConnectWallet: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeRoute, 
  onNavigate, 
  walletConnected, 
  onConnectWallet 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className={`px-6 sm:px-12 py-5 flex justify-between items-center fixed top-0 w-full z-[100] transition-all duration-300 ${isScrolled ? 'bg-[#05070a]/90 backdrop-blur-xl border-b border-white/10 py-3' : 'bg-transparent'}`}>
        <div 
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => onNavigate(AppRoute.LANDING)}
        >
          <div className="w-12 h-12 solana-gradient rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
            <i className="fas fa-shield-halved text-2xl"></i>
          </div>
          <span className="font-black text-2xl tracking-tighter hidden sm:block">
            Hire<span className="text-[#14F195]">Trust</span>
          </span>
        </div>

        <nav className="flex items-center gap-4 sm:gap-10">
          <div className="hidden lg:flex items-center gap-8 mr-4">
             <a href="#fixes" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Fixes</a>
             <a href="#blockchain" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Blockchain</a>
             <a href="#impact" className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Impact</a>
          </div>

          <button 
            onClick={() => onNavigate(AppRoute.CANDIDATE_DASHBOARD)}
            className={`text-xs font-black uppercase tracking-widest transition-colors ${activeRoute === AppRoute.CANDIDATE_DASHBOARD ? 'text-[#14F195]' : 'text-gray-400 hover:text-white'}`}
          >
            Candidate
          </button>
          <button 
            onClick={() => onNavigate(AppRoute.RECRUITER_DASHBOARD)}
            className={`text-xs font-black uppercase tracking-widest transition-colors ${activeRoute === AppRoute.RECRUITER_DASHBOARD ? 'text-[#14F195]' : 'text-gray-400 hover:text-white'}`}
          >
            Recruiter
          </button>
          
          <button 
            onClick={onConnectWallet}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${
              walletConnected 
              ? 'bg-[#14F195]/10 text-[#14F195] border border-[#14F195]/20' 
              : 'solana-gradient text-white hover:scale-105 active:scale-95 shadow-2xl'
            }`}
          >
            <i className={`fas ${walletConnected ? 'fa-check-circle' : 'fa-wallet'}`}></i>
            {walletConnected ? 'Connected' : 'Connect'}
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 bg-[#05070a]">
        <div className="container mx-auto px-6 text-center space-y-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 solana-gradient rounded-3xl flex items-center justify-center text-white text-3xl shadow-2xl">
              <i className="fas fa-shield-halved"></i>
            </div>
            <h3 className="text-3xl font-black">HireTrust</h3>
            <p className="text-gray-500 max-w-lg mx-auto font-medium">The production protocol for trustless hiring. Built for the Solana Global Hackathon 2024.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-12 text-xs font-black uppercase tracking-[0.2em] text-gray-500">
             <a href="#" className="hover:text-[#14F195] transition-colors">Vision</a>
             <a href="#" className="hover:text-[#14F195] transition-colors">Documentation</a>
             <a href="#" className="hover:text-[#14F195] transition-colors">Recruiter SDK</a>
             <a href="#" className="hover:text-[#14F195] transition-colors">Solana Explorer</a>
          </div>

          <div className="flex justify-center gap-8 pt-10 border-t border-white/5">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600"><div className="w-2 h-2 rounded-full bg-[#14F195]"></div> Solana Mainnet Ready</span>
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Gemini 3.0 Pro</span>
          </div>
          
          <p className="text-[10px] text-gray-800 font-bold uppercase tracking-[0.5em] pt-10">&copy; 2024 HireTrust Labs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
