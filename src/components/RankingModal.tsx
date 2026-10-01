import React from 'react';
import { LeaderboardEntry } from '../game/types';
import { loadLeaderboard } from '../game/storage';
import { ArrowLeft, Trophy, Medal } from 'lucide-react';
import { sound } from '../game/audio';

interface Props {
  onClose: () => void;
}

export const RankingModal: React.FC<Props> = ({ onClose }) => {
  const leaderboard = loadLeaderboard();

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-4 bg-slate-950/95 backdrop-blur-md text-white font-sans select-none overflow-y-auto">
      <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="flex items-center gap-1 bg-slate-900 border border-cyan-500/40 px-3 py-1.5 rounded-xl text-cyan-300 font-bold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>VOLVER</span>
        </button>

        <h2 className="text-xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 uppercase">
          TOP 50 JUGADORES
        </h2>

        <div className="w-12" />
      </div>

      <div className="grid grid-cols-1 gap-2 my-auto py-2">
        {leaderboard.map((entry, idx) => {
          let rankBadge = `${idx + 1}`;
          let rankColor = 'text-slate-400 border-slate-800';

          if (idx === 0) {
            rankBadge = '🥇';
            rankColor = 'bg-amber-950/60 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]';
          } else if (idx === 1) {
            rankBadge = '🥈';
            rankColor = 'bg-slate-800/80 border-slate-300 text-slate-200';
          } else if (idx === 2) {
            rankBadge = '🥉';
            rankColor = 'bg-amber-900/40 border-amber-600 text-amber-400';
          }

          return (
            <div
              key={entry.id || idx}
              className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${rankColor}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">
                  {rankBadge}
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm text-cyan-200">{entry.playerName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {entry.distance}m • {entry.coins} 🪙
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono font-black text-amber-300 text-base">
                  {entry.score.toLocaleString()}
                </span>
                <span className="block text-[9px] text-slate-400">{entry.date}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center text-[11px] text-cyan-400/60 uppercase tracking-widest font-mono">
        MÁXIMAS PUNTUACIONES DE FANTASTIC RUNNER
      </div>
    </div>
  );
};
