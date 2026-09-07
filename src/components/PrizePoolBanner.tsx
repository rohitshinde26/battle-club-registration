import React from 'react';
import { Trophy, Award, Medal, Zap, ShieldCheck, Clock, IndianRupee } from 'lucide-react';
import { PRIZE_POOL, ENTRY_FEE, PRIZE_BREAKDOWN } from '../data/tournamentData';

export const PrizePoolBanner: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-b from-[#111827] to-[#0d1322] border border-slate-800/80 rounded-2xl p-5 sm:p-7 shadow-xl relative overflow-hidden" id="tournament-prize-banner">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Col: Main Banner & Hero details */}
        <div className="lg:col-span-5 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Official Prize Pool Guarantee</span>
          </div>

          <div className="space-y-1">
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-wide uppercase">
              BATTLE CLUB <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">TOURNAMENT</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Register your squad, lock your preferred date slot, and compete against top contenders for victory.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <IndianRupee className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Entry Fee</p>
                <p className="font-display text-lg font-bold text-white leading-none">₹{ENTRY_FEE} <span className="text-xs text-amber-400/80 font-normal">/ slot</span></p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/90 border border-amber-500/30 px-3.5 py-2 rounded-xl shadow-lg shadow-amber-500/5">
              <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-amber-400/90 tracking-wider">Total Prize Pool</p>
                <p className="font-display text-lg font-bold text-amber-300 leading-none">₹{PRIZE_POOL} <span className="text-xs text-slate-400 font-normal">INR</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: 3-Tier Podium Prize Breakdown Cards */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1st Place */}
            <div className="bg-gradient-to-b from-amber-500/15 via-slate-900/90 to-slate-900/90 border border-amber-500/40 rounded-xl p-4 flex flex-col justify-between relative shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-tech uppercase tracking-wider text-amber-300">1st Place</span>
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
              <div className="my-2">
                <span className="font-display text-2xl font-bold text-white">₹700</span>
                <span className="text-[11px] block text-amber-300/80 mt-0.5">Champion &bull; 70% Pool</span>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Winner Trophy Badge</span>
              </div>
            </div>

            {/* 2nd Place */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-tech uppercase tracking-wider text-slate-300">2nd Place</span>
                <Medal className="w-5 h-5 text-slate-300" />
              </div>
              <div className="my-2">
                <span className="font-display text-2xl font-bold text-slate-100">₹200</span>
                <span className="text-[11px] block text-slate-400 mt-0.5">Runner-Up &bull; 20% Pool</span>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                <span>Finals Priority Pass</span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-tech uppercase tracking-wider text-amber-600/80">3rd Place</span>
                <Award className="w-5 h-5 text-amber-600" />
              </div>
              <div className="my-2">
                <span className="font-display text-2xl font-bold text-slate-100">₹100</span>
                <span className="text-[11px] block text-slate-400 mt-0.5">3rd Rank &bull; 10% Pool</span>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Entry Cashback</span>
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="mt-3 bg-slate-900/60 border border-slate-800/60 rounded-lg px-3 py-2 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Available for <strong>Solo</strong>, <strong>Duo</strong>, and <strong>Squad</strong> match formats.</span>
            </span>
            <span className="text-amber-400 font-medium">All modes ₹100 Flat</span>
          </div>
        </div>
      </div>
    </div>
  );
};
