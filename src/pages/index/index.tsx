import { View, Text, Image, Input } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import Taro from "@tarojs/taro";
import { useState, useEffect } from "react";
import Icon from "../../components/icon";
import { mockAppointments, mockUser } from "../../mock/data";
import "./index.scss";
import QuickQuestion from "@/components/quick-question";

export default function Index() {
  const [chatInput, setChatInput] = useState("");
  const [upcomingAppointments, setUpcomingAppointments] = useState(
    mockAppointments.filter((appointment) => !appointment.isPast).slice(0, 3)
  );

  useLoad(() => {
    console.log("Page loaded.");
  });

  // useEffect(() => {
  //   Taro.setNavigationBarColor({
  //     frontColor: "#ffffff",
  //     backgroundColor: "#6a48fa",
  //   });
  // }, []);

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
      {/* Greeting Section with Stats */}
      <View className="greeting-section">
        <Image className="avatar" src={mockUser.avatar} />
        <View className="greeting-content">
          <View className="quick-stats">
            <View className="stat-item">
              <Text className="stat-label">场次</Text>
              <Text className="stat-value">{mockUser.gamesPlayed}</Text>
            </View>
            <View className="stat-divider"></View>
            <View className="stat-item">
              <Text className="stat-label">出勤率</Text>
              <Text className="stat-value">{mockUser.attendanceRate}%</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="main-content">
        {/* Upcoming Appointments Section */}
        <View className="appointments-section">
          <View className="section-container appointments-container">
            <View className="section-header">
              <Icon value="calendar" size={24} className="section-icon" />
              <Text className="section-title">即将开始</Text>
            </View>

            <View className="upcoming-appointments">
              {upcomingAppointments.length > 0 ? (
                <>
                  {/* Display only the first appointment */}
                  <View
                    key={upcomingAppointments[0].id}
                    className="appointment-card"
                  >
                    <View className="appointment-date">
                      <Text className="date-label">
                        {upcomingAppointments[0].date.split("-")[2]}日
                      </Text>
                    </View>
                    <View className="appointment-details">
                      <Text className="court-name">
                        {upcomingAppointments[0].court}
                      </Text>
                      <Text className="time-slot">
                        {upcomingAppointments[0].startTime} -{" "}
                        {upcomingAppointments[0].endTime}
                      </Text>
                    </View>
                  </View>

                  {/* If there are more appointments, show a summary line */}
                  {upcomingAppointments.length > 1 && (
                    <View className="remaining-appointments">
                      <Text className="remaining-text">
                        还有 {upcomingAppointments.length - 1} 个预约
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                <Text className="no-appointments">没有即将到来的预约</Text>
              )}
            </View>

            <View
              className="make-appointment-btn"
              onClick={navigateToAppointments}
            >
              <Text className="btn-text">预约场地</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Quick Chat Section */}
      <View className="chat-container">
        <View className="quick-question">
          <QuickQuestion question="帮我预定明天晚上 7 点的场地" />
          <QuickQuestion question="最近可以订到的 1 小时的场地是什么时候？" />
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
      </View>
    </View>
  );
}
