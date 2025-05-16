"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown, RefreshCw, Coins, Play } from "lucide-react"
import PriceChart from "@/components/price-chart"
import ScoreBoard from "@/components/score-board"
import WalletButton from "@/components/wallet-button"
import BetPanel from "@/components/bet-panel"
import { type Cryptocurrency, cryptoList } from "@/lib/crypto-data"
import { fetchCryptoPrices } from "@/lib/api"
import "@/styles/game.css"

export default function CryptoPredictionGame() {
  const [gameState, setGameState] = useState<"loading" | "betting" | "selection" | "countdown" | "result">("loading")
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(10)
  const [cryptoA, setCryptoA] = useState<Cryptocurrency>(cryptoList[0])
  const [cryptoB, setCryptoB] = useState<Cryptocurrency>(cryptoList[1])
  const [priceA, setPriceA] = useState(0)
  const [priceB, setPriceB] = useState(0)
  const [historyA, setHistoryA] = useState<number[]>([])
  const [historyB, setHistoryB] = useState<number[]>([])
  const [winner, setWinner] = useState<string | null>(null)
  const [score, setScore] = useState({ wins: 0, losses: 0 })
  const [error, setError] = useState<string | null>(null)
  const [betCoins, setBetCoins] = useState(100) // Initial BetCoin balance
  const [currentBet, setCurrentBet] = useState(10) // Default bet amount
  const [walletConnected, setWalletConnected] = useState(false)

  // Select two random cryptocurrencies and fetch their prices
  const selectRandomCryptos = async () => {
    try {
      setGameState("loading")

      // Select two random cryptocurrencies
      const availableCryptos = [...cryptoList]
      const indexA = Math.floor(Math.random() * availableCryptos.length)
      const selectedCryptoA = availableCryptos[indexA]
      availableCryptos.splice(indexA, 1)

      const indexB = Math.floor(Math.random() * availableCryptos.length)
      const selectedCryptoB = availableCryptos[indexB]

      setCryptoA(selectedCryptoA)
      setCryptoB(selectedCryptoB)

      // Fetch real prices from CoinGecko
      const coinIds = [selectedCryptoA.coingeckoId, selectedCryptoB.coingeckoId]
      const prices = await fetchCryptoPrices(coinIds)

      const realPriceA = prices[selectedCryptoA.coingeckoId]?.usd || selectedCryptoA.fallbackPrice
      const realPriceB = prices[selectedCryptoB.coingeckoId]?.usd || selectedCryptoB.fallbackPrice

      setPriceA(realPriceA)
      setPriceB(realPriceB)
      setHistoryA([realPriceA])
      setHistoryB([realPriceB])

      setGameState("betting")
      setError(null)
    } catch (err) {
      console.error("Error fetching crypto prices:", err)
      setError("Failed to fetch cryptocurrency prices. Please try again.")
      // Use fallback prices if API fails
      setPriceA(cryptoA.fallbackPrice)
      setPriceB(cryptoB.fallbackPrice)
      setHistoryA([cryptoA.fallbackPrice])
      setHistoryB([cryptoB.fallbackPrice])
      setGameState("betting")
    }
  }

  // Handle bet placement
  const handlePlaceBet = (amount: number) => {
    setCurrentBet(amount)
    setGameState("selection")
  }

  // Handle crypto selection
  const handleSelect = (crypto: string) => {
    setSelectedCrypto(crypto)
    setGameState("countdown")
    setCountdown(10)
    setHistoryA([priceA])
    setHistoryB([priceB])
  }

  // Reset the game for next round
  const resetGame = () => {
    setSelectedCrypto(null)
    setCountdown(10)
    setWinner(null)
    selectRandomCryptos()
  }

  // Play again with the same balance
  const playAgain = () => {
    resetGame()
  }

  // Toggle wallet connection (mock)
  const toggleWallet = () => {
    setWalletConnected(!walletConnected)
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

        // Update score and BetCoins
        if (selectedCrypto === winningCrypto) {
          setScore((prev) => ({ ...prev, wins: prev.wins + 1 }))
          setBetCoins((prev) => prev + currentBet) // Double the bet (original + winnings)
        } else {
          setScore((prev) => ({ ...prev, losses: prev.losses + 1 }))
          setBetCoins((prev) => Math.max(0, prev - currentBet)) // Lose the bet amount
        }

        setGameState("result")
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState, countdown, priceA, priceB, historyA, historyB, cryptoA, cryptoB, selectedCrypto, currentBet])

  if (gameState === "loading") {
    return (
      <main className="main">
        <div className="container">
          <div className="header">
            <h1 className="title">Crypto Price Prediction</h1>
            <WalletButton connected={walletConnected} onToggle={toggleWallet} balance={betCoins} />
          </div>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading cryptocurrency prices...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="main">
      <div className="container">
        <div className="header">
          <h1 className="title">Crypto Price Prediction</h1>
          <WalletButton connected={walletConnected} onToggle={toggleWallet} balance={betCoins} />
        </div>

        <p className="subtitle">
          {error ? (
            <span className="error-message">{error}</span>
          ) : gameState === "betting" ? (
            "Place your bet to continue"
          ) : gameState === "selection" ? (
            "Which cryptocurrency will increase more in the next 10 seconds?"
          ) : gameState === "countdown" ? (
            `Watching prices change... ${countdown} seconds remaining`
          ) : (
            "Results are in!"
          )}
        </p>

        {gameState === "betting" && <BetPanel balance={betCoins} defaultBet={currentBet} onPlaceBet={handlePlaceBet} />}

        {gameState !== "betting" && <ScoreBoard wins={score.wins} losses={score.losses} />}

        <div className="crypto-grid">
          {/* Crypto A Card */}
          <div
            className={`crypto-card ${cryptoA.id} ${selectedCrypto === cryptoA.id ? "selected" : ""} ${
              gameState === "selection" ? "selectable" : ""
            }`}
            onClick={() => gameState === "selection" && handleSelect(cryptoA.id)}
            style={{ "--crypto-color": cryptoA.cssColor } as React.CSSProperties}
          >
            <div className="crypto-header">
              <div className="crypto-name">
                <div className="crypto-icon">{cryptoA.icon}</div>
                <h2>{cryptoA.name}</h2>
              </div>
              <div className="crypto-price">${priceA.toFixed(cryptoA.decimals)}</div>
            </div>

            <div className="chart-container">
              <PriceChart data={historyA} color={cryptoA.chartColor} />
            </div>

            <div className="crypto-stats">
              <div className="price-change">
                {historyA.length > 1 && (
                  <>
                    {historyA[historyA.length - 1] > historyA[0] ? (
                      <ArrowUp className="arrow up" />
                    ) : (
                      <ArrowDown className="arrow down" />
                    )}
                    <span className={historyA[historyA.length - 1] > historyA[0] ? "positive" : "negative"}>
                      {(((historyA[historyA.length - 1] - historyA[0]) / historyA[0]) * 100).toFixed(2)}%
                    </span>
                  </>
                )}
              </div>
              {winner === cryptoA.id && <span className="winner-badge">Winner!</span>}
            </div>

            {gameState === "selection" && (
              <div className="card-overlay">
                <button className="select-button">Select {cryptoA.name}</button>
              </div>
            )}
          </div>

          {/* Crypto B Card */}
          <div
            className={`crypto-card ${cryptoB.id} ${selectedCrypto === cryptoB.id ? "selected" : ""} ${
              gameState === "selection" ? "selectable" : ""
            }`}
            onClick={() => gameState === "selection" && handleSelect(cryptoB.id)}
            style={{ "--crypto-color": cryptoB.cssColor } as React.CSSProperties}
          >
            <div className="crypto-header">
              <div className="crypto-name">
                <div className="crypto-icon">{cryptoB.icon}</div>
                <h2>{cryptoB.name}</h2>
              </div>
              <div className="crypto-price">${priceB.toFixed(cryptoB.decimals)}</div>
            </div>

            <div className="chart-container">
              <PriceChart data={historyB} color={cryptoB.chartColor} />
            </div>

            <div className="crypto-stats">
              <div className="price-change">
                {historyB.length > 1 && (
                  <>
                    {historyB[historyB.length - 1] > historyB[0] ? (
                      <ArrowUp className="arrow up" />
                    ) : (
                      <ArrowDown className="arrow down" />
                    )}
                    <span className={historyB[historyB.length - 1] > historyB[0] ? "positive" : "negative"}>
                      {(((historyB[historyB.length - 1] - historyB[0]) / historyB[0]) * 100).toFixed(2)}%
                    </span>
                  </>
                )}
              </div>
              {winner === cryptoB.id && <span className="winner-badge">Winner!</span>}
            </div>

            {gameState === "selection" && (
              <div className="card-overlay">
                <button className="select-button">Select {cryptoB.name}</button>
              </div>
            )}
          </div>
        </div>

        {gameState === "countdown" && (
          <div className="countdown-container">
            <div className="countdown-timer">
              <svg className="countdown-svg" viewBox="0 0 100 100">
                <circle className="countdown-background" cx="50" cy="50" r="40" />
                <circle
                  className="countdown-progress"
                  cx="50"
                  cy="50"
                  r="40"
                  style={{
                    strokeDashoffset: 251.2 * (1 - countdown / 10),
                  }}
                />
              </svg>
              <span className="countdown-number">{countdown}</span>
            </div>
          </div>
        )}

        {gameState === "result" && (
          <div className="result-container">
            <h2 className="result-title">
              {selectedCrypto === winner ? "Congratulations! You predicted correctly!" : "Better luck next time!"}
            </h2>
            <p className="result-details">
              {cryptoA.name} changed by{" "}
              {(((historyA[historyA.length - 1] - historyA[0]) / historyA[0]) * 100).toFixed(2)}% and {cryptoB.name}{" "}
              changed by {(((historyB[historyB.length - 1] - historyB[0]) / historyB[0]) * 100).toFixed(2)}%
            </p>

            <div className="bet-result">
              {selectedCrypto === winner ? (
                <p className="win-message">
                  <Coins className="coin-icon" />
                  You won {currentBet} BetCoins! Your new balance: {betCoins} BetCoins
                </p>
              ) : (
                <p className="loss-message">
                  <Coins className="coin-icon" />
                  You lost {currentBet} BetCoins. Your remaining balance: {betCoins} BetCoins
                </p>
              )}
            </div>

            <div className="button-group">
              <button className="next-round-button" onClick={resetGame}>
                <RefreshCw className="button-icon" />
                Next Round
              </button>

              <button className="play-again-button" onClick={playAgain}>
                <Play className="button-icon" />
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
