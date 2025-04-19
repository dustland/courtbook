import { useState } from "react";
import { View, Text } from "@tarojs/components";
import { useLoad } from "@tarojs/taro";
import Icon from "../../components/icon";
import { mockAppointments } from "../../mock/data";
import AppointmentItem from "../../components/appointment-item";
import { Appointment } from "../../types";
import "./index.scss";

export default function Appointments() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(mockAppointments);
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  useLoad(() => {
    console.log("Appointments page loaded");
  });

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.filter((appointment) => appointment.id !== id)
    );
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

  return (
    <View className="appointments-page">
      <View className="header">
        <Text className="title">我的预约</Text>
        <View className="badge">{upcomingCount}</View>
      </View>

      <View className="filter-tabs">
        <View
          className={`filter-tab ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          <Text>全部</Text>
        </View>
        <View
          className={`filter-tab ${filter === "upcoming" ? "active" : ""}`}
          onClick={() => setFilter("upcoming")}
        >
          <Text>待进行</Text>
        </View>
        <View
          className={`filter-tab ${filter === "past" ? "active" : ""}`}
          onClick={() => setFilter("past")}
        >
          <Text>已完成</Text>
        </View>
      </View>

      <View className="appointments-list">
        {filteredAppointments.length === 0 ? (
          <View className="empty-state">
            <Icon value="calendar" size={40} className="empty-icon" />
            <Text className="empty-text">暂无预约</Text>
          </View>
        ) : (
          filteredAppointments.map((appointment) => (
            <AppointmentItem
              key={appointment.id}
              appointment={appointment}
              onCancel={handleCancelAppointment}
            />
          ))
        )}
      </View>
    </View>
  );
}
