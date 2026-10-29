-- One-time: the MULTI-MASTER brand (Solutions, Drilling) with its uses from
-- the ISCAR intranet e-catalog (Hole Making), each family linked to its page;
-- families with the same description share a use. An existing MULTI-MASTER is kept:
-- it gets the application, a description if it has none, and the uses it
-- doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_multi_master_drill', 'MULTI-MASTER', 'Drilling', $u$Interchangeable solid carbide heads on MULTI-MASTER shanks for spot and center drilling, chamfering, countersinking, counterboring and drilling.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MULTIMASTER')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Interchangeable solid carbide heads on MULTI-MASTER shanks for spot and center drilling, chamfering, countersinking, counterboring and drilling.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MULTIMASTER' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'drilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MULTIMASTER'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_multi_master_drill_use_0', $u$NC Spot Drills for Accurate Hole Location without the need for a Bushing Guide.$u$, $u$Spot & center drilling$u$, 0, $u$[{"name": "MM ECD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3501&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_multi_master_drill_use_1', $u$Interchangeable 2 Flute Solid Carbide Heads for Chamfering, Countersinking and Spot Drilling$u$, $u$Spot & center drilling$u$, 1, $u$[{"name": "MM HCD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1615&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_multi_master_drill_use_2', $u$Interchangeable Solid Carbide Centering Drills (DIN 332)$u$, $u$Spot & center drilling$u$, 2, $u$[{"name": "MM ECS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2658&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_multi_master_drill_use_3', $u$Interchangeable Solid Carbide Heads for Chamfering and Countersinking$u$, $u$Chamfering & counterboring$u$, 3, $u$[{"name": "MM ECF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1736&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_multi_master_drill_use_4', $u$Interchangeable 3 Flute Solid Carbide Heads for Upper and Bottom Chamfering$u$, $u$Chamfering & counterboring$u$, 4, $u$[{"name": "MM EDF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2895&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_multi_master_drill_use_5', $u$Interchangeable 4 Flute 30° Helix Solid Carbide Heads for Flat Counter Boring$u$, $u$Chamfering & counterboring$u$, 5, $u$[{"name": "MM EFCB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3641&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_multi_master_drill_use_6', $u$MULTI-MASTER Exchangeable Solid Carbide Flat Bottom Drill Heads$u$, $u$Drilling$u$, 6, $u$[{"name": "MM ECDF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4684&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_multi_master_drill_use_7', $u$Three-Flute Exchangeable Solid Carbide Drilling Heads$u$, $u$Drilling$u$, 7, $u$[{"name": "MM SPD-3T", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5148&mapp=DR&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MULTIMASTER'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
