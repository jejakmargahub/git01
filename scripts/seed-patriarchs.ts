import { db } from "../src/lib/db";
import { families, familyMembers, relationships } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const userId = "45d37a3b-1a2a-455d-ab4b-08886d89acec"; // christian.kontak@gmail.com
  const familyName = "Silsilah Para Patriark Keturunan Guru";

  console.log("Creating family...");
  const [newFamily] = await db.insert(families).values({
    name: familyName,
    createdBy: userId,
    familyType: "spiritual",
    description: "Silsilah spiritual para Patriark dari India hingga Tiongkok (Masa Pancaran Hijau, Merah, dan Putih).",
    settings: { 
      mobileOrientation: "vertical",
      showGoldenThread: true,
      goldenThreadColor: "#FFD700"
    }
  }).returning();

  console.log(`Family created with ID: ${newFamily.id}`);

  // Data Patriark India (P1 - P27)
  const indiaPatriarchs = [
    { fullName: "Maha Kasyapa", nickname: "Kasyapa", mandarinName: "摩訶迦葉", gender: "M", metadata: { title: "Patriark ke-1 India", lineage: "India", period: "Zaman Buddha Sakyamuni" } },
    { fullName: "Ananda", nickname: "Ananda", mandarinName: "阿難", gender: "M", metadata: { title: "Patriark ke-2 India", lineage: "India" } },
    { fullName: "Sanavasa", nickname: "Sanavasa", mandarinName: "商那和修", gender: "M", metadata: { title: "Patriark ke-3 India", lineage: "India" } },
    { fullName: "Upagupta", nickname: "Upagupta", mandarinName: "優波崛多", gender: "M", metadata: { title: "Patriark ke-4 India", lineage: "India" } },
    { fullName: "Dhritaka", nickname: "Dhritaka", mandarinName: "提多迦", gender: "M", metadata: { title: "Patriark ke-5 India", lineage: "India" } },
    { fullName: "Micchaka", nickname: "Micchaka", mandarinName: "彌遮迦", gender: "M", metadata: { title: "Patriark ke-6 India", lineage: "India" } },
    { fullName: "Vasumitra", nickname: "Vasumitra", mandarinName: "婆須蜜多", gender: "M", metadata: { title: "Patriark ke-7 India", lineage: "India" } },
    { fullName: "Buddhanandi", nickname: "Buddhanandi", mandarinName: "佛陀難提", gender: "M", metadata: { title: "Patriark ke-8 India", lineage: "India" } },
    { fullName: "Buddhamitra", nickname: "Buddhamitra", mandarinName: "佛陀蜜多", gender: "M", metadata: { title: "Patriark ke-9 India", lineage: "India" } },
    { fullName: "Parsva", nickname: "Parsva", mandarinName: "脅尊者", gender: "M", metadata: { title: "Patriark ke-10 India", lineage: "India" } },
    { fullName: "Punyayasas", nickname: "Punyayasas", mandarinName: "富那夜奢", gender: "M", metadata: { title: "Patriark ke-11 India", lineage: "India" } },
    { fullName: "Asvaghosa", nickname: "Asvaghosa", mandarinName: "馬鳴", gender: "M", metadata: { title: "Patriark ke-12 India", lineage: "India" } },
    { fullName: "Kapimala", nickname: "Kapimala", mandarinName: "迦毗摩羅", gender: "M", metadata: { title: "Patriark ke-13 India", lineage: "India" } },
    { fullName: "Nagarjuna", nickname: "Nagarjuna", mandarinName: "龍樹", gender: "M", metadata: { title: "Patriark ke-14 India", lineage: "India" } },
    { fullName: "Kanadeva", nickname: "Kanadeva", mandarinName: "迦那提婆", gender: "M", metadata: { title: "Patriark ke-15 India", lineage: "India" } },
    { fullName: "Rahulata", nickname: "Rahulata", mandarinName: "羅睺羅多", gender: "M", metadata: { title: "Patriark ke-16 India", lineage: "India" } },
    { fullName: "Sanghanandi", nickname: "Sanghanandi", mandarinName: "僧伽難提", gender: "M", metadata: { title: "Patriark ke-17 India", lineage: "India" } },
    { fullName: "Gayasata", nickname: "Gayasata", mandarinName: "伽耶舍多", gender: "M", metadata: { title: "Patriark ke-18 India", lineage: "India" } },
    { fullName: "Kumarata", nickname: "Kumarata", mandarinName: "鳩摩羅多", gender: "M", metadata: { title: "Patriark ke-19 India", lineage: "India" } },
    { fullName: "Jayata", nickname: "Jayata", mandarinName: "闍夜多", gender: "M", metadata: { title: "Patriark ke-20 India", lineage: "India" } },
    { fullName: "Vasubandhu", nickname: "Vasubandhu", mandarinName: "世親", gender: "M", metadata: { title: "Patriark ke-21 India", lineage: "India" } },
    { fullName: "Manorhita", nickname: "Manorhita", mandarinName: "摩奴羅", gender: "M", metadata: { title: "Patriark ke-22 India", lineage: "India" } },
    { fullName: "Haklena", nickname: "Haklena", mandarinName: "鶴勒那", gender: "M", metadata: { title: "Patriark ke-23 India", lineage: "India" } },
    { fullName: "Simha", nickname: "Simha", mandarinName: "師子", gender: "M", metadata: { title: "Patriark ke-24 India", lineage: "India" } },
    { fullName: "Basiasita", nickname: "Basiasita", mandarinName: "婆舍斯多", gender: "M", metadata: { title: "Patriark ke-25 India", lineage: "India" } },
    { fullName: "Punyamitra", nickname: "Punyamitra", mandarinName: "不如蜜多", gender: "M", metadata: { title: "Patriark ke-26 India", lineage: "India" } },
    { fullName: "Prajnatara", nickname: "Prajnatara", mandarinName: "般若多羅", gender: "M", metadata: { title: "Patriark ke-27 India", lineage: "India" } },
  ];

  // Data Patriark Timur (Tiongkok)
  const chinaPatriarchs = [
    { fullName: "Bodhidharma", nickname: "Da Mo Zu Shi", mandarinName: "菩提達磨", gender: "M", metadata: { title: "Patriark ke-1 Timur / ke-28 India", lineage: "Tiongkok", period: "Dinasti Liang" } },
    { fullName: "Shen Guang", nickname: "Hui Ke", mandarinName: "神光 (慧可)", gender: "M", metadata: { title: "Patriark ke-2 Timur", lineage: "Tiongkok" } },
    { fullName: "Seng Can", nickname: "Seng Can", mandarinName: "僧燦", gender: "M", metadata: { title: "Patriark ke-3 Timur", lineage: "Tiongkok", notes: "Karya: Xinxin Ming" } },
    { fullName: "Dao Xin", nickname: "Dao Xin", mandarinName: "道信", gender: "M", metadata: { title: "Patriark ke-4 Timur", lineage: "Tiongkok" } },
    { fullName: "Hong Ren", nickname: "Hong Ren", mandarinName: "弘忍", gender: "M", metadata: { title: "Patriark ke-5 Timur", lineage: "Tiongkok", notes: "Mempopulerkan Sutra Intan" } },
    { fullName: "Hui Neng", nickname: "Hui Neng", mandarinName: "惠能", gender: "M", metadata: { title: "Patriark ke-6 Timur", lineage: "Tiongkok", notes: "Patriark terakhir yang menjabat secara terbuka di biara" } },
    { fullName: "Bai Yu Chan", nickname: "Bai Yu Chan", mandarinName: "白玉蟾", gender: "M", metadata: { title: "Patriark ke-7 Timur (bersama)", lineage: "Tiongkok" } },
    { fullName: "Ma Dao Yang", nickname: "Ma Dao Yang", mandarinName: "馬道陽", gender: "M", metadata: { title: "Patriark ke-7 Timur (bersama)", lineage: "Tiongkok" } },
    { fullName: "Luo Wei Qun", nickname: "Luo Wei Qun", mandarinName: "羅蔚群", gender: "M", metadata: { title: "Patriark ke-8 Timur", lineage: "Tiongkok", notes: "Memulai penyebaran di kalangan awam" } },
    { fullName: "Huang De Hui", nickname: "Huang De Hui", mandarinName: "黃德輝", gender: "M", metadata: { title: "Patriark ke-9 Timur", lineage: "Tiongkok", notes: "Menyusun landasan organisasi Xiantiandao" } },
    { fullName: "Wu Zi Xiang", nickname: "Wu Zi Xiang", mandarinName: "吳子祥", gender: "M", metadata: { title: "Patriark ke-10 Timur", lineage: "Tiongkok" } },
    { fullName: "He Ru Lin", nickname: "He Ru Lin", mandarinName: "何若霖", gender: "M", metadata: { title: "Patriark ke-11 Timur", lineage: "Tiongkok", notes: "Dikenal karena kesederhanaan" } },
    { fullName: "Yuan Tui An", nickname: "Yuan Tui An", mandarinName: "袁退庵", gender: "M", metadata: { title: "Patriark ke-12 Timur", lineage: "Tiongkok" } },
    { fullName: "Xu Huan Wu", nickname: "Xu Huan Wu", mandarinName: "徐還無", gender: "M", metadata: { title: "Patriark ke-13 Timur", lineage: "Tiongkok" } },
    { fullName: "Yao He Tian", nickname: "Yao He Tian", mandarinName: "姚鶴天", gender: "M", metadata: { title: "Patriark ke-14 Timur", lineage: "Tiongkok" } },
    { fullName: "Wang Jue Yi", nickname: "Wang Jue Yi", mandarinName: "王覺一", gender: "M", metadata: { title: "Patriark ke-15 Timur", lineage: "Tiongkok", notes: "Reformis, menyatukan tiga ajaran" } },
    { fullName: "Liu Qing Xu", nickname: "Liu Qing Xu", mandarinName: "劉清虛", gender: "M", metadata: { title: "Patriark ke-16 Timur", lineage: "Tiongkok", notes: "Sesepuh terakhir di masa Pancaran Merah" } },
    { fullName: "Lu Zhong Yi", nickname: "Jingong Zushi", mandarinName: "路中一 (金公祖師)", gender: "M", metadata: { title: "Patriark ke-17 Timur", lineage: "Tiongkok", notes: "Guru pertama di masa Pancaran Putih, gelar Jingong Zushi" } },
  ];

  const allMembers = [...indiaPatriarchs, ...chinaPatriarchs];
  const memberMap = new Map();

  console.log("Inserting members...");
  for (const mData of allMembers) {
    const [member] = await db.insert(familyMembers).values({
      familyId: newFamily.id,
      fullName: mData.fullName,
      nickname: mData.nickname,
      mandarinName: mData.mandarinName,
      gender: mData.gender as "M" | "F",
      metadata: mData.metadata,
      birthDate: null,
      deathDate: null,
    }).returning();
    memberMap.set(mData.fullName, member.id);
  }

  console.log("Creating relationships...");
  const relationsToCreate = [];

  // India Lineage (Linear)
  for (let i = 0; i < indiaPatriarchs.length - 1; i++) {
    relationsToCreate.push({
      from: indiaPatriarchs[i].fullName,
      to: indiaPatriarchs[i + 1].fullName,
      type: "spiritual_parent",
      isMain: true
    });
  }

  // India P27 to China P1 (Bodhidharma)
  relationsToCreate.push({
    from: "Prajnatara",
    to: "Bodhidharma",
    type: "spiritual_parent",
    isMain: true
  });

  // China Lineage (Linear up to P6)
  const lineToP6 = chinaPatriarchs.slice(0, 6);
  for (let i = 0; i < lineToP6.length - 1; i++) {
    relationsToCreate.push({
      from: lineToP6[i].fullName,
      to: lineToP6[i + 1].fullName,
      type: "spiritual_parent",
      isMain: true
    });
  }

  // P6 (Hui Neng) to P7s (Bai Yu Chan & Ma Dao Yang)
  relationsToCreate.push({ from: "Hui Neng", to: "Bai Yu Chan", type: "spiritual_parent", isMain: false });
  relationsToCreate.push({ from: "Hui Neng", to: "Ma Dao Yang", type: "spiritual_parent", isMain: false });

  // P7s to P8 (Luo Wei Qun)
  relationsToCreate.push({ from: "Bai Yu Chan", to: "Luo Wei Qun", type: "spiritual_parent", isMain: false });
  relationsToCreate.push({ from: "Ma Dao Yang", to: "Luo Wei Qun", type: "spiritual_parent", isMain: false });

  // P8 to P17 (Linear)
  const lineP8toP17 = chinaPatriarchs.slice(8);
  for (let i = 0; i < lineP8toP17.length - 1; i++) {
    relationsToCreate.push({
      from: lineP8toP17[i].fullName,
      to: lineP8toP17[i + 1].fullName,
      type: "spiritual_parent",
      isMain: true
    });
  }

  for (const rel of relationsToCreate) {
    const fromId = memberMap.get(rel.from);
    const toId = memberMap.get(rel.to);
    if (fromId && toId) {
      await db.insert(relationships).values({
        familyId: newFamily.id,
        fromMemberId: fromId,
        toMemberId: toId,
        relationType: rel.type,
        isMainLine: rel.isMain
      });
    } else {
      console.warn(`Could not find member for relation: ${rel.from} -> ${rel.to}`);
    }
  }

  console.log("Seeding complete!");
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
