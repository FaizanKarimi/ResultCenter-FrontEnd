import { TennisMatchModel } from './TennisMatchModel'
export class TennisContestGroup {
    CountryId: number;
    CountryName: string;
    ContestGroupId: number;
    ContestGroupName: string;
    LeagueName: string;
    ContestType: string;
    OrgName: string;
    Matches: TennisMatchModel[];
}