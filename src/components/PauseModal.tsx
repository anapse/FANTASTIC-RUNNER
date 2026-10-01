import React from 'react';
import { Play, RotateCcw, Settings, Home } from 'lucide-react';
import { sound } from '../game/audio';

interface Props {
  onResume: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
  onExitToMenu: () => void;
}

export const PauseModal: React.FC<Props> = ({
  onResume,
  onRestart,
  onOpenSettings,
  onExitToMenu,
}) => {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md text-white font-sans select-none">
      <div className="w-full max-w-xs bg-slate-900 border-2 border-cyan-500/40 rounded-3xl p-5 flex flex-col items-center gap-4 shadow-[0_0_40px_rgba(0,240,255,0.3)]">
        <h2 className="text-2xl font-black italic tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-amber-300 to-red-500 uppercase">
          JUEGO EN PAUSA
        </h2>

        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-sm uppercase rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>REANUDAR</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-bold text-xs uppercase rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>REINICIAR</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-bold text-xs uppercase rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Settings className="w-4 h-4" />
            <span>CONFIGURACIÓN</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onExitToMenu();
            }}
            className="w-full py-2.5 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-500/30 font-bold text-xs uppercase rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>MENÚ PRINCIPAL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
