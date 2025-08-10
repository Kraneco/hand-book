import type { Metadata } from "next";
import "./globals.css";
import { AntdConfigProvider } from "@/components/Providers/AntdConfigProvider";
import { ThemeProvider } from "@/components/Providers/ThemeProvider";
import { MainLayout } from "@/components/Layout/MainLayout";

export const metadata: Metadata = {
  title: "后台管理系统",
  description: "收纳册进销存管理系统",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <ThemeProvider>
          <AntdConfigProvider>
            <MainLayout>{children}</MainLayout>
          </AntdConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
