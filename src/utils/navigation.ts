import Taro from "@tarojs/taro";

// Constants - make it private with underscore prefix
const _INITIAL_MESSAGE_KEY = "CHAT_INITIAL_MESSAGE";

/**
 * Navigate to the chat page with an initial message
 * Uses localStorage instead of URL parameters due to Taro/WeChat limitations
 *
 * @param message The initial message to send when the chat page loads
 */
export const navigateToChatWithMessage = (message: string) => {
  // Store the message in localStorage before navigation
  Taro.setStorageSync(_INITIAL_MESSAGE_KEY, message);

  // Navigate to the chat page using switchTab (if it's a tabBar page)
  Taro.switchTab({
    url: "/pages/chat/index",
    success: () => {
      console.log("Successfully navigated to chat with message:", message);
    },
    fail: (err) => {
      console.error("Failed to navigate to chat:", err);

      // Fallback to navigateTo if switchTab fails (in case it's not a tabBar page)
      Taro.navigateTo({
        url: "/pages/chat/index",
      });
    },
  });
};

/**
 * Redirect to the chat page with an initial message
 * Similar to navigateToChatWithMessage but uses redirectTo instead
 *
 * @param message The initial message to send when the chat page loads
 */
export const redirectToChatWithMessage = (message: string) => {
  // Store the message in localStorage before navigation
  Taro.setStorageSync(_INITIAL_MESSAGE_KEY, message);

  // Redirect to the chat page (closes current page)
  Taro.redirectTo({
    url: "/pages/chat/index",
    success: () => {
      console.log("Successfully redirected to chat with message:", message);
    },
    fail: (err) => {
      console.error("Failed to redirect to chat:", err);
    },
  });
};

/**
 * Retrieve the initial message for the chat page
 * This should be called in the chat page's useDidShow hook
 *
 * @returns The initial message if one exists, null otherwise
 */
export const getAndClearInitialChatMessage = (): string | null => {
  try {
    // Check if there's a message in storage
    const hasMessage = Taro.getStorageSync(_INITIAL_MESSAGE_KEY);

    if (!hasMessage) {
      return null;
    }

    // Get the message
    const message = Taro.getStorageSync(_INITIAL_MESSAGE_KEY);

    // Clear it from storage
    Taro.removeStorageSync(_INITIAL_MESSAGE_KEY);

    // Return the message
    return message;
  } catch (error) {
    console.error("Error retrieving initial chat message:", error);
    return null;
  }
};
