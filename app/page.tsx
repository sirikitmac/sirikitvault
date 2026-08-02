"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { CategoryMarquee } from "@/components/category-marquee";
import { FilterChips } from "@/components/filter-chips";
import { ResourceCard } from "@/components/resource-card";
import { ResourceModal } from "@/components/resource-modal";
import { EmptyState } from "@/components/empty-state";
import { SectionHeading } from "@/components/section-heading";
import { Footer } from "@/components/footer";
import { resources, allCategories } from "@/data/resources";
import { filterResources } from "@/lib/filter";
import { useFavorites } from "@/hooks/use-favorites";
import { useViewMode, type ViewMode } from "@/hooks/use-view-mode";
import { ViewSwitcher } from "@/components/view-switcher";
import type { Resource } from "@/types/resource";

export default function Home() {
  const [query, setQuery] = useState("");
  const [chips, setChips] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selected, setSelected] = useState<Resource | null>(null);
  const { favorites, toggle } = useFavorites();
  const { mode: viewMode, setMode: setViewMode } = useViewMode();

  const filtered = useMemo(
    () => filterResources(resources, { query, chips, favoritesOnly }, favorites),
    [query, chips, favoritesOnly, favorites]
  );

  const browsing = query.trim() !== "" || chips.length > 0 || favoritesOnly;

  const featured = useMemo(() => resources.filter((r) => r.featured), []);
  const recent = useMemo(
    () =>
      [...resources]
        .sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))
        .slice(0, 4),
    []
  );
  const sortedAllResources = useMemo(
    () =>
      [...resources].sort(
        (a, b) => (a.recommended ? 0 : 1) - (b.recommended ? 0 : 1)
      ),
    []
  );

  const toggleChip = (chip: string) =>
    setChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );

  const resetAll = () => {
    setQuery("");
    setChips([]);
    setFavoritesOnly(false);
  };

  return (
    <div className="pb-4">
      <Navbar
        favoritesCount={favorites.size}
        favoritesActive={favoritesOnly}
        onToggleFavorites={() => setFavoritesOnly((v) => !v)}
      />

      <main>
        <Hero
          query={query}
          onQueryChange={setQuery}
          onPickTag={(tag) => {
            setQuery("");
            toggleChip(tag);
          }}
          resourceCount={resources.length}
          categoryCount={allCategories.length}
        />

        {/* Categories + filters */}
        <div id="browse" className="mx-auto mt-12 w-[min(100%-1.5rem,72rem)] scroll-mt-24">
          <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start lg:gap-6">
            <div id="categories" className="scroll-mt-24">
              <CategoryMarquee
                onPickCategory={(category) => {
                  setQuery("");
                  toggleChip(category);
                }}
              />
            </div>
            <FilterChips
              selected={chips}
              onToggle={toggleChip}
              onClear={() => setChips([])}
            />
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {browsing ? (
            /* ── Search / filter results ─────────────────────── */
            <motion.section
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
              className="mx-auto mt-10 w-[min(100%-1.5rem,72rem)]"
            >
              <SectionHeading
                eyebrow={favoritesOnly ? "Your picks" : "Results"}
                title={favoritesOnly ? "Favorites" : "Matching resources"}
                count={filtered.length}
              />
              {filtered.length === 0 ? (
                <EmptyState onReset={resetAll} />
              ) : (
                <Grid variant={viewMode}>
                  {filtered.map((r, i) => (
                    <ResourceCard
                      key={r.id}
                      resource={r}
                      index={i}
                      variant={viewMode}
                      isFavorite={favorites.has(r.id)}
                      onToggleFavorite={toggle}
                      onOpen={() => setSelected(r)}
                    />
                  ))}
                </Grid>
              )}
            </motion.section>
          ) : (
            /* ── Default browsing view ───────────────────────── */
            <motion.div
              key="browse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            >
              <section className="mx-auto mt-14 w-[min(100%-1.5rem,72rem)]">
                <SectionHeading
                  eyebrow="The essentials"
                  title="Featured resources"
                  count={featured.length}
                  highlightWord="Featured"
                />
                <Grid variant={viewMode}>
                  {featured.map((r, i) => (
                    <ResourceCard
                      key={r.id}
                      resource={r}
                      index={i}
                      featured
                      variant={viewMode}
                      isFavorite={favorites.has(r.id)}
                      onToggleFavorite={toggle}
                      onOpen={() => setSelected(r)}
                    />
                  ))}
                </Grid>
              </section>

              <section className="mx-auto mt-16 w-[min(100%-1.5rem,72rem)]">
                <SectionHeading
                  eyebrow="Fresh in the vault"
                  title="Recently added"
                  count={recent.length}
                  highlightWord="added"
                  accent="green"
                />
                <Grid variant={viewMode}>
                  {recent.map((r, i) => (
                    <ResourceCard
                      key={r.id}
                      resource={r}
                      index={i}
                      variant={viewMode}
                      isFavorite={favorites.has(r.id)}
                      onToggleFavorite={toggle}
                      onOpen={() => setSelected(r)}
                    />
                  ))}
                </Grid>
              </section>

              <section className="mx-auto mt-16 w-[min(100%-1.5rem,72rem)]">
                <SectionHeading
                  eyebrow="Everything"
                  title="All resources"
                  count={resources.length}
                  highlightWord="All"
                />
                <div className="mb-5 flex justify-end">
                  <ViewSwitcher mode={viewMode} onChange={setViewMode} />
                </div>
                <Grid variant={viewMode}>
                  {sortedAllResources.map((r, i) => (
                    <ResourceCard
                      key={r.id}
                      resource={r}
                      index={i}
                      variant={viewMode}
                      isFavorite={favorites.has(r.id)}
                      onToggleFavorite={toggle}
                      onOpen={() => setSelected(r)}
                    />
                  ))}
                </Grid>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />

      <AnimatePresence>
        {selected && (
          <ResourceModal
            resource={selected}
            isFavorite={favorites.has(selected.id)}
            onToggleFavorite={toggle}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Grid({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: ViewMode;
}) {
  if (variant === "gallery") {
    return (
      <div className="columns-2 gap-3 sm:columns-3 lg:columns-5 xl:columns-6 [&>*]:mb-3 [&>*]:break-inside-avoid">
        {children}
      </div>
    );
  }

  if (variant === "list") {
    return <div className="flex flex-col gap-2.5">{children}</div>;
  }

  if (variant === "single") {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-6">{children}</div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  );
}
