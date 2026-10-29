'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileCheck2, AlertTriangle, CheckCircle2, Loader2, User, Calendar, Users } from 'lucide-react';
import { uploadVaultData, MAX_FILE_SIZE_BYTES } from '../lib/api';

export default function VaultUploadForm({ pin, onClearPin, onLog }) {
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [dob, setDob] = useState('');
  const [photo, setPhoto] = useState(null);
  const [signature, setSignature] = useState(null);

  const [fileError, setFileError] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const photoInputRef = useRef(null);
  const signatureInputRef = useRef(null);

  const formatSize = (bytes) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  const handleFileSelection = (e, type) => {
    const file = e.target.files?.[0];
    setFileError('');
    setStatus({ type: '', message: '' });

    if (!file) {
      if (type === 'photo') setPhoto(null);
      if (type === 'signature') setSignature(null);
      return;
    }

    // Strict 5MB Client-Side Validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const msg = `Blocked "${file.name}" (${formatSize(file.size)}). Maximum allowed file size is 5.00 MB.`;
      setFileError(msg);
      e.target.value = '';
      if (type === 'photo') setPhoto(null);
      if (type === 'signature') setSignature(null);
      onLog?.('ERROR', msg);
      return;
    }

    if (type === 'photo') setPhoto(file);
    if (type === 'signature') setSignature(file);
  };

  const resetVolatileMemory = () => {
    setName('');
    setFatherName('');
    setDob('');
    setPhoto(null);
    setSignature(null);
    if (photoInputRef.current) photoInputRef.current.value = '';
    if (signatureInputRef.current) signatureInputRef.current.value = '';
    onClearPin?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFileError('');
    setStatus({ type: '', message: '' });

    if (pin.length !== 4) {
      setStatus({ type: 'error', message: 'Please enter your 4-digit Master PIN on the Virtual Keypad first.' });
      return;
    }

    if (!name.trim() || !fatherName.trim() || !dob || !photo || !signature) {
      setStatus({ type: 'error', message: 'All Biodata fields, Photo, and Signature are required.' });
      return;
    }

    if (photo.size > MAX_FILE_SIZE_BYTES || signature.size > MAX_FILE_SIZE_BYTES) {
      setStatus({ type: 'error', message: 'One or more files exceed the 5MB limit.' });
      return;
    }

    setIsSubmitting(true);
    onLog?.('INFO', 'Encrypting and uploading Vault payload to Render gateway...');

    try {
      const result = await uploadVaultData({
        pin,
        name,
        fatherName,
        dob,
        photo,
        signature,
      });

      // Immediately purge sensitive PII and Master PIN from React state
      resetVolatileMemory();

      setStatus({
        type: 'success',
        message: result?.message || 'Vault uploaded & volatile memory wiped.',
      });
      onLog?.('SUCCESS', 'POST /api/vault/upload succeeded. PII & Master PIN purged from memory.');
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Unable to reach Render API Gateway.',
      });
      onLog?.('ERROR', `POST /api/vault/upload error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-white">Encrypted Vault Upload</h2>
            <p className="text-xs text-slate-400">
              POST <code className="text-indigo-400">https://ai-form-filler-ntzw.onrender.com/api/vault/upload</code>
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            Max 5MB / File
          </span>
        </div>

        {/* Biodata Inputs */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Candidate Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Aarav Sharma"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Father&apos;s Name</label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  placeholder="e.g., Rajesh Sharma"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Date of Birth (DOB)</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* File Uploads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="bg-slate-950/90 border border-dashed border-slate-700 hover:border-indigo-500/60 rounded-xl p-4 transition-colors">
            <label className="block text-xs font-medium text-slate-300 mb-2">Passport Photo (≤ 5MB)</label>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFileSelection(e, 'photo')}
              className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-indigo-500/15 file:text-indigo-300 hover:file:bg-indigo-500/25 cursor-pointer"
            />
            {photo && (
              <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400">
                <FileCheck2 className="w-4 h-4 shrink-0" />
                <span className="truncate">{photo.name} ({formatSize(photo.size)})</span>
              </div>
            )}
          </div>

          <div className="bg-slate-950/90 border border-dashed border-slate-700 hover:border-indigo-500/60 rounded-xl p-4 transition-colors">
            <label className="block text-xs font-medium text-slate-300 mb-2">Digital Signature (≤ 5MB)</label>
            <input
              ref={signatureInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleFileSelection(e, 'signature')}
              className="block w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-indigo-500/15 file:text-indigo-300 hover:file:bg-indigo-500/25 cursor-pointer"
            />
            {signature && (
              <div className="mt-2.5 flex items-center gap-1.5 text-xs text-emerald-400">
                <FileCheck2 className="w-4 h-4 shrink-0" />
                <span className="truncate">{signature.name} ({formatSize(signature.size)})</span>
              </div>
            )}
          </div>
        </div>

        {/* Validation & API Alerts */}
        {fileError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{fileError}</span>
          </div>
        )}

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
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading & Encrypting Vault...
          </>
        ) : (
          <>
            <UploadCloud className="w-4 h-4" />
            Upload to Secure Vault
          </>
        )}
      </button>
    </form>
  );
}
