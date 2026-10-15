import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma.js";

// Cuts database traffic (Neon bills network transfer) and page weight:
//
// 1. Blobs out of JSON: pictures and files are stored as data URLs in the
//    database. In every JSON response, a data URL becomes "/api/blobs/<hash>"
//    and the data is kept in memory; GET /api/blobs/<hash> serves it with a
//    year-long browser cache. A request body that sends such a URL back
//    (e.g. an unchanged picture in an edit form) gets the data URL again.
//    The address also names the record and field ("?id=…&f=image"), so after
//    a server restart (e.g. Render waking up) a blob the memory no longer
//    has is read again from the database instead of failing.
// 2. Response cache: GET responses under /api are kept in memory and served
//    from there; any successful change (POST, PATCH, PUT, DELETE) clears them.
//    The data GETs don't depend on the user, so one copy serves everyone.

const BLOB_PATH = "/api/blobs/";
const BLOB_URL = /\/api\/blobs\/([0-9a-f]{40})(?:\?id=([^&]+)&f=([^&]+))?$/;
// Shorter data URLs (e.g. tiny icons) stay inline.
const MIN_BLOB = 1024;

const blobs = new Map<string, string>();

function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (v === null || typeof v !== "object") return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
}

const sha1 = (s: string) => crypto.createHash("sha1").update(s).digest("hex");

// Data URLs -> "/api/blobs/<hash>?id=<record id>&f=<field>" (kept in memory).
function externalize(value: unknown, id?: string, field?: string): unknown {
  if (typeof value === "string") {
    if (value.length < MIN_BLOB || !value.startsWith("data:")) return value;
    const hash = sha1(value);
    blobs.set(hash, value);
    return BLOB_PATH + hash + (id && field ? `?id=${encodeURIComponent(id)}&f=${encodeURIComponent(field)}` : "");
  }
  if (Array.isArray(value)) return value.map((v) => externalize(v));
  if (isPlainObject(value)) {
    const ownId = typeof value.id === "string" ? value.id : undefined;
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, externalize(v, ownId, k)]));
  }
  return value;
}

// Models with a text field of this name, for finding a record by id.
function modelsWith(field: string) {
  return Prisma.dmmf.datamodel.models.filter(
    (m) => m.fields.some((f) => f.name === field && f.type === "String") && m.fields.some((f) => f.name === "id" && f.type === "String")
  );
}

// A blob the memory doesn't have (server restarted): read the record's field
// again (ids are unique across tables) and keep it if it still matches.
async function recover(hash: string, id: string | undefined, field: string | undefined) {
  const known = blobs.get(hash);
  if (known !== undefined) return known;
  if (!id || !field || !/^[A-Za-z]\w*$/.test(field)) return undefined;
  for (const model of modelsWith(field)) {
    const delegate = (prisma as unknown as Record<string, { findUnique: (q: unknown) => Promise<Record<string, unknown> | null> }>)[
      model.name[0].toLowerCase() + model.name.slice(1)
    ];
    const row = await delegate?.findUnique({ where: { id }, select: { [field]: true } }).catch(() => null);
    const data = row?.[field];
    if (typeof data === "string" && sha1(data) === hash) {
      blobs.set(hash, data);
      return data;
    }
  }
  return undefined;
}

class UnknownBlob extends Error {}

// Blob URLs sent back -> their data URLs.
async function internalize(value: unknown): Promise<unknown> {
  if (typeof value === "string") {
    const m = value.match(BLOB_URL);
    if (!m) return value;
    const data = await recover(m[1], m[2] && decodeURIComponent(m[2]), m[3] && decodeURIComponent(m[3]));
    if (data === undefined) throw new UnknownBlob();
    return data;
  }
  if (Array.isArray(value)) return Promise.all(value.map(internalize));
  if (isPlainObject(value)) return Object.fromEntries(await Promise.all(Object.entries(value).map(async ([k, v]) => [k, await internalize(v)])));
  return value;
}

// GET /api/blobs/:hash?id=&f= — the picture or file itself.
export async function serveBlob(req: Request, res: Response) {
  const q = (k: string) => (typeof req.query[k] === "string" ? (req.query[k] as string) : undefined);
  const data = await recover(req.params.hash, q("id"), q("f"));
  if (!data) return res.status(404).json({ error: "Not found — reload the page" });
  const m = data.match(/^data:([^;,]*)((?:;[^;,]*)*),/);
  if (!m) return res.status(404).json({ error: "Not found" });
  const body = data.slice(m[0].length);
  const buffer = m[2].includes(";base64") ? Buffer.from(body, "base64") : Buffer.from(decodeURIComponent(body));
  res.set("Content-Type", m[1] || "application/octet-stream");
  // The address is the content's hash, so it never changes.
  res.set("Cache-Control", "private, max-age=31536000, immutable");
  res.send(buffer);
}

const responses = new Map<string, string>();
// Bumped on every change, so a GET that started before it isn't cached.
let generation = 0;

export async function apiCache(req: Request, res: Response, next: NextFunction) {
  if (req.body !== undefined && req.method !== "GET") {
    try {
      req.body = await internalize(req.body);
    } catch (e) {
      if (e instanceof UnknownBlob) return res.status(409).json({ error: "This page is out of date — reload it and try again." });
      throw e;
    }
  }

  if (req.method !== "GET") {
    res.on("finish", () => {
      if (res.statusCode < 400) {
        generation++;
        responses.clear();
      }
    });
  } else {
    const cached = responses.get(req.originalUrl);
    if (cached !== undefined) {
      res.set("X-Cache", "hit");
      res.type("json");
      return res.send(cached);
    }
  }

  const started = generation;
  const json = res.json.bind(res);
  res.json = (body: unknown) => {
    const out = externalize(body);
    if (req.method === "GET" && res.statusCode === 200 && started === generation) responses.set(req.originalUrl, JSON.stringify(out));
    return json(out);
  };
  next();
}
