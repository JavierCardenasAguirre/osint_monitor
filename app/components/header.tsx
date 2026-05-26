'use client';

import { Shield, Radio, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-xl">
      <div className="max-w-[1200px] mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight">OSINT Monitor</span>
          <div className="hidden sm:flex items-center gap-1 ml-2">
            <Radio className="w-3 h-3 text-primary animate-pulse" />
            <span className="text-xs text-muted-foreground">EN VIVO</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          <span>Córdoba</span>
          <span className="text-border">&bull;</span>
          <span>Antioquia</span>
          <span className="text-border">&bull;</span>
          <span>Colombia</span>
        </div>
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-card/95 backdrop-blur-xl px-4 py-3">
          <div className="flex items-center gap-1 mb-2">
            <Radio className="w-3 h-3 text-primary animate-pulse" />
            <span className="text-xs text-muted-foreground">EN VIVO</span>
          </div>
          <p className="text-sm text-muted-foreground">Córdoba &bull; Antioquia &bull; Colombia</p>
        </div>
      )}
    </header>
  );
}
