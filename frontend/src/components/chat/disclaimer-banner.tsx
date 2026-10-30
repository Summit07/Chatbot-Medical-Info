"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="px-5 py-3 sm:px-7 sm:py-3.5 bg-[#201a10] dark:bg-[#201a10] bg-amber-500/10 border-b border-[#39301c] dark:border-[#39301c] border-amber-500/20 text-amber-300 dark:text-[#fbbf24] text-xs sm:text-sm font-medium flex items-center gap-2.5 transition-colors">
      <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
      <span>
        Educational guidance only. Not a diagnosis. For severe symptoms, contact emergency services.
      </span>
    </div>
  );
}

