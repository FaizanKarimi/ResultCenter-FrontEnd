import { IceHockeyMatchScores } from "./IceHockeyMatchScores";

export class IceHockeyMatchesByRound {
  MatchId: number;
  MatchDate: Date;
  ContestGroupRoundId: number;
  MatchStatusId: number;
  HomeTeamId: number;
  AwayTeamId: number;
  HomeTeamName: string;
  AwayTeamName: string;
  HomeTeamWin: boolean;
  AwayTeamWin: boolean;
  IceHockeyMatchScores: Array<IceHockeyMatchScores>;
}