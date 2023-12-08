import { ContestMatchesModel } from "./ContestMatchesModel";

export interface IContestGroupModel {

    SportId: number;
    CountryId: number;
    CountryName: string;
    ContestGroupId: number;
    ContestGroup: string
    ContestGroupShortName: string
    Matches: ContestMatchesModel[]
}