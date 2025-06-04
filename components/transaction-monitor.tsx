"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TransactionVolumeChart } from "@/components/transaction-volume-chart"
import { Activity, AlertTriangle, CheckCircle, Clock, Search, Zap } from "lucide-react"

interface Transaction {
  hash: string
  sequenceNumber: number
  status: "pending" | "confirmed" | "failed"
  gasUsed: number
  timeboostFlag: boolean
  timestamp: Date
  error?: string
  from: string
  to: string
}

interface TransactionMonitorProps {
  isPaused: boolean
  compact?: boolean
}

export function TransactionMonitor({ isPaused, compact = false }: TransactionMonitorProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [errorAlerts, setErrorAlerts] = useState<Transaction[]>([])

  // Initialize mock data
  useEffect(() => {
    const generateMockTransaction = (): Transaction => {
      const statuses: Transaction["status"][] = ["pending", "confirmed", "failed"]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const hasError = status === "failed" || Math.random() < 0.05

      return {
        hash: "0x" + Math.random().toString(16).substr(2, 64),
        sequenceNumber: Math.floor(Math.random() * 1000000),
        status,
        gasUsed: Math.floor(Math.random() * 100000) + 21000,
        timeboostFlag: Math.random() > 0.3,
        timestamp: new Date(),
        error: hasError ? (Math.random() > 0.5 ? "Sequence mismatch" : "Gas limit exceeded") : undefined,
        from: "0x" + Math.random().toString(16).substr(2, 8) + "..." + Math.random().toString(16).substr(2, 4),
        to: "0x" + Math.random().toString(16).substr(2, 8) + "..." + Math.random().toString(16).substr(2, 4),
      }
    }

    // Generate initial transactions
    const initialTxs = Array.from({ length: 20 }, generateMockTransaction)
    setTransactions(initialTxs)
  }, [])

  // Simulate real-time transaction updates
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(
      () => {
        const newTx: Transaction = {
          hash: "0x" + Math.random().toString(16).substr(2, 64),
          sequenceNumber: Math.floor(Math.random() * 1000000),
          status: Math.random() > 0.1 ? "confirmed" : Math.random() > 0.5 ? "pending" : "failed",
          gasUsed: Math.floor(Math.random() * 100000) + 21000,
          timeboostFlag: Math.random() > 0.3,
          timestamp: new Date(),
          from: "0x" + Math.random().toString(16).substr(2, 8) + "..." + Math.random().toString(16).substr(2, 4),
          to: "0x" + Math.random().toString(16).substr(2, 8) + "..." + Math.random().toString(16).substr(2, 4),
        }

        // Add error for failed transactions
        if (newTx.status === "failed" || Math.random() < 0.05) {
          newTx.error = Math.random() > 0.5 ? "Sequence mismatch detected" : "Transaction reverted"
          setErrorAlerts((prev) => [newTx, ...prev.slice(0, 4)])
        }

        setTransactions((prev) => [newTx, ...prev.slice(0, 49)])
      },
      Math.random() * 3000 + 1000,
    ) // Random interval between 1-4 seconds

    return () => clearInterval(interval)
  }, [isPaused])

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
    }
  }

  const getStatusBadge = (status: Transaction["status"]) => {
    const variants = {
      confirmed: "default",
      pending: "secondary",
      failed: "destructive",
    } as const

    return <Badge variant={variants[status]}>{status}</Badge>
  }

  if (compact) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Live Transactions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {transactions.slice(0, 5).map((tx) => (
            <div key={tx.hash} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center space-x-2">
                {getStatusIcon(tx.status)}
                <span className="font-mono text-sm">{tx.hash.slice(0, 10)}...</span>
                {tx.timeboostFlag && <Zap className="h-3 w-3 text-blue-600" />}
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.floor((Date.now() - tx.timestamp.getTime()) / 1000)}s
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Alerts */}
      {errorAlerts.length > 0 && (
        <div className="space-y-2">
          {errorAlerts.slice(0, 3).map((tx) => (
            <Alert key={tx.hash} variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Transaction Error:</strong> {tx.error} - {tx.hash.slice(0, 20)}...
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Transaction Monitor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Express Lane Transaction Monitor</span>
          </CardTitle>
          <CardDescription>Real-time monitoring of Timeboost transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by hash, address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Hash</TableHead>
                <TableHead>From → To</TableHead>
                <TableHead>Sequence</TableHead>
                <TableHead>Gas</TableHead>
                <TableHead>Timeboost</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.slice(0, 15).map((tx) => (
                <TableRow key={tx.hash} className={tx.error ? "bg-red-50 dark:bg-red-950/20" : ""}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(tx.status)}
                      {getStatusBadge(tx.status)}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{tx.hash.slice(0, 20)}...</TableCell>
                  <TableCell className="font-mono text-sm">
                    <div>{tx.from}</div>
                    <div className="text-muted-foreground">↓</div>
                    <div>{tx.to}</div>
                  </TableCell>
                  <TableCell>{tx.sequenceNumber.toLocaleString()}</TableCell>
                  <TableCell>{tx.gasUsed.toLocaleString()}</TableCell>
                  <TableCell>
                    {tx.timeboostFlag ? (
                      <Badge variant="outline" className="text-blue-600">
                        <Zap className="h-3 w-3 mr-1" />
                        Express
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">Standard</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {Math.floor((Date.now() - tx.timestamp.getTime()) / 1000)}s ago
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Transaction Volume Chart */}
      <TransactionVolumeChart />
    </div>
  )
}
