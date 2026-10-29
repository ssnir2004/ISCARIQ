-- SUMO-CHAM gains the FCP flat bottom heads (FCP 088, FCP 040-IQ): their key
-- rows and their use, added only where missing.
UPDATE "AppSetting"
SET "value" = jsonb_set("value"::jsonb, '{sections}', (
  SELECT jsonb_agg(CASE
    WHEN s ->> 'key' = 'i-family' AND NOT EXISTS (SELECT 1 FROM jsonb_array_elements(s -> 'rows') e WHERE e ->> 'code' = 'FCP')
      THEN jsonb_set(s, '{rows}', (s -> 'rows') || '[{"code": "FCP", "meaning": "Flat bottom heads for ISO P and ISO K materials"}]'::jsonb)
    WHEN s ->> 'key' = 'i-suffix' AND NOT EXISTS (SELECT 1 FROM jsonb_array_elements(s -> 'rows') e WHERE e ->> 'code' = 'IQ')
      THEN jsonb_set(s, '{rows}', (s -> 'rows') || '[{"code": "IQ", "meaning": "IQ line (FCP small diameters)"}]'::jsonb)
    ELSE s END)
  FROM jsonb_array_elements("value"::jsonb -> 'sections') s
))::text
WHERE "key" = 'codekey.sumocham';

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT 'innovation_sumo_cham_use_fcp', i."id", $u$Exchangeable Flat Bottom SUMO-CHAM Drilling Heads, for Machining ISO P and ISO K Materials$u$, 'Heads',
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0),
       $u$[{"name": "FCP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3156&mapp=DR&GFSTYP=M"}]$u$::jsonb
FROM "Innovation" i
WHERE upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOCHAM'
  AND NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND x."inserts"::text LIKE '%"FCP"%')
ON CONFLICT DO NOTHING;
