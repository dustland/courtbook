import { View } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import Header from "../../components/header";
import Schedule from "../../components/schedule";
import FloatingChat from "../../components/floating-chat";
import { mockWeeklySchedule } from "../../mock/data";
import "./index.scss";

export default function Index() {
  useLoad(() => {
    console.log("Home page loaded");
  });

  return (
    <View className="index-page">
      {/* <Header /> */}
      <Schedule weeklySchedule={mockWeeklySchedule} />
      <FloatingChat />
    </View>
  );
}
