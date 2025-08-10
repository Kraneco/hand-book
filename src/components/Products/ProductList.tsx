"use client";

import React, { useState } from "react";
import { Table, Card, Input, Select, Button, Space, Tag } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useProductStore, type Product } from "@/stores/productStore";
import { useThemeStore } from "@/stores/themeStore";
import { getTextColor } from "@/utils/themeUtils";
import { SkeletonLoader } from "@/components/UI/SkeletonLoader";
import type { ColumnsType } from "antd/es/table";

const { Search } = Input;
const { Option } = Select;

export const ProductList: React.FC = () => {
  const { products, loading } = useProductStore();
  const { theme } = useThemeStore();
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  // 筛选产品
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchText.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory =
      !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // 表格列定义
  const columns: ColumnsType<Product> = [
    {
      title: "商品名称",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    {
      title: "分类",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "价格",
      dataIndex: "price",
      key: "price",
      width: 100,
      render: (price: number) => (
        <span className="text-green-600 dark:text-green-400 font-medium">
          ¥{price.toFixed(2)}
        </span>
      ),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "库存",
      dataIndex: "stock",
      key: "stock",
      width: 100,
      render: (stock: number) => (
        <span
          className={
            stock > 50
              ? "text-green-600 dark:text-green-400"
              : stock > 20
              ? "text-yellow-600 dark:text-yellow-400"
              : "text-red-600 dark:text-red-400"
          }
        >
          {stock}
        </span>
      ),
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "库存状态",
      key: "stockStatus",
      width: 100,
      render: (_, record) => {
        const status =
          record.stock > 50
            ? "success"
            : record.stock > 20
            ? "warning"
            : "error";
        const text =
          record.stock > 50 ? "充足" : record.stock > 20 ? "一般" : "不足";
        return <Tag color={status}>{text}</Tag>;
      },
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (text: string) => (
        <span style={{ color: getTextColor(theme, "secondary") }}>
          {text || "-"}
        </span>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: Date) => (
        <span style={{ color: getTextColor(theme, "muted") }}>
          {new Date(date).toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </span>
      ),
      sorter: (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small">
            编辑
          </Button>
          <Button type="link" size="small" danger>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 获取所有分类
  const categories = Array.from(new Set(products.map((p) => p.category)));

  if (loading) {
    return <SkeletonLoader type="table" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2
          className="text-2xl font-bold"
          style={{ color: getTextColor(theme, "primary") }}
        >
          商品管理
        </h2>
        <Button type="primary" icon={<PlusOutlined />}>
          新增商品
        </Button>
      </div>

      <Card className="shadow-sm">
        <div className="mb-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: getTextColor(theme, "secondary") }}
              >
                搜索商品
              </label>
              <Search
                placeholder="输入商品名称或描述"
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: getTextColor(theme, "secondary") }}
              >
                商品分类
              </label>
              <Select
                placeholder="选择分类"
                allowClear
                value={categoryFilter || undefined}
                onChange={(value) => setCategoryFilter(value || "")}
                className="w-full"
              >
                {categories.map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                icon={<SearchOutlined />}
                onClick={() => {
                  // 这里可以添加搜索逻辑
                }}
              >
                搜索
              </Button>
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredProducts.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};
