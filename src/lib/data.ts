import fs from "fs";
import path from "path";

export type DailyIndexItem = {
  date: string;
  title: string;
  tags: string[];
  topic_count: number;
  total_messages: number;
  active_members: number;
};

export type DailyTopic = {
  title: string;
  content: string;
  key_insights: string[];
  tools_mentioned: string[];
  action_items: string[];
  contributors: string[];
  tags: string[];
};

export type DailyReport = {
  date: string;
  title: string;
  topics: DailyTopic[];
  stats: {
    total_messages: number;
    active_members: number;
  };
};

export type KnowledgeTopic = {
  slug: string;
  name: string;
  count: number;
  dates: string[];
  insights: string[];
  tools: string[];
  contributors: string[];
  relatedTags: string[];
};

export type SearchIndexItem = {
  id: string;
  date: string;
  reportTitle: string;
  title: string;
  content: string;
  tags: string[];
  tools: string[];
  insights: string[];
  contributors: string[];
};

export type TrustStatus = "ai_reviewed" | "needs_repro" | "reproducing" | "verified";

export type KnowledgeEvidence = {
  label: string;
  text: string;
  sourceTitle: string;
  sourceDate: string;
  sourceHref: string;
};

export type ReproductionReport = {
  id: string;
  tester: string;
  level: string;
  status: "passed" | "failed" | "pending";
  environment: string;
  summary: string;
  output?: string;
};

export type TrustedKnowledgeItem = {
  slug: string;
  title: string;
  category: string;
  claim: string;
  summary: string;
  tags: string[];
  tools: string[];
  contributors: string[];
  sourceTitle: string;
  sourceDate: string;
  sourceHref: string;
  trustScore: number;
  evidenceCount: number;
  citationCount: number;
  disputeCount: number;
  reproductionPassed: number;
  reproductionTotal: number;
  status: TrustStatus;
  version: string;
  updatedAt: string;
  applicability: string[];
  risks: string[];
  evidences: KnowledgeEvidence[];
  reproductions: ReproductionReport[];
};

export type QuestionItem = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  askedBy: string;
  status: "ai_answered" | "expert_needed" | "answered";
  answer: string;
  relatedKnowledge: TrustedKnowledgeItem[];
  votes: number;
  answers: number;
};

export type DigestGroup = {
  key: string;
  label: string;
  name: string;
};

export type DigestImage = DigestGroup & {
  exists: boolean;
  src: string;
};

export const DIGEST_GROUPS: DigestGroup[] = [
  { key: "group1", label: "一群", name: "智能体先锋队一群" },
  { key: "group2", label: "二群", name: "智能体先锋队二群" },
  { key: "group3", label: "三群", name: "智能体先锋队三群" },
  { key: "group4", label: "四群", name: "智能体先锋队四群" },
  { key: "group5", label: "五群", name: "智能体先锋队五群" },
];

export function getDailyIndex(): DailyIndexItem[] {
  const filePath = path.join(process.cwd(), "data", "index.json");
  const content = fs.readFileSync(filePath, "utf8");
  return JSON.parse(content) as DailyIndexItem[];
}

export function getSearchIndex(): SearchIndexItem[] {
  const filePath = path.join(process.cwd(), "data", "search-index.json");
  const content = fs.readFileSync(filePath, "utf8");
  return JSON.parse(content) as SearchIndexItem[];
}

export function getDailyReport(date: string): DailyReport {
  const filePath = path.join(process.cwd(), "data", "daily", `${date}.json`);
  const content = fs.readFileSync(filePath, "utf8");
  const raw = JSON.parse(content);
  for (const topic of raw.topics ?? []) {
    topic.key_insights ??= [];
    topic.tools_mentioned ??= [];
    topic.action_items ??= [];
    topic.contributors ??= [];
    topic.tags ??= [];
  }
  return raw as DailyReport;
}

export function getDigestImages(date: string): DigestImage[] {
  const dir = path.join(process.cwd(), "public", "digest-images", date);

  return DIGEST_GROUPS.map((group) => {
    const src = `/digest-images/${date}/${group.key}.png`;
    const filePath = path.join(dir, `${group.key}.png`);
    return {
      ...group,
      src,
      exists: fs.existsSync(filePath),
    };
  });
}

export function getDigestStatus(date: string) {
  const images = getDigestImages(date);
  const readyCount = images.filter((image) => image.exists).length;
  return {
    images,
    readyCount,
    totalCount: images.length,
    complete: readyCount === images.length,
  };
}

export function isRawishReport(report: DailyReport) {
  const topics = report.topics ?? [];
  if (topics.length === 0) return false;

  const rawishCount = topics.filter((topic) => {
    const content = topic.content ?? "";
    return content.trim().startsWith("- ") || content.split("：").length >= 7;
  }).length;

  return rawishCount / topics.length > 0.5;
}

export function getAllDates(): string[] {
  return getDailyIndex().map((item) => item.date);
}

export function getKnowledgeTopics(): KnowledgeTopic[] {
  const index = getDailyIndex();
  const tagMap = new Map<
    string,
    {
      dates: Set<string>;
      insights: string[];
      tools: Set<string>;
      contributors: Set<string>;
      coTags: Map<string, number>;
    }
  >();

  for (const item of index) {
    let report: DailyReport | null = null;
    try {
      report = getDailyReport(item.date);
    } catch {
      continue;
    }
    for (const topic of report.topics) {
      for (const tag of topic.tags) {
        const t = tag.trim();
        if (!t) continue;
        if (!tagMap.has(t)) {
          tagMap.set(t, {
            dates: new Set(),
            insights: [],
            tools: new Set(),
            contributors: new Set(),
            coTags: new Map(),
          });
        }
        const entry = tagMap.get(t)!;
        entry.dates.add(item.date);
        for (const ins of topic.key_insights ?? []) entry.insights.push(ins);
        for (const tool of topic.tools_mentioned ?? []) entry.tools.add(tool);
        for (const c of topic.contributors) entry.contributors.add(c);
        for (const otherTag of topic.tags) {
          const ot = otherTag.trim();
          if (ot && ot !== t) {
            entry.coTags.set(ot, (entry.coTags.get(ot) ?? 0) + 1);
          }
        }
      }
    }
  }

  const topics: KnowledgeTopic[] = [];
  for (const [name, data] of tagMap) {
    const slug = name;
    const relatedTags = [...data.coTags.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([t]) => t);
    topics.push({
      slug,
      name,
      count: data.dates.size,
      dates: [...data.dates].sort().reverse(),
      insights: data.insights.slice(0, 20),
      tools: [...data.tools],
      contributors: [...data.contributors],
      relatedTags,
    });
  }

  return topics.sort((a, b) => b.count - a.count);
}

function uniqueStrings(items: string[]) {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function makeSlug(value: string, fallback: string) {
  const normalized = value
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || fallback;
}

function firstSentence(value: string) {
  const text = value.replace(/\s+/g, " ").trim();
  const parts = text.split(/[。！？!?]/).filter(Boolean);
  return (parts[0] ?? text).slice(0, 96);
}

function inferCategory(item: SearchIndexItem) {
  const tags = item.tags.join(" ");
  const text = `${item.title} ${tags} ${item.content}`;
  if (/教程|步骤|配置|部署|流程|SOP|CLI|API|命令/.test(text)) return "教程";
  if (/风险|封号|失败|报错|安全|风控|坑/.test(text)) return "风险";
  if (/商业|变现|客户|报价|案例|电商|跨境/.test(text)) return "案例";
  if (/Agent|智能体|MCP|RAG|工作流/.test(text)) return "Agent";
  return item.tags[0] ?? "观点";
}

function statusLabelSeed(item: SearchIndexItem): TrustStatus {
  const text = `${item.title} ${item.content} ${item.insights.join(" ")}`;
  if (/失败|报错|风险|封号|不稳定|争议/.test(text)) return "needs_repro";
  if (/教程|配置|部署|流程|代码|API|MCP|RAG|Codex|Claude/.test(text)) return "reproducing";
  if (item.insights.length >= 4 && item.contributors.length >= 3) return "verified";
  return "ai_reviewed";
}

function buildReproductions(item: SearchIndexItem, status: TrustStatus): ReproductionReport[] {
  const hasTechnicalSignal = /教程|配置|部署|流程|API|MCP|RAG|Codex|Claude|脚本|代码/.test(
    `${item.title} ${item.content} ${item.tags.join(" ")}`,
  );
  const reports: ReproductionReport[] = [
    {
      id: `${item.id}-ai-review`,
      tester: "旺总AI",
      level: "AI 初审",
      status: "pending",
      environment: "日报 JSON / 群精华索引",
      summary: "已完成结构化抽取，等待人工或专家在真实环境中复现。",
    },
  ];

  if (status === "verified" || status === "reproducing" || hasTechnicalSignal) {
    reports.push({
      id: `${item.id}-sample-repro`,
      tester: item.contributors[0] ?? "社群贡献者",
      level: status === "verified" ? "L5 骨干" : "L3 实践者",
      status: status === "verified" ? "passed" : "pending",
      environment: item.tools.slice(0, 3).join(" / ") || "待补充环境",
      summary:
        status === "verified"
          ? "来自多条群聊证据和工具线索，已具备进入可信知识库的基础条件。"
          : "需要补充运行环境、输入输出和失败边界后再升级可信度。",
      output: status === "verified" ? "evidence-linked" : undefined,
    });
  }

  if (status === "needs_repro") {
    reports.push({
      id: `${item.id}-risk-check`,
      tester: "复现队列",
      level: "待验证",
      status: "failed",
      environment: "风险/失败样本",
      summary: "内容包含失败或风险信号，暂不作为稳定结论引用。",
    });
  }

  return reports;
}

export function getTrustedKnowledgeItems(): TrustedKnowledgeItem[] {
  const index = getSearchIndex();
  const usedSlugs = new Map<string, number>();

  return index
    .filter((item) => item.content.trim().length > 80)
    .map((item) => {
      const baseSlug = makeSlug(item.title, item.id);
      const count = usedSlugs.get(baseSlug) ?? 0;
      usedSlugs.set(baseSlug, count + 1);
      const slug = count === 0 ? baseSlug : `${baseSlug}-${count + 1}`;
      const status = statusLabelSeed(item);
      const evidences = uniqueStrings([
        ...item.insights.slice(0, 3),
        firstSentence(item.content),
      ]).slice(0, 4);
      const evidenceCount = Math.max(1, evidences.length);
      const reproductions = buildReproductions(item, status);
      const reproductionPassed = reproductions.filter((report) => report.status === "passed").length;
      const reproductionTotal = reproductions.length;
      const disputeCount = status === "needs_repro" ? 1 : 0;
      const citationCount = Math.max(1, item.tags.length + item.tools.length + Math.floor(item.content.length / 900));
      const trustScore = Math.min(
        96,
        Math.max(
          52,
          58 +
            evidenceCount * 5 +
            reproductionPassed * 8 +
            Math.min(item.contributors.length, 5) * 2 +
            Math.min(item.tools.length, 5) -
            disputeCount * 12,
        ),
      );

      return {
        slug,
        title: item.title,
        category: inferCategory(item),
        claim: item.insights[0] || firstSentence(item.content),
        summary: firstSentence(item.content),
        tags: uniqueStrings(item.tags).slice(0, 6),
        tools: uniqueStrings(item.tools).slice(0, 8),
        contributors: uniqueStrings(item.contributors).slice(0, 8),
        sourceTitle: item.reportTitle,
        sourceDate: item.date,
        sourceHref: `/daily/${item.date}`,
        trustScore,
        evidenceCount,
        citationCount,
        disputeCount,
        reproductionPassed,
        reproductionTotal,
        status,
        version: reproductionPassed > 0 ? "v2" : "v1",
        updatedAt: item.date,
        applicability: [
          "适合从社群讨论中快速定位可执行观点",
          item.tools.length > 0 ? `涉及工具：${item.tools.slice(0, 3).join(" / ")}` : "需要补充工具和环境边界",
          "引用时必须带来源期刊和原始上下文",
        ],
        risks: [
          status === "needs_repro"
            ? "含风险或失败信号，暂不建议直接照搬"
            : "仍需人工确认适用场景和版本差异",
          "群聊观点可能随模型、价格、政策和工具版本变化而过期",
        ],
        evidences: evidences.map((text, index) => ({
          label: index === 0 ? "核心证据" : `证据 ${index + 1}`,
          text,
          sourceTitle: item.reportTitle,
          sourceDate: item.date,
          sourceHref: `/daily/${item.date}`,
        })),
        reproductions,
      };
    })
    .sort((a, b) => b.trustScore - a.trustScore || b.sourceDate.localeCompare(a.sourceDate));
}

export function getTrustedKnowledgeItem(slug: string) {
  const decoded = decodeURIComponent(slug);
  return getTrustedKnowledgeItems().find((item) => item.slug === decoded);
}

export function getQuestionItems(): QuestionItem[] {
  const items = getTrustedKnowledgeItems();
  const pick = (predicate: (item: TrustedKnowledgeItem) => boolean) =>
    items.find(predicate) ?? items[0];
  const questions = [
    {
      slug: "codex-config-auth",
      title: "Codex 接第三方 API 时，怎么保留 ChatGPT 官方登录态？",
      description: "群里反复提到 auth.json、config.toml 和第三方 provider，想知道哪部分能改、哪部分不能碰。",
      seed: pick((item) => /Codex|OpenAI|ChatGPT/.test(`${item.title} ${item.tags.join(" ")}`)),
      askedBy: "L2 学徒",
    },
    {
      slug: "agent-workflow-repro",
      title: "一个 Agent 工作流内容，怎样判断它真的可复现？",
      description: "只看群友说有效还不够，想知道需要哪些证据、日志、环境和失败边界。",
      seed: pick((item) => /Agent|工作流|MCP|RAG/.test(`${item.title} ${item.tags.join(" ")}`)),
      askedBy: "L3 实践者",
    },
    {
      slug: "business-case-trust",
      title: "商业化案例怎么进入可信知识库，而不是只停留在聊天摘要？",
      description: "希望把群友的接单、报价、交付经验变成能长期引用的条目。",
      seed: pick((item) => /商业|变现|案例|电商|客户/.test(`${item.title} ${item.tags.join(" ")}`)),
      askedBy: "L4 贡献者",
    },
  ];

  return questions.map((question, index) => ({
    slug: question.slug,
    title: question.title,
    description: question.description,
    tags: question.seed.tags.slice(0, 4),
    askedBy: question.askedBy,
    status: index === 0 ? "answered" : index === 1 ? "ai_answered" : "expert_needed",
    answer: `AI 先引用「${question.seed.title}」作为基础答案：${question.seed.claim}。下一步需要补充复现记录和适用边界，才能升级为专家确认答案。`,
    relatedKnowledge: [question.seed, ...items.filter((item) => item.slug !== question.seed.slug).slice(index, index + 2)],
    votes: 62 - index * 11,
    answers: index === 2 ? 1 : 3 - index,
  }));
}
