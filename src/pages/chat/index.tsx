import { useState } from "react";
import { View, Input, ScrollView } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import Icon from "../../components/icon";
import { mockChatHistory } from "../../mock/data";
import ChatBubble from "../../components/chat-bubble";
import { TimeSlot } from "../../types";
import "./index.scss";

export default function Chat() {
  const [messages, setMessages] = useState(mockChatHistory.messages);
  const [inputText, setInputText] = useState("");

  useLoad(() => {
    console.log("Chat page loaded");
  });

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
      text: `预约成功！您已预约${slot.startTime}-${slot.endTime}的时间段。`,
      timestamp: new Date().toLocaleString("zh-CN"),
    };
    setMessages((prev) => [...prev, confirmMessage]);
  };

  return (
    <View className="chat-page">
      <ScrollView
        className="messages-container"
        scrollY
        scrollWithAnimation
        scrollIntoView={
          messages.length > 0
            ? `message-${messages[messages.length - 1].id}`
            : ""
        }
      >
        {messages.map((message) => (
          <View id={`message-${message.id}`} key={message.id}>
            <ChatBubble message={message} onSlotSelect={handleSlotSelect} />
          </View>
        ))}
      </ScrollView>

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
          <Icon value="send" size={20} className="send-icon" />
        </View>
      </View>
    </View>
  );
}
