import React, { useState } from "react";
import { View, Input, Text, Button } from "@tarojs/components";
import Icon from "./icon";
import "./chat-input.scss";

interface QuickQuestionProps {
  question: string;
}

interface ChatInputProps {
  onSend: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  quickQuestions?: QuickQuestionProps[];
  showQuickQuestions?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  placeholder = "发送消息...",
  disabled = false,
  loading = false,
  quickQuestions = [],
  showQuickQuestions = false,
}) => {
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (!inputText.trim() || disabled || loading) return;

    onSend(inputText.trim());
    setInputText("");
  };

  const handleConfirm = () => {
    handleSend();
  };

  const handleQuickQuestion = (question: string) => {
    // Send the question immediately
    console.log("question", question);
    onSend(question);
    // Clear any existing input text
    setInputText("");
  };

  return (
    <View className="chat-input-wrapper">
      {showQuickQuestions && quickQuestions.length > 0 && (
        <View className="quick-questions">
          {quickQuestions.map((item, index) => (
            <Button
              key={`quick-question-${index}`}
              className="quick-question"
              onClick={() => handleQuickQuestion(item.question)}
            >
              <Text className="question-text">{item.question}</Text>
            </Button>
          ))}
        </View>
      )}

      <View className="chat-input-container">
        <Input
          className="chat-input"
          type="text"
          value={inputText}
          onInput={(e) => setInputText(e.detail.value)}
          placeholder={placeholder}
          disabled={disabled || loading}
          onConfirm={handleConfirm}
          confirmType="send"
        />
        <View
          className={`send-button ${
            !inputText.trim() || disabled || loading ? "disabled" : ""
          }`}
          onClick={handleSend}
        >
          {loading ? (
            <Icon value="loading" size={24} className="send-icon" />
          ) : (
            <Icon value="send" size={24} className="send-icon" />
          )}
        </View>
      </View>
    </View>
  );
};

export default ChatInput;
