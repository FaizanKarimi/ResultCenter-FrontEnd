import { LeagueTableMatchesModel } from "./LeagueTableMatchesModel";

export interface LeagueTableCompetitorModel {
    LeagueTableCompetitorId: number;
    TeamId: number;
    Team: string
    Place: number;
    LeagueTablesMatches: LeagueTableMatchesModel[]
}