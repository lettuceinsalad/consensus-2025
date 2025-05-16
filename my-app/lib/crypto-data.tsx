import { Bitcoin, EclipseIcon, Waves, Gem, Dog, Landmark, Hexagon, CircleDollarSign } from "lucide-react"
import type { ReactNode } from "react"

export interface Cryptocurrency {
  id: string
  name: string
  icon: ReactNode
  coingeckoId: string
  fallbackPrice: number
  decimals: number
  color: string
  cssColor: string
  chartColor: string
  volatility: number
}

export const cryptoList: Cryptocurrency[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    icon: <Bitcoin />,
    coingeckoId: "bitcoin",
    fallbackPrice: 67000,
    decimals: 2,
    color: "orange",
    cssColor: "#f59e0b",
    chartColor: "#f59e0b",
    volatility: 0.0003,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    icon: <EclipseIcon />,
    coingeckoId: "ethereum",
    fallbackPrice: 3200,
    decimals: 2,
    color: "purple",
    cssColor: "#8b5cf6",
    chartColor: "#8b5cf6",
    volatility: 0.0004,
  },
  {
    id: "solana",
    name: "Solana",
    icon: <Waves />,
    coingeckoId: "solana",
    fallbackPrice: 140,
    decimals: 2,
    color: "emerald",
    cssColor: "#10b981",
    chartColor: "#10b981",
    volatility: 0.0006,
  },
  {
    id: "cardano",
    name: "Cardano",
    icon: <Hexagon />,
    coingeckoId: "cardano",
    fallbackPrice: 0.45,
    decimals: 4,
    color: "blue",
    cssColor: "#3b82f6",
    chartColor: "#3b82f6",
    volatility: 0.0005,
  },
  {
    id: "dogecoin",
    name: "Dogecoin",
    icon: <Dog />,
    coingeckoId: "dogecoin",
    fallbackPrice: 0.15,
    decimals: 4,
    color: "yellow",
    cssColor: "#eab308",
    chartColor: "#eab308",
    volatility: 0.0008,
  },
  {
    id: "polkadot",
    name: "Polkadot",
    icon: <Gem />,
    coingeckoId: "polkadot",
    fallbackPrice: 6.8,
    decimals: 2,
    color: "pink",
    cssColor: "#ec4899",
    chartColor: "#ec4899",
    volatility: 0.0005,
  },
  {
    id: "ripple",
    name: "XRP",
    icon: <CircleDollarSign />,
    coingeckoId: "ripple",
    fallbackPrice: 0.52,
    decimals: 4,
    color: "sky",
    cssColor: "#0ea5e9",
    chartColor: "#0ea5e9",
    volatility: 0.0004,
  },
  {
    id: "chainlink",
    name: "Chainlink",
    icon: <Landmark />,
    coingeckoId: "chainlink",
    fallbackPrice: 14.2,
    decimals: 2,
    color: "cyan",
    cssColor: "#06b6d4",
    chartColor: "#06b6d4",
    volatility: 0.0005,
  },
]
