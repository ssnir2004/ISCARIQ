-- One-time: the CBN code key gets edge preparation use cases (S/E/T/P),
-- how the S01220 code reads, and the edge preparation table by grade. Adds
-- to the key as it is (keeps any edits), and only if not added already.
UPDATE "AppSetting" AS a
SET "value" = (
  SELECT ((q.v - 'sections') || jsonb_build_object(
    'tables', COALESCE(q.v -> 'tables', '[]'::jsonb) || $ck$[{"title": "Edge preparation – explanation (by grade)", "merge": 2, "groups": [{"label": "", "span": 3}, {"label": "Standard", "span": 6}, {"label": "Semi-Standard (low cutting forces)", "span": 6}, {"label": "Semi-Standard (strong edge preparation)", "span": 6}], "columns": ["Series", "Workpiece material", "Grade", "Code", "A (°)\nr 0.2–0.4", "W (mm)\nr 0.2–0.4", "A (°)\nr 0.8–1.2", "W (mm)\nr 0.8–1.2", "Honing (mm)", "Code", "A (°)\nr 0.2–0.4", "W (mm)\nr 0.2–0.4", "A (°)\nr 0.8–1.2", "W (mm)\nr 0.8–1.2", "Honing (mm)", "Code", "A (°)\nr 0.2–0.4", "W (mm)\nr 0.2–0.4", "A (°)\nr 0.8–1.2", "W (mm)\nr 0.8–1.2", "Honing (mm)"], "rows": [["Uncoated CBN", "H – Hardened steel", "BI05H", "S", "25", "0.12", "25", "0.15", "0.015", "LS", "15", "0.12", "15", "0.15", "0.015", "HS", "35", "0.12", "35", "0.15", "0.015"], ["Uncoated CBN", "H – Hardened steel", "BI15H", "S", "25", "0.12", "25", "0.15", "0.015", "LS", "15", "0.12", "15", "0.15", "0.015", "HS", "35", "0.12", "35", "0.15", "0.015"], ["Uncoated CBN", "H – Hardened steel", "BI25H", "S", "25", "0.12", "25", "0.15", "0.015", "LS", "15", "0.12", "15", "0.15", "0.015", "HS", "35", "0.12", "35", "0.15", "0.015"], ["Uncoated CBN", "H – Hardened steel", "BI30H", "S", "20", "0.1", "20", "0.1", "0.015", "LS", "10", "0.1", "10", "0.1", "0.015", "HS", "35", "0.12", "35", "0.15", "0.015"], ["Uncoated CBN", "K – Cast iron", "BI30H", "S", "20", "0.1", "20", "0.1", "0.015", "LS", "10", "0.1", "10", "0.1", "0.015", "HS", "35", "0.1", "35", "0.1", "0.015"], ["Uncoated CBN", "K – Cast iron", "BI30K", "S", "20", "0.2", "20", "0.2", "0.015", "S", "20", "0.2", "20", "0.2", "0.015", "S", "20", "0.2", "20", "0.2", "0.015"], ["Uncoated CBN", "S – Super alloys", "BI05S", "S", "-", "-", "-", "-", "0.015", "S", "-", "-", "-", "-", "0.015", "S", "-", "-", "-", "-", "0.015"], ["Uncoated CBN", "S – Super alloys", "BI15S", "S", "-", "-", "-", "-", "0.015", "S", "-", "-", "-", "-", "0.015", "S", "-", "-", "-", "-", "0.015"], ["Uncoated CBN", "Sintered metal", "BI10S", "S", "15", "0.1", "15", "0.1", "0.025", "LE", "-", "-", "-", "-", "0.025", "HS", "25", "0.1", "25", "0.1", "0.025"], ["Uncoated CBN", "Sintered metal", "BI20S", "S", "15", "0.1", "15", "0.1", "0.025", "LE", "-", "-", "-", "-", "0.025", "HS", "25", "0.1", "25", "0.1", "0.025"], ["Coated CBN", "H – Hardened steel", "BI15HC", "S", "25", "0.12", "25", "0.15", "0.015", "LS", "15", "0.12", "0.12", "0.15", "0.015", "HS", "35", "0.12", "35", "0.15", "0.015"], ["Coated CBN", "H – Hardened steel", "BI05HC", "S", "25", "0.12", "25", "0.15", "0.015", "LS", "15", "0.12", "0.12", "0.15", "0.015", "HS", "35", "0.12", "35", "0.15", "0.015"], ["Coated CBN", "H – Hardened steel", "BI25HC", "S", "25", "0.12", "25", "0.15", "0.015", "LS", "15", "0.12", "0.12", "0.15", "0.015", "HS", "35", "0.12", "35", "0.15", "0.015"], ["Coated CBN", "H – Hardened steel", "BI30HC", "S", "20", "0.1", "20", "0.1", "0.015", "LS", "10", "0.1", "0.1", "0.1", "0.015", "HS", "35", "0.12", "35", "0.15", "0.015"], ["Coated CBN", "K – Cast iron", "BI30KC", "S", "20", "0.2", "20", "0.2", "0.015", "S", "20", "0.2", "20", "0.2", "0.015", "S", "20", "0.2", "20", "0.2", "0.015"]]}]$ck$::jsonb,
    'sections', (
      SELECT jsonb_agg(
        CASE WHEN s ->> 'title' = 'Edge preparation – Standard' THEN
          s || jsonb_build_object(
            'note', $ck$How the code reads: S 012 20 = edge preparation S, negative land width W 0.12 mm (012), negative land angle A 20° (20).
Example: S01220 → 20° / 0.12 mm width negative land with honing (R).$ck$,
            'rows', (
              SELECT jsonb_agg(r || COALESCE($ck${"S": {"details": "First choice for hard part machining / stable cutting edge. Resistant to breakage and chipping. Feed > rounding!"}, "E": {"details": "Rounding protects the cutting edge from breakage and chipping. Suitable for finishing with low feed rates."}, "T": {"details": "Negative land gives a more stable cutting edge; with the large angle, the cutting force increases with the width and angle of the bevel."}, "P": {"details": "Combined edge preparation for extreme conditions – the strongest cutting edge."}}$ck$::jsonb -> (r ->> 'code'), '{}'::jsonb) ORDER BY i)
              FROM jsonb_array_elements(s -> 'rows') WITH ORDINALITY AS x(r, i)
            )
          )
        ELSE s END
        ORDER BY o
      )
      FROM jsonb_array_elements(q.v -> 'sections') WITH ORDINALITY AS y(s, o)
    )
  ))::text
  FROM (SELECT a."value"::jsonb AS v) AS q
)
WHERE a."key" = 'codekey.cbn' AND a."value" NOT LIKE '%Edge preparation – explanation%';
