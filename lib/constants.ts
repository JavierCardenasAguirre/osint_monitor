export const DICCIONARIO_INTEL: Record<string, string[]> = {
  "ORDEN PÚBLICO": ["DRONES","ALERTA","MILITAR","ATENTADO","ATENTAR","AMENAZA","HOSTIGAMIENTO","DISIDENCIAS","GUERRILLA","FARC","ELN","CLAN DEL GOLFO","AGC","GAO","BACRIM","GRUPO ARMADO","COMBATES","ENFRENTAMIENTO ARMADO","ATAQUE ARMADO","ATAQUE A POLICÍA","ATAQUE A MILITARES","EMBOSCADA","BALACERA","TIROTEO","RAFAGUEO","CARRO BOMBA","EXPLOSIÓN","ARTEFACTO EXPLOSIVO","MINA ANTIPERSONAL","RETÉN","PARO ARMADO","TOQUE DE QUEDA ILEGAL","CONTROL TERRITORIAL","PRESENCIA ARMADA","CAMPAMENTO ILEGAL","INTELIGENCIA MILITAR","INTELIGENCIA POLICIAL"],
  "HOMICIDIOS": ["HOMICIDIO","ASESINATO","SICARIATO","MASACRE","FEMINICIDIO","AJUSTE DE CUENTAS","ABATIDO","DADO DE BAJA","NEUTRALIZADO","HALLAZGO DE CADÁVER","CUERPO SIN VIDA","TORTURA"],
  "SECUESTROS": ["SECUESTRO","DESAPARICIÓN","DESAPARICIÓN FORZADA","RECLUTAMIENTO DE MENORES","TRATA DE PERSONAS","TRÁFICO DE MIGRANTES","EXPLOTACIÓN SEXUAL","ABUSO SEXUAL","VIOLENCIA INTRAFAMILIAR","MALTRATO INFANTIL","RESCATE","LIBERACIÓN"],
  "NARCOTRÁFICO": ["NARCOTRÁFICO","MICROTRÁFICO","EXPENDIO DE DROGAS","COCAÍNA","MARIHUANA","LABORATORIO DE COCA","CRISTALIZADERO","SEMILLERO DE COCA","RUTA DEL NARCOTRÁFICO","CARGAMENTO DE DROGA","PISTA CLANDESTINA","CALETA","INCAUTACIÓN","EMBARCACIÓN SOSPECHOSA"],
  "MINERÍA/AMBIENTE": ["MINERÍA ILEGAL","MINERÍA CRIMINAL","EXTRACCIÓN ILEGAL","ORO ILEGAL","PARO MINERO","DEFORESTACIÓN","TALA ILEGAL","TRÁFICO DE FAUNA","TRÁFICO DE ESPECIES","CONTAMINACIÓN AMBIENTAL","DERRAME DE PETRÓLEO","MERCURIO","INCENDIO","INUNDACIÓN","CALOR"],
  "SISTEMA JUDICIAL": ["DOPADA","DOPADO","PATRULLA","TRISTEZA","RODÓ","ARROLLADA","MATÓ","MURIERON","LUTO","HERIDO","MUERTE","SIN VIDA","PATRULLAJE","DESAPARECIDO","ENCARCELAN","INDAGATORIA","FRUSTRAN INFILTRACIÓN","INFILTRACIÓN","CAPTURA","CAPTURA MASIVA","ORDEN DE CAPTURA","JUDICIALIZACIÓN","IMPUTACIÓN","CONDENA","ALLANAMIENTO","PERSECUCIÓN","FUGA DE PRESOS","EXTRADICIÓN","EXTINCIÓN DE DOMINIO","BIENES INCAUTADOS","ALIAS","FISCALÍA","ARRESTO","JUDICIALES"],
  "CORRUPCIÓN/FINANZAS": ["EMERGENCIA ECONÓMICA","MILLONES","CUENTAS","CORRUPCIÓN","TESTAFERRO","LAVADO DE DINEROS","LAVADO DE ACTIVOS","ENRIQUECIMIENTO ILÍCITO","SOBORNO","COHECHO","PECULADO","FRAUDE","ESTAFA","ESTAFA VIRTUAL","FALSIFICACIÓN","SUPLANTACIÓN","EVASIÓN FISCAL","FINANCIACIÓN DEL TERRORISMO","CONTRABANDO","CLONACIÓN DE TARJETAS"],
  "CRIMEN ORGANIZADO": ["MAFIA","CARTEL","RED CRIMINAL","ESTRUCTURA CRIMINAL","OFICINA DE COBRO","GOTA A GOTA","TRÁFICO DE ARMAS","CRIMEN ORGANIZADO","CRIMEN TRANSNACIONAL","FINANCISTA","CABECILLA","SICARIOS"],
  "DELINCUENCIA COMÚN": ["AYUDA","GRITOS","HURTO","ROBO","ATRACO","ASALTO","INTIMIDACIÓN","PANFLETO","PANFLETO AMENAZANTE","VANDALISMO"],
  "PROTESTAS": ["ALTERACIÓN","DISTURBIOS","MOTÍN","SAQUEO","PROTESTA VIOLENTA","PROTESTA SOCIAL","MARCHAS","PLANTÓN","BLOQUEO","BLOQUEO VIAL","QUEMA DE LLANTAS","QUEMA DE VEHÍCULOS","SAQUEO A COMERCIO","INVASIÓN DE TIERRAS","OCUPACIÓN ILEGAL"],
  "MOVILIDAD": ["PEAJE","PARQUEO","PLAN RETORNO","RETEN","MOVILIDAD","AEROPUERTO","PUNTOS DE CONTROL","RUTA","ACCIDENTE","CHOQUE","VÍA","CARRETERA","CIERRE","TRÁNSITO"],
  "POLÍTICA": ["COALICIÓN","ALCALDÍA","GOBERNACIÓN","DE LA ESPRIELLA","PAZ TOTAL","CONCEJAL","GOBERNADOR","PRESIDENTE","MINISTRO","DEBATIR","URIBE","ALCALDE","GOBIERNO","SINDICATOS"],
  "EDUCACIÓN/SALUD": ["DEPRESIÓN","COLEGIO","AGUA POTABLE","LIBRO","UNAD","SALUD","AMBULANCIA","UNIVERSIDAD","HOSPITAL","CLÍNICA","PROFESOR"],
  "EMERGENCIAS": ["LLAMAS","PÁNICO","COLISIÓN","TEMPERATURAS","IDEAM","CRISIS","FRENTE FRÍO","CRECIENTE SÚBITA","DERRUMBE","BOMBEROS","UNGRD","DESPLAZAMIENTO FORZADO","CONFINAMIENTO","ALERTA TEMPRANA"],
  "TECNOLOGÍA": ["GECELCA","GANACOR","RECICLA","TUTELA","CIBERDELITOS","IA","SOFTWARE","CIBERATAQUE","HACKEO","CIBERSEGURIDAD","REDES","PHISHING","RANSOMWARE","ESPIONAJE","FUGA DE INFORMACIÓN"],
  "CULTURA/DEPORTE": ["CONCIERTO","MADRES","UGP","RUMBA","EXPOSICIÓN","ORQUESTA","FIESTA","GRAN ANIVERSARIO","REINADO","HINCHADA","PARTIDO","FINAL","GOLES","CULTURA","FESTIVAL","TURISMO","JAMES"],
  "GENERAL": ["VARIOS","OTROS","COMUNICADOS","DENUNCIA CIUDADANA","VÍCTIMAS DEL CONFLICTO"]
};

export const COLORES: Record<string, string> = {
  "ORDEN PÚBLICO": "#ff3131",
  "HOMICIDIOS": "#ff8c00",
  "SECUESTROS": "#ff00ff",
  "NARCOTRÁFICO": "#0d9488",
  "MINERÍA/AMBIENTE": "#16a34a",
  "SISTEMA JUDICIAL": "#3b82f6",
  "CORRUPCIÓN/FINANZAS": "#eab308",
  "CRIMEN ORGANIZADO": "#a855f7",
  "DELINCUENCIA COMÚN": "#f43f5e",
  "PROTESTAS": "#f97316",
  "MOVILIDAD": "#64748b",
  "POLÍTICA": "#a1a1aa",
  "EDUCACIÓN/SALUD": "#06b6d4",
  "EMERGENCIAS": "#ef4444",
  "TECNOLOGÍA": "#3a86ff",
  "CULTURA/DEPORTE": "#10b981",
  "GENERAL": "#6b7280"
};

export const TIPOLOGIAS = Object.keys(COLORES);

export interface CoordenadaMunicipio {
  lat: number;
  lng: number;
  d: string;
}

export const coordenadasMunicipios: Record<string, CoordenadaMunicipio> = {
  "MONTERIA": { lat: 8.751, lng: -75.881, d: "Cordoba" },
  "MONTERÍA": { lat: 8.751, lng: -75.881, d: "Cordoba" },
  "AYAPEL": { lat: 8.312, lng: -75.147, d: "Cordoba" },
  "BUENAVISTA": { lat: 8.182, lng: -75.525, d: "Cordoba" },
  "CANALETE": { lat: 8.791, lng: -76.242, d: "Cordoba" },
  "CERETE": { lat: 8.884, lng: -75.791, d: "Cordoba" },
  "CERETÉ": { lat: 8.884, lng: -75.791, d: "Cordoba" },
  "CHIMA": { lat: 9.148, lng: -75.628, d: "Cordoba" },
  "CHIMÁ": { lat: 9.148, lng: -75.628, d: "Cordoba" },
  "CHINU": { lat: 9.105, lng: -75.398, d: "Cordoba" },
  "CHINÚ": { lat: 9.105, lng: -75.398, d: "Cordoba" },
  "CIENAGA DE ORO": { lat: 8.877, lng: -75.623, d: "Cordoba" },
  "CIÉNAGA DE ORO": { lat: 8.877, lng: -75.623, d: "Cordoba" },
  "COTORRA": { lat: 9.039, lng: -75.790, d: "Cordoba" },
  "LA APARTADA": { lat: 8.101, lng: -75.355, d: "Cordoba" },
  "LORICA": { lat: 9.236, lng: -75.813, d: "Cordoba" },
  "LOS CORDOBAS": { lat: 8.895, lng: -76.353, d: "Cordoba" },
  "LOS CÓRDOBAS": { lat: 8.895, lng: -76.353, d: "Cordoba" },
  "MOMIL": { lat: 9.238, lng: -75.675, d: "Cordoba" },
  "MONTELIBANO": { lat: 7.979, lng: -75.417, d: "Cordoba" },
  "MONTELÍBANO": { lat: 7.979, lng: -75.417, d: "Cordoba" },
  "MOÑITOS": { lat: 9.245, lng: -76.132, d: "Cordoba" },
  "PLANETA RICA": { lat: 8.412, lng: -75.584, d: "Cordoba" },
  "PUEBLO NUEVO": { lat: 8.497, lng: -75.508, d: "Cordoba" },
  "PUERTO ESCONDIDO": { lat: 9.016, lng: -76.262, d: "Cordoba" },
  "PUERTO LIBERTADOR": { lat: 7.888, lng: -75.671, d: "Cordoba" },
  "PURISIMA": { lat: 9.236, lng: -75.722, d: "Cordoba" },
  "PURÍSIMA": { lat: 9.236, lng: -75.722, d: "Cordoba" },
  "SAHAGUN": { lat: 8.947, lng: -75.448, d: "Cordoba" },
  "SAHAGÚN": { lat: 8.947, lng: -75.448, d: "Cordoba" },
  "SAN ANDRES DE SOTAVENTO": { lat: 9.122, lng: -75.508, d: "Cordoba" },
  "SAN ANDRÉS DE SOTAVENTO": { lat: 9.122, lng: -75.508, d: "Cordoba" },
  "SAN ANTERO": { lat: 9.374, lng: -75.758, d: "Cordoba" },
  "SAN BERNARDO DEL VIENTO": { lat: 9.354, lng: -75.952, d: "Cordoba" },
  "SAN CARLOS": { lat: 8.800, lng: -75.700, d: "Cordoba" },
  "SAN JOSE DE URE": { lat: 7.787, lng: -75.533, d: "Cordoba" },
  "SAN JOSÉ DE URÉ": { lat: 7.787, lng: -75.533, d: "Cordoba" },
  "SAN PELAYO": { lat: 8.958, lng: -75.842, d: "Cordoba" },
  "TIERRALTA": { lat: 8.173, lng: -76.059, d: "Cordoba" },
  "TUCHIN": { lat: 9.186, lng: -75.513, d: "Cordoba" },
  "TUCHÍN": { lat: 9.186, lng: -75.513, d: "Cordoba" },
  "VALENCIA": { lat: 8.258, lng: -76.150, d: "Cordoba" },
  "MEDELLIN": { lat: 6.244, lng: -75.581, d: "Antioquia" },
  "MEDELLÍN": { lat: 6.244, lng: -75.581, d: "Antioquia" },
  "ABEJORRAL": { lat: 5.789, lng: -75.428, d: "Antioquia" },
  "ABRIAQUI": { lat: 6.627, lng: -76.064, d: "Antioquia" },
  "ABRIAQUÍ": { lat: 6.627, lng: -76.064, d: "Antioquia" },
  "ALEJANDRIA": { lat: 6.365, lng: -75.141, d: "Antioquia" },
  "ALEJANDRÍA": { lat: 6.365, lng: -75.141, d: "Antioquia" },
  "AMAGA": { lat: 6.040, lng: -75.708, d: "Antioquia" },
  "AMAGÁ": { lat: 6.040, lng: -75.708, d: "Antioquia" },
  "AMALFI": { lat: 6.910, lng: -75.074, d: "Antioquia" },
  "ANDES": { lat: 5.656, lng: -75.878, d: "Antioquia" },
  "ANGELOPOLIS": { lat: 6.122, lng: -75.714, d: "Antioquia" },
  "ANGELÓPOLIS": { lat: 6.122, lng: -75.714, d: "Antioquia" },
  "ANGOSTURA": { lat: 6.885, lng: -75.335, d: "Antioquia" },
  "ANORI": { lat: 7.073, lng: -75.147, d: "Antioquia" },
  "ANORÍ": { lat: 7.073, lng: -75.147, d: "Antioquia" },
  "ANZA": { lat: 6.293, lng: -75.917, d: "Antioquia" },
  "ANZÁ": { lat: 6.293, lng: -75.917, d: "Antioquia" },
  "APARTADO": { lat: 7.884, lng: -76.634, d: "Antioquia" },
  "APARTADÓ": { lat: 7.884, lng: -76.634, d: "Antioquia" },
  "ARBOLETES": { lat: 8.850, lng: -76.426, d: "Antioquia" },
  "ARGELIA": { lat: 5.732, lng: -75.142, d: "Antioquia" },
  "ARMENIA": { lat: 6.163, lng: -75.809, d: "Antioquia" },
  "BARBOSA": { lat: 6.438, lng: -75.331, d: "Antioquia" },
  "BELMIRA": { lat: 6.605, lng: -75.667, d: "Antioquia" },
  "BELLO": { lat: 6.337, lng: -75.557, d: "Antioquia" },
  "BETANIA": { lat: 5.727, lng: -75.989, d: "Antioquia" },
  "BETULIA": { lat: 6.113, lng: -75.983, d: "Antioquia" },
  "BRICEÑO": { lat: 7.112, lng: -75.551, d: "Antioquia" },
  "BRICENO": { lat: 7.112, lng: -75.551, d: "Antioquia" },
  "BURITICA": { lat: 6.719, lng: -75.908, d: "Antioquia" },
  "BURITICÁ": { lat: 6.719, lng: -75.908, d: "Antioquia" },
  "CACERES": { lat: 7.583, lng: -75.337, d: "Antioquia" },
  "CÁCERES": { lat: 7.583, lng: -75.337, d: "Antioquia" },
  "CAICEDO": { lat: 6.405, lng: -75.987, d: "Antioquia" },
  "CALDAS": { lat: 6.091, lng: -75.635, d: "Antioquia" },
  "CAMPAMENTO": { lat: 6.979, lng: -75.297, d: "Antioquia" },
  "CAÑASGORDAS": { lat: 6.749, lng: -76.025, d: "Antioquia" },
  "CANASGORDAS": { lat: 6.749, lng: -76.025, d: "Antioquia" },
  "CARACOLI": { lat: 6.409, lng: -74.757, d: "Antioquia" },
  "CARACOLÍ": { lat: 6.409, lng: -74.757, d: "Antioquia" },
  "CARAMANTA": { lat: 5.548, lng: -75.648, d: "Antioquia" },
  "CAREPA": { lat: 7.757, lng: -76.652, d: "Antioquia" },
  "CAUCASIA": { lat: 7.986, lng: -75.193, d: "Antioquia" },
  "CHIGORODO": { lat: 7.667, lng: -76.681, d: "Antioquia" },
  "CHIGORODÓ": { lat: 7.667, lng: -76.681, d: "Antioquia" },
  "CISNEROS": { lat: 6.538, lng: -75.089, d: "Antioquia" },
  "CIUDAD BOLIVAR": { lat: 5.853, lng: -76.025, d: "Antioquia" },
  "CIUDAD BOLÍVAR": { lat: 5.853, lng: -76.025, d: "Antioquia" },
  "COCORNA": { lat: 6.057, lng: -75.185, d: "Antioquia" },
  "COCORNÁ": { lat: 6.057, lng: -75.185, d: "Antioquia" },
  "CONCEPCION": { lat: 6.394, lng: -75.258, d: "Antioquia" },
  "CONCEPCIÓN": { lat: 6.394, lng: -75.258, d: "Antioquia" },
  "CONCORDIA": { lat: 6.047, lng: -75.907, d: "Antioquia" },
  "COPACABANA": { lat: 6.346, lng: -75.508, d: "Antioquia" },
  "DABEIBA": { lat: 7.001, lng: -76.267, d: "Antioquia" },
  "DONMATIAS": { lat: 6.485, lng: -75.394, d: "Antioquia" },
  "DONMATÍAS": { lat: 6.485, lng: -75.394, d: "Antioquia" },
  "EBEJICO": { lat: 6.326, lng: -75.768, d: "Antioquia" },
  "EL BAGRE": { lat: 7.603, lng: -74.809, d: "Antioquia" },
  "EL RETIRO": { lat: 6.058, lng: -75.503, d: "Antioquia" },
  "ENVIGADO": { lat: 6.171, lng: -75.587, d: "Antioquia" },
  "FREDONIA": { lat: 5.925, lng: -75.675, d: "Antioquia" },
  "FRONTINO": { lat: 6.780, lng: -76.133, d: "Antioquia" },
  "GIRARDOTA": { lat: 6.377, lng: -75.448, d: "Antioquia" },
  "GRANADA": { lat: 6.143, lng: -75.186, d: "Antioquia" },
  "GUARNE": { lat: 6.280, lng: -75.443, d: "Antioquia" },
  "GUATAPE": { lat: 6.234, lng: -75.158, d: "Antioquia" },
  "GUATAPÉ": { lat: 6.234, lng: -75.158, d: "Antioquia" },
  "ITAGUI": { lat: 6.168, lng: -75.644, d: "Antioquia" },
  "ITAGÜÍ": { lat: 6.168, lng: -75.644, d: "Antioquia" },
  "ITUANGO": { lat: 7.171, lng: -75.764, d: "Antioquia" },
  "JARDIN": { lat: 5.599, lng: -75.820, d: "Antioquia" },
  "JARDÍN": { lat: 5.599, lng: -75.820, d: "Antioquia" },
  "JERICO": { lat: 5.792, lng: -75.786, d: "Antioquia" },
  "JERICÓ": { lat: 5.792, lng: -75.786, d: "Antioquia" },
  "LA CEJA": { lat: 6.032, lng: -75.433, d: "Antioquia" },
  "LA ESTRELLA": { lat: 6.157, lng: -75.643, d: "Antioquia" },
  "MARINILLA": { lat: 6.173, lng: -75.336, d: "Antioquia" },
  "MONTEBELLO": { lat: 5.944, lng: -75.527, d: "Antioquia" },
  "MURINDO": { lat: 6.985, lng: -76.821, d: "Antioquia" },
  "MURINDÓ": { lat: 6.985, lng: -76.821, d: "Antioquia" },
  "MUTATA": { lat: 7.244, lng: -76.435, d: "Antioquia" },
  "MUTATÁ": { lat: 7.244, lng: -76.435, d: "Antioquia" },
  "NECHI": { lat: 8.094, lng: -74.775, d: "Antioquia" },
  "NECHÍ": { lat: 8.094, lng: -74.775, d: "Antioquia" },
  "NECOCLI": { lat: 8.423, lng: -76.789, d: "Antioquia" },
  "NECOCLÍ": { lat: 8.423, lng: -76.789, d: "Antioquia" },
  "PEQUE": { lat: 7.022, lng: -75.909, d: "Antioquia" },
  "PUERTO BERRIO": { lat: 6.491, lng: -74.403, d: "Antioquia" },
  "PUERTO BERRÍO": { lat: 6.491, lng: -74.403, d: "Antioquia" },
  "PUERTO TRIUNFO": { lat: 5.872, lng: -74.646, d: "Antioquia" },
  "REMEDIOS": { lat: 7.028, lng: -74.693, d: "Antioquia" },
  "RIONEGRO": { lat: 6.155, lng: -75.374, d: "Antioquia" },
  "SABANETA": { lat: 6.151, lng: -75.616, d: "Antioquia" },
  "SALGAR": { lat: 5.967, lng: -75.977, d: "Antioquia" },
  "SAN CARLOS ANT": { lat: 6.187, lng: -74.993, d: "Antioquia" },
  "SAN FRANCISCO": { lat: 5.964, lng: -75.101, d: "Antioquia" },
  "SAN JERONIMO": { lat: 6.442, lng: -75.731, d: "Antioquia" },
  "SAN JERÓNIMO": { lat: 6.442, lng: -75.731, d: "Antioquia" },
  "SAN LUIS": { lat: 6.043, lng: -74.994, d: "Antioquia" },
  "SAN PEDRO": { lat: 6.460, lng: -75.557, d: "Antioquia" },
  "SAN RAFAEL": { lat: 6.294, lng: -75.025, d: "Antioquia" },
  "SEGOVIA": { lat: 7.079, lng: -74.698, d: "Antioquia" },
  "SONSON": { lat: 5.710, lng: -75.310, d: "Antioquia" },
  "SONSÓN": { lat: 5.710, lng: -75.310, d: "Antioquia" },
  "TAMESIS": { lat: 5.664, lng: -75.713, d: "Antioquia" },
  "TÁMESIS": { lat: 5.664, lng: -75.713, d: "Antioquia" },
  "TARAZA": { lat: 7.584, lng: -75.402, d: "Antioquia" },
  "TARAZÁ": { lat: 7.584, lng: -75.402, d: "Antioquia" },
  "TITIRIBI": { lat: 6.062, lng: -75.793, d: "Antioquia" },
  "TITIRIBÍ": { lat: 6.062, lng: -75.793, d: "Antioquia" },
  "TURBO": { lat: 8.094, lng: -76.728, d: "Antioquia" },
  "URRAO": { lat: 6.317, lng: -76.134, d: "Antioquia" },
  "VALDIVIA": { lat: 7.293, lng: -75.391, d: "Antioquia" },
  "VENECIA": { lat: 5.962, lng: -75.735, d: "Antioquia" },
  "YARUMAL": { lat: 6.962, lng: -75.417, d: "Antioquia" },
  "YOLOMBO": { lat: 6.598, lng: -75.013, d: "Antioquia" },
  "YOLOMBÓ": { lat: 6.598, lng: -75.013, d: "Antioquia" },
  "YONDO": { lat: 7.006, lng: -73.909, d: "Antioquia" },
  "YONDÓ": { lat: 7.006, lng: -73.909, d: "Antioquia" },
  "ZARAGOZA": { lat: 7.489, lng: -74.867, d: "Antioquia" }
};

export function getMunicipiosPorDepto(depto: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const [name, data] of Object.entries(coordenadasMunicipios)) {
    if (data?.d === depto) {
      const normalized = name?.replace(/[ÁÉÍÓÚ]/g, (c: string) => ({ 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U' } as Record<string, string>)[c] ?? c);
      if (!seen.has(normalized)) {
        seen.add(normalized);
        result.push(name);
      }
    }
  }
  return result.sort();
}

export function clasificarTipologia(texto: string): string {
  const upper = (texto ?? '').toUpperCase();
  let bestTipo = 'GENERAL';
  let bestCount = 0;
  for (const [tipo, keywords] of Object.entries(DICCIONARIO_INTEL)) {
    let count = 0;
    for (const kw of keywords ?? []) {
      if (upper?.includes(kw)) count++;
    }
    if (count > bestCount) {
      bestCount = count;
      bestTipo = tipo;
    }
  }
  return bestTipo;
}

export function normalizarMunicipio(m: string): string {
  return (m ?? '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}
