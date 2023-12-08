import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { MatchResultsStats } from "../../BusinessModel/IceHockey/MatchResultsStats";
import { IceHockeyStats } from "../../BusinessModel/IceHockey/IceHockeyStats";
import { GoalsPerMatchStats } from "../../BusinessModel/IceHockey/GoalsPerMatchStats";
import { FirstPeriodGoalsPerMatchStats } from "../../BusinessModel/IceHockey/FirstPeriodGoalsPerMatchStats";
import { BothTeamsOver2Stats } from "../../BusinessModel/IceHockey/BothTeamsOver2";
import { IceHockeyStatsByTeams } from "../../BusinessModel/IceHockey/IceHockeyStatsByTeams";
import { AdditionalInfoStats } from "../../BusinessModel/IceHockey/AdditionalInfoStats";
import { TeamForStats } from "../../BusinessModel/IceHockey/TeamForStats";

@Injectable()
export class StatsCalculationService {

  IceHockeyStatsObj: IceHockeyStats;
  TeamsArray: IceHockeyStatsByTeams[];

  constructor() {
    this.IceHockeyStatsObj = new IceHockeyStats();
    this.TeamsArray = new Array<IceHockeyStatsByTeams>();
  }

  setIntance(rawData: any) {
    this.TeamsArray = this._getTeamsArray(rawData);
    this.IceHockeyStatsObj.SeasonName = rawData[0].SeasonName + ' Season';
    this.IceHockeyStatsObj.MatchResults = this._getMatchResult(rawData);
    this.IceHockeyStatsObj.GoalsPerMatch = this._getGoalPerMatch(rawData);
    this.IceHockeyStatsObj.FirstPeriodGoalsPerMatch = this._getFirstPeriodTotalGoals(rawData);
    this.IceHockeyStatsObj.BothTeamsOver2 = this._getBothTeamScore2OrMore(rawData);
    this.IceHockeyStatsObj.AdditionalInfo = this._getAdditionalInfo(rawData);
  }

  getInstance(): any {    
    return this.IceHockeyStatsObj;
  }

  private _getMatchResult(matches: Array<any>) {

    let _totalMatches = matches.length;
    let _homeWinners = _.filter(matches, function (m) { return m.HomeTeamWin; }).length;
    let _awayWinners = _.filter(matches, function (m) { return m.AwayTeamWin; }).length;
    let _homeWinnerPercentage = Math.floor((_homeWinners / _totalMatches) * 100);
    let _awayWinnerPercentage = Math.floor((_awayWinners / _totalMatches) * 100);
    let _drawPercentage = 100 - (_homeWinnerPercentage + _awayWinnerPercentage)

    const _matchResults: MatchResultsStats = {
      homeWinnerPercentage: _homeWinnerPercentage,
      awayWinnerPercentage: _awayWinnerPercentage,
      drawPercentage: _drawPercentage
    };
    return _matchResults;
  }

  private _getGoalPerMatch(matches: Array<any>) {
    let _totalMatches = matches.length;
    let _sumTotalHomeGoals = _.sumBy(matches, 'TotalHomeScore');
    let _totalHomeGoalsPerMatch = _sumTotalHomeGoals / _totalMatches;
    let _sumTotalAwayGoals = _.sumBy(matches, 'TotalAwayScore');
    let _totalAwayGoalsPermatch = _sumTotalAwayGoals / _totalMatches;
    let _sumTotalGoals = _.sumBy(matches, 'TotalGoals');
    let _totalGoalsPerMatch = _sumTotalGoals / _totalMatches;
    let _over4 = _.filter(matches, function (m) { return m.TotalGoals > 4.5 }).length;
    let _over4Percentage = Math.floor((_over4 / _totalMatches) * 100);
    let _over5 = _.filter(matches, function (m) { return m.TotalGoals > 5.5 }).length;
    let _over5Percentage = Math.floor((_over5 / _totalMatches) * 100);
    let _over6 = _.filter(matches, function (m) { return m.TotalGoals > 6.5 }).length;
    let _over6Percentage = Math.floor((_over6 / _totalMatches) * 100);

    //finding Highest and Lowest teams
    let _highestGoalPerMatch = _.maxBy(this.TeamsArray, 'TotalGoalsPerMatch');
    let _lowestGoalPerMatch = _.minBy(this.TeamsArray, 'TotalGoalsPerMatch');

    const _goalsPerMatchStats: GoalsPerMatchStats =
      {
        totalGoalsPerMatch: _totalGoalsPerMatch,
        totalHomeGoalsPerMatch: _totalHomeGoalsPerMatch,
        totalAwayGoalsPerMatch: _totalAwayGoalsPermatch,
        over4Percentage: _over4Percentage,
        over5Percentage: _over5Percentage,
        over6Percentage: _over6Percentage,
        highestGoalPerMatchTeamName: _highestGoalPerMatch.TeamName,
        highestGoalPerMatchGoals: _highestGoalPerMatch.TotalGoalsPerMatch,
        lowestGoalPerMatchTeamName: _lowestGoalPerMatch.TeamName,
        lowestGoalPerMatchGoals: _lowestGoalPerMatch.TotalGoalsPerMatch
      };
    return _goalsPerMatchStats;
  }

  private _getFirstPeriodTotalGoals(matches: Array<any>) {
    let _totalMatches = matches.length;
    let _overPoint5 = _.filter(matches, function (m) { return m.TotalFirstPeriodGoals > 0.5 }).length;
    let _overPoint5Percentage = Math.floor((_overPoint5 / _totalMatches) * 100);
    let _overOnePoint5 = _.filter(matches, function (m) { return m.TotalFirstPeriodGoals > 1.5 }).length;
    let _overOnePoint5Percentage = Math.floor((_overOnePoint5 / _totalMatches) * 100);
    let _overTwoPoint5 = _.filter(matches, function (m) { return m.TotalFirstPeriodGoals > 2.5 }).length;
    let _overTwoPoint5Percentage = Math.floor((_overTwoPoint5 / _totalMatches) * 100);

    //finding Highest and Lowest teams
    let _highestFPGoalPerMatch = _.maxBy(this.TeamsArray, 'FirstPeriodGoalsPerMatch');
    let _lowestFPGoalPerMatch = _.minBy(this.TeamsArray, 'FirstPeriodGoalsPerMatch');

    const _firstPeriodGoalsPerMatchStats: FirstPeriodGoalsPerMatchStats =
      {
        overPoint5Percentage: _overPoint5Percentage,
        overOnePoint5Percentage: _overOnePoint5Percentage,
        overTwoPoint5Percentage: _overTwoPoint5Percentage,
        highestFPGoalPerMatchTeamName: _highestFPGoalPerMatch.TeamName,
        highestFPGoalPerMatchGoals: _highestFPGoalPerMatch.FirstPeriodGoalsPerMatch,
        lowestFPGoalPerMatchTeamName: _lowestFPGoalPerMatch.TeamName,
        lowestFPGoalPerMatchGoals: _lowestFPGoalPerMatch.FirstPeriodGoalsPerMatch
      };
    return _firstPeriodGoalsPerMatchStats;
  }

  private _getBothTeamScore2OrMore(matches: Array<any>) {
    let _totalMatches = matches.length;

    let _filteredMatches = _.filter(matches, function (m) {
      return m.TotalHomeScore >= 2 && m.TotalAwayScore >= 2
    }).length;
    
    let _bothTeamOver2Percentage = Math.floor((_filteredMatches / _totalMatches) * 100);

    //Sorting the array to get highest 3 values    
    let _sortedTeamArray = _.orderBy(this.TeamsArray, 'BothTeamsMore2Percentage', 'desc');

    //Getting Top 3 Objects of Sorted Array
    let _top3Objects = _.take(_sortedTeamArray, 3);

    //Getting Last Object of Teams Array;
    let _lowestTeam = _.last(_sortedTeamArray);

    const _bothTeamsOver2Stats: BothTeamsOver2Stats =
      {
        bothTeamOver2Percentage: _bothTeamOver2Percentage,
        top3Teams: _top3Objects,
        lowestTeam: _lowestTeam
      };
    return _bothTeamsOver2Stats
  }

  private _getAdditionalInfo(matches: Array<any>) {
    let _additionalInfo: AdditionalInfoStats = new AdditionalInfoStats();
    let _totalMatches = matches.length;

    //Sorting Array to get Highest and Lowest Goals Per Match 
    const _sortedTeamArrayForGoalPerMatch = _.orderBy(this.TeamsArray, 'TotalGoalsPerMatch', 'desc');

    //Getting Top 2 Teams 
    const _topTeamsOfGoalPerMatch = _.take(_sortedTeamArrayForGoalPerMatch, 2);

    //Getting Least 2 Teams 
    const _leastTeamsOfGoalPerMatch = _.takeRight(_sortedTeamArrayForGoalPerMatch, 2);

    //Sorting Array to get Highest and Lowest Goals against Per Match
    const _sortedTeamArrayForGoalAgainstPerMatch = _.orderBy(this.TeamsArray, 'TotalAgainstGoalsPerMatch', 'desc');
    const _topTeamsOfGoalAgainstPerMatch = _.take(_sortedTeamArrayForGoalAgainstPerMatch, 2);
    const _leastTeamsOfGoalAgainstPerMatch = _.takeRight(_sortedTeamArrayForGoalAgainstPerMatch, 2);

    //Assigning values for highest team of goal for Game
    _.map(_topTeamsOfGoalPerMatch, function (team) {
      let _team: TeamForStats = {
        TeamName: team.TeamName,
        TeamStats: team.TotalGoalsPerMatch
      };
      _additionalInfo.GoalsForGamesHighestTeams.push(_team);
    });

    //Assigning values for fewest team of goal for Game
    _.map(_leastTeamsOfGoalPerMatch, function (team) {
      let _team: TeamForStats = {
        TeamName: team.TeamName,
        TeamStats: team.TotalGoalsPerMatch
      };
      _additionalInfo.GoalsForGamesFewestTeams.push(_team);
    });

    //Assigning values for highest team of goal Against Game
    _.map(_topTeamsOfGoalAgainstPerMatch, function (team) {
      let _team: TeamForStats = {
        TeamName: team.TeamName,
        TeamStats: team.TotalAgainstGoalsPerMatch
      };
      _additionalInfo.GoalsAgainstGamesHighestTeams.push(_team);
    });

    //Assigning values for fewest team of goal Against Game
    _.map(_leastTeamsOfGoalAgainstPerMatch, function (team) {
      let _team: TeamForStats = {
        TeamName: team.TeamName,
        TeamStats: team.TotalAgainstGoalsPerMatch
      };
      _additionalInfo.GoalsAgainstGamesFewestTeams.push(_team);
    });

    return _additionalInfo;
  }

  //Method to get Teams Array
  private _getTeamsArray(matches: Array<any>) {
    let TeamsArray: IceHockeyStatsByTeams[] = new Array<IceHockeyStatsByTeams>();

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
        let teamObj: IceHockeyStatsByTeams = new IceHockeyStatsByTeams();
        teamObj.TeamId = match.HomeTeamId;
        teamObj.TeamName = match.HomeTeamName;
        teamObj.TotalGoals = match.TotalHomeScore;
        teamObj.TotalAgainstGoals = match.TotalAwayScore;
        teamObj.FirstPeriodGoals = +match.FirstPeriodScoreHome;
        teamObj.Matches = 1;
        teamObj.TotalAgainstGoalsPerMatch = match.TotalAwayScore
        teamObj.FirstPeriodGoalsPerMatch = +match.FirstPeriodScoreHome;
        teamObj.TotalGoalsPerMatch = match.TotalHomeScore;
        teamObj.BothTeamsMore2 = match.TotalHomeScore >= 2 && match.TotalAwayScore >= 2 ? 1 : 0;
        teamObj.BothTeamsMore2Percentage = teamObj.BothTeamsMore2 * 100;
        TeamsArray.push(teamObj);
      }

      //If Home Team is already in Teams Array then Update its value
      else if (_homeTeamIndex > -1) {
        let _index = _homeTeamIndex;
        TeamsArray[_index].Matches++;
        TeamsArray[_index].FirstPeriodGoals += +match.FirstPeriodScoreHome;
        TeamsArray[_index].TotalGoals += match.TotalHomeScore;
        TeamsArray[_index].TotalAgainstGoals += match.TotalAwayScore;
        TeamsArray[_index].TotalAgainstGoalsPerMatch = +TeamsArray[_index].TotalAgainstGoals / TeamsArray[_index].Matches;
        TeamsArray[_index].FirstPeriodGoalsPerMatch = +TeamsArray[_index].FirstPeriodGoals / TeamsArray[_index].Matches;
        TeamsArray[_index].TotalGoalsPerMatch = TeamsArray[_index].TotalGoals / TeamsArray[_index].Matches;
        TeamsArray[_index].BothTeamsMore2 = match.TotalHomeScore >= 2 && match.TotalAwayScore >= 2 ? TeamsArray[_index].BothTeamsMore2 + 1 : TeamsArray[_index].BothTeamsMore2;
        TeamsArray[_index].BothTeamsMore2Percentage = (TeamsArray[_index].BothTeamsMore2 / TeamsArray[_index].Matches) * 100;
      }

      //If Away Team is not in Teams Array then push it
      if (_awayTeamIndex == -1) {
        let teamObj: IceHockeyStatsByTeams = new IceHockeyStatsByTeams();
        teamObj.TeamId = match.AwayTeamId;
        teamObj.TeamName = match.AwayTeamName;
        teamObj.TotalGoals = match.TotalAwayScore;
        teamObj.TotalAgainstGoals = match.TotalHomeScore;
        teamObj.TotalAgainstGoalsPerMatch = match.TotalAwayScore;
        teamObj.FirstPeriodGoals = +match.FirstPeriodScoreAway;
        teamObj.FirstPeriodGoalsPerMatch = +match.FirstPeriodScoreAway;
        teamObj.Matches = 1;
        teamObj.BothTeamsMore2 = match.TotalHomeScore >= 2 && match.TotalAwayScore >= 2 ? 1 : 0;
        teamObj.BothTeamsMore2Percentage = teamObj.BothTeamsMore2 * 100;
        teamObj.TotalGoalsPerMatch = match.TotalAwayScore;
        TeamsArray.push(teamObj);
      }

      //If Home Team is already in Teams Array then update its values
      else if (_awayTeamIndex > -1) {
        let _index = _awayTeamIndex;
        TeamsArray[_index].Matches++;
        TeamsArray[_index].FirstPeriodGoals += +match.FirstPeriodScoreAway;
        TeamsArray[_index].TotalGoals += match.TotalAwayScore;
        TeamsArray[_index].TotalAgainstGoals += match.TotalHomeScore;
        TeamsArray[_index].TotalAgainstGoalsPerMatch = +TeamsArray[_index].TotalAgainstGoals / TeamsArray[_index].Matches;
        TeamsArray[_index].FirstPeriodGoalsPerMatch = +TeamsArray[_index].FirstPeriodGoals / TeamsArray[_index].Matches;
        TeamsArray[_index].TotalGoalsPerMatch = TeamsArray[_index].TotalGoals / TeamsArray[_index].Matches;
        TeamsArray[_index].BothTeamsMore2 = match.TotalHomeScore >= 2 && match.TotalAwayScore >= 2 ? TeamsArray[_index].BothTeamsMore2 + 1 : TeamsArray[_index].BothTeamsMore2;
        TeamsArray[_index].BothTeamsMore2Percentage = (TeamsArray[_index].BothTeamsMore2 / TeamsArray[_index].Matches) * 100;
      }
    });
    return TeamsArray;
  }
}