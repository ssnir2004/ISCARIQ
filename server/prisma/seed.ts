import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const BRANCHES = [
  "Brasil", "China", "France", "Germany", "Hungary", "India", "Korea",
  "Mexico", "Poland", "Romania", "Slovak Republic", "Slovenia", "Sweden",
  "Thailand", "Turkey", "USA",
];

const DEPARTMENTS: Record<string, string> = {
  "01": "Grip / Cut-Off",
  "04": "Hole Making",
  "05": "Specials",
  "13": "ISO Turning",
  "14": "Solid Carbide / Endmill",
  "15": "Threading",
  "16": "Non-Rotating Innovation",
  "75": "Radial / Heli Mill",
  "77": "Slotting",
  "79": "Die & Mold / Tangential",
  "90": "Standard & Special Tool Systems",
  "M82": "Zurim Specials",
  "GIL": "Innovation",
};

const TEAMS: { group: string; code: string; description: string; isManager?: boolean }[] = [
  { group: "01", code: "EG0", description: "ASAF-GRIP", isManager: true },
  { group: "01", code: "EG2", description: "NADER-FACE" },
  { group: "01", code: "EG3", description: "SERGEY-DEVELOPEMENT GRIP 1" },
  { group: "01", code: "EG4", description: "YONATAN-CUT OFF" },
  { group: "01", code: "EG5", description: "OFIR-CUT GRIP 1 (Face Grooving)" },
  { group: "01", code: "EG6", description: "SEMION-PENTA&SC" },
  { group: "01", code: "EG9", description: "AVRAHMI-CUT GRIP 2" },
  { group: "04", code: "EH0", description: "SHIMON-HOLE MAKING", isManager: true },
  { group: "04", code: "EH1", description: "HITHAM-DEVELOP & STD" },
  { group: "04", code: "EH2", description: "ELI-SOLID, INDEXABLE INSERTS" },
  { group: "04", code: "EH4", description: "EYAL-REAMING" },
  { group: "04", code: "EH6", description: "ANAT-DEVELOP & 3D PRINTING" },
  { group: "05", code: "ESC", description: "SPECIALS GENERAL PROCESS" },
  { group: "05", code: "ESG", description: "SERGEI-CAR INDUSTRY SP. TOOLS" },
  { group: "05", code: "ES0", description: "MARK-SPECIALS", isManager: true },
  { group: "05", code: "ES1", description: "YULIA-TURN & DRILL SP. TOOLS A" },
  { group: "05", code: "ES2", description: "SAGI-ROTATING SP. TOOLS A" },
  { group: "05", code: "ES3", description: "OMRI-WERTEC SUPPORT&ROTATIG SP" },
  { group: "05", code: "ES6", description: "MICHAEL-MEDICAL,MINI,GMBH" },
  { group: "05", code: "ES7", description: "GELFOND-MTB,DRILLING" },
  { group: "05", code: "ES9", description: "AVI-AEROSPACE&POWER GN" },
  { group: "13", code: "EI0", description: "MEIR-ISO TURN", isManager: true },
  { group: "13", code: "EI1", description: "VICTOR ISO TURN INSERT (WAS ES3)" },
  { group: "13", code: "EI2", description: "GRIGORY-ISO TOOLS (WAS ES4)" },
  { group: "13", code: "EI5", description: "TURN-ISO TOOLS&INSERTS" },
  { group: "14", code: "ER0", description: "ALEX-SOLID CARBID", isManager: true },
  { group: "14", code: "ER1", description: "SHPIGELMAN-S.CARBID(+YG1)" },
  { group: "14", code: "ER2", description: "VDOV-MULTI MASTER ENDMILL" },
  { group: "14", code: "ER3", description: "BUDDA-SPECIAL ENDMILL" },
  { group: "14", code: "ER4", description: "MISHA - MULTIMASTER" },
  { group: "15", code: "ED0", description: "OREN-THREADING APL." },
  { group: "15", code: "ED1", description: "SERGEY-ROTATING APL." },
  { group: "15", code: "ED2", description: "ELAD-NONROTATING APL." },
  { group: "16", code: "EO0", description: "ATHAD-NONROTATE INNOVATION D.M" },
  { group: "75", code: "MR0", description: "KOIFMAN-RADIAL", isManager: true },
  { group: "75", code: "MR1", description: "LEONID-HELI MILL/HELI ALU" },
  { group: "75", code: "MR2", description: "BRONSHTEYN-16 MILL" },
  { group: "75", code: "MR3", description: "EVGENY-CLAMP ARM" },
  { group: "75", code: "MR5", description: "ALEX LEVIT RADIAL INSERT" },
  { group: "77", code: "MS1", description: "YARON-SLOTTING CUTTERS" },
  { group: "79", code: "MP1", description: "TALAL-DIE MOLD" },
  { group: "79", code: "MP2", description: "CLOSED (WAS ALEX L.) POWER ENERGY" },
  { group: "79", code: "MT0", description: "DAGAN-TANG&PROFILE", isManager: true },
  { group: "79", code: "MT2", description: "OSAMA-TANGMILL" },
  { group: "90", code: "ME1", description: "NO T.L" },
  { group: "90", code: "ME2", description: "ELENA-STD.&SPEC. TOOL SYS" },
  { group: "90", code: "ME3", description: "LIOR DEV.&BORIN" },
  { group: "M82", code: "ZT0", description: "SHLOMO-ZURIM SPECIALS", isManager: true },
  { group: "M82", code: "ZT1", description: "YURI-ZURIM SPECIALS A" },
  { group: "M82", code: "ZT2", description: "EYVGENI-ZURIM SPECIALS B" },
  { group: "GIL", code: "EN0", description: "GIL-INNOVATION", isManager: true },
];

const ISO513_MATERIALS: { group: "P" | "M" | "K" | "N" | "S" | "H"; name: string; description: string }[] = [
  { group: "P", name: "Steel", description: "Unalloyed and low/high-alloy steel, steel castings" },
  { group: "M", name: "Stainless Steel", description: "Ferritic, austenitic, duplex stainless steels" },
  { group: "K", name: "Cast Iron", description: "Grey, nodular, malleable cast iron" },
  { group: "N", name: "Non-Ferrous", description: "Aluminum, copper, brass, other non-ferrous metals" },
  { group: "S", name: "Superalloys / Titanium", description: "Heat-resistant superalloys and titanium alloys" },
  { group: "H", name: "Hardened Materials", description: "Hardened steel and chilled cast iron (>45 HRC)" },
];

const PROBLEM_TAGS = [
  "Chip breaking",
  "Soft steel wear (built-up edge)",
  "Welded-zone wear",
  "Built-up edge",
  "Poor surface finish",
  "Notch wear",
  "Thermal cracking",
  "Flank wear",
];

// Schaeffler plants worldwide, from the company's plant map reference.
// x/y are approximate percentage positions on a schematic (non-geographic)
// canvas — fine-tune by dragging the pin on the Plants Map screen.
const PLANTS: {
  name: string;
  regionCode: string;
  specialties: string;
  mapView: "WORLD" | "GERMANY";
  x: number;
  y: number;
}[] = [
  { name: "Brasov", regionCode: "RO", specialties: "Large bearings\nBearings\nEngine components\nLinear components", mapView: "WORLD", x: 54, y: 30 },
  { name: "Haguenau", regionCode: "FR", specialties: "Engine components\nBearings\nLinear components", mapView: "WORLD", x: 46, y: 26 },
  { name: "Skalica", regionCode: "SK", specialties: "Roller bearings\nLinear components\nEngine components\nCages", mapView: "WORLD", x: 54, y: 18 },
  { name: "Kysuce", regionCode: "SK", specialties: "Ball bearings\nWheelbearings\nEngine components", mapView: "WORLD", x: 68, y: 34 },
  { name: "Taicang", regionCode: "CN", specialties: "Clutches\nTransmission components\nEngine components\nWheelbearings\nToolshop", mapView: "WORLD", x: 88, y: 44 },
  { name: "Nanjing", regionCode: "CN", specialties: "Large bearings\nBearings", mapView: "WORLD", x: 76, y: 28 },
  { name: "Cheraw & Fort Mill", regionCode: "US", specialties: "Bearings\nEngine components", mapView: "WORLD", x: 20, y: 36 },
  { name: "Stratford", regionCode: "CN", specialties: "Wheelbearings\nAerospace\nBearings", mapView: "WORLD", x: 92, y: 20 },
  { name: "Sorocaba", regionCode: "BR", specialties: "Clutches\nTransmission components\nEngine components\nBearings", mapView: "WORLD", x: 32, y: 74 },
  { name: "Puebla", regionCode: "MX", specialties: "Clutches\nTransmission components", mapView: "WORLD", x: 15, y: 50 },
  { name: "Irapuato", regionCode: "MX", specialties: "Wheelbearings\nEngine components\nBearings", mapView: "WORLD", x: 10, y: 44 },

  { name: "Wuppertal", regionCode: "NW", specialties: "Roller bearings\nLarge bearings", mapView: "GERMANY", x: 25, y: 25 },
  { name: "Magdeburg", regionCode: "ST", specialties: "Engine components", mapView: "GERMANY", x: 55, y: 15 },
  { name: "Schweinfurt", regionCode: "BY", specialties: "Roller bearings\nFAG headquater", mapView: "GERMANY", x: 58, y: 35 },
  { name: "Hirschaid", regionCode: "BY", specialties: "Engine components", mapView: "GERMANY", x: 75, y: 42 },
  { name: "Höchstadt", regionCode: "BY", specialties: "Bearings\nPlastics", mapView: "GERMANY", x: 60, y: 52 },
  { name: "Herzogenaurach", regionCode: "BY", specialties: "Engine components\nSteering components\nBearings\nToolshop\nINA headquater\nCorporate headquater", mapView: "GERMANY", x: 78, y: 58 },
  { name: "Ingolstadt", regionCode: "BY", specialties: "Engine Components\nBearings", mapView: "GERMANY", x: 55, y: 72 },
  { name: "Homburg", regionCode: "SL", specialties: "Engine components\nLinear components\nBearings", mapView: "GERMANY", x: 15, y: 60 },
  { name: "Lahr", regionCode: "BW", specialties: "Engine components\nBearings", mapView: "GERMANY", x: 22, y: 78 },
  { name: "Bühl", regionCode: "BW", specialties: "Clutches\nTransmission components\nToolshop\nLuK headquater", mapView: "GERMANY", x: 38, y: 75 },
];

async function main() {
  await prisma.branch.createMany({
    data: BRANCHES.map((name) => ({ name })),
    skipDuplicates: true,
  });

  for (const [code, name] of Object.entries(DEPARTMENTS)) {
    await prisma.department.upsert({
      where: { code },
      update: { name },
      create: { code, name },
    });
  }

  for (const t of TEAMS) {
    const department = await prisma.department.findUniqueOrThrow({ where: { code: t.group } });
    await prisma.team.upsert({
      where: { code: t.code },
      update: {
        description: t.description,
        isManager: !!t.isManager,
        departmentId: department.id,
      },
      create: {
        code: t.code,
        description: t.description,
        isManager: !!t.isManager,
        departmentId: department.id,
      },
    });
  }

  for (const m of ISO513_MATERIALS) {
    await prisma.material.upsert({
      where: { id: `iso513-${m.group}` },
      update: { iso513Group: m.group, name: m.name, description: m.description },
      create: { id: `iso513-${m.group}`, iso513Group: m.group, name: m.name, description: m.description },
    });
  }

  for (const name of PROBLEM_TAGS) {
    await prisma.problemTag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  for (const p of PLANTS) {
    await prisma.plant.upsert({
      where: { name: p.name },
      update: { regionCode: p.regionCode, specialties: p.specialties, mapView: p.mapView, x: p.x, y: p.y },
      create: p,
    });
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "nirc@iscar.co.il";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "changeme123";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
    },
  });

  console.log("Seed complete.");
  console.log(`Admin login: ${adminEmail} / ${adminPassword} (change this!)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
