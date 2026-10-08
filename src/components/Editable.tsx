'use client';

import React, { useRef, useEffect } from 'react';

interface EditableProps {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div' | 'li';
}

export const Editable: React.FC<EditableProps> = ({
  value,
  onChange,
  className = '',
  style = {},
  placeholder = 'Type here...',
  as: Tag = 'div',
}) => {
  const ref = useRef<HTMLElement | null>(null);

  // Synchronize internal DOM when value changes externally (e.g. template switch, upload)
  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      if (ref.current.textContent !== (value || '')) {
        ref.current.textContent = value || '';
      }
    }
  }, [value]);

  const setRef = (node: HTMLElement | null) => {
    ref.current = node;
    if (node && node.textContent !== (value || '') && document.activeElement !== node) {
      node.textContent = value || '';
    }
  };

  const handleInput = () => {
    if (ref.current) {
      const text = ref.current.textContent || '';
      onChange(text);
    }
  };

  const handleBlur = () => {
    if (ref.current) {
      const text = ref.current.textContent || '';
      onChange(text);
    }
  };

  return (
    <Tag
      ref={setRef as any}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onInput={handleInput}
      onBlur={handleBlur}
      dir="ltr"
      className={`outline-none transition-all duration-150 empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none hover:bg-blue-50/60 hover:ring-1 hover:ring-blue-400 focus:bg-blue-50 focus:ring-2 focus:ring-blue-600 rounded px-1 -mx-1 cursor-text ${className}`}
      style={{ ...style, direction: 'ltr', unicodeBidi: 'plaintext' }}
      data-placeholder={placeholder}
    />
  );
};
