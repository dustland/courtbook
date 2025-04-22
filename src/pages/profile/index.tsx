import { View, Text, Image } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import Taro from "@tarojs/taro";
import Icon from "../../components/icon";
import ActivityChart from "../../components/activity-chart";
import { mockUser } from "../../mock/data";
import "./index.scss";

export default function Profile() {
  useLoad(() => {
    console.log("Profile page loaded");
  });

  const navigateToIcons = () => {
    Taro.navigateTo({
      url: "/pages/icons/index",
    });
  };

  return (
    <View className="profile-page">
      <View className="profile-header">
        <Image className="avatar" src={mockUser.avatar} />
        <View className="user-info">
          <Text className="username">{mockUser.username}</Text>
          <Text className="room-number">{mockUser.roomNumber}</Text>
        </View>
      </View>

      <View className="stats-box">
        <View className="stat-item">
          <Text className="stat-value">{mockUser.gamesPlayed}</Text>
          <Text className="stat-label">场次</Text>
        </View>
        <View className="stat-divider"></View>
        <View className="stat-item">
          <Text className="stat-value">{mockUser.attendanceRate}%</Text>
          <Text className="stat-label">出场率</Text>
        </View>
      </View>

      <ActivityChart />

      <View className="menu-list">
        <View className="menu-item">
          <View className="menu-item-left">
            <Icon value="message" size={20} className="menu-icon" />
            <Text className="menu-text">反馈</Text>
          </View>
          <Icon value="chevron-right" size={16} className="menu-arrow" />
        </View>
        <View className="menu-item">
          <View className="menu-item-left">
            <Icon value="info" size={20} className="menu-icon" />
            <Text className="menu-text">关于</Text>
          </View>
          <Icon value="chevron-right" size={16} className="menu-arrow" />
        </View>
      </View>
    </View>
  );
}
