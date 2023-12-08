import { MatchCompetitorModel } from "./MatchCompetitorModel";
import { MatchScoreModel } from "../Shared/MatchScoreModel";

export interface ContestMatchesModel {
    MatchId: number;
    MatchDate: string;
    MatchTime: string;
    MatchStatusId: number;
    MatchStatus: string;
    FirstToServe: string;
    CurrentMinutes: string;
    HomeTeam: MatchCompetitorModel;
    AwayTeam: MatchCompetitorModel;
    MatchScore: MatchScoreModel;
}