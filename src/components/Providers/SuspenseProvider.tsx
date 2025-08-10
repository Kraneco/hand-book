"use client";

import React, { Suspense } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface SuspenseProviderProps {
  children: React.ReactNode;
}

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}
        size="large"
      />
      <div className="mt-4 text-gray-600 dark:text-gray-300">页面加载中...</div>
    </div>
  </div>
);

export const SuspenseProvider: React.FC<SuspenseProviderProps> = ({
  children,
}) => {
  return <Suspense fallback={<LoadingFallback />}>{children}</Suspense>;
};
