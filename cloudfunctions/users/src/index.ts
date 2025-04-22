// Import the cloud function SDK
import cloud from "wx-server-sdk";
import { User } from "./types";

// Initialize the cloud environment
cloud.init({
  env: process.env.CLOUD_ENV || "cloud1",
});

// Get database reference
const db = cloud.database();
const usersCollection = db.collection("users");
const _ = db.command;

// Define database result types for better type safety
interface IQueryResult {
  data: any[];
  errMsg: string;
}

interface IAddResult {
  _id: string;
  errMsg: string;
}

interface IQuerySingleResult {
  data: any;
  errMsg: string;
}

/**
 * Main handler for the users cloud function
 *
 * @param event - Event data from the caller
 * @param context - Function context
 * @returns Response based on the action requested
 */
export async function main(event: any, context: any) {
  try {
    const { action, data } = event;

    switch (action) {
      case "upsertUser":
        return await upsertUser(data);
      case "getUser":
        return await getUser(data);
      case "updateUserProfile":
        return await updateUserProfile(data);
      default:
        return {
          code: 400,
          message: "Invalid action",
          data: null,
        };
    }
  } catch (error: any) {
    console.error("Error in users function:", error);
    return {
      code: 500,
      message: error.message || "Internal server error",
      data: null,
    };
  }
}

/**
 * Add or update a user in the database
 *
 * @param params User data
 * @returns Response with user data
 */
async function upsertUser(params: { openId?: string; userInfo?: any }) {
  try {
    // Get the user's OpenID if not provided
    const openId = params.openId || cloud.getWXContext().OPENID;

    if (!openId) {
      return {
        code: 401,
        message: "User not authenticated",
        data: null,
      };
    }

    // Check if the user already exists
    const userQuery = (await usersCollection
      .where({
        openId: openId,
      })
      .get()) as IQueryResult;

    const now = Date.now();
    let userData: User;

    if (userQuery.data.length === 0) {
      // Create new user
      userData = {
        openId,
        createTime: now,
        updateTime: now,
        lastLoginTime: now,
      };

      // Add user profile info if provided
      if (params.userInfo) {
        userData = {
          ...userData,
          nickName: params.userInfo.nickName,
          avatarUrl: params.userInfo.avatarUrl,
          gender: params.userInfo.gender,
          country: params.userInfo.country,
          province: params.userInfo.province,
          city: params.userInfo.city,
          language: params.userInfo.language,
        };
      }

      // Add the user to the database
      const result = (await usersCollection.add({
        data: userData,
      })) as IAddResult;

      userData._id = result._id;
    } else {
      // Update existing user
      const existingUser = userQuery.data[0] as User;

      userData = {
        ...existingUser,
        updateTime: now,
        lastLoginTime: now,
      };

      // Update user profile if provided
      if (params.userInfo) {
        userData = {
          ...userData,
          nickName: params.userInfo.nickName || existingUser.nickName,
          avatarUrl: params.userInfo.avatarUrl || existingUser.avatarUrl,
          gender:
            params.userInfo.gender !== undefined
              ? params.userInfo.gender
              : existingUser.gender,
          country: params.userInfo.country || existingUser.country,
          province: params.userInfo.province || existingUser.province,
          city: params.userInfo.city || existingUser.city,
          language: params.userInfo.language || existingUser.language,
        };
      }

      // Update the user in the database
      await usersCollection.doc(existingUser._id!).update({
        data: {
          ...userData,
          _id: undefined, // Remove _id from update data
        },
      });
    }

    return {
      code: 200,
      message: "User data saved successfully",
      data: userData,
    };
  } catch (error: any) {
    console.error("Error upserting user:", error);
    throw error;
  }
}

/**
 * Get user data by openId
 *
 * @param params Parameters with openId
 * @returns User data
 */
async function getUser(params: { openId?: string }) {
  try {
    // Get the user's OpenID if not provided
    const openId = params.openId || cloud.getWXContext().OPENID;

    if (!openId) {
      return {
        code: 401,
        message: "User not authenticated",
        data: null,
      };
    }

    // Get user data
    const userQuery = (await usersCollection
      .where({
        openId: openId,
      })
      .get()) as IQueryResult;

    if (userQuery.data.length === 0) {
      return {
        code: 404,
        message: "User not found",
        data: null,
      };
    }

    return {
      code: 200,
      message: "User data retrieved successfully",
      data: userQuery.data[0],
    };
  } catch (error: any) {
    console.error("Error getting user:", error);
    throw error;
  }
}

/**
 * Update user profile
 *
 * @param params User profile data
 * @returns Updated user data
 */
async function updateUserProfile(params: { openId?: string; userInfo: any }) {
  try {
    // Get the user's OpenID if not provided
    const openId = params.openId || cloud.getWXContext().OPENID;

    if (!openId) {
      return {
        code: 401,
        message: "User not authenticated",
        data: null,
      };
    }

    // Check if the user exists
    const userQuery = (await usersCollection
      .where({
        openId: openId,
      })
      .get()) as IQueryResult;

    if (userQuery.data.length === 0) {
      return {
        code: 404,
        message: "User not found",
        data: null,
      };
    }

    const existingUser = userQuery.data[0] as User;
    const now = Date.now();

    // Update user profile
    const updateData = {
      updateTime: now,
      ...params.userInfo,
    };

    await usersCollection.doc(existingUser._id!).update({
      data: updateData,
    });

    // Get updated user data
    const updatedUser = (await usersCollection
      .doc(existingUser._id!)
      .get()) as IQuerySingleResult;

    return {
      code: 200,
      message: "User profile updated successfully",
      data: updatedUser.data,
    };
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}
