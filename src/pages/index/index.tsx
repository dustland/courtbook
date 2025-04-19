import { View, Text, Image, ScrollView, Input } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import Taro from "@tarojs/taro";
import { useState } from "react";
import Icon from "../../components/icon";
import { mockAppointments, mockUser } from "../../mock/data";
import "./index.scss";

export default function Index() {
  const [chatInput, setChatInput] = useState("");
  // Filter only upcoming appointments
  const upcomingAppointments = mockAppointments.filter((app) => !app.isPast);

  useLoad(() => {
    console.log("Home page loaded");
  });

  const navigateToAppointments = () => {
    Taro.switchTab({
      url: "/pages/appointments/index",
    });
  };

  const navigateToChat = (withMessage?: string) => {
    Taro.switchTab({
      url: "/pages/chat/index",
      success: () => {
        if (withMessage) {
          // In a real app, you'd need to use a state management system
          // to pass the message to the chat page
          console.log("Sending message:", withMessage);
        }
      },
    });
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    navigateToChat(chatInput);
    setChatInput("");
  };

  const formatAppointmentDate = (date: string) => {
    // Convert YYYY-MM-DD to more readable format
    const dateObj = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateObj.getTime() === today.getTime()) return "今天";
    if (dateObj.getTime() === tomorrow.getTime()) return "明天";

    return `${dateObj.getMonth() + 1}月${dateObj.getDate()}日`;
  };

  return (
    <View className="index-page">
      {/* Greeting Section */}
      <View className="greeting-section">
        <View className="greeting-content">
          <Text className="greeting-text">您好，{mockUser.username}</Text>
          <Text className="community-info">小区: {mockUser.roomNumber}</Text>
        </View>
        <Image className="avatar" src={mockUser.avatar} />
      </View>

      {/* Upcoming Appointments Section */}
      <View className="section-container">
        <View className="section-header">
          <Icon value="calendar" size={20} className="section-icon" />
          <Text className="section-title">即将到来的预约</Text>
        </View>

        {upcomingAppointments.length > 0 ? (
          <ScrollView className="upcoming-appointments" scrollY>
            {upcomingAppointments.map((appointment) => (
              <View key={appointment.id} className="appointment-card">
                <View className="appointment-date">
                  <Text className="date-label">
                    {formatAppointmentDate(appointment.date)}
                  </Text>
                </View>
                <View className="appointment-details">
                  <Text className="court-name">{appointment.court}</Text>
                  <Text className="time-slot">
                    {appointment.startTime} - {appointment.endTime}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View className="empty-appointments">
            <Icon value="calendar" size={40} className="empty-icon" />
            <Text className="empty-text">您没有即将到来的预约</Text>
          </View>
        )}

        <View className="make-appointment-btn" onClick={navigateToAppointments}>
          <Icon value="calendar" size={18} className="icon-white" />
          <Text className="btn-text">预约场地</Text>
        </View>
      </View>

      {/* Quick Chat Section */}
      <View className="section-container">
        <View className="section-header">
          <Icon value="message" size={20} className="section-icon" />
          <Text className="section-title">快速提问</Text>
        </View>

        <View className="chat-input-container">
          <Input
            className="chat-input"
            value={chatInput}
            onInput={(e) => setChatInput(e.detail.value)}
            placeholder="询问预约信息或直接预约..."
            confirmType="send"
            onConfirm={handleSendMessage}
          />
          <View className="send-button" onClick={handleSendMessage}>
            <Icon value="send" size={20} className="send-icon" />
          </View>
        </View>

        <Text className="chat-help-text">
          例如: "我想预约明天下午的羽毛球场" 或 "查看本周可用时段"
        </Text>
      </View>

      {/* Activity Summary */}
      <View className="section-container">
        <View className="section-header">
          <Icon value="info" size={20} className="section-icon" />
          <Text className="section-title">活动统计</Text>
        </View>

        <View className="stats-container">
          <View className="stat-item">
            <Text className="stat-value">{mockUser.gamesPlayed}</Text>
            <Text className="stat-label">场次</Text>
          </View>
          <View className="stat-divider"></View>
          <View className="stat-item">
            <Text className="stat-value">{mockUser.attendanceRate}%</Text>
            <Text className="stat-label">出勤率</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
