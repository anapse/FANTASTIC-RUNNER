import React from 'react';
import { PlayerStats } from '../game/types';
import { INITIAL_ACHIEVEMENTS } from '../game/storage';
import { ArrowLeft, Check, Trophy } from 'lucide-react';
import { sound } from '../game/audio';

interface Props {
  stats: PlayerStats;
  onUpdateStats: (newStats: PlayerStats) => void;
  onClose: () => void;
}

export const AchievementsModal: React.FC<Props> = ({ stats, onUpdateStats, onClose }) => {
  const achievements = INITIAL_ACHIEVEMENTS.map((ach) => {
    let current = 0;
    if (ach.id.startsWith('DIST_')) current = Math.floor(stats.totalDistance);
    if (ach.id.startsWith('KILLS_')) current = stats.totalKills;
    if (ach.id.startsWith('COINS_')) current = stats.coins;
    if (ach.id.startsWith('SCORE_')) current = stats.highScore;

    const isClaimed = Boolean(stats.achievements[ach.id]);
    const isCompleted = current >= ach.maxProgress;

    return {
      ...ach,
      currentProgress: Math.min(current, ach.maxProgress),
      isCompleted,
      isClaimed,
    };
  });

  const handleClaim = (achId: string, reward: number) => {
    sound.playCoin();
    onUpdateStats({
      ...stats,
      coins: stats.coins + reward,
      achievements: {
        ...stats.achievements,
        [achId]: true,
      },
    });
  };

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

        <h2 className="text-xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-amber-300 uppercase">
          LOGROS Y METAS
        </h2>

        <div className="flex items-center gap-1 bg-slate-900 border border-amber-400/40 px-3 py-1 rounded-xl text-amber-300 font-bold text-xs">
          <span>🪙</span>
          <span>{stats.coins.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 my-auto py-2">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
              ach.isClaimed
                ? 'bg-slate-900/40 border-slate-800 opacity-60'
                : ach.isCompleted
                ? 'bg-amber-950/40 border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-slate-950 rounded-xl flex items-center justify-center text-2xl border border-cyan-500/30">
                {ach.icon}
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-sm text-cyan-200">{ach.title}</span>
                <span className="text-[10px] text-slate-400">{ach.description}</span>
                {/* Progress bar */}
                <div className="w-36 h-1.5 bg-slate-950 rounded-full mt-1 overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all"
                    style={{ width: `${(ach.currentProgress / ach.maxProgress) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {ach.isClaimed ? (
              <div className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                <Check className="w-4 h-4" />
                <span>RECLAMADO</span>
              </div>
            ) : ach.isCompleted ? (
              <button
                onClick={() => handleClaim(ach.id, ach.rewardCoins)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all animate-bounce"
              >
                RECLAMAR ({ach.rewardCoins} 🪙)
              </button>
            ) : (
              <span className="text-[10px] font-mono font-bold text-slate-400">
                {ach.currentProgress} / {ach.maxProgress}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="text-center text-[11px] text-cyan-400/60 uppercase tracking-widest font-mono">
        DESBLOQUEA LOGROS PARA GANAR MONEDAS
      </div>
    </div>
  );
};
