import { IceHockeyMatchScores } from "./IceHockeyMatchScores";

export class IceHockeyMatch {
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
    IceHockeyMatchScores: Array<IceHockeyMatchScores>;
}