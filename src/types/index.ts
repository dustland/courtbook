// User information types
export interface UserInfo {
  avatar: string;
  username: string;
  roomNumber: string;
  gamesPlayed: number;
  attendanceRate: number;
}

// Schedule and appointment types
export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  bookedBy?: string;
}

export interface DailySchedule {
  date: string;
  slots: TimeSlot[];
}

export interface WeeklySchedule {
  week: number;
  days: DailySchedule[];
}

export interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  court: string;
  isPast: boolean;
}

// Chat message types
export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  availableSlots?: TimeSlot[];
}

export interface ChatHistory {
  id: string;
  messages: ChatMessage[];
  lastUpdated: string;
}

// Activity data for profile page
export interface ActivityData {
  date: string;
  count: number; // 0-4 for different intensity levels
}
