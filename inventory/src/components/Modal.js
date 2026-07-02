'use client';
import { X } from 'lucide-react';

export default function Modal({ title, onClose, children, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 pb-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className={`relative bg-[#0d0d2b] border border-[rgba(0,168,255,0.2)] rounded-2xl w-full shadow-2xl ${wide ? 'max-w-4xl' : 'max-w-2xl'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,168,255,0.15)]">
          <h2 className="text-lg font-bold text-[#e6f1ff] font-mono tracking-wide">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-[#8892b0] hover:text-white transition">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
