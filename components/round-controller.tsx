"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Crown, Zap } from "lucide-react"
import { useTimeboost } from "@/lib/timeboost-context"

export function RoundController() {
  const { roundInfo } = useTimeboost()

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "bidding":
        return "bg-green-500"
      case "closing":
        return "bg-yellow-500"
      case "revealing":
        return "bg-blue-500"
    }
  }

  const getPhaseDescription = (phase: string) => {
    switch (phase) {
      case "bidding":
        return "Accepting sealed bids"
      case "closing":
        return "Auction closing - no new bids"
      case "revealing":
        return "Revealing bids and determining winner"
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Crown className="h-5 w-5 text-yellow-600" />
          <span>Current Round Controller</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Round ID</div>
            <div className="font-mono font-medium">{roundInfo.roundId}</div>
          </div>
          <Badge variant="outline" className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${getPhaseColor(roundInfo.phase)}`} />
            <span className="capitalize">{roundInfo.phase}</span>
          </Badge>
        </div>

        <div>
          <div className="text-sm text-muted-foreground mb-1">Express Lane Controller</div>
          {roundInfo.controller ? (
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="font-mono">{roundInfo.controller}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">No controller (auction in progress)</span>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-muted-foreground">Time Remaining</div>
            <div className="flex items-center space-x-1 text-sm">
              <Clock className="h-3 w-3" />
              <span>{formatTime(roundInfo.timeRemaining)}</span>
            </div>
          </div>
          <Progress value={((60 - roundInfo.timeRemaining) / 60) * 100} className="mb-2" />
          <div className="text-xs text-muted-foreground">{getPhaseDescription(roundInfo.phase)}</div>
        </div>

        {roundInfo.phase === "closing" && (
          <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Auction Closing</div>
            <div className="text-xs text-yellow-600 dark:text-yellow-300">
              No new bids accepted. Determining winner...
            </div>
          </div>
        )}

        {roundInfo.phase === "revealing" && roundInfo.winner && (
          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-sm font-medium text-blue-800 dark:text-blue-200">Winner: {roundInfo.winner}</div>
            <div className="text-xs text-blue-600 dark:text-blue-300">
              Winning bid: {roundInfo.winningBid?.toFixed(3)} ETH
              <br />
              Pays: {roundInfo.secondHighestBid?.toFixed(3)} ETH (second price)
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
