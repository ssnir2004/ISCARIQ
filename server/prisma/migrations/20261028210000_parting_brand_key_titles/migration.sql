-- Name the BGM and GFT code keys after their brands (ISCAR-PARTING, SLIM-GRIP);
-- titles edited by hand are kept.
UPDATE "AppSetting" SET "value" = jsonb_set("value"::jsonb, '{title}', '"ISCAR-PARTING code key – narrow inserts"')::text
WHERE "key" = 'codekey.bgm' AND "value"::jsonb->>'title' = 'BGM code key – narrow inserts';
UPDATE "AppSetting" SET "value" = jsonb_set("value"::jsonb, '{title}', '"SLIM-GRIP code key – thin inserts"')::text
WHERE "key" = 'codekey.gft' AND "value"::jsonb->>'title' = 'GFT code key – thin inserts';
