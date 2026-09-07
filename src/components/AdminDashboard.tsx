import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Trash2, 
  Edit3, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  LogOut, 
  Download, 
  Eye, 
  Shield, 
  Phone, 
  Calendar, 
  CreditCard,
  IndianRupee,
  X,
  Save,
  Check
} from 'lucide-react';
import { RegistrationEntry, GameMode, PlayerInfo } from '../types';
import { DEFAULT_SLOTS, ENTRY_FEE, PRIZE_POOL } from '../data/tournamentData';

interface AdminDashboardProps {
  registrations: RegistrationEntry[];
  onAddRegistration: (entry: RegistrationEntry) => void;
  onUpdateRegistration: (entry: RegistrationEntry) => void;
  onDeleteRegistration: (id: string) => void;
  onViewPass: (entry: RegistrationEntry) => void;
  onLogout: () => void;
  isLiveConnected?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  registrations,
  onAddRegistration,
  onUpdateRegistration,
  onDeleteRegistration,
  onViewPass,
  onLogout,
  isLiveConnected = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | GameMode>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'pending'>('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<RegistrationEntry | null>(null);

  // New Booking Form State inside Admin
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamId, setNewTeamId] = useState('');
  const [newContact, setNewContact] = useState('');
  const [newMode, setNewMode] = useState<GameMode>('squad');
  const [newSlotDate, setNewSlotDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [newSlotTime, setNewSlotTime] = useState(DEFAULT_SLOTS[0].time);
  const [newPaymentStatus, setNewPaymentStatus] = useState<'confirmed' | 'pending'>('confirmed');
  const [newPaymentMethod, setNewPaymentMethod] = useState<'upi' | 'cash' | 'card' | 'netbanking'>('cash');
  const [newUtr, setNewUtr] = useState('');
  const [newPlayers, setNewPlayers] = useState<PlayerInfo[]>([
    { name: '', inGameName: '', gameUid: '' },
    { name: '', inGameName: '', gameUid: '' },
    { name: '', inGameName: '', gameUid: '' },
    { name: '', inGameName: '', gameUid: '' },
  ]);

  const requiredCount = newMode === 'solo' ? 1 : newMode === 'duo' ? 2 : 4;

  const handlePlayerChange = (index: number, field: keyof PlayerInfo, value: string) => {
    const updated = [...newPlayers];
    updated[index] = { ...updated[index], [field]: value };
    setNewPlayers(updated);
  };

  const handleCreateAdminBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim() || !newContact.trim()) return;

    const generatedId = newTeamId.trim() || `BC-${Math.floor(1000 + Math.random() * 9000)}`;
    const regNum = `BC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newEntry: RegistrationEntry = {
      id: `reg-${Date.now()}`,
      registrationNumber: regNum,
      teamName: newTeamName.trim(),
      teamId: generatedId.toUpperCase(),
      contactNumber: newContact.trim(),
      gameMode: newMode,
      slotDate: newSlotDate,
      slotTime: `${newSlotTime} (Admin Reserved)`,
      map: 'Erangel / Battle Royale',
      players: newPlayers.slice(0, requiredCount).map((p, idx) => ({
        name: p.name.trim() || `Player ${idx + 1}`,
        inGameName: p.inGameName.trim() || `IGN_Player_${idx + 1}`,
        gameUid: p.gameUid.trim() || `UID_${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      })),
      paymentMethod: newPaymentMethod,
      paymentUtr: newUtr.trim() || undefined,
      paymentStatus: newPaymentStatus,
      amount: ENTRY_FEE,
      createdAt: new Date().toISOString(),
    };

    onAddRegistration(newEntry);
    setIsAddModalOpen(false);

    // Reset fields
    setNewTeamName('');
    setNewTeamId('');
    setNewContact('');
    setNewUtr('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;
    onUpdateRegistration(editingEntry);
    setEditingEntry(null);
  };

  const filtered = registrations.filter((r) => {
    const matchesSearch =
      r.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.teamId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.contactNumber.includes(searchTerm) ||
      r.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.paymentUtr && r.paymentUtr.includes(searchTerm));

    const matchesMode = filterMode === 'all' || r.gameMode === filterMode;
    const matchesStatus = filterStatus === 'all' || r.paymentStatus === filterStatus;

    return matchesSearch && matchesMode && matchesStatus;
  });

  const totalRevenue = registrations.reduce((acc, curr) => acc + (curr.paymentStatus === 'confirmed' ? curr.amount : 0), 0);
  const confirmedCount = registrations.filter(r => r.paymentStatus === 'confirmed').length;
  const pendingCount = registrations.filter(r => r.paymentStatus === 'pending').length;

  // Export registrations as CSV
  const exportCsv = () => {
    const headers = ['Reg Number,Team Name,Team ID,Mode,Date,Slot Time,Contact,Payment Status,UTR,Amount,Players'];
    const rows = registrations.map(r => {
      const playerStr = r.players.map(p => `${p.inGameName}(${p.gameUid})`).join(' | ');
      return `"${r.registrationNumber}","${r.teamName}","${r.teamId}","${r.gameMode}","${r.slotDate}","${r.slotTime}","${r.contactNumber}","${r.paymentStatus}","${r.paymentUtr || 'N/A'}","${r.amount}","${playerStr}"`;
    });
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `BattleClub_Tournament_Roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6" id="admin-dashboard-container">
      {/* Admin Top Header bar */}
      <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-tech font-bold uppercase tracking-wider text-amber-400">
              Admin Control Center
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
              Firestore Cloud Connected
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-wide">
            TOURNAMENT MANAGEMENT PORTAL
          </h1>
          <p className="text-xs text-slate-400">
            Logged in as: <strong className="text-slate-200">literoom0101@gmail.com</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            id="btn-admin-add-new-booking"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-display font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Manual Booking</span>
          </button>

          <button
            onClick={exportCsv}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onLogout}
            id="btn-admin-logout"
            className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Teams</span>
          <p className="font-display text-2xl font-bold text-white mt-1">{registrations.length}</p>
          <span className="text-[10px] text-slate-500">Registered Slots</span>
        </div>

        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Confirmed</span>
          <p className="font-display text-2xl font-bold text-emerald-300 mt-1">{confirmedCount}</p>
          <span className="text-[10px] text-slate-500">Payment Verified</span>
        </div>

        <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Pending Check-in</span>
          <p className="font-display text-2xl font-bold text-amber-300 mt-1">{pendingCount}</p>
          <span className="text-[10px] text-slate-500">Unverified / Cash</span>
        </div>

        <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-4">
          <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">Total Revenue</span>
          <p className="font-display text-2xl font-bold text-white mt-1">₹{totalRevenue}</p>
          <span className="text-[10px] text-slate-500">Prize Pool: ₹{PRIZE_POOL}</span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-80 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by team, ID, phone, UTR..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-white text-xs rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-amber-500"
          />
        </div>

        <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
          {/* Mode Selector */}
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500"
          >
            <option value="all">All Modes (Solo/Duo/Squad)</option>
            <option value="solo">Solo</option>
            <option value="duo">Duo</option>
            <option value="squad">Squad</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Registrations Data Table */}
      <div className="bg-[#0f172a]/95 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-[11px] font-tech uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Team & Clan ID</th>
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Slot Date & Time</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Payment / UTR</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No registrations found matching the filters
                  </td>
                </tr>
              ) : (
                filtered.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-bold text-white uppercase font-display text-sm">{reg.teamName}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="font-mono text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30">
                              {reg.teamId}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{reg.registrationNumber}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className="uppercase font-bold text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300">
                        {reg.gameMode} ({reg.players.length}P)
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="text-slate-200 font-medium">{reg.slotDate}</p>
                      <p className="text-[10px] text-slate-400">{reg.slotTime}</p>
                    </td>

                    <td className="px-4 py-3.5 font-mono text-slate-300">
                      +91 {reg.contactNumber}
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-white uppercase text-[11px]">{reg.paymentMethod}</p>
                      {reg.paymentUtr ? (
                        <p className="font-mono text-[10px] text-amber-300 truncate max-w-[120px]">
                          UTR: {reg.paymentUtr}
                        </p>
                      ) : (
                        <span className="text-[10px] text-slate-400">₹{reg.amount}</span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => {
                          const updatedStatus = reg.paymentStatus === 'confirmed' ? 'pending' : 'confirmed';
                          onUpdateRegistration({ ...reg, paymentStatus: updatedStatus });
                        }}
                        className={`text-[10px] px-2.5 py-1 rounded-full font-tech font-bold uppercase flex items-center gap-1 transition-transform active:scale-95 ${
                          reg.paymentStatus === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                        }`}
                        title="Click to toggle status"
                      >
                        {reg.paymentStatus === 'confirmed' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Confirmed</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>Pending</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="px-4 py-3.5 text-right space-x-1">
                      <button
                        onClick={() => onViewPass(reg)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="View Battle Pass"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                      </button>

                      <button
                        onClick={() => setEditingEntry(reg)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Edit Registration"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Delete registration for "${reg.teamName}"?`)) {
                            onDeleteRegistration(reg.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-300 hover:text-rose-300 transition-colors"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: ADD MANUAL BOOKING FROM ADMIN */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0f172a] border border-amber-500/40 rounded-3xl p-6 max-w-xl w-full my-8 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-white uppercase">
                  ADD NEW ADMIN TOURNAMENT BOOKING
                </h3>
                <p className="text-xs text-slate-400">Directly slot a team into the tournament roster</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdminBooking} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Team Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Phoenix Lords"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Team ID / Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. PL-09"
                    value={newTeamId}
                    onChange={(e) => setNewTeamId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-white uppercase font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-white outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Match Mode</label>
                  <select
                    value={newMode}
                    onChange={(e) => setNewMode(e.target.value as GameMode)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="solo">Solo (1 Player)</option>
                    <option value="duo">Duo (2 Players)</option>
                    <option value="squad">Squad (4 Players)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Slot Date</label>
                  <input
                    type="date"
                    value={newSlotDate}
                    onChange={(e) => setNewSlotDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Slot Time</label>
                  <select
                    value={newSlotTime}
                    onChange={(e) => setNewSlotTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-2 text-white outline-none"
                  >
                    {DEFAULT_SLOTS.map((s) => (
                      <option key={s.id} value={s.time}>
                        {s.time} - {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Roster Fields */}
              <div className="border-t border-slate-800 pt-3">
                <span className="text-[11px] font-bold uppercase text-slate-300 block mb-2">
                  Player Roster ({requiredCount} Players)
                </span>
                <div className="space-y-2">
                  {Array.from({ length: requiredCount }).map((_, idx) => (
                    <div key={idx} className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Player {idx + 1} IGN</label>
                        <input
                          type="text"
                          placeholder={`IGN_Player_${idx + 1}`}
                          value={newPlayers[idx]?.inGameName || ''}
                          onChange={(e) => handlePlayerChange(idx, 'inGameName', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Character UID</label>
                        <input
                          type="text"
                          placeholder="e.g. 5189201948"
                          value={newPlayers[idx]?.gameUid || ''}
                          onChange={(e) => handlePlayerChange(idx, 'gameUid', e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-800 pt-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Payment Method</label>
                  <select
                    value={newPaymentMethod}
                    onChange={(e) => setNewPaymentMethod(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-white"
                  >
                    <option value="upi">UPI</option>
                    <option value="cash">Cash / On-Venue</option>
                    <option value="card">Card</option>
                    <option value="netbanking">Net Banking</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">Status</label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-white"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">UTR / Ref (Optional)</label>
                  <input
                    type="text"
                    placeholder="Ref ID"
                    value={newUtr}
                    onChange={(e) => setNewUtr(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Save & Lock Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT REGISTRATION */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 max-w-lg w-full relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <h3 className="font-display text-xl font-bold text-white uppercase">
                EDIT REGISTRATION ({editingEntry.registrationNumber})
              </h3>
              <button
                onClick={() => setEditingEntry(null)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Team Name</label>
                <input
                  type="text"
                  value={editingEntry.teamName}
                  onChange={(e) => setEditingEntry({ ...editingEntry, teamName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Team ID</label>
                  <input
                    type="text"
                    value={editingEntry.teamId}
                    onChange={(e) => setEditingEntry({ ...editingEntry, teamId: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={editingEntry.contactNumber}
                    onChange={(e) => setEditingEntry({ ...editingEntry, contactNumber: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Slot Date</label>
                  <input
                    type="date"
                    value={editingEntry.slotDate}
                    onChange={(e) => setEditingEntry({ ...editingEntry, slotDate: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">Payment Status</label>
                  <select
                    value={editingEntry.paymentStatus}
                    onChange={(e) => setEditingEntry({ ...editingEntry, paymentStatus: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Payment UTR / Reference</label>
                <input
                  type="text"
                  value={editingEntry.paymentUtr || ''}
                  onChange={(e) => setEditingEntry({ ...editingEntry, paymentUtr: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
