const OTHER = "Other";

// Uses by category: categories in natural order (PENTA 17 before PENTA 24),
// uses without one last ("Other"); one unnamed group when none has a category.
export function byCategory<U extends { category?: string | null }>(uses: U[]): [string, U[]][] {
  if (!uses.some((u) => u.category)) return uses.length ? [["", uses]] : [];
  const groups = new Map<string, U[]>();
  for (const u of uses) groups.set(u.category || OTHER, [...(groups.get(u.category || OTHER) ?? []), u]);
  return [...groups].sort(([a], [b]) => (a === OTHER ? 1 : b === OTHER ? -1 : a.localeCompare(b, undefined, { numeric: true })));
}
