-- One-time: the TANG-GRIP brand on the Solutions screen (Groove-Turn) with
-- its uses and inserts. An existing TANG-GRIP is kept: it only gets the
-- application, a description if it has none, and the uses if it has none.
INSERT INTO "Innovation" ("id", "name", "category", "description")
VALUES ('innovation_tang_grip', 'TANG-GRIP', 'Grooving & parting', 'Tangentially clamped single-ended inserts (TAG) for parting, grooving and slitting.')
ON CONFLICT ("name") DO NOTHING;

UPDATE "Innovation" SET "description" = 'Tangentially clamped single-ended inserts (TAG) for parting, grooving and slitting.'
WHERE "name" = 'TANG-GRIP' AND ("description" IS NULL OR trim("description") = '');

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(replace(a."name", ' ', '-')) = 'groove-turn' AND i."name" = 'TANG-GRIP'
ON CONFLICT DO NOTHING;

INSERT INTO "InnovationUse" ("id", "innovationId", "name", "position", "inserts")
SELECT u."id", i."id", u."name", u."position", u."inserts"
FROM (VALUES
  ('innovation_use_tang_grip_0', $u$Grooving and Slitting Full Radius Inserts$u$, 0, $u$[{"name": "TAG N-C", "note": "full radius, new"}]$u$::jsonb),
  ('innovation_use_tang_grip_1', $u$Single-Ended Inserts for Parting and Grooving, suitable for Ductile Materials, Steel and Stainless Steel$u$, 1, $u$[{"name": "TAG N-T", "note": "new"}]$u$::jsonb),
  ('innovation_use_tang_grip_2', $u$Single-Ended Inserts for Parting, Grooving, and Slitting Aluminum$u$, 2, $u$[{"name": "TAG N-A"}]$u$::jsonb),
  ('innovation_use_tang_grip_3', $u$Single-Ended Inserts for Parting, Grooving and Slitting Bars, Hard Materials and Tough Applications$u$, 3, $u$[{"name": "TAG N-C/W/M"}]$u$::jsonb),
  ('innovation_use_tang_grip_4', $u$Single-Ended Inserts for Parting, Grooving and Slitting Soft Materials$u$, 4, $u$[{"name": "TAG N-J/JS/JT"}]$u$::jsonb),
  ('innovation_use_tang_grip_5', $u$Single-Ended Inserts for Parting, Grooving and Slitting Stainless Steel$u$, 5, $u$[{"name": "TAG N-LF"}]$u$::jsonb),
  ('innovation_use_tang_grip_6', $u$Single-Ended Inserts for Parting, Grooving and Slitting Stainless and Alloy Steel at Medium Feed$u$, 6, $u$[{"name": "TAG N-MF"}]$u$::jsonb),
  ('innovation_use_tang_grip_7', $u$Single-Sided Inserts for Parting, Grooving & Slitting at Low Feeds on Cr-Ni Alloys, Ductile Materials & Low Carbon Steel$u$, 7, $u$[{"name": "TAG N-UT"}]$u$::jsonb),
  ('innovation_use_tang_grip_8', $u$Single-Ended Inserts for Parting Bars, Hard Materials and Tough Parting Applications$u$, 8, $u$[{"name": "TAG R/L-C"}]$u$::jsonb),
  ('innovation_use_tang_grip_9', $u$TANG-GRIP Inserts for Parting Soft Materials, Tubes, Small Diameters and Thin-Walled Parts$u$, 9, $u$[{"name": "TAG R/L-J/JS"}]$u$::jsonb)
) AS u("id", "name", "position", "inserts")
JOIN "Innovation" i ON i."name" = 'TANG-GRIP'
WHERE NOT EXISTS (SELECT 1 FROM "InnovationUse" x WHERE x."innovationId" = i."id")
ON CONFLICT DO NOTHING;
