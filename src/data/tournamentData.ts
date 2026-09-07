import { MatchSlot, PrizeBreakdown, RegistrationEntry } from '../types';

export const TOURNAMENT_NAME = "BATTLE CLUB CHAMPIONSHIP";
export const ENTRY_FEE = 100;
export const PRIZE_POOL = 1000;
export const UPI_ID = "9529766041-f5f7@ybl";
export const HELPLINE_NUMBER = "+91 9699623581 / 9529766041";


export const DEFAULT_SLOTS: MatchSlot[] = [
  {
    id: 'slot-1',
    time: '04:00 PM',
    label: 'Afternoon Scrims (Match 1)',
    map: 'Erangel / Battle Royal',
    availableSlots: 6,
    totalSlots: 25,
  },
  {
    id: 'slot-2',
    time: '07:00 PM',
    label: 'Prime Showdown (Match 2)',
    map: 'Miramar / Desert Arena',
    availableSlots: 3,
    totalSlots: 25,
  },
  {
    id: 'slot-3',
    time: '09:30 PM',
    label: 'Night Glory Finals (Match 3)',
    map: 'Erangel / Classic',
    availableSlots: 8,
    totalSlots: 25,
  },
  {
    id: 'slot-4',
    time: '11:00 PM',
    label: 'Midnight Clash (Match 4)',
    map: 'Sanhok / Jungle Storm',
    availableSlots: 14,
    totalSlots: 25,
  },
];

export const PRIZE_BREAKDOWN: PrizeBreakdown[] = [
  {
    rank: '1st Place (Champion)',
    amount: 700,
    label: 'Winner Winner + Custom Trophy Badge',
    icon: 'trophy',
  },
  {
    rank: '2nd Place (Runner-up)',
    amount: 200,
    label: 'Silver Medalist + Direct Finals Slot',
    icon: 'medal',
  },
  {
    rank: '3rd Place',
    amount: 100,
    label: 'Bronze Podium + Entry Cashback',
    icon: 'award',
  },
];

export const INITIAL_TEAMS: RegistrationEntry[] = [
  {
    id: 'reg-001',
    registrationNumber: 'BC-2026-9041',
    teamName: 'Shadow Vipers',
    teamId: 'SV-77',
    contactNumber: '9845123456',
    email: 'vipers.esports@gmail.com',
    gameMode: 'squad',
    slotDate: '2026-08-18',
    slotTime: '07:00 PM (Prime Showdown)',
    map: 'Miramar / Desert Arena',
    players: [
      { name: 'Aman Roy (C)', inGameName: 'VIPER_God', gameUid: '5124982301' },
      { name: 'Rohan Sharma', inGameName: 'VIPER_Slayer', gameUid: '5124982302' },
      { name: 'Kunal Verma', inGameName: 'VIPER_Snipe', gameUid: '5124982303' },
      { name: 'Dev Malik', inGameName: 'VIPER_Immortal', gameUid: '5124982304' },
    ],
    paymentMethod: 'upi',
    paymentUtr: '428901238912',
    paymentStatus: 'confirmed',
    amount: 100,
    createdAt: '2026-08-15T14:30:00Z',
  },
  {
    id: 'reg-002',
    registrationNumber: 'BC-2026-8812',
    teamName: 'Dark Phoenix',
    teamId: 'DPX-09',
    contactNumber: '9123456780',
    email: 'captain.phoenix@gmail.com',
    gameMode: 'duo',
    slotDate: '2026-08-18',
    slotTime: '09:30 PM (Night Glory Finals)',
    map: 'Erangel / Classic',
    players: [
      { name: 'Vikram Rajput', inGameName: 'PHX_Blaze', gameUid: '5567891234' },
      { name: 'Samar Singh', inGameName: 'PHX_Inferno', gameUid: '5567891235' },
    ],
    paymentMethod: 'upi',
    paymentUtr: '439019283746',
    paymentStatus: 'confirmed',
    amount: 100,
    createdAt: '2026-08-15T16:15:00Z',
  },
  {
    id: 'reg-003',
    registrationNumber: 'BC-2026-7201',
    teamName: 'Lone Assassin',
    teamId: 'SOLO-44',
    contactNumber: '9988776655',
    email: 'kabir.gaming@gmail.com',
    gameMode: 'solo',
    slotDate: '2026-08-19',
    slotTime: '04:00 PM (Afternoon Scrims)',
    map: 'Erangel / Battle Royal',
    players: [
      { name: 'Kabir Mehta', inGameName: 'GhostRider_X', gameUid: '5981234567' },
    ],
    paymentMethod: 'upi',
    paymentUtr: '449102938475',
    paymentStatus: 'confirmed',
    amount: 100,
    createdAt: '2026-08-15T18:45:00Z',
  },
];

export const TOURNAMENT_RULES = [
  {
    title: 'Room ID & Password Delivery',
    desc: 'Room ID & Password will be shared on your registered Contact Number (WhatsApp/SMS) exactly 15 minutes before the match slot starts.',
  },
  {
    title: 'Strict Fair Play & Anti-Cheat',
    desc: 'Emulators, iPad view modifications, crosshair tools, and third-party scripts are strictly prohibited. Violators will face immediate ban with zero refund.',
  },
  {
    title: 'In-Game Name & UID Match',
    desc: 'Only the registered in-game name (IGN) and character UID will be allowed to join the custom room. Unregistered players will be kicked immediately.',
  },
  {
    title: 'Punctuality & Slot Lock',
    desc: 'Match starts precisely on time. Teams failing to enter before room lock (5 mins prior) will forfeit their slot.',
  },
  {
    title: 'Instant Prize Disbursal',
    desc: 'Prize pool of ₹1,000 will be transferred directly via UPI to winning captain within 30 minutes of official result screenshot verification.',
  },
];
