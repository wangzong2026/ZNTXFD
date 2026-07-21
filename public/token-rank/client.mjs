#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const VERSION = "0.1.0";
const CONFIG_DIR = path.join(os.homedir(), ".znt-tokenrank");
const CONFIG_PATH = path.join(CONFIG_DIR, "config.json");
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const MAX_FILES_PER_TOOL = 160;
const LOOKBACK_MS = 35 * 24 * 60 * 60 * 1000;

const TOOL_SOURCES = [
  { tool: "codex", dirs: ["~/.codex", "~/.codex/sessions"] },
  { tool: "claude-code", dirs: ["~/.claude", "~/.claude/projects"] },
  { tool: "cursor", dirs: ["~/Library/Application Support/Cursor/User/globalStorage", "~/.cursor"] },
  { tool: "gemini", dirs: ["~/.gemini"] },
  { tool: "kimi", dirs: ["~/.kimi", "~/Library/Application Support/Kimi"] },
  { tool: "qwen", dirs: ["~/.qwen"] },
  { tool: "opencode", dirs: ["~/.opencode"] },
  { tool: "cline", dirs: ["~/Library/Application Support/Code/User/globalStorage", "~/Library/Application Support/Cursor/User/globalStorage"] },
  { tool: "roo-code", dirs: ["~/Library/Application Support/Code/User/globalStorage", "~/Library/Application Support/Cursor/User/globalStorage"] },
  { tool: "kilo-code", dirs: ["~/Library/Application Support/Code/User/globalStorage", "~/Library/Application Support/Cursor/User/globalStorage"] },
  { tool: "copilot-cli", dirs: ["~/.github-copilot", "~/.config/github-copilot"] },
  { tool: "amp", dirs: ["~/.amp"] },
  { tool: "grok", dirs: ["~/.grok"] },
  { tool: "minimax", dirs: ["~/.minimax"] },
  { tool: "codebuddy", dirs: ["~/.codebuddy"] },
  { tool: "antigravity", dirs: ["~/.antigravity"] },
  { tool: "hermes", dirs: ["~/.hermes"] },
  { tool: "openclaw", dirs: ["~/.openclaw"] },
  { tool: "workbuddy", dirs: ["~/.workbuddy"] },
  { tool: "zcode", dirs: ["~/.zcode"] },
  { tool: "droid", dirs: ["~/.droid"] },
  { tool: "kiro", dirs: ["~/.kiro"] },
  { tool: "reasonix", dirs: ["~/.reasonix"] },
];

function expandHome(value) {
  if (value === "~") return os.homedir();
  if (value.startsWith("~/")) return path.join(os.homedir(), value.slice(2));
  return value;
}

function todayFromTime(time) {
  return new Date(time + 8 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function readConfig() {
  if (!fs.existsSync(CONFIG_PATH)) return null;
  return JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
}

function writeConfig(next) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(next, null, 2));
}

function getArg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return "";
  return process.argv[index + 1] || "";
}

function isPlaceholderToken(value) {
  return !value || value.includes("xxx") || value.includes("your_private_token");
}

function ensureConfig() {
  const token = getArg("--token");
  const endpoint = getArg("--endpoint");
  const existing = readConfig() || {};
  const deviceId = existing.deviceId || crypto.randomBytes(16).toString("hex");
  const next = {
    ...existing,
    token: token || existing.token,
    endpoint: endpoint || existing.endpoint,
    deviceId,
  };

  if (isPlaceholderToken(next.token) || !next.endpoint) {
    throw new Error("缺少真实专属令牌。请先在 Token 消耗榜页面点击「生成命令」，不要运行 znt_trk_xxx_your_private_token 占位命令。");
  }

  writeConfig(next);
  return next;
}

function walkRecentFiles(root, out = []) {
  if (out.length >= MAX_FILES_PER_TOOL) return out;
  let items = [];

  try {
    items = fs.readdirSync(root, { withFileTypes: true });
  } catch {
    return out;
  }

  for (const item of items) {
    if (out.length >= MAX_FILES_PER_TOOL) break;
    if (item.name.startsWith(".git")) continue;
    const full = path.join(root, item.name);

    try {
      const stat = fs.statSync(full);
      if (Date.now() - stat.mtimeMs > LOOKBACK_MS) continue;
      if (item.isDirectory()) {
        walkRecentFiles(full, out);
      } else if (item.isFile() && stat.size > 0 && stat.size <= MAX_FILE_SIZE && /\.(jsonl?|log|txt)$/i.test(item.name)) {
        out.push({ file: full, mtimeMs: stat.mtimeMs });
      }
    } catch {
      // Ignore locked app databases and transient files.
    }
  }

  return out;
}

function numberAt(obj, keys) {
  for (const key of keys) {
    const value = obj?.[key];
    const number = typeof value === "number" ? value : Number(value);
    if (Number.isFinite(number) && number > 0) return Math.round(number);
  }
  return 0;
}

function usageFromObject(obj) {
  const usage = obj?.usage && typeof obj.usage === "object" ? obj.usage : obj;
  const inputTokens = numberAt(usage, ["input_tokens", "prompt_tokens", "inputTokens", "promptTokens"]);
  const outputTokens = numberAt(usage, ["output_tokens", "completion_tokens", "outputTokens", "completionTokens"]);
  const cacheReadTokens = numberAt(usage, ["cache_read_input_tokens", "cacheReadInputTokens", "cached_tokens", "cachedTokens"]);
  const cacheWriteTokens = numberAt(usage, ["cache_creation_input_tokens", "cacheCreationInputTokens", "cache_write_tokens", "cacheWriteTokens"]);
  const explicitTotal = numberAt(usage, ["total_tokens", "totalTokens"]);
  const totalTokens = Math.max(explicitTotal, inputTokens + outputTokens + cacheReadTokens + cacheWriteTokens);

  if (totalTokens <= 0) return null;

  const timeValue = obj?.timestamp || obj?.created_at || obj?.createdAt || obj?.time || obj?.date;
  const time = Date.parse(timeValue || "");

  return {
    date: Number.isFinite(time) ? todayFromTime(time) : "",
    model: String(obj?.model || obj?.model_name || usage?.model || "unknown").slice(0, 128),
    inputTokens,
    outputTokens,
    cacheReadTokens,
    cacheWriteTokens,
    totalTokens,
  };
}

function parseLooseJsonLines(text) {
  const records = [];
  const trimmed = text.trim();

  if (!trimmed) return records;

  try {
    const parsed = JSON.parse(trimmed);
    const values = Array.isArray(parsed) ? parsed : [parsed];
    for (const value of values) {
      const record = usageFromObject(value);
      if (record) records.push(record);
    }
    return records;
  } catch {
    // Fall through to JSONL parsing.
  }

  for (const line of trimmed.split(/\r?\n/)) {
    const part = line.trim();
    if (!part.startsWith("{")) continue;
    try {
      const record = usageFromObject(JSON.parse(part));
      if (record) records.push(record);
    } catch {
      // Some tools mix progress text with JSON. Skip noisy lines.
    }
  }

  return records;
}

function aggregate(records, fallbackDate, tool) {
  const map = new Map();

  for (const record of records) {
    const date = record.date || fallbackDate;
    const key = `${date}|${tool}|${record.model}`;
    const current = map.get(key) || {
      date,
      tool,
      model: record.model,
      inputTokens: 0,
      outputTokens: 0,
      cacheReadTokens: 0,
      cacheWriteTokens: 0,
      totalTokens: 0,
    };
    current.inputTokens += record.inputTokens;
    current.outputTokens += record.outputTokens;
    current.cacheReadTokens += record.cacheReadTokens;
    current.cacheWriteTokens += record.cacheWriteTokens;
    current.totalTokens += record.totalTokens;
    map.set(key, current);
  }

  return [...map.values()];
}

function collectTool(source) {
  const collected = [];

  for (const dir of source.dirs.map(expandHome)) {
    for (const item of walkRecentFiles(dir)) {
      let text = "";
      try {
        text = fs.readFileSync(item.file, "utf8");
      } catch {
        continue;
      }
      const records = parseLooseJsonLines(text);
      collected.push(...aggregate(records, todayFromTime(item.mtimeMs), source.tool));
    }
  }

  return aggregate(collected, todayFromTime(Date.now()), source.tool);
}

async function upload(config, records) {
  const response = await fetch(config.endpoint, {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      deviceId: config.deviceId,
      clientVersion: VERSION,
      records,
    }),
  });

  const body = await response.text();
  if (!response.ok) throw new Error(`上报失败：${response.status} ${body}`);
  return body;
}

async function main() {
  const config = ensureConfig();
  const records = [];

  for (const source of TOOL_SOURCES) {
    records.push(...collectTool(source));
  }

  const result = await upload(config, records);
  console.log(`znt-tokenrank synced ${records.length} records`);
  console.log(result);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
