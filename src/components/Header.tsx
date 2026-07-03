import Link from "next/link";

export function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background-card px-4 md:px-6">
      <Link href="/" className="text-base font-bold text-accent md:text-lg">
        智能体知识库
      </Link>
      <button
        type="button"
        aria-label="搜索"
        className="flex h-9 w-9 items-center justify-center rounded-md text-foreground-muted transition-colors hover:bg-background-hover hover:text-accent"
      >
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
      </button>
    </header>
  );
}
