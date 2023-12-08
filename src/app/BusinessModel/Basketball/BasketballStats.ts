import { BasketballMatchResultForStat } from "./BasketballMatchResultForStat";
import { BasketballPointPerGame } from "./BasketballPointPerGame";
import { BasketballAdditionalInfoStats } from "./BasketballAdditionalInfoStats";

export class BasketballStats {
    SeasonName: string;
    MatchResults: BasketballMatchResultForStat;
    PointsPerGame: BasketballPointPerGame;
    AdditionalInfo: BasketballAdditionalInfoStats;
}