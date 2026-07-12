import '../app.css';
import WorkspaceSidebar from '@/components/app/WorkspaceSidebar';
import MobileNav from '@/components/MobileNav';
import Toast from '@/components/Toast';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <MobileNav title="Company 8" />
      <WorkspaceSidebar />
      <main className="app-content">
        {children}
        <Toast />
      </main>
    </div>
  );
}
