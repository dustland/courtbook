import { View, Text } from "@tarojs/components";
import { ChatMessage, TimeSlot } from "../types";
import "./chat-bubble.scss";

interface ChatBubbleProps {
  message: ChatMessage;
  onSlotSelect?: (slot: TimeSlot) => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onSlotSelect }) => {
  const isUser = message.sender === "user";

  return (
    <View className={`chat-bubble ${isUser ? "user" : "assistant"}`}>
      <View className="message-content">
        <Text>{message.text}</Text>
      </View>

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

      <Text className="timestamp">{message.timestamp.split(" ")[1]}</Text>
    </View>
  );
};

export default ChatBubble;
