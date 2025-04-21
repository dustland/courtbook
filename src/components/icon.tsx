import React from "react";
import { View } from "@tarojs/components";
import {
  HomeOutlined,
  ChatOutlined,
  CalendarOutlined,
  Ellipsis,
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

// SVG paths for custom icons
const THUMB_UP_PATH =
  "M2 8.4A1.4 1.4 0 013.4 7H10a.5.5 0 00.5-.5c0-.28-.22-.5-.5-.5H6a1 1 0 01-1-1c0-.28.22-.5.5-.5h8.28l-1.17 4.5a.5.5 0 00.49.63h6.1a2 2 0 01-1.9 1.27h-1a1 1 0 00-1 1V17a2 2 0 002 2h.28a2 2 0 001.85-1.24l1.2-3c.46-1.14.7-2.36.7-3.59c0-1.2-.98-2.17-2.18-2.17h-5.53l.97-4.1c.14-.6-.04-1.21-.47-1.64a1.83 1.83 0 00-1.29-.51c-.76 0-1.45.46-1.73 1.15L6.3 7H3.4A1.4 1.4 0 002 8.4z";
const THUMB_DOWN_PATH =
  "M22 14.6a1.4 1.4 0 01-1.4 1.4H14a.5.5 0 00-.5.5c0 .28.22.5.5.5h4a1 1 0 011 1c0 .28-.22.5-.5.5H9.23l1.17-4.5a.5.5 0 00-.49-.63h-6.1a2 2 0 011.9-1.27h1a1 1 0 001-1V6a2 2 0 00-2-2h-.28a2 2 0 00-1.85 1.24l-1.2 3C2.24 9.38 2 10.6 2 11.83c0 1.2.98 2.17 2.18 2.17h5.53l-.97 4.1c-.14.6.04 1.21.47 1.64c.33.32.77.51 1.29.51c.76 0 1.45-.46 1.73-1.15L17.7 16h2.9a1.4 1.4 0 001.4-1.4z";

// Custom SVG icon component
const SvgIcon: React.FC<{
  path: string;
  size: string;
  color?: string;
}> = ({ path, size, color = "currentColor" }) => {
  const sizePx = typeof size === "number" ? size : parseInt(size, 10) || 24;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={sizePx}
      height={sizePx}
      viewBox="0 0 24 24"
      fill={color}
    >
      <path d={path} />
    </svg>
  );
};

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
  loading: Ellipsis,
  "thumb-up": (props) => <SvgIcon path={THUMB_UP_PATH} {...props} />,
  "thumb-down": (props) => <SvgIcon path={THUMB_DOWN_PATH} {...props} />,
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
