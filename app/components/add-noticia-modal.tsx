'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Sparkles, Save } from 'lucide-react';
import { TIPOLOGIAS, COLORES, getMunicipiosPorDepto, clasificarTipologia } from '@/lib/constants';
import { toast } from 'sonner';

interface AddNoticiaModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddNoticiaModal({ open, onClose, onSuccess }: AddNoticiaModalProps) {
  const [form, setForm] = useState({
    titulo: '',
    url: '',
    fuente: '',
    departamento: 'Cordoba',
    municipio: '',
    tipologia: '',
    fecha_publicacion: '',
    resumen: '',
    texto_completo: '',
  });
  const [saving, setSaving] = useState(false);
  const [suggestedTipo, setSuggestedTipo] = useState('');

  const municipios = getMunicipiosPorDepto(form?.departamento ?? '');

  // Auto-classify
  useEffect(() => {
    const text = [form?.titulo, form?.resumen, form?.texto_completo].filter(Boolean).join(' ');
    if (text?.length > 5) {
      setSuggestedTipo(clasificarTipologia(text));
    }
  }, [form?.titulo, form?.resumen, form?.texto_completo]);

  const updateField = (field: string, value: string) => {
    setForm((prev: any) => ({ ...(prev ?? {}), [field]: value }));
    if (field === 'departamento') {
      setForm((prev: any) => ({ ...(prev ?? {}), departamento: value, municipio: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!form?.titulo) {
      toast?.error?.('El título es obligatorio');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/noticias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tipologia: form?.tipologia || suggestedTipo || 'GENERAL',
        }),
      });
      if (!res?.ok) {
        const err = await res?.json?.().catch(() => ({}));
        throw new Error(err?.error ?? 'Error al guardar');
      }
      toast?.success?.('Noticia guardada correctamente');
      setForm({
        titulo: '', url: '', fuente: '', departamento: 'Cordoba',
        municipio: '', tipologia: '', fecha_publicacion: '', resumen: '', texto_completo: '',
      });
      onSuccess?.();
      onClose?.();
    } catch (err: any) {
      toast?.error?.(err?.message ?? 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => onClose?.()} />

      {/* Modal */}
      <div className="relative bg-card rounded-xl border border-border/50 w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ boxShadow: 'var(--shadow-lg)' }}>
        {/* Header */}
        <div className="sticky top-0 bg-card/95 backdrop-blur-sm px-5 py-4 border-b border-border/50 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            <h2 className="font-display font-bold text-base">Agregar Noticia</h2>
          </div>
          <button onClick={() => onClose?.()} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Título */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Título *</label>
            <input
              type="text"
              value={form?.titulo ?? ''}
              onChange={(e: any) => updateField('titulo', e?.target?.value ?? '')}
              placeholder="Título de la noticia"
              className="w-full py-2.5 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* URL + Fuente */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">URL</label>
              <input
                type="url"
                value={form?.url ?? ''}
                onChange={(e: any) => updateField('url', e?.target?.value ?? '')}
                placeholder="https://..."
                className="w-full py-2.5 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Fuente</label>
              <input
                type="text"
                value={form?.fuente ?? ''}
                onChange={(e: any) => updateField('fuente', e?.target?.value ?? '')}
                placeholder="Nombre del medio"
                className="w-full py-2.5 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Depto + Municipio */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Departamento</label>
              <select
                value={form?.departamento ?? 'Cordoba'}
                onChange={(e: any) => updateField('departamento', e?.target?.value ?? 'Cordoba')}
                className="w-full py-2.5 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="Cordoba">Córdoba</option>
                <option value="Antioquia">Antioquia</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Municipio</label>
              <select
                value={form?.municipio ?? ''}
                onChange={(e: any) => updateField('municipio', e?.target?.value ?? '')}
                className="w-full py-2.5 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Seleccionar...</option>
                {(municipios ?? []).map((m: string) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tipología + Fecha */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Tipología</label>
              <select
                value={form?.tipologia ?? ''}
                onChange={(e: any) => updateField('tipologia', e?.target?.value ?? '')}
                className="w-full py-2.5 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Auto-detectar</option>
                {(TIPOLOGIAS ?? []).map((t: string) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {suggestedTipo && !form?.tipologia && (
                <div className="mt-1 flex items-center gap-1 text-[10px] text-primary">
                  <Sparkles className="w-3 h-3" />
                  Sugerencia: <span className="font-bold">{suggestedTipo}</span>
                </div>
              )}
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Fecha publicación</label>
              <input
                type="date"
                value={form?.fecha_publicacion ?? ''}
                onChange={(e: any) => updateField('fecha_publicacion', e?.target?.value ?? '')}
                className="w-full py-2.5 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {/* Resumen */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Resumen</label>
            <textarea
              value={form?.resumen ?? ''}
              onChange={(e: any) => updateField('resumen', e?.target?.value ?? '')}
              placeholder="Breve resumen de la noticia..."
              rows={3}
              className="w-full py-2.5 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          {/* Texto completo */}
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Texto completo</label>
            <textarea
              value={form?.texto_completo ?? ''}
              onChange={(e: any) => updateField('texto_completo', e?.target?.value ?? '')}
              placeholder="Texto completo de la noticia..."
              rows={4}
              className="w-full py-2.5 px-3 rounded-lg bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={saving || !form?.titulo}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar Noticia'}
          </button>
        </div>
      </div>
    </div>
  );
}
