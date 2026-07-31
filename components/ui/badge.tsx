import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "accent";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-none border px-2 py-0.5 text-[11px] font-medium tracking-wide",
        variant === "default" &&
          "border-black/15 text-black/60 dark:border-white/15 dark:text-white/60",
        variant === "accent" &&
          "border-[#FFD60A] text-[#E6B800] dark:text-[#FFD60A]",
        className
      )}
      {...props}
    />
  );
}
