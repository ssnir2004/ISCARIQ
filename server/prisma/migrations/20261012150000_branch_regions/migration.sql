-- Branch sales region and order on the branches screen.
ALTER TABLE "Branch" ADD COLUMN "region" TEXT,
ADD COLUMN "position" INTEGER NOT NULL DEFAULT 0;

-- Data (one-time): the official branch names by region, in the given order.
-- Each existing branch is matched by country (Israel by its main branch,
-- named "Israel") and renamed; countries without a branch get one.
-- Branches not in the list keep their name and get no region.

-- WEST EUROPE
UPDATE "Branch" SET "name" = 'ISCAR GMBH', "region" = 'WEST EUROPE', "position" = 1 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'DE' ORDER BY ("name" = 'ISCAR GMBH') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR GMBH'), 'ISCAR GMBH', 'DE', 'WEST EUROPE', 1 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR GMBH') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR ITALIA', "region" = 'WEST EUROPE', "position" = 2 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'IT' ORDER BY ("name" = 'ISCAR ITALIA') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR ITALIA'), 'ISCAR ITALIA', 'IT', 'WEST EUROPE', 2 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR ITALIA') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR FRANCE', "region" = 'WEST EUROPE', "position" = 3 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'FR' ORDER BY ("name" = 'ISCAR FRANCE') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR FRANCE'), 'ISCAR FRANCE', 'FR', 'WEST EUROPE', 3 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR FRANCE') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR UK', "region" = 'WEST EUROPE', "position" = 4 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'GB' ORDER BY ("name" = 'ISCAR UK') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR UK'), 'ISCAR UK', 'GB', 'WEST EUROPE', 4 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR UK') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR TURKEY', "region" = 'WEST EUROPE', "position" = 5 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'TR' ORDER BY ("name" = 'ISCAR TURKEY') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR TURKEY'), 'ISCAR TURKEY', 'TR', 'WEST EUROPE', 5 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR TURKEY') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR SVERIGE', "region" = 'WEST EUROPE', "position" = 6 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'SE' ORDER BY ("name" = 'ISCAR SVERIGE') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR SVERIGE'), 'ISCAR SVERIGE', 'SE', 'WEST EUROPE', 6 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR SVERIGE') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR IBERICA', "region" = 'WEST EUROPE', "position" = 7 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'ES' ORDER BY ("name" = 'ISCAR IBERICA') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR IBERICA'), 'ISCAR IBERICA', 'ES', 'WEST EUROPE', 7 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR IBERICA') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR NEDERLAND', "region" = 'WEST EUROPE', "position" = 8 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'NL' ORDER BY ("name" = 'ISCAR NEDERLAND') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR NEDERLAND'), 'ISCAR NEDERLAND', 'NL', 'WEST EUROPE', 8 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR NEDERLAND') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR SWISS', "region" = 'WEST EUROPE', "position" = 9 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'CH' ORDER BY ("name" = 'ISCAR SWISS') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR SWISS'), 'ISCAR SWISS', 'CH', 'WEST EUROPE', 9 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR SWISS') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR Austria', "region" = 'WEST EUROPE', "position" = 10 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'AT' ORDER BY ("name" = 'ISCAR Austria') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR Austria'), 'ISCAR Austria', 'AT', 'WEST EUROPE', 10 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR Austria') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR BELGIUM', "region" = 'WEST EUROPE', "position" = 11 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'BE' ORDER BY ("name" = 'ISCAR BELGIUM') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR BELGIUM'), 'ISCAR BELGIUM', 'BE', 'WEST EUROPE', 11 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR BELGIUM') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR FINLAND', "region" = 'WEST EUROPE', "position" = 12 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'FI' ORDER BY ("name" = 'ISCAR FINLAND') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR FINLAND'), 'ISCAR FINLAND', 'FI', 'WEST EUROPE', 12 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR FINLAND') ON CONFLICT ("name") DO NOTHING;

-- NORTH AMERICA
UPDATE "Branch" SET "name" = 'ISCAR METALS', "region" = 'NORTH AMERICA', "position" = 13 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'US' ORDER BY ("name" = 'ISCAR METALS') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR METALS'), 'ISCAR METALS', 'US', 'NORTH AMERICA', 13 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR METALS') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR CANADA', "region" = 'NORTH AMERICA', "position" = 14 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'CA' ORDER BY ("name" = 'ISCAR CANADA') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR CANADA'), 'ISCAR CANADA', 'CA', 'NORTH AMERICA', 14 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR CANADA') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR MEXICO', "region" = 'NORTH AMERICA', "position" = 15 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'MX' ORDER BY ("name" = 'ISCAR MEXICO') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR MEXICO'), 'ISCAR MEXICO', 'MX', 'NORTH AMERICA', 15 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR MEXICO') ON CONFLICT ("name") DO NOTHING;

-- ASIA & FAR EAST
UPDATE "Branch" SET "name" = 'ISCAR JAPAN', "region" = 'ASIA & FAR EAST', "position" = 16 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'JP' ORDER BY ("name" = 'ISCAR JAPAN') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR JAPAN'), 'ISCAR JAPAN', 'JP', 'ASIA & FAR EAST', 16 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR JAPAN') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR INDIA', "region" = 'ASIA & FAR EAST', "position" = 17 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'IN' ORDER BY ("name" = 'ISCAR INDIA') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR INDIA'), 'ISCAR INDIA', 'IN', 'ASIA & FAR EAST', 17 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR INDIA') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR KOREA', "region" = 'ASIA & FAR EAST', "position" = 18 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'KR' ORDER BY ("name" = 'ISCAR KOREA') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR KOREA'), 'ISCAR KOREA', 'KR', 'ASIA & FAR EAST', 18 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR KOREA') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR THAILAND', "region" = 'ASIA & FAR EAST', "position" = 19 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'TH' ORDER BY ("name" = 'ISCAR THAILAND') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR THAILAND'), 'ISCAR THAILAND', 'TH', 'ASIA & FAR EAST', 19 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR THAILAND') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR TAIWAN', "region" = 'ASIA & FAR EAST', "position" = 20 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'TW' ORDER BY ("name" = 'ISCAR TAIWAN') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR TAIWAN'), 'ISCAR TAIWAN', 'TW', 'ASIA & FAR EAST', 20 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR TAIWAN') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR VIETNAM', "region" = 'ASIA & FAR EAST', "position" = 21 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'VN' ORDER BY ("name" = 'ISCAR VIETNAM') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR VIETNAM'), 'ISCAR VIETNAM', 'VN', 'ASIA & FAR EAST', 21 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR VIETNAM') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR SRI LANKA', "region" = 'ASIA & FAR EAST', "position" = 22 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'LK' ORDER BY ("name" = 'ISCAR SRI LANKA') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR SRI LANKA'), 'ISCAR SRI LANKA', 'LK', 'ASIA & FAR EAST', 22 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR SRI LANKA') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR CHINA', "region" = 'ASIA & FAR EAST', "position" = 23 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'CN' ORDER BY ("name" = 'ISCAR CHINA') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR CHINA'), 'ISCAR CHINA', 'CN', 'ASIA & FAR EAST', 23 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR CHINA') ON CONFLICT ("name") DO NOTHING;

-- EAST EUROPE
UPDATE "Branch" SET "name" = 'ISCAR POLAND', "region" = 'EAST EUROPE', "position" = 24 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'PL' ORDER BY ("name" = 'ISCAR POLAND') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR POLAND'), 'ISCAR POLAND', 'PL', 'EAST EUROPE', 24 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR POLAND') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR CR S.R.O.', "region" = 'EAST EUROPE', "position" = 25 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'CZ' ORDER BY ("name" = 'ISCAR CR S.R.O.') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR CR S.R.O.'), 'ISCAR CR S.R.O.', 'CZ', 'EAST EUROPE', 25 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR CR S.R.O.') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR HUNGARY', "region" = 'EAST EUROPE', "position" = 26 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'HU' ORDER BY ("name" = 'ISCAR HUNGARY') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR HUNGARY'), 'ISCAR HUNGARY', 'HU', 'EAST EUROPE', 26 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR HUNGARY') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR SLOVAKIA', "region" = 'EAST EUROPE', "position" = 27 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'SK' ORDER BY ("name" = 'ISCAR SLOVAKIA') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR SLOVAKIA'), 'ISCAR SLOVAKIA', 'SK', 'EAST EUROPE', 27 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR SLOVAKIA') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR ROMANIA', "region" = 'EAST EUROPE', "position" = 28 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'RO' ORDER BY ("name" = 'ISCAR ROMANIA') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR ROMANIA'), 'ISCAR ROMANIA', 'RO', 'EAST EUROPE', 28 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR ROMANIA') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR SLOVENIJA', "region" = 'EAST EUROPE', "position" = 29 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'SI' ORDER BY ("name" = 'ISCAR SLOVENIJA') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR SLOVENIJA'), 'ISCAR SLOVENIJA', 'SI', 'EAST EUROPE', 29 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR SLOVENIJA') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR CROATIA', "region" = 'EAST EUROPE', "position" = 30 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'HR' ORDER BY ("name" = 'ISCAR CROATIA') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR CROATIA'), 'ISCAR CROATIA', 'HR', 'EAST EUROPE', 30 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR CROATIA') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR BULGARIA', "region" = 'EAST EUROPE', "position" = 31 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'BG' ORDER BY ("name" = 'ISCAR BULGARIA') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR BULGARIA'), 'ISCAR BULGARIA', 'BG', 'EAST EUROPE', 31 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR BULGARIA') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR SERBIA', "region" = 'EAST EUROPE', "position" = 32 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'RS' ORDER BY ("name" = 'ISCAR SERBIA') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR SERBIA'), 'ISCAR SERBIA', 'RS', 'EAST EUROPE', 32 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR SERBIA') ON CONFLICT ("name") DO NOTHING;

-- SOUTH AMERICA
UPDATE "Branch" SET "name" = 'ISCAR BRASIL', "region" = 'SOUTH AMERICA', "position" = 33 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'BR' ORDER BY ("name" = 'ISCAR BRASIL') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR BRASIL'), 'ISCAR BRASIL', 'BR', 'SOUTH AMERICA', 33 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR BRASIL') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR ARGENTINA', "region" = 'SOUTH AMERICA', "position" = 34 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'AR' ORDER BY ("name" = 'ISCAR ARGENTINA') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR ARGENTINA'), 'ISCAR ARGENTINA', 'AR', 'SOUTH AMERICA', 34 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR ARGENTINA') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR COLOMBIA', "region" = 'SOUTH AMERICA', "position" = 35 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'CO' ORDER BY ("name" = 'ISCAR COLOMBIA') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR COLOMBIA'), 'ISCAR COLOMBIA', 'CO', 'SOUTH AMERICA', 35 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR COLOMBIA') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR CHILE', "region" = 'SOUTH AMERICA', "position" = 36 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'CL' ORDER BY ("name" = 'ISCAR CHILE') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR CHILE'), 'ISCAR CHILE', 'CL', 'SOUTH AMERICA', 36 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR CHILE') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR PERU', "region" = 'SOUTH AMERICA', "position" = 37 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'PE' ORDER BY ("name" = 'ISCAR PERU') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR PERU'), 'ISCAR PERU', 'PE', 'SOUTH AMERICA', 37 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR PERU') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR VENEZUELA', "region" = 'SOUTH AMERICA', "position" = 38 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'VE' ORDER BY ("name" = 'ISCAR VENEZUELA') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR VENEZUELA'), 'ISCAR VENEZUELA', 'VE', 'SOUTH AMERICA', 38 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR VENEZUELA') ON CONFLICT ("name") DO NOTHING;

-- PACIFIC
UPDATE "Branch" SET "name" = 'ISCAR AUSTRALIA', "region" = 'PACIFIC', "position" = 39 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'AU' ORDER BY ("name" = 'ISCAR AUSTRALIA') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR AUSTRALIA'), 'ISCAR AUSTRALIA', 'AU', 'PACIFIC', 39 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR AUSTRALIA') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR PACIFIC', "region" = 'PACIFIC', "position" = 40 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'NZ' ORDER BY ("name" = 'ISCAR PACIFIC') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR PACIFIC'), 'ISCAR PACIFIC', 'NZ', 'PACIFIC', 40 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR PACIFIC') ON CONFLICT ("name") DO NOTHING;

-- AFRICA+MID EAST
UPDATE "Branch" SET "name" = 'ISCAR ISRAEL', "region" = 'AFRICA+MID EAST', "position" = 41 WHERE "id" = (SELECT "id" FROM "Branch" WHERE ("name" = 'Israel' OR "name" = 'ISCAR ISRAEL') ORDER BY ("name" = 'ISCAR ISRAEL') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR ISRAEL'), 'ISCAR ISRAEL', 'IL', 'AFRICA+MID EAST', 41 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR ISRAEL') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR S.A', "region" = 'AFRICA+MID EAST', "position" = 42 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'ZA' ORDER BY ("name" = 'ISCAR S.A') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR S.A'), 'ISCAR S.A', 'ZA', 'AFRICA+MID EAST', 42 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR S.A') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "name" = 'ISCAR MAROCCO', "region" = 'AFRICA+MID EAST', "position" = 43 WHERE "id" = (SELECT "id" FROM "Branch" WHERE "country" = 'MA' ORDER BY ("name" = 'ISCAR MAROCCO') DESC, "name" LIMIT 1);
INSERT INTO "Branch" ("id", "name", "country", "region", "position") SELECT 'br-' || md5('ISCAR MAROCCO'), 'ISCAR MAROCCO', 'MA', 'AFRICA+MID EAST', 43 WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'ISCAR MAROCCO') ON CONFLICT ("name") DO NOTHING;
