import Link from "next/link";

function HomeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19V9l8-6 8 6v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

function DailyIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3v3" />
      <path d="M17 3v3" />
      <path d="M4 8h16" />
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M8 12h4" />
      <path d="M8 16h8" />
    </svg>
  );
}

function EssenceIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8Z" />
      <path d="m18 14 .9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9Z" />
      <path d="m5 13 .7 1.6L7.5 15l-1.8.4L5 17l-.7-1.6L2.5 15l1.8-.4Z" />
    </svg>
  );
}

function HotIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c3.5-1.5 6-4.4 6-8a7.2 7.2 0 0 0-3.5-6.2c-.1 2-1.1 3.2-2.4 4.2.3-3.2-1.2-5.8-4.1-8C8.2 8.2 4 10 4 14c0 3.6 2.5 6.5 8 8Z" />
    </svg>
  );
}

function RankIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 19V9" />
      <path d="M12 19V5" />
      <path d="M19 19v-7" />
      <path d="M3 19h18" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21 21-4.35-4.35" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  );
}

const navItems = [
  { label: "首页", href: "/", active: true, icon: <HomeIcon /> },
  { label: "日报", href: "/", active: false, icon: <DailyIcon /> },
  { label: "精华", href: "/", active: false, icon: <EssenceIcon /> },
  { label: "热门", href: "/", active: false, icon: <HotIcon /> },
  { label: "排行", href: "/", active: false, icon: <RankIcon /> },
  { label: "搜索", href: "/", active: false, icon: <SearchIcon /> },
];

export function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 top-14 z-30 hidden w-[64px] border-r border-border/80 bg-background/60 backdrop-blur-glass md:block">
      <div className="flex h-16 items-center justify-center">
        <Link
          href="/"
          aria-label="智能体先锋队知识库"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent via-accent-light to-[#d08b00] text-background shadow-[0_0_24px_rgba(240,185,11,0.25)]"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3a3 3 0 0 0-3 3v.4A3.8 3.8 0 0 0 4 10a3.8 3.8 0 0 0 2 3.4V18a3 3 0 0 0 5.2 2" />
            <path d="M15 3a3 3 0 0 1 3 3v.4a3.8 3.8 0 0 1 2 3.6 3.8 3.8 0 0 1-2 3.4V18a3 3 0 0 1-5.2 2" />
            <path d="M9 8h6" />
            <path d="M9 13h6" />
            <path d="M12 3v18" />
          </svg>
        </Link>
      </div>
      <nav className="flex flex-col items-center gap-2 px-2 py-3">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            aria-label={item.label}
            title={item.label}
            className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              item.active
                ? "bg-accent/10 text-accent"
                : "text-foreground-disabled hover:bg-background-hover/80 hover:text-foreground-muted"
            }`}
          >
            {item.icon}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
