import Link from "next/link";

const tabs = [
  {
    label: "首页",
    active: true,
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
    label: "日报",
    active: false,
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
    label: "精华",
    active: false,
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
        <path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8Z" />
        <path d="m18 14 .9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9Z" />
      </svg>
    ),
  },
  {
    label: "热门",
    active: false,
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
    active: false,
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

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 grid h-16 grid-cols-5 border-t border-border/80 bg-background/80 backdrop-blur-glass md:hidden">
      {tabs.map((tab) => (
        <Link
          key={tab.label}
          href="/"
          className={`flex flex-col items-center justify-center gap-1 text-xs font-medium ${
            tab.active ? "text-accent" : "text-foreground-muted"
          }`}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}
