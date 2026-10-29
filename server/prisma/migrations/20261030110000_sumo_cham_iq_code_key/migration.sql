-- The SUMO-CHAM IQ code key (Code keys -> Drilling -> SUMO-CHAM IQ), from the
-- ISCAR e-catalog's SUMO-CHAM IQ family (HCP-IQ heads); kept if one exists. The
-- SUMO-CHAM key leaves its HCP and IQ rows to it, and its subtitle changes only
-- if unedited.
INSERT INTO "AppSetting" ("key", "value") VALUES ('codekey.sumochamiq', $ck${"title": "SUMO-CHAM IQ code key – drilling heads", "subtitle": "Exchangeable self-centering drilling heads (HCP-IQ) for ISO P and ISO K materials, on SUMO-CHAM DCN drill bodies", "example": "HCP 040-IQ", "decoder": "sumo-cham-iq", "sections": [{"key": "i-family", "title": "Head – family", "sample": "HCP", "rows": [{"code": "HCP", "meaning": "Self-centering SUMO-CHAM IQ heads for ISO P and ISO K materials (DCN drill bodies, see SUMO-CHAM)"}]}, {"key": "i-dia", "title": "Head – drilling diameter", "sample": "040", "rows": [{"code": "###", "meaning": "Drilling diameter x10 (e.g. 040 = 4.0 mm, 329 = 32.9 mm)"}, {"code": "####", "meaning": "Drilling diameter x100 (e.g. 1605 = 16.05 mm, 3175 = 31.75 mm)"}]}, {"key": "i-suffix", "title": "Head – suffix", "sample": "IQ", "rows": [{"code": "IQ", "meaning": "IQ line"}]}]}$ck$)
ON CONFLICT ("key") DO NOTHING;

UPDATE "AppSetting"
SET "value" = jsonb_set("value"::jsonb, '{sections}', (
  SELECT jsonb_agg(CASE
    WHEN s ->> 'key' = 'i-family' THEN jsonb_set(s, '{rows}', COALESCE((SELECT jsonb_agg(e) FROM jsonb_array_elements(s -> 'rows') e WHERE e ->> 'code' <> 'HCP'), '[]'::jsonb))
    WHEN s ->> 'key' = 'i-suffix' THEN jsonb_set(s, '{rows}', COALESCE((SELECT jsonb_agg(e) FROM jsonb_array_elements(s -> 'rows') e WHERE e ->> 'code' <> 'IQ'), '[]'::jsonb))
    ELSE s END)
  FROM jsonb_array_elements("value"::jsonb -> 'sections') s
))::text
WHERE "key" = 'codekey.sumocham';

UPDATE "AppSetting" SET "value" = jsonb_set("value"::jsonb, '{subtitle}', '"Exchangeable drilling heads (ICP, ICM, ICK, ICN, ICG, IHP, QCP) and the DCN drill bodies that carry them"')::text
WHERE "key" = 'codekey.sumocham' AND "value"::jsonb ->> 'subtitle' = 'Exchangeable drilling heads (ICP, ICM, ICK, ICN, ICG, IHP, QCP, HCP) and the DCN drill bodies that carry them';
