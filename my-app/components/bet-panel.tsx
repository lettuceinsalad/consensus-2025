"use client"

import type React from "react"

import { useState } from "react"
import { Coins } from "lucide-react"
import "@/styles/bet-panel.css"

interface BetPanelProps {
  balance: number
  defaultBet: number
  onPlaceBet: (amount: number) => void
}

export default function BetPanel({ balance, defaultBet, onPlaceBet }: BetPanelProps) {
  const [betAmount, setBetAmount] = useState(defaultBet)

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0 && value <= balance) {
      setBetAmount(value)
    }
  }

  const handleQuickBet = (amount: number) => {
    if (amount <= balance) {
      setBetAmount(amount)
    }
  }

  return (
    <div className="bet-panel">
      <div className="bet-header">
        <Coins className="bet-icon" />
        <h3>Place Your Bet</h3>
      </div>

      <div className="bet-balance">
        Your Balance: <span className="balance-value">{balance} BetCoins</span>
      </div>

      <div className="bet-input-container">
        <input type="number" min="1" max={balance} value={betAmount} onChange={handleBetChange} className="bet-input" />
        <span className="bet-currency">BetCoins</span>
      </div>

      <div className="quick-bet-options">
        <button className="quick-bet-button" onClick={() => handleQuickBet(10)} disabled={10 > balance}>
          10
        </button>
        <button className="quick-bet-button" onClick={() => handleQuickBet(25)} disabled={25 > balance}>
          25
        </button>
        <button className="quick-bet-button" onClick={() => handleQuickBet(50)} disabled={50 > balance}>
          50
        </button>
        <button className="quick-bet-button" onClick={() => handleQuickBet(balance)}>
          All In
        </button>
      </div>

      <button
        className="place-bet-button"
        onClick={() => onPlaceBet(betAmount)}
        disabled={betAmount <= 0 || betAmount > balance}
      >
        Place Bet & Continue
      </button>
    </div>
  )
}
