import React from 'react';
import { PlayerStats } from '../game/types';
import { ArrowLeft, Check, Lock } from 'lucide-react';
import { sound } from '../game/audio';

interface Props {
  stats: PlayerStats;
  onUpdateStats: (newStats: PlayerStats) => void;
  onClose: () => void;
}

export const CharacterModal: React.FC<Props> = ({ stats, onUpdateStats, onClose }) => {
  const characters = [
    { id: 'HERO_LEO', name: 'Leo Runner', desc: 'Aventurero juvenil con blaster de pulso', icon: '👦', cost: 0 },
    { id: 'HERO_NOVA', name: 'Nova Scout', desc: 'Exploradora estelar veloz con doble salto', icon: '👧', cost: 600 },
    { id: 'HERO_CYBER', name: 'Cyber Boy', desc: 'Guerrero cibernético con escudo mejorado', icon: '🤖', cost: 1200 },
  ];

  const handleSelect = (cId: string, cost: number) => {
    const isUnlocked = stats.unlockedCharacters.includes(cId);
    if (!isUnlocked) {
      if (stats.coins < cost) return;
      sound.playCoin();
      onUpdateStats({
        ...stats,
        coins: stats.coins - cost,
        unlockedCharacters: [...stats.unlockedCharacters, cId],
        selectedCharacter: cId,
      });
    } else {
      sound.playClick();
      onUpdateStats({
        ...stats,
        selectedCharacter: cId,
      });
    }
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-4 bg-slate-950/95 backdrop-blur-md text-white font-sans select-none">
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
          SELECCIÓN DE PERSONAJE
        </h2>

        <div className="flex items-center gap-1 bg-slate-900 border border-amber-400/40 px-3 py-1 rounded-xl text-amber-300 font-bold text-xs">
          <span>🪙</span>
          <span>{stats.coins.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 my-auto">
        {characters.map((c) => {
          const isUnlocked = stats.unlockedCharacters.includes(c.id);
          const isSelected = stats.selectedCharacter === c.id;

          return (
            <div
              key={c.id}
              className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                isSelected
                  ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-cyan-950/60 rounded-2xl flex items-center justify-center text-3xl border border-cyan-500/30">
                  {c.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm text-cyan-200">{c.name}</span>
                  <span className="text-[10px] text-slate-400 max-w-[180px]">{c.desc}</span>
                </div>
              </div>

              <button
                onClick={() => handleSelect(c.id, c.cost)}
                disabled={!isUnlocked && stats.coins < c.cost}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1 ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 cursor-default'
                    : isUnlocked
                    ? 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30'
                    : 'bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950'
                }`}
              >
                {isSelected ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>SELECCIONADO</span>
                  </>
                ) : isUnlocked ? (
                  <span>SELECCIONAR</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>{c.cost} 🪙</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="text-center text-[11px] text-cyan-400/60 uppercase tracking-widest font-mono">
        CADA PERSONAJE INCLUYE ESTILOS ÚNICOS DE CARRERA
      </div>
    </div>
  );
};
