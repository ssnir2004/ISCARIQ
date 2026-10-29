-- One-time: the indexable milling brands (Solutions, Indexable Milling; the solid
-- HSS-MILL / T-SLOT / T-FACE / T-GEAR under Endmills(SC) & MM) with their uses from
-- the ISCAR intranet e-catalog (Milling), each family linked to its page; families
-- with the same description share a use. An existing brand is kept: it gets the
-- application, a description if it has none, and the uses it doesn't have (by name).

-- HELI-2000
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_heli2000', 'HELI-2000', 'Milling', $u$HELI-2000: indexable milling tools and inserts from the ISCAR milling catalog, such as endmills Carrying HM90 AP.. 1003... Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELI2000')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$HELI-2000: indexable milling tools and inserts from the ISCAR milling catalog, such as endmills Carrying HM90 AP.. 1003... Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELI2000' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELI2000'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_heli2000_use_0', $u$Endmills Carrying HM90 AP.. 1003... Inserts$u$, $u$Endmills$u$, 0, $u$[{"name": "HM90 E90A-10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1000&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli2000_use_1', $u$90° Endmills Carrying HM90 ADKT-1505... Inserts$u$, $u$Endmills$u$, 1, $u$[{"name": "HM90 E90AD-15", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1002&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli2000_use_2', $u$90° Endmills with a FLEXFIT Threaded Adaptation Carrying HM90 AP.. 1003... Inserts$u$, $u$Endmills$u$, 2, $u$[{"name": "HM90 E90A-M-10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1165&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli2000_use_3', $u$90° Endmills with a FLEXFIT Threaded Adaptation Carrying HM90 ADKT-1505... Inserts$u$, $u$Endmills$u$, 3, $u$[{"name": "HM90 E90AD-M-15", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1167&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli2000_use_4', $u$90° Endmills with a MULTI-MASTER Threaded Adaptation Carrying HM90 AP.. 1003... Inserts$u$, $u$Endmills$u$, 4, $u$[{"name": "HM90 E90A-MM-10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2251&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli2000_use_5', $u$The kit contains 1 HELI2000 endmill and 5 HM90 APKT 1003PDR inserts.$u$, $u$Endmills$u$, 5, $u$[{"name": "KIT HM90 E90A", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2577&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli2000_use_6', $u$90° JHP Endmills with a MULTI-MASTER Threaded Adaptation Carrying HELI2000 and HELIMILL Inserts$u$, $u$Endmills$u$, 6, $u$[{"name": "HM90 E90A-MM-10-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4601&mapp=ML&GFSTYP=M"}, {"name": "HM90 E90AD-MM-15-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4821&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli2000_use_7', $u$90° JHP Endmills With a FLEXFIT Threaded Adaptation Carrying HELI2000 and HELIMILL Inserts$u$, $u$Endmills$u$, 7, $u$[{"name": "HM90 E90AD-M-15-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4602&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli2000_use_8', $u$General-Use Insert$u$, $u$Inserts$u$, 8, $u$[{"name": "HM90 ADK/CT 1505..", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1004&mapp=ML&GFSTYP=M"}, {"name": "HM90 APKT/CT 1003..", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1202&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli2000_use_9', $u$Inserts with Sharp Cutting Edge and Polished Rake Face for ISO N Applications$u$, $u$Inserts$u$, 9, $u$[{"name": "HM90 ADCR 1505.. FR-P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1746&mapp=ML&GFSTYP=M"}, {"name": "HM90 APCR 1003.. FR-P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1778&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli2000_use_10', $u$Single corner PCD tipped inserts for ISO N applications$u$, $u$Inserts$u$, 10, $u$[{"name": "ADKW 1505.. PCD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2387&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli2000_use_11', $u$Single Corner CBN Tipped Inserts for ISO K Applications$u$, $u$Inserts$u$, 11, $u$[{"name": "ADKW 1505.. CBN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2921&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli2000_use_12', $u$90° Face Mills Carrying HM90 ADKT 1505... Inserts$u$, $u$Face mills$u$, 12, $u$[{"name": "HM90 F90A-15", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1159&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli2000_use_13', $u$90° Face Mills Carrying HM90 APKT 1003... Inserts$u$, $u$Face mills$u$, 13, $u$[{"name": "HM90 F90AP-10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1369&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli2000_use_14', $u$Adjustable Face Mills (used mainly for PCD/CBN inserts)$u$, $u$Face mills$u$, 14, $u$[{"name": "F90AD-SFR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2798&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli2000_use_15', $u$90° JHP Face Mills Carrying HELI2000 and HELIMILL Inserts$u$, $u$Face mills$u$, 15, $u$[{"name": "HM90 F90AP-10-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4603&mapp=ML&GFSTYP=M"}, {"name": "HM90 F90A-15-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4647&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli2000_use_16', $u$90° Light Weight Face Cutters Carrying HM90 AP...T 1003 inserts$u$, $u$Tools$u$, 16, $u$[{"name": "HM90 F90AP-AMT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4838&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELI2000'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- HELI-MILL
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_helimill', 'HELI-MILL', 'Milling', $u$HELI-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as inserts with Sharp Cutting Edge and Polished Rake Face for ISO N Applications.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELIMILL')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$HELI-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as inserts with Sharp Cutting Edge and Polished Rake Face for ISO N Applications.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELIMILL' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELIMILL'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_helimill_use_0', $u$Inserts with Sharp Cutting Edge and Polished Rake Face for ISO N Applications$u$, $u$Inserts$u$, 0, $u$[{"name": "ADCR 1505.. FR/-P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=7&mapp=ML&GFSTYP=M"}, {"name": "APCR 1003.. FR-P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1145&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helimill_use_1', $u$High Positive Inserts for ISO M and ISO S Applications$u$, $u$Inserts$u$, 1, $u$[{"name": "ADKR 1505.. HM/HP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=11&mapp=ML&GFSTYP=M"}, {"name": "APKR 1003.. HM/HP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=26&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helimill_use_2', $u$General-Use Inserts$u$, $u$Inserts$u$, 2, $u$[{"name": "ADKT/CT 1505", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=12&mapp=ML&GFSTYP=M"}, {"name": "APKT/CT 1003", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=31&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helimill_use_3', $u$Milling Inserts with a Reinforced Cutting Edge, for Heavy Machining Applications and General Use$u$, $u$Inserts$u$, 3, $u$[{"name": "ADKT 1505ADR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=13&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helimill_use_4', $u$Milling Inserts with a 16 mm Cutting Edge Length and Positive Rake Angle for General Use$u$, $u$Inserts$u$, 4, $u$[{"name": "APKT 1604", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=711&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helimill_use_5', $u$Super Positive and Polished Rake Insert for Machining Aluminum and High Temperature Alloys$u$, $u$Inserts$u$, 5, $u$[{"name": "APCR 1604", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=827&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helimill_use_6', $u$Inserts with Reinforced Cutting Edge$u$, $u$Inserts$u$, 6, $u$[{"name": "APKT 1003.. RM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1082&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helimill_use_7', $u$Inserts With Reinforced Cutting Edge$u$, $u$Inserts$u$, 7, $u$[{"name": "ADKT 1505.. RM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1084&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helimill_use_8', $u$Single Corner PCD Tipped Inserts for ISO N Applications$u$, $u$Inserts$u$, 8, $u$[{"name": "APKW 1003.. PCD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2388&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helimill_use_9', $u$Extended Flute Cutters with ADKT/R-15... Inserts$u$, $u$Extended flute cutters$u$, 9, $u$[{"name": "ADK", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=9&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helimill_use_10', $u$Extended Flute Endmills Carrying APKT/R-10... Inserts$u$, $u$Extended flute cutters$u$, 10, $u$[{"name": "APK-FE", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=24&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helimill_use_11', $u$Extended Flute Shell Mills Carrying HM90 ADKT 1505... Inserts$u$, $u$Extended flute cutters$u$, 11, $u$[{"name": "SM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=392&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helimill_use_12', $u$Drilling Endmills Carrying APKT/ADKT Inserts$u$, $u$Endmills$u$, 12, $u$[{"name": "E90AC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=105&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helimill_use_13', $u$90° Face Mills Carrying APKT 1604... Inserts$u$, $u$Face mills$u$, 13, $u$[{"name": "F90-16", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5253&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELIMILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- HELI-ALU
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_helialu', 'HELI-ALU', 'Milling', $u$HELI-ALU: indexable milling tools and inserts from the ISCAR milling catalog, such as super Positive Inserts with a Polished Rake, for Machining Aluminum.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELIALU')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$HELI-ALU: indexable milling tools and inserts from the ISCAR milling catalog, such as super Positive Inserts with a Polished Rake, for Machining Aluminum.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELIALU' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELIALU'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_helialu_use_0', $u$Super Positive Inserts with a Polished Rake, for Machining Aluminum$u$, $u$Inserts$u$, 0, $u$[{"name": "APCR 2206..-HM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=22&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helialu_use_1', $u$Super Positive Inserts with a Polished Rake for Machining Aluminum$u$, $u$Inserts$u$, 1, $u$[{"name": "HM90 APCR 1605..R-P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1424&mapp=ML&GFSTYP=M"}, {"name": "HM90 AXCR 1505", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1710&mapp=ML&GFSTYP=M"}, {"name": "HM90 APCR 2206..R-P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1846&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helialu_use_2', $u$Chip Splitting Insert for Rough Milling of Aluminum$u$, $u$Inserts$u$, 2, $u$[{"name": "HM90 APCR 220605-CS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2582&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helialu_use_3', $u$Super Positive Inserts with a Polished Rake for Machining Aluminum at High Rotation Speed$u$, $u$Inserts$u$, 3, $u$[{"name": "HSM90S APCR 1405", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3342&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helialu_use_4', $u$Super Positive Inserts with a Polished Rake for Machining Aluminum at High Rotational Speed$u$, $u$Inserts$u$, 4, $u$[{"name": "HSM90S APCR 2207", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4350&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helialu_use_5', $u$Long Reach Endmills Carrying HM90 APCR 1605 Inserts for Machining Aluminum$u$, $u$Endmills$u$, 5, $u$[{"name": "HM90 EAL-16", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1420&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helialu_use_6', $u$Long Reach Endmills with Integral HSK Adaptation Carrying HM90 APCR 1605... Inserts for Machining Aluminum$u$, $u$Endmills$u$, 6, $u$[{"name": "HM90 EAL-HSK63A-16", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1813&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helialu_use_7', $u$Long Reach Endmills Carrying HM90 AXCR 1505... Inserts for Machining Aluminum$u$, $u$Endmills$u$, 7, $u$[{"name": "HM90 EAL-15", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1839&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helialu_use_8', $u$Long Reach Endmills with Integral HSK Adaptation Carrying HM90 AXCR 1505... Inserts for Machining Aluminum$u$, $u$Endmills$u$, 8, $u$[{"name": "HM90 EAL-HSK63A-15", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1841&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helialu_use_9', $u$Long Reach Endmills Carrying HSM90S APCR 1405... Inserts for Machining Aluminum$u$, $u$Endmills$u$, 9, $u$[{"name": "HSM90S EAL-14", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3365&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helialu_use_10', $u$90° Endmills with Integral HSK Adaptation Carrying Super Positive Inserts for Machining Aluminum at High Rotation Speeds$u$, $u$Endmills$u$, 10, $u$[{"name": "HSM90SFD-HSK A63/80-22", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4349&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helialu_use_11', $u$90° Endmills with a FLEXFIT Threaded Adaptation Carrying HM90 AXCR 1505... Inserts for Machining Aluminum$u$, $u$Endmills$u$, 11, $u$[{"name": "HM90 EAL-M-15-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4872&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helialu_use_12', $u$90° Endmills with a FLEXFIT Threaded Adaptation Carrying HM90 APCR 1605... Inserts for Machining Aluminum$u$, $u$Endmills$u$, 12, $u$[{"name": "HM90 EAL-M-16-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5059&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helialu_use_13', $u$90° Endmills with a MULTI-MASTER Threaded Adaptation Carrying HM90 AXCR 1505... Inserts for Machining Aluminum$u$, $u$Endmills$u$, 13, $u$[{"name": "HM90 EAL-MM-15-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5060&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helialu_use_14', $u$90° Endmills with a MULTI-MASTER Threaded Adaptation Carrying HM90 APCR 1605... Inserts for Machining Aluminum$u$, $u$Endmills$u$, 14, $u$[{"name": "HM90 EAL-MM-16-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5061&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helialu_use_15', $u$Face Mills Carrying HM90 APCR 1605... Inserts for Machining Aluminum$u$, $u$Face mills$u$, 15, $u$[{"name": "HM90 FAL-16", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1529&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helialu_use_16', $u$Face Mills Carrying HM90 APCR 1605... Inserts with Corner Radii Equal to or Larger Than 5 mm for Machining Aluminum$u$, $u$Face mills$u$, 16, $u$[{"name": "HM90 FAL-16BR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2042&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helialu_use_17', $u$Face Mills Carrying HM90 APCR 2206... Inserts for Machining Aluminum$u$, $u$Face mills$u$, 17, $u$[{"name": "HM90 FAL-22", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2322&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helialu_use_18', $u$Face Mills Carrying HM90 AXCR 1505.. Inserts for Machining Aluminum$u$, $u$Face mills$u$, 18, $u$[{"name": "HM90 FAL-15", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2684&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helialu_use_19', $u$90° Face Mills Carrying Super Positive and Polished Rake Inserts for Machining Aluminum at High Rotation Speeds$u$, $u$Face mills$u$, 19, $u$[{"name": "HSM90S FAL-14", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3343&mapp=ML&GFSTYP=M"}, {"name": "HSM90S FAL-22", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4348&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helialu_use_20', $u$Extended Flute PCD Endmills for High Speed Machining of Aluminum, CFRP, and Graphite$u$, $u$Extended flute cutters$u$, 20, $u$[{"name": "SMN D-03-30C IT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5418&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELIALU'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- HELI-QUAD
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_heliquad', 'HELI-QUAD', 'Milling', $u$HELI-QUAD: indexable milling tools and inserts from the ISCAR milling catalog, such as 45° Chamfering Endmills Carrying X/Q/SOMT 06 Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELIQUAD')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$HELI-QUAD: indexable milling tools and inserts from the ISCAR milling catalog, such as 45° Chamfering Endmills Carrying X/Q/SOMT 06 Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELIQUAD' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELIQUAD'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_heliquad_use_0', $u$45° Chamfering Endmills Carrying X/Q/SOMT 06 Inserts$u$, $u$Endmills$u$, 0, $u$[{"name": "E45X", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=101&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliquad_use_1', $u$Endmills Carrying Square Inserts$u$, $u$Endmills$u$, 1, $u$[{"name": "E90SP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=108&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliquad_use_2', $u$Endmills Carrying Square Q/S/XOMT Inserts$u$, $u$Endmills$u$, 2, $u$[{"name": "E90X", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=109&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliquad_use_3', $u$Drilling Endmills Carrying Square S/XOMT Inserts$u$, $u$Endmills$u$, 3, $u$[{"name": "E90XC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=110&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliquad_use_4', $u$Face Mills Carrying Square Inserts$u$, $u$Face mills$u$, 4, $u$[{"name": "F90SP-10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=142&mapp=ML&GFSTYP=M"}, {"name": "F90SD-12", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4127&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliquad_use_5', $u$Super Positive Square Insert for Aluminum, Stainless Steel and High Temperature Alloys$u$, $u$Inserts$u$, 5, $u$[{"name": "SDMR-HQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=343&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliquad_use_6', $u$Square Milling Inserts for General Use$u$, $u$Inserts$u$, 6, $u$[{"name": "SOMT-HQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=407&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliquad_use_7', $u$Square Positive Inserts for Right-Hand Tools for General Use$u$, $u$Inserts$u$, 7, $u$[{"name": "SPMT-HQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=414&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliquad_use_8', $u$Square Inserts for Milling, Drilling and Boring with 2 Right- and 2 Left-Hand Cutting Edges for General Use$u$, $u$Inserts$u$, 8, $u$[{"name": "XOMT-HQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=507&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliquad_use_9', $u$Insert with 2 Right- or Left-Hand Cutting Edges with Positive Land$u$, $u$Inserts$u$, 9, $u$[{"name": "XPMT-HQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=508&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliquad_use_10', $u$General Use Inserts with Four Helical Cutting Edges for 90° Shoulder Milling$u$, $u$Inserts$u$, 10, $u$[{"name": "SDMT-PDR-HQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=828&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliquad_use_11', $u$Neutral Inserts for Slotting$u$, $u$Inserts$u$, 11, $u$[{"name": "QDMT 1205..PDTN-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1087&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliquad_use_12', $u$Precision Ground Neutral insert for General Use$u$, $u$Inserts$u$, 12, $u$[{"name": "QDCT-PDN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1528&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliquad_use_13', $u$Insert with Helical Cutting Edges for 90° Shoulder Milling$u$, $u$Inserts$u$, 13, $u$[{"name": "SDMT-PDR-RM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1715&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliquad_use_14', $u$Precision Insert Used for Semi-Finishing and Finishing Applications$u$, $u$Inserts$u$, 14, $u$[{"name": "SPCT/SPMR PDR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4718&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliquad_use_15', $u$Insert with 4 Cutting Edges for Fast Feed Milling$u$, $u$Inserts$u$, 15, $u$[{"name": "SDMT-FF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4816&mapp=ML&GFSTYP=M"}, {"name": "SPMT-FF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4836&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliquad_use_16', $u$High Positive Inserts for Machining Stainless Steel and High Temperature Alloys$u$, $u$Inserts$u$, 16, $u$[{"name": "SPMT-HP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4826&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliquad_use_17', $u$Extended Flute Endmills Carrying Square Inserts$u$, $u$Extended flute cutters$u$, 17, $u$[{"name": "SPK", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=409&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliquad_use_18', $u$Full Slot Flange-Type Slotting Cutters$u$, $u$Slotting & slitting cutters$u$, 18, $u$[{"name": "FDN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=722&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliquad_use_19', $u$Full Slot Disk Type Slotting Cutters$u$, $u$Slotting & slitting cutters$u$, 19, $u$[{"name": "SDN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=723&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliquad_use_20', $u$Full Slot Flange-Type Slotting Cutters with CLICKFIT Adaptation$u$, $u$Slotting & slitting cutters$u$, 20, $u$[{"name": "FDN-CF4", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1156&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELIQUAD'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- HELI-4-MILL
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_heli4mill', 'HELI-4-MILL', 'Milling', $u$HELI-4-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as endmills Carrying Square Inserts for Shouldering and Fast Feed Milling Applications.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELI4MILL')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$HELI-4-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as endmills Carrying Square Inserts for Shouldering and Fast Feed Milling Applications.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELI4MILL' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELI4MILL'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_heli4mill_use_0', $u$Endmills Carrying Square Inserts for Shouldering and Fast Feed Milling Applications$u$, $u$Endmills$u$, 0, $u$[{"name": "E90SO-04", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4282&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli4mill_use_1', $u$Endmills with a MULTI-MASTER Connection Carrying Inserts for Shouldering and Fast Feed Applications$u$, $u$Endmills$u$, 1, $u$[{"name": "E90SO-MM-04", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4284&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli4mill_use_2', $u$Square Milling Inserts for General Use$u$, $u$Inserts$u$, 2, $u$[{"name": "SOMT/CT 0402", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4286&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli4mill_use_3', $u$Square Milling Inserts for Fast Feed Milling$u$, $u$Inserts$u$, 3, $u$[{"name": "SOMT 0402-FF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4306&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELI4MILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- QUAD-2000
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_quad2000', 'QUAD-2000', 'Milling', $u$QUAD-2000: indexable milling tools and inserts from the ISCAR milling catalog, such as super Positive Square Milling Inserts for Machining Aluminum, Stainless Steel and High Temperature Alloys.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUAD2000')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$QUAD-2000: indexable milling tools and inserts from the ISCAR milling catalog, such as super Positive Square Milling Inserts for Machining Aluminum, Stainless Steel and High Temperature Alloys.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUAD2000' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUAD2000'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_quad2000_use_0', $u$Super Positive Square Milling Inserts for Machining Aluminum, Stainless Steel and High Temperature Alloys$u$, $u$Inserts$u$, 0, $u$[{"name": "QPMR 1004-HQ-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=879&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_quad2000_use_1', $u$Insert with 4 Right- or Left-Hand Cutting Edges for General Use$u$, $u$Inserts$u$, 1, $u$[{"name": "QOMT-HQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1074&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_quad2000_use_2', $u$Neutral Insert with Reinforced Land for Slotting$u$, $u$Inserts$u$, 2, $u$[{"name": "QPMT 100408PDTN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1090&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUAD2000'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- X-QUAD
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_xquad', 'X-QUAD', 'Milling', $u$X-QUAD: indexable milling tools and inserts from the ISCAR milling catalog, such as extended Flute Shell Mills Carrying SDHW/T 100408... Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'XQUAD')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$X-QUAD: indexable milling tools and inserts from the ISCAR milling catalog, such as extended Flute Shell Mills Carrying SDHW/T 100408... Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'XQUAD' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'XQUAD'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_xquad_use_0', $u$Extended Flute Shell Mills Carrying SDHW/T 100408... Inserts$u$, $u$Extended flute cutters$u$, 0, $u$[{"name": "SDK-10-C/HP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3856&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_xquad_use_1', $u$Square Inserts for General Use Applications Carried On SDK Extended Flute Cutters.$u$, $u$Extended flute cutters$u$, 1, $u$[{"name": "SDHT/HW/MT 1004", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3857&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_xquad_use_2', $u$Extended Flute Shell Mills Carrying SDHT 1205... Inserts$u$, $u$Extended flute cutters$u$, 2, $u$[{"name": "SDK-12-C/HP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4199&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_xquad_use_3', $u$Square Inserts for Machining Titanium, High Temperature Alloys and Stainless Steel$u$, $u$Inserts$u$, 3, $u$[{"name": "SDHT/X 120508", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4200&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'XQUAD'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- HELI-3-MILL
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_heli3mill', 'HELI-3-MILL', 'Milling', $u$HELI-3-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as triangular Inserts with 3 Helical Cutting Edges for 90° Shoulder Accuracy.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELI3MILL')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$HELI-3-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as triangular Inserts with 3 Helical Cutting Edges for 90° Shoulder Accuracy.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELI3MILL' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELI3MILL'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_heli3mill_use_0', $u$Triangular Inserts with 3 Helical Cutting Edges for 90° Shoulder Accuracy$u$, $u$Inserts$u$, 0, $u$[{"name": "HM390 TDKT/CT 1505", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3332&mapp=ML&GFSTYP=M"}, {"name": "HM390 TPKT/CT 1003", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3337&mapp=ML&GFSTYP=M"}, {"name": "HM390 TCKT/CT 0703", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3514&mapp=ML&GFSTYP=M"}, {"name": "HM390 TDKT 1907", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3646&mapp=ML&GFSTYP=M"}, {"name": "HM390 TPKT/CT 0502", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4269&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli3mill_use_1', $u$Triangular Inserts with 3 Helical Cutting Edges Feature Positive and Polished Rake for Machining Non-Ferrous Materials$u$, $u$Inserts$u$, 1, $u$[{"name": "HM390 TDCR 1505", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4635&mapp=ML&GFSTYP=M"}, {"name": "HM390 TPCR 1003", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5496&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli3mill_use_2', $u$90° Face Mills Carrying HM390 TDKT 1505 Triangular Inserts with 3 Helical Cutting Edges$u$, $u$Face mills$u$, 2, $u$[{"name": "HM390 FTD-15", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3333&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli3mill_use_3', $u$90° Face Mills Carrying HM390 TPKT 1003 Triangular Inserts with 3 Helical Cutting Edges$u$, $u$Face mills$u$, 3, $u$[{"name": "HM390 FTP-10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3339&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli3mill_use_4', $u$90° Face Mills Carrying HM390 TCKT 0703 Triangular Inserts with 3 Helical Cutting Edges$u$, $u$Face mills$u$, 4, $u$[{"name": "HM390 FTC-07", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3561&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli3mill_use_5', $u$90° Face Mills Carrying HM390 TDKT 1907 Triangular Inserts with 3 Helical Cutting Edges$u$, $u$Face mills$u$, 5, $u$[{"name": "HM390 FTD-19", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3645&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli3mill_use_6', $u$90° JHP Face Mill with HM390 Triangular Inserts$u$, $u$Face mills$u$, 6, $u$[{"name": "HM390 FTP/C/D-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5360&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli3mill_use_7', $u$90° Endmills Carrying HM390 TDKT 1505 Triangular Inserts with 3 Helical Cutting Edges$u$, $u$Endmills$u$, 7, $u$[{"name": "HM390 ETD-15", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3334&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli3mill_use_8', $u$90° Endmills Carrying HM390 TPKT 1003 Triangular Inserts with 3 Helical Cutting Edges$u$, $u$Endmills$u$, 8, $u$[{"name": "HM390 ETP-10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3338&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli3mill_use_9', $u$90° Endmills Carrying HM390 TCKT 0703 Triangular Inserts with 3 Helical Cutting Edges$u$, $u$Endmills$u$, 9, $u$[{"name": "HM390 ETC-07", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3515&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli3mill_use_10', $u$90° Endmills with a FLEXFIT Threaded Adaptation Carrying HM90 TPKT 1003... Inserts with 3 Helical Cutting Edges$u$, $u$Endmills$u$, 10, $u$[{"name": "HM390 ETP-M-10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3589&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli3mill_use_11', $u$90° Endmills with a FLEXFIT Threaded Adaptation Carrying HM390 TDKT 1505 Triangular Inserts$u$, $u$Endmills$u$, 11, $u$[{"name": "HM390 ETD-M-15", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3590&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli3mill_use_12', $u$90° Endmills with a MULTI-MASTER Threaded Adaptation Carrying HM390 TCKT 0703 Triangular Inserts$u$, $u$Endmills$u$, 12, $u$[{"name": "HM390 ETC-MM-07", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3591&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli3mill_use_13', $u$90° Endmills Carrying HM390 TDKT 1907 Triangular Inserts with 3 Helical Cutting Edges$u$, $u$Endmills$u$, 13, $u$[{"name": "HM390 ETD-19", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3644&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli3mill_use_14', $u$90° Endmills with CAMFIX Shanks Carrying HM390 TPKT 1003 Triangular Inserts with 3 Helical Cutting Edges$u$, $u$Endmills$u$, 14, $u$[{"name": "HM390 ETP-C#-10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3724&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli3mill_use_15', $u$Chamfering Endmill with an Adjustable Edge Angle$u$, $u$Endmills$u$, 15, $u$[{"name": "HM390 E10-80-07", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3842&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli3mill_use_16', $u$90° Endmills Carrying HM390 TPKT 0502 Triangular Inserts with 3 Helical Cutting Edges$u$, $u$Endmills$u$, 16, $u$[{"name": "HM390 ETP-05", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4267&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli3mill_use_17', $u$90° Endmills with a MULTI-MASTER Threaded Adaptation Carrying HM390 TPKT 0502... Triangular Inserts$u$, $u$Endmills$u$, 17, $u$[{"name": "HM390 ETP-MM-05", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4272&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli3mill_use_18', $u$90° JHP endmill with a MULTI-MASTER threaded adaptation$u$, $u$Endmills$u$, 18, $u$[{"name": "HM390 ETP/C/D-MM-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5363&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli3mill_use_19', $u$90° JHP endmill with a FLEXFIT threaded adaptation$u$, $u$Endmills$u$, 19, $u$[{"name": "HM390 ETP/C/D-M-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5422&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli3mill_use_20', $u$Extended Flute Endmills Carrying HM390 TPKT 1003 Triangular Inserts with 3 Helical Cutting Edges$u$, $u$Extended flute cutters$u$, 20, $u$[{"name": "HM390 TPK-10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4536&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli3mill_use_21', $u$Extended Flute Shell Mills Carrying HM390 TPKT 1003 Triangular Inserts with 3 Helical Cutting Edges$u$, $u$Extended flute cutters$u$, 21, $u$[{"name": "HM390 SM-10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4538&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELI3MILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- NAN-MILL
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_nanmill', 'NAN-MILL', 'Milling', $u$NAN-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as 90° Small Diameter Endmills Carrying HM390 TPKR 0401 Triangular Inserts with 3 Helical Cutting Edges.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'NANMILL')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$NAN-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as 90° Small Diameter Endmills Carrying HM390 TPKR 0401 Triangular Inserts with 3 Helical Cutting Edges.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'NANMILL' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'NANMILL'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_nanmill_use_0', $u$90° Small Diameter Endmills Carrying HM390 TPKR 0401 Triangular Inserts with 3 Helical Cutting Edges$u$, $u$Endmills$u$, 0, $u$[{"name": "HM390 ETP-04", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4264&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_nanmill_use_1', $u$90° Endmills with a MULTI-MASTER Threaded Adaptation Carrying HM390 TPKR 0401... Triangular Inserts$u$, $u$Endmills$u$, 1, $u$[{"name": "HM390 ETP-MM-04", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4344&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_nanmill_use_2', $u$Triangular Miniature Inserts with 3 Helical Cutting Edges for 90° Shoulders$u$, $u$Inserts$u$, 2, $u$[{"name": "HM390 TPKR 0401", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4266&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'NANMILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- HELI-PLUS
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_heliplus', 'HELI-PLUS', 'Milling', $u$HELI-PLUS: indexable milling tools and inserts from the ISCAR milling catalog, such as 90° Face Mills Carrying HP ANKT 0702.. Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELIPLUS')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$HELI-PLUS: indexable milling tools and inserts from the ISCAR milling catalog, such as 90° Face Mills Carrying HP ANKT 0702.. Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELIPLUS' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELIPLUS'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_heliplus_use_0', $u$90° Face Mills Carrying HP ANKT 0702.. Inserts$u$, $u$Face mills$u$, 0, $u$[{"name": "HP F90AN-07", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1687&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliplus_use_1', $u$90° Face Mills Carrying HP AD.. 2207... Long Edged Inserts$u$, $u$Face mills$u$, 1, $u$[{"name": "HP F90AT-22", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1708&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliplus_use_2', $u$90° Face Mills Carrying HP AD.. 1906... Long Edged Inserts$u$, $u$Face mills$u$, 2, $u$[{"name": "HP F90AT-19", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2318&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliplus_use_3', $u$Inserts with Two 22 mm Long Cutting Edges for General High Shoulder Milling$u$, $u$Inserts$u$, 3, $u$[{"name": "HP ADKT/ADCT 2207", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1703&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliplus_use_4', $u$Milling Inserts with a Very Positive and Polished Rake for Machining Aluminum$u$, $u$Inserts$u$, 4, $u$[{"name": "HP ADCR 2207", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1744&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliplus_use_5', $u$Peripherally Ground Inserts with a Super Positive Chipformer for Machining Aluminum, Titanium and Magnesium$u$, $u$Inserts$u$, 5, $u$[{"name": "HP ANCR 0702PNFR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1870&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliplus_use_6', $u$Insert with a 7 mm Helical Edge and Flat Rake for Rough Machining and Hardened Steel$u$, $u$Inserts$u$, 6, $u$[{"name": "HP ANKW 070204PNTR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2222&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliplus_use_7', $u$Inserts with a 7 mm Helical Edge and Various Corner Radii for General Use$u$, $u$Inserts$u$, 7, $u$[{"name": "HP ANKT/ANCT 0702 PN-R/PNTR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2223&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliplus_use_8', $u$Milling Inserts with 19 mm Cutting Edge for Machining Aluminum$u$, $u$Inserts$u$, 8, $u$[{"name": "HP ADCR 1906", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2312&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliplus_use_9', $u$Milling Inserts with 19 mm Cutting Edge for General Use$u$, $u$Inserts$u$, 9, $u$[{"name": "HP ADKT/ADCT 1906", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2313&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliplus_use_10', $u$Inserts for Fast Feed Milling$u$, $u$Inserts$u$, 10, $u$[{"name": "HP ANKT 0702-FF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3640&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliplus_use_11', $u$Endmills with HELIPLUS HP ANKT 0702.. Inserts$u$, $u$Endmills$u$, 11, $u$[{"name": "HP E90AN-07", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1835&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliplus_use_12', $u$90° Endmills with a FLEXFIT Threaded Adaptation Carrying HELIPLUS HP ANKT 0702.. Inserts$u$, $u$Endmills$u$, 12, $u$[{"name": "HP E90AN-M-07", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1944&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliplus_use_13', $u$90° Endmills with a MULTI-MASTER Threaded Adaptation Carrying HELIPLUS HP ANKT 0702.. Inserts$u$, $u$Endmills$u$, 13, $u$[{"name": "HP E90AN-MM-07", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2197&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliplus_use_14', $u$90° Endmills Carrying HP AD.. 1906.. Inserts$u$, $u$Endmills$u$, 14, $u$[{"name": "HP E90AT-19", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2314&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliplus_use_15', $u$Extended Flute Endmills Carrying HP ANK-07... Inserts$u$, $u$Extended flute cutters$u$, 15, $u$[{"name": "HP ANK-07", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1910&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliplus_use_16', $u$90° Milling Heads with a TS Threaded Adaptation Carrying HELIPLUS HP ANKT 0702.. Inserts$u$, $u$Tools$u$, 16, $u$[{"name": "TS HP E90AN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3123&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELIPLUS'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- HELI-TANG
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_helitang', 'HELI-TANG', 'Milling', $u$HELI-TANG: indexable milling tools and inserts from the ISCAR milling catalog, such as 90° Endmills with a MULTI-MASTER Threaded Adaptation Carrying Tangentially Clamped Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELITANG')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$HELI-TANG: indexable milling tools and inserts from the ISCAR milling catalog, such as 90° Endmills with a MULTI-MASTER Threaded Adaptation Carrying Tangentially Clamped Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELITANG' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELITANG'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_helitang_use_0', $u$90° Endmills with a MULTI-MASTER Threaded Adaptation Carrying Tangentially Clamped Inserts$u$, $u$Endmills$u$, 0, $u$[{"name": "T490 ELN-MM-08", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2524&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_1', $u$90° Endmills Carrying Tangentially Clamped Inserts with 4 Helical, 8 mm Long Cutting Edges$u$, $u$Endmills$u$, 1, $u$[{"name": "T490 ELN-08", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2731&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_2', $u$90° Endmills Carrying Tangentially Clamped Inserts with 4 Helical, 12.5 mm Long Cutting Edges$u$, $u$Endmills$u$, 2, $u$[{"name": "T490 ELN-13", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2760&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_3', $u$90° Endmills Carrying Tangentially Clamped Inserts with 4 Helical, 12.5 mm Long Cutting Edges with a CLICKFIT Adaptation$u$, $u$Endmills$u$, 3, $u$[{"name": "T490 ELN-CF-13", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2762&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_4', $u$90° Endmills with a FLEXFIT Threaded Adaptation Carrying Tangentially Clamped Inserts$u$, $u$Endmills$u$, 4, $u$[{"name": "T490 ELN-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2837&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_5', $u$90° Endmills with CAMFIX Shanks Carrying Tangentially Clamped Inserts with 4 Helical, 12.5 mm Long Cutting Edges$u$, $u$Endmills$u$, 5, $u$[{"name": "T490 ELN-C#-13", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3072&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_6', $u$90° Endmills Carrying T490 LN#T 11... Tangentially Clamped Inserts$u$, $u$Endmills$u$, 6, $u$[{"name": "T490 ELN-11", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3672&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_7', $u$Endmills with a FLEXFIT Threaded Adaptation Carrying Tangentially Clamped Inserts$u$, $u$Endmills$u$, 7, $u$[{"name": "T490 LNK-M-13", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3746&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_8', $u$90° Endmills with a MULTI-MASTER Threaded Adaptation Carrying Tangentially Clamped Inserts with 4 Helical Cutting Edges$u$, $u$Endmills$u$, 8, $u$[{"name": "T490 ELN-MM-05", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5311&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_9', $u$90° Endmills Carrying Tangentially Clamped Inserts with 4 Helical Cutting Edges$u$, $u$Endmills$u$, 9, $u$[{"name": "T490 ELN-05", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5312&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_10', $u$Tangentially Clamped Inserts with 4 Helical Cutting Edges$u$, $u$Inserts$u$, 10, $u$[{"name": "T490 LNMT/LNHT/LNAR 1306", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2526&mapp=ML&GFSTYP=M"}, {"name": "T490 LNMT/LNHT 0804", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2756&mapp=ML&GFSTYP=M"}, {"name": "T490 LNMT/LNHT 1607", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2776&mapp=ML&GFSTYP=M"}, {"name": "T490 LNMT/LNHT 2212", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3435&mapp=ML&GFSTYP=M"}, {"name": "T490 LNMT/LNHT 1106", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3675&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_11', $u$Tangentially Clamped Inserts with 4 Cutting Edges for Plunging and Fast Feed Facing$u$, $u$Inserts$u$, 11, $u$[{"name": "FTP LNHT 1006", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3062&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_12', $u$Tangentially Clamped Precision Ground Inserts with a Super Positive Rake for Machining Aluminum$u$, $u$Inserts$u$, 12, $u$[{"name": "T490 LNAR-P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3074&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_13', $u$Tangentially Clamped Peripherally Ground Inserts with 2 Positive Rake Cutting Edges for Finishing Applications$u$, $u$Inserts$u$, 13, $u$[{"name": "FIN LNAT 1607PN-R", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3540&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_14', $u$Tangentially Clamped Inserts with 4 Serrated and Helical Cutting Edges$u$, $u$Inserts$u$, 14, $u$[{"name": "T490 LNMT 1306PNTR-FW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3813&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_15', $u$Tangentially Clamped Inserts with 2 Cutting Edges for Fast Feed Milling$u$, $u$Inserts$u$, 15, $u$[{"name": "T490 LNMT 1306PNR-FF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3849&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_16', $u$Extended Flute Shell Mills Carrying T490 LNMT/HT 1306... Tangentially Clamped Inserts$u$, $u$Extended flute cutters$u$, 16, $u$[{"name": "T490 SM-13", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2608&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_17', $u$Extended Flute Endmills Carrying T490 LNMT/HT 13... Tangentially Clamped Inserts$u$, $u$Extended flute cutters$u$, 17, $u$[{"name": "T490 LNK-13", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2610&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_18', $u$Extended Flute Endmills with CLICKFIT Shanks Carrying T490 LNMT/HT 1306... Tangentially Clamped Inserts$u$, $u$Extended flute cutters$u$, 18, $u$[{"name": "T490 LNK-13-CF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2612&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_19', $u$Extended Flute Endmills Carrying T490 LNMT/HT 08... Tangentially Clamped Inserts$u$, $u$Extended flute cutters$u$, 19, $u$[{"name": "T490 LNM-08", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2725&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_20', $u$Extended Flute Endmills with CAMFIX Shanks Carrying T490 LNMT/HT 13... Tangentially Clamped Inserts$u$, $u$Extended flute cutters$u$, 20, $u$[{"name": "T490 LNK-13-C#", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3073&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_21', $u$Extended Flute Endmills with BT MAS-403 Tapered Shanks Carrying T490 LNMT/HT 13... Tangentially Clamped Inserts$u$, $u$Extended flute cutters$u$, 21, $u$[{"name": "T490 LNK-13-BT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3164&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_22', $u$Extended Flute Endmills with DIN69871 Tapered Shanks Carrying T490 LNMT/HT 13... Tangentially Clamped Inserts$u$, $u$Extended flute cutters$u$, 22, $u$[{"name": "T490 LNK-13-INT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3200&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_23', $u$Extension Units for Modular Extended Flute Shell Mills$u$, $u$Extended flute cutters$u$, 23, $u$[{"name": "T490 CAP-13FT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3292&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_24', $u$Basic Units for Modular Extended Flute Shell Mills$u$, $u$Extended flute cutters$u$, 24, $u$[{"name": "T490 SM-13FT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3293&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_25', $u$Conical Extended Flute Shell Mills Carrying T490 LNMT/LNHT 13... Tangentially Clamped Inserts$u$, $u$Extended flute cutters$u$, 25, $u$[{"name": "T4..-SM Conical Shell Mills", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3452&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_26', $u$Extended Flute Shell Mills Carrying T490 LNMT/HT 0804... Tangentially Clamped Inserts$u$, $u$Extended flute cutters$u$, 26, $u$[{"name": "T490 SM-08", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3490&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_27', $u$Basic Units of Modular Extended Flute Endmills with DIN 69871 Tapered Shanks Carrying T490 LNMT/HT 1306 Inserts$u$, $u$Extended flute cutters$u$, 27, $u$[{"name": "T490 LNK-INT50-FT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3491&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_28', $u$Basic Units of Modular Extended Flute Endmills with BT MAS-403 Tapered Shanks Carrying T490 LNMT/HT 1306 Inserts$u$, $u$Extended flute cutters$u$, 28, $u$[{"name": "T490 LNK-BT-FT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3492&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_29', $u$Extended Flute Endmills with Tangentially Clamped Inserts and DIN69871 Shanks for Semi-Finishing Long Shoulders$u$, $u$Extended flute cutters$u$, 29, $u$[{"name": "FIN LNK-INT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3537&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_30', $u$Extended Flute Endmills with Tangentially Clamped Inserts and BT MAS-403 Shanks for Semi-Finishing Long Shoulders$u$, $u$Extended flute cutters$u$, 30, $u$[{"name": "FIN LNK-BT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3594&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_31', $u$Extended Flute Endmills Carrying T490 LN#T 11... Tangentially Clamped Inserts$u$, $u$Extended flute cutters$u$, 31, $u$[{"name": "T490 LNK-11", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3673&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_32', $u$Extended Flute Shell Mills Carrying T490 LN#T 11... Tangentially Clamped Inserts$u$, $u$Extended flute cutters$u$, 32, $u$[{"name": "T490 SM-11", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3674&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_33', $u$Extended Flute Endmills with a FLEXFIT Threaded Adaptation Carrying Tangentially Clamped Inserts$u$, $u$Extended flute cutters$u$, 33, $u$[{"name": "T490 LNM-M-08", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3745&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_34', $u$90° Face Mills Carrying Tangentially Clamped Inserts with 4 Helical 13mm Long Cutting Edges$u$, $u$Face mills$u$, 34, $u$[{"name": "T490 FLN-13", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2644&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_35', $u$90° Face Mills Carrying Tangentially Clamped Inserts with 4 Helical 16mm Long Cutting Edges$u$, $u$Face mills$u$, 35, $u$[{"name": "T490 FLN-16", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2741&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_36', $u$90° Face Mills with Tangentially Clamped Inserts$u$, $u$Face mills$u$, 36, $u$[{"name": "T490 FLN-08", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2745&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_37', $u$90° Face Mills Carrying Tangentially Clamped Inserts with 4 Helical 21 mm Long Cutting Edges$u$, $u$Face mills$u$, 37, $u$[{"name": "T490 FLN-22ST", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3434&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_38', $u$65° Face Mills Carrying Tangentially Clamped Inserts with 4 Helical Cutting Edges$u$, $u$Face mills$u$, 38, $u$[{"name": "T465 FLN-22ST", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3439&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_39', $u$90° Face Mills Carrying T290 LNMT/LNHT 1106... Tangentially Clamped Inserts$u$, $u$Face mills$u$, 39, $u$[{"name": "T490 FLN-11", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3676&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_40', $u$90° Face Mills with a SP Connection Carrying Tangentially Clamped Inserts with 4 Helical Cutting Edges$u$, $u$Face mills$u$, 40, $u$[{"name": "T490 FM-05", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5313&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_41', $u$Tangentially Clamped Inserts with 4 Cutting Edges for 65° Cutters$u$, $u$Tools$u$, 41, $u$[{"name": "T465 LNHT/LNMT 2212", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3056&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_42', $u$Fast Feed Shell Mill Carrying Tangentially Clamped Inserts with 4 Cutting Edges$u$, $u$Shell mills$u$, 42, $u$[{"name": "FTP-LN10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3061&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_43', $u$Full Slot Adjustable Slotting Cutters with Cartridges Carrying T490 LNHT 1306PNTR/L Inserts (17.5-23.0 mm width range)$u$, $u$Slotting & slitting cutters$u$, 43, $u$[{"name": "FDN-CALN13", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3508&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helitang_use_44', $u$Full Slot Adjustable Slotting Cutters with Cartridges Carrying T490 LNHT 1306PNTR/L Inserts$u$, $u$Slotting & slitting cutters$u$, 44, $u$[{"name": "SDN-CALN13", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3510&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELITANG'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- SUMO-MILL
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_sumomill', 'SUMO-MILL', 'Milling', $u$SUMO-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as endmills Carrying Tangentially Clamped Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOMILL')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$SUMO-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as endmills Carrying Tangentially Clamped Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOMILL' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOMILL'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_sumomill_use_0', $u$Endmills Carrying Tangentially Clamped Inserts$u$, $u$Endmills$u$, 0, $u$[{"name": "T290 ELN-05", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2785&mapp=ML&GFSTYP=M"}, {"name": "T290 ELN-10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2841&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_sumomill_use_1', $u$Endmills with a MULTI-MASTER Adaptation Carrying Tangentially Clamped Inserts$u$, $u$Endmills$u$, 1, $u$[{"name": "T290 ELN-MM-05", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2844&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_sumomill_use_2', $u$Tangential Inserts with 2 Cutting Edges$u$, $u$Inserts$u$, 2, $u$[{"name": "T290 LNMT/LNHT 0502", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2787&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_sumomill_use_3', $u$Tangential Insert with 2 Cutting Edges$u$, $u$Inserts$u$, 3, $u$[{"name": "T290 LNMT/LNHT 1004", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2856&mapp=ML&GFSTYP=M"}, {"name": "T290 LNMT 1506", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3059&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_sumomill_use_4', $u$Extended Flute Endmills with T290 LNMT/HT 0502... Tangentially Clamped Inserts$u$, $u$Extended flute cutters$u$, 4, $u$[{"name": "T290 LNK-05", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2824&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_sumomill_use_5', $u$Extended Flute Shell Mills with T290 LNMT 1506... Tangentially Clamped Inserts$u$, $u$Extended flute cutters$u$, 5, $u$[{"name": "T290 SM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3318&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_sumomill_use_6', $u$Extended Flute Endmills Carrying T290 LNMT/LNHT 1004... Tangentially Clamped Inserts$u$, $u$Extended flute cutters$u$, 6, $u$[{"name": "T290 LNK-10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5440&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_sumomill_use_7', $u$90° Face Mills Carrying T290 LNMT 1506... Tangentially Clamped Inserts$u$, $u$Face mills$u$, 7, $u$[{"name": "T290 FLN-15", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2845&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_sumomill_use_8', $u$90° Face Mills Carrying T290 LNMT/LNHT 1004... Tangentially Clamped Inserts$u$, $u$Face mills$u$, 8, $u$[{"name": "T290 FLN-10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3060&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOMILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- ISCAR-MILL
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_iscarmill', 'ISCAR-MILL', 'Milling', $u$ISCAR-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as 30° Chamfering Endmills.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARMILL')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$ISCAR-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as 30° Chamfering Endmills.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARMILL' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARMILL'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_iscarmill_use_0', $u$30° Chamfering Endmills$u$, $u$Endmills$u$, 0, $u$[{"name": "E30 / T230", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=98&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_1', $u$45° Chamfering Endmills$u$, $u$Endmills$u$, 1, $u$[{"name": "E45 / T245", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=99&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_2', $u$60° Chamfering Endmills$u$, $u$Endmills$u$, 2, $u$[{"name": "E60 / T260", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=102&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_3', $u$45° Endmills with SEKN/R 12... Inserts$u$, $u$Endmills$u$, 3, $u$[{"name": "F45E (endmill)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=131&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_4', $u$45° Screw Clamped Endmills with SEK/MT 12... Inserts$u$, $u$Endmills$u$, 4, $u$[{"name": "F45ST (endmill)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=133&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_5', $u$Inserts for General Use on 45° Endmills$u$, $u$Endmills$u$, 5, $u$[{"name": "SDMT-AD-N", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=344&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_6', $u$T-Slot Endmills$u$, $u$Slotting & slitting cutters$u$, 6, $u$[{"name": "ETS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=129&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_7', $u$Bottom-Side Cutting, Flanged Type Slotting Cutters$u$, $u$Slotting & slitting cutters$u$, 7, $u$[{"name": "FSB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=724&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_8', $u$Top-Side Cutting, Flanged Type Slotting Cutters$u$, $u$Slotting & slitting cutters$u$, 8, $u$[{"name": "FST", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=725&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_9', $u$Single-Side Cutting, Disk Type Slotting Cutters$u$, $u$Slotting & slitting cutters$u$, 9, $u$[{"name": "SSB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=726&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_10', $u$Flange Type Full Width Slotting Cutters Carrying Round and Octagonal Inserts$u$, $u$Slotting & slitting cutters$u$, 10, $u$[{"name": "FDN-CM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1033&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_11', $u$90° Face Mills Carrying TPKN/R Inserts$u$, $u$Face mills$u$, 11, $u$[{"name": "F90", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=137&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_12', $u$Flat Rake Face Milling Inserts for General Use$u$, $u$Face mills$u$, 12, $u$[{"name": "SEKN-AF..", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=349&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_13', $u$45° Face Mills Carrying SEKN/R 12... Inserts$u$, $u$Face mills$u$, 13, $u$[{"name": "F45E", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2515&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_14', $u$45° Screw Clamped Face Mills Carrying SEK/MT 12... Inserts$u$, $u$Face mills$u$, 14, $u$[{"name": "F45ST", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2753&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_15', $u$75° Face Mills with SPKN/SPKR 1203.. Inserts$u$, $u$Face mills$u$, 15, $u$[{"name": "F75-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4547&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_16', $u$Flat Rake Milling Inserts for General Use$u$, $u$Inserts$u$, 16, $u$[{"name": "SEAN-AF..", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=347&mapp=ML&GFSTYP=M"}, {"name": "SPKN ED..", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=410&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_17', $u$Precision Ground Sharp Cutting Edge Milling Inserts for General Use$u$, $u$Inserts$u$, 17, $u$[{"name": "SEHW-AFTN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=348&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_18', $u$Super Positive Square Milling Inserts for 45° Finishing and Medium Machining Soft Materials$u$, $u$Inserts$u$, 18, $u$[{"name": "SEKR-AF-N-42", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=350&mapp=ML&GFSTYP=M"}, {"name": "SEKT-AF-R", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=353&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_19', $u$Square Milling Inserts with Ribs Along Edges for 45° Roughing Applications$u$, $u$Inserts$u$, 19, $u$[{"name": "SEKR-AF..-76", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=351&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_20', $u$Square Milling Inserts with Chip Splitting Serrated Cutting Edge for 45° Roughing Applications$u$, $u$Inserts$u$, 20, $u$[{"name": "SEKR-AFTR-HS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=352&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_21', $u$Flat Rake Square Milling Inserts, for 45° General Use$u$, $u$Inserts$u$, 21, $u$[{"name": "SEMW 1204AFTN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=356&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_22', $u$11° Positive Triangular Milling Inserts for General Use$u$, $u$Inserts$u$, 22, $u$[{"name": "TPKN/TPKR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=459&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_23', $u$Positive Rake Round Milling Inserts for Rough Operations$u$, $u$Inserts$u$, 23, $u$[{"name": "RXMT 10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=717&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_24', $u$Square Milling Inserts with Ribs Along the Edges for 45° Roughing$u$, $u$Inserts$u$, 24, $u$[{"name": "SPKR ED..-76", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=720&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_25', $u$Milling Inserts with Ribs Along Edges for Heavy Machining$u$, $u$Inserts$u$, 25, $u$[{"name": "SEMT 12..AFTN-76", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=877&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_26', $u$Square Screw-Clamped Inserts for Medium Machining$u$, $u$Inserts$u$, 26, $u$[{"name": "SEKT-AFTN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1050&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_27', $u$Precision Ground Flat Rake Round Milling Inserts$u$, $u$Inserts$u$, 27, $u$[{"name": "RXCW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1072&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_28', $u$Precision Ground Positive Rake Round Milling Inserts$u$, $u$Inserts$u$, 28, $u$[{"name": "RXCR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1073&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_29', $u$Helical Long Edge Finishing Milling Inserts$u$, $u$Inserts$u$, 29, $u$[{"name": "MTH-F", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2530&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarmill_use_30', $u$Precision Ground Sharp Cutting Edged General Use Milling Inserts for 45° Milling Cutters$u$, $u$Tools$u$, 30, $u$[{"name": "SEHT-AFN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1526&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARMILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- HELI-DO
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_helido', 'HELI-DO', 'Milling', $u$HELI-DO: indexable milling tools and inserts from the ISCAR milling catalog, such as 45° Face Mills Carrying Economical Inserts with 8 Helical Right-Hand Cutting Edges.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELIDO')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$HELI-DO: indexable milling tools and inserts from the ISCAR milling catalog, such as 45° Face Mills Carrying Economical Inserts with 8 Helical Right-Hand Cutting Edges.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELIDO' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELIDO'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_helido_use_0', $u$45° Face Mills Carrying Economical Inserts with 8 Helical Right-Hand Cutting Edges$u$, $u$Face mills$u$, 0, $u$[{"name": "S845 F45SX-16", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2268&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_1', $u$90° Face Mills Carrying H490 ANKX 17.. Double-Sided Rectangular Inserts with 4 Helical Cutting Edges$u$, $u$Face mills$u$, 1, $u$[{"name": "H490 F90AX-17", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2382&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_2', $u$Multifunction Face Mills for Octagonal, Square and Round Insert Contours with Various Entry Angles$u$, $u$Face mills$u$, 2, $u$[{"name": "SOF45", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2541&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_3', $u$90° Face Mills Carrying H490 ANKX 12.. Double-Sided Rectangular Inserts with 4 Helical Cutting Edges$u$, $u$Face mills$u$, 3, $u$[{"name": "H490 F90AX-12", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2687&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_4', $u$90° Face Mills Carrying H490 ANKX 09.. Double-Sided Rectangular Inserts with 4 Helical Cutting Edges$u$, $u$Face mills$u$, 4, $u$[{"name": "H490 F90AX-09", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2902&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_5', $u$65° Face Mills Carrying Inserts with 8 Cutting Edges$u$, $u$Face mills$u$, 5, $u$[{"name": "S865 FSN-13", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2980&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_6', $u$Face Mills Carrying Double-Sided Inserts with Four 6 mm Radius Cutting Edges$u$, $u$Face mills$u$, 6, $u$[{"name": "H400 FR-12", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3020&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_7', $u$Face Mills Carrying Double Sided Square Inserts with 8 Cutting Edges$u$, $u$Face mills$u$, 7, $u$[{"name": "S890 FSN-13", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3108&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_8', $u$Face Mills Carrying Double-Sided Inserts with Four 5 mm Radius Cutting Edges$u$, $u$Face mills$u$, 8, $u$[{"name": "H400 FR-10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3142&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_9', $u$Face Mills Carrying Double-Sided Inserts with Four 8 mm Radius Cutting Edges$u$, $u$Face mills$u$, 9, $u$[{"name": "H400 FR-16", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3143&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_10', $u$45° Extra Fine Pitch Face Mills with Wedge Clamped Inserts, Carrying Square or Octagonal Inserts with 8/16 Cutting Edges$u$, $u$Face mills$u$, 10, $u$[{"name": "SOF45CL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3154&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_11', $u$Face Mills Carrying Double-Sided Round Inserts with Six Cutting Edges$u$, $u$Face mills$u$, 11, $u$[{"name": "H606 FR-12", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3279&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_12', $u$90° Face Mills Carrying H690 TNKX 1606.. Triangular Inserts with 6 Helical Cutting Edges$u$, $u$Face mills$u$, 12, $u$[{"name": "H690 F90AX-16", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3340&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_13', $u$Heavy Duty 45° Face Mills Carrying Square or Octagonal Double-Sided Inserts with 8/16 Cutting Edges$u$, $u$Face mills$u$, 13, $u$[{"name": "SOF45-26", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3345&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_14', $u$90° Face Mills Carrying H690 TNKX 1005.. Triangular Inserts with 6 Helical Cutting Edges$u$, $u$Face mills$u$, 14, $u$[{"name": "H690 F90AX-10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3781&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_15', $u$45° Face Mills Carrying Square or Octagonal Double-Sided Inserts with 8/16 Cutting Edges$u$, $u$Face mills$u$, 15, $u$[{"name": "SOF45-R18", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3854&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_16', $u$Heavy Duty 45° Face Mills Carrying Wedge Clamped Square or Octagonal Double-Sided Inserts with 8/16 Cutting Edges$u$, $u$Face mills$u$, 16, $u$[{"name": "SOF45WG-R26", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4073&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_17', $u$Square Thick Inserts with 8 Helical Right-Hand Cutting Edges$u$, $u$Inserts$u$, 17, $u$[{"name": "S845 SXMU/SXCU-16", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2269&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_18', $u$Double-Sided Rectangular Inserts with 4 Helical Cutting Edges$u$, $u$Inserts$u$, 18, $u$[{"name": "H490 ANKX/ANCX-17", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2383&mapp=ML&GFSTYP=M"}, {"name": "H490 ANKX/ANCX-12", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2641&mapp=ML&GFSTYP=M"}, {"name": "H490 ANKX/ANCX-09", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2916&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_19', $u$Double-Sided Square Inserts with 8 Cutting Edges$u$, $u$Inserts$u$, 19, $u$[{"name": "S845 SNMU/SNHU-13", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2739&mapp=ML&GFSTYP=M"}, {"name": "S865 SNMU 1305ZNTR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2981&mapp=ML&GFSTYP=M"}, {"name": "S890 SNMU 1305PN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3109&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_20', $u$Octagonal Double-Sided Inserts with 16 Cutting Edges$u$, $u$Inserts$u$, 20, $u$[{"name": "ONHU/ONMU-05", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2740&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_21', $u$Single-Sided Rectangular Inserts with 2 Helical Cutting Edges for Fast Feed Milling at Small Depths of Cut$u$, $u$Inserts$u$, 21, $u$[{"name": "H490 ANKX 1706-FF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2767&mapp=ML&GFSTYP=M"}, {"name": "H490 ANKX/ANCX 1205-FF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3036&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_22', $u$HELIDO Wiper Insert with a Single Cutting Edge$u$, $u$Inserts$u$, 22, $u$[{"name": "S845 SXHU 1606-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2946&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_23', $u$Double-Sided Wiper Inserts with 4 Cutting Edges$u$, $u$Inserts$u$, 23, $u$[{"name": "S845 SNHU 1305-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2947&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_24', $u$Double-Sided Octagonal Wiper Inserts with 4 or 8 Cutting Edges$u$, $u$Inserts$u$, 24, $u$[{"name": "ONHU 0505-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2948&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_25', $u$Double-Sided Inserts with Four 5, 6 and 8 mm Radii Cutting Edges for Profile Milling$u$, $u$Inserts$u$, 25, $u$[{"name": "H400 RNHU", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3024&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_26', $u$Double-Sided Round Inserts with Six Cutting Edges for Profile Milling$u$, $u$Inserts$u$, 26, $u$[{"name": "H606 RXCU 1206", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3280&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_27', $u$Octagonal High Feed 45° Inserts$u$, $u$Inserts$u$, 27, $u$[{"name": "OXMT 0507", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3285&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_28', $u$Round Milling Inserts$u$, $u$Inserts$u$, 28, $u$[{"name": "RXMT 1607", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3286&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_29', $u$Double-Sided Rectangular Inserts with 4 Helical Cutting Edges for Fast Feed Milling at Small Depths of Cut$u$, $u$Inserts$u$, 29, $u$[{"name": "H490 ANKX 0904-FF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3288&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_30', $u$Triangular Inserts with 6 Helical Cutting Edges for 90° Shoulders$u$, $u$Inserts$u$, 30, $u$[{"name": "H690 TNKX 1606", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3341&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_31', $u$Double-Sided Heavy Duty Octagonal Inserts with 16 Cutting Edges$u$, $u$Inserts$u$, 31, $u$[{"name": "ONMU 1008", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3346&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_32', $u$Heavy Duty Thick Square Inserts with 8 Helical Right-Hand Cutting Edges$u$, $u$Inserts$u$, 32, $u$[{"name": "S845 SNMU 2608", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3347&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_33', $u$Triangular Inserts with 6 Helical Cutting Edges for 90° Shoulder Accuracy$u$, $u$Inserts$u$, 33, $u$[{"name": "H690 TNKX/TNCX 1005", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3780&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_34', $u$Double-Sided Octagonal Inserts with 16 Cutting Edges$u$, $u$Inserts$u$, 34, $u$[{"name": "ONMU/ONHU 0706", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3855&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_35', $u$Square Inserts with 8 Helical Right-Hand Cutting Edges$u$, $u$Inserts$u$, 35, $u$[{"name": "S845 SNMU/SNHU 1806", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3860&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_36', $u$Wiper Insert with 2 R.H. and 2 L.H. Cutting Edges$u$, $u$Inserts$u$, 36, $u$[{"name": "S845 SNHU 1806AN-N-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3861&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_37', $u$Double-Sided Octagonal Wiper Inserts with 8 Right-Hand Cutting Edges$u$, $u$Inserts$u$, 37, $u$[{"name": "ONHU 0706AN-R-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3862&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_38', $u$90° Endmills Carrying H490 ANKX 17... Double-Sided Rectangular Inserts with 4 Helical Cutting Edges$u$, $u$Endmills$u$, 38, $u$[{"name": "H490 E90AX-17", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2384&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_39', $u$90° Endmills Carrying H490 ANKX 12...Double-Sided Rectangular Inserts with 4 Helical Cutting Edges$u$, $u$Endmills$u$, 39, $u$[{"name": "H490 E90AX-12", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2699&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_40', $u$Multifunctional Endmills for Octagonal, Square and Round Insert Contours with Several Entry Angles$u$, $u$Endmills$u$, 40, $u$[{"name": "SOE45 8/16", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2888&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_41', $u$90° Endmills with a FLEXFIT Threaded Connection Carrying H490 ANKX/ANCX 09...Double-Sided Rectangular Inserts$u$, $u$Endmills$u$, 41, $u$[{"name": "H490 E90AX-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2977&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_42', $u$90° Endmills with a MULTI-MASTER Threaded Connection Carrying H490 ANKX/ANCX 090...Double-Sided Rectangular Inserts$u$, $u$Endmills$u$, 42, $u$[{"name": "H490 E90AX-MM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2982&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_43', $u$Endmills with FLEXFIT Threaded Connection Carrying Double-Sided Inserts with Four Radius Cutting Edges$u$, $u$Endmills$u$, 43, $u$[{"name": "H400 ER-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3000&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_44', $u$Endmills Carrying Double-Sided Inserts with Four 6 mm Radius Cutting Edges$u$, $u$Endmills$u$, 44, $u$[{"name": "H400 ER-12", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3022&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_45', $u$90° Endmills Carrying H490 ANKX 09... Double-Sided Rectangular Inserts with 4 Helical Cutting Edges$u$, $u$Endmills$u$, 45, $u$[{"name": "H490 E90AX-09", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3057&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_46', $u$Endmills Carrying Double-Sided Inserts with Four 5 mm Radius Cutting Edges$u$, $u$Endmills$u$, 46, $u$[{"name": "H400 ER-10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3141&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_47', $u$Endmills with FLEXFIT Threaded Connection Carrying Double-Sided Inserts with Six Cutting Edges$u$, $u$Endmills$u$, 47, $u$[{"name": "H606 ER-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3704&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_48', $u$90° Endmills Carrying H690 TNKX 1005..Triangular Inserts with 6 Helical Cutting Edges$u$, $u$Endmills$u$, 48, $u$[{"name": "H690 E90AX-10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3783&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_49', $u$90° JHP Endmills with a FLEXFIT Threaded Adaptation and Pinpointed Coolant Outlets Carrying H690 WNMU 0705 Insert$u$, $u$Endmills$u$, 49, $u$[{"name": "H690 EWN-M-07-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5525&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_50', $u$Extended Flute Shell Mills Carrying H490 ANKX 17.. Double-Sided Rectangular Inserts with 4 Helical Cutting Edges$u$, $u$Extended flute cutters$u$, 50, $u$[{"name": "H490 SM-17", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2743&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_51', $u$Extended Flute Shell Mills Carrying H490 ANKX 12.. Double-Sided Rectangular Inserts with 4 Helical Cutting Edges$u$, $u$Extended flute cutters$u$, 51, $u$[{"name": "H490 SM-12", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3297&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_52', $u$Extended Flute Endmills Carrying H490 ANKX 09... Double-Sided Rectangular Inserts with 4 Helical Cutting Edges$u$, $u$Extended flute cutters$u$, 52, $u$[{"name": "H490 ANK-09", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3298&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_53', $u$Multifunction Fast Feed Milling Cutter for Octagonal and Square Insert Contours with Various Entry Angles$u$, $u$Tools$u$, 53, $u$[{"name": "FF SOF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3237&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_54', $u$Half Side / Face Disk Milling Cutters Carrying HELIDO S890 SNMU 1305 Inserts$u$, $u$Tools$u$, 54, $u$[{"name": "S890 SSB-13", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3348&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helido_use_55', $u$90° JHP FaceMill with Pinpointed Coolant Outlets Carrying H690 WNMU 0705 Double-Sided Trigonal Inserts$u$, $u$Tools$u$, 55, $u$[{"name": "H690 FWN-07-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5523&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELIDO'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- TOR-MILL
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_tormill', 'TOR-MILL', 'Milling', $u$TOR-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as toroidal Bull Nose Endmills with CNHT...Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TORMILL')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$TOR-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as toroidal Bull Nose Endmills with CNHT...Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TORMILL' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TORMILL'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_tormill_use_0', $u$Toroidal Bull Nose Endmills with CNHT...Inserts$u$, $u$Endmills$u$, 0, $u$[{"name": "E93CN-07", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1764&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tormill_use_1', $u$Bull Nose Endmills with FLEXFIT Threaded Adaptation Carrying Toroidal Shaped Inserts$u$, $u$Endmills$u$, 1, $u$[{"name": "E93CN-M-07", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1765&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tormill_use_2', $u$Bull Nose Endmills with MULTI-MASTER Threaded Adaptation Carrying Toroidal Inserts$u$, $u$Endmills$u$, 2, $u$[{"name": "E93CN-MM-07", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2233&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tormill_use_3', $u$90° Endmills with a FLEXFIT Threaded Connection Carrying CNMT/HT 0703 Inserts$u$, $u$Endmills$u$, 3, $u$[{"name": "E90CN-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3204&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tormill_use_4', $u$90° Endmills Carrying CNMT/HT 0703 Inserts$u$, $u$Endmills$u$, 4, $u$[{"name": "E90CN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3206&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tormill_use_5', $u$Toroidal Bull Nose Endmills with ENHT... Inserts$u$, $u$Endmills$u$, 5, $u$[{"name": "E93CN-10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4711&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tormill_use_6', $u$Bull Nose Endmills with FLEXFIT Threaded Adaptation Carrying Toroidal Inserts$u$, $u$Endmills$u$, 6, $u$[{"name": "E93CN-M-10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4712&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tormill_use_7', $u$Toroidal Bull Nose Peripherally Ground Inserts with 4 Cutting Edges$u$, $u$Inserts$u$, 7, $u$[{"name": "CNHT/MT 07", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1766&mapp=ML&GFSTYP=M"}, {"name": "ENHT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2017&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tormill_use_8', $u$93° Face Mills with Toroidal Inserts$u$, $u$Face mills$u$, 8, $u$[{"name": "F93CN-10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2264&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TORMILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- ROUND-MILL
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_roundmill', 'ROUND-MILL', 'Milling', $u$ROUND-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as endmills with Round Inserts for Profiling and Milling Round Corners.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ROUNDMILL')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$ROUND-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as endmills with Round Inserts for Profiling and Milling Round Corners.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ROUNDMILL' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ROUNDMILL'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_roundmill_use_0', $u$Endmills with Round Inserts for Profiling and Milling Round Corners$u$, $u$Endmills$u$, 0, $u$[{"name": "ER", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1069&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_roundmill_use_1', $u$Endmills with FLEXFIT Threaded Adaptation Carrying Round Inserts for Profiling and Milling Round Corners$u$, $u$Endmills$u$, 1, $u$[{"name": "ER-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1071&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_roundmill_use_2', $u$Endmills with FLEXFIT Threaded Connection Carrying Double-Sided Round Inserts with 12 Cutting Edges$u$, $u$Endmills$u$, 2, $u$[{"name": "RDS ER-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4788&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_roundmill_use_3', $u$Face Mills with Round Inserts for Profiling and Milling of Round Corners$u$, $u$Face mills$u$, 3, $u$[{"name": "FR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1556&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_roundmill_use_4', $u$Face Mills for Machining 3D Surfaces of Turbomachinery Blades$u$, $u$Face mills$u$, 4, $u$[{"name": "FRMT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4544&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_roundmill_use_5', $u$Face Mills Carrying Double-Sided Round Inserts with 12 Cutting Edges$u$, $u$Face mills$u$, 5, $u$[{"name": "RDS FR-12", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4789&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_roundmill_use_6', $u$Round Milling Inserts with a Mounting Bottom Cylinder and 8 Indexing Cavities on the Insert Flank$u$, $u$Inserts$u$, 6, $u$[{"name": "RCCW/RCMW-H-T", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1566&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_roundmill_use_7', $u$Round Milling Inserts with Specially Shaped Indexing Grooves$u$, $u$Inserts$u$, 7, $u$[{"name": "RPHX", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4546&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_roundmill_use_8', $u$Double-Sided Round Inserts with 12 Cutting Edges for Profile Milling$u$, $u$Inserts$u$, 8, $u$[{"name": "RDS RNMU/RNMW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4787&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_roundmill_use_9', $u$End Mills for Productive Machining of 3D Surfaces of Blades in Turbomachinery$u$, $u$Tools$u$, 9, $u$[{"name": "ERMT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4724&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ROUNDMILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- CHAM-MILL
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_chammill', 'CHAM-MILL', 'Milling', $u$CHAM-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as round Profile Milling Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMMILL')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$CHAM-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as round Profile Milling Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMMILL' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMMILL'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_chammill_use_0', $u$Round Profile Milling Inserts$u$, $u$Inserts$u$, 0, $u$[{"name": "R90MT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=781&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_chammill_use_1', $u$45° Octagonal Milling Insert$u$, $u$Inserts$u$, 1, $u$[{"name": "O45MT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=782&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_chammill_use_2', $u$Round Flat Rake Inserts for Profile Milling$u$, $u$Inserts$u$, 2, $u$[{"name": "R90CW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1095&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_chammill_use_3', $u$Multifunctional Coarse Pitch Endmills for Four Insert Shapes$u$, $u$Endmills$u$, 3, $u$[{"name": "ERCM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=901&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMMILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- CHAMF-MILL
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_chamfmill', 'CHAMF-MILL', 'Milling', $u$CHAMF-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as upper and Bottom Chamfering Endmills with a MULTI-MASTER Threaded Adaptation.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMFMILL')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$CHAMF-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as upper and Bottom Chamfering Endmills with a MULTI-MASTER Threaded Adaptation.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMFMILL' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMFMILL'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_chamfmill_use_0', $u$Upper and Bottom Chamfering Endmills with a MULTI-MASTER Threaded Adaptation$u$, $u$Endmills$u$, 0, $u$[{"name": "CH45-MM-PN06", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4332&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_chamfmill_use_1', $u$Upper and Bottom Chamfering Endmills Carrying Pentagonal Inserts$u$, $u$Endmills$u$, 1, $u$[{"name": "CH45-PN06", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4336&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_chamfmill_use_2', $u$Pentagonal Inserts for Upper and Bottom Chamfering$u$, $u$Inserts$u$, 2, $u$[{"name": "PNMT 0602-TN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4337&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMFMILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- HELI-OCTO
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_heliocto', 'HELI-OCTO', 'Milling', $u$HELI-OCTO: indexable milling tools and inserts from the ISCAR milling catalog, such as octagonal Milling Inserts for General Use.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELIOCTO')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$HELI-OCTO: indexable milling tools and inserts from the ISCAR milling catalog, such as octagonal Milling Inserts for General Use.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELIOCTO' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELIOCTO'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_heliocto_use_0', $u$Octagonal Milling Inserts for General Use$u$, $u$Inserts$u$, 0, $u$[{"name": "OEMT/OEKT 060405", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=288&mapp=ML&GFSTYP=M"}, {"name": "OFMT 07", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=870&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliocto_use_1', $u$Round Milling Inserts with Ribs on the Rake Face$u$, $u$Inserts$u$, 1, $u$[{"name": "REMT-76", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=312&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliocto_use_2', $u$Round Insert with a Reinforced Flat Rake for Profile Milling$u$, $u$Inserts$u$, 2, $u$[{"name": "REMW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=936&mapp=ML&GFSTYP=M"}, {"name": "RFMW 1905", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=937&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliocto_use_3', $u$Octagonal Milling Inserts with Positive Rake and Sharp Cutting Edges$u$, $u$Inserts$u$, 3, $u$[{"name": "OFCR/OFCT-AEN/AETN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=938&mapp=ML&GFSTYP=M"}, {"name": "OECR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1094&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliocto_use_4', $u$Octagonal Milling Inserts with Four Wiper Cutting Edges$u$, $u$Inserts$u$, 4, $u$[{"name": "OFCR/OFCT-RW/AER (wiper)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=939&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliocto_use_5', $u$Round Milling Inserts$u$, $u$Inserts$u$, 5, $u$[{"name": "RFMT 1905-76", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=962&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliocto_use_6', $u$HELIOCTO octagonal milling insert with a positive rake. Used for stainless steel and high temperature alloys.$u$, $u$Inserts$u$, 6, $u$[{"name": "OFMR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1070&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliocto_use_7', $u$Octagonal Milling Inserts for Heavy Duty Applications$u$, $u$Inserts$u$, 7, $u$[{"name": "OFMW-AETN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1686&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliocto_use_8', $u$Octagonal milling inserts$u$, $u$Inserts$u$, 8, $u$[{"name": "OFMT 05", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2050&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliocto_use_9', $u$Octagonal Flat Rake Inserts for Cast Iron$u$, $u$Inserts$u$, 9, $u$[{"name": "OEMW-AETN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2125&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliocto_use_10', $u$Positive Square Inserts for General Soft and Clean Cutting$u$, $u$Inserts$u$, 10, $u$[{"name": "SECT/SEMT 1404", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3668&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliocto_use_11', $u$Face Mills Carrying Octagonal, Round and Fast Feed Segmented Inserts$u$, $u$Face mills$u$, 11, $u$[{"name": "HOF-R07", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1831&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliocto_use_12', $u$Face Mills Carrying Octagonal, Square or Round Inserts$u$, $u$Face mills$u$, 12, $u$[{"name": "HOF-R06", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3664&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliocto_use_13', $u$Inserts with 8 FEEDMILL Large Radii Segmented Cutting Edges for Fast Feed on HELIOCTO Cutters$u$, $u$Tools$u$, 13, $u$[{"name": "OFMW-FF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2096&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliocto_use_14', $u$Endmills Carrying Octagonal, Square and Round Inserts$u$, $u$Endmills$u$, 14, $u$[{"name": "HOE-R06", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3666&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELIOCTO'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- TANG-MILL
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_tangmill', 'TANG-MILL', 'Milling', $u$TANG-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as 90° Face Mills Carrying LN..1106... Tangentially Clamped Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TANGMILL')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$TANG-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as 90° Face Mills Carrying LN..1106... Tangentially Clamped Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TANGMILL' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TANGMILL'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_tangmill_use_0', $u$90° Face Mills Carrying LN..1106... Tangentially Clamped Inserts$u$, $u$Face mills$u$, 0, $u$[{"name": "F90LN-N11", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1186&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_1', $u$45° Face Mills with LN..1506... Tangentially Clamped Inserts$u$, $u$Face mills$u$, 1, $u$[{"name": "F45LN-N15", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1450&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_2', $u$86° Face Mills Carrying all 8 Cutting Edges of LN..1106... Tangentially Clamped Inserts$u$, $u$Face mills$u$, 2, $u$[{"name": "F86LNX-11", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2043&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_3', $u$90° Face Mills Carrying LN..1506... Tangentially Clamped Inserts$u$, $u$Face mills$u$, 3, $u$[{"name": "F90LN-N15", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2535&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_4', $u$Tangentially Clamped Inserts with a Positive Land for Alloyed Steel, Stainless Steel and Cast Iron$u$, $u$Inserts$u$, 4, $u$[{"name": "LNKX 1506PN-N PL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1569&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_5', $u$Tangentially Clamped Inserts with a Reinforced Negative Land for Unfavorable Conditions$u$, $u$Inserts$u$, 5, $u$[{"name": "LNKX/LNMT 1506PNTN/PN-N MM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1570&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_6', $u$Tangentially Clamped Inserts with a Positive Rake Angle for Cast Iron$u$, $u$Inserts$u$, 6, $u$[{"name": "LNKX 150608AN-N PL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1584&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_7', $u$Tangentially Clamped Insert with a Positive Polished Land and Sharp Cutting Edge$u$, $u$Inserts$u$, 7, $u$[{"name": "LNAR 1506", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1728&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_8', $u$Tangentially Clamped Precision Ground Inserts with Various Corner Radii for Corner Rounding$u$, $u$Inserts$u$, 8, $u$[{"name": "LNAT 1506..PN-N MM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1777&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_9', $u$Tangentially Clamped Insert for Machining Gray and Nodular Cast Iron$u$, $u$Inserts$u$, 9, $u$[{"name": "LNMW 1506 PNTN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1779&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_10', $u$Tangentially Clamped Inserts with a Negative Land and Reinforced Chipformer for Unfavorable Cutting Conditions$u$, $u$Inserts$u$, 10, $u$[{"name": "LNKX/LNMT 150608ANTN MM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1812&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_11', $u$Tangentially Clamped Inserts with 4 Straight Right-Hand Cutting Edges$u$, $u$Inserts$u$, 11, $u$[{"name": "LNMT/LNHT 1506PN-R HT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1911&mapp=ML&GFSTYP=M"}, {"name": "LNHT 1106 PN-R HT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2254&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_12', $u$Tangentially Clamped Inserts with a Very Positive Chipformer and Reinforced Cutting Edge$u$, $u$Inserts$u$, 12, $u$[{"name": "LNKX/LNMT 1106", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2204&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_13', $u$Tangentially Clamped Insert with a Reinforced Negative Land, for Unfavorable Cutting Conditions$u$, $u$Inserts$u$, 13, $u$[{"name": "LNMW 150608 ANTN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2205&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_14', $u$Tangentially Clamped Inserts with a PCBN Brazed Tip for Machining Hard Materials$u$, $u$Inserts$u$, 14, $u$[{"name": "LNAW-15 (CBN)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2206&mapp=ML&GFSTYP=M"}, {"name": "LNAW-11 (CBN)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3162&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_15', $u$Tangentially Clamped Inserts with 4 Straight Cutting Edges: 2 L.H. and 2 R.H.$u$, $u$Inserts$u$, 15, $u$[{"name": "LNMT/LNHT 1506...-N HT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2255&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_16', $u$Tangentially Clamped Inserts with Positive Polished Rake$u$, $u$Inserts$u$, 16, $u$[{"name": "LNAR 1106", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2266&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_17', $u$Tangentially Clamped Insert with 2 Straight Cutting Edges for Deep Slotting$u$, $u$Inserts$u$, 17, $u$[{"name": "LNHT 1506PN-N-HT-S", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2275&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_18', $u$Tangentially Clamped Milling Inserts with a Brazed PCD Tip for Machining Aluminum$u$, $u$Inserts$u$, 18, $u$[{"name": "LNAR 1106 (PCD)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2396&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_19', $u$Tangentially Clamped Insert with a Brazed PCD Tip for Machining Aluminum$u$, $u$Inserts$u$, 19, $u$[{"name": "LNAR 1506 PN-R-S (PCD)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2397&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_20', $u$Tangentially Clamped Inserts with a Serrated Cutting Edge for Chip Splitting$u$, $u$Inserts$u$, 20, $u$[{"name": "LNMT 1506PN-R-TS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2402&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_21', $u$Tangentially Clamped Wiper Inserts$u$, $u$Inserts$u$, 21, $u$[{"name": "LNAT 1506-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2495&mapp=ML&GFSTYP=M"}, {"name": "LNAT 1106-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2531&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_22', $u$Tangentially Clamped Inserts with Straight, Right- and Left-Hand Cutting Edges$u$, $u$Inserts$u$, 22, $u$[{"name": "LNHT 1106 PN-N HT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2496&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_23', $u$Tangentially Clamped Wiper Milling Inserts with a Brazed PCD Tip for Machining Aluminum$u$, $u$Inserts$u$, 23, $u$[{"name": "LNAR 1106PN-R-S-W (PCD)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2836&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_24', $u$Single-Side Cutting, Disk Type Slotting Cutters$u$, $u$Slotting & slitting cutters$u$, 24, $u$[{"name": "SSB-LN15-R/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1602&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_25', $u$Full Slot Adjustable Slotting Cutters with Cartridges Carrying LN.. 1506... Inserts (18.9-25.6 mm width range)$u$, $u$Slotting & slitting cutters$u$, 25, $u$[{"name": "FDN-CALN15", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2190&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_26', $u$Full Slot Disk Type Slotting Cutters with Cartridges Carrying Tangentially Mounted LN.. 1506.. Inserts$u$, $u$Slotting & slitting cutters$u$, 26, $u$[{"name": "SDN-CALN15", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2191&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_27', $u$Full Slot Flange Type Slotting Cutters with Cartridges Carrying Tangentially Mounted LN.. 1106.. Inserts$u$, $u$Slotting & slitting cutters$u$, 27, $u$[{"name": "FDN-CALN11", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2516&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_28', $u$Full Slot Disk Type Slotting Cutters with Cartridges Carrying Tangentially Mounted LN.. 1106.. Inserts$u$, $u$Slotting & slitting cutters$u$, 28, $u$[{"name": "SDN-CALN11", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2631&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_29', $u$Tangentially Clamped Inserts with 4 Cutting Edges for Slotting Cutters$u$, $u$Slotting & slitting cutters$u$, 29, $u$[{"name": "LNAT 1506-PM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3505&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_30', $u$Full Slot Adjustable Slotting Cutters with Cartridges Carrying LNAT 1506...-PM Inserts (18.9-25.6 mm width range)$u$, $u$Slotting & slitting cutters$u$, 30, $u$[{"name": "FDN-CAPM15", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3506&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_31', $u$Full Slot Adjustable Slotting Cutters with Cartridges Carrying LNAT 1506...-PM Inserts$u$, $u$Slotting & slitting cutters$u$, 31, $u$[{"name": "SDN-CAPM15", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3512&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_32', $u$Tangentially Clamped Chamfered Insert for 90° Cutters$u$, $u$Tools$u$, 32, $u$[{"name": "LNKX 1506 1.5X45 PN-N", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1637&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangmill_use_33', $u$Tangentially Clamped Wiper Inserts for 45° Lead Angle on F45LN Cutters$u$, $u$Tools$u$, 33, $u$[{"name": "LNAT 1506AN-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1755&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TANGMILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- 16-MILL
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_16mill', '16-MILL', 'Milling', $u$16-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as 45° Face Mills Carrying Octagonal ONHU/MU 0806... Inserts with 16 Cutting Edges.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = '16MILL')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$16-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as 45° Face Mills Carrying Octagonal ONHU/MU 0806... Inserts with 16 Cutting Edges.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = '16MILL' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = '16MILL'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_16mill_use_0', $u$45° Face Mills Carrying Octagonal ONHU/MU 0806... Inserts with 16 Cutting Edges$u$, $u$Face mills$u$, 0, $u$[{"name": "F45NM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1829&mapp=ML&GFSTYP=M"}, {"name": "F45WG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2007&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_16mill_use_1', $u$Double-Sided Octagonal Face Milling Inserts for Cast Iron and Rough Applications$u$, $u$Face mills$u$, 1, $u$[{"name": "ONHU/ONMU-08-TN/HL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1946&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_16mill_use_2', $u$Double-Sided Octagonal Face Milling Inserts for General Steel Machining$u$, $u$Face mills$u$, 2, $u$[{"name": "ONHU/ONMU-08-TN-MM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2348&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_16mill_use_3', $u$16MILL Double-Sided Octagonal Face Milling Inserts for High Temperature Alloys, Stainless Steel and Steels$u$, $u$Face mills$u$, 3, $u$[{"name": "ONHU/ONMU 080608 AN-N-HP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2497&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_16mill_use_4', $u$Octagonal Double-Sided Ceramic Face Milling Inserts$u$, $u$Face mills$u$, 4, $u$[{"name": "ONHQ-TN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2528&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_16mill_use_5', $u$Octagonal Inserts with a Sharp Edge and Positive Land for Cast Iron$u$, $u$Inserts$u$, 5, $u$[{"name": "ONHU 0806-N-PL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2349&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_16mill_use_6', $u$Double-Sided Octagonal Wiper Inserts$u$, $u$Inserts$u$, 6, $u$[{"name": "ONHU 0806AN-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2350&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = '16MILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- NEO-DO
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_neodo', 'NEO-DO', 'Milling', $u$NEO-DO: indexable milling tools and inserts from the ISCAR milling catalog, such as double-Sided Square Inserts with 8 Cutting Edges.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'NEODO')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$NEO-DO: indexable milling tools and inserts from the ISCAR milling catalog, such as double-Sided Square Inserts with 8 Cutting Edges.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'NEODO' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'NEODO'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_neodo_use_0', $u$Double-Sided Square Inserts with 8 Cutting Edges$u$, $u$Inserts$u$, 0, $u$[{"name": "S890 SZMU-0804PN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4636&mapp=ML&GFSTYP=M"}, {"name": "S890 SZMU 1005", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5534&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_neodo_use_1', $u$Face Mills Carrying Double-Sided Square Inserts with 8 Cutting Edges$u$, $u$Face mills$u$, 1, $u$[{"name": "S890 FSZ-R08", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4637&mapp=ML&GFSTYP=M"}, {"name": "S890 FSZ-R10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5532&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_neodo_use_2', $u$Endmills Carrying Double-Sided Square Inserts with 8 Cutting Edges$u$, $u$Endmills$u$, 2, $u$[{"name": "S890 ESZ-R08", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4806&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_neodo_use_3', $u$Endmills Carrying Double-Sided Square Inserts with 8 Cutting Edges with a MULTI-MASTER threaded adaptation$u$, $u$Endmills$u$, 3, $u$[{"name": "S890 ESZ-MMT15-R08", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5039&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'NEODO'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- DOVE-IQ-MILL
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_doveiqmill', 'DOVE-IQ-MILL', 'Milling', $u$DOVE-IQ-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as 50° Face Mills Carrying Square Inserts with 8 Cutting Edges.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'DOVEIQMILL')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$DOVE-IQ-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as 50° Face Mills Carrying Square Inserts with 8 Cutting Edges.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'DOVEIQMILL' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'DOVEIQMILL'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_doveiqmill_use_0', $u$50° Face Mills Carrying Square Inserts with 8 Cutting Edges$u$, $u$Face mills$u$, 0, $u$[{"name": "IQ845 FSY-R07", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3325&mapp=ML&GFSTYP=M"}, {"name": "IQ845 FSY-R05", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3795&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_doveiqmill_use_1', $u$50° Face Mills with CAMFIX shanks Carrying Square Inserts with 8 Cutting Edges$u$, $u$Face mills$u$, 1, $u$[{"name": "IQ845 FSY-C#-R07", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3725&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_doveiqmill_use_2', $u$Square Inserts with 8 Cutting Edges$u$, $u$Inserts$u$, 2, $u$[{"name": "IQ845 SYHU-07", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3327&mapp=ML&GFSTYP=M"}, {"name": "IQ845 SYHU-05", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3794&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_doveiqmill_use_3', $u$50° Endmills Carrying Square Inserts with 8 Cutting Edges$u$, $u$Endmills$u$, 3, $u$[{"name": "IQ845 ESY-R05", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3796&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'DOVEIQMILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- LOGIQ-8-TANG
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_logiq8tang', 'LOGIQ-8-TANG', 'Milling', $u$LOGIQ-8-TANG: indexable milling tools and inserts from the ISCAR milling catalog, such as 90° Face Mills Carrying T890 LNHT/LNAT 1306... Tangentially Clamped Inserts with 8 Cutting Edges.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQ8TANG')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$LOGIQ-8-TANG: indexable milling tools and inserts from the ISCAR milling catalog, such as 90° Face Mills Carrying T890 LNHT/LNAT 1306... Tangentially Clamped Inserts with 8 Cutting Edges.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQ8TANG' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQ8TANG'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_logiq8tang_use_0', $u$90° Face Mills Carrying T890 LNHT/LNAT 1306... Tangentially Clamped Inserts with 8 Cutting Edges$u$, $u$Face mills$u$, 0, $u$[{"name": "T890HT FLN-R13", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4129&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_logiq8tang_use_1', $u$90° Face Mills Carrying T890 LNMT 09... Tangentially Clamped Inserts with 8 Cutting Edges$u$, $u$Face mills$u$, 1, $u$[{"name": "T890HT FLN-R09", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5674&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_logiq8tang_use_2', $u$90° Endmills Carrying T890 LN.T 1306... Tangentially Clamped Inserts with 8 Cutting Edges$u$, $u$Endmills$u$, 2, $u$[{"name": "T890HT ELN-R13", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4131&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_logiq8tang_use_3', $u$90° Endmills Carrying T890 LNMT 09... Tangentially Clamped Inserts with 8 Cutting Edges$u$, $u$Endmills$u$, 3, $u$[{"name": "T890HT ELN-09", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5673&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_logiq8tang_use_4', $u$Tangentially Clamped Inserts with 4 or 8 Cutting Edges$u$, $u$Inserts$u$, 4, $u$[{"name": "T890 LN.. 1306", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4132&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_logiq8tang_use_5', $u$Tangentially Clamped Inserts with 8 Cutting Edges$u$, $u$Inserts$u$, 5, $u$[{"name": "T890 LNMT 0905", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5670&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQ8TANG'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- ALU-FRAISE
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_alufraise', 'ALU-FRAISE', 'Milling', $u$ALU-FRAISE: indexable milling tools and inserts from the ISCAR milling catalog, such as cartridges for SPM-D-CA Face Mills.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ALUFRAISE')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$ALU-FRAISE: indexable milling tools and inserts from the ISCAR milling catalog, such as cartridges for SPM-D-CA Face Mills.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ALUFRAISE' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ALUFRAISE'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_alufraise_use_0', $u$Cartridges for SPM-D-CA Face Mills$u$, $u$Face mills$u$, 0, $u$[{"name": "CA-SPM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2937&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_alufraise_use_1', $u$Face Mills with Adjustable Cartridges for High Speed Machining of Aluminum Alloys, Cast Iron and Carbon Fiber$u$, $u$Face mills$u$, 1, $u$[{"name": "SPN-CA IT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5376&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_alufraise_use_2', $u$Cartridges for SPN D Face Mills$u$, $u$Face mills$u$, 2, $u$[{"name": "CART/W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5482&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_alufraise_use_3', $u$90° Endmills with Integral HSK Adaptation Carrying Super Positive Inserts for Machining Aluminum at High Rotation Speeds$u$, $u$Endmills$u$, 3, $u$[{"name": "SPN D#HSK#R-CA IT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5377&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_alufraise_use_4', $u$90° Endmills with DIN69871 Adaptation Carrying Super Positive Inserts for Machining Aluminum at High Rotation Speeds$u$, $u$Endmills$u$, 4, $u$[{"name": "SPN D#INT40#R-CA IT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5408&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_alufraise_use_5', $u$90° Endmills with Integral BT Adaptation Carrying Super Positive Inserts for Machining Aluminum at High Rotation Speeds$u$, $u$Endmills$u$, 5, $u$[{"name": "SPN D#BT#R-CA IT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5409&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_alufraise_use_6', $u$90° Endmills with HSK Adaptation on Which Brazed PCD Inserts for Machining Aluminum at High Rotational Speeds$u$, $u$Endmills$u$, 6, $u$[{"name": "SPN D-HSK-R IT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5410&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_alufraise_use_7', $u$90° Endmills with DIN69871 Adaptation on which Brazed PCD Inserts for Machining Aluminum at High Rotational Speeds$u$, $u$Endmills$u$, 7, $u$[{"name": "SPN D-INT40 IT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5412&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_alufraise_use_8', $u$90° Endmills with BT MAS-403 Tapered Shanks on Which Brazed PCD Inserts for Machining Aluminum at High Speeds$u$, $u$Endmills$u$, 8, $u$[{"name": "SPN D-BT40 IT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5415&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ALUFRAISE'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- ALU-TANG
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_alutang', 'ALU-TANG', 'Milling', $u$ALU-TANG: indexable milling tools and inserts from the ISCAR milling catalog, such as adjustable 90° Face Mills (used mainly for PCD/CBN inserts).$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ALUTANG')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$ALU-TANG: indexable milling tools and inserts from the ISCAR milling catalog, such as adjustable 90° Face Mills (used mainly for PCD/CBN inserts).$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ALUTANG' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ALUTANG'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_alutang_use_0', $u$Adjustable 90° Face Mills (used mainly for PCD/CBN inserts)$u$, $u$Face mills$u$, 0, $u$[{"name": "F90LN-FR CA11", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1188&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ALUTANG'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- TANG-FIN
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_tangfin', 'TANG-FIN', 'Milling', $u$TANG-FIN: indexable milling tools and inserts from the ISCAR milling catalog, such as face Mills Carrying Tangentially Clamped Inserts with 4 Cutting Edges for Extra Fine Milling Applications.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TANGFIN')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$TANG-FIN: indexable milling tools and inserts from the ISCAR milling catalog, such as face Mills Carrying Tangentially Clamped Inserts with 4 Cutting Edges for Extra Fine Milling Applications.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TANGFIN' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TANGFIN'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_tangfin_use_0', $u$Face Mills Carrying Tangentially Clamped Inserts with 4 Cutting Edges for Extra Fine Milling Applications$u$, $u$Face mills$u$, 0, $u$[{"name": "HTF-R-LN10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4192&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TANGFIN'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- MILL-2000
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_mill2000', 'MILL-2000', 'Milling', $u$MILL-2000: indexable milling tools and inserts from the ISCAR milling catalog, such as 90° Endmills Carrying 3M AXKT...Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MILL2000')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$MILL-2000: indexable milling tools and inserts from the ISCAR milling catalog, such as 90° Endmills Carrying 3M AXKT...Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MILL2000' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MILL2000'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_mill2000_use_0', $u$90° Endmills Carrying 3M AXKT...Inserts$u$, $u$Endmills$u$, 0, $u$[{"name": "3M E90AX", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=974&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_mill2000_use_1', $u$Heavy Duty 90° Face Mills with 3M AXKT 1304.. Inserts$u$, $u$Face mills$u$, 1, $u$[{"name": "3M F90AX-13", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=976&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_mill2000_use_2', $u$Heavy Duty 90° Face Mills Carrying 3M AXKT 2006.. Inserts$u$, $u$Face mills$u$, 2, $u$[{"name": "3M F90AX-20", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2537&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_mill2000_use_3', $u$Heavy Duty Extended Flute Shell Mills Carrying 3M AXKT 1304.../2006... Inserts$u$, $u$Extended flute cutters$u$, 3, $u$[{"name": "3M SM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=980&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_mill2000_use_4', $u$High Durability Inserts for Heavy Milling$u$, $u$Inserts$u$, 4, $u$[{"name": "3M AXKT 1304", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=982&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_mill2000_use_5', $u$High Durability Inserts with a Variety of Corner Radii for Heavy Milling$u$, $u$Inserts$u$, 5, $u$[{"name": "3M AXKT 1304..R-PDRMM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1373&mapp=ML&GFSTYP=M"}, {"name": "3M AXKT 2006..R-PDR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2751&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_mill2000_use_6', $u$High Durability Inserts for Heavy Milling Applications$u$, $u$Inserts$u$, 6, $u$[{"name": "3M AXKT-2006", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2750&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MILL2000'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- MILL-SHRED
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_millshred', 'MILL-SHRED', 'Milling', $u$MILL-SHRED: indexable milling tools and inserts from the ISCAR milling catalog, such as rough Profiling Face Mills with Serrated or Regular Round Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MILLSHRED')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$MILL-SHRED: indexable milling tools and inserts from the ISCAR milling catalog, such as rough Profiling Face Mills with Serrated or Regular Round Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MILLSHRED' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MILLSHRED'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_millshred_use_0', $u$Rough Profiling Face Mills with Serrated or Regular Round Inserts$u$, $u$Face mills$u$, 0, $u$[{"name": "FRW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1905&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millshred_use_1', $u$90° Face Mills Carrying 12 and 18mm Long Edged Inserts$u$, $u$Face mills$u$, 1, $u$[{"name": "P290 FPW/FCT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3277&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millshred_use_2', $u$Fully Effective Serrated Inserts with Four Options for Indexing Orientation$u$, $u$Inserts$u$, 2, $u$[{"name": "RCMT/RCMW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1908&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millshred_use_3', $u$Round Flat Rake Milling Inserts$u$, $u$Inserts$u$, 3, $u$[{"name": "RCMW/RCCW-MO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1915&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millshred_use_4', $u$Round Positive Rake Milling Inserts$u$, $u$Inserts$u$, 4, $u$[{"name": "RCMT/RCCT-MO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2529&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millshred_use_5', $u$Single-Sided Rectangular Inserts with 2 Serrated Cutting Edges$u$, $u$Inserts$u$, 5, $u$[{"name": "P290 ACKT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3270&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millshred_use_6', $u$Single-Sided Rectangular Inserts with Two 12 and 18mm Straight Cutting Edges$u$, $u$Inserts$u$, 6, $u$[{"name": "P290 ACCT/KT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3271&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millshred_use_7', $u$Rough Profiling Endmills with Serrated or Regular Round Inserts$u$, $u$Endmills$u$, 7, $u$[{"name": "ERW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2473&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millshred_use_8', $u$Long Reach Endmills Carrying 12 and 18 mm Long Edged Inserts$u$, $u$Endmills$u$, 8, $u$[{"name": "P290 EPW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3274&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millshred_use_9', $u$Endmills with FLEXFIT Threaded Adaptation Carrying 12 and 18 mm Long Edged Inserts$u$, $u$Endmills$u$, 9, $u$[{"name": "P290 EPW-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3275&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millshred_use_10', $u$Rough Profiling Tools with a FLEXFIT Adaptation$u$, $u$Tools$u$, 10, $u$[{"name": "ERW-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2482&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millshred_use_11', $u$Extended Flute Endmills Carrying 12 and 18 mm Long Edged Inserts$u$, $u$Extended flute cutters$u$, 11, $u$[{"name": "P290 ACK", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3269&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millshred_use_12', $u$Extended Flute Shell Mills Carrying 12 and 18 mm Long Edged Inserts$u$, $u$Extended flute cutters$u$, 12, $u$[{"name": "P290 SM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3272&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millshred_use_13', $u$Extended Flute Endmills with CAMFIX Shanks Carrying 18 mm Long Edged Inserts$u$, $u$Extended flute cutters$u$, 13, $u$[{"name": "P290 ACK-C#-18", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3717&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millshred_use_14', $u$Extended Flute Endmills with FLEXFIT Threaded Adaptation Carrying 12 mm Long Edged Inserts$u$, $u$Extended flute cutters$u$, 14, $u$[{"name": "P290 ACK-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3822&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MILLSHRED'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- QUICK-X-FLUTE
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_quickxflute', 'QUICK-X-FLUTE', 'Milling', $u$QUICK-X-FLUTE: indexable milling tools and inserts from the ISCAR milling catalog, such as double-Sided Square Inserts with 4/8 Cutting Edges.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKXFLUTE')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$QUICK-X-FLUTE: indexable milling tools and inserts from the ISCAR milling catalog, such as double-Sided Square Inserts with 4/8 Cutting Edges.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKXFLUTE' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKXFLUTE'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_quickxflute_use_0', $u$Double-Sided Square Inserts with 4/8 Cutting Edges$u$, $u$Inserts$u$, 0, $u$[{"name": "S890 SNMU 1004/1306", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5088&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_quickxflute_use_1', $u$Extended Flute Cutters Carrying Double-Sided Square Inserts with 8 Cutting Edges$u$, $u$Extended flute cutters$u$, 1, $u$[{"name": "S890 SM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5089&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKXFLUTE'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- ISO-SHRED
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_isoshred', 'ISO-SHRED', 'Milling', $u$ISO-SHRED: indexable milling tools and inserts from the ISCAR milling catalog, such as square Milling Inserts with a Chip Splitting Serrated Cutting Edge for 45° Roughing.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ISOSHRED')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$ISO-SHRED: indexable milling tools and inserts from the ISCAR milling catalog, such as square Milling Inserts with a Chip Splitting Serrated Cutting Edge for 45° Roughing.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ISOSHRED' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ISOSHRED'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_isoshred_use_0', $u$Square Milling Inserts with a Chip Splitting Serrated Cutting Edge for 45° Roughing$u$, $u$Inserts$u$, 0, $u$[{"name": "SEMT 1204AF-R-HS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=355&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_isoshred_use_1', $u$Square Positive Inserts with Chip Splitting Serrated Cutting Edges$u$, $u$Inserts$u$, 1, $u$[{"name": "SPKR EDTR-HS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=411&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ISOSHRED'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- TANG-PLUNGE
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_tangplunge', 'TANG-PLUNGE', 'Milling', $u$TANG-PLUNGE: indexable milling tools and inserts from the ISCAR milling catalog, such as shell Mill Plungers Carrying Tangentially Clamped Inserts with 4 Cutting Edges.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TANGPLUNGE')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$TANG-PLUNGE: indexable milling tools and inserts from the ISCAR milling catalog, such as shell Mill Plungers Carrying Tangentially Clamped Inserts with 4 Cutting Edges.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TANGPLUNGE' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TANGPLUNGE'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_tangplunge_use_0', $u$Shell Mill Plungers Carrying Tangentially Clamped Inserts with 4 Cutting Edges$u$, $u$Plunging tools$u$, 0, $u$[{"name": "HTP-R-LN16", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2398&mapp=ML&GFSTYP=M"}, {"name": "HTP-R-LN10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2799&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangplunge_use_1', $u$Tangentially Clamped Inserts with 4 Cutting Edges for Plungers$u$, $u$Plunging tools$u$, 1, $u$[{"name": "HTP LN.. 1606", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2400&mapp=ML&GFSTYP=M"}, {"name": "HTP LN.. 1006", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2706&mapp=ML&GFSTYP=M"}, {"name": "HTP LN.. 0604", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3099&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangplunge_use_2', $u$Side Plungers Carrying Tangentially Clamped Inserts with 4 Cutting Edges$u$, $u$Plunging tools$u$, 2, $u$[{"name": "HTP-LN10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2705&mapp=ML&GFSTYP=M"}, {"name": "HTP-LN06", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3096&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangplunge_use_3', $u$Side Plungers with FLEXFIT Threaded Connection Carrying Tangentially Clamped Inserts with 4 Cutting Edges$u$, $u$Plunging tools$u$, 3, $u$[{"name": "HTP-M-LN10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2717&mapp=ML&GFSTYP=M"}, {"name": "HTP-M-LN06", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3097&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangplunge_use_4', $u$Side Plungers with SHANK-MASTER Threaded Connection Carrying Tangentially Clamped Inserts with 4 Cutting Edges$u$, $u$Plunging tools$u$, 4, $u$[{"name": "TS HTP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3125&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangplunge_use_5', $u$A PCD-tipped Insert, Intended Mainly for Finish and Semi-finish Machining of Aluminum Alloys.$u$, $u$Inserts$u$, 5, $u$[{"name": "HTP LNAR 1006 (PCD)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5575&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TANGPLUNGE'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- ISCAR-PLUNGER
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_iscarplunger', 'ISCAR-PLUNGER', 'Milling', $u$ISCAR-PLUNGER: indexable milling tools and inserts from the ISCAR milling catalog, such as tangentially Clamped Inserts with 4 Cutting Edges for Plungers.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARPLUNGER')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$ISCAR-PLUNGER: indexable milling tools and inserts from the ISCAR milling catalog, such as tangentially Clamped Inserts with 4 Cutting Edges for Plungers.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARPLUNGER' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARPLUNGER'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_iscarplunger_use_0', $u$Tangentially Clamped Inserts with 4 Cutting Edges for Plungers$u$, $u$Plunging tools$u$, 0, $u$[{"name": "PLHT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1598&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarplunger_use_1', $u$Side Shell Mill Plungers Carrying XCMT 120408TR Inserts$u$, $u$Plunging tools$u$, 1, $u$[{"name": "PLX", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1673&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarplunger_use_2', $u$Side Plungers with FLEXFIT Threaded Adaptation Carrying XCMT 120408TR Inserts$u$, $u$Plunging tools$u$, 2, $u$[{"name": "PLX-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1675&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_iscarplunger_use_3', $u$73° Rhombic, 7° Positive Flank Inserts for Plungers$u$, $u$Plunging tools$u$, 3, $u$[{"name": "XCMT-TR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1679&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARPLUNGER'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- BALL-PLUS
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_ballplus', 'BALL-PLUS', 'Milling', $u$BALL-PLUS: indexable milling tools and inserts from the ISCAR milling catalog, such as 220° Spherical Profile Inserts for Roughing and Semi-Finishing, Up and Down Ramping and Undercutting.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'BALLPLUS')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$BALL-PLUS: indexable milling tools and inserts from the ISCAR milling catalog, such as 220° Spherical Profile Inserts for Roughing and Semi-Finishing, Up and Down Ramping and Undercutting.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'BALLPLUS' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'BALLPLUS'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_ballplus_use_0', $u$220° Spherical Profile Inserts for Roughing and Semi-Finishing, Up and Down Ramping and Undercutting$u$, $u$Inserts$u$, 0, $u$[{"name": "HBR-QF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1180&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_ballplus_use_1', $u$220° Spherical Profile Inserts for Accurate Finishing, Up and Down Ramping and Undercutting$u$, $u$Inserts$u$, 1, $u$[{"name": "HBF-QF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1189&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_ballplus_use_2', $u$Ball Nose Inserts with 2 Straight Tangent Cutting Edges (Fully Effective) for Cavity Profiling and Shouldering$u$, $u$Inserts$u$, 2, $u$[{"name": "HCR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1206&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_ballplus_use_3', $u$90° V-Shaped Inserts with 2 Cutting Edges for Chamfering, Countersinking and Spot Drilling$u$, $u$Inserts$u$, 3, $u$[{"name": "HCD-QF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1801&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_ballplus_use_4', $u$Inserts with 2 Cutting Edges (Fully Effective) for Shouldering, Slotting, Drilling and Countersinking$u$, $u$Inserts$u$, 4, $u$[{"name": "HCC-QF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1816&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_ballplus_use_5', $u$Toroidal Inserts with a Variety of Corner Radii for Machining Fillets and Next to Steep Walls$u$, $u$Inserts$u$, 5, $u$[{"name": "HTR-QF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1818&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_ballplus_use_6', $u$Ball Nose Multifunction Endmills D=12 mm$u$, $u$Endmills$u$, 6, $u$[{"name": "HCM D12", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1204&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_ballplus_use_7', $u$Multifunction Endmills that Can Carry Several Insert Geometries$u$, $u$Endmills$u$, 7, $u$[{"name": "HCE", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1205&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_ballplus_use_8', $u$Ball Nose Multifunction Endmills with FLEXFIT Threaded Adaptation$u$, $u$Endmills$u$, 8, $u$[{"name": "HCM-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1814&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_ballplus_use_9', $u$Ball Nose Multifunction Endmills with a MULTI-MASTER Threaded Adaptation$u$, $u$Endmills$u$, 9, $u$[{"name": "HCM-MM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2142&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_ballplus_use_10', $u$Multifunction Endmills with a MULTI-MASTER Threaded Adaptation that Mounts Several Insert Geometries$u$, $u$Endmills$u$, 10, $u$[{"name": "HCE-MM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2232&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_ballplus_use_11', $u$Ball Nose Multifunction Endmills D=16 mm$u$, $u$Endmills$u$, 11, $u$[{"name": "HCM D16", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2868&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_ballplus_use_12', $u$Ball Nose Multifunction Endmills D=20 mm$u$, $u$Endmills$u$, 12, $u$[{"name": "HCM D20", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2869&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_ballplus_use_13', $u$Ball Nose Multifunction Endmills D=25 mm$u$, $u$Endmills$u$, 13, $u$[{"name": "HCM D25", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2870&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_ballplus_use_14', $u$Ball Nose Multifunction Endmills D=10 mm$u$, $u$Endmills$u$, 14, $u$[{"name": "HCM D10", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2904&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_ballplus_use_15', $u$Ball Nose Multifunction Endmills D=30/32 mm$u$, $u$Endmills$u$, 15, $u$[{"name": "HCM D30/32", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5576&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'BALLPLUS'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- HELI-BALL
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_heliball', 'HELI-BALL', 'Milling', $u$HELI-BALL: indexable milling tools and inserts from the ISCAR milling catalog, such as ball Nose 8 mm Diameter Profiling Insert.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELIBALL')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$HELI-BALL: indexable milling tools and inserts from the ISCAR milling catalog, such as ball Nose 8 mm Diameter Profiling Insert.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELIBALL' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELIBALL'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_heliball_use_0', $u$Ball Nose 8 mm Diameter Profiling Insert$u$, $u$Inserts$u$, 0, $u$[{"name": "CR-D8", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=67&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliball_use_1', $u$Ball Nose Endmills with FLEXFIT Threaded Adaptation$u$, $u$Endmills$u$, 1, $u$[{"name": "CDP D-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=956&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heliball_use_2', $u$Ball Nose Endmills D=8-20 mm$u$, $u$Endmills$u$, 2, $u$[{"name": "CM D08-20", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2866&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELIBALL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- DROP-MILL
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_dropmill', 'DROP-MILL', 'Milling', $u$DROP-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as ball Nose Endmills with Tangent Straight Edge Inserts for Finish Profiling.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'DROPMILL')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$DROP-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as ball Nose Endmills with Tangent Straight Edge Inserts for Finish Profiling.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'DROPMILL' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'DROPMILL'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_dropmill_use_0', $u$Ball Nose Endmills with Tangent Straight Edge Inserts for Finish Profiling$u$, $u$Endmills$u$, 0, $u$[{"name": "BCM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1170&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_dropmill_use_1', $u$Ball Nose Endmills with FLEXFIT Threaded Adaptation Carrying Tangent Straight Edge Inserts for Finish Profiling$u$, $u$Endmills$u$, 1, $u$[{"name": "BCM-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2381&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_dropmill_use_2', $u$Ball Nose Endmills with MULTI-MASTER Threaded Adaptation with Tangentially Mounted Straight Edge Inserts$u$, $u$Endmills$u$, 2, $u$[{"name": "BCM-MM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2522&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_dropmill_use_3', $u$Three Flute 240° Ball Nose Endmills Carrying Double-Sided Inserts$u$, $u$Endmills$u$, 3, $u$[{"name": "BLP Endmills", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3702&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_dropmill_use_4', $u$Three Flute Fully Effective 240° Ball Nose Endmills with FLEXFIT Threaded Adaptation$u$, $u$Endmills$u$, 4, $u$[{"name": "BLP-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4819&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_dropmill_use_5', $u$Ball Nose Inserts with a Straight Cutting Edge Tangent to a Round Corner$u$, $u$Inserts$u$, 5, $u$[{"name": "BCR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1171&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_dropmill_use_6', $u$Round Segment Double-Sided Inserts for Ball Nose Milling Cutters$u$, $u$Tools$u$, 6, $u$[{"name": "BLR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3701&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_dropmill_use_7', $u$Three Flute Fully Effective 240° Ball Nose Cutters with Shell Hole Adaptation$u$, $u$Tools$u$, 7, $u$[{"name": "BLP Shell Mill", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3705&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_dropmill_use_8', $u$Extended Flute Ball Nose Endmills$u$, $u$Extended flute cutters$u$, 8, $u$[{"name": "BLPK", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3910&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'DROPMILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- TOR-6-MILL
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_tor6mill', 'TOR-6-MILL', 'Milling', $u$TOR-6-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as double-Sided Inserts with Six Round Cutting Edges, Available in 0.5 up to 3.0 mm Corner Radii.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TOR6MILL')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$TOR-6-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as double-Sided Inserts with Six Round Cutting Edges, Available in 0.5 up to 3.0 mm Corner Radii.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TOR6MILL' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TOR6MILL'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_tor6mill_use_0', $u$Double-Sided Inserts with Six Round Cutting Edges, Available in 0.5 up to 3.0 mm Corner Radii$u$, $u$Inserts$u$, 0, $u$[{"name": "TR6 TNCU/MU", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4194&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tor6mill_use_1', $u$Single-Sided Insert with Three Cutting Edges for High Feed Machining$u$, $u$Inserts$u$, 1, $u$[{"name": "TRFF TXMT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4196&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tor6mill_use_2', $u$Single-Sided Insert with Three Cutting Edges for 90° Shoulder and Face Milling$u$, $u$Face mills$u$, 2, $u$[{"name": "TR90 TXMT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4195&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tor6mill_use_3', $u$Single-Sided Inserts with Three Cutting Edges for 45° Chamfering and Face Milling$u$, $u$Face mills$u$, 3, $u$[{"name": "TR45 TXMT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4197&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tor6mill_use_4', $u$Multifunction Face Mills That Carry Four Different Insert Geometries$u$, $u$Face mills$u$, 4, $u$[{"name": "TR6 FR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4203&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tor6mill_use_5', $u$Multifunction Endmills That Carry Four Different Insert Geometries$u$, $u$Endmills$u$, 5, $u$[{"name": "TR6 ER", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4198&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tor6mill_use_6', $u$Multifunction Endmills with FLEXFIT Threaded Adaptation That Carry Four Different Insert Geometries$u$, $u$Endmills$u$, 6, $u$[{"name": "TR6 ER-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4201&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TOR6MILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- QUICK-D-MILL
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_quickdmill', 'QUICK-D-MILL', 'Milling', $u$QUICK-D-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as double-Sided Rectangle Inserts with 2 Center Cutting Edges for Drilling and 2 Peripheral Cutting Edges for Milling.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKDMILL')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$QUICK-D-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as double-Sided Rectangle Inserts with 2 Center Cutting Edges for Drilling and 2 Peripheral Cutting Edges for Milling.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKDMILL' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKDMILL'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_quickdmill_use_0', $u$Double-Sided Rectangle Inserts with 2 Center Cutting Edges for Drilling and 2 Peripheral Cutting Edges for Milling$u$, $u$Inserts$u$, 0, $u$[{"name": "MDR ANMU PNTR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5092&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_quickdmill_use_1', $u$Inserts With Sharp Cutting Edge and Polished Rake Face for ISO N Applications (for machining non-ferrous materials)$u$, $u$Inserts$u$, 1, $u$[{"name": "MDR ANHU FR-P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5587&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_quickdmill_use_2', $u$Multi-Function Modular Head for Endmill Cutters with a MULTI-MASTER Threaded Adaptation$u$, $u$Endmills$u$, 2, $u$[{"name": "MDR MMT-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5093&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_quickdmill_use_3', $u$Multi-Function Endmill Cutters$u$, $u$Endmills$u$, 3, $u$[{"name": "MDR D-C-AN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5094&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_quickdmill_use_4', $u$Multi-Function Modular Head for Endmill Cutters with a FLEXFIT Threaded Adaptation$u$, $u$Endmills$u$, 4, $u$[{"name": "MDR M-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5537&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKDMILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- FEED-MILL
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_feedmill', 'FEED-MILL', 'Milling', $u$FEED-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as fast Feed Endmills with FF WOMT... Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'FEEDMILL')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$FEED-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as fast Feed Endmills with FF WOMT... Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'FEEDMILL' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'FEEDMILL'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_feedmill_use_0', $u$Fast Feed Endmills with FF WOMT... Inserts$u$, $u$Endmills$u$, 0, $u$[{"name": "FF EW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1587&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_feedmill_use_1', $u$Fast Feed Endmills with CLICKFIT Shanks$u$, $u$Endmills$u$, 1, $u$[{"name": "FF EW-CF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1774&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_feedmill_use_2', $u$Fast Feed Endmills with FLEXFIT Threaded Adaptation$u$, $u$Endmills$u$, 2, $u$[{"name": "FF EW-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1800&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_feedmill_use_3', $u$Fast Feed Face Mills$u$, $u$Face mills$u$, 3, $u$[{"name": "FF FW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1589&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_feedmill_use_4', $u$Arc Cutting Edge Inserts for Fast Feed Machining at Small Depths of Cut$u$, $u$Inserts$u$, 4, $u$[{"name": "FF WOCT/WOMT/WOMW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1591&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'FEEDMILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- MILL-4-FEED
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_mill4feed', 'MILL-4-FEED', 'Milling', $u$MILL-4-FEED: indexable milling tools and inserts from the ISCAR milling catalog, such as single-Sided Square Inserts with 4 Cutting Edges for Fast Feed Milling.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MILL4FEED')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$MILL-4-FEED: indexable milling tools and inserts from the ISCAR milling catalog, such as single-Sided Square Inserts with 4 Cutting Edges for Fast Feed Milling.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MILL4FEED' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MILL4FEED'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_mill4feed_use_0', $u$Single-Sided Square Inserts with 4 Cutting Edges for Fast Feed Milling$u$, $u$Inserts$u$, 0, $u$[{"name": "FFQ4 SOMT/W 1205", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3903&mapp=ML&GFSTYP=M"}, {"name": "FFQ4 SOMT/W 0904", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4168&mapp=ML&GFSTYP=M"}, {"name": "FFQ4 SOMT/W 1706", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4181&mapp=ML&GFSTYP=M"}, {"name": "FFQ4 SOMT/W 0602", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5083&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_mill4feed_use_1', $u$Fast Feed Face Mills Carrying Single-Sided Square Inserts with 4 Cutting Edges$u$, $u$Face mills$u$, 1, $u$[{"name": "FFQ4 D-12", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3904&mapp=ML&GFSTYP=M"}, {"name": "FFQ4 D-09", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4169&mapp=ML&GFSTYP=M"}, {"name": "FFQ4 D-17", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4182&mapp=ML&GFSTYP=M"}, {"name": "FFQ4 D-06", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5657&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_mill4feed_use_2', $u$Fast Feed Endmills Carrying Single-Sided Square Inserts with 4 Cutting Edges$u$, $u$Endmills$u$, 2, $u$[{"name": "FFQ4 D-W-09", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4170&mapp=ML&GFSTYP=M"}, {"name": "FFQ4 D-C/W-06", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5084&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_mill4feed_use_3', $u$Fast Feed Endmills with FLEXFIT Threaded Adaptation Carrying Single-Sided Square Inserts with 4 Cutting Edges$u$, $u$Endmills$u$, 3, $u$[{"name": "FFQ4 D-M-09", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4171&mapp=ML&GFSTYP=M"}, {"name": "FFQ4 D-M-06", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5085&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_mill4feed_use_4', $u$Fast Feed Endmills with MULTI-MASTER Threaded Adaptation Carrying Single-Sided Square Inserts with 4 Cutting Edges$u$, $u$Endmills$u$, 4, $u$[{"name": "FFQ4 D-MM-06", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5086&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MILL4FEED'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- LOGIQ-4-FEED
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_logiq4feed', 'LOGIQ-4-FEED', 'Milling', $u$LOGIQ-4-FEED: indexable milling tools and inserts from the ISCAR milling catalog, such as endmills Carrying Small Double-Sided "Bone Shaped" Inserts with 4 Cutting Edges for Fast Feed Milling.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQ4FEED')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$LOGIQ-4-FEED: indexable milling tools and inserts from the ISCAR milling catalog, such as endmills Carrying Small Double-Sided "Bone Shaped" Inserts with 4 Cutting Edges for Fast Feed Milling.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQ4FEED' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQ4FEED'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_logiq4feed_use_0', $u$Endmills Carrying Small Double-Sided "Bone Shaped" Inserts with 4 Cutting Edges for Fast Feed Milling$u$, $u$Endmills$u$, 0, $u$[{"name": "FFX4 ED", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4280&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_logiq4feed_use_1', $u$Endmills with FLEXFIT Adaptation Carrying Small "Bone Shaped" Inserts with 4 Cutting Edges for Fast Feed Milling$u$, $u$Endmills$u$, 1, $u$[{"name": "FFX4 ED-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4288&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_logiq4feed_use_2', $u$Endmills with MULTI-MASTER Adaptation that Mount Small "Bone Shaped" Inserts with 4 Cutting Edges for Fast Feed Milling$u$, $u$Endmills$u$, 2, $u$[{"name": "FFX4 ED-MM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4361&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_logiq4feed_use_3', $u$Face Mills Carrying "Bone Shaped" Inserts with 4 Cutting Edges for Fast Feed Milling$u$, $u$Face mills$u$, 3, $u$[{"name": "FFX4 FD-04", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4289&mapp=ML&GFSTYP=M"}, {"name": "FFX4 FD-08", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4705&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_logiq4feed_use_4', $u$"Bone Shaped" Inserts with 4 Cutting Edges for Fast Feed Milling$u$, $u$Inserts$u$, 4, $u$[{"name": "FFX4 XNMU/W-04", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4291&mapp=ML&GFSTYP=M"}, {"name": "FFX4 XNMU-08", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4707&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQ4FEED'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- HELI-6-FEED
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_heli6feed', 'HELI-6-FEED', 'Milling', $u$HELI-6-FEED: indexable milling tools and inserts from the ISCAR milling catalog, such as fast Feed Face Mills Carrying Double-Sided Inserts with 6 Cutting Edges.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELI6FEED')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$HELI-6-FEED: indexable milling tools and inserts from the ISCAR milling catalog, such as fast Feed Face Mills Carrying Double-Sided Inserts with 6 Cutting Edges.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELI6FEED' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELI6FEED'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_heli6feed_use_0', $u$Fast Feed Face Mills Carrying Double-Sided Inserts with 6 Cutting Edges$u$, $u$Face mills$u$, 0, $u$[{"name": "FF FWX", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2591&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli6feed_use_1', $u$Moderate Feed Face Mills Carrying Double-Sided Inserts with 6 Cutting Edges$u$, $u$Face mills$u$, 1, $u$[{"name": "MF FWX", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3016&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli6feed_use_2', $u$Double-Sided Inserts with 6 Cutting Edges for Fast Feed Machining$u$, $u$Inserts$u$, 2, $u$[{"name": "H600 WXCU", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2593&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli6feed_use_3', $u$Fast Feed Endmills Carrying Double-Sided Inserts with 6 Cutting Edges$u$, $u$Endmills$u$, 3, $u$[{"name": "FF EWX", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2792&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli6feed_use_4', $u$Fast Feed Endmills with FLEXFIT Threaded Connection Carrying Double-Sided Inserts with 6 Cutting Edges$u$, $u$Endmills$u$, 4, $u$[{"name": "FF EWX-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2971&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli6feed_use_5', $u$Moderate Feed Endmills Carrying Double-Sided Inserts with 6 Cutting Edges$u$, $u$Endmills$u$, 5, $u$[{"name": "MF EWX", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3307&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli6feed_use_6', $u$Moderate Feed Endmills with FLEXFIT Threaded Connection Carrying Double-Sided Inserts with 6 Cutting Edges$u$, $u$Endmills$u$, 6, $u$[{"name": "MF EWX-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3309&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli6feed_use_7', $u$Fast Feed Endmills with MULTI-MASTER Threaded Connection That Mount Double-Sided Inserts with 6 Cutting Edges$u$, $u$Endmills$u$, 7, $u$[{"name": "FF EWX-MM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3368&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELI6FEED'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- HELI-12-FEED
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_heli12feed', 'HELI-12-FEED', 'Milling', $u$HELI-12-FEED: indexable milling tools and inserts from the ISCAR milling catalog, such as 34° Face Mills Carrying Hexagonal Inserts with 12 Cutting Edges.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELI12FEED')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$HELI-12-FEED: indexable milling tools and inserts from the ISCAR milling catalog, such as 34° Face Mills Carrying Hexagonal Inserts with 12 Cutting Edges.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELI12FEED' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELI12FEED'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_heli12feed_use_0', $u$34° Face Mills Carrying Hexagonal Inserts with 12 Cutting Edges$u$, $u$Face mills$u$, 0, $u$[{"name": "MF FHX-R06", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3766&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_heli12feed_use_1', $u$Double-Sided Hexagonal Inserts with 12 Cutting Edges$u$, $u$Inserts$u$, 1, $u$[{"name": "H1200 HXCU 0606", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3768&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELI12FEED'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- NEO-FEED
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_neofeed', 'NEO-FEED', 'Milling', $u$NEO-FEED: indexable milling tools and inserts from the ISCAR milling catalog, such as fast Feed Face Mills Carrying Double-Sided Square Inserts with 8 Cutting Edges.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'NEOFEED')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$NEO-FEED: indexable milling tools and inserts from the ISCAR milling catalog, such as fast Feed Face Mills Carrying Double-Sided Square Inserts with 8 Cutting Edges.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'NEOFEED' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'NEOFEED'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_neofeed_use_0', $u$Fast Feed Face Mills Carrying Double-Sided Square Inserts with 8 Cutting Edges$u$, $u$Face mills$u$, 0, $u$[{"name": "FFQ8-12", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4619&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_neofeed_use_1', $u$Moderate Feed Face Mills Carrying Double-Sided Square Inserts with 8 Cutting Edges$u$, $u$Face mills$u$, 1, $u$[{"name": "MFQ8-12", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4620&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_neofeed_use_2', $u$Double-Sided Square Inserts with 8 Cutting Edges for High Feed Milling$u$, $u$Inserts$u$, 2, $u$[{"name": "FFQ8 SZMU", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4623&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'NEOFEED'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- NAN-3-FEED
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_nan3feed', 'NAN-3-FEED', 'Milling', $u$NAN-3-FEED: indexable milling tools and inserts from the ISCAR milling catalog, such as small Diameter Endmills Carrying Single-Sided Triangular Inserts for Fast Feed Milling.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'NAN3FEED')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$NAN-3-FEED: indexable milling tools and inserts from the ISCAR milling catalog, such as small Diameter Endmills Carrying Single-Sided Triangular Inserts for Fast Feed Milling.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'NAN3FEED' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'NAN3FEED'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_nan3feed_use_0', $u$Small Diameter Endmills Carrying Single-Sided Triangular Inserts for Fast Feed Milling$u$, $u$Endmills$u$, 0, $u$[{"name": "FFT3 EFM-02", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4273&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_nan3feed_use_1', $u$Small Diameter Endmills with a MULTI-MASTER Threaded Adaptation that Mount Triangular Inserts for Fast Feed Milling$u$, $u$Endmills$u$, 1, $u$[{"name": "FFT3 EFM-MM 02", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4274&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_nan3feed_use_2', $u$Triangular Miniature Inserts for Fast Feed Milling at Small Depths of Cut$u$, $u$Inserts$u$, 2, $u$[{"name": "FFT3 TXMT 02", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4275&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'NAN3FEED'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- MICRO-3-FEED
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_micro3feed', 'MICRO-3-FEED', 'Milling', $u$MICRO-3-FEED: indexable milling tools and inserts from the ISCAR milling catalog, such as endmills Carrying Single-Sided Small Trigon Inserts for Fast Feed Milling.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MICRO3FEED')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$MICRO-3-FEED: indexable milling tools and inserts from the ISCAR milling catalog, such as endmills Carrying Single-Sided Small Trigon Inserts for Fast Feed Milling.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MICRO3FEED' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MICRO3FEED'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_micro3feed_use_0', $u$Endmills Carrying Single-Sided Small Trigon Inserts for Fast Feed Milling$u$, $u$Endmills$u$, 0, $u$[{"name": "FFT3 EFM-03", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4276&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_micro3feed_use_1', $u$Endmills with a MULTI-MASTER Threaded Adaptation Carrying Single-Sided Small Trigon Inserts for Fast Feed Milling$u$, $u$Endmills$u$, 1, $u$[{"name": "FFT3 EFM-MM 03", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4278&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_micro3feed_use_2', $u$Single-Sided Small Trigon Inserts for Fast Feed Milling$u$, $u$Inserts$u$, 2, $u$[{"name": "FFT3 WXMT 03", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4279&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MICRO3FEED'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- 16-FEED-MILL
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_16feedmill', '16-FEED-MILL', 'Milling', $u$16-FEED-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as fast Feed Face Mills Carrying Octagonal ONHU/MU 0806... Inserts with 16 Cutting Edges.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = '16FEEDMILL')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$16-FEED-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as fast Feed Face Mills Carrying Octagonal ONHU/MU 0806... Inserts with 16 Cutting Edges.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = '16FEEDMILL' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = '16FEEDMILL'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_16feedmill_use_0', $u$Fast Feed Face Mills Carrying Octagonal ONHU/MU 0806... Inserts with 16 Cutting Edges$u$, $u$Face mills$u$, 0, $u$[{"name": "FF NM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2475&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = '16FEEDMILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- CER-MILL
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_cermill', 'CER-MILL', 'Milling', $u$CER-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as endmills Carrying Single-Sided Ceramic Round Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CERMILL')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$CER-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as endmills Carrying Single-Sided Ceramic Round Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CERMILL' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CERMILL'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_cermill_use_0', $u$Endmills Carrying Single-Sided Ceramic Round Inserts$u$, $u$Endmills$u$, 0, $u$[{"name": "ERP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5353&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_cermill_use_1', $u$Fast Feed Face Mills Carrying Double-Sided Inserts with 6 Cutting Edges$u$, $u$Face mills$u$, 1, $u$[{"name": "FFN FD-12", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5474&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_cermill_use_2', $u$Fast Feed Face Mills Carrying Double-Sided Inserts with 4 Cutting Edges$u$, $u$Face mills$u$, 2, $u$[{"name": "EFN FD-09", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5476&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CERMILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- HELI-SLOT
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_helislot', 'HELI-SLOT', 'Milling', $u$HELI-SLOT: indexable milling tools and inserts from the ISCAR milling catalog, such as full Slot Flange Type Slotting Cutters Carrying XNMU 1306 Square Inserts with 4 Right- and 4 Left-Hand Cutting Edges.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELISLOT')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$HELI-SLOT: indexable milling tools and inserts from the ISCAR milling catalog, such as full Slot Flange Type Slotting Cutters Carrying XNMU 1306 Square Inserts with 4 Right- and 4 Left-Hand Cutting Edges.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELISLOT' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELISLOT'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_helislot_use_0', $u$Full Slot Flange Type Slotting Cutters Carrying XNMU 1306 Square Inserts with 4 Right- and 4 Left-Hand Cutting Edges$u$, $u$Slotting & slitting cutters$u$, 0, $u$[{"name": "FDN-XN13", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3323&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helislot_use_1', $u$T-Slot Endmills Carrying XNMU 1306 Square Inserts with 4 Right- and 4 Left-Hand Cutting Edges$u$, $u$Slotting & slitting cutters$u$, 1, $u$[{"name": "ETS-XN13", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3592&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helislot_use_2', $u$Full Slot Disk Type Slotting Cutters Carrying XNMU 1306 Square Inserts with 4 Right- and 4 Left-Hand Cutting Edges$u$, $u$Slotting & slitting cutters$u$, 2, $u$[{"name": "SDN-XN13", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3610&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helislot_use_3', $u$Full Slot Disk Type Slotting Cutters Carrying XNMU 0904 Square Inserts with 4 Right- and 4 Left-Hand Cutting Edges$u$, $u$Slotting & slitting cutters$u$, 3, $u$[{"name": "SDN-XN09", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4526&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helislot_use_4', $u$Full Slot Flange Type Slotting Cutters Carrying XNMU 0904 Square Inserts with 4 Right- and 4 Left-Hand Cutting Edges$u$, $u$Slotting & slitting cutters$u$, 4, $u$[{"name": "FDN-XN09", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4527&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helislot_use_5', $u$T-SLOT Endmills Carrying XNMU 0904 Square Inserts with 4 Right- and 4 Left-Hand Cutting Edges$u$, $u$Slotting & slitting cutters$u$, 5, $u$[{"name": "ETS-XN09", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4613&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helislot_use_6', $u$Full Slot Disk Type Slotting Cutters Carrying XNMU 0603 Square Inserts with 4 Right- and 4 Left-Hand Cutting Edges$u$, $u$Slotting & slitting cutters$u$, 6, $u$[{"name": "SDN-XN06", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4792&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helislot_use_7', $u$Full Slot Flange Type Slotting Cutters Carrying XNMU 0603 Square Inserts with 4 Right- and 4 Left-Hand Cutting Edges$u$, $u$Slotting & slitting cutters$u$, 7, $u$[{"name": "FDN-XN06", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4793&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helislot_use_8', $u$T-SLOT Endmills Carrying XNMU 0603 Square Inserts with 4 Right- and 4 Left-Hand Cutting Edges$u$, $u$Slotting & slitting cutters$u$, 8, $u$[{"name": "ETS-XN06", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4794&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helislot_use_9', $u$T-SLOT Endmills with a MULTI-MASTER Threaded Connection, Mount XNMU 0603 Square Inserts$u$, $u$Slotting & slitting cutters$u$, 9, $u$[{"name": "ETS-XN06-MM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5073&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helislot_use_10', $u$Square Inserts with 4 Right- and 4 Left-Hand Cutting Edges$u$, $u$Inserts$u$, 10, $u$[{"name": "XNMU/XNHU 13", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3324&mapp=ML&GFSTYP=M"}, {"name": "XNMU/XNHU 09", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4512&mapp=ML&GFSTYP=M"}, {"name": "XNMU/XNHU 06", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4791&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helislot_use_11', $u$Extended Flute Shell Mills Carrying XNMU 1306... Inserts$u$, $u$Extended flute cutters$u$, 11, $u$[{"name": "SM-XN13", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4066&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_helislot_use_12', $u$Extended Flute Endmills Carrying XNMU 1306... Inserts$u$, $u$Extended flute cutters$u$, 12, $u$[{"name": "XNK-XN13", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4067&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELISLOT'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- TANG-SLOT
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_tangslot', 'TANG-SLOT', 'Milling', $u$TANG-SLOT: indexable milling tools and inserts from the ISCAR milling catalog, such as full Slot Disk Type Slotting Cutters Carrying LNET 12 Tangentially Mounted Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TANGSLOT')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$TANG-SLOT: indexable milling tools and inserts from the ISCAR milling catalog, such as full Slot Disk Type Slotting Cutters Carrying LNET 12 Tangentially Mounted Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TANGSLOT' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TANGSLOT'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_tangslot_use_0', $u$Full Slot Disk Type Slotting Cutters Carrying LNET 12 Tangentially Mounted Inserts$u$, $u$Slotting & slitting cutters$u$, 0, $u$[{"name": "SDN-LN12", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1444&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangslot_use_1', $u$Tangentially Clamped Inserts with 4 Cutting Edges for Slotting Cutters$u$, $u$Slotting & slitting cutters$u$, 1, $u$[{"name": "LNET 12-TN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1446&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangslot_use_2', $u$Full Slot Cutters Carrying LNET 12... Tangentially Mounted Inserts$u$, $u$Slotting & slitting cutters$u$, 2, $u$[{"name": "FDN-LN12", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1577&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangslot_use_3', $u$Full Slot Adjustable Slotting Cutters with Cartridges Carrying LNET 12 Inserts$u$, $u$Slotting & slitting cutters$u$, 3, $u$[{"name": "FDN-CALN12", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1866&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangslot_use_4', $u$Full Slot Disk Type Slotting Cutters with Cartridges Carrying LNET 12... Tangentially Mounted Inserts$u$, $u$Slotting & slitting cutters$u$, 4, $u$[{"name": "SDN-CALN12", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1867&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangslot_use_5', $u$Tangentially Clamped Inserts with 4 Cutting Edges for Parting and Slitting$u$, $u$Inserts$u$, 5, $u$[{"name": "LNET 12..-30X1-N", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1576&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangslot_use_6', $u$Tangentially Clamped Inserts with 4 Cutting Edges for Milling Deep and Long Slots on Steel$u$, $u$Inserts$u$, 6, $u$[{"name": "LNET 12-TN-MM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2469&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TANGSLOT'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- MINI-TANG-SLOT
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_minitangslot', 'MINI-TANG-SLOT', 'Milling', $u$MINI-TANG-SLOT: indexable milling tools and inserts from the ISCAR milling catalog, such as grooving and Slitting Cutters.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MINITANGSLOT')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$MINI-TANG-SLOT: indexable milling tools and inserts from the ISCAR milling catalog, such as grooving and Slitting Cutters.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MINITANGSLOT' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MINITANGSLOT'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_minitangslot_use_0', $u$Grooving and Slitting Cutters$u$, $u$Slotting & slitting cutters$u$, 0, $u$[{"name": "ETS-LN08", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2423&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_minitangslot_use_1', $u$Disk Type Grooving and Slitting Cutters$u$, $u$Slotting & slitting cutters$u$, 1, $u$[{"name": "SDN-LN08", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2424&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_minitangslot_use_2', $u$Tangentially Clamped Inserts for Slotting and Grooving Cutters$u$, $u$Slotting & slitting cutters$u$, 2, $u$[{"name": "LNET 08", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2425&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_minitangslot_use_3', $u$Grooving and Slitting Cutters with FLEXFIT Threaded Adaptation$u$, $u$Slotting & slitting cutters$u$, 3, $u$[{"name": "ETS-LN08-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2490&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_minitangslot_use_4', $u$Full Slot Shell Mill Cutters Carrying LNET 08... Tangentially Mounted Inserts$u$, $u$Slotting & slitting cutters$u$, 4, $u$[{"name": "FDN-LN08", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3231&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_minitangslot_use_5', $u$Grooving and Slitting Cutters with MULTI-MASTER Threaded Adaptator$u$, $u$Slotting & slitting cutters$u$, 5, $u$[{"name": "ETS-LN08-MM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3848&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MINITANGSLOT'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- TANG-SLIT
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_tangslit', 'TANG-SLIT', 'Milling', $u$TANG-SLIT: indexable milling tools and inserts from the ISCAR milling catalog, such as slitting Cutters Carrying TANG-GRIP Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TANGSLIT')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$TANG-SLIT: indexable milling tools and inserts from the ISCAR milling catalog, such as slitting Cutters Carrying TANG-GRIP Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TANGSLIT' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TANGSLIT'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_tangslit_use_0', $u$Slitting Cutters Carrying TANG-GRIP Inserts$u$, $u$Slotting & slitting cutters$u$, 0, $u$[{"name": "TGSF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2808&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangslit_use_1', $u$Slitting Cutters with Coolant Channels Carrying TANG-GRIP Inserts$u$, $u$Slotting & slitting cutters$u$, 1, $u$[{"name": "TGSF-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4113&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangslit_use_2', $u$Grooving and Slitting Small Diameter Cutters with FLEXFIT Threaded Adaptation$u$, $u$Slotting & slitting cutters$u$, 2, $u$[{"name": "TGSF-M-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4327&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tangslit_use_3', $u$Grooving and Slitting Small Diameter Cutters with MULTI-MASTER Threaded Adaptor$u$, $u$Slotting & slitting cutters$u$, 3, $u$[{"name": "TGSF-MM-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4328&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TANGSLIT'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- SLIM-SLIT
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_slimslit', 'SLIM-SLIT', 'Milling', $u$SLIM-SLIT: indexable milling tools and inserts from the ISCAR milling catalog, such as thin Slitting Cutters Carrying SLIMGRIP Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SLIMSLIT')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$SLIM-SLIT: indexable milling tools and inserts from the ISCAR milling catalog, such as thin Slitting Cutters Carrying SLIMGRIP Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SLIMSLIT' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SLIMSLIT'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_slimslit_use_0', $u$Thin Slitting Cutters Carrying SLIMGRIP Inserts$u$, $u$Slotting & slitting cutters$u$, 0, $u$[{"name": "SGST", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4212&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SLIMSLIT'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- SELF-GRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_selfgrip', 'SELF-GRIP', 'Milling', $u$SELF-GRIP: indexable milling tools and inserts from the ISCAR milling catalog, such as sELF-GRIP Slitting Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SELFGRIP')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$SELF-GRIP: indexable milling tools and inserts from the ISCAR milling catalog, such as sELF-GRIP Slitting Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SELFGRIP' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SELFGRIP'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_selfgrip_use_0', $u$SELF-GRIP Slitting Inserts$u$, $u$Inserts$u$, 0, $u$[{"name": "GSFN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=229&mapp=ML&GFSTYP=M"}, {"name": "GSAN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2241&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_selfgrip_use_1', $u$Slitting and Grooving Full Radius Inserts$u$, $u$Inserts$u$, 1, $u$[{"name": "GSFU", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=230&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_selfgrip_use_2', $u$Slitting Cutters Carrying Self-Clamped Inserts$u$, $u$Slotting & slitting cutters$u$, 2, $u$[{"name": "SGSF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=381&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_selfgrip_use_3', $u$Slitting Inserts for Specially Tailored Heavy Duty Slitting Cutters$u$, $u$Slotting & slitting cutters$u$, 3, $u$[{"name": "GSHT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1068&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_selfgrip_use_4', $u$Slitting Cutters Carrying GSAN Self-Clamped Inserts$u$, $u$Slotting & slitting cutters$u$, 4, $u$[{"name": "SGSA", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2235&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_selfgrip_use_5', $u$Grooving and Slitting Cutters with Integral Weldon Shanks$u$, $u$Slotting & slitting cutters$u$, 5, $u$[{"name": "SGSF-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3256&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_selfgrip_use_6', $u$Grooving and Slitting Small Diameter Cutters with FLEXFIT Threaded Adaptation$u$, $u$Slotting & slitting cutters$u$, 6, $u$[{"name": "SGSF/A-M-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4325&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_selfgrip_use_7', $u$Grooving and Slitting Small Diameter Cutters with the MULTI-MASTER Threaded Adaptor$u$, $u$Slotting & slitting cutters$u$, 7, $u$[{"name": "SGSF/A-MM-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4326&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SELFGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- CUT-GRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_cutgrip', 'CUT-GRIP', 'Milling', $u$CUT-GRIP: indexable milling tools and inserts from the ISCAR milling catalog, such as endmills for Groove Milling, with GIPI/GIFI/TIPI Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CUTGRIP')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$CUT-GRIP: indexable milling tools and inserts from the ISCAR milling catalog, such as endmills for Groove Milling, with GIPI/GIFI/TIPI Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CUTGRIP' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CUTGRIP'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_cutgrip_use_0', $u$Endmills for Groove Milling, with GIPI/GIFI/TIPI Inserts$u$, $u$Slotting & slitting cutters$u$, 0, $u$[{"name": "GM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=223&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_cutgrip_use_1', $u$Slitting Cutters Carrying Self-Clamped Inserts$u$, $u$Slotting & slitting cutters$u$, 1, $u$[{"name": "GM-DG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2074&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CUTGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- CHAM-SLIT
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_chamslit', 'CHAM-SLIT', 'Milling', $u$CHAM-SLIT: indexable milling tools and inserts from the ISCAR milling catalog, such as slitting Shanks Carrying Triple-Edged Precision Ground Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMSLIT')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$CHAM-SLIT: indexable milling tools and inserts from the ISCAR milling catalog, such as slitting Shanks Carrying Triple-Edged Precision Ground Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMSLIT' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMSLIT'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_chamslit_use_0', $u$Slitting Shanks Carrying Triple-Edged Precision Ground Inserts$u$, $u$Slotting & slitting cutters$u$, 0, $u$[{"name": "TRIB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2271&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_chamslit_use_1', $u$Grooving Shell Mills with Triple-Edged Precision Ground Inserts$u$, $u$Slotting & slitting cutters$u$, 1, $u$[{"name": "TRIB-SM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2485&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_chamslit_use_2', $u$Triple-Edged Groove Milling Inserts$u$, $u$Inserts$u$, 2, $u$[{"name": "TRI", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2403&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMSLIT'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- MODU-GEAR
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_modugear', 'MODU-GEAR', 'Milling', $u$MODU-GEAR: indexable milling tools and inserts from the ISCAR milling catalog, such as indexable Inserts for Involute Gear Profile Milling According to DIN 3972 Basic Profile ||.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MODUGEAR')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$MODU-GEAR: indexable milling tools and inserts from the ISCAR milling catalog, such as indexable Inserts for Involute Gear Profile Milling According to DIN 3972 Basic Profile ||.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MODUGEAR' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MODUGEAR'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_modugear_use_0', $u$Indexable Inserts for Involute Gear Profile Milling According to DIN 3972 Basic Profile ||$u$, $u$Inserts$u$, 0, $u$[{"name": "LNET 18-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4239&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_modugear_use_1', $u$Tools for Milling Gear Profile Carrying Tangentially Clamped Inserts$u$, $u$Tools$u$, 1, $u$[{"name": "ETS Gear Mill", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4248&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MODUGEAR'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- MILL-THREAD
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_millthread', 'MILL-THREAD', 'Milling', $u$MILL-THREAD: indexable milling tools and inserts from the ISCAR milling catalog, such as endmills with Coolant Holes for Helical Threading Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MILLTHREAD')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$MILL-THREAD: indexable milling tools and inserts from the ISCAR milling catalog, such as endmills with Coolant Holes for Helical Threading Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MILLTHREAD' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MILLTHREAD'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_millthread_use_0', $u$Endmills with Coolant Holes for Helical Threading Inserts$u$, $u$Thread milling tools$u$, 0, $u$[{"name": "MTSRH (Endmills)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2451&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millthread_use_1', $u$Shell Mills with Coolant Holes for Helical Threading Inserts$u$, $u$Thread milling tools$u$, 1, $u$[{"name": "MTSRH (helical shell mill)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2452&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millthread_use_2', $u$Indexable Multi-Insert Threading Endmills with Weldon Shanks for Single Point Inserts$u$, $u$Thread milling tools$u$, 2, $u$[{"name": "MTSR M.I. S.P.", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3569&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millthread_use_3', $u$Indexable Threading Endmills with a MULTI-MASTER Shank Connection$u$, $u$Thread milling tools$u$, 3, $u$[{"name": "MTE-MM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4042&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millthread_use_4', $u$Indexable Threading Endmills$u$, $u$Thread milling tools$u$, 4, $u$[{"name": "MTE D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4057&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millthread_use_5', $u$Multi Insert Threading Endmills with Weldon Shanks$u$, $u$Thread milling tools$u$, 5, $u$[{"name": "MTE D (Multi Insert)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4058&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millthread_use_6', $u$Thread Milling Multi-Insert Shell Mills$u$, $u$Thread milling tools$u$, 6, $u$[{"name": "MTF D (Shell Mill)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4059&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millthread_use_7', $u$Indexable Threading Endmills with Cylindrical Carbide Shanks$u$, $u$Thread milling tools$u$, 7, $u$[{"name": "MTE D-C", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4063&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millthread_use_8', $u$Indexable Threading Endmills with Cylindrical Shanks for Single Point Inserts$u$, $u$Thread milling tools$u$, 8, $u$[{"name": "MTET Single Point", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4086&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millthread_use_9', $u$External Multi-Tooth Threading Shell Mills$u$, $u$Thread milling tools$u$, 9, $u$[{"name": "MTFLE", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4089&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_millthread_use_10', $u$Indexable Threading Endmills for Helical Threading Inserts with a MULTI-MASTER Shank Connection and Coolant Holes$u$, $u$Thread milling tools$u$, 10, $u$[{"name": "MTSRH-MM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5596&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MILLTHREAD'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- QUICK-M-THREAD
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_quickmthread', 'QUICK-M-THREAD', 'Milling', $u$QUICK-M-THREAD: indexable milling tools and inserts from the ISCAR milling catalog, such as indexable Threading Endmills with Weldon Shanks for Single Point Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKMTHREAD')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$QUICK-M-THREAD: indexable milling tools and inserts from the ISCAR milling catalog, such as indexable Threading Endmills with Weldon Shanks for Single Point Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKMTHREAD' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKMTHREAD'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_quickmthread_use_0', $u$Indexable Threading Endmills with Weldon Shanks for Single Point Inserts$u$, $u$Thread milling tools$u$, 0, $u$[{"name": "MTET Step Release", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5247&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKMTHREAD'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- SOLID-THREAD
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_solidthread', 'SOLID-THREAD', 'Milling', $u$SOLID-THREAD: indexable milling tools and inserts from the ISCAR milling catalog, such as small Diameter Solid Carbide Threading Endmills for an Internal ISO Profile.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDTHREAD')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$SOLID-THREAD: indexable milling tools and inserts from the ISCAR milling catalog, such as small Diameter Solid Carbide Threading Endmills for an Internal ISO Profile.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDTHREAD' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDTHREAD'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_solidthread_use_0', $u$Small Diameter Solid Carbide Threading Endmills for an Internal ISO Profile$u$, $u$Thread milling tools$u$, 0, $u$[{"name": "MTECS-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1398&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_1', $u$Solid Carbide Internal Threading Endmills for ISO Thread Profile$u$, $u$Thread milling tools$u$, 1, $u$[{"name": "MTEC-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1647&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_2', $u$Solid Carbide Threading Endmills for Internal or External BSF/BSP Thread Profiles$u$, $u$Thread milling tools$u$, 2, $u$[{"name": "MTEC-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1649&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_3', $u$Solid Carbide Threading Endmills for Internal UN Thread Profile$u$, $u$Thread milling tools$u$, 3, $u$[{"name": "MTEC-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1650&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_4', $u$Solid Carbide Threading Endmills for an External or Internal BSPT Thread Profile$u$, $u$Thread milling tools$u$, 4, $u$[{"name": "MTEC-BSPT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1651&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_5', $u$Solid Carbide Threading Endmills for an External or Internal NPT Thread Profile$u$, $u$Thread milling tools$u$, 5, $u$[{"name": "MTEC-NPT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1653&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_6', $u$Solid Carbide Threading Endmills for an External or Internal NPTF Thread Profile$u$, $u$Thread milling tools$u$, 6, $u$[{"name": "MTEC-NPTF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1655&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_7', $u$Small Diameter Solid Carbide UN Profile Threading Endmills for Steel$u$, $u$Thread milling tools$u$, 7, $u$[{"name": "MTECS-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2019&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_8', $u$Solid Carbide Internal Threading Endmills with Coolant Hole for ISO Thread Profile$u$, $u$Thread milling tools$u$, 8, $u$[{"name": "MTECB-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2083&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_9', $u$Solid Carbide Threading Endmills with Coolant Hole for Internal UN Thread Profile$u$, $u$Thread milling tools$u$, 9, $u$[{"name": "MTECB-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2084&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_10', $u$Solid Carbide Threading Endmills with Coolant Hole for an External or Internal NPT Thread Profile$u$, $u$Thread milling tools$u$, 10, $u$[{"name": "MTECB-NPT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2085&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_11', $u$Solid Carbide Threading Endmills with Coolant Holes, for External or Internal NPTF Thread Profile$u$, $u$Thread milling tools$u$, 11, $u$[{"name": "MTECB-NPTF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2086&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_12', $u$Solid Carbide Internal or External Threading Endmills with Coolant Hole for BSF/BSP Thread Profiles$u$, $u$Thread milling tools$u$, 12, $u$[{"name": "MTECB-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2087&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_13', $u$Solid Carbide External or Internal Threading Endmills with Coolant Holes, for BSPT Thread Profile$u$, $u$Thread milling tools$u$, 13, $u$[{"name": "MTECB-BSPT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2088&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_14', $u$Small Diameter Short Left-Hand Cut. Internal ISO Profile Threading Endmills for Hardened Steel$u$, $u$Thread milling tools$u$, 14, $u$[{"name": "MTECSH-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2458&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_15', $u$Small Diameter Short Left-Hand Cut Solid Carbide UN Profile Threading Endmills for Hardened Steel$u$, $u$Thread milling tools$u$, 15, $u$[{"name": "MTECSH-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2459&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_16', $u$Solid Carbide External Threading Endmills for an ISO Thread Profile$u$, $u$Thread milling tools$u$, 16, $u$[{"name": "MTEC E-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2460&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_17', $u$Solid Carbide Threading Endmills with UN Form for External Threading$u$, $u$Thread milling tools$u$, 17, $u$[{"name": "MTEC E-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2461&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_18', $u$Solid Carbide Internal Threading Endmills with Coolant Holes$u$, $u$Thread milling tools$u$, 18, $u$[{"name": "MTECZ-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2602&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_19', $u$Solid Carbide Threading Endmills with Coolant Holes for Internal or External BSF/BSP Thread$u$, $u$Thread milling tools$u$, 19, $u$[{"name": "MTECZ-BSF/BSP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2603&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_20', $u$Solid Carbide Threading Endmills with Coolant Holes Located in the Flutes for Internal UN Thread Profiles$u$, $u$Thread milling tools$u$, 20, $u$[{"name": "MTECZ-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2604&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_21', $u$Solid Carbide Threading Endmills with Coolant Holes Located in the Flutes, for Internal or External NPT Thread Profile$u$, $u$Thread milling tools$u$, 21, $u$[{"name": "MTECZ-NPT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2605&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_22', $u$Solid Carbide Threading Endmills with Coolant Holes for Internal or External NPTF Thread Profile$u$, $u$Thread milling tools$u$, 22, $u$[{"name": "MTECZ-NPTF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2606&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_23', $u$Solid Carbide Threading Endmills with Coolant Holes for an Internal or External BSPT Thread Profile$u$, $u$Thread milling tools$u$, 23, $u$[{"name": "MTECZ-BSPT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2607&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_24', $u$Small Diameter Short Solid Carbide MJ-Type Profile Threading Endmills$u$, $u$Thread milling tools$u$, 24, $u$[{"name": "MTECS-MJ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2826&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_25', $u$Small Diameter Short Solid Carbide UNJ-Type Profile Threading Endmills$u$, $u$Thread milling tools$u$, 25, $u$[{"name": "MTECS-UNJ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2827&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_26', $u$60° Partial Profile Solid Carbide Thread Mills for Internal and External Threads$u$, $u$Thread milling tools$u$, 26, $u$[{"name": "MTECI-A60", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2828&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_27', $u$Endmills with Through Tool Coolant and Reduced Neck Diameter for Deep Internal ISO Profile Threading$u$, $u$Thread milling tools$u$, 27, $u$[{"name": "MTECQ-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3067&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_28', $u$Solid Carbide Endmills with Internal Coolant Holes and a Reduced Diameter Neck, for Deep Internal UN Profile Threading$u$, $u$Thread milling tools$u$, 28, $u$[{"name": "MTECQ-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3068&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_29', $u$Solid Carbide Threading Endmills with Coolant Holes Located in the Flutes, for Internal or External Whitworth Thread$u$, $u$Thread milling tools$u$, 29, $u$[{"name": "MTECZ-Whitworth", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3211&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_30', $u$Short Solid Carbide Threading Endmills for Internal or External BSP and BSF Thread Profiles$u$, $u$Thread milling tools$u$, 30, $u$[{"name": "MTECS-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3240&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_31', $u$Small Diameter Short Left-Hand Cut. Solid Carbide Endmills for Internal ISO Profile Drilling, Threading and Chamfering$u$, $u$Thread milling tools$u$, 31, $u$[{"name": "MTECD-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3524&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_32', $u$Small Diameter, Short, Left Hand, Internal UN Profile Endmills for Drilling, Threading and Chamfering$u$, $u$Thread milling tools$u$, 32, $u$[{"name": "MTECD-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3525&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_33', $u$Small Diameter Solid Carbide Internal ISO Profile Threading and Chamfering Endmills, for Hard Materials$u$, $u$Thread milling tools$u$, 33, $u$[{"name": "MTECH-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3528&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_34', $u$Small Diameter Solid Carbide Internal UN Profile Threading and Chamfering Endmills, for Hard Materials$u$, $u$Thread milling tools$u$, 34, $u$[{"name": "MTECH-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3529&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_35', $u$Solid Carbide Threading Endmills with a Coolant Hole for External and Internal PG Full Profile (DIN 40430)$u$, $u$Thread milling tools$u$, 35, $u$[{"name": "MTECB-PG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3568&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_36', $u$Small Diameter Single Point Internal ISO Profile Solid Carbide Thread Mills$u$, $u$Thread milling tools$u$, 36, $u$[{"name": "MTECI-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3572&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_37', $u$Interchangeable Solid Carbide Heads for 60° Partial Profile Thread Milling$u$, $u$Thread milling tools$u$, 37, $u$[{"name": "SD TRD-M-SP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4043&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_38', $u$Interchangeable Solid Carbide Heads for 55° Partial Profile Thread Milling$u$, $u$Thread milling tools$u$, 38, $u$[{"name": "SD TRD-W-SP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4096&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidthread_use_39', $u$Solid Carbide External Threading Endmills for an UNJ Thread Profile$u$, $u$Thread milling tools$u$, 39, $u$[{"name": "MTEC E-UNJ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5419&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDTHREAD'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- SOLID-M-THREAD
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_solidmthread', 'SOLID-M-THREAD', 'Milling', $u$SOLID-M-THREAD: indexable milling tools and inserts from the ISCAR milling catalog, such as solid Carbide Internal Threading Endmills with a Coolant Hole. Intended for ISO Thread Profiles.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDMTHREAD')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$SOLID-M-THREAD: indexable milling tools and inserts from the ISCAR milling catalog, such as solid Carbide Internal Threading Endmills with a Coolant Hole. Intended for ISO Thread Profiles.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDMTHREAD' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'indexablemilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDMTHREAD'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_solidmthread_use_0', $u$Solid Carbide Internal Threading Endmills with a Coolant Hole. Intended for ISO Thread Profiles$u$, $u$Thread milling tools$u$, 0, $u$[{"name": "MTECBF-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5047&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidmthread_use_1', $u$Solid Carbide Internal Threading Endmills with a Coolant Hole. Intended for UN Thread Profile$u$, $u$Thread milling tools$u$, 1, $u$[{"name": "MTECBF-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5048&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidmthread_use_2', $u$Solid Carbide Internal or External Threading Endmills with a Coolant Hole. Intended for BSF/BSP Thread Profiles$u$, $u$Thread milling tools$u$, 2, $u$[{"name": "MTECBF-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5049&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidmthread_use_3', $u$Solid Carbide Internal Threading Endmill Step Release, Lead x3 With Coolant Holes, Used for ISO Thread Profile$u$, $u$Thread milling tools$u$, 3, $u$[{"name": "MTECM-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5151&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidmthread_use_4', $u$Solid Carbide Internal Threading Endmill Step Release, Lead x3 With Coolant Hole, Used for UN Thread Profiles$u$, $u$Thread milling tools$u$, 4, $u$[{"name": "MTECM-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5152&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidmthread_use_5', $u$Solid Carbide Internal Threading Endmill Step Release, Lead x2 With Coolant Hole, Used for ISO Thread Profile$u$, $u$Thread milling tools$u$, 5, $u$[{"name": "MTECK-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5153&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_solidmthread_use_6', $u$Solid Carbide Internal Threading Endmill Step Release, Lead x2 With Coolant Hole, Used for UN Thread Profiles$u$, $u$Thread milling tools$u$, 6, $u$[{"name": "MTECK-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5154&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDMTHREAD'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- HSS-MILL
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_hssmill', 'HSS-MILL', 'Milling', $u$HSS-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as hSS short ball nose endmills, 2 flute 30° helix..$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HSSMILL')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$HSS-MILL: indexable milling tools and inserts from the ISCAR milling catalog, such as hSS short ball nose endmills, 2 flute 30° helix..$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HSSMILL' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'endmills(sc)&mm' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HSSMILL'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_hssmill_use_0', $u$HSS short ball nose endmills, 2 flute 30° helix.$u$, $u$Endmills$u$, 0, $u$[{"name": "EBH-A2-HS (HSS)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1951&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_hssmill_use_1', $u$4 flute, 30° helix, medium length HSS endmills.$u$, $u$Endmills$u$, 1, $u$[{"name": "EH-A4-HS (HSS)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1963&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_hssmill_use_2', $u$3-5 flute, 30° helix, medium length roughing HSS endmills.$u$, $u$Endmills$u$, 2, $u$[{"name": "ERH-A-HS (HSS)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1964&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HSSMILL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- T-SLOT
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_tslot', 'T-SLOT', 'Milling', $u$T-SLOT: indexable milling tools and inserts from the ISCAR milling catalog, such as interchangeable Solid Carbide T-Slot Milling Heads.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TSLOT')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$T-SLOT: indexable milling tools and inserts from the ISCAR milling catalog, such as interchangeable Solid Carbide T-Slot Milling Heads.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TSLOT' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'endmills(sc)&mm' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TSLOT'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_tslot_use_0', $u$Interchangeable Solid Carbide T-Slot Milling Heads$u$, $u$Slotting & slitting cutters$u$, 0, $u$[{"name": "SD-SP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3328&mapp=ML&GFSTYP=M"}]$u$::jsonb),
  ('innovation_im_tslot_use_1', $u$Interchangeable Solid Carbide T-Slot Milling Heads with Full Radius$u$, $u$Slotting & slitting cutters$u$, 1, $u$[{"name": "SD-R-SP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5497&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TSLOT'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- T-FACE
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_tface', 'T-FACE', 'Milling', $u$T-FACE: indexable milling tools and inserts from the ISCAR milling catalog, such as interchangeable Solid Carbide Face Milling Heads.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TFACE')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$T-FACE: indexable milling tools and inserts from the ISCAR milling catalog, such as interchangeable Solid Carbide Face Milling Heads.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TFACE' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'endmills(sc)&mm' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TFACE'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_tface_use_0', $u$Interchangeable Solid Carbide Face Milling Heads$u$, $u$Face mills$u$, 0, $u$[{"name": "SD FM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4226&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TFACE'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- T-GEAR
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_im_tgear', 'T-GEAR', 'Milling', $u$T-GEAR: indexable milling tools and inserts from the ISCAR milling catalog, such as interchangeable Solid Carbide Heads for Involute Gear Profile Milling According to DIN 3972 Basic Profile ll.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TGEAR')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$T-GEAR: indexable milling tools and inserts from the ISCAR milling catalog, such as interchangeable Solid Carbide Heads for Involute Gear Profile Milling According to DIN 3972 Basic Profile ll.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TGEAR' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'endmills(sc)&mm' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TGEAR'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_im_tgear_use_0', $u$Interchangeable Solid Carbide Heads for Involute Gear Profile Milling According to DIN 3972 Basic Profile ll$u$, $u$Tools$u$, 0, $u$[{"name": "SD-M-N-SP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4237&mapp=ML&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TGEAR'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
