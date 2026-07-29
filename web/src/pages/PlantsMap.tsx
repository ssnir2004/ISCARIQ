import { useEffect, useRef, useState, type FormEvent, type PointerEvent as ReactPointerEvent } from "react";
import { useResource } from "../lib/useResource";
import { api, ApiError } from "../lib/api";
import type { Plant, PlantMapView } from "../lib/types";
import { Button, Input, Label, Modal, PageHeader, Textarea } from "../components/ui";
import { GERMANY_MAP, WORLD_MAP } from "../lib/mapPaths";

type MapData = { viewBoxWidth: number; viewBoxHeight: number; fill: string; borders: string; highlight?: string };

const VIEWS: { id: PlantMapView; label: string; aspect: string; map: MapData }[] = [
  { id: "WORLD", label: "World", aspect: "aspect-[1000/480]", map: WORLD_MAP },
  { id: "GERMANY", label: "Germany", aspect: "aspect-[700/650]", map: GERMANY_MAP },
];

const EMPTY_FORM = { name: "", regionCode: "", specialties: "" };
const AUTO_LABEL_DY = 5; // percent — default "just below the pin" position when not customized
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function clientToPercent(clientX: number, clientY: number, rect: DOMRect) {
  return {
    x: clamp(((clientX - rect.left) / rect.width) * 100, 0, 100),
    y: clamp(((clientY - rect.top) / rect.height) * 100, 0, 100),
  };
}

function labelOffset(p: Plant) {
  if (p.labelDx === 0 && p.labelDy === 0) return { dx: 0, dy: AUTO_LABEL_DY, auto: true };
  return { dx: p.labelDx, dy: p.labelDy, auto: false };
}

interface DragState {
  kind: "pan" | "pin" | "label";
  id?: string;
  startClientX: number;
  startClientY: number;
  startPanX?: number;
  startPanY?: number;
  moved: boolean;
  pendingX?: number;
  pendingY?: number;
  pendingDx?: number;
  pendingDy?: number;
}

export function PlantsMap() {
  const { data: plants, reload } = useResource<Plant>("/plants");
  const [view, setView] = useState<PlantMapView>("WORLD");
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<DragState | null>(null);

  const [addAt, setAddAt] = useState<{ x: number; y: number } | null>(null);
  const [addForm, setAddForm] = useState(EMPTY_FORM);
  const [addError, setAddError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [detail, setDetail] = useState<Plant | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const viewConfig = VIEWS.find((v) => v.id === view)!;
  const visible = plants.filter((p) => p.mapView === view);

  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [view]);

  function zoomBy(factor: number, center: { x: number; y: number }) {
    setZoom((z) => {
      const newZoom = clamp(z * factor, MIN_ZOOM, MAX_ZOOM);
      setPan((p) => {
        const localX = (center.x - p.x) / z;
        const localY = (center.y - p.y) / z;
        return { x: center.x - localX * newZoom, y: center.y - localY * newZoom };
      });
      return newZoom;
    });
  }

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const center = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      zoomBy(e.deltaY < 0 ? 1.15 : 1 / 1.15, center);
    };
    el.addEventListener("wheel", handler, { passive: false });
    return () => el.removeEventListener("wheel", handler);
  }, []);

  function zoomButton(factor: number) {
    const rect = viewportRef.current?.getBoundingClientRect();
    zoomBy(factor, rect ? { x: rect.width / 2, y: rect.height / 2 } : { x: 0, y: 0 });
  }

  function openDetail(p: Plant) {
    setDetail(p);
    setEditing(false);
    setEditForm({ name: p.name, regionCode: p.regionCode ?? "", specialties: p.specialties ?? "" });
    setEditError(null);
  }

  function startDrag(e: ReactPointerEvent<HTMLElement>, kind: "pan" | "pin" | "label", p?: Plant) {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    const effectiveKind = kind !== "pan" && mode !== "edit" ? "pan" : kind;
    if (effectiveKind === "pan") {
      drag.current = { kind: "pan", startClientX: e.clientX, startClientY: e.clientY, startPanX: pan.x, startPanY: pan.y, moved: false };
    } else if (p) {
      drag.current = {
        kind: effectiveKind,
        id: p.id,
        startClientX: e.clientX,
        startClientY: e.clientY,
        moved: false,
        pendingX: p.x,
        pendingY: p.y,
        pendingDx: p.labelDx,
        pendingDy: p.labelDy,
      };
    }
  }

  function handleMove(e: ReactPointerEvent<HTMLElement>, p?: Plant) {
    const d = drag.current;
    if (!d) return;
    const dxClient = e.clientX - d.startClientX;
    const dyClient = e.clientY - d.startClientY;
    if (!d.moved && Math.hypot(dxClient, dyClient) > 4) d.moved = true;
    if (!d.moved) return;

    if (d.kind === "pan") {
      setPan({ x: (d.startPanX ?? 0) + dxClient, y: (d.startPanY ?? 0) + dyClient });
      return;
    }
    if (!canvasRef.current || !p || d.id !== p.id) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const { x, y } = clientToPercent(e.clientX, e.clientY, rect);
    const target = e.currentTarget;
    if (d.kind === "pin") {
      target.style.left = `${x}%`;
      target.style.top = `${y}%`;
      d.pendingX = x;
      d.pendingY = y;
    } else if (d.kind === "label") {
      target.style.left = `${x}%`;
      target.style.top = `${y}%`;
      d.pendingDx = x - p.x;
      d.pendingDy = y - p.y;
    }
  }

  async function handleUp(e: ReactPointerEvent<HTMLElement>, p?: Plant) {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (!d.moved) {
      if (p) {
        openDetail(p);
      } else if (mode === "edit" && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const { x, y } = clientToPercent(e.clientX, e.clientY, rect);
        setAddAt({ x, y });
        setAddForm(EMPTY_FORM);
        setAddError(null);
      }
      return;
    }
    if (!p) return;
    try {
      if (d.kind === "pin") {
        await api.patch(`/plants/${p.id}`, { x: d.pendingX, y: d.pendingY });
      } else if (d.kind === "label") {
        await api.patch(`/plants/${p.id}`, { labelDx: d.pendingDx, labelDy: d.pendingDy });
      }
      reload();
    } catch {
      reload(); // snap back to the last saved position/offset on failure
    }
  }

  async function onAddSubmit(e: FormEvent) {
    e.preventDefault();
    if (!addAt) return;
    setAddError(null);
    setSubmitting(true);
    try {
      await api.post("/plants", {
        name: addForm.name,
        regionCode: addForm.regionCode || undefined,
        specialties: addForm.specialties || undefined,
        mapView: view,
        x: addAt.x,
        y: addAt.y,
      });
      setAddAt(null);
      reload();
    } catch (err) {
      setAddError(err instanceof ApiError ? err.message : "Failed to add plant");
    } finally {
      setSubmitting(false);
    }
  }

  async function onEditSubmit(e: FormEvent) {
    e.preventDefault();
    if (!detail) return;
    setEditError(null);
    try {
      const updated = await api.patch<Plant>(`/plants/${detail.id}`, {
        name: editForm.name,
        regionCode: editForm.regionCode || undefined,
        specialties: editForm.specialties || undefined,
      });
      setDetail(updated);
      setEditing(false);
      reload();
    } catch (err) {
      setEditError(err instanceof ApiError ? err.message : "Failed to update plant");
    }
  }

  async function removePlant(p: Plant) {
    if (!confirm(`Remove ${p.name} from the map?`)) return;
    try {
      await api.delete(`/plants/${p.id}`);
      if (detail?.id === p.id) setDetail(null);
      reload();
    } catch (err) {
      setEditError(err instanceof ApiError ? err.message : "Failed to remove plant");
    }
  }

  function vbX(pct: number) {
    return (pct / 100) * viewConfig.map.viewBoxWidth;
  }
  function vbY(pct: number) {
    return (pct / 100) * viewConfig.map.viewBoxHeight;
  }

  return (
    <div className="w-full">
      <PageHeader
        title="Schaeffler Plants"
        action={
          <div className="flex items-center gap-3">
            <div className="flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-900">
              {(["view", "edit"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition ${
                    mode === m
                      ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-100"
                      : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            <div className="flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-900">
              {VIEWS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setView(v.id)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    view === v.id
                      ? "bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-100"
                      : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        }
      />

      <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">
        {mode === "edit"
          ? "Click empty map space to add a plant. Drag a pin or its label to reposition. Click a pin to view or edit it. Drag empty space or scroll to pan/zoom."
          : "View only — scroll or drag to pan/zoom. Switch to Edit to add, move, or delete plants."}
      </p>

      <div className="relative mb-2 flex items-center justify-end gap-1">
        <Button type="button" variant="secondary" onClick={() => zoomButton(1 / 1.3)} disabled={zoom <= MIN_ZOOM}>
          −
        </Button>
        <span className="w-12 text-center text-xs text-neutral-500 dark:text-neutral-400">{Math.round(zoom * 100)}%</span>
        <Button type="button" variant="secondary" onClick={() => zoomButton(1.3)} disabled={zoom >= MAX_ZOOM}>
          +
        </Button>
      </div>

      <div
        ref={viewportRef}
        className={`relative w-full ${viewConfig.aspect} min-h-[500px] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950`}
      >
        <div
          ref={canvasRef}
          onPointerDown={(e) => startDrag(e, "pan")}
          onPointerMove={(e) => handleMove(e)}
          onPointerUp={(e) => handleUp(e)}
          className={`absolute inset-0 ${mode === "edit" ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"}`}
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "0 0" }}
        >
          <svg
            viewBox={`0 0 ${viewConfig.map.viewBoxWidth} ${viewConfig.map.viewBoxHeight}`}
            preserveAspectRatio="xMidYMid meet"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <path d={viewConfig.map.fill} className="fill-neutral-300 dark:fill-neutral-800" />
            {viewConfig.map.highlight && <path d={viewConfig.map.highlight} className="fill-amber-700/25 dark:fill-amber-400/20" />}
            <path
              d={viewConfig.map.borders}
              className="fill-none stroke-neutral-400 dark:stroke-neutral-600"
              strokeWidth={0.7}
              vectorEffect="non-scaling-stroke"
            />
            {visible.map((p) => {
              const { dx, dy, auto } = labelOffset(p);
              if (auto) return null;
              return (
                <line
                  key={p.id}
                  x1={vbX(p.x)}
                  y1={vbY(p.y)}
                  x2={vbX(p.x + dx)}
                  y2={vbY(p.y + dy)}
                  className="stroke-emerald-700 dark:stroke-emerald-500"
                  strokeWidth={0.6}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          {visible.map((p) => (
            <button
              key={p.id}
              type="button"
              onPointerDown={(e) => startDrag(e, "pin", p)}
              onPointerMove={(e) => handleMove(e, p)}
              onPointerUp={(e) => handleUp(e, p)}
              className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-emerald-600 shadow outline-none dark:border-neutral-950 ${
                mode === "edit" ? "cursor-grab active:cursor-grabbing" : ""
              }`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            />
          ))}

          {visible.map((p) => {
            const { dx, dy } = labelOffset(p);
            return (
              <button
                key={`${p.id}-label`}
                type="button"
                onPointerDown={(e) => startDrag(e, "label", p)}
                onPointerMove={(e) => handleMove(e, p)}
                onPointerUp={(e) => handleUp(e, p)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-emerald-600 px-1.5 py-0.5 text-[11px] font-medium text-white shadow outline-none ${
                  mode === "edit" ? "cursor-grab active:cursor-grabbing" : ""
                }`}
                style={{ left: `${p.x + dx}%`, top: `${p.y + dy}%` }}
              >
                {p.name}
                {p.regionCode ? ` (${p.regionCode})` : ""}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-100 text-xs uppercase text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-3 py-2">Plant</th>
              <th className="px-3 py-2">Region</th>
              <th className="px-3 py-2">Specialties</th>
              {mode === "edit" && <th className="px-3 py-2"></th>}
            </tr>
          </thead>
          <tbody>
            {visible.map((p) => (
              <tr key={p.id} className="border-t border-neutral-200 dark:border-neutral-800">
                <td className="px-3 py-2">
                  <button
                    type="button"
                    className="underline decoration-dotted underline-offset-2 hover:text-blue-600 dark:hover:text-blue-400"
                    onClick={() => openDetail(p)}
                  >
                    {p.name}
                  </button>
                </td>
                <td className="px-3 py-2">{p.regionCode || "—"}</td>
                <td className="px-3 py-2 max-w-md truncate">{(p.specialties ?? "").split("\n").join(", ") || "—"}</td>
                {mode === "edit" && (
                  <td className="px-3 py-2 text-right">
                    <Button variant="ghost" onClick={() => removePlant(p)}>
                      Delete
                    </Button>
                  </td>
                )}
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-neutral-500 dark:text-neutral-400" colSpan={mode === "edit" ? 4 : 3}>
                  No plants on this map yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {addAt && (
        <Modal title={`Add Plant — ${viewConfig.label}`} onClose={() => setAddAt(null)}>
          <form onSubmit={onAddSubmit} className="space-y-3">
            <div>
              <Label>Name</Label>
              <Input value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} required autoFocus />
            </div>
            <div>
              <Label>Region Code</Label>
              <Input
                value={addForm.regionCode}
                onChange={(e) => setAddForm({ ...addForm, regionCode: e.target.value })}
                placeholder="e.g. RO, BY"
              />
            </div>
            <div>
              <Label>Specialties (one per line)</Label>
              <Textarea
                rows={4}
                value={addForm.specialties}
                onChange={(e) => setAddForm({ ...addForm, specialties: e.target.value })}
              />
            </div>
            {addError && <p className="text-sm text-red-600 dark:text-red-400">{addError}</p>}
            <Button type="submit" disabled={submitting}>
              Add Plant
            </Button>
          </form>
        </Modal>
      )}

      {detail && (
        <Modal
          title={editing ? `Edit — ${detail.name}` : `${detail.name}${detail.regionCode ? ` (${detail.regionCode})` : ""}`}
          onClose={() => setDetail(null)}
        >
          {editing ? (
            <form onSubmit={onEditSubmit} className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
              </div>
              <div>
                <Label>Region Code</Label>
                <Input value={editForm.regionCode} onChange={(e) => setEditForm({ ...editForm, regionCode: e.target.value })} />
              </div>
              <div>
                <Label>Specialties (one per line)</Label>
                <Textarea rows={4} value={editForm.specialties} onChange={(e) => setEditForm({ ...editForm, specialties: e.target.value })} />
              </div>
              {editError && <p className="text-sm text-red-600 dark:text-red-400">{editError}</p>}
              <div className="flex gap-2">
                <Button type="submit">Save</Button>
                <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <ul className="list-inside list-disc space-y-1 text-sm text-neutral-700 dark:text-neutral-300">
                {(detail.specialties ?? "")
                  .split("\n")
                  .filter(Boolean)
                  .map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                {!detail.specialties && <p className="text-neutral-500 dark:text-neutral-400">No specialties listed.</p>}
              </ul>
              {mode === "edit" && (
                <>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Drag this plant's pin or its label on the map to reposition them independently.
                  </p>
                  {editError && <p className="text-sm text-red-600 dark:text-red-400">{editError}</p>}
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => setEditing(true)}>
                      Edit
                    </Button>
                    <Button variant="ghost" onClick={() => removePlant(detail)}>
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
