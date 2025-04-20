// Import the cloud function SDK
import cloud from "wx-server-sdk";
import { Appointment, Court, TimeSlot } from "./types";
import { seedCourtData } from "./utils/seed-data";

// Initialize the cloud environment
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

// Get database reference
const db = cloud.database();
const appointmentsCollection = db.collection("appointments");
const courtsCollection = db.collection("courts");
const _ = db.command;

/**
 * Main handler for the appointments cloud function
 *
 * @param event - Event data from the caller
 * @param context - Function context
 * @returns Response based on the action requested
 */
export async function main(event: any, context: any) {
  try {
    const { action, data } = event;

    switch (action) {
      case "queryAvailableSlots":
        return await queryAvailableSlots(data);
      case "createAppointment":
        return await createAppointment(data);
      case "getUserAppointments":
        return await getUserAppointments(data);
      case "cancelAppointment":
        return await cancelAppointment(data);
      case "seedData":
        return await initializeSeedData();
      default:
        return {
          code: 400,
          message: "Invalid action",
          data: null,
        };
    }
  } catch (error: any) {
    console.error("Error in appointments function:", error);
    return {
      code: 500,
      message: error.message || "Internal server error",
      data: null,
    };
  }
}

/**
 * Initialize database with seed data for testing
 */
async function initializeSeedData() {
  try {
    const courtsCreated = await seedCourtData();

    return {
      code: 200,
      message: "Seed data initialized successfully",
      data: {
        courtsCreated,
      },
    };
  } catch (error: any) {
    console.error("Error initializing seed data:", error);
    throw error;
  }
}

/**
 * Query available time slots based on date range and optional court
 *
 * @param params Parameters for querying available slots
 * @returns Available time slots
 */
async function queryAvailableSlots(params: {
  startDate: string;
  endDate: string;
  courtId?: string;
}) {
  const { startDate, endDate, courtId } = params;

  try {
    // First, get all courts (or the specified court)
    let courtsQuery = courtsCollection.where({
      isActive: true,
    });

    if (courtId) {
      courtsQuery = courtsCollection.where({
        _id: courtId,
        isActive: true,
      });
    }

    const courtsResult = await courtsQuery.get();
    const courts = courtsResult.data as Court[];

    if (courts.length === 0) {
      return {
        code: 404,
        message: "No active courts found",
        data: null,
      };
    }

    // Get all court IDs
    const courtIds = courts.map((court) => court._id);

    // Find all booked slots for these courts in the date range
    const bookedSlotsResult = await appointmentsCollection
      .where({
        courtId: _.in(courtIds),
        date: _.gte(startDate).and(_.lte(endDate)),
        status: _.neq("cancelled"),
      })
      .get();

    const bookedSlots = bookedSlotsResult.data as Appointment[];

    // Create a map of booked slots for quick lookup
    const bookedSlotsMap: Record<string, boolean> = {};

    bookedSlots.forEach((slot) => {
      // Create a unique key for each slot
      const slotKey = `${slot.courtId}_${slot.date}_${slot.startTime}_${slot.endTime}`;
      bookedSlotsMap[slotKey] = true;
    });

    // Get all available time slots for the courts
    const availableSlots: TimeSlot[] = [];

    // Generate available slots based on courts' working hours
    // Here we use a simple algorithm to generate slots every hour
    for (const court of courts) {
      const workingHours = court.workingHours || {
        start: "08:00",
        end: "20:00",
      };

      // Generate slots for each day in the date range
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      for (
        let date = new Date(startDateObj);
        date <= endDateObj;
        date.setDate(date.getDate() + 1)
      ) {
        const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD format

        // Generate slots for the working hours
        const startHour = parseInt(workingHours.start.split(":")[0]);
        const endHour = parseInt(workingHours.end.split(":")[0]);

        for (let hour = startHour; hour < endHour; hour++) {
          const startTime = `${hour.toString().padStart(2, "0")}:00`;
          const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;

          // Create a unique key for this slot
          const slotKey = `${court._id}_${dateStr}_${startTime}_${endTime}`;

          // If the slot is not booked, add it to available slots
          if (!bookedSlotsMap[slotKey]) {
            availableSlots.push({
              id: slotKey,
              courtId: court._id!,
              date: dateStr,
              startTime,
              endTime,
              isBooked: false,
              price: 100, // Default price, can be customized per court
            });
          }
        }
      }
    }

    return {
      code: 200,
      message: "Available slots retrieved successfully",
      data: {
        courts,
        availableSlots,
      },
    };
  } catch (error: any) {
    console.error("Error querying available slots:", error);
    throw error;
  }
}

/**
 * Create a new appointment
 *
 * @param params Parameters for creating an appointment
 * @returns The created appointment
 */
async function createAppointment(params: {
  userId: string;
  courtId: string;
  date: string;
  startTime: string;
  endTime: string;
}) {
  const { userId, courtId, date, startTime, endTime } = params;

  try {
    // Verify that the court exists
    const courtResult = await courtsCollection.doc(courtId).get();
    const court = courtResult.data as Court;

    if (!court) {
      return {
        code: 404,
        message: "Court not found",
        data: null,
      };
    }

    // Verify that the slot is available
    const slotKey = `${courtId}_${date}_${startTime}_${endTime}`;

    const conflictingAppointments = await appointmentsCollection
      .where({
        courtId,
        date,
        startTime,
        endTime,
        status: _.neq("cancelled"),
      })
      .get();

    if (conflictingAppointments.data.length > 0) {
      return {
        code: 409,
        message: "This time slot is already booked",
        data: null,
      };
    }

    // Create the appointment
    const appointment: Omit<Appointment, "_id"> = {
      userId,
      courtId,
      slotId: slotKey,
      date,
      startTime,
      endTime,
      status: "confirmed", // Default to confirmed, can be changed to pending if needed
      createTime: new Date(),
      price: 100, // Default price, can be customized per court
      paymentStatus: "unpaid",
    };

    const result = await appointmentsCollection.add({
      data: appointment,
    });

    return {
      code: 201,
      message: "Appointment created successfully",
      data: {
        appointmentId: result._id,
        ...appointment,
      },
    };
  } catch (error: any) {
    console.error("Error creating appointment:", error);
    throw error;
  }
}

/**
 * Get all appointments for a user
 *
 * @param params Parameters for querying user appointments
 * @returns User's appointments
 */
async function getUserAppointments(params: {
  userId: string;
  status?: "confirmed" | "pending" | "cancelled";
}) {
  const { userId, status } = params;

  try {
    let query: any = {
      userId,
    };

    if (status) {
      query.status = status;
    }

    const result = await appointmentsCollection
      .where(query)
      .orderBy("date", "desc")
      .orderBy("startTime", "asc")
      .get();

    const appointments = result.data as Appointment[];

    // Get court details for each appointment
    const courtIds = [...new Set(appointments.map((app) => app.courtId))];

    const courtsResult = await courtsCollection
      .where({
        _id: _.in(courtIds),
      })
      .get();

    const courts = courtsResult.data as Court[];

    // Create a court map for quick lookup
    const courtMap: Record<string, Court> = {};
    courts.forEach((court: Court) => {
      courtMap[court._id!] = court;
    });

    // Enrich appointments with court data
    const enrichedAppointments = appointments.map((app: Appointment) => ({
      ...app,
      court: courtMap[app.courtId],
    }));

    return {
      code: 200,
      message: "User appointments retrieved successfully",
      data: enrichedAppointments,
    };
  } catch (error: any) {
    console.error("Error getting user appointments:", error);
    throw error;
  }
}

/**
 * Cancel an appointment
 *
 * @param params Parameters for cancelling an appointment
 * @returns Result of the cancellation
 */
async function cancelAppointment(params: {
  appointmentId: string;
  userId: string;
}) {
  const { appointmentId, userId } = params;

  try {
    // Verify that the appointment exists and belongs to the user
    const appointmentResult = await appointmentsCollection
      .doc(appointmentId)
      .get();
    const appointment = appointmentResult.data as Appointment;

    if (!appointment) {
      return {
        code: 404,
        message: "Appointment not found",
        data: null,
      };
    }

    if (appointment.userId !== userId) {
      return {
        code: 403,
        message: "You don't have permission to cancel this appointment",
        data: null,
      };
    }

    // Cancel the appointment
    await appointmentsCollection.doc(appointmentId).update({
      data: {
        status: "cancelled",
      },
    });

    return {
      code: 200,
      message: "Appointment cancelled successfully",
      data: {
        appointmentId,
      },
    };
  } catch (error: any) {
    console.error("Error cancelling appointment:", error);
    throw error;
  }
}
