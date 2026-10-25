-- One-time: the Parting guide on the Solutions screen (Parting tab): tools by
-- part diameter in three segments (Miniature & Medical Industry up to Ø32,
-- General Engineering Ø33-160, Heavy Duty Ø161-600), from ISCAR's parting
-- priorities slides; kept if the tab already has a guide. The brands it names
-- that aren't on the Solutions screen are added to Parting with their e-catalog
-- families as uses (an existing brand of the same name, ignoring case, spaces
-- and dashes, is kept and only gets what it lacks).

-- QUICK2CUT MINI
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_quick2cut_mini', $u$QUICK2CUT MINI$u$, 'Grooving & parting', $u$Double-sided tangential inserts (TGV) for grooving, parting and recessing small parts on Swiss-type machines.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICK2CUTMINI')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Double-sided tangential inserts (TGV) for grooving, parting and recessing small parts on Swiss-type machines.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'QUICK2CUTMINI' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'parting' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICK2CUTMINI'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "position", "inserts")
SELECT u."id", i."id", u."name",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_quick2cut_mini_use_0', $u$Double Sided Tangential Insert for SWISS Type Machines, Intended for Grooving, Parting and Recessing Small Parts$u$, 0, $u$[{"name": "TGV N", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5264&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_quick2cut_mini_use_1', $u$Double Sided Tangential Insert with Lead Angle Cutting Edge to Minimize Burr Size, Intended for Parting Small Parts$u$, 1, $u$[{"name": "TGV R/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5265&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_quick2cut_mini_use_2', $u$Grooving, Parting and Recessing Tools Carrying TGV Inserts with Channels for High-Pressure Coolant$u$, 2, $u$[{"name": "TGVR/L-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5266&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'QUICK2CUTMINI'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- GROOVE4CUT
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_groove4cut', $u$GROOVE4CUT$u$, 'Grooving & parting', $u$Inserts with 4 cutting edges (QGI) for parting and precision grooving, on QTHR/L tools with high-pressure coolant.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'GROOVE4CUT')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Inserts with 4 cutting edges (QGI) for parting and precision grooving, on QTHR/L tools with high-pressure coolant.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'GROOVE4CUT' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'parting' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'GROOVE4CUT'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "position", "inserts")
SELECT u."id", i."id", u."name",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_groove4cut_use_0', $u$4 Cutting Edged Inserts with a Positive Flat Rake for Parting and Precision Grooving$u$, 0, $u$[{"name": "QGI 30N-PF", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5251&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_groove4cut_use_1', $u$4 Cutting Edged Inserts with a High Positive Flat Rake for Parting and Precision Grooving$u$, 1, $u$[{"name": "QGI 30N-P", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5252&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_groove4cut_use_2', $u$Grooving and Parting Tools Carrying GROOVE-4-CUT Inserts with Inlets for High-Pressure Coolant$u$, 2, $u$[{"name": "QTHR/L-30-JHP-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5246&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'GROOVE4CUT'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- PENTA IQ GRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_penta_iq_grip', $u$PENTA IQ GRIP$u$, 'Grooving & parting', $u$Parting line with inserts with 5 cutting edges (PENTA D) on PCHR/L-D tools.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'PENTAIQGRIP')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$Parting line with inserts with 5 cutting edges (PENTA D) on PCHR/L-D tools.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'PENTAIQGRIP' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'parting' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'PENTAIQGRIP'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "position", "inserts")
SELECT u."id", i."id", u."name",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_penta_iq_grip_use_0', $u$Inserts with 5 Cutting Edges for Parting and Grooving Hard Materials, Tough and General Applications$u$, 0, $u$[{"name": "PENTA D-N-C", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3384&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_penta_iq_grip_use_1', $u$Inserts with 5 Cutting Edges for Parting Hard Materials, Tough and General Applications$u$, 1, $u$[{"name": "PENTA D-R/L-C", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3385&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_penta_iq_grip_use_2', $u$Inserts with 5 Cutting Edges for Parting and Grooving Soft Materials, Parting Tubes, Small and Thin-Walled Parts$u$, 2, $u$[{"name": "PENTA D-N-J", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3850&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_penta_iq_grip_use_3', $u$Inserts with 5 Cutting Edges for Parting Tubes, Small and Thin-Walled Parts$u$, 3, $u$[{"name": "PENTA D-R/L-J", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3851&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_penta_iq_grip_use_4', $u$Pentagonal Inserts for Parting and Grooving Bearing Steel and Other Ductile Materials$u$, 4, $u$[{"name": "PENTA D-N-PB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3875&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_penta_iq_grip_use_5', $u$Pentagonal Inserts for Parting Bearing Steel and other Ductile Materials$u$, 5, $u$[{"name": "PENTA D-R/L-PB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3876&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_penta_iq_grip_use_6', $u$Grooving and Parting Tools Carrying Inserts with 5 Cutting Edges$u$, 6, $u$[{"name": "PCHR/L-D-IQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3383&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_penta_iq_grip_use_7', $u$Grooving and Parting Tools with Channels for High-Pressure Coolant Carrying Inserts with 5 Cutting Edges$u$, 7, $u$[{"name": "PCHR/L-D-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3877&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'PENTAIQGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- LOGIQ-F-GRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_logiq_f_grip', $u$LOGIQ-F-GRIP$u$, 'Grooving & parting', $u$High-feed grip holder system: square F-GRIP adapters (TANG-F-GRIP, DO-F-GRIP) on tool blocks with high-pressure coolant.$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQFGRIP')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$High-feed grip holder system: square F-GRIP adapters (TANG-F-GRIP, DO-F-GRIP) on tool blocks with high-pressure coolant.$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQFGRIP' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'parting' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQFGRIP'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "position", "inserts")
SELECT u."id", i."id", u."name",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_logiq_f_grip_use_0', $u$Parting and Grooving Square Adapters Carrying TANG-GRIP Tangentially Clamped Inserts$u$, 0, $u$[{"name": "TGAQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4542&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_logiq_f_grip_use_1', $u$Parting and Grooving Square Adapters with Internal Coolant Holes Carrying TANG-GRIP Tangentially Clamped Inserts$u$, 1, $u$[{"name": "TGAQ-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4451&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_logiq_f_grip_use_2', $u$Parting and Grooving Square Adapters Compatible with TANG-GRIP Inserts (Single-Ended)$u$, 2, $u$[{"name": "TGAQ-ECD (JET-CROWN)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4672&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_logiq_f_grip_use_3', $u$Parting and Grooving Square Adapters Carrying DO-GRIP Inserts$u$, 3, $u$[{"name": "DGAQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4543&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_logiq_f_grip_use_4', $u$Parting and Grooving Square Adapters with Internal Coolant Holes Carrying DO-GRIP Inserts$u$, 4, $u$[{"name": "DGAQ-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4450&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_logiq_f_grip_use_5', $u$Tool Blocks for Square TANG-F-GRIP and DO-F-GRIP Parting and Grooving Adapters for High-Pressure Coolant$u$, 5, $u$[{"name": "TGTBQ-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4447&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_logiq_f_grip_use_6', $u$Tool Blocks which Mount Square Adapters with Three High-Pressure Coolant Inlets for Parting and Grooving$u$, 6, $u$[{"name": "TGTBQ-JHP-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4655&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_logiq_f_grip_use_7', $u$Tool Blocks for Square F-GRIP Parting and Grooving Adapters with High-Pressure Coolant for Machining next to Spindle$u$, 7, $u$[{"name": "TGTBQ-JHP-RIB", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4796&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_logiq_f_grip_use_8', $u$Tool Blocks for Square TANG-F-GRIP (TGAQ-ECD) Parting and Grooving Adapters for High-Pressure Coolant$u$, 8, $u$[{"name": "TGTBQ-ECD-JHP (JET-CROWN)", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4673&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_logiq_f_grip_use_9', $u$Tool Blocks for Square TANG-F-GRIP (TGAQ-ECD) Parting and Grooving Adapters for High-Pressure Coolant, Three Coolant Inlets$u$, 9, $u$[{"name": "TGTBQ-JHP-ECD-MC", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5472&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_logiq_f_grip_use_10', $u$Y-Axis Intermediate Prismatic Holders for Square JHP Adapters on Multi-Task Machines for Parting and Grooving$u$, 10, $u$[{"name": "TGTBY-JHP", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4515&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'LOGIQFGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- SWISSGRIP
INSERT INTO "Innovation" ("id", "name", "category", "description")
SELECT 'innovation_swissgrip', $u$SWISSGRIP$u$, 'Grooving & parting', $u$SELF-GRIP mini blades (SGAQ) and holders for parting and grooving on Swiss-type machines (narrow widths).$u$
WHERE NOT EXISTS (SELECT 1 FROM "Innovation" WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SWISSGRIP')
ON CONFLICT DO NOTHING;

UPDATE "Innovation" SET "description" = $u$SELF-GRIP mini blades (SGAQ) and holders for parting and grooving on Swiss-type machines (narrow widths).$u$
WHERE upper(regexp_replace("name", '[^A-Za-z0-9]', '', 'g')) = 'SWISSGRIP' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id" FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'parting' AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SWISSGRIP'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "position", "inserts")
SELECT u."id", i."id", u."name",
       COALESCE((SELECT max(x."position") + 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id"), 0) + u."position",
       u."inserts"
FROM (VALUES
  ('innovation_swissgrip_use_0', $u$SELF-GRIP Mini Blades for Parting and Grooving, Suitable for Swiss-Type Machines$u$, 0, $u$[{"name": "SGAQ", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4653&mapp=TG&GFSTYP=M"}]$u$::jsonb),
  ('innovation_swissgrip_use_1', $u$Parting and Grooving Holder for a SELF-GRIP Mini Blades (SGAQ), Suitable for Swiss-Type Machines$u$, 1, $u$[{"name": "THQR/L", "link": "https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=4652&mapp=TG&GFSTYP=M"}]$u$::jsonb)
) AS u("id", "name", "position", "inserts")
JOIN "Innovation" i ON upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) = 'SWISSGRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id" AND lower(trim(x."name")) = lower(u."name"))
ON CONFLICT DO NOTHING;

-- The guide itself.
INSERT INTO "AppSetting" ("key", "value")
SELECT 'guide.app.' || a."id", $g${"title": "Parting guide – optimal tool by part diameter", "segments": [{"title": "Miniature & Medical Industry", "from": 0, "to": 32, "columns": [{"label": "Ø8", "upTo": 8, "tools": [{"name": "PENTA-CUT 17", "brand": "PENTA-CUT", "width": "0.25–3.18 mm"}, {"name": "SWISS-CUT", "width": "0.5–2 mm"}, {"name": "QUICK2CUT MINI", "width": "0.33–2.0 mm", "isNew": true}, {"name": "DO-GRIP", "width": "0.8, 1.0, 1.2 mm", "isNew": true}]}, {"label": "Ø12.5", "upTo": 12.5, "tools": [{"name": "PENTA-CUT 24", "brand": "PENTA-CUT", "width": "0.5–3.18 mm"}, {"name": "SWISS-CUT", "width": "0.5–2 mm"}, {"name": "GROOVE4CUT", "width": "1–3 mm", "isNew": true}, {"name": "DO-GRIP", "width": "0.8, 1.0, 1.2 mm", "isNew": true}]}, {"label": "Ø16", "upTo": 16, "tools": [{"name": "PENTA-CUT", "width": "1.5 & 4 mm"}, {"name": "PENTA IQ GRIP", "width": "2–3 mm"}, {"name": "DO-GRIP", "width": "0.8, 1.0, 1.2 mm", "isNew": true}, {"name": "SWISSGRIP", "width": "0.6–1.2 mm"}]}, {"label": "Ø20", "upTo": 20, "tools": [{"name": "PENTA-CUT", "width": "1.5 & 4 mm"}, {"name": "PENTA IQ GRIP", "width": "2–3 mm"}, {"name": "DO-GRIP", "width": "0.8, 1.0, 1.2 mm", "isNew": true}]}, {"label": "Ø24", "upTo": 24, "tools": [{"name": "PENTA IQ GRIP", "width": "2 & 3 mm"}, {"name": "DO-GRIP", "width": "1.4–3 mm"}]}, {"label": "Ø32", "upTo": 32, "tools": [{"name": "PENTA IQ GRIP", "width": "2 & 3 mm"}, {"name": "DO-GRIP", "width": "2–3 mm"}]}]}, {"title": "General Engineering", "from": 33, "to": 160, "columns": [{"label": "Ø40", "upTo": 40, "tools": [{"name": "PENTA IQ GRIP", "width": "3 & 4 mm"}, {"name": "LOGIQ-F-GRIP", "width": "2–3 mm", "note": "D42"}, {"name": "DO-GRIP", "width": "2–3 mm"}, {"name": "TANG-GRIP", "width": "3–6 mm"}]}, {"label": "Ø50", "upTo": 50, "tools": [{"name": "LOGIQ-F-GRIP", "width": "2–4 mm", "note": "D52"}, {"name": "TANG-GRIP", "width": "3–12 mm"}, {"name": "TANG-GRIP", "width": "3–6 mm"}]}, {"label": "Ø60", "upTo": 60, "tools": [{"name": "LOGIQ-F-GRIP", "width": "2–5 mm", "note": "D82"}, {"name": "TANG-GRIP", "width": "3–12 mm"}, {"name": "DO-GRIP", "width": "2–3 mm"}]}, {"label": "Ø65–160", "upTo": 160, "tools": [{"name": "LOGIQ-F-GRIP", "width": "3–5 mm", "note": "D82, D120 & D160"}, {"name": "TANG-GRIP", "width": "3–12 mm"}]}]}, {"title": "Heavy Duty", "from": 161, "to": 600, "products": [{"name": "TANG-GRIP", "width": "5–12.7 mm", "maxDia": 600}, {"name": "SELF-GRIP", "width": "5–12.7 mm", "maxDia": 600}, {"name": "CUT-GRIP", "width": "4–8 mm", "note": "Jet Line", "maxDia": 200}, {"name": "LOGIQ-F-GRIP", "width": "3–5 mm", "maxDia": 160}]}], "table": {"title": "Insert width by part diameter (roughly)", "note": "DOC = the depth of cut the insert has to make; insert width ≈ DOC ÷ the factor.", "rows": [["Ø5–22 mm", "DOC / 5"], ["Ø23–40 mm", "DOC / 7.5"], ["Ø41–63 mm", "DOC / 8.5"], ["Ø64–80 mm", "DOC / 9.5"], ["Ø81–120 mm", "DOC / 13"], ["Ø121–160 mm", "DOC / 17"]]}}$g$
FROM "Application" a WHERE lower(trim(a."name")) = 'parting'
ON CONFLICT ("key") DO NOTHING;
