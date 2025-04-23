import { PropsWithChildren } from "react";
import { useLaunch, useDidShow } from "@tarojs/taro";
import Taro from "@tarojs/taro";

// Import app styles
import "./app.scss";

// Add global function type to window
declare global {
  interface Window {
    getUserProfileOnDemand: () => Promise<any>;
  }
}

function App({ children }: PropsWithChildren<any>) {
  // Handle user login - using the proper login flow
  const handleUserLogin = async () => {
    try {
      // Get login status - this returns a temporary code
      const loginResult = await Taro.login();
      console.log("User login result:", loginResult);

      if (loginResult.code) {
        // Call the cloud function without passing the code
        // The cloud function will get the OPENID from context
        const result = await Taro.cloud.callFunction({
          name: "users",
          data: {
            action: "upsertUser",
            data: {},
          },
        });

        console.log("User login successful:", result);
      } else {
        console.log("登录失败！" + loginResult.errMsg);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // This function should be called from a button click handler
  // in a component that the user interacts with
  const getUserProfileOnDemand = async () => {
    try {
      // Check if the API is available (for backward compatibility)
      if (typeof Taro.getUserProfile !== "function") {
        console.log(
          "getUserProfile API is not available, falling back to getUserInfo"
        );
        // Fall back to getUserInfo, but it will return anonymous data after April 13, 2021
        const userInfoRes = await Taro.getUserInfo();
        return userInfoRes.userInfo;
      }

      // Use getUserProfile which requires user interaction and will show a permission dialog
      const userInfoRes = await Taro.getUserProfile({
        desc: "用于完善会员资料", // Required parameter that explains why you need user info
      });

      if (userInfoRes.userInfo) {
        console.log("Got user profile:", userInfoRes.userInfo);

        // Update user profile with additional info
        const result = await Taro.cloud.callFunction({
          name: "users",
          data: {
            action: "updateUserProfile",
            data: {
              userInfo: userInfoRes.userInfo,
            },
          },
        });

        console.log("User profile updated:", result);
        return userInfoRes.userInfo;
      }
    } catch (error) {
      console.error("Failed to get user profile:", error);
      return null;
    }
  };

  useLaunch(() => {
    console.log("App launched.");

    // Initialize cloud environment
    Taro.cloud.init({
      env: "courtbook-4g2151pyeb948084", // 直接使用您的云环境ID
    });

    // Handle basic user login on app launch
    handleUserLogin();

    // Expose the getUserProfileOnDemand function globally
    if (typeof window !== "undefined") {
      window.getUserProfileOnDemand = getUserProfileOnDemand;
    }
  });

  useDidShow(() => {
    console.log("App shown");
  });

  return children;
}

export default App;
