import type { Metadata } from "next";
import { TokenRankClient } from "./TokenRankClient";
import { getTokenRankData } from "@/lib/data";

export const metadata: Metadata = {
  title: "Token 消耗榜 | 智能体先锋队",
  description: "智能体先锋队社群 AI 编程工具 Token 消耗排行榜",
};

export default function TokenRankPage() {
  const data = getTokenRankData();

  return (
    <TokenRankClient
      data={{
        ...data,
        totalMembers: 0,
        entries: [],
        mySummary: {
          ...data.mySummary,
          userId: 0,
          name: "未接入用户",
          lastSync: "",
          activeDays: 0,
          deviceCount: 0,
          today: {
            total: 0,
            norm: 0,
            cost: 0,
          },
          daily: [],
        },
        updatedAt: "等待首次真实同步",
      }}
    />
  );
}
