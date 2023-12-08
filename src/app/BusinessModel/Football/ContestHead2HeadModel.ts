import { ContestTeamsStatsModel } from "./ContestTeamsStatsModel";
import { Head2HeadMatchDetailModel } from "./Head2HeadMatchDetailModel";
import { LastFifteenMatchesModel } from "./LastFifteenMatchesModel";
import { LeagueTableModel } from "./LeagueTableModel";

export interface ContestHead2HeadModel {
    Head2HeadMatches: Head2HeadMatchDetailModel[];
    LastFifteenHomeMatches: LastFifteenMatchesModel[];
    LastFifteenAwayMatches: LastFifteenMatchesModel[];
    LeagueTable: LeagueTableModel;
    HomeTeamStatsMarkets: ContestTeamsStatsModel[];
    AwayTeamStatsMarkets: ContestTeamsStatsModel[];
}