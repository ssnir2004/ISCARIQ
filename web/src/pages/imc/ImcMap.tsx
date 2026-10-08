import { geoArea, geoCentroid, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import * as Flags from "country-flag-icons/string/3x2";
import world from "world-atlas/countries-110m.json";
import { countryCode, splitCountries, type ImcCompanyLite } from "./imcCountries";

// World map of the IMC companies, in the style of the group's "worldwide"
// slide: blue countries, a yellow dot per country that has companies, and a
// label (flag + company names) above or below the map joined to the dot by
// a leader line. Positions are approximate (the country's main landmass),
// which is all the slide needs. Loaded on demand (the map data and flags are
// large).

countries.registerLocale(en);

const W = 1000;
const MAP_TOP = 96;
const MAP_BOTTOM = 516;
const H = 612;
const TOP_LINE = 86; // labels above the map end here
const BOTTOM_LINE = 526; // labels below the map start here
const LINE_H = 13;

type Shape = Feature<Polygon | MultiPolygon, { name: string }>;

const land = feature(world as unknown as Topology, (world as unknown as Topology).objects.countries as GeometryCollection) as unknown as FeatureCollection<
  Polygon | MultiPolygon,
  { name: string }
>;
// No Antarctica (numeric id 010).
const shapes = land.features.filter((f) => String(f.id) !== "010") as Shape[];
const projection = geoNaturalEarth1().fitExtent(
  [
    [10, MAP_TOP],
    [W - 10, MAP_BOTTOM],
  ],
  { type: "FeatureCollection", features: shapes }
);
const path = geoPath(projection);

// Small countries missing from the low-detail map: [lon, lat].
const EXTRA_POINTS: Record<string, [number, number]> = {
  SG: [103.8, 1.35],
  HK: [114.17, 22.3],
  LU: [6.13, 49.61],
  MT: [14.4, 35.9],
  BH: [50.55, 26.05],
};

// A country's dot: the centre of its largest landmass (so e.g. France isn't
// pulled towards French Guiana).
const pointCache = new Map<string, [number, number] | null>();
function pointOf(code: string): [number, number] | null {
  if (pointCache.has(code)) return pointCache.get(code)!;
  let lonLat: [number, number] | null = EXTRA_POINTS[code] ?? null;
  const shape = shapes.find((f) => countries.numericToAlpha2(String(f.id)) === code);
  if (shape) {
    const polygons: Feature<Polygon>[] =
      shape.geometry.type === "Polygon"
        ? [{ type: "Feature", properties: {}, geometry: shape.geometry }]
        : shape.geometry.coordinates.map((c) => ({ type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: c } }));
    const biggest = polygons.reduce((a, b) => (geoArea(b) > geoArea(a) ? b : a));
    lonLat = geoCentroid(biggest) as [number, number];
  }
  const xy = lonLat ? (projection(lonLat) as [number, number] | null) : null;
  pointCache.set(code, xy);
  return xy;
}

function flagUri(code: string) {
  const svg = (Flags as Record<string, string>)[code];
  return svg ? `data:image/svg+xml;utf8,${encodeURIComponent(svg)}` : null;
}

type Label = { code: string; x: number; y: number; names: string[]; w: number; h: number; bx: number; top: boolean };

const GAP = 10;

// Place labels in the band above or below the map, left to right in the
// order of their dots, each as close above/below its dot as the labels
// before it allow: a label goes to the band where it has to move sideways
// less (its own half of the map breaking ties), so the bands share the load
// and leaders stay short. Then nothing may run past the right edge.
function layout(labels: Label[]) {
  labels.sort((a, b) => a.x - b.x);
  const right = { top: 4 - GAP, bottom: 4 - GAP };
  for (const l of labels) {
    const want = l.x - 12;
    const topX = Math.max(want, right.top + GAP);
    const bottomX = Math.max(want, right.bottom + GAP);
    const preferTop = l.y < (MAP_TOP + MAP_BOTTOM) / 2;
    const top = topX - want < bottomX - want || (topX - want === bottomX - want && preferTop);
    l.top = top;
    l.bx = top ? topX : bottomX;
    right[top ? "top" : "bottom"] = l.bx + l.w;
  }
  for (const band of [true, false]) {
    let bound = W - 4;
    for (const l of labels.filter((x) => x.top === band).reverse()) {
      l.bx = Math.min(l.bx, bound - l.w);
      bound = l.bx - GAP;
    }
  }
}

export default function ImcMap({ companies }: { companies: ImcCompanyLite[] }) {
  // Companies per country code (a company with several countries is in each).
  const byCode = new Map<string, string[]>();
  const unplaced: string[] = [];
  for (const c of companies) {
    const parts = splitCountries(c.country);
    for (const part of parts) {
      const code = countryCode(part);
      if (code && pointOf(code)) byCode.set(code, [...(byCode.get(code) ?? []), c.name]);
      else unplaced.push(`${c.name} (${part})`);
    }
  }

  const labels: Label[] = [...byCode.entries()].map(([code, names]) => {
    const [x, y] = pointOf(code)!;
    const sorted = [...new Set(names)].sort((a, b) => a.localeCompare(b));
    const longest = Math.max(...sorted.map((n) => n.length));
    return { code, x, y, names: sorted, w: 28 + longest * 7.6, h: sorted.length * LINE_H + 4, bx: 0, top: true };
  });
  layout(labels);

  return (
    <div className="mx-auto max-w-3xl space-y-2" data-imc-map>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded-xl bg-white dark:bg-neutral-100" role="img" aria-label="IMC companies world map">
        {shapes.map((f, i) => (
          <path key={i} d={path(f) ?? undefined} fill="#2f80d1" stroke="#ffffff" strokeWidth={0.4} />
        ))}
        {labels.map((l) => {
          const by = l.top ? TOP_LINE - l.h : BOTTOM_LINE;
          // The flag sits on the label's line nearest the map.
          const midY = l.top ? TOP_LINE - LINE_H / 2 - 2 : BOTTOM_LINE + LINE_H / 2 + 2;
          // Leader: from the dot to a lane in the gap between map and labels
          // (three staggered lanes so neighbours' lines don't merge), across
          // to below/above the flag, then into it, never over label text.
          const bandIndex = labels.filter((x) => x.top === l.top).indexOf(l);
          const lane = l.top ? TOP_LINE + 3 + (bandIndex % 3) * 2.5 : BOTTOM_LINE - 3 - (bandIndex % 3) * 2.5;
          const flagX = l.bx + 9;
          const flagEdge = l.top ? midY + 6 : midY - 6;
          const flag = flagUri(l.code);
          const country = countries.getName(l.code, "en") ?? l.code;
          return (
            <g key={l.code} data-map-label={l.code}>
              <path d={`M${l.x},${l.y} V${lane} H${flagX} V${flagEdge}`} fill="none" stroke="#f5c400" strokeWidth={1.2} />
              <circle cx={l.x} cy={l.y} r={4.2} fill="#f5c400" stroke="#ffffff" strokeWidth={1} />
              {flag ? (
                <image href={flag} x={l.bx} y={midY - 6} width={18} height={12} preserveAspectRatio="none">
                  <title>{country}</title>
                </image>
              ) : (
                <text x={l.bx} y={midY + 4} fontSize={10} fontWeight={700} fill="#1f2937">
                  {l.code}
                </text>
              )}
              {l.names.map((n, i) => (
                <text key={n} x={l.bx + 24} y={by + 12 + i * LINE_H} fontSize={11} fontWeight={700} fill="#111827" style={{ textTransform: "uppercase" }}>
                  {l.names.length > 1 ? `• ${n}` : n}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
      {unplaced.length > 0 && (
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Not on the map (check the country name): {unplaced.join(", ")}
        </p>
      )}
    </div>
  );
}
