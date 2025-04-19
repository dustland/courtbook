import { useState } from "react";
import { View, Text, Button } from "@tarojs/components";
import { Appointment } from "../types";
import "./appointment-item.scss";

interface AppointmentItemProps {
  appointment: Appointment;
  onCancel: (id: string) => void;
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({
  appointment,
  onCancel,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const handleCancelClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmCancel = () => {
    onCancel(appointment.id);
    setShowConfirm(false);
  };

  const handleCancelAction = () => {
    setShowConfirm(false);
  };

  return (
    <View className={`appointment-item ${appointment.isPast ? "past" : ""}`}>
      <View className="appointment-status">
        {appointment.isPast ? (
          <Text className="past-indicator">已完成</Text>
        ) : (
          <Text className="upcoming-indicator">待进行</Text>
        )}
      </View>

      <View className="appointment-info">
        <Text className="appointment-court">{appointment.court}</Text>
        <Text className="appointment-date">{formatDate(appointment.date)}</Text>
        <Text className="appointment-time">
          {appointment.startTime} - {appointment.endTime}
        </Text>
      </View>

      {!appointment.isPast && !showConfirm && (
        <Button className="cancel-button" onClick={handleCancelClick}>
          取消预约
        </Button>
      )}

      {showConfirm && (
        <View className="confirm-actions">
          <Button className="confirm-yes" onClick={handleConfirmCancel}>
            确认
          </Button>
          <Button className="confirm-no" onClick={handleCancelAction}>
            取消
          </Button>
        </View>
      )}
    </View>
  );
};

export default AppointmentItem;
