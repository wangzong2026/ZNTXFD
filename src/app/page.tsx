import Link from "next/link";
import { TagBadge } from "@/components/TagBadge";
import { getDailyIndex } from "@/lib/data";

function formatDate(date: string) {
  const value = new Date(`${date}T00:00:00`);
  return `${value.getFullYear()}年${value.getMonth() + 1}月${value.getDate()}日`;
}

export default function Home() {
  const dailyCards = getDailyIndex().sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-medium text-foreground-muted">
            今日知识流
          </p>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            知识日报
          </h1>
        </div>
        <span className="hidden text-sm text-foreground-muted sm:inline">
          共 {dailyCards.length} 篇
        </span>
      </div>

      {dailyCards.length === 0 ? (
        <div className="rounded-lg border border-border bg-background-card px-5 py-12 text-center text-sm text-foreground-muted">
          暂无知识日报
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 md:gap-4">
          {dailyCards.map((card) => (
            <Link
              key={card.date}
              href={`/daily/${card.date}`}
              className="group rounded-lg border border-border bg-background-card p-4 transition-colors hover:bg-background-hover"
            >
              <article>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <time className="text-xs font-medium text-foreground-muted">
                    {formatDate(card.date)}
                  </time>
                  <span className="rounded border border-border bg-background px-2 py-0.5 text-xs font-semibold text-foreground">
                    {card.topic_count} 个话题
                  </span>
                </div>
                <h2 className="text-base font-semibold leading-7 text-foreground transition-colors group-hover:text-accent md:text-lg">
                  {card.title}
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {card.tags.slice(0, 3).map((tag) => (
                    <TagBadge key={tag}>{tag}</TagBadge>
                  ))}
                  {card.tags.length > 3 ? (
                    <span className="inline-flex items-center rounded border border-border bg-background px-2 py-0.5 text-xs font-medium text-foreground-muted">
                      +{card.tags.length - 3}
                    </span>
                  ) : null}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-3 text-sm">
                  <div>
                    <p className="text-xs text-foreground-muted">消息数</p>
                    <p className="mt-1 font-semibold text-accent">
                      {card.total_messages}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-foreground-muted">活跃人数</p>
                    <p className="mt-1 font-semibold text-accent">
                      {card.active_members}
                    </p>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
