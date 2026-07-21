'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { Map as MapIcon, Activity } from 'lucide-react';
import { coordenadasMunicipios, COLORES } from '@/lib/constants';
import type { NoticiaData } from '@/lib/noticia-types';
import 'maplibre-gl/dist/maplibre-gl.css';

interface OsintMapProps {
  noticias: NoticiaData[];
}

function createPulsingMarker(color: string, size: number, count: number): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.style.position = 'relative';
  wrapper.style.cursor = 'pointer';
  wrapper.style.width = `${size}px`;
  wrapper.style.height = `${size}px`;

  // Outer pulse ring
  const pulse = document.createElement('div');
  const pulseSize = size * 2.8;
  pulse.style.position = 'absolute';
  pulse.style.width = `${pulseSize}px`;
  pulse.style.height = `${pulseSize}px`;
  pulse.style.borderRadius = '50%';
  pulse.style.backgroundColor = color + '20';
  pulse.style.border = `1px solid ${color}40`;
  pulse.style.left = `${-(pulseSize - size) / 2}px`;
  pulse.style.top = `${-(pulseSize - size) / 2}px`;
  pulse.style.animation = 'osint-pulse 2.5s ease-out infinite';
  wrapper.appendChild(pulse);

  // Second pulse ring (staggered)
  const pulse2 = pulse.cloneNode() as HTMLDivElement;
  pulse2.style.animationDelay = '1.2s';
  wrapper.appendChild(pulse2);

  // Core dot
  const core = document.createElement('div');
  core.style.width = `${size}px`;
  core.style.height = `${size}px`;
  core.style.borderRadius = '50%';
  core.style.backgroundColor = color;
  core.style.boxShadow = `0 0 ${size}px ${color}cc, 0 0 ${size * 3}px ${color}44`;
  core.style.position = 'relative';
  core.style.zIndex = '2';
  wrapper.appendChild(core);

  // Count badge
  if (count > 1) {
    const badge = document.createElement('div');
    badge.textContent = String(count);
    badge.style.position = 'absolute';
    badge.style.top = '-10px';
    badge.style.right = '-10px';
    badge.style.backgroundColor = '#0a0e1a';
    badge.style.color = color;
    badge.style.border = `1.5px solid ${color}`;
    badge.style.borderRadius = '99px';
    badge.style.padding = '0 5px';
    badge.style.fontSize = '9px';
    badge.style.fontWeight = '800';
    badge.style.fontFamily = 'monospace';
    badge.style.zIndex = '3';
    badge.style.lineHeight = '16px';
    badge.style.boxShadow = `0 0 6px ${color}66`;
    wrapper.appendChild(badge);
  }

  return wrapper;
}

export default function OsintMap({ noticias }: OsintMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const linesLayerIds = useRef<string[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [maplibregl, setMaplibregl] = useState<any>(null);
  const [activeIncidents, setActiveIncidents] = useState(0);
  const [activeMunicipios, setActiveMunicipios] = useState(0);

  // Load maplibre-gl dynamically
  useEffect(() => {
    let cancelled = false;
    import('maplibre-gl').then((mod: any) => {
      if (!cancelled) setMaplibregl(mod?.default ?? mod);
    }).catch((e) => console.error('Failed to load maplibre-gl:', e));
    return () => { cancelled = true; };
  }, []);

  // Inject custom CSS for pulse animation and popups
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const styleId = 'osint-map-styles';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes osint-pulse {
        0% { transform: scale(0.4); opacity: 1; }
        100% { transform: scale(1.6); opacity: 0; }
      }
      @keyframes osint-dash {
        to { stroke-dashoffset: -20; }
      }
      .maplibregl-popup-content {
        background: #0a0e1aee !important;
        border: 1px solid #1e293b !important;
        border-radius: 10px !important;
        box-shadow: 0 4px 30px rgba(0,0,0,0.9), 0 0 50px rgba(59,130,246,0.08) !important;
        padding: 0 !important;
        color: #e2e8f0 !important;
        backdrop-filter: blur(10px) !important;
      }
      .maplibregl-popup-tip {
        border-top-color: #0a0e1aee !important;
      }
      .maplibregl-popup-close-button {
        color: #64748b !important;
        font-size: 18px !important;
        right: 6px !important;
        top: 6px !important;
      }
      .maplibregl-popup-close-button:hover {
        color: #e2e8f0 !important;
        background: transparent !important;
      }
      .maplibregl-ctrl-group {
        background: #0f172a !important;
        border: 1px solid #1e293b !important;
      }
      .maplibregl-ctrl-group button {
        border-color: #1e293b !important;
      }
      .maplibregl-ctrl-group button span {
        filter: invert(0.7) !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

  // Initialize map (using OpenStreetMap raster tiles)
  useEffect(() => {
    if (!maplibregl || !mapContainer?.current || mapRef?.current) return;

    let cancelled = false;

    try {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'osm-tiles': {
              type: 'raster',
              tiles: [
                'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              attribution: '\u00a9 OpenStreetMap contributors',
            },
          },
          layers: [
            {
              id: 'osm-layer',
              type: 'raster',
              source: 'osm-tiles',
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [-75.6, 7.8],
        zoom: 6.2,
        attributionControl: false,
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');

      map.on('load', () => {
        if (!cancelled) setMapLoaded(true);
      });

      mapRef.current = map;

      return () => {
        cancelled = true;
        map?.remove?.();
        mapRef.current = null;
        setMapLoaded(false);
      };
    } catch (err: any) {
      console.error('Map init error:', err);
    }
  }, [maplibregl]);

  // Compute grouped data
  const groupedData = useMemo(() => {
    const grouped: Record<string, { notis: NoticiaData[]; coords: { lat: number; lng: number; d: string } }> = {};
    for (const n of noticias ?? []) {
      const muni = (n?.municipio ?? '').toUpperCase();
      if (!muni) continue;
      const coords = coordenadasMunicipios?.[muni];
      if (!coords) continue;
      if (!grouped[muni]) grouped[muni] = { notis: [], coords };
      grouped[muni].notis.push(n);
    }
    return grouped;
  }, [noticias]);

  // Update markers and connection lines when data/map changes
  useEffect(() => {
    const map = mapRef?.current;
    if (!map || !maplibregl || !mapLoaded) return;

    // Clear old markers
    for (const m of markersRef?.current ?? []) {
      m?.remove?.();
    }
    markersRef.current = [];

    // Clear old line layers/sources
    for (const lid of linesLayerIds.current) {
      try {
        if (map.getLayer(lid)) map.removeLayer(lid);
        if (map.getSource(lid)) map.removeSource(lid);
      } catch (e) { /* ignore */ }
    }
    linesLayerIds.current = [];

    const entries = Object.entries(groupedData);
    let totalIncidents = 0;

    // Create markers
    for (const [muni, { notis, coords }] of entries) {
      totalIncidents += notis.length;

      const tipoCounts: Record<string, number> = {};
      for (const n of notis) {
        const t = n?.tipologia ?? 'GENERAL';
        tipoCounts[t] = (tipoCounts[t] ?? 0) + 1;
      }
      let topTipo = 'GENERAL';
      let topCount = 0;
      for (const [t, c] of Object.entries(tipoCounts)) {
        if (c > topCount) { topTipo = t; topCount = c; }
      }
      const color = COLORES?.[topTipo] ?? '#6b7280';
      const count = notis.length;
      const size = Math.min(10 + Math.sqrt(count) * 5, 28);

      const el = createPulsingMarker(color, size, count);

      const sourceIcon = (st: string | null) => {
        if (st === 'facebook') return '<svg width="12" height="12" viewBox="0 0 24 24" fill="#1877F2" style="display:inline;vertical-align:middle;margin-right:4px;"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';
        return '<svg width="12" height="12" viewBox="0 0 24 24" fill="#f97316" style="display:inline;vertical-align:middle;margin-right:4px;"><path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.02 7.38 20 6.18 20C4.98 20 4 19.02 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1Z"/></svg>';
      };

      const popupLines = notis.slice(0, 4).map((n: NoticiaData) => {
        const nColor = COLORES?.[n?.tipologia ?? ''] ?? '#6b7280';
        const icon = sourceIcon(n?.source_type ?? 'rss');
        return `<div style="padding:8px 12px;border-top:1px solid #1a2035;">
          <div style="font-weight:600;font-size:11px;line-height:1.4;color:#e2e8f0;">${icon}${n?.titulo ?? 'Sin titulo'}</div>
          <div style="margin-top:4px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <span style="font-size:9px;color:#64748b;">${n?.fuente ?? ''}</span>
            <span style="font-size:9px;color:#334155;">•</span>
            <span style="font-size:9px;color:#64748b;">${n?.fecha_publicacion ?? ''}</span>
            <span style="display:inline-block;padding:1px 6px;border-radius:99px;font-size:8px;font-weight:700;color:white;background:${nColor};">${n?.tipologia ?? 'GENERAL'}</span>
          </div>
        </div>`;
      }).join('');

      const moreText = notis.length > 4 ? `<div style="padding:6px 12px;text-align:center;font-size:9px;color:#475569;border-top:1px solid #1a2035;">+${notis.length - 4} más</div>` : '';

      const tipoSummary = Object.entries(tipoCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([t, c]) => `<span style="display:inline-block;padding:1px 6px;border-radius:99px;font-size:8px;font-weight:700;color:white;background:${COLORES?.[t] ?? '#6b7280'};margin-right:3px;">${t}: ${c}</span>`)
        .join('');

      const popupHtml = `<div style="max-width:300px;font-family:system-ui;">
        <div style="padding:10px 12px;background:linear-gradient(135deg, #0a0e1a 0%, #111827 100%);border-bottom:2px solid ${color}44;">
          <div style="display:flex;align-items:center;gap:6px;">
            <div style="width:10px;height:10px;border-radius:50%;background:${color};box-shadow:0 0 10px ${color};"></div>
            <span style="font-weight:800;font-size:13px;color:${color};letter-spacing:0.5px;">${muni}</span>
            <span style="margin-left:auto;font-size:10px;color:#475569;font-weight:600;">${coords.d}</span>
          </div>
          <div style="margin-top:6px;font-size:11px;font-weight:700;color:#e2e8f0;">${count} incidencia${count > 1 ? 's' : ''}</div>
          <div style="margin-top:4px;">${tipoSummary}</div>
        </div>
        ${popupLines}
        ${moreText}
      </div>`;

      const popup = new maplibregl.Popup({ offset: 18, closeButton: true, maxWidth: '320px' }).setHTML(popupHtml);
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([coords.lng, coords.lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    }

    // Draw connection lines between nearby municipalities with same tipologia
    const markerPositions = entries
      .filter(([, d]) => d.coords)
      .map(([muni, d]) => {
        const tipoCounts: Record<string, number> = {};
        for (const n of d.notis) {
          const t = n?.tipologia ?? 'GENERAL';
          tipoCounts[t] = (tipoCounts[t] ?? 0) + 1;
        }
        let topTipo = 'GENERAL';
        let topCount = 0;
        for (const [t, c] of Object.entries(tipoCounts)) {
          if (c > topCount) { topTipo = t; topCount = c; }
        }
        return { muni, lng: d.coords.lng, lat: d.coords.lat, tipo: topTipo, count: d.notis.length };
      });

    // Connect municipalities that share a tipologia
    const drawn = new Set<string>();
    let lineIdx = 0;
    for (let i = 0; i < markerPositions.length; i++) {
      for (let j = i + 1; j < markerPositions.length; j++) {
        const a = markerPositions[i];
        const b = markerPositions[j];
        if (a.tipo !== b.tipo) continue;
        const key = `${a.muni}-${b.muni}`;
        if (drawn.has(key)) continue;

        // Calculate distance - only connect if within reasonable range
        const dist = Math.sqrt(Math.pow(a.lat - b.lat, 2) + Math.pow(a.lng - b.lng, 2));
        if (dist > 2.5) continue; // ~250km max

        drawn.add(key);
        const color = COLORES?.[a.tipo] ?? '#6b7280';
        const srcId = `osint-line-${lineIdx}`;
        lineIdx++;

        try {
          map.addSource(srcId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [[a.lng, a.lat], [b.lng, b.lat]],
              },
            },
          });

          map.addLayer({
            id: srcId,
            type: 'line',
            source: srcId,
            paint: {
              'line-color': color,     // <-- ahora usa el color calculado
              'line-width': 1.5,
              'line-opacity': 0.9,
              'line-dasharray': [2, 4],
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            }
          });

          linesLayerIds.current.push(srcId);
        } catch (e) {
          // ignore duplicate layer errors
        }
      }
    }

    setActiveIncidents(totalIncidents);
    setActiveMunicipios(entries.length);
  }, [groupedData, mapLoaded, maplibregl]);

  return (
    <div className="bg-[#060910] rounded-xl border border-[#141c2e] overflow-hidden" style={{ boxShadow: '0 0 40px rgba(0,0,0,0.6), 0 0 80px rgba(59,130,246,0.04)' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#141c2e] flex items-center justify-between bg-gradient-to-r from-[#060910] to-[#0c1220]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <MapIcon className="w-4 h-4 text-blue-400" />
          <h3 className="font-display font-bold text-xs sm:text-sm text-slate-200 tracking-widest uppercase">Mapa de Incidencias</h3>
        </div>
        <div className="flex items-center gap-3 sm:gap-5 text-[10px] font-mono">
          <span className="text-emerald-400 flex items-center gap-1">
            <Activity className="w-3 h-3" />
            {activeIncidents}
          </span>
          <span className="text-cyan-400">{activeMunicipios} zonas</span>
        </div>
      </div>

      {/* Map container */}
      <div ref={mapContainer} className="w-full" style={{ height: 'clamp(350px, 50vw, 600px)' }} />

      {/* Bottom status bar */}
      <div className="px-4 py-2 border-t border-[#141c2e] flex items-center justify-between bg-[#040710] text-[9px] font-mono text-slate-600">
        <span>CÓRDOBA • ANTIOQUIA • COLOMBIA</span>
        <span className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          EN VIVO
        </span>
      </div>
    </div>
  );
}