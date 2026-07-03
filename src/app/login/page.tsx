"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = (await response.json()) as {
        success: boolean;
        message?: string;
      };

      if (!response.ok || !data.success) {
        setError(data.message ?? "密码错误");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("验证失败，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-background px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-accent">智能体知识库</h1>
          <p className="mt-3 text-base text-foreground-muted">
            社群知识沉淀平台
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) {
                  setError("");
                }
              }}
              placeholder="请输入访问密码"
              className="h-12 w-full rounded-lg border border-border bg-background-card px-4 text-base text-foreground outline-none transition-colors placeholder:text-foreground-disabled focus:border-accent"
              autoComplete="current-password"
            />
            {error ? (
              <p className="mt-2 text-sm text-danger">{error}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-lg bg-accent text-base font-semibold text-background transition-colors hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "验证中" : "确认"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-foreground-disabled">
          每周更新访问密码，请联系管理员获取
        </p>
      </div>
    </div>
  );
}
