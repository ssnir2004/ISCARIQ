-- The FLASHPENTA code key (Code keys -> Parting -> FLASHPENTA), from the ISCAR
-- e-catalog's FLASHPENTA families (PMN D22 / D32 / D40 inserts); kept if one
-- exists. The PENTACUT key leaves its PMN rows to it, and its subtitle changes
-- only if unedited.
INSERT INTO "AppSetting" ("key", "value") VALUES ('codekey.flashpenta', $ck${"title": "FLASHPENTA code key – inserts", "subtitle": "Utility parting and grooving inserts with 5 cutting edges (PMN D22 / D32 / D40)", "example": "PMN D32-2C02", "decoder": "flashpenta", "sections": [{"key": "i-family", "title": "Insert – family", "sample": "PMN", "rows": [{"code": "PMN", "meaning": "FLASHPENTA utility insert with 5 cutting edges"}]}, {"key": "i-size", "title": "Insert – size", "sample": "D32", "rows": [{"code": "D22", "meaning": "Size D22 – parting up to Ø22 mm (PCHR/L-D22 tools) (inferred)"}, {"code": "D32", "meaning": "Size D32 – parting up to Ø32 mm (PCHR/L-D32 tools) (inferred)"}, {"code": "D40", "meaning": "Size D40 – parting up to Ø40 mm (PCHR/L-D40 tools) (inferred)"}]}, {"key": "i-width", "title": "Insert – cutting width", "sample": "2", "rows": [{"code": "2", "meaning": "Cutting width 2 mm"}, {"code": "3", "meaning": "Cutting width 3 mm"}]}, {"key": "i-chip", "title": "Chipformer", "sample": "C", "rows": [{"code": "C", "meaning": "Parting and grooving hard materials, tough and general applications"}, {"code": "J", "meaning": "Soft materials and parting of tubes"}, {"code": "PB", "meaning": "Bearing steel and other ductile materials"}]}, {"key": "i-radius", "title": "Insert – corner radius", "sample": "02", "rows": [{"code": "##", "meaning": "Corner radius x10 (02 = 0.2 mm)"}, {"code": "-#", "meaning": "Full radius in mm (-1 on a 2 mm insert)"}, {"code": "-#.#", "meaning": "Full radius in mm (-1.5 on a 3 mm insert)"}]}]}$ck$)
ON CONFLICT ("key") DO NOTHING;

UPDATE "AppSetting"
SET "value" = jsonb_set("value"::jsonb, '{sections}', (
  SELECT jsonb_agg(CASE
    WHEN s ->> 'key' = 'i-family' THEN jsonb_set(s, '{rows}', COALESCE((SELECT jsonb_agg(e) FROM jsonb_array_elements(s -> 'rows') e WHERE e ->> 'code' <> 'PMN'), '[]'::jsonb))
    WHEN s ->> 'key' = 'i-width' THEN jsonb_set(s, '{rows}', COALESCE((SELECT jsonb_agg(e) FROM jsonb_array_elements(s -> 'rows') e WHERE e ->> 'code' <> '#'), '[]'::jsonb))
    WHEN s ->> 'key' = 'i-radius' THEN jsonb_set(s, '{rows}', COALESCE((SELECT jsonb_agg(e) FROM jsonb_array_elements(s -> 'rows') e WHERE e ->> 'code' NOT IN ('-#', '-#.#')), '[]'::jsonb))
    ELSE s END)
  FROM jsonb_array_elements("value"::jsonb -> 'sections') s
))::text
WHERE "key" = 'codekey.penta';

UPDATE "AppSetting" SET "value" = jsonb_set("value"::jsonb, '{subtitle}', '"Inserts with 5 cutting edges: PENTA 17 / 24 / 34, PENTA 34F face grooving and PENTAS 27 blanks, and their tools"')::text
WHERE "key" = 'codekey.penta' AND "value"::jsonb ->> 'subtitle' = 'Inserts with 5 cutting edges: PENTA 17 / 24 / 34, PENTA 34F face grooving, PENTAS 27 blanks and PMN D (FLASHPENTA), and their tools';
