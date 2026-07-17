import Link from "next/link";
import { TagBadge } from "@/components/TagBadge";
import { getTrustedKnowledgeItems } from "@/lib/data";
import type { TrustStatus } from "@/lib/data";

const statusText: Record<TrustStatus, string> = {
  ai_reviewed: "AI 初审",
  needs_repro: "待复现",
  reproducing: "复现中",
  verified: "已复现",
};

const statusTone: Record<TrustStatus, string> = {
  ai_reviewed: "text-accent",
  needs_repro: "text-danger",
  reproducing: "text-purple",
  verified: "text-success",
};

function ScoreRing({ score }: { score: number }) {
  return (
    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent/[0.06]">
      <span className="mono-num text-lg font-bold text-accent">{score}</span>
      <span className="absolute -bottom-1 rounded-full bg-background px-2 text-[10px] font-semibold text-foreground-muted">
        信任
      </span>
    </div>
  );
}

export default function KnowledgePage() {
  const items = getTrustedKnowledgeItems();
  const topItems = items.slice(0, 36);
  const verifiedCount = items.filter((item) => item.status === "verified").length;
  const evidenceCount = items.reduce((sum, item) => sum + item.evidenceCount, 0);
  const reproCount = items.reduce((sum, item) => sum + item.reproductionTotal, 0);

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-4 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(240,185,11,0.16)_0%,rgba(240,185,11,0)_68%)] blur-2xl" />
      <div className="pointer-events-none absolute right-0 top-44 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(2,192,118,0.12)_0%,rgba(2,192,118,0)_70%)] blur-2xl" />

      <header className="relative mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="glass-card glow-border p-6 md:p-8">
          <p className="text-xs font-bold tracking-[0.24em] text-accent">
            TRUSTED KNOWLEDGE
          </p>
          <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight text-foreground md:text-5xl">
            可信知识条目
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-foreground-muted">
            从群精华和日报里抽取可引用结论，每条都带来源、证据、复现状态和可信度。第一版先由 AI 自动初筛，后续接人工审核与专家复现。
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/questions"
              className="inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-bold text-background transition-transform hover:-translate-y-0.5"
            >
              用知识库回答问题 →
            </Link>
            <Link
              href="/daily"
              className="inline-flex h-11 items-center rounded-full border border-white/[0.08] bg-white/[0.03] px-5 text-sm font-bold text-foreground transition-transform hover:-translate-y-0.5 hover:border-white/[0.16]"
            >
              回到期刊来源
            </Link>
          </div>
        </div>

        <aside className="glass-card p-5">
          <h2 className="text-lg font-bold text-foreground">信任档案</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[14px] border border-white/[0.06] bg-white/[0.025] p-4">
              <p className="mono-num text-2xl font-bold text-accent">{items.length}</p>
              <p className="mt-1 text-sm text-foreground-muted">条候选知识</p>
            </div>
            <div className="rounded-[14px] border border-white/[0.06] bg-white/[0.025] p-4">
              <p className="mono-num text-2xl font-bold text-success">{verifiedCount}</p>
              <p className="mt-1 text-sm text-foreground-muted">已复现</p>
            </div>
            <div className="rounded-[14px] border border-white/[0.06] bg-white/[0.025] p-4">
              <p className="mono-num text-2xl font-bold text-purple">{evidenceCount}</p>
              <p className="mt-1 text-sm text-foreground-muted">条证据</p>
            </div>
            <div className="rounded-[14px] border border-white/[0.06] bg-white/[0.025] p-4">
              <p className="mono-num text-2xl font-bold text-pink">{reproCount}</p>
              <p className="mt-1 text-sm text-foreground-muted">复现记录</p>
            </div>
          </div>
        </aside>
      </header>

      <div className="relative mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">高可信候选</h2>
          <p className="mt-1 text-sm text-foreground-muted">
            先展示可信度最高的 36 条，后续可加筛选、审核台和人工编辑。
          </p>
        </div>
        <span className="mono-num text-sm text-foreground-muted">
          {topItems.length}/{items.length}
        </span>
      </div>

      <div className="relative grid gap-4 lg:grid-cols-2">
        {topItems.map((item) => (
          <Link
            key={item.slug}
            href={`/knowledge/${item.slug}`}
            className="glass-card card-hover group grid gap-4 p-5 hover:border-white/[0.14] md:grid-cols-[72px_minmax(0,1fr)]"
          >
            <ScoreRing score={item.trustScore} />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className={statusTone[item.status]}>{statusText[item.status]}</span>
                <span className="text-foreground-disabled">·</span>
                <span className="text-foreground-muted">{item.category}</span>
                <span className="text-foreground-disabled">·</span>
                <time className="mono-num text-foreground-muted">{item.updatedAt}</time>
              </div>
              <h3 className="mt-2 line-clamp-2 text-lg font-bold leading-7 text-foreground group-hover:text-accent">
                {item.title}
              </h3>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-foreground-muted">
                {item.claim}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.slice(0, 4).map((tag) => (
                  <TagBadge key={tag}>{tag}</TagBadge>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2 border-t border-white/[0.06] pt-4 text-xs text-foreground-muted">
                <span>证据 <b className="mono-num text-foreground">{item.evidenceCount}</b></span>
                <span>复现 <b className="mono-num text-success">{item.reproductionPassed}/{item.reproductionTotal}</b></span>
                <span>争议 <b className="mono-num text-foreground">{item.disputeCount}</b></span>
                <span>引用 <b className="mono-num text-foreground">{item.citationCount}</b></span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
