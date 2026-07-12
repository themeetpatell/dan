'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/lib/icons';

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent('dan-toast', { detail: message }));
}

export default function Toast() {
  const [msg, setMsg] = useState('');
  const [show, setShow] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const handler = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      setShow(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShow(false), 2200);
    };
    window.addEventListener('dan-toast', handler);
    return () => {
      window.removeEventListener('dan-toast', handler);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="toast" data-show={show} role="status" aria-live="polite">
      <Icon.check size={16} />
      {msg}
    </div>
  );
}
