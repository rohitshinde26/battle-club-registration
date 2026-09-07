import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  CreditCard, 
  QrCode, 
  Copy, 
  Check, 
  Shield, 
  User, 
  Smartphone, 
  Hash, 
  AlertCircle, 
  Sparkles,
  ArrowRight,
  Upload,
  IndianRupee,
  CheckCircle2,
  Gamepad2,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameMode, MatchSlot, PlayerInfo, RegistrationEntry } from '../types';
import { DEFAULT_SLOTS, ENTRY_FEE, PRIZE_POOL, UPI_ID } from '../data/tournamentData';

interface RegistrationFormProps {
  onSuccessfulRegistration: (entry: RegistrationEntry) => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSuccessfulRegistration }) => {
  // Form State
  const [teamName, setTeamName] = useState('');
  const [teamId, setTeamId] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [gameMode, setGameMode] = useState<GameMode>('squad');
  
  // Date & Slot Selection
  // Default to today + 1 day formatted as YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];
  
  const [slotDate, setSlotDate] = useState(defaultDateStr);
  const [selectedSlotId, setSelectedSlotId] = useState<string>(DEFAULT_SLOTS[1].id);
  const [selectedMap, setSelectedMap] = useState<string>('Erangel / Classic Battle Royale');

  // Player Rosters (Solo: 1, Duo: 2, Squad: 4)
  const [players, setPlayers] = useState<PlayerInfo[]>([
    { name: '', inGameName: '', gameUid: '' },
    { name: '', inGameName: '', gameUid: '' },
    { name: '', inGameName: '', gameUid: '' },
    { name: '', inGameName: '', gameUid: '' },
  ]);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cash'>('upi');
  const [paymentUtr, setPaymentUtr] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [screenshotUploaded, setScreenshotUploaded] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto generate random Team ID
  const generateRandomTeamId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const prefix = gameMode === 'solo' ? 'SOLO' : gameMode === 'duo' ? 'DUO' : 'BC';
    setTeamId(`${prefix}-${randomNum}`);
    if (errors.teamId) {
      setErrors(prev => ({ ...prev, teamId: '' }));
    }
  };

  // Copy UPI ID to clipboard
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Update specific player info
  const handlePlayerChange = (index: number, field: keyof PlayerInfo, value: string) => {
    const updated = [...players];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setPlayers(updated);
    
    // Clear error
    const errKey = `player_${index}_${field}`;
    if (errors[errKey]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[errKey];
        return next;
      });
    }
  };

  // How many players needed for chosen mode
  const requiredPlayerCount = gameMode === 'solo' ? 1 : gameMode === 'duo' ? 2 : 4;

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!teamName.trim()) {
      newErrors.teamName = 'Team name is required';
    }
    if (!teamId.trim()) {
      newErrors.teamId = 'Team ID / Tag is required';
    }
    
    // Contact Number (Phone validation)
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = contactNumber.replace(/\D/g, '');
    if (!cleanPhone) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (cleanPhone.length !== 10) {
      newErrors.contactNumber = 'Please enter a valid 10-digit mobile number';
    }

    if (!slotDate) {
      newErrors.slotDate = 'Please select a tournament date';
    }

    // Players validation
    for (let i = 0; i < requiredPlayerCount; i++) {
      const player = players[i];
      if (!player.inGameName.trim()) {
        newErrors[`player_${i}_inGameName`] = `In-Game Name (IGN) is required`;
      }
      if (!player.gameUid.trim()) {
        newErrors[`player_${i}_gameUid`] = `Character UID is required`;
      }
    }

    // Payment validation
    if (paymentMethod === 'upi') {
      if (!paymentUtr.trim()) {
        newErrors.paymentUtr = 'Please enter the 12-digit UPI Reference / UTR Number';
      } else if (paymentUtr.trim().length < 8) {
        newErrors.paymentUtr = 'Enter a valid transaction reference / UTR';
      }
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = 'You must accept fair-play & match rules';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.getElementById(firstErrorKey);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    // Find selected slot
    const slot = DEFAULT_SLOTS.find(s => s.id === selectedSlotId) || DEFAULT_SLOTS[0];

    // Generate unique Registration Code
    const regNum = `BC-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRegistration: RegistrationEntry = {
      id: `reg-${Date.now()}`,
      registrationNumber: regNum,
      teamName: teamName.trim(),
      teamId: teamId.trim().toUpperCase(),
      contactNumber: contactNumber.trim(),
      email: email.trim() || undefined,
      gameMode,
      slotDate,
      slotTime: `${slot.time} (${slot.label})`,
      map: selectedMap,
      players: players.slice(0, requiredPlayerCount).map((p, idx) => ({
        name: p.name.trim() || (idx === 0 ? 'Team Captain' : `Player ${idx + 1}`),
        inGameName: p.inGameName.trim(),
        gameUid: p.gameUid.trim(),
      })),
      paymentMethod,
      paymentUtr: paymentMethod === 'upi' ? paymentUtr.trim() : undefined,
      paymentStatus: paymentMethod === 'upi' ? 'confirmed' : 'pending',
      amount: ENTRY_FEE,
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      // Trigger festive celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#38bdf8', '#ffffff'],
        });
      } catch (err) {
        console.error(err);
      }

      setIsSubmitting(false);
      onSuccessfulRegistration(newRegistration);
    }, 800);
  };

  // UPI payment deep link string
  const upiDeepLink = `upi://pay?pa=${UPI_ID}&pn=BattleClubEsports&am=${ENTRY_FEE}&cu=INR&tn=BattleClub-Reg-${teamId || 'Slot'}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiDeepLink)}&bgcolor=111827&color=f59e0b&margin=10`;

  return (
    <form onSubmit={handleSubmit} className="space-y-8" id="battle-club-registration-form">
      {/* SECTION 1: MATCH MODE & DATE / SLOT */}
      <div className="bg-[#0f172a]/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-lg relative">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-display font-bold">
            1
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-white tracking-wide uppercase">
              SELECT MATCH MODE & SLOT DATE
            </h2>
            <p className="text-xs text-slate-400">Choose your match format, date, and preferred time slot</p>
          </div>
        </div>

        {/* Mode Selector (Solo, Duo, Squad) */}
        <div className="space-y-3 mb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
            <span>Match Mode / Format <span className="text-amber-400">*</span></span>
            <span className="text-amber-400 font-semibold lowercase">all modes ₹{ENTRY_FEE} flat</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* Solo */}
            <div
              onClick={() => setGameMode('solo')}
              className={`cursor-pointer rounded-xl p-4 border transition-all relative flex flex-col justify-between ${
                gameMode === 'solo'
                  ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className={`w-4 h-4 ${gameMode === 'solo' ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="font-display font-bold text-base text-white uppercase">SOLO</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 font-tech font-bold">
                  1 Player
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">Single warrior showdown. Ultimate lone survivor takes the prize.</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="text-slate-400">Entry: <strong className="text-white">₹{ENTRY_FEE}</strong></span>
                <span className="text-amber-400 font-bold">Pool: ₹{PRIZE_POOL}</span>
              </div>
            </div>

            {/* Duo */}
            <div
              onClick={() => setGameMode('duo')}
              className={`cursor-pointer rounded-xl p-4 border transition-all relative flex flex-col justify-between ${
                gameMode === 'duo'
                  ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users className={`w-4 h-4 ${gameMode === 'duo' ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="font-display font-bold text-base text-white uppercase">DUO</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 font-tech font-bold">
                  2 Players
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">Pair up with your teammate for coordinated tactical assaults.</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="text-slate-400">Entry: <strong className="text-white">₹{ENTRY_FEE}</strong></span>
                <span className="text-amber-400 font-bold">Pool: ₹{PRIZE_POOL}</span>
              </div>
            </div>

            {/* Squad */}
            <div
              onClick={() => setGameMode('squad')}
              className={`cursor-pointer rounded-xl p-4 border transition-all relative flex flex-col justify-between ${
                gameMode === 'squad'
                  ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-tech text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
                Popular
              </div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className={`w-4 h-4 ${gameMode === 'squad' ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="font-display font-bold text-base text-white uppercase">SQUAD</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 font-tech font-bold">
                  4 Players
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">Full 4-man clan warfare. High intensity strategy & team synergy.</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="text-slate-400">Entry: <strong className="text-white">₹{ENTRY_FEE}</strong></span>
                <span className="text-amber-400 font-bold">Pool: ₹{PRIZE_POOL}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Date Picker & Map Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Date Picker */}
          <div className="space-y-1.5" id="slotDate">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Tournament Date <span className="text-amber-400">*</span></span>
            </label>
            <div className="relative">
              <input
                type="date"
                id="input-tournament-date"
                value={slotDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSlotDate(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-sm rounded-xl px-4 py-2.5 transition-all outline-none"
              />
            </div>
            {errors.slotDate && <p className="text-xs text-rose-400 mt-1">{errors.slotDate}</p>}
          </div>

          {/* Map Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Map & Environment</span>
            </label>
            <select
              value={selectedMap}
              onChange={(e) => setSelectedMap(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-sm rounded-xl px-4 py-2.5 transition-all outline-none"
            >
              <option value="Erangel / Classic Battle Royale">Erangel / Classic Battle Royale</option>
              <option value="Miramar / Desert Arena">Miramar / Desert Arena</option>
              <option value="Sanhok / Jungle Storm">Sanhok / Jungle Storm</option>
              <option value="Vikendi / Snow Grounds">Vikendi / Snow Grounds</option>
              <option value="Bermuda / Fast Clash">Bermuda / Fast Clash</option>
            </select>
          </div>
        </div>

        {/* Slot Time Cards */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Select Match Slot Time <span className="text-amber-400">*</span></span>
            </span>
            <span className="text-slate-400 text-xs">Room ID sent 15 mins before match</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {DEFAULT_SLOTS.map((slot) => {
              const isSelected = selectedSlotId === slot.id;
              return (
                <div
                  key={slot.id}
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`cursor-pointer rounded-xl p-3 border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display font-bold text-lg text-white">{slot.time}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-tech font-bold uppercase ${
                        slot.availableSlots < 5 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {slot.availableSlots} Left
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-300 truncate">{slot.label}</p>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between pt-1.5 border-t border-slate-800/80">
                    <span>{slot.map.split('/')[0]}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 2: TEAM & CONTACT INFORMATION */}
      <div className="bg-[#0f172a]/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-lg relative">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-display font-bold">
            2
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-white tracking-wide uppercase">
              TEAM & CONTACT DETAILS
            </h2>
            <p className="text-xs text-slate-400">Provide official clan / squad credentials and WhatsApp contact</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Team Name */}
          <div className="space-y-1.5" id="teamName">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>{gameMode === 'solo' ? 'Player / Clan Name' : 'Team Name'} <span className="text-amber-400">*</span></span>
            </label>
            <input
              type="text"
              id="input-team-name"
              placeholder="e.g., GodLike Strikers, Toxic Hunters"
              value={teamName}
              onChange={(e) => {
                setTeamName(e.target.value);
                if (errors.teamName) setErrors(prev => ({ ...prev, teamName: '' }));
              }}
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-sm rounded-xl px-4 py-2.5 transition-all outline-none placeholder:text-slate-500"
            />
            {errors.teamName && <p className="text-xs text-rose-400 mt-1">{errors.teamName}</p>}
          </div>

          {/* Team ID / Tag */}
          <div className="space-y-1.5" id="teamId">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-amber-400" />
                <span>Team ID / Clan Tag <span className="text-amber-400">*</span></span>
              </label>
              <button
                type="button"
                onClick={generateRandomTeamId}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
              >
                <Sparkles className="w-3 h-3" /> Auto-Generate ID
              </button>
            </div>
            <input
              type="text"
              id="input-team-id"
              placeholder="e.g., BC-7821 or SOUL-01"
              value={teamId}
              onChange={(e) => {
                setTeamId(e.target.value.toUpperCase());
                if (errors.teamId) setErrors(prev => ({ ...prev, teamId: '' }));
              }}
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-sm font-mono uppercase rounded-xl px-4 py-2.5 transition-all outline-none placeholder:text-slate-500"
            />
            {errors.teamId && <p className="text-xs text-rose-400 mt-1">{errors.teamId}</p>}
          </div>

          {/* Contact Number */}
          <div className="space-y-1.5" id="contactNumber">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>Contact Number (WhatsApp) <span className="text-amber-400">*</span></span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-400">+91</span>
              <input
                type="tel"
                id="input-contact-number"
                maxLength={10}
                placeholder="9876543210"
                value={contactNumber}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setContactNumber(val);
                  if (errors.contactNumber) setErrors(prev => ({ ...prev, contactNumber: '' }));
                }}
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-sm rounded-xl pl-12 pr-4 py-2.5 transition-all outline-none placeholder:text-slate-500"
              />
            </div>
            <p className="text-[11px] text-slate-400">Used strictly for transmitting Room ID & Password 15m before game</p>
            {errors.contactNumber && <p className="text-xs text-rose-400 mt-1">{errors.contactNumber}</p>}
          </div>

          {/* Captain / Notification Email (Optional) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <span>Captain Email / Discord (Optional)</span>
            </label>
            <input
              type="email"
              id="input-email"
              placeholder="captain@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white text-sm rounded-xl px-4 py-2.5 transition-all outline-none placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: PLAYER ROSTER DETAILS */}
      <div className="bg-[#0f172a]/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-lg relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-display font-bold">
              3
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white tracking-wide uppercase">
                {gameMode.toUpperCase()} PLAYER ROSTER ({requiredPlayerCount} {requiredPlayerCount === 1 ? 'Player' : 'Players'})
              </h2>
              <p className="text-xs text-slate-400">Enter exact In-Game Names (IGN) and Character UIDs</p>
            </div>
          </div>
          <span className="text-xs font-tech px-2.5 py-1 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
            Anti-Cheat Verification
          </span>
        </div>

        <div className="space-y-4">
          {Array.from({ length: requiredPlayerCount }).map((_, index) => {
            const isCaptain = index === 0;
            const ignError = errors[`player_${index}_inGameName`];
            const uidError = errors[`player_${index}_gameUid`];

            return (
              <div 
                key={index} 
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 transition-all hover:border-slate-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-sm font-bold text-slate-200 uppercase font-display">
                      {isCaptain ? 'Captain / Player 1' : `Teammate Player ${index + 1}`}
                    </span>
                    {isCaptain && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold uppercase">
                        Lead
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Real Name (Optional) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-400">Player Full Name (Optional)</label>
                    <input
                      type="text"
                      placeholder={isCaptain ? 'e.g., Rohit Kumar' : `Player ${index + 1} Name`}
                      value={players[index]?.name || ''}
                      onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
                      className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500 text-white text-xs rounded-lg px-3 py-2 outline-none"
                    />
                  </div>

                  {/* In Game Name (IGN) */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                      <span>In-Game Name (IGN) <span className="text-amber-400">*</span></span>
                    </label>
                    <input
                      type="text"
                      id={`input-ign-${index}`}
                      placeholder="e.g., Slayers_OP"
                      value={players[index]?.inGameName || ''}
                      onChange={(e) => handlePlayerChange(index, 'inGameName', e.target.value)}
                      className={`w-full bg-slate-950/80 border ${
                        ignError ? 'border-rose-500' : 'border-slate-800 focus:border-amber-500'
                      } text-white text-xs rounded-lg px-3 py-2 outline-none font-mono`}
                    />
                    {ignError && <p className="text-[10px] text-rose-400">{ignError}</p>}
                  </div>

                  {/* Character UID */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                      <span>Character UID <span className="text-amber-400">*</span></span>
                    </label>
                    <input
                      type="text"
                      id={`input-uid-${index}`}
                      placeholder="e.g., 5189201948"
                      value={players[index]?.gameUid || ''}
                      onChange={(e) => handlePlayerChange(index, 'gameUid', e.target.value)}
                      className={`w-full bg-slate-950/80 border ${
                        uidError ? 'border-rose-500' : 'border-slate-800 focus:border-amber-500'
                      } text-white text-xs rounded-lg px-3 py-2 outline-none font-mono`}
                    />
                    {uidError && <p className="text-[10px] text-rose-400">{uidError}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: PAYMENT OPTIONS (UPI & OTHERS) */}
      <div className="bg-[#0f172a]/90 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-lg relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-display font-bold">
              4
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white tracking-wide uppercase">
                PAYMENT & REGISTRATION FEE
              </h2>
              <p className="text-xs text-slate-400">Entry fee ₹{ENTRY_FEE} per slot for ₹{PRIZE_POOL} Prize Pool</p>
            </div>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Due</span>
            <span className="font-display text-lg font-bold text-amber-400">₹{ENTRY_FEE}</span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-4 mb-6">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Select Payment Method <span className="text-amber-400">*</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* UPI Option */}
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                paymentMethod === 'upi'
                  ? 'bg-amber-500/15 border-amber-500 shadow-md ring-1 ring-amber-500/40 text-white'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <QrCode className="w-5 h-5 mb-1 text-amber-400" />
              <span className="text-xs font-bold uppercase">UPI / QR</span>
              <span className="text-[10px] text-amber-300/80 font-tech">GPay / PhonePe / Paytm</span>
            </button>

            {/* Card Option */}
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                paymentMethod === 'card'
                  ? 'bg-amber-500/15 border-amber-500 shadow-md ring-1 ring-amber-500/40 text-white'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <CreditCard className="w-5 h-5 mb-1 text-blue-400" />
              <span className="text-xs font-bold uppercase">Debit / Card</span>
              <span className="text-[10px] text-slate-400 font-tech">Visa / RuPay / MC</span>
            </button>

            {/* Net Banking */}
            <button
              type="button"
              onClick={() => setPaymentMethod('netbanking')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                paymentMethod === 'netbanking'
                  ? 'bg-amber-500/15 border-amber-500 shadow-md ring-1 ring-amber-500/40 text-white'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <IndianRupee className="w-5 h-5 mb-1 text-emerald-400" />
              <span className="text-xs font-bold uppercase">Net Banking</span>
              <span className="text-[10px] text-slate-400 font-tech">All Indian Banks</span>
            </button>

            {/* Cash at Venue / Check-in */}
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
                paymentMethod === 'cash'
                  ? 'bg-amber-500/15 border-amber-500 shadow-md ring-1 ring-amber-500/40 text-white'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-5 h-5 mb-1 text-purple-400" />
              <span className="text-xs font-bold uppercase">On-Venue Cash</span>
              <span className="text-[10px] text-slate-400 font-tech">Pay at Match Check-in</span>
            </button>
          </div>
        </div>

        {/* UPI Details Box */}
        {paymentMethod === 'upi' && (
          <div className="bg-slate-950/90 border border-amber-500/30 rounded-xl p-5 mb-5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* QR Code */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="p-2 bg-slate-950 rounded-lg border border-amber-500/40 shadow-inner">
                  <img
                    src={qrCodeUrl}
                    alt="Scan UPI QR Code to pay ₹100"
                    className="w-36 h-36 rounded"
                  />
                </div>
                <span className="text-[11px] text-amber-300 font-tech font-bold mt-2 uppercase tracking-wider">
                  Scan & Pay ₹{ENTRY_FEE}
                </span>
                <span className="text-[10px] text-slate-400">GPay, PhonePe, Paytm, BHIM</span>
              </div>

              {/* UPI ID & UTR Input */}
              <div className="md:col-span-8 space-y-4">
                {/* Copy UPI ID */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Official Battle Club UPI ID
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 font-mono text-sm text-amber-300 font-semibold truncate">
                      {UPI_ID}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-4 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
                    >
                      {copiedUpi ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Enter 12-Digit UTR Number */}
                <div className="space-y-1.5" id="paymentUtr">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                    <span>12-Digit UPI Ref / UTR / Transaction ID <span className="text-amber-400">*</span></span>
                    <span className="text-[10px] text-slate-400 font-normal">Found in your payment receipt</span>
                  </label>
                  <input
                    type="text"
                    id="input-utr"
                    placeholder="e.g., 428901238912"
                    value={paymentUtr}
                    maxLength={20}
                    onChange={(e) => {
                      setPaymentUtr(e.target.value);
                      if (errors.paymentUtr) setErrors(prev => ({ ...prev, paymentUtr: '' }));
                    }}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white font-mono text-sm rounded-xl px-4 py-2.5 transition-all outline-none placeholder:text-slate-500"
                  />
                  {errors.paymentUtr && <p className="text-xs text-rose-400 mt-1">{errors.paymentUtr}</p>}
                </div>

                {/* Optional Screenshot Attachment */}
                <div>
                  <label 
                    onClick={() => setScreenshotUploaded(!screenshotUploaded)}
                    className="cursor-pointer border border-dashed border-slate-800 hover:border-amber-500/50 bg-slate-900/50 rounded-xl p-3 flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-xs font-semibold text-slate-300">
                          {screenshotUploaded ? 'Payment Screenshot Attached (receipt.jpg)' : 'Upload Payment Screenshot (Optional)'}
                        </p>
                        <p className="text-[10px] text-slate-400">Speeds up instant slot confirmation</p>
                      </div>
                    </div>
                    {screenshotUploaded && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Card / Netbanking / Cash Info */}
        {paymentMethod === 'card' && (
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 mb-5 text-sm text-slate-300">
            <p className="font-semibold text-white mb-1">Debit / Credit Card Checkout</p>
            <p className="text-xs text-slate-400">Card payment gateway token will be generated on form submission. Safe 256-bit encrypted checkout.</p>
          </div>
        )}

        {paymentMethod === 'netbanking' && (
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 mb-5 text-sm text-slate-300">
            <p className="font-semibold text-white mb-1">Net Banking Instant Redirect</p>
            <p className="text-xs text-slate-400">Select your bank after confirming team details. Supported: HDFC, SBI, ICICI, Axis, PNB and 40+ banks.</p>
          </div>
        )}

        {paymentMethod === 'cash' && (
          <div className="bg-slate-950/90 border border-amber-500/30 rounded-xl p-4 mb-5 text-sm text-slate-300">
            <p className="font-semibold text-amber-300 mb-1">Cash on Match Check-in</p>
            <p className="text-xs text-slate-400">Your slot is reserved tentatively. You must complete verification and ₹{ENTRY_FEE} cash payment at least 30 minutes before match time.</p>
          </div>
        )}

        {/* Terms & Agreement */}
        <div className="pt-2 border-t border-slate-800" id="agreeTerms">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                if (errors.agreeTerms) setErrors(prev => ({ ...prev, agreeTerms: '' }));
              }}
              className="mt-1 w-4 h-4 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500 focus:ring-offset-slate-900"
            />
            <span className="text-xs text-slate-300 leading-relaxed">
              I agree to the <strong>Battle Club Tournament Rules</strong>, anti-cheat terms, and understand Room ID & Password will be delivered via WhatsApp/SMS 15 minutes before the selected slot.
            </span>
          </label>
          {errors.agreeTerms && <p className="text-xs text-rose-400 mt-1">{errors.agreeTerms}</p>}
        </div>
      </div>

      {/* SUBMIT BUTTON & SUMMARY */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900/90 to-amber-500/10 border border-amber-500/40 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className="font-display text-lg font-bold text-white uppercase">
              {teamName || 'Your Team'} &bull; {gameMode.toUpperCase()}
            </span>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
              {teamId || 'TEAM-ID'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Slot: <strong className="text-slate-200">{slotDate}</strong> at <strong className="text-slate-200">{DEFAULT_SLOTS.find(s => s.id === selectedSlotId)?.time}</strong>
          </p>
        </div>

        <button
          type="submit"
          id="btn-submit-registration"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-display font-bold text-base tracking-wider uppercase shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
              <span>Processing Registration...</span>
            </>
          ) : (
            <>
              <Shield className="w-5 h-5" />
              <span>Confirm & Lock Slot (₹{ENTRY_FEE})</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
