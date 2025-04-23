import { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Swiper,
  SwiperItem,
  ScrollView,
} from "@tarojs/components";
import { useLoad, navigateBack, showToast } from "@tarojs/taro";
import Taro from "@tarojs/taro";
import Icon from "../../components/icon";
import { mockAppointments, mockWeeklySchedule } from "../../mock/data";
import AppointmentItem from "../../components/appointment-item";
import CalendarView from "../../components/calendar-view";
import { Appointment, TimeSlot } from "../../types";
import "./index.scss";

export default function Appointments() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(mockAppointments);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [showBookingConfirm, setShowBookingConfirm] = useState(false);
  const [selectedCourtType, setSelectedCourtType] =
    useState<string>("羽毛球场");
  const [isLoading, setIsLoading] = useState(false);

  // Available court types
  const courtTypes = ["羽毛球场", "网球场", "篮球场", "乒乓球场"];

  useLoad(() => {
    console.log("Appointments page loaded");
    // Set default date to today
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  });

  // Method to refresh appointments data
  const refreshAppointments = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch from API
      // For now, we'll use mock data
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to refresh appointments:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAppointments();
  }, []);

  const handleCancelAppointment = async (id: string) => {
    setIsLoading(true);
    try {
      // In a real app, call API to cancel
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 500));

      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== id)
      );

      showToast({
        title: "预约已取消",
        icon: "success",
        duration: 2000,
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      setIsLoading(false);
      showToast({
        title: "取消失败，请重试",
        icon: "error",
        duration: 2000,
      });
    }
  };

  const handleBack = () => {
    navigateBack();
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    // Clear selected time slot when date changes
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (!slot.isBooked) {
      setSelectedTimeSlot(slot);
      // Show booking confirmation
      setShowBookingConfirm(true);
    }
  };

  const handleBookingConfirm = async () => {
    if (!selectedDate || !selectedTimeSlot) return;

    setIsLoading(true);
    try {
      // In a real app, call API to book
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create a new appointment
      const newAppointment: Appointment = {
        id: `new-${Date.now()}`,
        date: selectedDate,
        startTime: selectedTimeSlot.startTime,
        endTime: selectedTimeSlot.endTime,
        court: `${selectedCourtType}`,
        isPast: false,
      };

      // Add to appointments list
      setAppointments((prev) => [...prev, newAppointment]);

      // Reset states
      setShowBookingConfirm(false);
      setSelectedTimeSlot(null);

      showToast({
        title: "预约成功",
        icon: "success",
        duration: 2000,
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to book appointment:", error);
      setIsLoading(false);
      showToast({
        title: "预约失败，请重试",
        icon: "error",
        duration: 2000,
      });
    }
  };

  const handleBookingCancel = () => {
    setShowBookingConfirm(false);
    setSelectedTimeSlot(null);
  };

  const filteredAppointments = (() => {
    if (filter === "upcoming") {
      return appointments.filter((appointment) => !appointment.isPast);
    } else if (filter === "past") {
      return appointments.filter((appointment) => appointment.isPast);
    }
    return appointments;
  })();

  const upcomingCount = appointments.filter(
    (appointment) => !appointment.isPast
  ).length;

  // Find available time slots for the selected date
  const availableSlots = selectedDate
    ? mockWeeklySchedule.days
        .find((day) => day.date === selectedDate)
        ?.slots.filter((slot) => !slot.isBooked) || []
    : [];

  return (
    <View className="appointments-page">
      {isLoading && (
        <View className="loading-overlay">
          <View className="loading-spinner"></View>
        </View>
      )}

      {/* Calendar View */}
      <CalendarView
        appointments={appointments}
        onDateSelect={handleDateSelect}
      />

      {/* Available Time Slots */}
      {selectedDate && (
        <View className="time-slots-section">
          <View className="section-header">
            <Text className="section-title">
              {new Date(selectedDate).toLocaleDateString("zh-CN", {
                month: "long",
                day: "numeric",
              })}
              可用时段
            </Text>
          </View>

          {availableSlots.length > 0 ? (
            <ScrollView scrollX className="time-slots-scroll">
              {availableSlots.map((slot) => (
                <View
                  key={slot.id}
                  className={`time-slot-item ${
                    selectedTimeSlot?.id === slot.id ? "selected" : ""
                  }`}
                  onClick={() => handleTimeSlotSelect(slot)}
                >
                  <Text className="time">
                    {slot.startTime} - {slot.endTime}
                  </Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View className="empty-slots">
              <Text>当日无可用时段</Text>
            </View>
          )}
        </View>
      )}

      {/* My Appointments Section */}
      <View className="my-appointments-section">
        <View className="section-header">
          <Text className="section-title">我的预约</Text>
          <View className="filter-tabs">
            <View
              className={`filter-tab ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              全部
            </View>
            <View
              className={`filter-tab ${filter === "upcoming" ? "active" : ""}`}
              onClick={() => setFilter("upcoming")}
            >
              待进行
              {upcomingCount > 0 && (
                <Text className="count-badge">{upcomingCount}</Text>
              )}
            </View>
            <View
              className={`filter-tab ${filter === "past" ? "active" : ""}`}
              onClick={() => setFilter("past")}
            >
              已完成
            </View>
          </View>
        </View>

        <View className="appointments-list">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <AppointmentItem
                key={appointment.id}
                appointment={appointment}
                onCancel={handleCancelAppointment}
              />
            ))
          ) : (
            <View className="empty-appointments">
              <Text>暂无预约记录</Text>
            </View>
          )}
        </View>
      </View>

      {/* Booking Confirmation */}
      {showBookingConfirm && selectedTimeSlot && (
        <View className="booking-confirm-overlay">
          <View className="booking-confirm-dialog">
            <View className="booking-confirm-header">
              <Text className="booking-confirm-title">确认预约</Text>
            </View>
            <View className="booking-confirm-content">
              <View className="booking-detail">
                <Text className="booking-label">日期:</Text>
                <Text className="booking-value">
                  {new Date(selectedDate || "").toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>
              <View className="booking-detail">
                <Text className="booking-label">时间:</Text>
                <Text className="booking-value">
                  {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}
                </Text>
              </View>
              <View className="booking-detail">
                <Text className="booking-label">场地:</Text>
                <Text className="booking-value">{selectedCourtType}</Text>
              </View>
            </View>
            <View className="booking-confirm-actions">
              <Button className="cancel-button" onClick={handleBookingCancel}>
                取消
              </Button>
              <Button className="confirm-button" onClick={handleBookingConfirm}>
                确认
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
