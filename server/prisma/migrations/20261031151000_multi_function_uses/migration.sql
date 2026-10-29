-- One-time: the MULTI-FUNCTION TOOLS brand (Solutions, Drilling) with its uses from
-- the ISCAR intranet e-catalog (Hole Making), each family linked to its page;
-- families with the same description share a use. An existing MULTI-FUNCTION TOOLS is kept:
-- it gets the application, a description if it has none, and the uses it
-- doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_multi_function_tools', 'MULTI-FUNCTION TOOLS', 'Drilling', $u$Versatile tools for complete machining on CNC machining centers: one DRG-MF tool (XCMT inserts) or PICCO-MF solid carbide tool drills, bores, turns, faces and grooves (PICCO-MFT also threads).$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MULTIFUNCTIONTOOLS')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Versatile tools for complete machining on CNC machining centers: one DRG-MF tool (XCMT inserts) or PICCO-MF solid carbide tool drills, bores, turns, faces and grooves (PICCO-MFT also threads).$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MULTIFUNCTIONTOOLS' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'drilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MULTIFUNCTIONTOOLS'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_multi_function_tools_use_0', $u$Multifunction Drilling, Boring, Facing, External Turning and Internal Grooving Tools$u$, $u$Tools$u$, 0, $u$[{"name": "DRG-MF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3708&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_multi_function_tools_use_1', $u$Multifunction Solid Carbide Tools for Drilling, Facing, Internal and External Turning on Swiss-Type Machines$u$, $u$Tools$u$, 1, $u$[{"name": "PICCO-MF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1524&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_multi_function_tools_use_2', $u$Solid Carbide Tools for Drilling, Facing, Internal / External Turning and Threading on Swiss-Type Machines$u$, $u$Tools$u$, 2, $u$[{"name": "PICCO-MFT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1865&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_multi_function_tools_use_3', $u$Inserts for DR-MF Multifunction Tools with Two Cutting Edges for Hard Materials and Interrupted Cuts$u$, $u$Inserts$u$, 3, $u$[{"name": "XCMT-MF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2216&mapp=DR&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MULTIFUNCTIONTOOLS'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
