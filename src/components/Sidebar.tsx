const navItems = [
  { label: "知识日报", href: "/", active: true },
  { label: "文档库", href: "/", active: false },
  { label: "主题专栏", href: "/", active: false, badge: "P2/P3" },
];

export function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 top-14 z-30 hidden w-[240px] border-r border-border bg-background-card md:block">
      <nav className="space-y-1 px-3 py-5">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className={`flex h-11 items-center justify-between rounded-r-md border-l-2 px-4 text-sm font-medium transition-colors ${
              item.active
                ? "border-accent bg-background-hover text-foreground"
                : "border-transparent text-foreground-muted hover:bg-background-hover hover:text-foreground"
            }`}
          >
            <span>{item.label}</span>
            {item.badge ? (
              <span className="rounded border border-border px-2 py-0.5 text-xs font-semibold text-foreground-disabled">
                {item.badge}
              </span>
            ) : null}
          </a>
        ))}
      </nav>
    </aside>
  );
}
