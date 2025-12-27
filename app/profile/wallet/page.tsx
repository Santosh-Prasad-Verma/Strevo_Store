"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Wallet as WalletIcon, TrendingUp, TrendingDown } from "lucide-react"
import type { Wallet, WalletTransaction } from "@/lib/types/database"

export default function WalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadWallet() {
      try {
        const [walletRes, transactionsRes] = await Promise.all([
          fetch("/api/wallet"),
          fetch("/api/wallet/transactions"),
        ])
        const walletData = await walletRes.json()
        const transactionsData = await transactionsRes.json()
        setWallet(walletData)
        setTransactions(transactionsData)
      } catch (error) {
        console.error("Failed to load wallet", error)
      } finally {
        setLoading(false)
      }
    }
    loadWallet()
  }, [])

  if (loading) {
    return <Skeleton className="h-96 w-full" />
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">My Wallet</h2>

      <div className="bg-gradient-to-br from-black to-neutral-800 text-white rounded-none p-8">
        <div className="flex items-center gap-2 mb-2">
          <WalletIcon className="h-5 w-5" />
          <span className="text-sm uppercase tracking-wider opacity-80">Available Balance</span>
        </div>
        <p className="text-5xl font-bold">₹{wallet?.balance.toFixed(2) || "0.00"}</p>
      </div>

      <div className="bg-white border rounded-none p-6">
        <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-3">
                  {txn.type === "credit" || txn.type === "refund" ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                  <div>
                    <p className="font-medium">{txn.description || txn.type}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(txn.created_at).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-bold ${
                    txn.type === "credit" || txn.type === "refund"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {txn.type === "credit" || txn.type === "refund" ? "+" : "-"}₹
                  {txn.amount.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
