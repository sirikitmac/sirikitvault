export function SectionHeading({
  eyebrow,
  title,
  count,
}: {
  eyebrow: string;
  title: string;
  count?: number;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <p className="cell-label">{eyebrow}</p>
        <h2 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-[1.65rem]">
          {title}
        </h2>
      </div>
      {typeof count === "number" && (
        <span className="border border-[#E4E4DC] px-3 py-1 font-mono text-xs tabular-nums text-black/50 dark:border-[#2A2B22] dark:text-white/50">
          {count}
        </span>
      )}
    </div>
  );
}
