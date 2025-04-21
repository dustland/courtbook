export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/chat/index",
    "pages/appointments/index",
    "pages/profile/index",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "CourtBook",
    navigationBarTextStyle: "black",
    // navigationStyle: "custom",
    enablePullDownRefresh: true,
  },
  tabBar: {
    color: "#515151",
    selectedColor: "#67b42e",
    backgroundColor: "#fff",
    borderStyle: "white",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        iconPath: "assets/icons/home.png",
        selectedIconPath: "assets/icons/home-active.png",
      },
      {
        pagePath: "pages/chat/index",
        text: "助理",
        iconPath: "assets/icons/chat.png",
        selectedIconPath: "assets/icons/chat-active.png",
      },
      {
        pagePath: "pages/appointments/index",
        text: "预约",
        iconPath: "assets/icons/calendar.png",
        selectedIconPath: "assets/icons/calendar-active.png",
      },
      {
        pagePath: "pages/profile/index",
        text: "我的",
        iconPath: "assets/icons/profile.png",
        selectedIconPath: "assets/icons/profile-active.png",
      },
    ],
  },
  debug: true,
});
