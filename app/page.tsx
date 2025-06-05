"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuctionDashboard } from "@/components/auction-dashboard"
import { TransactionMonitor } from "@/components/transaction-monitor"
import { RealTimeStats } from "@/components/real-time-stats"
import { Zap } from "lucide-react"
import { TimeboostProvider } from "@/lib/timeboost-context"

export default function Dashboard() {
  const [isConnected, setIsConnected] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  const togglePause = () => setIsPaused(!isPaused)

  return (
    <TimeboostProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Zap className="h-6 w-6 text-blue-600" />
                  <h1 className="text-2xl font-bold">Timeboost Monitor</h1>
                </div>
                <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
                  <span>{isConnected ? "Connected" : "Disconnected"}</span>
                </Badge>
                <Badge variant="secondary" className="text-blue-600">
                  60s Rounds
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-orange-600">
                  DEMO MODE
                </Badge>
                <Badge variant="outline" className="text-blue-600">
                  200ms Delay
                </Badge>
                <Button variant={isPaused ? "default" : "outline"} size="sm" onClick={togglePause}>
                  {isPaused ? "Resume" : "Pause"} Updates
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6">
          <RealTimeStats />

          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="auctions">Auctions</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <AuctionDashboard compact />
                <TransactionMonitor compact />
              </div>
            </TabsContent>

            <TabsContent value="auctions">
              <AuctionDashboard />
            </TabsContent>

            <TabsContent value="transactions">
              <TransactionMonitor />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </TimeboostProvider>
  )
}
