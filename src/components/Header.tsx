import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/80 bg-background/70 px-4 backdrop-blur-glass md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Link
          href="/"
          className="truncate text-sm font-bold text-foreground md:text-base"
        >
          智能体先锋队知识库
        </Link>
        <span className="hidden items-center gap-1.5 text-xs text-foreground-muted sm:inline-flex">
          <span className="pulse-dot" aria-hidden="true" />
          实时更新中
        </span>
      </div>
      <div className="glass flex h-9 w-36 items-center gap-2 rounded-[20px] px-3 text-foreground-muted sm:w-56 md:w-72">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m21 21-4.35-4.35" />
          <circle cx="11" cy="11" r="7" />
        </svg>
        <input
          type="search"
          aria-label="搜索知识"
          placeholder="搜索知识..."
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-foreground-disabled"
        />
      </div>
    </header>
  );
}
