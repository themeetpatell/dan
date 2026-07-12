import '../app.css';
import WorkspaceSidebar from '@/components/app/WorkspaceSidebar';
import Toast from '@/components/Toast';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app">
      <WorkspaceSidebar />
      <main className="app-content">
        {children}
        <Toast />
      </main>
    </div>
  );
}
