declare module "wx-server-sdk" {
  const cloud: {
    init: (config: { env: string }) => void;
    DYNAMIC_CURRENT_ENV: string;
    database: () => Database;
  };

  interface Database {
    collection: (name: string) => Collection;
    command: any;
    serverDate: () => ServerDate;
    Geo: any;
    RegExp: any;
  }

  interface ServerDate {
    getTime: () => number;
  }

  interface Collection {
    doc: (id: string) => Document;
    add: (data: any) => Promise<{ _id: string }>;
    where: (query: any) => Query;
    orderBy: (field: string, order: string) => Collection;
    limit: (limit: number) => Collection;
    skip: (offset: number) => Collection;
    get: () => Promise<{ data: any[] }>;
    count: () => Promise<{ total: number }>;
    field: (projection: any) => Collection;
  }

  interface Document {
    get: () => Promise<{ data: any }>;
    update: (data: any) => Promise<any>;
    set: (data: any) => Promise<any>;
    remove: () => Promise<any>;
  }

  interface Query {
    get: () => Promise<{ data: any[] }>;
    count: () => Promise<{ total: number }>;
    update: (data: any) => Promise<any>;
    remove: () => Promise<any>;
    orderBy: (field: string, order: string) => Query;
    limit: (limit: number) => Query;
    skip: (offset: number) => Query;
    field: (projection: any) => Query;
  }

  export default cloud;
}

// Types for our appointment domain
export interface Court {
  _id?: string;
  name: string;
  location: string;
  slots?: TimeSlot[];
  workingHours?: {
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
  isActive: boolean;
}

export interface TimeSlot {
  id: string;
  courtId: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isBooked: boolean;
  price: number;
}

export interface Appointment {
  _id?: string;
  userId: string;
  courtId: string;
  slotId: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  status: "confirmed" | "pending" | "cancelled";
  createTime: Date;
  price: number;
  paymentStatus?: "paid" | "unpaid";
}
