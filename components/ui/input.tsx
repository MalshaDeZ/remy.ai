import * as React from "react";
import { cn } from "@/lib/utils/cn";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-full border border-border bg-card px-5 text-base text-foreground placeholder:text-muted focus:border-primary focus:outline-none",
        className
      )}
      {...props}
    />
  );
}
