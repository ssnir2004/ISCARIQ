import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";

// Cuts database traffic (Neon bills network transfer) and page weight:
//
// 1. Blobs out of JSON: pictures and files are stored as data URLs in the
//    database. In every JSON response, a data URL becomes "/api/blobs/<hash>"
//    and the data is kept in memory; GET /api/blobs/<hash> serves it with a
//    year-long browser cache. A request body that sends such a URL back
//    (e.g. an unchanged picture in an edit form) gets the data URL again.
// 2. Response cache: GET responses under /api are kept in memory and served
//    from there; any successful change (POST, PATCH, PUT, DELETE) clears them.
//    The data GETs don't depend on the user, so one copy serves everyone.

const BLOB_PATH = "/api/blobs/";
const BLOB_URL = /\/api\/blobs\/([0-9a-f]{40})$/;
// Shorter data URLs (e.g. tiny icons) stay inline.
const MIN_BLOB = 1024;

const blobs = new Map<string, string>();

function isPlainObject(v: unknown): v is Record<string, unknown> {
  if (v === null || typeof v !== "object") return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
}

// Data URLs -> "/api/blobs/<hash>" (kept in memory).
function externalize(value: unknown): unknown {
  if (typeof value === "string") {
    if (value.length < MIN_BLOB || !value.startsWith("data:")) return value;
    const hash = crypto.createHash("sha1").update(value).digest("hex");
    blobs.set(hash, value);
    return BLOB_PATH + hash;
  }
  if (Array.isArray(value)) return value.map(externalize);
  if (isPlainObject(value)) return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, externalize(v)]));
  return value;
}

class UnknownBlob extends Error {}

// Blob URLs sent back -> their data URLs.
function internalize(value: unknown): unknown {
  if (typeof value === "string") {
    const m = value.match(BLOB_URL);
    if (!m) return value;
    const data = blobs.get(m[1]);
    if (data === undefined) throw new UnknownBlob();
    return data;
  }
  if (Array.isArray(value)) return value.map(internalize);
  if (isPlainObject(value)) return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, internalize(v)]));
  return value;
}

// GET /api/blobs/:hash — the picture or file itself.
export function serveBlob(req: Request, res: Response) {
  const data = blobs.get(req.params.hash);
  // Unknown after a server restart: reloading the page lists it again.
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

export function apiCache(req: Request, res: Response, next: NextFunction) {
  if (req.body !== undefined && req.method !== "GET") {
    try {
      req.body = internalize(req.body);
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
