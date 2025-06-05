"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { BidHistoryChart } from "@/components/bid-history-chart"
import { Clock, Trophy, TrendingUp } from "lucide-react"
import { RoundController } from "@/components/round-controller"
import { useTimeboost } from "@/lib/timeboost-context"

interface Bid {
  id: string
  auctionId: string
  bidder: string
  amount: number
  timestamp: Date
  revealed: boolean
}

interface AuctionDashboardProps {
  compact?: boolean
}

export function AuctionDashboard({ compact = false }: AuctionDashboardProps) {
  const { roundInfo, isPaused } = useTimeboost()
  const [recentBids, setRecentBids] = useState<Bid[]>([])

  // Initialize mock data
  useEffect(() => {
    const now = new Date()
    const initialBids: Bid[] = [
      {
        id: "1",
        auctionId: roundInfo.roundId,
        bidder: "0x1234...5678",
        amount: 0.045,
        timestamp: new Date(now.getTime() - 30000),
        revealed: false,
      },
      {
        id: "2",
        auctionId: roundInfo.roundId,
        bidder: "0x9abc...def0",
        amount: 0.042,
        timestamp: new Date(now.getTime() - 60000),
        revealed: false,
      },
      {
        id: "3",
        auctionId: roundInfo.roundId,
        bidder: "0x5555...7777",
        amount: 0.04,
        timestamp: new Date(now.getTime() - 90000),
        revealed: false,
      },
    ]

    setRecentBids(initialBids)
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      // Randomly add new bids during bidding phase
      if (roundInfo.phase === "bidding" && Math.random() > 0.7) {
        const newBid: Bid = {
          id: Date.now().toString(),
          auctionId: roundInfo.roundId,
          bidder: "0x" + Math.random().toString(16).substr(2, 4) + "..." + Math.random().toString(16).substr(2, 4),
          amount: Math.max(
            roundInfo.reservePrice,
            (recentBids.length > 0 ? recentBids[0].amount : 0) + Math.random() * 0.01,
          ),
          timestamp: new Date(),
          revealed: false,
        }

        setRecentBids((prev) => [newBid, ...prev.slice(0, 9)])
      }

      // Reveal bids during revealing phase
      if (roundInfo.phase === "revealing") {
        setRecentBids((prev) =>
          prev.map((bid) => ({
            ...bid,
            revealed: true,
          })),
        )
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused, roundInfo.phase, recentBids, roundInfo.roundId, roundInfo.reservePrice])

  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (compact) {
    return (
      <div className="space-y-4">
        <RoundController />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Live Auctions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">
                  {roundInfo.phase === "revealing" && roundInfo.winningBid
                    ? roundInfo.winningBid.toFixed(3) + " ETH"
                    : "Sealed Bid"}
                </div>
                <div className="text-sm text-muted-foreground">{roundInfo.bidCount} bids</div>
              </div>
              <div className="text-right">
                <Badge variant="default">{roundInfo.phase}</Badge>
                <div className="text-sm text-muted-foreground mt-1">{formatTimeRemaining(roundInfo.timeRemaining)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <RoundController />

      {/* Active Auctions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Active Auctions</span>
          </CardTitle>
          <CardDescription>Live auction rounds and bidding activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Badge variant="default">{roundInfo.phase}</Badge>
                  <span className="font-medium">Round {roundInfo.roundId.split("-")[1]}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formatTimeRemaining(roundInfo.timeRemaining)}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <div className="text-sm text-muted-foreground">
                    {roundInfo.phase === "revealing" ? "Winning Bid" : "Current Bid"}
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {roundInfo.phase === "revealing" && roundInfo.winningBid
                      ? roundInfo.winningBid.toFixed(3) + " ETH"
                      : "---"}
                  </div>
                  {roundInfo.phase === "revealing" && roundInfo.secondHighestBid && (
                    <>
                      <div className="text-sm text-muted-foreground">Second Price</div>
                      <div className="text-lg font-bold text-green-600">
                        {roundInfo.secondHighestBid.toFixed(3)} ETH
                      </div>
                    </>
                  )}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Total Bids</div>
                  <div className="text-lg font-bold">{roundInfo.bidCount}</div>
                  <div className="text-sm text-muted-foreground mt-1">Reserve Price</div>
                  <div className="text-sm font-medium">{roundInfo.reservePrice.toFixed(3)} ETH</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Time Progress</div>
                  <Progress
                    value={roundInfo.timeRemaining ? ((60 - roundInfo.timeRemaining) / 60) * 100 : 0}
                    className="mt-1"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {roundInfo.phase === "bidding"
                      ? "Accepting sealed bids"
                      : roundInfo.phase === "closing"
                        ? "Auction closing"
                        : "Revealing results"}
                  </div>
                </div>
              </div>
              {roundInfo.phase === "revealing" && roundInfo.winner && (
                <div>
                  <div className="text-sm text-muted-foreground">Winner</div>
                  <div className="text-lg font-bold">{roundInfo.winner}</div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Bids */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Recent Bids</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bidder</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Round</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBids.map((bid) => (
                <TableRow key={bid.id}>
                  <TableCell className="font-mono">{bid.bidder}</TableCell>
                  <TableCell className="font-bold text-green-600">
                    {bid.revealed ? bid.amount.toFixed(3) + " ETH" : "Sealed"}
                  </TableCell>
                  <TableCell>#{bid.auctionId.split("-")[1]}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {Math.floor((Date.now() - bid.timestamp.getTime()) / 1000)}s ago
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bid History Chart */}
      <BidHistoryChart data={recentBids} />
    </div>
  )
}
