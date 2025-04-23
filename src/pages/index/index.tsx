import { View, Text, Image, Button } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import Taro from "@tarojs/taro";
import Icon from "../../components/icon";
import ChatInput from "../../components/chat-input";
import { mockAppointments, mockUser } from "../../mock/data";
import { navigateToChatWithMessage } from "../../utils/navigation";
import "./index.scss";
import { useState, useEffect } from "react";
import { Appointment } from "@/types";

export default function Index() {
  const [upcomingAppointments] = useState<Appointment[]>(
    mockAppointments.filter((appointment) => !appointment.isPast).slice(0, 3)
  );

  const [userInfo, setUserInfo] = useState<any>(null);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [canUseGetUserProfile, setCanUseGetUserProfile] = useState(false);

  // Quick questions for the home page
  const quickQuestions = [
    { question: "帮我预定明天晚上 7 点的场地" },
    { question: "最近可以订到的 1 小时的场地是什么时候？" },
    { question: "帮我介绍一下网球的相关知识" },
  ];

  useLoad(() => {
    console.log("Page loaded.");
    // Check if getUserProfile API is available
    if (typeof Taro.getUserProfile === "function") {
      setCanUseGetUserProfile(true);
    }
  });

  useEffect(() => {
    // Check if we need to get user profile info
    checkUserProfile();
  }, []);

  // Check if the user already has profile information
  const checkUserProfile = async () => {
    try {
      const result = await Taro.cloud.callFunction({
        name: "users",
        data: {
          action: "getUser",
          data: {},
        },
      });

      console.log("User profile check:", result);

      const resultData = result?.result as any;
      if (resultData && resultData.code === 200) {
        const userData = resultData.data;

        // If we have user data but no avatar or nickname, show the prompt
        if (userData && (!userData.avatarUrl || !userData.nickName)) {
          setShowProfilePrompt(true);
        } else if (userData) {
          // We have complete user info
          setUserInfo(userData);
        }
      }
    } catch (error) {
      console.error("Failed to check user profile:", error);
      setShowProfilePrompt(true);
    }
  };

  // Handle getting user profile directly in the component
  const handleGetUserProfile = async () => {
    try {
      if (canUseGetUserProfile) {
        // Use the recommended getUserProfile API that requires user interaction
        const userInfoRes = await Taro.getUserProfile({
          desc: "用于完善会员资料", // Required parameter explaining purpose
        });

        if (userInfoRes.userInfo) {
          console.log("Got user profile:", userInfoRes.userInfo);
          setUserInfo(userInfoRes.userInfo);
          setShowProfilePrompt(false);

          // Update user profile in backend
          await Taro.cloud.callFunction({
            name: "users",
            data: {
              action: "updateUserProfile",
              data: {
                userInfo: userInfoRes.userInfo,
              },
            },
          });
        }
      } else {
        // Fallback to global function if available (for older devices)
        if (typeof window !== "undefined" && window.getUserProfileOnDemand) {
          const userInfoResult = await window.getUserProfileOnDemand();
          if (userInfoResult) {
            setUserInfo(userInfoResult);
            setShowProfilePrompt(false);
          }
        } else {
          console.log("getUserProfile API not available");
          // Handle fallback case (older versions)
          const userInfoRes = await Taro.getUserInfo();
          setUserInfo(userInfoRes.userInfo);
          setShowProfilePrompt(false);
        }
      }
    } catch (error) {
      console.error("获取用户信息失败:", error);
      Taro.showToast({
        title: "获取用户信息失败",
        icon: "none",
      });
    }
  };

  const navigateToAppointments = () => {
    Taro.switchTab({
      url: "/pages/appointments/index",
    });
  };

  const navigateToChat = (withMessage?: string) => {
    if (withMessage && withMessage.trim()) {
      // Use the new utility function that uses storage instead of URL params
      navigateToChatWithMessage(withMessage.trim());
    } else {
      Taro.switchTab({
        url: "/pages/chat/index",
      });
    }
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    navigateToChat(text);
  };

  return (
    <View className="index-page">
      {/* User Info Prompt */}
      {showProfilePrompt && (
        <View className="profile-prompt">
          <View className="prompt-content">
            <Text className="prompt-title">获取用户信息</Text>
            <Text className="prompt-message">
              需要获取您的头像和昵称用于预约管理
            </Text>
            <Button
              className="prompt-button"
              type="primary"
              onClick={handleGetUserProfile}
            >
              授权获取
            </Button>
            <Text
              className="prompt-skip"
              onClick={() => setShowProfilePrompt(false)}
            >
              稍后再说
            </Text>
          </View>
        </View>
      )}

      {/* Greeting Section with Stats */}
      <View className="greeting-section">
        <Image
          className="avatar"
          src={userInfo?.avatarUrl || mockUser.avatar}
        />
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
          </View>
        </View>
      </View>
      {/* Quick Chat Section */}
      <View className="chat-container">
        <View className="make-appointment-btn" onClick={navigateToAppointments}>
          <Text className="btn-text">预约场地</Text>
        </View>

        <ChatInput
          onSend={handleSendMessage}
          placeholder="询问预约信息或直接预约..."
          quickQuestions={quickQuestions}
          showQuickQuestions={true}
        />
      </View>
    </View>
  );
}
