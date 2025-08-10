"use client";

import React, { useState } from "react";
import { Table, Card, Input, Select, Button, Space, Tag, Modal } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  PlusOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useMaterialStore, type Material } from "@/stores/materialStore";
import { useThemeStore } from "@/stores/themeStore";
import { getTextColor } from "@/utils/themeUtils";
import { MaterialDetail } from "./MaterialDetail";
import type { ColumnsType } from "antd/es/table";

const { Search } = Input;
const { Option } = Select;

export const MaterialOverview: React.FC = () => {
  const { materials, loading } = useMaterialStore();
  const { theme } = useThemeStore();
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // 处理材料数据，为有子项的材料计算汇总数据
  const processedMaterials = materials.map((material) => {
    if (material.children && material.children.length > 0) {
      // 计算子材料的汇总数据
      const totalStock = material.children.reduce(
        (sum, child) => sum + child.stock,
        0
      );
      const totalValue = material.children.reduce(
        (sum, child) => sum + child.averagePrice * child.stock,
        0
      );
      const averagePrice = totalStock > 0 ? totalValue / totalStock : 0;
      const isStockSufficient = material.children.every(
        (child) => child.isStockSufficient
      );

      return {
        ...material,
        stock: totalStock,
        averagePrice,
        isStockSufficient,
        children: material.children,
      };
    }
    return material;
  });

  // 用于统计的扁平化数据
  const flatMaterials = materials.reduce((acc: Material[], material) => {
    if (material.children && material.children.length > 0) {
      acc.push(...material.children);
    } else {
      acc.push(material);
    }
    return acc;
  }, []);

  // 筛选材料（支持树形结构）
  const filteredMaterials = processedMaterials.filter((material) => {
    const matchesSearch = material.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesCategory =
      !categoryFilter || material.category === categoryFilter;

    // 如果有子项，也要检查子项是否匹配搜索条件
    if (material.children && material.children.length > 0) {
      const childMatches = material.children.some(
        (child) =>
          child.name.toLowerCase().includes(searchText.toLowerCase()) &&
          (!categoryFilter || child.category === categoryFilter)
      );
      return matchesSearch || childMatches;
    }

    return matchesSearch && matchesCategory;
  });

  // 表格列定义
  const columns: ColumnsType<Material> = [
    {
      title: "材料名称",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text: string, record) => (
        <div className="flex items-center space-x-2">
          <span className="font-medium">{text}</span>
          {!record.isStockSufficient && (
            <WarningOutlined className="text-red-500" />
          )}
        </div>
      ),
    },
    {
      title: "分类",
      dataIndex: "category",
      key: "category",
      width: 120,
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: "当前库存",
      dataIndex: "stock",
      key: "stock",
      width: 120,
      render: (stock: number, record) => (
        <div className="text-center">
          <div
            className={`font-medium ${
              record.isStockSufficient
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {stock}
          </div>
        </div>
      ),
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "平均单价",
      dataIndex: "averagePrice",
      key: "averagePrice",
      width: 120,
      render: (price: number) => (
        <span className="text-green-600 dark:text-green-400 font-medium">
          ¥{price.toFixed(2)}
        </span>
      ),
      sorter: (a, b) => a.averagePrice - b.averagePrice,
    },
    {
      title: "库存状态",
      key: "stockStatus",
      width: 100,
      render: (_, record) => (
        <Tag color={record.isStockSufficient ? "success" : "error"}>
          {record.isStockSufficient ? "充足" : "不足"}
        </Tag>
      ),
    },
    {
      title: "总价值",
      key: "totalValue",
      width: 120,
      render: (_, record) => (
        <span className="text-blue-600 dark:text-blue-400 font-medium">
          ¥{(record.stock * record.averagePrice).toFixed(2)}
        </span>
      ),
      sorter: (a, b) => a.stock * a.averagePrice - b.stock * b.averagePrice,
    },
    {
      title: "进销存记录",
      key: "transactionCount",
      width: 120,
      render: (_, record) => (
        <div className="text-center text-gray-500 dark:text-gray-400">
          {record.transactions.length} 条记录
        </div>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedMaterial(record);
              setDetailModalVisible(true);
            }}
          >
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  // 获取所有分类
  const categories = Array.from(new Set(flatMaterials.map((m) => m.category)));

  // 统计数据
  const totalValue = flatMaterials.reduce(
    (sum, material) => sum + material.stock * material.averagePrice,
    0
  );
  const lowStockCount = flatMaterials.filter(
    (m) => !m.isStockSufficient
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2
          className="text-2xl font-bold"
          style={{ color: getTextColor(theme, "primary") }}
        >
          材料管理
        </h2>
        <Button type="primary" icon={<PlusOutlined />}>
          新增材料
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {flatMaterials.length}
          </div>
          <div className="text-gray-500 dark:text-gray-400">材料种类</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            ¥{totalValue.toFixed(2)}
          </div>
          <div className="text-gray-500 dark:text-gray-400">库存总价值</div>
        </Card>
        <Card className="text-center">
          <div
            className={`text-2xl font-bold ${
              lowStockCount > 0
                ? "text-red-600 dark:text-red-400"
                : "text-green-600 dark:text-green-400"
            }`}
          >
            {lowStockCount}
          </div>
          <div className="text-gray-500 dark:text-gray-400">库存不足</div>
        </Card>
      </div>

      <Card className="shadow-sm">
        <div className="mb-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: getTextColor(theme, "secondary") }}
              >
                搜索材料
              </label>
              <Search
                placeholder="输入材料名称"
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
                材料分类
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
          dataSource={filteredMaterials}
          rowKey="id"
          loading={loading}
          expandable={{
            // 只有有子项的材料可以展开
            rowExpandable: (record) =>
              !!(record.children && record.children.length > 0),

            defaultExpandAllRows: false,
            expandRowByClick: false,
          }}
          pagination={{
            total: filteredMaterials.length,
            pageSize: 15,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* 材料详情模态框 */}
      <Modal
        title={`材料详情 - ${selectedMaterial?.name}`}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={1000}
      >
        {selectedMaterial && <MaterialDetail material={selectedMaterial} />}
      </Modal>
    </div>
  );
};
