# AI Chat & Appointment Services

This directory contains services for interfacing with the WeChat Cloud AI SDK and the appointment management system.

## Overview

The services provide:

1. AI chat capabilities for natural language booking
2. Integration with cloud functions for appointment management
3. Example implementation of a chat interface

## AI Assistant Service

The `ai-assistant.ts` file contains a service that:

- Uses the WeChat Cloud AI SDK (`wx.cloud.wxExtendAi`) to process user messages
- Detects appointment-related queries
- Fetches available slots from our cloud functions
- Helps users book appointments through natural language

### Usage Example

```typescript
import AIAssistant from "../services/ai-assistant";

// Initialize the assistant with a user ID
const assistant = new AIAssistant("user-123");

// Process a message
const response = await assistant.processMessage(
  "I'd like to book a tennis court tomorrow"
);

// Process a message with callbacks
assistant.processMessage("What courts are available this weekend?", {
  onMessage: (message) => {
    console.log("Response:", message);
  },
  onError: (error) => {
    console.error("Error:", error);
  },
  onComplete: () => {
    console.log("Processing complete");
  },
});
```

## Cloud Function Integration

The AI assistant integrates with our cloud functions for appointment management:

- `queryAvailableSlots`: Get available courts and time slots
- `createAppointment`: Book a court
- `getUserAppointments`: View user's bookings
- `cancelAppointment`: Cancel a booking

To populate the database with initial test data:

```typescript
// In your app
Taro.cloud
  .callFunction({
    name: "appointments",
    data: {
      action: "seedData",
    },
  })
  .then((res) => {
    console.log("Seed data initialized:", res);
  });
```

## Implementation Details

The AI integration works through the following process:

1. User sends a message to the AI assistant
2. The message is analyzed for appointment-related keywords
3. If relevant, the system fetches available courts and time slots
4. The AI uses this context to provide an appropriate response
5. If the user wants to book, the assistant can extract details and create an appointment

## Requirements

- WeChat Mini Program with cloud capabilities enabled
- AI features enabled in the WeChat Cloud console
- Deployed cloud functions for appointment management
