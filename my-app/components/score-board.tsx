import { Trophy } from "lucide-react"
import "@/styles/scoreboard.css"

interface ScoreBoardProps {
  wins: number
  losses: number
}

export default function ScoreBoard({ wins, losses }: ScoreBoardProps) {
  const totalGames = wins + losses
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0

  return (
    <div className="scoreboard">
      <div className="scoreboard-header">
        <div className="scoreboard-title">
          <Trophy className="trophy-icon" />
          <h3>Your Score</h3>
        </div>
        <div className="win-rate">Win Rate: {winRate}%</div>
      </div>

      <div className="score-stats">
        <div className="stat-box wins">
          <div className="stat-label">Wins</div>
          <div className="stat-value">{wins}</div>
        </div>
        <div className="stat-box losses">
          <div className="stat-label">Losses</div>
          <div className="stat-value">{losses}</div>
        </div>
      </div>
    </div>
  )
}
