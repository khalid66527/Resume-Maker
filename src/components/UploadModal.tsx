'use client';

import React, { useState, useRef } from 'react';
import { ResumeData } from '@/types/resume';
import { parseRawResumeText } from '@/lib/resumeParser';
import { khalidResumeData, emptyResumeData } from '@/lib/khalidResumeData';
import {
  Upload,
  FileText,
  FileCode,
  Sparkles,
  ClipboardPaste,
  X,
  CheckCircle,
} from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadData: (data: ResumeData) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onLoadData,
}) => {
  const [pastedText, setPastedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();

    if (file.name.endsWith('.json')) {
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.fullName) {
            onLoadData(parsed);
            onClose();
          } else {
            alert('JSON ফাইলটি সঠিক ফরম্যাটে নেই।');
          }
        } catch {
          alert('JSON রিড করতে ব্যর্থ হয়েছে।');
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsText(file);
    } else {
      // For TXT or plain file read
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const parsed = parseRawResumeText(text);
          onLoadData(parsed);
          onClose();
        }
        setIsLoading(false);
      };
      reader.readAsText(file);
    }
  };

  const handleParsePasted = () => {
    if (!pastedText.trim()) {
      alert('অনুগ্রহ করে আপনার রেজিউমের টেক্সট পেস্ট করুন।');
      return;
    }
    const parsed = parseRawResumeText(pastedText);
    onLoadData(parsed);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                রেজিউমে আপলোড বা ইমপোর্ট করুন (Import Resume)
              </h2>
              <p className="text-xs text-slate-400">
                যেকোনো ফাইল আপলোড করুন অথবা সরাসরি টেক্সট পেস্ট করুন
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Quick Pre-loads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                onLoadData(khalidResumeData);
                onClose();
              }}
              className="flex items-center gap-3 p-3.5 bg-blue-950/40 hover:bg-blue-900/40 border border-blue-500/40 rounded-xl text-left transition-all group"
            >
              <div className="p-2 bg-blue-600 text-white rounded-lg group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">MD. KHALID HASAN Resume</div>
                <div className="text-[11px] text-blue-300">আপনার দেওয়া মূল রেজিউমে লোড করুন</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                onLoadData(emptyResumeData);
                onClose();
              }}
              className="flex items-center gap-3 p-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition-all"
            >
              <div className="p-2 bg-slate-800 text-slate-300 rounded-lg">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Blank Starter Template</div>
                <div className="text-[11px] text-slate-400">নতুন করে লেখার জন্য ফাঁকা ফরম্যাট</div>
              </div>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-xs text-slate-500 uppercase tracking-widest absolute">
              বা (Or)
            </span>
          </div>

          {/* File Upload Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-950/50 hover:bg-blue-950/10 transition-all space-y-2"
          >
            <Upload className="w-8 h-8 text-blue-400 mx-auto" />
            <div className="text-xs font-bold text-white">
              ফাইল ড্রপ করুন অথবা ব্রাউজ করুন (TXT, JSON)
            </div>
            <p className="text-[11px] text-slate-400">
              সাপোর্টেড ফরম্যাট: .txt, .json, .docx
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.json,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Paste Resume Text Box */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <ClipboardPaste className="w-3.5 h-3.5 text-blue-400" />
              রেজিউমে টেক্সট সরাসরি এখানে পেস্ট করুন:
            </label>
            <textarea
              rows={4}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="এখানে আপনার রেজিউমের লেখা পেস্ট করলে স্বয়ংক্রিয়ভাবে ফিল হয়ে যাবে..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl"
          >
            বাতিল (Cancel)
          </button>
          <button
            type="button"
            onClick={handleParsePasted}
            disabled={!pastedText.trim()}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-xs font-bold text-white rounded-xl shadow-lg transition-all"
          >
            অটো-ইমপোর্ট করুন (Import)
          </button>
        </div>
      </div>
    </div>
  );
};
