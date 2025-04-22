import { PropsWithChildren } from "react";
import { useLaunch, useDidShow } from "@tarojs/taro";
import Taro from "@tarojs/taro";

// Import app styles
import "./app.scss";

function App({ children }: PropsWithChildren<any>) {
  // Handle user login
  const handleUserLogin = async () => {
    try {
      // Get login status
      const { code } = await Taro.login();

      // Call the cloud function to upsert user
      const result = await Taro.cloud.callFunction({
        name: "users",
        data: {
          action: "upsertUser",
          data: {},
        },
      });

      console.log("User login successful:", result);

      // Try to get user profile if needed
      try {
        const userInfoRes = await Taro.getUserProfile({
          desc: "用于完善用户资料",
        });

        if (userInfoRes.userInfo) {
          // Update user profile with additional info
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
      } catch (profileError) {
        // User declined to provide profile info, just continue
        console.log("User declined profile info:", profileError);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  useLaunch(() => {
    console.log("App launched.");

    // Initialize cloud environment
    Taro.cloud.init({
      env: process.env.CLOUD_ENV || "cloud1",
    });

    // Handle user login on app launch
    handleUserLogin();
  });

  useDidShow(() => {
    console.log("App shown");
  });

  return children;
}

export default App;
