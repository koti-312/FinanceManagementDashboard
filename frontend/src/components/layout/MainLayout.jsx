import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen ambient-glass-canvas relative overflow-x-hidden selection:bg-teal-500 selection:text-white flex justify-center">
      {/* Soft blurred glow orbs underneath the glass backdrop */}
      <div
        className="fixed top-[-100px] left-[3%] w-[580px] h-[460px] rounded-full pointer-events-none -z-10 opacity-70 dark:opacity-40 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle, rgba(13, 148, 136, 0.35) 0%, transparent 65%)',
          filter: 'blur(75px)',
        }}
      />
      <div
        className="fixed top-[-80px] left-[32%] w-[500px] h-[420px] rounded-full pointer-events-none -z-10 opacity-60 dark:opacity-35 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.32) 0%, transparent 65%)',
          filter: 'blur(70px)',
        }}
      />
      <div
        className="fixed top-[-70px] right-[2%] w-[540px] h-[440px] rounded-full pointer-events-none -z-10 opacity-65 dark:opacity-30 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.28) 0%, rgba(6, 182, 212, 0.15) 45%, transparent 68%)',
          filter: 'blur(75px)',
        }}
      />
      <div
        className="fixed top-[320px] right-[4%] w-[400px] h-[400px] rounded-full pointer-events-none -z-10 opacity-50 dark:opacity-25 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle, rgba(45, 212, 191, 0.28) 0%, transparent 65%)',
          filter: 'blur(65px)',
        }}
      />
      <div
        className="fixed top-[440px] left-[1%] w-[360px] h-[360px] rounded-full pointer-events-none -z-10 opacity-55 dark:opacity-30 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle, rgba(8, 145, 178, 0.25) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Main App Container */}
      <div className="w-full max-w-[1440px] px-3 sm:px-6 py-4 sm:py-5 flex gap-4 lg:gap-6 items-start">
        {/* Left Floating Capsule Dock */}
        <Sidebar
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Dashboard Canvas */}
        <div className="flex-1 min-w-0 pl-0 lg:pl-[76px] space-y-4">
          <Navbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
