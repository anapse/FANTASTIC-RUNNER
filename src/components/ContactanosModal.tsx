import React, { useState } from 'react';
import { Mail, MessageSquare, Send, X, Check } from 'lucide-react';
import { sound } from '../game/audio';

interface Props {
  onClose: () => void;
}

export const ContactanosModal: React.FC<Props> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const email = 'anapse_video@hotmail.com';

  const handleCopy = () => {
    sound.playClick();
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendEmail = () => {
    sound.playClick();
    window.location.href = `mailto:${email}?subject=Colaboración%20Fantastic%20Runner`;
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none font-sans text-white">
      {/* Modal Card (Matching Screenshot 3) */}
      <div className="relative w-full max-w-sm bg-[#0c121e] border border-amber-500/40 rounded-3xl p-5 shadow-[0_0_35px_rgba(0,0,0,0.9)] flex flex-col items-center text-center">
        {/* Header Bar */}
        <div className="flex items-center justify-between w-full border-b border-slate-800/80 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-amber-400 stroke-[2.5]" />
            <span className="text-amber-400 font-black text-xs uppercase tracking-wider">
              CONTÁCTANOS
            </span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-7 h-7 bg-slate-800/80 hover:bg-slate-700 active:scale-90 rounded-lg flex items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Golden Speech Bubble Circle Icon */}
        <div className="w-16 h-16 rounded-full border border-amber-500/50 bg-[#141b2a] flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)] mb-3">
          <MessageSquare className="w-8 h-8 text-amber-400 stroke-[1.8]" />
        </div>

        {/* Title */}
        <h3 className="text-base font-black text-white tracking-wide mb-2">
          ¿Quieres colaborar?
        </h3>

        {/* Subtitle Description */}
        <p className="text-[11px] text-slate-300 leading-relaxed max-w-xs mb-4">
          Si tienes ideas para nuevos niveles, mecánicas o simplemente quieres ser parte del equipo de Fantastic Runner, escríbenos a:
        </p>

        {/* Email Pill Box */}
        <div
          onClick={handleCopy}
          className="w-full bg-[#070b14] hover:bg-[#0a1120] border border-amber-500/30 rounded-2xl py-2.5 px-4 mb-3 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all shadow-inner"
          title="Haz clic para copiar"
        >
          <span className="text-amber-400 font-mono font-bold text-xs tracking-wider">
            {email}
          </span>
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : null}
        </div>
        {copied && (
          <span className="text-[10px] text-emerald-400 font-bold -mt-2 mb-2 animate-pulse">
            ¡Correo copiado al portapapeles!
          </span>
        )}

        {/* Action Button: ENVIAR CORREO */}
        <button
          onClick={handleSendEmail}
          className="w-full py-3 px-6 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-500 hover:to-green-500 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-emerald-400/50 flex items-center justify-center gap-2 cursor-pointer transition-all mb-4"
        >
          <Send className="w-4 h-4 text-white stroke-[2.5]" />
          <span>ENVIAR CORREO</span>
        </button>

        {/* Footer Copyright */}
        <span className="text-[10px] text-slate-500 font-mono">
          Comercial Jarros • 2026
        </span>
      </div>
    </div>
  );
};
