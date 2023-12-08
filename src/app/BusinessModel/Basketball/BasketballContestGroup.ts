import { BasketballMatch } from "./BasketballMatch";

export class BasketballContestGroup {
    ContestGroupId: number;
    ContestGroupName: string;
    CountryId: number;
    CountryName: string;
    BasketballMatches: Array<BasketballMatch>;
}