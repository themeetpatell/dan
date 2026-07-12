import type { Metadata } from 'next';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import MobileNav from '@/components/MobileNav';
import Toast from '@/components/Toast';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Workspace settings for Dan.',
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app">
      <MobileNav title="Settings" />
      <Sidebar />
      <main className="content">
        <TopBar />
        {children}
        <Toast />
      </main>
    </div>
  );
}
