"use client";

import React from "react";
import { Layout } from "antd";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useThemeStore } from "@/stores/themeStore";

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme } = useThemeStore();

  return (
    <Layout
      className="h-full flex flex-col"
      style={{ backgroundColor: theme === "dark" ? "#141414" : "#f5f5f5" }}
    >
      <Header />
      <Layout className="flex-1 overflow-hidden">
        <Sidebar />
        <Content
          className="h-[100%] p-6"
          style={{ backgroundColor: theme === "dark" ? "#141414" : "#f5f5f5" }}
        >
          <div
            className="h-[100%] rounded-lg shadow-sm p-6 overflow-y-auto"
            style={{
              backgroundColor: theme === "dark" ? "#1f1f1f" : "#ffffff",
              border: `1px solid ${theme === "dark" ? "#303030" : "#e5e7eb"}`,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
