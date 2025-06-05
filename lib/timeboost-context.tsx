"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface RoundInfo {
  roundId: string
  controller: string | null
  timeRemaining: number
  phase: "bidding" | "closing" | "revealing"
  nextRoundStartsIn: number
  winningBid?: number
  secondHighestBid?: number
  winner?: string
  bidCount: number
  reservePrice: number
}

interface TimeboostContextType {
  roundInfo: RoundInfo
  isPaused: boolean
  togglePause: () => void
  isExpressLaneActive: boolean
  transactionCount: number
  incrementTransactionCount: () => void
  expressTransactionCount: number
  incrementExpressTransactionCount: () => void
}

const TimeboostContext = createContext<TimeboostContextType | undefined>(undefined)

export function TimeboostProvider({ children }: { children: ReactNode }) {
  const [isPaused, setIsPaused] = useState(false)
  const [transactionCount, setTransactionCount] = useState(0)
  const [expressTransactionCount, setExpressTransactionCount] = useState(0)

  const [roundInfo, setRoundInfo] = useState<RoundInfo>({
    roundId: `round-${Date.now()}`,
    controller: null,
    timeRemaining: 60,
    phase: "bidding",
    nextRoundStartsIn: 60,
    bidCount: 0,
    reservePrice: 0.001,
  })

  // Simulate round progression
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setRoundInfo((prev) => {
        const newTimeRemaining = Math.max(0, prev.timeRemaining - 1)

        // Determine phase based on time remaining
        let phase: RoundInfo["phase"] = "bidding"
        if (newTimeRemaining <= 15 && newTimeRemaining > 0) {
          phase = "closing"
        } else if (newTimeRemaining === 0) {
          phase = "revealing"
        }

        // Start new round when time reaches 0
        if (newTimeRemaining === 0) {
          // Simulate winner selection
          const winner =
            "0x" + Math.random().toString(16).substr(2, 4) + "..." + Math.random().toString(16).substr(2, 4)
          const winningBid = Math.max(0.001, Math.random() * 0.05 + 0.02)
          const secondHighestBid = Math.max(prev.reservePrice, winningBid * 0.8)

          // Wait 5 seconds in revealing phase, then start new round
          setTimeout(() => {
            setRoundInfo({
              roundId: `round-${Date.now()}`,
              controller: winner,
              timeRemaining: 60,
              phase: "bidding",
              nextRoundStartsIn: 60,
              bidCount: 0,
              reservePrice: 0.001,
            })
          }, 5000)

          return {
            ...prev,
            timeRemaining: newTimeRemaining,
            phase,
            winner,
            winningBid,
            secondHighestBid,
          }
        }

        return {
          ...prev,
          timeRemaining: newTimeRemaining,
          phase,
          nextRoundStartsIn: newTimeRemaining,
          bidCount: prev.phase === "bidding" && Math.random() > 0.8 ? prev.bidCount + 1 : prev.bidCount,
        }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused])

  const togglePause = () => setIsPaused(!isPaused)

  const incrementTransactionCount = () => setTransactionCount((prev) => prev + 1)
  const incrementExpressTransactionCount = () => setExpressTransactionCount((prev) => prev + 1)

  const isExpressLaneActive = roundInfo.controller !== null

  const value = {
    roundInfo,
    isPaused,
    togglePause,
    isExpressLaneActive,
    transactionCount,
    incrementTransactionCount,
    expressTransactionCount,
    incrementExpressTransactionCount,
  }

  return <TimeboostContext.Provider value={value}>{children}</TimeboostContext.Provider>
}

export function useTimeboost() {
  const context = useContext(TimeboostContext)
  if (context === undefined) {
    throw new Error("useTimeboost must be used within a TimeboostProvider")
  }
  return context
}
