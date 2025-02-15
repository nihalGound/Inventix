"use client"

import { useState } from "react"
import { Package, Trophy } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
  id: string
  title: string
  description: string
  date: string
}

const stockAlerts: Notification[] = [
  {
    id: "1",
    title: "Product A is out of stock",
    description: "Reorder Product A immediately",
    date: "2023-05-15 10:30",
  },
  {
    id: "2",
    title: "Product B is low on stock",
    description: "Only 5 units left of Product B",
    date: "2023-05-14 15:45",
  },
]

const milestones: Notification[] = [
  {
    id: "3",
    title: "Product C reached 1000 sales",
    description: "Product C has hit a major sales milestone!",
    date: "2023-05-13 09:00",
  },
  {
    id: "4",
    title: "Product D is trending",
    description: "Product D has shown a 50% increase in sales this week",
    date: "2023-05-12 14:20",
  },
]

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all")

  const allNotifications = [...stockAlerts, ...milestones].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

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
  )
}

function NotificationList({ notifications }: { notifications: Notification[] }) {
  return (
    <ScrollArea className="h-[600px]">
      {notifications.map((notification) => (
        <Card key={notification.id} className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              {notification.title.includes("out of stock") || notification.title.includes("low on stock") ? (
                <Package className="mr-2 h-5 w-5 text-yellow-500" />
              ) : (
                <Trophy className="mr-2 h-5 w-5 text-green-500" />
              )}
              {notification.title}
            </CardTitle>
            <CardDescription>{notification.date}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{notification.description}</p>
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  )
}

