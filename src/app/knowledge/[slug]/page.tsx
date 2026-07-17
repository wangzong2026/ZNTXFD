import Link from "next/link";
import { notFound } from "next/navigation";
import { TagBadge } from "@/components/TagBadge";
import {
  getTrustedKnowledgeItem,
  getTrustedKnowledgeItems,
} from "@/lib/data";
import type { ReproductionReport, TrustStatus } from "@/lib/data";

type KnowledgeDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

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

const reportTone: Record<ReproductionReport["status"], string> = {
  passed: "text-success",
  failed: "text-danger",
  pending: "text-accent",
};

const reportText: Record<ReproductionReport["status"], string> = {
  passed: "成功",
  failed: "失败",
  pending: "待补充",
};

export function generateStaticParams() {
  return getTrustedKnowledgeItems().slice(0, 120).map((item) => ({
    slug: item.slug,
  }));
}

function TrustCard({
  label,
  value,
  tone = "text-foreground",
}: {
  label: string;
  value: string | number;
  tone?: string;
}) {
  return (
    <div className="border-b border-white/[0.06] px-4 py-4 last:border-b-0 md:px-5">
      <p className="text-xs text-foreground-muted">{label}</p>
      <p className={`mono-num mt-2 text-xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}

export default async function KnowledgeDetailPage({ params }: KnowledgeDetailPageProps) {
  const { slug } = await params;
  const item = getTrustedKnowledgeItem(slug);

  if (!item) {
    notFound();
  }

  return (
    <section className="relative mx-auto w-full max-w-6xl overflow-hidden">
      <div className="pointer-events-none absolute -left-28 top-4 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(240,185,11,0.18)_0%,rgba(240,185,11,0)_68%)] blur-2xl" />
      <div className="pointer-events-none absolute right-0 top-44 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(2,192,118,0.12)_0%,rgba(2,192,118,0)_70%)] blur-2xl" />

      <Link
        href="/knowledge"
        className="glass card-hover relative mb-5 inline-flex items-center rounded-full px-3 py-2 text-sm font-medium text-foreground-muted hover:border-white/[0.14] hover:text-accent"
      >
        ← 返回可信知识库
      </Link>

      <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <article className="space-y-5">
          <header className="glass-card glow-border p-5 md:p-7">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className={statusTone[item.status]}>{statusText[item.status]}</span>
              <span className="text-foreground-disabled">·</span>
              <span className="text-foreground-muted">{item.category}</span>
              <span className="text-foreground-disabled">·</span>
              <time className="mono-num text-foreground-muted">更新 {item.updatedAt}</time>
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-foreground md:text-5xl">
              {item.title}
            </h1>
            <p className="mt-5 rounded-[14px] border border-accent/10 bg-accent/[0.05] p-4 text-base font-semibold leading-8 text-foreground md:text-lg">
              {item.claim}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <TagBadge key={tag}>{tag}</TagBadge>
              ))}
            </div>
          </header>

          <section className="glass-card card-hover p-5 hover:border-white/[0.14]">
            <h2 className="text-xl font-bold text-foreground">证据链</h2>
            <p className="mt-2 text-sm leading-6 text-foreground-muted">
              第一版证据来自日报和群精华的结构化字段；后续会加入原始消息片段、外部链接和专家批注。
            </p>
            <div className="mt-5 space-y-3">
              {item.evidences.map((evidence) => (
                <div
                  key={`${evidence.label}-${evidence.text}`}
                  className="rounded-[14px] border border-white/[0.06] bg-white/[0.025] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-sm font-bold text-accent">{evidence.label}</span>
                    <Link
                      href={evidence.sourceHref}
                      className="mono-num text-xs font-semibold text-foreground-muted hover:text-accent"
                    >
                      {evidence.sourceDate} · {evidence.sourceTitle}
                    </Link>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-foreground-muted">
                    {evidence.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="glass-card card-hover p-5 hover:border-white/[0.14]">
            <h2 className="text-xl font-bold text-foreground">复现报告</h2>
            <div className="mt-5 space-y-4">
              {item.reproductions.map((report) => (
                <div
                  key={report.id}
                  className="rounded-[14px] border border-white/[0.06] bg-white/[0.025] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-foreground">{report.tester}</p>
                      <p className="mt-1 text-xs text-foreground-muted">
                        {report.level} · {report.environment}
                      </p>
                    </div>
                    <span className={`text-sm font-bold ${reportTone[report.status]}`}>
                      {reportText[report.status]}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-foreground-muted">
                    {report.summary}
                  </p>
                  {report.output ? (
                    <p className="mono-num mt-3 rounded-[10px] border border-success/15 bg-success/[0.06] px-3 py-2 text-xs text-success">
                      输出标记：{report.output}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="glass-card card-hover p-5 hover:border-white/[0.14]">
              <h2 className="text-lg font-bold text-foreground">适用边界</h2>
              <div className="mt-4 space-y-3">
                {item.applicability.map((text) => (
                  <p key={text} className="flex gap-3 text-sm leading-6 text-foreground-muted">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-success" />
                    <span>{text}</span>
                  </p>
                ))}
              </div>
            </div>
            <div className="glass-card card-hover p-5 hover:border-white/[0.14]">
              <h2 className="text-lg font-bold text-foreground">风险提醒</h2>
              <div className="mt-4 space-y-3">
                {item.risks.map((text) => (
                  <p key={text} className="flex gap-3 text-sm leading-6 text-foreground-muted">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-danger" />
                    <span>{text}</span>
                  </p>
                ))}
              </div>
            </div>
          </section>
        </article>

        <aside className="space-y-4">
          <section className="glass-card overflow-hidden">
            <div className="flex items-center gap-4 border-b border-white/[0.06] p-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-accent/25 bg-accent/[0.06]">
                <span className="mono-num text-2xl font-bold text-accent">
                  {item.trustScore}
                </span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">信任档案</h2>
                <p className="mt-1 text-sm text-foreground-muted">证据 · 复现 · 引用</p>
              </div>
            </div>
            <TrustCard label="证据" value={item.evidenceCount} tone="text-accent" />
            <TrustCard
              label="复现"
              value={`${item.reproductionPassed}/${item.reproductionTotal}`}
              tone="text-success"
            />
            <TrustCard label="争议" value={item.disputeCount} tone="text-danger" />
            <TrustCard label="版本" value={item.version} tone="text-purple" />
            <TrustCard label="引用" value={item.citationCount} tone="text-foreground" />
          </section>

          <section className="glass-card card-hover p-5 hover:border-white/[0.14]">
            <h2 className="text-lg font-bold text-foreground">来源</h2>
            <Link
              href={item.sourceHref}
              className="mt-4 block rounded-[14px] border border-white/[0.06] bg-white/[0.025] p-4 hover:border-white/[0.14]"
            >
              <time className="mono-num text-xs text-accent">{item.sourceDate}</time>
              <p className="mt-2 text-sm font-bold leading-6 text-foreground">
                {item.sourceTitle}
              </p>
            </Link>
          </section>

          <section className="glass-card card-hover p-5 hover:border-white/[0.14]">
            <h2 className="text-lg font-bold text-foreground">贡献者</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.contributors.map((name) => (
                <span
                  key={name}
                  className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1.5 text-xs text-foreground-muted"
                >
                  {name}
                </span>
              ))}
            </div>
          </section>

          <section className="glass-card card-hover p-5 hover:border-white/[0.14]">
            <h2 className="text-lg font-bold text-foreground">相关工具</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tools.length > 0 ? (
                item.tools.map((tool) => <TagBadge key={tool}>{tool}</TagBadge>)
              ) : (
                <p className="text-sm text-foreground-muted">暂无工具标签</p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
