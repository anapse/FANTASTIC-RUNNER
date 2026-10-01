import React from 'react';
import { PlayerStats, WeaponType } from '../game/types';
import { ArrowLeft, Check, Lock, Plus } from 'lucide-react';
import { sound } from '../game/audio';

interface Props {
  stats: PlayerStats;
  onUpdateStats: (newStats: PlayerStats) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<Props> = ({ stats, onUpdateStats, onClose }) => {
  const weaponsList: Array<{
    id: WeaponType;
    name: string;
    desc: string;
    icon: string;
    baseCost: number;
  }> = [
    { id: 'BASIC', name: 'Bláster Básico', desc: 'Disparo rápido frontal directo', icon: '🔫', baseCost: 0 },
    { id: 'SPREAD', name: 'Disparo Múltiple', desc: 'Ráfaga de 3 proyectiles en abanico', icon: '💥', baseCost: 300 },
    { id: 'BEAM', name: 'Rayo Plasma', desc: 'Láser penetrante de alto impacto', icon: '⚡', baseCost: 800 },
    { id: 'PLASMA', name: 'Cañón Energía', desc: 'Orbe explosivo de destrucción masiva', icon: '💣', baseCost: 1500 },
  ];

  const handleUpgrade = (wId: WeaponType, cost: number) => {
    if (stats.coins < cost) return;
    sound.playCoin();
    const currentLvl = stats.weapons[wId] || 0;
    const newStats: PlayerStats = {
      ...stats,
      coins: stats.coins - cost,
      weapons: {
        ...stats.weapons,
        [wId]: currentLvl + 1,
      },
    };
    onUpdateStats(newStats);
  };

  const handleEquip = (wId: WeaponType) => {
    sound.playClick();
    onUpdateStats({
      ...stats,
      equippedWeapon: wId,
    });
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-4 bg-slate-950/95 backdrop-blur-md text-white font-sans select-none overflow-y-auto">
      {/* Top Bar */}
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

        <h2 className="text-xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-amber-300 uppercase">
          TIENDA DE ARMAS
        </h2>

        <div className="flex items-center gap-1 bg-slate-900 border border-amber-400/40 px-3 py-1 rounded-xl text-amber-300 font-bold text-xs">
          <span>🪙</span>
          <span>{stats.coins.toLocaleString()}</span>
        </div>
      </div>

      {/* Weapons List */}
      <div className="flex flex-col gap-3 my-auto py-2">
        {weaponsList.map((w) => {
          const level = stats.weapons[w.id] || 0;
          const isUnlocked = level > 0;
          const isEquipped = stats.equippedWeapon === w.id;
          const upgradeCost = isUnlocked ? level * 250 + 200 : w.baseCost;

          return (
            <div
              key={w.id}
              className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                isEquipped
                  ? 'bg-cyan-950/60 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center text-2xl border border-cyan-500/30">
                  {w.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm text-cyan-200">
                    {w.name} {isUnlocked && <span className="text-amber-400 text-xs">(Niv. {level})</span>}
                  </span>
                  <span className="text-[10px] text-slate-400">{w.desc}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isUnlocked ? (
                  <>
                    <button
                      onClick={() => handleEquip(w.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all ${
                        isEquipped
                          ? 'bg-cyan-500 text-slate-950 cursor-default'
                          : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {isEquipped ? 'EQUIPADO' : 'EQUIPAR'}
                    </button>

                    <button
                      onClick={() => handleUpgrade(w.id, upgradeCost)}
                      disabled={stats.coins < upgradeCost}
                      className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-black text-xs rounded-xl transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{upgradeCost} 🪙</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleUpgrade(w.id, upgradeCost)}
                    disabled={stats.coins < upgradeCost}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>DESBLOQUEAR ({upgradeCost} 🪙)</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center text-[11px] text-cyan-400/60 uppercase tracking-widest font-mono">
        MEJORA TUS ARMAS PARA MAYOR DAÑO Y VELOCIDAD
      </div>
    </div>
  );
};
