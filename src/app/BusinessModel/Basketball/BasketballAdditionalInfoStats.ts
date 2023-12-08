import { BasketballTeamPoints } from "./BasketballTeamPoints";

export class BasketballAdditionalInfoStats {

    ScoreForGamesHighestTeams: BasketballTeamPoints[];
    ScoreForGamesFewestTeams: BasketballTeamPoints[];
    ScoreAgainstGamesHighestTeams: BasketballTeamPoints[];
    ScoreAgainstGamesFewestTeams: BasketballTeamPoints[];

    constructor() {
        this.ScoreAgainstGamesFewestTeams = new Array<BasketballTeamPoints>();
        this.ScoreAgainstGamesHighestTeams = new Array<BasketballTeamPoints>();
        this.ScoreForGamesHighestTeams = new Array<BasketballTeamPoints>();
        this.ScoreForGamesFewestTeams = new Array<BasketballTeamPoints>();
    }
}