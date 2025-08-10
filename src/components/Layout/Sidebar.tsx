"use client";

import React from "react";
import { Layout, Menu } from "antd";
import {
  ShoppingOutlined,
  InboxOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useThemeStore } from "@/stores/themeStore";
import type { MenuProps } from "antd";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const menuItems: MenuItem[] = [
  {
    key: "/",
    icon: <BookOutlined />,
    label: "首页",
  },
  {
    key: "products",
    icon: <ShoppingOutlined />,
    label: "商品管理",
    children: [
      {
        key: "/products",
        label: "商品列表",
      },
      {
        key: "/notebooks",
        label: "收纳册管理",
      },
    ],
  },
  {
    key: "materials",
    icon: <InboxOutlined />,
    label: "材料管理",
    children: [
      {
        key: "/materials",
        label: "材料总览",
      },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useThemeStore();

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key);
  };

  return (
    <Sider
      style={{
        backgroundColor: theme === "dark" ? "#1f1f1f" : "#ffffff",
        borderRightColor: theme === "dark" ? "#303030" : "#e5e7eb",
      }}
      className="border-r"
      width={250}
    >
      <Menu
        mode="inline"
        selectedKeys={[pathname]}
        defaultOpenKeys={["products", "materials"]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{
          backgroundColor: "transparent",
          color: theme === "dark" ? "#ffffff" : "#000000",
        }}
        className="h-full border-r-0"
        theme={theme === "dark" ? "dark" : "light"}
      />
    </Sider>
  );
};
