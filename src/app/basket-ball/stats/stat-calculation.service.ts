import { Injectable } from '@angular/core';
import { BasketballStats } from "../../BusinessModel/Basketball/BasketballStats";
import { BasketballTeamForStat } from "../../BusinessModel/Basketball/BasketballTeamForStat";
import * as _ from 'lodash';
import { BasketballMatchResultForStat } from "../../BusinessModel/Basketball/BasketballMatchResultForStat";
import { BasketballPointPerGame } from "../../BusinessModel/Basketball/BasketballPointPerGame";
import { BasketballAdditionalInfoStats } from "../../BusinessModel/Basketball/BasketballAdditionalInfoStats";
import { BasketballTeamPoints } from "../../BusinessModel/Basketball/BasketballTeamPoints";
@Injectable()
export class StatCalculationService {

  basketballStatObj: BasketballStats;
  TeamsArray: BasketballTeamForStat[];

  constructor() {
    this.basketballStatObj = new BasketballStats();
    this.TeamsArray = new Array<BasketballTeamForStat>();
  }

  getCalculatedStats(matches: any) {
    this.TeamsArray = this._getTeamsArray(matches);
    this.basketballStatObj.SeasonName = matches[0].SeasonName + ' Season';
    this.basketballStatObj.MatchResults = this._getMatchResult(matches);
    this.basketballStatObj.PointsPerGame = this._getPointsPerGame(matches);
    this.basketballStatObj.AdditionalInfo = this._getAdditionalInfo(matches);
    return this.basketballStatObj;
  }

  private _getMatchResult(matches: any) {
    let _totalMatches = matches.length;
    let _homeWinners = _.filter(matches, function (m) { return m.HomeTeamWin; }).length;
    let _homeWinnerPercentage = Math.floor((_homeWinners / _totalMatches) * 100);
    let _awayWinnerPercentage = _homeWinnerPercentage > 0 ? 100 - _homeWinnerPercentage : 0;

    const _matchResults: BasketballMatchResultForStat = {
      homeWinnerPercentage: _homeWinnerPercentage,
      awayWinnerPercentage: _awayWinnerPercentage,
    };
    return _matchResults;
  }

  private _getPointsPerGame(matches: any) {
    let _totalMatches = matches.length;
    let _sumTotalHomeScore = _.sumBy(matches, 'TotalHomeScore');
    let _totalHomeScorePerMatch = _sumTotalHomeScore / _totalMatches;
    let _sumTotalAwayScore = _.sumBy(matches, 'TotalAwayScore');
    let _totalAwayScorePermatch = _sumTotalAwayScore / _totalMatches;
    let _sumTotalScore = _.sumBy(matches, 'TotalPoints');
    let _totalScorePerMatch = _sumTotalScore / _totalMatches;

    //finding Highest and Lowest teams
    let _highestGoalPerMatch = _.maxBy(this.TeamsArray, 'TotalScorePerMatch');
    let _lowestGoalPerMatch = _.minBy(this.TeamsArray, 'TotalScorePerMatch');

    const _ScorePerMatchStats: BasketballPointPerGame =
      {
        totalScorePerMatch: _totalScorePerMatch,
        totalHomeScorePerMatch: _totalHomeScorePerMatch,
        totalAwayScorePerMatch: _totalAwayScorePermatch,
        highestScorePerMatchTeamName: _highestGoalPerMatch.TeamName,
        highestScorePerMatchScore: _highestGoalPerMatch.TotalScorePerMatch,
        lowestScorePerMatchTeamName: _lowestGoalPerMatch.TeamName,
        lowestScorePerMatchScore: _lowestGoalPerMatch.TotalScorePerMatch
      };
    return _ScorePerMatchStats;

  }

  private _getAdditionalInfo(matches: any) {
    let _additionalInfo: BasketballAdditionalInfoStats = new BasketballAdditionalInfoStats();
    let _totalMatches = matches.length;

    //Sorting Array to get Highest and Lowest Goals Per Match 
    const _sortedTeamArrayForScorePerMatch = _.orderBy(this.TeamsArray, 'TotalScorePerMatch', 'desc');

    //Getting Top 2 Teams 
    const _topTeamsOfScorePerMatch = _.take(_sortedTeamArrayForScorePerMatch, 2);

    //Getting Least 2 Teams 
    const _leastTeamsOfScorePerMatch = _.takeRight(_sortedTeamArrayForScorePerMatch, 2);

    //Sorting Array to get Highest and Lowest Goals against Per Match
    const _sortedTeamArrayForScoreAgainstPerMatch = _.orderBy(this.TeamsArray, 'TotalAgainstScorePerMatch', 'desc');
    const _topTeamsOfScoreAgainstPerMatch = _.take(_sortedTeamArrayForScoreAgainstPerMatch, 2);
    const _leastTeamsOfScoreAgainstPerMatch = _.takeRight(_sortedTeamArrayForScoreAgainstPerMatch, 2);

    //Assigning values for highest team of goal for Game
    _.map(_topTeamsOfScorePerMatch, function (team) {
      let _team: BasketballTeamPoints = {
        TeamName: team.TeamName,
        TeamStats: team.TotalScorePerMatch
      };
      _additionalInfo.ScoreForGamesHighestTeams.push(_team);
    });

    //Assigning values for fewest team of goal for Game
    _.map(_leastTeamsOfScorePerMatch, function (team) {
      let _team: BasketballTeamPoints = {
        TeamName: team.TeamName,
        TeamStats: team.TotalScorePerMatch
      };
      _additionalInfo.ScoreForGamesFewestTeams.push(_team);
    });

    //Assigning values for highest team of goal Against Game
    _.map(_topTeamsOfScoreAgainstPerMatch, function (team) {
      let _team: BasketballTeamPoints = {
        TeamName: team.TeamName,
        TeamStats: team.TotalAgainstScorePerMatch
      };
      _additionalInfo.ScoreAgainstGamesHighestTeams.push(_team);
    });

    //Assigning values for fewest team of goal Against Game
    _.map(_leastTeamsOfScoreAgainstPerMatch, function (team) {
      let _team: BasketballTeamPoints = {
        TeamName: team.TeamName,
        TeamStats: team.TotalAgainstScorePerMatch
      };
      _additionalInfo.ScoreAgainstGamesFewestTeams.push(_team);
    });

    return _additionalInfo;;
  }

  private _getTeamsArray(matches: any) {
    let TeamsArray = new Array<BasketballTeamForStat>();

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
        let teamObj: BasketballTeamForStat = new BasketballTeamForStat();
        teamObj.TeamId = match.HomeTeamId;
        teamObj.TeamName = match.HomeTeamName;
        teamObj.TotalScore = match.TotalHomeScore;
        teamObj.TotalAgainstScore = match.TotalAwayScore;
        teamObj.Matches = 1;
        teamObj.TotalAgainstScorePerMatch = match.TotalAwayScore
        teamObj.TotalScorePerMatch = match.TotalHomeScore;
        TeamsArray.push(teamObj);
      }

      //If Home Team is already in Teams Array then Update its value
      else if (_homeTeamIndex > -1) {
        let _index = _homeTeamIndex;
        let teamObj = TeamsArray[_index];
        teamObj.Matches++;
        teamObj.TotalScore += match.TotalHomeScore;
        teamObj.TotalAgainstScore += match.TotalAwayScore;
        teamObj.TotalAgainstScorePerMatch = +teamObj.TotalAgainstScore / teamObj.Matches;
        teamObj.TotalScorePerMatch = teamObj.TotalScore / teamObj.Matches;
        TeamsArray[_index] = teamObj;
      }

      //If Away Team is not in Teams Array then push it
      if (_awayTeamIndex == -1) {
        let teamObj: BasketballTeamForStat = new BasketballTeamForStat();
        teamObj.TeamId = match.AwayTeamId;
        teamObj.TeamName = match.AwayTeamName;
        teamObj.TotalScore = match.TotalAwayScore;
        teamObj.TotalAgainstScore = match.TotalHomeScore;
        teamObj.Matches = 1;
        teamObj.TotalAgainstScorePerMatch = match.TotalHomeScore
        teamObj.TotalScorePerMatch = match.TotalAwayScore;
        TeamsArray.push(teamObj);
      }

      //If Home Team is already in Teams Array then update its values
      else if (_awayTeamIndex > -1) {
        let _index = _awayTeamIndex;
        let teamObj = TeamsArray[_index];
        teamObj.Matches++;
        teamObj.TotalScore += match.TotalAwayScore;
        teamObj.TotalAgainstScore += match.TotalHomeScore;
        teamObj.TotalAgainstScorePerMatch = +teamObj.TotalAgainstScore / teamObj.Matches;
        teamObj.TotalScorePerMatch = teamObj.TotalScore / teamObj.Matches;
        TeamsArray[_index] = teamObj;
      }
    });
    return TeamsArray;
  }

}
