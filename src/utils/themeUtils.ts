// 主题相关的颜色工具函数
export const getTextColor = (
  theme: "light" | "dark",
  type: "primary" | "secondary" | "muted" | "success" | "warning" | "danger"
) => {
  const colors = {
    light: {
      primary: "#1f2937", // 深灰色 - 主要文本
      secondary: "#374151", // 中灰色 - 次要文本
      muted: "#6b7280", // 浅灰色 - 辅助文本
      success: "#059669", // 绿色
      warning: "#d97706", // 橙色
      danger: "#dc2626", // 红色
    },
    dark: {
      primary: "#f9fafb", // 接近白色 - 主要文本
      secondary: "#e5e7eb", // 浅灰色 - 次要文本
      muted: "#9ca3af", // 中灰色 - 辅助文本
      success: "#10b981", // 绿色
      warning: "#f59e0b", // 橙色
      danger: "#ef4444", // 红色
    },
  };

  return colors[theme][type];
};

export const getBackgroundColor = (
  theme: "light" | "dark",
  type: "primary" | "secondary" | "card"
) => {
  const colors = {
    light: {
      primary: "#ffffff", // 白色
      secondary: "#f9fafb", // 浅灰色
      card: "#ffffff", // 卡片背景
    },
    dark: {
      primary: "#1f2937", // 深灰色
      secondary: "#111827", // 更深的灰色
      card: "#1f2937", // 卡片背景
    },
  };

  return colors[theme][type];
};

export const getBorderColor = (theme: "light" | "dark") => {
  return theme === "dark" ? "#374151" : "#e5e7eb";
};
