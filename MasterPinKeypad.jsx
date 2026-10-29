'use client';

import React, { useState } from 'react';
import { ShieldCheck, Delete, RotateCcw, Shuffle, Eye, EyeOff, Lock } from 'lucide-react';

export default function MasterPinKeypad({ pin, onChange, disabled = false }) {
  const [digits, setDigits] = useState(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);
  const [showPin, setShowPin] = useState(false);
  const [scrambleOnPress, setScrambleOnPress] = useState(false);

  const shuffleArray = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const handleDigitClick = (digit) => {
    if (disabled || pin.length >= 4) return;
    onChange(pin + digit);
    if (scrambleOnPress) {
      setDigits((prev) => shuffleArray(prev));
    }
  };

  const handleBackspace = () => {
    if (disabled || pin.length === 0) return;
    onChange(pin.slice(0, -1));
  };

  const handleClear = () => {
    if (disabled) return;
    onChange('');
  };

  const handleManualShuffle = () => {
    if (disabled) return;
    setDigits((prev) => shuffleArray(prev));
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Master PIN Virtual Keypad</h2>
            <p className="text-xs text-slate-400">Anti-keylogger on-screen input (4 digits)</p>
          </div>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
            pin.length === 4
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}
        >
          {pin.length === 4 ? 'PIN Ready' : `${pin.length}/4 Digits`}
        </span>
      </div>

      {/* Masked PIN Display */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3 mx-auto">
          {[0, 1, 2, 3].map((idx) => {
            const char = pin[idx];
            const isFilled = Boolean(char);
            return (
              <div
                key={idx}
                className={`w-12 h-14 rounded-xl flex items-center justify-center text-xl font-bold transition-all border ${
                  isFilled
                    ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-inner shadow-indigo-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}
              >
                {isFilled ? (showPin ? char : '•') : '–'}
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => setShowPin((prev) => !prev)}
          className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          title={showPin ? 'Hide PIN' : 'Show PIN'}
        >
          {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Security Controls */}
      <div className="flex items-center justify-between mb-4 text-xs text-slate-400">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={scrambleOnPress}
            onChange={(e) => setScrambleOnPress(e.target.checked)}
            className="rounded border-slate-700 bg-slate-800 text-indigo-500 focus:ring-indigo-500"
          />
          <span>Auto-scramble after each tap</span>
        </label>
        <button
          type="button"
          onClick={handleManualShuffle}
          disabled={disabled}
          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium"
        >
          <Shuffle className="w-3.5 h-3.5" />
          Shuffle Keys
        </button>
      </div>

      {/* 3x4 Virtual Keypad Grid */}
      <div className="grid grid-cols-3 gap-2.5 select-none">
        {digits.slice(0, 9).map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={disabled || pin.length >= 4}
            onClick={() => handleDigitClick(digit)}
            className="h-12 rounded-xl bg-slate-800/80 hover:bg-indigo-600/20 active:scale-95 border border-slate-700/70 hover:border-indigo-500/50 text-white font-semibold text-lg transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            {digit}
          </button>
        ))}

        <button
          type="button"
          onClick={handleClear}
          disabled={disabled || pin.length === 0}
          className="h-12 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 font-medium text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
        >
          <RotateCcw className="w-4 h-4" />
          Clear
        </button>

        <button
          type="button"
          disabled={disabled || pin.length >= 4}
          onClick={() => handleDigitClick(digits[9])}
          className="h-12 rounded-xl bg-slate-800/80 hover:bg-indigo-600/20 active:scale-95 border border-slate-700/70 hover:border-indigo-500/50 text-white font-semibold text-lg transition-all disabled:opacity-40 disabled:pointer-events-none"
        >
          {digits[9]}
        </button>

        <button
          type="button"
          onClick={handleBackspace}
          disabled={disabled || pin.length === 0}
          className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-medium text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
        >
          <Delete className="w-4 h-4" />
          Back
        </button>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>Physical keyboard entry is disabled to protect against hardware/OS keyloggers.</span>
      </div>
    </div>
  );
}
