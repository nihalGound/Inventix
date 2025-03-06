"use client";

import { useEffect, useState } from "react";
import { Package, Trophy } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/utils/queries";

export default function NotificationsPage({
  params,
}: {
  params: { businessId: string };
}) {
  const { data, isLoading } = useNotifications(params.businessId);

  const { data: response, status } = data as {
    status: number;
    data: {
      message: string;
      notifications: {
        id: string;
        createdAt: Date;
        type: "LOWSTOCK" | "MILESTONE" | "SALES_ALERT";
        message: string;
        status: "UNREAD" | "READ";
        readAt: Date | null;
      }[];
    };
  };

  const [stockAlerts, setStockAlerts] = useState<
    {
      id: string;
      createdAt: Date;
      type: "LOWSTOCK" | "MILESTONE" | "SALES_ALERT";
      message: string;
      status: "UNREAD" | "READ";
      readAt: Date | null;
    }[]
  >([]);
  const [milestones, setMilestones] = useState<
    {
      id: string;
      createdAt: Date;
      type: "LOWSTOCK" | "MILESTONE" | "SALES_ALERT";
      message: string;
      status: "UNREAD" | "READ";
      readAt: Date | null;
    }[]
  >([]);

  useEffect(() => {
    if (!isLoading && status === 200) {
      setStockAlerts(
        response.notifications.filter((no) => no.type === "LOWSTOCK")
      );
      setMilestones(
        response.notifications.filter((n) => n.type === "MILESTONE")
      );
    }
  }, [isLoading, status, response.notifications]);
  const [activeTab, setActiveTab] = useState("all");

  const allNotifications = [...stockAlerts, ...milestones].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  if (!isLoading && status !== 200) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        An error occurred while fetching data.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="stock">Stock Alerts</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <NotificationList notifications={allNotifications} />
        </TabsContent>
        <TabsContent value="stock">
          <NotificationList notifications={stockAlerts} />
        </TabsContent>
        <TabsContent value="milestones">
          <NotificationList notifications={milestones} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NotificationList({
  notifications,
}: {
  notifications: {
    id: string;
    createdAt: Date;
    type: "LOWSTOCK" | "MILESTONE" | "SALES_ALERT";
    message: string;
    status: "UNREAD" | "READ";
    readAt: Date | null;
  }[];
}) {
  return (
    <ScrollArea className="h-[600px]">
      {notifications.map((notification) => (
        <Card key={notification.id} className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              {notification.message.includes("out of stock") ||
              notification.message.includes("low on stock") ? (
                <Package className="mr-2 h-5 w-5 text-yellow-500" />
              ) : (
                <Trophy className="mr-2 h-5 w-5 text-green-500" />
              )}
              {notification.message}
            </CardTitle>
            <CardDescription>
              {notification.createdAt.toDateString()}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </ScrollArea>
  );
}
