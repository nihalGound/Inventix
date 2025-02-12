"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {  Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

interface Sale {
  id: number
  timestamp: string
  product: string
  quantity: number
  total: number
}

const initialSales: Sale[] = [
  { id: 1, timestamp: "2023-05-01 10:30:00", product: "Product A", quantity: 2, total: 19.98 },
  { id: 2, timestamp: "2023-05-02 14:45:00", product: "Product B", quantity: 1, total: 19.99 },
  { id: 3, timestamp: "2023-05-03 09:15:00", product: "Product C", quantity: 3, total: 44.97 },
]

export default function SalesHistory() {
  const [sales, setSales] = useState<Sale[]>(initialSales)
  const [searchQuery, setSearchQuery] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [noResults, setNoResults] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setNoResults(false)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simulate search results
    const filteredSales = initialSales.filter(
      (sale) =>
        (sale.product.toLowerCase().includes(searchQuery.toLowerCase()) || sale.timestamp.includes(searchQuery)) &&
        (!startDate || new Date(sale.timestamp) >= new Date(startDate)) &&
        (!endDate || new Date(sale.timestamp) <= new Date(endDate)),
    )

    setSales(filteredSales)
    setNoResults(filteredSales.length === 0)
    setIsLoading(false)
  }

  return (
    <div className=" bg-background p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Sales History</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <form onSubmit={handleSearch}>
            <Input
              placeholder="Search by product or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 max-md:w-full placeholder:text-xs"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </form>
        </div>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full sm:w-[180px]"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full sm:w-[180px]"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <Card className="border rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-4">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-6 w-[100px]" />
                  <Skeleton className="h-6 w-[150px]" />
                  <Skeleton className="h-6 w-[80px]" />
                  <Skeleton className="h-6 w-[100px]" />
                </div>
              ))}
            </div>
          </div>
        ) : noResults ? (
          <div className="p-8 text-center text-muted-foreground">No sales found matching your search criteria</div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>{sale.timestamp}</TableCell>
                    <TableCell>{sale.product}</TableCell>
                    <TableCell>{sale.quantity}</TableCell>
                    <TableCell>${sale.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </Card>
    </div>
  )
}

