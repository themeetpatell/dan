'use client';

import { useEffect, useRef, useState } from 'react';
import { CHAT_MODELS, PROVIDER_META, type ChatModel } from '@/lib/app-data';
import { Icon } from '@/lib/icons';

function ProviderMark({ model }: { model: ChatModel }) {
  const meta = PROVIDER_META[model.provider];
  return (
    <span className="prov" style={{ background: meta.color }} title={meta.name}>
      {meta.mark}
    </span>
  );
}

export default function ModelPicker() {
  const [open, setOpen] = useState(false);
  const [auto, setAuto] = useState(true);
  const [selectedId, setSelectedId] = useState<string>('kimi-k2.6');
  const anchorRef = useRef<HTMLDivElement>(null);

  const selected = CHAT_MODELS.find((m) => m.id === selectedId) ?? CHAT_MODELS[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const pick = (id: string) => {
    setSelectedId(id);
    setAuto(false);
    setOpen(false);
  };

  return (
    <div className="model-anchor" ref={anchorRef}>
      <button className="model-btn" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        {auto ? <Icon.spark size={15} /> : <ProviderMark model={selected} />}
        {auto ? 'Auto' : selected.label}
        {open ? <Icon.chevronD size={14} /> : <Icon.chevronU size={14} />}
      </button>

      {open && (
        <div className="model-pop" role="listbox" aria-label="Select model">
          <div className="model-pop__head">
            <div className="model-pop__auto">
              <div>
                <b>Auto</b>
                <p>Balanced quality and speed for most tasks</p>
              </div>
              <button
                className="toggle"
                data-on={auto}
                aria-pressed={auto}
                aria-label="Toggle Auto"
                onClick={() => setAuto((v) => !v)}
              />
            </div>
          </div>
          <div className="model-list">
            {CHAT_MODELS.map((m) => (
              <button
                key={m.id}
                className="model-row"
                data-active={!auto && m.id === selectedId}
                onClick={() => pick(m.id)}
                role="option"
                aria-selected={!auto && m.id === selectedId}
              >
                <ProviderMark model={m} />
                <span className="model-row__label">{m.label}</span>
                <span className="model-row__tier">{m.tier}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
