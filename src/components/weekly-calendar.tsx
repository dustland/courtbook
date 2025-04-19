import { View, Text, ScrollView } from "@tarojs/components";
import { useState, useMemo } from "react";
import { WeeklySchedule, Appointment, TimeSlot } from "../types";
import "./weekly-calendar.scss";

interface WeeklyCalendarProps {
  weeklySchedule: WeeklySchedule;
  userAppointments: Appointment[];
}

// Format the date to display day of week and date
const formatDay = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDay();
  const dayNames = ["日", "一", "二", "三", "四", "五", "六"];
  const monthDay = `${date.getMonth() + 1}/${date.getDate()}`;
  return {
    dayName: dayNames[day],
    monthDay,
    isToday: isDateToday(dateString),
  };
};

// Check if date is today
const isDateToday = (dateString: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  return date.getTime() === today.getTime();
};

// Convert time string to hour number
const timeToHour = (timeString: string) => {
  return parseInt(timeString.split(":")[0], 10);
};

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  weeklySchedule,
  userAppointments,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Create a map of user's appointments for quick lookup
  const userAppointmentMap = useMemo(() => {
    const map = new Map<string, Appointment>();
    userAppointments.forEach((appointment) => {
      const hour = timeToHour(appointment.startTime);
      const key = `${appointment.date}-${hour}`;
      map.set(key, appointment);
    });
    return map;
  }, [userAppointments]);

  // Get the time slots for display
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let hour = 8; hour < 22; hour++) {
      slots.push(`${hour}:00`);
    }
    return slots;
  }, []);

  // Handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date === selectedDate ? null : date);
  };

  // Get style class for a time slot
  const getSlotClass = (
    date: string,
    timeSlot: string,
    isBooked: boolean,
    bookedBy?: string
  ) => {
    const hour = timeToHour(timeSlot);
    const key = `${date}-${hour}`;
    const isUserAppointment = userAppointmentMap.has(key);

    if (isUserAppointment) {
      return "time-slot my-appointment";
    } else if (isBooked) {
      return "time-slot others-appointment";
    }
    return "time-slot available";
  };

  return (
    <View className="weekly-calendar">
      <View className="calendar-header">
        <Text className="calendar-title">本周预约情况</Text>
      </View>

      <ScrollView className="days-row" scrollX>
        {weeklySchedule.days.map((day) => {
          const { dayName, monthDay, isToday } = formatDay(day.date);
          const isSelected = day.date === selectedDate;
          return (
            <View
              key={day.date}
              className={`day-column ${isSelected ? "selected" : ""} ${
                isToday ? "today" : ""
              }`}
              onClick={() => handleDateSelect(day.date)}
            >
              <Text className="day-name">{dayName}</Text>
              <Text className="day-date">{monthDay}</Text>

              <View className="day-slots">
                {day.slots.map((slot) => {
                  const isUserAppt = userAppointmentMap.has(
                    `${day.date}-${timeToHour(slot.startTime)}`
                  );
                  return (
                    <View
                      key={slot.id}
                      className={`mini-slot ${
                        slot.isBooked
                          ? isUserAppt
                            ? "my-appointment"
                            : "others-appointment"
                          : "available"
                      }`}
                    />
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {selectedDate && (
        <View className="day-detail">
          <Text className="day-detail-title">
            {formatDay(selectedDate).monthDay} (
            {formatDay(selectedDate).dayName})
          </Text>

          <View className="time-slots-container">
            {timeSlots.map((timeSlot) => {
              const day = weeklySchedule.days.find(
                (d) => d.date === selectedDate
              );
              if (!day) return null;

              const slot = day.slots.find((s) => s.startTime === timeSlot);
              if (!slot) return null;

              const isUserAppt = userAppointmentMap.has(
                `${selectedDate}-${timeToHour(timeSlot)}`
              );

              return (
                <View
                  key={`${selectedDate}-${timeSlot}`}
                  className={getSlotClass(
                    selectedDate,
                    timeSlot,
                    slot.isBooked,
                    slot.bookedBy
                  )}
                >
                  <Text className="time">{timeSlot}</Text>
                  <View className="status">
                    {slot.isBooked ? (
                      isUserAppt ? (
                        <Text className="booked-by my-booking">我的预约</Text>
                      ) : (
                        <Text className="booked-by">
                          已被预约 ({slot.bookedBy})
                        </Text>
                      )
                    ) : (
                      <Text className="available-text">可预约</Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      <View className="legend">
        <View className="legend-item">
          <View className="legend-color my-appointment" />
          <Text className="legend-text">我的预约</Text>
        </View>
        <View className="legend-item">
          <View className="legend-color others-appointment" />
          <Text className="legend-text">他人预约</Text>
        </View>
        <View className="legend-item">
          <View className="legend-color available" />
          <Text className="legend-text">可预约</Text>
        </View>
      </View>
    </View>
  );
};

export default WeeklyCalendar;
