# Appointments Cloud Function

This cloud function handles all appointment-related operations for the CourtBook mini program.

## Features

- Creating, retrieving, and canceling court appointments
- Checking available time slots
- Seeding test data for development

## Testing the Cloud Function

There are several ways to test your cloud functions:

### 1. Using SCF CLI (Recommended)

Tencent Cloud Serverless Cloud Function (SCF) CLI provides a convenient way to test functions locally and deploy them.

1. **Setup:**

   - Install dependencies:
     ```
     pnpm install
     ```
   - Build the function:
     ```
     pnpm build
     ```
   - Configure credentials in `.env` file:
     ```
     TENCENT_SECRET_ID=your_secret_id_here
     TENCENT_SECRET_KEY=your_secret_key_here
     ENV_ID=your_cloud_env_id_here
     ```

2. **Running Tests:**
   We've set up convenient test scripts in package.json:

   ```bash
   # Test seeding data
   pnpm test:seed

   # Test querying available slots
   pnpm test:slots

   # Test creating an appointment
   pnpm test:create
   ```

   Or you can invoke with custom data:

   ```bash
   pnpm invoke -- '{"action":"getUserAppointments","data":{"userId":"test-user-123"}}'
   ```

3. **Deployment:**
   ```bash
   pnpm deploy
   ```

### 2. Testing in the Cloud Console

You can test the function in the Tencent CloudBase console using the following test events:

#### Seeding Test Data

```json
{
  "action": "seedData"
}
```

#### Querying Available Slots

```json
{
  "action": "queryAvailableSlots",
  "data": {
    "startDate": "2023-08-01",
    "endDate": "2023-08-01"
  }
}
```

#### Creating an Appointment

```json
{
  "action": "createAppointment",
  "data": {
    "userId": "user-123",
    "courtId": "court-1",
    "date": "2023-08-01",
    "startTime": "14:00",
    "endTime": "15:00"
  }
}
```

#### Getting User Appointments

```json
{
  "action": "getUserAppointments",
  "data": {
    "userId": "user-123"
  }
}
```

#### Canceling an Appointment

```json
{
  "action": "cancelAppointment",
  "data": {
    "appointmentId": "appointment-123",
    "userId": "user-123"
  }
}
```

### 3. Testing in the Mini Program

To test within the mini program itself:

1. Call the cloud function from your mini program code:

   ```typescript
   try {
     const result = await wx.cloud.callFunction({
       name: "appointments",
       data: {
         action: "queryAvailableSlots",
         data: {
           startDate: "2023-08-01",
           endDate: "2023-08-01",
         },
       },
     });
     console.log(result);
   } catch (error) {
     console.error(error);
   }
   ```

2. Check the response using the console in the WeChat Developer Tools

## Database Schema

### Courts Collection

```
{
  _id: string,
  name: string,
  location: string,
  workingHours: {
    start: string, // HH:MM format
    end: string    // HH:MM format
  },
  isActive: boolean
}
```

### Appointments Collection

```
{
  _id: string,
  userId: string,
  courtId: string,
  slotId: string,
  date: string,     // YYYY-MM-DD format
  startTime: string, // HH:MM format
  endTime: string,   // HH:MM format
  status: string,    // "confirmed", "pending", "cancelled"
  createTime: Date,
  price: number,
  paymentStatus: string // "paid", "unpaid"
}
```

## Usage

### Query Available Slots

Retrieves available time slots based on a date range.

```javascript
wx.cloud
  .callFunction({
    name: "appointments",
    data: {
      action: "queryAvailableSlots",
      data: {
        startDate: "2023-08-01", // YYYY-MM-DD format
        endDate: "2023-08-07", // YYYY-MM-DD format
        courtId: "court-id-123", // Optional: specific court ID
      },
    },
  })
  .then((res) => {
    console.log("Available slots:", res.result);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
```

### Create Appointment

Books a specific time slot.

```javascript
wx.cloud
  .callFunction({
    name: "appointments",
    data: {
      action: "createAppointment",
      data: {
        userId: "user-id-123", // Current user's ID
        courtId: "court-id-123", // Court ID
        date: "2023-08-03", // YYYY-MM-DD format
        startTime: "14:00", // HH:MM format
        endTime: "15:00", // HH:MM format
      },
    },
  })
  .then((res) => {
    console.log("Appointment created:", res.result);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
```

### Get User Appointments

Retrieves all appointments for a user.

```javascript
wx.cloud
  .callFunction({
    name: "appointments",
    data: {
      action: "getUserAppointments",
      data: {
        userId: "user-id-123", // User ID
        status: "confirmed", // Optional: filter by status
      },
    },
  })
  .then((res) => {
    console.log("User appointments:", res.result);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
```

### Cancel Appointment

Cancels an existing appointment.

```javascript
wx.cloud
  .callFunction({
    name: "appointments",
    data: {
      action: "cancelAppointment",
      data: {
        appointmentId: "appointment-id-123", // Appointment ID
        userId: "user-id-123", // User ID
      },
    },
  })
  .then((res) => {
    console.log("Appointment cancelled:", res.result);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
```

## Response Format

All functions return a standard response format:

```javascript
{
  code: 200,            // HTTP-like status code
  message: 'Success',   // Human-readable message
  data: { ... }         // Response data, varies by function
}
```

## Database Collections

This function interacts with the following collections:

- `appointments`: Stores appointment information
- `courts`: Stores court information

## Deployment

To deploy this function to your WeChat cloud environment:

1. Navigate to the cloud function directory:

   ```bash
   cd cloudfunctions/appointments
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the TypeScript code:

   ```bash
   npm run build
   ```

4. Upload in WeChat Developer Tools:
   - Right-click the `appointments` folder in the cloud function panel
   - Select "Upload and Deploy: All Files"
