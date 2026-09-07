import React from 'react';
import { Logo } from './Logo';
import { Shield, Trophy, Users, HelpCircle, Flame, Calendar, Lock } from 'lucide-react';
import { ENTRY_FEE, PRIZE_POOL } from '../data/tournamentData';

interface HeaderProps {
  activeTab: 'register' | 'teams' | 'rules' | 'admin';
  setActiveTab: (tab: 'register' | 'teams' | 'rules' | 'admin') => void;
  registeredCount: number;
  isAdminLoggedIn: boolean;
  isLiveConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  registeredCount, 
  isAdminLoggedIn,
  isLiveConnected = true 
}) => {
  return (
    <header className="border-b border-slate-800 bg-[#0d1322]/90 backdrop-blur-md sticky top-0 z-40" id="battle-club-header">
      {/* Top micro-announcement bar */}
      <div className="bg-gradient-to-r from-amber-950/40 via-amber-900/30 to-amber-950/40 border-b border-amber-500/20 px-4 py-1.5 text-xs text-amber-200/90 text-center flex items-center justify-center gap-2 font-medium">
        <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Registrations Live for Upcoming Scrims & Championship Matches!</span>
        <span className="hidden md:inline text-amber-400 font-bold">•</span>
        <span className="hidden md:inline text-amber-300">
          Prize Pool: ₹{PRIZE_POOL} | Entry: ₹{ENTRY_FEE} per Slot
        </span>
        {isLiveConnected && (
          <span className="hidden sm:inline-flex items-center gap-1 ml-2 px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            Cloud Sync Active
          </span>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => setActiveTab('register')} 
          className="cursor-pointer transition-transform hover:scale-[1.01]"
        >
          <Logo size="md" />
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center flex-wrap justify-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800" id="header-nav-tabs">
          <button
            id="nav-tab-register"
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'register'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Registration</span>
          </button>

          <button
            id="nav-tab-teams"
            onClick={() => setActiveTab('teams')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all relative ${
              activeTab === 'teams'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Teams</span>
            {registeredCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'teams' ? 'bg-slate-950 text-amber-300' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {registeredCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-rules"
            onClick={() => setActiveTab('rules')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'rules'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Rules</span>
          </button>

          <button
            id="nav-tab-admin"
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all border ${
              activeTab === 'admin'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                : isAdminLoggedIn
                ? 'text-amber-400 border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20'
                : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin {isAdminLoggedIn ? 'Panel' : 'Login'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
