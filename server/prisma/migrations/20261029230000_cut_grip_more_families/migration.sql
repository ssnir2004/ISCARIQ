-- The CUT-GRIP code key gains the families its decoder now reads (GIFA seal
-- fin, GDP / GDK piston, GPV pulley, GDPY, LPGI / LPGIB inserts; GHI / GEHI /
-- GEHIM bars, CGIN blades, GAI / GEAI / AVC / CGPADFIN adapters); rows are
-- added only where missing.
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

UPDATE "AppSetting" SET "value" = "_ck_add"("value"::jsonb, $ck$[{"key": "i-family", "title": "Insert – family", "rows": [{"code": "GIFA", "meaning": "Full-radius precision sharp-edged inserts for machining seal fin grooves in heat-resistant materials (CGPADFIN adapters)"}, {"code": "GDPY", "meaning": "Precision double-ended inserts for external heavy-duty grooving and turning"}, {"code": "GDP", "meaning": "Inserts for precision grooving V-shaped piston grooves"}, {"code": "GDK", "meaning": "Inserts for rough grooving V-shaped piston grooves"}, {"code": "GPV", "meaning": "Precision inserts for grooving multi V-ribbed pulleys"}, {"code": "LPGIB", "meaning": "Blank inserts for producing inverted T grooves"}, {"code": "LPGI", "meaning": "Inserts for axial grooves inside radial grooves and radial grooves inside axial grooves (LPGIR / LPGIL)"}]}, {"key": "i-hand", "title": "Insert – hand", "rows": [{"code": "R", "meaning": "Right-hand"}, {"code": "L", "meaning": "Left-hand"}, {"code": "N", "meaning": "Neutral"}]}, {"key": "i-variant", "title": "Insert – variant", "rows": [{"code": "####X", "meaning": "GDP: piston groove profile code (e.g. 1404Q, see the catalog)"}, {"code": "MS", "meaning": "GDK: MS version (see the catalog) (inferred)"}, {"code": "PR", "meaning": "LPGI: profile (full) radius version (inferred)"}, {"code": "#", "meaning": "GPV: version (see the catalog) (inferred)"}]}, {"key": "i-size", "title": "Insert – size", "rows": [{"code": "##", "meaning": "LPGI / LPGIB insert size (e.g. 12)"}]}, {"key": "i-w1", "title": "Insert – W1", "rows": [{"code": "#", "meaning": "W1 dimension in mm (see the catalog)"}]}, {"key": "t-family", "title": "Tool – family", "rows": [{"code": "GHI", "meaning": "Internal grooving and turning boring bars (GHIR / GHIL)"}, {"code": "GEHI", "meaning": "Internal grooving and turning bars for GEPI / GEMI inserts (GEHIR / GEHIL)"}, {"code": "GEHIM", "meaning": "Internal grooving and turning bars for GEMI utility inserts (GEHIMR / GEHIML)"}, {"code": "CGIN", "meaning": "Internal grooving and turning blades for GHIC...-50 bars"}, {"code": "GAIC", "meaning": "AVC adapter for GHIC...-50 bars / CGIN blades"}, {"code": "GAI", "meaning": "Adapters for internal grooving and turning (GAIR / GAIL)"}, {"code": "GEAI", "meaning": "Adapters for internal grooving and turning, GEPI / GEMI inserts (GEAIR / GEAIL)"}, {"code": "CGPADFIN", "meaning": "Adapters with high-pressure coolant carrying GIFA inserts for seal fin grooves"}, {"code": "HFI", "meaning": "CAMFIX (C#) internal grooving and turning bars (C# HFIR/L-MC)"}]}, {"key": "t-suffix", "title": "Tool – suffixes", "rows": [{"code": "SC", "meaning": "Solid carbide shank"}, {"code": "A", "meaning": "CGIN blade, A version (see the catalog) (inferred)"}, {"code": "C#", "meaning": "CAMFIX shank size (e.g. C4, C5)"}, {"code": "T##", "meaning": "Maximum cutting depth in mm"}]}]$ck$::jsonb)::text
WHERE "key" = 'codekey.cutgrip';

DROP FUNCTION "_ck_add"(jsonb, jsonb);
