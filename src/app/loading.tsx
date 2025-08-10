import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg">
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
          size="large"
        />
        <div className="mt-4 text-center text-gray-600 dark:text-gray-300">
          页面加载中...
        </div>
      </div>
    </div>
  );
}
