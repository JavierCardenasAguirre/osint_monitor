'use client';

import { useState } from 'react';
import { X, Facebook, Upload, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const FB_GROUPS = [
  { value: 'ORGANIS', label: 'ORGANIS' },
  { value: 'RADAR CARIBE', label: 'RADAR CARIBE' },
  { value: 'JA-NOTICIAS', label: 'JA-NOTICIAS' },
  { value: 'GQ-NOTICIAS', label: 'GQ-NOTICIAS' },
  { value: 'NP-NOTICIAS', label: 'NP-NOTICIAS' },
];

interface FbImportModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface PostEntry {
  id: string;
  text: string;
  group: string;
  url: string;
}

export default function FbImportModal({ open, onClose, onSuccess }: FbImportModalProps) {
  const [posts, setPosts] = useState<PostEntry[]>([
    { id: '1', text: '', group: 'ORGANIS', url: '' },
  ]);
  const [bulkText, setBulkText] = useState('');
  const [bulkGroup, setBulkGroup] = useState('ORGANIS');
  const [mode, setMode] = useState<'individual' | 'bulk'>('bulk');
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const addPost = () => {
    setPosts(prev => [...prev, { id: String(Date.now()), text: '', group: 'ORGANIS', url: '' }]);
  };

  const removePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const updatePost = (id: string, field: keyof PostEntry, value: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      let payload: Array<{ text: string; group: string; url?: string }> = [];

      if (mode === 'bulk') {
        // Split bulk text by double newline or "---" separator
        const entries = bulkText
          .split(/\n{2,}|---+/)
          .map(t => t.trim())
          .filter(t => t.length >= 10);

        payload = entries.map(text => ({ text, group: bulkGroup }));
      } else {
        payload = posts
          .filter(p => p.text.trim().length >= 10)
          .map(p => ({ text: p.text.trim(), group: p.group, url: p.url || undefined }));
      }

      if (payload.length === 0) {
        toast.error('No hay publicaciones válidas para importar (mínimo 10 caracteres)');
        setSubmitting(false);
        return;
      }

      const res = await fetch('/api/facebook/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: payload }),
      });

      const data = await res?.json?.().catch(() => ({}));

      if (data?.success) {
        toast.success(`Importadas ${data.nuevas} noticias de Facebook (${data.duplicadas} duplicadas)`);
        if (data.nuevas > 0) onSuccess();
        // Reset form
        setBulkText('');
        setPosts([{ id: '1', text: '', group: 'ORGANIS', url: '' }]);
        onClose();
      } else {
        toast.error(data?.error ?? 'Error al importar');
      }
    } catch (err: any) {
      toast.error('Error de conexión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-slate-700/60 border border-slate-600/30 rounded-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-600/30 sticky top-0 bg-slate-800/90 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1877F2]/20 flex items-center justify-center">
              <Facebook className="w-4 h-4 text-[#1877F2]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-slate-100">Importar desde Facebook</h2>
              <p className="text-xs text-slate-300">Pega el contenido de las publicaciones de los grupos</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-700/40 rounded-lg transition-colors">
            <X className="w-4 h-4 text-slate-200" />
          </button>
        </div>

        {/* Mode toggle */}
        <div className="p-4 pb-2">
          <div className="flex gap-2">
            <button
              onClick={() => setMode('bulk')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === 'bulk'
                  ? 'bg-[#1877F2] text-white'
                  : 'bg-slate-800/30 text-slate-300 hover:text-slate-100'
              }`}
            >
              Pegado masivo
            </button>
            <button
              onClick={() => setMode('individual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === 'individual'
                  ? 'bg-[#1877F2] text-white'
                  : 'bg-slate-800/30 text-slate-300 hover:text-slate-100'
              }`}
            >
              Individual
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {mode === 'bulk' ? (
            <>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">Grupo de origen</label>
                <select
                  value={bulkGroup}
                  onChange={e => setBulkGroup(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-600/30 text-sm focus:outline-none focus:ring-1 focus:ring-amber-300"
                >
                  {FB_GROUPS.map(g => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300">
                  Publicaciones (separa cada publicación con una línea en blanco o "---")
                </label>
                <textarea
                  value={bulkText}
                  onChange={e => setBulkText(e.target.value)}
                  placeholder={`Pega aquí el contenido de las publicaciones...\n\nSepara cada publicación con una línea en blanco.\n\nEjemplo:\nUna persona fue capturada en Montería por...\n\nSe reporta bloqueo en la vía Lorica-San Pelayo...`}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-600/30 text-sm focus:outline-none focus:ring-1 focus:ring-amber-300 min-h-[250px] resize-y font-mono text-slate-100"
                />
                <p className="text-xs text-slate-300">
                  {bulkText.split(/\n{2,}|---+/).filter(t => t.trim().length >= 10).length} publicaciones detectadas
                </p>
              </div>
            </>
          ) : (
            <>
              {posts.map((post, idx) => (
                <div key={post.id} className="p-3 rounded-lg border border-slate-600/30 bg-slate-800/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-300">Post #{idx + 1}</span>
                    {posts.length > 1 && (
                      <button
                        onClick={() => removePost(post.id)}
                        className="p-1 hover:bg-red-700/20 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                      </button>
                    )}
                  </div>
                  <select
                    value={post.group}
                    onChange={e => updatePost(post.id, 'group', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-800/40 border border-slate-600/30 text-xs focus:outline-none focus:ring-1 focus:ring-amber-300 text-slate-100"
                  >
                    {FB_GROUPS.map(g => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                  <textarea
                    value={post.text}
                    onChange={e => updatePost(post.id, 'text', e.target.value)}
                    placeholder="Contenido de la publicación..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-600/30 text-sm focus:outline-none focus:ring-1 focus:ring-amber-300 min-h-[80px] resize-y text-slate-100"
                  />
                  <input
                    type="text"
                    value={post.url}
                    onChange={e => updatePost(post.id, 'url', e.target.value)}
                    placeholder="URL del post (opcional)"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-800/40 border border-slate-600/30 text-xs focus:outline-none focus:ring-1 focus:ring-amber-300 text-slate-100"
                  />
                </div>
              ))}
              <button
                onClick={addPost}
                className="w-full py-2 rounded-lg border border-dashed border-slate-600/30 text-xs text-slate-300 hover:text-slate-100 hover:border-amber-300/50 transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar otra publicación
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-600/30 sticky bottom-0 bg-slate-800/90 flex items-center justify-between">
          <p className="text-xs text-slate-300">
            Las noticias serán clasificadas automáticamente
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-800/40 text-slate-300 hover:bg-slate-700/40 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-[#1877F2] text-white hover:bg-[#166fe5] transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              Importar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}