'use client';

import { useRouter } from 'next/navigation';
import { Icon } from '@/lib/icons';

const POPULAR_CREATIONS = [
  'Dashboard',
  'Presentation',
  'Report',
  'Spreadsheet',
  'Chart',
] as const;

interface ArtifactEmptyStateProps {
  /** Overrides the default "pick from the list" hint, e.g. when there is no list at all. */
  subtitle?: string;
}

export default function ArtifactEmptyState({
  subtitle = 'Choose an artifact from the list to preview its contents.',
}: ArtifactEmptyStateProps) {
  const router = useRouter();

  const createWithDan = (kind?: string) => {
    const query = kind ? `?q=${encodeURIComponent(`Create a ${kind.toLowerCase()} for me`)}` : '';
    router.push(`/chat${query}`);
  };

  return (
    <div className="art-empty">
      <div className="art-empty__mark" aria-hidden="true">
        <Icon.artifacts size={26} />
      </div>
      <h2 className="art-empty__title">Your work with Dan will live here</h2>
      <p className="art-empty__sub">{subtitle}</p>

      <button
        className="btn btn--primary art-empty__cta"
        onClick={() => createWithDan()}
      >
        <Icon.spark size={16} />
        Create with Dan
      </button>

      <div className="art-empty__popular">
        <span className="art-empty__label">Popular things to create:</span>
        <div className="chips art-empty__pills">
          {POPULAR_CREATIONS.map((kind) => (
            <button key={kind} className="chip" onClick={() => createWithDan(kind)}>
              {kind}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
