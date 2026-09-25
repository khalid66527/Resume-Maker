'use client';

import React, { useState } from 'react';
import { ResumeData } from '@/types/resume';
import { ALL_WORD_FORMATS, downloadInFormat } from '@/lib/formatExporters';
import {
  Download,
  FileText,
  Printer,
  X,
  Check,
  Search,
  ChevronDown,
  Layers,
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
  const [selectedFormatId, setSelectedFormatId] = useState<string>('docx');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const filteredFormats = ALL_WORD_FORMATS.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.extension.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedFormat =
    ALL_WORD_FORMATS.find((f) => f.id === selectedFormatId) || ALL_WORD_FORMATS[0];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await downloadInFormat(selectedFormatId, data, 'resume-canvas-sheet');
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsExporting(false);
      onClose();
    }
  };

  const handlePrint = () => {
    onClose();
    setTimeout(() => window.print(), 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header - Windows / Word Style Save As Dialog */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Save as type (সবগুলো ফরম্যাটে সেভ করুন)
                </h2>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-bold rounded-full border border-emerald-500/30">
                  ১৮টি ফরম্যাট
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Word Document, PDF, XPS, HTML, RTF, TXT, XML, ODT সহ সবগুলো ফরম্যাট সাপোর্টেড
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

        {/* Search & Filter Bar */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="ফরম্যাট খুঁজুন (Search by format, e.g. docx, pdf, rtf, txt, xml)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 hover:text-white transition-colors shrink-0"
            title="ব্রাউজার থেকে সরাসরি প্রিন্ট করুন"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Direct Print</span>
          </button>
        </div>

        {/* Dropdown Options List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2 max-h-[50vh] scrollbar-thin">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Save as type:
          </div>

          <div className="space-y-1.5">
            {filteredFormats.map((fmt) => {
              const isSelected = selectedFormatId === fmt.id;
              return (
                <div
                  key={fmt.id}
                  onClick={() => setSelectedFormatId(fmt.id)}
                  className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-950/50 shadow-md ring-1 ring-blue-500/50'
                      : 'border-slate-800 bg-slate-950/40 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-[10px] font-bold ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {fmt.extension.replace('.', '').slice(0, 4).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{fmt.name}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-normal">
                          {fmt.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{fmt.description}</p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
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
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            ফাইল নেম:{' '}
            <span className="text-white font-mono font-semibold">
              {data.fullName.replace(/[^a-zA-Z0-9]/g, '_')}_Resume{selectedFormat.extension}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 rounded-xl transition-colors"
            >
              বাতিল (Cancel)
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-xs font-bold text-white rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'তৈরি হচ্ছে...' : 'সেভ করুন (Save)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
