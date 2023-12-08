
import { LongestActiveStreaks } from "./LongestActiveStreaks";

export interface ContestGroupStatsModel {
    CountryId: number;
    CountryName: string;
    ContestGroupId: number;
    ContestGroupName: string;
    SeasonId: number;
    SeasonName: string;

    HomeResult: number;
    DrawResult: number;
    AwayResult: number;

    TotalAvg: number;
    HomeAvg: number;
    AwayAvg: number;
    Over15Value: number;
    Over25Value: number;
    Over35Value: number;

    TeamId_HighestGoalsPerMatch: number
    Team_HighestGoalsPerMatch: string;
    Highest_HighestGoalsPerMatch: number;

    TeamId_LowestGoalsPerMatch: number
    Team_LowestGoalsPerMatch: string;
    Highest_LowestGoalsPerMatch: number

    Over05Value1H: number;
    Over15Value1H: number;
    Over25Value1H: number;

    TeamId_HighestGoalsPerMatchIn1stHalf: number;
    Team_HighestGoalsPerMatchIn1stHalf: string;
    Highest_HighestGoalsPerMatchIn1stHalf: number;

    TeamId_LowestGoalsPerMatchIn1stHalf: number;
    Team_LowestGoalsPerMatchIn1stHalf: string;
    Highest_LowestGoalsPerMatchIn1stHalf: number;

    BTTSPercentage: number;

    TeamId_BothTeamsToScore1: number;
    Team_BothTeamsToScore1: any;
    Highest_BothTeamsToScore1: number;
    MatchesPlayed_BothTeamsToScore1: number;
    TeamId_BothTeamsToScore2: number;
    Team_BothTeamsToScore2: any;
    Highest_BothTeamsToScore2: number;
    MatchesPlayed_BothTeamsToScore2: number;
    TeamId_BothTeamsToScore3: number;
    Team_BothTeamsToScore3: number;
    Highest_BothTeamsToScore3: number;
    MatchesPlayed_BothTeamsToScore3: any;

    TeamId_LowestBothTeamsToScore1: any;
    Team_LowestBothTeamsToScore1: any;
    Highest_LowestBothTeamsToScore1: any;
    MatchesPlayed_LowestBothTeamsToScore1: any;

    TeamId_HighestCleanSheets1: any;
    Team_HighestCleanSheets1: any;
    Highest_HighestCleanSheets1: number;
    MatchesPlayed_HighestCleanSheets1: any;
    TeamId_HighestCleanSheets2: any;
    Team_HighestCleanSheets2: any;
    Highest_HighestCleanSheets2: number;
    MatchesPlayed_HighestCleanSheets2: any;

    TeamId_LowestCleanSheets1: any;
    Team_LowestCleanSheets1: any;
    Highest_LowestCleanSheets1: number;
    MatchesPlayed_LowestCleanSheets1: any;

    TeamId_HighestFailedToScore1: any;
    Team_HighestFailedToScore1: any;
    Highest_HighestFailedToScore1: number;
    MatchesPlayed_HighestFailedToScore1: any;

    TeamId_LowestFailedToScore1: any;
    Team_LowestFailedToScore1: any;
    Highest_LowestFailedToScore1: number;
    MatchesPlayed_LowestFailedToScore1: any;

    TeamId_HighestScoreTheFirstGoal1: any;
    Team_HighestScoreTheFirstGoal1: any;
    Highest_HighestScoreTheFirstGoal1: number;
    MatchesPlayed_HighestScoreTheFirstGoal1: any;

    TeamId_FewestScoreTheFirstGoal1: any;
    Team_FewestScoreTheFirstGoal1: any;
    Highest_FewestScoreTheFirstGoal1: number;
    MatchesPlayed_FewestScoreTheFirstGoal1: any;

    TeamId_HighestConsecutiveLoses1: any;
    Team_HighestConsecutiveLoses1: any;
    Highest_HighestConsecutiveLoses1: number;
    MatchesPlayed_HighestConsecutiveLoses1: any;

    TeamId_HighestConsecutiveWins1: any;
    Team_HighestConsecutiveWins1: any;
    Highest_HighestConsecutiveWins1: number;
    MatchesPlayed_HighestConsecutiveWins1: any;

    TeamId_HighestConsecutiveWinsAsHome1: any;
    Team_HighestConsecutiveWinsAsHome1: any;
    Highest_HighestConsecutiveWinsAsHome1: number;
    MatchesPlayed_HighestConsecutiveWinsAsHome1: any;

    TeamId_HighestConsecutiveWinsAsAway1: any;
    Team_HighestConsecutiveWinsAsAway1: any;
    Highest_HighestConsecutiveWinsAsAway1: number;
    MatchesPlayed_HighestConsecutiveWinsAsAway1: any;

    TeamId_MatchesSinceLastWin1: any;
    Team_MatchesSinceLastWin1: any;
    Highest_MatchesSinceLastWin1: number;
    MatchesPlayed_MatchesSinceLastWin1: any;

    TeamId_Unbeaten1: any;
    Team_Unbeaten1: any;
    Highest_Unbeaten1: number;
    MatchesPlayed_Unbeaten1: any;
    LongestActiveStreaks: LongestActiveStreaks[];
}