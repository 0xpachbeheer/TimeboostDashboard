"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp } from "lucide-react"

interface Bid {
  id: string
  auctionId: string
  bidder: string
  amount: number
  timestamp: Date
}

interface BidHistoryChartProps {
  data: Bid[]
}

export function BidHistoryChart({ data }: BidHistoryChartProps) {
  const chartData = data
    .slice(0, 20)
    .reverse()
    .map((bid, index) => ({
      time: bid.timestamp.toLocaleTimeString(),
      amount: bid.amount,
      index,
    }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5" />
          <span>Bid History Trends</span>
        </CardTitle>
        <CardDescription>Recent bidding activity across all auctions</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 12 }} domain={["dataMin - 0.005", "dataMax + 0.005"]} />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(3)} ETH`, "Bid Amount"]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
