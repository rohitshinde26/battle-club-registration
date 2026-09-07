import React from 'react';
import { 
  Trophy, 
  ShieldAlert, 
  Clock, 
  Smartphone, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle,
  Award,
  Zap,
  Target
} from 'lucide-react';
import { PRIZE_BREAKDOWN, PRIZE_POOL, ENTRY_FEE, TOURNAMENT_RULES, HELPLINE_NUMBER } from '../data/tournamentData';

interface TournamentRulesProps {
  onGoToRegister: () => void;
}

export const TournamentRules: React.FC<TournamentRulesProps> = ({ onGoToRegister }) => {
  return (
    <div className="space-y-8" id="tournament-rules-container">
      {/* Prize Pool Breakdown Section */}
      <div className="bg-[#0f172a]/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase mb-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Reward Matrix</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-white tracking-wide uppercase">
              PRIZE POOL BREAKDOWN (₹{PRIZE_POOL})
            </h2>
            <p className="text-xs text-slate-400">
              Guaranteed instant payout via UPI within 30 minutes of final score verification
            </p>
          </div>

          <button
            onClick={onGoToRegister}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-display font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20"
          >
            Enter for ₹{ENTRY_FEE}
          </button>
        </div>

        {/* Prize cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PRIZE_BREAKDOWN.map((prize, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-5 border flex flex-col justify-between ${
                idx === 0
                  ? 'bg-gradient-to-b from-amber-500/15 via-slate-900 to-slate-900 border-amber-500/50 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-tech font-bold uppercase text-amber-300 tracking-wider">
                  {prize.rank}
                </span>
                {idx === 0 ? (
                  <Trophy className="w-6 h-6 text-amber-400" />
                ) : idx === 1 ? (
                  <Award className="w-6 h-6 text-slate-300" />
                ) : (
                  <Zap className="w-6 h-6 text-amber-600" />
                )}
              </div>
              <div className="my-2">
                <span className="font-display text-3xl font-bold text-white">₹{prize.amount}</span>
                <span className="text-xs block text-slate-400 mt-1">{prize.label}</span>
              </div>
              <div className="text-[11px] text-emerald-400 pt-3 border-t border-slate-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Instant UPI Transfer</span>
              </div>
            </div>
          ))}
        </div>

        {/* Point System Matrix */}
        <div className="mt-6 bg-slate-950/70 border border-slate-800 rounded-xl p-4">
          <h3 className="font-display text-sm font-bold text-white uppercase mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" />
            <span>Official Point System & Placement Multiplier</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">1st Place (#1)</span>
              <span className="text-amber-400 font-bold text-sm">15 Placement Pts</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">2nd Place (#2)</span>
              <span className="text-slate-200 font-bold text-sm">12 Placement Pts</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">3rd Place (#3)</span>
              <span className="text-slate-200 font-bold text-sm">10 Placement Pts</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-amber-500/30">
              <span className="text-amber-300 block text-[10px] uppercase font-bold">Each Frag (Kill)</span>
              <span className="text-amber-400 font-bold text-sm">1 Kill Point</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rules & Fair Play Section */}
      <div className="bg-[#0f172a]/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-white tracking-wide uppercase">
              TOURNAMENT CODE OF CONDUCT & RULES
            </h2>
            <p className="text-xs text-slate-400">
              Mandatory fair play guidelines for all registered teams and captains
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {TOURNAMENT_RULES.map((rule, idx) => (
            <div
              key={idx}
              className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-4 flex items-start gap-3.5"
            >
              <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-200 uppercase font-display">
                  {rule.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {rule.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ & Support Section */}
      <div className="bg-[#0f172a]/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-lg">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-white tracking-wide uppercase">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <p className="text-xs text-slate-400">Everything you need to know about match day</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-1.5">
            <h4 className="text-xs font-bold text-amber-300 uppercase">How do I get the Custom Room ID & Password?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We send the Room ID and Password directly to the Contact Number (WhatsApp/SMS) submitted during registration exactly 15 minutes before the match slot time.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-1.5">
            <h4 className="text-xs font-bold text-amber-300 uppercase">Can I substitute a player on match day?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yes, player roster changes can be communicated to tournament admins on WhatsApp at least 30 minutes prior to slot lock.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-1.5">
            <h4 className="text-xs font-bold text-amber-300 uppercase">How is the ₹1,000 prize disbursed?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prizes are paid directly via UPI to the winning captain's UPI ID / phone number immediately after room replay and stats verification.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-1.5">
            <h4 className="text-xs font-bold text-amber-300 uppercase">Need urgent tournament assistance?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Contact our official tournament desk directly at <strong>{HELPLINE_NUMBER}</strong> or via WhatsApp for fast responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
