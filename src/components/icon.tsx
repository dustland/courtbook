import React from "react";
import { View } from "@tarojs/components";
import {
  HomeOutlined,
  ChatOutlined,
  CalendarOutlined,
  UserOutlined,
  SettingOutlined,
  InfoOutlined,
  QuestionOutlined,
  ArrowRight,
  GuideOutlined,
} from "@taroify/icons";

// Import the CSS directly instead of through SCSS
import "@taroify/icons/index.css";
import "./icon.scss";

// Icon mapping
const iconComponents: Record<string, React.FC<any>> = {
  home: HomeOutlined,
  message: ChatOutlined,
  calendar: CalendarOutlined,
  user: UserOutlined,
  send: GuideOutlined,
  settings: SettingOutlined,
  "chevron-right": ArrowRight,
  help: QuestionOutlined,
  info: InfoOutlined,
};

interface IconProps {
  value: string;
  size?: number | string;
  color?: string;
  className?: string;
  onClick?: () => void;
}

const Icon: React.FC<IconProps> = ({
  value,
  size = "24px",
  color,
  className = "",
  onClick,
}) => {
  // Get the corresponding icon component
  const IconComponent = iconComponents[value];

  if (!IconComponent) {
    console.warn(`Icon "${value}" not found in available icons`);
    return null;
  }

  const sizeValue = typeof size === "number" ? `${size}px` : size;

  return (
    <View
      className={`taro-icon ${className}`}
      onClick={onClick}
      style={{ display: "inline-flex" }}
    >
      <IconComponent size={sizeValue} color={color} />
    </View>
  );
};

export default Icon;
