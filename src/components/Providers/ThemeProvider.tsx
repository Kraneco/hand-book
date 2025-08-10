"use client";

import React, { useEffect, useState } from "react";
import { useThemeStore } from "@/stores/themeStore";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const { theme } = useThemeStore();

  // 防止水合不匹配
  useEffect(() => {
    setMounted(true);
  }, []);

  // 应用主题到文档根元素
  useEffect(() => {
    if (mounted) {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        document.body.style.backgroundColor = "#0a0a0a";
      } else {
        document.documentElement.classList.remove("dark");
        document.body.style.backgroundColor = "#ffffff";
      }
    }
  }, [theme, mounted]);

  if (!mounted) {
    // 返回骨架屏或loading状态
    return (
      <div className="min-h-screen bg-white">
        <div className="animate-pulse">
          {/* 骨架屏头部 */}
          <div className="h-16 bg-gray-200"></div>
          <div className="flex">
            {/* 骨架屏侧边栏 */}
            <div className="w-64 h-screen bg-gray-100"></div>
            {/* 骨架屏内容区 */}
            <div className="flex-1 p-6">
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
