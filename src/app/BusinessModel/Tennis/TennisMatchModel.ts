
import { MatchScoreModel } from "../Shared/MatchScoreModel";

export interface TennisMatchModel {
    MatchId: number;
    MatchStatus: string;
    MatchDate: string;
    HomeTeamId: number;
    HomeTeamName: string;
    AwayTeamId: number;
    AwayTeamName: string;
    MatchStatusId: number;
    HomeTeamWin: boolean;
    AwaTeamWin: boolean;
    MatchScores: MatchScoreModel[];
}