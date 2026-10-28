-- The CUT-GRIP code key gains the TIGER / TIGERV wide inserts (THDR/L/N
-- holders); rows are added only where missing.
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

UPDATE "AppSetting" SET "value" = "_ck_add"("value"::jsonb, $ck$[{"key": "i-family", "title": "Insert – family", "rows": [{"code": "TIGER", "meaning": "Utility single-ended inserts for external heavy grooving and deep machining (THDR/L/N holders)"}, {"code": "TIGERV", "meaning": "Utility single-ended inserts for external deep grooving and heavy machining (THDR/L/N holders)"}]}, {"key": "i-width", "title": "Insert – cutting width (and corner radius)", "rows": [{"code": "####-###", "meaning": "TIGER: width and corner radius x100 (e.g. 1453-152 = 14.53 mm, R1.52)"}, {"code": "##.##-#.##", "meaning": "TIGER: width and corner radius in mm (e.g. 16.63-1.52)"}]}, {"key": "i-variant", "title": "Insert – variant", "rows": [{"code": "CW", "meaning": "CW version of TIGER / TIGERV inserts (see the catalog) (inferred)"}]}, {"key": "t-family", "title": "Tool – family", "rows": [{"code": "THD", "meaning": "External holders for wide (up to 20 mm) TIGER grooving inserts (THDR / THDL / THDN)"}]}, {"key": "t-suffix", "title": "Tool – suffixes", "rows": [{"code": "T##", "meaning": "Maximum cutting depth in mm (e.g. T38, T45)"}]}]$ck$::jsonb)::text
WHERE "key" = 'codekey.cutgrip';

DROP FUNCTION "_ck_add"(jsonb, jsonb);
