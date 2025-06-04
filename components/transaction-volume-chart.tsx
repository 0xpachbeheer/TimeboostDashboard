"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Activity, Zap } from "lucide-react"

interface VolumeData {
  time: string
  total: number
  express: number
  standard: number
  errors: number
}

export function TransactionVolumeChart() {
  const [volumeData, setVolumeData] = useState<VolumeData[]>([])

  useEffect(() => {
    // Generate initial data
    const now = new Date()
    const initialData: VolumeData[] = []

    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000) // Every minute
      const total = Math.floor(Math.random() * 100) + 20
      const express = Math.floor(total * (0.6 + Math.random() * 0.3))
      const errors = Math.floor(total * (Math.random() * 0.1))

      initialData.push({
        time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        total,
        express,
        standard: total - express,
        errors,
      })
    }

    setVolumeData(initialData)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setVolumeData((prev) => {
        const newData = [...prev.slice(1)]
        const total = Math.floor(Math.random() * 100) + 20
        const express = Math.floor(total * (0.6 + Math.random() * 0.3))
        const errors = Math.floor(total * (Math.random() * 0.1))

        newData.push({
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          total,
          express,
          standard: total - express,
          errors,
        })

        return newData
      })
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Transaction Volume</span>
          </CardTitle>
          <CardDescription>Transactions per minute over the last 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number, name: string) => [value, name === "express" ? "Express Lane" : "Standard"]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Area type="monotone" dataKey="standard" stackId="1" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.6} />
              <Area type="monotone" dataKey="express" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.8} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Error Rate</span>
          </CardTitle>
          <CardDescription>Transaction errors and failures over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [value, "Errors"]} labelFormatter={(label) => `Time: ${label}`} />
              <Bar dataKey="errors" fill="#ef4444" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
