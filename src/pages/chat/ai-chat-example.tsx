import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import {
  View,
  Text,
  Input,
  Button,
  ScrollView,
  Icon,
} from "@tarojs/components";
import AIAssistant from "../../services/ai-assistant";

import "./index.scss";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: number;
}

const AIChatExample: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [assistant, setAssistant] = useState<AIAssistant | null>(null);

  // Initialize the AI assistant when the component mounts
  useEffect(() => {
    // In a real app, get the user ID from user info or login state
    const userId = Taro.getStorageSync("userId") || "default-user";
    const aiAssistant = new AIAssistant(userId);
    setAssistant(aiAssistant);

    // Add initial welcome message
    setMessages([
      {
        id: "welcome",
        content:
          "Hello! I can help you book a court. What are you looking for today?",
        isUser: false,
        timestamp: Date.now(),
      },
    ]);
  }, []);

  // Handle sending a message
  const handleSend = async () => {
    if (!inputText.trim() || !assistant) return;

    // Add user message to the chat
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputText,
      isUser: true,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Process message with AI assistant
      const response = await assistant.processMessage(userMessage.content, {
        onError: (error) => {
          console.error("Error from AI assistant:", error);
          // Add an error message to the chat
          setMessages((prev) => [
            ...prev,
            {
              id: `error-${Date.now()}`,
              content: "Sorry, I encountered an error. Please try again.",
              isUser: false,
              timestamp: Date.now(),
            },
          ]);
        },
      });

      // Add AI response to the chat
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          content: response,
          isUser: false,
          timestamp: Date.now(),
        },
      ]);
    } catch (error) {
      console.error("Error in handleSend:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle booking a court from the chat
  const handleBookCourt = async (
    courtId: string,
    date: string,
    timeSlot: string
  ) => {
    try {
      // This is a simplified example - in a real app, you would have more validation
      await Taro.cloud.callFunction({
        name: "appointments",
        data: {
          action: "createAppointment",
          data: {
            userId: Taro.getStorageSync("userId") || "default-user",
            courtId,
            date,
            startTime: timeSlot.split("-")[0].trim(),
            endTime: timeSlot.split("-")[1].trim(),
          },
        },
      });

      // Add confirmation message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: `booking-${Date.now()}`,
          content: `Great! I've booked the court for you on ${date} at ${timeSlot}.`,
          isUser: false,
          timestamp: Date.now(),
        },
      ]);
    } catch (error) {
      console.error("Error booking court:", error);
      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: `booking-error-${Date.now()}`,
          content: "Sorry, I couldn't book the court. Please try again.",
          isUser: false,
          timestamp: Date.now(),
        },
      ]);
    }
  };

  return (
    <View className="chat-page">
      <View className="chat-header">
        <Text className="header-title">AI Court Booking Assistant</Text>
      </View>

      <ScrollView
        className="chat-messages"
        scrollY
        scrollWithAnimation
        scrollIntoView={`msg-${messages.length - 1}`}
      >
        {messages.map((message, index) => (
          <View
            key={message.id}
            id={`msg-${index}`}
            className={`message ${
              message.isUser ? "user-message" : "assistant-message"
            }`}
          >
            <View className="message-content">
              <Text>{message.content}</Text>
            </View>
            <Text className="message-time">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        ))}
        {isLoading && (
          <View className="message assistant-message">
            <View className="message-content typing">
              <Text>...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View className="chat-input-container">
        <Input
          className="chat-input"
          value={inputText}
          onInput={(e) => setInputText(e.detail.value)}
          placeholder="Type your message..."
          confirmType="send"
          onConfirm={handleSend}
        />
        <Button
          className="send-button"
          onClick={handleSend}
          disabled={!inputText.trim() || isLoading}
        >
          <Text className="send-text">发送</Text>
        </Button>
      </View>
    </View>
  );
};

export default AIChatExample;
