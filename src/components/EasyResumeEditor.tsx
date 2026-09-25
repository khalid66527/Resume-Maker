'use client';

import React, { useState, useEffect } from 'react';
import { ResumeData } from '@/types/resume';
import { khalidResumeData } from '@/lib/khalidResumeData';
import { ResumeCanvas } from './ResumeCanvas';
import { RichToolbar } from './RichToolbar';
import { UploadModal } from './UploadModal';
import { ExportModal } from './ExportModal';
import {
  Upload,
  Download,
  Sparkles,
  FileText,
  Palette,
  Type,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle,
  Printer,
  Info,
} from 'lucide-react';

const FONTS = [
  { label: 'Inter (Clean & Modern)', value: 'Inter, sans-serif' },
  { label: 'Poppins (Geometric)', value: 'Poppins, sans-serif' },
  { label: 'Roboto (Standard Corporate)', value: 'Roboto, sans-serif' },
  { label: 'Georgia (Classic Serif)', value: 'Georgia, serif' },
  { label: 'Playfair Display (Luxury)', value: '"Playfair Display", Georgia, serif' },
];

const COLORS = [
  { name: 'Classic Blue', color: '#0056b3' },
  { name: 'Corporate Navy', color: '#1e3a8a' },
  { name: 'Tech Emerald', color: '#059669' },
  { name: 'Modern Violet', color: '#7c3aed' },
  { name: 'Burgundy Crimson', color: '#991b1b' },
  { name: 'Dark Slate', color: '#0f172a' },
];

export const EasyResumeEditor: React.FC = () => {
  const [data, setData] = useState<ResumeData>(khalidResumeData);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [zoom, setZoom] = useState<number>(95);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [savedAlert, setSavedAlert] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('khalid_resumemaker_data');
      if (saved) {
        setData(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Storage read error', e);
    }
  }, []);

  const updateData = (newData: ResumeData) => {
    setData(newData);
    try {
      localStorage.setItem('khalid_resumemaker_data', JSON.stringify(newData));
      setSavedAlert(true);
      setTimeout(() => setSavedAlert(false), 1500);
    } catch (e) {
      console.warn('Storage write error', e);
    }
  };

  const handleReset = () => {
    if (window.confirm('আপনি কি মূল রেজিউমেতে রিসেট করতে চান?')) {
      updateData(khalidResumeData);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* 1. Header Action Bar */}
      <header className="bg-slate-900 border-b border-slate-800 shrink-0 z-30 shadow-md">
        <div className="flex items-center justify-between px-4 py-2.5 gap-2 border-b border-slate-800/80">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 shadow-lg shadow-blue-500/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm md:text-base text-white tracking-tight">
                  Easy<span className="text-blue-400">Resume</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-blue-600/20 border border-blue-500/30 text-blue-300 font-bold rounded-full">
                  Word Style Live Editor
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                যেকোনো টেক্সটে ক্লিক করে সরাসরি মাইক্রোসফট ওয়ার্ডের মতো এডিট করুন
              </p>
            </div>
          </div>

          {/* Quick Actions (Upload / Color / Font / Sample) */}
          <div className="flex items-center gap-2">
            {/* Upload / Import Resume */}
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 hover:border-blue-500/50 rounded-xl text-xs font-semibold text-blue-300 transition-all shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              <span>আপলোড / ইমপোর্ট</span>
            </button>

            {/* 1-Click Khalid Resume Reset */}
            <button
              type="button"
              onClick={() => updateData(khalidResumeData)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-semibold transition-all"
              title="MD. KHALID HASAN রেজিউমে লোড করুন"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>খালিদের রেজিউমে</span>
            </button>

            {/* Color Picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowColorPicker(!showColorPicker);
                  setShowFontPicker(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 transition-colors"
                title="হেডিং ও লিংক কালার পরিবর্তন করুন"
              >
                <div
                  className="w-3 h-3 rounded-full border border-white/40"
                  style={{ backgroundColor: data.theme.primaryColor }}
                />
                <span className="hidden sm:inline">কালার</span>
              </button>

              {showColorPicker && (
                <div className="absolute top-10 left-0 p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 min-w-[180px] space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">রং নির্বাচন করুন</div>
                  <div className="space-y-1">
                    {COLORS.map((c, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          updateData({
                            ...data,
                            theme: { ...data.theme, primaryColor: c.color },
                          });
                          setShowColorPicker(false);
                        }}
                        className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800 text-xs text-left"
                      >
                        <span className="text-slate-200">{c.name}</span>
                        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.color }} />
                      </button>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span>Custom:</span>
                    <input
                      type="color"
                      value={data.theme.primaryColor}
                      onChange={(e) =>
                        updateData({
                          ...data,
                          theme: { ...data.theme, primaryColor: e.target.value },
                        })
                      }
                      className="w-7 h-6 rounded cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Font Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowFontPicker(!showFontPicker);
                  setShowColorPicker(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-medium text-slate-200 transition-colors"
                title="ফন্ট পরিবর্তন করুন"
              >
                <Type className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">ফন্ট</span>
              </button>

              {showFontPicker && (
                <div className="absolute top-10 left-0 p-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 min-w-[200px] space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">টাইপোগ্রাফি</div>
                  {FONTS.map((f, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        updateData({
                          ...data,
                          theme: { ...data.theme, fontFamily: f.value },
                        });
                        setShowFontPicker(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs text-slate-200"
                      style={{ fontFamily: f.value }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Export Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Save As / ডাউনলোড</span>
            </button>
          </div>
        </div>

        {/* 2. Word Ribbon Toolbar */}
        <div className="px-4 py-1.5 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <RichToolbar />
          </div>

          {/* Zoom Controls & Auto-save Status */}
          <div className="flex items-center gap-2.5 shrink-0">
            {savedAlert && (
              <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 animate-pulse">
                <CheckCircle className="w-3.5 h-3.5" /> Auto-saved
              </span>
            )}

            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs text-slate-300">
              <button
                type="button"
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="p-1 hover:text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1 text-[11px] font-mono">{zoom}%</span>
              <button
                type="button"
                onClick={() => setZoom(Math.min(130, zoom + 10))}
                className="p-1 hover:text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg"
              title="রিসেট করুন (Reset to Original)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. Main Document Canvas */}
      <main
        className="flex-1 h-full overflow-y-auto overflow-x-auto bg-slate-950 p-4 md:p-8 flex justify-center items-start scrollbar-thin"
        style={{
          backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      >
        <div
          className="w-full max-w-[850px] transition-transform duration-200 origin-top"
          style={{
            transform: `scale(${zoom / 100})`,
          }}
        >
          {/* Helpful Tip Banner */}
          <div className="no-print mb-3 px-4 py-2 bg-blue-950/50 border border-blue-800/40 rounded-xl text-xs text-blue-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
              <span>
                💡 <b>টিপ:</b> কাগজের যেকোনো লেখার উপর সরাসরি ক্লিক করে লিখুন, মুছুন বা সাইজ পরিবর্তন করুন।
              </span>
            </span>
            <span className="text-[11px] text-slate-400 hidden md:inline">
              Word (.docx), PDF, Text (.txt) বা Print করতে উপরের &apos;Save As&apos; বাটনে ক্লিক করুন
            </span>
          </div>

          {/* Actual Resume Sheet */}
          <ResumeCanvas data={data} onChange={updateData} />
        </div>
      </main>

      {/* 4. Modals */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onLoadData={updateData}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={data}
      />
    </div>
  );
};
