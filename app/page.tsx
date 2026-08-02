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
import type { Resource } from "@/types/resource";

export default function Home() {
  const [query, setQuery] = useState("");
  const [chips, setChips] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selected, setSelected] = useState<Resource | null>(null);
  const { favorites, toggle } = useFavorites();

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
                <Grid>
                  {filtered.map((r, i) => (
                    <ResourceCard
                      key={r.id}
                      resource={r}
                      index={i}
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
                <Grid>
                  {featured.map((r, i) => (
                    <ResourceCard
                      key={r.id}
                      resource={r}
                      index={i}
                      featured
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
                <Grid>
                  {recent.map((r, i) => (
                    <ResourceCard
                      key={r.id}
                      resource={r}
                      index={i}
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
                <Grid>
                  {sortedAllResources.map((r, i) => (
                    <ResourceCard
                      key={r.id}
                      resource={r}
                      index={i}
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

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  );
}
