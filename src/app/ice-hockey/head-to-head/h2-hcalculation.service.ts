import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { IceHockeyH2HTeam } from "../../BusinessModel/IceHockey/IceHockeyH2HTeam";
import { IceHockeyH2HMatch } from "../../BusinessModel/IceHockey/IceHockeyH2HMatch";
import { IceHockeyH2HTeamForStat } from "../../BusinessModel/IceHockey/IceHockeyH2HTeamForStat";

@Injectable()
export class H2HcalculationService {
  private _desc: string = 'desc'

  constructor() { }

  getH2HFormMatches(TeamId: number, matches: any) {
    let isThisTeamWin: boolean;
    let thisTeamResult: string;
    let returnMatches: any = new Array<any>();

    //Filtering only matches of this specific team
    let thisTeamMatches = _.filter(matches, function (match) {
      return match.HomeTeamId == TeamId || match.AwayTeamId == TeamId;
    })

    // select top 6 matches
    thisTeamMatches = _.take(thisTeamMatches, 6);

    //Checking if current team is playing as home or away 
    //then adding new attributes to team obj for rendering in view.
    _.map(thisTeamMatches, function (match) {
      if (TeamId == match.HomeTeamId) {
        isThisTeamWin = match.IsHomeWin;
        thisTeamResult = match.IsHomeWin ? 'W' : 'L';
      }
      else if (TeamId == match.AwayTeamId) {
        isThisTeamWin = match.IsAwayWin;
        thisTeamResult = match.IsAwayWin ? 'W' : 'L';
      }

      let obj = {
        MatchId: match.MatchId,
        MatchDate: match.MatchDate,
        HomeTeamName: match.HomeTeamName,
        AwayTeamName: match.AwayTeamName,
        isThisTeamWin: isThisTeamWin,
        thisTeamResult: thisTeamResult,
        ScoreInfoTypeId: match.ScoreInfoTypeId,
        HomeScore: match.HomeScore,
        AwayScore: match.AwayScore,
        IsHomeWin: match.IsHomeWin,
        IsAwayWin: match.IsAwayWin
      };
      returnMatches.push(obj);
    });
    return returnMatches;
  }

  getH2HStatsforTeam(HomeTeamId: number, AwayTeamId: number, matches: any) {

    let TeamsArray = this._getTeamArray(matches);
    let homeTeamStats = this._getH2HTeamStat(HomeTeamId, TeamsArray);
    let awayTeamStats = this._getH2HTeamStat(AwayTeamId, TeamsArray);
    return {
      homeTeamStats: homeTeamStats,
      awayTeamStats: awayTeamStats
    };
  }

  private _getH2HTeamStat(TeamId: number, teamsArray: any) {
    let _teamObj: IceHockeyH2HTeamForStat;
    let _sortedTeamArray: IceHockeyH2HTeam[];
    let _teamIndex: number;
    _sortedTeamArray = new Array<IceHockeyH2HTeam>();
    _teamObj = new IceHockeyH2HTeamForStat();
    _teamObj.TeamId = TeamId

    // Order by Goal for game
    _sortedTeamArray = _.orderBy(teamsArray, 'GoalForPerGame', this._desc);
    _teamIndex = _.findIndex(_sortedTeamArray, function (t) {
      return t.TeamId == TeamId;
    });
    _teamObj.GoalForPerGame = _sortedTeamArray[_teamIndex].GoalForPerGame;
    _teamObj.GoalForPerGamePosition = _teamIndex + 1; //Position is always index + 1

    //Order by Goal against game
    _sortedTeamArray = _.orderBy(teamsArray, 'GoalAgainstPerGame', this._desc);
    _teamIndex = _.findIndex(_sortedTeamArray, function (t) {
      return t.TeamId == TeamId;
    });
    _teamObj.GoalAgainstPerGame = _sortedTeamArray[_teamIndex].GoalAgainstPerGame;
    _teamObj.GoalAgainstPerGamePosition = _teamIndex + 1;

    //Order by Over 4.5
    _sortedTeamArray = _.orderBy(teamsArray, 'Over4Percentage', this._desc);
    _teamIndex = _.findIndex(_sortedTeamArray, function (t) {
      return t.TeamId == TeamId;
    });
    _teamObj.Over4Percentage = _sortedTeamArray[_teamIndex].Over4Percentage;
    _teamObj.Over4PercentagePosition = _teamIndex + 1;

    //Order by Over 5.5
    _sortedTeamArray = _.orderBy(teamsArray, 'Over5Percentage', this._desc);
    _teamIndex = _.findIndex(_sortedTeamArray, function (t) {
      return t.TeamId == TeamId;
    });
    _teamObj.Over5Percentage = _sortedTeamArray[_teamIndex].Over5Percentage;
    _teamObj.Over5PercentagePosition = _teamIndex + 1;

    //Order by Over 6.5
    _sortedTeamArray = _.orderBy(teamsArray, 'Over6Percentage', this._desc);
    _teamIndex = _.findIndex(_sortedTeamArray, function (t) {
      return t.TeamId == TeamId;
    });
    _teamObj.Over6Percentage = _sortedTeamArray[_teamIndex].Over6Percentage;
    _teamObj.Over6PercentagePosition = _teamIndex + 1;

    return _teamObj
  }

  private _getTeamArray(matches: Array<IceHockeyH2HMatch>) {
    let TeamsArray: IceHockeyH2HTeam[] = new Array<IceHockeyH2HTeam>();

    _.map(matches, function (match) {

      //Find the Index of home team id in Teams array
      let _homeTeamIndex = _.findIndex(TeamsArray, function (t) {
        return t.TeamId == match.HomeTeamId;
      });

      //Find the Index of Away team id in Teams array
      let _awayTeamIndex = _.findIndex(TeamsArray, function (t) {
        return t.TeamId == match.AwayTeamId;
      });

      //If Home Team is not in Teams Array then push it
      if (_homeTeamIndex == -1) {
        let teamObj: IceHockeyH2HTeam = new IceHockeyH2HTeam();
        teamObj.TeamId = match.HomeTeamId;
        teamObj.TotalGoalForGame = parseInt(match.HomeScore);
        teamObj.TotalGoalAgainstGame = parseInt(match.AwayScore);
        teamObj.TotalMatches = 1;
        teamObj.GoalForPerGame = parseInt(match.HomeScore);
        teamObj.GoalAgainstPerGame = parseInt(match.AwayScore);
        teamObj.Over4 = parseInt(match.HomeScore) + parseInt(match.AwayScore) > 4.5 ? 1 : 0;
        teamObj.Over4Percentage = teamObj.Over4 * 100;
        teamObj.Over5 = parseInt(match.HomeScore) + parseInt(match.AwayScore) > 5.5 ? 1 : 0;
        teamObj.Over5Percentage = teamObj.Over5 * 100;
        teamObj.Over6 = parseInt(match.HomeScore) + parseInt(match.AwayScore) > 6.5 ? 1 : 0;
        TeamsArray.push(teamObj);
      }

      //If Home Team is already in Teams Array then Update its value
      else if (_homeTeamIndex > -1) {
        let _index = _homeTeamIndex;
        let teamObj = TeamsArray[_index];
        teamObj.TotalMatches++;
        teamObj.TotalGoalForGame += parseInt(match.HomeScore);
        teamObj.TotalGoalAgainstGame += parseInt(match.AwayScore);
        teamObj.GoalForPerGame = teamObj.TotalGoalForGame / teamObj.TotalMatches;
        teamObj.GoalAgainstPerGame = teamObj.TotalGoalAgainstGame / teamObj.TotalMatches;
        teamObj.Over4 = parseInt(match.HomeScore) + parseInt(match.AwayScore) > 4.5 ? teamObj.Over4 + 1 : teamObj.Over4;
        teamObj.Over4Percentage = teamObj.Over4 / teamObj.TotalMatches * 100;
        teamObj.Over5 = parseInt(match.HomeScore) + parseInt(match.AwayScore) > 5.5 ? teamObj.Over5 + 1 : teamObj.Over5;
        teamObj.Over5Percentage = teamObj.Over5 / teamObj.TotalMatches * 100;
        teamObj.Over6 = parseInt(match.HomeScore) + parseInt(match.AwayScore) > 6.5 ? teamObj.Over6 + 1 : teamObj.Over6;
        teamObj.Over6Percentage = teamObj.Over6 / teamObj.TotalMatches * 100;
        TeamsArray[_index] = teamObj;
      }

      //If Away Team is not in Teams Array then push it
      if (_awayTeamIndex == -1) {
        let teamObj: IceHockeyH2HTeam = new IceHockeyH2HTeam();
        teamObj.TeamId = match.AwayTeamId;
        teamObj.TotalGoalForGame = parseInt(match.AwayScore);
        teamObj.TotalGoalAgainstGame = parseInt(match.HomeScore);
        teamObj.TotalMatches = 1;
        teamObj.GoalForPerGame = parseInt(match.AwayScore);
        teamObj.GoalAgainstPerGame = parseInt(match.HomeScore);
        teamObj.Over4 = parseInt(match.AwayScore) + parseInt(match.HomeScore) > 4.5 ? 1 : 0;
        teamObj.Over4Percentage = teamObj.Over4 * 100;
        teamObj.Over5 = parseInt(match.AwayScore) + parseInt(match.HomeScore) > 5.5 ? 1 : 0;
        teamObj.Over5Percentage = teamObj.Over5 * 100;
        teamObj.Over6 = parseInt(match.AwayScore) + parseInt(match.HomeScore) > 6.5 ? 1 : 0;
        TeamsArray.push(teamObj);
      }

      //If Home Team is already in Teams Array then update its values
      else if (_awayTeamIndex > -1) {
        let _index = _awayTeamIndex;
        let teamObj = TeamsArray[_index];
        teamObj.TotalMatches++;
        teamObj.TotalGoalForGame += parseInt(match.AwayScore);
        teamObj.TotalGoalAgainstGame += parseInt(match.HomeScore);
        teamObj.GoalForPerGame = teamObj.TotalGoalForGame / teamObj.TotalMatches;
        teamObj.GoalAgainstPerGame = teamObj.TotalGoalAgainstGame / teamObj.TotalMatches;
        teamObj.Over4 = parseInt(match.AwayScore) + parseInt(match.HomeScore) > 4.5 ? teamObj.Over4 + 1 : teamObj.Over4;
        teamObj.Over4Percentage = teamObj.Over4 / teamObj.TotalMatches * 100;
        teamObj.Over5 = parseInt(match.AwayScore)  + parseInt(match.HomeScore)> 5.5 ? teamObj.Over5 + 1 : teamObj.Over5;
        teamObj.Over5Percentage = teamObj.Over5 / teamObj.TotalMatches * 100;
        teamObj.Over6 = parseInt(match.AwayScore) + parseInt(match.HomeScore) > 6.5 ? teamObj.Over6 + 1 : teamObj.Over6;
        teamObj.Over6Percentage = teamObj.Over6 / teamObj.TotalMatches * 100;
        TeamsArray[_index] = teamObj;
      }
    });
    return TeamsArray;
  }
}
