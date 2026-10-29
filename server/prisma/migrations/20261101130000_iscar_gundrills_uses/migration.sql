-- One-time: the ISCAR-GUNDRILLS brand (Solutions, Drilling) with its uses from
-- the ISCAR Drilling Handbook (not in the e-catalog, so without links);
-- families with the same description share a use. An existing ISCAR-GUNDRILLS is kept:
-- it gets the application, a description if it has none, and the uses it
-- doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_iscar_gundrills', 'ISCAR-GUNDRILLS', 'Drilling', $u$Gundrills for deep drilling by the gundrill (ELB) method: solid carbide gundrills from 0.9 to 16 mm (flute length up to 300 mm) and brazed tip gundrills from 2.5 to 40 mm (flute length up to 3500 mm); drilling precision IT7 – IT9 with excellent straightness and concentricity.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARGUNDRILLS')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Gundrills for deep drilling by the gundrill (ELB) method: solid carbide gundrills from 0.9 to 16 mm (flute length up to 300 mm) and brazed tip gundrills from 2.5 to 40 mm (flute length up to 3500 mm); drilling precision IT7 – IT9 with excellent straightness and concentricity.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARGUNDRILLS' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'drilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARGUNDRILLS'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_iscar_gundrills_use_0', $u$Standard solid carbide gundrills for 0.9 – 16 mm holes in 0.1 mm steps, for conventional machines, machining centers and lathes$u$, $u$Solid carbide gundrills$u$, 0, $u$[{"name": "STCGD"}]$u$::jsonb),
  ('innovation_iscar_gundrills_use_1', $u$Semi-standard solid carbide gundrills (choice of driver, head profile and polish / rough finish)$u$, $u$Solid carbide gundrills$u$, 1, $u$[{"name": "CGD"}]$u$::jsonb),
  ('innovation_iscar_gundrills_use_2', $u$Special solid carbide gundrills to drawing$u$, $u$Solid carbide gundrills$u$, 2, $u$[{"name": "SPCGD"}]$u$::jsonb),
  ('innovation_iscar_gundrills_use_3', $u$Standard brazed tip gundrills for 2.5 – 20 mm holes in 0.1 mm steps and 20 – 40 mm in 1 mm steps$u$, $u$Brazed tip gundrills$u$, 3, $u$[{"name": "STGD"}]$u$::jsonb),
  ('innovation_iscar_gundrills_use_4', $u$Semi-standard brazed tip gundrills (choice of driver, head profile and polish / rough finish)$u$, $u$Brazed tip gundrills$u$, 4, $u$[{"name": "GD"}]$u$::jsonb),
  ('innovation_iscar_gundrills_use_5', $u$Special brazed tip gundrills to drawing$u$, $u$Brazed tip gundrills$u$, 5, $u$[{"name": "SPGD"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARGUNDRILLS'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
