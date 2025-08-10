"use client";

import React from "react";
import { ConfigProvider, theme } from "antd";
import zhCN from "antd/locale/zh_CN";
import { useThemeStore } from "@/stores/themeStore";

interface AntdConfigProviderProps {
  children: React.ReactNode;
}

export const AntdConfigProvider: React.FC<AntdConfigProviderProps> = ({
  children,
}) => {
  const { theme: currentTheme } = useThemeStore();

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm:
          currentTheme === "dark"
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
        token: {
          // 可以在这里自定义主题色彩
          colorPrimary: "#1890ff",
          borderRadius: 6,
          // 文本颜色
          colorText: currentTheme === "dark" ? "#f9fafb" : "#1f2937",
          colorTextSecondary: currentTheme === "dark" ? "#e5e7eb" : "#6b7280",
          colorTextTertiary: currentTheme === "dark" ? "#9ca3af" : "#9ca3af",
        },
        components: {
          // 可以在这里自定义具体组件的样式
          Layout: {
            bodyBg: currentTheme === "dark" ? "#141414" : "#f5f5f5",
            headerBg: currentTheme === "dark" ? "#1f1f1f" : "#ffffff",
            siderBg: currentTheme === "dark" ? "#1f1f1f" : "#ffffff",
          },
          Menu: {
            itemBg: "transparent",
            itemSelectedBg: currentTheme === "dark" ? "#1890ff" : "#e6f7ff",
            itemSelectedColor: currentTheme === "dark" ? "#ffffff" : "#1890ff",
          },
          Table: {
            headerBg: currentTheme === "dark" ? "#262626" : "#fafafa",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
