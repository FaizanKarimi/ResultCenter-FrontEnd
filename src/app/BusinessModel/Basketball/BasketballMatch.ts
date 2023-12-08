import { BasketballMatchScores } from "./BasketballMatchScores";

export class BasketballMatch {
    MatchId: number
    MatchDate: Date;
    MatchStatusId: number;
    MatchStatus: string;
    HomeTeamId: number;
    AwayTeamId: number;
    HomeTeamName: string;
    AwayTeamName: string;
    HomeTeamWin: boolean;
    AwayTeamWin: boolean;
    BasketballMatchScores: Array<BasketballMatchScores>;
}