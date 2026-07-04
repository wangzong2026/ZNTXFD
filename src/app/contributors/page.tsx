import { getDailyIndex, getDailyReport } from "@/lib/data";

type ContributorRank = {
  name: string;
  count: number;
};

const rankStyles = [
  "border-accent/50 bg-accent/10 text-accent",
  "border-[#C0C0C0]/50 bg-[#C0C0C0]/10 text-[#C0C0C0]",
  "border-[#CD7F32]/50 bg-[#CD7F32]/10 text-[#CD7F32]",
];

function getContributorRanks(): ContributorRank[] {
  const counts = new Map<string, number>();
  const dailyItems = getDailyIndex();

  dailyItems.forEach((item) => {
    const report = getDailyReport(item.date);

    report.topics.forEach((topic) => {
      topic.contributors.forEach((contributor) => {
        const name = contributor.trim();

        if (name) {
          counts.set(name, (counts.get(name) ?? 0) + 1);
        }
      });
    });
  });

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort(
      (a, b) =>
        b.count - a.count || a.name.localeCompare(b.name, "zh-CN"),
    );
}

export default function ContributorsPage() {
  const contributors = getContributorRanks();

  return (
    <section className="relative mx-auto w-full max-w-7xl overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-4 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(240,185,11,0.18)_0%,rgba(240,185,11,0)_68%)] blur-2xl" />
      <div className="pointer-events-none absolute right-0 top-48 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(2,192,118,0.12)_0%,rgba(2,192,118,0)_70%)] blur-2xl" />

      <div className="relative mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">贡献排行</h1>
          <p className="mt-2 text-sm text-foreground-muted">
            基于全部日报话题贡献者出现次数统计
          </p>
        </div>
        <span className="mono-num hidden text-sm text-foreground-muted sm:inline">
          {contributors.length} 人
        </span>
      </div>

      <div className="glass-card relative p-4 md:p-5">
        {contributors.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-foreground-muted">
            暂无贡献数据
          </div>
        ) : (
          <div className="space-y-3">
            {contributors.map((contributor, index) => {
              const highlight = rankStyles[index] ?? "";

              return (
                <div
                  key={contributor.name}
                  className={`flex items-center gap-4 rounded-xl border border-border/80 bg-background-card/40 p-4 ${highlight}`}
                >
                  <div className="mono-num flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-current/30 text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-base font-bold text-accent">
                    {contributor.name.slice(0, 1)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-bold text-foreground">
                      {contributor.name}
                    </p>
                    <p className="mt-1 text-xs text-foreground-muted">
                      贡献次数
                    </p>
                  </div>
                  <p className="mono-num text-2xl font-bold text-current">
                    {contributor.count}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
