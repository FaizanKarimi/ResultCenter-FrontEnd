import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { BasketballH2HFormMatch } from "../../BusinessModel/Basketball/BasketballH2HFormMatch";
import { BasketballH2HTeamForStat } from "../../BusinessModel/Basketball/BasketballH2HTeamForStat";
import { BasketballH2HTeam } from "../../BusinessModel/Basketball/BasketballH2HTeam";

@Injectable()
export class H2hCalculationService {
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

      let matchObj: BasketballH2HFormMatch = {
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
      returnMatches.push(matchObj);
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
    let _teamObj: BasketballH2HTeamForStat;
    let _sortedTeamArray: any[];
    let _teamIndex: number;
    _sortedTeamArray = new Array<BasketballH2HTeam>();
    _teamObj = new BasketballH2HTeamForStat();
    _teamObj.TeamId = TeamId

    // Order by Goal for game
    _sortedTeamArray = _.orderBy(teamsArray, 'PointForPerGame', this._desc);
    _teamIndex = _.findIndex(_sortedTeamArray, function (t) {
      return t.TeamId == TeamId;
    });
    _teamObj.PointForPerGame = _sortedTeamArray[_teamIndex].PointForPerGame;
    _teamObj.PointForPerGamePosition = _teamIndex + 1; //Position is always index + 1

    //Order by Goal against game
    _sortedTeamArray = _.orderBy(teamsArray, 'PointAgainstPerGame', this._desc);
    _teamIndex = _.findIndex(_sortedTeamArray, function (t) {
      return t.TeamId == TeamId;
    });
    _teamObj.PointAgainstPerGame = _sortedTeamArray[_teamIndex].PointAgainstPerGame;
    _teamObj.PointAgainstPerGamePosition = _teamIndex + 1;

    return _teamObj
  }

  private _getTeamArray(matches: Array<any>) {
    let TeamsArray: BasketballH2HTeam[] = new Array<BasketballH2HTeam>();

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
        let teamObj: BasketballH2HTeam = new BasketballH2HTeam();
        teamObj.TeamId = match.HomeTeamId;
        teamObj.TotalPointForGame = parseInt(match.HomeScore);
        teamObj.TotalPointAgainstGame = parseInt(match.AwayScore);
        teamObj.TotalMatches = 1;
        teamObj.PointForPerGame = parseInt(match.HomeScore);
        teamObj.PointAgainstPerGame = parseInt(match.AwayScore);
        TeamsArray.push(teamObj);
      }

      //If Home Team is already in Teams Array then Update its value
      else if (_homeTeamIndex > -1) {
        let _index = _homeTeamIndex;
        let teamObj = TeamsArray[_index];
        teamObj.TotalMatches++;
        teamObj.TotalPointForGame += parseInt(match.HomeScore);
        teamObj.TotalPointAgainstGame += parseInt(match.AwayScore);
        teamObj.PointForPerGame = teamObj.TotalPointForGame / teamObj.TotalMatches;
        teamObj.PointAgainstPerGame = teamObj.TotalPointAgainstGame / teamObj.TotalMatches;
        TeamsArray[_index] = teamObj;
      }

      //If Away Team is not in Teams Array then push it
      if (_awayTeamIndex == -1) {
        let teamObj: BasketballH2HTeam = new BasketballH2HTeam();
        teamObj.TeamId = match.AwayTeamId;
        teamObj.TotalPointForGame = parseInt(match.AwayScore);
        teamObj.TotalPointAgainstGame = parseInt(match.HomeScore);
        teamObj.TotalMatches = 1;
        teamObj.PointForPerGame = parseInt(match.AwayScore);
        teamObj.PointAgainstPerGame = parseInt(match.HomeScore);
        TeamsArray.push(teamObj);
      }

      //If Home Team is already in Teams Array then update its values
      else if (_awayTeamIndex > -1) {
        let _index = _awayTeamIndex;
        let teamObj = TeamsArray[_index];
        teamObj.TotalMatches++;
        teamObj.TotalPointForGame += parseInt(match.AwayScore);
        teamObj.TotalPointAgainstGame += parseInt(match.HomeScore);
        teamObj.PointForPerGame = teamObj.TotalPointForGame / teamObj.TotalMatches;
        teamObj.PointAgainstPerGame = teamObj.TotalPointAgainstGame / teamObj.TotalMatches;
        TeamsArray[_index] = teamObj;
      }
    });
    return TeamsArray;
  }

}
