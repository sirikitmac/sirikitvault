import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="mx-auto mt-20 w-[min(100%-1.5rem,72rem)] pb-10">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-black/[0.08] bg-white px-4 py-6 text-center shadow-soft dark:border-white/[0.08] dark:bg-[#141412] dark:shadow-soft-dark sm:px-6 sm:py-8">
        <Logo size={36} />
        <p className="font-display text-sm font-semibold">
          SirikitVault<span className="text-gradient">.dev</span>
        </p>
        <p className="max-w-sm text-xs leading-relaxed text-black/45 dark:text-white/45">
          A personal vault of design and development resources. Curated by
          Sirikit — built with Next.js, Tailwind, and Framer Motion.
        </p>
      </div>
    </footer>
  );
}
