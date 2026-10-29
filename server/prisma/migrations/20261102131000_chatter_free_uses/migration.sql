-- One-time: the CHATTER-FREE brand (Solutions, Milling) with its uses from
-- the ISCAR intranet e-catalog (Milling), each family linked to its page;
-- families with the same description share a use. An existing CHATTER-FREE is kept:
-- it gets the application, a description if it has none, and the uses it
-- doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_chatter_free', 'CHATTER-FREE', 'Milling', $u$Solid carbide endmills with different helix and variable pitch for chatter damping, for high metal removal rates and high speed finishing of steel, stainless steel, hard materials and aluminum.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CHATTERFREE')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Solid carbide endmills with different helix and variable pitch for chatter damping, for high metal removal rates and high speed finishing of steel, stainless steel, hard materials and aluminum.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CHATTERFREE' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'milling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CHATTERFREE'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_chatter_free_use_0', $u$4 Flute, 38° Helix Endmills with 3xD Relieved Neck and Variable Pitch for Chatter Damping$u$, $u$Endmills$u$, 0, $u$[{"name": "EC-E4L-CF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2517&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_chatter_free_use_1', $u$5 Flute, 38° Helix Medium Length (3xD) Variable Pitch Endmills$u$, $u$Endmills$u$, 1, $u$[{"name": "EC-E5L-CF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2518&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_chatter_free_use_2', $u$4 Flute Endmills with Different Helix and Variable Pitch for Chatter Damping with Assorted Radii$u$, $u$Endmills$u$, 2, $u$[{"name": "EC-H4-L/M/XL-CFR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3183&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_chatter_free_use_3', $u$5 Flute Endmills with Different Helix and Variable Pitch for Chatter Damping with Assorted Radius Dimensions$u$, $u$Endmills$u$, 3, $u$[{"name": "EC-H5M-CF/NE", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3265&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_chatter_free_use_4', $u$7 Flute Endmills with Different Helix and Variable Pitch for CHATTERFREE High Speed Finish Milling$u$, $u$Endmills$u$, 4, $u$[{"name": "EC-E7/H7-CF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3643&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_chatter_free_use_5', $u$6-20 Flute Endmills with Different Helix and Variable Pitch for CHATTERFREE High Speed Finish Milling$u$, $u$Endmills$u$, 5, $u$[{"name": "EC-H-CF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3647&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_chatter_free_use_6', $u$4 Flute Endmills with Different Helix and Variable Pitch for Chatter Damping$u$, $u$Endmills$u$, 6, $u$[{"name": "EC-H4M-CF-E", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3736&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_chatter_free_use_7', $u$Short 4 Flute Endmills with Different Helix and Variable Pitch for Chatter Damping$u$, $u$Endmills$u$, 7, $u$[{"name": "EC-H4S-CF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3869&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_chatter_free_use_8', $u$7 Flute Solid Carbide Endmills with Different Helix, Variable Pitch and Chip Splitting Cutting Edges$u$, $u$Endmills$u$, 8, $u$[{"name": "ECP-H7-CF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4157&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_chatter_free_use_9', $u$4 Flute, 38° Helix Endmills, up to 2XD depth of cut with Variable Pitch for Chatter Damping$u$, $u$Endmills$u$, 9, $u$[{"name": "EC-E4M-CF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4805&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_chatter_free_use_10', $u$5 Flute Endmills with Different Helix and Variable Pitch for Chatter Damping$u$, $u$Endmills$u$, 10, $u$[{"name": "EC-H5M-CF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5558&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_chatter_free_use_11', $u$Short 5 Flute Endmills With Variable Pitch for Chatter Dampening$u$, $u$Endmills$u$, 11, $u$[{"name": "EC-H5S-CF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5560&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_chatter_free_use_12', $u$CHATTER FREE Kit Containing 4 Solid Carbide Endmills for Roughing and Finishing Operations$u$, $u$Kits$u$, 12, $u$[{"name": "KIT EC-CF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2630&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_chatter_free_use_13', $u$Solid Carbide Endmills with Different Helix, Variable Pitch, and Relieved Neck for Machining Aluminum$u$, $u$Aluminum endmills$u$, 13, $u$[{"name": "ECA-H3-CF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2935&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_chatter_free_use_14', $u$Solid Carbide Endmills with Different Helix and Long Neck Relief for Machining Aluminum$u$, $u$Aluminum endmills$u$, 14, $u$[{"name": "ECA-H4-CF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3316&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_chatter_free_use_15', $u$Solid Carbide Endmills with Different Helix, Variable Pitch, Chip Splitters, and Coolant Holes for Machining Aluminum$u$, $u$Aluminum endmills$u$, 15, $u$[{"name": "ECAP-H3-CF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3504&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_chatter_free_use_16', $u$4 Flute, 45° Helix Ball Nose Endmills with 3xD Relieved Necks and Variable Pitch for Chatter Damping on Hard Materials$u$, $u$Ball nose endmills$u$, 16, $u$[{"name": "EB-E4L-CF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3670&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_chatter_free_use_17', $u$3/5 Flute Solid Carbide Ball Nose Endmills with Different Helix and Variable Pitch for Materials up to 65 HRC$u$, $u$Ball nose endmills$u$, 17, $u$[{"name": "EB-H-CF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3966&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_chatter_free_use_18', $u$4 Flute Solid Carbide Endmills with Different Helix, Variable Pitch and Chip Splitting Cutting Edges for Roughing$u$, $u$Roughing endmills$u$, 18, $u$[{"name": "ECP-H4L-CFR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3868&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_chatter_free_use_19', $u$5 Flute Solid Carbide Endmills with Different Helix, Variable Pitch and Chip Splitting Cutting Edges for Roughing$u$, $u$Roughing endmills$u$, 19, $u$[{"name": "ECP-H5L-CFR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4523&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_chatter_free_use_20', $u$5 Flute Endmills with Different Helix for Milling Austenitic, Duplex, Cast and Precipitation Hardening Stainless Steels$u$, $u$Hard materials endmills$u$, 20, $u$[{"name": "ECY-S5-CFR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4392&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CHATTERFREE'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
