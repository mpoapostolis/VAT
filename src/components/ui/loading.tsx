import React from "react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
}

export function Loading({ className }: LoadingProps) {
  return (
    <div className={cn("flex justify-center items-center", className)}>
      <div className="animate-spin -full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  );
}
