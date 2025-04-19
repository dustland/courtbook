import { useState } from "react";
import { View, Text, Input } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Icon from "./icon";
import { mockChatHistory } from "../mock/data";
import ChatBubble from "./chat-bubble";
import { TimeSlot } from "../types";
import "./floating-chat.scss";

const FloatingChat: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState(mockChatHistory.messages.slice(-3));

  const toggleExpand = () => {
    if (!expanded) {
      setExpanded(true);
    } else {
      setExpanded(false);
    }
  };

  const navigateToChat = () => {
    Taro.navigateTo({
      url: "/pages/chat/index",
    });
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    // Add user message
    const newUserMessage = {
      id: Date.now().toString(),
      sender: "user" as const,
      text: inputText,
      timestamp: new Date().toLocaleString("zh-CN"),
    };

    setMessages([...messages, newUserMessage]);
    setInputText("");

    // Simulate assistant response (in a real app, this would call an API)
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        sender: "assistant" as const,
        text: "您好，我是您的智能助手。我能帮您预约场地或回答问题。",
        timestamp: new Date().toLocaleString("zh-CN"),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    // Simulate booking (in a real app, this would call an API)
    const confirmMessage = {
      id: Date.now().toString(),
      sender: "assistant" as const,
      text:
        "预约成功！您已预约" +
        slot.startTime +
        "-" +
        slot.endTime +
        "的时间段。",
      timestamp: new Date().toLocaleString("zh-CN"),
    };
    setMessages((prev) => [...prev, confirmMessage]);
  };

  return (
    <View className="floating-chat">
      {expanded ? (
        <View className="chat-window">
          <View className="chat-header">
            <Text className="title">智能助手</Text>
            <View className="actions">
              <Text className="expand-chat" onClick={navigateToChat}>
                展开
              </Text>
              <Text className="close" onClick={toggleExpand}>
                关闭
              </Text>
            </View>
          </View>

          <View className="messages-container">
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message}
                onSlotSelect={handleSlotSelect}
              />
            ))}
          </View>

          <View className="input-area">
            <Input
              className="message-input"
              value={inputText}
              onInput={(e) => setInputText(e.detail.value)}
              placeholder="输入您的问题..."
              confirmType="send"
              onConfirm={handleSend}
            />
            <View className="send-button" onClick={handleSend}>
              <Text>发送</Text>
            </View>
          </View>
        </View>
      ) : (
        <View className="chat-bubble-icon" onClick={toggleExpand}>
          <Icon value="message" size={30} className="chat-icon" />
        </View>
      )}
    </View>
  );
};

export default FloatingChat;
