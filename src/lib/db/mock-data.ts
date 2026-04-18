import type { FamilyMember, Family, Relationship } from "@/lib/db/schema";

// ============================================
// DATA DUMMY UNTUK TESTING TANPA DATABASE
// ============================================

// Demo user
export const DEMO_USER = {
  id: "demo-user-001",
  email: "demo@silsilah.app",
  phoneNumber: "081234567890", // dummy phone number
  name: "Chris Siauw",
  password: "demo123",
};

// Tiga bagan keluarga
export const DEMO_FAMILIES: Family[] = [
  {
    id: "fam-001",
    name: "Siauw Sak Po",
    description: "Keluarga inti garis keturunan langsung",
    createdBy: DEMO_USER.id,
    isPublic: false,
    isPublicViewEnabled: false,
    publicViewSlug: null,
    inviteCode: "JEJAKMARGA-1122",
    familyType: "genealogy",
    settings: {},
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "fam-002",
    name: "Keluarga Tan",
    description: "Keluarga besar dari pihak ibu",
    createdBy: DEMO_USER.id,
    isPublic: false,
    isPublicViewEnabled: false,
    publicViewSlug: null,
    inviteCode: "JEJAKMARGA-3344",
    familyType: "genealogy",
    settings: {},
    createdAt: new Date("2024-02-01"),
  },
  {
    id: "fam-003",
    name: "Perkumpulan Marga Siauw",
    description: "Anggota marga Siauw terverifikasi",
    createdBy: DEMO_USER.id,
    isPublic: false,
    isPublicViewEnabled: false,
    publicViewSlug: null,
    inviteCode: "JEJAKMARGA-5566",
    familyType: "genealogy",
    settings: {},
    createdAt: new Date("2024-03-01"),
  },
];

// Anggota keluarga Siauw Sak Po (4 generasi, 16 anggota)
export const DEMO_MEMBERS: FamilyMember[] = [
  // Generasi 1 (Buyut)
  {
    id: "m-001",
    familyId: "fam-001",
    fullName: "Siauw Tek Hin",
    mandarinName: "萧德兴",
    nickname: "Akong",
    gender: "M",
    birthDate: "1930-05-15",
    deathDate: "2005-08-20",
    title: "Buyut",
    phone: null,
    bio: "Pendiri keluarga, berasal dari Fujian",
    metadata: {},
    photoUrl: null,
    ethnicityId: null,
    regionalName: null,
    createdAt: new Date(),
  },
  {
    id: "m-002",
    familyId: "fam-001",
    fullName: "Lim Siu Lan",
    mandarinName: "林秀兰",
    nickname: "Ama",
    gender: "F",
    birthDate: "1935-03-10",
    deathDate: "2010-12-01",
    title: "Buyut",
    phone: null,
    bio: null,
    metadata: {},
    photoUrl: null,
    ethnicityId: null,
    regionalName: null,
    createdAt: new Date(),
  },
  // Generasi 2 (Kakek/Nenek)
  {
    id: "m-003",
    familyId: "fam-001",
    fullName: "Siauw Beng Kiat",
    mandarinName: null,
    nickname: "Engkong",
    gender: "M",
    birthDate: "1955-11-22",
    deathDate: null,
    title: "Kakek",
    phone: "081234567890",
    bio: "Pensiunan guru",
    metadata: {},
    photoUrl: null,
    ethnicityId: null,
    regionalName: null,
    createdAt: new Date(),
  },
  {
    id: "m-004",
    familyId: "fam-001",
    fullName: "Tan Mei Hua",
    mandarinName: null,
    nickname: "Oma",
    gender: "F",
    birthDate: "1958-07-14",
    deathDate: null,
    title: "Nenek",
    phone: "081234567891",
    bio: null,
    metadata: {},
    photoUrl: null,
    ethnicityId: null,
    regionalName: null,
    createdAt: new Date(),
  },
  {
    id: "m-005",
    familyId: "fam-001",
    fullName: "Siauw Beng Hwa",
    mandarinName: null,
    nickname: "Om Hwa",
    gender: "M",
    birthDate: "1960-02-28",
    deathDate: null,
    title: "Paman",
    phone: "081234567892",
    bio: "Pengusaha",
    metadata: {},
    photoUrl: null,
    ethnicityId: null,
    regionalName: null,
    createdAt: new Date(),
  },
  // Generasi 3 (Orang Tua)
  {
    id: "m-006",
    familyId: "fam-001",
    fullName: "Siauw Wei Ming",
    mandarinName: null,
    nickname: "Papa",
    gender: "M",
    birthDate: "1978-04-05",
    deathDate: null,
    title: "Kepala Keluarga",
    phone: "081298765432",
    bio: null,
    metadata: {},
    photoUrl: null,
    ethnicityId: null,
    regionalName: null,
    createdAt: new Date(),
  },
  {
    id: "m-007",
    familyId: "fam-001",
    fullName: "Lim Shu Ting",
    mandarinName: null,
    nickname: "Mama",
    gender: "F",
    birthDate: "1980-09-18",
    deathDate: null,
    title: null,
    phone: "081298765433",
    bio: null,
    metadata: {},
    photoUrl: null,
    ethnicityId: null,
    regionalName: null,
    createdAt: new Date(),
  },
  {
    id: "m-008",
    familyId: "fam-001",
    fullName: "Siauw Wei Jun",
    mandarinName: null,
    nickname: "Ko Jun",
    gender: "M",
    birthDate: "1982-12-01",
    deathDate: null,
    title: null,
    phone: "081298765434",
    bio: "Anak kedua Om Hwa",
    metadata: {},
    photoUrl: null,
    ethnicityId: null,
    regionalName: null,
    createdAt: new Date(),
  },
  // Generasi 4 (Anak)
  {
    id: "m-009",
    familyId: "fam-001",
    fullName: "Siauw Christopher",
    mandarinName: null,
    nickname: "Chris",
    gender: "M",
    birthDate: "2000-06-15",
    deathDate: null,
    title: null,
    phone: "081355551234",
    bio: "Developer",
    metadata: {},
    photoUrl: null,
    ethnicityId: null,
    regionalName: null,
    createdAt: new Date(),
  },
  {
    id: "m-010",
    familyId: "fam-001",
    fullName: "Siauw Jessica",
    mandarinName: null,
    nickname: "Jess",
    gender: "F",
    birthDate: "2003-01-20",
    deathDate: null,
    title: null,
    phone: null,
    bio: "Mahasiswi",
    metadata: {},
    photoUrl: null,
    ethnicityId: null,
    regionalName: null,
    createdAt: new Date(),
  },
  {
    id: "m-011",
    familyId: "fam-001",
    fullName: "Siauw Kevin",
    mandarinName: null,
    nickname: "Kev",
    gender: "M",
    birthDate: "2005-08-10",
    deathDate: null,
    title: null,
    phone: null,
    bio: null,
    metadata: {},
    photoUrl: null,
    ethnicityId: null,
    regionalName: null,
    createdAt: new Date(),
  },
  // Anak tambahan Papa & Mama
  {
    id: "m-012",
    familyId: "fam-001",
    fullName: "Siauw Daniel",
    mandarinName: null,
    nickname: "Dan",
    gender: "M",
    birthDate: "2007-03-25",
    deathDate: null,
    title: null,
    phone: null,
    bio: "Pelajar SMA",
    metadata: {},
    photoUrl: null,
    ethnicityId: null,
    regionalName: null,
    createdAt: new Date(),
  },
  {
    id: "m-013",
    familyId: "fam-001",
    fullName: "Siauw Melody",
    mandarinName: null,
    nickname: "Mel",
    gender: "F",
    birthDate: "2010-11-08",
    deathDate: null,
    title: null,
    phone: null,
    bio: "Pelajar SMP",
    metadata: {},
    photoUrl: null,
    ethnicityId: null,
    regionalName: null,
    createdAt: new Date(),
  },
  // Istri Om Hwa
  {
    id: "m-014",
    familyId: "fam-001",
    fullName: "Lim Siu Mei",
    mandarinName: null,
    nickname: "Ci Linda",
    gender: "F",
    birthDate: "1963-06-12",
    deathDate: null,
    title: null,
    phone: "081234567893",
    bio: null,
    metadata: {},
    photoUrl: null,
    ethnicityId: null,
    regionalName: null,
    createdAt: new Date(),
  },
  // Anak tambahan Om Hwa & Ci Linda
  {
    id: "m-015",
    familyId: "fam-001",
    fullName: "Siauw Melisa",
    mandarinName: null,
    nickname: "Mel",
    gender: "F",
    birthDate: "1985-04-17",
    deathDate: null,
    title: null,
    phone: "081298765435",
    bio: "Dokter",
    metadata: {},
    photoUrl: null,
    ethnicityId: null,
    regionalName: null,
    createdAt: new Date(),
  },
  {
    id: "m-016",
    familyId: "fam-001",
    fullName: "Siauw Adrian",
    mandarinName: null,
    nickname: "Adi",
    gender: "M",
    birthDate: "1988-09-30",
    deathDate: null,
    title: null,
    phone: "081298765436",
    bio: "Insinyur",
    metadata: {},
    photoUrl: null,
    ethnicityId: null,
    regionalName: null,
    createdAt: new Date(),
  },
  // --- TES: Pasangan Anak-Anak ---
  {
    id: "m-017",
    familyId: "fam-001",
    fullName: "Grace Chen",
    mandarinName: null,
    nickname: "Grace",
    gender: "F",
    birthDate: "2001-05-12",
    deathDate: null,
    title: null,
    phone: null,
    bio: "Istri Chris",
    metadata: {},
    photoUrl: null,
    ethnicityId: null,
    regionalName: null,
    createdAt: new Date(),
  },
  {
    id: "m-018",
    familyId: "fam-001",
    fullName: "Stella Yuliani",
    mandarinName: null,
    nickname: "Ci Stella",
    gender: "F",
    birthDate: "1984-08-20",
    deathDate: null,
    title: null,
    phone: null,
    bio: "Istri Ko Jun",
    metadata: {},
    photoUrl: null,
    ethnicityId: null,
    regionalName: null,
    createdAt: new Date(),
  },
  // Generasi 5 (Cicit)
  {
    id: "m-019",
    familyId: "fam-001",
    fullName: "Siauw Lucas",
    mandarinName: null,
    nickname: "Lucas",
    gender: "M",
    birthDate: "2015-02-14",
    deathDate: null,
    title: null,
    phone: null,
    bio: "Anak Ko Jun & Stella",
    metadata: {},
    photoUrl: null,
    ethnicityId: null,
    regionalName: null,
    createdAt: new Date(),
  },
];

// Hubungan keluarga
export const DEMO_RELATIONSHIPS: Relationship[] = [
  // Buyut → Kakek (parent)
  { id: "r-001", familyId: "fam-001", fromMemberId: "m-001", toMemberId: "m-003", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
  { id: "r-002", familyId: "fam-001", fromMemberId: "m-001", toMemberId: "m-005", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
  { id: "r-003", familyId: "fam-001", fromMemberId: "m-002", toMemberId: "m-003", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
  { id: "r-004", familyId: "fam-001", fromMemberId: "m-002", toMemberId: "m-005", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
  // Buyut pasangan
  { id: "r-005", familyId: "fam-001", fromMemberId: "m-001", toMemberId: "m-002", relationType: "spouse",
    isMainLine: false, createdAt: new Date() },
  // Kakek → Orang Tua (parent)
  { id: "r-006", familyId: "fam-001", fromMemberId: "m-003", toMemberId: "m-006", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
  { id: "r-007", familyId: "fam-001", fromMemberId: "m-004", toMemberId: "m-006", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
  // Kakek pasangan
  { id: "r-008", familyId: "fam-001", fromMemberId: "m-003", toMemberId: "m-004", relationType: "spouse",
    isMainLine: false, createdAt: new Date() },
  // Om Hwa → Ko Jun (parent)
  { id: "r-009", familyId: "fam-001", fromMemberId: "m-005", toMemberId: "m-008", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
  // Orang Tua → Anak (parent)
  { id: "r-010", familyId: "fam-001", fromMemberId: "m-006", toMemberId: "m-009", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
  { id: "r-011", familyId: "fam-001", fromMemberId: "m-006", toMemberId: "m-010", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
  { id: "r-012", familyId: "fam-001", fromMemberId: "m-007", toMemberId: "m-009", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
  { id: "r-013", familyId: "fam-001", fromMemberId: "m-007", toMemberId: "m-010", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
  // Orang Tua pasangan
  { id: "r-014", familyId: "fam-001", fromMemberId: "m-006", toMemberId: "m-007", relationType: "spouse",
    isMainLine: false, createdAt: new Date() },
  // Om Hwa → Kevin (parent)
  { id: "r-015", familyId: "fam-001", fromMemberId: "m-005", toMemberId: "m-011", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
  // Papa & Mama → Daniel (parent)
  { id: "r-016", familyId: "fam-001", fromMemberId: "m-006", toMemberId: "m-012", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
  { id: "r-017", familyId: "fam-001", fromMemberId: "m-007", toMemberId: "m-012", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
  // Papa & Mama → Melody (parent)
  { id: "r-018", familyId: "fam-001", fromMemberId: "m-006", toMemberId: "m-013", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
  { id: "r-019", familyId: "fam-001", fromMemberId: "m-007", toMemberId: "m-013", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
  // Om Hwa pasangan
  { id: "r-020", familyId: "fam-001", fromMemberId: "m-005", toMemberId: "m-014", relationType: "spouse",
    isMainLine: false, createdAt: new Date() },
  // Om Hwa & Ci Linda → Melisa (parent)
  { id: "r-021", familyId: "fam-001", fromMemberId: "m-005", toMemberId: "m-015", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
  { id: "r-022", familyId: "fam-001", fromMemberId: "m-014", toMemberId: "m-015", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
  // Om Hwa & Ci Linda → Adrian (parent)
  { id: "r-023", familyId: "fam-001", fromMemberId: "m-005", toMemberId: "m-016", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
  { id: "r-024", familyId: "fam-001", fromMemberId: "m-014", toMemberId: "m-016", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
  // Ci Linda juga parent Ko Jun & Kev
  { id: "r-025", familyId: "fam-001", fromMemberId: "m-014", toMemberId: "m-008", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
  { id: "r-026", familyId: "fam-001", fromMemberId: "m-014", toMemberId: "m-011", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
  // Menantu (Pasangan Chris & Ko Jun)
  { id: "r-027", familyId: "fam-001", fromMemberId: "m-009", toMemberId: "m-017", relationType: "spouse",
    isMainLine: false, createdAt: new Date() },
  { id: "r-028", familyId: "fam-001", fromMemberId: "m-008", toMemberId: "m-018", relationType: "spouse",
    isMainLine: false, createdAt: new Date() },
  // Cicit (Anak Ko Jun & Stella)
  { id: "r-029", familyId: "fam-001", fromMemberId: "m-008", toMemberId: "m-019", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
  { id: "r-030", familyId: "fam-001", fromMemberId: "m-018", toMemberId: "m-019", relationType: "parent",
    isMainLine: false, createdAt: new Date() },
];

// Access (demo user = admin semua bagan)
export const DEMO_ACCESS = DEMO_FAMILIES.map((f, i) => ({
  id: `acc-00${i + 1}`,
  familyId: f.id,
  userId: DEMO_USER.id,
  role: "admin" as const,
  grantedAt: new Date(),
}));

// Helper functions
export function getDemoFamilies() {
  return DEMO_FAMILIES.map((f) => {
    const memberCount = DEMO_MEMBERS.filter((m) => m.familyId === f.id).length;
    const access = DEMO_ACCESS.find((a) => a.familyId === f.id);
    return { ...f, memberCount, role: access?.role || "viewer" };
  });
}

export function getDemoFamily(familyId: string) {
  return DEMO_FAMILIES.find((f) => f.id === familyId) || null;
}

export function getDemoMembers(familyId: string) {
  return DEMO_MEMBERS.filter((m) => m.familyId === familyId);
}

export function getDemoRelationships(familyId: string) {
  return DEMO_RELATIONSHIPS.filter((r) => r.familyId === familyId);
}

export function getDemoAccess(familyId: string, userId: string) {
  return DEMO_ACCESS.find((a) => a.familyId === familyId && a.userId === userId) || null;
}

export function getDemoMemberRelationships(familyId: string, memberId: string) {
  const rels = DEMO_RELATIONSHIPS.filter(
    (r) =>
      r.familyId === familyId &&
      (r.fromMemberId === memberId || r.toMemberId === memberId)
  );

  return rels.map((r) => {
    const isFrom = r.fromMemberId === memberId;
    const relatedId = isFrom ? r.toMemberId : r.fromMemberId;
    const relatedMember = DEMO_MEMBERS.find((m) => m.id === relatedId)!;

    let relationType = r.relationType;
    let isMainLine = r.isMainLine;
    if (r.relationType === "parent") {
      relationType = isFrom ? "child" : "parent";
    }

    return { id: r.id, relationType, isMainLine, relatedMember };
  });
}

export function searchDemoMembers(query: string) {
  const q = query.toLowerCase();
  return DEMO_MEMBERS.filter(
    (m) =>
      m.fullName.toLowerCase().includes(q) ||
      (m.nickname && m.nickname.toLowerCase().includes(q))
  ).map((m) => ({
    ...m,
    familyName: DEMO_FAMILIES.find((f) => f.id === m.familyId)?.name || "",
  }));
}
