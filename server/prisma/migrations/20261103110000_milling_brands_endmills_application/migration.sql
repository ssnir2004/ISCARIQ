-- One-time: production splits milling into "Endmills(SC) & MM" and
-- "Indexable Milling", so the milling brands (all solid endmills and
-- MULTI-MASTER) belong to "Endmills(SC) & MM". Link them there, and drop the
-- "Milling" application the previous migration may have added when it is
-- unused (no grades, cases, groups, recommendations, tool lines or chipbreaker
-- data) and that application exists.
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'endmills(sc)&mm'
  AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) IN
      ('MULTIMASTER', 'MULTIFEEDMASTER', 'SOLIDMILL', 'CHATTERFREE', 'SOLIDSHRED', 'FINISHRED', 'SOLIDFEEDMILL', 'TITURBO', 'NEOBARREL')
ON CONFLICT DO NOTHING;

DELETE FROM "Application" m
WHERE lower(trim(m."name")) = 'milling'
  AND EXISTS (SELECT 1 FROM "Application" a WHERE lower(regexp_replace(a."name", '\s+', '', 'g')) = 'endmills(sc)&mm')
  AND NOT EXISTS (SELECT 1 FROM "_ApplicationToGrade" x WHERE x."A" = m."id")
  AND NOT EXISTS (SELECT 1 FROM "_ApplicationToGradeRecommendation" x WHERE x."A" = m."id")
  AND NOT EXISTS (SELECT 1 FROM "_ApplicationToToolLine" x WHERE x."A" = m."id")
  AND NOT EXISTS (SELECT 1 FROM "GradeCase" x WHERE x."applicationId" = m."id")
  AND NOT EXISTS (SELECT 1 FROM "GradeApplicationGroups" x WHERE x."applicationId" = m."id")
  AND NOT EXISTS (SELECT 1 FROM "ChipbreakerRange" x WHERE x."applicationId" = m."id")
  AND NOT EXISTS (SELECT 1 FROM "ChipbreakerCase" x WHERE x."applicationId" = m."id");
