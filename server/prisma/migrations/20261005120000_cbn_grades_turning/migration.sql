-- One-time data change: assign every CBN grade to the Turning application
-- (existing assignments are kept; nothing happens if there is no Turning).
INSERT INTO "_ApplicationToGrade" ("A", "B")
SELECT a."id", g."id"
FROM "Application" a
CROSS JOIN "Grade" g
WHERE lower(a."name") = 'turning' AND g."family" = 'CBN'
ON CONFLICT DO NOTHING;
