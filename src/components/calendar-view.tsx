import { useEffect, useState, useRef } from "react";
import { View, Text, Switch } from "@tarojs/components";
import Calendar from "custom-calendar-taro";
import "custom-calendar-taro/dist/index.css";
import Taro from "@tarojs/taro";
import { Appointment } from "../types";
import "./calendar-view.scss";

interface CalendarViewProps {
  appointments: Appointment[];
  onDateSelect: (date: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  appointments,
  onDateSelect,
}) => {
  const [marks, setMarks] = useState<Array<{ value: string; color: string }>>(
    []
  );
  const [extraInfo, setExtraInfo] = useState<
    Array<{ value: string; text: string; color: string }>
  >([]);
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const calendarRef = useRef(null);

  useEffect(() => {
    // Convert appointments to marks and extraInfo
    const newMarks: Array<{ value: string; color: string }> = [];
    const newExtraInfo: Array<{ value: string; text: string; color: string }> =
      [];

    // Group appointments by date
    const appointmentsByDate = appointments.reduce((acc, appointment) => {
      if (!acc[appointment.date]) {
        acc[appointment.date] = [];
      }
      acc[appointment.date].push(appointment);
      return acc;
    }, {} as Record<string, Appointment[]>);

    // Get today and next 30 days
    const today = new Date();
    const dates: string[] = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      dates.push(dateStr);
    }

    // Create marks and extraInfo
    dates.forEach((date) => {
      const appts = appointmentsByDate[date] || [];

      if (appts.length > 0) {
        // Date has appointments
        newMarks.push({ value: date, color: "#67b42e" });
        newExtraInfo.push({
          value: date,
          text: `${appts.length}个预约`,
          color: "#67b42e",
        });
      } else {
        // Date has no appointments but is available
        newExtraInfo.push({
          value: date,
          text: "可预约",
          color: "#8c8c8c",
        });
      }
    });

    setMarks(newMarks);
    setExtraInfo(newExtraInfo);
  }, [appointments]);

  const handleDayClick = (info, dateFormate) => {
    onDateSelect(dateFormate);
  };

  return (
    <View className="calendar-view">
      <View className="calendar-header">
        <Text className="calendar-title">预约日历</Text>
        <View className="view-tabs">
          <View
            className={`view-tab ${viewMode === "month" ? "active" : ""}`}
            onClick={() => setViewMode("month")}
          >
            <Text className="view-tab-label">月视图</Text>
          </View>
          <View
            className={`view-tab ${viewMode === "week" ? "active" : ""}`}
            onClick={() => setViewMode("week")}
          >
            <Text className="view-tab-label">周视图</Text>
          </View>
        </View>
      </View>

      <Calendar
        ref={calendarRef}
        view={viewMode}
        marks={marks}
        extraInfo={extraInfo}
        selectedDateColor="#67b42e"
        onDayClick={handleDayClick}
        custDayRender={(props) => (
          <View
            className={`custom-day ${props.hasMarker ? "has-marker" : ""} ${
              props.notCurMonth ? "not-current-month" : ""
            }`}
          >
            <Text
              className={`day-text ${props.selected ? "selected" : ""} ${
                props.isToday ? "today" : ""
              }`}
            >
              {props.day}
            </Text>
            {props.extraInfo && (
              <Text
                className="extra-info"
                style={{ color: props.extraInfo.color }}
              >
                {props.extraInfo.text}
              </Text>
            )}
          </View>
        )}
      />

      <View className="legend">
        <View className="legend-item">
          <View className="legend-color has-appointment" />
          <Text className="legend-text">有预约</Text>
        </View>
        <View className="legend-item">
          <View className="legend-color available" />
          <Text className="legend-text">可预约</Text>
        </View>
      </View>
    </View>
  );
};

export default CalendarView;
