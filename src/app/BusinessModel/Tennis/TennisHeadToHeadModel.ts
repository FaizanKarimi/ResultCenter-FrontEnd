export class TennisHeadToHeadDBModel {
    TennisTeamsH2H: TennisTeamsH2H;
    TeamBio: Array<TennisHeadToHeadTeamBioDBModel>;
    Team1RecentWins: Array<TennisHeadToHeadTeamRecentWinningDBModel>;
    Team2RecentWins: Array<TennisHeadToHeadTeamRecentWinningDBModel>;

    TennisHeadToHeadDBModel() {
        this.TennisTeamsH2H = new TennisTeamsH2H();
        this.TeamBio = new Array<TennisHeadToHeadTeamBioDBModel>();
        this.Team1RecentWins = new Array<TennisHeadToHeadTeamRecentWinningDBModel>();
        this.Team2RecentWins = new Array<TennisHeadToHeadTeamRecentWinningDBModel>();
    }
}

class TennisTeamsH2H {
    TotalMatchesPlayed: number;
    FirstWon: number;
    SecondWon: number;
}

class TennisHeadToHeadTeamBioDBModel {
    TeamId: number;
    TeamName: string;
    Age: number;
    CountryOfBirth: string;
    HomeAway: boolean;
    SingleRanking: number;
    RaceToLondon: string;
    CareerSingleTitle: string;
    YTDMatchesLost: string;
    YTDMatchWon: string;
    CareerMatchesWon: string;
    CareerMatchesLost: string;
}

class TennisHeadToHeadTeamRecentWinningDBModel {
    MatchId: number;
    MatchDate: string;
    HomeTeamId: number;
    HomeTeamName: string;
    AwayTeamId: number;
    AwayTeamName: string;
    HomeScore: number;
    AwayScore: number
}