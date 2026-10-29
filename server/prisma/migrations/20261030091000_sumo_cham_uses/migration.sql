-- One-time: the SUMO-CHAM brand (Solutions, Drilling) with its uses: the
-- SUMO-CHAM families on the ISCAR intranet e-catalog (Hole Making), in two
-- categories, Heads and Drill bodies, each family linked to its page; families
-- with the same description share a use. An existing SUMO-CHAM (also spelled
-- SUMOCHAM) is kept: it gets the application, a description if it has none,
-- and the uses it doesn't have (by name).
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_sumo_cham', 'SUMO-CHAM', 'Drilling', $u$Exchangeable-head drills: carbide drilling heads (ICP, ICM, ICK, ICN, ICG, IHP, QCP, HCP) on DCN drill bodies with internal coolant, for drilling depths of 1.5xD to 12xD.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOCHAM')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Exchangeable-head drills: carbide drilling heads (ICP, ICM, ICK, ICN, ICG, IHP, QCP, HCP) on DCN drill bodies with internal coolant, for drilling depths of 1.5xD to 12xD.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOCHAM' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'drilling' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOCHAM'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "category", "position", "inserts")
SELECT u."id", i."id", u."name", u."category",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_sumo_cham_use_0', $u$Exchangeable SUMO-CHAM Drilling Heads for Machining ISO P Materials$u$, $u$Heads$u$, 0, $u$[{"name": "ICP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2672&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_1', $u$Exchangeable SUMO-CHAM Drilling Heads for Machining ISO M and ISO S Materials$u$, $u$Heads$u$, 1, $u$[{"name": "ICM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2671&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_2', $u$Exchangeable SUMO-CHAM Drilling Heads for Machining ISO K Materials$u$, $u$Heads$u$, 2, $u$[{"name": "ICK", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2920&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_3', $u$Exchangeable SUMO-CHAM Drilling Heads for Machining ISO N Materials$u$, $u$Heads$u$, 3, $u$[{"name": "ICN", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3144&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_4', $u$Exchangeable Double Margin SUMO-CHAM Drilling Heads, for Machining ISO P Materials with High Surface Finish Results$u$, $u$Heads$u$, 4, $u$[{"name": "ICP-2M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3087&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_5', $u$Exchangeable Double Margin SUMO-CHAM Drilling Heads, for Machining ISO K Materials with High Surface Finish Results$u$, $u$Heads$u$, 5, $u$[{"name": "ICK-2M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3136&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_6', $u$Exchangeable Chip Splitting SUMO-CHAM Drilling Heads, for Machining ISO M and ISO P Materials$u$, $u$Heads$u$, 6, $u$[{"name": "ICG", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4012&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_7', $u$Exchangeable Double Margin, Self-Centering SUMO-CHAM Drilling Heads, for ISO P Materials with High Surface Finish result$u$, $u$Heads$u$, 7, $u$[{"name": "QCP-2M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4119&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_8', $u$Exchangeable Single Margin, Self-Centering Drilling Heads for DCN Drills$u$, $u$Heads$u$, 8, $u$[{"name": "QCP-M", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5595&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_9', $u$Exchangeable Self-Centering SUMO-CHAM Drilling Heads, for Machining ISO P and ISO K Materials$u$, $u$Heads$u$, 9, $u$[{"name": "HCP-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3593&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_10', $u$Exchangeable Drilling Heads for DCN Drills, for Machining ISO P Materials (Non-alloy and Carbon Steel)$u$, $u$Heads$u$, 10, $u$[{"name": "IHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4810&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_11', $u$Exchangeable Drilling Heads for DCN Drills for Machining Construction Beams and Structural Steel Materials$u$, $u$Heads$u$, 11, $u$[{"name": "IHP-BD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5032&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_12', $u$Drill Body with Exchangeable Heads, Internal Coolant Holes and a Cylindrical Shank, Drilling Depth 1.5xD$u$, $u$Drill bodies$u$, 12, $u$[{"name": "DCN R-1.5D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3003&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_13', $u$Drill Body with Exchangeable Heads, Internal Coolant Holes and a Cylindrical Shank, Drilling Depth 3xD$u$, $u$Drill bodies$u$, 13, $u$[{"name": "DCN R-3D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2667&mapp=DR&GFSTYP=M"}, {"name": "DCN C-3D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4404&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_14', $u$Drill Body with Exchangeable Heads, Internal Coolant Holes and a Cylindrical Shank, Drilling Depth 5xD$u$, $u$Drill bodies$u$, 14, $u$[{"name": "DCN R-5D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2669&mapp=DR&GFSTYP=M"}, {"name": "DCN C-5D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4405&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_15', $u$Drill Body with Exchangeable Heads, Internal Coolant Holes and a Cylindrical Shank, Drilling Depth 8xD$u$, $u$Drill bodies$u$, 15, $u$[{"name": "DCN R-8D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2983&mapp=DR&GFSTYP=M"}, {"name": "DCN C-8D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4587&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_16', $u$Drill Body with Exchangeable Heads, Internal Coolant Holes and a Cylindrical Shank, Drilling Depth 10xD$u$, $u$Drill bodies$u$, 16, $u$[{"name": "DCN R-10D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4670&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_17', $u$Drill Body with Exchangeable Heads, Internal Coolant Holes and a Cylindrical Shank, Drilling Depth 12xD$u$, $u$Drill bodies$u$, 17, $u$[{"name": "DCN R-12D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3146&mapp=DR&GFSTYP=M"}, {"name": "DCN C-12D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4588&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_18', $u$Drill Body with Exchangeable Heads, Internal Coolant Holes and One Flat Shank, Drilling Depth 1.5xD$u$, $u$Drill bodies$u$, 18, $u$[{"name": "DCN A-1.5D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3111&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_19', $u$Drill Body with Exchangeable Heads, Internal Coolant Holes and One Flat Shank, Drilling Depth 3xD$u$, $u$Drill bodies$u$, 19, $u$[{"name": "DCN A-3D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3112&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_20', $u$Drill Body with Exchangeable Heads, Internal Coolant Holes and One Flat Shank, Drilling Depth 5xD$u$, $u$Drill bodies$u$, 20, $u$[{"name": "DCN A-5D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3113&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_21', $u$Drill Body with Exchangeable Heads, Internal Coolant Holes and One Flat Shank, Drilling Depth 8xD$u$, $u$Drill bodies$u$, 21, $u$[{"name": "DCN A-8D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3114&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_22', $u$Drill Body with Exchangeable Heads, without Flange, One Flat Shank, Drilling Depth 3xD, Suitable for Chamfering Holders$u$, $u$Drill bodies$u$, 22, $u$[{"name": "DCNS-3D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3149&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_23', $u$Drill Body with Exchangeable Heads, without Flange, One Flat Shank, Drilling Depth 5xD, Suitable for Chamfering Holders$u$, $u$Drill bodies$u$, 23, $u$[{"name": "DCNS-5D", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3150&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_24', $u$Drill Body with Exchangeable Heads, Chamfering Inserts, Internal Coolant and One Flat Shank. Used for Pre-Tread Holes$u$, $u$Drill bodies$u$, 24, $u$[{"name": "DCNT (M8-M24)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4065&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_25', $u$Modular SUMO-CHAM Drill with FLEX-FIT Connection for Multi-Spindle and Swiss-Type Machines$u$, $u$Drill bodies$u$, 25, $u$[{"name": "DCNM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4418&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_26', $u$Modular Drill Body with Exchangeable Heads, Internal Coolant Holes and MULTI-MASTER Connection, Drilling Depth 2xD$u$, $u$Drill bodies$u$, 26, $u$[{"name": "DCN-MM", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4841&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_27', $u$Drill Body with Exchangeable Heads, Internal Coolant Holes and PICCO Connection, Drilling Depth 3xD$u$, $u$Drill bodies$u$, 27, $u$[{"name": "DCN-PICCO", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5254&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_28', $u$Exchangeable Head Drills with a Reinforced Body and a WN Shank, Diameter Ratio 5xD, for Construction Beam Industry$u$, $u$Drill bodies$u$, 28, $u$[{"name": "DCN-N-5D-BD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5040&mapp=DR&GFSTYP=M"}]$u$::jsonb),
  ('innovation_sumo_cham_use_29', $u$Exchangeable Head Drills with a Reinforced Body and a WN Shank, Diameter Ratio 8xD, for Construction Beam Industry$u$, $u$Drill bodies$u$, 29, $u$[{"name": "DCN-N-8D-BD", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5041&mapp=DR&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "category", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SUMOCHAM'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;
