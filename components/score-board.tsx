import { Trophy } from "lucide-react"

interface ScoreBoardProps {
  wins: number
  losses: number
}

export default function ScoreBoard({ wins, losses }: ScoreBoardProps) {
  const totalGames = wins + losses
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold">Your Score</h3>
        </div>
        <div className="text-sm text-gray-400">Win Rate: {winRate}%</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-3">
        <div className="bg-green-500/10 rounded p-2 text-center">
          <div className="text-green-400 text-sm font-medium">Wins</div>
          <div className="text-2xl font-bold">{wins}</div>
        </div>
        <div className="bg-red-500/10 rounded p-2 text-center">
          <div className="text-red-400 text-sm font-medium">Losses</div>
          <div className="text-2xl font-bold">{losses}</div>
        </div>
      </div>
    </div>
  )
}
