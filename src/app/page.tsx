import Image from "next/image";
import Link from "next/link";
import { TagBadge } from "@/components/TagBadge";
import {
  getDailyIndex,
  getDailyReport,
  getDigestStatus,
  getKnowledgeTopics,
} from "@/lib/data";
import type { DailyIndexItem, DailyReport, KnowledgeTopic } from "@/lib/data";

const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

type AssetStats = {
  issueCount: number;
  topicCount: number;
  messageCount: number;
  insightCount: number;
  toolCount: number;
  contributorCount: number;
};

function formatDate(date: string) {
  const value = new Date(`${date}T00:00:00`);
  return `${value.getMonth() + 1}月${value.getDate()}日 · ${weekdays[value.getDay()]}`;
}

function compactNumber(value: number) {
  if (value >= 10000) return `${(value / 10000).toFixed(1)}万`;
  return value.toLocaleString("zh-CN");
}

function buildAssetStats(cards: DailyIndexItem[], reports: DailyReport[]): AssetStats {
  const tools = new Set<string>();
  const contributors = new Set<string>();
  let insightCount = 0;

  for (const report of reports) {
    for (const topic of report.topics) {
      insightCount += topic.key_insights.length;
      for (const tool of topic.tools_mentioned) tools.add(tool);
      for (const contributor of topic.contributors) contributors.add(contributor);
    }
  }

  return {
    issueCount: cards.length,
    topicCount: cards.reduce((sum, item) => sum + item.topic_count, 0),
    messageCount: cards.reduce((sum, item) => sum + item.total_messages, 0),
    insightCount,
    toolCount: tools.size,
    contributorCount: contributors.size,
  };
}

function StatBlock({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-[14px] border border-white/[0.06] bg-white/[0.025] p-4">
      <p className={`mono-num text-2xl font-bold md:text-3xl ${tone}`}>{value}</p>
      <p className="mt-1 text-sm text-foreground-muted">{label}</p>
    </div>
  );
}

function AssetCard({
  title,
  description,
  value,
  href,
  tone,
}: {
  title: string;
  description: string;
  value: string;
  href: string;
  tone: string;
}) {
  return (
    <Link
      href={href}
      className="glass-card card-hover group flex min-h-[190px] flex-col justify-between p-5 hover:border-white/[0.14]"
    >
      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-bold text-foreground group-hover:text-accent">
            {title}
          </h3>
          <span className={`mono-num text-xl font-bold ${tone}`}>{value}</span>
        </div>
        <p className="text-sm leading-6 text-foreground-muted">{description}</p>
      </div>
      <span className="mt-5 text-sm font-semibold text-accent">进入查看 →</span>
    </Link>
  );
}

function TopicRail({ topics }: { topics: KnowledgeTopic[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
      {topics.slice(0, 8).map((topic) => (
        <Link
          key={topic.slug}
          href={`/topics/${topic.slug}`}
          className="rounded-[14px] border border-white/[0.06] bg-white/[0.025] p-4 transition-all hover:-translate-y-0.5 hover:border-white/[0.14]"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-sm font-bold leading-6 text-foreground">
              {topic.name}
            </h3>
            <span className="mono-num shrink-0 text-sm font-bold text-accent">
              {topic.count}
            </span>
          </div>
          <p className="mt-3 line-clamp-2 text-xs leading-5 text-foreground-muted">
            {topic.relatedTags.slice(0, 3).join(" / ") || "持续沉淀中"}
          </p>
        </Link>
      ))}
    </div>
  );
}

export default function Home() {
  const dailyCards = getDailyIndex().sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  const reports = dailyCards.map((card) => getDailyReport(card.date));
  const latest = dailyCards[0] ?? null;
  const latestReport = reports[0] ?? null;
  const digestStatus = latest ? getDigestStatus(latest.date) : null;
  const topics = getKnowledgeTopics();
  const stats = buildAssetStats(dailyCards, reports);
  const recentCards = dailyCards.slice(0, 4);
  const latestTopics = latestReport?.topics.slice(0, 5) ?? [];
  const pilotDigest = {
    date: "2026-07-17",
    image: "/digest-images/2026-07-17/group5.png",
    label: "五群试运行",
    note: "北京时间 01:19-12:01，进行中",
  };

  return (
    <section className="relative overflow-hidden">
      {dailyCards.length === 0 || !latest || !digestStatus ? (
        <div className="glass-card relative px-5 py-12 text-center text-sm text-foreground-muted">
          暂无可展示内容
        </div>
      ) : (
        <div className="relative space-y-8">
          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
            <article className="glass-card glow-border card-hover p-6 hover:border-white/[0.14] md:p-8">
              <p className="text-xs font-bold tracking-[0.24em] text-accent">
                社群知识沉淀
              </p>
              <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight text-foreground md:text-5xl md:leading-tight">
                智能体先锋队的 AI 实战弹药库
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-foreground-muted">
                这里不是追实时热闹，而是把五个智能体社群里的观点、工具、教程、案例、踩坑和高价值发言沉淀成可检索、可复用的知识资产。
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/topics"
                  className="inline-flex h-12 items-center rounded-full bg-accent px-6 text-sm font-bold text-background transition-transform hover:-translate-y-0.5 hover:bg-accent-light"
                >
                  进入社群弹药库 →
                </Link>
                <Link
                  href={`/daily/${latest.date}`}
                  className="inline-flex h-12 items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-6 text-sm font-bold text-foreground transition-transform hover:-translate-y-0.5 hover:border-white/[0.16]"
                >
                  查看最新一期
                </Link>
                <Link
                  href="/search"
                  className="inline-flex h-12 items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-6 text-sm font-bold text-foreground transition-transform hover:-translate-y-0.5 hover:border-white/[0.16]"
                >
                  搜索内容
                </Link>
              </div>
            </article>

            <aside className="glass-card p-5">
              <h2 className="text-lg font-bold text-foreground">已经沉淀</h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <StatBlock label="期内容" value={`${stats.issueCount}`} tone="text-accent" />
                <StatBlock label="话题索引" value={`${stats.topicCount}`} tone="text-success" />
                <StatBlock label="条消息" value={compactNumber(stats.messageCount)} tone="text-purple" />
                <StatBlock label="高价值观点" value={`${stats.insightCount}`} tone="text-pink" />
              </div>
              <p className="mt-4 text-sm leading-6 text-foreground-muted">
                另收录 {stats.toolCount.toLocaleString("zh-CN")} 个工具/资源线索，{stats.contributorCount.toLocaleString("zh-CN")} 位群友贡献过有效讨论。
              </p>
            </aside>
          </section>

          <section>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  社群沉淀下来的内容
                </h2>
                <p className="mt-2 text-sm leading-6 text-foreground-muted">
                  从聊天流里拆出来的长期资产，后续每一期都会继续往这里补充。
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <AssetCard
                title="观点库"
                description="群友对模型、Agent、产品、商业化和行业趋势的判断与共识。"
                value={`${stats.insightCount}`}
                href="/topics"
                tone="text-accent"
              />
              <AssetCard
                title="工具/教程"
                description="讨论中出现过的工具、脚本、工作流、部署路径和实操教程线索。"
                value={`${stats.toolCount}`}
                href="/search"
                tone="text-success"
              />
              <AssetCard
                title="案例库"
                description="跨境、电商、本地生活、内容生产、自动化等真实业务场景。"
                value="持续"
                href="/topics/商业化"
                tone="text-purple"
              />
              <AssetCard
                title="高价值发言"
                description="按话题保留关键贡献者，方便追踪谁在某个方向上说过有价值的话。"
                value={`${stats.contributorCount}`}
                href="/search"
                tone="text-pink"
              />
              <AssetCard
                title="期刊归档"
                description="每期五群精华、话题索引和原始整理文本，按日期长期保存。"
                value={`${stats.issueCount}`}
                href="/daily"
                tone="text-foreground"
              />
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
            <article className="glass-card card-hover p-5 hover:border-white/[0.14]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold tracking-[0.24em] text-accent">
                  最新一期
                </span>
                <time className="mono-num text-xs text-foreground-muted">
                  {formatDate(latest.date)}
                </time>
              </div>
              <h2 className="mt-4 text-2xl font-bold leading-8 text-foreground">
                {latest.title}
              </h2>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <StatBlock
                  label="群精华"
                  value={`${digestStatus.readyCount}/${digestStatus.totalCount}`}
                  tone="text-accent"
                />
                <StatBlock
                  label="消息"
                  value={`${latest.total_messages}`}
                  tone="text-success"
                />
                <StatBlock
                  label="索引"
                  value={`${latest.topic_count}`}
                  tone="text-purple"
                />
              </div>
              <Link
                href={`/daily/${latest.date}`}
                className="mt-5 inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-bold text-background transition-transform hover:-translate-y-0.5 hover:bg-accent-light"
              >
                打开本期 →
              </Link>
            </article>

            <article className="glass-card card-hover p-5 hover:border-white/[0.14]">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-foreground">本期五群精华</h2>
                  <p className="mt-1 text-sm text-foreground-muted">
                    长图作为快速入口，沉淀内容继续进入观点库和工具库。
                  </p>
                </div>
                <Link
                  href={`/daily/${latest.date}`}
                  className="text-sm font-semibold text-accent"
                >
                  查看长图 →
                </Link>
              </div>
              <div className="grid gap-3 md:grid-cols-5">
                {digestStatus.images.map((image) => (
                  <Link
                    key={image.key}
                    href={`/daily/${latest.date}`}
                    className={`rounded-[14px] border p-4 transition-all hover:-translate-y-0.5 ${
                      image.exists
                        ? "border-accent/18 bg-accent/[0.06]"
                        : "border-danger/20 bg-danger/[0.05]"
                    }`}
                  >
                    <p className="font-semibold text-foreground">{image.label}</p>
                    <p
                      className={`mt-3 text-xs font-semibold ${
                        image.exists ? "text-success" : "text-danger"
                      }`}
                    >
                      {image.exists ? "已生成" : "待补齐"}
                    </p>
                  </Link>
                ))}
              </div>
              <div className="mt-4 border-t border-white/[0.06] pt-4">
                <a
                  href={pilotDigest.image}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid gap-4 rounded-[14px] border border-white/[0.06] bg-white/[0.025] p-3 transition-all hover:-translate-y-0.5 hover:border-white/[0.14] md:grid-cols-[96px_minmax(0,1fr)]"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[10px] border border-white/[0.06] bg-white/[0.03]">
                    <Image
                      src={pilotDigest.image}
                      alt={`${pilotDigest.label} ${formatDate(pilotDigest.date)}`}
                      fill
                      sizes="96px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex min-w-0 flex-col justify-center">
                    <p className="text-xs font-bold tracking-[0.18em] text-accent">
                      进行中
                    </p>
                    <h3 className="mt-2 text-sm font-bold text-foreground group-hover:text-accent md:text-base">
                      {pilotDigest.label} · {formatDate(pilotDigest.date)}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-foreground-muted md:text-sm">
                      {pilotDigest.note}，先作为试运行长图展示，完整归档仍以已沉淀期刊为准。
                    </p>
                  </div>
                </a>
              </div>
            </article>
          </section>

          <section className="glass-card card-hover p-5 hover:border-white/[0.14]">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  正在形成的知识脉络
                </h2>
                <p className="mt-2 text-sm leading-6 text-foreground-muted">
                  这些不是单期标题，而是多期内容反复出现后沉淀出的主题方向。
                </p>
              </div>
              <Link href="/topics" className="text-sm font-semibold text-accent">
                全部主题 →
              </Link>
            </div>
            <TopicRail topics={topics} />
          </section>

          <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
            <article className="glass-card card-hover p-5 hover:border-white/[0.14]">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-lg font-bold text-foreground">本期弹药索引</h2>
                <Link href={`/daily/${latest.date}`} className="text-sm font-semibold text-accent">
                  查看完整 →
                </Link>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {latestTopics.map((topic) => (
                  <Link
                    key={topic.title}
                    href={`/daily/${latest.date}`}
                    className="rounded-[14px] border border-white/[0.06] bg-white/[0.025] p-4 transition-all hover:-translate-y-0.5 hover:border-white/[0.14]"
                  >
                    <h3 className="line-clamp-2 text-sm font-bold leading-6 text-foreground">
                      {topic.title}
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {topic.tags.slice(0, 3).map((tag) => (
                        <TagBadge key={tag}>{tag}</TagBadge>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </article>

            <article>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    往期归档
                  </h2>
                  <p className="mt-1 text-sm text-foreground-muted">
                    按日期回看每一期
                  </p>
                </div>
                <Link href="/daily" className="text-sm font-semibold text-accent">
                  全部 →
                </Link>
              </div>
              <div className="space-y-3">
                {recentCards.map((card) => {
                  const status = getDigestStatus(card.date);
                  return (
                    <Link
                      key={card.date}
                      href={`/daily/${card.date}`}
                      className="glass-card card-hover flex items-center justify-between gap-4 p-4 hover:border-white/[0.14]"
                    >
                      <span>
                        <time className="mono-num text-xs text-foreground-muted">
                          {formatDate(card.date)}
                        </time>
                        <span className="mt-1 block line-clamp-1 text-sm font-semibold text-foreground">
                          {card.title}
                        </span>
                      </span>
                      <span className="mono-num shrink-0 text-sm font-bold text-accent">
                        {status.readyCount}/{status.totalCount}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </article>
          </section>
        </div>
      )}
    </section>
  );
}
