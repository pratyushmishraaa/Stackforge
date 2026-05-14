import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0d0f14]">
      <Sidebar />
      <main className="ml-[220px] flex-1 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
