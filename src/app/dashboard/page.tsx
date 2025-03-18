"use client";
import { useOnBoardUser } from "@/utils/queries";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

function Layout() {
  const { mutate, data, isPending, isError } = useOnBoardUser();

  useEffect(() => {
    // Trigger the mutation to onboard the user
    mutate();
  }, [mutate]);

  // Handle loading state
  if (isPending) {
    return <>Loading ....</>;
  }

  // Handle error state
  if (isError || !data) {
    return <div>Something went wrong !!!</div>;
  }

  // TypeScript type for the expected data structure
  const parsedData = data as {
    status: number;
    data: {
      business: {
        name: string;
        id: string;
        image: string | null;
      }[];
    } & {
      id: string;
      clerkId: string;
      email: string;
      premium: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  };

  const { status, data: user } = parsedData;

  // Handle unauthorized users
  if (status === 401) {
    redirect("/sign-in");
    return null; // Prevent further rendering after redirect
  }

  // Handle authorized users
  if ((status === 200 || status === 201) && user.business.length > 0) {
    redirect(`/dashboard/${user.business[0].id}`);
    return null; // Prevent further rendering after redirect
  }

  // Fallback for unexpected scenarios
  return <div>Something went wrong !!!</div>;
}

export default Layout;
