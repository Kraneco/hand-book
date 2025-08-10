import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function ProductsLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}
          size="large"
        />
        <div className="mt-4 text-gray-600 dark:text-gray-300">
          商品数据加载中...
        </div>
      </div>
    </div>
  );
}
