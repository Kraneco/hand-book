"use client";

import React from "react";
import Link from "next/link";
import { Card, Row, Col, Statistic } from "antd";
import {
  ShoppingOutlined,
  InboxOutlined,
  DollarOutlined,
  AlertOutlined,
} from "@ant-design/icons";
import { useProductStore } from "@/stores/productStore";
import { useMaterialStore } from "@/stores/materialStore";
import { useThemeStore } from "@/stores/themeStore";
import { getTextColor } from "@/utils/themeUtils";
import { APP_NAME } from "@/utils/const";

export default function HomePage() {
  const { products } = useProductStore();
  const { materials } = useMaterialStore();
  const { theme } = useThemeStore();

  // 计算统计数据
  const totalProducts = products.length;
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );

  // 扁平化材料数据计算
  const flatMaterials = materials.reduce((acc: typeof materials, material) => {
    if (material.children) {
      acc.push(...material.children);
    } else {
      acc.push(material);
    }
    return acc;
  }, []);

  const lowStockMaterials = flatMaterials.filter(
    (m) => !m.isStockSufficient
  ).length;
  const materialValue = flatMaterials.reduce(
    (sum, material) => sum + material.stock * material.averagePrice,
    0
  );

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: getTextColor(theme, "primary") }}
        >
          欢迎使用{APP_NAME}
        </h1>
        <p style={{ color: getTextColor(theme, "secondary") }}>
          收纳册进销存管理系统 - 实时监控库存，管理产品和材料
        </p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="商品总数"
              value={totalProducts}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="商品总价值"
              value={totalValue}
              precision={2}
              prefix={<DollarOutlined />}
              suffix="元"
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="材料价值"
              value={materialValue}
              precision={2}
              prefix={<InboxOutlined />}
              suffix="元"
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="库存不足材料"
              value={lowStockMaterials}
              prefix={<AlertOutlined />}
              valueStyle={{
                color: lowStockMaterials > 0 ? "#cf1322" : "#3f8600",
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 快速操作 */}
      <Card title="快速操作" className="shadow-sm">
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Link href="/products">
              <Card hoverable className="text-center cursor-pointer">
                <ShoppingOutlined className="text-4xl text-blue-500 mb-4" />
                <h3
                  className="text-lg font-medium"
                  style={{ color: getTextColor(theme, "primary") }}
                >
                  商品管理
                </h3>
                <p style={{ color: getTextColor(theme, "muted") }}>
                  管理收纳册产品
                </p>
              </Card>
            </Link>
          </Col>
          <Col xs={24} sm={8}>
            <Link href="/materials">
              <Card hoverable className="text-center cursor-pointer">
                <InboxOutlined className="text-4xl text-green-500 mb-4" />
                <h3
                  className="text-lg font-medium"
                  style={{ color: getTextColor(theme, "primary") }}
                >
                  材料管理
                </h3>
                <p style={{ color: getTextColor(theme, "muted") }}>
                  进销存管理
                </p>
              </Card>
            </Link>
          </Col>
          <Col xs={24} sm={8}>
            <Link href="/notebooks">
              <Card hoverable className="text-center cursor-pointer">
                <DollarOutlined className="text-4xl text-purple-500 mb-4" />
                <h3
                  className="text-lg font-medium"
                  style={{ color: getTextColor(theme, "primary") }}
                >
                  收纳册管理
                </h3>
                <p style={{ color: getTextColor(theme, "muted") }}>
                  销售和库存
                </p>
              </Card>
            </Link>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
