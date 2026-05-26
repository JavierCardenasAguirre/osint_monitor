export interface NoticiaData {
  id: number;
  created_at: string;
  titulo: string;
  url: string | null;
  fuente: string | null;
  timestamp_original: string | null;
  departamento: string | null;
  municipio: string | null;
  tipologia: string | null;
  resumen: string | null;
  texto_completo: string | null;
  fecha_publicacion: string | null;
  source_type: string | null;
  categoria: string | null;
  criticidad: number | null;
  prospectiva: string | null;
}

export interface FiltrosState {
  departamento: string;
  municipio: string;
  tipologias: string[];
  fechaInicio: string;
  fechaFin: string;
  busqueda: string;
}
