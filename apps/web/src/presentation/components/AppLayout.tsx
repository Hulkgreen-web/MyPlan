import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.tsx';
import { Header } from './Header.tsx';
import { useAppLayout } from '../hooks/useAppLayout.ts';

export const AppLayout: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useAppLayout();

  return (
    <div className="flex h-screen bg-base-300 text-base-content font-sans overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col relative overflow-y-auto">
        <Header
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
        />

        <main className="flex-1 flex flex-col items-center pt-32 pb-10 px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
