import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './components.css';

// One typeface across the platform — Inter everywhere.
const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'Dan', template: '%s · Dan' },
  description: 'Dan — the AI analyst for your business data.',
};

// Set the theme before first paint to avoid a flash.
const themeBootstrap = `
(function(){
  try {
    var t = localStorage.getItem('dan-theme') || 'system';
    var q = new URLSearchParams(location.search).get('theme');
    if (q === 'dark' || q === 'light' || q === 'system') t = q;
    var dark = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme-pref', t);
    var c = localStorage.getItem('dan-collapsed') === '1';
    document.documentElement.setAttribute('data-sidebar', c ? 'collapsed' : 'expanded');
  } catch(e){}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // the bootstrap script mutates <html> attributes before hydration
    <html lang="en" className={sans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
