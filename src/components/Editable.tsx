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

  // Synchronize internal DOM only when not actively focused by user
  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      if (ref.current.innerText !== (value || '')) {
        ref.current.innerText = value || '';
      }
    }
  }, [value]);

  const handleBlur = () => {
    if (ref.current) {
      const text = ref.current.innerText;
      onChange(text);
    }
  };

  const handleInput = () => {
    if (ref.current) {
      const text = ref.current.innerText;
      onChange(text);
    }
  };

  return (
    <Tag
      ref={ref as any}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onInput={handleInput}
      onBlur={handleBlur}
      className={`outline-none transition-all duration-150 empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none hover:bg-blue-50/60 hover:ring-1 hover:ring-blue-400 focus:bg-blue-50 focus:ring-2 focus:ring-blue-600 rounded px-1 -mx-1 cursor-text ${className}`}
      style={style}
      data-placeholder={placeholder}
    >
      {value || ''}
    </Tag>
  );
};
