import { useState } from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import { WeeklySchedule, DailySchedule, TimeSlot } from "../types";
import "./schedule.scss";

interface ScheduleProps {
  weeklySchedule: WeeklySchedule;
}

const Schedule: React.FC<ScheduleProps> = ({ weeklySchedule }) => {
  const [viewType, setViewType] = useState<"day" | "week">("day");
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const selectedDay = weeklySchedule.days[selectedDayIndex];
  const dayNames = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const renderTimeSlot = (slot: TimeSlot) => {
    return (
      <View
        key={slot.id}
        className={`time-slot ${slot.isBooked ? "booked" : "available"}`}
      >
        <View className="time">
          <Text>
            {slot.startTime} - {slot.endTime}
          </Text>
        </View>
        <View className="status">
          {slot.isBooked ? (
            <Text className="booked-by">已被{slot.bookedBy}预约</Text>
          ) : (
            <Text className="available-text">可预约</Text>
          )}
        </View>
      </View>
    );
  };

  const renderDayView = (day: DailySchedule) => {
    return (
      <View className="day-view">
        <View className="day-header">
          <Text className="day-name">{dayNames[selectedDayIndex]}</Text>
          <Text className="day-date">{formatDate(day.date)}</Text>
        </View>
        <ScrollView
          className="time-slots-container"
          scrollY
          scrollWithAnimation
        >
          {day.slots.map(renderTimeSlot)}
        </ScrollView>
      </View>
    );
  };

  const renderWeekView = () => {
    return (
      <View className="week-view">
        <ScrollView className="days-row" scrollX scrollWithAnimation>
          {weeklySchedule.days.map((day, index) => (
            <View
              key={day.date}
              className={`day-column ${
                selectedDayIndex === index ? "selected" : ""
              }`}
              onClick={() => setSelectedDayIndex(index)}
            >
              <Text className="day-name">{dayNames[index]}</Text>
              <Text className="day-date">{formatDate(day.date)}</Text>
              <View className="day-slots">
                {day.slots.map((slot) => (
                  <View
                    key={slot.id}
                    className={`mini-slot ${
                      slot.isBooked ? "booked" : "available"
                    }`}
                  />
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
        {renderDayView(selectedDay)}
      </View>
    );
  };

  return (
    <View className="schedule-container">
      <View className="view-toggle">
        <View
          className={`toggle-button ${viewType === "day" ? "active" : ""}`}
          onClick={() => setViewType("day")}
        >
          <Text>日视图</Text>
        </View>
        <View
          className={`toggle-button ${viewType === "week" ? "active" : ""}`}
          onClick={() => setViewType("week")}
        >
          <Text>周视图</Text>
        </View>
      </View>

      {viewType === "day" ? renderDayView(selectedDay) : renderWeekView()}
    </View>
  );
};

export default Schedule;
