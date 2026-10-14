-- AlterTable
ALTER TABLE "Innovation" ADD COLUMN     "solutionGroup" TEXT;

-- CreateTable
CREATE TABLE "InnovationCase" (
    "id" TEXT NOT NULL,
    "innovationId" TEXT NOT NULL,
    "iso513Group" "Iso513Group",
    "title" TEXT NOT NULL,
    "notes" TEXT,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InnovationCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ApplicationToInnovation" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationToInnovation_AB_unique" ON "_ApplicationToInnovation"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationToInnovation_B_index" ON "_ApplicationToInnovation"("B");

-- AddForeignKey
ALTER TABLE "InnovationCase" ADD CONSTRAINT "InnovationCase_innovationId_fkey" FOREIGN KEY ("innovationId") REFERENCES "Innovation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToInnovation" ADD CONSTRAINT "_ApplicationToInnovation_A_fkey" FOREIGN KEY ("A") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationToInnovation" ADD CONSTRAINT "_ApplicationToInnovation_B_fkey" FOREIGN KEY ("B") REFERENCES "Innovation"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- The Groove-Turn application and its brands (details, pictures and cases
-- are added on the Solutions screen).
INSERT INTO "Application" ("id", "name") VALUES ('application_groove_turn', 'Groove-Turn')
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "Innovation" ("id", "name") VALUES
  ('innovation_cut_grip', 'CUT-GRIP'),
  ('innovation_heli_grip', 'HELI-GRIP'),
  ('innovation_top_grip', 'TOP-GRIP'),
  ('innovation_cham_groove', 'CHAM-GROOVE'),
  ('innovation_swiss_cut', 'SWISS-CUT'),
  ('innovation_picco_cut', 'PICCO-CUT'),
  ('innovation_v_lock', 'V-LOCK')
ON CONFLICT ("name") DO NOTHING;

INSERT INTO "_ApplicationToInnovation" ("A", "B")
SELECT a."id", i."id"
FROM "Application" a, "Innovation" i
WHERE a."name" = 'Groove-Turn'
  AND i."name" IN ('CUT-GRIP', 'HELI-GRIP', 'TOP-GRIP', 'CHAM-GROOVE', 'SWISS-CUT', 'PICCO-CUT', 'V-LOCK')
ON CONFLICT DO NOTHING;
