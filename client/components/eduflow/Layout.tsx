import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Flame, Home, PlusSquare, Search, User2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 select-none">
      <div className="size-7 rounded-md brand-gradient" />
      <span className="text-lg font-extrabold tracking-tight">EduFlow</span>
    </Link>
  );
}

function TopNav() {
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b">
      <div className="mx-auto max-w-screen-sm sm:max-w-screen-md md:max-w-screen-lg lg:max-w-screen-xl px-4 h-14 flex items-center justify-between">
        <Logo />
        <div className="hidden sm:flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <input
              placeholder="Search subjects, creators, videos"
              className="pl-9 pr-3 py-2 rounded-md bg-muted text-sm w-72 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-medium">
            <span className="px-2 py-1 rounded-md bg-primary text-primary-foreground">
              7 day streak
            </span>
            <span className="px-2 py-1 rounded-md bg-accent text-accent-foreground">
              1,240 XP
            </span>
            <span className="px-2 py-1 rounded-md bg-muted">Tokens: 250</span>
            <a
              href="/ar"
              className="px-2 py-1 rounded-md bg-black/5 dark:bg-white/10"
            >
              AR
            </a>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function BottomNav() {
  const { pathname } = useLocation();
  const items = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/explore", icon: Flame, label: "Explore" },
    { to: "/upload", icon: PlusSquare, label: "Upload" },
    { to: "/profile", icon: User2, label: "Profile" },
  ];
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t bg-background/90 backdrop-blur-xl sm:hidden">
      <div className="mx-auto max-w-screen-sm px-2 h-14 grid grid-cols-4">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 text-xs",
                isActive || pathname === to
                  ? "text-primary"
                  : "text-muted-foreground",
              )
            }
          >
            <Icon className="size-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default function Layout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <TopNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
