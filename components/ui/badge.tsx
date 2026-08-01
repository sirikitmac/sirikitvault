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
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide backdrop-blur-sm",
        variant === "default" &&
          "border-black/10 bg-black/[0.03] text-black/60 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/60",
        variant === "accent" &&
          "border-accent-400/40 bg-accent-400/10 text-accent-700 dark:border-accent-400/30 dark:bg-accent-400/10 dark:text-accent-400",
        className
      )}
      {...props}
    />
  );
}
