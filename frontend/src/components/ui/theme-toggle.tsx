"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" aria-label="Toggle theme">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = (theme === "dark" || resolvedTheme === "dark");

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 rounded-full text-zinc-400 hover:text-white dark:hover:text-white hover:bg-zinc-800/60 dark:hover:bg-zinc-800 transition-colors"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label="Toggle dark and light theme"
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-300 transition-transform rotate-0 scale-100" />
      ) : (
        <Moon className="h-4 w-4 text-indigo-600 transition-transform rotate-0 scale-100" />
      )}
    </Button>
  );
}

