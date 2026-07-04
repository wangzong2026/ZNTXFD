import Link from "next/link";
import { TagBadge } from "@/components/TagBadge";
import { getDailyIndex } from "@/lib/data";

function formatDate(date: string) {
  const value = new Date(`${date}T00:00:00`);
  return `${value.getFullYear()}年${value.getMonth() + 1}月${value.getDate()}日`;
}

function StatBlock({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs text-foreground-muted">{label}</p>
      <p className="mono-num mt-1 text-lg font-bold text-foreground">
        {value}
      </p>
    </div>
  );
}

export default function DailyListPage() {
  const dailyReports = getDailyIndex().sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return (
    <section className="relative mx-auto w-full max-w-7xl overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-4 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(240,185,11,0.18)_0%,rgba(240,185,11,0)_68%)] blur-2xl" />
      <div className="pointer-events-none absolute right-0 top-48 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(2,192,118,0.12)_0%,rgba(2,192,118,0)_70%)] blur-2xl" />

      <div className="relative mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">知识日报</h1>
          <p className="mt-2 text-sm text-foreground-muted">
            按日期倒序整理社群每日知识沉淀
          </p>
        </div>
        <span className="mono-num hidden text-sm text-foreground-muted sm:inline">
          {dailyReports.length} 篇
        </span>
      </div>

      {dailyReports.length === 0 ? (
        <div className="glass-card relative px-5 py-12 text-center text-sm text-foreground-muted">
          暂无知识日报
        </div>
      ) : (
        <div className="relative grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dailyReports.map((report) => (
            <Link
              key={report.date}
              href={`/daily/${report.date}`}
              className="glass-card card-hover group flex min-h-[230px] flex-col p-5"
            >
              <article className="flex h-full flex-col">
                <time className="mono-num text-xs font-medium text-accent">
                  {formatDate(report.date)}
                </time>
                <h2 className="mt-3 line-clamp-2 text-lg font-bold leading-8 text-foreground transition-colors group-hover:text-accent">
                  {report.title}
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {report.tags.slice(0, 3).map((tag) => (
                    <TagBadge key={tag}>{tag}</TagBadge>
                  ))}
                </div>
                <div className="mt-auto grid grid-cols-3 gap-3 border-t border-border/80 pt-5">
                  <StatBlock label="消息数" value={report.total_messages} />
                  <StatBlock label="话题数" value={report.topic_count} />
                  <StatBlock label="活跃人数" value={report.active_members} />
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
