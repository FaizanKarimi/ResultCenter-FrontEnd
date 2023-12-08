export class IceHockeyH2HTeam {
    TeamId: number
    TotalGoalForGame: number;
    TotalGoalAgainstGame: number;
    GoalForPerGame: number;
    GoalAgainstPerGame: number;
    Over4: number;
    Over4Percentage: number;
    Over5: number;
    Over5Percentage: number;
    Over6: number;
    Over6Percentage: number;
    TotalMatches: number;

    constructor() {
        this.TotalMatches = 0;
        this.TotalGoalForGame = 0;
        this.TotalGoalAgainstGame = 0;
        this.GoalForPerGame = 0;
        this.GoalAgainstPerGame = 0;
        this.Over4 = 0;
        this.Over4Percentage = 0;
        this.Over5 = 0;
        this.Over5Percentage = 0;
        this.Over6 = 0;
        this.Over6Percentage = 0;
    }

}