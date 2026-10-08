'use client';

import React, { useState } from 'react';
import { ResumeData } from '@/types/resume';
import { ALL_WORD_FORMATS, downloadInFormat } from '@/lib/formatExporters';
import {
  Download,
  FileText,
  Printer,
  X,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Globe,
  Database,
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
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = async (formatId: string) => {
    setIsExporting(formatId);
    setErrorMsg(null);
    setDownloadSuccess(null);

    try {
      await downloadInFormat(formatId, data, 'resume-canvas-sheet');
      const fmt = ALL_WORD_FORMATS.find((f) => f.id === formatId);
      setDownloadSuccess(`✓ ${fmt?.name || formatId} সফলভাবে ডাউনলোড হয়েছে!`);
      setTimeout(() => {
        setDownloadSuccess(null);
      }, 3500);
    } catch (err: any) {
      console.error('Download error:', err);
      setErrorMsg('ডাউনলোডে সমস্যা হয়েছে। সরাসরি প্রিন্ট বা .txt ট্রাই করুন।');
    } finally {
      setIsExporting(null);
    }
  };

  const handlePrint = () => {
    onClose();
    setTimeout(() => window.print(), 200);
  };

  const getFormatIcon = (id: string) => {
    switch (id) {
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-400" />;
      case 'pdf':
        return <Download className="w-5 h-5 text-rose-400" />;
      case 'txt':
        return <FileCode className="w-5 h-5 text-amber-400" />;
      case 'html':
        return <Globe className="w-5 h-5 text-emerald-400" />;
      case 'json':
        return <Database className="w-5 h-5 text-purple-400" />;
      default:
        return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  সেভ ও ডাউনলোড (Save As)
                </h2>
                <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-300 font-bold rounded-full border border-blue-500/30">
                  ৫টি প্রধান ফরম্যাট
                </span>
              </div>
              <p className="text-xs text-slate-400">
                পছন্দের ফরম্যাটে ১-ক্লিকে সরাসরি ডাউনলোড করুন
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-3.5">
          {/* Notification */}
          {downloadSuccess && (
            <div className="p-3 bg-emerald-950/90 border border-emerald-500/50 rounded-xl flex items-center gap-2.5 text-emerald-300 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{downloadSuccess}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-950/90 border border-rose-500/50 rounded-xl flex items-center gap-2.5 text-rose-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 5 Clean Format Options */}
          <div className="space-y-2">
            {ALL_WORD_FORMATS.map((fmt) => {
              const isCurrentlyExporting = isExporting === fmt.id;
              return (
                <div
                  key={fmt.id}
                  onClick={() => handleDownload(fmt.id)}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-slate-600 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:scale-105 transition-transform">
                      {getFormatIcon(fmt.id)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{fmt.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {fmt.extension}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{fmt.description}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!!isExporting}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 group-hover:bg-blue-600 border border-blue-500/30 group-hover:border-blue-500 rounded-lg text-xs font-semibold text-blue-300 group-hover:text-white transition-all shrink-0"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isCurrentlyExporting ? 'ডাউনলোড হচ্ছে...' : 'ডাউনলোড'}</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Direct Print Option */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">অথবা ফুল পেজ প্রিন্ট করতে চান?</span>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Direct Print / PDF View</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-lg transition-colors"
          >
            বন্ধ করুন (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
