import React from 'react';
import { ArrowLeft, Crosshair, ArrowUp, ArrowLeftRight, Zap } from 'lucide-react';
import { sound } from '../game/audio';

interface Props {
  onClose: () => void;
}

export const ComoJugarModal: React.FC<Props> = ({ onClose }) => {
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-between p-4 bg-slate-950/95 backdrop-blur-md text-white font-sans select-none overflow-y-auto">
      {/* Top Header */}
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
          CÓMO JUGAR
        </h2>

        <div className="w-12" />
      </div>

      {/* Touch Gesture Guide */}
      <div className="flex flex-col gap-3 my-auto py-2">
        <div className="p-3 bg-slate-900/80 border border-cyan-500/30 rounded-2xl flex items-center gap-3">
          <div className="w-12 h-12 bg-cyan-950 rounded-xl flex items-center justify-center text-cyan-400 border border-cyan-400/40">
            <Crosshair className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-cyan-200">TAP EN PANTALLA → DISPARAR</span>
            <span className="text-[11px] text-slate-300">Toca cualquier punto de la pantalla para disparar ráfagas de blaster hacia adelante.</span>
          </div>
        </div>

        <div className="p-3 bg-slate-900/80 border border-blue-500/30 rounded-2xl flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-950 rounded-xl flex items-center justify-center text-blue-400 border border-blue-400/40">
            <ArrowUp className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-blue-200">DESLIZAR ARRIBA → SALTAR</span>
            <span className="text-[11px] text-slate-300">Desliza el dedo hacia arriba para esquivar barreras láser y rocas bajas.</span>
          </div>
        </div>

        <div className="p-3 bg-slate-900/80 border border-amber-500/30 rounded-2xl flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-950 rounded-xl flex items-center justify-center text-amber-400 border border-amber-400/40">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-amber-200">DESLIZAR IZQ / DER → MOVER</span>
            <span className="text-[11px] text-slate-300">Desliza a la izquierda o derecha para cambiar de carril y esquivar obstáculos.</span>
          </div>
        </div>

        <div className="p-3 bg-slate-900/80 border border-purple-500/30 rounded-2xl flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-950 rounded-xl flex items-center justify-center text-purple-400 border border-purple-400/40">
            <Zap className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm text-purple-200">DESLIZAR DIAGONAL → SALTO COMBINADO</span>
            <span className="text-[11px] text-slate-300">Desliza en diagonal arriba-izquierda o arriba-derecha para saltar y moverte al mismo tiempo.</span>
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-cyan-400/60 uppercase tracking-widest font-mono">
        DISFRUTA DE LA MEJOR EXPERIENCIA EN MÓVIL Y PC
      </div>
    </div>
  );
};
