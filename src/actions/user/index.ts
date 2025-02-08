"use server";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createUser, findUser, upgradePlan } from "./query";

type ApiResponse<T> = {
  status: number;
  data: T | string;
};

type Business = {
  name: string;
  id: string;
  image: string | null;
};

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

export const onBoardUser = async (): Promise<
  ApiResponse<Business[] | string>
> => {
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
        data: existingUser.businesses,
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
        data: newUser.businesses,
      };
    }
    return {
      status: 500,
      data: "Error: something went wrong while creating user",
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      data: "Error: something went wrong",
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
