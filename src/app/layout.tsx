import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "智能体知识库",
  description: "智能体知识库暗色主题系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="bg-background text-foreground">
      <body className="bg-background text-foreground antialiased">
        <Header />
        <Sidebar />
        <main className="min-h-screen px-4 pb-24 pt-[72px] md:ml-[240px] md:px-8 md:pb-10 md:pt-20">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
