import { View } from "@tarojs/components";
import "./typing-indicator.scss";

export interface TypingIndicatorProps {
  className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  className,
}) => {
  return (
    <View className={`typing-indicator ${className || ""}`}>
      <View className="dot" />
      <View className="dot" />
      <View className="dot" />
    </View>
  );
};

export default TypingIndicator;
