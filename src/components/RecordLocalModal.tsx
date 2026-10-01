import React from 'react';
import { PlayerStats } from '../game/types';
import { ArrowLeft, Trophy, Medal, Flame, Coins, Crosshair } from 'lucide-react';
import { sound } from '../game/audio';

interface Props {
  stats: PlayerStats;
  onClose: () => void;
}

export const RecordLocalModal: React.FC<Props> = ({ stats, onClose }) => {
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-between p-4 bg-slate-950/95 backdrop-blur-md text-white font-sans select-none overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="flex items-center gap-1 bg-slate-900 border border-cyan-500/40 px-3 py-1.5 rounded-xl text-cyan-300 font-bold text-xs hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>VOLVER</span>
        </button>

        <h2 className="text-xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-amber-300 to-yellow-300 uppercase">
          MI RÉCORD LOCAL
        </h2>

        <div className="w-12" />
      </div>

      {/* Record Stats Grid */}
      <div className="flex flex-col items-center gap-4 my-auto py-2">
        {/* High Score Trophy Badge */}
        <div className="w-full bg-gradient-to-b from-amber-950/60 to-slate-900 border-2 border-amber-400/80 rounded-3xl p-5 flex flex-col items-center shadow-[0_0_30px_rgba(245,158,11,0.3)]">
          <Trophy className="w-12 h-12 text-amber-400 mb-2 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
            MÁXIMA PUNTUACIÓN
          </span>
          <span className="text-4xl font-black font-mono text-yellow-300 mt-1">
            {stats.highScore.toLocaleString()} pts
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-3 flex flex-col items-center text-center">
            <Flame className="w-6 h-6 text-cyan-400 mb-1" />
            <span className="text-[10px] text-cyan-300 font-bold uppercase">DISTANCIA TOTAL</span>
            <span className="text-lg font-black font-mono text-white mt-0.5">
              {Math.floor(stats.totalDistance).toLocaleString()} m
            </span>
          </div>

          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-3 flex flex-col items-center text-center">
            <Coins className="w-6 h-6 text-amber-400 mb-1" />
            <span className="text-[10px] text-amber-300 font-bold uppercase">MONEDAS TOTALES</span>
            <span className="text-lg font-black font-mono text-amber-300 mt-0.5">
              {stats.coins.toLocaleString()} 🪙
            </span>
          </div>

          <div className="bg-slate-900/90 border border-red-500/30 rounded-2xl p-3 flex flex-col items-center text-center col-span-2">
            <Crosshair className="w-6 h-6 text-red-400 mb-1" />
            <span className="text-[10px] text-red-300 font-bold uppercase">ENEMIGOS DESTRUIDOS</span>
            <span className="text-xl font-black font-mono text-red-400 mt-0.5">
              {stats.totalKills.toLocaleString()} bajas
            </span>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-cyan-400/60 uppercase tracking-widest font-mono">
        TUS ESTADÍSTICAS SE GUARDAN AUTOMÁTICAMENTE EN TU DISPOSITIVO
      </div>
    </div>
  );
};
