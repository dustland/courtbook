import { useState, useEffect, useRef } from "react";
import { View, ScrollView } from "@tarojs/components";
import Taro, { useLoad } from "@tarojs/taro";
import ChatBubble from "../../components/chat-bubble";
import ChatInput from "../../components/chat-input";
import TypingIndicator from "../../components/typing-indicator";
import { TimeSlot } from "../../types";
import "./index.scss";

// Declare wx global for TypeScript
declare const wx: any;

// Message interface
interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  recordId?: string;
}

// Extended TimeSlot with date property if needed
interface ExtendedTimeSlot extends TimeSlot {
  date?: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [ai, setAi] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [botId] = useState<string>("bot-ce5cf943"); // Use the actual bot ID from user
  const [conversation, setConversation] = useState<string>("");
  const scrollViewRef = useRef<any>(null);

  // Sample quick questions
  const quickQuestions = [
    { question: "帮我预定明天晚上 7 点的场地" },
    { question: "最近可以订到的 1 小时的场地是什么时候？" },
    { question: "我想取消我的预订" },
  ];

  // Initialize AI when component mounts
  useEffect(() => {
    initAI();
    getChatHistory();
  }, []);

  useLoad(() => {
    console.log("Chat page loaded");
  });

  // Initialize the AI SDK according to docs
  const initAI = async () => {
    try {
      // Access wx.cloud directly as shown in the user's example
      // Initialize Cloud environment
      wx.cloud.init({
        env: Taro.getStorageSync("cloudEnvId") || wx.cloud.DYNAMIC_CURRENT_ENV,
        traceUser: true,
      });

      // Set the AI instance directly from wx.cloud.extend.AI
      const aiInstance = wx.cloud.extend.AI;

      if (!aiInstance) {
        console.error("Failed to initialize AI SDK - AI not available");
        showToast("AI 服务初始化失败");
        return;
      }

      console.log("AI SDK initialized successfully");
      setAi(aiInstance);

      // Bot ID is now directly set from the user's input
      // Get bot details
      try {
        const botDetails = await aiInstance.bot.get({ botId });
        console.log("Bot details:", botDetails);

        // Add welcome message
        setMessages([
          {
            id: "welcome",
            sender: "assistant",
            text:
              botDetails.welcomeMessage ||
              "您好！我可以帮您预约场地。请问你的预定要求是什么？",
            timestamp: new Date().toLocaleString("zh-CN"),
          },
        ]);
      } catch (error) {
        console.error("Error getting bot details:", error);

        // Add a default welcome message if we can't get bot details
        setMessages([
          {
            id: "welcome",
            sender: "assistant",
            text: "您好！我是您的智能助手。请问有什么可以帮您？",
            timestamp: new Date().toLocaleString("zh-CN"),
          },
        ]);
      }
    } catch (error) {
      console.error("Error initializing AI:", error);
      showToast("AI 服务初始化出错");
    }
  };

  const showToast = (message: string) => {
    Taro.showToast({
      title: message,
      icon: "none",
      duration: 2000,
    });
  };

  const handleSend = async (text: string) => {
    console.log("inputText", text);
    if (!ai || !botId) return;

    // Generate unique conversation ID if needed
    if (!conversation) {
      setConversation(`conversation-${Date.now()}`);
    }

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text,
      timestamp: new Date().toLocaleString("zh-CN"),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Update API call format to match the required structure
      const res = await ai.bot.sendMessage({
        data: {
          botId: botId,
          msg: userMessage.text,
        },
      });

      // Create initial empty assistant message
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        sender: "assistant",
        text: "",
        timestamp: new Date().toLocaleString("zh-CN"),
        recordId: res.recordId,
      };

      // Add empty message to the list
      setMessages((prev) => [...prev, assistantMessage]);

      // Process the streaming response as shown in docs
      let fullResponse = "";

      // Use for await loop as shown in docs
      for await (let str of res.textStream) {
        fullResponse += str;

        // Update the message with accumulated text
        setMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1] = {
            ...updatedMessages[updatedMessages.length - 1],
            text: fullResponse,
          };
          return updatedMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message to agent:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: "assistant",
          text: "抱歉，我遇到了一些问题。请稍后再试。",
          timestamp: new Date().toLocaleString("zh-CN"),
        },
      ]);
      showToast("发送消息失败");
    } finally {
      setIsLoading(false);
    }
  };

  // Get recommended questions
  const getRecommendedQuestions = async () => {
    if (!botId) return;

    try {
      // Use the format shown in the user's example
      const res = await wx.cloud.extend.AI.bot.getRecommendQuestions({
        data: {
          botId: botId,
          msg: "你是谁",
        },
      });

      let recommendations: string[] = [];
      for await (let str of res.textStream) {
        recommendations.push(str);
      }

      console.log("Recommended questions:", recommendations);
    } catch (error) {
      console.error("Error getting recommended questions:", error);
    }
  };

  // Get chat history using the API from docs
  const getChatHistory = async () => {
    if (!ai || !botId) return;

    try {
      const res = await ai.bot.getChatRecords({
        botId: botId,
        pageNumber: 1,
        pageSize: 10,
        sort: "asc",
      });

      console.log("Chat records:", res);

      // Process and display chat history
      if (res?.recordList?.length > 0) {
        const historyMessages = res.recordList.map((record) => ({
          id: record.recordId,
          sender: record.role === "user" ? "user" : "assistant",
          text: record.content,
          timestamp: new Date().toLocaleString("zh-CN"),
          recordId: record.recordId,
        }));

        setMessages(historyMessages);

        // Set conversation ID if available
        if (res.recordList[0].conversation) {
          setConversation(res.recordList[0].conversation);
        }
      }
    } catch (error) {
      console.error("Error getting chat history:", error);
    }
  };

  // Handle slot selection for booking
  const handleSlotSelect = (slot: ExtendedTimeSlot) => {
    // Create message to send to the agent about the slot selection
    const slotMessage = `我想预订${slot.date || "今天"}${slot.startTime}-${
      slot.endTime
    }的场地。`;

    // Automatically send the message after a short delay
    setTimeout(() => {
      handleSend(slotMessage);
    }, 100);
  };

  // Send feedback using the API from docs
  const handleFeedback = async (messageId: string, isPositive: boolean) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message?.recordId || !ai || !botId) return;

    try {
      // Find the corresponding user message (input)
      const messageIndex = messages.findIndex((m) => m.id === messageId);
      const userMessage =
        messageIndex > 0 ? messages[messageIndex - 1].text : "";

      // Send feedback as shown in docs
      await ai.bot.sendFeedback({
        userFeedback: {
          botId: botId,
          recordId: message.recordId,
          comment: isPositive ? "回答很有帮助" : "回答需要改进",
          rating: isPositive ? 5 : 1,
          tags: isPositive ? ["有帮助"] : ["需要改进"],
          aiAnswer: message.text,
          input: userMessage,
          type: isPositive ? "upvote" : "downvote",
        },
      });

      showToast(isPositive ? "感谢您的反馈！" : "我们会努力改进");
    } catch (error) {
      console.error("Error sending feedback:", error);
    }
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
        ref={scrollViewRef}
      >
        {messages.map((message) => (
          <View id={`message-${message.id}`} key={message.id}>
            <ChatBubble
              message={message}
              onSlotSelect={handleSlotSelect}
              onFeedback={handleFeedback}
            />
          </View>
        ))}
        {isLoading && <TypingIndicator />}
      </ScrollView>

      <View className="input-container">
        <ChatInput
          onSend={handleSend}
          placeholder="输入您的问题..."
          disabled={isLoading}
          loading={isLoading}
          quickQuestions={quickQuestions}
          showQuickQuestions={messages.length <= 2} // Only show quick questions at the start of the conversation
        />
      </View>
    </View>
  );
}
