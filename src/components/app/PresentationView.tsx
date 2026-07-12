'use client';

import { PRESENTATION_SLIDES } from '@/lib/app-data';
import { toast } from '@/components/Toast';
import { Icon } from '@/lib/icons';

export default function PresentationView({ name }: { name: string }) {
  return (
    <>
      <div className="art-preview__filters">
        <div className="period">
          <span className="period__label">Presentation filters</span>
          <span className="period__label" style={{ color: 'var(--text-muted)' }}>
            Period
          </span>
          <input type="date" defaultValue="2026-06-08" aria-label="Start date" />
          <span className="period__dash">–</span>
          <input type="date" defaultValue="2026-07-12" aria-label="End date" />
          <div className="period__spacer" />
          <button disabled>
            <Icon.reset size={14} /> Reset
          </button>
          <button disabled>
            <Icon.refresh size={14} /> Apply
          </button>
        </div>
      </div>

      <div className="art-preview__bar">
        <div className="art-preview__title">{name}</div>
        <button className="btn btn--sm" onClick={() => toast('Entering presenter mode')}>
          <Icon.present size={15} /> Present
        </button>
        <button className="btn btn--sm" onClick={() => toast('PDF exported')}>
          <Icon.fileText size={15} /> PDF
        </button>
        <button className="btn btn--sm" onClick={() => toast('PPTX exported')}>
          <Icon.download size={15} /> PPTX
        </button>
      </div>

      {PRESENTATION_SLIDES.map((slide, i) => (
        <div key={i}>
          <div className="slide-label">
            Slide {i + 1} — {slide.title}
          </div>
          <div className={`slide ${slide.kind === 'title' ? 'slide--title' : ''}`}>
            {slide.kind === 'title' ? (
              <h2>{slide.title}</h2>
            ) : (
              <>
                <h3>{slide.title}</h3>
                {slide.body && <p>{slide.body}</p>}
                <div className="slide__skelrow">
                  <div className="skel-bar" style={{ width: '90%' }} />
                  <div className="skel-bar" style={{ width: '75%' }} />
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
