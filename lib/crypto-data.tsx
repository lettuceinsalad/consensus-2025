import { Bitcoin, EclipseIcon, Waves, Gem, Dog, Landmark, Hexagon, CircleDollarSign } from "lucide-react"
import type { ReactNode } from "react"

export interface Cryptocurrency {
  id: string
  name: string
  icon: ReactNode
  currentPrice: number
  decimals: number
  color: string
  chartColor: string
  volatility: number
}

export const cryptoList: Cryptocurrency[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    icon: <Bitcoin />,
    currentPrice: 67000,
    decimals: 2,
    color: "orange",
    chartColor: "#f59e0b",
    volatility: 0.0003,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    icon: <EclipseIcon />,
    currentPrice: 3200,
    decimals: 2,
    color: "purple",
    chartColor: "#8b5cf6",
    volatility: 0.0004,
  },
  {
    id: "solana",
    name: "Solana",
    icon: <Waves />,
    currentPrice: 140,
    decimals: 2,
    color: "emerald",
    chartColor: "#10b981",
    volatility: 0.0006,
  },
  {
    id: "cardano",
    name: "Cardano",
    icon: <Hexagon />,
    currentPrice: 0.45,
    decimals: 4,
    color: "blue",
    chartColor: "#3b82f6",
    volatility: 0.0005,
  },
  {
    id: "dogecoin",
    name: "Dogecoin",
    icon: <Dog />,
    currentPrice: 0.15,
    decimals: 4,
    color: "yellow",
    chartColor: "#eab308",
    volatility: 0.0008,
  },
  {
    id: "polkadot",
    name: "Polkadot",
    icon: <Gem />,
    currentPrice: 6.8,
    decimals: 2,
    color: "pink",
    chartColor: "#ec4899",
    volatility: 0.0005,
  },
  {
    id: "ripple",
    name: "XRP",
    icon: <CircleDollarSign />,
    currentPrice: 0.52,
    decimals: 4,
    color: "sky",
    chartColor: "#0ea5e9",
    volatility: 0.0004,
  },
  {
    id: "chainlink",
    name: "Chainlink",
    icon: <Landmark />,
    currentPrice: 14.2,
    decimals: 2,
    color: "cyan",
    chartColor: "#06b6d4",
    volatility: 0.0005,
  },
]
