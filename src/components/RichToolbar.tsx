'use client';

import React, { useState } from 'react';
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
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkVal, setLinkVal] = useState('');

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
  };

  const handleLink = () => {
    if (linkVal) {
      const url = linkVal.startsWith('http') ? linkVal : `https://${linkVal}`;
      document.execCommand('createLink', false, url);
    }
    setShowLinkInput(false);
    setLinkVal('');
  };

  return (
    <div
      className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white shadow-lg select-none"
      onMouseDown={(e) => e.preventDefault()}
    >
      {/* Font Size */}
      <div className="flex items-center gap-1 px-1 border-r border-slate-700">
        <Type className="w-3.5 h-3.5 text-slate-400" />
        <select
          aria-label="Font size"
          onChange={(e) => exec('fontSize', e.target.value)}
          defaultValue="3"
          className="bg-slate-800 text-xs text-slate-200 rounded px-1.5 py-1 border border-slate-700 focus:outline-none cursor-pointer"
        >
          <option value="1">Small (10px)</option>
          <option value="2">Normal (13px)</option>
          <option value="3">Regular (16px)</option>
          <option value="4">Medium (18px)</option>
          <option value="5">Large (24px)</option>
          <option value="6">Heading (32px)</option>
        </select>
      </div>

      {/* Formatting */}
      <div className="flex items-center gap-0.5 px-1 border-r border-slate-700">
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

      {/* Alignment */}
      <div className="flex items-center gap-0.5 px-1 border-r border-slate-700">
        <button
          type="button"
          onClick={() => exec('justifyLeft')}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-200 hover:text-white transition-colors"
          title="Align Left"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec('justifyCenter')}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-200 hover:text-white transition-colors"
          title="Align Center"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec('justifyRight')}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-200 hover:text-white transition-colors"
          title="Align Right"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec('justifyFull')}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-200 hover:text-white transition-colors"
          title="Justify"
        >
          <AlignJustify className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Colors & Highlight */}
      <div className="relative flex items-center gap-0.5 px-1 border-r border-slate-700">
        <button
          type="button"
          onClick={() => {
            setShowColorPicker(!showColorPicker);
            setShowBgPicker(false);
          }}
          className="p-1.5 hover:bg-slate-800 rounded text-blue-400 hover:text-blue-300 transition-colors"
          title="Text Color"
        >
          <Palette className="w-3.5 h-3.5" />
        </button>

        {showColorPicker && (
          <div className="absolute top-10 left-0 p-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl grid grid-cols-5 gap-1.5 z-50">
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
          }}
          className="p-1.5 hover:bg-slate-800 rounded text-yellow-400 hover:text-yellow-300 transition-colors"
          title="Highlight Background"
        >
          <Highlighter className="w-3.5 h-3.5" />
        </button>

        {showBgPicker && (
          <div className="absolute top-10 left-6 p-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl grid grid-cols-3 gap-1.5 z-50">
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

      {/* Lists & Link */}
      <div className="relative flex items-center gap-0.5 px-1">
        <button
          type="button"
          onClick={() => exec('insertUnorderedList')}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-200 hover:text-white transition-colors"
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => exec('insertOrderedList')}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-200 hover:text-white transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
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
          <div className="absolute top-10 right-0 p-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl flex items-center gap-2 z-50 min-w-[220px]">
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
