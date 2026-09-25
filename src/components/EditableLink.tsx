'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, Link as LinkIcon, Edit2, Check, X } from 'lucide-react';

interface EditableLinkProps {
  label: string;
  url?: string;
  onChangeLabel: (newLabel: string) => void;
  onChangeUrl: (newUrl: string) => void;
  className?: string;
  prefix?: string;
}

export const EditableLink: React.FC<EditableLinkProps> = ({
  label,
  url = '',
  onChangeLabel,
  onChangeUrl,
  className = '',
  prefix = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempLabel, setTempLabel] = useState(label);
  const [tempUrl, setTempUrl] = useState(url);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempLabel(label);
    setTempUrl(url);
  }, [label, url]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSave = () => {
    onChangeLabel(tempLabel);
    onChangeUrl(tempUrl);
    setIsOpen(false);
  };

  const formattedUrl = url ? (url.startsWith('http') ? url : `https://${url}`) : '#';

  return (
    <div className="relative inline-flex items-center group/link">
      {prefix && <span className="mr-1 text-slate-800 font-semibold">{prefix}</span>}

      {/* Clickable Display Link */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1 text-blue-700 underline hover:text-blue-900 font-medium px-1 py-0.5 rounded hover:bg-blue-50 transition-colors ${className}`}
        title="লিংক এবং টেক্সট পরিবর্তন করতে ক্লিক করুন (Click to edit link)"
      >
        <span>{label || 'Add Link'}</span>
        <Edit2 className="w-2.5 h-2.5 opacity-0 group-hover/link:opacity-100 text-blue-500 transition-opacity no-print" />
      </button>

      {/* Link Editor Popover Dialog */}
      {isOpen && (
        <div
          ref={popoverRef}
          className="no-print absolute top-7 left-0 z-50 p-3.5 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 min-w-[280px] sm:min-w-[320px] space-y-2.5 text-xs animate-in fade-in zoom-in-95"
        >
          <div className="flex justify-between items-center border-b border-slate-800 pb-1.5 font-bold text-slate-200">
            <span className="flex items-center gap-1.5 text-blue-400">
              <LinkIcon className="w-3.5 h-3.5" /> লিংক এডিট করুন (Edit Link)
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400 block">
              ডিসপ্লে টেক্সট (Display Text):
            </label>
            <input
              type="text"
              value={tempLabel}
              onChange={(e) => setTempLabel(e.target.value)}
              placeholder="e.g. Live Demo, Portfolio"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400 block">
              ওয়েবসাইট লিংক বা URL (Target URL):
            </label>
            <input
              type="text"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            {url && (
              <a
                href={formattedUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>টেস্ট করুন</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-md text-xs shadow-md"
              >
                <Check className="w-3 h-3" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
