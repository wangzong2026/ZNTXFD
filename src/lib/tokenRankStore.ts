import crypto from "crypto";
import fs from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { get as getBlob, put as putBlob } from "@vercel/blob";
import type { TokenRankEntry } from "@/lib/data";

export type TokenRankUser = {
  userId: number;
  tokenHash: string;
  name: string;
  role: string;
  createdAt: string;
  public: boolean;
};

export type TokenRankUsageRecord = {
  userId: number;
  tokenHash: string;
  deviceId: string;
  clientVersion: string;
  date: string;
  tool: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  totalTokens: number;
  createdAt: string;
};

type TokenRankStore = {
  users: TokenRankUser[];
  records: TokenRankUsageRecord[];
};

type UploadRecordInput = {
  date?: unknown;
  tool?: unknown;
  model?: unknown;
  inputTokens?: unknown;
  outputTokens?: unknown;
  cacheReadTokens?: unknown;
  cacheWriteTokens?: unknown;
  totalTokens?: unknown;
};

type UploadInput = {
  deviceId?: unknown;
  clientVersion?: unknown;
  records?: unknown;
};

const STORE_PATH =
  process.env.TOKEN_RANK_STORE_PATH ??
  (process.env.VERCEL
    ? path.join("/tmp", "token-rank-store.json")
    : path.join(process.cwd(), ".logs", "token-rank-store.json"));

const TOKEN_PREFIX = "znt_trk_";
const REDIS_KEY = "znt:token-rank:store";
const BLOB_KEY = "token-rank/store.json";
export const TOKEN_RANK_COOKIE = "znt_token_rank_token";

let redisClient: Redis | null | undefined;

function emptyStore(): TokenRankStore {
  return { users: [], records: [] };
}

function normalizeStore(raw: unknown): TokenRankStore {
  const store = raw as Partial<TokenRankStore> | null;
  return {
    users: Array.isArray(store?.users) ? store.users : [],
    records: Array.isArray(store?.records) ? store.records : [],
  };
}

function getRedis() {
  if (redisClient !== undefined) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  redisClient = url && token ? new Redis({ url, token }) : null;
  return redisClient;
}

function hasBlobStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function readStore(): Promise<TokenRankStore> {
  if (hasBlobStore()) {
    try {
      const blob = await getBlob(BLOB_KEY, { access: "private", useCache: false });
      if (!blob?.stream) return emptyStore();
      const text = await new Response(blob.stream).text();
      return normalizeStore(JSON.parse(text));
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) return emptyStore();
      return emptyStore();
    }
  }

  const redis = getRedis();
  if (redis) {
    const raw = await redis.get<TokenRankStore>(REDIS_KEY);
    return normalizeStore(raw);
  }

  if (!fs.existsSync(STORE_PATH)) return emptyStore();

  try {
    const raw = JSON.parse(fs.readFileSync(STORE_PATH, "utf8")) as Partial<TokenRankStore>;
    return normalizeStore(raw);
  } catch {
    return emptyStore();
  }
}

async function writeStore(store: TokenRankStore) {
  if (hasBlobStore()) {
    await putBlob(BLOB_KEY, JSON.stringify(store, null, 2), {
      access: "private",
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }

  const redis = getRedis();
  if (redis) {
    await redis.set(REDIS_KEY, store);
    return;
  }

  fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2));
}

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateToken() {
  return `${TOKEN_PREFIX}${crypto.randomBytes(24).toString("base64url")}`;
}

function toFiniteNumber(value: unknown) {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number) || number < 0) return 0;
  return Math.round(number);
}

function beijingDate() {
  return new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function addDays(date: string, offset: number) {
  const time = new Date(`${date}T00:00:00Z`).getTime() + offset * 86400000;
  return new Date(time).toISOString().slice(0, 10);
}

function dateRange(range: string) {
  const today = beijingDate();
  if (range === "yesterday") return { start: addDays(today, -1), end: addDays(today, -1) };
  if (range === "day-before") return { start: addDays(today, -2), end: addDays(today, -2) };
  if (range === "3d") return { start: addDays(today, -2), end: today };
  if (range === "7d") return { start: addDays(today, -6), end: today };
  if (range === "30d") return { start: addDays(today, -29), end: today };
  return { start: today, end: today };
}

function estimateCost(totalTokens: number) {
  return totalTokens / 1000000 * 0.6;
}

function normalizeUploadRecord(record: UploadRecordInput, fallbackDate: string) {
  const inputTokens = toFiniteNumber(record.inputTokens);
  const outputTokens = toFiniteNumber(record.outputTokens);
  const cacheReadTokens = toFiniteNumber(record.cacheReadTokens);
  const cacheWriteTokens = toFiniteNumber(record.cacheWriteTokens);
  const computedTotal = inputTokens + outputTokens + cacheReadTokens + cacheWriteTokens;
  const totalTokens = Math.max(computedTotal, toFiniteNumber(record.totalTokens));
  const date = typeof record.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(record.date)
    ? record.date
    : fallbackDate;
  const tool = typeof record.tool === "string" && record.tool.trim()
    ? record.tool.trim().slice(0, 64)
    : "unknown";
  const model = typeof record.model === "string" && record.model.trim()
    ? record.model.trim().slice(0, 128)
    : "unknown";

  if (totalTokens <= 0) return null;

  return {
    date,
    tool,
    model,
    inputTokens,
    outputTokens,
    cacheReadTokens,
    cacheWriteTokens,
    totalTokens,
  };
}

export async function createTokenRankUser(input: { name: string; role?: string }) {
  const store = await readStore();
  const now = new Date().toISOString();
  const token = generateToken();
  const user: TokenRankUser = {
    userId: Date.now(),
    tokenHash: hashToken(token),
    name: input.name.trim().slice(0, 32) || "智能体先锋队群友",
    role: input.role?.trim().slice(0, 32) || "自助上榜用户",
    createdAt: now,
    public: true,
  };

  store.users.push(user);
  await writeStore(store);

  return { user, token };
}

export async function findTokenRankUser(token: string) {
  if (!token.startsWith(TOKEN_PREFIX)) return null;
  const tokenHash = hashToken(token);
  const store = await readStore();
  return store.users.find((user) => user.tokenHash === tokenHash) ?? null;
}

export async function appendTokenRankUsage(token: string, input: UploadInput) {
  const user = await findTokenRankUser(token);
  if (!user) return { ok: false as const, status: 401, message: "上报 token 无效" };

  const store = await readStore();
  const fallbackDate = beijingDate();
  const now = new Date().toISOString();
  const deviceId =
    typeof input.deviceId === "string" && input.deviceId.trim()
      ? input.deviceId.trim().slice(0, 128)
      : "unknown-device";
  const clientVersion =
    typeof input.clientVersion === "string" && input.clientVersion.trim()
      ? input.clientVersion.trim().slice(0, 32)
      : "unknown";
  const rawRecords = Array.isArray(input.records) ? input.records : [];
  const records = rawRecords
    .slice(0, 2000)
    .map((record) => normalizeUploadRecord(record as UploadRecordInput, fallbackDate))
    .filter((record): record is NonNullable<typeof record> => Boolean(record))
    .map((record) => ({
      ...record,
      userId: user.userId,
      tokenHash: user.tokenHash,
      deviceId,
      clientVersion,
      createdAt: now,
    }));

  const incomingKeys = new Set(
    records.map((record) => [
      record.userId,
      record.deviceId,
      record.date,
      record.tool,
      record.model,
    ].join("|")),
  );
  store.records = store.records.filter((record) => {
    const key = [
      record.userId,
      record.deviceId,
      record.date,
      record.tool,
      record.model,
    ].join("|");
    return !incomingKeys.has(key);
  });
  store.records.push(...records);
  await writeStore(store);

  return { ok: true as const, accepted: records.length };
}

function summarizeRecords(records: TokenRankUsageRecord[]) {
  const total = records.reduce((sum, record) => sum + record.totalTokens, 0);
  const norm = records.reduce(
    (sum, record) => sum + record.inputTokens + record.outputTokens,
    0,
  );
  const devices = new Set(records.map((record) => record.deviceId));
  const dates = new Set(records.map((record) => record.date));
  const lastSync = records.reduce(
    (latest, record) => record.createdAt > latest ? record.createdAt : latest,
    "",
  );
  const byTool = records.reduce<Record<string, number>>((acc, record) => {
    acc[record.tool] = (acc[record.tool] ?? 0) + record.totalTokens;
    return acc;
  }, {});
  const byModel = records.reduce<Record<string, number>>((acc, record) => {
    acc[record.model] = (acc[record.model] ?? 0) + record.totalTokens;
    return acc;
  }, {});

  return {
    total,
    norm,
    cost: estimateCost(total),
    activeDays: dates.size,
    deviceCount: devices.size,
    lastSync,
    byTool,
    byModel,
  };
}

export async function getTokenRankMe(token: string) {
  const user = await findTokenRankUser(token);
  if (!user) return null;
  const store = await readStore();
  const records = store.records.filter((record) => record.userId === user.userId);
  const today = beijingDate();
  const todayRecords = records.filter((record) => record.date === today);

  return {
    user,
    today,
    totals: summarizeRecords(records),
    todayTotals: summarizeRecords(todayRecords),
  };
}

export async function getTokenRankLeaderboard(params: {
  board?: string;
  range?: string;
  metric?: "total" | "norm" | "cost";
}) {
  const store = await readStore();
  const board = params.board || "total";
  const range = params.range || "today";
  const metric = params.metric || "total";
  const { start, end } = dateRange(range);
  const records = store.records.filter((record) => record.date >= start && record.date <= end);
  const grouped = new Map<number, {
    user: TokenRankUser;
    total: number;
    norm: number;
    byTool: Record<string, number>;
    byModel: Record<string, number>;
    devices: Set<string>;
    dates: Set<string>;
  }>();

  for (const record of records) {
    if (board !== "total" && record.tool !== board) continue;
    const user = store.users.find((candidate) => candidate.userId === record.userId);
    if (!user) continue;
    const current = grouped.get(user.userId) ?? {
      user,
      total: 0,
      norm: 0,
      byTool: {},
      byModel: {},
      devices: new Set<string>(),
      dates: new Set<string>(),
    };
    current.total += record.totalTokens;
    current.norm += record.inputTokens + record.outputTokens;
    current.byTool[record.tool] = (current.byTool[record.tool] ?? 0) + record.totalTokens;
    current.byModel[record.model] = (current.byModel[record.model] ?? 0) + record.totalTokens;
    current.devices.add(record.deviceId);
    current.dates.add(record.date);
    grouped.set(user.userId, current);
  }

  const liveEntries: TokenRankEntry[] = [...grouped.values()].map((item, index) => ({
    rank: index + 1,
    userId: item.user.userId,
    name: item.user.name,
    role: item.user.role,
    score: item.total,
    norm: item.norm,
    cost: estimateCost(item.total),
    streakDays: item.dates.size,
    deviceCount: item.devices.size,
    anomaly: false,
    byTool: item.byTool,
    byModel: item.byModel,
  }));

  const sorted = liveEntries
    .filter((entry) => board === "total" || (entry.byTool[board] ?? 0) > 0)
    .sort((a, b) => {
      const aBoardRatio = board === "total" ? 1 : (a.byTool[board] ?? 0) / a.score;
      const bBoardRatio = board === "total" ? 1 : (b.byTool[board] ?? 0) / b.score;
      const aValue = metric === "cost"
        ? a.cost * aBoardRatio
        : metric === "norm"
          ? a.norm * aBoardRatio
          : board === "total" ? a.score : (a.byTool[board] ?? 0);
      const bValue = metric === "cost"
        ? b.cost * bBoardRatio
        : metric === "norm"
          ? b.norm * bBoardRatio
          : board === "total" ? b.score : (b.byTool[board] ?? 0);
      return bValue - aValue;
    })
    .map((entry, index) => {
      if (board === "total") return { ...entry, rank: index + 1 };
      const boardScore = entry.byTool[board] ?? 0;
      const ratio = entry.score > 0 ? boardScore / entry.score : 0;
      return {
        ...entry,
        rank: index + 1,
        score: boardScore,
        norm: Math.round(entry.norm * ratio),
        cost: entry.cost * ratio,
      };
    });

  return {
    status: 0,
    board,
    range,
    metric,
    entries: sorted,
    totalMembers: store.users.length,
    updatedAt: new Date().toISOString(),
  };
}

export function extractBearerToken(headers: Headers) {
  const authorization = headers.get("authorization") ?? "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() ?? "";
}
