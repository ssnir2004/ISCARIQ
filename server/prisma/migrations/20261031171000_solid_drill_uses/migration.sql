-- One-time: the SOLID-DRILL brand (Solutions, Drilling) with its uses from
-- the ISCAR intranet e-catalog (Hole Making), each family linked to its page;
-- families with the same description share a use. An existing SOLID-DRILL is kept:
-- it gets the application, a description if it has none, and the uses it
-- doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_solid_drill', 'SOLID-DRILL', 'Drilling', $u$Precision ground solid carbide drills: general purpose (DIN 6537, with or without coolant), three flute, deep hole up to 50xD, composites (PCD / CVD), pre-thread and chamfering / spot drilling tools.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDDRILL')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Precision ground solid carbide drills: general purpose (DIN 6537, with or without coolant), three flute, deep hole up to 50xD, composites (PCD / CVD), pre-thread and chamfering / spot drilling tools.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDDRILL' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'drilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDDRILL'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_solid_drill_use_0', $u$DIN 6537 Solid Carbide Drills without Coolant Holes, Drilling Depth 3xD$u$, $u$General purpose drills$u$, 0, $u$[{"name": "SCD-AP3 (3xD)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1699&mapp=DR&GFSTYP=M"}, {"name": "SCD-AP3N (3xD)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4008&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_1', $u$DIN 6537 Solid Carbide Drills without Coolant Holes, Drilling Depth 4xD$u$, $u$General purpose drills$u$, 1, $u$[{"name": "SCD-AP4 (4xD)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1924&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_2', $u$DIN 6537 Solid Carbide Drills without Coolant Holes, Drilling Depth 6xD$u$, $u$General purpose drills$u$, 2, $u$[{"name": "SCD-AP6 (6xD)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2168&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_3', $u$Solid Carbide Drills with Coolant Holes, Drilling Depth 5xD$u$, $u$General purpose drills$u$, 3, $u$[{"name": "SCD-ACP5 (5xD)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2951&mapp=DR&GFSTYP=M"}, {"name": "SCD-ACP5N (1.0-2.9)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5626&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_4', $u$Solid Carbide Drills without Coolant Holes, Drilling Depth 5xD$u$, $u$General purpose drills$u$, 4, $u$[{"name": "SCD-AP5 (5xD)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2953&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_5', $u$DIN 6537 Solid Carbide Drills without Coolant Holes, Drilling Depth 5xD$u$, $u$General purpose drills$u$, 5, $u$[{"name": "SCD-AP5N (5xD)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4009&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_6', $u$DIN 6537 Solid Carbide Drills with Coolant Holes, Drilling Depth 5xD$u$, $u$General purpose drills$u$, 6, $u$[{"name": "SCD-ACP5N (5xD)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4010&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_7', $u$DIN 6537 Solid Carbide Drills with Coolant Holes, Drilling Depth 3xD$u$, $u$General purpose drills$u$, 7, $u$[{"name": "SCD-ACP3N (3XD)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4011&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_8', $u$Solid Carbide Drills with Coolant Holes, Drilling Depth 8xD$u$, $u$General purpose drills$u$, 8, $u$[{"name": "SCD-ACP8N (8xD)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4365&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_9', $u$Solid Carbide Drills with Coolant Holes, Drilling Depth 3xD (Available in North America Only)$u$, $u$General purpose drills$u$, 9, $u$[{"name": "SCD-ACP3FL (3XD)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4713&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_10', $u$Solid Carbide Drills with Coolant Holes, Drilling Depth 5xD (Available in North America Only)$u$, $u$General purpose drills$u$, 10, $u$[{"name": "SCD-ACP5FL (5XD)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4714&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_11', $u$Solid Carbide Drills with Coolant Holes, Drilling Depth 8xD (Available in North America Only)$u$, $u$General purpose drills$u$, 11, $u$[{"name": "SCD-ACP8FL (8XD)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5130&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_12', $u$Solid Carbide Drills with Coolant Holes, Point Angle 150DEG. Drilling Depth 5xD$u$, $u$General purpose drills$u$, 12, $u$[{"name": "SCD-PXC05 (5XD)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5556&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_13', $u$Solid Carbide Drills with Coolant Holes, Drilling Depth 3xD$u$, $u$General purpose drills$u$, 13, $u$[{"name": "SCD-ACP3N (1.0-2.9)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5625&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_14', $u$Three Flute Solid Carbide Drills with Coolant Holes, Drilling Depth 3xD$u$, $u$Three flute drills$u$, 14, $u$[{"name": "SCCD-ACP3", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4589&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_15', $u$Three Flute Solid Carbide Drills with Coolant Holes, Drilling Depth 5xD$u$, $u$Three flute drills$u$, 15, $u$[{"name": "SCCD-ACP5", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4590&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_16', $u$Three Flute Solid Carbide Flat Head Drills with Coolant Holes, Drilling Depth 3xD$u$, $u$Three flute drills$u$, 16, $u$[{"name": "SCCD-ACF3", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5069&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_17', $u$Three Flute Solid Carbide Flat Head Drills with Coolant Holes, Drilling Depth 5xD$u$, $u$Three flute drills$u$, 17, $u$[{"name": "SCCD-ACF5", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5070&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_18', $u$Solid Carbide Drills with Internal Coolant Channels, Drilling Depth 30xD$u$, $u$Deep hole drills$u$, 18, $u$[{"name": "SCD-SXC30", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4598&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_19', $u$Solid Carbide Drills with Internal Coolant Channels, Drilling Depth 40xD$u$, $u$Deep hole drills$u$, 19, $u$[{"name": "SCD-SXC40", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4599&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_20', $u$Solid Carbide Drills with Internal Coolant Channels, Drilling Depth 50xD$u$, $u$Deep hole drills$u$, 20, $u$[{"name": "SCD-SXC50", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4600&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_21', $u$Solid Carbide Drills with Internal Coolant Channels, Drilling Depth 16xD$u$, $u$Deep hole drills$u$, 21, $u$[{"name": "SCD-SXC16", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4725&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_22', $u$Solid Carbide Drills with Internal Coolant Channels, Drilling Depth 20xD$u$, $u$Deep hole drills$u$, 22, $u$[{"name": "SCD-SXC20", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4726&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_23', $u$Solid Carbide Drills with Internal Coolant Channels, Drilling Depth 16xD, for Machining ISO K Materials$u$, $u$Deep hole drills$u$, 23, $u$[{"name": "SCD-IXC16", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5208&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_24', $u$Solid Carbide Drills with Internal Coolant Channels, Drilling Depth 20xD, for Machining ISO K Materials$u$, $u$Deep hole drills$u$, 24, $u$[{"name": "SCD-IXC20", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5210&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_25', $u$Solid Carbide Drills with Internal Coolant Channels, Drilling Depth 30xD, for Machining ISO K Materials$u$, $u$Deep hole drills$u$, 25, $u$[{"name": "SCD-IXC30", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5211&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_26', $u$Solid Carbide Drills with PCD Full Nib Insert for Composite Materials (CFRP) and Stack Machining$u$, $u$Composite materials$u$, 26, $u$[{"name": "SCD-FNPCD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4559&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_27', $u$Solid Carbide Drills with PCD Insert for Composite Materials (CFRP) and Stack Machining$u$, $u$Composite materials$u$, 27, $u$[{"name": "SCD-WPCD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4563&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_28', $u$Solid Carbide Drills with CVD Coating for Composite Materials (CFRP) and Stack Machining$u$, $u$Composite materials$u$, 28, $u$[{"name": "SCD-CVD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4565&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_29', $u$Solid Carbide Drills for Hard Materials, Drilling Depth 5xD$u$, $u$Special drills$u$, 29, $u$[{"name": "SCD-AH5 (5xD)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2267&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_30', $u$Pre-Thread Solid Carbide Drills with Coolant Holes$u$, $u$Special drills$u$, 30, $u$[{"name": "SCDT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2702&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_31', $u$Chamfering and Spot Drilling Solid Carbide Tools$u$, $u$Special drills$u$, 31, $u$[{"name": "ECD-S2", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3648&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_solid_drill_use_32', $u$Solid Carbide Drills for Swiss and Small CNC Machines$u$, $u$Special drills$u$, 32, $u$[{"name": "SCD-PICCO 3D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5214&mapp=DR&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDDRILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
