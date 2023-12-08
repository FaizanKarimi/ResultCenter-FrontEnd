export class BasketballH2HTeam {
    TeamId: number
    TotalPointForGame: number;
    TotalPointAgainstGame: number;
    PointForPerGame: number;
    PointAgainstPerGame: number;
    TotalMatches: number;

    constructor() {
        this.TotalMatches = 0;
        this.TotalPointForGame = 0;
        this.TotalPointAgainstGame = 0;
        this.PointForPerGame = 0;
        this.PointAgainstPerGame = 0;
    }
}