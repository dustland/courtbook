import { useState, useEffect } from "react";
import { View, Text } from "@tarojs/components";
import { ActivityData } from "../types";
import "./activity-chart.scss";

interface ActivityChartProps {
  data: ActivityData[];
}

// Structure to represent rows of activity data
interface ActivityRow {
  months: string[];
  weeks: ActivityData[][];
}

const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  const [activityRows, setActivityRows] = useState<ActivityRow[]>([]);

  useEffect(() => {
    // Sort data by date
    const sortedData = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

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

    // Organize data into rows with approximately 4-5 weeks each
    const rows: ActivityRow[] = [];
    let currentRow: ActivityRow = { months: [], weeks: [] };
    let weekCount = 0;

    // Group by weeks first
    const allWeeks: ActivityData[][] = [];
    for (let i = 0; i < sortedData.length; i += 7) {
      const weekData = sortedData.slice(i, i + 7);
      if (weekData.length > 0) {
        allWeeks.push(weekData);
      }
    }

    // Now group weeks into rows (4-5 weeks per row)
    const weeksPerRow = 5;
    for (let weekIndex = 0; weekIndex < allWeeks.length; weekIndex++) {
      const week = allWeeks[weekIndex];

      // First week of first day of the week
      const firstDate = new Date(week[0].date);
      const monthIndex = firstDate.getMonth();

      // Add month label if it's the first day of a month or first week in a row
      if (firstDate.getDate() <= 7 || weekCount === 0) {
        currentRow.months.push(monthNames[monthIndex]);
      } else {
        currentRow.months.push("");
      }

      currentRow.weeks.push(week);
      weekCount++;

      // Start a new row after weeksPerRow weeks
      if (weekCount === weeksPerRow && weekIndex < allWeeks.length - 1) {
        rows.push(currentRow);
        currentRow = { months: [], weeks: [] };
        weekCount = 0;
      }
    }

    // Add the last row if it has any weeks
    if (currentRow.weeks.length > 0) {
      rows.push(currentRow);
    }

    setActivityRows(rows);
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

      {activityRows.map((row, rowIndex) => (
        <View key={rowIndex} className="activity-row">
          <View className="months-row">
            {row.months.map((month, index) => (
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
              {row.weeks.map((week, weekIndex) => (
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
        </View>
      ))}

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
