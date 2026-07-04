import { getDailyIndex } from "@/lib/data";

const groups = [
  {
    name: "智能体先锋队1群",
    text: "text-accent",
    background: "from-accent/30 via-accent/10 to-background-card",
    bar: "from-accent to-accent-light",
  },
  {
    name: "智能体先锋队2群",
    text: "text-success",
    background: "from-success/30 via-success/10 to-background-card",
    bar: "from-success to-[#42e7a2]",
  },
  {
    name: "智能体先锋队3群",
    text: "text-purple",
    background: "from-purple/30 via-purple/10 to-background-card",
    bar: "from-purple to-[#b19cff]",
  },
  {
    name: "智能体先锋队4群",
    text: "text-pink",
    background: "from-pink/30 via-pink/10 to-background-card",
    bar: "from-pink to-[#ff9caf]",
  },
];

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

function formatDate(date: string) {
  const value = new Date(`${date}T00:00:00`);
  return `${value.getFullYear()}年${value.getMonth() + 1}月${value.getDate()}日`;
}

export default function HighlightsPage() {
  const dates = getDailyIndex()
    .map((item) => item.date)
    .sort((a, b) => b.localeCompare(a));

  return (
    <section className="relative mx-auto w-full max-w-7xl overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-4 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(240,185,11,0.18)_0%,rgba(240,185,11,0)_68%)] blur-2xl" />
      <div className="pointer-events-none absolute right-0 top-52 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(131,100,255,0.14)_0%,rgba(131,100,255,0)_70%)] blur-2xl" />

      <div className="relative mb-6">
        <h1 className="text-2xl font-bold text-foreground">每日精华</h1>
        <p className="mt-2 text-sm text-foreground-muted">
          按日期汇总各群精选内容，图片版后续接入
        </p>
      </div>

      {dates.length === 0 ? (
        <div className="glass-card relative px-5 py-12 text-center text-sm text-foreground-muted">
          暂无每日精华
        </div>
      ) : (
        <div className="relative space-y-6">
          {dates.map((date) => (
            <section key={date} className="glass-card p-4 md:p-5">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-base font-bold text-foreground">
                  {formatDate(date)}
                </h2>
                <span className="mono-num text-xs text-foreground-muted">
                  4 个群
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {groups.map((group) => (
                  <div
                    key={`${date}-${group.name}`}
                    className={`relative aspect-[3/4] overflow-hidden rounded-[12px] border border-border/80 bg-gradient-to-br ${group.background} p-4`}
                  >
                    <div
                      className={`absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r ${group.bar}`}
                    />
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div
                        className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full border border-current/20 bg-background/20 ${group.text}`}
                      >
                        <SparklesIcon />
                      </div>
                      <p className="text-base font-bold text-foreground">
                        {group.name}
                      </p>
                      <p className="mono-num mt-2 text-xs text-foreground-muted">
                        {formatDate(date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}
