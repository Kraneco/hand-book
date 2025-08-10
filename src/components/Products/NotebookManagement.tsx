"use client";

import React, { useState } from "react";
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  InputNumber,
  Select,
  message,
} from "antd";
import { ShoppingCartOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { useProductStore, type Product } from "@/stores/productStore";
import { useMaterialStore, type Material } from "@/stores/materialStore";
import { useThemeStore } from "@/stores/themeStore";
import { getTextColor } from "@/utils/themeUtils";
import type { ColumnsType } from "antd/es/table";

const { Option } = Select;

// 收纳册材料消耗配置
const NOTEBOOK_MATERIAL_CONFIG = {
  法棍收纳册: {
    rings: 2, // 需要2个环扣
    paper: "sulfuric-a4", // 使用A4硫酸纸
    paperCount: 1, // 1张纸
  },
  A6收纳册: {
    rings: 2,
    paper: "sulfuric-a4",
    paperCount: 1,
  },
  A7收纳册: {
    rings: 1,
    paper: "sulfuric-a4",
    paperCount: 1,
  },
  小面包收纳册: {
    rings: 1,
    paper: "sulfuric-b5", // 使用B5硫酸纸
    paperCount: 1,
  },
  TN收纳册: {
    rings: 2,
    paper: "sulfuric-a4",
    paperCount: 1,
  },
};

export const NotebookManagement: React.FC = () => {
  const { products } = useProductStore();
  const { materials, addTransaction } = useMaterialStore();
  const { theme } = useThemeStore();
  const [saleModalVisible, setSaleModalVisible] = useState(false);
  const [selectedNotebook, setSelectedNotebook] = useState<Product | null>(
    null
  );
  const [saleForm] = Form.useForm();

  // 只显示收纳册产品
  const notebooks = products.filter((p) => p.category === "收纳册");

  // 获取材料库存信息
  const getMaterialStock = (materialId: string): Material | null => {
    const findMaterial = (mats: Material[]): Material | null => {
      for (const mat of mats) {
        if (mat.id === materialId) return mat;
        if (mat.children) {
          const found = findMaterial(mat.children);
          if (found) return found;
        }
      }
      return null;
    };
    return findMaterial(materials);
  };

  // 检查是否可以生产
  const canProduce = (notebookName: string, quantity: number) => {
    const config =
      NOTEBOOK_MATERIAL_CONFIG[
        notebookName as keyof typeof NOTEBOOK_MATERIAL_CONFIG
      ];
    if (!config) return { canProduce: false, reason: "未配置材料消耗" };

    // 检查硫酸纸
    const paperMaterial = getMaterialStock(config.paper);
    if (!paperMaterial || paperMaterial.stock < quantity * config.paperCount) {
      return {
        canProduce: false,
        reason: `${paperMaterial?.name || "硫酸纸"}库存不足，需要 ${
          quantity * config.paperCount
        }，当前 ${paperMaterial?.stock || 0}`,
      };
    }

    // 检查环扣（需要检查所有颜色的总库存）
    const ringMaterial = materials.find((m) => m.id === "transparent-ring");
    if (ringMaterial?.children) {
      const totalRings = ringMaterial.children.reduce(
        (sum, child) => sum + child.stock,
        0
      );
      if (totalRings < quantity * config.rings) {
        return {
          canProduce: false,
          reason: `透明环库存不足，需要 ${
            quantity * config.rings
          }，当前总计 ${totalRings}`,
        };
      }
    }

    return { canProduce: true, reason: "" };
  };

  // 处理销售
  const handleSale = async (values: any) => {
    const { quantity, ringColors } = values;
    const config =
      NOTEBOOK_MATERIAL_CONFIG[
        selectedNotebook.name as keyof typeof NOTEBOOK_MATERIAL_CONFIG
      ];

    if (!config) {
      message.error("未配置材料消耗");
      return;
    }

    try {
      // 扣除硫酸纸
      addTransaction(config.paper, {
        date: new Date(),
        type: "out",
        quantity: quantity * config.paperCount,
        unitPrice: getMaterialStock(config.paper)?.averagePrice || 0,
        orderId: `SALE-${Date.now()}`,
        notes: `${selectedNotebook.name} 销售消耗`,
      });

      // 扣除环扣
      if (config.rings > 0 && ringColors) {
        ringColors.forEach((colorConfig: any) => {
          addTransaction(colorConfig.ringId, {
            date: new Date(),
            type: "out",
            quantity: colorConfig.quantity,
            unitPrice: getMaterialStock(colorConfig.ringId)?.averagePrice || 0,
            orderId: `SALE-${Date.now()}`,
            notes: `${selectedNotebook.name} 销售消耗`,
          });
        });
      }

      message.success("销售记录成功，材料库存已更新");
      setSaleModalVisible(false);
      saleForm.resetFields();
    } catch (error) {
      message.error("销售记录失败");
    }
  };

  // 表格列定义
  const columns: ColumnsType<any> = [
    {
      title: "收纳册名称",
      dataIndex: "name",
      key: "name",
      width: 150,
      render: (text: string) => <span className="font-medium">{text}</span>,
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
    },
    {
      title: "库存",
      dataIndex: "stock",
      key: "stock",
      width: 80,
      render: (stock: number) => (
        <span
          className={
            stock > 20
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }
        >
          {stock}
        </span>
      ),
    },
    {
      title: "材料消耗",
      key: "materials",
      width: 200,
      render: (_, record) => {
        const config =
          NOTEBOOK_MATERIAL_CONFIG[
            record.name as keyof typeof NOTEBOOK_MATERIAL_CONFIG
          ];
        if (!config) return <span className="text-gray-400">未配置</span>;

        return (
          <div className="space-y-1">
            <div className="text-xs">
              <Tag color="blue" size="small">
                {config.rings}个环扣
              </Tag>
            </div>
            <div className="text-xs">
              <Tag color="green" size="small">
                {config.paperCount}张
                {config.paper === "sulfuric-a4" ? "A4" : "B5"}硫酸纸
              </Tag>
            </div>
          </div>
        );
      },
    },
    {
      title: "可生产性",
      key: "canProduce",
      width: 150,
      render: (_, record) => {
        const result = canProduce(record.name, 1);
        return (
          <div>
            <Tag color={result.canProduce ? "success" : "error"}>
              {result.canProduce ? "可生产" : "材料不足"}
            </Tag>
            {!result.canProduce && (
              <div className="text-xs text-red-500 mt-1">{result.reason}</div>
            )}
          </div>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<ShoppingCartOutlined />}
            onClick={() => {
              setSelectedNotebook(record);
              setSaleModalVisible(true);
            }}
          >
            销售
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2
          className="text-2xl font-bold"
          style={{ color: getTextColor(theme, "primary") }}
        >
          收纳册管理
        </h2>
      </div>

      <Card
        title="收纳册与材料对应关系"
        extra={
          <Button
            type="text"
            icon={<InfoCircleOutlined />}
            onClick={() => {
              Modal.info({
                title: "材料消耗说明",
                content: (
                  <div className="space-y-2">
                    <p>• 法棍、TN、A6收纳册：需要2个环扣 + 1张A4硫酸纸</p>
                    <p>
                      • 小面包、A7收纳册：需要1个环扣 + 1张B5硫酸纸（A7用A4纸）
                    </p>
                    <p>• 销售时会自动扣除对应的材料库存</p>
                  </div>
                ),
              });
            }}
          >
            查看说明
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={notebooks}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </Card>

      {/* 销售模态框 */}
      <Modal
        title={`销售 - ${selectedNotebook?.name}`}
        open={saleModalVisible}
        onCancel={() => setSaleModalVisible(false)}
        onOk={() => saleForm.submit()}
        okText="确认销售"
        cancelText="取消"
      >
        <Form form={saleForm} layout="vertical" onFinish={handleSale}>
          <Form.Item
            name="quantity"
            label="销售数量"
            rules={[{ required: true, message: "请输入销售数量" }]}
          >
            <InputNumber
              min={1}
              placeholder="请输入销售数量"
              className="w-full"
            />
          </Form.Item>

          {selectedNotebook &&
            NOTEBOOK_MATERIAL_CONFIG[
              selectedNotebook.name as keyof typeof NOTEBOOK_MATERIAL_CONFIG
            ]?.rings > 0 && (
              <Form.Item
                name="ringColors"
                label="环扣颜色分配"
                rules={[{ required: true, message: "请分配环扣颜色" }]}
              >
                <Form.List name="ringColors">
                  {(fields, { add, remove }) => (
                    <div>
                      {fields.map((field, index) => (
                        <div
                          key={field.key}
                          className="flex items-center space-x-2 mb-2"
                        >
                          <Form.Item
                            {...field}
                            name={[field.name, "ringId"]}
                            className="mb-0 flex-1"
                          >
                            <Select placeholder="选择环扣颜色">
                              {materials
                                .find((m) => m.id === "transparent-ring")
                                ?.children?.map((ring) => (
                                  <Option key={ring.id} value={ring.id}>
                                    {ring.name} (库存: {ring.stock})
                                  </Option>
                                ))}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            {...field}
                            name={[field.name, "quantity"]}
                            className="mb-0"
                          >
                            <InputNumber min={1} placeholder="数量" />
                          </Form.Item>
                          <Button
                            type="link"
                            onClick={() => remove(field.name)}
                          >
                            删除
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        className="w-full"
                      >
                        添加环扣颜色
                      </Button>
                    </div>
                  )}
                </Form.List>
              </Form.Item>
            )}
        </Form>
      </Modal>
    </div>
  );
};
