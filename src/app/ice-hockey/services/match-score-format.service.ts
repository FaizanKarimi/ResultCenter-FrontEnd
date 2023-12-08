import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { IceHockeyMatch } from "../../BusinessModel/IceHockey/IceHockeyMatch";
import { IceHockeyMatchScores } from "../../BusinessModel/IceHockey/IceHockeyMatchScores";
import { IceHockeyMatchStatusEnum } from "../../BusinessModel/IceHockey/IceHockeyMatchStatusEnum.enum";

@Injectable()
export class MatchScoreFormatService {
  constructor() {

  }

  getFormattedMatchSocres(matchList: IceHockeyMatch[]) {
    _.map(matchList, (match) => {
      let firstPeriod = _.filter(match.IceHockeyMatchScores, function (ms) { return ms.ScoreInfoTypeId == IceHockeyMatchStatusEnum.FIRST_PERIOD }).length;
      let secondPeriod = _.filter(match.IceHockeyMatchScores, function (ms) { return ms.ScoreInfoTypeId == IceHockeyMatchStatusEnum.SECOND_PERIOD }).length;
      let thirdPeriod = _.filter(match.IceHockeyMatchScores, function (ms) { return ms.ScoreInfoTypeId == IceHockeyMatchStatusEnum.THIRD_PERIOD }).length;
      if (firstPeriod == 0) {
        let _matchScoreObj = new IceHockeyMatchScores();
        _matchScoreObj = {
          AwayScore: "-",
          HomeScore: "-",
          ScoreInfoTypeId: IceHockeyMatchStatusEnum.FIRST_PERIOD
        };

        //Inserting score at 0 index to keep order same
        match.IceHockeyMatchScores.splice(0, 0, _matchScoreObj);
      }

      if (secondPeriod == 0) {
        let _matchScoreObj = new IceHockeyMatchScores();
        _matchScoreObj = {
          AwayScore: "-",
          HomeScore: "-",
          ScoreInfoTypeId: IceHockeyMatchStatusEnum.SECOND_PERIOD
        };

        //Inserting score at 0 index to keep order same
        match.IceHockeyMatchScores.splice(1, 0, _matchScoreObj);
      }

      if (thirdPeriod == 0) {
        let _matchScoreObj = new IceHockeyMatchScores();
        _matchScoreObj = {
          AwayScore: "-",
          HomeScore: "-",
          ScoreInfoTypeId: IceHockeyMatchStatusEnum.THIRD_PERIOD
        };

        //Inserting score at 0 index to keep order same
        match.IceHockeyMatchScores.splice(2, 0, _matchScoreObj);
      }
    });

    return matchList;
  }

}