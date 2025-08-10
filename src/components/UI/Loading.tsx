import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface LoadingProps {
  size?: "small" | "default" | "large";
  tip?: string;
  spinning?: boolean;
  children?: React.ReactNode;
}

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export const Loading: React.FC<LoadingProps> = ({
  size = "default",
  tip = "加载中...",
  spinning = true,
  children,
}) => {
  if (children) {
    return (
      <Spin spinning={spinning} tip={tip} indicator={antIcon}>
        {children}
      </Spin>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Spin size={size} tip={tip} indicator={antIcon} />
    </div>
  );
};

// 页面级别的加载组件
export const PageLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <Spin size="large" tip="页面加载中..." indicator={antIcon} />
        <div className="mt-4 text-gray-500 dark:text-gray-400">
          请稍候，正在为您准备页面...
        </div>
      </div>
    </div>
  );
};
