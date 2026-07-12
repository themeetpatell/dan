'use client';

import { useState } from 'react';
import { Icon } from '@/lib/icons';

export default function ThoughtProcess({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="thought" data-open={open}>
      <button className="thought__head" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <Icon.brain size={16} />
        Thought process
        <Icon.chevronD size={14} />
      </button>
      {open && <div className="thought__body">{text}</div>}
    </div>
  );
}
