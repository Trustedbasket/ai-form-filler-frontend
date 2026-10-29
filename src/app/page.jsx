'use client';

import React, { useState } from 'react';
import MasterPinKeypad from '../components/MasterPinKeypad';
import VaultUploadForm from '../components/VaultUploadForm';
import ExamLauncher from '../components/ExamLauncher';
import { API_BASE_URL } from '../lib/api';
import { Shield, Terminal, Lock, Cpu } from 'lucide-react';

export default function DashboardPage() {
  // Volatile in-memory state ONLY — never written to localStorage/sessionStorage
  const [pin, setPin] = useState('');
  const [logs, setLogs] = useState([
    {
      time: new Date().toLocaleTimeString(),
      level: 'INFO',
      text: `Connected to Render Gateway (${API_BASE_URL})`,
    },
  ]);

  const appendLog = (level, text) => {
    setLogs((prev) => [
      { time: new Date().toLocaleTimeString(), level, text },
      ...prev.slice(0, 14),
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Enterprise Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                Automated AI Form Filler — Zero-Trust Vault & Launcher
              </h1>
              <p className="text-xs text-slate-400">
                Gateway: <span className="text-indigo-400 font-mono">{API_BASE_URL}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Lock className="w-3.5 h-3.5" />
              No LocalStorage PII
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              Volatile React State
            </span>
          </div>
        </header>

        {/* Main 12-Col Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 space-y-6">
            <MasterPinKeypad pin={pin} onChange={setPin} />
            <ExamLauncher
              pin={pin}
              onClearPin={() => setPin('')}
              onLog={appendLog}
            />
          </div>

          <div className="lg:col-span-7 space-y-6">
            <VaultUploadForm
              pin={pin}
              onClearPin={() => setPin('')}
              onLog={appendLog}
            />

            {/* Audit Log Console */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-300">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span>Session Security & Gateway Activity Log</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 max-h-40 overflow-y-auto font-mono text-xs space-y-1.5">
                {logs.map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-slate-500 shrink-0">[{entry.time}]</span>
                    <span
                      className={
                        entry.level === 'ERROR'
                          ? 'text-rose-400 font-semibold'
                          : entry.level === 'SUCCESS'
                          ? 'text-emerald-400 font-semibold'
                          : 'text-indigo-400'
                      }
                    >
                      {entry.level}:
                    </span>
                    <span className="text-slate-300">{entry.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
