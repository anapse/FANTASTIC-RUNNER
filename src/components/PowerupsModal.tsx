import React from 'react';
import { PlayerStats, PowerUpType } from '../game/types';
import { ArrowLeft, Plus } from 'lucide-react';
import { sound } from '../game/audio';

interface Props {
  stats: PlayerStats;
  onUpdateStats: (newStats: PlayerStats) => void;
  onClose: () => void;
}

export const PowerupsModal: React.FC<Props> = ({ stats, onUpdateStats, onClose }) => {
  const powerUpsList: Array<{
    id: PowerUpType;
    name: string;
    desc: string;
    icon: string;
  }> = [
    { id: 'SHIELD', name: 'Escudo Protector', desc: 'Absorbe 1 impacto sin sufrir daño', icon: '🛡️' },
    { id: 'SUPER_JUMP', name: 'Super Salto', desc: 'Aumenta la altura del salto y flotabilidad', icon: '⬆️' },
    { id: 'MULTI_SHOT', name: 'Disparo Múltiple', desc: 'Ráfaga triple de proyectiles durante 8s', icon: '🚀' },
    { id: 'MAGNET', name: 'Imán de Monedas', desc: 'Atrae automáticamente monedas y gemas cercanas', icon: '🧲' },
    { id: 'MULTIPLIER', name: 'Multiplicador x2', desc: 'Duplica todos los puntos obtenidos', icon: '⭐' },
    { id: 'DASH', name: 'Dash Energético', desc: 'Impulso hiperveloz invulnerable que destruye rocas', icon: '⚡' },
  ];

  const handleUpgradeDuration = (pId: PowerUpType, cost: number) => {
    if (stats.coins < cost) return;
    sound.playCoin();
    const currentLvl = stats.powerUpLevels[pId] || 1;
    onUpdateStats({
      ...stats,
      coins: stats.coins - cost,
      powerUpLevels: {
        ...stats.powerUpLevels,
        [pId]: currentLvl + 1,
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
          POWER-UPS
        </h2>

        <div className="flex items-center gap-1 bg-slate-900 border border-amber-400/40 px-3 py-1 rounded-xl text-amber-300 font-bold text-xs">
          <span>🪙</span>
          <span>{stats.coins.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 my-auto py-2">
        {powerUpsList.map((p) => {
          const level = stats.powerUpLevels[p.id] || 1;
          const upgradeCost = level * 150 + 100;
          const durationSec = 6 + level * 2;

          return (
            <div
              key={p.id}
              className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-cyan-950/60 rounded-xl flex items-center justify-center text-2xl border border-cyan-500/30">
                  {p.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm text-cyan-200">
                    {p.name} <span className="text-amber-400 text-xs">(Niv. {level})</span>
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {p.desc} • Duración: <strong className="text-cyan-300">{durationSec}s</strong>
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleUpgradeDuration(p.id, upgradeCost)}
                disabled={stats.coins < upgradeCost}
                className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs rounded-xl transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{upgradeCost} 🪙</span>
              </button>
            </div>
          );
        })}
      </div>

      <div className="text-center text-[11px] text-cyan-400/60 uppercase tracking-widest font-mono">
        MEJORA EL NIVEL PARA AUMENTAR LA DURACIÓN
      </div>
    </div>
  );
};
