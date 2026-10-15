import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui";
import { PictureCases } from "../components/cases/PictureCases";
import { api, ApiError } from "../lib/api";
import { PARTS, str } from "./Innovations";
import { SolutionUses } from "./SolutionUses";
import { SolutionBrandEdit, type BrandDetails } from "./SolutionBrandEdit";

// A solution (brand) page: its picture and details (editable here), its
// uses (with their inserts) and its cases (see PictureCases).

type Brand = BrandDetails;

export function SolutionView() {
  const { id } = useParams();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingBrand, setEditingBrand] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get<Brand>(`/innovations/${id}`)
      .then((b) => {
        setBrand(b);
        document.title = `${b.name} — Solutions`;
      })
      .catch((err) => setError(err instanceof ApiError && err.status === 404 ? "This solution no longer exists." : "Failed to load the solution."));
  }, [id]);

  // Restore the app's tab title on leaving the page.
  useEffect(() => {
    const title = document.title;
    return () => {
      document.title = title;
    };
  }, []);

  async function removeBrand() {
    if (!brand || !confirm(`Delete ${brand.name}? It is removed from Innovations and every application, with its uses and cases.`)) return;
    try {
      await api.delete(`/innovations/${brand.id}`);
      navigate("/solutions");
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to delete the brand");
    }
  }

  if (!brand) return <p className="text-sm text-neutral-500 dark:text-neutral-400">{error ?? "Loading…"}</p>;

  const year = typeof brand.year === "number" ? brand.year : null;
  const parts = PARTS.filter((p) => str(brand[p.key]));

  return (
    <div className="max-w-6xl" data-solution-view={brand.name}>
      <Link to="/solutions" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
        ← Solutions
      </Link>
      <article className="mt-3 flex flex-col gap-5 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm md:flex-row dark:border-neutral-800 dark:bg-neutral-900">
        <span className="flex h-64 w-full shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-neutral-200 md:w-80 dark:ring-neutral-700">
          {brand.image ? (
            <img src={brand.image} alt={brand.name} className="max-h-60 max-w-[95%] object-contain" />
          ) : (
            <span className="text-xs text-neutral-400">No picture</span>
          )}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-2 text-sm">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{brand.name}</h1>
            <div className="flex shrink-0 gap-1" data-brand-actions>
              <Button variant="secondary" onClick={() => setEditingBrand(true)}>
                Edit
              </Button>
              <Button variant="ghost" onClick={removeBrand}>
                Delete
              </Button>
            </div>
          </div>
          <p className="flex flex-wrap items-center gap-2">
            {(brand.applications ?? []).map((a) => (
              <span key={a.id} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {a.name}
              </span>
            ))}
            {str(brand.solutionGroup) && (
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">{str(brand.solutionGroup)}</span>
            )}
            {year !== null && (
              <span className="text-neutral-600 dark:text-neutral-300">
                Launched <span className="font-semibold">{year}</span>
              </span>
            )}
          </p>
          {brand.description && <p className="whitespace-pre-line text-neutral-700 dark:text-neutral-200">{brand.description}</p>}
        </div>
        {parts.length > 0 && (
          <aside className="flex w-full shrink-0 flex-col gap-3 border-neutral-200 text-sm md:w-56 md:border-l md:pl-4 dark:border-neutral-800">
            {parts.map((part) => (
              <div key={part.key}>
                <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase dark:text-neutral-400">{part.title}</p>
                <p className="whitespace-pre-line text-neutral-700 dark:text-neutral-200">{str(brand[part.key])}</p>
              </div>
            ))}
          </aside>
        )}
      </article>

      <SolutionUses key={brand.id} brandId={brand.id} />

      <div className="mt-6" data-solution-cases>
        <PictureCases
          label={brand.name}
          listPath={`/innovation-cases?innovationId=${encodeURIComponent(brand.id)}`}
          endpoint="/innovation-cases"
          createExtra={{ innovationId: brand.id }}
        />
      </div>

      {editingBrand && (
        <SolutionBrandEdit
          brand={brand}
          onClose={() => setEditingBrand(false)}
          onSaved={(saved) => {
            setBrand(saved);
            document.title = `${saved.name} — Solutions`;
            setEditingBrand(false);
          }}
        />
      )}
    </div>
  );
}

