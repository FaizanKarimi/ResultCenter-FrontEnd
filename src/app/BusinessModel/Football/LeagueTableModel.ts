import { LeagueTableCompetitorModel } from "./LeagueTableCompetitorModel";

export interface LeagueTableModel {
    MatchId: number;
    LeagueTableId: number;
    ContestGroupId: number;
    SeasonId: number
    LeagueCompetitors: LeagueTableCompetitorModel[];
}