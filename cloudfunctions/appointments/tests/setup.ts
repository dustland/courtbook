// This file contains global setup for all tests

// Increase timeout for all tests
jest.setTimeout(10000);

// Mock the cloud SDK
jest.mock("wx-server-sdk", () => {
  const mockCollection = {
    doc: jest.fn().mockReturnThis(),
    add: jest.fn().mockResolvedValue({ _id: "mock-id" }),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    get: jest.fn().mockResolvedValue({ data: [] }),
    count: jest.fn().mockResolvedValue({ total: 0 }),
    field: jest.fn().mockReturnThis(),
  };

  const mockDB = {
    collection: jest.fn().mockReturnValue(mockCollection),
    command: {
      eq: jest.fn().mockImplementation((val) => ({ $eq: val })),
      neq: jest.fn().mockImplementation((val) => ({ $ne: val })),
      in: jest.fn().mockImplementation((val) => ({ $in: val })),
      nin: jest.fn().mockImplementation((val) => ({ $nin: val })),
      gt: jest.fn().mockImplementation((val) => ({ $gt: val })),
      gte: jest.fn().mockImplementation((val) => ({ $gte: val })),
      lt: jest.fn().mockImplementation((val) => ({ $lt: val })),
      lte: jest.fn().mockImplementation((val) => ({ $lte: val })),
      and: jest.fn().mockImplementation((val) => ({ $and: val })),
      or: jest.fn().mockImplementation((val) => ({ $or: val })),
    },
    serverDate: jest.fn().mockReturnValue(new Date()),
  };

  return {
    init: jest.fn(),
    DYNAMIC_CURRENT_ENV: "mock-env",
    database: jest.fn().mockReturnValue(mockDB),
  };
});
