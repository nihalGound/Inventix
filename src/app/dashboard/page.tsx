"use client";
import { useOnBoardUser } from "@/utils/queries";
import { redirect } from "next/navigation";
import React from "react";

function Layout() {
  //auth user and send them to their "/dashboard/${businessId}" route
  const { data, isPending } = useOnBoardUser();

  const { status, data: user } = data as {
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
  if (!isPending && status === 401) {
    redirect("/sign-in");
  }
  if (!isPending && (status === 200 || status === 201)) {
    redirect(`/dashboard/${user.business[0].id}`);
  }
  return <div>Sometehing went wrong !!!</div>;
}

export default Layout;
