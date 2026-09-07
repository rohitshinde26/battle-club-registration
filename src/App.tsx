/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PrizePoolBanner } from './components/PrizePoolBanner';
import { RegistrationForm } from './components/RegistrationForm';
import { BattlePassTicket } from './components/BattlePassTicket';
import { RegisteredTeamsBoard } from './components/RegisteredTeamsBoard';
import { TournamentRules } from './components/TournamentRules';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { RegistrationEntry } from './types';
import { INITIAL_TEAMS, HELPLINE_NUMBER, WHATSAPP_NUMBER } from './data/tournamentData';
import { Shield, Sparkles, MessageCircle, Phone, Trophy, CheckCircle2, CloudCheck, Wifi } from 'lucide-react';
import { Logo } from './components/Logo';
import { 
  subscribeToRegistrations, 
  saveRegistration, 
  updateRegistration, 
  deleteRegistration,
  subscribeToAdminAuth,
  adminSignOut,
} from './firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState<'register' | 'teams' | 'rules' | 'admin'>('register');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Track real Firebase Authentication state for the admin dashboard
  useEffect(() => {
    const unsubscribe = subscribeToAdminAuth((user) => {
      setIsAdminLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const [registrations, setRegistrations] = useState<RegistrationEntry[]>(() => {
    try {
      const saved = localStorage.getItem('battle_club_registrations_cache');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Local storage cache read error:", e);
    }
    return INITIAL_TEAMS;
  });

  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(true);
  const [activePass, setActivePass] = useState<RegistrationEntry | null>(null);

  // Subscribe to real-time Firestore updates
  useEffect(() => {
    const unsubscribe = subscribeToRegistrations(
      (liveData) => {
        setIsLiveConnected(true);
        if (liveData && liveData.length > 0) {
          setRegistrations(liveData);
          try {
            localStorage.setItem('battle_club_registrations_cache', JSON.stringify(liveData));
          } catch (e) {
            console.warn(e);
          }
        }
      },
      (err) => {
        console.warn("Operating with local backup cache:", err.message);
        setIsLiveConnected(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleAdminLoginSuccess = () => {
    // The onAuthStateChanged listener above will flip isAdminLoggedIn once
    // Firebase confirms the session; nothing else to do here.
  };

  const handleAdminLogout = async () => {
    try {
      await adminSignOut();
    } catch (e) {
      console.error(e);
    }
    setActiveTab('register');
  };

  const handleSuccessfulRegistration = async (entry: RegistrationEntry) => {
    // Save to Firestore
    try {
      const docId = await saveRegistration(entry);
      const savedEntry = { ...entry, id: docId };
      setActivePass(savedEntry);
    } catch (e) {
      console.error("Failed to save to Firestore, using local state:", e);
      setRegistrations((prev) => [entry, ...prev]);
      setActivePass(entry);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminAddRegistration = async (entry: RegistrationEntry) => {
    try {
      await saveRegistration(entry);
    } catch (e) {
      console.error("Firestore admin save error:", e);
      setRegistrations((prev) => [entry, ...prev]);
    }
  };

  const handleAdminUpdateRegistration = async (updated: RegistrationEntry) => {
    try {
      await updateRegistration(updated);
    } catch (e) {
      console.error("Firestore admin update error:", e);
      setRegistrations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    }
  };

  const handleAdminDeleteRegistration = async (id: string) => {
    try {
      await deleteRegistration(id);
    } catch (e) {
      console.error("Firestore admin delete error:", e);
      setRegistrations((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleRegisterAnother = () => {
    setActivePass(null);
    setActiveTab('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewAllTeams = () => {
    setActivePass(null);
    setActiveTab('teams');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPassFromList = (entry: RegistrationEntry) => {
    setActivePass(entry);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-[#e2e8f0]">
      {/* Top Header with Title & Logo */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActivePass(null);
          setActiveTab(tab);
        }}
        registeredCount={registrations.length}
        isAdminLoggedIn={isAdminLoggedIn}
        isLiveConnected={isLiveConnected}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* If viewing a generated or inspected Battle Pass */}
        {activePass ? (
          <BattlePassTicket
            registration={activePass}
            onRegisterAnother={handleRegisterAnother}
            onViewAllTeams={handleViewAllTeams}
          />
        ) : (
          <>
            {/* Show Prize Banner on public pages */}
            {activeTab !== 'admin' && <PrizePoolBanner />}

            {/* Tab Views */}
            {activeTab === 'register' && (
              <div className="space-y-6">
                <RegistrationForm onSuccessfulRegistration={handleSuccessfulRegistration} />
              </div>
            )}

            {activeTab === 'teams' && (
              <RegisteredTeamsBoard
                registrations={registrations}
                onSelectPass={handleSelectPassFromList}
                onGoToRegister={() => {
                  setActivePass(null);
                  setActiveTab('register');
                }}
              />
            )}

            {activeTab === 'rules' && (
              <TournamentRules
                onGoToRegister={() => {
                  setActivePass(null);
                  setActiveTab('register');
                }}
              />
            )}

            {activeTab === 'admin' && (
              isAdminLoggedIn ? (
                <AdminDashboard
                  registrations={registrations}
                  onAddRegistration={handleAdminAddRegistration}
                  onUpdateRegistration={handleAdminUpdateRegistration}
                  onDeleteRegistration={handleAdminDeleteRegistration}
                  onViewPass={(entry) => setActivePass(entry)}
                  onLogout={handleAdminLogout}
                  isLiveConnected={isLiveConnected}
                />
              ) : (
                <AdminLogin
                  onLoginSuccess={handleAdminLoginSuccess}
                  onBackToUserSite={() => setActiveTab('register')}
                />
              )
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#080c14] mt-12 py-8 px-4 sm:px-6 text-slate-400 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo size="sm" showText={false} />
            <div>
              <p className="font-display font-bold text-white text-sm tracking-wider uppercase">
                BATTLE CLUB ESPORTS
              </p>
              <p className="text-[11px] text-slate-400">
                Official Competitive Tournament & Scrims Platform &bull; All Rights Reserved &copy; 2026
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
            <a
              href={`https://api.whatsapp.com/send?phone=919876543210&text=Hi%20Battle%20Club%20Support`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Helpline</span>
            </a>
            <span className="text-slate-700">•</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{HELPLINE_NUMBER}</span>
            </div>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => {
                setActivePass(null);
                setActiveTab('admin');
              }}
              className="text-amber-400/90 hover:text-amber-300 font-mono underline"
            >
              Admin Access
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
