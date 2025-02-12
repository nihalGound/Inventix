"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DetailReport from "./DetailReport"

interface Metrics {
  revenue: number
  revenueChange: number
  orders: number
  ordersChange: number
  averageOrderValue: number
  averageOrderValueChange: number
  returnRate: number
  returnRateChange: number
}

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [category, setCategory] = useState("all")
  const [metrics, setMetrics] = useState<Metrics>({
    revenue: 45289,
    revenueChange: 12,
    orders: 1432,
    ordersChange: 8,
    averageOrderValue: 31.62,
    averageOrderValueChange: -3,
    returnRate: 2.4,
    returnRateChange: 1,
  })

  const handleDateChange = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Detailed Reports</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value)
              handleDateChange()
            }}
            className="w-full sm:w-[180px]"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value)
              handleDateChange()
            }}
            className="w-full sm:w-[180px]"
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="food">Food</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    <Skeleton className="h-4 w-[100px]" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-7 w-[120px] mb-2" />
                  <Skeleton className="h-4 w-[90px]" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${metrics.revenue.toLocaleString()}</div>
                <p
                  className={`text-xs flex items-center ${metrics.revenueChange >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {metrics.revenueChange >= 0 ? "↑" : "↓"} {Math.abs(metrics.revenueChange)}% vs last period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.orders.toLocaleString()}</div>
                <p
                  className={`text-xs flex items-center ${metrics.ordersChange >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {metrics.ordersChange >= 0 ? "↑" : "↓"} {Math.abs(metrics.ordersChange)}% vs last period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${metrics.averageOrderValue.toFixed(2)}</div>
                <p
                  className={`text-xs flex items-center ${metrics.averageOrderValueChange >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {metrics.averageOrderValueChange >= 0 ? "↑" : "↓"} {Math.abs(metrics.averageOrderValueChange)}% vs
                  last period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Return Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.returnRate}%</div>
                <p
                  className={`text-xs flex items-center ${metrics.returnRateChange <= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {metrics.returnRateChange >= 0 ? "↑" : "↓"} {Math.abs(metrics.returnRateChange)}% vs last period
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <DetailReport startDate={startDate} endDate={endDate} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

