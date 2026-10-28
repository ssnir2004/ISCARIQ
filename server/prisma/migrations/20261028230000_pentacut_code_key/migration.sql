-- The PENTA code key becomes the PENTACUT key (Code keys -> Parting ->
-- PENTACUT), completed from the e-catalog's PENTACUT, QUICK-PENTA, PENTA IQ GRIP
-- and FLASHPENTA families: rows and sections are added only where missing, and
-- the title and subtitle change only if they were not edited.
CREATE FUNCTION "_ck_add"(v jsonb, add jsonb) RETURNS jsonb AS $f$
DECLARE
  a jsonb;
  secs jsonb;
  i int;
  found boolean;
  r jsonb;
BEGIN
  FOR a IN SELECT * FROM jsonb_array_elements(add) LOOP
    secs := COALESCE(v -> 'sections', '[]'::jsonb);
    found := false;
    FOR i IN 0 .. jsonb_array_length(secs) - 1 LOOP
      IF secs -> i ->> 'key' = a ->> 'key' THEN
        found := true;
        FOR r IN SELECT * FROM jsonb_array_elements(a -> 'rows') LOOP
          IF NOT EXISTS (SELECT 1 FROM jsonb_array_elements(secs -> i -> 'rows') e WHERE e ->> 'code' = r ->> 'code') THEN
            secs := jsonb_set(secs, ARRAY[i::text, 'rows'], (secs -> i -> 'rows') || jsonb_build_array(r));
          END IF;
        END LOOP;
      END IF;
    END LOOP;
    IF NOT found THEN
      secs := secs || jsonb_build_array(a);
    END IF;
    v := jsonb_set(v, '{sections}', secs);
  END LOOP;
  RETURN v;
END
$f$ LANGUAGE plpgsql;

UPDATE "AppSetting" SET "value" = "_ck_add"("value"::jsonb, $ck$[{"key": "i-family", "title": "Insert – family", "rows": [{"code": "PENTAS", "meaning": "PENTAS 27 blank inserts with 5 wide cutting edges for producing special profiles"}, {"code": "PMN", "meaning": "FLASHPENTA utility inserts with 5 cutting edges (PMN D22 / D32 / D40)"}]}, {"key": "i-size", "title": "Insert – size", "rows": [{"code": "27", "meaning": "PENTAS 27 wide blanks (PCHR/L 20-27-## tools)"}, {"code": "F", "meaning": "PENTA 34F – face grooving and recessing"}]}, {"key": "i-width", "title": "Insert – cutting width", "rows": [{"code": "##", "meaning": "Cutting width x10 (e.g. PENTA 17L03SP = 0.3 mm; PENTA 17ER08-07 = 0.7 mm; PENTAS 27-10 = 10 mm)"}, {"code": "#", "meaning": "PMN: cutting width in mm (2 or 3)"}]}, {"key": "i-chip", "title": "Chipformer", "rows": [{"code": "NP", "meaning": "Precision grooving and turning next to high shoulders (PENTA 17-###NP##)"}, {"code": "NX", "meaning": "Precision grooving and parting off next to shoulders"}, {"code": "SP", "meaning": "High positive rake for parting soft materials and miniature parts"}, {"code": "FT", "meaning": "Blank for grinding special profiles (PENTAS 27)"}]}, {"key": "i-radius", "title": "Insert – corner radius", "rows": [{"code": "##", "meaning": "Corner radius x10 (e.g. NF01 = 0.1 mm; PMN 02 = 0.2 mm) or x100 for back turning (PENTA 17ER08 = 0.08 mm)"}, {"code": "#.##", "meaning": "PENTA 34F: corner radius in mm (e.g. 0.15)"}, {"code": "-#", "meaning": "PMN: full radius in mm (e.g. -1)"}, {"code": "-#.#", "meaning": "PMN: full radius in mm (e.g. -1.5)"}]}, {"key": "i-side", "title": "Insert – side version", "rows": [{"code": "R", "meaning": "PENTA 34F face grooving insert, right"}, {"code": "L", "meaning": "PENTA 34F face grooving insert, left"}]}, {"key": "i-type", "title": "Insert – turning type", "rows": [{"code": "E", "meaning": "Back turning for short chipping materials (PENTA 17ER / 17EL)"}]}, {"key": "i-rake", "title": "Insert – rake angle", "rows": [{"code": "K#", "meaning": "Rake angle in degrees (e.g. K0 = 0°)"}]}, {"key": "i-dmin", "title": "Insert – minimum axial grooving diameter", "rows": [{"code": "##", "meaning": "PENTA 34F: minimum face grooving diameter in mm (e.g. 22)"}]}, {"key": "i-lock", "title": "Insert – QUICK-PENTA", "rows": [{"code": "SL", "meaning": "Safety lock clamping for quick cutting edge indexing (QUICK-PENTA, PCHR/L-QC tools)"}]}, {"key": "t-family", "title": "Tool – family", "rows": [{"code": "PCHP", "meaning": "Perpendicular holders for facing, grooving and turning (PCHPR/L, PCHPRS/LS)"}]}, {"key": "t-penta", "title": "Tool – PENTA size seat", "rows": [{"code": "17", "meaning": "For PENTA 17 inserts"}, {"code": "24", "meaning": "For PENTA 24 inserts"}, {"code": "34", "meaning": "For PENTA 34 inserts"}, {"code": "27", "meaning": "For PENTAS 27 wide blanks (followed by the edge width, e.g. 27-10)"}]}]$ck$::jsonb)::text
WHERE "key" = 'codekey.penta';

UPDATE "AppSetting" SET "value" = jsonb_set("value"::jsonb, '{title}', '"PENTACUT code key – inserts and tools"')::text
WHERE "key" = 'codekey.penta' AND "value"::jsonb ->> 'title' = 'PENTA code key – inserts and tools';

UPDATE "AppSetting" SET "value" = jsonb_set("value"::jsonb, '{subtitle}', '"Inserts with 5 cutting edges: PENTA 17 / 24 / 34 (PENTACUT, QUICK-PENTA SL), PENTA 34F face grooving, PENTAS 27 blanks, PENTA D (PENTA IQ GRIP) and PMN D (FLASHPENTA), and their tools"')::text
WHERE "key" = 'codekey.penta' AND "value"::jsonb ->> 'subtitle' = 'Inserts with 5 cutting edges: PENTA 17 / 24 / 34 (PENTA-CUT, QUICK-PENTA) and PENTA D (PENTA IQ GRIP)';

DROP FUNCTION "_ck_add"(jsonb, jsonb);
