import Link from "next/link";
import { TagBadge } from "@/components/TagBadge";
import { getDailyIndex, getDailyReport } from "@/lib/data";
import type { DailyIndexItem, DailyReport } from "@/lib/data";

function formatDate(date: string) {
  const value = new Date(`${date}T00:00:00`);
  return `${value.getFullYear()}年${value.getMonth() + 1}月${value.getDate()}日`;
}

function getSummary(report: DailyReport | null) {
  const content = report?.topics[0]?.content.trim() ?? "";

  if (content.length <= 80) {
    return content;
  }

  return `${content.slice(0, 80)}...`;
}

function getTopTags(cards: DailyIndexItem[]) {
  const counts = new Map<string, number>();

  cards.forEach((card) => {
    card.tags.forEach((tag) => {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    });
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"))
    .slice(0, 16);
}

function SparklesIcon() {
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
      <path d="m12 3 1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8Z" />
      <path d="m18 14 .9 2.1L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.9Z" />
    </svg>
  );
}

export default function Home() {
  const dailyCards = getDailyIndex().sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  const latest = dailyCards[0] ?? null;
  const latestReport = latest ? getDailyReport(latest.date) : null;
  const recentCards = dailyCards.slice(1, 4);
  const moreCards = dailyCards.slice(4);
  const topTags = getTopTags(dailyCards);
  const galleryItems = [
    {
      group: "1群",
      color: "text-accent",
      background: "from-accent/25 via-accent/10 to-background-card",
      bar: "from-accent to-accent-light",
    },
    {
      group: "2群",
      color: "text-success",
      background: "from-success/25 via-success/10 to-background-card",
      bar: "from-success to-[#42e7a2]",
    },
    {
      group: "3群",
      color: "text-purple",
      background: "from-purple/25 via-purple/10 to-background-card",
      bar: "from-purple to-[#b19cff]",
    },
    {
      group: "4群",
      color: "text-pink",
      background: "from-pink/25 via-pink/10 to-background-card",
      bar: "from-pink to-[#ff9caf]",
    },
  ];

  return (
    <section className="relative mx-auto w-full max-w-7xl overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-4 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(240,185,11,0.18)_0%,rgba(240,185,11,0)_68%)] blur-2xl" />
      <div className="pointer-events-none absolute right-0 top-64 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(2,192,118,0.14)_0%,rgba(2,192,118,0)_70%)] blur-2xl" />

      {dailyCards.length === 0 ? (
        <div className="glass-card px-5 py-12 text-center text-sm text-foreground-muted">
          暂无知识日报
        </div>
      ) : (
        <div className="relative grid gap-4 md:grid-cols-4">
          {latest ? (
            <Link
              href={`/daily/${latest.date}`}
              className="glass-card glow-border card-hover min-h-[320px] p-5 md:col-span-3 md:p-7"
            >
              <article className="relative flex h-full flex-col justify-between">
                <div>
                  <div className="mb-5 flex flex-wrap items-center gap-3">
                    <span className="bg-gradient-to-r from-accent via-success to-purple bg-[length:200%_200%] bg-clip-text text-xs font-bold tracking-[0.24em] text-transparent animate-gradientShift">
                      TODAY&apos;S KNOWLEDGE
                    </span>
                    <time className="mono-num text-xs text-foreground-muted">
                      {formatDate(latest.date)}
                    </time>
                  </div>
                  <h1 className="max-w-3xl text-3xl font-bold leading-tight text-foreground md:text-5xl md:leading-tight">
                    {latest.title}
                  </h1>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-foreground-muted md:text-base md:leading-8">
                    {getSummary(latestReport)}
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-2">
                  {latest.tags.slice(0, 7).map((tag) => (
                    <TagBadge key={tag}>{tag}</TagBadge>
                  ))}
                </div>
              </article>
            </Link>
          ) : null}

          <div className="glass-card flex min-h-[320px] flex-col justify-between p-5 md:col-span-1">
            <p className="text-sm font-medium text-foreground-muted">
              数据统计
            </p>
            <div className="space-y-6">
              <div>
                <p className="mono-num text-5xl font-bold text-accent">
                  {latest?.topic_count ?? 0}
                </p>
                <p className="mt-1 text-sm text-foreground-muted">话题数</p>
              </div>
              <div className="grid gap-4">
                <div>
                  <p className="mono-num text-2xl font-bold text-foreground">
                    {latest?.total_messages ?? 0}
                  </p>
                  <p className="text-xs text-foreground-muted">消息数</p>
                </div>
                <div>
                  <p className="mono-num text-2xl font-bold text-foreground">
                    {latest?.active_members ?? 0}
                  </p>
                  <p className="text-xs text-foreground-muted">活跃人数</p>
                </div>
              </div>
            </div>
          </div>

          {recentCards.map((card) => (
            <Link
              key={card.date}
              href={`/daily/${card.date}`}
              className="glass-card card-hover group p-4"
            >
              <article>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <time className="mono-num text-xs font-medium text-foreground-muted">
                    {formatDate(card.date)}
                  </time>
                  <TagBadge>{card.tags[0] ?? "日报"}</TagBadge>
                </div>
                <h2 className="line-clamp-2 min-h-14 text-base font-semibold leading-7 text-foreground transition-colors group-hover:text-accent">
                  {card.title}
                </h2>
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border/80 pt-3 text-sm">
                  <div>
                    <p className="text-xs text-foreground-muted">消息数</p>
                    <p className="mono-num mt-1 font-semibold text-accent">
                      {card.total_messages}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-muted">话题数</p>
                    <p className="mono-num mt-1 font-semibold text-accent">
                      {card.topic_count}
                    </p>
                  </div>
                </div>
              </article>
            </Link>
          ))}

          <div className="glass-card flex min-h-[190px] flex-col p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">
                更多日报
              </h2>
              <span className="mono-num text-xs text-foreground-muted">
                {moreCards.length} 篇
              </span>
            </div>
            <div className="flex-1 space-y-3">
              {moreCards.slice(0, 5).map((card) => (
                <Link
                  key={card.date}
                  href={`/daily/${card.date}`}
                  className="block text-sm text-foreground-muted transition-colors hover:text-accent"
                >
                  {formatDate(card.date)}
                </Link>
              ))}
            </div>
            <Link
              href="/"
              className="mt-5 border-t border-border/80 pt-4 text-sm font-medium text-accent"
            >
              查看全部 →
            </Link>
          </div>

          <div className="glass-card md:col-span-3 p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-accent">
                <SparklesIcon />
                <h2 className="text-lg font-bold text-foreground">每日精华</h2>
              </div>
              <Link href="/" className="text-sm font-medium text-accent">
                全部精华 →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {galleryItems.map((item) => (
                <div
                  key={item.group}
                  className={`relative aspect-[3/4] overflow-hidden rounded-[10px] border border-border/80 bg-gradient-to-br ${item.background} p-4`}
                >
                  <div
                    className={`absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r ${item.bar}`}
                  />
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className={`mb-4 ${item.color}`}>
                      <SparklesIcon />
                    </div>
                    <p className="text-base font-bold text-foreground">
                      智能体先锋队{item.group}
                    </p>
                    <p className="mono-num mt-2 text-xs text-foreground-muted">
                      {latest ? formatDate(latest.date) : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-foreground">
                热门知识脉络
              </h2>
              <span className="text-xs text-foreground-muted">
                从全部日报标签提取
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {topTags.map(([tag, count], index) => (
                <span
                  key={tag}
                  className={`glass card-hover mono-num rounded-[20px] px-3 py-2 text-sm ${
                    index === 0
                      ? "border-accent/50 text-accent"
                      : "text-foreground-muted"
                  }`}
                >
                  {tag} · {count}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
