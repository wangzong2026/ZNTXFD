"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    label: "首页",
    href: "/",
    icon: (
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
        <path d="M4 19V8.5L12 3l8 5.5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
        <path d="M9 21v-6h6v6" />
      </svg>
    ),
  },
  {
    label: "期刊",
    href: "/daily",
    icon: (
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
      </svg>
    ),
  },
  {
    label: "弹药",
    href: "/topics",
    icon: (
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
    ),
  },
  {
    label: "话题",
    href: "/trending",
    icon: (
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
    ),
  },
  {
    label: "搜索",
    href: "/search",
    icon: (
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
        <path d="m21 21-4.35-4.35" />
        <circle cx="11" cy="11" r="7" />
      </svg>
    ),
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 grid h-[72px] grid-cols-5 border-t border-white/[0.06] bg-background/85 px-1 backdrop-blur-[20px] md:hidden">
      {tabs.map((tab) => {
        const active = isActivePath(pathname, tab.href);

        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={`flex flex-col items-center justify-center gap-1 rounded-2xl text-[13px] font-semibold transition-colors ${
              active
                ? "bg-accent/12 text-accent"
                : "text-foreground-muted hover:text-foreground"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
