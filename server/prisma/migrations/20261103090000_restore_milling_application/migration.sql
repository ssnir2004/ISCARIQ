-- One-time: the Milling application (Code keys -> Milling, Solutions) is back
-- if it was removed, and the milling brands are linked to it again (they
-- were linked by name, so they missed it while it was gone).
INSERT INTO "Application" ("id", "name", "conditionParams")
SELECT 'app-milling', 'Milling', ARRAY['DC', 'ae', 'ap']
WHERE NOT EXISTS (SELECT 1 FROM "Application" WHERE lower(trim("name")) = 'milling')
ON CONFLICT DO NOTHING;

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(trim(a."name")) = 'milling'
  AND upper(regexp_replace(i."name", '[^A-Za-z0-9]', '', 'g')) IN
      ('MULTIMASTER', 'MULTIFEEDMASTER', 'SOLIDMILL', 'CHATTERFREE', 'SOLIDSHRED', 'FINISHRED', 'SOLIDFEEDMILL', 'TITURBO', 'NEOBARREL')
ON CONFLICT DO NOTHING;
