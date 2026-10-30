"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, Key, Server } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ApiSettingsProps {
  apiToken: string;
  onApiTokenChange: (token: string) => void;
  backendUrl: string;
  onBackendUrlChange: (url: string) => void;
}

export function ApiSettings({
  apiToken,
  onApiTokenChange,
  backendUrl,
  onBackendUrlChange,
}: ApiSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-3 text-xs text-zinc-400">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 transition-colors py-1 cursor-pointer font-medium select-none"
      >
        {isOpen ? (
          <ChevronDown className="h-3.5 w-3.5" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5" />
        )}
        <span>API access (optional)</span>
      </button>

      {isOpen && (
        <div className="mt-2.5 p-3.5 rounded-xl bg-zinc-900/70 dark:bg-[#121217] border border-zinc-800/80 dark:border-[#262633] space-y-3 animate-in fade-in-50 duration-200">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
              <Key className="h-3 w-3 text-indigo-400" /> API Token (from backend .env)
            </label>
            <Input
              type="password"
              placeholder="API_TOKEN from .env"
              value={apiToken}
              onChange={(e) => onApiTokenChange(e.target.value)}
              className="h-8 text-xs bg-zinc-950/60 dark:bg-[#0a0a0e] border-zinc-800 focus-visible:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-300 mb-1 flex items-center gap-1.5">
              <Server className="h-3 w-3 text-indigo-400" /> Backend URL (FastAPI)
            </label>
            <Input
              type="text"
              placeholder="http://127.0.0.1:8000"
              value={backendUrl}
              onChange={(e) => onBackendUrlChange(e.target.value)}
              className="h-8 text-xs bg-zinc-950/60 dark:bg-[#0a0a0e] border-zinc-800 focus-visible:ring-indigo-500"
            />
          </div>

          <p className="text-[11px] text-zinc-500 leading-normal">
            Leave blank if running Next.js self-contained or proxying via default port 8000.
          </p>
        </div>
      )}
    </div>
  );
}

