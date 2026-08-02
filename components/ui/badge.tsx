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
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide",
        variant === "default" &&
          "border-black/10 bg-black/[0.03] text-black/60 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/60",
        variant === "accent" &&
          "border-black/15 bg-black/[0.06] text-black/75 dark:border-white/15 dark:bg-white/10 dark:text-white/80",
        className
      )}
      {...props}
    />
  );
}
