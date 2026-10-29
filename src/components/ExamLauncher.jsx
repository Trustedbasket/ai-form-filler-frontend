
'use client';

import React, { useState } from 'react';
import { Rocket, Loader2, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { startExamAutomation } from '../lib/api';

const PRESET_EXAMS = [
  'SSC CGL',
  'UPSC CSE (Civil Services)',
  'IBPS PO',
  'RRB NTPC',
  'GATE',
  'NDA & NA',
  'Custom Exam',
];

export default function ExamLauncher({ pin, onClearPin, onLog }) {
  const [selectedPreset, setSelectedPreset] = useState('SSC CGL');
  const [customExam, setCustomExam] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const resolvedExamName = selectedPreset === 'Custom Exam' ? customExam : selectedPreset;

  const handleLaunch = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (pin.length !== 4) {
      setStatus({ type: 'error', message: 'Enter your 4-digit Master PIN on the keypad to authorize automation.' });
      return;
    }

    if (!resolvedExamName.trim()) {
      setStatus({ type: 'error', message: 'Please select or enter a valid Exam Name.' });
      return;
    }

    setIsLaunching(true);
    onLog?.('INFO', `Dispatching automation job for "${resolvedExamName.trim()}"...`);

    try {
      const result = await startExamAutomation({
        pin,
        examName: resolvedExamName,
      });

      // Immediately clear Master PIN from volatile React state after API success
      onClearPin?.();

      setStatus({
        type: 'success',
        message: result?.message || `Automation started for ${resolvedExamName}. Master PIN cleared from memory.`,
      });
      onLog?.('SUCCESS', `POST /api/task/start succeeded for "${resolvedExamName}". PIN wiped from memory.`);
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Failed to trigger exam automation.',
      });
      onLog?.('ERROR', `POST /api/task/start error: ${err.message}`);
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <form
      onSubmit={handleLaunch}
      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-white">Exam Automation Launcher</h2>
          <p className="text-xs text-slate-400">
            POST <code className="text-indigo-400">https://ai-form-filler-ntzw.onrender.com/api/task/start</code>
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          AI Agent Ready
        </span>
      </div>

      <div className="space-y-4 mb-5">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Select Target Examination</label>
          <select
            value={selectedPreset}
            onChange={(e) => setSelectedPreset(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
          >
            {PRESET_EXAMS.map((exam) => (
              <option key={exam} value={exam}>
                {exam}
              </option>
            ))}
          </select>
        </div>

        {selectedPreset === 'Custom Exam' && (
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Type Custom Exam Name</label>
            <input
              type="text"
              required
              value={customExam}
              onChange={(e) => setCustomExam(e.target.value)}
              placeholder="e.g., SBI Clerk 2026 / CSIR NET"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      {status.message && (
        <div
          className={`mb-4 p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
            status.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={isLaunching}
        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
      >
        {isLaunching ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Starting Automation Agent...
          </>
        ) : (
          <>
            <Rocket className="w-4 h-4" />
            Start Automation
          </>
        )}
      </button>
    </form>
  );
}
