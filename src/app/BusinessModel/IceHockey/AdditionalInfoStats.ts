import { TeamForStats } from "./TeamForStats";

export class AdditionalInfoStats {
    GoalsForGamesHighestTeams: TeamForStats[];
    GoalsForGamesFewestTeams: TeamForStats[];
    GoalsAgainstGamesHighestTeams: TeamForStats[];
    GoalsAgainstGamesFewestTeams: TeamForStats[];

    //Initializing Interfaces to avoid undefined exception while pushing data
    constructor() {
        this.GoalsAgainstGamesFewestTeams = new Array<TeamForStats>();
        this.GoalsAgainstGamesHighestTeams = new Array<TeamForStats>();
        this.GoalsForGamesHighestTeams = new Array<TeamForStats>();
        this.GoalsForGamesFewestTeams = new Array<TeamForStats>();
    }
}