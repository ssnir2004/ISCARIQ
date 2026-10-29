-- One-time: the ISCAR-DEEP-DRILL brand (Solutions, Drilling) with its uses from
-- the ISCAR intranet e-catalog (Hole Making), each family linked to its page;
-- families with the same description share a use. An existing ISCAR-DEEP-DRILL is kept:
-- it gets the application, a description if it has none, and the uses it
-- doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_iscar_deep_drill', 'ISCAR-DEEP-DRILL', 'Drilling', $u$Single and double tube (BTA / ejector) deep drilling with brazed tips or cartridges carrying NPMX and TPMX indexable inserts, plus counterbores and trepanning tools.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARDEEPDRILL')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Single and double tube (BTA / ejector) deep drilling with brazed tips or cartridges carrying NPMX and TPMX indexable inserts, plus counterbores and trepanning tools.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARDEEPDRILL' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'drilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARDEEPDRILL'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_iscar_deep_drill_use_0', $u$Deep Single Tube Drills with External Single Thread Connection and a Brazed Single Tip (8-15 dia.)$u$, $u$Drills$u$, 0, $u$[{"name": "DSD-E0", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2503&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_iscar_deep_drill_use_1', $u$Deep Single Tube Drills with External 2 and 4 Start Thread Connections and a Single Brazed Tip$u$, $u$Drills$u$, 1, $u$[{"name": "DSD-E1", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2504&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_iscar_deep_drill_use_2', $u$Deep Single Tube Drills with External 2 and 4 Start Thread Connections and 2 or 3 Brazed Tips$u$, $u$Drills$u$, 2, $u$[{"name": "DSD-E2/E3", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2505&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_iscar_deep_drill_use_3', $u$Deep Double Tube Drills with External 4 Start Thread Connection and Brazed Tips (18.4-65 dia.)$u$, $u$Drills$u$, 3, $u$[{"name": "DDD-E3", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2511&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_iscar_deep_drill_use_4', $u$Deep Single Tube Drills with External 4-Start Thread Connection and Cartridges (38-292 dia.)$u$, $u$Drills$u$, 4, $u$[{"name": "DSD-EC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2633&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_iscar_deep_drill_use_5', $u$Deep Single Tube Drills with Internal Single-Start Thread Connection and Cartridges (38-292 dia.)$u$, $u$Drills$u$, 5, $u$[{"name": "DSD-IC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2637&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_iscar_deep_drill_use_6', $u$Deep Double Tube Drills with External 4-Start Thread Connection and Cartridges (38-184 dia.)$u$, $u$Drills$u$, 6, $u$[{"name": "DDD-EC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2613&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_iscar_deep_drill_use_7', $u$Deep Single Tube Counterbore with Through Hole, External 4 Start Thread Connection and a Cartridge$u$, $u$Counterbores & trepanning$u$, 7, $u$[{"name": "DSC-EC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2638&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_iscar_deep_drill_use_8', $u$Deep Single Tube Counterbore with a Through Hole, Internal Single Start Thread and a Cartridge$u$, $u$Counterbores & trepanning$u$, 8, $u$[{"name": "DSC-IC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2654&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_iscar_deep_drill_use_9', $u$Deep Single Tube Counterbore with Through Hole, External 4 Start Thread and Adjustable Diameter$u$, $u$Counterbores & trepanning$u$, 9, $u$[{"name": "DSC-EA", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2653&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_iscar_deep_drill_use_10', $u$Deep Single Tube Counterbore with a Through Hole, Internal Single-Start Thread and Adjustable Diameter$u$, $u$Counterbores & trepanning$u$, 10, $u$[{"name": "DSC-IA", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2639&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_iscar_deep_drill_use_11', $u$Double Tube Counterboring Drills with Outer 4-Start Thread, Cartridges and Adjustable Diameter$u$, $u$Counterbores & trepanning$u$, 11, $u$[{"name": "DDC-EA", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4696&mapp=DR&GFSTYP=M"}, {"name": "DDC-EC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4697&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_iscar_deep_drill_use_12', $u$Single Tube Trepanning Drills with Outer 4-Start Thread, Cartridges, and Adjustable Diameter$u$, $u$Counterbores & trepanning$u$, 12, $u$[{"name": "DSTR-EC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4698&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_iscar_deep_drill_use_13', $u$Single Tube Trepanning Drills with Inner Single Start Thread, Cartridges and Adjustable Diameter$u$, $u$Counterbores & trepanning$u$, 13, $u$[{"name": "DSTR-IC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4699&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_iscar_deep_drill_use_14', $u$Inserts for Drilling Heads DSD-EC / DDD-EC / DSD-IC$u$, $u$Inserts$u$, 14, $u$[{"name": "NPMX 0803 RB/RG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2564&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_iscar_deep_drill_use_15', $u$Inserts for Drilling / Counterboring / Trepanning Tools$u$, $u$Inserts$u$, 15, $u$[{"name": "TPMX", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2565&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_iscar_deep_drill_use_16', $u$Inserts for DSD/DSC Drilling/Boring Heads$u$, $u$Inserts$u$, 16, $u$[{"name": "XPMT-UB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2566&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_iscar_deep_drill_use_17', $u$Inserts for DSC Boring Heads$u$, $u$Inserts$u$, 17, $u$[{"name": "XPMT-45", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2683&mapp=DR&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARDEEPDRILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
