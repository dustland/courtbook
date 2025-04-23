import { useState, useEffect } from "react";
import { View, Text, Button, Swiper, SwiperItem } from "@tarojs/components";
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
  const [swiperPosition, setSwiperPosition] = useState(0);
  const [resetTimeout, setResetTimeout] = useState<NodeJS.Timeout | null>(null);

  // Clear timeout on component unmount
  useEffect(() => {
    return () => {
      if (resetTimeout) {
        clearTimeout(resetTimeout);
      }
    };
  }, [resetTimeout]);

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
    setSwiperPosition(0);
  };

  const handleCancelAction = () => {
    setShowConfirm(false);
    setSwiperPosition(0);
  };

  const handleSwipe = (e) => {
    const currentPos = e.detail.current;
    setSwiperPosition(currentPos);

    // Clear any existing timeout
    if (resetTimeout) {
      clearTimeout(resetTimeout);
      setResetTimeout(null);
    }

    // If swiped to delete position (position 1)
    if (currentPos === 1) {
      // If not past appointment and not already in confirm mode
      if (!appointment.isPast && !showConfirm) {
        setShowConfirm(true);
      }

      // Set timeout to automatically return to main view after 3 seconds
      const timeout = setTimeout(() => {
        setSwiperPosition(0);
        setShowConfirm(false);
      }, 3000);

      setResetTimeout(timeout);
    }
  };

  return (
    <Swiper
      className="appointment-swiper"
      onChange={handleSwipe}
      current={swiperPosition}
      circular={false}
      duration={300}
    >
      {/* Main content */}
      <SwiperItem>
        <View
          className={`appointment-item ${appointment.isPast ? "past" : ""}`}
        >
          <View className="appointment-header">
            <View className="appointment-status">
              {appointment.isPast ? (
                <Text className="past-indicator">已完成</Text>
              ) : (
                <Text className="upcoming-indicator">待进行</Text>
              )}
            </View>
            {!appointment.isPast && (
              <Text className="swipe-hint">← 左滑取消预约</Text>
            )}
          </View>

          <View className="appointment-info">
            <Text className="appointment-court">{appointment.court}</Text>
            <View className="appointment-time-info">
              <Text className="appointment-date">
                {formatDate(appointment.date)}
              </Text>
              <Text className="appointment-time">
                {appointment.startTime} - {appointment.endTime}
              </Text>
            </View>
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
      </SwiperItem>

      {/* Delete option (visible when swiped) */}
      <SwiperItem>
        <View
          className="delete-action"
          onClick={!appointment.isPast ? handleConfirmCancel : undefined}
        >
          <Text>删除</Text>
        </View>
      </SwiperItem>
    </Swiper>
  );
};

export default AppointmentItem;
