-- One-time: the turning catalog brands (Solutions) with their uses from the ISCAR
-- intranet e-catalog (ISO-Turning, Groove-Turn & Parting, Threading), each family
-- linked to its page; families with the same description share a use. Each brand
-- is linked to the applications its families are listed under. An existing brand
-- is kept: it gets the applications, a description if it has none, and the uses
-- it doesn't have (by name).

-- QUICK-TURN
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_quickturn', 'QUICK-TURN', 'Turning', $u$QUICK-TURN: turning tools and inserts from the ISCAR turning catalog, such as safety Lock Tools with High Feed Negative Inserts for Roughing Applications.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKTURN')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$QUICK-TURN: turning tools and inserts from the ISCAR turning catalog, such as safety Lock Tools with High Feed Negative Inserts for Roughing Applications.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKTURN' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKTURN'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_quickturn_use_0', $u$Safety Lock Tools with High Feed Negative Inserts for Roughing Applications$u$, $u$Toolholders$u$, 0, $u$[{"name": "Q6-DMXNR/L-SL-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5306&mapp=IS&GFSTYP=M"}, {"name": "Q6-DMXNN-SL-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5320&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickturn_use_1', $u$Y-Axis Turning Tools with a Safety Lock Clamping Mechanism for Negative Inserts, Intended for Roughing and Medium App.$u$, $u$Toolholders$u$, 1, $u$[{"name": "C#-Q6-DMXNN-SL-Y", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5359&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickturn_use_2', $u$Safety Lock Tools with CAMFIX Shanks for High Feed Negative Inserts for Roughing Applications$u$, $u$Toolholders$u$, 2, $u$[{"name": "C#-Q6-DMXNR/L-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5421&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickturn_use_3', $u$High Feed Insert with Six Reinforced Cutting Edges and Negative Flank for Roughing Applications$u$, $u$Inserts$u$, 3, $u$[{"name": "Q6-MNMG-M3P-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5308&mapp=IS&GFSTYP=M"}, {"name": "Q6-MNMG-M3M-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5309&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKTURN'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- QUICK-T-LOCK
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_quicktlock', 'QUICK-T-LOCK', 'Turning', $u$QUICK-T-LOCK: turning tools and inserts from the ISCAR turning catalog, such as safety Lock Tools on which High Feed Positive Inserts are Mounted for Roughing Applications.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKTLOCK')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$QUICK-T-LOCK: turning tools and inserts from the ISCAR turning catalog, such as safety Lock Tools on which High Feed Positive Inserts are Mounted for Roughing Applications.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKTLOCK' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKTLOCK'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_quicktlock_use_0', $u$Safety Lock Tools on which High Feed Positive Inserts are Mounted for Roughing Applications$u$, $u$Toolholders$u$, 0, $u$[{"name": "Q3-SMXCR/L-SL-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5276&mapp=IS&GFSTYP=M"}, {"name": "Q3-SMXCN-SL-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5278&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quicktlock_use_1', $u$Y-Axis Turning Tools with Safety Lock Clamping Mechanism for Positive Inserts, for Roughing and Medium Applications$u$, $u$Toolholders$u$, 1, $u$[{"name": "C#-Q3-SMXCN-SL-Y", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5355&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quicktlock_use_2', $u$Safety Lock Tools with CAMFIX Shanks for High Feed Positive Inserts for Roughing Applications$u$, $u$Toolholders$u$, 2, $u$[{"name": "C#-Q3-SMXCR/L-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5420&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quicktlock_use_3', $u$Safety Lock Tools with High-Pressure Coolant Channels and High-Feed Positive Inserts for Roughing$u$, $u$Toolholders$u$, 3, $u$[{"name": "Q3-SMXCR/L-SL-JHP-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5669&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quicktlock_use_4', $u$High Feed Inserts with 3 Reinforced Cutting Edges and a Positive Flank$u$, $u$Inserts$u$, 4, $u$[{"name": "Q3-MCMT-R3M-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5280&mapp=IS&GFSTYP=M"}, {"name": "Q3-MCMT-R3P-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5281&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKTLOCK'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- JET-R-TURN
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_jetrturn', 'JET-R-TURN', 'Turning', $u$JET-R-TURN: turning tools and inserts from the ISCAR turning catalog, such as rigid Clamp Tools with Channels for High-Pressure Coolant Carrying 55° Rhombic Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'JETRTURN')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$JET-R-TURN: turning tools and inserts from the ISCAR turning catalog, such as rigid Clamp Tools with Channels for High-Pressure Coolant Carrying 55° Rhombic Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'JETRTURN' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'JETRTURN'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_jetrturn_use_0', $u$Rigid Clamp Tools with Channels for High-Pressure Coolant Carrying 55° Rhombic Inserts$u$, $u$Toolholders$u$, 0, $u$[{"name": "DDJNR/L-JHP-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4259&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_jetrturn_use_1', $u$Rigid Clamp Tools with Channels for High-Pressure Coolant Carrying 80° Rhombic Inserts$u$, $u$Toolholders$u$, 1, $u$[{"name": "DCLNR/L-JHP-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4261&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_jetrturn_use_2', $u$Rigid Clamp Tools with Channels for High-Pressure Coolant Carrying 80° Trigon Inserts$u$, $u$Toolholders$u$, 2, $u$[{"name": "DWLNR/L-JHP-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4262&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'JETRTURN'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- HELI-TURN-LD
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_heliturnld', 'HELI-TURN-LD', 'Turning', $u$HELI-TURN-LD: turning tools and inserts from the ISCAR turning catalog, such as double-Sided 80° Rhombic Inserts with a High Helical Cutting Edge for High Metal Removal Rates.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELITURNLD')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$HELI-TURN-LD: turning tools and inserts from the ISCAR turning catalog, such as double-Sided 80° Rhombic Inserts with a High Helical Cutting Edge for High Metal Removal Rates.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELITURNLD' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELITURNLD'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_heliturnld_use_0', $u$Double-Sided 80° Rhombic Inserts with a High Helical Cutting Edge for High Metal Removal Rates$u$, $u$Inserts$u$, 0, $u$[{"name": "CNMX-M3/4PW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1292&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturnld_use_1', $u$Double-Sided Trigon Inserts with High Helical Cutting Edge for High Metal Removal Rates$u$, $u$Inserts$u$, 1, $u$[{"name": "WNMX-M3/4PW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2816&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturnld_use_2', $u$Double-Sided 55° Rhombic Inserts with High Helical Cutting Edge for High Metal Removal Rates$u$, $u$Inserts$u$, 2, $u$[{"name": "DNMX-M3P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2923&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturnld_use_3', $u$Very Positive Radial Insert with a Helical Cutting Edge and Positive Rake for Heavy Machining Applications$u$, $u$Inserts$u$, 3, $u$[{"name": "CNMM-M4PW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2967&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturnld_use_4', $u$Double-Sided 80° Rhombic Inserts with a High Helical Cutting Edge for High Metal Removal Rates on Stainless Steel$u$, $u$Inserts$u$, 4, $u$[{"name": "CNMX-M3/4MW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3026&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturnld_use_5', $u$Double-Sided Trigon Inserts for Machining Stainless Steel, High Temperature Alloys and Soft, Low Carbon Steel$u$, $u$Inserts$u$, 5, $u$[{"name": "WNMX-M3/4MW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3066&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturnld_use_6', $u$Double-Sided Triangular Inserts with High Helical Cutting Edge for High Metal Removal Rates on Steel$u$, $u$Inserts$u$, 6, $u$[{"name": "TNMX-M3/4PW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3410&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturnld_use_7', $u$Double-Sided Triangular Inserts with High Helical Cutting Edge for High Metal Removal Rates on Stainless Steel$u$, $u$Inserts$u$, 7, $u$[{"name": "TNMX-M3/4MW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3411&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturnld_use_8', $u$Lever Lock Tools Carrying CNMX/CNMG 80° Rhombic Inserts$u$, $u$Toolholders$u$, 8, $u$[{"name": "PCLNR/L-X", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2435&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturnld_use_9', $u$Lever Lock External Turning Tools Carrying HELITURN LD WNMX or WNMG Trigon Inserts$u$, $u$Toolholders$u$, 9, $u$[{"name": "PWLNR/L-X", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2790&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturnld_use_10', $u$Lever Lock Tools with CAMFIX Shanks Carrying HELITURN LD WNMX or WNMG Inserts$u$, $u$Toolholders$u$, 10, $u$[{"name": "C#-PWLNR/L-X", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2931&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturnld_use_11', $u$Lever Lock Tools with CAMFIX Exchangeable Shanks Carrying CNMX and CNMG Rhombic Inserts$u$, $u$Toolholders$u$, 11, $u$[{"name": "C#-PCLNR/L-X", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2932&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturnld_use_12', $u$Lever Lock Tools with Channels for High-Pressure Coolant Carrying HELITURN LD WNMX or WNMG Trigon Inserts$u$, $u$Toolholders$u$, 12, $u$[{"name": "PWLNR/L-X-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3166&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturnld_use_13', $u$Lever Lock Tools with CAMFIX Shanks and Channels for High-Pressure Coolant, Carrying WNMX or WNMG Inserts$u$, $u$Toolholders$u$, 13, $u$[{"name": "C#-PWLNR/L-X-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3167&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturnld_use_14', $u$Lever Lock Tools with Channels for High-Pressure Coolant Carrying CNMX/CNMG 80° Rhombic Inserts$u$, $u$Toolholders$u$, 14, $u$[{"name": "PCLNR/L-X-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3170&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturnld_use_15', $u$Lever Lock Tools with CAMFIX Shanks and Channels for High-Pressure Coolant Carrying CNMX or CNMG Inserts$u$, $u$Toolholders$u$, 15, $u$[{"name": "C#-PCLNR/L-X-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3171&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturnld_use_16', $u$91° Entering Angle Lever Lock External Turning Tools Carrying Negative Triangular Inserts$u$, $u$Toolholders$u$, 16, $u$[{"name": "PTGNR/L-X", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3563&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturnld_use_17', $u$91° Entering Angle Lever Lock Tools with Channels for High-Pressure Coolant Carrying Negative Triangular Inserts$u$, $u$Toolholders$u$, 17, $u$[{"name": "PTGNR/L-X-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3698&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturnld_use_18', $u$Lever Lock Tools with Bottom Inlets for High-Pressure Coolant Channels Carrying CNMX/CNMG 80° Rhombic Inserts$u$, $u$Toolholders$u$, 18, $u$[{"name": "PCLNR/L-X-JHP-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3814&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturnld_use_19', $u$Lever Lock Tools with Bottom Inlets for High-Pressure Coolant Channels Carrying HELITURN LD WNMX and WNMG Trigon Inserts$u$, $u$Toolholders$u$, 19, $u$[{"name": "PWLNR/L-X-JHP-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3815&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturnld_use_20', $u$Tools with Bottom Inlets for High-Pressure Coolant Carrying TNMX and TNMG Triangular Inserts$u$, $u$Toolholders$u$, 20, $u$[{"name": "PTGNR/L-X-JHP-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3816&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturnld_use_21', $u$Lever Lock Boring Bars Carrying Negative CNMX/CNMG 80° Rhombic Inserts$u$, $u$Boring bars$u$, 21, $u$[{"name": "A/S-PCLNR/L-X/G", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2796&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturnld_use_22', $u$Lever Lock Boring Bars with Coolant Holes Carrying HELITURN LD WNMX or WNMG Trigon Inserts$u$, $u$Boring bars$u$, 22, $u$[{"name": "A-PWLNR/L-X/G", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3019&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturnld_use_23', $u$91° Entering Angle Lever Lock Boring Bars Carrying Negative TNMX or TNMG Triangular Inserts$u$, $u$Boring bars$u$, 23, $u$[{"name": "A-PTFNR/L-X/G", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3747&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELITURNLD'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- MULTI-WEDGE
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_multiwedge', 'MULTI-WEDGE', 'Turning', $u$MULTI-WEDGE: turning tools and inserts from the ISCAR turning catalog, such as mULTI-WEDGE Lock External Tools Carrying 80° Negative Rhombic or Trigon or Square Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MULTIWEDGE')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$MULTI-WEDGE: turning tools and inserts from the ISCAR turning catalog, such as mULTI-WEDGE Lock External Tools Carrying 80° Negative Rhombic or Trigon or Square Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MULTIWEDGE' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MULTIWEDGE'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_multiwedge_use_0', $u$MULTI-WEDGE Lock External Tools Carrying 80° Negative Rhombic or Trigon or Square Inserts$u$, $u$Toolholders$u$, 0, $u$[{"name": "MULNR/L-12MW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1854&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_multiwedge_use_1', $u$MULTI-WEDGE Tools with CAMFIX Exchangeable Shanks Carrying 80° Negative Rhombic or Trigon or Square Inserts$u$, $u$Toolholders$u$, 1, $u$[{"name": "C#-MULNR/L-MW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1935&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_multiwedge_use_2', $u$MULTI-WEDGE Toolholders with HSK Taper Shanks for 80° Rhombic, Trigon and Square Inserts$u$, $u$Toolholders$u$, 2, $u$[{"name": "HSK A63WH-MULNR/L-MW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2151&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_multiwedge_use_3', $u$MULTI-WEDGE Tools with HSK Exchangeable Shanks Carrying 80° Negative Rhombic with Trigon or Square Inserts$u$, $u$Toolholders$u$, 3, $u$[{"name": "HSK A63WH-MUMNN-MW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2176&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_multiwedge_use_4', $u$MULTI-WEDGE Twin Toolholders with HSK Taper Shanks for 80° Rhombic, Trigon and Square Inserts$u$, $u$Toolholders$u$, 4, $u$[{"name": "HSK A63WH-MULNR-J12MWX2", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2450&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_multiwedge_use_5', $u$MULTI-WEDGE Lock Boring Bars Carrying 80° Negative Rhombic, Trigon, or Square Inserts$u$, $u$Boring bars$u$, 5, $u$[{"name": "S-MULNR-MW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1902&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_multiwedge_use_6', $u$Kit Contains 1 Toolholder and 3 Wedge Systems which can be used for the WNMG, CNMG and SNMG Inserts (5 of each incl.)$u$, $u$Kits$u$, 6, $u$[{"name": "KIT MULNR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2104&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MULTIWEDGE'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- DOVE-IQ-TURN
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_doveiqturn', 'DOVE-IQ-TURN', 'Turning', $u$DOVE-IQ-TURN: turning tools and inserts from the ISCAR turning catalog, such as lever Lock and Dovetail Pocket Tools for Fast Feed Longitudinal Turning.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'DOVEIQTURN')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$DOVE-IQ-TURN: turning tools and inserts from the ISCAR turning catalog, such as lever Lock and Dovetail Pocket Tools for Fast Feed Longitudinal Turning.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'DOVEIQTURN' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'DOVEIQTURN'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_doveiqturn_use_0', $u$Lever Lock and Dovetail Pocket Tools for Fast Feed Longitudinal Turning$u$, $u$Toolholders$u$, 0, $u$[{"name": "PWXOR/L-TF-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3399&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_doveiqturn_use_1', $u$Lever Lock and Dovetail Pocket Rigid Clamping Tools Carrying Unique Double-Sided Trigon Inserts$u$, $u$Toolholders$u$, 1, $u$[{"name": "PWLOR/L-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3412&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_doveiqturn_use_2', $u$Lever Lock and Dovetail Pocket Rigid Clamping Toolholders for Unique Double-Sided 80° Rhombic Inserts$u$, $u$Toolholders$u$, 2, $u$[{"name": "PCLOR/L-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3415&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_doveiqturn_use_3', $u$Lever Lock and Dovetail Pocket Rigid Clamping Tools Carrying Unique Double-Sided 80° Rhombic Inserts$u$, $u$Toolholders$u$, 3, $u$[{"name": "PCBOR/L-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3416&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_doveiqturn_use_4', $u$Lever Lock and Dovetail Pocket Rigid Clamping Tools Carrying Unique SOMG Double-Sided Square Inserts$u$, $u$Toolholders$u$, 4, $u$[{"name": "PSBOR/L-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3418&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_doveiqturn_use_5', $u$Lever Lock and Dovetail Pocket Rigid Clamping Tools Carrying Unique Double-Sided Square Inserts$u$, $u$Toolholders$u$, 5, $u$[{"name": "PSDON-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3419&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_doveiqturn_use_6', $u$Lever Lock and Dovetail Rigid Clamping Pocket with CAMFIX Shank Tools Carrying Unique Double-Sided Trigon Inserts$u$, $u$Toolholders$u$, 6, $u$[{"name": "C#-PWLOR/L-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3688&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_doveiqturn_use_7', $u$Lever Lock and Dovetail Pocket Tools with CAMFIX Shanks Carrying Unique Double-Sided 80° Rhombic Inserts$u$, $u$Toolholders$u$, 7, $u$[{"name": "C#-PCLOR/L-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3690&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_doveiqturn_use_8', $u$Lever Lock 55° Approach Angle Tool with a Pentagonal Shaped Insert$u$, $u$Toolholders$u$, 8, $u$[{"name": "PPXOR/L-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5484&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_doveiqturn_use_9', $u$Lever Lock 14.5° Approach Angle Tool with a Pentagonal Shaped Insert$u$, $u$Toolholders$u$, 9, $u$[{"name": "PPXOR/L-TF-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5486&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_doveiqturn_use_10', $u$Double-Sided 6° Negative Side Flank Trigon Inserts for High Feed Turning of Steel$u$, $u$Inserts$u$, 10, $u$[{"name": "WOMG-10-T3P-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3408&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_doveiqturn_use_11', $u$Double-Sided 7° Negative Side Flank Trigon Inserts for Heavy Turning of Steel$u$, $u$Inserts$u$, 11, $u$[{"name": "WOMG-13-R3P-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3409&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_doveiqturn_use_12', $u$Double-Sided 7° Negative Side Flank 80° Rhombic Inserts for Heavy Turning of Steel$u$, $u$Inserts$u$, 12, $u$[{"name": "COMG-R3P-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3414&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_doveiqturn_use_13', $u$Double-Sided 7° Negative Side Flank Square Inserts for Heavy Turning on Steel$u$, $u$Inserts$u$, 13, $u$[{"name": "SOMG-R3P-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3417&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_doveiqturn_use_14', $u$Single-Sided 7° Negative Side Flank 80° Rhombic Inserts for Heavy Turning of Steel$u$, $u$Inserts$u$, 14, $u$[{"name": "COMM-R3P-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4015&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_doveiqturn_use_15', $u$Double-Sided Pentagonal Shaped Insert for Medium, Rough, and High Feed Turning Applications$u$, $u$Inserts$u$, 15, $u$[{"name": "POMG-M3PW-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5485&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'DOVEIQTURN'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- NEO-TURN
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_neoturn', 'NEO-TURN', 'Turning', $u$NEO-TURN: turning tools and inserts from the ISCAR turning catalog, such as double-Sided 70° Rhombic Inserts for Semi-Finishing and Finishing Applications.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'NEOTURN')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$NEO-TURN: turning tools and inserts from the ISCAR turning catalog, such as double-Sided 70° Rhombic Inserts for Semi-Finishing and Finishing Applications.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'NEOTURN' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'NEOTURN'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_neoturn_use_0', $u$Double-Sided 70° Rhombic Inserts for Semi-Finishing and Finishing Applications$u$, $u$Inserts$u$, 0, $u$[{"name": "XNMG-F3P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4734&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_neoturn_use_1', $u$Double-Sided 70° Rhombic Inserts for Medium Machining Conditions on Steel$u$, $u$Inserts$u$, 1, $u$[{"name": "XNMG-M3P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4735&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_neoturn_use_2', $u$Double-sided 70° Rhombic Inserts for Stainless Steel Finishing Applications$u$, $u$Inserts$u$, 2, $u$[{"name": "XNMG-F3M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4736&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_neoturn_use_3', $u$Double-Sided 70° Rhombic Inserts for Machining Stainless and Low Carbon Steel$u$, $u$Inserts$u$, 3, $u$[{"name": "XNMG-M3M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4737&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_neoturn_use_4', $u$Rigid Clamp Tools with Channels for High-Pressure Coolant Carrying 70° Rhombic Inserts$u$, $u$Toolholders$u$, 4, $u$[{"name": "DXJNR/L-X-JHP-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4767&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_neoturn_use_5', $u$Interchangeable Boring Heads Carrying 70° Rhombic Inserts$u$, $u$Tools$u$, 5, $u$[{"name": "AVC-PXJNR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5127&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'NEOTURN'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- MINI-P-TURN
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_minipturn', 'MINI-P-TURN', 'Turning', $u$MINI-P-TURN: turning tools and inserts from the ISCAR turning catalog, such as double-Sided Trigon Inserts for Super Finish Machining Conditions on Stainless Steel.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MINIPTURN')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$MINI-P-TURN: turning tools and inserts from the ISCAR turning catalog, such as double-Sided Trigon Inserts for Super Finish Machining Conditions on Stainless Steel.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MINIPTURN' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MINIPTURN'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_minipturn_use_0', $u$Double-Sided Trigon Inserts for Super Finish Machining Conditions on Stainless Steel$u$, $u$Inserts$u$, 0, $u$[{"name": "WNGP-F2M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3729&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_minipturn_use_1', $u$Double-Sided Trigon Inserts for Super Finish Machining Conditions on Alloyed Steel$u$, $u$Inserts$u$, 1, $u$[{"name": "WNGP-F2P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3730&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_minipturn_use_2', $u$Double-Sided 55° Rhombic Inserts for Semi-Finishing and Finishing on Stainless Steel$u$, $u$Inserts$u$, 2, $u$[{"name": "DNGP-F2M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3731&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_minipturn_use_3', $u$Double-Sided 55° Rhombic Inserts for Semi-Finishing and Finishing Applications on Alloyed Steel$u$, $u$Inserts$u$, 3, $u$[{"name": "DNGP-F2P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3732&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_minipturn_use_4', $u$Boring Bars Carrying WNGP 0403.. Double-Sided Trigon Inserts for Small Diameters$u$, $u$Boring bars$u$, 4, $u$[{"name": "A/E-SWLNR/L-04", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3733&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_minipturn_use_5', $u$Boring Bars Carrying DNGP 0703.. Double-Sided 55° Rhombic Inserts for Small Diameters$u$, $u$Boring bars$u$, 5, $u$[{"name": "A/E-SDXNR/L-07", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3734&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_minipturn_use_6', $u$Back Turning Boring Bars Carrying DNGP 0703.. Double-Sided 55° Rhombic Inserts for Small Diameters$u$, $u$Boring bars$u$, 6, $u$[{"name": "A/E-SDZNR/L-07", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3735&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_minipturn_use_7', $u$Lever Lock Tools Carrying DNGP 0703.. Double-Sided 55° Rhombic Inserts$u$, $u$Toolholders$u$, 7, $u$[{"name": "PDJNR/L-S", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3773&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_minipturn_use_8', $u$Lever Lock External Turning Tools Carrying WNGP 0403.. Double-Sided Trigon Inserts$u$, $u$Toolholders$u$, 8, $u$[{"name": "PWLNR/L-S", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3774&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_minipturn_use_9', $u$Screw Lock JETCUT Modular Heads Carrying Positive Double-Sided Trigon Inserts for Swiss-Type Machines$u$, $u$Tools$u$, 9, $u$[{"name": "NQCH-SWLNR/L-S-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4756&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_minipturn_use_10', $u$Screw Lock JETCUT Modular Heads Carrying Positive Double-Sided 55° Rhombic Inserts for Swiss-Type Machines$u$, $u$Tools$u$, 10, $u$[{"name": "NQCH-SDJNR/L-S-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4757&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MINIPTURN'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- ALU-P-TURN
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_alupturn', 'ALU-P-TURN', 'Turning', $u$ALU-P-TURN: turning tools and inserts from the ISCAR turning catalog, such as double-Sided Sharp Edged Positive and Polished Rake Inserts for Finishing Aluminum and Other Non-Ferrous Materials.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ALUPTURN')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$ALU-P-TURN: turning tools and inserts from the ISCAR turning catalog, such as double-Sided Sharp Edged Positive and Polished Rake Inserts for Finishing Aluminum and Other Non-Ferrous Materials.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ALUPTURN' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ALUPTURN'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_alupturn_use_0', $u$Double-Sided Sharp Edged Positive and Polished Rake Inserts for Finishing Aluminum and Other Non-Ferrous Materials$u$, $u$Inserts$u$, 0, $u$[{"name": "CNGG-F3N", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4224&mapp=IS&GFSTYP=M"}, {"name": "WNGG-F3N", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4225&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_alupturn_use_1', $u$Double-Sided Sharp Edged Positive Rake Inserts for Rough Machining Aluminum and Other Non-Ferrous Materials$u$, $u$Inserts$u$, 1, $u$[{"name": "VNGU-R3N", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4230&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_alupturn_use_2', $u$Double-Sided Positive Rake Inserts with High Helical and Sharp Edge for Medium Machining Non-Ferrous Materials$u$, $u$Inserts$u$, 2, $u$[{"name": "CNGX-M3N", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4257&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_alupturn_use_3', $u$Double-Sided Sharp Edged Positive and Polished Rake Inserts for Finishing on Aluminum and Other Non-Ferrous Materials$u$, $u$Inserts$u$, 3, $u$[{"name": "VNGG-M3N", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4664&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ALUPTURN'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- HEAVY-SUPER-TURN
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_heavysuperturn', 'HEAVY-SUPER-TURN', 'Turning', $u$HEAVY-SUPER-TURN: turning tools and inserts from the ISCAR turning catalog, such as tangential Inserts with 4 Cutting Edges for High Metal Removal of up to 35 mm D.O.C. on Steel.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HEAVYSUPERTURN')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$HEAVY-SUPER-TURN: turning tools and inserts from the ISCAR turning catalog, such as tangential Inserts with 4 Cutting Edges for High Metal Removal of up to 35 mm D.O.C. on Steel.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HEAVYSUPERTURN' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HEAVYSUPERTURN'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_heavysuperturn_use_0', $u$Tangential Inserts with 4 Cutting Edges for High Metal Removal of up to 35 mm D.O.C. on Steel$u$, $u$Inserts$u$, 0, $u$[{"name": "LOMX-H6P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3422&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heavysuperturn_use_1', $u$Lever Lock Tools Carrying LOMX Tangentially Clamped Super Heavy Turning Inserts$u$, $u$Toolholders$u$, 1, $u$[{"name": "PLBOR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3423&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HEAVYSUPERTURN'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- HELI-TURN
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_heliturn', 'HELI-TURN', 'Turning', $u$HELI-TURN: turning tools and inserts from the ISCAR turning catalog, such as screw-Lock Tools Carrying the LNMX.. Tangentially Clamped Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELITURN')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$HELI-TURN: turning tools and inserts from the ISCAR turning catalog, such as screw-Lock Tools Carrying the LNMX.. Tangentially Clamped Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELITURN' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELITURN'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_heliturn_use_0', $u$Screw-Lock Tools Carrying the LNMX.. Tangentially Clamped Inserts$u$, $u$Toolholders$u$, 0, $u$[{"name": "SLANR/L-TANG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1742&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturn_use_1', $u$Tools with CAMFIX Shanks Carrying the LNMX-HT Tangentially Screw Clamped Inserts for High Production Cutting$u$, $u$Toolholders$u$, 1, $u$[{"name": "C#-SLANR/L-TANG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1923&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturn_use_2', $u$Tools for 45° Mounting, with HSK Taper Shanks for LNMX-HT - High Production Cutting, Tangentially Clamped Inserts$u$, $u$Toolholders$u$, 2, $u$[{"name": "HSK A63WH-SLSNR-TANG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1983&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturn_use_3', $u$Tools Carrying LNMX Tangentially Clamped Inserts$u$, $u$Toolholders$u$, 3, $u$[{"name": "SLFNR/L-TANG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2189&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturn_use_4', $u$External 75° Lead Tools Carrying Tangentially Screw Clamped Inserts$u$, $u$Toolholders$u$, 4, $u$[{"name": "SLBNR/L-TANG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2301&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturn_use_5', $u$Lever Lock Tools Carrying LNMX.. Tangentially Clamped Inserts$u$, $u$Toolholders$u$, 5, $u$[{"name": "PLANR/L-TANG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2549&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturn_use_6', $u$Screw-Lock Tools with Channels for High-Pressure Coolant Carrying LNMX Tangentially Clamped Inserts$u$, $u$Toolholders$u$, 6, $u$[{"name": "SLANR/L-15-TANG-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3176&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturn_use_7', $u$Tangential Inserts with 4 Cutting Edges and a Positive Rake Angle for High Metal Removal Rates$u$, $u$Inserts$u$, 7, $u$[{"name": "LNMX-HT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1768&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturn_use_8', $u$Tangentially Clamped Inserts with a Wiper Corner Design for High Production Cutting and Excellent Surface Finish$u$, $u$Inserts$u$, 8, $u$[{"name": "LNMX-WG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2203&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturn_use_9', $u$Tangential Inserts with a Positive Rake Angle for High Metal Removal on Soft and Ductile Materials$u$, $u$Inserts$u$, 9, $u$[{"name": "LNMX-HM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2333&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturn_use_10', $u$Boring Bars Carrying LNMX Tangentially Screw Clamped Inserts with 4 Cutting Edges for High Metal Removal Rates$u$, $u$Boring bars$u$, 10, $u$[{"name": "S-SLANR/L-TANG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1940&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliturn_use_11', $u$Boring Bars Carrying LNMX ... Tangentially Clamped Inserts with 4 Cutting Edges for High Production Rates$u$, $u$Boring bars$u$, 11, $u$[{"name": "S-PLANR-TANG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2694&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELITURN'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- LOGIQ-4-TURN
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_logiq4turn', 'LOGIQ-4-TURN', 'Turning', $u$LOGIQ-4-TURN: turning tools and inserts from the ISCAR turning catalog, such as 80° Double-Sided and Double-Positive Inserts with a Positive Rake for Finishing on Alloyed Steel.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQ4TURN')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$LOGIQ-4-TURN: turning tools and inserts from the ISCAR turning catalog, such as 80° Double-Sided and Double-Positive Inserts with a Positive Rake for Finishing on Alloyed Steel.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQ4TURN' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQ4TURN'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_logiq4turn_use_0', $u$80° Double-Sided and Double-Positive Inserts with a Positive Rake for Finishing on Alloyed Steel$u$, $u$Inserts$u$, 0, $u$[{"name": "CXMG-F3P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4231&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiq4turn_use_1', $u$80° Double-Sided and Double-Positive Inserts with a Positive Rake for Medium Machining on Alloyed Steel$u$, $u$Inserts$u$, 1, $u$[{"name": "CXMG-M3P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4232&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiq4turn_use_2', $u$80° Double-Sided and Double-Positive Inserts with a Positive Rake for Finishing on Stainless Steel and H.T.A.$u$, $u$Inserts$u$, 2, $u$[{"name": "CXMG-F3M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4233&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiq4turn_use_3', $u$80° Double-Sided and Double-Positive Inserts with a Positive Rake for Medium Machining on Stainless Steel and H.T.A.$u$, $u$Inserts$u$, 3, $u$[{"name": "CXMG-M3M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4236&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiq4turn_use_4', $u$CXGG 80° Double-Sided and Double-Positive Polished Rhombic Inserts$u$, $u$Inserts$u$, 4, $u$[{"name": "CXGG-M3N-P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5026&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiq4turn_use_5', $u$80° Double-Sided and Double-Positive Inserts with a Positive Rake for Finishing Alloyed Steel$u$, $u$Inserts$u$, 5, $u$[{"name": "CXMU-F3P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5260&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiq4turn_use_6', $u$80° Double-Sided and Double-Positive Inserts with a Positive Rake for Finishing Stainless Steel and H.T.A.$u$, $u$Inserts$u$, 6, $u$[{"name": "CXMU-F3M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5261&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiq4turn_use_7', $u$Interchangeable Boring Heads Carrying 80° Rhombic Inserts$u$, $u$Tools$u$, 7, $u$[{"name": "AVC-PCLXR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4241&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiq4turn_use_8', $u$Lever Lock JETCUT Modular Heads Carrying Positive Double-Sided 80° Rhombic Inserts for Swiss-Type Machines$u$, $u$Tools$u$, 8, $u$[{"name": "NQCH-PCLXR/L-S-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4758&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiq4turn_use_9', $u$Screw Lock Carrying CXMU 80° Rhombic Inserts$u$, $u$Tools$u$, 9, $u$[{"name": "SCLXR/L 06X", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5342&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiq4turn_use_10', $u$Screw Lock Carrying CXMU 80° Rhombic Inserts for Swiss-Type Automatic Lathes$u$, $u$Tools$u$, 10, $u$[{"name": "SCLXR/L 06XS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5344&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiq4turn_use_11', $u$Screw Lock JETCUT Modular Heads Carrying Positive Double-Sided 80° Rhombic Inserts for Swiss-Type Machines$u$, $u$Tools$u$, 11, $u$[{"name": "NQCH-SCLXR/L-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5424&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiq4turn_use_12', $u$Lever Lock Boring Bars Carrying CXMG 80° Rhombic Inserts$u$, $u$Boring bars$u$, 12, $u$[{"name": "A-PCLXR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4242&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiq4turn_use_13', $u$Screw Lock Boring Bars on which CXMU 80° Rhombic Inserts are Mounted$u$, $u$Boring bars$u$, 13, $u$[{"name": "A/E-SCLXR/L-06X", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5262&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiq4turn_use_14', $u$Lever Lock Tools with Channels for High-Pressure Coolant Carrying CXMG 80° Rhombic Inserts$u$, $u$Toolholders$u$, 14, $u$[{"name": "PCLXR/L-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4245&mapp=IS&GFSTYP=M"}, {"name": "PCLXR/L-JHP-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4692&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiq4turn_use_15', $u$Lever Lock Tools Carrying CXMG 80° Rhombic Inserts$u$, $u$Toolholders$u$, 15, $u$[{"name": "PCLXR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4249&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiq4turn_use_16', $u$Lever Lock Tools Carrying CXMG 80° Rhombic Inserts for Swiss-Type Automatic Lathes$u$, $u$Toolholders$u$, 16, $u$[{"name": "PCLXR/L-S", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4626&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiq4turn_use_17', $u$Lever Lock Tools with JETCUT Coolant System Carrying CXMG 80° Rhombic Inserts for Swiss-Type Automatic Lathes$u$, $u$Toolholders$u$, 17, $u$[{"name": "PCLXR/L-S-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4627&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiq4turn_use_18', $u$Screw Lock Tools with Channel for High-Pressure Coolant Carrying CXMU 80° Rhombic Inserts$u$, $u$Toolholders$u$, 18, $u$[{"name": "SCLXR/L 06X-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5267&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiq4turn_use_19', $u$Screw Lock Tools with JETCUT Coolant System Carrying CXMU 80° Rhombic Inserts for Swiss-Type Automatic Lathes$u$, $u$Toolholders$u$, 19, $u$[{"name": "SCLXR/L 06XS-JHP-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5269&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiq4turn_use_20', $u$Screw Lock Tools Carrying CXMU 80° Rhombic Inserts$u$, $u$Toolholders$u$, 20, $u$[{"name": "AVC-SCLXR/L-06X", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5435&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiq4turn_use_21', $u$Lever Lock Tools with CAMFIX Shanks & High-Pressure Coolant Channels, for CXMG 80° Inserts$u$, $u$Toolholders$u$, 21, $u$[{"name": "C#-PCLXR/L-12X-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5551&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQ4TURN'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- SAFE-T-LOCK
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_safetlock', 'SAFE-T-LOCK', 'Turning', $u$SAFE-T-LOCK: turning tools and inserts from the ISCAR turning catalog, such as 55° Rhombic Inserts with a Positive Flank with a Locating Bottom Ridge for Semi-Finishing and Finishing on Steel.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SAFETLOCK')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$SAFE-T-LOCK: turning tools and inserts from the ISCAR turning catalog, such as 55° Rhombic Inserts with a Positive Flank with a Locating Bottom Ridge for Semi-Finishing and Finishing on Steel.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SAFETLOCK' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SAFETLOCK'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_safetlock_use_0', $u$55° Rhombic Inserts with a Positive Flank with a Locating Bottom Ridge for Semi-Finishing and Finishing on Steel$u$, $u$Inserts$u$, 0, $u$[{"name": "DCMT-F3P-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3401&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_safetlock_use_1', $u$55° Rhombic Inserts with a Positive Flank and Locating Bottom Ridge for Machining Stainless and Low Carbon Steel$u$, $u$Inserts$u$, 1, $u$[{"name": "DCMT-M3M-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3451&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_safetlock_use_2', $u$55° Rhombic Inserts with a Positive Flank and Locating Bottom Ridge for Semi-Finishing and Finishing$u$, $u$Inserts$u$, 2, $u$[{"name": "DCMT-SM-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3557&mapp=IS&GFSTYP=M"}, {"name": "DCMT-PF-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3558&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_safetlock_use_3', $u$80° trigon positive flank inserts with Locating Bottom Ridges for semi-finishing and finishing steel materials$u$, $u$Inserts$u$, 3, $u$[{"name": "WCMT-F3P-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5234&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_safetlock_use_4', $u$80° trigon positive flank inserts with Locating Bottom Ridges for medium machining of steel.$u$, $u$Inserts$u$, 4, $u$[{"name": "WCMT-M3P-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5235&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_safetlock_use_5', $u$80° trigon positive flank inserts for semi-finish and finish machinihg of stainless and low carbon steel.$u$, $u$Inserts$u$, 5, $u$[{"name": "WCMT-F3M-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5236&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_safetlock_use_6', $u$80° Trigon positive flank inserts with Locating Bottom Ridges for medium machining of stainless and low carbon steel$u$, $u$Inserts$u$, 6, $u$[{"name": "WCMT-M3M-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5237&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_safetlock_use_7', $u$Screw Lock Tools Carrying 55° Diamond Inserts with 7° Clearance Angle for High Rigidity in Profiling Applications$u$, $u$Toolholders$u$, 7, $u$[{"name": "SDNCN-13-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3402&mapp=IS&GFSTYP=M"}, {"name": "SDJCR/L-13-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3450&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_safetlock_use_8', $u$Screw Clamp Tools with CAMFIX Shanks and Channels for High-Pressure Coolant Carrying Positive 55° Rhombic Inserts$u$, $u$Toolholders$u$, 8, $u$[{"name": "C#-SDJCR/L-13-SL-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3692&mapp=IS&GFSTYP=M"}, {"name": "C#-SDNCN-13-SL-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3693&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_safetlock_use_9', $u$Tools with Channels for High-Pressure Coolant Carrying 55° Positive Rhombic Inserts for Swiss Automatic Machines$u$, $u$Toolholders$u$, 9, $u$[{"name": "SDACR/L-S-SL-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3810&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_safetlock_use_10', $u$Boring Bars Carrying 55° Rhombic Inserts with 7° Clearance Angle for High Rigidity in Profiling Applications$u$, $u$Boring bars$u$, 10, $u$[{"name": "A-SDUCR/L-13-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3785&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SAFETLOCK'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- NEO-SWISS
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_neoswiss', 'NEO-SWISS', 'Turning', $u$NEO-SWISS: turning for swiss-type tools and inserts from the ISCAR turning catalog, such as screw Lock JETCUT Modular Heads Carrying 7° Clearance 80° Rhombic Inserts for Swiss-Type Machines.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'NEOSWISS')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$NEO-SWISS: turning for swiss-type tools and inserts from the ISCAR turning catalog, such as screw Lock JETCUT Modular Heads Carrying 7° Clearance 80° Rhombic Inserts for Swiss-Type Machines.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'NEOSWISS' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving', 'grooveturn', 'profiling', 'threading', 'turning', 'turningforswisstype') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'NEOSWISS'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_neoswiss_use_0', $u$Screw Lock JETCUT Modular Heads Carrying 7° Clearance 80° Rhombic Inserts for Swiss-Type Machines$u$, $u$Tools$u$, 0, $u$[{"name": "NQCH-SCACR/L-S-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4753&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_neoswiss_use_1', $u$Screw Lock JETCUT Modular Heads Carrying 7° Clearance 55° Rhombic Inserts for Swiss-Type Machines$u$, $u$Tools$u$, 1, $u$[{"name": "NQCH-SDACR/L-S-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4754&mapp=IS&GFSTYP=M"}, {"name": "NQCH-SDJCR/L-S-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5467&mapp=IS&GFSTYP=M"}, {"name": "NQCH-SDNCN-S-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5468&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_neoswiss_use_2', $u$Screw Lock JETCUT Modular Heads Carrying 35° Rhombic Inserts with 7° Clearance Angle for Swiss-Type Machines$u$, $u$Tools$u$, 2, $u$[{"name": "NQCH-SVACR/L-S-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4755&mapp=IS&GFSTYP=M"}, {"name": "NQCH-SVJCR/L-S-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5469&mapp=IS&GFSTYP=M"}, {"name": "NQCH-SVVCN-S-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5470&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_neoswiss_use_3', $u$Y-Axis Screw Lock JETCUT Modular Heads Carrying 55° Rhombic Inserts with 7° Clearance Angle for Swiss-Type Machines$u$, $u$Tools$u$, 3, $u$[{"name": "NQCH-Y-SDJCR-S-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4759&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_neoswiss_use_4', $u$Y-Axis Screw Lock JETCUT Modular Heads Carrying 35° Rhombic Inserts with 7° Clearance Angle for Swiss-Type Machines$u$, $u$Tools$u$, 4, $u$[{"name": "NQCH-Y-SVJCR-S-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4760&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_neoswiss_use_5', $u$Screw Lock JETCUT Modular Heads Carrying PENTA Inserts for Grooving, Parting, and Recessing on Swiss-Type Machines$u$, $u$Tools$u$, 5, $u$[{"name": "NQCH-PCHR/L-S-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4761&mapp=TG&GFSTYP=M"}, {"name": "NQCH-PCHR/L-24-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4859&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_neoswiss_use_6', $u$Screw Lock JETCUT Modular Heads Carrying SWISSCUT Inserts for Grooving and Turning on Swiss-Type Machines$u$, $u$Tools$u$, 6, $u$[{"name": "NQCH-SCHR/L-BF-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4762&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_neoswiss_use_7', $u$Screw Lock JETCUT Modular Heads Carrying DO-GRIP Double-Edged Parting Inserts for Swiss-Type Machines$u$, $u$Tools$u$, 7, $u$[{"name": "NQCH-DGTR/L-D22-SH-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4763&mapp=TG&GFSTYP=M"}, {"name": "NQCH-DGTR/L-D-SH-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5454&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_neoswiss_use_8', $u$Screw Lock JETCUT Modular Heads Carrying SWISSCUT Inserts for Grooving and Turning in Y-Axis on Swiss-Type Machines$u$, $u$Tools$u$, 8, $u$[{"name": "NQCH-Y-SCHR-BF-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4764&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_neoswiss_use_9', $u$Screw Lock JETCUT Modular Heads Carrying CUTGRIP Inserts for Grooving and Turning on Swiss-Type Machines$u$, $u$Tools$u$, 9, $u$[{"name": "NQCH-GHSR/L-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4765&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_neoswiss_use_10', $u$Screw Lock JETCUT Modular Heads which Mount ISO Laydown Threading Inserts for Swiss-Type Machines$u$, $u$Tools$u$, 10, $u$[{"name": "NQCH-SER/L-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4848&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_neoswiss_use_11', $u$Lever Lock JETCUT Modular Heads Carrying Negative Double-Sided Triangular Inserts for Swiss-Type Machines$u$, $u$Tools$u$, 11, $u$[{"name": "NQCH-PTJNR/L-S-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5466&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'NEOSWISS'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- NEO-Y-SWISS
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_neoyswiss', 'NEO-Y-SWISS', 'Turning', $u$NEO-Y-SWISS: turning for swiss-type tools and inserts from the ISCAR turning catalog, such as y-Axis Screw Lock Integral Tools Carrying 55° Rhombic Inserts with 7° Clearance Angle for Swiss-Type Machines..$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'NEOYSWISS')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$NEO-Y-SWISS: turning for swiss-type tools and inserts from the ISCAR turning catalog, such as y-Axis Screw Lock Integral Tools Carrying 55° Rhombic Inserts with 7° Clearance Angle for Swiss-Type Machines..$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'NEOYSWISS' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving', 'grooveturn', 'threading', 'turning', 'turningforswisstype') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'NEOYSWISS'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_neoyswiss_use_0', $u$Y-Axis Screw Lock Integral Tools Carrying 55° Rhombic Inserts with 7° Clearance Angle for Swiss-Type Machines.$u$, $u$Toolholders$u$, 0, $u$[{"name": "Y-SDJCR-S", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4745&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_neoyswiss_use_1', $u$Y-Axis Screw Lock Integral Tools Carrying 7° Clearance 35° Rhombic Inserts for Swiss-Type Machines$u$, $u$Toolholders$u$, 1, $u$[{"name": "Y-SVJCR-S", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4746&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_neoyswiss_use_2', $u$Y-Axis Screw Lock JETCUT Integral Tools Carrying 55° Rhombic Inserts with 7° Clearance Angle$u$, $u$Toolholders$u$, 2, $u$[{"name": "Y-SDJCR-S-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4747&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_neoyswiss_use_3', $u$Y-Axis Screw Lock JETCUT Integral Tools Carrying 7° Clearance 35° Rhombic Inserts for Swiss-Type Machines$u$, $u$Toolholders$u$, 3, $u$[{"name": "Y-SVJCR-S-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4748&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_neoyswiss_use_4', $u$Y-Axis Screw Lock Integral Tools Carrying PENTACUT Inserts for Grooving, Parting, and Recessing on Swiss-Type Machines$u$, $u$Toolholders$u$, 4, $u$[{"name": "Y-PCHRS-17", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4749&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_neoyswiss_use_5', $u$Y-Axis Screw Lock JETCUT Integral Tools for PENTACUT Inserts for Grooving, Parting, and Recessing on Swiss-Type Machines$u$, $u$Toolholders$u$, 5, $u$[{"name": "Y-PCHRS-17-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4750&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_neoyswiss_use_6', $u$Y-Axis Screw Lock Integral Tools Carrying SWISSCUT Inserts for Grooving and Turning on Swiss-Type Machines$u$, $u$Toolholders$u$, 6, $u$[{"name": "Y-SCHR-22BF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4751&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_neoyswiss_use_7', $u$Y-Axis Screw Lock JETCUT Integral Tools for SWISSCUT Inserts for Grooving and Turning on Swiss-Type Machines$u$, $u$Toolholders$u$, 7, $u$[{"name": "Y-SCHR-22BF-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4752&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'NEOYSWISS'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- ISO-Y-TURN
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_isoyturn', 'ISO-Y-TURN', 'Turning', $u$ISO-Y-TURN: turning tools and inserts from the ISCAR turning catalog, such as y-Axis Turning Tools Carrying 55° Diamond Inserts with 7° Clearance Angle.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ISOYTURN')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$ISO-Y-TURN: turning tools and inserts from the ISCAR turning catalog, such as y-Axis Turning Tools Carrying 55° Diamond Inserts with 7° Clearance Angle.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ISOYTURN' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ISOYTURN'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_isoyturn_use_0', $u$Y-Axis Turning Tools Carrying 55° Diamond Inserts with 7° Clearance Angle$u$, $u$Toolholders$u$, 0, $u$[{"name": "HSK A63WH-SDJCN-13-Y", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4740&mapp=IS&GFSTYP=M"}, {"name": "C#-SDJCN-13-Y", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4741&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_isoyturn_use_1', $u$Y-Axis Turning Tools Carrying Round Inserts with 7° Clearance Angle$u$, $u$Toolholders$u$, 1, $u$[{"name": "HSK A63WH-SRDCN-Y", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4768&mapp=IS&GFSTYP=M"}, {"name": "C#-SRDCN-16-Y", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4769&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_isoyturn_use_2', $u$Y-Axis Turning Tools that Mount 80° Trigon Inserts with a 7° Clearance Angle$u$, $u$Toolholders$u$, 2, $u$[{"name": "C#-SWLCN-08-Y", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5174&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_isoyturn_use_3', $u$Y-Axis Interchangeable Heads Carrying 55° Rhombic Inserts$u$, $u$Tools$u$, 3, $u$[{"name": "AVC-SDJCN-Y", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4773&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_isoyturn_use_4', $u$Y-Axis Interchangeable Heads Carrying Round Inserts with 7° Clearance Angle$u$, $u$Tools$u$, 4, $u$[{"name": "AVC-SRDCN-Y", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4775&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_isoyturn_use_5', $u$Y-Axis Interchangeable Heads that Mount 80° Trigon Inserts with a 7° Clearance Angle$u$, $u$Tools$u$, 5, $u$[{"name": "AVC-SWLCN-08-Y", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5179&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ISOYTURN'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- WHISPERLINE
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_whisperline', 'WHISPERLINE', 'Turning', $u$WHISPERLINE: turning tools and inserts from the ISCAR turning catalog, such as interchangeable Boring Heads Carrying 80° Rhombic Inserts with 7° Clearance.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'WHISPERLINE')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$WHISPERLINE: turning tools and inserts from the ISCAR turning catalog, such as interchangeable Boring Heads Carrying 80° Rhombic Inserts with 7° Clearance.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'WHISPERLINE' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('grooving', 'grooveturn', 'profiling', 'threading', 'turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'WHISPERLINE'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_whisperline_use_0', $u$Interchangeable Boring Heads Carrying 80° Rhombic Inserts with 7° Clearance$u$, $u$Tools$u$, 0, $u$[{"name": "AVC-SCLCR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3932&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_whisperline_use_1', $u$Interchangeable Boring Heads Carrying 55° Rhombic Inserts$u$, $u$Tools$u$, 1, $u$[{"name": "AVC-DDUNR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3933&mapp=IS&GFSTYP=M"}, {"name": "AVC-DDUNR/L-VH", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4456&mapp=IS&GFSTYP=M"}, {"name": "AVC-DDMNR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5207&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_whisperline_use_2', $u$Interchangeable Boring Heads Carrying 35° Rhombic Inserts with 7° Clearance$u$, $u$Tools$u$, 2, $u$[{"name": "AVC-SVLCR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3934&mapp=IS&GFSTYP=M"}, {"name": "AVC-SVUCR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3937&mapp=IS&GFSTYP=M"}, {"name": "AVC-SVLCR/L-VH", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4458&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_whisperline_use_3', $u$Interchangeable Boring Heads Carrying 55° Rhombic Inserts with 7° Clearance$u$, $u$Tools$u$, 3, $u$[{"name": "AVC-SDUCR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3935&mapp=IS&GFSTYP=M"}, {"name": "AVC-SDUCR/L-VH", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4457&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_whisperline_use_4', $u$Interchangeable Boring Heads Carrying 35° Rhombic Inserts$u$, $u$Tools$u$, 4, $u$[{"name": "AVC-DVUNR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3936&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_whisperline_use_5', $u$Interchangeable Boring Heads Carrying 80° Rhombic Inserts$u$, $u$Tools$u$, 5, $u$[{"name": "AVC-PCLNR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4240&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_whisperline_use_6', $u$Interchangeable Boring Heads for Threading Inserts$u$, $u$Tools$u$, 6, $u$[{"name": "AVC-D-SIR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4593&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_whisperline_use_7', $u$Interchangeable Boring Heads Carrying 35° Rhombic Inserts with 7° Clearance and 117.5° Approach Angle$u$, $u$Tools$u$, 7, $u$[{"name": "AVC-SVPCR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5125&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_whisperline_use_8', $u$Interchangeable Boring Heads Carrying 35° Rhombic Inserts with 7° Clearance and 107.5° Approach Angle$u$, $u$Tools$u$, 8, $u$[{"name": "AVC-SVQCR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5126&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_whisperline_use_9', $u$Interchangeable Boring Heads Carrying 60° Triangular Inserts$u$, $u$Tools$u$, 9, $u$[{"name": "AVC-PTLNR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5426&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_whisperline_use_10', $u$Interchangeable Boring Heads Carrying 35° Rhombic Inserts with 7° Clearance and 50° Approach Angle$u$, $u$Tools$u$, 10, $u$[{"name": "AVC-SVMCR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5488&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_whisperline_use_11', $u$Anti-Vibration Blades for Deep Grooving and Turning$u$, $u$Blades$u$, 11, $u$[{"name": "Anti-Vibration Blades", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4004&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_whisperline_use_12', $u$Screw Lock Anti-Vibration Bars Carrying 55° Rhombic Inserts with a 7° Clearance Angle$u$, $u$Boring bars$u$, 12, $u$[{"name": "AV-C-SDUCR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5665&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'WHISPERLINE'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- ISCAR-THREAD
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_iscarthread', 'ISCAR-THREAD', 'Threading', $u$ISCAR-THREAD: threading tools and inserts from the ISCAR turning catalog, such as external Laydown Threading Inserts with a 55° Partial Profile for General Applications.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARTHREAD')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$ISCAR-THREAD: threading tools and inserts from the ISCAR turning catalog, such as external Laydown Threading Inserts with a 55° Partial Profile for General Applications.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARTHREAD' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('grooving', 'threading') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARTHREAD'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_iscarthread_use_0', $u$External Laydown Threading Inserts with a 55° Partial Profile for General Applications$u$, $u$Inserts$u$, 0, $u$[{"name": "ER/L-55°", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=112&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_1', $u$External Laydown Threading Inserts with a 60° Partial profile for General Applications$u$, $u$Inserts$u$, 1, $u$[{"name": "ER/L-60°", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=113&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_2', $u$External American Buttress Laydown Threading Inserts for High Force Transmission in One Direction$u$, $u$Inserts$u$, 2, $u$[{"name": "ER/L-ABUT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=114&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_3', $u$External ACME Profile Laydown Threading Inserts for Feed Screws$u$, $u$Inserts$u$, 3, $u$[{"name": "ER/L-ACME", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=115&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_4', $u$External API - Oil Thread Profile Laydown Threading Inserts$u$, $u$Inserts$u$, 4, $u$[{"name": "ER/L-API", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=116&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_5', $u$External API - Oil Thread Round Profile Laydown Threading Inserts$u$, $u$Inserts$u$, 5, $u$[{"name": "ER/L-API RD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=117&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_6', $u$External BSPT (British Standard Pipe) B.S.21-1957 Full Profile Laydown Threading Inserts$u$, $u$Inserts$u$, 6, $u$[{"name": "ER/L-BSPT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=118&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_7', $u$External BUT - Oil Thread Profile Laydown Threading Inserts for Buttress Casing$u$, $u$Inserts$u$, 7, $u$[{"name": "ER-BUT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=119&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_8', $u$External EL - Extreme Line Oil Thread Profile Laydown Threading Inserts$u$, $u$Inserts$u$, 8, $u$[{"name": "ER-EL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=120&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_9', $u$External ISO Metric (DIN13 12-1986 class: 6g) Laydown Threading Inserts for General Applications$u$, $u$Inserts$u$, 9, $u$[{"name": "ER/L-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=121&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_10', $u$External NPT (National Pipe Threads) Full Profile Laydown Threading Inserts for Steam, Gas and Water Pipes$u$, $u$Inserts$u$, 10, $u$[{"name": "ER/L-NPT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=122&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_11', $u$External DIN 405 Round Laydown Threading Inserts for Fire Fighting and Food Industry Pipe Couplings$u$, $u$Inserts$u$, 11, $u$[{"name": "ER/L-RND", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=123&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_12', $u$External STUB ACME Laydown Threading Inserts with a Shallow ACME Profile for Control Valves$u$, $u$Inserts$u$, 12, $u$[{"name": "ER/L-STACME", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=124&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_13', $u$External Trapezoid Shaped DIN 103 Laydown Threading Inserts for Feed Screws$u$, $u$Inserts$u$, 13, $u$[{"name": "ER/L-TR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=125&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_14', $u$External American UN Full Profile (UN, UNC, UNF, UNEF) Laydown Threading Inserts for General Applications$u$, $u$Inserts$u$, 14, $u$[{"name": "ER/L-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=126&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_15', $u$External UNJ Profile Laydown Threading Inserts for the Aviation and Aerospace Industries$u$, $u$Inserts$u$, 15, $u$[{"name": "ER/L-UNJ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=127&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_16', $u$External Whitworth (BSW, BSF, BSP) B.S.84-1956 DIN 259 Medium Class Full Profile Laydown Threading Inserts$u$, $u$Inserts$u$, 16, $u$[{"name": "ER/L-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=128&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_17', $u$Internal Laydown Threading Inserts with a 55° Partial Profile for General Applications$u$, $u$Inserts$u$, 17, $u$[{"name": "IR/L-55°", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=256&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_18', $u$Internal Laydown Threading Inserts with a 60° Partial Profile for General Applications$u$, $u$Inserts$u$, 18, $u$[{"name": "IR/L-60°", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=257&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_19', $u$Internal American Buttress Laydown Threading Inserts for High Force Transmission in One Direction$u$, $u$Inserts$u$, 19, $u$[{"name": "IR/L-ABUT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=258&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_20', $u$Internal ACME Profile Laydown Threading Inserts for Feed Screws$u$, $u$Inserts$u$, 20, $u$[{"name": "IR/L-ACME", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=259&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_21', $u$Internal API - Oil Thread Profile Laydown Threading Inserts$u$, $u$Inserts$u$, 21, $u$[{"name": "IR/L-API", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=260&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_22', $u$Internal API - Oil Thread Round Profile Laydown Threading Inserts$u$, $u$Inserts$u$, 22, $u$[{"name": "IR/L-API RD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=261&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_23', $u$Internal BSPT (British Standard Pipe) B.S.21-1957 Full Profile Laydown Threading Inserts$u$, $u$Inserts$u$, 23, $u$[{"name": "IR/L-BSPT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=262&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_24', $u$Internal BUT - Oil Thread Profile Laydown Threading Inserts for Buttress Casing$u$, $u$Inserts$u$, 24, $u$[{"name": "IR-BUT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=263&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_25', $u$Internal EL - Extreme Line Oil Thread Profile Laydown Threading Inserts$u$, $u$Inserts$u$, 25, $u$[{"name": "IR-EL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=264&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_26', $u$Internal ISO Metric (DIN13 12-1986 class 6H) Laydown Threading Inserts for General Applications$u$, $u$Inserts$u$, 26, $u$[{"name": "IR/L-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=265&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_27', $u$Internal NPT (National Pipe Threads) Full Profile Laydown Threading Inserts for Steam, Gas and Water Pipes$u$, $u$Inserts$u$, 27, $u$[{"name": "IR/L-NPT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=266&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_28', $u$Internal DIN 405 Round Laydown Threading Inserts for Fire Fighting and Food Industry Pipe Couplings$u$, $u$Inserts$u$, 28, $u$[{"name": "IR/L-RND", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=267&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_29', $u$Internal STUB ACME Laydown Threading Inserts with a Shallow ACME Profile for Control Valves$u$, $u$Inserts$u$, 29, $u$[{"name": "IR/L-STACME", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=268&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_30', $u$Internal Trapezoid Shaped DIN 103 Laydown Threading Inserts for Feed Screws$u$, $u$Inserts$u$, 30, $u$[{"name": "IR/L-TR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=269&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_31', $u$Internal American UN Full Profile (UN, UNC, UNF, UNEF) Laydown Threading Inserts for General Applications$u$, $u$Inserts$u$, 31, $u$[{"name": "IR/L-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=270&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_32', $u$Internal Whitworth (BSW, BSF, BSP) B.S.84-1956 DIN 259 Medium Class Full Profile Laydown Threading Inserts$u$, $u$Inserts$u$, 32, $u$[{"name": "IR/L-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=271&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_33', $u$Internal UNJ Profile Laydown Threading Inserts for the Aviation and Aerospace Industries$u$, $u$Inserts$u$, 33, $u$[{"name": "IR/L-UNJ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=763&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_34', $u$Internal Thread Profile Inserts for the Electric Industry$u$, $u$Inserts$u$, 34, $u$[{"name": "IR/L-PG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=764&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_35', $u$External Threading Inserts for the Electric Industry$u$, $u$Inserts$u$, 35, $u$[{"name": "ER-PG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=933&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_36', $u$External MJ ISO 5855 Metric Full Profile Laydown Threading Inserts for the Aviation and Aerospace Industries$u$, $u$Inserts$u$, 36, $u$[{"name": "ER-MJ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1300&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_37', $u$Internal MJ ISO 5855 Metric Full Profile Laydown Threading Inserts for the Aviation and Aerospace Industries$u$, $u$Inserts$u$, 37, $u$[{"name": "IR-MJ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2472&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_38', $u$External NPTF (National Pipe Threads) Full Profile Laydown Threading Inserts for Steam, Gas and Water Pipes$u$, $u$Inserts$u$, 38, $u$[{"name": "ER-NPTF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2629&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_39', $u$Internal NPTF (National Pipe Threads) Full Profile Laydown Threading Inserts for Steam, Gas and Water Pipes$u$, $u$Inserts$u$, 39, $u$[{"name": "IR/L-NPTF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2925&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_40', $u$Double-Ended, Precision, Flat Top Threading Inserts$u$, $u$Inserts$u$, 40, $u$[{"name": "ACME THREADING FLA", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3967&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_41', $u$External Laydown Threading Inserts with a 60° Partial Profile for General Applications$u$, $u$Inserts$u$, 41, $u$[{"name": "EIR/L U", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5531&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_42', $u$External Threading Toolholders$u$, $u$Toolholders$u$, 42, $u$[{"name": "SER/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=357&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_43', $u$External Threading Drophead Toolholders$u$, $u$Toolholders$u$, 43, $u$[{"name": "SER-D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=994&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_44', $u$External Threading Tools with CAMFIX Exchangeable Shanks$u$, $u$Toolholders$u$, 44, $u$[{"name": "C#-SER/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2401&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_45', $u$Internal Threading Bars$u$, $u$Boring bars$u$, 45, $u$[{"name": "SIR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=391&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_46', $u$Solid Carbide Bars for Internal Turning and Threading$u$, $u$Boring bars$u$, 46, $u$[{"name": "MGSIR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=969&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_47', $u$Interchangeable Threading Heads for Carbide Bars$u$, $u$Boring bars$u$, 47, $u$[{"name": "E-SIR-HEAD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1793&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_48', $u$Internal Threading Bars with CAMFIX Exchangeable Shanks$u$, $u$Boring bars$u$, 48, $u$[{"name": "C#-SIR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3858&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_49', $u$External Buttress Thread (DIN 513) for High Force in One Direction Applications$u$, $u$Tools$u$, 49, $u$[{"name": "ER/L-SAGE", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=922&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarthread_use_50', $u$Internal Sagengenwinde (DIN 513) Thread Application for High Force in One Direction Application$u$, $u$Tools$u$, 50, $u$[{"name": "IR/L-SAGE", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=923&mapp=TH&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARTHREAD'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- LOGIQ-6-TURN
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_logiq6turn', 'LOGIQ-6-TURN', 'Turning', $u$LOGIQ-6-TURN: turning tools and inserts from the ISCAR turning catalog, such as double-Sided Triangular Inserts with 55° Corner Angle and a Positive Rake Angle, for Finishing ISO-P Materials.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQ6TURN')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$LOGIQ-6-TURN: turning tools and inserts from the ISCAR turning catalog, such as double-Sided Triangular Inserts with 55° Corner Angle and a Positive Rake Angle, for Finishing ISO-P Materials.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQ6TURN' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQ6TURN'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_logiq6turn_use_0', $u$Double-Sided Triangular Inserts with 55° Corner Angle and a Positive Rake Angle, for Finishing ISO-P Materials$u$, $u$Inserts$u$, 0, $u$[{"name": "D6NMG/D6NGG-F3P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5242&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiq6turn_use_1', $u$Double-Sided Triangular Inserts with 55° Corner Angle and a Positive Rake Angle, for Semi-Finishing and Finishing ISO-P$u$, $u$Inserts$u$, 1, $u$[{"name": "D6NMG-M3P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5243&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiq6turn_use_2', $u$Double-Sided Triangular Inserts with 55° Corner Angle and a Positive Rake Angle, for Semi-Finishing and Finishing ISO-M$u$, $u$Inserts$u$, 2, $u$[{"name": "D6NMG-M3M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5244&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQ6TURN'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- FEED-TURN
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_feedturn', 'FEED-TURN', 'Turning', $u$FEED-TURN: turning tools and inserts from the ISCAR turning catalog, such as screw Clamped Toolholders for Fast Metal Removal in Longitudinal Turning.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'FEEDTURN')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$FEED-TURN: turning tools and inserts from the ISCAR turning catalog, such as screw Clamped Toolholders for Fast Metal Removal in Longitudinal Turning.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'FEEDTURN' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'FEEDTURN'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_feedturn_use_0', $u$Screw Clamped Toolholders for Fast Metal Removal in Longitudinal Turning$u$, $u$Toolholders$u$, 0, $u$[{"name": "SLLNR/L-HF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1720&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_feedturn_use_1', $u$Tangentially Clamped Rough Turning Inserts for High Feed (up to 2.4 mm/Rev)$u$, $u$Inserts$u$, 1, $u$[{"name": "LNMX-HF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1722&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'FEEDTURN'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- SWISS-TURN
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_swissturn', 'SWISS-TURN', 'Turning', $u$SWISS-TURN: turning for swiss-type tools and inserts from the ISCAR turning catalog, such as 80° Rhombic Inserts with a 7° Positive Flank for Finish Turning on Soft Materials and High-Temp. Alloys.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SWISSTURN')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$SWISS-TURN: turning for swiss-type tools and inserts from the ISCAR turning catalog, such as 80° Rhombic Inserts with a 7° Positive Flank for Finish Turning on Soft Materials and High-Temp. Alloys.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SWISSTURN' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SWISSTURN'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_swissturn_use_0', $u$80° Rhombic Inserts with a 7° Positive Flank for Finish Turning on Soft Materials and High-Temp. Alloys$u$, $u$Inserts$u$, 0, $u$[{"name": "CCGT-F1M-12P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4729&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_swissturn_use_1', $u$55° Rhombic Inserts with a 7° Positive Flank for Finish Turning on Soft Materials and High-Temp. Alloys$u$, $u$Inserts$u$, 1, $u$[{"name": "DCGT-F1M-12P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4730&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_swissturn_use_2', $u$80° Rhombic Inserts with a 7° Positive Flank for Semi-Finish and Finish Turning on Soft Materials and High-Temp. Alloys.$u$, $u$Inserts$u$, 2, $u$[{"name": "CCGT-F1M-20P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4742&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_swissturn_use_3', $u$55° Rhombic Inserts with a 7° Positive Flank for Semi-Finish and Finish Turning on Soft Materials and High-Temp. Alloys$u$, $u$Inserts$u$, 3, $u$[{"name": "DCGT-F1M-20P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4743&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SWISSTURN'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- CHAM-TURN
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_chamturn', 'CHAM-TURN', 'Turning', $u$CHAM-TURN: turning tools and inserts from the ISCAR turning catalog, such as single-Sided Square Inserts for Finishing Applications (CHAMELEON Multifunction Pocket System).$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMTURN')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$CHAM-TURN: turning tools and inserts from the ISCAR turning catalog, such as single-Sided Square Inserts for Finishing Applications (CHAMELEON Multifunction Pocket System).$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMTURN' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMTURN'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_chamturn_use_0', $u$Single-Sided Square Inserts for Finishing Applications (CHAMELEON Multifunction Pocket System)$u$, $u$Inserts$u$, 0, $u$[{"name": "SC45MT-SM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=794&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_chamturn_use_1', $u$Single-Sided 80° Rhombic Inserts for Finishing (CHAMELEON Multifunction Pocket System)$u$, $u$Inserts$u$, 1, $u$[{"name": "CC95MT-SM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=795&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_chamturn_use_2', $u$Screw Lock Boring Bars Carrying Four Different 7° Clearance Geometries$u$, $u$Boring bars$u$, 2, $u$[{"name": "S-SUXCR/L-CM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=797&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_chamturn_use_3', $u$Screw Lock Tools Carrying Four Different 7° Clearance Geometries$u$, $u$Toolholders$u$, 3, $u$[{"name": "SUXCR/L-CM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=799&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMTURN'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- DO-GRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_dogrip', 'DO-GRIP', 'Grooving & parting', $u$DO-GRIP: grooving tools and inserts from the ISCAR turning catalog, such as parting and Grooving Blades with and without Coolant Channels Carrying DO-GRIP and HELI-GRIP Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'DOGRIP')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$DO-GRIP: grooving tools and inserts from the ISCAR turning catalog, such as parting and Grooving Blades with and without Coolant Channels Carrying DO-GRIP and HELI-GRIP Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'DOGRIP' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'DOGRIP'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_dogrip_use_0', $u$Parting and Grooving Blades with and without Coolant Channels Carrying DO-GRIP and HELI-GRIP Inserts$u$, $u$Blades$u$, 0, $u$[{"name": "DGFH", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=74&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_1', $u$Blades for Multi-Spindle Machines, Replacement for HSS and Brazed Tools$u$, $u$Blades$u$, 1, $u$[{"name": "DGFS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=540&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_2', $u$Parting and Grooving Reinforced Blades Carrying DO-GRIP Inserts$u$, $u$Blades$u$, 2, $u$[{"name": "DGFHR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=613&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_3', $u$Reinforced Type Blades with Screw Clamping$u$, $u$Blades$u$, 3, $u$[{"name": "DGFHR/L-B-D..(R/L)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1386&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_4', $u$Reinforced Type Blades with Screw Clamping for TRAUB and Index Machines$u$, $u$Blades$u$, 4, $u$[{"name": "DGFHL-26B-TR-D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2547&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_5', $u$Parting and Grooving Blades with Channels for Low and High-Pressure Coolant Carrying DO-GRIP Inserts$u$, $u$Blades$u$, 5, $u$[{"name": "DGFH-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3392&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_6', $u$Parting and Grooving Reinforced Blades with Channels for High-Pressure Coolant Carrying DO-GRIP Inserts$u$, $u$Blades$u$, 6, $u$[{"name": "DGFHR/L-BC-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3741&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_7', $u$Double-Sided Parting Inserts for Parting and Grooving Bars, Hard Materials and Tough Applications$u$, $u$Boring bars$u$, 7, $u$[{"name": "DGN/DGNC/DGNM-C", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=75&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_8', $u$Parting and Grooving Inserts for Parting Bars, Hard Materials and Tough Applications$u$, $u$Boring bars$u$, 8, $u$[{"name": "HGN-C", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=911&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_9', $u$Double-Sided Inserts for Parting Bars, Hard Materials and Tough Applications$u$, $u$Boring bars$u$, 9, $u$[{"name": "DGR/L-C DGRC/LC-C", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2256&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_10', $u$Inserts for Parting Bars, Hard Materials and Tough Applications$u$, $u$Boring bars$u$, 10, $u$[{"name": "HGR/L-C", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2445&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_11', $u$Extra Long Double-Sided Inserts for Parting Bars, Hard Materials and Tough Applications$u$, $u$Boring bars$u$, 11, $u$[{"name": "DGR/L-C-XL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3389&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_12', $u$Extra Long Parting and Grooving Inserts for Parting Bars Up to 65 mm Diameters, Hard Materials and Tough Applications$u$, $u$Boring bars$u$, 12, $u$[{"name": "DGN-C-XL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3530&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_13', $u$Double-Sided Parting and Grooving Inserts with a Wiper Design for High Flatness and Surface Finish$u$, $u$Inserts$u$, 13, $u$[{"name": "DGN-WP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=76&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_14', $u$Inserts for Parting and Grooving Soft Materials, Parting Tubes, Small Diameters and Thin-Walled Parts$u$, $u$Inserts$u$, 14, $u$[{"name": "HGN-J", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=927&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_15', $u$Double-Sided Inserts for Parting and Grooving Soft Materials, Thin and Miniature Parts$u$, $u$Inserts$u$, 15, $u$[{"name": "DGN-P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1455&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_16', $u$Double-Sided Inserts for Parting and Grooving Soft Materials, Parting Tubes, Small Diameters and Thin-Walled Parts$u$, $u$Inserts$u$, 16, $u$[{"name": "DGN/DGNM-J/JS/JT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1456&mapp=TG&GFSTYP=M"}, {"name": "DGN-J/JS-D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5028&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_17', $u$Double-Sided Inserts for Parting and Grooving Cr-Ni Alloys, Low Carbon Steel and Ductile Materials at Low Feeds$u$, $u$Inserts$u$, 17, $u$[{"name": "DGN-UT/UA", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1457&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_18', $u$Double-Sided Inserts for Parting and Grooving Low Feeds on Cr-Ni Alloys and Low Carbon Steel$u$, $u$Inserts$u$, 18, $u$[{"name": "HGN-UT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1458&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_19', $u$Double-Sided Inserts for Parting Tubes, Thin-Walled and Small Parts$u$, $u$Inserts$u$, 19, $u$[{"name": "DGN-Z", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1843&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_20', $u$Double-Sided Inserts with Central Ridged Chipformer for Parting and Grooving Hard Materials and Interrupted Cuts$u$, $u$Inserts$u$, 20, $u$[{"name": "DGN-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2068&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_21', $u$Double-Sided Inserts for Parting Soft Materials, Parting Tubes, Small Diameters and Thin-Walled Parts$u$, $u$Inserts$u$, 21, $u$[{"name": "DGR/L-J/JS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2257&mapp=TG&GFSTYP=M"}, {"name": "DGR/L-J/JS-D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5029&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_22', $u$Double-Sided Inserts for Parting Soft Materials, Thin Walled and Miniature Parts$u$, $u$Inserts$u$, 22, $u$[{"name": "DGR-P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2258&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_23', $u$Double-Sided Parting Inserts with a Wiper Design for High Flatness and Surface Finish$u$, $u$Inserts$u$, 23, $u$[{"name": "DGR-WP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2259&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_24', $u$Double-Sided Inserts with Very Positive Rake for Parting Tubes, Thin-Walled and Small Parts$u$, $u$Inserts$u$, 24, $u$[{"name": "DGR-Z/ZS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2260&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_25', $u$Double-Sided Inserts for Parting Soft Materials, Tubes, Small Diameters and Thin-Walled Parts$u$, $u$Inserts$u$, 25, $u$[{"name": "HGR/L-J/JS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2477&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_26', $u$Double-Sided Inserts for Parting and Grooving Stainless Steel$u$, $u$Inserts$u$, 26, $u$[{"name": "DGN-LF/LFT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3287&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_27', $u$Extra Long Double-Sided Inserts for Parting Soft Materials, Tubes, Small Diameters and Thin-Walled Parts$u$, $u$Inserts$u$, 27, $u$[{"name": "DGR/L-J-XL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3390&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_28', $u$Double-Sided Inserts for Parting and Grooving Soft and Hard Materials at Medium Feeds$u$, $u$Inserts$u$, 28, $u$[{"name": "DGN-MF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3484&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_29', $u$Extra Long Inserts for Parting and Grooving Soft Materials, Parting Tubes, Small Diameters and Thin-Walled Parts$u$, $u$Inserts$u$, 29, $u$[{"name": "DGN-J-XL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3531&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_30', $u$Double-Sided Inserts for Parting and Grooving, suitable for Ductile Materials, Steel and Stainless Steel$u$, $u$Inserts$u$, 30, $u$[{"name": "DGN-T", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5456&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_31', $u$Single-Ended PCD Tipped Inserts, Available in Widths of 2 and 3 mm, for Parting and Grooving Nonferrous Materials$u$, $u$Inserts$u$, 31, $u$[{"name": "DGNM J", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5617&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_32', $u$Integral Shank Parting and Grooving Tools$u$, $u$Toolholders$u$, 32, $u$[{"name": "DGTR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=77&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_33', $u$Integral Shank Reinforced Parting and Grooving Tools Especially for DGNC Type of Inserts$u$, $u$Toolholders$u$, 33, $u$[{"name": "DGTR/L-B/BC-D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=557&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_34', $u$Parting and Grooving Short Head Tools for CNC and Swiss Automatics$u$, $u$Toolholders$u$, 34, $u$[{"name": "DGTR/L-B-D-SH", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=991&mapp=TG&GFSTYP=M"}, {"name": "DGTR/L-B-D-SH (NARROW CUT)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5035&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_35', $u$Reinforced Parting and Grooving Tools Carrying Double-Ended DO-GRIP Inserts$u$, $u$Toolholders$u$, 35, $u$[{"name": "DGTR/L-B-D-TR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1172&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_36', $u$Reinforced Parting and Grooving Short Head Tools Carrying DGN Double-Ended Inserts$u$, $u$Toolholders$u$, 36, $u$[{"name": "DGTR/L-B-T-SH", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1425&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_37', $u$Parting and Grooving Tools with Coolant Holes Carrying JET-CUT Inserts$u$, $u$Toolholders$u$, 37, $u$[{"name": "DGTR/L-BC-T", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2337&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_38', $u$Integral Shank Reinforced Parting and Grooving Tools for Parting Up to 65 mm Diameters$u$, $u$Toolholders$u$, 38, $u$[{"name": "DGTR/L-XL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3532&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_39', $u$Parting and Grooving Side Lock Type Tools with High-Pressure Coolant for CNC and Swiss Automatics$u$, $u$Toolholders$u$, 39, $u$[{"name": "DGTR/L-B-D-JHP-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3649&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_40', $u$Parting and Grooving Side Lock Type Tools with Bottom Inlets for High-Pressure Coolant$u$, $u$Toolholders$u$, 40, $u$[{"name": "DGTR/L-B-D-JHP-SL-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4164&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_41', $u$Parting and Grooving Adapters for DO-GRIP Double-Ended Inserts$u$, $u$Adapters & blocks$u$, 41, $u$[{"name": "DGAD/HGAD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=524&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_42', $u$Parting and Grooving Screw-Clamped Adapters for DO-GRIP Double-Ended Inserts$u$, $u$Adapters & blocks$u$, 42, $u$[{"name": "DGAD-B-D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1433&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_43', $u$Parting and Grooving Extra Long Adapters with Coolant Channels Carrying DO-GRIP Inserts$u$, $u$Adapters & blocks$u$, 43, $u$[{"name": "DGPAD-XL-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4029&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_44', $u$For soft & ductile materials such as 100Cr6 (specifically for the bearing industry), intended for low to medium feeds$u$, $u$Tools$u$, 44, $u$[{"name": "DGN-B", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5538&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dogrip_use_45', $u$Lead angled type, for soft & ductile materials such as 100Cr6 (bearing industry), intended for low to medium feeds.$u$, $u$Tools$u$, 45, $u$[{"name": "DGR/L-B", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5543&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'DOGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- HELI-GRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_heligrip', 'HELI-GRIP', 'Grooving & parting', $u$HELI-GRIP: grooving tools and inserts from the ISCAR turning catalog, such as utility Double-Ended Inserts for External, Internal and Face Machining.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELIGRIP')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$HELI-GRIP: grooving tools and inserts from the ISCAR turning catalog, such as utility Double-Ended Inserts for External, Internal and Face Machining.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELIGRIP' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving', 'grooveturn', 'profiling') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELIGRIP'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_heligrip_use_0', $u$Utility Double-Ended Inserts for External, Internal and Face Machining$u$, $u$Inserts$u$, 0, $u$[{"name": "GRIP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=228&mapp=TG&GFSTYP=M"}, {"name": "GRIP-T", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4827&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heligrip_use_1', $u$Utility Double-Ended Inserts for Face Machining$u$, $u$Inserts$u$, 1, $u$[{"name": "HGPL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1011&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heligrip_use_2', $u$Utility Double-Ended Full Radius Inserts for External, Internal and Face Machining$u$, $u$Inserts$u$, 2, $u$[{"name": "GRIP (full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2532&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heligrip_use_3', $u$Ground Double-Ended Inserts for External, Internal and Face Machining$u$, $u$Inserts$u$, 3, $u$[{"name": "GRIPA", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4709&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heligrip_use_4', $u$Ground Double-Ended Full Radius Inserts for External, Internal and Face Machining$u$, $u$Inserts$u$, 4, $u$[{"name": "GRIPA (full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4710&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heligrip_use_5', $u$Grooving and Turning Bars with Coolant Holes for HELI-GRIP Utility Inserts$u$, $u$Boring bars$u$, 5, $u$[{"name": "HELIIR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=243&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heligrip_use_6', $u$External Holders for Turning, Grooving and Parting$u$, $u$Toolholders$u$, 6, $u$[{"name": "HELIR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=244&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heligrip_use_7', $u$External Tools for Turning, Grooving and Parting with CAMFIX Exchangeable Shanks$u$, $u$Toolholders$u$, 7, $u$[{"name": "C#-HELIR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2984&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heligrip_use_8', $u$Parting and Grooving Blades for 3 mm GRIP Inserts$u$, $u$Blades$u$, 8, $u$[{"name": "HGFH", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=754&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELIGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- TOP-GRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_topgrip', 'TOP-GRIP', 'Grooving & parting', $u$TOP-GRIP: grooving tools and inserts from the ISCAR turning catalog, such as external Holders for Turning, Grooving and Profiling.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TOPGRIP')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$TOP-GRIP: grooving tools and inserts from the ISCAR turning catalog, such as external Holders for Turning, Grooving and Profiling.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TOPGRIP' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('grooving', 'grooveturn', 'profiling') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TOPGRIP'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_topgrip_use_0', $u$External Holders for Turning, Grooving and Profiling$u$, $u$Toolholders$u$, 0, $u$[{"name": "TGDR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=434&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_topgrip_use_1', $u$Internal Grooving and Turning Blades for GHIC...-70 Bars$u$, $u$Boring bars$u$, 1, $u$[{"name": "TGHN 26-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=435&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_topgrip_use_2', $u$Grooving and Turning Bars with Coolant Holes Carrying TOP-GRIP Utility Inserts$u$, $u$Boring bars$u$, 2, $u$[{"name": "TGIR/L-C", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=438&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_topgrip_use_3', $u$Double-Ended Blades Carrying Utility Inserts for Grooving and Turning$u$, $u$Blades$u$, 3, $u$[{"name": "TGHN-D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=436&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_topgrip_use_4', $u$Single-Ended Blades Carrying Utility Inserts for Grooving and Turning$u$, $u$Blades$u$, 4, $u$[{"name": "TGHN-S", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=437&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_topgrip_use_5', $u$Utility Double-Ended Inserts for External and Internal Grooving and Turning$u$, $u$Inserts$u$, 5, $u$[{"name": "TGMF/P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=439&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_topgrip_use_6', $u$Utility Double-Ended Full Radius Inserts for External and Internal Grooving and Profiling$u$, $u$Inserts$u$, 6, $u$[{"name": "TGMF (full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=440&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_topgrip_use_7', $u$Utility Double-Ended Inserts for External and Internal Grooving and Turning of Cast Iron$u$, $u$Inserts$u$, 7, $u$[{"name": "TGMA", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4117&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TOPGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- CUT-GRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_cutgrip', 'CUT-GRIP', 'Grooving & parting', $u$CUT-GRIP: groove-turn tools and inserts from the ISCAR turning catalog, such as internal Grooving and Turning Blades for GHIC...-70 Bars.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CUTGRIP')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$CUT-GRIP: groove-turn tools and inserts from the ISCAR turning catalog, such as internal Grooving and Turning Blades for GHIC...-70 Bars.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CUTGRIP' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving', 'grooveturn', 'facegrooving', 'profiling', 'threading', 'turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CUTGRIP'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_cutgrip_use_0', $u$Internal Grooving and Turning Blades for GHIC...-70 Bars$u$, $u$Boring bars$u$, 0, $u$[{"name": "CGHN 26-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=38&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_1', $u$Internal Grooving and Turning Blades for GHIC...-85 Bars (self-clamping)$u$, $u$Boring bars$u$, 1, $u$[{"name": "CGHN 32-DGM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=39&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_2', $u$Internal Grooving and Turning Blades for GHIC...-50 Bars$u$, $u$Boring bars$u$, 2, $u$[{"name": "CGIN 26", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=49&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_3', $u$Internal Grooving and Turning Bars$u$, $u$Boring bars$u$, 3, $u$[{"name": "GHIR/L (W=1.9-6.4)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=175&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_4', $u$Grooving and Turning Bars with Internal Coolant Holes$u$, $u$Boring bars$u$, 4, $u$[{"name": "GHIR/L-C (W=4-6.4)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=176&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_5', $u$Grooving and Turning Solid Carbide Bars with Internal Coolant Holes$u$, $u$Boring bars$u$, 5, $u$[{"name": "GHIR/L-SC (W=2-4.8)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=177&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_6', $u$Undercutting and Turning Boring Bars$u$, $u$Boring bars$u$, 6, $u$[{"name": "GHIUR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=178&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_7', $u$Parting and Grooving Single-Sided Inserts for Parting Bars, Hard Materials and Tough Applications$u$, $u$Boring bars$u$, 7, $u$[{"name": "GIM-C", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=198&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_8', $u$Boring Bars for Internal Grooving and Turning with CAMFIX Exchangeable Shanks$u$, $u$Boring bars$u$, 8, $u$[{"name": "C#-HFIR/L-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=762&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_9', $u$Internal Grooving and Turning Bars for Machining Aluminum Wheels$u$, $u$Boring bars$u$, 9, $u$[{"name": "GHIUR/L-C-A (15° & 27.5°) Bars", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=895&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_10', $u$8° / 10° Approach Angle Bars for Facing and Internal Machining$u$, $u$Boring bars$u$, 10, $u$[{"name": "GHIFR/L-A", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1154&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_11', $u$Internal Machining Bars with Coolant Holes$u$, $u$Boring bars$u$, 11, $u$[{"name": "GEHIR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1402&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_12', $u$Internal Machining Boring Bars with Coolant Holes for Insert Widths Less than 1.9 mm$u$, $u$Boring bars$u$, 12, $u$[{"name": "GEHIMR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1581&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_13', $u$Boring Bars with Coolant Holes for Undercutting and Turning$u$, $u$Boring bars$u$, 13, $u$[{"name": "GEHIUR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1609&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_14', $u$22.5° Approach Angle Bars for Facing and Internal Machining$u$, $u$Boring bars$u$, 14, $u$[{"name": "GHIUR/L-C-22.5A-8V", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1693&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_15', $u$45° Undercutting Bars for Internal Turning Aluminum Wheels$u$, $u$Boring bars$u$, 15, $u$[{"name": "GHIUR/L-UC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1695&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_16', $u$Internal Machining Solid Carbide Bars with Coolant Holes$u$, $u$Boring bars$u$, 16, $u$[{"name": "GEHIR/L-SC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1856&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_17', $u$Internal Machining Solid Carbide Bars with Coolant Holes for Insert Widths Less than 1.9 mm$u$, $u$Boring bars$u$, 17, $u$[{"name": "GEHIMR/L-SC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1857&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_18', $u$Internal Grooving and Turning Boring Bars$u$, $u$Boring bars$u$, 18, $u$[{"name": "GHIR/L (W=7.0-8.3)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2544&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_19', $u$Internal Grooving and Turning Blades$u$, $u$Blades$u$, 19, $u$[{"name": "CGHN 32-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=40&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_20', $u$Heavy Duty Deep Grooving and Turning Blades$u$, $u$Blades$u$, 20, $u$[{"name": "CGHN-8-10D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=42&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_21', $u$Double-Ended Blades for External Grooving and Turning$u$, $u$Blades$u$, 21, $u$[{"name": "CGHN-D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=43&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_22', $u$Blades for Deep Grooving and Turning$u$, $u$Blades$u$, 22, $u$[{"name": "CGHN-P8", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=45&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_23', $u$Single-Ended Blades for External Machining$u$, $u$Blades$u$, 23, $u$[{"name": "CGHN-S", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=46&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_24', $u$Double-Ended Heavy Duty Self-Clamped Grooving and Turning Blades$u$, $u$Blades$u$, 24, $u$[{"name": "CGHR/L-P8DG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=47&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_25', $u$Deep Machining Screw-Clamped Blades for Wide Grooving and Heavy Turning Applications$u$, $u$Blades$u$, 25, $u$[{"name": "CGHR/L-12-14D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=48&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_26', $u$Double-Ended Blades for External Grooving and Turning Self-Clamped Inserts$u$, $u$Blades$u$, 26, $u$[{"name": "CGHN-DG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=832&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_27', $u$Blades for Face Machining Carrying 8 mm Inserts$u$, $u$Blades$u$, 27, $u$[{"name": "CGFG 51-P8", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2162&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_28', $u$CUT-GRIP Adapters for Internal Grooving and Turning Blades$u$, $u$Blades$u$, 28, $u$[{"name": "AVC-GAIC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4583&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_29', $u$Adapters for up to 25mm Deep Machining$u$, $u$Adapters & blocks$u$, 29, $u$[{"name": "GADR/L-8", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=146&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_30', $u$Adapters for Face Machining$u$, $u$Adapters & blocks$u$, 30, $u$[{"name": "GAFG-R/L-8", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=147&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_31', $u$Adapters for GDMW/GDMY Groove-Turn Inserts$u$, $u$Adapters & blocks$u$, 31, $u$[{"name": "PADR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=289&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_32', $u$Internal Grooving and Turning Adapters$u$, $u$Adapters & blocks$u$, 32, $u$[{"name": "GEAIR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1408&mapp=TG&GFSTYP=M"}, {"name": "GAIR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3217&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_33', $u$Adapters with High-Pressure Coolant Channels Carrying Groove-Turn Inserts for up to 25 mm Deep Machining$u$, $u$Adapters & blocks$u$, 33, $u$[{"name": "GADR/L-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3618&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_34', $u$Internal Grooving, Turning and Threading Adapters$u$, $u$Adapters & blocks$u$, 34, $u$[{"name": "AVC-GEAIR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4578&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_35', $u$Internal Grooving Turning and Threading Adapters$u$, $u$Adapters & blocks$u$, 35, $u$[{"name": "AVC-GAIR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4579&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_36', $u$Adapters with High-Pressure Cooling Channels Carrying Inserts for Machining Seal Fin Grooves.$u$, $u$Adapters & blocks$u$, 36, $u$[{"name": "CGPADFIN-2R/2L-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5598&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_37', $u$Utility Inserts for Heavy Grooving on Ductile Materials$u$, $u$Inserts$u$, 37, $u$[{"name": "GDMU", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=150&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_38', $u$Utility Double-Ended Inserts for External Turning, Grooving and Parting$u$, $u$Inserts$u$, 38, $u$[{"name": "GDMW 2.4", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=151&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_39', $u$Utility Double-Ended Inserts for Grooving and Turning$u$, $u$Inserts$u$, 39, $u$[{"name": "GDMY", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=152&mapp=TG&GFSTYP=M"}, {"name": "GDMF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=918&mapp=TG&GFSTYP=M"}, {"name": "GDMT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4828&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_40', $u$Precision Double-Ended Inserts for External Heavy-Duty Grooving and Turning$u$, $u$Inserts$u$, 40, $u$[{"name": "GDPY", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=154&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_41', $u$Precision Double-Ended Inserts with Polished Top Rake for Machining Aluminum$u$, $u$Inserts$u$, 41, $u$[{"name": "GIPA/GIDA 8 (full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=185&mapp=TG&GFSTYP=M"}, {"name": "GIPA (full radius W=3-6)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2533&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_42', $u$Precision Double-Ended Inserts for Grooving$u$, $u$Inserts$u$, 42, $u$[{"name": "GIF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=186&mapp=TG&GFSTYP=M"}, {"name": "GIG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=196&mapp=TG&GFSTYP=M"}, {"name": "GIP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=206&mapp=TG&GFSTYP=M"}, {"name": "GIF (long pocket)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2551&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_43', $u$Precision Double-Ended Inserts for Grooving and Turning$u$, $u$Inserts$u$, 43, $u$[{"name": "GIF-E (W=4-6)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=188&mapp=TG&GFSTYP=M"}, {"name": "GIP-E", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=208&mapp=TG&GFSTYP=M"}, {"name": "GIF-E (W=8,10)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=881&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_44', $u$Inserts for Deep Face Grooving and Turning$u$, $u$Inserts$u$, 44, $u$[{"name": "GIFG-E (W=8)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=191&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_45', $u$Precision Double-Ended Inserts for Internal Grooving and Recessing$u$, $u$Inserts$u$, 45, $u$[{"name": "GIFI", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=192&mapp=TG&GFSTYP=M"}, {"name": "GIPI", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=217&mapp=TG&GFSTYP=M"}, {"name": "GIPI (CW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2939&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_46', $u$Precision Double-Ended Inserts for Internal Grooving and Turning$u$, $u$Inserts$u$, 46, $u$[{"name": "GIFI-E", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=193&mapp=TG&GFSTYP=M"}, {"name": "GIPI-E", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=218&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_47', $u$Single-Sided Inserts with Center Ridged Chipformer and Reinforced Edge for Parting and Grooving Alloy Steel$u$, $u$Inserts$u$, 47, $u$[{"name": "GIM-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=197&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_48', $u$Utility Single-Sided Inserts for Parting and Grooving Soft Materials, Tubes and Small Diameters$u$, $u$Inserts$u$, 48, $u$[{"name": "GIM-J", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=199&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_49', $u$Single-Ended Screw-Clamped Inserts for Parting and Grooving at Low Feeds on CrNi Alloys and Low Carbon Steel$u$, $u$Inserts$u$, 49, $u$[{"name": "GIM-UT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=202&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_50', $u$Utility Single-Ended Inserts for Grooving and Turning$u$, $u$Inserts$u$, 50, $u$[{"name": "GIMF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=203&mapp=TG&GFSTYP=M"}, {"name": "GIMY", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=204&mapp=TG&GFSTYP=M"}, {"name": "GIMT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4205&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_51', $u$Utility Single-Ended Inserts for External Undercutting$u$, $u$Inserts$u$, 51, $u$[{"name": "GIMY-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=205&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_52', $u$Precision Double-Ended Inserts for External Undercutting$u$, $u$Inserts$u$, 52, $u$[{"name": "GIP-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=215&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_53', $u$Double-Ended Precision Ground Inserts with a Polished Top Rake for Machining Aluminum$u$, $u$Inserts$u$, 53, $u$[{"name": "GIPA (W=3-6)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=216&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_54', $u$Precision Double-Ended Inserts for Internal Undercutting$u$, $u$Inserts$u$, 54, $u$[{"name": "GIPI-UR/UL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=220&mapp=TG&GFSTYP=M"}, {"name": "GEPI-UN/UR/UL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1542&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_55', $u$Utility Single-Ended Inserts for External Heavy Grooving and Deep Machining$u$, $u$Inserts$u$, 55, $u$[{"name": "TIGER", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=519&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_56', $u$Utility Single-Ended Inserts for Internal Grooving and Turning$u$, $u$Inserts$u$, 56, $u$[{"name": "GIMIY", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=520&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_57', $u$Precision Double-Ended Inserts for External Grooving Next to Shoulder$u$, $u$Inserts$u$, 57, $u$[{"name": "GIP-RX/LX", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=521&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_58', $u$Utility Single-Ended Inserts for External Deep Grooving and Heavy Machining$u$, $u$Inserts$u$, 58, $u$[{"name": "TIGERV", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=529&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_59', $u$Precision Double-Ended Inserts for Internal Grooving Next to a Shoulder$u$, $u$Inserts$u$, 59, $u$[{"name": "GIPI-RX/LX", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=577&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_60', $u$Precision Ground Back Turning Inserts for External Machining on Swiss-Type and Automatic Machines$u$, $u$Inserts$u$, 60, $u$[{"name": "GIPM-A46 / GIP-1250", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=805&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_61', $u$CBN Tipped Inserts for Turning and Grooving on Hard Ferrous Materials$u$, $u$Inserts$u$, 61, $u$[{"name": "GITM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=830&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_62', $u$V-Shaped Inserts for Machining Aluminum Wheels$u$, $u$Inserts$u$, 62, $u$[{"name": "GIPA 8-35V (V-shape)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=872&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_63', $u$Single-Ended Full Radius Sharp Edged Precision Inserts for Profiling High Temperature Alloys$u$, $u$Inserts$u$, 63, $u$[{"name": "GIPY", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=894&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_64', $u$Precision Inserts for Grooving Multi V-Ribbed Pulleys$u$, $u$Inserts$u$, 64, $u$[{"name": "GPV", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=921&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_65', $u$Flat Top Precision Double-Ended Inserts with T-Land for Machining Cast Iron$u$, $u$Inserts$u$, 65, $u$[{"name": "GIA-K (W=3-6)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=960&mapp=TG&GFSTYP=M"}, {"name": "GIA-K (long pocket)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2552&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_66', $u$Single-Ended Utility Insert for External Rough Grooving and Side Turning with a Front Chip Splitter$u$, $u$Inserts$u$, 66, $u$[{"name": "GDMM-CC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1032&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_67', $u$Precision Ground Double Ended Inserts for Internal and External Grooving$u$, $u$Inserts$u$, 67, $u$[{"name": "GEPI", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1533&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_68', $u$Precision Double-Ended Inserts for Internal Grooving Next to Shoulder$u$, $u$Inserts$u$, 68, $u$[{"name": "GEPI-RX/LX", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1541&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_69', $u$Precision Ground Internal Double-Ended Threading Inserts with a 60° Partial Profile for General Applications$u$, $u$Inserts$u$, 69, $u$[{"name": "GEPI-MT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1543&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_70', $u$Precision Ground Double-Ended Threading Inserts with a 55° Partial Profile and a Chipformer for 11.5 mm Bore Diameter$u$, $u$Inserts$u$, 70, $u$[{"name": "GEPI-WT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1544&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_71', $u$Utility Double-Ended Inserts for Internal, External Grooving and Turning$u$, $u$Inserts$u$, 71, $u$[{"name": "GEMI", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1547&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_72', $u$Precision Ground Double-Ended Threading Inserts with a 60° Partial Profile and Chipformer$u$, $u$Inserts$u$, 72, $u$[{"name": "TIP-MT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1558&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_73', $u$American UN (UNC,UNF,UNEF) Precision Ground External Double-Ended Full Profile Threading Inserts with a Chipformer$u$, $u$Inserts$u$, 73, $u$[{"name": "TIP-P-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1559&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_74', $u$American (BSW, BSF, BSP) Precision Ground  External Double-Ended Full Profile Threading Inserts with a Chipformer$u$, $u$Inserts$u$, 74, $u$[{"name": "TIP-P-BSW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1560&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_75', $u$NPT (National Pipe Threads) Precision Ground Double-Ended External Full Profile Threading Inserts with a Chipformer$u$, $u$Inserts$u$, 75, $u$[{"name": "TIP-P-NPT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1561&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_76', $u$Precision Ground BSPT (British Standard Pipe) External Double-Ended Full Profile Threading Inserts with a Chipformer$u$, $u$Inserts$u$, 76, $u$[{"name": "TIP-P-BSPT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1562&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_77', $u$Precision Ground ISO Metric Full Profile Double-Ended External Threading Inserts with a Chipformer$u$, $u$Inserts$u$, 77, $u$[{"name": "TIP-P-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1563&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_78', $u$Precision Ground Double-Ended Threading Inserts with a 55° Partial Profile and a Chipformer$u$, $u$Inserts$u$, 78, $u$[{"name": "TIP-WT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1672&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_79', $u$Utility Double-Ended Insert for Machining Aluminum$u$, $u$Inserts$u$, 79, $u$[{"name": "GDMA", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1730&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_80', $u$Utility Double-Ended Inserts for Grooving and Turning Ductile Materials$u$, $u$Inserts$u$, 80, $u$[{"name": "GDMN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1820&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_81', $u$Precision Ground Double-Ended Internal Threading Inserts with 60° Partial Profile and Chipformer for 20mm Min. Bore Dia.$u$, $u$Inserts$u$, 81, $u$[{"name": "TIPI-MT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1903&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_82', $u$Utility Single-Ended Inserts for Grooving and Profiling Ductile Materials$u$, $u$Inserts$u$, 82, $u$[{"name": "GIMY-F", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1914&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_83', $u$Double-Ended Internal Threading Inserts with a 55° Partial Profile and a Chipformer for 20 mm Min. Bore Diameter$u$, $u$Inserts$u$, 83, $u$[{"name": "TIPI-WT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2122&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_84', $u$Single-Ended Utility Insert with a Front Chip Splitter for External Rough Grooving and Side Turning$u$, $u$Inserts$u$, 84, $u$[{"name": "GIMM 8CC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2171&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_85', $u$Utility Double-Ended Inserts for Grooving and Profiling Ductile Materials$u$, $u$Inserts$u$, 85, $u$[{"name": "GDMY-F", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2502&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_86', $u$Utility Single-Ended Inserts for External Grooving and Profiling$u$, $u$Inserts$u$, 86, $u$[{"name": "GIMY 1260", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2508&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_87', $u$Precision Double-Ended Full Radius Inserts for Grooving$u$, $u$Inserts$u$, 87, $u$[{"name": "GIP (full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2616&mapp=TG&GFSTYP=M"}, {"name": "GIF (full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2618&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_88', $u$Precision Double-Ended Full Radius Inserts for Profiling and Grooving$u$, $u$Inserts$u$, 88, $u$[{"name": "GIP-E (full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2617&mapp=TG&GFSTYP=M"}, {"name": "GIF-E (W=4-6 full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2619&mapp=TG&GFSTYP=M"}, {"name": "GIF-E (W=8,10 full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2620&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_89', $u$Full Radius CBN Tipped Inserts for Grooving and Turning on Hard Ferrous Materials$u$, $u$Inserts$u$, 89, $u$[{"name": "GITM (full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2621&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_90', $u$Utility Double-Ended Full Radius Inserts for Grooving and Profiling$u$, $u$Inserts$u$, 90, $u$[{"name": "GDMY (full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2622&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_91', $u$Precision Double-Ended Full Radius Inserts for Internal and External Profiling and Grooving$u$, $u$Inserts$u$, 91, $u$[{"name": "GEPI (full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2623&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_92', $u$Precision Double-Ended Full Radius Inserts for Internal Grooving and Recessing$u$, $u$Inserts$u$, 92, $u$[{"name": "GIPI (full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2624&mapp=TG&GFSTYP=M"}, {"name": "GIPI (full radius CW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2942&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_93', $u$Precision Double-Ended Full Radius Inserts for Internal Profiling and Grooving$u$, $u$Inserts$u$, 93, $u$[{"name": "GIFI-E (full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2625&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_94', $u$Utility Single-Ended Inserts for Grooving and Profiling$u$, $u$Inserts$u$, 94, $u$[{"name": "GIMY (full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2627&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_95', $u$Utility Single-Ended Inserts for Grooving and Turning Ductile Materials$u$, $u$Inserts$u$, 95, $u$[{"name": "GIMN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2628&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_96', $u$Blank Inserts for Producing Inverted T Grooves$u$, $u$Inserts$u$, 96, $u$[{"name": "LPGIB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2811&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_97', $u$Flat Top Precision Double-Ended Inserts for Grooving$u$, $u$Inserts$u$, 97, $u$[{"name": "GIP (flat top CW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2938&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_98', $u$Precision Ground Double-Ended Inserts for Internal Grooving$u$, $u$Inserts$u$, 98, $u$[{"name": "GEPI (W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2940&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_99', $u$Flat Top Precision Double-Ended Inserts with Full Radius for Grooving$u$, $u$Inserts$u$, 99, $u$[{"name": "GIP (full radius CW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2941&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_100', $u$Utility Single-Sided Inserts for Parting and Grooving Soft Materials, Parting Tubes and Small Diameters$u$, $u$Inserts$u$, 100, $u$[{"name": "GIM-J-RA/LA", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3008&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_101', $u$Single-Sided Screw-Clamped Inserts with Central Ridged Chipformer for Parting Alloy Steel$u$, $u$Inserts$u$, 101, $u$[{"name": "GIM-W-RA/LA", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3009&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_102', $u$Single-Ended Screw-Clamped Inserts for Parting at Low Feeds on CrNi Alloys and Low Carbon Steel$u$, $u$Inserts$u$, 102, $u$[{"name": "GIM-UT-RA/LA", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3010&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_103', $u$Inserts for Axial Grooves Inside Radial Grooves and for Radial Grooves Inside Axial Grooves$u$, $u$Inserts$u$, 103, $u$[{"name": "LPGIR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3015&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_104', $u$Precision Double-Ended Inserts for Internal Grooving and Turning of Ductile Materials$u$, $u$Inserts$u$, 104, $u$[{"name": "GINI-E", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3151&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_105', $u$Inserts for Rough Grooving V-Shaped Piston Grooves$u$, $u$Inserts$u$, 105, $u$[{"name": "GDK", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3811&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_106', $u$Inserts for Precision Grooving V-Shaped Piston Grooves$u$, $u$Inserts$u$, 106, $u$[{"name": "GDP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3812&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_107', $u$Utility Double-Ended Full Radius Inserts for Internal and External Grooving and Profiling$u$, $u$Inserts$u$, 107, $u$[{"name": "GEMI (full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3880&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_108', $u$External and Internal Profiling Holders for Machining Aluminum Wheels$u$, $u$Toolholders$u$, 108, $u$[{"name": "GHDKR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=163&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_109', $u$External Tools for Turning, Grooving and Parting$u$, $u$Toolholders$u$, 109, $u$[{"name": "GHDR/L (short pocket)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=164&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_110', $u$Holders for Face Grooving and Turning Along Shafts$u$, $u$Toolholders$u$, 110, $u$[{"name": "GHFG-R/L-8", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=168&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_111', $u$Holders for Face Grooving and Turning$u$, $u$Toolholders$u$, 111, $u$[{"name": "GHFGR/L-8", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=169&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_112', $u$External Holders for Deep Grooving and Parting$u$, $u$Toolholders$u$, 112, $u$[{"name": "GHGR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=170&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_113', $u$Perpendicular Toolholders for Shallow Radial and Axial Grooving with Narrow and Special Profile Inserts$u$, $u$Toolholders$u$, 113, $u$[{"name": "GHMPR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=179&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_114', $u$Toolholders for Shallow Radial and Axial Grooving with Narrow and Special Profile Inserts$u$, $u$Toolholders$u$, 114, $u$[{"name": "GHMR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=180&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_115', $u$External Holders for 45° Undercutting$u$, $u$Toolholders$u$, 115, $u$[{"name": "GHMUR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=182&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_116', $u$External Grooving and Turning Holders for Swiss-Type and Automatic Machines$u$, $u$Toolholders$u$, 116, $u$[{"name": "GHSR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=183&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_117', $u$Internal and External Profiling Holders for Machining Aluminum Wheels$u$, $u$Toolholders$u$, 117, $u$[{"name": "GHVR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=184&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_118', $u$Holders for External Grooving and Turning$u$, $u$Toolholders$u$, 118, $u$[{"name": "PHGR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=295&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_119', $u$External Machining Holders for Swiss-Type and Automatic Machines$u$, $u$Toolholders$u$, 119, $u$[{"name": "PHSR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=296&mapp=TG&GFSTYP=M"}, {"name": "GEHSR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2407&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_120', $u$External Tools for Wide Grooving Inserts$u$, $u$Toolholders$u$, 120, $u$[{"name": "GHDR/L/N 12/14", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=511&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_121', $u$External Holders for Wide (20 mm) Grooving Inserts$u$, $u$Toolholders$u$, 121, $u$[{"name": "THDR/L/N", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=512&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_122', $u$External Tools for Grooving, Turning and Parting$u$, $u$Toolholders$u$, 122, $u$[{"name": "GHDR/L (long pocket)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=610&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_123', $u$External Grooving, Turning and Parting Toolholders with CAMFIX Exchangeable Tapered Shanks$u$, $u$Toolholders$u$, 123, $u$[{"name": "C#-GHDR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=857&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_124', $u$Tools for L-Type LPGIR/L Inserts$u$, $u$Toolholders$u$, 124, $u$[{"name": "HLPGR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2308&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_125', $u$External Tools for Turning, Grooving and Parting; Upper Jaw with Hard Coating to Sustain Chip Deflection$u$, $u$Toolholders$u$, 125, $u$[{"name": "GHDR/L-8A", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3006&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_126', $u$Grooving and Turning Tools with Channels for High-Pressure Coolant$u$, $u$Toolholders$u$, 126, $u$[{"name": "GHDR/L-JHP (short pocket)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3191&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_127', $u$CUT-GRIP Tools with Channels for High-Pressure Coolant for Grooving and Turning$u$, $u$Toolholders$u$, 127, $u$[{"name": "GHDR/L-JHP (long pocket)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3199&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_128', $u$External Machining Tools with Side Clamping Mechanism for Swiss-Type and Automatic Machines$u$, $u$Toolholders$u$, 128, $u$[{"name": "GEHSR/L-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3349&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_129', $u$Grooving and Turning Side Lock Tools with Channels for High-Pressure Coolant on Swiss-Type and Automatic Machines$u$, $u$Toolholders$u$, 129, $u$[{"name": "GHSR/L-JHP-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3438&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_130', $u$Grooving and Turning Tools with Bottom Inlet JETCUT Coolant Channels$u$, $u$Toolholders$u$, 130, $u$[{"name": "GHDR/L-JHP-MC (short pocket)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4204&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cutgrip_use_131', $u$Interchangeable Heads for Internal Grooving and Turning$u$, $u$Tools$u$, 131, $u$[{"name": "E-GEHIR / E-GHIR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2166&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CUTGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- MODULAR-GRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_modulargrip', 'MODULAR-GRIP', 'Grooving & parting', $u$MODULAR-GRIP: groove-turn tools and inserts from the ISCAR turning catalog, such as adapters for Turning, Grooving and Parting Carrying HELI-GRIP Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MODULARGRIP')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$MODULAR-GRIP: groove-turn tools and inserts from the ISCAR turning catalog, such as adapters for Turning, Grooving and Parting Carrying HELI-GRIP Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MODULARGRIP' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving', 'grooveturn', 'facegrooving', 'profiling', 'threading', 'turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MODULARGRIP'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_modulargrip_use_0', $u$Adapters for Turning, Grooving and Parting Carrying HELI-GRIP Inserts$u$, $u$Adapters & blocks$u$, 0, $u$[{"name": "HGPAD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1635&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_modulargrip_use_1', $u$Adapters for CUT-GRIP Inserts$u$, $u$Adapters & blocks$u$, 1, $u$[{"name": "CGPAD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1636&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_modulargrip_use_2', $u$Adapters for Face Machining$u$, $u$Adapters & blocks$u$, 2, $u$[{"name": "HFPAD-3", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1661&mapp=TG&GFSTYP=M"}, {"name": "HFPAD-4", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1733&mapp=TG&GFSTYP=M"}, {"name": "HFPAD-5", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1734&mapp=TG&GFSTYP=M"}, {"name": "HFPAD-6", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1735&mapp=TG&GFSTYP=M"}, {"name": "HFPAD-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4498&mapp=TG&GFSTYP=M"}, {"name": "TNFPAD-XL-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4499&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_modulargrip_use_3', $u$TOP-GRIP Adapters Carrying TGMF / TGMP Groove-Turn Inserts$u$, $u$Adapters & blocks$u$, 3, $u$[{"name": "TGPAD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1668&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_modulargrip_use_4', $u$Adapters for PENTA-CUT Grooving Inserts$u$, $u$Adapters & blocks$u$, 4, $u$[{"name": "PCADR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1804&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_modulargrip_use_5', $u$Screw Lock Adapter for Four Different 7° Clearance Geometries$u$, $u$Adapters & blocks$u$, 5, $u$[{"name": "SUXCR-CM-PAD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2696&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_modulargrip_use_6', $u$Adapters with High-Pressure Coolant Channels Carrying CUT-GRIP Inserts$u$, $u$Adapters & blocks$u$, 6, $u$[{"name": "CGPAD-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3304&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_modulargrip_use_7', $u$Adapters with High-Pressure Coolant Channels Carrying HELI-GRIP Inserts$u$, $u$Adapters & blocks$u$, 7, $u$[{"name": "HGPAD-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3305&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_modulargrip_use_8', $u$Adapters with High-Pressure Coolant Holes for PENTACUT Grooving Inserts$u$, $u$Adapters & blocks$u$, 8, $u$[{"name": "PCADR/L-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3597&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_modulargrip_use_9', $u$Adapters with High-Pressure Coolant Channels for DO-GRIP Parting and Grooving Inserts$u$, $u$Adapters & blocks$u$, 9, $u$[{"name": "DGPAD-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3650&mapp=TG&GFSTYP=M"}, {"name": "DGPAD-D12/22-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5479&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_modulargrip_use_10', $u$Parting and Grooving Adapters with Coolant Channels for High-Pressure Carrying TANG-GRIP Inserts$u$, $u$Adapters & blocks$u$, 10, $u$[{"name": "TAGPAD-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3651&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_modulargrip_use_11', $u$Extra Long Parting and Grooving Adapters with Channels for High-Pressure Coolant Carrying TANG-GRIP Inserts$u$, $u$Adapters & blocks$u$, 11, $u$[{"name": "TAGPAD-XL-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3742&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_modulargrip_use_12', $u$TOP-GRIP Adapters with Channels for High-Pressure Coolant Carrying TGMF / TGMP Groove-Turn Inserts$u$, $u$Adapters & blocks$u$, 12, $u$[{"name": "TGPAD-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4107&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_modulargrip_use_13', $u$Intermediate Holders for ISCAR Modular System Holders with Directed Internal Coolant for MODULAR-GRIP-XL Adapters$u$, $u$Adapters & blocks$u$, 13, $u$[{"name": "V## MAHD#-#-XL-##-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4382&mapp=TG&GFSTYP=M"}, {"name": "V## MAHD-XL-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4383&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_modulargrip_use_14', $u$Toolholders for CAMFIX Adaptations with Internal Coolant Supply for MODULAR-GRIP-XL Adapters$u$, $u$Adapters & blocks$u$, 14, $u$[{"name": "C#-V60-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4572&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_modulargrip_use_15', $u$Toolholders for HSK-T Adaptations with Internal Coolant Supply for MODULAR-GRIP-XL Adapters$u$, $u$Adapters & blocks$u$, 15, $u$[{"name": "HSK T ## V60-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4573&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_modulargrip_use_16', $u$Spacer for ISCAR Modular System$u$, $u$Tools$u$, 16, $u$[{"name": "V## V##-L##", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4384&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MODULARGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- PENTACUT
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_pentacut', 'PENTACUT', 'Threading', $u$PENTACUT: threading tools and inserts from the ISCAR turning catalog, such as inserts with 5 Cutting Edges for Parting and Grooving Soft Materials, Tubes, Small and Thin-Walled Parts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'PENTACUT')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$PENTACUT: threading tools and inserts from the ISCAR turning catalog, such as inserts with 5 Cutting Edges for Parting and Grooving Soft Materials, Tubes, Small and Thin-Walled Parts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'PENTACUT' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving', 'grooveturn', 'facegrooving', 'threading') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'PENTACUT'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_pentacut_use_0', $u$Inserts with 5 Cutting Edges for Parting and Grooving Soft Materials, Tubes, Small and Thin-Walled Parts$u$, $u$Inserts$u$, 0, $u$[{"name": "PENTA 24N-J", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1431&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_1', $u$Inserts with 5 Cutting Edges for Parting Tubes, Small and Thin-Walled Parts$u$, $u$Inserts$u$, 1, $u$[{"name": "PENTA 24R/L-J", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1432&mapp=TG&GFSTYP=M"}, {"name": "PENTA 24R/L-Z", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2443&mapp=TG&GFSTYP=M"}, {"name": "PENTA 34R/L-J", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3498&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_2', $u$Pentagonal Inserts for Parting and Precision Grooving Next to High Shoulder Applications$u$, $u$Inserts$u$, 2, $u$[{"name": "PENTA 24N-RS/LS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2370&mapp=TG&GFSTYP=M"}, {"name": "PENTA 24N-PF-RS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5481&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_3', $u$Precision Grooving Pentagonal Full Radius Inserts for Soft Materials$u$, $u$Inserts$u$, 3, $u$[{"name": "PENTA 24N-J (full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2626&mapp=TG&GFSTYP=M"}, {"name": "PENTA 17-P-RS/LS (full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4367&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_4', $u$Inserts with 5 Cutting Edges for Parting Hard Materials, Tough and General Applications$u$, $u$Inserts$u$, 4, $u$[{"name": "PENTA 34R/L-C", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2759&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_5', $u$Pentagonal Inserts with a High Positive Flat Rake for Parting and Precision Grooving$u$, $u$Inserts$u$, 5, $u$[{"name": "PENTA 24N-PF/P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2950&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_6', $u$Pentagonal Inserts for Face Grooving and Recessing$u$, $u$Inserts$u$, 6, $u$[{"name": "PENTA 34F-R/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2978&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_7', $u$Pentagonal Inserts for Parting Bearing Steel and other Ductile Materials$u$, $u$Inserts$u$, 7, $u$[{"name": "PENTA 34R/L-PB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3054&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_8', $u$Inserts with 5 Cutting Edges for Grooving and Parting Tubes, Small and Thin-Walled Parts$u$, $u$Inserts$u$, 8, $u$[{"name": "PENTA 24N-Z", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3092&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_9', $u$Parting and Grooving Pentagonal Inserts for Parting Bearing Steel and Other Ductile Materials$u$, $u$Inserts$u$, 9, $u$[{"name": "PENTA 34N-PB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3093&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_10', $u$Inserts with 5 Cutting Edges for Parting and Grooving Hard Materials, Tough and General Applications$u$, $u$Inserts$u$, 10, $u$[{"name": "PENTA 34N-C", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3094&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_11', $u$Pentagonal Inserts for Face Grooving and Recessing Along Shafts up to 5 mm Depth of Cut at a Minimum of 22 mm Diameter$u$, $u$Inserts$u$, 11, $u$[{"name": "PENTA 34F-RS/LS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3425&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_12', $u$Precision Ground ISO Metric Full Profile Pentagonal External Threading Inserts with a Chipformer$u$, $u$Inserts$u$, 12, $u$[{"name": "PENTA 24-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3426&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_13', $u$American UN (UNC, UNF, UNEF) Precision Ground Full Profile Pentagonal External Inserts with a Chipformer$u$, $u$Inserts$u$, 13, $u$[{"name": "PENTA 24-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3427&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_14', $u$Whitworth (BSW, BSF, BSP) B.S.84-1956 DIN 259 Pentagonal Full Profile External Threading Inserts with a Chipformer$u$, $u$Inserts$u$, 14, $u$[{"name": "PENTA 24-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3428&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_15', $u$BSPT (British Standard Pipe) Precision Ground External Pentagonal Full Profile Threading Inserts with a Chipformer$u$, $u$Inserts$u$, 15, $u$[{"name": "PENTA 24-BSPT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3429&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_16', $u$NPT (National Pipe Threads) Precision Ground Pentagonal External Full Profile Threading Inserts with a Chipformer$u$, $u$Inserts$u$, 16, $u$[{"name": "PENTA 24-NPT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3430&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_17', $u$Precision Ground Pentagonal External Threading Inserts with a 60° Partial Profile for General Applications$u$, $u$Inserts$u$, 17, $u$[{"name": "PENTA 24-MT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3437&mapp=TH&GFSTYP=M"}, {"name": "PENTA 17-MT-RS/LS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4221&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_18', $u$Inserts with 5 Cutting Edges for Parting and Grooving Soft Materials, Parting Tubes, Small and Thin-Walled Parts$u$, $u$Inserts$u$, 18, $u$[{"name": "PENTA 34N-J", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3496&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_19', $u$Inserts with 5 Cutting Edges for Parting Soft Materials, Thin Walls and Miniature Parts$u$, $u$Inserts$u$, 19, $u$[{"name": "PENTA 24R-P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3560&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_20', $u$Full Radius Grooving Inserts with 5 Cutting Edges for Hard Materials and Tough Applications$u$, $u$Inserts$u$, 20, $u$[{"name": "PENTA 24N-C (full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3697&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_21', $u$Parting and Precision Grooving Pentagonal Inserts for Next to High Shoulder Applications$u$, $u$Inserts$u$, 21, $u$[{"name": "PENTA 24N-J-RS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3879&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_22', $u$Full Radius Pentagonal Inserts with a High Positive Flat Rake for Parting and Precision Grooving$u$, $u$Inserts$u$, 22, $u$[{"name": "PENTA 24N-PF (full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4163&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_23', $u$Pentagonal Inserts for Precision Grooving and Turning Next to High Shoulder Applications$u$, $u$Inserts$u$, 23, $u$[{"name": "PENTA 17-NP-RS/LS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4216&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_24', $u$Back Turning Pentagonal Inserts for Short Chipping Materials$u$, $u$Inserts$u$, 24, $u$[{"name": "PENTA 17-ER/EL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4219&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_25', $u$Pentagonal Inserts for Grooving and Parting Soft Materials, and Miniature Parts$u$, $u$Inserts$u$, 25, $u$[{"name": "PENTA 17-P-RS/LS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4220&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_26', $u$Precision Ground Pentagonal External Threading Inserts with a 55° Partial Profile for General Applications$u$, $u$Inserts$u$, 26, $u$[{"name": "PENTA 17-WT-RS/LS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4222&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_27', $u$Blank Inserts with 5 Wide Cutting Edges for the Production of Special Profile Contours$u$, $u$Inserts$u$, 27, $u$[{"name": "PENTAS 27 blanks", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4346&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_28', $u$Lead Angle Edge Pentagonal Inserts (5 edges) for Parting Miniature Parts$u$, $u$Inserts$u$, 28, $u$[{"name": "PENTA 17R/L-P-RS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4516&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_29', $u$Pentagonal Inserts (5 edges) with a High Positive Rake for  Parting Soft Materials$u$, $u$Inserts$u$, 29, $u$[{"name": "PENTA 17R/L-SP-RS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4646&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_30', $u$Pentagonal Inserts for Precision Grooving and Parting Off for Next to Shoulder Applications$u$, $u$Inserts$u$, 30, $u$[{"name": "PENTA 17-NX-RS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5465&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_31', $u$Grooving, Parting and Recessing Holders Carrying Inserts with 5 Cutting Edges$u$, $u$Toolholders$u$, 31, $u$[{"name": "PCHR/L-24", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1716&mapp=TG&GFSTYP=M"}, {"name": "PCHR/L-34", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3086&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_32', $u$Holders Carrying Inserts with 5 Cutting Edges for Grooving, Parting and Recessing Next to High Shoulders$u$, $u$Toolholders$u$, 32, $u$[{"name": "PCHRS/LS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2369&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_33', $u$Perpendicular Holders Carrying Inserts with 5 Cutting Edges for Facing, Grooving, Parting and Recessing$u$, $u$Toolholders$u$, 33, $u$[{"name": "PCHPR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3070&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_34', $u$Grooving, Parting and Recessing Tools Carrying PENTA Inserts with Channels for High-Pressure Coolant$u$, $u$Toolholders$u$, 34, $u$[{"name": "PCHR/L-24-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3188&mapp=TG&GFSTYP=M"}, {"name": "PCHR/L-34-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3878&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_35', $u$Perpendicular Shank Tools that Mount Pentagonal Inserts for Machining Next to Long Central Shafts$u$, $u$Toolholders$u$, 35, $u$[{"name": "PCHPRS/LS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3424&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_36', $u$Grooving, Parting and Recessing Tools Carrying PENTA Inserts with Bottom Inlets for High-Pressure Coolant$u$, $u$Toolholders$u$, 36, $u$[{"name": "PCHR/L-24-JHP-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4165&mapp=TG&GFSTYP=M"}, {"name": "PCHR/L-34-JHP-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4166&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_37', $u$Tools Carrying Inserts with 5 Cutting Edges for Grooving, Parting, and Recessing Next to High Shoulders$u$, $u$Toolholders$u$, 37, $u$[{"name": "PCHRS/LS-17", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4215&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_38', $u$Tools Carrying Pentagonal Wide Inserts for Specially Tailored Profiles$u$, $u$Toolholders$u$, 38, $u$[{"name": "PCHR/L-27-JHP-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4340&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_39', $u$Tools Carrying Inserts with 5 Cutting Edges for Shallow Profiling Next to High Shoulders$u$, $u$Toolholders$u$, 39, $u$[{"name": "PCHRS/LS-17-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4596&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_40', $u$Double-Ended Parting and Grooving Blades for PENTACUT Inserts$u$, $u$Blades$u$, 40, $u$[{"name": "PCHBR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1934&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_41', $u$Reinforced Adapters for PENTACUT Grooving Inserts$u$, $u$Adapters & blocks$u$, 41, $u$[{"name": "PCADR/L 34N-RE", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3488&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_42', $u$Adapters with High-Pressure Coolant Holes for PENTACUT 17$u$, $u$Adapters & blocks$u$, 42, $u$[{"name": "PCADRS/LS-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4595&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_43', $u$Inserts with 5 Cutting Edges for Parting and Grooving Bars, Hard Materials and Tough Applications$u$, $u$Boring bars$u$, 43, $u$[{"name": "PENTA 24N-C", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3695&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentacut_use_44', $u$Inserts with 5 Cutting Edges for Parting Bars, Hard Materials and Tough Applications$u$, $u$Boring bars$u$, 44, $u$[{"name": "PENTA 24R-C", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3696&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'PENTACUT'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- QUICK-PENTA
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_quickpenta', 'QUICK-PENTA', 'Grooving & parting', $u$QUICK-PENTA: parting tools and inserts from the ISCAR turning catalog, such as grooving, Parting and Recessing Tools with Safety Lock Clamping for Five Cutting Edged Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKPENTA')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$QUICK-PENTA: parting tools and inserts from the ISCAR turning catalog, such as grooving, Parting and Recessing Tools with Safety Lock Clamping for Five Cutting Edged Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKPENTA' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKPENTA'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_quickpenta_use_0', $u$Grooving, Parting and Recessing Tools with Safety Lock Clamping for Five Cutting Edged Inserts$u$, $u$Toolholders$u$, 0, $u$[{"name": "PCHR/L-24-JHP-QC/MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5314&mapp=TG&GFSTYP=M"}, {"name": "PCHR/L 24-QC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5578&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickpenta_use_1', $u$Parting Insert with Five Angled Cutting Edges to Minimize burr Size. Can also be Clamped on Standard Penta-Cut Holders$u$, $u$Toolholders$u$, 1, $u$[{"name": "PENTA 24R/L-DSL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5329&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickpenta_use_2', $u$Five Cutting Edges for Parting and Grooving with Positive Rake Angle Clamped onto Standard PENTA-CUT Holders$u$, $u$Toolholders$u$, 2, $u$[{"name": "PENTA 24N-J-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5423&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickpenta_use_3', $u$Holders with PENTA-CUT Inserts for Grooving and Parting Next to High Shoulders, Enables Quick Cutting Edge Indexing$u$, $u$Toolholders$u$, 3, $u$[{"name": "PCHRS-24 JHP-QC/MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5542&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickpenta_use_4', $u$First Choice for The Parting of Bars, Hard Materials, and Tough Applications with a Negative Cutting Rake Angle$u$, $u$Boring bars$u$, 4, $u$[{"name": "PENTA 24N-C-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5328&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickpenta_use_5', $u$Pentagonal Parting and Grooving Inserts for Quick Cutting Edge Indexing. Used for Next to High Shoulder Applications$u$, $u$Inserts$u$, 5, $u$[{"name": "PENTA 24N-NF-RS-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5539&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickpenta_use_6', $u$Precision Grooving Inserts for Quick and Accurate Cutting Edge Indexing for Next to High Shoulder Applications$u$, $u$Inserts$u$, 6, $u$[{"name": "PENTA 24N-NF-RSSL (full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5544&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickpenta_use_7', $u$QUICK-PENTA Adapters with High-Pressure Coolant Holes, for QUICK-PENTA Grooving and Parting Inserts$u$, $u$Adapters & blocks$u$, 7, $u$[{"name": "PCADR/L 24-JHP-QC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5582&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickpenta_use_8', $u$Recommended for Soft & Ductile Materials such as 100Cr6 (Specifically for the Bearing Industry), at Low to Medium Feeds$u$, $u$Tools$u$, 8, $u$[{"name": "PENTA 24N-B-SL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5621&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKPENTA'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- GROOVE4CUT
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_groove4cut', 'GROOVE4CUT', 'Grooving & parting', $u$GROOVE4CUT: parting tools and inserts from the ISCAR turning catalog, such as grooving and Parting Tools Carrying GROOVE-4-CUT Inserts with Inlets for High-Pressure Coolant.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'GROOVE4CUT')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$GROOVE4CUT: parting tools and inserts from the ISCAR turning catalog, such as grooving and Parting Tools Carrying GROOVE-4-CUT Inserts with Inlets for High-Pressure Coolant.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'GROOVE4CUT' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'GROOVE4CUT'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_groove4cut_use_0', $u$Grooving and Parting Tools Carrying GROOVE-4-CUT Inserts with Inlets for High-Pressure Coolant$u$, $u$Toolholders$u$, 0, $u$[{"name": "QTHR/L-30-JHP-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5246&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_groove4cut_use_1', $u$4 Cutting Edged Inserts with a Positive Flat Rake for Parting and Precision Grooving$u$, $u$Inserts$u$, 1, $u$[{"name": "QGI 30N-PF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5251&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_groove4cut_use_2', $u$4 Cutting Edged Inserts with a High Positive Flat Rake for Parting and Precision Grooving$u$, $u$Inserts$u$, 2, $u$[{"name": "QGI 30N-P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5252&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'GROOVE4CUT'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- DOVE IQ GRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_doveiqgrip', 'DOVE IQ GRIP', 'Grooving & parting', $u$DOVE IQ GRIP: grooving tools and inserts from the ISCAR turning catalog, such as utility Single-Ended Inserts for External Heavy Grooving and Deep Machining.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'DOVEIQGRIP')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$DOVE IQ GRIP: grooving tools and inserts from the ISCAR turning catalog, such as utility Single-Ended Inserts for External Heavy Grooving and Deep Machining.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'DOVEIQGRIP' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('grooving') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'DOVEIQGRIP'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_doveiqgrip_use_0', $u$Utility Single-Ended Inserts for External Heavy Grooving and Deep Machining$u$, $u$Inserts$u$, 0, $u$[{"name": "TIGER-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3360&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_doveiqgrip_use_1', $u$Cartridges for Blades Carrying Wide Grooving Inserts$u$, $u$Blades$u$, 1, $u$[{"name": "CR THDN-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3361&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_doveiqgrip_use_2', $u$External Holders for Wide Grooving Inserts$u$, $u$Toolholders$u$, 2, $u$[{"name": "THDR/L-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3362&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'DOVEIQGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- SUMO-GRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_sumogrip', 'SUMO-GRIP', 'Grooving & parting', $u$SUMO-GRIP: parting tools and inserts from the ISCAR turning catalog, such as blades with a Tangentially Oriented Pocket Carrying TANG-GRIP Single-Ended Inserts for Parting and Grooving.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOGRIP')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$SUMO-GRIP: parting tools and inserts from the ISCAR turning catalog, such as blades with a Tangentially Oriented Pocket Carrying TANG-GRIP Single-Ended Inserts for Parting and Grooving.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOGRIP' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving', 'grooveturn', 'profiling') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOGRIP'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_sumogrip_use_0', $u$Blades with a Tangentially Oriented Pocket Carrying TANG-GRIP Single-Ended Inserts for Parting and Grooving$u$, $u$Blades$u$, 0, $u$[{"name": "TGFH/R/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2272&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_sumogrip_use_1', $u$Toolholders for Heavy Duty Groove-Turn and Parting Applications$u$, $u$Toolholders$u$, 1, $u$[{"name": "TGBHR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2964&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_sumogrip_use_2', $u$Grooving and Turning SUMO-GRIP Tools with Channels for High-Pressure Coolant$u$, $u$Toolholders$u$, 2, $u$[{"name": "TGBHR/L-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3193&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_sumogrip_use_3', $u$Single-Ended Utility Inserts for Grooving, Turning and Parting$u$, $u$Inserts$u$, 3, $u$[{"name": "TAGB/TAGBA", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2965&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- QUICK-I-GROOVE
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_quickigroove', 'QUICK-I-GROOVE', 'Grooving & parting', $u$QUICK-I-GROOVE: groove-turn tools and inserts from the ISCAR turning catalog, such as internal Grooving and Turning Bars on which Inserts with 4 Cutting Edges are Mounted.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKIGROOVE')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$QUICK-I-GROOVE: groove-turn tools and inserts from the ISCAR turning catalog, such as internal Grooving and Turning Bars on which Inserts with 4 Cutting Edges are Mounted.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKIGROOVE' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('grooveturn') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKIGROOVE'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_quickigroove_use_0', $u$Internal Grooving and Turning Bars on which Inserts with 4 Cutting Edges are Mounted$u$, $u$Boring bars$u$, 0, $u$[{"name": "GQHINR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5295&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickigroove_use_1', $u$4 Cutting Edges Precision Grounded Inserts for Internal Grooving and Recessing Operations$u$, $u$Inserts$u$, 1, $u$[{"name": "GQIN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5297&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKIGROOVE'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- V-LOCK
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_vlock', 'V-LOCK', 'Grooving & parting', $u$V-LOCK: grooving tools and inserts from the ISCAR turning catalog, such as external Toolholders for Specially Tailored Wide Profile Grooving Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'VLOCK')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$V-LOCK: grooving tools and inserts from the ISCAR turning catalog, such as external Toolholders for Specially Tailored Wide Profile Grooving Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'VLOCK' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('grooving') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'VLOCK'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_vlock_use_0', $u$External Toolholders for Specially Tailored Wide Profile Grooving Inserts$u$, $u$Toolholders$u$, 0, $u$[{"name": "SXCNN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=964&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_vlock_use_1', $u$Internal Toolholders for Specially Tailored Profile Inserts$u$, $u$Toolholders$u$, 1, $u$[{"name": "SXCIR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2080&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_vlock_use_2', $u$Semi-Standard Dovetail Type Holders, for Wide Profiling Inserts$u$, $u$Toolholders$u$, 2, $u$[{"name": "DT-A XNHN/R/L& DT-A FTHN/R/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2346&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_vlock_use_3', $u$Blank Inserts for Wide Profile Grooving$u$, $u$Inserts$u$, 3, $u$[{"name": "XNUW", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=965&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'VLOCK'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- FORM-TOOL
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_formtool', 'FORM-TOOL', 'Grooving & parting', $u$FORM-TOOL: grooving tools and inserts from the ISCAR turning catalog, such as square Shank Toolholders for FTB Profile Turning Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'FORMTOOL')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$FORM-TOOL: grooving tools and inserts from the ISCAR turning catalog, such as square Shank Toolholders for FTB Profile Turning Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'FORMTOOL' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('grooving') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'FORMTOOL'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_formtool_use_0', $u$Square Shank Toolholders for FTB Profile Turning Inserts$u$, $u$Toolholders$u$, 0, $u$[{"name": "FTHN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1982&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_formtool_use_1', $u$Blank Inserts for Wide Profile Grooving$u$, $u$Inserts$u$, 1, $u$[{"name": "FTB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1987&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'FORMTOOL'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- QUICK2CUT MINI
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_quick2cutmini', 'QUICK2CUT MINI', 'Grooving & parting', $u$QUICK2CUT MINI: parting tools and inserts from the ISCAR turning catalog, such as double Sided Tangential Insert for SWISS Type Machines, Intended for Grooving, Parting and Recessing Small Parts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICK2CUTMINI')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$QUICK2CUT MINI: parting tools and inserts from the ISCAR turning catalog, such as double Sided Tangential Insert for SWISS Type Machines, Intended for Grooving, Parting and Recessing Small Parts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICK2CUTMINI' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICK2CUTMINI'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_quick2cutmini_use_0', $u$Double Sided Tangential Insert for SWISS Type Machines, Intended for Grooving, Parting and Recessing Small Parts$u$, $u$Inserts$u$, 0, $u$[{"name": "TGV N", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5264&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quick2cutmini_use_1', $u$Double Sided Tangential Insert with Lead Angle Cutting Edge to Minimize Burr Size, Intended for Parting Small Parts$u$, $u$Inserts$u$, 1, $u$[{"name": "TGV R/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5265&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quick2cutmini_use_2', $u$Grooving, Parting and Recessing Tools Carrying TGV Inserts with Channels for High-Pressure Coolant$u$, $u$Toolholders$u$, 2, $u$[{"name": "TGVR/L-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5266&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICK2CUTMINI'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- SWISSCUT
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_swisscut', 'SWISSCUT', 'Threading', $u$SWISSCUT: threading tools and inserts from the ISCAR turning catalog, such as grooving and Turning Tools with Back and Front Clamping for Swiss-Type and Automatic Machines.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SWISSCUT')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$SWISSCUT: threading tools and inserts from the ISCAR turning catalog, such as grooving and Turning Tools with Back and Front Clamping for Swiss-Type and Automatic Machines.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SWISSCUT' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving', 'grooveturn', 'threading', 'turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SWISSCUT'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_swisscut_use_0', $u$Grooving and Turning Tools with Back and Front Clamping for Swiss-Type and Automatic Machines$u$, $u$Toolholders$u$, 0, $u$[{"name": "SCHR/L-22BF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3353&mapp=IS&GFSTYP=M"}, {"name": "SCHR/L-41BF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4184&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_swisscut_use_1', $u$Grooving and Turning Tools with High-Pressure Coolant Channels for Swiss-Type and Automatic Machines$u$, $u$Toolholders$u$, 1, $u$[{"name": "SCHR/L-22BF-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3799&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_swisscut_use_2', $u$Grooving and Parting Inserts$u$, $u$Inserts$u$, 2, $u$[{"name": "SCIR/L-22-N/R/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3354&mapp=TG&GFSTYP=M"}, {"name": "SCIR/L-41-N/R/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4185&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_swisscut_use_3', $u$Back Turning Inserts$u$, $u$Inserts$u$, 3, $u$[{"name": "SCIR/L-22-BR/BL/BRA/BLA", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3355&mapp=TG&GFSTYP=M"}, {"name": "SCIR/L-41-BRA/BLA", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4190&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_swisscut_use_4', $u$Back Turning Inserts for Short Chipping Materials$u$, $u$Inserts$u$, 4, $u$[{"name": "SCIR/L-22-ER/EL/ERA/ELA", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3356&mapp=TG&GFSTYP=M"}, {"name": "SCIR/L-41-ERA/ELA", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4188&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_swisscut_use_5', $u$Turning Inserts with a Front Relief Angle$u$, $u$Inserts$u$, 5, $u$[{"name": "SCIR/L-22-AR/AL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3357&mapp=TG&GFSTYP=M"}, {"name": "SCIR/L-22-AD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3902&mapp=TG&GFSTYP=M"}, {"name": "SCIR/L-41-AR/AL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4189&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_swisscut_use_6', $u$Grooving, Turning and Parting Inserts$u$, $u$Inserts$u$, 6, $u$[{"name": "SCIR/L-22-NP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3358&mapp=TG&GFSTYP=M"}, {"name": "SCIR/L-41-NP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4186&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_swisscut_use_7', $u$Threading Inserts with a 60° Partial Profile$u$, $u$Inserts$u$, 7, $u$[{"name": "SCIR/L-22-MTR/MTL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3503&mapp=TH&GFSTYP=M"}, {"name": "SCIR/L-41-MTR/MTL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4191&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_swisscut_use_8', $u$Precision Ground ISO Metric Full Profile Threading Inserts$u$, $u$Inserts$u$, 8, $u$[{"name": "SCIR-22-MTR-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3533&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_swisscut_use_9', $u$Grooving and Turning Inserts with a Chipformer$u$, $u$Inserts$u$, 9, $u$[{"name": "SCIR/L-22-NX", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3802&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_swisscut_use_10', $u$Turning Inserts$u$, $u$Inserts$u$, 10, $u$[{"name": "SCIR/L-41-AD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4187&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SWISSCUT'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- QUICK-SWISS
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_quickswiss', 'QUICK-SWISS', 'Turning', $u$QUICK-SWISS: turning for swiss-type tools and inserts from the ISCAR turning catalog, such as screw Lock JETCUT Modular Heads Mount 7° Clearance 55° Rhombic Inserts for Back-End Machining on Swiss-Type Machines.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKSWISS')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$QUICK-SWISS: turning for swiss-type tools and inserts from the ISCAR turning catalog, such as screw Lock JETCUT Modular Heads Mount 7° Clearance 55° Rhombic Inserts for Back-End Machining on Swiss-Type Machines.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKSWISS' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('grooving', 'grooveturn', 'facegrooving', 'threading', 'turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKSWISS'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_quickswiss_use_0', $u$Screw Lock JETCUT Modular Heads Mount 7° Clearance 55° Rhombic Inserts for Back-End Machining on Swiss-Type Machines$u$, $u$Tools$u$, 0, $u$[{"name": "SBTT-SDNCN-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4858&mapp=IS&GFSTYP=M"}, {"name": "SBTT#-SDJCR/L-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4865&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickswiss_use_1', $u$Screw Lock JETCUT Modular Heads Mount 7° Clearance 35° Rhombic Inserts for Back-End Machining on Swiss-Type Machines$u$, $u$Tools$u$, 1, $u$[{"name": "SBTT-SVVCN-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4860&mapp=IS&GFSTYP=M"}, {"name": "SBTT#-SVUCR/L-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4861&mapp=IS&GFSTYP=M"}, {"name": "SBTT#-SVQCR/L-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4862&mapp=IS&GFSTYP=M"}, {"name": "SBTT#-SVJCR/L-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4867&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickswiss_use_2', $u$Screw Lock JETCUT Modular Heads Mount 7° Clearance 80° Rhombic Inserts for Back-End Machining on Swiss-Type Machines$u$, $u$Tools$u$, 2, $u$[{"name": "SBTT#-SCLCR/L-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4864&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickswiss_use_3', $u$Screw Lock JETCUT Modular Heads Mount 5° Clearance 35° Rhombic Inserts for Back-End Machining on Swiss-Type Machines$u$, $u$Tools$u$, 3, $u$[{"name": "SBTT#-SVJBR/L-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4868&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickswiss_use_4', $u$Lever Lock JETCUT Modular Heads on which Double-Sided 80° Rhombic Inserts are Mounted for Back-End Machining$u$, $u$Tools$u$, 4, $u$[{"name": "SBTT-PCLXR/L09-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5274&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickswiss_use_5', $u$Screw Lock JETCUT Modular Heads on which Positive Double-Sided 55° Rhombic Inserts are Mounted for Back-End Machining$u$, $u$Tools$u$, 5, $u$[{"name": "SBTT/L/A-SDJNR/L07-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5275&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickswiss_use_6', $u$Screw Lock JETCUT Modular Heads Mount MINCUT Face Grooving Inserts for Back-End Machining on Swiss-Type Machines$u$, $u$Tools$u$, 6, $u$[{"name": "SBTT#-MIFHR-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5303&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickswiss_use_7', $u$Screw Lock JETCUT Modular Heads Mount PENTA 17 Grooving Inserts for Back-End Machining on Swiss-Type Machines$u$, $u$Tools$u$, 7, $u$[{"name": "SBTT#-PCHRS/LS-17-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5304&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickswiss_use_8', $u$Screw Lock JETCUT Modular Heads Mount SWISSCUT Groove-Turn Inserts for Back-End Machining on Swiss-Type Machines$u$, $u$Tools$u$, 8, $u$[{"name": "SBTT#-SCHR/L22-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5305&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKSWISS'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- SLIM-GRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_slimgrip', 'SLIM-GRIP', 'Grooving & parting', $u$SLIM-GRIP: parting tools and inserts from the ISCAR turning catalog, such as thin Parting, Grooving and Slitting Single-Ended Inserts for Soft Materials.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SLIMGRIP')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$SLIM-GRIP: parting tools and inserts from the ISCAR turning catalog, such as thin Parting, Grooving and Slitting Single-Ended Inserts for Soft Materials.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SLIMGRIP' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SLIMGRIP'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_slimgrip_use_0', $u$Thin Parting, Grooving and Slitting Single-Ended Inserts for Soft Materials$u$, $u$Inserts$u$, 0, $u$[{"name": "GFT-J", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4213&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_slimgrip_use_1', $u$Thin Parting, Grooving & Slitting Single-Ended Inserts for Soft Materials$u$, $u$Inserts$u$, 1, $u$[{"name": "GFT-C", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4464&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_slimgrip_use_2', $u$Parting and Grooving Adapters with 5 Pockets for SLIM-GRIP Inserts$u$, $u$Adapters & blocks$u$, 2, $u$[{"name": "ADMP D22", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4235&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SLIMGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- SWISSGRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_swissgrip', 'SWISSGRIP', 'Grooving & parting', $u$SWISSGRIP: parting tools and inserts from the ISCAR turning catalog, such as parting and Grooving Holder for a SELF-GRIP Mini Blades (SGAQ), Suitable for Swiss-Type Machines.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SWISSGRIP')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$SWISSGRIP: parting tools and inserts from the ISCAR turning catalog, such as parting and Grooving Holder for a SELF-GRIP Mini Blades (SGAQ), Suitable for Swiss-Type Machines.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SWISSGRIP' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SWISSGRIP'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_swissgrip_use_0', $u$Parting and Grooving Holder for a SELF-GRIP Mini Blades (SGAQ), Suitable for Swiss-Type Machines$u$, $u$Blades$u$, 0, $u$[{"name": "THQR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4652&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_swissgrip_use_1', $u$SELF-GRIP Mini Blades for Parting and Grooving, Suitable for Swiss-Type Machines$u$, $u$Blades$u$, 1, $u$[{"name": "SGAQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4653&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SWISSGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- PICCO-JET
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_piccojet', 'PICCO-JET', 'Turning', $u$PICCO-JET: turning for swiss-type tools and inserts from the ISCAR turning catalog, such as inserts with Inner Coolant Channel for Internal Turning and Chamfering.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'PICCOJET')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$PICCO-JET: turning for swiss-type tools and inserts from the ISCAR turning catalog, such as inserts with Inner Coolant Channel for Internal Turning and Chamfering.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'PICCOJET' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('grooving', 'grooveturn', 'facegrooving', 'profiling', 'threading', 'turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'PICCOJET'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_piccojet_use_0', $u$Inserts with Inner Coolant Channel for Internal Turning and Chamfering$u$, $u$Inserts$u$, 0, $u$[{"name": "PICJ R/LT20", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5192&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccojet_use_1', $u$Inserts with Chipformers and Inner Coolant Channel for Internal Boring and Profiling$u$, $u$Inserts$u$, 1, $u$[{"name": "PICJ R/LT20-C", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5193&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccojet_use_2', $u$Inserts with Inner Coolant Channel for Internal Turning and Chamfering Next to the Bottom of Blind Holes$u$, $u$Inserts$u$, 2, $u$[{"name": "PICJ R/LT2020", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5194&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccojet_use_3', $u$Inserts with Inner Coolant Channel for Internal Turning and Profiling$u$, $u$Inserts$u$, 3, $u$[{"name": "PICJ R/LT90", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5196&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccojet_use_4', $u$Inserts with Inner Coolant Channel for Internal Grooving and Turning$u$, $u$Inserts$u$, 4, $u$[{"name": "PICJ R/LG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5197&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccojet_use_5', $u$Full Radius Inserts with Inner Coolant Channel for Internal Profiling$u$, $u$Inserts$u$, 5, $u$[{"name": "PICJ R/LP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5198&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccojet_use_6', $u$Inserts with Inner Coolant Channel for Internal Chamfering$u$, $u$Inserts$u$, 6, $u$[{"name": "PICJ R/LCH", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5199&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccojet_use_7', $u$Inserts with Inner Coolant Channel for Internal Turning and 45° Chamfering$u$, $u$Inserts$u$, 7, $u$[{"name": "PICJ R/LT45", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5200&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccojet_use_8', $u$Back Chamfering Inserts with Inner Coolant Channel for Pre-Parting Operations$u$, $u$Inserts$u$, 8, $u$[{"name": "PICJ R/LBC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5201&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccojet_use_9', $u$Inserts with an Internal Coolant Channels for Face Grooving$u$, $u$Inserts$u$, 9, $u$[{"name": "PICJ R/LF-D6/8-T (Face Grooving)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5202&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccojet_use_10', $u$Inserts with Internal Coolant Channel for Round Profile Face Grooving$u$, $u$Inserts$u$, 10, $u$[{"name": "PICJ RF-T (Round Face Grooving)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5203&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccojet_use_11', $u$Inserts with an Internal Coolant Channel for Grooving Along Shaft Dmin 6 mm$u$, $u$Inserts$u$, 11, $u$[{"name": "PICJ RF-T-20 (Grooving Along Shaft)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5204&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccojet_use_12', $u$Inserts with an Internal Coolant Channels for Deep Face Grooving$u$, $u$Inserts$u$, 12, $u$[{"name": "PICJ RF-D16/20-T (Face Grooving)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5205&mapp=TG&GFSTYP=M"}, {"name": "PICJ RF-D8-T (Face Grooving)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5206&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccojet_use_13', $u$Inserts with a 60° Internal Thread Profile and Inner Coolant Channel for 2.4mm min. Bore Diameter$u$, $u$Inserts$u$, 13, $u$[{"name": "PICJ R/LTH (60° Threading)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5272&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccojet_use_14', $u$Inserts with Inner Coolant Channel for 55° Internal Threading Profile$u$, $u$Inserts$u$, 14, $u$[{"name": "PICJ RTH (55° Threading)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5273&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccojet_use_15', $u$Inserts for Internal Deep Profiling$u$, $u$Inserts$u$, 15, $u$[{"name": "PICJ R/LT47", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5494&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccojet_use_16', $u$Inserts for Internal Back Turning$u$, $u$Inserts$u$, 16, $u$[{"name": "PICJ R/LBT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5495&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'PICCOJET'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- PICCO-CUT
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_piccocut', 'PICCO-CUT', 'Turning', $u$PICCO-CUT: turning for swiss-type tools and inserts from the ISCAR turning catalog, such as inserts for Internal Turning and Chamfering.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'PICCOCUT')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$PICCO-CUT: turning for swiss-type tools and inserts from the ISCAR turning catalog, such as inserts for Internal Turning and Chamfering.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'PICCOCUT' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('grooving', 'grooveturn', 'facegrooving', 'profiling', 'threading', 'turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'PICCOCUT'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_piccocut_use_0', $u$Inserts for Internal Turning and Chamfering$u$, $u$Inserts$u$, 0, $u$[{"name": "PICCO R/L 050, 053, 055", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=531&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_1', $u$Inserts for Internal Grooving and Turning$u$, $u$Inserts$u$, 1, $u$[{"name": "PICCO R/L 002-007", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=532&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_2', $u$Inserts for Internal Turning and 45° Chamfering$u$, $u$Inserts$u$, 2, $u$[{"name": "PICCO R/L 060", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=537&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_3', $u$Back Chamfering Inserts for Pre-Parting Operations$u$, $u$Inserts$u$, 3, $u$[{"name": "PICCO R/L 070", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=538&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_4', $u$Inserts with a 60° Internal Thread Profile for 2.4 mm Min. Bore Diameter$u$, $u$Inserts$u$, 4, $u$[{"name": "PICCO R/L-60°-Thread", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=539&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_5', $u$Inserts for Face Grooving$u$, $u$Inserts$u$, 5, $u$[{"name": "PICCO-010/610 (Face Grooving)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=928&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_6', $u$Inserts for 55° Internal Thread Profile$u$, $u$Inserts$u$, 6, $u$[{"name": "PICCO-55°-Thread", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1173&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_7', $u$Full Radius Inserts for Internal Profiling$u$, $u$Inserts$u$, 7, $u$[{"name": "PICCO R/L 004-007 (full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1740&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_8', $u$Inserts for Internal Turning and Profiling$u$, $u$Inserts$u$, 8, $u$[{"name": "PICCO R/L 090", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1741&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_9', $u$Inserts for Internal Back Turning$u$, $u$Inserts$u$, 9, $u$[{"name": "PICCO R/L 080", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1873&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_10', $u$Inserts for Round Profile Face Grooving$u$, $u$Inserts$u$, 10, $u$[{"name": "PICCO-010 (Round Face Groove)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2486&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_11', $u$Inserts for Grooving Along a Shaft Dmin 6 mm$u$, $u$Inserts$u$, 11, $u$[{"name": "PICCO-620 (Groove Along Shaft)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2487&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_12', $u$Inserts for Deep Face Grooving$u$, $u$Inserts$u$, 12, $u$[{"name": "PICCO-015 (Face Grooving)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2546&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_13', $u$Inserts with an Internal Coolant Channels for Deep Face Grooving$u$, $u$Inserts$u$, 13, $u$[{"name": "PICCO-016/020 (Face Grooving)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2979&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_14', $u$Inserts with Chipformers for Internal Boring and Profiling$u$, $u$Inserts$u$, 14, $u$[{"name": "PICCO R/L 050-C", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3044&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_15', $u$Inserts for Internal Chamfering$u$, $u$Inserts$u$, 15, $u$[{"name": "PICCO R/L 520", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3045&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_16', $u$CBN Tipped Inserts for Internal Turning, Profiling and Chamfering Hard Steel$u$, $u$Inserts$u$, 16, $u$[{"name": "PICCO R 050 (CBN)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3046&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_17', $u$Inserts for Internal Deep Profiling$u$, $u$Inserts$u$, 17, $u$[{"name": "PICCO R/L 047", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3047&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_18', $u$ISO Standard Inserts for Full Profile Threads$u$, $u$Inserts$u$, 18, $u$[{"name": "PICCO ISO Full Profile", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3048&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_19', $u$ISO Fine Pitch Inserts for Full Profile Threads$u$, $u$Inserts$u$, 19, $u$[{"name": "PICCO ISO Full Profile Fine", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3053&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_20', $u$Inserts for Internal Turning and Chamfering Next to the Bottom of Blind Holes$u$, $u$Inserts$u$, 20, $u$[{"name": "PICCO R 050.20", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3177&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_21', $u$Inserts for Internal Turning and Chamfering Hard Steel - Up to 65 HRC$u$, $u$Inserts$u$, 21, $u$[{"name": "PICCO R/LHD 050", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3872&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_22', $u$Profiling Inserts with Coolant Channel Optimized for Machining Medical Parts$u$, $u$Inserts$u$, 22, $u$[{"name": "PICCO R/LM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3873&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_23', $u$Contains 2 Toolholders and a Set of Solid Carbide Miniature Turning and Grooving Boring Bars$u$, $u$Kits$u$, 23, $u$[{"name": "KIT PICCO SET", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2102&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccocut_use_24', $u$Contains One Toolholder and a Set of Solid Carbide Miniature Face Turning and Grooving Boring Bars$u$, $u$Kits$u$, 24, $u$[{"name": "KIT PICCO Face", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3254&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'PICCOCUT'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- PICCO-INDEX
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_piccoindex', 'PICCO-INDEX', 'Turning', $u$PICCO-INDEX: turning for swiss-type tools and inserts from the ISCAR turning catalog, such as solid Carbide PICCO Tools Carrying 80° Rhombic Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'PICCOINDEX')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$PICCO-INDEX: turning for swiss-type tools and inserts from the ISCAR turning catalog, such as solid Carbide PICCO Tools Carrying 80° Rhombic Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'PICCOINDEX' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('threading', 'turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'PICCOINDEX'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_piccoindex_use_0', $u$Solid Carbide PICCO Tools Carrying 80° Rhombic Inserts$u$, $u$Solid tools$u$, 0, $u$[{"name": "PICIN-SCLCR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4675&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccoindex_use_1', $u$Solid Carbide PICCO Tools on which Internal Laydown Threading Inserts are Mounted$u$, $u$Solid tools$u$, 1, $u$[{"name": "PICIN-MGSIR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4676&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccoindex_use_2', $u$Solid Carbide PICCO Tools Carrying Small WBMT/WBGT Trigon Inserts$u$, $u$Solid tools$u$, 2, $u$[{"name": "PICIN-SWUBR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4677&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccoindex_use_3', $u$PICCO Tools on which 80° Rhombic Inserts are Mounted$u$, $u$Toolholders$u$, 3, $u$[{"name": "PICIN-A-SCLCR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5168&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_piccoindex_use_4', $u$PICCO Tools on which Small WBMT/WBGT Trigon Inserts are Mounted$u$, $u$Toolholders$u$, 4, $u$[{"name": "PICIN-A-SWUBR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5170&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'PICCOINDEX'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- MINI-CHAM
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_minicham', 'MINI-CHAM', 'Threading', $u$MINI-CHAM: threading tools and inserts from the ISCAR turning catalog, such as solid Carbide Bars for Internal Turning and Threading at 4 mm Minimum Bore Diameter.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MINICHAM')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$MINI-CHAM: threading tools and inserts from the ISCAR turning catalog, such as solid Carbide Bars for Internal Turning and Threading at 4 mm Minimum Bore Diameter.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MINICHAM' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('grooveturn', 'profiling', 'threading', 'turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MINICHAM'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_minicham_use_0', $u$Solid Carbide Bars for Internal Turning and Threading at 4 mm Minimum Bore Diameter$u$, $u$Boring bars$u$, 0, $u$[{"name": "MGUHR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1162&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_minicham_use_1', $u$Miniature Indexable Inserts for Internal Turning$u$, $u$Inserts$u$, 1, $u$[{"name": "UMGR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1443&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_minicham_use_2', $u$Mini Indexable Inserts with a 60° Partial Profile for Threading in 5.2 mm and Larger Holes$u$, $u$Inserts$u$, 2, $u$[{"name": "UMGR-A60", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1552&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_minicham_use_3', $u$Mini Indexable Inserts with Whitworth Partial Profile for Threading in 5.2 mm and Larger Holes$u$, $u$Inserts$u$, 3, $u$[{"name": "UMGR-A55", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2123&mapp=TH&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MINICHAM'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- MIN-CUT
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_mincut', 'MIN-CUT', 'Grooving & parting', $u$MIN-CUT: face grooving tools and inserts from the ISCAR turning catalog, such as bars for Face and Internal Grooving, Undercutting and Threading Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MINCUT')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$MIN-CUT: face grooving tools and inserts from the ISCAR turning catalog, such as bars for Face and Internal Grooving, Undercutting and Threading Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MINCUT' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('grooving', 'grooveturn', 'facegrooving', 'profiling', 'threading') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MINCUT'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_mincut_use_0', $u$Bars for Face and Internal Grooving, Undercutting and Threading Inserts$u$, $u$Boring bars$u$, 0, $u$[{"name": "MIFHR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2809&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_mincut_use_1', $u$Screw-Clamped Inserts for Internal Face Grooving and Turning$u$, $u$Inserts$u$, 1, $u$[{"name": "MIFR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2810&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_mincut_use_2', $u$Internal Shallow Grooving Inserts$u$, $u$Inserts$u$, 2, $u$[{"name": "MIGR 8", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3084&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_mincut_use_3', $u$45° Full Radius Internal Undercutting Inserts$u$, $u$Inserts$u$, 3, $u$[{"name": "MIUR 8", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3134&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_mincut_use_4', $u$Internal ISO Metric Threading Inserts for Partial Profile$u$, $u$Inserts$u$, 4, $u$[{"name": "MITR 8-MT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3135&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_mincut_use_5', $u$Screw-Clamped Inserts for External Face Grooving and Turning Next to Shafts$u$, $u$Inserts$u$, 5, $u$[{"name": "MEFL", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3853&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_mincut_use_6', $u$Contains One Toolholder and a Set of 6 Different Inserts for Internal Face Grooving and Turning Applications$u$, $u$Kits$u$, 6, $u$[{"name": "MINCUT KIT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3493&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_mincut_use_7', $u$Trepanning Cartridges Carrying MINCUT Inserts Mounted on a BHR MB32-32X63 Boring Head$u$, $u$Adapters & blocks$u$, 7, $u$[{"name": "IHSR-MIFR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4123&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MINCUT'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- CHAM-GROOVE
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_chamgroove', 'CHAM-GROOVE', 'Threading', $u$CHAM-GROOVE: threading tools and inserts from the ISCAR turning catalog, such as precision Ground Single-Ended Inserts for Internal Grooving and Turning.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMGROOVE')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$CHAM-GROOVE: threading tools and inserts from the ISCAR turning catalog, such as precision Ground Single-Ended Inserts for Internal Grooving and Turning.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMGROOVE' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('grooving', 'grooveturn', 'facegrooving', 'profiling', 'threading', 'turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMGROOVE'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_chamgroove_use_0', $u$Precision Ground Single-Ended Inserts for Internal Grooving and Turning$u$, $u$Inserts$u$, 0, $u$[{"name": "GIQR/L 8", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=788&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_chamgroove_use_1', $u$Precision Ground Single-Ended Full Radius Inserts for Internal Grooving and Profiling$u$, $u$Inserts$u$, 1, $u$[{"name": "GIQR/L 8-R", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=789&mapp=TG&GFSTYP=M"}, {"name": "GIQR/L 11-R", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3216&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_chamgroove_use_2', $u$Internal Threading Inserts with a 60° Partial Profile for Threading in 8 mm and Larger Holes$u$, $u$Inserts$u$, 2, $u$[{"name": "GIQR/L-MT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=790&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_chamgroove_use_3', $u$Internal Boring and Profiling Inserts$u$, $u$Inserts$u$, 3, $u$[{"name": "GIQR/L-A18", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=900&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_chamgroove_use_4', $u$Face Grooving Inserts$u$, $u$Inserts$u$, 4, $u$[{"name": "GFQR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1164&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_chamgroove_use_5', $u$Internal Inserts with Whitworth Partial Profile for Threading in 8 mm and Larger Holes$u$, $u$Inserts$u$, 5, $u$[{"name": "GIQR/L-WT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2124&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_chamgroove_use_6', $u$Precision Ground Single-Ended Inserts for Internal Grooving and Turning, DMIN 11 mm$u$, $u$Inserts$u$, 6, $u$[{"name": "GIQR/L 11", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2543&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_chamgroove_use_7', $u$Internal Back Boring and Profiling Inserts$u$, $u$Inserts$u$, 7, $u$[{"name": "GIQR/L-B18", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2553&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_chamgroove_use_8', $u$Precision Ground Single-Ended Inserts for Internal Deep Grooving and Turning$u$, $u$Inserts$u$, 8, $u$[{"name": "GIQR/L 11-15", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3012&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_chamgroove_use_9', $u$Precision Ground Single-Ended Full Radius Inserts for Deep Internal Grooving and Profiling$u$, $u$Inserts$u$, 9, $u$[{"name": "GIQR/L 11-15-R", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3013&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_chamgroove_use_10', $u$Internal Grooving, Turning and Threading Bars$u$, $u$Boring bars$u$, 10, $u$[{"name": "MG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=791&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_chamgroove_use_11', $u$Solid Carbide Bars for Internal Grooving, Turning and Threading, DMIN 8 mm$u$, $u$Boring bars$u$, 11, $u$[{"name": "MGCH", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=968&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_chamgroove_use_12', $u$Face Machining Tools Carrying GFQR Inserts for Dmin 12 - Dmax 19 mm Penetration Range$u$, $u$Toolholders$u$, 12, $u$[{"name": "MGCH-C (face)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1571&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CHAMGROOVE'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- PENTA IQ GRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_pentaiqgrip', 'PENTA IQ GRIP', 'Grooving & parting', $u$PENTA IQ GRIP: parting tools and inserts from the ISCAR turning catalog, such as grooving and Parting Tools Carrying Inserts with 5 Cutting Edges.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'PENTAIQGRIP')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$PENTA IQ GRIP: parting tools and inserts from the ISCAR turning catalog, such as grooving and Parting Tools Carrying Inserts with 5 Cutting Edges.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'PENTAIQGRIP' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'PENTAIQGRIP'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_pentaiqgrip_use_0', $u$Grooving and Parting Tools Carrying Inserts with 5 Cutting Edges$u$, $u$Toolholders$u$, 0, $u$[{"name": "PCHR/L-D-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3383&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentaiqgrip_use_1', $u$Grooving and Parting Tools with Channels for High-Pressure Coolant Carrying Inserts with 5 Cutting Edges$u$, $u$Toolholders$u$, 1, $u$[{"name": "PCHR/L-D-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3877&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentaiqgrip_use_2', $u$Inserts with 5 Cutting Edges for Parting and Grooving Hard Materials, Tough and General Applications$u$, $u$Inserts$u$, 2, $u$[{"name": "PENTA D-N-C", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3384&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentaiqgrip_use_3', $u$Inserts with 5 Cutting Edges for Parting Hard Materials, Tough and General Applications$u$, $u$Inserts$u$, 3, $u$[{"name": "PENTA D-R/L-C", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3385&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentaiqgrip_use_4', $u$Inserts with 5 Cutting Edges for Parting and Grooving Soft Materials, Parting Tubes, Small and Thin-Walled Parts$u$, $u$Inserts$u$, 4, $u$[{"name": "PENTA D-N-J", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3850&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentaiqgrip_use_5', $u$Inserts with 5 Cutting Edges for Parting Tubes, Small and Thin-Walled Parts$u$, $u$Inserts$u$, 5, $u$[{"name": "PENTA D-R/L-J", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3851&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentaiqgrip_use_6', $u$Pentagonal Inserts for Parting and Grooving Bearing Steel and Other Ductile Materials$u$, $u$Inserts$u$, 6, $u$[{"name": "PENTA D-N-PB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3875&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_pentaiqgrip_use_7', $u$Pentagonal Inserts for Parting Bearing Steel and other Ductile Materials$u$, $u$Inserts$u$, 7, $u$[{"name": "PENTA D-R/L-PB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3876&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'PENTAIQGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- ISCAR-BROACH
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_iscarbroach', 'ISCAR-BROACH', 'Grooving & parting', $u$ISCAR-BROACH: grooving tools and inserts from the ISCAR turning catalog, such as broaching Holders for Lathe and Milling Machines.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARBROACH')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$ISCAR-BROACH: grooving tools and inserts from the ISCAR turning catalog, such as broaching Holders for Lathe and Milling Machines.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARBROACH' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('grooving') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARBROACH'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_iscarbroach_use_0', $u$Broaching Holders for Lathe and Milling Machines$u$, $u$Toolholders$u$, 0, $u$[{"name": "SXCIB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3218&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarbroach_use_1', $u$DIN138 (Tolerance C11) Inserts for Keyway Broaching on Lathe and Milling Machines$u$, $u$Inserts$u$, 1, $u$[{"name": "XNUWB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3221&mapp=TG&GFSTYP=M"}, {"name": "SCB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3225&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarbroach_use_2', $u$DIN6885 Inserts for Light Fit (JS9) Keyway Broaching on Lathe and Milling Machines$u$, $u$Inserts$u$, 2, $u$[{"name": "XNUWB (light fit)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3222&mapp=TG&GFSTYP=M"}, {"name": "SCB (light fit)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3226&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarbroach_use_3', $u$DIN6885 Inserts for Tight Fit (P9) Keyway Broaching on Lathe and Milling Machines$u$, $u$Inserts$u$, 3, $u$[{"name": "XNUWB (tight fit)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3223&mapp=TG&GFSTYP=M"}, {"name": "SCB (tight fit)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3227&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARBROACH'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- FIX-GRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_fixgrip', 'FIX-GRIP', 'Grooving & parting', $u$FIX-GRIP: groove-turn tools and inserts from the ISCAR turning catalog, such as double-Ended Precision Inserts for Machining Aluminum at Medium-to-High Feeds, Cut Arcs to 250°.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'FIXGRIP')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$FIX-GRIP: groove-turn tools and inserts from the ISCAR turning catalog, such as double-Ended Precision Inserts for Machining Aluminum at Medium-to-High Feeds, Cut Arcs to 250°.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'FIXGRIP' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('grooveturn', 'profiling') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'FIXGRIP'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_fixgrip_use_0', $u$Double-Ended Precision Inserts for Machining Aluminum at Medium-to-High Feeds, Cut Arcs to 250°$u$, $u$Inserts$u$, 0, $u$[{"name": "FGPA", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1564&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_fixgrip_use_1', $u$Double-Ended Full Radius Utility Inserts, for Machining Aluminum at Medium-to-High Feeds, Cut Arcs to 250°$u$, $u$Inserts$u$, 1, $u$[{"name": "FGMA", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2029&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_fixgrip_use_2', $u$Full Radius Precision Inserts for Machining Aluminum at Medium to High Feeds$u$, $u$Inserts$u$, 2, $u$[{"name": "FSPA/FSMA", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3196&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_fixgrip_use_3', $u$V-Shaped Inserts for Machining Aluminum Wheels$u$, $u$Inserts$u$, 3, $u$[{"name": "FGPAM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3229&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_fixgrip_use_4', $u$Tools for Interrupted Cuts and Back Turning of Aluminum Wheels$u$, $u$Toolholders$u$, 4, $u$[{"name": "FGHR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1565&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_fixgrip_use_5', $u$Tools with a Very Strong Insert Grip for Interrupted Cuts and Back Turning Aluminum Wheels$u$, $u$Toolholders$u$, 5, $u$[{"name": "FSHDR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3194&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_fixgrip_use_6', $u$Tools for Interrupted Cuts and Back Turning Aluminum Wheels$u$, $u$Toolholders$u$, 6, $u$[{"name": "FGHDUR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3228&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_fixgrip_use_7', $u$8° / 10° Approach Angle Bars, for Interrupted Cuts and Back Turning on Aluminum$u$, $u$Boring bars$u$, 7, $u$[{"name": "FGHIFR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1767&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_fixgrip_use_8', $u$15° Approach Angle Bars, for Interrupted Cuts and Back Turning on Aluminum$u$, $u$Boring bars$u$, 8, $u$[{"name": "FGHIUR-C-15A-8", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2028&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_fixgrip_use_9', $u$10° / 15° Approach Angle Bars for Facing and Internal Profiling of Aluminum$u$, $u$Boring bars$u$, 9, $u$[{"name": "FSHIUR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3197&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_fixgrip_use_10', $u$CUT-GRIP Heads with Dovetail Connection for External Turning Aluminum Wheels$u$, $u$Tools$u$, 10, $u$[{"name": "DTF50 FSHDR-8", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4685&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_fixgrip_use_11', $u$CUT-GRIP Heads for Internal Profiling, Undercutting and Facing of Aluminum Wheels$u$, $u$Tools$u$, 11, $u$[{"name": "DTF50 FSHIUR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4686&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'FIXGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- ISCAR-PARTING
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_iscarparting', 'ISCAR-PARTING', 'Grooving & parting', $u$ISCAR-PARTING: parting tools and inserts from the ISCAR turning catalog, such as narrow Material Cost Saving Inserts for Grooving and Parting up to 20 mm Bar Diameters.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARPARTING')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$ISCAR-PARTING: parting tools and inserts from the ISCAR turning catalog, such as narrow Material Cost Saving Inserts for Grooving and Parting up to 20 mm Bar Diameters.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARPARTING' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARPARTING'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_iscarparting_use_0', $u$Narrow Material Cost Saving Inserts for Grooving and Parting up to 20 mm Bar Diameters$u$, $u$Boring bars$u$, 0, $u$[{"name": "BGM N-J", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4120&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarparting_use_1', $u$Narrow Material Cost Saving Inserts for Parting up to 20 mm Bar Diameters$u$, $u$Boring bars$u$, 1, $u$[{"name": "BGM R/L-J", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4121&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscarparting_use_2', $u$Integral Shank Parting and Grooving Tools with Coolant Channels Carrying Narrow Inserts for Parting up to 20 mm Bars$u$, $u$Boring bars$u$, 2, $u$[{"name": "BGTR/L-B-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4122&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARPARTING'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- TANG-GRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_tanggrip', 'TANG-GRIP', 'Grooving & parting', $u$TANG-GRIP: grooving tools and inserts from the ISCAR turning catalog, such as single-Ended Inserts for Parting, Grooving and Slitting Bars, Hard Materials and Tough Applications.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TANGGRIP')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$TANG-GRIP: grooving tools and inserts from the ISCAR turning catalog, such as single-Ended Inserts for Parting, Grooving and Slitting Bars, Hard Materials and Tough Applications.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TANGGRIP' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving', 'facegrooving') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TANGGRIP'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_tanggrip_use_0', $u$Single-Ended Inserts for Parting, Grooving and Slitting Bars, Hard Materials and Tough Applications$u$, $u$Boring bars$u$, 0, $u$[{"name": "TAG N-C/W/M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2334&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_1', $u$Single-Ended Inserts for Parting Bars, Hard Materials and Tough Parting Applications$u$, $u$Boring bars$u$, 1, $u$[{"name": "TAG R/L-C", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2393&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_2', $u$Single-Ended Inserts for Parting, Grooving and Slitting Soft Materials$u$, $u$Inserts$u$, 2, $u$[{"name": "TAG N-J/JS/JT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2335&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_3', $u$TANG-GRIP Inserts for Parting Soft Materials, Tubes, Small Diameters and Thin-Walled Parts$u$, $u$Inserts$u$, 3, $u$[{"name": "TAG R/L-J/JS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2394&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_4', $u$Single-Sided Inserts for Parting, Grooving & Slitting at Low Feeds on Cr-Ni Alloys, Ductile Materials & Low Carbon Steel$u$, $u$Inserts$u$, 4, $u$[{"name": "TAG N-UT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2960&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_5', $u$Single-Ended Inserts for Parting, Grooving, and Slitting Aluminum$u$, $u$Inserts$u$, 5, $u$[{"name": "TAG N-A", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3011&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_6', $u$Face Grooving Single-Ended Inserts for Machining Stainless Steel and High Temperature Alloys$u$, $u$Inserts$u$, 6, $u$[{"name": "TNF-M-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3313&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_7', $u$Single-Ended Inserts for Parting, Grooving and Slitting Stainless Steel$u$, $u$Inserts$u$, 7, $u$[{"name": "TAG N-LF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3480&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_8', $u$Single-Ended Inserts for Parting Grooving and Slitting Stainless and Alloy Steel at Medium Feed$u$, $u$Inserts$u$, 8, $u$[{"name": "TAG N-MF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3483&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_9', $u$Face Grooving Single-Ended Inserts for Machining Steel$u$, $u$Inserts$u$, 9, $u$[{"name": "TNF-P-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3487&mapp=TG&GFSTYP=M"}, {"name": "TNF GN-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4617&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_10', $u$Grooving and Slitting full radius inserts$u$, $u$Inserts$u$, 10, $u$[{"name": "TAG N-C (full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5437&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_11', $u$Single-Ended Inserts for Parting and Grooving, suitable for Ductile Materials, Steel and Stainless Steel$u$, $u$Inserts$u$, 11, $u$[{"name": "TAG N-T", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5455&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_12', $u$Parting and Grooving Adapters Carrying TANG-GRIP Tangentially Clamped Inserts$u$, $u$Adapters & blocks$u$, 12, $u$[{"name": "TGAD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2444&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_13', $u$Intermediate Serrated Cartridge for Standard TANG FACE TNFPAD-XL R Adapters$u$, $u$Adapters & blocks$u$, 13, $u$[{"name": "IH-TNFPAD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4522&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_14', $u$Y-Axis Adapters for Parting & Grooving on Multi-Task Machines & Turning Centers with JHP Channels and TANG-GRIP Inserts$u$, $u$Adapters & blocks$u$, 14, $u$[{"name": "TAGPAD-Y-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4591&mapp=TG&GFSTYP=M"}, {"name": "TAGPAD-XL-Y-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5667&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_15', $u$Single- and Double-Ended Parting and Grooving Reinforced Blades Carrying TANG-GRIP Tangentially Clamped Inserts$u$, $u$Blades$u$, 15, $u$[{"name": "TGFHR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2447&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_16', $u$Blades for Multi-Spindle Machines - Replacement for HSS and Brazed Tools$u$, $u$Blades$u$, 16, $u$[{"name": "TGFS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2484&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_17', $u$Parting and Grooving Blades for Other Manufacturers Blocks$u$, $u$Blades$u$, 17, $u$[{"name": "TGFH-MB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2718&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_18', $u$Reinforced Blades for TRAUB and Index Machines Carrying TANG-GRIP Tangentially Clamped Inserts$u$, $u$Blades$u$, 18, $u$[{"name": "TGFHL-TR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2949&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_19', $u$Parting and Grooving Single-Sided Blades Carrying TANG-GRIP Inserts$u$, $u$Blades$u$, 19, $u$[{"name": "TGFH-S", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3161&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_20', $u$Parting and Grooving Blades with Channels for Low and High-Pressure Coolant Carrying TANG-GRIP Inserts$u$, $u$Blades$u$, 20, $u$[{"name": "TGFH-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3190&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_21', $u$Face Grooving Blades$u$, $u$Blades$u$, 21, $u$[{"name": "TNFFH-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3314&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_22', $u$Reinforced Face Grooving Blades$u$, $u$Blades$u$, 22, $u$[{"name": "TNFFA-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3315&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_23', $u$Parting and Grooving Reinforced Blades with Channels for High-Pressure Coolant Carrying TANG-GRIP Inserts$u$, $u$Blades$u$, 23, $u$[{"name": "TGFHR/L-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3740&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_24', $u$Each Kit Contains One Parting and Grooving Blade, 10 TANG-GRIP Single-Ended Inserts and an Extractor$u$, $u$Kits$u$, 24, $u$[{"name": "KIT TGFH", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2813&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_25', $u$Parting and Grooving Tools with Channels for High-Pressure Coolant Carrying TANG-GRIP Inserts$u$, $u$Toolholders$u$, 25, $u$[{"name": "TGTR/L-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3189&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggrip_use_26', $u$Parting and Grooving Toolholders with Bottom Inlets for High-Pressure Coolant Carrying TANG-GRIP Inserts$u$, $u$Toolholders$u$, 26, $u$[{"name": "TGTR/L-JHP-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4167&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TANGGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- TANG-GRIP-IQ
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_tanggripiq', 'TANG-GRIP-IQ', 'Grooving & parting', $u$TANG-GRIP-IQ: parting tools and inserts from the ISCAR turning catalog, such as integral Shank TANG-GRIP Toolholders for Parting and Grooving.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TANGGRIPIQ')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$TANG-GRIP-IQ: parting tools and inserts from the ISCAR turning catalog, such as integral Shank TANG-GRIP Toolholders for Parting and Grooving.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TANGGRIPIQ' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TANGGRIPIQ'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_tanggripiq_use_0', $u$Integral Shank TANG-GRIP Toolholders for Parting and Grooving$u$, $u$Toolholders$u$, 0, $u$[{"name": "TGTR/L-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2274&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggripiq_use_1', $u$Integral Shank Short-Head TANG-GRIP Toolholders for Parting and Grooving$u$, $u$Toolholders$u$, 1, $u$[{"name": "TGTR/L-2T..SH-L120", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3088&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggripiq_use_2', $u$Integral Shank TANG-GRIP Toolholders with 2 Pockets for Parting and Grooving$u$, $u$Toolholders$u$, 2, $u$[{"name": "TGTR/L-IQ-2Z", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3526&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggripiq_use_3', $u$Parting and Grooving Flat Top Blades with Tangential Pockets Carrying TANG-GRIP Single-Ended Inserts$u$, $u$Blades$u$, 3, $u$[{"name": "TGSU", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2848&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tanggripiq_use_4', $u$Integral Shank TANG-GRIP Toolholders with Reinforced Blades for Parting and Grooving Mainly Sub-Spindle Machines$u$, $u$Blades$u$, 4, $u$[{"name": "TGTR/L-D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3201&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TANGGRIPIQ'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- MODU-GRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_modugrip', 'MODU-GRIP', 'Grooving & parting', $u$MODU-GRIP: parting tools and inserts from the ISCAR turning catalog, such as parting and Grooving Adapters with Channels for High-Pressure Coolant Carrying TANG-GRIP Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MODUGRIP')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$MODU-GRIP: parting tools and inserts from the ISCAR turning catalog, such as parting and Grooving Adapters with Channels for High-Pressure Coolant Carrying TANG-GRIP Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MODUGRIP' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving', 'grooveturn') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MODUGRIP'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_modugrip_use_0', $u$Parting and Grooving Adapters with Channels for High-Pressure Coolant Carrying TANG-GRIP Inserts$u$, $u$Adapters & blocks$u$, 0, $u$[{"name": "TGAD RE/LE-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4243&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_modugrip_use_1', $u$Parting and Grooving Adapters with Channels for High-Pressure Coolant Carrying DO-GRIP Inserts$u$, $u$Adapters & blocks$u$, 1, $u$[{"name": "D/HGAD RE/LE-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4244&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_modugrip_use_2', $u$Parting and Grooving Adapters with Channels for High-Pressure Coolant Carrying PENTA 24 Inserts$u$, $u$Adapters & blocks$u$, 2, $u$[{"name": "PCAD RE/LE-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4246&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MODUGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- FEED-GRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_feedgrip', 'FEED-GRIP', 'Grooving & parting', $u$FEED-GRIP: parting tools and inserts from the ISCAR turning catalog, such as single-Ended Inserts for High Feed Parting and Grooving, Hard Materials and Tough Applications.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'FEEDGRIP')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$FEED-GRIP: parting tools and inserts from the ISCAR turning catalog, such as single-Ended Inserts for High Feed Parting and Grooving, Hard Materials and Tough Applications.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'FEEDGRIP' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'FEEDGRIP'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_feedgrip_use_0', $u$Single-Ended Inserts for High Feed Parting and Grooving, Hard Materials and Tough Applications$u$, $u$Inserts$u$, 0, $u$[{"name": "TAG N-HF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4304&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'FEEDGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- LOGIQ-F-GRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_logiqfgrip', 'LOGIQ-F-GRIP', 'Grooving & parting', $u$LOGIQ-F-GRIP: parting tools and inserts from the ISCAR turning catalog, such as tool Blocks for Square TANG-F-GRIP and DO-F-GRIP Parting and Grooving Adapters for High-Pressure Coolant.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQFGRIP')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$LOGIQ-F-GRIP: parting tools and inserts from the ISCAR turning catalog, such as tool Blocks for Square TANG-F-GRIP and DO-F-GRIP Parting and Grooving Adapters for High-Pressure Coolant.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQFGRIP' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving', 'grooveturn') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQFGRIP'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_logiqfgrip_use_0', $u$Tool Blocks for Square TANG-F-GRIP and DO-F-GRIP Parting and Grooving Adapters for High-Pressure Coolant$u$, $u$Adapters & blocks$u$, 0, $u$[{"name": "TGTBQ-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4447&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiqfgrip_use_1', $u$Y-Axis Intermediate Prismatic Holders for Square JHP Adapters on Multi-Task Machines for Parting and Grooving$u$, $u$Adapters & blocks$u$, 1, $u$[{"name": "TGTBY-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4515&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiqfgrip_use_2', $u$Intermediate Holders for TANG-F-GRIP and DO-F-GRIP Square Type D82 Adapters Designed for Modular Tooling Systems$u$, $u$Adapters & blocks$u$, 2, $u$[{"name": "V## SQ#-#-D82-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4615&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiqfgrip_use_3', $u$Tool Blocks which Mount Square Adapters with Three High-Pressure Coolant Inlets for Parting and Grooving$u$, $u$Adapters & blocks$u$, 3, $u$[{"name": "TGTBQ-JHP-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4655&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_logiqfgrip_use_4', $u$Tool Blocks for Square F-GRIP Parting and Grooving Adapters with High-Pressure Coolant for Machining next to Spindle$u$, $u$Adapters & blocks$u$, 4, $u$[{"name": "TGTBQ-JHP-RIB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4796&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQFGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- TANG-F-GRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_tangfgrip', 'TANG-F-GRIP', 'Grooving & parting', $u$TANG-F-GRIP: parting tools and inserts from the ISCAR turning catalog, such as parting and Grooving Square Adapters with Internal Coolant Holes Carrying TANG-GRIP Tangentially Clamped Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TANGFGRIP')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$TANG-F-GRIP: parting tools and inserts from the ISCAR turning catalog, such as parting and Grooving Square Adapters with Internal Coolant Holes Carrying TANG-GRIP Tangentially Clamped Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TANGFGRIP' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TANGFGRIP'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_tangfgrip_use_0', $u$Parting and Grooving Square Adapters with Internal Coolant Holes Carrying TANG-GRIP Tangentially Clamped Inserts$u$, $u$Adapters & blocks$u$, 0, $u$[{"name": "TGAQ-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4451&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_tangfgrip_use_1', $u$Parting and Grooving Square Adapters Carrying TANG-GRIP Tangentially Clamped Inserts$u$, $u$Adapters & blocks$u$, 1, $u$[{"name": "TGAQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4542&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TANGFGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- DO-F-GRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_dofgrip', 'DO-F-GRIP', 'Grooving & parting', $u$DO-F-GRIP: parting tools and inserts from the ISCAR turning catalog, such as parting and Grooving Square Adapters with Internal Coolant Holes Carrying DO-GRIP Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'DOFGRIP')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$DO-F-GRIP: parting tools and inserts from the ISCAR turning catalog, such as parting and Grooving Square Adapters with Internal Coolant Holes Carrying DO-GRIP Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'DOFGRIP' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'DOFGRIP'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_dofgrip_use_0', $u$Parting and Grooving Square Adapters with Internal Coolant Holes Carrying DO-GRIP Inserts$u$, $u$Adapters & blocks$u$, 0, $u$[{"name": "DGAQ-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4450&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_dofgrip_use_1', $u$Parting and Grooving Square Adapters Carrying DO-GRIP Inserts$u$, $u$Adapters & blocks$u$, 1, $u$[{"name": "DGAQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4543&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'DOFGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- JET-CROWN
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_jetcrown', 'JET-CROWN', 'Grooving & parting', $u$JET-CROWN: parting tools and inserts from the ISCAR turning catalog, such as parting and Grooving Square Adapters Compatible with TANG-GRIP Inserts (Single-Ended).$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'JETCROWN')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$JET-CROWN: parting tools and inserts from the ISCAR turning catalog, such as parting and Grooving Square Adapters Compatible with TANG-GRIP Inserts (Single-Ended).$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'JETCROWN' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving', 'grooveturn') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'JETCROWN'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_jetcrown_use_0', $u$Parting and Grooving Square Adapters Compatible with TANG-GRIP Inserts (Single-Ended)$u$, $u$Adapters & blocks$u$, 0, $u$[{"name": "TGAQ-ECD (JET-CROWN)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4672&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_jetcrown_use_1', $u$Tool Blocks for Square TANG-F-GRIP (TGAQ-ECD) Parting and Grooving Adapters for High-Pressure Coolant$u$, $u$Adapters & blocks$u$, 1, $u$[{"name": "TGTBQ-ECD-JHP (JET-CROWN)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4673&mapp=TG&GFSTYP=M"}, {"name": "TGTBQ-JHP-ECD-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5472&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_jetcrown_use_2', $u$Intermediate Holders for TANG-F-GRIP (TGAQ-ECD) Square D65 Adapters Designed for Modular Tooling Systems$u$, $u$Adapters & blocks$u$, 2, $u$[{"name": "V## SQ#-#-D65-ECD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4840&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'JETCROWN'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- TANG-5-GRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_tang5grip', 'TANG-5-GRIP', 'Grooving & parting', $u$TANG-5-GRIP: parting tools and inserts from the ISCAR turning catalog, such as parting and Grooving Adapters with 5 Pockets for TANG-GRIP Tangentially Clamped Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TANG5GRIP')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$TANG-5-GRIP: parting tools and inserts from the ISCAR turning catalog, such as parting and Grooving Adapters with 5 Pockets for TANG-GRIP Tangentially Clamped Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'TANG5GRIP' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TANG5GRIP'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_tang5grip_use_0', $u$Parting and Grooving Adapters with 5 Pockets for TANG-GRIP Tangentially Clamped Inserts$u$, $u$Adapters & blocks$u$, 0, $u$[{"name": "ADMP D45", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4218&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'TANG5GRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- HELIFACE
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_heliface', 'HELIFACE', 'Grooving & parting', $u$HELIFACE: face grooving tools and inserts from the ISCAR turning catalog, such as adapters for External Facing Along Shafts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELIFACE')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$HELIFACE: face grooving tools and inserts from the ISCAR turning catalog, such as adapters for External Facing Along Shafts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'HELIFACE' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('facegrooving') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELIFACE'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_heliface_use_0', $u$Adapters for External Facing Along Shafts$u$, $u$Adapters & blocks$u$, 0, $u$[{"name": "HFAER/L-5T, 6T", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=245&mapp=TG&GFSTYP=M"}, {"name": "HGAER/L-3", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=883&mapp=TG&GFSTYP=M"}, {"name": "HFAER/L-4", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=886&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliface_use_1', $u$Cartridges for Face Grooving and Turning$u$, $u$Adapters & blocks$u$, 1, $u$[{"name": "CR HFIR-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=755&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliface_use_2', $u$Adapters for Internal Face Grooving and Turning$u$, $u$Adapters & blocks$u$, 2, $u$[{"name": "HGAIR/L-3", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=882&mapp=TG&GFSTYP=M"}, {"name": "HFAIR/L-4", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=887&mapp=TG&GFSTYP=M"}, {"name": "HFAIR/L-DG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1010&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliface_use_3', $u$Intermediate Serrated Cartridge for standard HELI-FACE HFAIR Adapters.$u$, $u$Adapters & blocks$u$, 3, $u$[{"name": "IH-HFAIR", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4521&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliface_use_4', $u$Intermediate Serrated Cartridge for Standard HFPAD R Adapters$u$, $u$Adapters & blocks$u$, 4, $u$[{"name": "IH-HFPAD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4618&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliface_use_5', $u$Blades for Face Machining$u$, $u$Blades$u$, 5, $u$[{"name": "HFFR/L-T", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=247&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliface_use_6', $u$Face Grooving Blades$u$, $u$Blades$u$, 6, $u$[{"name": "HFFH", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3536&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliface_use_7', $u$Reinforced Face Grooving Blades$u$, $u$Blades$u$, 7, $u$[{"name": "HFFA", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3538&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliface_use_8', $u$Perpendicular Toolholders for Shallow Face Grooving$u$, $u$Toolholders$u$, 8, $u$[{"name": "HFHPR/L-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=248&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliface_use_9', $u$Integral Holders for Facing$u$, $u$Toolholders$u$, 9, $u$[{"name": "HFHR/L-3T", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=249&mapp=TG&GFSTYP=M"}, {"name": "HFHR/L-4T", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=250&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliface_use_10', $u$Integral Toolholders for External Facing$u$, $u$Toolholders$u$, 10, $u$[{"name": "HFHR/L-5T", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=251&mapp=TG&GFSTYP=M"}, {"name": "HFHR/L-6T", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=252&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliface_use_11', $u$Toolholders for Shallow Face Grooving$u$, $u$Toolholders$u$, 11, $u$[{"name": "HFHR/L-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=253&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliface_use_12', $u$Tools for Internal Grooving and Turning with ISO 26622-1(*) Tapered Shank$u$, $u$Toolholders$u$, 12, $u$[{"name": "IM-HFIR-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=756&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliface_use_13', $u$Integral Holders for Face Grooving and Turning$u$, $u$Toolholders$u$, 13, $u$[{"name": "HGHR/L-3", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=963&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliface_use_14', $u$Boring Bars for Internal Grooving and Turning$u$, $u$Boring bars$u$, 14, $u$[{"name": "HFIR/L-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=254&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliface_use_15', $u$Utility Double-Ended Face Machining Inserts$u$, $u$Inserts$u$, 15, $u$[{"name": "HFPR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=255&mapp=TG&GFSTYP=M"}, {"name": "HFPN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3535&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_heliface_use_16', $u$Utility Double-Ended Full Radius Face Machining Inserts$u$, $u$Inserts$u$, 16, $u$[{"name": "HFPR/L (full radius)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2556&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'HELIFACE'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- SELF-GRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_selfgrip', 'SELF-GRIP', 'Grooving & parting', $u$SELF-GRIP: grooving tools and inserts from the ISCAR turning catalog, such as face Grooving Inserts.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SELFGRIP')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$SELF-GRIP: grooving tools and inserts from the ISCAR turning catalog, such as face Grooving Inserts.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SELFGRIP' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting', 'grooving', 'facegrooving') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SELFGRIP'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_selfgrip_use_0', $u$Face Grooving Inserts$u$, $u$Inserts$u$, 0, $u$[{"name": "GFF-R/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=155&mapp=TG&GFSTYP=M"}, {"name": "GFF-N", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2803&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_selfgrip_use_1', $u$Parting & Grooving Single-Ended Insert for Soft Materials, Parting of Tubes, Small Diameters and Thin-Walled Parts$u$, $u$Inserts$u$, 1, $u$[{"name": "GFN-J", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2288&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_selfgrip_use_2', $u$Parting & Grooving Single-Ended Insert, Central Ridged Chipformer for Steel$u$, $u$Inserts$u$, 2, $u$[{"name": "GFN-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2289&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_selfgrip_use_3', $u$Parting & Grooving Single-Ended Insert, for Parting Aluminum$u$, $u$Inserts$u$, 3, $u$[{"name": "GFN-A", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2291&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_selfgrip_use_4', $u$Parting & Grooving Single-Ended Insert, for Low Feeds on Cr-Ni Alloys and Low Carbon Steel$u$, $u$Inserts$u$, 4, $u$[{"name": "GFN-U", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2292&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_selfgrip_use_5', $u$Single-Ended Parting Insert, for Soft Materials, Parting of Tubes, Small Diameters and Thin-Walled Parts$u$, $u$Inserts$u$, 5, $u$[{"name": "GFR/L-J", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2293&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_selfgrip_use_6', $u$Single-Ended Parting Insert, Central Ridged Chipformer, for Steel and Stainless Steel$u$, $u$Inserts$u$, 6, $u$[{"name": "GFR/L-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2294&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_selfgrip_use_7', $u$Parting & Grooving, Single-Ended Insert, for Parting Bars, Hard Materials and Tough Applications$u$, $u$Boring bars$u$, 7, $u$[{"name": "GFN-C", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=157&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_selfgrip_use_8', $u$Single-Ended Parting Insert, for Parting Bars, Hard Materials and Tough Applications$u$, $u$Boring bars$u$, 8, $u$[{"name": "GFR/L-C", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=158&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_selfgrip_use_9', $u$Internal Grooving Blades, for GHIC...-70 Bars$u$, $u$Boring bars$u$, 9, $u$[{"name": "SGFH 26-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=370&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_selfgrip_use_10', $u$Parting & Grooving Single-Ended Insert, for Parting Nonferrous Bars$u$, $u$Boring bars$u$, 10, $u$[{"name": "GFN-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2290&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_selfgrip_use_11', $u$SELF-GRIP Integral Shank Tool for Swiss Automatic Machines$u$, $u$Toolholders$u$, 11, $u$[{"name": "SGAFR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=359&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_selfgrip_use_12', $u$Face Grooving Integral Shank Tools$u$, $u$Toolholders$u$, 12, $u$[{"name": "SGFFR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=365&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_selfgrip_use_13', $u$SELF-GRIP, Integral Shank Tool for Parting and Grooving$u$, $u$Toolholders$u$, 13, $u$[{"name": "SGTFR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=387&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_selfgrip_use_14', $u$SELF-GRIP, Reinforced Tool for Parting and Grooving$u$, $u$Toolholders$u$, 14, $u$[{"name": "SGTFR/L-D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=388&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_selfgrip_use_15', $u$Integral Shank, Short Head, Parting and Grooving Toolholder, for CNC and Swiss Automatics$u$, $u$Toolholders$u$, 15, $u$[{"name": "SGFR/L-B-D-SH", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1005&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_selfgrip_use_16', $u$Single-Sided Blades for SELF-GRIP Parting & Grooving Inserts$u$, $u$Blades$u$, 16, $u$[{"name": "SGB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=361&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_selfgrip_use_17', $u$Reinforced Face Grooving Blades for Standard Tool Blocks$u$, $u$Blades$u$, 17, $u$[{"name": "SGFFA", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=363&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_selfgrip_use_18', $u$Face Grooving Blades$u$, $u$Blades$u$, 18, $u$[{"name": "SGFFH", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=364&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_selfgrip_use_19', $u$Parting and Grooving Four-Pocket Blades$u$, $u$Blades$u$, 19, $u$[{"name": "SGFH (four-pockets)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=372&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_selfgrip_use_20', $u$SELF-GRIP Blades with and without Coolant Holes for Parting and Grooving with Single-Ended Inserts$u$, $u$Blades$u$, 20, $u$[{"name": "SGFH/R/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=373&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_selfgrip_use_21', $u$SELF-GRIP F-Type, Double- and Single-Ended, Reinforced Holder Blades$u$, $u$Blades$u$, 21, $u$[{"name": "SGFHR/L-26T/32T", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=374&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_selfgrip_use_22', $u$Replacement SELF-GRIP Blades for HSS and Brazed Parting Tools$u$, $u$Blades$u$, 22, $u$[{"name": "SGFS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=376&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SELFGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- PICCO-MFT
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_piccomft', 'PICCO-MFT', 'Turning', $u$PICCO-MFT: turning for swiss-type tools and inserts from the ISCAR turning catalog, such as solid Carbide Tools for Drilling, Facing, Internal / External Turning and Threading on Swiss and Small CNC Machines.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'PICCOMFT')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$PICCO-MFT: turning for swiss-type tools and inserts from the ISCAR turning catalog, such as solid Carbide Tools for Drilling, Facing, Internal / External Turning and Threading on Swiss and Small CNC Machines.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'PICCOMFT' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('threading', 'turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'PICCOMFT'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_piccomft_use_0', $u$Solid Carbide Tools for Drilling, Facing, Internal / External Turning and Threading on Swiss and Small CNC Machines$u$, $u$Solid tools$u$, 0, $u$[{"name": "PICCO-MFT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1865&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'PICCOMFT'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- QUICK-THREAD
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_quickthread', 'QUICK-THREAD', 'Threading', $u$QUICK-THREAD: threading tools and inserts from the ISCAR turning catalog, such as external ISO Metric (DIN13 12-1986 class: 6g) Laydown Threading Inserts for General Applications.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKTHREAD')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$QUICK-THREAD: threading tools and inserts from the ISCAR turning catalog, such as external ISO Metric (DIN13 12-1986 class: 6g) Laydown Threading Inserts for General Applications.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKTHREAD' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('threading') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKTHREAD'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_quickthread_use_0', $u$External ISO Metric (DIN13 12-1986 class: 6g) Laydown Threading Inserts for General Applications$u$, $u$Inserts$u$, 0, $u$[{"name": "ER-ISO 3M-Q", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5322&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickthread_use_1', $u$Internal ISO Metric (DIN13 12-1986 class 6H) Laydown Threading Inserts for General Applications$u$, $u$Inserts$u$, 1, $u$[{"name": "IR-ISO 3M-Q", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5323&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickthread_use_2', $u$External NPT (National Pipe Threads) Full Profile Laydown Threading Inserts for Steam, Gas and Water Pipes$u$, $u$Inserts$u$, 2, $u$[{"name": "ER-NPT 3M-Q", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5324&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickthread_use_3', $u$Internal NPT (National Pipe Threads) Full Profile Laydown Threading Inserts for Steam, Gas and Water Pipes$u$, $u$Inserts$u$, 3, $u$[{"name": "IR-NPT 3M-Q", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5325&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickthread_use_4', $u$External Whitworth (BSW, BSF, BSP) B.S.84-1956 DIN 259 Medium Class Full Profile Laydown Threading Inserts$u$, $u$Inserts$u$, 4, $u$[{"name": "ER-W 3M-Q", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5326&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_quickthread_use_5', $u$Internal American UN Full Profile (UN, UNC, UNF, UNEF) Laydown Threading Inserts for General Applications$u$, $u$Inserts$u$, 5, $u$[{"name": "IR-UN 3M-Q", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5327&mapp=TH&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICKTHREAD'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- NOTCH-GRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_notchgrip', 'NOTCH-GRIP', 'Threading', $u$NOTCH-GRIP: threading tools and inserts from the ISCAR turning catalog, such as double-Ended Precision Grooving Inserts with a Chipformer.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'NOTCHGRIP')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$NOTCH-GRIP: threading tools and inserts from the ISCAR turning catalog, such as double-Ended Precision Grooving Inserts with a Chipformer.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'NOTCHGRIP' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('grooving', 'grooveturn', 'profiling', 'threading') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'NOTCHGRIP'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_notchgrip_use_0', $u$Double-Ended Precision Grooving Inserts with a Chipformer$u$, $u$Inserts$u$, 0, $u$[{"name": "ING-RCB/LCB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3470&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_1', $u$Precision Double-Ended Flat Top Grooving Inserts$u$, $u$Inserts$u$, 1, $u$[{"name": "ING/INGP-R/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3471&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_2', $u$Precision Double-Ended Flat Top Round Grooving Inserts$u$, $u$Inserts$u$, 2, $u$[{"name": "INR/INRP-R/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3472&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_3', $u$Double-Ended Precision Full Radius Grooving Inserts with a Chipformer$u$, $u$Inserts$u$, 3, $u$[{"name": "INR-RCB/LCB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3825&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_4', $u$Single-Ended Precision Deep Grooving Inserts with a Chipformer$u$, $u$Inserts$u$, 4, $u$[{"name": "INGD-RCB/LCB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3828&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_5', $u$Precision, Single-Ended Flat Top Deep Grooving Inserts$u$, $u$Inserts$u$, 5, $u$[{"name": "INGD-R/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3829&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_6', $u$Precision, Double-Ended Flat Top Deep Grooving Inserts$u$, $u$Inserts$u$, 6, $u$[{"name": "INGT-R/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3830&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_7', $u$Precision, Single-Ended Full Radius Deep Grooving Inserts with a Flat Rake$u$, $u$Inserts$u$, 7, $u$[{"name": "INRD-R/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3831&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_8', $u$Precision Double-Ended Flat Top Inserts for External Undercutting$u$, $u$Inserts$u$, 8, $u$[{"name": "INU-R/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3834&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_9', $u$Double-Ended, Precision, Flat Top Threading Inserts$u$, $u$Inserts$u$, 9, $u$[{"name": "STUB ACME THREADING FLAS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3968&mapp=TH&GFSTYP=M"}, {"name": "API BUTTRESS THREADING FLDC-B-E", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3973&mapp=TH&GFSTYP=M"}, {"name": "API THREADING FLDC-E", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3975&mapp=TH&GFSTYP=M"}, {"name": "API ROUND THREADING FLDC-RD-75", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3976&mapp=TH&GFSTYP=M"}, {"name": "NPT THREADING FLDC-V-75", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3979&mapp=TH&GFSTYP=M"}, {"name": "UNJ THREADING FLJ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3981&mapp=TH&GFSTYP=M"}, {"name": "API BUTTRESS THREADING FLDC-B-I", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3993&mapp=TH&GFSTYP=M"}, {"name": "API THREADING FLDC-I", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3994&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_10', $u$Double-Ended, Precision, Flat Top External Threading Inserts$u$, $u$Inserts$u$, 10, $u$[{"name": "ACME THREADING FLA-PT-E", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3969&mapp=TH&GFSTYP=M"}, {"name": "STUB ACME THREADING FLAS-PT-E", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3970&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_11', $u$Double-Ended, Precision, Flat Top Threading Inserts for 7° Lead$u$, $u$Inserts$u$, 11, $u$[{"name": "AMERICAN STANDARD BUTTRESS THREADING FLTB-A", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3971&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_12', $u$Double-Ended, Precision, Flat Top Threading Inserts for 45° Lead$u$, $u$Inserts$u$, 12, $u$[{"name": "AMERICAN STANDARD BUTTRESS THREADING FLTB-B", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3972&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_13', $u$Double-Ended, Precision, Flat Top Partial Profile Threading Inserts$u$, $u$Inserts$u$, 13, $u$[{"name": "API PARTIAL PROFILE THREADING FLD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3974&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_14', $u$Double-Ended, Precision, Threading Inserts with a Chipbreaker$u$, $u$Inserts$u$, 14, $u$[{"name": "API ROUND THREADING FLDC-RD-75-CB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3977&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_15', $u$Double-Ended Precision, Flat Top Multi-Tooth Threading Inserts$u$, $u$Inserts$u$, 15, $u$[{"name": "API ROUND THREADING FLDC-RD-75M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3978&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_16', $u$Double-Ended, Precision, Flat Top Multi-Tooth Threading Inserts$u$, $u$Inserts$u$, 16, $u$[{"name": "NPT THREADING FLDC-NPT-E", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3980&mapp=TH&GFSTYP=M"}, {"name": "NPT THREADING FLDC-NPT-I", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3995&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_17', $u$Double-Ended, Precision Threading Inserts with a Positive Rake$u$, $u$Inserts$u$, 17, $u$[{"name": "UNJ THREADING FLJP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3982&mapp=TH&GFSTYP=M"}, {"name": "UNJ THREADING FLJK", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3984&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_18', $u$Double-Ended, Precision Flat Top Threading Inserts$u$, $u$Inserts$u$, 18, $u$[{"name": "UNJ THREADING FLJF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3983&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_19', $u$Double-Ended, Precision, Flat Top Full Profile Threading Inserts$u$, $u$Inserts$u$, 19, $u$[{"name": "UN THREADING FLTC-E", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3985&mapp=TH&GFSTYP=M"}, {"name": "UN THREADING FLTC-I", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3996&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_20', $u$Double-Ended Precision Flat Top Threading Inserts$u$, $u$Inserts$u$, 20, $u$[{"name": "60° PARTIAL PROFILE THREADING FLTF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3986&mapp=TH&GFSTYP=M"}, {"name": "60° PARTIAL PROFILE THREADING FLT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3989&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_21', $u$Double-Ended Precision Positive Rake Threading Inserts$u$, $u$Inserts$u$, 21, $u$[{"name": "60° PARTIAL PROFILE THREADING FLTK", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3987&mapp=TH&GFSTYP=M"}, {"name": "60° PARTIAL PROFILE THREADING FLTP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3990&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_22', $u$Double-Ended Precision Threading Inserts with Chipbreakers$u$, $u$Inserts$u$, 22, $u$[{"name": "60° PARTIAL PROFILE THREADING FLT-CB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3988&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_23', $u$Double-Ended, Precision, Flat Top Internal Threading Inserts$u$, $u$Inserts$u$, 23, $u$[{"name": "ACME THREADING FLA-PT-I", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3991&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_24', $u$Double-Ended, Precision, Flat Top on Internal Threading Inserts$u$, $u$Inserts$u$, 24, $u$[{"name": "STUB ACME THREADING FLAS-PT-I", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3992&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_25', $u$External Tools for Deep Grooving Inserts$u$, $u$Toolholders$u$, 25, $u$[{"name": "FLSR/LT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3890&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_26', $u$Tools for External Grooving and Threading Inserts$u$, $u$Toolholders$u$, 26, $u$[{"name": "FLSR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3893&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_notchgrip_use_27', $u$External Tools for Grooving and Threading intended for Swiss-Type Machines$u$, $u$Toolholders$u$, 27, $u$[{"name": "FLASR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3998&mapp=TH&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'NOTCHGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- JET-CUT
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_jetcut', 'JET-CUT', 'Grooving & parting', $u$JET-CUT: grooving tools and inserts from the ISCAR turning catalog, such as external Threading Tools with Coolant Channels.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'JETCUT')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$JET-CUT: grooving tools and inserts from the ISCAR turning catalog, such as external Threading Tools with Coolant Channels.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'JETCUT' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('grooving', 'threading') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'JETCUT'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_jetcut_use_0', $u$External Threading Tools with Coolant Channels$u$, $u$Toolholders$u$, 0, $u$[{"name": "SER/L-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4109&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_jetcut_use_1', $u$External Threading Tools with Bottom Inlet Coolant Channels$u$, $u$Toolholders$u$, 1, $u$[{"name": "SER/L-JHP-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4111&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'JETCUT'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- CER-M-TURN
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_cermturn', 'CER-M-TURN', 'Turning', $u$CER-M-TURN: turning tools and inserts from the ISCAR turning catalog, such as turning Tools with CAMFIX Polygon Shaped Shanks with Indexable Inserts Mounted on Cartridges.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CERMTURN')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$CER-M-TURN: turning tools and inserts from the ISCAR turning catalog, such as turning Tools with CAMFIX Polygon Shaped Shanks with Indexable Inserts Mounted on Cartridges.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'CERMTURN' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CERMTURN'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_cermturn_use_0', $u$Turning Tools with CAMFIX Polygon Shaped Shanks with Indexable Inserts Mounted on Cartridges$u$, $u$Adapters & blocks$u$, 0, $u$[{"name": "C#-CXXNR/L-AD-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5334&mapp=IS&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_cermturn_use_1', $u$Square Turning Tools with a Channel for High-Pressure Coolant, Carrying Inserts Mounted on Cartridges$u$, $u$Adapters & blocks$u$, 1, $u$[{"name": "CXXNR/L-AD-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5428&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'CERMTURN'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- DECA-IQ-THREAD
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_decaiqthread', 'DECA-IQ-THREAD', 'Threading', $u$DECA-IQ-THREAD: threading tools and inserts from the ISCAR turning catalog, such as external Threading Tools Carrying Inserts with 10 Threading Corners.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'DECAIQTHREAD')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$DECA-IQ-THREAD: threading tools and inserts from the ISCAR turning catalog, such as external Threading Tools Carrying Inserts with 10 Threading Corners.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'DECAIQTHREAD' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('threading') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'DECAIQTHREAD'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_decaiqthread_use_0', $u$External Threading Tools Carrying Inserts with 10 Threading Corners$u$, $u$Toolholders$u$, 0, $u$[{"name": "SER/L-TT-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3718&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_decaiqthread_use_1', $u$External Threading Tools with Bottom Inlet Coolant Channels, Carrying Inserts with 10 Threading Corners$u$, $u$Toolholders$u$, 1, $u$[{"name": "SER/L-TT-JHP-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4112&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_decaiqthread_use_2', $u$External ISO Metric (DIN13 12-1986 class: 6G) Threading Inserts with 10 Threading Corners for General Industry$u$, $u$Inserts$u$, 2, $u$[{"name": "TTG-16E-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3719&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_decaiqthread_use_3', $u$External American UN Full Profile (UN, UNC, UNF, UNEF) Threading Inserts with 10 Threading Corners for General Industry$u$, $u$Inserts$u$, 3, $u$[{"name": "TTG-16E-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3720&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_decaiqthread_use_4', $u$External Inserts with 10 Threading Corners and a 55° Partial Profile for General Industry$u$, $u$Inserts$u$, 4, $u$[{"name": "TTG-16E-A55", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3721&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_decaiqthread_use_5', $u$External Inserts with 10 Threading Corners and 60° Partial  Profile for General Industry$u$, $u$Inserts$u$, 5, $u$[{"name": "TTG-16E-A60", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3722&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_decaiqthread_use_6', $u$Adapters with Coolant Channels for High Pressure, Carrying Inserts with 10 Threading Corners$u$, $u$Adapters & blocks$u$, 6, $u$[{"name": "TTADR/L-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4114&mapp=TH&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'DECAIQTHREAD'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- FLASHPENTA
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_flashpenta', 'FLASHPENTA', 'Grooving & parting', $u$FLASHPENTA: parting tools and inserts from the ISCAR turning catalog, such as utility Inserts with 5 Cutting Edges for Parting and Grooving of Hard Materials, Tough and General Applications.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'FLASHPENTA')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$FLASHPENTA: parting tools and inserts from the ISCAR turning catalog, such as utility Inserts with 5 Cutting Edges for Parting and Grooving of Hard Materials, Tough and General Applications.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'FLASHPENTA' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('parting') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'FLASHPENTA'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_flashpenta_use_0', $u$Utility Inserts with 5 Cutting Edges for Parting and Grooving of Hard Materials, Tough and General Applications$u$, $u$Inserts$u$, 0, $u$[{"name": "PMN D-C", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4093&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_flashpenta_use_1', $u$Utility Parting and Grooving Pentagonal Inserts for Parting Bearing Steel and Other Ductile Materials$u$, $u$Inserts$u$, 1, $u$[{"name": "PMN D-PB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4094&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_flashpenta_use_2', $u$Utility Parting and Grooving Insert with 5 Cutting Edges, for Soft Materials and Parting of Tubes$u$, $u$Inserts$u$, 2, $u$[{"name": "PMN D-J", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4095&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'FLASHPENTA'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- ISCAR-TAPS
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_iscartaps', 'ISCAR-TAPS', 'Threading', $u$ISCAR-TAPS: threading tools and inserts from the ISCAR turning catalog, such as dIN 13 HSS Right-Hand 40° Spiral Flute Machine Taps - ISO Metric Coarse Threads for H.T.A..$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARTAPS')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$ISCAR-TAPS: threading tools and inserts from the ISCAR turning catalog, such as dIN 13 HSS Right-Hand 40° Spiral Flute Machine Taps - ISO Metric Coarse Threads for H.T.A..$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARTAPS' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('threading') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARTAPS'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_iscartaps_use_0', $u$DIN 13 HSS Right-Hand 40° Spiral Flute Machine Taps - ISO Metric Coarse Threads for H.T.A.$u$, $u$Taps$u$, 0, $u$[{"name": "TPSN M-H", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5378&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscartaps_use_1', $u$PM Gun Point Machine Taps According to DIN 13 - ISO Metric Coarse Threads for Machining Stainless Steel$u$, $u$Taps$u$, 1, $u$[{"name": "TPGN M-S", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5379&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscartaps_use_2', $u$DIN 13 HSSE 5% Co Gun Point Machine Taps - ISO Metric Coarse Threads for Machining Aluminum$u$, $u$Taps$u$, 2, $u$[{"name": "TPGN M-A", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5380&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscartaps_use_3', $u$DIN 13 HSSE 5% Co Gun Point Machine Taps - ISO Metric Coarse Threads for Machining Cast Iron$u$, $u$Taps$u$, 3, $u$[{"name": "TPGN M-G", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5381&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscartaps_use_4', $u$DIN 13 HSSE 5% Co Gun Point Machine Taps - ISO Metric Coarse Threads, for Hardened Steel and High Temperature Alloys$u$, $u$Taps$u$, 4, $u$[{"name": "TPGN M-H", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5382&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscartaps_use_5', $u$DIN 13 HSS Gun Point Machine Taps - ISO Metric Coarse Threads for Machining Nickel Alloys$u$, $u$Taps$u$, 5, $u$[{"name": "TPGN M-Y", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5384&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscartaps_use_6', $u$PM Straight Flute Machine Taps - ISO Metric Coarse Threads, According to DIN 13, for Gray Cast Iron$u$, $u$Taps$u$, 6, $u$[{"name": "TPSTN M-G", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5386&mapp=TH&GFSTYP=M"}, {"name": "TPSTN M-G-E", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5388&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscartaps_use_7', $u$DIN 13 HSS Straight Flute Machine Taps - ISO Metric Coarse Threads for Grey Cast Iron$u$, $u$Taps$u$, 7, $u$[{"name": "TPSTN M-G-B", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5387&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscartaps_use_8', $u$HSSE 5% Co Cold Forming Machine Taps - ISO Metric Coarse Threads, According to DIN 13$u$, $u$Taps$u$, 8, $u$[{"name": "TPFN M-F", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5389&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscartaps_use_9', $u$HSSE 5% Co Cold Forming Machine Taps - ISO Metric Fine Threads, According to DIN 13$u$, $u$Taps$u$, 9, $u$[{"name": "TPFN MF-F", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5390&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscartaps_use_10', $u$HSS Spiral Flute Machine Taps - ISO Metric Coarse Threads, According to DIN 13, for Grey Cast Iron$u$, $u$Taps$u$, 10, $u$[{"name": "TPSN M-G", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5396&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscartaps_use_11', $u$PM Right-Hand 40° Spiral Flute Machine Taps - ISO Metric Coarse Threads, According to DIN 13, for Stainless Steel$u$, $u$Taps$u$, 11, $u$[{"name": "TPSN M-S", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5399&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscartaps_use_12', $u$DIN 13 HSS Spiral Flute Machine Taps - Metric Coarse Threads for Machining Nickel Alloys$u$, $u$Taps$u$, 12, $u$[{"name": "TPSN M-Y", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5400&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscartaps_use_13', $u$PM Spiral Flute Machine Taps - ISO Metric Fine Threads, According to DIN 13, for Gray Cast Iron$u$, $u$Taps$u$, 13, $u$[{"name": "TPSTN MF-G", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5405&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscartaps_use_14', $u$DIN 13 HSS Right-Hand 40° Spiral Flute Machine Taps for ISO Metric Coarse Threads on Aluminum and Aluminum Alloys$u$, $u$Taps$u$, 14, $u$[{"name": "TPSN M-A", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5406&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscartaps_use_15', $u$HSS straight flute machine taps - ISO metric coarse threads, according to DIN 13, for low Carbone Steel$u$, $u$Taps$u$, 15, $u$[{"name": "TPSN M-N", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5438&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_iscartaps_use_16', $u$DIN 13 HSS Hand Tap Set for ISO Metric Coarse Threads$u$, $u$Kits$u$, 16, $u$[{"name": "TPHN M-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5391&mapp=TH&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ISCARTAPS'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- MILL-THREAD
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_millthread', 'MILL-THREAD', 'Threading', $u$MILL-THREAD: threading tools and inserts from the ISCAR turning catalog, such as helical Thread Milling Inserts for ISO Metric External Threading.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MILLTHREAD')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$MILL-THREAD: threading tools and inserts from the ISCAR turning catalog, such as helical Thread Milling Inserts for ISO Metric External Threading.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MILLTHREAD' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('threading') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MILLTHREAD'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_millthread_use_0', $u$Helical Thread Milling Inserts for ISO Metric External Threading$u$, $u$Inserts$u$, 0, $u$[{"name": "MTH-ISO (external)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2453&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_1', $u$Helical Thread Milling Inserts for American Full Profile External Threading. Intended for General Applications$u$, $u$Inserts$u$, 1, $u$[{"name": "MTH-UN (external)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2454&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_2', $u$External & Internal Whitworth (BSW, BSF, BSP) Helical Thread Milling Inserts for Fittings and Pipe Couplings$u$, $u$Inserts$u$, 2, $u$[{"name": "MTH-W (int. & ext.)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2455&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_3', $u$Helical External & Internal Thread Milling Inserts for BSPT Thread for Steam, Gas and Water Pipes$u$, $u$Inserts$u$, 3, $u$[{"name": "MTH-BSPT (int. & ext.)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2456&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_4', $u$External & Internal NPT Helical Thread Milling Inserts for Steam, Gas and Water Pipes$u$, $u$Inserts$u$, 4, $u$[{"name": "MTH-NPT (int. & ext.)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2457&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_5', $u$55° Partial Profile Laydown Thread Milling Inserts for General Industry$u$, $u$Inserts$u$, 5, $u$[{"name": "MT3-55D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3579&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_6', $u$60° Partial Profile Laydown Thread Milling Inserts for General Industry$u$, $u$Inserts$u$, 6, $u$[{"name": "MT3-60D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3580&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_7', $u$External & Internal NPTF Helical Thread Milling Inserts for Steam, Gas and Water Pipes$u$, $u$Inserts$u$, 7, $u$[{"name": "MTH-NPTF (int. & ext.)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3584&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_8', $u$Helical Thread Milling Inserts for ISO Metric Internal Threading$u$, $u$Inserts$u$, 8, $u$[{"name": "MTH-ISO (internal)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4005&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_9', $u$Helical Thread Milling Inserts for American Full Profile Internal Threading. Intended for General Applications$u$, $u$Inserts$u$, 9, $u$[{"name": "MTH-UN (internal)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4006&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_10', $u$Thread Milling Inserts for American (UN, UNC, UNF, UNEF, UNS) Full Profile Threads for General Applications$u$, $u$Inserts$u$, 10, $u$[{"name": "MT LNH#-UN (Internal)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4044&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_11', $u$External (UN, UNC, UNF, UNEF, UNS) Full Profile Thread Milling Inserts for General Industries$u$, $u$Inserts$u$, 11, $u$[{"name": "MT LNHU-UN (External)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4045&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_12', $u$Thread Milling Inserts for External ISO Metric Profile$u$, $u$Inserts$u$, 12, $u$[{"name": "MT LNHU-ISO (External)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4046&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_13', $u$Thread Milling Inserts for Internal ISO Metric Profile$u$, $u$Inserts$u$, 13, $u$[{"name": "MT LNH#-ISO (Internal)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4047&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_14', $u$Internal ACME Profile Thread Milling Inserts for Feed Screws$u$, $u$Inserts$u$, 14, $u$[{"name": "MT LNH#-ACME (Internal)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4048&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_15', $u$External & Internal Whitworth (BSW, BSF, BSP) Full Profile Thread Milling Inserts for Fittings and Pipe Couplings$u$, $u$Inserts$u$, 15, $u$[{"name": "MT LNH#-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4049&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_16', $u$External and Internal NPS Full Profile Thread Milling Inserts for Mechanical Joints and Pipe Fittings$u$, $u$Inserts$u$, 16, $u$[{"name": "MT LNH#-NPS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4050&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_17', $u$External and Internal NPSF Full Profile Thread Milling Inserts$u$, $u$Inserts$u$, 17, $u$[{"name": "MT LNH#-NPSF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4051&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_18', $u$External and Internal NPT Full Profile Thread Milling Inserts for Steam, Gas and Water Pipes$u$, $u$Inserts$u$, 18, $u$[{"name": "MT LNHT-NPT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4052&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_19', $u$External and Internal Thread Milling Inserts for BSPT Full Profile$u$, $u$Inserts$u$, 19, $u$[{"name": "MT LNHT-BSPT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4053&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_20', $u$External and Internal NPTF Full Profile Thread Milling Inserts for Steam, Gas and Water Pipes$u$, $u$Inserts$u$, 20, $u$[{"name": "MT LNHT-NPTF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4054&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_21', $u$External & Internal Single-Sided American Buttress Thread Milling Inserts$u$, $u$Inserts$u$, 21, $u$[{"name": "MT LNHT-ABUT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4055&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_22', $u$External and Internal PG Full Profile Thread Milling Inserts (DIN 40430) for Electrical Connectors$u$, $u$Inserts$u$, 22, $u$[{"name": "MT LNHU-PG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4056&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_23', $u$55° Partial Profile Laydown U-Type Thread Milling Inserts, for General Industry$u$, $u$Inserts$u$, 23, $u$[{"name": "MT TNCT-U55", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4078&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_millthread_use_24', $u$60° Partial Profile Laydown U-Type Thread Milling Inserts, for General Industry$u$, $u$Inserts$u$, 24, $u$[{"name": "MT TNCT-U60", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4079&mapp=TH&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MILLTHREAD'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- MULTI-MASTER
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_multimaster', 'MULTI-MASTER', 'Threading', $u$MULTI-MASTER: threading tools and inserts from the ISCAR turning catalog, such as carbide Milling Heads with a Threaded Connection for Internal and External 55° BSW Thread Profile.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MULTIMASTER')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$MULTI-MASTER: threading tools and inserts from the ISCAR turning catalog, such as carbide Milling Heads with a Threaded Connection for Internal and External 55° BSW Thread Profile.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'MULTIMASTER' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('threading') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MULTIMASTER'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_multimaster_use_0', $u$Carbide Milling Heads with a Threaded Connection for Internal and External 55° BSW Thread Profile$u$, $u$Tools$u$, 0, $u$[{"name": "MT-W-MM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2325&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_multimaster_use_1', $u$Carbide Milling Heads with a Threaded Connection for Internal ISO Metric Thread$u$, $u$Tools$u$, 1, $u$[{"name": "MT-ISO-MM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2462&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_multimaster_use_2', $u$Carbide Milling Heads with a Threaded Connection for Internal UN Thread Profile$u$, $u$Tools$u$, 2, $u$[{"name": "MT-UN-MM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2463&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_multimaster_use_3', $u$Interchangeable Solid Carbide Milling Heads for 55° Partial Profile Thread Milling$u$, $u$Solid tools$u$, 3, $u$[{"name": "MM TRD-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2408&mapp=TH&GFSTYP=M"}, {"name": "MM TRF 55°", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4616&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_multimaster_use_4', $u$Interchangeable Solid Carbide Milling Heads for 60° Partial Profile Thread Milling$u$, $u$Solid tools$u$, 4, $u$[{"name": "MM TRD-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2498&mapp=TH&GFSTYP=M"}, {"name": "MM TRF 60°", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4642&mapp=TH&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'MULTIMASTER'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- ONE-TAP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_onetap', 'ONE-TAP', 'Threading', $u$ONE-TAP: threading tools and inserts from the ISCAR turning catalog, such as dIN 13 HSS Gun Point Machine Taps - ISO Metric Coarse Threads for a Wide Range of Materials.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ONETAP')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$ONE-TAP: threading tools and inserts from the ISCAR turning catalog, such as dIN 13 HSS Gun Point Machine Taps - ISO Metric Coarse Threads for a Wide Range of Materials.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'ONETAP' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('threading') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ONETAP'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_onetap_use_0', $u$DIN 13 HSS Gun Point Machine Taps - ISO Metric Coarse Threads for a Wide Range of Materials$u$, $u$Taps$u$, 0, $u$[{"name": "TPGN M-M-B", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5383&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_onetap_use_1', $u$DIN 13 HSSE 5% Co Gun Point Machine Taps - ISO Metric Coarse Threads for a Wide Range of Materials$u$, $u$Taps$u$, 1, $u$[{"name": "TPGN M-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5385&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_onetap_use_2', $u$PM Cold Forming Machine Taps - ISO Metric Coarse Threads, According to DIN 13$u$, $u$Taps$u$, 2, $u$[{"name": "TPFN M-F (PM)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5392&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_onetap_use_3', $u$DIN 13 HSSE 5% Co Gun Point Machine Taps - ISO Metric Fine Threads for a Wide Range of Materials$u$, $u$Taps$u$, 3, $u$[{"name": "TPGN MF-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5393&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_onetap_use_4', $u$HSSE 5% Co Gun Point Machine Taps - Unified Coarse Threads for a Wide Range of Materials$u$, $u$Taps$u$, 4, $u$[{"name": "TPGN UNC-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5394&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_onetap_use_5', $u$HSSE 5% Co Spiral Flute Machine Taps - Unified Fine Threads, for a Wide Range of Materials$u$, $u$Taps$u$, 5, $u$[{"name": "TPGN UNF-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5395&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_onetap_use_6', $u$DIN 13 HSS Spiral Flute Machine Taps - Metric Coarse Threads for a Wide Range of Materials$u$, $u$Taps$u$, 6, $u$[{"name": "TPSN M-M-B", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5397&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_onetap_use_7', $u$DIN 13 HSSE. 5% Co Spiral Flute Machine Taps ISO Metric Coarse Threads for a Wide Range of Materials$u$, $u$Taps$u$, 7, $u$[{"name": "TPSN M-M-F", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5398&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_onetap_use_8', $u$DIN 13 HSSE 5% Co Spiral Flute Machine Taps ISO Metric Coarse Threads for a Wide Range of Materials$u$, $u$Taps$u$, 8, $u$[{"name": "TPSN M-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5401&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_onetap_use_9', $u$DIN 13 HSSE 5% Co Spiral Flute Machine Taps. ISO Metric Fine Threads for a Wide Range of Materials$u$, $u$Taps$u$, 9, $u$[{"name": "TPSN MF-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5402&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_onetap_use_10', $u$HSSE 5% Co Spiral Flute Machine Taps Unified Coarse Threads, for a Wide Range of Materials$u$, $u$Taps$u$, 10, $u$[{"name": "TPSN UNC-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5403&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_onetap_use_11', $u$HSSE 5% Co Spiral Flute Machine Taps Unified Fine Threads, for a Wide Range of Materials$u$, $u$Taps$u$, 11, $u$[{"name": "TPSN UNF-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5404&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_onetap_use_12', $u$PM Cold Forming Machine Taps - ISO Metric Fine Threads, According to DIN 13$u$, $u$Taps$u$, 12, $u$[{"name": "TPFN MF-F (PM)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5407&mapp=TH&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'ONETAP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- PICCO-3-CUT
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_picco3cut', 'PICCO-3-CUT', 'Turning', $u$PICCO-3-CUT: turning for swiss-type tools and inserts from the ISCAR turning catalog, such as inserts with Three Cutting Edges for Internal Turning and Chamfering.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'PICCO3CUT')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$PICCO-3-CUT: turning for swiss-type tools and inserts from the ISCAR turning catalog, such as inserts with Three Cutting Edges for Internal Turning and Chamfering.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'PICCO3CUT' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('profiling') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'PICCO3CUT'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_picco3cut_use_0', $u$Inserts with Three Cutting Edges for Internal Turning and Chamfering$u$, $u$Inserts$u$, 0, $u$[{"name": "PMC R/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5240&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'PICCO3CUT'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- PICCO-MF
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_piccomf', 'PICCO-MF', 'Turning', $u$PICCO-MF: turning for swiss-type tools and inserts from the ISCAR turning catalog, such as multifunction Solid Carbide Tools for Drilling, Facing, Internal and External Turning on Swiss and Small CNC Machines.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'PICCOMF')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$PICCO-MF: turning for swiss-type tools and inserts from the ISCAR turning catalog, such as multifunction Solid Carbide Tools for Drilling, Facing, Internal and External Turning on Swiss and Small CNC Machines.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'PICCOMF' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('turning') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'PICCOMF'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_piccomf_use_0', $u$Multifunction Solid Carbide Tools for Drilling, Facing, Internal and External Turning on Swiss and Small CNC Machines$u$, $u$Solid tools$u$, 0, $u$[{"name": "PICCO-MF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1524&mapp=IS&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'PICCOMF'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- SOLID-M-THREAD
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_solidmthread', 'SOLID-M-THREAD', 'Threading', $u$SOLID-M-THREAD: threading tools and inserts from the ISCAR turning catalog, such as solid Carbide Internal Threading Endmills with a Coolant Hole. Intended for ISO Thread Profiles.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDMTHREAD')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$SOLID-M-THREAD: threading tools and inserts from the ISCAR turning catalog, such as solid Carbide Internal Threading Endmills with a Coolant Hole. Intended for ISO Thread Profiles.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDMTHREAD' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('threading') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDMTHREAD'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_solidmthread_use_0', $u$Solid Carbide Internal Threading Endmills with a Coolant Hole. Intended for ISO Thread Profiles$u$, $u$Solid tools$u$, 0, $u$[{"name": "MTECBF-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5047&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidmthread_use_1', $u$Solid Carbide Internal Threading Endmills with a Coolant Hole. Intended for UN Thread Profile$u$, $u$Solid tools$u$, 1, $u$[{"name": "MTECBF-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5048&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidmthread_use_2', $u$Solid Carbide Internal or External Threading Endmills with a Coolant Hole. Intended for BSF/BSP Thread Profiles$u$, $u$Solid tools$u$, 2, $u$[{"name": "MTECBF-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5049&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidmthread_use_3', $u$Solid Carbide Internal Threading Endmill Step Release, Lead x3 With Coolant Holes, Used for ISO Thread Profile$u$, $u$Solid tools$u$, 3, $u$[{"name": "MTECM-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5151&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidmthread_use_4', $u$Solid Carbide Internal Threading Endmill Step Release, Lead x3 With Coolant Hole, Used for UN Thread Profiles$u$, $u$Solid tools$u$, 4, $u$[{"name": "MTECM-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5152&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidmthread_use_5', $u$Solid Carbide Internal Threading Endmill Step Release, Lead x2 With Coolant Hole, Used for ISO Thread Profile$u$, $u$Solid tools$u$, 5, $u$[{"name": "MTECK-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5153&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidmthread_use_6', $u$Solid Carbide Internal Threading Endmill Step Release, Lead x2 With Coolant Hole, Used for UN Thread Profiles$u$, $u$Solid tools$u$, 6, $u$[{"name": "MTECK-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5154&mapp=TH&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDMTHREAD'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- SOLID-THREAD
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_solidthread', 'SOLID-THREAD', 'Threading', $u$SOLID-THREAD: threading tools and inserts from the ISCAR turning catalog, such as small Diameter Solid Carbide Threading Endmills for an Internal ISO Profile.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDTHREAD')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$SOLID-THREAD: threading tools and inserts from the ISCAR turning catalog, such as small Diameter Solid Carbide Threading Endmills for an Internal ISO Profile.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDTHREAD' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('threading') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDTHREAD'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_solidthread_use_0', $u$Small Diameter Solid Carbide Threading Endmills for an Internal ISO Profile$u$, $u$Solid tools$u$, 0, $u$[{"name": "MTECS-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1398&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_1', $u$Solid Carbide Internal Threading Endmills for ISO Thread Profile$u$, $u$Solid tools$u$, 1, $u$[{"name": "MTEC-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1647&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_2', $u$Solid Carbide Threading Endmills for Internal or External BSF/BSP Thread Profiles$u$, $u$Solid tools$u$, 2, $u$[{"name": "MTEC-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1649&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_3', $u$Solid Carbide Threading Endmills for Internal UN Thread Profile$u$, $u$Solid tools$u$, 3, $u$[{"name": "MTEC-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1650&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_4', $u$Solid Carbide Threading Endmills for an External or Internal BSPT Thread Profile$u$, $u$Solid tools$u$, 4, $u$[{"name": "MTEC-BSPT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1651&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_5', $u$Solid Carbide Threading Endmills for an External or Internal NPT Thread Profile$u$, $u$Solid tools$u$, 5, $u$[{"name": "MTEC-NPT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1653&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_6', $u$Solid Carbide Threading Endmills for an External or Internal NPTF Thread Profile$u$, $u$Solid tools$u$, 6, $u$[{"name": "MTEC-NPTF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1655&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_7', $u$Small Diameter Solid Carbide UN Profile Threading Endmills for Steel$u$, $u$Solid tools$u$, 7, $u$[{"name": "MTECS-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2019&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_8', $u$Solid Carbide Internal Threading Endmills with Coolant Hole for ISO Thread Profile$u$, $u$Solid tools$u$, 8, $u$[{"name": "MTECB-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2083&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_9', $u$Solid Carbide Threading Endmills with Coolant Hole for Internal UN Thread Profile$u$, $u$Solid tools$u$, 9, $u$[{"name": "MTECB-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2084&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_10', $u$Solid Carbide Threading Endmills with Coolant Hole for an External or Internal NPT Thread Profile$u$, $u$Solid tools$u$, 10, $u$[{"name": "MTECB-NPT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2085&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_11', $u$Solid Carbide Threading Endmills with Coolant Holes, for External or Internal NPTF Thread Profile$u$, $u$Solid tools$u$, 11, $u$[{"name": "MTECB-NPTF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2086&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_12', $u$Solid Carbide Internal or External Threading Endmills with Coolant Hole for BSF/BSP Thread Profiles$u$, $u$Solid tools$u$, 12, $u$[{"name": "MTECB-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2087&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_13', $u$Solid Carbide External or Internal Threading Endmills with Coolant Holes, for BSPT Thread Profile$u$, $u$Solid tools$u$, 13, $u$[{"name": "MTECB-BSPT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2088&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_14', $u$Small Diameter Short Left-Hand Cut Solid Carbide UN Profile Threading Endmills for Hardened Steel$u$, $u$Solid tools$u$, 14, $u$[{"name": "MTECSH-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2459&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_15', $u$Solid Carbide External Threading Endmills for an ISO Thread Profile$u$, $u$Solid tools$u$, 15, $u$[{"name": "MTEC E-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2460&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_16', $u$Solid Carbide Threading Endmills with UN Form for External Threading$u$, $u$Solid tools$u$, 16, $u$[{"name": "MTEC E-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2461&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_17', $u$Solid Carbide Internal Threading Endmills with Coolant Holes$u$, $u$Solid tools$u$, 17, $u$[{"name": "MTECZ-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2602&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_18', $u$Solid Carbide Threading Endmills with Coolant Holes for Internal or External BSF/BSP Thread$u$, $u$Solid tools$u$, 18, $u$[{"name": "MTECZ-BSF/BSP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2603&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_19', $u$Solid Carbide Threading Endmills with Coolant Holes Located in the Flutes for Internal UN Thread Profiles$u$, $u$Solid tools$u$, 19, $u$[{"name": "MTECZ-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2604&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_20', $u$Solid Carbide Threading Endmills with Coolant Holes Located in the Flutes, for Internal or External NPT Thread Profile$u$, $u$Solid tools$u$, 20, $u$[{"name": "MTECZ-NPT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2605&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_21', $u$Solid Carbide Threading Endmills with Coolant Holes for Internal or External NPTF Thread Profile$u$, $u$Solid tools$u$, 21, $u$[{"name": "MTECZ-NPTF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2606&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_22', $u$Solid Carbide Threading Endmills with Coolant Holes for an Internal or External BSPT Thread Profile$u$, $u$Solid tools$u$, 22, $u$[{"name": "MTECZ-BSPT", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2607&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_23', $u$Small Diameter Short Solid Carbide MJ-Type Profile Threading Endmills$u$, $u$Solid tools$u$, 23, $u$[{"name": "MTECS-MJ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2826&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_24', $u$Small Diameter Short Solid Carbide UNJ-Type Profile Threading Endmills$u$, $u$Solid tools$u$, 24, $u$[{"name": "MTECS-UNJ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2827&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_25', $u$60° Partial Profile Solid Carbide Thread Mills for Internal and External Threads$u$, $u$Solid tools$u$, 25, $u$[{"name": "MTECI-A60", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2828&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_26', $u$Solid Carbide Endmills with Internal Coolant Holes and a Reduced Diameter Neck, for Deep Internal UN Profile Threading$u$, $u$Solid tools$u$, 26, $u$[{"name": "MTECQ-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3068&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_27', $u$Solid Carbide Threading Endmills with Coolant Holes Located in the Flutes, for Internal or External Whitworth Thread$u$, $u$Solid tools$u$, 27, $u$[{"name": "MTECZ-Whitworth", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3211&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_28', $u$Short Solid Carbide Threading Endmills for Internal or External BSP and BSF Thread Profiles$u$, $u$Solid tools$u$, 28, $u$[{"name": "MTECS-W", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3240&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_29', $u$Small Diameter Short Left-Hand Cut. Solid Carbide Endmills for Internal ISO Profile Drilling, Threading and Chamfering$u$, $u$Solid tools$u$, 29, $u$[{"name": "MTECD-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3524&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_30', $u$Small Diameter Solid Carbide Internal ISO Profile Threading and Chamfering Endmills, for Hard Materials$u$, $u$Solid tools$u$, 30, $u$[{"name": "MTECH-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3528&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_31', $u$Small Diameter Solid Carbide Internal UN Profile Threading and Chamfering Endmills, for Hard Materials$u$, $u$Solid tools$u$, 31, $u$[{"name": "MTECH-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3529&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_32', $u$Solid Carbide Threading Endmills with a Coolant Hole for External and Internal PG Full Profile (DIN 40430)$u$, $u$Solid tools$u$, 32, $u$[{"name": "MTECB-PG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3568&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_33', $u$Small Diameter Single Point Internal ISO Profile Solid Carbide Thread Mills$u$, $u$Solid tools$u$, 33, $u$[{"name": "MTECI-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3572&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_34', $u$Interchangeable Solid Carbide Heads for 60° Partial Profile Thread Milling$u$, $u$Solid tools$u$, 34, $u$[{"name": "SD TRD-M-SP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4043&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_35', $u$Interchangeable Solid Carbide Heads for 55° Partial Profile Thread Milling$u$, $u$Solid tools$u$, 35, $u$[{"name": "SD TRD-W-SP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4096&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_36', $u$Small Diameter Short Left-Hand Cut. Internal ISO Profile Threading Endmills for Hardened Steel$u$, $u$Tools$u$, 36, $u$[{"name": "MTECSH-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2458&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_37', $u$Small Diameter, Short, Left Hand, Internal UN Profile Endmills for Drilling, Threading and Chamfering$u$, $u$Tools$u$, 37, $u$[{"name": "MTECD-UN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3525&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_solidthread_use_38', $u$Endmills with Through Tool Coolant and Reduced Neck Diameter for Deep Internal ISO Profile Threading$u$, $u$Toolholders$u$, 38, $u$[{"name": "MTECQ-ISO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3067&mapp=TH&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SOLIDTHREAD'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- SPIN-JET
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_spinjet', 'SPIN-JET', 'Grooving & parting', $u$SPIN-JET: groove-turn tools and inserts from the ISCAR turning catalog, such as axial, Short Intermediate holders for High Speed Spindles Designed for Modular Tooling Systems.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SPINJET')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$SPIN-JET: groove-turn tools and inserts from the ISCAR turning catalog, such as axial, Short Intermediate holders for High Speed Spindles Designed for Modular Tooling Systems.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SPINJET' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('grooveturn') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SPINJET'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_spinjet_use_0', $u$Axial, Short Intermediate holders for High Speed Spindles Designed for Modular Tooling Systems$u$, $u$Toolholders$u$, 0, $u$[{"name": "V#TJS", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4834&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_spinjet_use_1', $u$Radial, Short Intermediate Holders for High Speed Spindles Designed for Modular Tooling Systems$u$, $u$Toolholders$u$, 1, $u$[{"name": "V#TJS-P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4835&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SPINJET'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- THREAD-Q-LOCK
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_tl_threadqlock', 'THREAD-Q-LOCK', 'Threading', $u$THREAD-Q-LOCK: threading tools and inserts from the ISCAR turning catalog, such as external 60° Partial Profile, Laydown Threading Inserts for Fast Machining.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'THREADQLOCK')
ON CONFLICT DO NOTHING;
UPDATE "Innovation" SET "description" = $u$THREAD-Q-LOCK: threading tools and inserts from the ISCAR turning catalog, such as external 60° Partial Profile, Laydown Threading Inserts for Fast Machining.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'THREADQLOCK' AND ("description" IS NULL OR trim("description") = '');
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '[^A-Za-z0-9]', '', 'g')) IN ('threading') AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'THREADQLOCK'
ON CONFLICT DO NOTHING;
INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position", u."inserts"
FROM (VALUES
  ('innovation_tl_threadqlock_use_0', $u$External 60° Partial Profile, Laydown Threading Inserts for Fast Machining$u$, $u$Inserts$u$, 0, $u$[{"name": "ER-60°-Q", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5648&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_threadqlock_use_1', $u$External 55° Partial Profile, Laydown Threading Inserts for Fast Machining$u$, $u$Inserts$u$, 1, $u$[{"name": "ER-55°-Q", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5649&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_threadqlock_use_2', $u$External ISO Metric (DIN13 12-1986 class: 6g), Laydown Threading Inserts for Fast Machining$u$, $u$Inserts$u$, 2, $u$[{"name": "ER/L-ISO-Q", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5650&mapp=TH&GFSTYP=M"}]$u$::jsonb),
  ('innovation_tl_threadqlock_use_3', $u$External American UN full profile (UN, UNC, UNF, UNEF) laydown threading inserts for fast machining$u$, $u$Inserts$u$, 3, $u$[{"name": "ER-UN-Q", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5651&mapp=TH&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'THREADQLOCK'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
