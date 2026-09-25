'use client';

import React, { useState } from 'react';
import { ResumeData } from '@/types/resume';
import { exportToDocx, exportToPdf, exportToTxt, exportToHtml } from '@/lib/exportUtils';
import {
  Download,
  FileText,
  FileCode,
  FileJson,
  Printer,
  X,
  Check,
  Globe,
  Sparkles,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<
    'docx' | 'pdf' | 'txt' | 'html' | 'print' | 'json'
  >('docx');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    const cleanName = data.fullName.replace(/[^a-zA-Z0-9]/g, '_');

    try {
      if (selectedFormat === 'docx') {
        await exportToDocx(data, `${cleanName}_Resume.docx`);
      } else if (selectedFormat === 'pdf') {
        await exportToPdf('resume-canvas-sheet', `${cleanName}_Resume.pdf`);
      } else if (selectedFormat === 'txt') {
        exportToTxt(data, `${cleanName}_Resume.txt`);
      } else if (selectedFormat === 'html') {
        exportToHtml('resume-canvas-sheet', data, `${cleanName}_Resume.html`);
      } else if (selectedFormat === 'print') {
        onClose();
        setTimeout(() => window.print(), 200);
        return;
      } else if (selectedFormat === 'json') {
        const dataStr =
          'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `${cleanName}_resume_backup.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      }
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
      onClose();
    }
  };

  const formats = [
    {
      id: 'docx',
      title: 'Word Document (*.docx)',
      desc: 'Microsoft Word-এ সরাসরি ওপেন ও এডিট করার উপযোগী ফাইল',
      badge: 'Native Word',
      icon: FileText,
      color: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
    },
    {
      id: 'pdf',
      title: 'PDF Document (*.pdf)',
      desc: 'চাকরির আবেদনের জন্য স্ট্যান্ডার্ড ও প্রিন্ট-রেডি A4 ভেক্টর ফাইল',
      badge: 'Recommended',
      icon: FileText,
      color: 'text-rose-400 bg-rose-500/20 border-rose-500/30',
    },
    {
      id: 'txt',
      title: 'Plain Text (*.txt)',
      desc: 'ATS সিস্টেমে দ্রুত পেস্ট ও টেক্সট ফরম্যাটে কপি করার জন্য',
      badge: 'ATS Safe',
      icon: FileCode,
      color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
    },
    {
      id: 'html',
      title: 'Single Web Page (*.html)',
      desc: 'যেকোনো ব্রাউজারে সুন্দরভাবে ওয়েবসাইট আকারে দেখার জন্য',
      badge: 'Web Ready',
      icon: Globe,
      color: 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30',
    },
    {
      id: 'print',
      title: 'Print Directly (A4 Paper)',
      desc: 'সরাসরি প্রিন্টারে পাঠিয়ে কাগজের ফরম্যাটে প্রিন্ট করুন',
      badge: 'Hardware Print',
      icon: Printer,
      color: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
    },
    {
      id: 'json',
      title: 'JSON Backup (*.json)',
      desc: 'ভবিষ্যতে রেজিউমে রিস্টোর ও এডিট করার ফুল ডেটা ব্যাকআপ',
      badge: 'Full Backup',
      icon: FileJson,
      color: 'text-purple-400 bg-purple-500/20 border-purple-500/30',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Save As / ডাউনলোড ফরম্যাট নির্বাচন করুন
              </h2>
              <p className="text-xs text-slate-400">
                Word Document (.docx), PDF, TXT, HTML বা প্রিন্ট করুন
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

        {/* Formats List matching Word Save As dialog */}
        <div className="p-5 space-y-2.5 overflow-y-auto max-h-[60vh]">
          {formats.map((fmt) => {
            const isSelected = selectedFormat === fmt.id;
            const Icon = fmt.icon;
            return (
              <div
                key={fmt.id}
                onClick={() => setSelectedFormat(fmt.id as any)}
                className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-950/40 shadow-md'
                    : 'border-slate-800 bg-slate-950/50 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${fmt.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{fmt.title}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-normal">
                        {fmt.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{fmt.desc}</p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected
                      ? 'border-blue-500 bg-blue-600 text-white'
                      : 'border-slate-700 bg-slate-800'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-between items-center">
          <div className="text-xs text-slate-400">
            ফাইল নেম: <span className="text-white font-mono">{data.fullName.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.{selectedFormat}</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl"
            >
              বাতিল
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-xs font-bold text-white rounded-xl shadow-lg transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'তৈরি হচ্ছে...' : 'ডাউনলোড করুন (Save)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
