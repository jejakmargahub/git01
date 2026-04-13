// Master Data: Tabel Prioritas Etnis & Aksara Regional
// Digunakan sebagai referensi statis di seluruh aplikasi Jejak Marga

export interface EthnicityData {
  id: string;        // unique key
  name: string;      // nama etnis
  scriptName: string; // nama aksara
  labelName: string;  // label yang tampil di form
  fontFamily: string; // CSS font-family
  fontClass: string;  // utility CSS class
  isRtl: boolean;     // right-to-left?
  example: string;    // contoh teks
  notes: string;      // catatan tambahan
}

export const ETHNICITIES: EthnicityData[] = [
  {
    id: "jawa",
    name: "Jawa",
    scriptName: "Hanacaraka",
    labelName: "Nama Aksara Jawa (Hanacaraka)",
    fontFamily: "'Noto Sans Javanese', sans-serif",
    fontClass: "font-javanese",
    isRtl: false,
    example: "ꦄꦥꦁ",
    notes: "Prioritas tertinggi",
  },
  {
    id: "sunda",
    name: "Sunda",
    scriptName: "Aksara Sunda Baku",
    labelName: "Nama Aksara Sunda",
    fontFamily: "'Noto Sans Sundanese', sans-serif",
    fontClass: "font-sundanese",
    isRtl: false,
    example: "ᮃᮕᮀ",
    notes: "",
  },
  {
    id: "batak",
    name: "Batak (gabungan)",
    scriptName: "Surat Batak",
    labelName: "Nama Surat Batak",
    fontFamily: "'Noto Sans Batak', sans-serif",
    fontClass: "font-batak",
    isRtl: false,
    example: "ᯀᯇᯰ",
    notes: "Mencakup Toba, Karo, Mandailing, dll",
  },
  {
    id: "tionghoa",
    name: "Tionghoa (Cina)",
    scriptName: "Hanzi",
    labelName: "Nama Mandarin (Hanzi)",
    fontFamily: "'Noto Sans SC', 'Noto Sans TC', sans-serif",
    fontClass: "font-chinese",
    isRtl: false,
    example: "阿方",
    notes: "WNI keturunan; gunakan Traditional untuk mayoritas di Indonesia",
  },
  {
    id: "bugis",
    name: "Bugis",
    scriptName: "Lontara'",
    labelName: "Nama Aksara Lontara'",
    fontFamily: "'Noto Sans Lontara', sans-serif",
    fontClass: "",
    isRtl: false,
    example: "ᨕᨄ",
    notes: "",
  },
  {
    id: "madura",
    name: "Madura",
    scriptName: "Carakan Madhurâ",
    labelName: "Nama Carakan Madhurâ",
    fontFamily: "'Noto Sans Javanese', sans-serif",
    fontClass: "font-javanese",
    isRtl: false,
    example: "ꦄꦥꦁ",
    notes: "Tidak punya blok Unicode sendiri",
  },
  {
    id: "bali",
    name: "Bali",
    scriptName: "Aksara Bali",
    labelName: "Nama Aksara Bali",
    fontFamily: "'Noto Sans Balinese', sans-serif",
    fontClass: "font-balinese",
    isRtl: false,
    example: "ᬅᬧᬂ",
    notes: "",
  },
  {
    id: "makassar",
    name: "Makassar",
    scriptName: "Lontara'",
    labelName: "Nama Aksara Lontara'",
    fontFamily: "'Noto Sans Lontara', sans-serif",
    fontClass: "",
    isRtl: false,
    example: "ᨕᨄ",
    notes: "Sama dengan Bugis",
  },
  {
    id: "melayu",
    name: "Melayu",
    scriptName: "Jawi (Arab-Melayu)",
    labelName: "Nama Jawi (Arab-Melayu)",
    fontFamily: "'Noto Sans Arabic', sans-serif",
    fontClass: "font-arabic",
    isRtl: true,
    example: "اڤڠ",
    notes: "",
  },
  {
    id: "rejang",
    name: "Rejang",
    scriptName: "Aksara Rejang",
    labelName: "Nama Aksara Rejang",
    fontFamily: "'Noto Sans Rejang', sans-serif",
    fontClass: "",
    isRtl: false,
    example: "ꥆꥉꥇ",
    notes: "Populasi relatif kecil, tapi aksara didukung Unicode",
  },
  {
    id: "lampung",
    name: "Lampung",
    scriptName: "Aksara Lampung",
    labelName: "Nama Aksara Lampung",
    fontFamily: "'Noto Sans Lampung', sans-serif",
    fontClass: "",
    isRtl: false,
    example: "𞄀𞄃𞄁",
    notes: "",
  },
  {
    id: "kerinci",
    name: "Kerinci",
    scriptName: "Aksara Incung",
    labelName: "Nama Aksara Incung",
    fontFamily: "",
    fontClass: "",
    isRtl: false,
    example: "",
    notes: "Belum dukung penuh, tetapi unik",
  },
];

// Helper: Cari etnis berdasarkan ID
export function getEthnicityById(id: string): EthnicityData | undefined {
  return ETHNICITIES.find((e) => e.id === id);
}

// Helper: Cari etnis berdasarkan nama
export function getEthnicityByName(name: string): EthnicityData | undefined {
  return ETHNICITIES.find((e) => e.name.toLowerCase() === name.toLowerCase());
}
