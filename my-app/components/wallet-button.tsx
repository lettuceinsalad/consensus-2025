"use client"

import { Wallet } from "lucide-react"
import "@/styles/wallet.css"

interface WalletButtonProps {
  connected: boolean
  onToggle: () => void
  balance: number
}

export default function WalletButton({ connected, onToggle, balance }: WalletButtonProps) {
  return (
    <div className="wallet-container">
      <div className="balance-display">
        <span className="balance-amount">{balance}</span>
        <span className="balance-currency">BetCoins</span>
      </div>
      <button className={`wallet-button ${connected ? "connected" : ""}`} onClick={onToggle}>
        <Wallet className="wallet-icon" />
        <span>{connected ? "Wallet Connected" : "Connect Wallet"}</span>
      </button>
    </div>
  )
}
