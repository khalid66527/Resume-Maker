'use client';

import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link as LinkIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Type,
  Palette,
  Highlighter,
  RemoveFormatting,
} from 'lucide-react';

export const RichToolbar: React.FC = () => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);
  const [currentSizeLabel, setCurrentSizeLabel] = useState('14px');
  const [showAlignPicker, setShowAlignPicker] = useState(false);
  const [showListPicker, setShowListPicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkVal, setLinkVal] = useState('');
  const savedRangeRef = useRef<Range | null>(null);

  // Keep track of active selection
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && savedRangeRef.current) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  };

  const applyFontSize = (sizePx: string, label: string) => {
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    try {
      document.execCommand('styleWithCSS', false, 'true');
    } catch {
      // ignore
    }

    const range = sel.getRangeAt(0);
    if (!range.collapsed) {
      const span = document.createElement('span');
      span.style.fontSize = sizePx;
      span.style.lineHeight = '1.3';
      try {
        const contents = range.extractContents();
        span.appendChild(contents);
        range.insertNode(span);

        sel.removeAllRanges();
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        sel.addRange(newRange);
      } catch {
        document.execCommand('fontSize', false, '3');
      }
    } else {
      let node: Node | null = range.startContainer;
      if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentElement;
      }
      if (node && (node as HTMLElement).isContentEditable) {
        (node as HTMLElement).style.fontSize = sizePx;
      }
    }

    setCurrentSizeLabel(label);
    setShowFontSizePicker(false);
  };

  const exec = (cmd: string, val?: string) => {
    restoreSelection();
    document.execCommand(cmd, false, val);
  };

  const handleLink = () => {
    restoreSelection();
    if (linkVal) {
      const url = linkVal.startsWith('http') ? linkVal : `https://${linkVal}`;
      document.execCommand('createLink', false, url);
    }
    setShowLinkInput(false);
    setLinkVal('');
  };

  const FONT_SIZES = [
    { label: 'Small (10px)', px: '10px' },
    { label: 'Compact (12px)', px: '12px' },
    { label: 'Normal (14px)', px: '14px' },
    { label: 'Regular (16px)', px: '16px' },
    { label: 'Medium (18px)', px: '18px' },
    { label: 'Large (22px)', px: '22px' },
    { label: 'Title (26px)', px: '26px' },
    { label: 'Heading (32px)', px: '32px' },
  ];

  return (
    <div
      className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-700/80 rounded-xl text-white shadow-xl select-none"
      onMouseDown={() => saveSelection()}
    >
      {/* 1. Font Size Dropdown Menu */}
      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            saveSelection();
          }}
          onClick={() => {
            setShowFontSizePicker(!showFontSizePicker);
            setShowColorPicker(false);
            setShowBgPicker(false);
            setShowAlignPicker(false);
            setShowListPicker(false);
          }}
          className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 rounded-lg text-xs font-semibold text-slate-200 transition-all cursor-pointer"
          title="Font Size"
        >
          <Type className="w-3.5 h-3.5 text-blue-400" />
          <span>{currentSizeLabel}</span>
          <span className="text-[8px] text-slate-400 ml-0.5">▼</span>
        </button>

        {showFontSizePicker && (
          <div
            className="absolute top-9 left-0 p-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 min-w-[140px] space-y-0.5 animate-in fade-in"
            onMouseDown={(e) => e.preventDefault()}
          >
            {FONT_SIZES.map((sz) => (
              <button
                key={sz.px}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFontSize(sz.px, sz.label.split(' ')[0])}
                className="w-full text-left px-2.5 py-1 text-xs hover:bg-blue-600 hover:text-white rounded-md text-slate-200 transition-colors flex items-center justify-between"
              >
                <span>{sz.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Basic Formatting (B, I, U, S) */}
      <div className="flex items-center gap-0.5 px-1 border-x border-slate-800">
        <button
          type="button"
          onClick={() => exec('bold')}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-200 hover:text-white transition-colors"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec('italic')}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-200 hover:text-white transition-colors"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec('underline')}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-200 hover:text-white transition-colors"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec('strikeThrough')}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-200 hover:text-white transition-colors"
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Alignment Dropdown Menu */}
      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            saveSelection();
          }}
          onClick={() => {
            setShowAlignPicker(!showAlignPicker);
            setShowFontSizePicker(false);
            setShowColorPicker(false);
            setShowBgPicker(false);
            setShowListPicker(false);
          }}
          className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg text-xs font-medium text-slate-200"
          title="Text Alignment"
        >
          <AlignLeft className="w-3.5 h-3.5 text-slate-300" />
          <span className="hidden sm:inline text-[11px]">Align</span>
          <span className="text-[8px] text-slate-400">▼</span>
        </button>

        {showAlignPicker && (
          <div
            className="absolute top-9 left-0 p-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 min-w-[130px] space-y-0.5"
            onMouseDown={(e) => e.preventDefault()}
          >
            <button
              type="button"
              onClick={() => {
                exec('justifyLeft');
                setShowAlignPicker(false);
              }}
              className="w-full flex items-center gap-2 px-2 py-1 text-xs hover:bg-blue-600 rounded text-slate-200 hover:text-white"
            >
              <AlignLeft className="w-3.5 h-3.5" /> Align Left
            </button>
            <button
              type="button"
              onClick={() => {
                exec('justifyCenter');
                setShowAlignPicker(false);
              }}
              className="w-full flex items-center gap-2 px-2 py-1 text-xs hover:bg-blue-600 rounded text-slate-200 hover:text-white"
            >
              <AlignCenter className="w-3.5 h-3.5" /> Align Center
            </button>
            <button
              type="button"
              onClick={() => {
                exec('justifyRight');
                setShowAlignPicker(false);
              }}
              className="w-full flex items-center gap-2 px-2 py-1 text-xs hover:bg-blue-600 rounded text-slate-200 hover:text-white"
            >
              <AlignRight className="w-3.5 h-3.5" /> Align Right
            </button>
            <button
              type="button"
              onClick={() => {
                exec('justifyFull');
                setShowAlignPicker(false);
              }}
              className="w-full flex items-center gap-2 px-2 py-1 text-xs hover:bg-blue-600 rounded text-slate-200 hover:text-white"
            >
              <AlignJustify className="w-3.5 h-3.5" /> Justify
            </button>
          </div>
        )}
      </div>

      {/* 4. Lists Dropdown Menu */}
      <div className="relative">
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            saveSelection();
          }}
          onClick={() => {
            setShowListPicker(!showListPicker);
            setShowFontSizePicker(false);
            setShowColorPicker(false);
            setShowBgPicker(false);
            setShowAlignPicker(false);
          }}
          className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg text-xs font-medium text-slate-200"
          title="Lists"
        >
          <List className="w-3.5 h-3.5 text-slate-300" />
          <span className="hidden sm:inline text-[11px]">List</span>
          <span className="text-[8px] text-slate-400">▼</span>
        </button>

        {showListPicker && (
          <div
            className="absolute top-9 left-0 p-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 min-w-[130px] space-y-0.5"
            onMouseDown={(e) => e.preventDefault()}
          >
            <button
              type="button"
              onClick={() => {
                exec('insertUnorderedList');
                setShowListPicker(false);
              }}
              className="w-full flex items-center gap-2 px-2 py-1 text-xs hover:bg-blue-600 rounded text-slate-200 hover:text-white"
            >
              <List className="w-3.5 h-3.5" /> Bullet List
            </button>
            <button
              type="button"
              onClick={() => {
                exec('insertOrderedList');
                setShowListPicker(false);
              }}
              className="w-full flex items-center gap-2 px-2 py-1 text-xs hover:bg-blue-600 rounded text-slate-200 hover:text-white"
            >
              <ListOrdered className="w-3.5 h-3.5" /> Numbered List
            </button>
          </div>
        )}
      </div>

      {/* 5. Colors & Highlight */}
      <div className="relative flex items-center gap-0.5 px-1 border-x border-slate-800">
        <button
          type="button"
          onClick={() => {
            setShowColorPicker(!showColorPicker);
            setShowBgPicker(false);
            setShowFontSizePicker(false);
            setShowAlignPicker(false);
            setShowListPicker(false);
          }}
          className="p-1.5 hover:bg-slate-800 rounded text-blue-400 hover:text-blue-300 transition-colors"
          title="Text Color"
        >
          <Palette className="w-3.5 h-3.5" />
        </button>

        {showColorPicker && (
          <div className="absolute top-9 left-0 p-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl grid grid-cols-5 gap-1.5 z-50">
            {['#000000', '#0056B3', '#059669', '#DC2626', '#7C3AED', '#D97706', '#0284C7', '#475569'].map(
              (c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    exec('foreColor', c);
                    setShowColorPicker(false);
                  }}
                  className="w-5 h-5 rounded-full border border-slate-600 hover:scale-110"
                  style={{ backgroundColor: c }}
                />
              )
            )}
            <input
              type="color"
              onChange={(e) => {
                exec('foreColor', e.target.value);
                setShowColorPicker(false);
              }}
              className="col-span-5 w-full h-6 rounded cursor-pointer mt-1"
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setShowBgPicker(!showBgPicker);
            setShowColorPicker(false);
            setShowFontSizePicker(false);
            setShowAlignPicker(false);
            setShowListPicker(false);
          }}
          className="p-1.5 hover:bg-slate-800 rounded text-yellow-400 hover:text-yellow-300 transition-colors"
          title="Highlight Background"
        >
          <Highlighter className="w-3.5 h-3.5" />
        </button>

        {showBgPicker && (
          <div className="absolute top-9 left-4 p-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl grid grid-cols-3 gap-1.5 z-50">
            {['transparent', '#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#fed7aa'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  exec('hiliteColor', c);
                  setShowBgPicker(false);
                }}
                className="w-6 h-6 rounded border border-slate-600"
                style={{ backgroundColor: c === 'transparent' ? '#334155' : c }}
              />
            ))}
          </div>
        )}
      </div>

      {/* 6. Link & Clear */}
      <div className="relative flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => setShowLinkInput(!showLinkInput)}
          className="p-1.5 hover:bg-slate-800 rounded text-cyan-400 hover:text-cyan-300 transition-colors"
          title="Insert Hyperlink"
        >
          <LinkIcon className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec('removeFormat')}
          className="p-1.5 hover:bg-slate-800 rounded text-rose-400 hover:text-rose-300 transition-colors"
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>

        {showLinkInput && (
          <div className="absolute top-9 right-0 p-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl flex items-center gap-2 z-50 min-w-[220px]">
            <input
              type="text"
              placeholder="https://example.com"
              value={linkVal}
              onChange={(e) => setLinkVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleLink();
              }}
              className="px-2 py-1 text-xs bg-slate-900 border border-slate-700 rounded text-white w-full focus:outline-none"
              autoFocus
            />
            <button
              type="button"
              onClick={handleLink}
              className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs rounded font-medium"
            >
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
