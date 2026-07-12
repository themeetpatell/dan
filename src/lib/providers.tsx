'use client';

import { useId } from 'react';

/* ============================================================
   LLM provider registry + brand marks.
   Real logos (not letter monograms) — brand color only where the
   brand itself is colored; wordmark-style logos use the text color.
   ============================================================ */

export type ProviderSlug = 'zai' | 'openai' | 'anthropic' | 'google' | 'moonshot';

export type LlmProvider = {
  slug: ProviderSlug;
  name: string;
  connected: boolean;
  keyPlaceholder: string;
  urlPlaceholder: string;
};

export const LLM_PROVIDERS: LlmProvider[] = [
  {
    slug: 'zai',
    name: 'Zai',
    connected: false,
    keyPlaceholder: 'sk-…',
    urlPlaceholder: 'https://api.z.ai/v1',
  },
  {
    slug: 'openai',
    name: 'OpenAI',
    connected: true,
    keyPlaceholder: 'sk-proj-…',
    urlPlaceholder: 'https://api.openai.com/v1',
  },
  {
    slug: 'anthropic',
    name: 'Anthropic',
    connected: true,
    keyPlaceholder: 'sk-ant-…',
    urlPlaceholder: 'https://api.anthropic.com',
  },
  {
    slug: 'google',
    name: 'Google',
    connected: false,
    keyPlaceholder: 'AIza…',
    urlPlaceholder: 'https://generativelanguage.googleapis.com',
  },
  {
    slug: 'moonshot',
    name: 'Moonshot',
    connected: true,
    keyPlaceholder: 'sk-…',
    urlPlaceholder: 'https://api.moonshot.ai/v1',
  },
];

export function findProvider(slug: string): LlmProvider | undefined {
  return LLM_PROVIDERS.find((p) => p.slug === slug);
}

/* ---------------- Brand marks ---------------- */

type MarkProps = { size?: number };

function ZaiMark({ size = 20 }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5.5 4.5h13v2.7l-8 9.7h8.2v2.6H5.3v-2.6l8-9.8H5.5z"
        fill="var(--text)"
      />
    </svg>
  );
}

function OpenAiMark({ size = 20 }: MarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.073zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997z"
        fill="#10A37F"
      />
    </svg>
  );
}

function AnthropicMark({ size = 20 }: MarkProps) {
  // Claude sunburst — 8 rounded rays.
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    const x1 = 12 + 4.6 * Math.cos(a);
    const y1 = 12 + 4.6 * Math.sin(a);
    const x2 = 12 + 9.7 * Math.cos(a);
    const y2 = 12 + 9.7 * Math.sin(a);
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
  });
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#D97757"
      strokeWidth="2.6"
      strokeLinecap="round"
      aria-hidden
    >
      {rays}
    </svg>
  );
}

function GoogleMark({ size = 20 }: MarkProps) {
  // Gemini four-point star.
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 1.6c.5 5.5 4.9 9.9 10.4 10.4-5.5.5-9.9 4.9-10.4 10.4-.5-5.5-4.9-9.9-10.4-10.4C7.1 11.5 11.5 7.1 12 1.6z"
        fill="#8E75E8"
      />
    </svg>
  );
}

function MoonshotMark({ size = 20 }: MarkProps) {
  // Striped sphere.
  const id = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <mask id={id}>
        <circle cx="12" cy="12" r="10" fill="#fff" />
        <g transform="rotate(-12 12 12)" fill="#000">
          <rect x="0" y="6.1" width="24" height="1.7" />
          <rect x="0" y="11.2" width="24" height="1.7" />
          <rect x="0" y="16.3" width="24" height="1.7" />
        </g>
      </mask>
      <circle cx="12" cy="12" r="10" fill="var(--text)" mask={`url(#${id})`} />
    </svg>
  );
}

const MARKS: Record<ProviderSlug, (p: MarkProps) => React.ReactElement> = {
  zai: ZaiMark,
  openai: OpenAiMark,
  anthropic: AnthropicMark,
  google: GoogleMark,
  moonshot: MoonshotMark,
};

export function ProviderLogo({ slug, size }: { slug: ProviderSlug; size?: number }) {
  const Mark = MARKS[slug];
  return <Mark size={size} />;
}
