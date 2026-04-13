import { db } from "../lib/db";
import { ethnicities } from "../lib/db/schema";
import { v4 as uuidv4 } from "uuid";

const ethnicityData = [
  {
    name: "Jawa",
    scriptName: "Hanacaraka",
    labelName: "Nama Aksara Jawa (Hanacaraka)",
    fontFamily: "Noto Sans Javanese",
    isRtl: false,
    example: "ꦄꦥꦁ",
    notes: "Prioritas tertinggi",
  },
  {
    name: "Sunda",
    scriptName: "Aksara Sunda Baku",
    labelName: "Nama Aksara Sunda",
    fontFamily: "Noto Sans Sundanese",
    isRtl: false,
    example: "ᮃᮕᮀ",
    notes: "",
  },
  {
    name: "Batak (gabungan)",
    scriptName: "Surat Batak",
    labelName: "Nama Surat Batak",
    fontFamily: "Noto Sans Batak",
    isRtl: false,
    example: "ᯀᯇᯰ",
    notes: "Mencakup Toba, Karo, Mandailing, dll",
  },
  {
    name: "Tionghoa (Cina)",
    scriptName: "Hanzi",
    labelName: "Nama Mandarin (Hanzi)",
    fontFamily: "Noto Sans SC",
    isRtl: false,
    example: "阿方",
    notes: "WNI keturunan; gunakan Traditional untuk mayoritas di Indonesia",
  },
  {
    name: "Bugis",
    scriptName: "Lontara'",
    labelName: "Nama Aksara Lontara'",
    fontFamily: "Noto Sans Lontara",
    isRtl: false,
    example: "ᨕᨄ",
    notes: "",
  },
  {
    name: "Madura",
    scriptName: "Carakan Madhurâ",
    labelName: "Nama Carakan Madhurâ",
    fontFamily: "Noto Sans Javanese",
    isRtl: false,
    example: "ꦄꦥꦁ",
    notes: "Tidak punya blok Unicode sendiri",
  },
  {
    name: "Bali",
    scriptName: "Aksara Bali",
    labelName: "Nama Aksara Bali",
    fontFamily: "Noto Sans Balinese",
    isRtl: false,
    example: "ᬅᬧᬂ",
    notes: "",
  },
  {
    name: "Makassar",
    scriptName: "Lontara'",
    labelName: "Nama Aksara Lontara'",
    fontFamily: "Noto Sans Lontara",
    isRtl: false,
    example: "ᨕᨄ",
    notes: "Sama dengan Bugis",
  },
  {
    name: "Melayu",
    scriptName: "Jawi (Arab-Melayu)",
    labelName: "Nama Jawi (Arab-Melayu)",
    fontFamily: "Noto Sans Arabic",
    isRtl: true,
    example: "اڤڠ",
    notes: "",
  },
  {
    name: "Rejang",
    scriptName: "Aksara Rejang",
    labelName: "Nama Aksara Rejang",
    fontFamily: "Noto Sans Rejang",
    isRtl: false,
    example: "ꥆꥉꥇ",
    notes: "Populasi relatif kecil, tapi aksara didukung Unicode",
  },
  {
    name: "Lampung",
    scriptName: "Aksara Lampung",
    labelName: "Nama Aksara Lampung",
    fontFamily: "Noto Sans Lampung",
    isRtl: false,
    example: "𞄀𞄃𞄁",
    notes: "",
  },
  {
    name: "Kerinci",
    scriptName: "Aksara Incung",
    labelName: "Nama Aksara Incung",
    fontFamily: "",
    isRtl: false,
    example: "",
    notes: "Belum dukung penuh, tetapi unik",
  },
];

async function seed() {
  console.log("🌱 Seeding ethnicities...");
  try {
    for (const data of ethnicityData) {
      await db.insert(ethnicities)
        .values({
          ...data,
          id: uuidv4(),
        })
        .onConflictDoUpdate({
          target: ethnicities.name,
          set: {
            scriptName: data.scriptName,
            labelName: data.labelName,
            fontFamily: data.fontFamily,
            isRtl: data.isRtl,
            example: data.example,
            notes: data.notes,
          },
        });
      console.log(`✅ Seeded: ${data.name}`);
    }
    console.log("✨ Seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding ethnicities:", error);
  }
  process.exit(0);
}

seed();
