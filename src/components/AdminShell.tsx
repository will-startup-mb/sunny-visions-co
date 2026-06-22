'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from './AdminSidebar';

export function AdminShell({ children, navOrder }: { children: React.ReactNode; navOrder: string[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div className="flex h-screen overflow-hidden print:block print:h-auto print:overflow-visible">
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden print:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-0 left-0 h-svh z-30 transition-transform duration-200 ease-in-out lg:static lg:z-auto lg:translate-x-0 print:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminSidebar onClose={() => setOpen(false)} navOrder={navOrder} />
      </div>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden print:overflow-visible print:h-auto">
        <header
          className="lg:hidden print:hidden flex items-center gap-3 h-14 px-4 border-b flex-shrink-0 bg-white"
          style={{ borderColor: '#e0d5c4' }}
        >
          <button
            onClick={() => setOpen(true)}
            className="p-2 -ml-1 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              <line x1="3" y1="5" x2="17" y2="5" />
              <line x1="3" y1="10" x2="17" y2="10" />
              <line x1="3" y1="15" x2="17" y2="15" />
            </svg>
          </button>
          <span className="font-bold text-sm" style={{ color: '#3D2B1F', fontFamily: "'Lobster Two', cursive" }}>
            Sunny Visions Co.
          </span>
        </header>

        <main className="flex-1 overflow-y-auto print:overflow-visible print:h-auto" style={{ backgroundColor: '#F5EFE0' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
