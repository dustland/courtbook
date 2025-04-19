import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import "./quick-question.scss";
const QuickQuestion: React.FC<{ question: string }> = ({ question }) => {
  function handleClick() {
    Taro.switchTab({
      url: "/pages/chat/index",
    });
  }
  return (
    <View className="quick-question" onClick={handleClick}>
      <Text className="question-text">{question}</Text>
    </View>
  );
};

export default QuickQuestion;
