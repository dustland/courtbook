import {
  UserInfo,
  WeeklySchedule,
  Appointment,
  ChatHistory,
  ActivityData,
  TimeSlot,
} from "../types";

// Mock user data
export const mockUser: UserInfo = {
  avatar: "https://i.pravatar.cc/48",
  username: "张三",
  roomNumber: "A-101",
  gamesPlayed: 28,
  attendanceRate: 92,
};

// Generate mock time slots for a day
const generateTimeSlots = (
  date: string,
  bookedSlots: number[] = []
): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 8;
  const endHour = 22;

  for (let hour = startHour; hour < endHour; hour++) {
    const id = `${date}-${hour}`;
    const isBooked = bookedSlots.includes(hour);

    slots.push({
      id,
      startTime: `${hour}:00`,
      endTime: `${hour + 1}:00`,
      isBooked,
      bookedBy: isBooked ? (Math.random() > 0.5 ? "李四" : "王五") : undefined,
    });
  }

  return slots;
};

// Generate mock weekly schedule
export const mockWeeklySchedule: WeeklySchedule = {
  week: 21, // Week number of the year
  days: [
    {
      date: "2023-05-22", // Monday
      slots: generateTimeSlots("2023-05-22", [10, 17, 19]),
    },
    {
      date: "2023-05-23", // Tuesday
      slots: generateTimeSlots("2023-05-23", [9, 13, 18]),
    },
    {
      date: "2023-05-24", // Wednesday
      slots: generateTimeSlots("2023-05-24", [11, 15, 20]),
    },
    {
      date: "2023-05-25", // Thursday
      slots: generateTimeSlots("2023-05-25", [8, 14, 21]),
    },
    {
      date: "2023-05-26", // Friday
      slots: generateTimeSlots("2023-05-26", [12, 16, 19]),
    },
    {
      date: "2023-05-27", // Saturday
      slots: generateTimeSlots("2023-05-27", [10, 14, 17, 20]),
    },
    {
      date: "2023-05-28", // Sunday
      slots: generateTimeSlots("2023-05-28", [9, 13, 16, 19]),
    },
  ],
};

// Mock appointments
export const mockAppointments: Appointment[] = [
  {
    id: "1",
    date: "2023-05-23",
    startTime: "9:00",
    endTime: "10:00",
    court: "东区羽毛球场",
    isPast: false,
  },
  {
    id: "2",
    date: "2023-05-25",
    startTime: "14:00",
    endTime: "15:00",
    court: "西区羽毛球场",
    isPast: false,
  },
  {
    id: "3",
    date: "2023-05-18",
    startTime: "17:00",
    endTime: "18:00",
    court: "中区羽毛球场",
    isPast: true,
  },
];

// Mock chat history
export const mockChatHistory: ChatHistory = {
  id: "1",
  lastUpdated: "2023-05-21 15:30",
  messages: [
    {
      id: "1",
      sender: "user",
      text: "我想预约羽毛球场地",
      timestamp: "2023-05-21 15:25",
    },
    {
      id: "2",
      sender: "assistant",
      text: "好的，请问您想预约哪一天的场地？",
      timestamp: "2023-05-21 15:26",
    },
    {
      id: "3",
      sender: "user",
      text: "我想预约明天下午的场地",
      timestamp: "2023-05-21 15:27",
    },
    {
      id: "4",
      sender: "assistant",
      text: "明天下午有以下时间段可以预约：14:00-15:00、15:00-16:00、16:00-17:00，请问您想预约哪个时间段？",
      timestamp: "2023-05-21 15:28",
      availableSlots: [
        {
          id: "2023-05-22-14",
          startTime: "14:00",
          endTime: "15:00",
          isBooked: false,
        },
        {
          id: "2023-05-22-15",
          startTime: "15:00",
          endTime: "16:00",
          isBooked: false,
        },
        {
          id: "2023-05-22-16",
          startTime: "16:00",
          endTime: "17:00",
          isBooked: false,
        },
      ],
    },
    {
      id: "5",
      sender: "user",
      text: "我想预约14:00-15:00的场地",
      timestamp: "2023-05-21 15:29",
    },
    {
      id: "6",
      sender: "assistant",
      text: "预约成功！您已预约明天14:00-15:00的羽毛球场地。",
      timestamp: "2023-05-21 15:30",
    },
  ],
};

// Generate mock activity data (for GitHub-like activity chart)
export const mockActivityData: ActivityData[] = [];
const today = new Date();
for (let i = 0; i < 365; i++) {
  const date = new Date(today);
  date.setDate(today.getDate() - i);
  const dateString = date.toISOString().split("T")[0];

  // Random activity level (0-4)
  const count = Math.floor(Math.random() * 5);

  mockActivityData.push({
    date: dateString,
    count,
  });
}
