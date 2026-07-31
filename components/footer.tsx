import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="mx-auto mt-20 w-[min(100%-1.5rem,72rem)] pb-10">
      <div className="flex flex-col items-center gap-3 border border-[#E4E4DC] bg-white px-6 py-8 text-center dark:border-[#2A2B22] dark:bg-[#141510]">
        <Logo size={36} />
        <p className="font-display text-sm font-bold">
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
