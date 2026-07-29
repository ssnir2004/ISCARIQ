import { useRef, useState, type FormEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from "react";
import { useResource } from "../lib/useResource";
import { api, ApiError } from "../lib/api";
import type { Plant, PlantMapView } from "../lib/types";
import { Button, Input, Label, Modal, PageHeader, Textarea } from "../components/ui";

const VIEWS: { id: PlantMapView; label: string; height: string }[] = [
  { id: "WORLD", label: "World", height: "h-[440px]" },
  { id: "GERMANY", label: "Germany", height: "h-[560px]" },
];

const EMPTY_FORM = { name: "", regionCode: "", specialties: "" };

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function clientToPercent(clientX: number, clientY: number, rect: DOMRect) {
  return {
    x: clamp(((clientX - rect.left) / rect.width) * 100, 0, 100),
    y: clamp(((clientY - rect.top) / rect.height) * 100, 0, 100),
  };
}

export function PlantsMap() {
  const { data: plants, reload } = useResource<Plant>("/plants");
  const [view, setView] = useState<PlantMapView>("WORLD");
  const canvasRef = useRef<HTMLDivElement | null>(null);

  const [addAt, setAddAt] = useState<{ x: number; y: number } | null>(null);
  const [addForm, setAddForm] = useState(EMPTY_FORM);
  const [addError, setAddError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [detail, setDetail] = useState<Plant | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const drag = useRef<{ id: string; startClientX: number; startClientY: number; moved: boolean } | null>(null);

  const viewConfig = VIEWS.find((v) => v.id === view)!;
  const visible = plants.filter((p) => p.mapView === view);

  function onCanvasClick(e: ReactMouseEvent<HTMLDivElement>) {
    if (e.target !== canvasRef.current) return; // a pin (or its label) was clicked, not empty canvas
    const rect = canvasRef.current!.getBoundingClientRect();
    const { x, y } = clientToPercent(e.clientX, e.clientY, rect);
    setAddAt({ x, y });
    setAddForm(EMPTY_FORM);
    setAddError(null);
  }

  function openDetail(p: Plant) {
    setDetail(p);
    setEditing(false);
    setEditForm({ name: p.name, regionCode: p.regionCode ?? "", specialties: p.specialties ?? "" });
    setEditError(null);
  }

  function onPinPointerDown(e: ReactPointerEvent<HTMLButtonElement>, p: Plant) {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { id: p.id, startClientX: e.clientX, startClientY: e.clientY, moved: false };
  }

  function onPinPointerMove(e: ReactPointerEvent<HTMLButtonElement>) {
    const d = drag.current;
    if (!d || d.id !== (e.currentTarget.dataset.plantId ?? "")) return;
    if (Math.abs(e.clientX - d.startClientX) > 4 || Math.abs(e.clientY - d.startClientY) > 4) {
      d.moved = true;
    }
    if (d.moved && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { x, y } = clientToPercent(e.clientX, e.clientY, rect);
      e.currentTarget.style.left = `${x}%`;
      e.currentTarget.style.top = `${y}%`;
      e.currentTarget.dataset.pendingX = String(x);
      e.currentTarget.dataset.pendingY = String(y);
    }
  }

  async function onPinPointerUp(e: ReactPointerEvent<HTMLButtonElement>, p: Plant) {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (d.moved) {
      const x = Number(e.currentTarget.dataset.pendingX);
      const y = Number(e.currentTarget.dataset.pendingY);
      try {
        await api.patch(`/plants/${p.id}`, { x, y });
        reload();
      } catch {
        reload(); // snap back to the last saved position on failure
      }
    } else {
      openDetail(p);
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

  return (
    <div className="max-w-5xl">
      <PageHeader
        title="Schaeffler Plants"
        action={
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
        }
      />

      <p className="mb-3 text-sm text-neutral-500 dark:text-neutral-400">
        Click anywhere on the map to add a plant. Click a pin to view or edit it, or drag it to reposition.
      </p>

      <div
        ref={canvasRef}
        onClick={onCanvasClick}
        className={`relative w-full ${viewConfig.height} cursor-crosshair overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900`}
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(120,120,120,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,120,120,0.12) 1px, transparent 1px)",
          backgroundSize: "5% 10%",
        }}
      >
        {visible.map((p) => (
          <button
            key={p.id}
            type="button"
            data-plant-id={p.id}
            onPointerDown={(e) => onPinPointerDown(e, p)}
            onPointerMove={onPinPointerMove}
            onPointerUp={(e) => onPinPointerUp(e, p)}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 cursor-grab flex-col items-center gap-1 active:cursor-grabbing"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <span className="h-3 w-3 rounded-full border-2 border-white bg-emerald-600 shadow dark:border-neutral-950" />
            <span className="whitespace-nowrap rounded bg-emerald-600 px-1.5 py-0.5 text-[11px] font-medium text-white shadow">
              {p.name}
              {p.regionCode ? ` (${p.regionCode})` : ""}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-100 text-xs uppercase text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
            <tr>
              <th className="px-3 py-2">Plant</th>
              <th className="px-3 py-2">Region</th>
              <th className="px-3 py-2">Specialties</th>
              <th className="px-3 py-2"></th>
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
                <td className="px-3 py-2 text-right">
                  <Button variant="ghost" onClick={() => removePlant(p)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-neutral-500 dark:text-neutral-400" colSpan={4}>
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
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Drag this plant's pin on the map to reposition it.</p>
              {editError && <p className="text-sm text-red-600 dark:text-red-400">{editError}</p>}
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setEditing(true)}>
                  Edit
                </Button>
                <Button variant="ghost" onClick={() => removePlant(detail)}>
                  Delete
                </Button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
