"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function BrainIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 3a3 3 0 0 0-3 3v.4A3.8 3.8 0 0 0 4 10a3.8 3.8 0 0 0 2 3.4V18a3 3 0 0 0 5.2 2" />
      <path d="M15 3a3 3 0 0 1 3 3v.4a3.8 3.8 0 0 1 2 3.6 3.8 3.8 0 0 1-2 3.4V18a3 3 0 0 1-5.2 2" />
      <path d="M9 8h6" />
      <path d="M9 13h6" />
      <path d="M12 3v18" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19V9l8-6 8 6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

function DailyIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 3v3" />
      <path d="M17 3v3" />
      <path d="M4 8h16" />
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M8 12h4" />
      <path d="M8 16h8" />
    </svg>
  );
}

function TopicsIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v14H6.5A2.5 2.5 0 0 0 4 20.5Z" />
      <path d="M4 6.5v14" />
      <path d="M8 8h8" />
      <path d="M8 12h7" />
    </svg>
  );
}

function TrendingIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c3.5-1.5 6-4.4 6-8a7.2 7.2 0 0 0-3.5-6.2c-.1 2-1.1 3.2-2.4 4.2.3-3.2-1.2-5.8-4.1-8C8.2 8.2 4 10 4 14c0 3.6 2.5 6.5 8 8Z" />
    </svg>
  );
}

function SearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21 21-4.35-4.35" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}

const navItems = [
  { label: "首页", href: "/", icon: <HomeIcon /> },
  { label: "期刊", href: "/daily", icon: <DailyIcon /> },
  { label: "弹药库", href: "/topics", icon: <TopicsIcon /> },
  { label: "话题", href: "/trending", icon: <TrendingIcon /> },
  { label: "搜索", href: "/search", icon: <SearchIcon /> },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function TopBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-white/[0.06] bg-background/70 backdrop-blur-[20px]">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-accent via-accent-light to-[#d08b00] text-background shadow-[0_0_28px_rgba(240,185,11,0.28)]">
            <BrainIcon />
          </span>
          <span className="hidden min-w-0 sm:block">
            <span className="block truncate text-base font-bold leading-5 text-foreground">
              智能体先锋队
            </span>
            <span className="block truncate text-xs font-medium uppercase tracking-[0.18em] text-foreground-muted">
              AI Pioneer Squad
            </span>
          </span>
        </Link>

        <nav className="glass hidden h-12 items-center gap-1 rounded-full px-2 md:flex">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-[15px] font-semibold transition-colors ${
                  active
                    ? "bg-accent/12 text-accent"
                    : "text-foreground-muted hover:bg-white/[0.04] hover:text-foreground"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex min-w-0 shrink-0 items-center gap-3">
          <Link
            href="/search"
            className="glass hidden h-11 w-48 items-center gap-2 rounded-full px-4 text-[15px] font-medium text-foreground-muted transition-colors hover:border-white/[0.12] hover:text-foreground lg:flex"
          >
            <SearchIcon className="h-5 w-5 shrink-0" />
            <span className="truncate">搜索弹药...</span>
          </Link>
          <span className="hidden items-center gap-2 text-sm font-medium text-foreground-muted sm:inline-flex">
            <span className="pulse-dot" aria-hidden="true" />
            持续沉淀
          </span>
        </div>
      </div>
    </header>
  );
}
