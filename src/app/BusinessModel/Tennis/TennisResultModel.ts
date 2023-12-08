import {TennisContestGroup} from './TennisContestGroupModel'
export class TennisResult {
SportId:number;
SportName:string;
ContestGroups:Array<TennisContestGroup>;
TennisResult()
{
 this.ContestGroups = new Array()
    
}
}