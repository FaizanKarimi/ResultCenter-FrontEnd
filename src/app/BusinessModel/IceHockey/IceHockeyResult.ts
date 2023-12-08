import { IceHockeyMatchScores } from "./IceHockeyMatchScores";
import { IceHockeyMatch } from "./IceHockeyMatch";

export class IceHockeyResult {
    SportId: number;
    IceHockeyContestGroups: Array<any>;
    IceHockeyResult() {
        this.SportId = 3;
        this.IceHockeyContestGroups = new Array<any>();
    }
}

class IceHockeyContestGroup {
    ContestGroupId: number;
    ContestGroupName: string;
    CountryId: number;
    CountryName: string;
    IceHockeyMatches: Array<IceHockeyMatch>;
}




