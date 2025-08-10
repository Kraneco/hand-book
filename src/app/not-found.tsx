import React from "react";
import Link from "next/link";
import { Button, Result } from "antd";
import { HomeOutlined } from "@ant-design/icons";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在。"
        extra={
          <div className="space-x-4">
            <Link href="/">
              <Button type="primary" icon={<HomeOutlined />}>
                返回首页
              </Button>
            </Link>
            <Button onClick={() => window.history.back()}>返回上一页</Button>
          </div>
        }
      />
    </div>
  );
}
