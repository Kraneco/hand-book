import React from "react";
import { Skeleton, Card } from "antd";

interface SkeletonLoaderProps {
  type?: "page" | "table" | "card" | "list";
  rows?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = "page",
  rows = 3,
}) => {
  switch (type) {
    case "table":
      return (
        <Card>
          <div className="mb-4">
            <Skeleton.Input style={{ width: 200 }} active />
          </div>
          <Skeleton active paragraph={{ rows: rows }} />
          <div className="mt-4 flex justify-between">
            <Skeleton.Button active />
            <div className="flex space-x-2">
              <Skeleton.Button active size="small" />
              <Skeleton.Button active size="small" />
            </div>
          </div>
        </Card>
      );

    case "card":
      return (
        <Card>
          <Skeleton active avatar paragraph={{ rows: 2 }} />
        </Card>
      );

    case "list":
      return (
        <div className="space-y-4">
          {Array.from({ length: rows }).map((_, index) => (
            <Card key={index}>
              <Skeleton active avatar paragraph={{ rows: 1 }} />
            </Card>
          ))}
        </div>
      );

    case "page":
    default:
      return (
        <div className="space-y-6">
          {/* 页面标题骨架 */}
          <div>
            <Skeleton.Input style={{ width: 300, height: 32 }} active />
            <div className="mt-2">
              <Skeleton.Input style={{ width: 500, height: 20 }} active />
            </div>
          </div>

          {/* 统计卡片骨架 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <Skeleton active paragraph={{ rows: 1 }} />
              </Card>
            ))}
          </div>

          {/* 主要内容骨架 */}
          <Card>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton.Input active />
              <Skeleton.Input active />
              <Skeleton.Button active />
            </div>
            <Skeleton active paragraph={{ rows: 8 }} />
            <div className="mt-4 flex justify-between">
              <Skeleton.Button active />
              <Skeleton.Button active />
            </div>
          </Card>
        </div>
      );
  }
};
