'use client';

import { useRouter } from 'next/navigation';
import Dashboard from './Dashboard';
import { toast } from '@/components/Toast';
import { Icon } from '@/lib/icons';

interface ArtifactPanelProps {
  onClose: () => void;
}

export default function ArtifactPanel({ onClose }: ArtifactPanelProps) {
  const router = useRouter();

  return (
    <section className="artifact-panel" aria-label="Artifact">
      <header className="artifact-panel__head">
        <button
          className="icon-btn"
          aria-label="Open full view"
          style={{ width: 30, height: 30 }}
          onClick={() => router.push('/artifacts')}
        >
          <Icon.expand size={16} />
        </button>
        <div className="artifact-panel__title">
          <Icon.grid size={16} />
          <span>Finanshels Org BI Dashboard</span>
        </div>
        <div className="artifact-panel__actions">
          <button className="icon-btn" aria-label="Save" onClick={() => toast('Saved to artifacts')}>
            <Icon.bookmark size={16} />
          </button>
          <button className="icon-btn" aria-label="Copy" onClick={() => toast('Copied')}>
            <Icon.copy size={16} />
          </button>
          <button
            className="icon-btn"
            aria-label="Open in artifacts library"
            onClick={() => router.push('/artifacts')}
          >
            <Icon.external size={16} />
          </button>
          <button className="icon-btn icon-btn--danger" aria-label="Delete" onClick={() => toast('Deleted')}>
            <Icon.trash size={16} />
          </button>
          <button className="icon-btn" aria-label="Close" onClick={onClose}>
            <Icon.close size={16} />
          </button>
        </div>
      </header>
      <div className="artifact-panel__body">
        <Dashboard />
      </div>
    </section>
  );
}
