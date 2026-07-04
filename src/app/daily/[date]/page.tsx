import Link from "next/link";
import { notFound } from "next/navigation";
import { ContributorList } from "@/components/ContributorList";
import { MarkdownContent } from "@/components/MarkdownContent";
import { TagBadge } from "@/components/TagBadge";
import { getAllDates, getDailyReport } from "@/lib/data";
import type { DailyReport } from "@/lib/data";

type DailyPageProps = {
  params: Promise<{
    date: string;
  }>;
};

function formatDate(date: string) {
  const value = new Date(`${date}T00:00:00`);
  return `${value.getFullYear()}年${value.getMonth() + 1}月${value.getDate()}日`;
}

function StatIcon({ type }: { type: "messages" | "members" | "topics" }) {
  if (type === "messages") {
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
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
      </svg>
    );
  }

  if (type === "members") {
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
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

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
      <path d="M4 5h16" />
      <path d="M4 12h16" />
      <path d="M4 19h16" />
    </svg>
  );
}

export function generateStaticParams() {
  return getAllDates().map((date) => ({ date }));
}

export default async function DailyPage({ params }: DailyPageProps) {
  const { date } = await params;
  const allDates = getAllDates().sort((a, b) => a.localeCompare(b));
  let report: DailyReport;

  try {
    report = getDailyReport(date);
  } catch {
    notFound();
  }

  const dateIndex = allDates.indexOf(date);
  const previousDate = dateIndex > 0 ? allDates[dateIndex - 1] : null;
  const nextDate =
    dateIndex >= 0 && dateIndex < allDates.length - 1
      ? allDates[dateIndex + 1]
      : null;

  const stats = [
    {
      label: "消息数",
      value: report.stats.total_messages,
      type: "messages" as const,
    },
    {
      label: "活跃人数",
      value: report.stats.active_members,
      type: "members" as const,
    },
    {
      label: "话题数",
      value: report.topics.length,
      type: "topics" as const,
    },
  ];

  return (
    <section className="relative mx-auto w-full max-w-5xl overflow-hidden">
      <div className="pointer-events-none absolute -left-28 top-6 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(240,185,11,0.18)_0%,rgba(240,185,11,0)_68%)] blur-2xl" />
      <div className="pointer-events-none absolute right-0 top-32 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(2,192,118,0.12)_0%,rgba(2,192,118,0)_70%)] blur-2xl" />

      <Link
        href="/"
        className="glass card-hover relative mb-5 inline-flex items-center rounded-[20px] px-3 py-2 text-sm font-medium text-foreground-muted hover:text-accent"
      >
        ← 返回列表
      </Link>

      <div className="relative mb-6">
        <time className="text-sm font-medium text-accent">
          {formatDate(report.date)}
        </time>
        <h1 className="mt-2 text-2xl font-bold leading-9 text-foreground md:text-4xl md:leading-[1.25]">
          {report.title}
        </h1>
      </div>

      <div className="glass-card relative mb-6 grid grid-cols-3 overflow-hidden">
        {stats.map((item) => (
          <div
            key={item.label}
            className="border-r border-border/80 px-3 py-4 last:border-r-0 md:flex md:items-center md:gap-3 md:px-5"
          >
            <div className="mb-2 text-accent md:mb-0">
              <StatIcon type={item.type} />
            </div>
            <div>
              <p className="text-xs text-foreground-muted">{item.label}</p>
              <p className="mt-1 text-lg font-bold text-foreground">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {report.topics.map((topic) => (
          <article
            key={topic.title}
            className="glass-card card-hover relative p-4 md:p-5"
          >
            <h2 className="text-lg font-bold leading-8 text-foreground md:text-xl">
              {topic.title}
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {topic.tags.map((tag) => (
                <TagBadge key={tag}>{tag}</TagBadge>
              ))}
            </div>
            <div className="mt-4">
              <ContributorList contributors={topic.contributors} />
            </div>
            <div className="mt-5 border-l-2 border-accent/70 pl-4 md:pl-5">
              <MarkdownContent content={topic.content} />
            </div>
          </article>
        ))}
      </div>

      <nav className="mt-6 grid grid-cols-2 gap-3">
        {previousDate ? (
          <Link
            href={`/daily/${previousDate}`}
            className="glass-card card-hover p-4 text-sm font-medium text-foreground-muted hover:text-accent"
          >
            <span>← 前一天</span>
            <span className="mt-1 block text-xs">{formatDate(previousDate)}</span>
          </Link>
        ) : (
          <span className="glass-card p-4 text-sm text-foreground-disabled">
            ← 前一天
          </span>
        )}
        {nextDate ? (
          <Link
            href={`/daily/${nextDate}`}
            className="glass-card card-hover p-4 text-right text-sm font-medium text-foreground-muted hover:text-accent"
          >
            <span>后一天 →</span>
            <span className="mt-1 block text-xs">{formatDate(nextDate)}</span>
          </Link>
        ) : (
          <span className="glass-card p-4 text-right text-sm text-foreground-disabled">
            后一天 →
          </span>
        )}
      </nav>
    </section>
  );
}
