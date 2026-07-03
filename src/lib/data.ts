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

export function getDailyIndex(): DailyIndexItem[] {
  const filePath = path.join(process.cwd(), "data", "index.json");
  const content = fs.readFileSync(filePath, "utf8");
  return JSON.parse(content) as DailyIndexItem[];
}

export function getDailyReport(date: string): DailyReport {
  const filePath = path.join(process.cwd(), "data", "daily", `${date}.json`);
  const content = fs.readFileSync(filePath, "utf8");
  return JSON.parse(content) as DailyReport;
}

export function getAllDates(): string[] {
  return getDailyIndex().map((item) => item.date);
}
