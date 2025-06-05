"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, DollarSign, Zap, AlertTriangle } from "lucide-react"
import { useTimeboost } from "@/lib/timeboost-context"

interface StatsData {
  transactionRate: number
  errorRate: number
}

export function RealTimeStats() {
  const { roundInfo, isExpressLaneActive } = useTimeboost()
  const [stats, setStats] = useState<StatsData>({
    transactionRate: 45,
    errorRate: 2.1,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        transactionRate: Math.max(10, prev.transactionRate + (Math.random() - 0.5) * 5),
        errorRate: Math.max(0, Math.min(10, prev.errorRate + (Math.random() - 0.5) * 0.3)),
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const statCards = [
    {
      title: "Current Round",
      value: "Round " + roundInfo.roundId.split("-")[1],
      icon: Activity,
      color: "text-blue-600",
    },
    {
      title: "Total Bids",
      value: roundInfo.bidCount.toString(),
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Reserve Price",
      value: roundInfo.reservePrice.toFixed(3) + " ETH",
      icon: Zap,
      color: "text-purple-600",
    },
    {
      title: "TX Rate/min",
      value: Math.round(stats.transactionRate).toString(),
      icon: Activity,
      color: "text-orange-600",
    },
    {
      title: "Error Rate %",
      value: stats.errorRate.toFixed(1),
      icon: AlertTriangle,
      color: stats.errorRate > 5 ? "text-red-600" : "text-yellow-600",
    },
    {
      title: "Express Lane",
      value: isExpressLaneActive ? "Active" : "Inactive",
      icon: Zap,
      color: isExpressLaneActive ? "text-green-600" : "text-gray-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
