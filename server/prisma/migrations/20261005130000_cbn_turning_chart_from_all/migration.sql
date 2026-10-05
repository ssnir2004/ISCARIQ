-- One-time data change: copy the CBN "All" chart layout (uncoated and coated
-- charts, every material) to the CBN Turning board, replacing its layout.
-- Merged blocks get new merge ids (derived from the originals, so grades
-- merged together stay together): block edits look boxes up by mergeId alone.
DELETE FROM "GradeChartBox" b
USING "Application" a
WHERE lower(a."name") = 'turning'
  AND b."scope" IN ('CBN:' || a."id", 'CBN:' || a."id" || '~coated');

INSERT INTO "GradeChartBox" ("scope", "iso513Group", "gradeId", "x", "y", "w", "h", "mergeId", "z")
SELECT
  CASE b."scope" WHEN 'CBN:all' THEN 'CBN:' || a."id" ELSE 'CBN:' || a."id" || '~coated' END,
  b."iso513Group", b."gradeId", b."x", b."y", b."w", b."h",
  CASE WHEN b."mergeId" IS NULL THEN NULL ELSE md5(b."mergeId" || ':' || a."id") END,
  b."z"
FROM "GradeChartBox" b
CROSS JOIN "Application" a
WHERE lower(a."name") = 'turning'
  AND b."scope" IN ('CBN:all', 'CBN:all~coated');
