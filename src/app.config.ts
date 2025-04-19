export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/chat/index",
    "pages/appointments/index",
    "pages/profile/index",
    "pages/icons/index",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "CourtBook",
    navigationBarTextStyle: "black",
  },
  tabBar: {
    color: "#999",
    selectedColor: "var(--primary-color)",
    backgroundColor: "#fff",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "assets/icons/home.png",
        selectedIconPath: "assets/icons/home-active.png",
      },
      {
        pagePath: "pages/chat/index",
        text: "对话",
        iconPath: "assets/icons/chat.png",
        selectedIconPath: "assets/icons/chat-active.png",
      },
      {
        pagePath: "pages/appointments/index",
        text: "预约",
        iconPath: "assets/icons/appointments.png",
        selectedIconPath: "assets/icons/appointments-active.png",
      },
      {
        pagePath: "pages/profile/index",
        text: "我的",
        iconPath: "assets/icons/profile.png",
        selectedIconPath: "assets/icons/profile-active.png",
      },
    ],
  },
});
