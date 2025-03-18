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

// Define a reusable type for notifications
type Notification = {
  id: string;
  createdAt: Date;
  type: "LOWSTOCK" | "MILESTONE" | "SALES_ALERT";
  message: string;
  status: "UNREAD" | "READ";
  readAt: Date | null;
};

type NotificationsResponse = {
  status: number;
  data: {
    message: string;
    notifications: Notification[];
  };
};

function NotificationPage({ businessId }: { businessId: string }) {
  const { data, isLoading } = useNotifications(businessId);
  const [notifications, setNotifications] = useState<{
    all: Notification[];
    stockAlerts: Notification[];
    milestones: Notification[];
  }>({
    all: [],
    stockAlerts: [],
    milestones: [],
  });

  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (data && !isLoading) {
      const { status, data: responseData } = data as NotificationsResponse;

      if (status === 200) {
        const all = responseData.notifications;
        const stockAlerts = all.filter((n) => n.type === "LOWSTOCK");
        const milestones = all.filter((n) => n.type === "MILESTONE");

        setNotifications({
          all: all.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ),
          stockAlerts,
          milestones,
        });
      }
    }
  }, [data, isLoading]);

  if (!isLoading && (data as NotificationsResponse).status == 404) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        No notification found
      </div>
    );
  }

  if (!isLoading && (!data || (data as NotificationsResponse).status !== 200)) {
    console.log(data);
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
          <NotificationList notifications={notifications.all} />
        </TabsContent>
        <TabsContent value="stock">
          <NotificationList notifications={notifications.stockAlerts} />
        </TabsContent>
        <TabsContent value="milestones">
          <NotificationList notifications={notifications.milestones} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NotificationList({
  notifications,
}: {
  notifications: Notification[];
}) {
  return (
    <ScrollArea className="h-[600px]">
      {notifications.map(({ id, message, createdAt }) => (
        <Card key={id} className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              {message.includes("out of stock") ||
              message.includes("low on stock") ? (
                <Package className="mr-2 h-5 w-5 text-yellow-500" />
              ) : (
                <Trophy className="mr-2 h-5 w-5 text-green-500" />
              )}
              {message}
            </CardTitle>
            <CardDescription>
              {new Date(createdAt).toDateString()}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </ScrollArea>
  );
}

export default NotificationPage;
