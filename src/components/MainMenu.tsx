import React from 'react';
import { PlayerStats, GameMode } from '../game/types';
import { Play, Trophy, BookOpen, BarChart2, Mail, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../game/audio';
import logoImg from '../assets/images/fantastic_runner_logo_1790827803311.jpg';
import tunnelBgImg from '../assets/images/scifi_tunnel_track_1790828360317.jpg';

interface Props {
  stats: PlayerStats;
  onNavigate: (mode: GameMode) => void;
  onStartGame: () => void;
  onToggleSound: () => void;
  onOpenContact: () => void;
  onOpenHowToPlay: () => void;
  onOpenRecord: () => void;
}

export const MainMenu: React.FC<Props> = ({
  stats,
  onNavigate,
  onStartGame,
  onToggleSound,
  onOpenContact,
  onOpenHowToPlay,
  onOpenRecord,
}) => {
  const isMuted = !stats.settings.soundFx && !stats.settings.music;

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 bg-[#050814] overflow-hidden font-sans select-none text-white">
      {/* 1. BACKGROUND IMAGE (Matching User's Image 2 Asset) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src={tunnelBgImg}
          alt="Tunnel Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter brightness-95"
        />
        {/* Capa de translucidez encima del fondo solicitada explícitamente */}
        <div className="absolute inset-0 bg-[#060c18]/45 backdrop-blur-[2px]" />
      </div>

      {/* 2. TOP BAR: CONTÁCTANOS (LEFT) & SOUND TOGGLE (RIGHT) (Matching Phone 1) */}
      <div className="flex items-center justify-between w-full z-20 pt-1">
        {/* CONTÁCTANOS Pill Button */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenContact();
          }}
          className="flex items-center gap-2 bg-[#0d1627]/90 hover:bg-[#15243f] active:scale-95 border-2 border-amber-500/60 px-3.5 py-1.5 rounded-full text-white font-extrabold text-xs tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.3)] cursor-pointer transition-all"
        >
          <Mail className="w-4 h-4 text-amber-400 stroke-[2.5]" />
          <span className="text-amber-400 uppercase tracking-widest font-black text-[11px]">
            CONTÁCTANOS
          </span>
        </button>

        {/* SOUND TOGGLE Rounded Button */}
        <button
          onClick={() => {
            sound.playClick();
            onToggleSound();
          }}
          className="bg-[#0b1c38]/90 hover:bg-[#122e5a] active:scale-95 border-2 border-cyan-400/70 p-2 rounded-2xl text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer transition-all"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-red-400" />
          ) : (
            <Volume2 className="w-5 h-5 text-cyan-300" />
          )}
        </button>
      </div>

      {/* 3. CENTER EMBLEM: OFFICIAL GAME LOGO (Image 1) */}
      <div className="relative flex flex-col items-center justify-center my-auto z-20 py-1">
        <div className="relative flex flex-col items-center text-center">
          {/* Ambient glow behind logo */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.25)_0%,rgba(245,158,11,0.2)_50%,transparent_75%)] blur-xl pointer-events-none" />

          {/* Official Game Logo Image */}
          <div className="relative w-60 h-60 sm:w-68 sm:h-68 flex items-center justify-center">
            <img
              src={logoImg}
              alt="Fantastic Runner Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter drop-shadow-[0_12px_30px_rgba(0,0,0,0.95)] transition-transform hover:scale-105 duration-300"
            />
          </div>
        </div>
      </div>

      {/* 4. THE 4 MAIN MENU ACTION BUTTONS (Matching Phone 1 in Image 1) */}
      <div className="flex flex-col gap-3 max-w-sm mx-auto w-full z-20 my-auto pb-2">
        {/* 1. JUGAR BUTTON (Glowing Emerald Green) */}
        <button
          onClick={() => {
            sound.playClick();
            onStartGame();
          }}
          className="w-full py-3.5 px-6 bg-gradient-to-b from-[#10b981] to-[#047857] hover:from-[#34d399] hover:to-[#059669] active:scale-95 text-white font-black text-xl italic tracking-wider rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.7)] border-2 border-[#34d399] flex items-center justify-center gap-3 transition-all cursor-pointer"
        >
          <Play className="w-6 h-6 fill-white" />
          <span>JUGAR</span>
        </button>

        {/* 2. TOP 250 JUGADORES (Glowing Golden-Orange) */}
        <button
          onClick={() => {
            sound.playClick();
            onNavigate('RANKING');
          }}
          className="w-full py-3.5 px-6 bg-gradient-to-b from-[#f59e0b] to-[#b45309] hover:from-[#fbbf24] hover:to-[#d97706] active:scale-95 text-white font-black text-sm sm:text-base italic tracking-wider rounded-2xl shadow-[0_0_22px_rgba(245,158,11,0.6)] border-2 border-[#fcd34d] flex items-center justify-center gap-2.5 transition-all cursor-pointer"
        >
          <Trophy className="w-5 h-5 text-yellow-200 fill-yellow-300" />
          <span>TOP 250 JUGADORES</span>
        </button>

        {/* 3. CÓMO JUGAR (Glowing Electric Cyan-Blue) */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenHowToPlay();
          }}
          className="w-full py-3.5 px-6 bg-gradient-to-b from-[#0284c7] to-[#0369a1] hover:from-[#38bdf8] hover:to-[#0284c7] active:scale-95 text-white font-black text-sm sm:text-base italic tracking-wider rounded-2xl shadow-[0_0_22px_rgba(2,132,199,0.6)] border-2 border-[#38bdf8] flex items-center justify-center gap-2.5 transition-all cursor-pointer"
        >
          <BookOpen className="w-5 h-5 text-cyan-100" />
          <span>CÓMO JUGAR</span>
        </button>

        {/* 4. MI RÉCORD LOCAL (Glowing Neon Violet-Purple) */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenRecord();
          }}
          className="w-full py-3.5 px-6 bg-gradient-to-b from-[#9333ea] to-[#6b21a8] hover:from-[#c084fc] hover:to-[#7e22ce] active:scale-95 text-white font-black text-sm sm:text-base italic tracking-wider rounded-2xl shadow-[0_0_22px_rgba(147,51,234,0.6)] border-2 border-[#c084fc] flex items-center justify-center gap-2.5 transition-all cursor-pointer"
        >
          <BarChart2 className="w-5 h-5 text-purple-100" />
          <span>MI RÉCORD LOCAL</span>
        </button>
      </div>

      {/* 5. FOOTER: DEDICADO A VIOLENTI (With Gold Accent Lines) */}
      <div className="flex items-center justify-center gap-3 pt-2 z-20">
        <div className="h-0.5 w-12 bg-amber-500/60 rounded-full" />
        <span className="text-amber-400 font-extrabold text-xs tracking-wider font-mono">
          Dedicado a Violenti
        </span>
        <div className="h-0.5 w-12 bg-amber-500/60 rounded-full" />
      </div>
    </div>
  );
};
