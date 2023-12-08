export interface LastFifteenMatchesModel {
    MatchId: number;
    MatchDate: string;
    MatchTime: string;
    HomeTeamId: number;
    HomeTeam: string;
    HomeTeamShortName: string;
    AwayTeamId: number;
    AwayTeam: string;
    AwayTeamShortName: string;
    HomeScore: string;
    AwayScore: string;
    CountryId: number;
    CountryName: string;
    ContestGroupId: number;
    ContestGroupName: string;
}