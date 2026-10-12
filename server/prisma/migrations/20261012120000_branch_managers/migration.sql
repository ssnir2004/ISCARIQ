-- One-time data: ISCAR branch managers from the MySales accounts list
-- (ISCAR rows only; agents and satellite companies are not branches).
-- Existing branches are matched by country (Israel's by name) and get the
-- manager(s); missing countries become new branches. Each manager is also
-- added as a "Branch Manager" contact (once).

-- Argentina (AR): Luis Schmidt
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Argentina'), 'Argentina', 'AR', 'Luis Schmidt' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'AR') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Luis Schmidt' WHERE "country" = 'AR';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Luis Schmidt'), b."id", 'Branch Manager', 'Luis Schmidt', 0 FROM "Branch" b WHERE b."country" = 'AR' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Luis Schmidt'));

-- Australia (AU): Jason Allen
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Australia'), 'Australia', 'AU', 'Jason Allen' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'AU') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Jason Allen' WHERE "country" = 'AU';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Jason Allen'), b."id", 'Branch Manager', 'Jason Allen', 0 FROM "Branch" b WHERE b."country" = 'AU' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Jason Allen'));

-- Austria (AT): Urgen Baumgartner
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Austria'), 'Austria', 'AT', 'Urgen Baumgartner' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'AT') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Urgen Baumgartner' WHERE "country" = 'AT';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Urgen Baumgartner'), b."id", 'Branch Manager', 'Urgen Baumgartner', 0 FROM "Branch" b WHERE b."country" = 'AT' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Urgen Baumgartner'));

-- Belarus (BY): Ovsey Gutfraind, Alexander Bendtovich
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Belarus'), 'Belarus', 'BY', 'Ovsey Gutfraind, Alexander Bendtovich' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'BY') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Ovsey Gutfraind, Alexander Bendtovich' WHERE "country" = 'BY';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Ovsey Gutfraind'), b."id", 'Branch Manager', 'Ovsey Gutfraind', 0 FROM "Branch" b WHERE b."country" = 'BY' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Ovsey Gutfraind'));
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Alexander Bendtovich'), b."id", 'Branch Manager', 'Alexander Bendtovich', 1 FROM "Branch" b WHERE b."country" = 'BY' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Alexander Bendtovich'));

-- Belgium (BE): Stefaan Deprez
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Belgium'), 'Belgium', 'BE', 'Stefaan Deprez' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'BE') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Stefaan Deprez' WHERE "country" = 'BE';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Stefaan Deprez'), b."id", 'Branch Manager', 'Stefaan Deprez', 0 FROM "Branch" b WHERE b."country" = 'BE' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Stefaan Deprez'));

-- Brazil (BR): Leonardo Barbosa
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Brazil'), 'Brazil', 'BR', 'Leonardo Barbosa' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'BR') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Leonardo Barbosa' WHERE "country" = 'BR';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Leonardo Barbosa'), b."id", 'Branch Manager', 'Leonardo Barbosa', 0 FROM "Branch" b WHERE b."country" = 'BR' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Leonardo Barbosa'));

-- Bulgaria (BG): Tsvetan Apostolov
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Bulgaria'), 'Bulgaria', 'BG', 'Tsvetan Apostolov' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'BG') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Tsvetan Apostolov' WHERE "country" = 'BG';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Tsvetan Apostolov'), b."id", 'Branch Manager', 'Tsvetan Apostolov', 0 FROM "Branch" b WHERE b."country" = 'BG' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Tsvetan Apostolov'));

-- Canada (CA): Tom Hagan
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Canada'), 'Canada', 'CA', 'Tom Hagan' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'CA') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Tom Hagan' WHERE "country" = 'CA';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Tom Hagan'), b."id", 'Branch Manager', 'Tom Hagan', 0 FROM "Branch" b WHERE b."country" = 'CA' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Tom Hagan'));

-- China (CN): Li YuPu
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('China'), 'China', 'CN', 'Li YuPu' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'CN') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Li YuPu' WHERE "country" = 'CN';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Li YuPu'), b."id", 'Branch Manager', 'Li YuPu', 0 FROM "Branch" b WHERE b."country" = 'CN' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Li YuPu'));

-- Colombia (CO): Ivan Campos
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Colombia'), 'Colombia', 'CO', 'Ivan Campos' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'CO') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Ivan Campos' WHERE "country" = 'CO';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Ivan Campos'), b."id", 'Branch Manager', 'Ivan Campos', 0 FROM "Branch" b WHERE b."country" = 'CO' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Ivan Campos'));

-- Croatia (HR): Marino Peric
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Croatia'), 'Croatia', 'HR', 'Marino Peric' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'HR') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Marino Peric' WHERE "country" = 'HR';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Marino Peric'), b."id", 'Branch Manager', 'Marino Peric', 0 FROM "Branch" b WHERE b."country" = 'HR' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Marino Peric'));

-- Czech Republic (CZ): Miroslav Řehoř
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Czech Republic'), 'Czech Republic', 'CZ', 'Miroslav Řehoř' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'CZ') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Miroslav Řehoř' WHERE "country" = 'CZ';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Miroslav Řehoř'), b."id", 'Branch Manager', 'Miroslav Řehoř', 0 FROM "Branch" b WHERE b."country" = 'CZ' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Miroslav Řehoř'));

-- United Arab Emirates (AE): Nimish Gandhi
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('United Arab Emirates'), 'United Arab Emirates', 'AE', 'Nimish Gandhi' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'AE') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Nimish Gandhi' WHERE "country" = 'AE';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Nimish Gandhi'), b."id", 'Branch Manager', 'Nimish Gandhi', 0 FROM "Branch" b WHERE b."country" = 'AE' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Nimish Gandhi'));

-- Finland (FI): Simo Luotonen
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Finland'), 'Finland', 'FI', 'Simo Luotonen' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'FI') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Simo Luotonen' WHERE "country" = 'FI';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Simo Luotonen'), b."id", 'Branch Manager', 'Simo Luotonen', 0 FROM "Branch" b WHERE b."country" = 'FI' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Simo Luotonen'));

-- France (FR): Frederic BONNARANG
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('France'), 'France', 'FR', 'Frederic BONNARANG' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'FR') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Frederic BONNARANG' WHERE "country" = 'FR';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Frederic BONNARANG'), b."id", 'Branch Manager', 'Frederic BONNARANG', 0 FROM "Branch" b WHERE b."country" = 'FR' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Frederic BONNARANG'));

-- Germany (DE): Hans-Juergen Buechner
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Germany'), 'Germany', 'DE', 'Hans-Juergen Buechner' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'DE') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Hans-Juergen Buechner' WHERE "country" = 'DE';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Hans-Juergen Buechner'), b."id", 'Branch Manager', 'Hans-Juergen Buechner', 0 FROM "Branch" b WHERE b."country" = 'DE' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Hans-Juergen Buechner'));

-- Hungary (HU): Istvan Molnar
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Hungary'), 'Hungary', 'HU', 'Istvan Molnar' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'HU') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Istvan Molnar' WHERE "country" = 'HU';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Istvan Molnar'), b."id", 'Branch Manager', 'Istvan Molnar', 0 FROM "Branch" b WHERE b."country" = 'HU' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Istvan Molnar'));

-- India (IN): Chalapathi Rao
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('India'), 'India', 'IN', 'Chalapathi Rao' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'IN') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Chalapathi Rao' WHERE "country" = 'IN';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Chalapathi Rao'), b."id", 'Branch Manager', 'Chalapathi Rao', 0 FROM "Branch" b WHERE b."country" = 'IN' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Chalapathi Rao'));

-- Israel (IL): Meir Noybauer
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Israel'), 'Israel', 'IL', 'Meir Noybauer' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'Israel') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Meir Noybauer' WHERE "name" = 'Israel';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Meir Noybauer'), b."id", 'Branch Manager', 'Meir Noybauer', 0 FROM "Branch" b WHERE b."name" = 'Israel' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Meir Noybauer'));

-- Israel (Zurim Tools) (IL): Kobi Kissos
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Israel (Zurim Tools)'), 'Israel (Zurim Tools)', 'IL', 'Kobi Kissos' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'Israel (Zurim Tools)') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Kobi Kissos' WHERE "name" = 'Israel (Zurim Tools)';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Kobi Kissos'), b."id", 'Branch Manager', 'Kobi Kissos', 0 FROM "Branch" b WHERE b."name" = 'Israel (Zurim Tools)' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Kobi Kissos'));

-- Italy (IT): Davide Pedrini
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Italy'), 'Italy', 'IT', 'Davide Pedrini' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'IT') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Davide Pedrini' WHERE "country" = 'IT';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Davide Pedrini'), b."id", 'Branch Manager', 'Davide Pedrini', 0 FROM "Branch" b WHERE b."country" = 'IT' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Davide Pedrini'));

-- Japan (JP): Komiya Nobuyuki, OKADA Kazunari
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Japan'), 'Japan', 'JP', 'Komiya Nobuyuki, OKADA Kazunari' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'JP') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Komiya Nobuyuki, OKADA Kazunari' WHERE "country" = 'JP';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Komiya Nobuyuki'), b."id", 'Branch Manager', 'Komiya Nobuyuki', 0 FROM "Branch" b WHERE b."country" = 'JP' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Komiya Nobuyuki'));
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'OKADA Kazunari'), b."id", 'Branch Manager', 'OKADA Kazunari', 1 FROM "Branch" b WHERE b."country" = 'JP' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('OKADA Kazunari'));

-- Kazakhstan (KZ): Siarhei Klemets
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Kazakhstan'), 'Kazakhstan', 'KZ', 'Siarhei Klemets' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'KZ') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Siarhei Klemets' WHERE "country" = 'KZ';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Siarhei Klemets'), b."id", 'Branch Manager', 'Siarhei Klemets', 0 FROM "Branch" b WHERE b."country" = 'KZ' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Siarhei Klemets'));

-- Korea (KR): Bang, Hyo Pil
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Korea'), 'Korea', 'KR', 'Bang, Hyo Pil' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'KR') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Bang, Hyo Pil' WHERE "country" = 'KR';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Bang, Hyo Pil'), b."id", 'Branch Manager', 'Bang, Hyo Pil', 0 FROM "Branch" b WHERE b."country" = 'KR' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Bang, Hyo Pil'));

-- Mexico (MX): Arturo Monroy
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Mexico'), 'Mexico', 'MX', 'Arturo Monroy' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'MX') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Arturo Monroy' WHERE "country" = 'MX';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Arturo Monroy'), b."id", 'Branch Manager', 'Arturo Monroy', 0 FROM "Branch" b WHERE b."country" = 'MX' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Arturo Monroy'));

-- Morocco (MA): -
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Morocco'), 'Morocco', 'MA', NULL WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'MA') ON CONFLICT ("name") DO NOTHING;

-- Netherlands (NL): Rogier ten Brug
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Netherlands'), 'Netherlands', 'NL', 'Rogier ten Brug' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'NL') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Rogier ten Brug' WHERE "country" = 'NL';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Rogier ten Brug'), b."id", 'Branch Manager', 'Rogier ten Brug', 0 FROM "Branch" b WHERE b."country" = 'NL' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Rogier ten Brug'));

-- New Zealand (NZ): Nathan Stronge - Pacific
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('New Zealand'), 'New Zealand', 'NZ', 'Nathan Stronge - Pacific' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'NZ') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Nathan Stronge - Pacific' WHERE "country" = 'NZ';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Nathan Stronge - Pacific'), b."id", 'Branch Manager', 'Nathan Stronge - Pacific', 0 FROM "Branch" b WHERE b."country" = 'NZ' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Nathan Stronge - Pacific'));

-- Poland (PL): Robert Zielinsky
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Poland'), 'Poland', 'PL', 'Robert Zielinsky' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'PL') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Robert Zielinsky' WHERE "country" = 'PL';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Robert Zielinsky'), b."id", 'Branch Manager', 'Robert Zielinsky', 0 FROM "Branch" b WHERE b."country" = 'PL' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Robert Zielinsky'));

-- Portugal (PT): Juan Seculi
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Portugal'), 'Portugal', 'PT', 'Juan Seculi' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'PT') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Juan Seculi' WHERE "country" = 'PT';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Juan Seculi'), b."id", 'Branch Manager', 'Juan Seculi', 0 FROM "Branch" b WHERE b."country" = 'PT' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Juan Seculi'));

-- Romania (RO): Radu Sirbu, Sorin Gabriel
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Romania'), 'Romania', 'RO', 'Radu Sirbu, Sorin Gabriel' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'RO') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Radu Sirbu, Sorin Gabriel' WHERE "country" = 'RO';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Radu Sirbu'), b."id", 'Branch Manager', 'Radu Sirbu', 0 FROM "Branch" b WHERE b."country" = 'RO' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Radu Sirbu'));
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Sorin Gabriel'), b."id", 'Branch Manager', 'Sorin Gabriel', 1 FROM "Branch" b WHERE b."country" = 'RO' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Sorin Gabriel'));

-- Russia (RU): Alex Kunin
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Russia'), 'Russia', 'RU', 'Alex Kunin' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'RU') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Alex Kunin' WHERE "country" = 'RU';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Alex Kunin'), b."id", 'Branch Manager', 'Alex Kunin', 0 FROM "Branch" b WHERE b."country" = 'RU' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Alex Kunin'));

-- South Africa (ZA): Gavin Adams
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('South Africa'), 'South Africa', 'ZA', 'Gavin Adams' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'ZA') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Gavin Adams' WHERE "country" = 'ZA';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Gavin Adams'), b."id", 'Branch Manager', 'Gavin Adams', 0 FROM "Branch" b WHERE b."country" = 'ZA' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Gavin Adams'));

-- Serbia (RS): Željko Vlašić
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Serbia'), 'Serbia', 'RS', 'Željko Vlašić' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'RS') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Željko Vlašić' WHERE "country" = 'RS';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Željko Vlašić'), b."id", 'Branch Manager', 'Željko Vlašić', 0 FROM "Branch" b WHERE b."country" = 'RS' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Željko Vlašić'));

-- Slovakia (SK): Branislav Šefčovič
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Slovakia'), 'Slovakia', 'SK', 'Branislav Šefčovič' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'SK') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Branislav Šefčovič' WHERE "country" = 'SK';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Branislav Šefčovič'), b."id", 'Branch Manager', 'Branislav Šefčovič', 0 FROM "Branch" b WHERE b."country" = 'SK' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Branislav Šefčovič'));

-- Slovenia & Bosnia (SI): Mirko praprotnik
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Slovenia & Bosnia'), 'Slovenia & Bosnia', 'SI', 'Mirko praprotnik' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'SI') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Mirko praprotnik' WHERE "country" = 'SI';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Mirko praprotnik'), b."id", 'Branch Manager', 'Mirko praprotnik', 0 FROM "Branch" b WHERE b."country" = 'SI' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Mirko praprotnik'));

-- Spain (ES): Juan Seculi
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Spain'), 'Spain', 'ES', 'Juan Seculi' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'ES') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Juan Seculi' WHERE "country" = 'ES';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Juan Seculi'), b."id", 'Branch Manager', 'Juan Seculi', 0 FROM "Branch" b WHERE b."country" = 'ES' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Juan Seculi'));

-- Sweden (SE): Hannes Strache
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Sweden'), 'Sweden', 'SE', 'Hannes Strache' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'SE') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Hannes Strache' WHERE "country" = 'SE';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Hannes Strache'), b."id", 'Branch Manager', 'Hannes Strache', 0 FROM "Branch" b WHERE b."country" = 'SE' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Hannes Strache'));

-- Switzerland (CH): Hans-Juergen Buechner
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Switzerland'), 'Switzerland', 'CH', 'Hans-Juergen Buechner' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'CH') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Hans-Juergen Buechner' WHERE "country" = 'CH';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Hans-Juergen Buechner'), b."id", 'Branch Manager', 'Hans-Juergen Buechner', 0 FROM "Branch" b WHERE b."country" = 'CH' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Hans-Juergen Buechner'));

-- Taiwan (TW): Arthur Chen
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Taiwan'), 'Taiwan', 'TW', 'Arthur Chen' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'TW') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Arthur Chen' WHERE "country" = 'TW';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Arthur Chen'), b."id", 'Branch Manager', 'Arthur Chen', 0 FROM "Branch" b WHERE b."country" = 'TW' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Arthur Chen'));

-- Thailand (TH): Yuthana Thanabhusest
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Thailand'), 'Thailand', 'TH', 'Yuthana Thanabhusest' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'TH') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Yuthana Thanabhusest' WHERE "country" = 'TH';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Yuthana Thanabhusest'), b."id", 'Branch Manager', 'Yuthana Thanabhusest', 0 FROM "Branch" b WHERE b."country" = 'TH' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Yuthana Thanabhusest'));

-- Israel (Tel Aviv) (IL): Kobi Kissos
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Israel (Tel Aviv)'), 'Israel (Tel Aviv)', 'IL', 'Kobi Kissos' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "name" = 'Israel (Tel Aviv)') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Kobi Kissos' WHERE "name" = 'Israel (Tel Aviv)';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Kobi Kissos'), b."id", 'Branch Manager', 'Kobi Kissos', 0 FROM "Branch" b WHERE b."name" = 'Israel (Tel Aviv)' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Kobi Kissos'));

-- Turkey (TR): Deniz Demirtas
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Turkey'), 'Turkey', 'TR', 'Deniz Demirtas' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'TR') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Deniz Demirtas' WHERE "country" = 'TR';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Deniz Demirtas'), b."id", 'Branch Manager', 'Deniz Demirtas', 0 FROM "Branch" b WHERE b."country" = 'TR' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Deniz Demirtas'));

-- United Kingdom (GB): David Jones
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('United Kingdom'), 'United Kingdom', 'GB', 'David Jones' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'GB') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'David Jones' WHERE "country" = 'GB';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'David Jones'), b."id", 'Branch Manager', 'David Jones', 0 FROM "Branch" b WHERE b."country" = 'GB' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('David Jones'));

-- Ukraine (UA): Alexander Mironenko
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Ukraine'), 'Ukraine', 'UA', 'Alexander Mironenko' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'UA') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Alexander Mironenko' WHERE "country" = 'UA';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Alexander Mironenko'), b."id", 'Branch Manager', 'Alexander Mironenko', 0 FROM "Branch" b WHERE b."country" = 'UA' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Alexander Mironenko'));

-- USA (US): Andrew Benson, Reggie Lowder
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('USA'), 'USA', 'US', 'Andrew Benson, Reggie Lowder' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'US') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Andrew Benson, Reggie Lowder' WHERE "country" = 'US';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Andrew Benson'), b."id", 'Branch Manager', 'Andrew Benson', 0 FROM "Branch" b WHERE b."country" = 'US' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Andrew Benson'));
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Reggie Lowder'), b."id", 'Branch Manager', 'Reggie Lowder', 1 FROM "Branch" b WHERE b."country" = 'US' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Reggie Lowder'));

-- Vietnam (VN): Quoc Nguyen Van
INSERT INTO "Branch" ("id", "name", "country", "managerName") SELECT 'br-' || md5('Vietnam'), 'Vietnam', 'VN', 'Quoc Nguyen Van' WHERE NOT EXISTS (SELECT 1 FROM "Branch" WHERE "country" = 'VN') ON CONFLICT ("name") DO NOTHING;
UPDATE "Branch" SET "managerName" = 'Quoc Nguyen Van' WHERE "country" = 'VN';
INSERT INTO "BranchContact" ("id", "branchId", "role", "name", "position") SELECT 'bc-' || md5(b."id" || 'Quoc Nguyen Van'), b."id", 'Branch Manager', 'Quoc Nguyen Van', 0 FROM "Branch" b WHERE b."country" = 'VN' AND NOT EXISTS (SELECT 1 FROM "BranchContact" c WHERE c."branchId" = b."id" AND lower(c."name") = lower('Quoc Nguyen Van'));
