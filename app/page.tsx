"use client"

import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown, RefreshCw, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import PriceChart from "@/components/price-chart"
import ScoreBoard from "@/  components/score-board"
import { type Cryptocurrency, cryptoList } from "@/lib/crypto-data"

export default function CryptoPredictionGame() {
  const [gameState, setGameState] = useState<"selection" | "countdown" | "result">("selection")
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(10)
  const [cryptoA, setCryptoA] = useState<Cryptocurrency>(cryptoList[0])
  const [cryptoB, setCryptoB] = useState<Cryptocurrency>(cryptoList[1])
  const [priceA, setPriceA] = useState(cryptoA.currentPrice)
  const [priceB, setPriceB] = useState(cryptoB.currentPrice)
  const [historyA, setHistoryA] = useState<number[]>([cryptoA.currentPrice])
  const [historyB, setHistoryB] = useState<number[]>([cryptoB.currentPrice])
  const [winner, setWinner] = useState<string | null>(null)
  const [score, setScore] = useState({ wins: 0, losses: 0 })
  const [balance, setBalance] = useState(1000) // Initial balance of 1000 coins
  const [betSize, setBetSize] = useState(50) // Default bet size

  // Select two random cryptocurrencies for the next round
  const selectRandomCryptos = () => {
    const availableCryptos = [...cryptoList]

    // Select first crypto
    const indexA = Math.floor(Math.random() * availableCryptos.length)
    const selectedCryptoA = availableCryptos[indexA]
    availableCryptos.splice(indexA, 1)

    // Select second crypto
    const indexB = Math.floor(Math.random() * availableCryptos.length)
    const selectedCryptoB = availableCryptos[indexB]

    setCryptoA(selectedCryptoA)
    setCryptoB(selectedCryptoB)
    setPriceA(selectedCryptoA.currentPrice)
    setPriceB(selectedCryptoB.currentPrice)
    setHistoryA([selectedCryptoA.currentPrice])
    setHistoryB([selectedCryptoB.currentPrice])
  }

  // Handle crypto selection
  const handleSelect = (crypto: string) => {
    // Check if user has sufficient balance
    if (balance < betSize) {
      alert("Insufficient balance for this bet!")
      return
    }
    
    // Deduct bet amount from balance
    setBalance(prev => prev - betSize)
    
    setSelectedCrypto(crypto)
    setGameState("countdown")
    setCountdown(10)
    setHistoryA([priceA])
    setHistoryB([priceB])
  }

  // Reset the game for next round
  const resetGame = () => {
    setGameState("selection")
    setSelectedCrypto(null)
    setCountdown(10)
    selectRandomCryptos()
    setWinner(null)
  }

  // Increase bet size
  const increaseBet = () => {
    if (betSize < balance) {
      setBetSize(prev => Math.min(prev + 50, balance))
    }
  }

  // Decrease bet size
  const decreaseBet = () => {
    if (betSize > 50) {
      setBetSize(prev => Math.max(prev - 50, 50))
    }
  }

  // Initialize the game
  useEffect(() => {
    selectRandomCryptos()
  }, [])

  // Countdown timer and price simulation
  useEffect(() => {
    if (gameState !== "countdown") return

    const timer = setInterval(() => {
      if (countdown > 0) {
        setCountdown((prev) => prev - 1)

        // Simulate price changes based on the volatility of each crypto
        const changeA = priceA * (Math.random() * cryptoA.volatility * 2 - cryptoA.volatility)
        const changeB = priceB * (Math.random() * cryptoB.volatility * 2 - cryptoB.volatility)

        const newPriceA = priceA + changeA
        const newPriceB = priceB + changeB

        setPriceA(newPriceA)
        setPriceB(newPriceB)

        setHistoryA((prev) => [...prev, newPriceA])
        setHistoryB((prev) => [...prev, newPriceB])
      } else {
        clearInterval(timer)

        // Calculate percentage changes
        const percentChangeA = ((historyA[historyA.length - 1] - historyA[0]) / historyA[0]) * 100
        const percentChangeB = ((historyB[historyB.length - 1] - historyB[0]) / historyB[0]) * 100

        // Determine winner
        const winningCrypto = percentChangeA > percentChangeB ? cryptoA.id : cryptoB.id
        setWinner(winningCrypto)

        // Update score and balance
        if (selectedCrypto === winningCrypto) {
          setScore((prev) => ({ ...prev, wins: prev.wins + 1 }))
          // Add winnings to balance (2x bet amount)
          setBalance(prev => prev + (betSize * 2))
        } else {
          setScore((prev) => ({ ...prev, losses: prev.losses + 1 }))
        }

        setGameState("result")
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState, countdown, priceA, priceB, historyA, historyB, cryptoA, cryptoB, selectedCrypto, betSize])

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-purple-600">
          Crypto Price Prediction
        </h1>
        <p className="text-center text-gray-300 mb-4">
          {gameState === "selection"
            ? "Which cryptocurrency will increase more in the next 10 seconds?"
            : gameState === "countdown"
              ? `Watching prices change... ${countdown} seconds remaining`
              : "Results are in!"}
        </p>

        {/* Balance and Bet Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 flex items-center">
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm">Balance</span>
              <span className="text-xl font-bold text-green-400">${balance.toLocaleString()}</span>
            </div>
          </div>
          
          {gameState === "selection" && (
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 flex items-center">
              <div className="flex flex-col mr-3">
                <span className="text-gray-400 text-sm">Bet Size</span>
                <span className="text-xl font-bold text-yellow-400">${betSize.toLocaleString()}</span>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={decreaseBet} 
                  disabled={betSize <= 50}
                  className="h-8 w-8 rounded-full bg-gray-700"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={increaseBet} 
                  disabled={betSize >= balance}
                  className="h-8 w-8 rounded-full bg-gray-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <ScoreBoard wins={score.wins} losses={score.losses} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-6">
          {/* Crypto A Card */}
          <Card
            className={`relative overflow-hidden transition-all duration-300 ease-in-out p-6 bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:shadow-lg hover:shadow-${cryptoA.color}-500/10 ${
              selectedCrypto === cryptoA.id ? `ring-2 ring-${cryptoA.color}-500 scale-[1.02]` : ""
            } ${gameState === "selection" ? "cursor-pointer" : ""}`}
            onClick={() => gameState === "selection" && handleSelect(cryptoA.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`h-8 w-8 text-${cryptoA.color}-500 mr-2`}>{cryptoA.icon}</div>
                <h2 className="text-2xl font-bold">{cryptoA.name}</h2>
              </div>
              <div className="text-xl font-mono">${priceA.toFixed(cryptoA.decimals)}</div>
            </div>

            <div className="h-32 mb-4">
              <PriceChart data={historyA} color={cryptoA.chartColor} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {historyA.length > 1 &&
                  (historyA[historyA.length - 1] > historyA[0] ? (
                    <ArrowUp className="h-5 w-5 text-green-500 mr-1" />
                  ) : (
                    <ArrowDown className="h-5 w-5 text-red-500 mr-1" />
                  ))}
                {historyA.length > 1 && (
                  <span className={historyA[historyA.length - 1] > historyA[0] ? "text-green-500" : "text-red-500"}>
                    {(((historyA[historyA.length - 1] - historyA[0]) / historyA[0]) * 100).toFixed(2)}%
                  </span>
                )}
              </div>
              {winner === cryptoA.id && (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium animate-pulse">
                  Winner!
                </span>
              )}
            </div>

            {gameState === "selection" && (
              <div
                className={`absolute inset-0 bg-${cryptoA.color}-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center`}
              >
                <Button
                  variant="outline"
                  className={`bg-gray-900/80 border-${cryptoA.color}-500 text-white hover:bg-gray-800`}
                >
                  Select {cryptoA.name}
                </Button>
              </div>
            )}
          </Card>

          {/* Crypto B Card */}
          <Card
            className={`relative overflow-hidden transition-all duration-300 ease-in-out p-6 bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:shadow-lg hover:shadow-${cryptoB.color}-500/10 ${
              selectedCrypto === cryptoB.id ? `ring-2 ring-${cryptoB.color}-500 scale-[1.02]` : ""
            } ${gameState === "selection" ? "cursor-pointer" : ""}`}
            onClick={() => gameState === "selection" && handleSelect(cryptoB.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className={`h-8 w-8 text-${cryptoB.color}-500 mr-2`}>{cryptoB.icon}</div>
                <h2 className="text-2xl font-bold">{cryptoB.name}</h2>
              </div>
              <div className="text-xl font-mono">${priceB.toFixed(cryptoB.decimals)}</div>
            </div>

            <div className="h-32 mb-4">
              <PriceChart data={historyB} color={cryptoB.chartColor} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {historyB.length > 1 &&
                  (historyB[historyB.length - 1] > historyB[0] ? (
                    <ArrowUp className="h-5 w-5 text-green-500 mr-1" />
                  ) : (
                    <ArrowDown className="h-5 w-5 text-red-500 mr-1" />
                  ))}
                {historyB.length > 1 && (
                  <span className={historyB[historyB.length - 1] > historyB[0] ? "text-green-500" : "text-red-500"}>
                    {(((historyB[historyB.length - 1] - historyB[0]) / historyB[0]) * 100).toFixed(2)}%
                  </span>
                )}
              </div>
              {winner === cryptoB.id && (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium animate-pulse">
                  Winner!
                </span>
              )}
            </div>

            {gameState === "selection" && (
              <div
                className={`absolute inset-0 bg-${cryptoB.color}-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center`}
              >
                <Button
                  variant="outline"
                  className={`bg-gray-900/80 border-${cryptoB.color}-500 text-white hover:bg-gray-800`}
                >
                  Select {cryptoB.name}
                </Button>
              </div>
            )}
          </Card>
        </div>

        {gameState === "countdown" && (
          <div className="flex items-center justify-center mb-8">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-700 stroke-current"
                  strokeWidth="10"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                />
                <circle
                  className="text-purple-500 stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - countdown / 10)}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <span className="absolute text-2xl font-bold">{countdown}</span>
            </div>
          </div>
        )}

        {gameState === "result" && (
          <div className="text-center mb-8 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4">
              {selectedCrypto === winner ? "Congratulations! You predicted correctly!" : "Better luck next time!"}
            </h2>
            <p className="text-gray-300 mb-6">
              {cryptoA.name} changed by{" "}
              {(((historyA[historyA.length - 1] - historyA[0]) / historyA[0]) * 100).toFixed(2)}% and {cryptoB.name}{" "}
              changed by {(((historyB[historyB.length - 1] - historyB[0]) / historyB[0]) * 100).toFixed(2)}%
            </p>
            {selectedCrypto === winner ? (
              <p className="text-green-400 mb-6">
                You won ${(betSize * 2).toLocaleString()}!
              </p>
            ) : (
              <p className="text-red-400 mb-6">
                You lost ${betSize.toLocaleString()}.
              </p>
            )}
            <Button
              onClick={resetGame}
              className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 transition-all duration-300"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Next Round
            </Button>
          </div>
        )}
      </div>
    </main>
  )
} 