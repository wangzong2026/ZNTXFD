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
