import cloud from "wx-server-sdk";
import { Court } from "../types";

// Initialize cloud
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

/**
 * Creates test court data in the database
 */
export async function seedCourtData() {
  const courtsCollection = db.collection("courts");

  // Check if we already have data
  const existing = await courtsCollection.count();

  if (existing.total > 0) {
    console.log(`Courts already exist (${existing.total}), skipping seed`);
    return;
  }

  // Create sample courts
  const courts: Omit<Court, "_id">[] = [
    {
      name: "网球中心 - 场地 1",
      location: "北京市海淀区中关村南大街5号",
      workingHours: {
        start: "08:00",
        end: "22:00",
      },
      isActive: true,
    },
    {
      name: "网球中心 - 场地 2",
      location: "北京市海淀区中关村南大街5号",
      workingHours: {
        start: "08:00",
        end: "22:00",
      },
      isActive: true,
    },
    {
      name: "健身中心 - 羽毛球场 1",
      location: "北京市朝阳区建国路88号",
      workingHours: {
        start: "09:00",
        end: "21:00",
      },
      isActive: true,
    },
    {
      name: "健身中心 - 羽毛球场 2",
      location: "北京市朝阳区建国路88号",
      workingHours: {
        start: "09:00",
        end: "21:00",
      },
      isActive: true,
    },
    {
      name: "公园运动场 - 篮球场",
      location: "北京市西城区西直门外大街137号",
      workingHours: {
        start: "07:00",
        end: "19:00",
      },
      isActive: true,
    },
  ];

  // Insert all courts
  const courtPromises = courts.map((court) =>
    courtsCollection.add({ data: court })
  );
  await Promise.all(courtPromises);

  console.log(`Created ${courts.length} sample courts`);
  return courts.length;
}
