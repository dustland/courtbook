/**
 * AI Assistant Service
 *
 * This service integrates the WeChat Cloud AI SDK with our appointment system,
 * allowing users to query and book courts using natural language.
 *
 * References:
 * - CloudBase AI SDK: https://docs.cloudbase.net/ai/sdk-reference/init
 */

import Taro from "@tarojs/taro";

// Types for AI assistant
interface AIAssistantOptions {
  onMessage?: (message: string) => void;
  onError?: (error: any) => void;
  onComplete?: () => void;
}

interface AppointmentSlot {
  id: string;
  courtId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  courtName?: string;
}

class AIAssistant {
  private sessionId: string;
  private userId: string;
  private ai: any = null;

  constructor(userId: string) {
    this.sessionId = `session-${userId}-${Date.now()}`;
    this.userId = userId;
    this.initAI();
  }

  /**
   * Initialize AI SDK
   */
  private async initAI() {
    try {
      // Initialize Cloud environment
      Taro.cloud.init({
        env:
          Taro.getStorageSync("cloudEnvId") || Taro.cloud.DYNAMIC_CURRENT_ENV,
      });

      // Get AI instance using built-in method for Mini Programs
      this.ai = Taro.cloud.extend?.AI;

      if (!this.ai) {
        console.warn(
          "AI SDK not available through Taro.cloud.extend.AI, falling back to alternative method"
        );
        // Fallback to initialize AI using cloud instance directly
        const cloud = Taro.cloud;
        this.ai = cloud.wxExtendAi;
      }

      if (!this.ai) {
        console.error("Failed to initialize AI SDK");
      }
    } catch (error) {
      console.error("Error initializing AI SDK:", error);
    }
  }

  /**
   * Process user's message with AI and perform appointment-related actions
   */
  async processMessage(
    message: string,
    options: AIAssistantOptions = {}
  ): Promise<string> {
    try {
      // Make sure AI is initialized
      if (!this.ai) {
        await this.initAI();
        if (!this.ai) {
          throw new Error("AI SDK not available");
        }
      }

      // If this is an appointment-related query, first get available slots
      if (this.isAppointmentQuery(message)) {
        await this.getAvailableSlotsForAI(message);
      }

      // Use the WeChat AI SDK to process the message
      const result = await this.callAIModel(message);

      // If the AI suggests booking a specific slot, process it
      if (this.isBookingIntent(result)) {
        await this.processBookingIntent(result);
      }

      if (options.onMessage) {
        options.onMessage(result);
      }

      if (options.onComplete) {
        options.onComplete();
      }

      return result;
    } catch (error) {
      console.error("Error processing message with AI:", error);
      if (options.onError) {
        options.onError(error);
      }
      return "Sorry, I encountered an error while processing your request.";
    }
  }

  /**
   * Call the AI model
   */
  private async callAIModel(message: string): Promise<string> {
    try {
      if (!this.ai) {
        throw new Error("AI SDK not initialized");
      }

      // For non-streaming chat response
      const chatResult = await this.ai.chatModel.text({
        prompt: message,
        modelId: "glm-4", // Specify model as needed
        sessionId: this.sessionId,
        chatConfig: {
          temperature: 0.7,
          maxTokens: 1000,
        },
        user: { id: this.userId },
      });

      return chatResult.content || "I'm not sure how to respond to that.";
    } catch (error) {
      console.error("Error calling AI model:", error);
      throw error;
    }
  }

  /**
   * Check if the message is related to booking or finding courts
   */
  private isAppointmentQuery(message: string): boolean {
    const appointmentKeywords = [
      "book",
      "booking",
      "reserve",
      "reservation",
      "court",
      "appointment",
      "schedule",
      "time",
      "slot",
      "available",
      "预约",
      "订场",
      "场地",
      "时间",
      "可用",
      "什么时候",
    ];

    return appointmentKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  /**
   * Get available slots to provide context to the AI
   */
  private async getAvailableSlotsForAI(message: string): Promise<void> {
    try {
      // Extract date information from message or use default (next 7 days)
      const dateInfo = this.extractDateInfo(message);

      // Call the appointments cloud function to get available slots
      const result = await Taro.cloud.callFunction({
        name: "appointments",
        data: {
          action: "queryAvailableSlots",
          data: {
            startDate: dateInfo.startDate,
            endDate: dateInfo.endDate,
          },
        },
      });

      // Store the slots in the session context for the AI to use
      if (result && result.result) {
        const data = (result.result as any).data;
        if (data) {
          this.sessionContext = {
            ...this.sessionContext,
            availableSlots: data.availableSlots,
            courts: data.courts,
          };
        }
      }
    } catch (error) {
      console.error("Error getting available slots:", error);
    }
  }

  /**
   * Extract date information from the user's message
   */
  private extractDateInfo(message: string): {
    startDate: string;
    endDate: string;
  } {
    // Implement date extraction logic here
    // For now, use a simple default of current date + 7 days
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return {
      startDate: today.toISOString().split("T")[0],
      endDate: nextWeek.toISOString().split("T")[0],
    };
  }

  /**
   * Check if the AI response suggests booking a slot
   */
  private isBookingIntent(response: string): boolean {
    const bookingKeywords = [
      "book this slot",
      "reserve this court",
      "make appointment",
      "confirm booking",
      "book the",
      "reserve the",
      "book for",
      "预订该时段",
      "确认预约",
      "预订",
      "预约",
    ];

    return bookingKeywords.some((keyword) =>
      response.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  /**
   * Process a booking intent recognized in the AI response
   */
  private async processBookingIntent(response: string): Promise<void> {
    try {
      // Extract booking details from AI response
      const bookingDetails = this.extractBookingDetails(response);

      if (!bookingDetails) {
        console.log("Could not extract booking details from response");
        return;
      }

      // Call cloud function to create appointment
      await Taro.cloud.callFunction({
        name: "appointments",
        data: {
          action: "createAppointment",
          data: {
            userId: this.userId,
            courtId: bookingDetails.courtId,
            date: bookingDetails.date,
            startTime: bookingDetails.startTime,
            endTime: bookingDetails.endTime,
          },
        },
      });

      console.log("Appointment created successfully");
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  }

  /**
   * Extract booking details from the AI response
   */
  private extractBookingDetails(response: string): {
    courtId: string;
    date: string;
    startTime: string;
    endTime: string;
  } | null {
    // Implement a more sophisticated extraction method as needed
    // This is a placeholder implementation

    // Check if we have available slots in context
    if (!this.sessionContext?.availableSlots?.length) {
      return null;
    }

    // For simplicity, just use the first available slot
    const slot = this.sessionContext.availableSlots[0];

    return {
      courtId: slot.courtId,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
    };
  }

  // Session context to maintain conversation state
  private sessionContext: {
    availableSlots?: AppointmentSlot[];
    courts?: any[];
  } = {};
}

export default AIAssistant;
