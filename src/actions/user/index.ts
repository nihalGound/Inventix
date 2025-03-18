"use server";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createUser, findUser, upgradePlan } from "./query";

export const onCurrentUser = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      redirect("/sign-in");
    }
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const userProfile = async () => {
  try {
    const user = await onCurrentUser();
    if (!user) {
      return { status: 401, data: "User not found" };
    }

    // Check if user exists in database
    const existingUser = await findUser(user?.id as string);
    if (existingUser) {
      return {
        status: 200,
        data: existingUser,
      };
    }
    return {
      status: 400,
      data: null,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      data: null,
    };
  }
};

export const onBoardUser = async () => {
  try {
    console.log("entered")
    const user = await onCurrentUser();
    if (!user) {
      return { status: 401 };
    }

    // Check if user exists in database
    const existingUser = await findUser(user?.id as string);
    if (existingUser) {
      return {
        status: 200,
        data: existingUser,
      };
    }

    // If user doesn't exist, create a new one
    const newUser = await createUser(
      user?.id as string,
      user?.emailAddresses[0].emailAddress as string
    );
    if (newUser) {
      return {
        status: 201,
        data: existingUser,
      };
    }
    return {
      status: 500,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
    };
  }
};

export const upgradeUser = async () => {
  try {
    const user = await onCurrentUser();
    if (!user) {
      return {
        status: 401,
        data: "Unauthorized user",
      };
    }
    const existingUser = await findUser(user.id);
    if (!existingUser) {
      return {
        status: 400,
        data: "User not foudn in db",
      };
    }
    if (existingUser?.premium)
      return {
        status: 200,
        data: "Already premium user",
      };
    const upgradedUser = await upgradePlan(existingUser?.clerkId as string);
    if (upgradedUser) {
      return {
        status: 200,
        data: "Upgraded to premium User",
      };
    }
    return {
      status: 400,
      data: "Something went wrong while upgrading user",
    };
  } catch (error) {
    console.log("Error in upgrading user : ", error);
    return {
      status: 500,
      data: "Something went wrong",
    };
  }
};
