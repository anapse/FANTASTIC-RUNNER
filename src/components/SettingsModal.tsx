import React from 'react';
import { PlayerStats } from '../game/types';
import { ArrowLeft, Volume2, VolumeX, Smartphone, Sparkles } from 'lucide-react';
import { sound } from '../game/audio';

interface Props {
  stats: PlayerStats;
  onUpdateStats: (newStats: PlayerStats) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<Props> = ({ stats, onUpdateStats, onClose }) => {
  const { settings } = stats;

  const toggleSound = () => {
    sound.playClick();
    const newStats = {
      ...stats,
      settings: { ...settings, soundFx: !settings.soundFx },
    };
    sound.setSettings(newStats.settings.soundFx, newStats.settings.music, newStats.settings.volume);
    onUpdateStats(newStats);
  };

  const toggleMusic = () => {
    sound.playClick();
    const newStats = {
      ...stats,
      settings: { ...settings, music: !settings.music },
    };
    sound.setSettings(newStats.settings.soundFx, newStats.settings.music, newStats.settings.volume);
    onUpdateStats(newStats);
  };

  const setTouchMode = (mode: 'GESTURES' | 'BUTTONS' | 'BOTH') => {
    sound.playClick();
    onUpdateStats({
      ...stats,
      settings: { ...settings, touchControlMode: mode },
    });
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
          CONFIGURACIÓN
        </h2>

        <div className="w-12" />
      </div>

      <div className="flex flex-col gap-4 my-auto max-w-xs mx-auto w-full">
        {/* Sound FX Toggle */}
        <div className="flex items-center justify-between p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-3">
            {settings.soundFx ? <Volume2 className="w-5 h-5 text-cyan-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
            <span className="font-bold text-sm text-cyan-200">EFECTOS DE SONIDO</span>
          </div>
          <button
            onClick={toggleSound}
            className={`w-12 h-6 rounded-full p-1 transition-all ${settings.soundFx ? 'bg-cyan-500' : 'bg-slate-700'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-all ${settings.soundFx ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Music Toggle */}
        <div className="flex items-center justify-between p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-3">
            {settings.music ? <Volume2 className="w-5 h-5 text-cyan-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
            <span className="font-bold text-sm text-cyan-200">MÚSICA DE FONDO</span>
          </div>
          <button
            onClick={toggleMusic}
            className={`w-12 h-6 rounded-full p-1 transition-all ${settings.music ? 'bg-cyan-500' : 'bg-slate-700'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white transition-all ${settings.music ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Touch Controls Mode */}
        <div className="flex flex-col gap-2 p-3 bg-slate-900/80 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-2 text-cyan-400">
            <Smartphone className="w-4 h-4" />
            <span className="font-bold text-xs uppercase tracking-wider">CONTROLES TÁCTILES</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 mt-1">
            <button
              onClick={() => setTouchMode('GESTURES')}
              className={`py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${
                settings.touchControlMode === 'GESTURES' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
              }`}
            >
              GESTOS
            </button>
            <button
              onClick={() => setTouchMode('BUTTONS')}
              className={`py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${
                settings.touchControlMode === 'BUTTONS' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
              }`}
            >
              BOTONES
            </button>
            <button
              onClick={() => setTouchMode('BOTH')}
              className={`py-2 rounded-xl text-[10px] font-bold uppercase transition-all ${
                settings.touchControlMode === 'BOTH' ? 'bg-cyan-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
              }`}
            >
              AMBOS
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-cyan-400/60 uppercase tracking-widest font-mono">
        FANTASTIC RUNNER V1.0 • OPTIMIZADO PARA MÓVIL Y PC
      </div>
    </div>
  );
};
