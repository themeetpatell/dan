'use client';

import { useRef, useState } from 'react';
import { Icon } from '@/lib/icons';
import ModelPicker from './ModelPicker';

interface ComposerProps {
  placeholder?: string;
  onSend?: (text: string) => void;
  autoFocus?: boolean;
}

export default function Composer({
  placeholder = 'Ask a question… (type @ to add context / drop file to attach)',
  onSend,
  autoFocus = false,
}: ComposerProps) {
  const [value, setValue] = useState('');
  const taRef = useRef<HTMLTextAreaElement>(null);

  const grow = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  };

  const submit = () => {
    const text = value.trim();
    if (!text) return;
    onSend?.(text);
    setValue('');
    if (taRef.current) taRef.current.style.height = 'auto';
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="composer">
      <textarea
        ref={taRef}
        className="composer__input"
        aria-label="Ask a question"
        placeholder={placeholder}
        value={value}
        rows={1}
        autoFocus={autoFocus}
        onChange={(e) => {
          setValue(e.target.value);
          grow(e.target);
        }}
        onKeyDown={onKeyDown}
      />
      <div className="composer__bar">
        <ModelPicker />
        <div className="composer__spacer" />
        <button className="icon-btn" aria-label="Attach file">
          <Icon.paperclip size={17} />
        </button>
        <button
          className="composer__send"
          onClick={submit}
          disabled={!value.trim()}
          aria-label="Send"
        >
          <Icon.send size={16} />
        </button>
      </div>
    </div>
  );
}
