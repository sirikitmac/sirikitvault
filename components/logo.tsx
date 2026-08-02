import { Vault } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={cn(
        "inline-flex shrink-0 select-none items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black",
        className
      )}
    >
      <Vault style={{ width: size * 0.55, height: size * 0.55 }} />
    </span>
  );
}
