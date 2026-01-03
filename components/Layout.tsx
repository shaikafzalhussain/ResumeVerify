
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
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll
      const sections = ['fixes', 'blockchain', 'impact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'fixes', label: 'Fixes' },
    { id: 'blockchain', label: 'Blockchain' },
    { id: 'impact', label: 'Impact' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className={`px-6 sm:px-12 py-5 flex justify-between items-center fixed top-0 w-full z-[100] transition-all duration-500 ${isScrolled ? 'bg-[#05070a]/95 backdrop-blur-2xl border-b border-white/10 py-3 shadow-2xl' : 'bg-transparent'}`}>
        <div 
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => onNavigate(AppRoute.LANDING)}
        >
          <div className="w-12 h-12 solana-gradient rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-500">
            <i className="fas fa-shield-halved text-2xl"></i>
          </div>
          <span className="font-black text-2xl tracking-tighter hidden sm:block text-white">
            Hire<span className="text-[#14F195]">Trust</span>
          </span>
        </div>

        <nav className="flex items-center gap-6 sm:gap-10">
          <div className="hidden lg:flex items-center gap-10 mr-4">
            {navItems.map((item) => (
              <a 
                key={item.id}
                href={`#${item.id}`} 
                className={`nav-link text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  activeSection === item.id ? 'active text-[#14F195]' : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate(AppRoute.CANDIDATE_DASHBOARD)}
              className={`text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeRoute === AppRoute.CANDIDATE_DASHBOARD ? 'text-[#14F195] font-bold underline decoration-2 underline-offset-8' : 'text-gray-400 hover:text-white'}`}
            >
              Candidate
            </button>
            <button 
              onClick={() => onNavigate(AppRoute.RECRUITER_DASHBOARD)}
              className={`text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeRoute === AppRoute.RECRUITER_DASHBOARD ? 'text-[#14F195] font-bold underline decoration-2 underline-offset-8' : 'text-gray-400 hover:text-white'}`}
            >
              Recruiter
            </button>
            
            <button 
              onClick={onConnectWallet}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-500 ${
                walletConnected 
                ? 'bg-[#14F195]/10 text-[#14F195] border border-[#14F195]/20' 
                : 'solana-gradient text-white hover:scale-105 active:scale-95 shadow-2xl hover:shadow-[#14F195]/20'
              }`}
            >
              <i className={`fas ${walletConnected ? 'fa-check-circle' : 'fa-wallet'}`}></i>
              {walletConnected ? 'Connected' : 'Connect Wallet'}
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5 bg-[#05070a] relative overflow-hidden">
        <div className="blob -bottom-20 -left-20 opacity-30"></div>
        <div className="container mx-auto px-6 text-center space-y-10">
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 solana-gradient rounded-[1.5rem] flex items-center justify-center text-white text-3xl shadow-2xl">
              <i className="fas fa-shield-halved"></i>
            </div>
            <h3 className="text-3xl font-black text-white">HireTrust</h3>
            <p className="text-slate-400 max-w-xl mx-auto font-medium leading-relaxed text-sm">
              The first production protocol for trustless career merit. <br/>
              Turning resumes from claims into verified cryptographic credentials on Solana.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black uppercase tracking-[0.25em] text-gray-500">
             <a href="#" className="hover:text-[#14F195] transition-all hover:scale-105">Vision</a>
             <a href="#" className="hover:text-[#14F195] transition-all hover:scale-105">Whitepaper</a>
             <a href="#" className="hover:text-[#14F195] transition-all hover:scale-105">SDK</a>
             <a href="#" className="hover:text-[#14F195] transition-all hover:scale-105">Mainnet Explorer</a>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 pt-8 border-t border-white/5">
            <span className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <div className="w-2 h-2 rounded-full bg-[#14F195] shadow-[0_0_8px_#14F195]"></div> Solana Powered
            </span>
            <span className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"></div> Gemini 2.5 Pro Vision
            </span>
          </div>
          
          <p className="text-[9px] text-slate-700 font-bold uppercase tracking-[0.8em] pt-8">&copy; 2024 HireTrust Protocol. Built for Global Talent.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
