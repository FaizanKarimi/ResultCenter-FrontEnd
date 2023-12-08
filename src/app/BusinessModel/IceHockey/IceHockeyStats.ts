import { GoalsPerMatchStats } from "./GoalsPerMatchStats";
import { FirstPeriodGoalsPerMatchStats } from "./FirstPeriodGoalsPerMatchStats";
import { BothTeamsOver2Stats } from "./BothTeamsOver2";
import { MatchResultsStats } from "./MatchResultsStats";
import { AdditionalInfoStats } from "./AdditionalInfoStats";

export class IceHockeyStats {
    SeasonName: string;
    GoalsPerMatch: GoalsPerMatchStats;
    FirstPeriodGoalsPerMatch: FirstPeriodGoalsPerMatchStats;
    BothTeamsOver2: BothTeamsOver2Stats;
    MatchResults: MatchResultsStats;
    AdditionalInfo: AdditionalInfoStats;

    constructor() {
        this.AdditionalInfo = new AdditionalInfoStats();
    }
}
