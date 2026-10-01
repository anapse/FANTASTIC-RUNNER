import React from 'react';
import { GameEngine } from '../game/engine';
import { RotateCcw, Home, Trophy, Skull } from 'lucide-react';
import { sound } from '../game/audio';

interface Props {
  engine: GameEngine;
  onRestart: () => void;
  onExitToMenu: () => void;
}

export const GameOverModal: React.FC<Props> = ({
  engine,
  onRestart,
  onExitToMenu,
}) => {
  const { score, distance, coinsCollected, killsCount, stats } = engine;
  const isNewRecord = score > stats.highScore;

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md text-white font-sans select-none">
      <div className="w-full max-w-xs bg-slate-900 border-2 border-red-500/50 rounded-3xl p-5 flex flex-col items-center gap-4 shadow-[0_0_50px_rgba(239,68,68,0.4)]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-red-950/80 rounded-full flex items-center justify-center border border-red-500/50 text-red-400 mb-1">
            <Skull className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-yellow-300 uppercase">
            GAME OVER
          </h2>
          {isNewRecord && (
            <div className="flex items-center gap-1 mt-1 bg-amber-500 text-slate-950 font-black text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
              <Trophy className="w-3 h-3" />
              <span>¡NUEVO RÉCORD!</span>
            </div>
          )}
        </div>

        {/* Score Card Breakdown */}
        <div className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">PUNTUACIÓN</span>
            <span className="font-mono font-black text-amber-300 text-lg">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="w-full h-px bg-slate-800" />

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
            <div className="flex flex-col bg-slate-900 p-1.5 rounded-xl border border-slate-800">
              <span className="text-[9px] text-cyan-400 font-mono">DISTANCIA</span>
              <span className="text-white font-mono">{Math.floor(distance)}m</span>
            </div>
            <div className="flex flex-col bg-slate-900 p-1.5 rounded-xl border border-slate-800">
              <span className="text-[9px] text-amber-400 font-mono">MONEDAS</span>
              <span className="text-amber-300 font-mono">+{coinsCollected}</span>
            </div>
            <div className="flex flex-col bg-slate-900 p-1.5 rounded-xl border border-slate-800">
              <span className="text-[9px] text-red-400 font-mono">BAJAS</span>
              <span className="text-red-300 font-mono">{killsCount}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 w-full mt-1">
          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-sm uppercase rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>REINTENTAR</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onExitToMenu();
            }}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-bold text-xs uppercase rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>MENÚ PRINCIPAL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
