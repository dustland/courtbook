import { View, Text } from "@tarojs/components";
import React, { useState, useEffect } from "react";
import "./activity-chart.scss";

interface Activity {
  date: string;
  count: number;
}

interface DayActivity {
  date: string;
  count: number;
  level: number;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
}

interface WeekData {
  days: (DayActivity | null)[];
}

interface MonthData {
  name: string;
  weeks: WeekData[];
  year: number;
  month: number; // 0-11
}

const ActivityChart: React.FC = () => {
  const [months, setMonths] = useState<MonthData[]>([]);
  const dayLabels = ["日", "一", "二", "三", "四", "五", "六"];

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockActivities: Activity[] = [
      { date: "2023-01-15", count: 5 },
      { date: "2023-01-16", count: 3 },
      { date: "2023-01-18", count: 8 },
      { date: "2023-01-22", count: 2 },
      { date: "2023-01-25", count: 7 },
      { date: "2023-02-01", count: 3 },
      { date: "2023-02-03", count: 15 },
      { date: "2023-02-08", count: 20 },
      { date: "2023-02-10", count: 2 },
      { date: "2023-02-15", count: 4 },
      { date: "2023-02-22", count: 6 },
      { date: "2023-03-05", count: 11 },
      { date: "2023-03-10", count: 14 },
      { date: "2023-03-15", count: 8 },
      { date: "2023-03-22", count: 18 },
      { date: "2023-04-01", count: 9 },
      { date: "2023-04-05", count: 12 },
      { date: "2023-04-12", count: 7 },
      { date: "2023-04-20", count: 15 },
      { date: "2023-05-02", count: 6 },
      { date: "2023-05-09", count: 9 },
      { date: "2023-05-15", count: 4 },
      { date: "2023-05-25", count: 11 },
      { date: "2023-06-03", count: 14 },
      { date: "2023-06-10", count: 8 },
      { date: "2023-06-18", count: 5 },
      { date: "2023-06-25", count: 9 },
      { date: "2023-07-02", count: 7 },
      { date: "2023-07-10", count: 12 },
      { date: "2023-07-22", count: 18 },
      { date: "2023-07-29", count: 6 },
      { date: "2023-08-05", count: 9 },
      { date: "2023-08-15", count: 13 },
      { date: "2023-08-22", count: 4 },
      { date: "2023-09-03", count: 7 },
      { date: "2023-09-10", count: 14 },
      { date: "2023-09-22", count: 9 },
      { date: "2023-10-04", count: 5 },
      { date: "2023-10-12", count: 8 },
      { date: "2023-10-22", count: 11 },
      { date: "2023-10-29", count: 6 },
      { date: "2023-11-05", count: 9 },
      { date: "2023-11-12", count: 14 },
      { date: "2023-11-20", count: 7 },
      { date: "2023-11-28", count: 5 },
      { date: "2023-12-03", count: 12 },
      { date: "2023-12-10", count: 7 },
      { date: "2023-12-18", count: 9 },
      { date: "2023-12-25", count: 4 },
    ];

    generateActivityGrid(mockActivities);
  }, []);

  const generateActivityGrid = (activities: Activity[]) => {
    const monthsData: MonthData[] = [];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Get current year
    const year = new Date().getFullYear();

    // Create data structure for all months with weeks
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      const firstDay = new Date(year, monthIndex, 1);
      const lastDay = new Date(year, monthIndex + 1, 0);
      const daysInMonth = lastDay.getDate();

      // Calculate first day of week offset (Sunday = 0, Saturday = 6)
      const firstDayOfWeek = firstDay.getDay();

      // Create weeks array
      const weeks: WeekData[] = [];
      let currentWeek: (DayActivity | null)[] = Array(7).fill(null);

      // Add empty days before the first day of month
      for (let i = 0; i < firstDayOfWeek; i++) {
        currentWeek[i] = null;
      }

      // Add all days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, monthIndex, day);
        const dayOfWeek = date.getDay();
        const dateStr = `${year}-${String(monthIndex + 1).padStart(
          2,
          "0"
        )}-${String(day).padStart(2, "0")}`;

        // Create day activity object
        const dayActivity: DayActivity = {
          date: dateStr,
          count: 0,
          level: 0,
          dayOfWeek,
        };

        // If we need to start a new week
        if (dayOfWeek === 0 && day > 1) {
          weeks.push({ days: [...currentWeek] });
          currentWeek = Array(7).fill(null);
        }

        // Add day to current week
        currentWeek[dayOfWeek] = dayActivity;

        // If it's the last day of the month, add the final week
        if (day === daysInMonth) {
          // Fill remaining days with null
          for (let i = dayOfWeek + 1; i < 7; i++) {
            currentWeek[i] = null;
          }
          weeks.push({ days: [...currentWeek] });
        }
      }

      monthsData.push({
        name: monthNames[monthIndex],
        weeks,
        year,
        month: monthIndex,
      });
    }

    // Fill in activity data
    activities.forEach((activity) => {
      const date = new Date(activity.date);
      const monthIndex = date.getMonth();
      const day = date.getDate();
      const dayOfWeek = date.getDay();

      // Find the correct month
      const monthData = monthsData[monthIndex];
      if (monthData) {
        // Find the correct week and day
        for (const week of monthData.weeks) {
          const dayActivity = week.days.find(
            (d) => d !== null && d.date === activity.date
          );

          if (dayActivity) {
            dayActivity.count = activity.count;

            // Set activity level
            let level = 0;
            if (activity.count > 0) {
              if (activity.count <= 5) level = 1;
              else if (activity.count <= 10) level = 2;
              else if (activity.count <= 15) level = 3;
              else level = 4;
            }

            dayActivity.level = level;
            break;
          }
        }
      }
    });

    setMonths(monthsData);
  };

  // Group months into rows (3 months per row)
  const getMonthRows = (): MonthData[][] => {
    const rows: MonthData[][] = [];
    for (let i = 0; i < months.length; i += 3) {
      rows.push(months.slice(i, Math.min(i + 3, months.length)));
    }
    return rows;
  };

  const monthRows = getMonthRows();

  return (
    <View className="activity-chart">
      <View className="contribution-grid">
        {monthRows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} className="month-row">
            {row.map((month, monthIndex) => (
              <View
                key={`month-${rowIndex}-${monthIndex}`}
                className="month-container"
              >
                <Text className="month-name">{month.name}</Text>

                <View className="days-header">
                  {dayLabels.map((label, i) => (
                    <Text key={`label-${i}`} className="day-label">
                      {i % 2 === 0 ? label : ""}
                    </Text>
                  ))}
                </View>

                {month.weeks.map((week, weekIndex) => (
                  <View key={`week-${weekIndex}`} className="days-grid">
                    {week.days.map((day, dayIndex) =>
                      day !== null ? (
                        <View
                          key={`day-${dayIndex}`}
                          className={`day-cell level-${day.level}`}
                        >
                          {day.count > 0 && (
                            <View className="tooltip">
                              <Text className="tooltip-text">
                                {day.count} activities on {day.date}
                              </Text>
                            </View>
                          )}
                        </View>
                      ) : (
                        <View
                          key={`empty-${dayIndex}`}
                          className="day-cell empty"
                        />
                      )
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        ))}
      </View>

      <View className="legend">
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
        </View>
      </View>
    </View>
  );
};

export default ActivityChart;
