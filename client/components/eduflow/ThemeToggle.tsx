import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

function getInitial(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  const ls = localStorage.getItem("theme");
  if (ls === "dark" || ls === "light") return ls;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">(getInitial());

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
      className="size-9 grid place-items-center rounded-md bg-muted hover:bg-muted/80 text-foreground border"
    >
      {theme === "dark" ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </button>
  );
}
