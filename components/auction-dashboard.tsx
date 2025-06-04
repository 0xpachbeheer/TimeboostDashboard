"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { BidHistoryChart } from "@/components/bid-history-chart"
import { Clock, Trophy, TrendingUp } from "lucide-react"

interface AuctionRound {
  id: string
  startTime: Date
  endTime: Date
  status: "active" | "completed" | "upcoming"
  currentBid: number
  bidCount: number
  winner?: string
  timeRemaining?: number
}

interface Bid {
  id: string
  auctionId: string
  bidder: string
  amount: number
  timestamp: Date
}

interface AuctionDashboardProps {
  isPaused: boolean
  compact?: boolean
}

export function AuctionDashboard({ isPaused, compact = false }: AuctionDashboardProps) {
  const [auctions, setAuctions] = useState<AuctionRound[]>([])
  const [recentBids, setRecentBids] = useState<Bid[]>([])

  // Initialize mock data
  useEffect(() => {
    const now = new Date()
    const initialAuctions: AuctionRound[] = [
      {
        id: "auction-1",
        startTime: new Date(now.getTime() - 300000),
        endTime: new Date(now.getTime() + 300000),
        status: "active",
        currentBid: 0.045,
        bidCount: 12,
        timeRemaining: 300,
      },
      {
        id: "auction-2",
        startTime: new Date(now.getTime() + 600000),
        endTime: new Date(now.getTime() + 1200000),
        status: "upcoming",
        currentBid: 0,
        bidCount: 0,
      },
      {
        id: "auction-3",
        startTime: new Date(now.getTime() - 1200000),
        endTime: new Date(now.getTime() - 600000),
        status: "completed",
        currentBid: 0.067,
        bidCount: 18,
        winner: "0x742d...35Bd",
      },
    ]

    const initialBids: Bid[] = [
      {
        id: "1",
        auctionId: "auction-1",
        bidder: "0x1234...5678",
        amount: 0.045,
        timestamp: new Date(now.getTime() - 30000),
      },
      {
        id: "2",
        auctionId: "auction-1",
        bidder: "0x9abc...def0",
        amount: 0.042,
        timestamp: new Date(now.getTime() - 60000),
      },
      {
        id: "3",
        auctionId: "auction-1",
        bidder: "0x5555...7777",
        amount: 0.04,
        timestamp: new Date(now.getTime() - 90000),
      },
      {
        id: "4",
        auctionId: "auction-3",
        bidder: "0x742d...35Bd",
        amount: 0.067,
        timestamp: new Date(now.getTime() - 630000),
      },
    ]

    setAuctions(initialAuctions)
    setRecentBids(initialBids)
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      // Update auction timers and add new bids
      setAuctions((prev) =>
        prev.map((auction) => {
          if (auction.status === "active" && auction.timeRemaining) {
            const newTimeRemaining = Math.max(0, auction.timeRemaining - 5)
            if (newTimeRemaining === 0) {
              return {
                ...auction,
                status: "completed" as const,
                winner:
                  "0x" + Math.random().toString(16).substr(2, 8) + "..." + Math.random().toString(16).substr(2, 4),
              }
            }
            return { ...auction, timeRemaining: newTimeRemaining }
          }
          return auction
        }),
      )

      // Randomly add new bids
      if (Math.random() > 0.7) {
        const activeAuction = auctions.find((a) => a.status === "active")
        if (activeAuction) {
          const newBid: Bid = {
            id: Date.now().toString(),
            auctionId: activeAuction.id,
            bidder: "0x" + Math.random().toString(16).substr(2, 4) + "..." + Math.random().toString(16).substr(2, 4),
            amount: activeAuction.currentBid + Math.random() * 0.01,
            timestamp: new Date(),
          }

          setRecentBids((prev) => [newBid, ...prev.slice(0, 9)])
          setAuctions((prev) =>
            prev.map((a) =>
              a.id === activeAuction.id ? { ...a, currentBid: newBid.amount, bidCount: a.bidCount + 1 } : a,
            ),
          )
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused, auctions])

  const formatTimeRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (compact) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Live Auctions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {auctions
            .filter((a) => a.status === "active")
            .map((auction) => (
              <div key={auction.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{auction.currentBid.toFixed(3)} ETH</div>
                  <div className="text-sm text-muted-foreground">{auction.bidCount} bids</div>
                </div>
                <div className="text-right">
                  <Badge variant="default">Active</Badge>
                  <div className="text-sm text-muted-foreground mt-1">
                    {auction.timeRemaining && formatTimeRemaining(auction.timeRemaining)}
                  </div>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
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
            {auctions
              .filter((a) => a.status === "active")
              .map((auction) => (
                <div key={auction.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">Active</Badge>
                      <span className="font-medium">Auction #{auction.id.split("-")[1]}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{auction.timeRemaining && formatTimeRemaining(auction.timeRemaining)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-muted-foreground">Current Bid</div>
                      <div className="text-lg font-bold text-green-600">{auction.currentBid.toFixed(3)} ETH</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Bids</div>
                      <div className="text-lg font-bold">{auction.bidCount}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Time Progress</div>
                      <Progress
                        value={auction.timeRemaining ? ((600 - auction.timeRemaining) / 600) * 100 : 0}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
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
                <TableHead>Auction</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBids.map((bid) => (
                <TableRow key={bid.id}>
                  <TableCell className="font-mono">{bid.bidder}</TableCell>
                  <TableCell className="font-bold text-green-600">{bid.amount.toFixed(3)} ETH</TableCell>
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
