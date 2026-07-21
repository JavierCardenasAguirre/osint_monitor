'use client';

import { Shield, Radio, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/30 bg-slate-800/70 backdrop-blur-sm">
      <div className="max-w-[1200px] mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-300/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-300" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-slate-100">OSINT Monitor</span>
          <div className="hidden sm:flex items-center gap-1 ml-2">
            <Radio className="w-3 h-3 text-amber-300 animate-pulse" />
            <span className="text-xs text-slate-300">EN VIVO</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-300">
          <span>Córdoba</span>
          <span className="text-slate-500">&bull;</span>
          <span>Antioquia</span>
          <span className="text-slate-500">&bull;</span>
          <span>Colombia</span>
        </div>
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-700/40 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          {mobileOpen ? <X className="w-5 h-5 text-slate-100" /> : <Menu className="w-5 h-5 text-slate-100" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-700/30 bg-slate-800/90 backdrop-blur-sm px-4 py-3">
          <div className="flex items-center gap-1 mb-2">
            <Radio className="w-3 h-3 text-amber-300 animate-pulse" />
            <span className="text-xs text-slate-300">EN VIVO</span>
          </div>
          <p className="text-sm text-slate-300">Córdoba &bull; Antioquia &bull; Colombia</p>
        </div>
      )}
    </header>
  );
}