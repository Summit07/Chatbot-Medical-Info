import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-indigo-600 text-white hover:bg-indigo-700",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border",
        statusChecking:
          "bg-indigo-950/70 border-indigo-800/60 text-indigo-300 dark:bg-[#1b1b2b] dark:border-[#30304a] dark:text-indigo-300",
        statusConnected:
          "bg-emerald-950/60 border-emerald-800/60 text-emerald-300 dark:bg-emerald-950/50 dark:border-emerald-700/60 dark:text-emerald-300",
        statusWarning:
          "bg-amber-950/60 border-amber-800/60 text-amber-300 dark:bg-amber-950/50 dark:border-amber-700/60 dark:text-amber-300",
        statusOffline:
          "bg-rose-950/60 border-rose-800/60 text-rose-300 dark:bg-rose-950/50 dark:border-rose-700/60 dark:text-rose-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

