-- One-time: e-catalog links for the PICCO-CUT and TANG-GRIP inserts (their
-- family pages on the ISCAR intranet e-catalog). Only inserts without a link
-- get one; names are matched ignoring case.
UPDATE "InnovationUse" u
SET "inserts" = (
  SELECT jsonb_agg(
    CASE WHEN coalesce(e ->> 'link', '') = '' AND l."url" IS NOT NULL THEN e || jsonb_build_object('link', l."url") ELSE e END
    ORDER BY t.i)
  FROM jsonb_array_elements(u."inserts") WITH ORDINALITY AS t(e, i)
  LEFT JOIN (VALUES
  ($l$PICCO R/L 090$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1741&mapp=IS&GFSTYP=M'),
  ($l$PICCO R/L 520$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3045&mapp=TG&GFSTYP=M'),
  ($l$PICCO R/L-60°-Thread$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=539&mapp=TH&GFSTYP=M'),
  ($l$PICCO R/LHD 050$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3872&mapp=IS&GFSTYP=M'),
  ($l$PICCO R/LM$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3873&mapp=TG&GFSTYP=M'),
  ($l$PICCO-010$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2486&mapp=TG&GFSTYP=M'),
  ($l$PICCO-010/610$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=928&mapp=TG&GFSTYP=M'),
  ($l$PICCO-015$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2546&mapp=TG&GFSTYP=M'),
  ($l$PICCO-016/020$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2979&mapp=TG&GFSTYP=M'),
  ($l$PICCO-55°-Thread$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1173&mapp=TH&GFSTYP=M'),
  ($l$PICCO-620$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2487&mapp=TG&GFSTYP=M'),
  ($l$PICCO R/LX050$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3779&mapp=IS&GFSTYP=M'),
  ($l$PICCO ISO Full Profile$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3048&mapp=TH&GFSTYP=M'),
  ($l$PICCO ISO Full Profile Fine$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3053&mapp=TH&GFSTYP=M'),
  ($l$PICCO R 050$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3046&mapp=IS&GFSTYP=M'),
  ($l$PICCO R 050.20$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3177&mapp=TG&GFSTYP=M'),
  ($l$PICCO R/L 002-007$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=532&mapp=TG&GFSTYP=M'),
  ($l$PICCO R/L 004-007$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1740&mapp=TG&GFSTYP=M'),
  ($l$PICCO R/L 047$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3047&mapp=IS&GFSTYP=M'),
  ($l$PICCO R/L 050, 053, 055$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=531&mapp=IS&GFSTYP=M'),
  ($l$PICCO R/L 050-C$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3044&mapp=IS&GFSTYP=M'),
  ($l$PICCO R/L 060$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=537&mapp=TG&GFSTYP=M'),
  ($l$PICCO R/L 070$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=538&mapp=TG&GFSTYP=M'),
  ($l$PICCO R/L 080$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=1873&mapp=TG&GFSTYP=M'),
  ($l$TAG N-C$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5437&mapp=TG&GFSTYP=M'),
  ($l$TAG N-T$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=5455&mapp=TG&GFSTYP=M'),
  ($l$TAG N-A$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3011&mapp=TG&GFSTYP=M'),
  ($l$TAG N-C/W/M$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2334&mapp=TG&GFSTYP=M'),
  ($l$TAG N-J/JS/JT$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2335&mapp=TG&GFSTYP=M'),
  ($l$TAG N-LF$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3480&mapp=TG&GFSTYP=M'),
  ($l$TAG N-MF$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=3483&mapp=TG&GFSTYP=M'),
  ($l$TAG N-UT$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2960&mapp=TG&GFSTYP=M'),
  ($l$TAG R/L-C$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2393&mapp=TG&GFSTYP=M'),
  ($l$TAG R/L-J/JS$l$, 'https://intranet.imc.co.il/eCatalog/Family.aspx?fnum=2394&mapp=TG&GFSTYP=M')
  ) AS l("name", "url") ON upper(trim(e ->> 'name')) = upper(l."name")
)
WHERE u."innovationId" IN (SELECT "id" FROM "Innovation" WHERE "name" IN ('PICCO-CUT', 'TANG-GRIP'))
  AND jsonb_array_length(u."inserts") > 0;
