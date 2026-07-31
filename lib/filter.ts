import type { Resource } from "@/types/resource";

export interface FilterState {
  query: string;
  /** Selected chips — may be categories or tags. Combinable (AND). */
  chips: string[];
  favoritesOnly: boolean;
}

export function matchesQuery(r: Resource, q: string): boolean {
  if (!q.trim()) return true;
  const needle = q.trim().toLowerCase();
  return (
    r.name.toLowerCase().includes(needle) ||
    r.description.toLowerCase().includes(needle) ||
    r.category.toLowerCase().includes(needle) ||
    r.tags.some((t) => t.toLowerCase().includes(needle))
  );
}

export function matchesChips(r: Resource, chips: string[]): boolean {
  return chips.every(
    (chip) =>
      r.category.toLowerCase() === chip.toLowerCase() ||
      r.tags.some((t) => t.toLowerCase() === chip.toLowerCase())
  );
}

export function filterResources(
  resources: Resource[],
  state: FilterState,
  favorites: Set<string>
): Resource[] {
  return resources.filter((r) => {
    if (state.favoritesOnly && !favorites.has(r.id)) return false;
    return matchesQuery(r, state.query) && matchesChips(r, state.chips);
  });
}

/** Lightweight suggestions for the search dropdown. */
export function suggestionsFor(
  resources: Resource[],
  q: string,
  limit = 6
): { names: Resource[]; tags: string[] } {
  const needle = q.trim().toLowerCase();
  if (!needle) return { names: [], tags: [] };
  const names = resources
    .filter((r) => r.name.toLowerCase().includes(needle))
    .slice(0, limit);
  const tagSet = new Set<string>();
  for (const r of resources) {
    for (const t of r.tags) {
      if (t.toLowerCase().includes(needle)) tagSet.add(t);
    }
  }
  return { names, tags: Array.from(tagSet).slice(0, 5) };
}
