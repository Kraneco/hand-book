"use client";

import React from "react";
import { Table, Card, Tag, Descriptions, Divider } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import type { Material, MaterialTransaction } from "@/stores/materialStore";
import { useThemeStore } from "@/stores/themeStore";
import { getTextColor } from "@/utils/themeUtils";
import type { ColumnsType } from "antd/es/table";

interface MaterialDetailProps {
  material: Material;
}

export const MaterialDetail: React.FC<MaterialDetailProps> = ({ material }) => {
  const { theme } = useThemeStore();

  // 交易记录表格列定义
  const transactionColumns: ColumnsType<MaterialTransaction> = [
    {
      title: "日期",
      dataIndex: "date",
      key: "date",
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
      sorter: (a, b) => a.date.getTime() - b.date.getTime(),
      defaultSortOrder: "descend",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      width: 80,
      render: (type: "in" | "out") => (
        <Tag
          color={type === "in" ? "success" : "error"}
          icon={type === "in" ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        >
          {type === "in" ? "入库" : "出库"}
        </Tag>
      ),
    },
    {
      title: "数量",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (quantity: number, record) => (
        <span
          className={`font-medium ${
            record.type === "in"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {record.type === "in" ? "+" : "-"}
          {quantity}
        </span>
      ),
    },
    {
      title: "单价",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: 100,
      render: (price: number) => (
        <span className="text-blue-600 dark:text-blue-400">
          ¥{price.toFixed(2)}
        </span>
      ),
    },
    {
      title: "总价",
      key: "totalPrice",
      width: 120,
      render: (_, record) => (
        <span className="font-medium text-purple-600 dark:text-purple-400">
          ¥{(record.quantity * record.unitPrice).toFixed(2)}
        </span>
      ),
    },
    {
      title: "供应商",
      dataIndex: "supplier",
      key: "supplier",
      width: 120,
      render: (supplier?: string) => (
        <span className="text-gray-600 dark:text-gray-400">
          {supplier || "-"}
        </span>
      ),
    },
    {
      title: "订单号",
      dataIndex: "orderId",
      key: "orderId",
      width: 120,
      render: (orderId?: string) => (
        <span className="text-gray-600 dark:text-gray-400">
          {orderId || "-"}
        </span>
      ),
    },
    {
      title: "备注",
      dataIndex: "notes",
      key: "notes",
      ellipsis: true,
      render: (notes?: string) => (
        <span className="text-gray-500 dark:text-gray-400">{notes || "-"}</span>
      ),
    },
  ];

  // 计算统计数据
  const inTransactions = material.transactions.filter((t) => t.type === "in");
  const outTransactions = material.transactions.filter((t) => t.type === "out");

  const totalIn = inTransactions.reduce((sum, t) => sum + t.quantity, 0);
  const totalOut = outTransactions.reduce((sum, t) => sum + t.quantity, 0);
  const totalInValue = inTransactions.reduce(
    (sum, t) => sum + t.quantity * t.unitPrice,
    0
  );
  const totalOutValue = outTransactions.reduce(
    (sum, t) => sum + t.quantity * t.unitPrice,
    0
  );

  return (
    <div className="space-y-6">
      {/* 基本信息 */}
      <Card title="基本信息" size="small">
        <Descriptions column={2} size="small">
          <Descriptions.Item label="材料名称">
            {material.name}
          </Descriptions.Item>
          <Descriptions.Item label="分类">
            <Tag color="blue">{material.category}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="当前库存">
            <span
              className={`font-medium ${
                material.isStockSufficient
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {material.stock}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="库存状态">
            <Tag color={material.isStockSufficient ? "success" : "error"}>
              {material.isStockSufficient ? "充足" : "不足"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="平均单价">
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              ¥{material.averagePrice.toFixed(2)}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="库存价值">
            <span className="text-purple-600 dark:text-purple-400 font-medium">
              ¥{(material.stock * material.averagePrice).toFixed(2)}
            </span>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 统计概览 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center" size="small">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            +{totalIn}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">总入库</div>
        </Card>
        <Card className="text-center" size="small">
          <div className="text-lg font-bold text-red-600 dark:text-red-400">
            -{totalOut}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">总出库</div>
        </Card>
        <Card className="text-center" size="small">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            ¥{totalInValue.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            入库价值
          </div>
        </Card>
        <Card className="text-center" size="small">
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
            ¥{totalOutValue.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            出库价值
          </div>
        </Card>
      </div>

      <Divider />

      {/* 进销存记录 */}
      <Card title="进销存记录" size="small">
        <Table
          columns={transactionColumns}
          dataSource={material.transactions}
          rowKey="id"
          size="small"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          scroll={{ x: 800 }}
          rowClassName={(record) =>
            record.type === "in"
              ? "bg-green-50 dark:bg-green-900/20"
              : "bg-red-50 dark:bg-red-900/20"
          }
        />
      </Card>
    </div>
  );
};
