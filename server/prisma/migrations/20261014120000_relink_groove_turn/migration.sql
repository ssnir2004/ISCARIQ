-- One-time: the Groove-Turn application added with the Solutions screen was
-- deleted (taking its brand links with it) and the existing "groove turn"
-- application renamed to Groove-Turn. Link the brands to it.
INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE lower(replace(a."name", ' ', '-')) = 'groove-turn'
  AND i."name" IN ('CUT-GRIP', 'HELI-GRIP', 'TOP-GRIP', 'CHAM-GROOVE', 'SWISS-CUT', 'PICCO-CUT', 'V-LOCK')
ON CONFLICT DO NOTHING;
