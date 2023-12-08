export class TennisStats {
SeasonName:string;
Teams:Array<TennisStatsTeam>;
TennisStats()
{
    this.Teams= new Array<TennisStatsTeam>();
}
}
export class TennisStatsTeam
{
    SerialNo:number;
    TeamName:string;
    Points:string;

}