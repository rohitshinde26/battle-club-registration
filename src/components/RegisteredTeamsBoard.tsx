import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Clock3, 
  Eye, 
  Shield, 
  Sparkles,
  Gamepad2,
  Phone
} from 'lucide-react';
import { RegistrationEntry, GameMode } from '../types';

interface RegisteredTeamsBoardProps {
  registrations: RegistrationEntry[];
  onSelectPass: (entry: RegistrationEntry) => void;
  onGoToRegister: () => void;
}

export const RegisteredTeamsBoard: React.FC<RegisteredTeamsBoardProps> = ({
  registrations,
  onSelectPass,
  onGoToRegister,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModeFilter, setSelectedModeFilter] = useState<'all' | GameMode>('all');

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.teamId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.contactNumber.includes(searchTerm) ||
      reg.players.some((p) => p.inGameName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMode = selectedModeFilter === 'all' || reg.gameMode === selectedModeFilter;

    return matchesSearch && matchesMode;
  });

  return (
    <div className="space-y-6" id="registered-teams-board">
      {/* Header & Controls */}
      <div className="bg-[#0f172a]/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase mb-1">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Live Slot Roster</span>
            </div>
            <h2 className="font-display text-2xl font-bold text-white tracking-wide uppercase">
              REGISTERED TEAMS & ROSTERS
            </h2>
            <p className="text-xs text-slate-400">
              Check slot status, verified teams, and player rosters for upcoming scrims
            </p>
          </div>

          <button
            onClick={onGoToRegister}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-display font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Register Your Team</span>
          </button>
        </div>

        {/* Search & Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Team Name, Clan ID, Contact, or Player IGN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-white text-xs sm:text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none transition-all placeholder:text-slate-500"
            />
          </div>

          <div className="sm:col-span-4 flex gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(['all', 'solo', 'duo', 'squad'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedModeFilter(mode)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all ${
                  selectedModeFilter === mode
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Teams Grid / List */}
      {filteredRegistrations.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <Users className="w-12 h-12 text-slate-600 mx-auto" />
          <p className="text-base font-semibold text-slate-300">No teams found matching your search</p>
          <p className="text-xs text-slate-500">Try searching for a different Team Name or Clan Tag</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRegistrations.map((team) => (
            <div
              key={team.id}
              className="bg-[#0f172a]/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-bold text-white uppercase tracking-wide">
                        {team.teamName}
                      </h3>
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded">
                        {team.teamId}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Pass: {team.registrationNumber}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-1 rounded-full font-tech font-bold uppercase flex items-center gap-1 ${
                      team.paymentStatus === 'confirmed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {team.paymentStatus === 'confirmed' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Slot Confirmed</span>
                      </>
                    ) : (
                      <>
                        <Clock3 className="w-3 h-3 text-amber-400" />
                        <span>Pending Check-in</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Match Slot Details */}
                <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3 mb-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Match Slot</span>
                    <span className="text-slate-200 font-medium">{team.slotTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Date</span>
                    <span className="text-slate-200 font-medium">{team.slotDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Format</span>
                    <span className="text-amber-300 font-bold uppercase">{team.gameMode}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Map</span>
                    <span className="text-slate-200 truncate block">{team.map.split('/')[0]}</span>
                  </div>
                </div>

                {/* Player Roster */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                    Squad Lineup ({team.players.length} Players)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {team.players.map((p, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-950 border border-slate-800/80 text-slate-300 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                      >
                        <span className="text-amber-400 font-bold text-[10px]">#{idx + 1}</span>
                        <span className="font-semibold">{p.inGameName}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>+91 {team.contactNumber.slice(0, 5)}*****</span>
                </span>

                <button
                  onClick={() => onSelectPass(team)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>View Battle Pass</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
