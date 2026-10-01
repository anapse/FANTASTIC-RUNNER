import React from 'react';

interface Props {
  children: React.ReactNode;
}

/**
 * ViewportContainer enforces the exact 9:16 smartphone aspect ratio centered on PC and mobile,
 * matching anapse.github.io/gearpunk/ layout!
 */
export const ViewportContainer: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#050811] flex items-center justify-center p-0 sm:p-4 overflow-hidden select-none font-sans text-white">
      {/* Subtle ambient background glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.9)_0%,rgba(0,0,0,1)_100%)]" />

      {/* Main 9:16 Game Container (Centered, rounded, sleek shadow) */}
      <div
        className="relative w-full aspect-[9/16] bg-[#070b14] shadow-[0_0_50px_rgba(0,0,0,0.9)] sm:border-2 sm:border-slate-800/80 sm:rounded-[36px] overflow-hidden flex flex-col justify-center items-center"
        style={{
          height: 'min(96vh, 840px)',
          maxWidth: 'calc(min(96vh, 840px) * 9 / 16)',
        }}
      >
        {children}
      </div>
    </div>
  );
};
