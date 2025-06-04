"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, DollarSign, Zap, AlertTriangle } from "lucide-react"

interface StatsData {
  activeAuctions: number
  totalBids: number
  avgBidAmount: number
  transactionRate: number
  errorRate: number
  expressLaneUsage: number
}

interface RealTimeStatsProps {
  isPaused: boolean
}

export function RealTimeStats({ isPaused }: RealTimeStatsProps) {
  const [stats, setStats] = useState<StatsData>({
    activeAuctions: 3,
    totalBids: 1247,
    avgBidAmount: 0.045,
    transactionRate: 45,
    errorRate: 2.1,
    expressLaneUsage: 78,
  })

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setStats((prev) => ({
        activeAuctions: Math.max(1, prev.activeAuctions + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
        totalBids: prev.totalBids + Math.floor(Math.random() * 3),
        avgBidAmount: Math.max(0.01, prev.avgBidAmount + (Math.random() - 0.5) * 0.01),
        transactionRate: Math.max(10, prev.transactionRate + (Math.random() - 0.5) * 10),
        errorRate: Math.max(0, Math.min(10, prev.errorRate + (Math.random() - 0.5) * 0.5)),
        expressLaneUsage: Math.max(0, Math.min(100, prev.expressLaneUsage + (Math.random() - 0.5) * 5)),
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [isPaused])

  const statCards = [
    {
      title: "Active Auctions",
      value: stats.activeAuctions,
      icon: Activity,
      color: "text-blue-600",
    },
    {
      title: "Total Bids Today",
      value: stats.totalBids.toLocaleString(),
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Avg Bid (ETH)",
      value: stats.avgBidAmount.toFixed(3),
      icon: Zap,
      color: "text-purple-600",
    },
    {
      title: "TX Rate/min",
      value: Math.round(stats.transactionRate),
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
      title: "Express Lane %",
      value: Math.round(stats.expressLaneUsage),
      icon: Zap,
      color: "text-indigo-600",
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
