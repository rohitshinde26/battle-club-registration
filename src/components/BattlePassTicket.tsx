import React, { useRef } from 'react';
import { 
  CheckCircle2, 
  Download, 
  Share2, 
  Calendar, 
  Clock, 
  Gamepad2, 
  Smartphone, 
  Hash, 
  Trophy, 
  ShieldCheck, 
  RotateCcw,
  ArrowRight,
  Printer
} from 'lucide-react';
import { RegistrationEntry } from '../types';
import { Logo } from './Logo';
import { ENTRY_FEE, PRIZE_POOL } from '../data/tournamentData';

interface BattlePassTicketProps {
  registration: RegistrationEntry;
  onRegisterAnother: () => void;
  onViewAllTeams: () => void;
}

export const BattlePassTicket: React.FC<BattlePassTicketProps> = ({
  registration,
  onRegisterAnother,
  onViewAllTeams,
}) => {
  const ticketRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const shareText = `🔥 BATTLE CLUB TOURNAMENT PASS 🔥%0ATeam: ${registration.teamName} (${registration.teamId})%0AMode: ${registration.gameMode.toUpperCase()}%0ASlot: ${registration.slotDate} @ ${registration.slotTime}%0AReg No: ${registration.registrationNumber}%0APrize Pool: ₹${PRIZE_POOL} | Entry: ₹${ENTRY_FEE}`;

  const qrData = `https://battleclub.esports/verify?reg=${registration.registrationNumber}&team=${encodeURIComponent(registration.teamName)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrData)}&bgcolor=0f172a&color=f59e0b&margin=6`;

  return (
    <div className="space-y-6 max-w-3xl mx-auto" id="battle-pass-ticket-container">
      {/* Top Banner Alert */}
      <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-5 flex items-center gap-4 text-emerald-200">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-white uppercase">
            REGISTRATION CONFIRMED & SLOT LOCKED!
          </h3>
          <p className="text-xs text-emerald-300/90 mt-0.5">
            Your Battle Pass has been generated. Room ID & Password will be delivered to <strong>+91 {registration.contactNumber}</strong> 15 minutes before match start.
          </p>
        </div>
      </div>

      {/* The Printable Digital Battle Pass Card */}
      <div
        ref={ticketRef}
        id="printable-battle-pass"
        className="bg-gradient-to-b from-[#111827] via-[#0d1322] to-[#0b0f19] border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white"
      >
        {/* Top Watermark & Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        {/* Pass Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 relative z-10">
          <Logo size="md" />
          <div className="text-left sm:text-right">
            <span className="text-[10px] font-tech font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
              OFFICIAL ENTRY PASS
            </span>
            <p className="font-mono text-lg font-bold text-slate-200 mt-1">
              {registration.registrationNumber}
            </p>
          </div>
        </div>

        {/* Pass Body Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 my-6 relative z-10">
          {/* Main Info */}
          <div className="md:col-span-8 space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-tech uppercase tracking-wider text-slate-400">Team / Player Name</span>
                <span className="text-xs font-bold font-mono text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                  {registration.teamId}
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wide">
                {registration.teamName}
              </h2>
            </div>

            {/* Match Slot & Timing */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Match Date</span>
                </div>
                <p className="font-bold text-white text-sm">{registration.slotDate}</p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Slot Time</span>
                </div>
                <p className="font-bold text-white text-sm">{registration.slotTime.split('(')[0]}</p>
              </div>

              <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
                  <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mode</span>
                </div>
                <p className="font-bold text-amber-300 text-sm uppercase">{registration.gameMode}</p>
              </div>
            </div>

            {/* Player Roster Summary */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5">
              <span className="text-[11px] font-tech uppercase tracking-wider text-slate-400 block mb-2">
                Registered Squad Roster (IGN & UID)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {registration.players.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-950/60 px-3 py-1.5 rounded-lg text-xs">
                    <span className="font-semibold text-slate-200">
                      {idx + 1}. {p.inGameName}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      UID: {p.gameUid}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* QR Code & Verification Badge */}
          <div className="md:col-span-4 flex flex-col items-center justify-center bg-slate-900/90 border border-slate-800 rounded-2xl p-4 text-center">
            <div className="p-2 bg-slate-950 rounded-xl border border-amber-500/40 shadow-inner mb-2">
              <img
                src={qrUrl}
                alt="Tournament Pass QR Verification"
                className="w-32 h-32 rounded"
              />
            </div>
            <span className="text-[11px] font-tech font-bold uppercase text-amber-300 tracking-wider">
              Scan for Check-In
            </span>
            <div className="mt-3 w-full border-t border-slate-800 pt-2 space-y-1 text-left text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Fee Paid:</span>
                <span className="text-white font-bold">₹{registration.amount}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Prize Pool:</span>
                <span className="text-amber-400 font-bold">₹{PRIZE_POOL}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Payment:</span>
                <span className="text-emerald-400 font-semibold uppercase">{registration.paymentStatus}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pass Footer */}
        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 relative z-10">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Anti-Cheat & Punctuality Protected &bull; Battle Club Official 2026</span>
          </div>
          <span>Match Support: +91 98765 43210</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 border border-slate-700 transition-all"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>Print / Save Pass</span>
        </button>

        <a
          href={`https://api.whatsapp.com/send?text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-md shadow-emerald-900/20"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Pass on WhatsApp</span>
        </a>

        <button
          onClick={onViewAllTeams}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 border border-slate-700 transition-all"
        >
          <span>View All Registered Teams</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>

        <button
          onClick={onRegisterAnother}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-amber-500/20"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Register Another Slot</span>
        </button>
      </div>
    </div>
  );
};
