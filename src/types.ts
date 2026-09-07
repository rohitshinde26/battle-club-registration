export type GameMode = 'solo' | 'duo' | 'squad';

export interface PlayerInfo {
  name: string;
  inGameName: string;
  gameUid: string;
}

export interface MatchSlot {
  id: string;
  time: string;
  label: string;
  map: string;
  availableSlots: number;
  totalSlots: number;
}

export interface RegistrationEntry {
  id: string;
  registrationNumber: string;
  teamName: string;
  teamId: string;
  contactNumber: string;
  email?: string;
  gameMode: GameMode;
  slotDate: string;
  slotTime: string;
  map: string;
  players: PlayerInfo[];
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cash';
  paymentUtr?: string;
  paymentSlipUrl?: string;
  paymentStatus: 'confirmed' | 'pending' | 'verified';
  amount: number;
  createdAt: string;
}

export interface PrizeBreakdown {
  rank: string;
  amount: number;
  label: string;
  icon: string;
}
