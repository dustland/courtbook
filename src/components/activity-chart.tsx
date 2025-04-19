import { useState, useEffect } from "react";
import { View, Text } from "@tarojs/components";
import { ActivityData } from "../types";
import "./activity-chart.scss";

interface ActivityChartProps {
  data: ActivityData[];
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  const [weeks, setWeeks] = useState<ActivityData[][]>([]);
  const [months, setMonths] = useState<string[]>([]);

  useEffect(() => {
    // Group activities by week
    const weekGroups: ActivityData[][] = [];
    const monthLabels: string[] = [];
    const monthNames = [
      "一月",
      "二月",
      "三月",
      "四月",
      "五月",
      "六月",
      "七月",
      "八月",
      "九月",
      "十月",
      "十一月",
      "十二月",
    ];

    // Sort data by date
    const sortedData = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Group by weeks
    for (let i = 0; i < sortedData.length; i += 7) {
      const weekData = sortedData.slice(i, i + 7);
      if (weekData.length > 0) {
        weekGroups.push(weekData);

        // Add month label for first day of month
        const date = new Date(weekData[0].date);
        if (date.getDate() <= 7 || i === 0) {
          monthLabels.push(monthNames[date.getMonth()]);
        } else {
          monthLabels.push("");
        }
      }
    }

    setWeeks(weekGroups);
    setMonths(monthLabels);
  }, [data]);

  const getColorClass = (count: number) => {
    if (count === 0) return "level-0";
    if (count === 1) return "level-1";
    if (count === 2) return "level-2";
    if (count === 3) return "level-3";
    return "level-4";
  };

  return (
    <View className="activity-chart">
      <Text className="chart-title">活动频率</Text>

      <View className="months-row">
        {months.map((month, index) => (
          <Text key={index} className="month-label">
            {month}
          </Text>
        ))}
      </View>

      <View className="chart-grid">
        <View className="day-labels">
          <Text className="day-label">周一</Text>
          <Text className="day-label">周三</Text>
          <Text className="day-label">周五</Text>
          <Text className="day-label">周日</Text>
        </View>

        <View className="weeks-container">
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} className="week-column">
              {week.map((day, dayIndex) => (
                <View
                  key={`${weekIndex}-${dayIndex}`}
                  className={`day-cell ${getColorClass(day.count)}`}
                >
                  <View className="tooltip">
                    <Text>{day.date}</Text>
                    <Text>{day.count} 活动</Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>

      <View className="legend">
        <Text className="legend-text">活动强度:</Text>
        <View className="legend-items">
          <View className="legend-item">
            <View className="color-box level-0"></View>
            <Text>无</Text>
          </View>
          <View className="legend-item">
            <View className="color-box level-1"></View>
            <Text>低</Text>
          </View>
          <View className="legend-item">
            <View className="color-box level-2"></View>
            <Text>中</Text>
          </View>
          <View className="legend-item">
            <View className="color-box level-3"></View>
            <Text>高</Text>
          </View>
          <View className="legend-item">
            <View className="color-box level-4"></View>
            <Text>极高</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ActivityChart;
