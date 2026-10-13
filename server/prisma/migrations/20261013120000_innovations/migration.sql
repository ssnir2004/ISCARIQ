-- CreateTable
CREATE TABLE "Innovation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "year" INTEGER,
    "category" TEXT,

    CONSTRAINT "Innovation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Innovation_name_key" ON "Innovation"("name");


-- The first two brands on the timeline (pictures are added on the screen).
INSERT INTO "Innovation" ("id", "name", "year", "category", "description") VALUES
  ('innovation_self_grip', 'SELF-GRIP', 1978, 'Grooving & parting',
   'ISCAR''s first breakthrough: a parting and grooving insert held in the blade by its own spring clamping force, with no screw. It made parting-off on the lathe faster and more reliable, and set ISCAR on its way.'),
  ('innovation_do_grip', 'DO-GRIP', 1994, 'Grooving & parting',
   'A double-ended twisted insert for grooving and parting: two cutting edges on one insert, held by the self-clamping blade, for more edges per insert and stable cutting.')
ON CONFLICT ("name") DO NOTHING;
