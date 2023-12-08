
import { BasketballContestGroup } from "./BasketballContestGroup";

export class BasketballResult {
    SportId: number;
    BasketballContestGroups: Array<BasketballContestGroup>;
    BasketballResult() {
        this.SportId = 3;
        this.BasketballContestGroups = new Array<BasketballContestGroup>();
    }
}


