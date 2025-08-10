"use client";

import React from "react";
import { Layout, Button, Typography } from "antd";
import { BulbOutlined, BulbFilled } from "@ant-design/icons";
import { useThemeStore } from "@/stores/themeStore";
import { APP_NAME } from "@/utils/const";

const { Header: AntHeader } = Layout;
const { Title } = Typography;

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <AntHeader
      className="flex items-center justify-between px-6 border-b"
      style={{
        backgroundColor: theme === "dark" ? "#1f1f1f" : "#ffffff",
        borderBottomColor: theme === "dark" ? "#303030" : "#e5e7eb",
      }}
    >
      <Title
        level={3}
        className="!mb-0"
        style={{ color: theme === "dark" ? "#ffffff" : "#1f2937" }}
      >
        {APP_NAME}
      </Title>
      <Button
        type="text"
        icon={theme === "light" ? <BulbOutlined /> : <BulbFilled />}
        onClick={toggleTheme}
        style={{
          color: theme === "dark" ? "#d1d5db" : "#6b7280",
          backgroundColor: "transparent",
        }}
        className="flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        {theme === "light" ? "切换到暗色" : "切换到亮色"}
      </Button>
    </AntHeader>
  );
};
