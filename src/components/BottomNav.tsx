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
    label: "文档",
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
        <path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 grid h-16 grid-cols-3 border-t border-border bg-background-card md:hidden">
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
