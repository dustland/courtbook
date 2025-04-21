import { View, Text } from "@tarojs/components";
import { TimeSlot } from "../types";
import Icon from "./icon";
import MarkdownRenderer from "./markdown-renderer";
import "./chat-bubble.scss";

// Extended TimeSlot with date property if needed
interface ExtendedTimeSlot extends TimeSlot {
  date?: string;
}

// Updated message interface to match our chat component
interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  recordId?: string;
  availableSlots?: ExtendedTimeSlot[];
}

interface ChatBubbleProps {
  message: Message;
  onSlotSelect?: (slot: ExtendedTimeSlot) => void;
  onFeedback?: (messageId: string, isPositive: boolean) => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  onSlotSelect,
  onFeedback,
}) => {
  const isUser = message.sender === "user";

  return (
    <View className={`chat-bubble ${isUser ? "user" : "assistant"}`}>
      {isUser ? (
        <Text className="message-content">{message.text}</Text>
      ) : (
        <MarkdownRenderer markdown={message.text || "请稍候..."} />
      )}

      {message.availableSlots && message.availableSlots.length > 0 && (
        <View className="available-slots">
          <Text className="slots-title">可预约时间段：</Text>
          {message.availableSlots.map((slot) => (
            <View
              key={slot.id}
              className="slot-item"
              onClick={() => onSlotSelect && onSlotSelect(slot)}
            >
              <Text className="slot-time">
                {slot.startTime} - {slot.endTime}
              </Text>
              <Text className="slot-action">预约</Text>
            </View>
          ))}
        </View>
      )}

      {!isUser && onFeedback && message.text && (
        <View className="feedback-buttons">
          <View
            className="feedback-button"
            onClick={() => onFeedback(message.id, true)}
          >
            <Icon value="thumb-up" size={16} />
          </View>
          <View
            className="feedback-button"
            onClick={() => onFeedback(message.id, false)}
          >
            <Icon value="thumb-down" size={16} />
          </View>
        </View>
      )}

      <Text className="timestamp">
        {typeof message.timestamp === "string" &&
        message.timestamp.includes(" ")
          ? message.timestamp.split(" ")[1]
          : message.timestamp}
      </Text>
    </View>
  );
};

export default ChatBubble;
