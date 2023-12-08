export interface IceHockeyH2HMatch {
    MatchId: number
    MatchDate: Date
    HomeTeamId: number
    AwayTeamId: number
    HomeTeamName: string
    AwayTeamName: string
    IsHomeWin: boolean
    IsAwayWin: boolean
    ScoreInfoTypeId: number
    HomeScore: string
    AwayScore: string
}