import React from 'react';
import { GameEngine } from '../game/engine';
import { Pause, Heart, Zap, Crosshair, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import { sound } from '../game/audio';

interface Props {
  engine: GameEngine;
  onPause: () => void;
}

export const HUDOverlay: React.FC<Props> = ({ engine, onPause }) => {
  const { player, score, distance } = engine;
  const gems = engine.stats.gems || 327;
  const showTouchControls = engine.stats.settings.touchControlMode !== 'GESTURES';

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 select-none text-white font-sans z-10">
      {/* TOP HUD BAR MATCHING PHONE 2 (GAMEPLAY) */}
      <div className="flex flex-col w-full gap-1.5">
        <div className="flex items-center justify-between w-full">
          {/* 3 Glowing Red Hearts */}
          <div className="flex items-center gap-1.5 bg-[#0a1120]/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-red-500/40 shadow-lg">
            {Array.from({ length: 3 }).map((_, idx) => (
              <Heart
                key={idx}
                className={`w-5 h-5 transition-all duration-300 ${
                  idx < player.lives
                    ? 'fill-red-500 text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.9)] animate-pulse'
                    : 'fill-slate-800 text-slate-700'
                }`}
              />
            ))}
          </div>

          {/* PUNTOS Yellow Pill */}
          <div className="bg-[#0a1120]/90 backdrop-blur-md px-3.5 py-1 rounded-xl border border-yellow-500/50 text-center shadow-lg">
            <span className="block text-[8px] uppercase tracking-wider text-yellow-400 font-extrabold">
              PUNTOS
            </span>
            <span className="text-sm font-black font-mono text-yellow-300">
              {score.toLocaleString()}
            </span>
          </div>

          {/* GEMS Badge (327) */}
          <div className="bg-[#0a1120]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-cyan-400/50 flex items-center gap-1.5 shadow-lg">
            <span className="text-cyan-400 text-sm">💎</span>
            <span className="text-sm font-black font-mono text-cyan-200">
              {gems}
            </span>
          </div>

          {/* Pause Button */}
          <button
            onClick={() => {
              sound.playClick();
              onPause();
            }}
            className="pointer-events-auto bg-[#0a1120]/90 hover:bg-[#13223f] active:scale-95 border-2 border-cyan-500/60 p-2 rounded-xl text-cyan-300 shadow-lg cursor-pointer transition-all"
          >
            <Pause className="w-4 h-4 fill-cyan-400 text-cyan-400" />
          </button>
        </div>

        {/* DISTANCIA Badge (Directly below Hearts, matching Phone 2) */}
        <div className="self-start bg-[#0a1120]/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-cyan-500/40 text-left shadow-md">
          <span className="block text-[8px] uppercase tracking-wider text-cyan-400 font-extrabold">
            DISTANCIA
          </span>
          <span className="text-xs font-black font-mono text-white">
            {Math.floor(distance).toLocaleString()} m
          </span>
        </div>

        {/* Active Powerup Badges */}
        {Object.entries(player.activePowerUps).length > 0 && (
          <div className="flex items-center gap-1 mt-0.5">
            {Object.entries(player.activePowerUps).map(([pType, duration]) => (
              <div
                key={pType}
                className="flex items-center gap-1 bg-cyan-950/90 border border-cyan-400 px-2 py-0.5 rounded-lg text-[9px] font-bold text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.4)] animate-pulse"
              >
                <Zap className="w-3 h-3 text-yellow-400" />
                <span>{pType}</span>
                <span className="text-white">({Math.ceil(duration || 0)}s)</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* OPTIONAL FLOATING ON-SCREEN BUTTONS (Only if explicitly enabled in Settings) */}
      {showTouchControls && (
        <div className="pointer-events-auto flex items-end justify-between w-full mb-2 px-1 opacity-40 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1.5">
            <button
              onMouseDown={() => engine.moveLeft()}
              onTouchStart={(e) => {
                e.preventDefault();
                engine.moveLeft();
              }}
              className="w-10 h-10 bg-slate-900/60 border border-cyan-400/40 rounded-xl flex items-center justify-center text-cyan-300"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onMouseDown={() => engine.moveRight()}
              onTouchStart={(e) => {
                e.preventDefault();
                engine.moveRight();
              }}
              className="w-10 h-10 bg-slate-900/60 border border-cyan-400/40 rounded-xl flex items-center justify-center text-cyan-300"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onMouseDown={() => engine.jump()}
            onTouchStart={(e) => {
              e.preventDefault();
              engine.jump();
            }}
            className="w-11 h-11 bg-slate-900/60 border border-blue-400/40 rounded-full flex items-center justify-center text-blue-300"
          >
            <ArrowUp className="w-5 h-5" />
          </button>

          <button
            onMouseDown={() => engine.shoot()}
            onTouchStart={(e) => {
              e.preventDefault();
              engine.shoot();
            }}
            className="w-11 h-11 bg-amber-600/60 border border-amber-300/40 rounded-full flex items-center justify-center text-amber-200"
          >
            <Crosshair className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
